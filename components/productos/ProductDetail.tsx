// src/components/productos/ProductDetail.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ProductGallery } from "@/components/productos/ProductGallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
    Star,
    ShoppingCart,
    Heart,
    Share2,
    Minus,
    Plus,
    Truck,
    ShieldCheck,
    Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Producto } from "@/lib/types/product.types";
import { useCart } from "@/components/providers/CartProvider";

interface TiendaInfo {
    id: string;
    nombre: string;
    logo?: string;
}

interface ProductDetailProps {
    producto: Producto;
    tienda?: TiendaInfo;
    className?: string;
}

export function ProductDetail({ producto, tienda, className }: ProductDetailProps) {
    const [cantidad, setCantidad] = useState(1);
    const [isLiked, setIsLiked] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const { agregarItem } = useCart();

    const precioActual = producto.precioOferta ?? producto.precio;
    const tieneDescuento = !!producto.precioOferta;
    const descuento = tieneDescuento
        ? Math.round(((producto.precio - producto.precioOferta!) / producto.precio) * 100)
        : 0;
    const agotado = producto.stock === 0;

    const decrementar = () => setCantidad((c) => Math.max(1, c - 1));
    const incrementar = () => setCantidad((c) => Math.min(producto.stock || 1, c + 1));

    const handleAgregarCarrito = () => {
        if (agotado) return;
        agregarItem(
            {
                productoId: producto.id,
                tiendaId: producto.tiendaId,
                tiendaNombre: tienda?.nombre,
                nombre: producto.nombre,
                slug: producto.slug,
                precio: producto.precio,
                precioOferta: producto.precioOferta,
                imagen: producto.imagenes[0],
                stock: producto.stock,
            },
            cantidad
        );
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleCompartir = async () => {
        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share({ title: producto.nombre, url: window.location.href });
            } catch {
                // el usuario canceló el share, no hacemos nada
            }
        }
    };

    return (
        <div className={cn("grid gap-8 lg:grid-cols-2", className)}>
            <ProductGallery imagenes={producto.imagenes} nombre={producto.nombre} />

            <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                    {producto.esNuevo && <Badge className="bg-green-500">✨ Nuevo</Badge>}
                    {producto.esDestacado && <Badge className="bg-amber-500">⭐ Destacado</Badge>}
                    {tieneDescuento && <Badge className="bg-red-500">-{descuento}%</Badge>}
                    <Badge variant="outline" className="capitalize">{producto.categoria}</Badge>
                </div>

                <div>
                    <h1 className="text-2xl md:text-3xl font-bold leading-tight">{producto.nombre}</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-sm">{producto.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                            ({producto.totalReviews} reseñas)
                        </span>
                    </div>
                </div>

                {tienda && (
                    <Link
                        href={`/tienda/${tienda.id}`}
                        className="flex items-center gap-2 w-fit rounded-full border pl-1 pr-3 py-1 hover:bg-muted transition-colors"
                    >
                        <Avatar size="sm">
                            <AvatarImage src={tienda.logo} alt={tienda.nombre} />
                            <AvatarFallback>{tienda.nombre.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium flex items-center gap-1">
                            <Store className="h-3.5 w-3.5 text-muted-foreground" />
                            {tienda.nombre}
                        </span>
                    </Link>
                )}

                <Separator />

                <div className="flex items-end gap-3">
                    <span className="text-3xl font-bold">${precioActual.toLocaleString()}</span>
                    {tieneDescuento && (
                        <span className="text-lg text-muted-foreground line-through mb-0.5">
                            ${producto.precio.toLocaleString()}
                        </span>
                    )}
                </div>

                <p className="text-muted-foreground leading-relaxed">{producto.descripcion}</p>

                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Truck className="h-4 w-4" />
                        {producto.tieneEnvioGratis ? (
                            <span className="text-green-600 font-medium">Envío gratis</span>
                        ) : (
                            <span>Costo de envío calculado en el checkout</span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Compra protegida por PortalTiendas</span>
                    </div>
                </div>

                <div>
                    {agotado ? (
                        <Badge variant="destructive">Producto agotado</Badge>
                    ) : producto.stock < 10 ? (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                            ¡Últimas {producto.stock} unidades!
                        </Badge>
                    ) : (
                        <span className="text-sm text-green-600">En stock ({producto.stock} disponibles)</span>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                    <div className="flex items-center rounded-md border">
                        <Button variant="ghost" size="icon" onClick={decrementar} disabled={agotado || cantidad <= 1}>
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-10 text-center text-sm font-medium">{cantidad}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={incrementar}
                            disabled={agotado || cantidad >= producto.stock}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    <Button size="lg" className="gap-2 flex-1 min-w-40" disabled={agotado} onClick={handleAgregarCarrito}>
                        <ShoppingCart className="h-4 w-4" />
                        {agotado ? "Agotado" : addedToCart ? "¡Agregado!" : "Agregar al carrito"}
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        aria-label="Agregar a favoritos"
                        onClick={() => setIsLiked((v) => !v)}
                    >
                        <Heart className={cn("h-4 w-4", isLiked && "fill-red-500 text-red-500")} />
                    </Button>

                    <Button variant="outline" size="icon" aria-label="Compartir" onClick={handleCompartir}>
                        <Share2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
