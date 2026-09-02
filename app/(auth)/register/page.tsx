// src/app/(auth)/register/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Store, Mail, Lock, User, Eye, EyeOff, ShoppingBag, Building2, MailCheck } from "lucide-react";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/lib/types/auth.types";

export default function RegisterPage() {
    const router = useRouter();

    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmar, setConfirmar] = useState("");
    const [tipoCuenta, setTipoCuenta] = useState<Extract<UserRole, "USER" | "VENDEDOR">>("USER");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [revisarEmail, setRevisarEmail] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!nombre || !email || !password || !confirmar) {
            setError("Completá todos los campos para continuar.");
            return;
        }
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
        const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name: nombre, role: tipoCuenta },
                emailRedirectTo:
                    tipoCuenta === "VENDEDOR"
                        ? `${window.location.origin}/auth/callback?next=${encodeURIComponent("/tienda/crear")}`
                        : `${window.location.origin}/auth/callback`,
            },
        });
        setLoading(false);

        if (signUpError) {
            setError(
                signUpError.message === "User already registered"
                    ? "Ya existe una cuenta con ese email. Iniciá sesión."
                    : signUpError.message
            );
            return;
        }

        if (data.session) {
            // La confirmación por email está desactivada en el proyecto: ya quedó logueado.
            // Si se registró como vendedor, lo mandamos directo a crear su tienda.
            router.push(tipoCuenta === "VENDEDOR" ? "/tienda/crear" : "/");
            router.refresh();
            return;
        }

        setRevisarEmail(true);
    };

    const handleGoogle = async () => {
        setError(null);
        setGoogleLoading(true);
        const supabase = createClient();
        const { error: oauthError } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        });

        if (oauthError) {
            setError(oauthError.message);
            setGoogleLoading(false);
        }
    };

    if (revisarEmail) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-muted/30">
                <Card className="w-full max-w-md">
                    <CardContent className="p-8 text-center space-y-3">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <MailCheck className="h-6 w-6" />
                        </div>
                        <h1 className="text-lg font-semibold">Revisá tu email</h1>
                        <p className="text-sm text-muted-foreground">
                            Te enviamos un enlace de confirmación a <strong>{email}</strong>. Abrilo para
                            activar tu cuenta y empezar a usar PortalTiendas.
                        </p>
                        <Link href="/login" className="inline-block text-sm text-primary font-medium hover:underline pt-2">
                            Volver a iniciar sesión
                        </Link>
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
                    <h1 className="text-xl font-semibold mt-4">Creá tu cuenta</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Empezá a comprar o vender en minutos
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
                                <Label>Quiero registrarme como</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setTipoCuenta("USER")}
                                        className={cn(
                                            "flex flex-col items-center gap-1.5 rounded-md border p-3 text-sm transition-colors",
                                            tipoCuenta === "USER"
                                                ? "border-primary bg-primary/5 text-primary"
                                                : "hover:bg-muted"
                                        )}
                                    >
                                        <ShoppingBag className="h-5 w-5" />
                                        Comprador
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setTipoCuenta("VENDEDOR")}
                                        className={cn(
                                            "flex flex-col items-center gap-1.5 rounded-md border p-3 text-sm transition-colors",
                                            tipoCuenta === "VENDEDOR"
                                                ? "border-primary bg-primary/5 text-primary"
                                                : "hover:bg-muted"
                                        )}
                                    >
                                        <Building2 className="h-5 w-5" />
                                        Vendedor
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="nombre">Nombre completo</Label>
                                <div className="relative">
                                    <User className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="nombre"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        placeholder="Tu nombre y apellido"
                                        className="pl-8"
                                        autoComplete="name"
                                    />
                                </div>
                            </div>

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
                                <Label htmlFor="password">Contraseña</Label>
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

                            <Button type="submit" className="w-full" disabled={loading || googleLoading}>
                                {loading ? "Creando cuenta..." : "Crear cuenta"}
                            </Button>

                            <p className="text-xs text-muted-foreground text-center">
                                Al registrarte aceptás nuestros Términos y condiciones y Política de privacidad.
                            </p>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-sm text-muted-foreground">
                    ¿Ya tenés cuenta?{" "}
                    <Link href="/login" className="text-primary font-medium hover:underline">
                        Iniciá sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}
