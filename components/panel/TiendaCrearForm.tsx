// src/components/panel/TiendaCrearForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Store } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIAS } from "@/lib/constants";

function slugify(texto: string) {
    return texto
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

export function TiendaCrearForm() {
    const router = useRouter();

    const [nombre, setNombre] = useState("");
    const [categoria, setCategoria] = useState(CATEGORIAS[0]?.nombre ?? "");
    const [descripcion, setDescripcion] = useState("");
    const [ubicacion, setUbicacion] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const [sitioWeb, setSitioWeb] = useState("");
    const [tiempoRespuesta, setTiempoRespuesta] = useState("Responde en minutos");

    const [creando, setCreando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!nombre.trim() || !categoria) {
            setError("Completá al menos el nombre y la categoría.");
            return;
        }

        setCreando(true);
        const supabase = createClient();

        const { data: tiendaId, error: rpcError } = await supabase.rpc("crear_tienda_propia", {
            p_nombre: nombre.trim(),
            p_slug: slugify(nombre),
            p_categoria: categoria,
            p_descripcion: descripcion || null,
            p_ubicacion: ubicacion || null,
            p_telefono: telefono || null,
            p_email: email || null,
            p_sitio_web: sitioWeb || null,
            p_tiempo_respuesta: tiempoRespuesta,
        });

        if (rpcError) {
            setError(rpcError.message);
            setCreando(false);
            return;
        }

        router.push(`/tienda/${tiendaId as string}/panel`);
        router.refresh();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="rounded-md bg-destructive/10 text-destructive text-sm p-3">{error}</div>}

            <Card>
                <CardContent className="p-5 space-y-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Store className="h-4 w-4" />
                        <h2 className="font-semibold text-foreground">Información de la tienda</h2>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="nombre">Nombre de la tienda</Label>
                        <Input
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej: Zapatería El Buen Paso"
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="descripcion">Descripción</Label>
                        <textarea
                            id="descripcion"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            rows={4}
                            placeholder="Contales a tus clientes qué vendés y qué te hace diferente."
                            className="w-full rounded-md border border-input bg-input/20 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                        />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="categoria">Categoría</Label>
                            <Select value={categoria} onValueChange={setCategoria}>
                                <SelectTrigger id="categoria">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIAS.map((c) => (
                                        <SelectItem key={c.id} value={c.nombre}>
                                            {c.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="ubicacion">Ubicación</Label>
                            <Input
                                id="ubicacion"
                                value={ubicacion}
                                onChange={(e) => setUbicacion(e.target.value)}
                                placeholder="Ciudad, Provincia"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-5 space-y-4">
                    <h2 className="font-semibold">Contacto</h2>
                    <p className="text-xs text-muted-foreground -mt-2">
                        Estos datos son opcionales y podés completarlos ahora o después desde el panel.
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="telefono">Teléfono</Label>
                            <Input id="telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email de contacto</Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="sitioWeb">Sitio web (opcional)</Label>
                            <Input id="sitioWeb" value={sitioWeb} onChange={(e) => setSitioWeb(e.target.value)} placeholder="https://" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="tiempoRespuesta">Tiempo de respuesta</Label>
                            <Select value={tiempoRespuesta} onValueChange={setTiempoRespuesta}>
                                <SelectTrigger id="tiempoRespuesta">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Responde en minutos">Responde en minutos</SelectItem>
                                    <SelectItem value="Responde en 1 hora">Responde en 1 hora</SelectItem>
                                    <SelectItem value="Responde en el día">Responde en el día</SelectItem>
                                    <SelectItem value="Responde en 1-2 días">Responde en 1-2 días</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center gap-3">
                <Button type="submit" size="lg" disabled={creando} className="gap-2">
                    {creando && <Loader2 className="h-4 w-4 animate-spin" />}
                    Crear mi tienda
                </Button>
            </div>
        </form>
    );
}
