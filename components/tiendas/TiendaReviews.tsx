// src/components/tiendas/TiendaReviews.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { calcularResumenResenas } from "@/lib/mock-data";
import type { Resena } from "@/lib/types/product.types";

interface TiendaReviewsProps {
    nombre: string;
    resenas: Resena[];
    className?: string;
}

function Estrellas({ rating, size = "h-4 w-4" }: { rating: number; size?: string }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
                <Star
                    key={n}
                    className={cn(size, n <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-muted")}
                />
            ))}
        </div>
    );
}

export function TiendaReviews({ nombre, resenas, className }: TiendaReviewsProps) {
    const resumen = calcularResumenResenas(resenas);

    return (
        <div className={cn("space-y-6", className)}>
            <div>
                <h2 className="text-xl font-bold">Reseñas de {nombre}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Es el promedio de las reseñas que dejaron los compradores en cada producto. Para
                    dejar la tuya, entrá al producto que compraste y calificalo ahí.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-[auto_1fr] items-start">
                <div className="text-center sm:w-40">
                    <p className="text-4xl font-bold">{resumen.promedio || "—"}</p>
                    <Estrellas rating={resumen.promedio} size="h-5 w-5" />
                    <p className="text-sm text-muted-foreground mt-1">{resumen.total} reseñas</p>
                </div>

                <div className="space-y-1.5 w-full">
                    {([5, 4, 3, 2, 1] as const).map((estrella) => {
                        const cantidad = resumen.distribucion[estrella];
                        const porcentaje = resumen.total > 0 ? (cantidad / resumen.total) * 100 : 0;
                        return (
                            <div key={estrella} className="flex items-center gap-2 text-sm">
                                <span className="w-3 text-muted-foreground">{estrella}</span>
                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                                    <div className="h-full bg-yellow-400" style={{ width: `${porcentaje}%` }} />
                                </div>
                                <span className="w-8 text-right text-muted-foreground">{cantidad}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-5">
                {resenas.length === 0 && (
                    <p className="text-sm text-muted-foreground">Todavía no hay reseñas para esta tienda.</p>
                )}
                {resenas.map((resena) => (
                    <div key={resena.id} className="border-b pb-5 last:border-b-0">
                        <div className="flex items-start gap-3">
                            <Avatar>
                                <AvatarImage src={resena.avatar} alt={resena.autor} />
                                <AvatarFallback>{resena.autor.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-medium text-sm">{resena.autor}</span>
                                    {resena.compraVerificada && (
                                        <Badge variant="outline" className="gap-1 text-green-600 border-green-600">
                                            <BadgeCheck className="h-3 w-3" />
                                            Compra verificada
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <Estrellas rating={resena.rating} />
                                    <span className="text-xs text-muted-foreground">
                                        {resena.fecha.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
                                    </span>
                                </div>
                                {resena.titulo && <p className="font-semibold text-sm mt-2">{resena.titulo}</p>}
                                <p className="text-sm text-muted-foreground mt-1">{resena.comentario}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
