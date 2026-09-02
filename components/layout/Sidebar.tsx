// src/components/layout/Sidebar.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Star, MessageCircle, Info, ClipboardList, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Los íconos se referencian por nombre (string), nunca como componente: este
// componente es "use client" y recibe `sections` desde un Server Component,
// que no puede pasar funciones/clases (los componentes de lucide-react) a
// través del límite server/client — solo datos serializables.
const ICONOS: Record<string, LucideIcon> = {
    Info,
    Package,
    Star,
    MessageCircle,
    ClipboardList,
};

interface SidebarSection {
    id: string;
    label: string;
    icon: keyof typeof ICONOS;
    count?: number;
}

interface SidebarProps {
    categorias?: string[];
    productCount?: number;
    reviewCount?: number;
    sections?: SidebarSection[];
    className?: string;
}

const SECTIONS_DEFAULT: SidebarSection[] = [
    { id: "info", label: "Información", icon: "Info" },
    { id: "productos", label: "Productos", icon: "Package" },
    { id: "resenas", label: "Reseñas", icon: "Star" },
    { id: "contacto", label: "Contacto", icon: "MessageCircle" },
];

export function Sidebar({ categorias = [], productCount, reviewCount, sections, className }: SidebarProps) {
    const [activeId, setActiveId] = useState<string>("info");
    const secciones = sections ?? SECTIONS_DEFAULT;

    useEffect(() => {
        const elementos = secciones
            .map((s) => document.getElementById(s.id))
            .filter((el): el is HTMLElement => el !== null);

        if (elementos.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.find((entry) => entry.isIntersecting);
                if (visible?.target.id) {
                    setActiveId(visible.target.id);
                }
            },
            { rootMargin: "-40% 0px -50% 0px" }
        );

        elementos.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [secciones.map((s) => s.id).join(",")]);

    const counts: Record<string, number | undefined> = {
        productos: productCount,
        resenas: reviewCount,
    };

    return (
        <aside className={cn("space-y-4", className)}>
            <Card className="sticky top-24">
                <CardContent className="p-3">
                    <nav className="space-y-1">
                        {secciones.map((section) => {
                            const Icon = ICONOS[section.icon] ?? Info;
                            const isActive = activeId === section.id;
                            const count = counts[section.id];
                            return (
                                <a
                                    key={section.id}
                                    href={`#${section.id}`}
                                    className={cn(
                                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <Icon className="h-4 w-4 shrink-0" />
                                    <span className="flex-1">{section.label}</span>
                                    {typeof count === "number" && (
                                        <Badge
                                            variant={isActive ? "secondary" : "outline"}
                                            className={cn(isActive && "bg-primary-foreground/20 text-primary-foreground")}
                                        >
                                            {count}
                                        </Badge>
                                    )}
                                </a>
                            );
                        })}
                    </nav>

                    {categorias.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase mb-2">
                                Categorías
                            </p>
                            <div className="flex flex-wrap gap-1.5 px-3">
                                {categorias.map((cat) => (
                                    <Badge key={cat} variant="outline" className="capitalize">
                                        {cat}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </aside>
    );
}
