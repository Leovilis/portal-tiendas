// src/app/carrito/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag, Store, ArrowRight } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { createClient } from "@/lib/supabase/client";

interface TiendaInfo {
    nombre: string;
    logo: string | null;
}

export default function CarritoPage() {
    const { items, subtotal, actualizarCantidad, quitarItem, hidratado } = useCart();
    const [tiendas, setTiendas] = useState<Record<string, TiendaInfo>>({});

    const tiendaIds = useMemo(() => Array.from(new Set(items.map((i) => i.tiendaId))), [items]);

    useEffect(() => {
        if (tiendaIds.length === 0) return;
        const supabase = createClient();
        supabase
            .from("tiendas")
            .select("id, nombre, logo")
            .in("id", tiendaIds)
            .then(({ data }) => {
                const mapa: Record<string, TiendaInfo> = {};
                for (const t of data ?? []) {
                    mapa[t.id] = { nombre: t.nombre, logo: t.logo };
                }
                setTiendas(mapa);
            });
    }, [tiendaIds]);

    const grupos = useMemo(() => {
        const mapa = new Map<string, typeof items>();
        for (const item of items) {
            const lista = mapa.get(item.tiendaId) ?? [];
            lista.push(item);
            mapa.set(item.tiendaId, lista);
        }
        return Array.from(mapa.entries());
    }, [items]);

    if (!hidratado) {
        return <div className="container mx-auto px-4 py-16" />;
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h1 className="text-2xl font-bold mb-2">Tu carrito está vacío</h1>
                <p className="text-muted-foreground mb-6">
                    Explorá tiendas y agregá productos para verlos acá.
                </p>
                <Link href="/tiendas">
                    <Button>Explorar tiendas</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Tu carrito</h1>

            <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
                <div className="space-y-6">
                    {grupos.map(([tiendaId, itemsTienda]) => {
                        const tienda = tiendas[tiendaId];
                        const subtotalTienda = itemsTienda.reduce(
                            (acc, i) => acc + (i.precioOferta ?? i.precio) * i.cantidad,
                            0
                        );
                        return (
                            <Card key={tiendaId}>
                                <CardContent className="p-5 space-y-4">
                                    <Link
                                        href={`/tienda/${tiendaId}`}
                                        className="flex items-center gap-2 font-semibold hover:text-primary transition-colors w-fit"
                                    >
                                        <Store className="h-4 w-4" />
                                        {tienda?.nombre ?? itemsTienda[0].tiendaNombre ?? "Tienda"}
                                    </Link>

                                    <Separator />

                                    <div className="space-y-4">
                                        {itemsTienda.map((item) => {
                                            const precio = item.precioOferta ?? item.precio;
                                            return (
                                                <div key={item.productoId} className="flex gap-3">
                                                    <Link
                                                        href={`/producto/${item.productoId}`}
                                                        className="relative h-20 w-20 shrink-0 rounded-md overflow-hidden bg-muted"
                                                    >
                                                        {item.imagen && (
                                                            <Image
                                                                src={item.imagen}
                                                                alt={item.nombre}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        )}
                                                    </Link>

                                                    <div className="flex-1 min-w-0">
                                                        <Link
                                                            href={`/producto/${item.productoId}`}
                                                            className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors"
                                                        >
                                                            {item.nombre}
                                                        </Link>
                                                        <p className="text-sm font-semibold mt-1">
                                                            ${precio.toLocaleString()}
                                                        </p>

                                                        <div className="flex items-center gap-3 mt-2">
                                                            <div className="flex items-center rounded-md border">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-7 w-7"
                                                                    onClick={() =>
                                                                        actualizarCantidad(item.productoId, item.cantidad - 1)
                                                                    }
                                                                >
                                                                    <Minus className="h-3 w-3" />
                                                                </Button>
                                                                <span className="w-8 text-center text-xs font-medium">
                                                                    {item.cantidad}
                                                                </span>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-7 w-7"
                                                                    disabled={item.cantidad >= item.stock}
                                                                    onClick={() =>
                                                                        actualizarCantidad(item.productoId, item.cantidad + 1)
                                                                    }
                                                                >
                                                                    <Plus className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                            <button
                                                                onClick={() => quitarItem(item.productoId)}
                                                                className="text-muted-foreground hover:text-destructive transition-colors"
                                                                aria-label="Quitar del carrito"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between text-sm font-medium">
                                        <span>Subtotal {tienda?.nombre ?? ""}</span>
                                        <span>${subtotalTienda.toLocaleString()}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div>
                    <Card className="sticky top-24">
                        <CardContent className="p-5 space-y-4">
                            <h2 className="font-bold text-lg">Resumen</h2>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Envío</span>
                                <span>Se calcula al confirmar</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${subtotal.toLocaleString()}</span>
                            </div>
                            <Link href="/checkout">
                                <Button size="lg" className="w-full gap-2">
                                    Confirmar pedido
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                            {grupos.length > 1 && (
                                <p className="text-xs text-muted-foreground text-center">
                                    Se van a crear {grupos.length} pedidos, uno por cada tienda.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
