// src/components/tiendas/TiendaContact.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock, AtSign, Globe, MessageCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface TiendaContactProps {
    nombre: string;
    contacto: {
        direccion?: string;
        telefono?: string;
        email?: string;
        horario?: string;
    };
    redesSociales?: {
        instagram?: string;
        facebook?: string;
        whatsapp?: string;
    };
    className?: string;
}

export function TiendaContact({ nombre, contacto, redesSociales, className }: TiendaContactProps) {
    const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
    const [enviado, setEnviado] = useState(false);
    const [enviando, setEnviando] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setEnviando(true);
        // Aquí conectarías con tu API para enviar el mensaje a la tienda
        setTimeout(() => {
            setEnviando(false);
            setEnviado(true);
            setForm({ nombre: "", email: "", mensaje: "" });
        }, 700);
    };

    return (
        <div className={cn("grid gap-6 md:grid-cols-2", className)}>
            <Card>
                <CardContent className="space-y-4 p-5">
                    <h3 className="font-bold text-lg">Información de contacto</h3>
                    <ul className="space-y-3 text-sm">
                        {contacto.direccion && (
                            <li className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                                <span>{contacto.direccion}</span>
                            </li>
                        )}
                        {contacto.telefono && (
                            <li className="flex items-start gap-3">
                                <Phone className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                                <a href={`tel:${contacto.telefono}`} className="hover:text-primary transition-colors">
                                    {contacto.telefono}
                                </a>
                            </li>
                        )}
                        {contacto.email && (
                            <li className="flex items-start gap-3">
                                <Mail className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                                <a href={`mailto:${contacto.email}`} className="hover:text-primary transition-colors">
                                    {contacto.email}
                                </a>
                            </li>
                        )}
                        {contacto.horario && (
                            <li className="flex items-start gap-3">
                                <Clock className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                                <span>{contacto.horario}</span>
                            </li>
                        )}
                    </ul>

                    {redesSociales && (redesSociales.instagram || redesSociales.facebook || redesSociales.whatsapp) && (
                        <div className="flex items-center gap-2 pt-2">
                            {redesSociales.instagram && (
                                <a
                                    href={redesSociales.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                                >
                                    <AtSign className="h-4 w-4" />
                                </a>
                            )}
                            {redesSociales.facebook && (
                                <a
                                    href={redesSociales.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                                >
                                    <Globe className="h-4 w-4" />
                                </a>
                            )}
                            {redesSociales.whatsapp && (
                                <a
                                    href={redesSociales.whatsapp}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="WhatsApp"
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                                >
                                    <MessageCircle className="h-4 w-4" />
                                </a>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-5">
                    <h3 className="font-bold text-lg mb-1">Enviar un mensaje</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Escribile directamente a {nombre}, normalmente responde rápido.
                    </p>

                    {enviado ? (
                        <div className="rounded-md bg-green-50 text-green-700 text-sm p-3 dark:bg-green-950/40 dark:text-green-400">
                            ¡Tu mensaje fue enviado! La tienda te responderá pronto.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="contact-nombre">Nombre</Label>
                                <Input
                                    id="contact-nombre"
                                    required
                                    value={form.nombre}
                                    onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                                    placeholder="Tu nombre"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="contact-email">Email</Label>
                                <Input
                                    id="contact-email"
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                                    placeholder="tu@email.com"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="contact-mensaje">Mensaje</Label>
                                <textarea
                                    id="contact-mensaje"
                                    required
                                    value={form.mensaje}
                                    onChange={(e) => setForm((f) => ({ ...f, mensaje: e.target.value }))}
                                    placeholder="¿En qué te podemos ayudar?"
                                    rows={4}
                                    className="w-full rounded-md border border-input bg-input/20 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                                />
                            </div>
                            <Button type="submit" className="w-full gap-2" disabled={enviando}>
                                <Send className="h-4 w-4" />
                                {enviando ? "Enviando..." : "Enviar mensaje"}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
