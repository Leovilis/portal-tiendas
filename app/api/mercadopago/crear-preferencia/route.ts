// src/app/api/mercadopago/crear-preferencia/route.ts
// El comprador llama a esto (desde el checkout o desde "Mis pedidos") para
// obtener el link de pago de MercadoPago de un pedido puntual. El Access
// Token del vendedor se obtiene server-side vía una función de base de
// datos que valida que el pedido sea del usuario logueado, y nunca sale de
// este servidor: solo devolvemos la URL de pago al navegador.
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { crearPreferenciaMercadoPago, esCredencialProduccion } from "@/lib/mercadopago";

interface DatosPagoPedido {
    access_token: string | null;
    tienda_id: string;
    tienda_nombre: string;
    total: number;
    pagado: boolean;
    preference_id: string | null;
}

export async function POST(request: Request) {
    let pedidoId: unknown;
    try {
        const body = await request.json();
        pedidoId = body?.pedidoId;
    } catch {
        return NextResponse.json({ error: "Cuerpo de la solicitud inválido." }, { status: 400 });
    }

    if (!pedidoId || typeof pedidoId !== "string") {
        return NextResponse.json({ error: "Falta el id del pedido." }, { status: 400 });
    }

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Debés iniciar sesión." }, { status: 401 });
    }

    const { data, error } = await supabase.rpc("obtener_datos_pago_pedido", { p_pedido_id: pedidoId });

    if (error || !data || data.length === 0) {
        return NextResponse.json({ error: error?.message ?? "Pedido no encontrado." }, { status: 404 });
    }

    const fila = data[0] as DatosPagoPedido;

    if (fila.pagado) {
        return NextResponse.json({ configurado: true, yaPagado: true });
    }

    if (!fila.access_token) {
        // El vendedor todavía no activó el cobro con MercadoPago: se mantiene
        // el flujo original (coordinar el pago directamente con el vendedor).
        return NextResponse.json({ configurado: false });
    }

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin).replace(/\/$/, "");

    try {
        const preferencia = await crearPreferenciaMercadoPago({
            accessToken: fila.access_token,
            pedidoId,
            tiendaNombre: fila.tienda_nombre,
            total: fila.total,
            siteUrl,
        });

        // Guardamos el id de preferencia en el propio pedido del comprador
        // (RLS ya le permite actualizar sus propios pedidos); solo se usa
        // para trazabilidad, la confirmación real del pago nunca depende de
        // este valor.
        await supabase.from("pedidos").update({ mercadoPagoPreferenceId: preferencia.id }).eq("id", pedidoId);

        const enProduccion = esCredencialProduccion(fila.access_token);
        const initPoint = enProduccion
            ? preferencia.init_point
            : preferencia.sandbox_init_point ?? preferencia.init_point;

        return NextResponse.json({ configurado: true, initPoint });
    } catch (err) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "No se pudo crear el pago en MercadoPago." },
            { status: 502 }
        );
    }
}
