// src/app/categorias/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
    ShoppingBag,
    Shirt,
    Smartphone,
    Home,
    Dumbbell,
    BookOpen,
    Puzzle,
    Sparkles,
    UtensilsCrossed,
    type LucideIcon,
} from "lucide-react";
import { ProductGrid } from "@/components/productos/ProductGrid";
import { CATEGORIAS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { Producto } from "@/lib/types/product.types";

const ICONOS_CATEGORIA: Record<string, LucideIcon> = {
    Shirt,
    Smartphone,
    Home,
    Dumbbell,
    BookOpen,
    Puzzle,
    Sparkles,
    UtensilsCrossed,
};

export default function CategoriasPage() {
    const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();
        supabase
            .from("productos")
            .select("*")
            .then(({ data }) => {
                const mapeados: Producto[] = (data ?? []).map((p) => ({
                    id: p.id,
                    tiendaId: p.tiendaId,
                    nombre: p.nombre,
                    slug: p.slug,
                    descripcion: p.descripcion,
                    precio: p.precio,
                    precioOferta: p.precioOferta ?? undefined,
                    imagenes: p.imagenes ?? [],
                    categoria: p.categoria,
                    subcategoria: p.subcategoria ?? undefined,
                    stock: p.stock,
                    rating: p.rating,
                    totalReviews: p.totalReviews,
                    esNuevo: p.esNuevo ?? undefined,
                    esDestacado: p.esDestacado ?? undefined,
                    tieneEnvioGratis: p.tieneEnvioGratis ?? undefined,
                    createdAt: new Date(p.createdAt),
                    updatedAt: new Date(p.updatedAt),
                }));
                setProductos(mapeados);
                setLoading(false);
            });
    }, []);

    const conteos = useMemo(() => {
        const mapa = new Map<string, number>();
        for (const producto of productos) {
            mapa.set(producto.categoria, (mapa.get(producto.categoria) ?? 0) + 1);
        }
        return mapa;
    }, [productos]);

    const productosFiltrados = categoriaActiva
        ? productos.filter((p) => p.categoria === categoriaActiva)
        : productos;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Categorías</h1>
                <p className="text-muted-foreground">
                    Explorá productos de todas las tiendas organizados por categoría
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-10">
                <button
                    onClick={() => setCategoriaActiva(null)}
                    className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all hover:shadow-md",
                        categoriaActiva === null ? "border-primary bg-primary/5" : "hover:bg-muted"
                    )}
                >
                    <ShoppingBag className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">Todas</span>
                    <span className="text-xs text-muted-foreground">{productos.length}</span>
                </button>

                {CATEGORIAS.map((cat) => {
                    const Icono = ICONOS_CATEGORIA[cat.icono ?? ""] ?? ShoppingBag;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setCategoriaActiva(cat.id)}
                            className={cn(
                                "flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all hover:shadow-md",
                                categoriaActiva === cat.id ? "border-primary bg-primary/5" : "hover:bg-muted"
                            )}
                        >
                            <Icono className="h-6 w-6 text-primary" />
                            <span className="text-sm font-medium">{cat.nombre}</span>
                            <span className="text-xs text-muted-foreground">{conteos.get(cat.id) ?? 0}</span>
                        </button>
                    );
                })}
            </div>

            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                    {categoriaActiva
                        ? CATEGORIAS.find((c) => c.id === categoriaActiva)?.nombre
                        : "Todos los productos"}
                </h2>
                <p className="text-sm text-muted-foreground">
                    {productosFiltrados.length} productos
                </p>
            </div>

            <ProductGrid productos={productosFiltrados} loading={loading} columns={4} showTienda />
        </div>
    );
}
