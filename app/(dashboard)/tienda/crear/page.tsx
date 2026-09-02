// src/app/(dashboard)/tienda/crear/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TiendaCrearForm } from "@/components/panel/TiendaCrearForm";

export default async function CrearTiendaPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/login?next=${encodeURIComponent("/tienda/crear")}`);
    }

    const { data: perfil } = await supabase
        .from("users")
        .select("tiendaId, role")
        .eq("id", user.id)
        .maybeSingle();

    if (!perfil || perfil.role !== "VENDEDOR") {
        // Los compradores no pueden crear tiendas: la política de la base de
        // datos tampoco lo permitiría.
        redirect("/");
    }

    if (perfil.tiendaId) {
        // Ya tiene una tienda: no tiene sentido mostrarle el alta de nuevo.
        redirect(`/tienda/${perfil.tiendaId}/panel`);
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-1">Creá tu tienda</h1>
            <p className="text-muted-foreground mb-8">
                Completá estos datos para empezar a vender en PortalTiendas. Vas a poder editarlos
                cuando quieras desde el panel.
            </p>
            <TiendaCrearForm />
        </div>
    );
}
