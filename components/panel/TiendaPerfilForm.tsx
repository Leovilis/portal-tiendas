// src/components/panel/TiendaPerfilForm.tsx
"use client";

import { useRef, useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Loader2, X } from "lucide-react";
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

interface TiendaPerfilFormProps {
    tienda: {
        id: string;
        nombre: string;
        descripcion: string | null;
        categoria: string;
        ubicacion: string | null;
        telefono: string | null;
        email: string | null;
        sitioWeb: string | null;
        logo: string | null;
        portada: string | null;
        tiempoRespuesta: string;
    };
}

export function TiendaPerfilForm({ tienda }: TiendaPerfilFormProps) {
    const router = useRouter();
    const logoInputRef = useRef<HTMLInputElement>(null);
    const portadaInputRef = useRef<HTMLInputElement>(null);

    const [nombre, setNombre] = useState(tienda.nombre);
    const [descripcion, setDescripcion] = useState(tienda.descripcion ?? "");
    const [categoria, setCategoria] = useState(tienda.categoria);
    const [ubicacion, setUbicacion] = useState(tienda.ubicacion ?? "");
    const [telefono, setTelefono] = useState(tienda.telefono ?? "");
    const [email, setEmail] = useState(tienda.email ?? "");
    const [sitioWeb, setSitioWeb] = useState(tienda.sitioWeb ?? "");
    const [tiempoRespuesta, setTiempoRespuesta] = useState(tienda.tiempoRespuesta);

    const [logoUrl, setLogoUrl] = useState(tienda.logo);
    const [logoArchivo, setLogoArchivo] = useState<File | null>(null);
    const [portadaUrl, setPortadaUrl] = useState(tienda.portada);
    const [portadaArchivo, setPortadaArchivo] = useState<File | null>(null);

    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const subirImagen = async (archivo: File, prefijo: "logo" | "portada") => {
        const supabase = createClient();
        const extension = archivo.name.split(".").pop() ?? "jpg";
        const ruta = `${tienda.id}/perfil/${prefijo}-${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage
            .from("productos")
            .upload(ruta, archivo, { upsert: false });

        if (uploadError) {
            throw new Error(`No se pudo subir ${prefijo === "logo" ? "el logo" : "la portada"}: ${uploadError.message}`);
        }

        const { data } = supabase.storage.from("productos").getPublicUrl(ruta);
        return data.publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!nombre || !categoria) {
            setError("Completá al menos el nombre y la categoría.");
            return;
        }

        setGuardando(true);
        const supabase = createClient();

        try {
            let logoFinal = logoUrl;
            if (logoArchivo) {
                logoFinal = await subirImagen(logoArchivo, "logo");
            }
            let portadaFinal = portadaUrl;
            if (portadaArchivo) {
                portadaFinal = await subirImagen(portadaArchivo, "portada");
            }

            const { error: updateError } = await supabase
                .from("tiendas")
                .update({
                    nombre,
                    slug: slugify(nombre),
                    descripcion: descripcion || null,
                    categoria,
                    ubicacion: ubicacion || null,
                    telefono: telefono || null,
                    email: email || null,
                    sitioWeb: sitioWeb || null,
                    logo: logoFinal,
                    portada: portadaFinal,
                    tiempoRespuesta,
                    updatedAt: new Date().toISOString(),
                })
                .eq("id", tienda.id);

            if (updateError) {
                setError(updateError.message);
                setGuardando(false);
                return;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ocurrió un error al guardar.");
            setGuardando(false);
            return;
        }

        router.push(`/tienda/${tienda.id}/panel`);
        router.refresh();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="rounded-md bg-destructive/10 text-destructive text-sm p-3">{error}</div>}

            <Card>
                <CardContent className="p-5 space-y-4">
                    <h2 className="font-semibold">Logo y portada</h2>
                    <div className="flex flex-wrap items-start gap-8">
                        <div className="space-y-2">
                            <Label>Logo</Label>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-20 w-20 border">
                                    <AvatarImage src={logoArchivo ? URL.createObjectURL(logoArchivo) : logoUrl ?? undefined} alt={nombre} />
                                    <AvatarFallback className="bg-primary text-white text-xl">
                                        {nombre.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col gap-1.5">
                                    <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => logoInputRef.current?.click()}>
                                        <Upload className="h-3.5 w-3.5" />
                                        {logoUrl || logoArchivo ? "Cambiar" : "Subir"}
                                    </Button>
                                    {(logoUrl || logoArchivo) && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="gap-2 text-destructive hover:text-destructive"
                                            onClick={() => {
                                                setLogoUrl(null);
                                                setLogoArchivo(null);
                                            }}
                                        >
                                            <X className="h-3.5 w-3.5" />
                                            Quitar
                                        </Button>
                                    )}
                                </div>
                                <input
                                    ref={logoInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const archivo = e.target.files?.[0];
                                        if (archivo) setLogoArchivo(archivo);
                                        e.target.value = "";
                                    }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 flex-1 min-w-[240px]">
                            <Label>Portada</Label>
                            <div className="relative h-28 w-full rounded-md overflow-hidden border bg-muted">
                                {(portadaArchivo || portadaUrl) && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={portadaArchivo ? URL.createObjectURL(portadaArchivo) : portadaUrl ?? undefined}
                                        alt="Portada de la tienda"
                                        className="h-full w-full object-cover"
                                    />
                                )}
                                <div className="absolute bottom-2 right-2 flex gap-2">
                                    <Button type="button" variant="secondary" size="sm" className="gap-2" onClick={() => portadaInputRef.current?.click()}>
                                        <Upload className="h-3.5 w-3.5" />
                                        {portadaUrl || portadaArchivo ? "Cambiar" : "Subir"}
                                    </Button>
                                    {(portadaUrl || portadaArchivo) && (
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            className="gap-2 text-destructive hover:text-destructive"
                                            onClick={() => {
                                                setPortadaUrl(null);
                                                setPortadaArchivo(null);
                                            }}
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <input
                                ref={portadaInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const archivo = e.target.files?.[0];
                                    if (archivo) setPortadaArchivo(archivo);
                                    e.target.value = "";
                                }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-5 space-y-4">
                    <h2 className="font-semibold">Información de la tienda</h2>
                    <div className="space-y-1.5">
                        <Label htmlFor="nombre">Nombre de la tienda</Label>
                        <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="descripcion">Descripción</Label>
                        <textarea
                            id="descripcion"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            rows={4}
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
                            <Input id="ubicacion" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} placeholder="Ciudad, Provincia" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-5 space-y-4">
                    <h2 className="font-semibold">Contacto</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="telefono">Teléfono</Label>
                            <Input id="telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email</Label>
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
                <Button type="submit" size="lg" disabled={guardando} className="gap-2">
                    {guardando && <Loader2 className="h-4 w-4 animate-spin" />}
                    Guardar cambios
                </Button>
            </div>
        </form>
    );
}
