// src/components/productos/ProductFilters.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductoFilters } from "@/types/product.types";

const CATEGORIAS = [
    { id: "ropa", label: "👕 Ropa y Moda" },
    { id: "electronica", label: "📱 Electrónica" },
    { id: "hogar", label: "🏠 Hogar y Deco" },
    { id: "deportes", label: "⚽ Deportes" },
    { id: "libros", label: "📚 Libros" },
    { id: "juguetes", label: "🎮 Juguetes" },
    { id: "salud", label: "💄 Salud y Belleza" },
    { id: "alimentos", label: "🍕 Alimentos" },
];

const RANGOS_PRECIO = [
    { min: 0, max: 10000, label: "Menos de $10.000" },
    { min: 10000, max: 25000, label: "$10.000 - $25.000" },
    { min: 25000, max: 50000, label: "$25.000 - $50.000" },
    { min: 50000, max: 100000, label: "$50.000 - $100.000" },
    { min: 100000, max: 9999999, label: "Más de $100.000" },
];

interface ProductFiltersProps {
    onFilterChange?: (filters: ProductoFilters) => void;
    className?: string;
}

export function ProductFilters({ onFilterChange, className }: ProductFiltersProps) {
    const [filters, setFilters] = useState<ProductoFilters>({
        categoria: undefined,
        precioMin: undefined,
        precioMax: undefined,
        ratingMin: undefined,
        ordenarPor: undefined,
        soloOferta: false,
        soloEnvioGratis: false,
    });

    const updateFilter = <K extends keyof ProductoFilters>(key: K, value: ProductoFilters[K]) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange?.(newFilters);
    };

    const clearFilters = () => {
        const resetFilters: ProductoFilters = {
            categoria: undefined,
            precioMin: undefined,
            precioMax: undefined,
            ratingMin: undefined,
            ordenarPor: undefined,
            soloOferta: false,
            soloEnvioGratis: false,
        };
        setFilters(resetFilters);
        onFilterChange?.(resetFilters);
    };

    // ✅ Corregido: permitir undefined
    const handlePrecioRange = (min?: number, max?: number) => {
        updateFilter("precioMin", min);
        updateFilter("precioMax", max);
    };

    const handleOrdenarPor = (value: string) => {
        if (value === "relevancia" || value === "precio_asc" || value === "precio_desc" ||
            value === "rating" || value === "nuevos") {
            updateFilter("ordenarPor", value);
        } else if (value === "") {
            updateFilter("ordenarPor", undefined);
        }
    };

    const hasFilters = Object.values(filters).some(v =>
        v !== undefined && v !== false && v !== ""
    );

    return (
        <div className={cn("space-y-6", className)}>
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Filtros</h3>
                {hasFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                        <X className="h-3 w-3 mr-1" />
                        Limpiar
                    </Button>
                )}
            </div>

            <div className="space-y-2">
                <Label className="font-semibold">Ordenar por</Label>
                <Select
                    value={filters.ordenarPor || "relevancia"}
                    onValueChange={handleOrdenarPor}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Relevancia" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="relevancia">Más relevantes</SelectItem>
                        <SelectItem value="precio_asc">Precio: menor a mayor</SelectItem>
                        <SelectItem value="precio_desc">Precio: mayor a menor</SelectItem>
                        <SelectItem value="rating">Mejor valorados</SelectItem>
                        <SelectItem value="nuevos">Más nuevos</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Accordion type="multiple" className="space-y-4">
                <AccordionItem value="categorias">
                    <AccordionTrigger>Categorías</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2">
                            {CATEGORIAS.map((cat) => (
                                <div key={cat.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={cat.id}
                                        checked={filters.categoria === cat.id}
                                        onCheckedChange={(checked) => {
                                            updateFilter("categoria", checked ? cat.id : undefined);
                                        }}
                                    />
                                    <Label htmlFor={cat.id} className="text-sm font-normal cursor-pointer">
                                        {cat.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="precio">
                    <AccordionTrigger>Precio</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4">
                            {RANGOS_PRECIO.map((rango) => (
                                <div key={rango.label} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`precio-${rango.min}`}
                                        checked={filters.precioMin === rango.min && filters.precioMax === rango.max}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                handlePrecioRange(rango.min, rango.max);
                                            } else if (filters.precioMin === rango.min) {
                                                handlePrecioRange(undefined, undefined);
                                            }
                                        }}
                                    />
                                    <Label htmlFor={`precio-${rango.min}`} className="text-sm font-normal cursor-pointer">
                                        {rango.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="rating">
                    <AccordionTrigger>Valoración</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2">
                            {[4, 3, 2, 1].map((stars) => (
                                <div key={stars} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`rating-${stars}`}
                                        checked={filters.ratingMin === stars}
                                        onCheckedChange={(checked) => {
                                            updateFilter("ratingMin", checked ? stars : undefined);
                                        }}
                                    />
                                    <Label htmlFor={`rating-${stars}`} className="text-sm font-normal cursor-pointer">
                                        {stars}+ estrellas {'⭐'.repeat(stars)}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="caracteristicas">
                    <AccordionTrigger>Características</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="oferta"
                                    checked={filters.soloOferta}
                                    onCheckedChange={(checked) => updateFilter("soloOferta", !!checked)}
                                />
                                <Label htmlFor="oferta" className="text-sm font-normal cursor-pointer">
                                    🏷️ En oferta
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="envio-gratis"
                                    checked={filters.soloEnvioGratis}
                                    onCheckedChange={(checked) => updateFilter("soloEnvioGratis", !!checked)}
                                />
                                <Label htmlFor="envio-gratis" className="text-sm font-normal cursor-pointer">
                                    🚚 Envío gratis
                                </Label>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}