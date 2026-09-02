// src/app/(dashboard)/tienda/[tiendaId]/panel/productos/nuevo/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductoForm } from "@/components/panel/ProductoForm";

interface NuevoProductoPageProps {
    params: Promise<{ tiendaId: string }>;
}

export default async function NuevoProductoPage({ params }: NuevoProductoPageProps) {
    const { tiendaId } = await params;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/login?next=${encodeURIComponent(`/tienda/${tiendaId}/panel/productos/nuevo`)}`);
    }

    const { data: perfil } = await supabase
        .from("users")
        .select("tiendaId, role")
        .eq("id", user.id)
        .maybeSingle();

    if (!perfil || perfil.role !== "VENDEDOR" || perfil.tiendaId !== tiendaId) {
        redirect(`/tienda/${tiendaId}`);
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Nuevo producto</h1>
            <ProductoForm tiendaId={tiendaId} />
        </div>
    );
}
