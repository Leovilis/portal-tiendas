// src/components/panel/PagarPedidoBoton.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";

interface PagarPedidoBotonProps {
    pedidoId: string;
}

export function PagarPedidoBoton({ pedidoId }: PagarPedidoBotonProps) {
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const pagar = async () => {
        setError(null);
        setCargando(true);

        try {
            const res = await fetch("/api/mercadopago/crear-preferencia", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pedidoId }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error ?? "No se pudo iniciar el pago.");
            }

            if (data.yaPagado) {
                window.location.reload();
                return;
            }

            if (!data.configurado || !data.initPoint) {
                setError("Esta tienda todavía no activó el cobro en línea.");
                setCargando(false);
                return;
            }

            window.location.href = data.initPoint;
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo iniciar el pago.");
            setCargando(false);
        }
    };

    return (
        <div className="flex flex-col items-end gap-1">
            <Button size="sm" onClick={pagar} disabled={cargando} className="gap-2">
                {cargando ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CreditCard className="h-3.5 w-3.5" />}
                Pagar con MercadoPago
            </Button>
            {error && <p className="text-xs text-destructive text-right max-w-56">{error}</p>}
        </div>
    );
}
