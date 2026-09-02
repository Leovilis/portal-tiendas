// src/app/(dashboard)/tienda/[tiendaId]/panel/perfil/page.tsx
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TiendaPerfilForm } from "@/components/panel/TiendaPerfilForm";

interface PerfilTiendaPageProps {
    params: Promise<{ tiendaId: string }>;
}

export default async function PerfilTiendaPage({ params }: PerfilTiendaPageProps) {
    const { tiendaId } = await params;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/login?next=${encodeURIComponent(`/tienda/${tiendaId}/panel/perfil`)}`);
    }

    const { data: perfil } = await supabase
        .from("users")
        .select("tiendaId, role")
        .eq("id", user.id)
        .maybeSingle();

    if (!perfil || perfil.role !== "VENDEDOR" || perfil.tiendaId !== tiendaId) {
        redirect(`/tienda/${tiendaId}`);
    }

    const { data: tienda } = await supabase
        .from("tiendas")
        .select("id, nombre, descripcion, categoria, ubicacion, telefono, email, sitioWeb, logo, portada, tiempoRespuesta")
        .eq("id", tiendaId)
        .maybeSingle();

    if (!tienda) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-1">Perfil de la tienda</h1>
            <p className="text-muted-foreground mb-8">
                Esta información se muestra públicamente en tu página de tienda.
            </p>
            <TiendaPerfilForm tienda={tienda} />
        </div>
    );
}
