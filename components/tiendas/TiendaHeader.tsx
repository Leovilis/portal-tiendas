// src/components/tiendas/TiendaHeader.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, Heart, MessageCircle, Share2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface TiendaHeaderProps {
    tiendaId: string;
    nombre: string;
    logo?: string;
    portada?: string;
    descripcion?: string;
    categoria: string;
    ubicacion: string;
    rating: number;
    totalReviews: number;
    esOficial?: boolean;
    esVerificada?: boolean;
    tiempoRespuesta?: string;
    className?: string;
    /** Si el visitante está logueado y no es el dueño: puede seguir la tienda. */
    puedeSeguir: boolean;
    siguiendoInicial: boolean;
    totalSeguidores: number;
    /** Se muestra el botón "Contactar" solo si hay una sección de contacto en la página (compradores). */
    mostrarContactar?: boolean;
}

export function TiendaHeader({
    tiendaId,
    nombre,
    logo,
    portada,
    descripcion,
    categoria,
    ubicacion,
    rating,
    totalReviews,
    esOficial = false,
    esVerificada = false,
    tiempoRespuesta = "responde en minutos",
    className,
    puedeSeguir,
    siguiendoInicial,
    totalSeguidores,
    mostrarContactar = false,
}: TiendaHeaderProps) {
    const router = useRouter();
    const [siguiendo, setSiguiendo] = useState(siguiendoInicial);
    const [seguidores, setSeguidores] = useState(totalSeguidores);
    const [cargando, setCargando] = useState(false);

    const handleCompartir = async () => {
        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share({ title: nombre, url: window.location.href });
            } catch {
                // cancelado por el usuario
            }
        }
    };

    const handleSeguir = async () => {
        if (!puedeSeguir) {
            router.push(`/login?next=${encodeURIComponent(`/tienda/${tiendaId}`)}`);
            return;
        }

        setCargando(true);
        const supabase = createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            router.push(`/login?next=${encodeURIComponent(`/tienda/${tiendaId}`)}`);
            setCargando(false);
            return;
        }

        if (siguiendo) {
            const { error } = await supabase
                .from("tienda_seguidores")
                .delete()
                .eq("tiendaId", tiendaId)
                .eq("usuarioId", user.id);
            if (!error) {
                setSiguiendo(false);
                setSeguidores((n) => Math.max(0, n - 1));
            }
        } else {
            const { error } = await supabase
                .from("tienda_seguidores")
                .insert({ tiendaId, usuarioId: user.id });
            if (!error) {
                setSiguiendo(true);
                setSeguidores((n) => n + 1);
            }
        }
        setCargando(false);
    };

    return (
        <div className={cn("rounded-xl overflow-hidden border bg-card", className)}>
            <div className="relative h-40 sm:h-56 bg-gradient-to-r from-primary/20 to-primary/5">
                {portada && (
                    <Image src={portada} alt={`Portada de ${nombre}`} fill className="object-cover" priority />
                )}
                <div className="absolute inset-0 bg-black/20" />
            </div>

            <div className="px-5 sm:px-8 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10 sm:-mt-12">
                    <div className="flex items-end gap-4">
                        <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-background shadow-md">
                            <AvatarImage src={logo} alt={nombre} />
                            <AvatarFallback className="bg-primary text-white text-2xl">
                                {nombre.charAt(0)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="pb-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-xl sm:text-2xl font-bold">{nombre}</h1>
                                {esOficial && (
                                    <Badge className="bg-blue-500 text-white">✓ Oficial</Badge>
                                )}
                                {esVerificada && (
                                    <Badge variant="secondary" className="bg-green-500 text-white">✓ Verificada</Badge>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {categoria}
                                {seguidores > 0 && (
                                    <span> · {seguidores} {seguidores === 1 ? "seguidor" : "seguidores"}</span>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant={siguiendo ? "secondary" : "default"}
                            className="gap-2"
                            onClick={handleSeguir}
                            disabled={cargando}
                        >
                            {cargando ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Heart className={cn("h-4 w-4", siguiendo && "fill-current")} />
                            )}
                            {siguiendo ? "Siguiendo" : "Seguir"}
                        </Button>
                        {mostrarContactar && (
                            <Link href="#contacto">
                                <Button variant="outline" className="gap-2">
                                    <MessageCircle className="h-4 w-4" />
                                    Contactar
                                </Button>
                            </Link>
                        )}
                        <Button variant="outline" size="icon" aria-label="Compartir tienda" onClick={handleCompartir}>
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {descripcion && (
                    <p className="mt-4 text-sm text-muted-foreground max-w-2xl leading-relaxed">{descripcion}</p>
                )}

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-sm">
                    <div className="flex items-center gap-1.5">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{rating}</span>
                        <span className="text-muted-foreground">({totalReviews} reseñas)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{ubicacion}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{tiempoRespuesta}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
