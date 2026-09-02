// src/components/productos/ProductReviews.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Star, BadgeCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { calcularResumenResenas } from "@/lib/mock-data";
import type { Resena } from "@/lib/types/product.types";
import { createClient } from "@/lib/supabase/client";

interface ProductReviewsProps {
    productoId: string;
    tiendaId: string;
    resenas: Resena[];
    /** true si el usuario logueado compró este producto y todavía no lo reseñó. */
    puedeResenar: boolean;
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

export function ProductReviews({ productoId, tiendaId, resenas, puedeResenar, className }: ProductReviewsProps) {
    const router = useRouter();
    const [nuevoRating, setNuevoRating] = useState(5);
    const [comentario, setComentario] = useState("");
    const [open, setOpen] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const resumen = calcularResumenResenas(resenas);

    const enviarResena = async () => {
        setError(null);
        setEnviando(true);
        const supabase = createClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            setError("Debés iniciar sesión para dejar una reseña.");
            setEnviando(false);
            return;
        }

        const { error: insertError } = await supabase.from("reviews").insert({
            id: crypto.randomUUID(),
            productoId,
            tiendaId,
            usuarioId: user.id,
            rating: nuevoRating,
            comentario: comentario.trim() || null,
            updatedAt: new Date().toISOString(),
        });

        setEnviando(false);

        if (insertError) {
            setError(insertError.message);
            return;
        }

        setOpen(false);
        setComentario("");
        setNuevoRating(5);
        router.refresh();
    };

    return (
        <div className={cn("space-y-6", className)}>
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Reseñas de clientes</h2>
                {puedeResenar && (
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">Escribir reseña</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Escribe tu reseña</DialogTitle>
                                <DialogDescription>
                                    Contale a otros compradores qué te pareció este producto. Solo podés
                                    reseñar productos que ya compraste.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-3">
                                <Label>Tu valoración</Label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <button key={n} type="button" onClick={() => setNuevoRating(n)}>
                                            <Star
                                                className={cn(
                                                    "h-6 w-6 transition-colors",
                                                    n <= nuevoRating ? "fill-yellow-400 text-yellow-400" : "text-muted"
                                                )}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="comentario">Tu comentario (opcional)</Label>
                                    <textarea
                                        id="comentario"
                                        value={comentario}
                                        onChange={(e) => setComentario(e.target.value)}
                                        rows={3}
                                        placeholder="¿Qué te gustó o qué mejorarías?"
                                        className="w-full rounded-md border border-input bg-input/20 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                                    />
                                </div>
                                {error && (
                                    <div className="rounded-md bg-destructive/10 text-destructive text-sm p-3">
                                        {error}
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button onClick={enviarResena} disabled={enviando} className="gap-2">
                                    {enviando && <Loader2 className="h-4 w-4 animate-spin" />}
                                    Enviar reseña
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
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
                                    <div
                                        className="h-full bg-yellow-400"
                                        style={{ width: `${porcentaje}%` }}
                                    />
                                </div>
                                <span className="w-8 text-right text-muted-foreground">{cantidad}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-5">
                {resenas.length === 0 && (
                    <p className="text-sm text-muted-foreground">Todavía no hay reseñas para este producto.</p>
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
