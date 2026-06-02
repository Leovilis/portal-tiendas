// src/components/tiendas/TiendaCard.tsx
"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Clock, ShoppingBag, Heart } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// src/components/tiendas/TiendaCard.tsx
export interface TiendaCardProps {
    id: string;
    nombre: string;
    logo: string;
    portada?: string;
    categoria: string;
    ubicacion: string;
    rating: number;
    totalReviews?: number; // ✅ Ahora es opcional, con valor por defecto
    esOficial?: boolean;
    esVerificada?: boolean;
    tiempoRespuesta?: string;
    productosDestacados?: number;
    enOferta?: boolean;
    className?: string;
}

export function TiendaCard({
    id,
    nombre,
    logo,
    portada,
    categoria,
    ubicacion,
    rating,
    totalReviews = 0, // ✅ Valor por defecto
    esOficial = false,
    esVerificada = false,
    tiempoRespuesta = "responde en minutos",
    productosDestacados,
    enOferta = false,
    className,
}: TiendaCardProps) {

    return (
        <Card className={cn("group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1", className)}>
            <div className="relative h-24 bg-gradient-to-r from-primary/20 to-primary/5">
                {portada && (
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${portada})` }}
                    />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

                {enOferta && (
                    <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
                        🔥 Ofertas
                    </Badge>
                )}

                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 left-2 bg-white/80 hover:bg-white"
                >
                    <Heart className="h-4 w-4" />
                </Button>
            </div>

            <CardHeader className="pb-2 pt-0 relative">
                <div className="flex items-end justify-between -mt-8">
                    <Avatar className="h-16 w-16 border-4 border-background shadow-md">
                        <AvatarImage src={logo} alt={nombre} />
                        <AvatarFallback className="bg-primary text-white text-lg">
                            {nombre.charAt(0)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex gap-1">
                        {esOficial && (
                            <Badge variant="default" className="bg-blue-500 text-white">
                                ✓ Oficial
                            </Badge>
                        )}
                        {esVerificada && (
                            <Badge variant="secondary" className="bg-green-500 text-white">
                                ✓ Verificada
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                <div>
                    <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-primary transition-colors">
                        {nombre}
                    </h3>
                    <p className="text-sm text-muted-foreground">{categoria}</p>
                </div>

                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{ubicacion}</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-green-600 dark:text-green-400">{tiempoRespuesta}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{rating}</span>
                            <span className="text-muted-foreground text-xs">({totalReviews} reseñas)</span>
                        </div>

                        {productosDestacados && (
                            <Badge variant="outline" className="text-xs">
                                {productosDestacados} productos
                            </Badge>
                        )}
                    </div>
                </div>
            </CardContent>

            <CardFooter>
                <Link href={`/tienda/${id}`} className="w-full">
                    <Button className="w-full gap-2 group-hover:gap-3 transition-all">
                        Ver tienda
                        <ShoppingBag className="h-4 w-4" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}