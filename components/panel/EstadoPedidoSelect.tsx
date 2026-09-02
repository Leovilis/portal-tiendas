// src/components/panel/EstadoPedidoSelect.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";

const ESTADOS = [
    { value: "PENDIENTE", label: "Pendiente" },
    { value: "CONFIRMADO", label: "Confirmado" },
    { value: "PREPARANDO", label: "Preparando" },
    { value: "ENVIADO", label: "Enviado" },
    { value: "ENTREGADO", label: "Entregado" },
    { value: "CANCELADO", label: "Cancelado" },
    { value: "DEVUELTO", label: "Devuelto" },
];

export function EstadoPedidoSelect({ pedidoId, estadoActual }: { pedidoId: string; estadoActual: string }) {
    const router = useRouter();
    const [estado, setEstado] = useState(estadoActual);
    const [guardando, setGuardando] = useState(false);

    const handleChange = async (nuevoEstado: string) => {
        setEstado(nuevoEstado);
        setGuardando(true);
        const supabase = createClient();
        const { error } = await supabase
            .from("pedidos")
            .update({ estado: nuevoEstado, updatedAt: new Date().toISOString() })
            .eq("id", pedidoId);

        // Dejamos registro del cambio en el historial del pedido.
        if (!error) {
            await supabase.from("pedido_historial").insert({
                id: crypto.randomUUID(),
                pedidoId,
                estado: nuevoEstado,
                descripcion: "Estado actualizado por la tienda.",
            });
        } else {
            window.alert(`No se pudo actualizar el estado: ${error.message}`);
            setEstado(estadoActual);
        }
        setGuardando(false);
        router.refresh();
    };

    return (
        <Select value={estado} onValueChange={handleChange} disabled={guardando}>
            <SelectTrigger className="w-40">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {ESTADOS.map((e) => (
                    <SelectItem key={e.value} value={e.value}>
                        {e.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
