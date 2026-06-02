// src/app/productos/page.tsx
"use client";

import { useState } from "react";
import { ProductGrid } from "@/components/productos/ProductGrid";
import { ProductFilters } from "@/components/productos/ProductFilters";
import { Button } from "@/components/ui/button";
import { Grid3x3, LayoutList } from "lucide-react";
import type { Producto, ProductoFilters } from "@/lib/types/product.types";

// Datos mock (después conectas con API)
const MOCK_PRODUCTOS: Producto[] = [
  {
    id: "1",
    tiendaId: "tienda-1",
    nombre: "Camiseta de Algodón Premium",
    slug: "camiseta-algodon-premium",
    descripcion: "Camiseta 100% algodón, disponible en varios colores",
    precio: 19990,
    precioOferta: 14990,
    imagenes: ["https://picsum.photos/400/400?random=1"],
    categoria: "ropa",
    stock: 25,
    rating: 4.8,
    totalReviews: 128,
    esNuevo: true,
    esDestacado: true,
    tieneEnvioGratis: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    tiendaId: "tienda-2",
    nombre: "Auriculares Bluetooth",
    slug: "auriculares-bluetooth",
    descripcion: "Auriculares inalámbricos con cancelación de ruido",
    precio: 89990,
    imagenes: ["https://picsum.photos/400/400?random=2"],
    categoria: "electronica",
    stock: 5,
    rating: 4.9,
    totalReviews: 256,
    esDestacado: true,
    tieneEnvioGratis: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    tiendaId: "tienda-3",
    nombre: "Lámpara de Mesa LED",
    slug: "lampara-mesa-led",
    descripcion: "Lámpara regulable con luz cálida",
    precio: 34990,
    precioOferta: 24990,
    imagenes: ["https://picsum.photos/400/400?random=3"],
    categoria: "hogar",
    stock: 15,
    rating: 4.7,
    totalReviews: 89,
    esNuevo: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function ProductosPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [productos, setProductos] = useState(MOCK_PRODUCTOS);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (filters: ProductoFilters) => {
    setLoading(true);
    // Aquí filtrarías los productos desde tu API
    console.log("Filtros aplicados:", filters);
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Todos los productos</h1>
        <p className="text-muted-foreground">
          Descubre lo mejor de nuestras tiendas
        </p>
      </div>

      {/* Acciones */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">
          Mostrando {productos.length} productos
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

      {/* Contenido */}
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-72">
          <ProductFilters onFilterChange={handleFilterChange} />
        </aside>
        
        <main className="flex-1">
          <ProductGrid 
            productos={productos}
            loading={loading}
            columns={viewMode === "grid" ? 4 : 1}
            variant={viewMode === "list" ? "horizontal" : "default"}
          />
        </main>
      </div>
    </div>
  );
}