// src/app/(dashboard)/tienda/[tiendaId]/panel/page.tsx
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Pencil, Package, ClipboardList, Store, CreditCard } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { EliminarProductoBoton } from "@/components/panel/EliminarProductoBoton";
import { EstadoPedidoSelect } from "@/components/panel/EstadoPedidoSelect";

interface PanelPageProps {
    params: Promise<{ tiendaId: string }>;
}

const ESTADO_COLOR: Record<string, string> = {
    PENDIENTE: "bg-orange-100 text-orange-700 border-orange-200",
    CONFIRMADO: "bg-blue-100 text-blue-700 border-blue-200",
    PREPARANDO: "bg-blue-100 text-blue-700 border-blue-200",
    ENVIADO: "bg-purple-100 text-purple-700 border-purple-200",
    ENTREGADO: "bg-green-100 text-green-700 border-green-200",
    CANCELADO: "bg-red-100 text-red-700 border-red-200",
    DEVUELTO: "bg-red-100 text-red-700 border-red-200",
};

export default async function PanelVendedorPage({ params }: PanelPageProps) {
    const { tiendaId } = await params;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/login?next=${encodeURIComponent(`/tienda/${tiendaId}/panel`)}`);
    }

    const { data: perfil } = await supabase
        .from("users")
        .select("tiendaId, role")
        .eq("id", user.id)
        .maybeSingle();

    if (!perfil || perfil.role !== "VENDEDOR" || perfil.tiendaId !== tiendaId) {
        redirect(`/tienda/${tiendaId}`);
    }

    const [{ data: tienda }, { data: productos }, { data: pedidos }] = await Promise.all([
        supabase.from("tiendas").select("nombre").eq("id", tiendaId).maybeSingle(),
        supabase
            .from("productos")
            .select("*")
            .eq("tiendaId", tiendaId)
            .order("createdAt", { ascending: false }),
        supabase
            .from("pedidos")
            .select("*, users(name, email), pedido_productos(*, productos(nombre))")
            .eq("tiendaId", tiendaId)
            .order("createdAt", { ascending: false }),
    ]);

    return (
        <div className="container mx-auto px-4 py-8 space-y-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Panel de vendedor</h1>
                    <p className="text-muted-foreground">{tienda?.nombre}</p>
                </div>
                <div className="flex gap-2">
                    <Link href={`/tienda/${tiendaId}/panel/pagos`}>
                        <Button variant="outline" className="gap-2">
                            <CreditCard className="h-4 w-4" />
                            Cobros
                        </Button>
                    </Link>
                    <Link href={`/tienda/${tiendaId}/panel/perfil`}>
                        <Button variant="outline" className="gap-2">
                            <Store className="h-4 w-4" />
                            Editar perfil de la tienda
                        </Button>
                    </Link>
                </div>
            </div>

            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Productos ({productos?.length ?? 0})
                    </h2>
                    <Link href={`/tienda/${tiendaId}/panel/productos/nuevo`}>
                        <Button size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Nuevo producto
                        </Button>
                    </Link>
                </div>

                {!productos || productos.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center text-muted-foreground">
                            Todavía no cargaste ningún producto real.
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="p-0 divide-y">
                            {productos.map((producto) => (
                                <div key={producto.id} className="flex items-center gap-4 p-4">
                                    <div className="relative h-14 w-14 shrink-0 rounded-md overflow-hidden bg-muted">
                                        {producto.imagenes?.[0] && (
                                            <Image
                                                src={producto.imagenes[0]}
                                                alt={producto.nombre}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm line-clamp-1">{producto.nombre}</p>
                                        <p className="text-xs text-muted-foreground">
                                            ${producto.precio.toLocaleString()}
                                            {producto.precioOferta ? ` · oferta $${producto.precioOferta.toLocaleString()}` : ""}
                                            {" · "}
                                            {producto.stock} en stock
                                        </p>
                                    </div>
                                    {producto.stock === 0 && (
                                        <Badge variant="destructive" className="text-xs">Sin stock</Badge>
                                    )}
                                    <Link href={`/tienda/${tiendaId}/panel/productos/${producto.id}/editar`}>
                                        <Button variant="ghost" size="icon" aria-label={`Editar ${producto.nombre}`}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <EliminarProductoBoton productoId={producto.id} nombre={producto.nombre} />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    Pedidos recibidos ({pedidos?.length ?? 0})
                </h2>

                {!pedidos || pedidos.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center text-muted-foreground">
                            Todavía no recibiste pedidos reales.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {pedidos.map((pedido) => {
                            const comprador = Array.isArray(pedido.users) ? pedido.users[0] : pedido.users;
                            const items = pedido.pedido_productos ?? [];
                            const direccion = pedido.direccion as { calle?: string; ciudad?: string } | null;
                            return (
                                <Card key={pedido.id}>
                                    <CardContent className="p-5 space-y-3">
                                        <div className="flex items-center justify-between flex-wrap gap-3">
                                            <div>
                                                <p className="font-semibold text-sm">
                                                    {comprador?.name ?? comprador?.email ?? "Comprador"}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(pedido.createdAt).toLocaleDateString("es-ES", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                    {" · "}
                                                    {pedido.metodoPago}
                                                    {direccion?.calle ? ` · ${direccion.calle}, ${direccion.ciudad ?? ""}` : ""}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className={ESTADO_COLOR[pedido.estado] ?? ""}>
                                                    {pedido.estado}
                                                </Badge>
                                                <EstadoPedidoSelect pedidoId={pedido.id} estadoActual={pedido.estado} />
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="space-y-1 text-sm">
                                            {items.map((item: { id: string; cantidad: number; precioUnitario: number; productos: { nombre: string } | { nombre: string }[] | null }) => {
                                                const producto = Array.isArray(item.productos) ? item.productos[0] : item.productos;
                                                return (
                                                    <div key={item.id} className="flex justify-between text-muted-foreground">
                                                        <span>{item.cantidad}x {producto?.nombre ?? "Producto"}</span>
                                                        <span>${(item.cantidad * item.precioUnitario).toLocaleString()}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="flex justify-between font-bold text-sm pt-1">
                                            <span>Total</span>
                                            <span>${pedido.total.toLocaleString()}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
