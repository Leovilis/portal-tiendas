// src/app/(dashboard)/tienda/[tiendaId]/panel/pagos/page.tsx
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TiendaPagosForm } from "@/components/panel/TiendaPagosForm";

interface PagosTiendaPageProps {
    params: Promise<{ tiendaId: string }>;
}

export default async function PagosTiendaPage({ params }: PagosTiendaPageProps) {
    const { tiendaId } = await params;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/login?next=${encodeURIComponent(`/tienda/${tiendaId}/panel/pagos`)}`);
    }

    const { data: perfil } = await supabase
        .from("users")
        .select("tiendaId, role")
        .eq("id", user.id)
        .maybeSingle();

    if (!perfil || perfil.role !== "VENDEDOR" || perfil.tiendaId !== tiendaId) {
        redirect(`/tienda/${tiendaId}`);
    }

    const { data: tienda } = await supabase.from("tiendas").select("id").eq("id", tiendaId).maybeSingle();
    if (!tienda) {
        notFound();
    }

    const { data: config } = await supabase
        .from("tienda_configs")
        .select("mercadoPago, mercadoPagoKey")
        .eq("tiendaId", tiendaId)
        .maybeSingle();

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-1">Cobros</h1>
            <p className="text-muted-foreground mb-8">
                Configurá cómo te pagan tus clientes cuando compran en tu tienda.
            </p>
            <TiendaPagosForm tiendaId={tiendaId} configuracion={config ?? null} />
        </div>
    );
}
