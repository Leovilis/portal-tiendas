// src/components/panel/VerificarPagoAlVolver.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface VerificarPagoAlVolverProps {
    pedidoId: string;
    resultado: "success" | "pending" | "failure";
}

/**
 * El webhook de MercadoPago es la fuente de verdad, pero no puede llegar a
 * localhost en desarrollo (ni si tarda unos segundos). Al volver del pago,
 * esto reconsulta el estado real contra la API de MercadoPago una vez y
 * refresca la página, para no depender solo del webhook.
 */
export function VerificarPagoAlVolver({ pedidoId, resultado }: VerificarPagoAlVolverProps) {
    const router = useRouter();
    const [verificando, setVerificando] = useState(resultado !== "failure");

    useEffect(() => {
        if (resultado === "failure") return;

        let cancelado = false;

        fetch("/api/mercadopago/verificar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pedidoId }),
        })
            .catch(() => null)
            .finally(() => {
                if (cancelado) return;
                setVerificando(false);
                router.refresh();
            });

        return () => {
            cancelado = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pedidoId]);

    if (resultado === "failure") {
        return (
            <div className="rounded-md bg-destructive/10 text-destructive text-sm p-3 mb-6">
                El pago no se completó. Podés intentarlo de nuevo desde el pedido.
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 rounded-md bg-blue-50 text-blue-700 text-sm p-3 mb-6 dark:bg-blue-950/40 dark:text-blue-400">
            {verificando && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
            {verificando
                ? "Confirmando tu pago con MercadoPago..."
                : "Ya verificamos tu pago: si no ves el cambio, esperá unos segundos y actualizá."}
        </div>
    );
}
