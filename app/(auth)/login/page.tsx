// src/app/(auth)/login/page.tsx
"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Store, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const next = searchParams.get("next") || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState<string | null>(searchParams.get("error"));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError("Completá tu email y contraseña para continuar.");
            return;
        }

        setLoading(true);
        const supabase = createClient();
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);

        if (signInError) {
            setError(
                signInError.message === "Invalid login credentials"
                    ? "Email o contraseña incorrectos."
                    : signInError.message
            );
            return;
        }

        router.push(next);
        router.refresh();
    };

    const handleGoogle = async () => {
        setError(null);
        setGoogleLoading(true);
        const supabase = createClient();
        const { error: oauthError } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
            },
        });

        if (oauthError) {
            setError(oauthError.message);
            setGoogleLoading(false);
        }
        // si no hay error, el navegador redirige a Google y esta página se descarta
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-muted/30">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <Store className="h-7 w-7 text-primary" />
                        <span className="font-bold text-2xl">PortalTiendas</span>
                    </Link>
                    <h1 className="text-xl font-semibold mt-4">Bienvenido de nuevo</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Iniciá sesión para gestionar tu tienda o seguir comprando
                    </p>
                </div>

                <Card>
                    <CardContent className="p-6 space-y-5">
                        {error && (
                            <div className="rounded-md bg-destructive/10 text-destructive text-sm p-3">
                                {error}
                            </div>
                        )}

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full gap-2"
                            onClick={handleGoogle}
                            disabled={googleLoading || loading}
                        >
                            <GoogleIcon className="h-4 w-4" />
                            {googleLoading ? "Conectando..." : "Continuar con Google"}
                        </Button>

                        <div className="flex items-center gap-3">
                            <Separator className="flex-1" />
                            <span className="text-xs text-muted-foreground">o con tu email</span>
                            <Separator className="flex-1" />
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="tu@email.com"
                                        className="pl-8"
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Contraseña</Label>
                                    <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="pl-8 pr-9"
                                        autoComplete="current-password"
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

                            <Button type="submit" className="w-full" disabled={loading || googleLoading}>
                                {loading ? "Ingresando..." : "Iniciar sesión"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-sm text-muted-foreground">
                    ¿No tenés cuenta?{" "}
                    <Link href="/register" className="text-primary font-medium hover:underline">
                        Creá una gratis
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginForm />
        </Suspense>
    );
}
