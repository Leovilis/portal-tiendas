// src/app/ofertas/page.tsx
import { ProductGrid } from "@/components/productos/ProductGrid";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Producto } from "@/lib/types/product.types";

export const metadata = {
    title: "Ofertas - PortalTiendas",
    description: "Los mejores descuentos de todas las tiendas, en un solo lugar.",
};

function calcularDescuento(precio: number, precioOferta: number) {
    return Math.round(((precio - precioOferta) / precio) * 100);
}

export default async function OfertasPage() {
    const supabase = await createClient();
    const { data: rows } = await supabase
        .from("productos")
        .select("*")
        .not("precioOferta", "is", null);

    const productosEnOferta: Producto[] = (rows ?? [])
        .map((p) => ({
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
        }))
        .sort(
            (a, b) =>
                calcularDescuento(b.precio, b.precioOferta!) -
                calcularDescuento(a.precio, a.precioOferta!)
        );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                    <Tag className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Ofertas</h1>
                    <p className="text-muted-foreground">
                        Los mejores descuentos, seleccionados de todas nuestras tiendas
                    </p>
                </div>
            </div>

            {productosEnOferta.length > 0 && (
                <Badge className="mb-6 bg-red-500 text-sm">
                    Hasta -{calcularDescuento(productosEnOferta[0].precio, productosEnOferta[0].precioOferta!)}% de descuento
                </Badge>
            )}

            <ProductGrid productos={productosEnOferta} columns={4} showTienda />
        </div>
    );
}
