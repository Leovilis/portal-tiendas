// src/components/tiendas/TiendaGrid.tsx
"use client";

import { TiendaCard, TiendaCardProps } from "./TiendaCard";
import { TiendaSkeleton } from "./TiendaSkeleton";
import { cn } from "@/lib/utils";

interface TiendaGridProps {
  tiendas: TiendaCardProps[];
  loading?: boolean;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function TiendaGrid({ 
  tiendas, 
  loading = false, 
  columns = 3,
  className 
}: TiendaGridProps) {
  
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  if (loading) {
    return (
      <div className={cn("grid gap-6", gridCols[columns], className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <TiendaSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (tiendas.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No se encontraron tiendas</p>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-6", gridCols[columns], className)}>
      {tiendas.map((tienda) => (
        <TiendaCard key={tienda.id} {...tienda} />
      ))}
    </div>
  );
}