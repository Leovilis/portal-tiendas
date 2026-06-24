// src/components/productos/ProductGrid.tsx
"use client";

import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Producto } from "@/types/product.types";
import { cn } from "@/lib/utils";

// src/components/productos/ProductGrid.tsx
interface ProductGridProps {
    productos: Producto[];
    loading?: boolean;
    columns?: 1 | 2 | 3 | 4 | 5; // ✅ Agregar 1
    variant?: "default" | "compact" | "horizontal";
    showTienda?: boolean;
    className?: string;
}

const gridCols = {
    1: "grid-cols-1",           // ✅ Agregar para vista de lista
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
};

export function ProductGrid({
    productos,
    loading = false,
    columns = 4,
    variant = "default",
    showTienda = false,
    className,
}: ProductGridProps) {

    if (loading) {
        return (
            <div className={cn("grid gap-6", gridCols[columns], className)}>
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                        <Skeleton className="aspect-square w-full rounded-lg" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-6 w-1/3" />
                    </div>
                ))}
            </div>
        );
    }

    if (productos.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron productos</p>
            </div>
        );
    }

    return (
        <div className={cn("grid gap-6", gridCols[columns], className)}>
            {productos.map((producto) => (
                <ProductCard
                    key={producto.id}
                    producto={producto}
                    variant={variant}
                    showTienda={showTienda}
                />
            ))}
        </div>
    );
}