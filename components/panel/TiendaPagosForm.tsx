// src/components/panel/TiendaPagosForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Loader2, CheckCircle2, ShieldAlert, ExternalLink, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface TiendaPagosFormProps {
    tiendaId: string;
    configuracion: {
        mercadoPago: boolean;
        mercadoPagoKey: string | null;
    } | null;
}

export function TiendaPagosForm({ tiendaId, configuracion }: TiendaPagosFormProps) {
    const router = useRouter();
    const [accessToken, setAccessToken] = useState(configuracion?.mercadoPagoKey ?? "");
    const [mostrar, setMostrar] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [quitando, setQuitando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [guardado, setGuardado] = useState(false);

    const activo = !!(configuracion?.mercadoPago && configuracion?.mercadoPagoKey);
    const esPrueba = (configuracion?.mercadoPagoKey ?? "").startsWith("TEST-");

    const guardar = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setGuardado(false);

        const token = accessToken.trim();
        if (!token) {
            setError("Pegá tu Access Token de MercadoPago para activar el cobro.");
            return;
        }

        setGuardando(true);
        const supabase = createClient();

        const { error: upsertError } = await supabase.from("tienda_configs").upsert(
            {
                id: crypto.randomUUID(),
                tiendaId,
                mercadoPago: true,
                mercadoPagoKey: token,
                updatedAt: new Date().toISOString(),
            },
            { onConflict: "tiendaId", ignoreDuplicates: false }
        );

        setGuardando(false);

        if (upsertError) {
            setError(upsertError.message);
            return;
        }

        setGuardado(true);
        router.refresh();
    };

    const desactivar = async () => {
        setError(null);
        setQuitando(true);
        const supabase = createClient();

        const { error: updateError } = await supabase
            .from("tienda_configs")
            .update({ mercadoPago: false, mercadoPagoKey: null, updatedAt: new Date().toISOString() })
            .eq("tiendaId", tiendaId);

        setQuitando(false);

        if (updateError) {
            setError(updateError.message);
            return;
        }

        setAccessToken("");
        router.refresh();
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="p-5 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <h2 className="font-semibold">Cobro con MercadoPago</h2>
                        {activo ? (
                            <Badge className="gap-1 bg-green-600 hover:bg-green-600">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Activado {esPrueba && "(modo prueba)"}
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                                Sin activar
                            </Badge>
                        )}
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Cuando activás esto, el dinero de tus ventas va directo a tu propia cuenta de
                        MercadoPago — nosotros nunca lo tocamos. Necesitás tu <strong>Access Token</strong>{" "}
                        de MercadoPago: lo conseguís gratis en{" "}
                        <a
                            href="https://www.mercadopago.com.ar/developers/panel/app"
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:underline inline-flex items-center gap-1"
                        >
                            tu panel de desarrollador de MercadoPago
                            <ExternalLink className="h-3 w-3" />
                        </a>
                        , dentro de &quot;Tus integraciones&quot; → tu aplicación → &quot;Credenciales de
                        prueba&quot; (para probar sin plata real) o &quot;Credenciales de producción&quot;
                        (para cobrar de verdad).
                    </p>

                    <form onSubmit={guardar} className="space-y-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="accessToken">Access Token</Label>
                            <div className="relative">
                                <Input
                                    id="accessToken"
                                    type={mostrar ? "text" : "password"}
                                    value={accessToken}
                                    onChange={(e) => setAccessToken(e.target.value)}
                                    placeholder="TEST-0000000000000000-000000-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-000000000"
                                    className="pr-10 font-mono text-xs"
                                    autoComplete="off"
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrar((v) => !v)}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    aria-label={mostrar ? "Ocultar" : "Mostrar"}
                                >
                                    {mostrar ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            <p className="text-xs text-muted-foreground flex items-start gap-1.5 pt-1">
                                <ShieldAlert className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                                Este token es secreto: no lo compartas. Solo lo usamos desde nuestro
                                servidor para generar tus cobros, nunca se envía al navegador de tus
                                compradores.
                            </p>
                        </div>

                        {error && (
                            <div className="rounded-md bg-destructive/10 text-destructive text-sm p-3">{error}</div>
                        )}
                        {guardado && !error && (
                            <div className="rounded-md bg-green-50 text-green-700 text-sm p-3 dark:bg-green-950/40 dark:text-green-400">
                                Listo, ya podés recibir pagos por MercadoPago.
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <Button type="submit" disabled={guardando} className="gap-2">
                                {guardando && <Loader2 className="h-4 w-4 animate-spin" />}
                                {activo ? "Actualizar" : "Activar cobro"}
                            </Button>
                            {activo && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="gap-2 text-destructive hover:text-destructive"
                                    disabled={quitando}
                                    onClick={desactivar}
                                >
                                    {quitando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                    Desactivar
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-5 space-y-2 text-sm text-muted-foreground">
                    <h2 className="font-semibold text-foreground">Si no activás esto</h2>
                    <p>
                        Tu tienda sigue funcionando igual: los pedidos se van a seguir creando
                        normalmente, solo que tus compradores no van a ver el botón de pago online y
                        van a tener que coordinar el pago directamente con vos, como hasta ahora.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
