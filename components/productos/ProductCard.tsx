// src/components/productos/ProductCard.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Eye, Heart, Check, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Producto } from "@/lib/types/product.types";
import { useCart } from "@/components/providers/CartProvider";

interface ProductCardProps {
    producto: Producto;
    variant?: "default" | "compact" | "horizontal";
    showTienda?: boolean;
    className?: string;
}

export function ProductCard({
    producto,
    variant = "default",
    showTienda = false,
    className
}: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [agregado, setAgregado] = useState(false);
    const { agregarItem } = useCart();

    const handleComprar = (e: React.MouseEvent) => {
        e.preventDefault();
        if (producto.stock === 0) return;
        agregarItem({
            productoId: producto.id,
            tiendaId: producto.tiendaId,
            nombre: producto.nombre,
            slug: producto.slug,
            precio: producto.precio,
            precioOferta: producto.precioOferta,
            imagen: producto.imagenes[0],
            stock: producto.stock,
        });
        setAgregado(true);
        setTimeout(() => setAgregado(false), 1500);
    };

    const precioActual = producto.precioOferta || producto.precio;
    const tieneDescuento = !!producto.precioOferta;
    const descuento = tieneDescuento
        ? Math.round(((producto.precio - producto.precioOferta!) / producto.precio) * 100)
        : 0;

    // Variante horizontal
    if (variant === "horizontal") {
        return (
            <Card className={cn("overflow-hidden hover:shadow-lg transition-all", className)}>
                <div className="flex">
                    <div className="relative w-32 h-32 flex-shrink-0 bg-muted">
                        {producto.imagenes[0] ? (
                            <Image
                                src={producto.imagenes[0]}
                                alt={producto.nombre}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                <ImageOff className="h-6 w-6" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 p-4">
                        <Link href={`/producto/${producto.id}`}>
                            <h3 className="font-semibold hover:text-primary transition-colors line-clamp-2">
                                {producto.nombre}
                            </h3>
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm ml-1">{producto.rating}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                ({producto.totalReviews})
                            </span>
                        </div>
                        <div className="mt-2">
                            <span className="text-lg font-bold">${precioActual.toLocaleString()}</span>
                            {tieneDescuento && (
                                <>
                                    <span className="text-sm text-muted-foreground line-through ml-2">
                                        ${producto.precio.toLocaleString()}
                                    </span>
                                    <Badge variant="destructive" className="ml-2 text-xs">
                                        -{descuento}%
                                    </Badge>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    // Variante compact
    if (variant === "compact") {
        return (
            <Link href={`/producto/${producto.id}`}>
                <div className={cn("group cursor-pointer", className)}>
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                        {producto.imagenes[0] ? (
                            <Image
                                src={producto.imagenes[0]}
                                alt={producto.nombre}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                <ImageOff className="h-6 w-6" />
                            </div>
                        )}
                        {producto.esNuevo && (
                            <Badge className="absolute top-2 left-2 bg-green-500">Nuevo</Badge>
                        )}
                        {tieneDescuento && (
                            <Badge className="absolute top-2 right-2 bg-red-500">-{descuento}%</Badge>
                        )}
                    </div>
                    <div className="mt-2">
                        <h3 className="font-medium text-sm line-clamp-2">{producto.nombre}</h3>
                        <div className="flex items-center gap-1 mt-1">
                            <span className="font-bold">${precioActual.toLocaleString()}</span>
                            {tieneDescuento && (
                                <span className="text-xs text-muted-foreground line-through">
                                    ${producto.precio.toLocaleString()}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    // Variante default (completa)
    return (
        <Card
            className={cn(
                "group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Imagen */}
            <div className="relative aspect-square overflow-hidden bg-muted">
                {producto.imagenes[0] ? (
                    <Image
                        src={producto.imagenes[0]}
                        alt={producto.nombre}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <ImageOff className="h-8 w-8" />
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {producto.esNuevo && (
                        <Badge className="bg-green-500">✨ Nuevo</Badge>
                    )}
                    {producto.esDestacado && (
                        <Badge className="bg-amber-500">⭐ Destacado</Badge>
                    )}
                </div>

                {tieneDescuento && (
                    <Badge className="absolute top-2 right-2 bg-red-500">
                        -{descuento}%
                    </Badge>
                )}

                {/* Overlay con acciones */}
                <div className={cn(
                    "absolute inset-0 bg-black/50 flex items-center justify-center gap-2 transition-opacity duration-300",
                    isHovered ? "opacity-100" : "opacity-0"
                )}>
                    <Button
                        size="sm"
                        variant="secondary"
                        className="gap-1"
                        disabled={producto.stock === 0}
                        onClick={handleComprar}
                    >
                        {agregado ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                        {agregado ? "¡Agregado!" : "Comprar"}
                    </Button>
                    <Button size="sm" variant="secondary">
                        <Eye className="h-4 w-4" />
                    </Button>
                </div>

                {/* Botón favorito */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-2 right-2 bg-background/80 hover:bg-background rounded-full"
                    onClick={(e) => {
                        e.preventDefault();
                        setIsLiked(!isLiked);
                    }}
                >
                    <Heart className={cn("h-4 w-4", isLiked && "fill-red-500 text-red-500")} />
                </Button>
            </div>

            {/* Información */}
            <CardContent className="p-4">
                <Link href={`/producto/${producto.id}`}>
                    <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors min-h-[3rem]">
                        {producto.nombre}
                    </h3>
                </Link>

                <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium ml-1">{producto.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                        ({producto.totalReviews})
                    </span>
                    {producto.tieneEnvioGratis && (
                        <Badge variant="outline" className="text-green-600 text-xs border-green-600">
                            Envío gratis
                        </Badge>
                    )}
                </div>

                {showTienda && (
                    <p className="text-xs text-muted-foreground mt-1">
                        Por: {producto.tiendaId}
                    </p>
                )}
            </CardContent>

            <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <div>
                    <span className="text-xl font-bold">${precioActual.toLocaleString()}</span>
                    {tieneDescuento && (
                        <span className="text-sm text-muted-foreground line-through ml-2">
                            ${producto.precio.toLocaleString()}
                        </span>
                    )}
                </div>
                {producto.stock === 0 && (
                    <Badge variant="destructive" className="text-xs">
                        Agotado
                    </Badge>
                )}
                {producto.stock > 0 && producto.stock < 10 && (
                    <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                        ¡Últimas {producto.stock}!
                    </Badge>
                )}
            </CardFooter>
        </Card>
    );
}