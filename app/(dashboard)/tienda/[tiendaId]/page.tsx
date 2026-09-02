// src/app/(dashboard)/tienda/[tiendaId]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Store } from "lucide-react";
import { TiendaHeader } from "@/components/tiendas/TiendaHeader";
import { TiendaStats } from "@/components/tiendas/TiendaStats";
import { TiendaProducts } from "@/components/tiendas/TiendaProducts";
import { TiendaReviews } from "@/components/tiendas/TiendaReviews";
import { TiendaContact } from "@/components/tiendas/TiendaContact";
import { TiendaVendedorResumen } from "@/components/tiendas/TiendaVendedorResumen";
import { Sidebar } from "@/components/layout/Sidebar";
import { createClient } from "@/lib/supabase/server";
import { formatAntiguedad } from "@/lib/utils";
import type { Producto, Resena } from "@/lib/types/product.types";

interface TiendaPageProps {
    params: Promise<{ tiendaId: string }>;
}

export async function generateMetadata({ params }: TiendaPageProps): Promise<Metadata> {
    const { tiendaId } = await params;
    const supabase = await createClient();
    const { data: tienda } = await supabase
        .from("tiendas")
        .select("nombre, descripcion")
        .eq("id", tiendaId)
        .maybeSingle();

    if (!tienda) {
        return { title: "Tienda no encontrada - PortalTiendas" };
    }

    return {
        title: `${tienda.nombre} - PortalTiendas`,
        description: tienda.descripcion,
    };
}

export default async function TiendaPage({ params }: TiendaPageProps) {
    const { tiendaId } = await params;
    const supabase = await createClient();

    const { data: tienda } = await supabase
        .from("tiendas")
        .select("*")
        .eq("id", tiendaId)
        .maybeSingle();

    if (!tienda) {
        notFound();
    }

    const {
        data: { user },
    } = await supabase.auth.getUser();

    let esPropietario = false;
    if (user) {
        const { data: perfil } = await supabase
            .from("users")
            .select("tiendaId")
            .eq("id", user.id)
            .maybeSingle();
        esPropietario = perfil?.tiendaId === tienda.id;
    }

    const [
        { data: productosRows },
        { data: reviewRows },
        { data: ventasData },
        { data: pedidosRows },
        { count: totalSeguidores },
        { data: miSeguimiento },
    ] = await Promise.all([
        supabase
            .from("productos")
            .select("*")
            .eq("tiendaId", tienda.id)
            .order("createdAt", { ascending: false }),
        supabase
            .from("reviews")
            .select("id, rating, comentario, createdAt, users(name, image)")
            .eq("tiendaId", tienda.id)
            .order("createdAt", { ascending: false }),
        // Suma de ventas reales (pedidos pagados). RLS protege los pedidos fila por
        // fila, así que este agregado público se sirve vía una función de base de
        // datos (security definer) que solo devuelve el total, no los pedidos.
        supabase.rpc("get_tienda_ventas_totales", { p_tienda_id: tienda.id }),
        // Los pedidos reales solo los puede leer el dueño (RLS pedidos_select_involved);
        // si no es el dueño, esto devuelve vacío igual, pero evitamos la consulta.
        esPropietario
            ? supabase
                  .from("pedidos")
                  .select("id, estado, total, createdAt, users(name, email)")
                  .eq("tiendaId", tienda.id)
                  .order("createdAt", { ascending: false })
            : Promise.resolve({ data: null }),
        supabase.from("tienda_seguidores").select("*", { count: "exact", head: true }).eq("tiendaId", tienda.id),
        user
            ? supabase
                  .from("tienda_seguidores")
                  .select("tiendaId")
                  .eq("tiendaId", tienda.id)
                  .eq("usuarioId", user.id)
                  .maybeSingle()
            : Promise.resolve({ data: null }),
    ]);

    const productos: Producto[] = (productosRows ?? []).map((p) => ({
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
    }));

    const resenas: Resena[] = (reviewRows ?? []).map((r) => {
        // El embed de Supabase puede devolver el objeto relacionado suelto o en
        // un array según la relación inferida; contemplamos ambos casos.
        const autorInfo = Array.isArray(r.users) ? r.users[0] : r.users;
        return {
            id: r.id,
            entidadId: tienda.id,
            autor: autorInfo?.name ?? "Comprador de PortalTiendas",
            avatar: autorInfo?.image ?? undefined,
            rating: r.rating,
            comentario: r.comentario ?? "",
            fecha: new Date(r.createdAt),
            util: 0,
        };
    });

    const ventas = typeof ventasData === "number" ? ventasData : Number(ventasData ?? 0);
    const categorias = Array.from(new Set(productos.map((p) => p.categoria)));

    const pedidosTotales = pedidosRows?.length ?? 0;
    const pedidosPendientes = pedidosRows?.filter((p) => p.estado === "PENDIENTE").length ?? 0;
    const productosSinStock = productos.filter((p) => p.stock === 0).length;
    const pedidosRecientes = (pedidosRows ?? []).slice(0, 5).map((p) => {
        const comprador = Array.isArray(p.users) ? p.users[0] : p.users;
        return {
            id: p.id,
            comprador: comprador?.name ?? comprador?.email ?? "Comprador",
            fecha: new Date(p.createdAt),
            estado: p.estado,
            total: p.total,
        };
    });

    // Se pasan nombres de ícono (string), no componentes: Sidebar es un Client
    // Component y no puede recibir funciones/clases desde este Server Component.
    const seccionesSidebar = esPropietario
        ? [
              { id: "info", label: "Información", icon: "Info" as const },
              { id: "productos", label: "Productos", icon: "Package" as const },
              {
                  id: "vendedor",
                  label: "Resumen de vendedor",
                  icon: "ClipboardList" as const,
                  count: pedidosPendientes > 0 ? pedidosPendientes : undefined,
              },
          ]
        : undefined;

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <div id="info" className="scroll-mt-24">
                {esPropietario && (
                    <div className="flex justify-end gap-2 mb-4">
                        <Link href={`/tienda/${tiendaId}/panel/perfil`}>
                            <Button variant="outline" className="gap-2">
                                <Store className="h-4 w-4" />
                                Editar perfil
                            </Button>
                        </Link>
                        <Link href={`/tienda/${tiendaId}/panel`}>
                            <Button className="gap-2">
                                <LayoutDashboard className="h-4 w-4" />
                                Administrar productos
                            </Button>
                        </Link>
                    </div>
                )}

                <TiendaHeader
                    tiendaId={tienda.id}
                    nombre={tienda.nombre}
                    logo={tienda.logo ?? undefined}
                    portada={tienda.portada ?? undefined}
                    descripcion={tienda.descripcion}
                    categoria={tienda.categoria}
                    ubicacion={tienda.ubicacion ?? "Ubicación no especificada"}
                    rating={tienda.rating}
                    totalReviews={tienda.totalReviews}
                    esOficial={tienda.esOficial}
                    esVerificada={tienda.esVerificada}
                    tiempoRespuesta={tienda.tiempoRespuesta ?? undefined}
                    puedeSeguir={!!user && !esPropietario}
                    siguiendoInicial={!!miSeguimiento}
                    totalSeguidores={totalSeguidores ?? 0}
                    mostrarContactar={!esPropietario}
                />

                <div className="mt-6">
                    <TiendaStats
                        stats={{
                            productos: productos.length,
                            ventas,
                            antiguedad: formatAntiguedad(tienda.createdAt),
                            ratingPromedio: tienda.rating,
                            nivel: tienda.nivel.toLowerCase() as "bronce" | "plata" | "oro" | "platino",
                        }}
                    />
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
                <Sidebar
                    categorias={categorias}
                    productCount={productos.length}
                    reviewCount={resenas.length}
                    sections={seccionesSidebar}
                    className="hidden lg:block"
                />

                <div className="space-y-12 min-w-0">
                    <section id="productos" className="scroll-mt-24">
                        <TiendaProducts tiendaId={tienda.id} productos={productos} />
                    </section>

                    {esPropietario ? (
                        <section id="vendedor" className="scroll-mt-24">
                            <TiendaVendedorResumen
                                tiendaId={tienda.id}
                                ventasTotales={ventas}
                                pedidosPendientes={pedidosPendientes}
                                pedidosTotales={pedidosTotales}
                                productosSinStock={productosSinStock}
                                recientes={pedidosRecientes}
                            />
                        </section>
                    ) : (
                        <>
                            <section id="resenas" className="scroll-mt-24">
                                <TiendaReviews nombre={tienda.nombre} resenas={resenas} />
                            </section>

                            <section id="contacto" className="scroll-mt-24">
                                <h2 className="text-xl font-bold mb-5">Contacto</h2>
                                <TiendaContact
                                    nombre={tienda.nombre}
                                    contacto={{
                                        direccion: tienda.ubicacion ?? undefined,
                                        telefono: tienda.telefono ?? undefined,
                                        email: tienda.email ?? undefined,
                                    }}
                                />
                            </section>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
