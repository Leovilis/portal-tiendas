// src/lib/mercadopago.ts
// Llamadas directas a la API REST de MercadoPago. Nunca se usa desde el
// cliente: el Access Token del vendedor es un secreto y solo debe viajar
// entre nuestro servidor y MercadoPago, jamás al navegador del comprador.

const MP_API = "https://api.mercadopago.com";

interface PreferenciaMercadoPago {
    id: string;
    init_point: string;
    sandbox_init_point?: string;
}

interface CrearPreferenciaParams {
    accessToken: string;
    pedidoId: string;
    tiendaNombre: string;
    total: number;
    siteUrl: string;
}

async function mpFetch(path: string, accessToken: string, init?: RequestInit) {
    const res = await fetch(`${MP_API}${path}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            ...(init?.headers ?? {}),
        },
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        const mensaje =
            (data && (data.message || data.error)) || `MercadoPago respondió con un error (${res.status}).`;
        throw new Error(mensaje);
    }

    return data;
}

/** Crea una preferencia de pago (Checkout Pro) en la cuenta del vendedor. */
export async function crearPreferenciaMercadoPago({
    accessToken,
    pedidoId,
    tiendaNombre,
    total,
    siteUrl,
}: CrearPreferenciaParams): Promise<PreferenciaMercadoPago> {
    return mpFetch("/checkout/preferences", accessToken, {
        method: "POST",
        body: JSON.stringify({
            items: [
                {
                    title: `Pedido en ${tiendaNombre} - PortalTiendas`,
                    quantity: 1,
                    unit_price: Number(total),
                },
            ],
            external_reference: pedidoId,
            back_urls: {
                success: `${siteUrl}/pedidos?pedido=${pedidoId}&mp=success`,
                pending: `${siteUrl}/pedidos?pedido=${pedidoId}&mp=pending`,
                failure: `${siteUrl}/pedidos?pedido=${pedidoId}&mp=failure`,
            },
            auto_return: "approved",
            // El pedidoId va en la propia URL de notificación: MercadoPago la
            // llama tal cual, y como cada vendedor tiene su propio Access
            // Token, es la forma de saber a qué pedido (y por lo tanto a qué
            // tienda/token) corresponde un aviso de pago sin adivinar.
            notification_url: `${siteUrl}/api/mercadopago/webhook?pedidoId=${encodeURIComponent(pedidoId)}`,
            statement_descriptor: "PORTALTIENDAS",
        }),
    });
}

export interface PagoMercadoPago {
    id: number;
    status: string;
    external_reference: string | null;
    transaction_amount: number;
}

/** Consulta un pago puntual por id (fuente de verdad: nunca confiar en el body del webhook). */
export async function obtenerPagoMercadoPago(accessToken: string, paymentId: string): Promise<PagoMercadoPago> {
    return mpFetch(`/v1/payments/${paymentId}`, accessToken);
}

/** Busca pagos por external_reference (nuestro pedidoId) sin necesitar el paymentId. */
export async function buscarPagosPorReferencia(
    accessToken: string,
    externalReference: string
): Promise<PagoMercadoPago[]> {
    const params = new URLSearchParams({
        external_reference: externalReference,
        sort: "date_created",
        criteria: "desc",
    });
    const data = await mpFetch(`/v1/payments/search?${params.toString()}`, accessToken);
    return (data?.results ?? []) as PagoMercadoPago[];
}

/** true si el Access Token es de producción ("APP_USR-...") y no de prueba ("TEST-..."). */
export function esCredencialProduccion(accessToken: string) {
    return accessToken.startsWith("APP_USR-");
}
