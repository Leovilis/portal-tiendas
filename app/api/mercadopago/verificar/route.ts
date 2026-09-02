// src/app/api/mercadopago/verificar/route.ts
// El webhook de MercadoPago solo puede llegar a una URL pública: mientras el
// sitio corre en localhost (desarrollo) o si el webhook se demora, esto le
// da al comprador una forma de "sincronizar ahora" al volver del pago,
// re-consultando la API real de MercadoPago (nunca confiando en el simple
// hecho de haber vuelto a la página).
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buscarPagosPorReferencia } from "@/lib/mercadopago";
import { confirmarPagoPedido } from "@/lib/pagos";

interface DatosPagoPedido {
    access_token: string | null;
    pagado: boolean;
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
        return NextResponse.json({ pagado: true });
    }
    if (!fila.access_token) {
        return NextResponse.json({ pagado: false, configurado: false });
    }

    try {
        const pagos = await buscarPagosPorReferencia(fila.access_token, pedidoId);
        const aprobado = pagos.find((p) => p.status === "approved");

        if (!aprobado) {
            return NextResponse.json({ pagado: false });
        }

        const resultado = await confirmarPagoPedido(pedidoId, aprobado);
        return NextResponse.json({ pagado: resultado.actualizado || fila.pagado });
    } catch (err) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "No se pudo verificar el pago." },
            { status: 502 }
        );
    }
}
