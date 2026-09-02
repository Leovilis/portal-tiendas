// src/components/tiendas/TiendaVendedorResumen.tsx
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, PackageX, ClipboardList, TrendingUp, ArrowRight } from "lucide-react";

const ESTADO_COLOR: Record<string, string> = {
    PENDIENTE: "bg-orange-100 text-orange-700 border-orange-200",
    CONFIRMADO: "bg-blue-100 text-blue-700 border-blue-200",
    PREPARANDO: "bg-blue-100 text-blue-700 border-blue-200",
    ENVIADO: "bg-purple-100 text-purple-700 border-purple-200",
    ENTREGADO: "bg-green-100 text-green-700 border-green-200",
    CANCELADO: "bg-red-100 text-red-700 border-red-200",
    DEVUELTO: "bg-red-100 text-red-700 border-red-200",
};

interface PedidoReciente {
    id: string;
    comprador: string;
    fecha: Date;
    estado: string;
    total: number;
}

interface TiendaVendedorResumenProps {
    tiendaId: string;
    ventasTotales: number;
    pedidosPendientes: number;
    pedidosTotales: number;
    productosSinStock: number;
    recientes: PedidoReciente[];
}

export function TiendaVendedorResumen({
    tiendaId,
    ventasTotales,
    pedidosPendientes,
    pedidosTotales,
    productosSinStock,
    recientes,
}: TiendaVendedorResumenProps) {
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Resumen de vendedor</h2>
                <Link href={`/tienda/${tiendaId}/panel`}>
                    <Button variant="outline" size="sm" className="gap-2">
                        Ir al panel completo
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <TrendingUp className="h-8 w-8 text-primary" />
                        <div>
                            <p className="text-2xl font-bold">{ventasTotales.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Ventas totales</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <Clock className="h-8 w-8 text-orange-500" />
                        <div>
                            <p className="text-2xl font-bold">{pedidosPendientes}</p>
                            <p className="text-xs text-muted-foreground">Pedidos pendientes</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <ClipboardList className="h-8 w-8 text-primary" />
                        <div>
                            <p className="text-2xl font-bold">{pedidosTotales}</p>
                            <p className="text-xs text-muted-foreground">Pedidos totales</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <PackageX className="h-8 w-8 text-destructive" />
                        <div>
                            <p className="text-2xl font-bold">{productosSinStock}</p>
                            <p className="text-xs text-muted-foreground">Sin stock</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground">Últimos pedidos</h3>
                {recientes.length === 0 ? (
                    <Card>
                        <CardContent className="p-6 text-center text-sm text-muted-foreground">
                            Todavía no recibiste pedidos.
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="p-0 divide-y">
                            {recientes.map((pedido) => (
                                <div key={pedido.id} className="flex items-center justify-between gap-4 p-4">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium truncate">{pedido.comprador}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {pedido.fecha.toLocaleDateString("es-ES", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <Badge variant="outline" className={ESTADO_COLOR[pedido.estado] ?? ""}>
                                            {pedido.estado}
                                        </Badge>
                                        <span className="text-sm font-semibold">${pedido.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
