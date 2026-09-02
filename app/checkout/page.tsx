// src/app/checkout/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { createClient } from "@/lib/supabase/client";

const METODOS_PAGO = [
    { value: "Transferencia bancaria", label: "Transferencia bancaria" },
    { value: "Efectivo al recibir", label: "Efectivo al recibir" },
    { value: "A coordinar con el vendedor", label: "A coordinar con el vendedor" },
];

export default function CheckoutPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { items, subtotal, vaciarCarrito, hidratado } = useCart();

    const [calle, setCalle] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [codigoPostal, setCodigoPostal] = useState("");
    const [notas, setNotas] = useState("");
    const [metodoPago, setMetodoPago] = useState(METODOS_PAGO[0].value);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const grupos = useMemo(() => {
        const mapa = new Map<string, typeof items>();
        for (const item of items) {
            const lista = mapa.get(item.tiendaId) ?? [];
            lista.push(item);
            mapa.set(item.tiendaId, lista);
        }
        return Array.from(mapa.entries());
    }, [items]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push(`/login?next=${encodeURIComponent("/checkout")}`);
        }
    }, [authLoading, user, router]);

    useEffect(() => {
        if (hidratado && items.length === 0) {
            router.push("/carrito");
        }
    }, [hidratado, items.length, router]);

    const handleConfirmar = async () => {
        if (!calle || !ciudad) {
            setError("Completá al menos la calle y la ciudad de envío.");
            return;
        }
        setError(null);
        setEnviando(true);

        const supabase = createClient();
        const direccion = { calle, ciudad, codigoPostal, notas };
        const pedidosCreados: string[] = [];

        for (const [tiendaId, itemsTienda] of grupos) {
            const { data, error: rpcError } = await supabase.rpc("crear_pedido", {
                p_tienda_id: tiendaId,
                p_direccion: direccion,
                p_metodo_pago: metodoPago,
                p_items: itemsTienda.map((i) => ({ productoId: i.productoId, cantidad: i.cantidad })),
            });

            if (rpcError) {
                setError(
                    pedidosCreados.length > 0
                        ? `Se confirmaron ${pedidosCreados.length} pedido(s), pero uno falló: ${rpcError.message}`
                        : rpcError.message
                );
                setEnviando(false);
                return;
            }

            if (data) pedidosCreados.push(data as string);
        }

        vaciarCarrito();

        // Si el carrito era de una sola tienda y esa tienda tiene MercadoPago
        // activado, la llevamos directo a pagar. Con varias tiendas (cada una
        // cobra a su propia cuenta), cada pago se hace por separado desde
        // "Mis pedidos".
        if (pedidosCreados.length === 1) {
            try {
                const res = await fetch("/api/mercadopago/crear-preferencia", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ pedidoId: pedidosCreados[0] }),
                });
                const data = await res.json();
                if (res.ok && data.configurado && data.initPoint) {
                    window.location.href = data.initPoint;
                    return;
                }
            } catch {
                // Si falla, seguimos al flujo normal (coordinar con el vendedor).
            }
        }

        router.push("/pedidos?confirmado=1");
    };

    if (!hidratado || authLoading || !user || items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-3xl font-bold mb-2">Confirmar pedido</h1>
            <p className="text-muted-foreground mb-8">
                Si la tienda tiene el cobro online activado, después de confirmar te llevamos a pagar
                con MercadoPago. Si no, coordinás el pago directamente con ella usando el método que
                elijas abajo.
            </p>

            <div className="space-y-6">
                <Card>
                    <CardContent className="p-5 space-y-4">
                        <h2 className="font-semibold">Dirección de envío</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5 sm:col-span-2">
                                <Label htmlFor="calle">Calle y número</Label>
                                <Input id="calle" value={calle} onChange={(e) => setCalle(e.target.value)} required />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="ciudad">Ciudad</Label>
                                <Input id="ciudad" value={ciudad} onChange={(e) => setCiudad(e.target.value)} required />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="cp">Código postal</Label>
                                <Input id="cp" value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} />
                            </div>
                            <div className="space-y-1.5 sm:col-span-2">
                                <Label htmlFor="notas">Notas para la entrega (opcional)</Label>
                                <Input id="notas" value={notas} onChange={(e) => setNotas(e.target.value)} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-5 space-y-4">
                        <h2 className="font-semibold">Método de pago</h2>
                        <Select value={metodoPago} onValueChange={setMetodoPago}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {METODOS_PAGO.map((m) => (
                                    <SelectItem key={m.value} value={m.value}>
                                        {m.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-5 space-y-3">
                        <h2 className="font-semibold">Resumen</h2>
                        {grupos.map(([tiendaId, itemsTienda]) => (
                            <div key={tiendaId} className="space-y-1.5">
                                {itemsTienda.map((item) => (
                                    <div key={item.productoId} className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {item.cantidad}x {item.nombre}
                                        </span>
                                        <span>
                                            ${((item.precioOferta ?? item.precio) * item.cantidad).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ))}
                        <Separator />
                        <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span>${subtotal.toLocaleString()}</span>
                        </div>
                        {grupos.length > 1 && (
                            <p className="text-xs text-muted-foreground">
                                Se van a crear {grupos.length} pedidos separados, uno por tienda.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {error && (
                    <div className="rounded-md bg-destructive/10 text-destructive text-sm p-3">{error}</div>
                )}

                <Button size="lg" className="w-full gap-2" onClick={handleConfirmar} disabled={enviando}>
                    {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    {enviando ? "Confirmando..." : "Confirmar pedido"}
                </Button>

                <p className="text-center text-sm">
                    <Link href="/carrito" className="text-muted-foreground hover:text-primary transition-colors">
                        Volver al carrito
                    </Link>
                </p>
            </div>
        </div>
    );
}
