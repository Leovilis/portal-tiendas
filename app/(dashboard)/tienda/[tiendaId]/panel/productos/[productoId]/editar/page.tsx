// src/app/(dashboard)/tienda/[tiendaId]/panel/productos/[productoId]/editar/page.tsx
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductoForm } from "@/components/panel/ProductoForm";
import type { Producto } from "@/lib/types/product.types";

interface EditarProductoPageProps {
    params: Promise<{ tiendaId: string; productoId: string }>;
}

export default async function EditarProductoPage({ params }: EditarProductoPageProps) {
    const { tiendaId, productoId } = await params;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/login?next=${encodeURIComponent(`/tienda/${tiendaId}/panel/productos/${productoId}/editar`)}`);
    }

    const { data: perfil } = await supabase
        .from("users")
        .select("tiendaId, role")
        .eq("id", user.id)
        .maybeSingle();

    if (!perfil || perfil.role !== "VENDEDOR" || perfil.tiendaId !== tiendaId) {
        redirect(`/tienda/${tiendaId}`);
    }

    const { data: p } = await supabase
        .from("productos")
        .select("*")
        .eq("id", productoId)
        .eq("tiendaId", tiendaId)
        .maybeSingle();

    if (!p) {
        notFound();
    }

    const producto: Producto = {
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
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Editar producto</h1>
            <ProductoForm tiendaId={tiendaId} productoExistente={producto} />
        </div>
    );
}
