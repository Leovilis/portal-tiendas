// src/app/(dashboard)/tienda/[tiendaId]/productos/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ProductGrid } from "@/components/productos/ProductGrid";
import { ProductFilters } from "@/components/productos/ProductFilters";
import { Button } from "@/components/ui/button";
import { Grid3x3, LayoutList } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Producto, ProductoFilters } from "@/lib/types/product.types";

export default function TiendaProductosPage() {
    const params = useParams<{ tiendaId: string }>();
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [productos, setProductos] = useState<Producto[]>([]);
    const [nombreTienda, setNombreTienda] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<ProductoFilters>({});

    useEffect(() => {
        const supabase = createClient();
        Promise.all([
            supabase
                .from("productos")
                .select("*")
                .eq("tiendaId", params.tiendaId)
                .order("createdAt", { ascending: false }),
            supabase.from("tiendas").select("nombre").eq("id", params.tiendaId).maybeSingle(),
        ]).then(([{ data }, { data: tienda }]) => {
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
            setNombreTienda(tienda?.nombre ?? null);
            setLoading(false);
        });
    }, [params.tiendaId]);

    const productosFiltrados = useMemo(() => {
        let resultado = [...productos];

        if (filters.categoria) {
            resultado = resultado.filter((p) => p.categoria === filters.categoria);
        }
        if (filters.precioMin !== undefined) {
            resultado = resultado.filter((p) => (p.precioOferta ?? p.precio) >= filters.precioMin!);
        }
        if (filters.precioMax !== undefined) {
            resultado = resultado.filter((p) => (p.precioOferta ?? p.precio) <= filters.precioMax!);
        }
        if (filters.ratingMin !== undefined) {
            resultado = resultado.filter((p) => p.rating >= filters.ratingMin!);
        }
        if (filters.soloOferta) {
            resultado = resultado.filter((p) => !!p.precioOferta);
        }
        if (filters.soloEnvioGratis) {
            resultado = resultado.filter((p) => !!p.tieneEnvioGratis);
        }

        switch (filters.ordenarPor) {
            case "precio_asc":
                resultado.sort((a, b) => (a.precioOferta ?? a.precio) - (b.precioOferta ?? b.precio));
                break;
            case "precio_desc":
                resultado.sort((a, b) => (b.precioOferta ?? b.precio) - (a.precioOferta ?? a.precio));
                break;
            case "rating":
                resultado.sort((a, b) => b.rating - a.rating);
                break;
            case "nuevos":
                resultado.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
                break;
        }

        return resultado;
    }, [productos, filters]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    {nombreTienda ? `Productos de ${nombreTienda}` : "Productos de la tienda"}
                </h1>
                <p className="text-muted-foreground">
                    Todo el catálogo real de esta tienda
                </p>
            </div>

            <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-muted-foreground">
                    Mostrando {productosFiltrados.length} productos
                </p>
                <div className="flex gap-2">
                    <Button
                        variant={viewMode === "grid" ? "default" : "outline"}
                        size="icon"
                        onClick={() => setViewMode("grid")}
                    >
                        <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === "list" ? "default" : "outline"}
                        size="icon"
                        onClick={() => setViewMode("list")}
                    >
                        <LayoutList className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="lg:w-72">
                    <ProductFilters onFilterChange={setFilters} />
                </aside>

                <main className="flex-1">
                    <ProductGrid
                        productos={productosFiltrados}
                        loading={loading}
                        columns={viewMode === "grid" ? 4 : 1}
                        variant={viewMode === "list" ? "horizontal" : "default"}
                    />
                </main>
            </div>
        </div>
    );
}
