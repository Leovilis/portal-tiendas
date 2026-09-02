// src/components/layout/Footer.tsx
import Link from "next/link";
import { Store, AtSign, Globe, Link2, Mail, Phone } from "lucide-react";
import { SITE_NAME, SITE_DESCRIPTION, FOOTER_LINKS, SOCIAL_LINKS, CONTACT_INFO } from "@/lib/constants";

const SOCIAL_ICONS = {
    Instagram: AtSign,
    Facebook: Globe,
    X: Link2,
} as const;

export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t bg-muted/30">
            <div className="container mx-auto px-4 py-12">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
                    {/* Marca */}
                    <div className="space-y-3">
                        <Link href="/" className="flex items-center space-x-2">
                            <Store className="h-6 w-6 text-primary" />
                            <span className="font-bold text-xl">{SITE_NAME}</span>
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            {SITE_DESCRIPTION}
                        </p>
                        <div className="flex items-center gap-3 pt-1">
                            {SOCIAL_LINKS.map((social) => {
                                const Icon = SOCIAL_ICONS[social.label as keyof typeof SOCIAL_ICONS];
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-muted-foreground ring-1 ring-border hover:text-primary hover:ring-primary/40 transition-colors"
                                    >
                                        <Icon className="h-4 w-4" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Marketplace */}
                    <div>
                        <h3 className="font-semibold text-sm mb-3">Marketplace</h3>
                        <ul className="space-y-2">
                            {FOOTER_LINKS.marketplace.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Vendedores */}
                    <div>
                        <h3 className="font-semibold text-sm mb-3">Vendedores</h3>
                        <ul className="space-y-2">
                            {FOOTER_LINKS.vendedores.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Ayuda */}
                    <div>
                        <h3 className="font-semibold text-sm mb-3">Ayuda</h3>
                        <ul className="space-y-2">
                            {FOOTER_LINKS.ayuda.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div>
                        <h3 className="font-semibold text-sm mb-3">Contacto</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-3.5 w-3.5 shrink-0" />
                                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-primary transition-colors">
                                    {CONTACT_INFO.email}
                                </a>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="h-3.5 w-3.5 shrink-0" />
                                <a href={`tel:${CONTACT_INFO.telefono}`} className="hover:text-primary transition-colors">
                                    {CONTACT_INFO.telefono}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-xs text-muted-foreground">
                        © {year} {SITE_NAME}. Todos los derechos reservados.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <Link href="/terminos" className="hover:text-primary transition-colors">
                            Términos y condiciones
                        </Link>
                        <Link href="/privacidad" className="hover:text-primary transition-colors">
                            Privacidad
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
