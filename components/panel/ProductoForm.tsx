// src/components/panel/ProductoForm.tsx
"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { X, Upload, Loader2, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIAS } from "@/lib/constants";
import type { Producto } from "@/lib/types/product.types";

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

interface ProductoFormProps {
    tiendaId: string;
    productoExistente?: Producto;
}

export function ProductoForm({ tiendaId, productoExistente }: ProductoFormProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const esEdicion = !!productoExistente;

    const [nombre, setNombre] = useState(productoExistente?.nombre ?? "");
    const [descripcion, setDescripcion] = useState(productoExistente?.descripcion ?? "");
    const [precio, setPrecio] = useState(productoExistente?.precio?.toString() ?? "");
    const [precioOferta, setPrecioOferta] = useState(productoExistente?.precioOferta?.toString() ?? "");
    const [categoria, setCategoria] = useState(productoExistente?.categoria ?? CATEGORIAS[0].id);
    const [subcategoria, setSubcategoria] = useState(productoExistente?.subcategoria ?? "");
    const [stock, setStock] = useState(productoExistente?.stock?.toString() ?? "1");
    const [esNuevo, setEsNuevo] = useState(productoExistente?.esNuevo ?? false);
    const [esDestacado, setEsDestacado] = useState(productoExistente?.esDestacado ?? false);
    const [tieneEnvioGratis, setTieneEnvioGratis] = useState(productoExistente?.tieneEnvioGratis ?? false);

    const [imagenesExistentes, setImagenesExistentes] = useState<string[]>(productoExistente?.imagenes ?? []);
    const [archivosNuevos, setArchivosNuevos] = useState<File[]>([]);

    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const quitarImagenExistente = (url: string) => {
        setImagenesExistentes((prev) => prev.filter((u) => u !== url));
    };

    const quitarArchivoNuevo = (index: number) => {
        setArchivosNuevos((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!nombre || !descripcion || !precio || !categoria) {
            setError("Completá nombre, descripción, precio y categoría.");
            return;
        }

        const precioNum = Number(precio);
        const precioOfertaNum = precioOferta ? Number(precioOferta) : null;
        const stockNum = Number(stock);

        if (Number.isNaN(precioNum) || precioNum <= 0) {
            setError("El precio tiene que ser un número mayor a 0.");
            return;
        }
        if (precioOfertaNum !== null && (Number.isNaN(precioOfertaNum) || precioOfertaNum >= precioNum)) {
            setError("El precio de oferta tiene que ser menor al precio normal.");
            return;
        }
        if (Number.isNaN(stockNum) || stockNum < 0) {
            setError("El stock tiene que ser un número igual o mayor a 0.");
            return;
        }

        setGuardando(true);
        const supabase = createClient();

        // 1) Subir imágenes nuevas al bucket "productos", bajo {tiendaId}/...
        const urlsSubidas: string[] = [];
        for (const archivo of archivosNuevos) {
            const extension = archivo.name.split(".").pop() ?? "jpg";
            const ruta = `${tiendaId}/${crypto.randomUUID()}.${extension}`;
            const { error: uploadError } = await supabase.storage
                .from("productos")
                .upload(ruta, archivo, { upsert: false });

            if (uploadError) {
                setError(`No se pudo subir una imagen: ${uploadError.message}`);
                setGuardando(false);
                return;
            }

            const { data: urlData } = supabase.storage.from("productos").getPublicUrl(ruta);
            urlsSubidas.push(urlData.publicUrl);
        }

        const imagenesFinal = [...imagenesExistentes, ...urlsSubidas];
        const ahora = new Date().toISOString();

        if (esEdicion && productoExistente) {
            const { error: updateError } = await supabase
                .from("productos")
                .update({
                    nombre,
                    slug: slugify(nombre),
                    descripcion,
                    precio: precioNum,
                    precioOferta: precioOfertaNum,
                    imagenes: imagenesFinal,
                    categoria,
                    subcategoria: subcategoria || null,
                    stock: stockNum,
                    esNuevo,
                    esDestacado,
                    tieneEnvioGratis,
                    updatedAt: ahora,
                })
                .eq("id", productoExistente.id);

            if (updateError) {
                setError(updateError.message);
                setGuardando(false);
                return;
            }
        } else {
            const { error: insertError } = await supabase.from("productos").insert({
                id: crypto.randomUUID(),
                tiendaId,
                nombre,
                slug: slugify(nombre),
                descripcion,
                precio: precioNum,
                precioOferta: precioOfertaNum,
                imagenes: imagenesFinal,
                categoria,
                subcategoria: subcategoria || null,
                stock: stockNum,
                rating: 0,
                totalReviews: 0,
                esNuevo,
                esDestacado,
                tieneEnvioGratis,
                updatedAt: ahora,
            });

            if (insertError) {
                setError(insertError.message);
                setGuardando(false);
                return;
            }
        }

        router.push(`/tienda/${tiendaId}/panel`);
        router.refresh();
    };

    const handleEliminar = async () => {
        if (!productoExistente) return;
        if (!window.confirm(`¿Eliminar "${productoExistente.nombre}"? Esta acción no se puede deshacer.`)) {
            return;
        }
        setGuardando(true);
        const supabase = createClient();
        const { error: deleteError } = await supabase.from("productos").delete().eq("id", productoExistente.id);
        if (deleteError) {
            setError(deleteError.message);
            setGuardando(false);
            return;
        }
        router.push(`/tienda/${tiendaId}/panel`);
        router.refresh();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="rounded-md bg-destructive/10 text-destructive text-sm p-3">{error}</div>}

            <Card>
                <CardContent className="p-5 space-y-4">
                    <h2 className="font-semibold">Información básica</h2>
                    <div className="space-y-1.5">
                        <Label htmlFor="nombre">Nombre del producto</Label>
                        <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="descripcion">Descripción</Label>
                        <textarea
                            id="descripcion"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            rows={4}
                            required
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
                                        <SelectItem key={c.id} value={c.id}>
                                            {c.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="subcategoria">Subcategoría (opcional)</Label>
                            <Input id="subcategoria" value={subcategoria} onChange={(e) => setSubcategoria(e.target.value)} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-5 space-y-4">
                    <h2 className="font-semibold">Precio y stock</h2>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="precio">Precio</Label>
                            <Input id="precio" type="number" min="0" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="precioOferta">Precio de oferta (opcional)</Label>
                            <Input id="precioOferta" type="number" min="0" step="0.01" value={precioOferta} onChange={(e) => setPrecioOferta(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="stock">Stock</Label>
                            <Input id="stock" type="number" min="0" step="1" value={stock} onChange={(e) => setStock(e.target.value)} required />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6 pt-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="esNuevo" checked={esNuevo} onCheckedChange={(c) => setEsNuevo(!!c)} />
                            <Label htmlFor="esNuevo" className="font-normal cursor-pointer">Marcar como nuevo</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="esDestacado" checked={esDestacado} onCheckedChange={(c) => setEsDestacado(!!c)} />
                            <Label htmlFor="esDestacado" className="font-normal cursor-pointer">Destacar producto</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="tieneEnvioGratis" checked={tieneEnvioGratis} onCheckedChange={(c) => setTieneEnvioGratis(!!c)} />
                            <Label htmlFor="tieneEnvioGratis" className="font-normal cursor-pointer">Envío gratis</Label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-5 space-y-4">
                    <h2 className="font-semibold">Fotos</h2>
                    <div className="flex flex-wrap gap-3">
                        {imagenesExistentes.map((url) => (
                            <div key={url} className="relative h-24 w-24 rounded-md overflow-hidden border group">
                                <Image src={url} alt="Foto del producto" fill className="object-cover" />
                                <button
                                    type="button"
                                    onClick={() => quitarImagenExistente(url)}
                                    className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="Quitar foto"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                        {archivosNuevos.map((archivo, i) => (
                            <div key={i} className="relative h-24 w-24 rounded-md overflow-hidden border group">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={URL.createObjectURL(archivo)}
                                    alt={archivo.name}
                                    className="h-full w-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => quitarArchivoNuevo(i)}
                                    className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="Quitar foto"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="h-24 w-24 rounded-md border-2 border-dashed flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                        >
                            <Upload className="h-5 w-5" />
                            <span className="text-xs">Subir</span>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                                const nuevos = Array.from(e.target.files ?? []);
                                setArchivosNuevos((prev) => [...prev, ...nuevos]);
                                e.target.value = "";
                            }}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center gap-3">
                <Button type="submit" size="lg" disabled={guardando} className="gap-2">
                    {guardando && <Loader2 className="h-4 w-4 animate-spin" />}
                    {esEdicion ? "Guardar cambios" : "Publicar producto"}
                </Button>
                {esEdicion && (
                    <Button
                        type="button"
                        variant="outline"
                        className="gap-2 text-destructive hover:text-destructive"
                        disabled={guardando}
                        onClick={handleEliminar}
                    >
                        <Trash2 className="h-4 w-4" />
                        Eliminar producto
                    </Button>
                )}
            </div>
        </form>
    );
}
