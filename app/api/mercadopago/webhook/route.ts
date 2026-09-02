// src/app/api/mercadopago/webhook/route.ts
// MercadoPago llama a esta URL (sin sesión de usuario) cuando cambia el
// estado de un pago. Como cada tienda tiene su propio Access Token, no hay
// una sola cuenta "de la plataforma" contra la cual consultar el pago: por
// eso el pedidoId viaja en la propia notification_url (ver
// lib/mercadopago.ts) y lo usamos para encontrar el vendedor correcto.
//
// Regla de oro: nunca confiamos en el cuerpo del webhook para decidir si un
// pago está aprobado (cualquiera podría mandarnos un POST falso). Acá solo
// lo usamos para saber "algo pasó con el pago X del pedido Y", y siempre
// volvemos a consultar la API real de MercadoPago con el Access Token del
// vendedor antes de tocar la base de datos.
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { obtenerPagoMercadoPago } from "@/lib/mercadopago";
import { confirmarPagoPedido } from "@/lib/pagos";

async function procesarNotificacion(request: Request) {
    const url = new URL(request.url);
    const pedidoId = url.searchParams.get("pedidoId");

    const tipo = url.searchParams.get("type") ?? url.searchParams.get("topic");
    const paymentId = url.searchParams.get("data.id") ?? url.searchParams.get("id");

    // Notificaciones que no son de pago (merchant_order, etc.) no nos interesan.
    if (tipo && tipo !== "payment") {
        return NextResponse.json({ ok: true, ignorado: tipo });
    }

    if (!pedidoId || !paymentId) {
        // No podemos hacer nada sin esto. Respondemos 200 igual para que
        // MercadoPago no reintente indefinidamente una notificación que
        // nunca vamos a poder procesar (por ejemplo, un ping de prueba).
        return NextResponse.json({ ok: true, ignorado: "faltan parámetros" });
    }

    const admin = createAdminClient();

    const { data: pedido } = await admin
        .from("pedidos")
        .select("id, tiendaId, pagado")
        .eq("id", pedidoId)
        .maybeSingle();

    if (!pedido) {
        return NextResponse.json({ ok: true, ignorado: "pedido no encontrado" });
    }

    if (pedido.pagado) {
        return NextResponse.json({ ok: true, yaPagado: true });
    }

    const { data: config } = await admin
        .from("tienda_configs")
        .select("mercadoPagoKey")
        .eq("tiendaId", pedido.tiendaId)
        .maybeSingle();

    if (!config?.mercadoPagoKey) {
        return NextResponse.json({ ok: true, ignorado: "tienda sin MercadoPago configurado" });
    }

    try {
        const pago = await obtenerPagoMercadoPago(config.mercadoPagoKey, paymentId);
        const resultado = await confirmarPagoPedido(pedidoId, pago);
        return NextResponse.json({ ok: true, ...resultado });
    } catch (err) {
        // Un error real (ej. MercadoPago caído) sí queremos que se reintente.
        return NextResponse.json(
            { ok: false, error: err instanceof Error ? err.message : "Error al procesar el webhook." },
            { status: 502 }
        );
    }
}

export async function POST(request: Request) {
    return procesarNotificacion(request);
}

// MercadoPago a veces llama por GET en vez de POST según el tipo de
// integración; contemplamos ambos.
export async function GET(request: Request) {
    return procesarNotificacion(request);
}
