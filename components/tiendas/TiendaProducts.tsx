// src/components/tiendas/TiendaProducts.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ProductGrid } from "@/components/productos/ProductGrid";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Producto } from "@/lib/types/product.types";

interface TiendaProductsProps {
    tiendaId: string;
    productos: Producto[];
    className?: string;
}

export function TiendaProducts({ tiendaId, productos, className }: TiendaProductsProps) {
    const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null);

    const categorias = useMemo(
        () => Array.from(new Set(productos.map((p) => p.categoria))),
        [productos]
    );

    const productosFiltrados = categoriaActiva
        ? productos.filter((p) => p.categoria === categoriaActiva)
        : productos;

    return (
        <div className={cn("space-y-5", className)}>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-bold">Productos ({productos.length})</h2>
                <Link href={`/tienda/${tiendaId}/productos`}>
                    <Button variant="ghost" size="sm" className="gap-1">
                        Ver todos
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                </Link>
            </div>

            {categorias.length > 1 && (
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={categoriaActiva === null ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCategoriaActiva(null)}
                    >
                        Todas
                    </Button>
                    {categorias.map((cat) => (
                        <Button
                            key={cat}
                            variant={categoriaActiva === cat ? "default" : "outline"}
                            size="sm"
                            className="capitalize"
                            onClick={() => setCategoriaActiva(cat)}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
            )}

            <ProductGrid productos={productosFiltrados.slice(0, 8)} columns={4} />
        </div>
    );
}
