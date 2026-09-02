// src/app/producto/[productoId]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/productos/ProductDetail";
import { ProductReviews } from "@/components/productos/ProductReviews";
import { ProductGrid } from "@/components/productos/ProductGrid";
import { createClient } from "@/lib/supabase/server";
import type { Producto, Resena } from "@/lib/types/product.types";

interface ProductoPageProps {
    params: Promise<{ productoId: string }>;
}

function mapProducto(p: Record<string, unknown> & { id: string }): Producto {
    return {
        id: p.id,
        tiendaId: p.tiendaId as string,
        nombre: p.nombre as string,
        slug: p.slug as string,
        descripcion: p.descripcion as string,
        precio: p.precio as number,
        precioOferta: (p.precioOferta as number | null) ?? undefined,
        imagenes: (p.imagenes as string[] | null) ?? [],
        categoria: p.categoria as string,
        subcategoria: (p.subcategoria as string | null) ?? undefined,
        stock: p.stock as number,
        rating: p.rating as number,
        totalReviews: p.totalReviews as number,
        esNuevo: (p.esNuevo as boolean | null) ?? undefined,
        esDestacado: (p.esDestacado as boolean | null) ?? undefined,
        tieneEnvioGratis: (p.tieneEnvioGratis as boolean | null) ?? undefined,
        createdAt: new Date(p.createdAt as string),
        updatedAt: new Date(p.updatedAt as string),
    };
}

export async function generateMetadata({ params }: ProductoPageProps): Promise<Metadata> {
    const { productoId } = await params;
    const supabase = await createClient();
    const { data: producto } = await supabase
        .from("productos")
        .select("nombre, descripcion")
        .eq("id", productoId)
        .maybeSingle();

    if (!producto) {
        return { title: "Producto no encontrado - PortalTiendas" };
    }

    return {
        title: `${producto.nombre} - PortalTiendas`,
        description: producto.descripcion,
    };
}

export default async function ProductoPage({ params }: ProductoPageProps) {
    const { productoId } = await params;
    const supabase = await createClient();

    const { data: productoRow } = await supabase
        .from("productos")
        .select("*")
        .eq("id", productoId)
        .maybeSingle();

    if (!productoRow) {
        notFound();
    }

    const producto = mapProducto(productoRow);

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const [{ data: tiendaRow }, { data: relacionadosRows }, { data: reviewRows }, { data: compraRows }, { data: miResena }] =
        await Promise.all([
            supabase
                .from("tiendas")
                .select("id, nombre, logo")
                .eq("id", producto.tiendaId)
                .maybeSingle(),
            supabase
                .from("productos")
                .select("*")
                .eq("categoria", producto.categoria)
                .neq("id", producto.id)
                .limit(4),
            supabase
                .from("reviews")
                .select("id, rating, comentario, createdAt, users(name, image)")
                .eq("productoId", producto.id)
                .order("createdAt", { ascending: false }),
            // ¿El usuario logueado compró este producto? Solo quien compró
            // puede dejar reseña (pedido_productos_select_involved ya le
            // permite leer sus propias líneas de pedido).
            user
                ? supabase
                      .from("pedido_productos")
                      .select("id, pedidos!inner(usuarioId)")
                      .eq("productoId", producto.id)
                      .eq("pedidos.usuarioId", user.id)
                      .limit(1)
                : Promise.resolve({ data: null }),
            user
                ? supabase
                      .from("reviews")
                      .select("id")
                      .eq("productoId", producto.id)
                      .eq("usuarioId", user.id)
                      .maybeSingle()
                : Promise.resolve({ data: null }),
        ]);

    const puedeResenar = !!user && !!compraRows && compraRows.length > 0 && !miResena;

    const tienda = tiendaRow
        ? { id: tiendaRow.id, nombre: tiendaRow.nombre, logo: tiendaRow.logo ?? undefined }
        : undefined;

    const relacionados: Producto[] = (relacionadosRows ?? []).map(mapProducto);

    const resenas: Resena[] = (reviewRows ?? []).map((r) => {
        const autorInfo = Array.isArray(r.users) ? r.users[0] : r.users;
        return {
            id: r.id,
            entidadId: producto.id,
            autor: autorInfo?.name ?? "Comprador de PortalTiendas",
            avatar: autorInfo?.image ?? undefined,
            rating: r.rating,
            comentario: r.comentario ?? "",
            fecha: new Date(r.createdAt),
            util: 0,
        };
    });

    return (
        <div className="container mx-auto px-4 py-8 space-y-14">
            <ProductDetail producto={producto} tienda={tienda} />

            <ProductReviews
                productoId={producto.id}
                tiendaId={producto.tiendaId}
                resenas={resenas}
                puedeResenar={puedeResenar}
            />

            {relacionados.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold mb-5">Productos relacionados</h2>
                    <ProductGrid productos={relacionados} columns={4} />
                </section>
            )}
        </div>
    );
}
