// src/app/pedidos/page.tsx
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, PackageSearch, Store } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PagarPedidoBoton } from "@/components/panel/PagarPedidoBoton";
import { VerificarPagoAlVolver } from "@/components/panel/VerificarPagoAlVolver";

export const metadata = {
    title: "Mis pedidos - PortalTiendas",
};

const ESTADO_LABEL: Record<string, string> = {
    PENDIENTE: "Pendiente",
    CONFIRMADO: "Confirmado",
    PREPARANDO: "Preparando",
    ENVIADO: "Enviado",
    ENTREGADO: "Entregado",
    CANCELADO: "Cancelado",
    DEVUELTO: "Devuelto",
};

const ESTADO_COLOR: Record<string, string> = {
    PENDIENTE: "bg-orange-100 text-orange-700 border-orange-200",
    CONFIRMADO: "bg-blue-100 text-blue-700 border-blue-200",
    PREPARANDO: "bg-blue-100 text-blue-700 border-blue-200",
    ENVIADO: "bg-purple-100 text-purple-700 border-purple-200",
    ENTREGADO: "bg-green-100 text-green-700 border-green-200",
    CANCELADO: "bg-red-100 text-red-700 border-red-200",
    DEVUELTO: "bg-red-100 text-red-700 border-red-200",
};

interface PedidosPageProps {
    searchParams: Promise<{ confirmado?: string; pedido?: string; mp?: "success" | "pending" | "failure" }>;
}

export default async function PedidosPage({ searchParams }: PedidosPageProps) {
    const { confirmado, pedido: pedidoVolviendo, mp } = await searchParams;
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login?next=/pedidos");
    }

    const { data: pedidos } = await supabase
        .from("pedidos")
        .select("*, tiendas(nombre, logo), pedido_productos(*, productos(nombre, imagenes))")
        .eq("usuarioId", user.id)
        .order("createdAt", { ascending: false });

    // Para cada tienda involucrada, ¿tiene el cobro con MercadoPago activado?
    // (función pública, no expone el token — ver migración 0008).
    const tiendaIds = Array.from(new Set((pedidos ?? []).map((p) => p.tiendaId)));
    const aceptaPagos: Record<string, boolean> = {};
    await Promise.all(
        tiendaIds.map(async (id) => {
            const { data } = await supabase.rpc("tienda_acepta_pagos", { p_tienda_id: id });
            aceptaPagos[id] = !!data;
        })
    );

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-3xl font-bold mb-2">Mis pedidos</h1>
            <p className="text-muted-foreground mb-6">Pedidos reales confirmados en PortalTiendas</p>

            {pedidoVolviendo && mp && <VerificarPagoAlVolver pedidoId={pedidoVolviendo} resultado={mp} />}

            {confirmado === "1" && (
                <div className="flex items-center gap-2 rounded-md bg-green-50 text-green-700 text-sm p-3 mb-6 dark:bg-green-950/40 dark:text-green-400">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    ¡Pedido confirmado! Revisá cada tienda: algunas te dejan pagar online acá mismo, con
                    otras vas a coordinar el pago directamente.
                </div>
            )}

            {!pedidos || pedidos.length === 0 ? (
                <div className="text-center py-16">
                    <PackageSearch className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Todavía no hiciste ningún pedido</h2>
                    <p className="text-muted-foreground mb-6">
                        Cuando confirmes una compra, la vas a ver acá.
                    </p>
                    <Link href="/tiendas" className="text-primary font-medium hover:underline">
                        Explorar tiendas
                    </Link>
                </div>
            ) : (
                <div className="space-y-5">
                    {pedidos.map((pedido) => {
                        const tienda = Array.isArray(pedido.tiendas) ? pedido.tiendas[0] : pedido.tiendas;
                        const items = pedido.pedido_productos ?? [];
                        return (
                            <Card key={pedido.id}>
                                <CardContent className="p-5 space-y-4">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <div className="flex items-center gap-2 font-semibold">
                                            <Store className="h-4 w-4 text-muted-foreground" />
                                            {tienda?.nombre ?? "Tienda"}
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={ESTADO_COLOR[pedido.estado] ?? ""}
                                        >
                                            {ESTADO_LABEL[pedido.estado] ?? pedido.estado}
                                        </Badge>
                                    </div>

                                    <div className="space-y-2">
                                        {items.map((item: { id: string; cantidad: number; precioUnitario: number; productos: { nombre: string; imagenes: string[] | null } | { nombre: string; imagenes: string[] | null }[] | null }) => {
                                            const producto = Array.isArray(item.productos) ? item.productos[0] : item.productos;
                                            return (
                                                <div key={item.id} className="flex items-center gap-3">
                                                    <div className="relative h-12 w-12 shrink-0 rounded-md overflow-hidden bg-muted">
                                                        {producto?.imagenes?.[0] && (
                                                            <Image
                                                                src={producto.imagenes[0]}
                                                                alt={producto.nombre}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 text-sm">
                                                        <p className="line-clamp-1">{producto?.nombre ?? "Producto"}</p>
                                                        <p className="text-muted-foreground">
                                                            {item.cantidad} x ${item.precioUnitario.toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t text-sm gap-3">
                                        <span className="text-muted-foreground">
                                            {new Date(pedido.createdAt).toLocaleDateString("es-ES", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                            {" · "}
                                            {pedido.metodoPago}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold">${pedido.total.toLocaleString()}</span>
                                            {pedido.pagado ? (
                                                <Badge className="gap-1 bg-green-600 hover:bg-green-600">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Pagado
                                                </Badge>
                                            ) : aceptaPagos[pedido.tiendaId] ? (
                                                <PagarPedidoBoton pedidoId={pedido.id} />
                                            ) : (
                                                <span className="text-xs text-muted-foreground">
                                                    Pago a coordinar con la tienda
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
