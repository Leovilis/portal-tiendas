// src/app/(auth)/forgot-password/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, Mail, MailCheck, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [enviado, setEnviado] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email) {
            setError("Ingresá tu email para continuar.");
            return;
        }

        setLoading(true);
        const supabase = createClient();
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/reset-password")}`,
        });
        setLoading(false);

        // Por seguridad no distinguimos "email no existe" de "listo": siempre
        // mostramos el mismo mensaje, para no dejar buscar qué emails están
        // registrados.
        if (resetError) {
            setError(resetError.message);
            return;
        }

        setEnviado(true);
    };

    if (enviado) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-muted/30">
                <Card className="w-full max-w-md">
                    <CardContent className="p-8 text-center space-y-3">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <MailCheck className="h-6 w-6" />
                        </div>
                        <h1 className="text-lg font-semibold">Revisá tu email</h1>
                        <p className="text-sm text-muted-foreground">
                            Si <strong>{email}</strong> tiene una cuenta en PortalTiendas, te enviamos un
                            enlace para elegir una contraseña nueva.
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
                    <h1 className="text-xl font-semibold mt-4">Recuperar contraseña</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Te mandamos un enlace a tu email para elegir una nueva
                    </p>
                </div>

                <Card>
                    <CardContent className="p-6 space-y-5">
                        {error && (
                            <div className="rounded-md bg-destructive/10 text-destructive text-sm p-3">{error}</div>
                        )}

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

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Enviando..." : "Enviar enlace"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-sm">
                    <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1">
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Volver a iniciar sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}
