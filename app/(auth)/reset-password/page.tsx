// src/app/(auth)/reset-password/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
    const router = useRouter();
    const [verificandoSesion, setVerificandoSesion] = useState(true);
    const [sesionValida, setSesionValida] = useState(false);

    const [password, setPassword] = useState("");
    const [confirmar, setConfirmar] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [listo, setListo] = useState(false);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
            setSesionValida(!!user);
            setVerificandoSesion(false);
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }
        if (password !== confirmar) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setLoading(true);
        const supabase = createClient();
        const { error: updateError } = await supabase.auth.updateUser({ password });
        setLoading(false);

        if (updateError) {
            setError(updateError.message);
            return;
        }

        setListo(true);
        setTimeout(() => {
            router.push("/login");
        }, 2000);
    };

    if (verificandoSesion) {
        return null;
    }

    if (!sesionValida) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-muted/30">
                <Card className="w-full max-w-md">
                    <CardContent className="p-8 text-center space-y-3">
                        <h1 className="text-lg font-semibold">Este enlace ya no es válido</h1>
                        <p className="text-sm text-muted-foreground">
                            Puede haber expirado o ya haberse usado. Pedí uno nuevo para cambiar tu
                            contraseña.
                        </p>
                        <Link
                            href="/forgot-password"
                            className="inline-block text-sm text-primary font-medium hover:underline pt-2"
                        >
                            Pedir un enlace nuevo
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (listo) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-muted/30">
                <Card className="w-full max-w-md">
                    <CardContent className="p-8 text-center space-y-3">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <h1 className="text-lg font-semibold">Contraseña actualizada</h1>
                        <p className="text-sm text-muted-foreground">Ya podés iniciar sesión con tu nueva contraseña.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-muted/30">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <Store className="h-7 w-7 text-primary" />
                        <span className="font-bold text-2xl">PortalTiendas</span>
                    </Link>
                    <h1 className="text-xl font-semibold mt-4">Elegí una contraseña nueva</h1>
                </div>

                <Card>
                    <CardContent className="p-6 space-y-5">
                        {error && (
                            <div className="rounded-md bg-destructive/10 text-destructive text-sm p-3">{error}</div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="password">Contraseña nueva</Label>
                                <div className="relative">
                                    <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Mínimo 6 caracteres"
                                        className="pl-8 pr-9"
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="confirmar">Confirmar contraseña</Label>
                                <div className="relative">
                                    <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="confirmar"
                                        type={showPassword ? "text" : "password"}
                                        value={confirmar}
                                        onChange={(e) => setConfirmar(e.target.value)}
                                        placeholder="Repetí tu contraseña"
                                        className="pl-8"
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Guardando..." : "Guardar contraseña"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
