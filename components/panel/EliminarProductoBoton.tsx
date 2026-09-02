// src/components/panel/EliminarProductoBoton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function EliminarProductoBoton({ productoId, nombre }: { productoId: string; nombre: string }) {
    const router = useRouter();
    const [eliminando, setEliminando] = useState(false);

    const handleClick = async () => {
        if (!window.confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) return;
        setEliminando(true);
        const supabase = createClient();
        const { error } = await supabase.from("productos").delete().eq("id", productoId);
        if (error) {
            window.alert(`No se pudo eliminar: ${error.message}`);
            setEliminando(false);
            return;
        }
        router.refresh();
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            onClick={handleClick}
            disabled={eliminando}
            aria-label={`Eliminar ${nombre}`}
        >
            {eliminando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
    );
}
