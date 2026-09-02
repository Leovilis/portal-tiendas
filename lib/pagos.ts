// src/lib/pagos.ts
// Lógica compartida para confirmar el pago de un pedido. Se usa tanto desde
// el webhook de MercadoPago como desde la verificación manual al volver del
// checkout. Importante: nunca marca un pedido como pagado a partir de datos
// que vengan directo del cliente o del cuerpo crudo de un webhook — siempre
// a partir de un objeto de pago ya re-consultado contra la API real de
// MercadoPago (ver lib/mercadopago.ts).
import { createAdminClient } from "@/lib/supabase/admin";
import type { PagoMercadoPago } from "@/lib/mercadopago";

export async function confirmarPagoPedido(pedidoId: string, pago: PagoMercadoPago) {
    if (pago.status !== "approved") {
        return { actualizado: false as const };
    }
    if (pago.external_reference && pago.external_reference !== pedidoId) {
        // El pago que estamos mirando no corresponde a este pedido: no tocamos nada.
        return { actualizado: false as const };
    }

    const admin = createAdminClient();

    // El "eq pagado false" hace que esto sea idempotente: si el webhook y la
    // verificación manual llegan casi al mismo tiempo, solo uno de los dos
    // va a encontrar la fila y actualizarla (y por lo tanto solo uno inserta
    // el registro de historial).
    const { data, error } = await admin
        .from("pedidos")
        .update({
            pagado: true,
            estado: "CONFIRMADO",
            mercadoPagoPaymentId: String(pago.id),
            updatedAt: new Date().toISOString(),
        })
        .eq("id", pedidoId)
        .eq("pagado", false)
        .select("id")
        .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return { actualizado: false as const };

    await admin.from("pedido_historial").insert({
        id: crypto.randomUUID(),
        pedidoId,
        estado: "CONFIRMADO",
        descripcion: `Pago aprobado vía MercadoPago (pago #${pago.id}).`,
    });

    return { actualizado: true as const };
}
