// src/app/tiendas/page.tsx
import { TiendasExplorer } from "@/components/tiendas/TiendasExplorer";
import { createClient } from "@/lib/supabase/server";
import type { TiendaCardProps } from "@/components/tiendas/TiendaCard";

export const metadata = {
    title: "Tiendas - PortalTiendas",
    description: "Descubrí los mejores vendedores de PortalTiendas",
};

export default async function TiendasPage() {
    const supabase = await createClient();
    const [{ data: tiendaRows }, { data: productoRows }] = await Promise.all([
        supabase
            .from("tiendas")
            .select("id, nombre, logo, portada, categoria, ubicacion, rating, totalReviews, esOficial, esVerificada, tiempoRespuesta")
            .order("createdAt", { ascending: false }),
        supabase.from("productos").select("tiendaId"),
    ]);

    const conteoProductos = new Map<string, number>();
    for (const p of productoRows ?? []) {
        conteoProductos.set(p.tiendaId, (conteoProductos.get(p.tiendaId) ?? 0) + 1);
    }

    const tiendas: TiendaCardProps[] = (tiendaRows ?? []).map((t) => ({
        id: t.id,
        nombre: t.nombre,
        logo: t.logo ?? undefined,
        portada: t.portada ?? undefined,
        categoria: t.categoria,
        ubicacion: t.ubicacion ?? "Ubicación no especificada",
        rating: t.rating,
        totalReviews: t.totalReviews,
        esOficial: t.esOficial,
        esVerificada: t.esVerificada,
        tiempoRespuesta: t.tiempoRespuesta ?? undefined,
        productosDestacados: conteoProductos.get(t.id) ?? 0,
    }));

    return <TiendasExplorer tiendas={tiendas} />;
}
