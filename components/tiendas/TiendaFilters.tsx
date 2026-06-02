// src/components/tiendas/TiendaFilters.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ✅ Tipos específicos
interface FiltersState {
  categoria: string[];
  ubicacion: string;
  ratingMin: number;
  oficiales: boolean;
  envioGratis: boolean;
}

type FilterKey = keyof FiltersState;
type FilterValue = FiltersState[FilterKey];

const CATEGORIAS = [
  { id: "ropa", label: "Ropa y Moda" },
  { id: "electronica", label: "Electrónica" },
  { id: "hogar", label: "Hogar y Deco" },
  { id: "deportes", label: "Deportes" },
  { id: "libros", label: "Libros" },
  { id: "juguetes", label: "Juguetes" },
  { id: "salud", label: "Salud y Belleza" },
  { id: "alimentos", label: "Alimentos" },
];

const UBICACIONES = [
  "Madrid", "Barcelona", "Valencia", "Sevilla", "Bilbao", "Málaga"
];

const ORDENES = [
  { value: "relevancia", label: "Más relevantes" },
  { value: "rating", label: "Mejor valorados" },
  { value: "productos", label: "Más productos" },
  { value: "reviews", label: "Más reseñas" },
];

interface FiltersContentProps {
  filters: FiltersState;
  onUpdateFilter: (key: FilterKey, value: FilterValue) => void;
  onClearFilters: () => void;
  hasFilters: boolean;
}

function FiltersContent({ filters, onUpdateFilter, onClearFilters, hasFilters }: FiltersContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between lg:hidden">
        <h3 className="font-semibold">Filtros</h3>
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          Limpiar todo
        </Button>
      </div>

      <div className="space-y-3">
        <Label className="font-semibold">Ordenar por</Label>
        <Select defaultValue="relevancia">
          <SelectTrigger>
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            {ORDENES.map((orden) => (
              <SelectItem key={orden.value} value={orden.value}>
                {orden.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-3">
        <Label className="font-semibold">Categorías</Label>
        <div className="space-y-2">
          {CATEGORIAS.map((categoria) => (
            <div key={categoria.id} className="flex items-center space-x-2">
              <Checkbox
                id={categoria.id}
                checked={filters.categoria.includes(categoria.id)}
                onCheckedChange={(checked) => {
                  const newCategorias = checked
                    ? [...filters.categoria, categoria.id]
                    : filters.categoria.filter(c => c !== categoria.id);
                  onUpdateFilter("categoria", newCategorias);
                }}
              />
              <Label htmlFor={categoria.id} className="text-sm font-normal cursor-pointer">
                {categoria.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <Label className="font-semibold">Ubicación</Label>
        <Select value={filters.ubicacion} onValueChange={(v) => onUpdateFilter("ubicacion", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Todas las ubicaciones" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas</SelectItem>
            {UBICACIONES.map((ubi) => (
              <SelectItem key={ubi} value={ubi}>{ubi}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-3">
        <Label className="font-semibold">Valoración mínima</Label>
        <div className="space-y-4">
          <Slider
            value={[filters.ratingMin]}
            onValueChange={(value) => onUpdateFilter("ratingMin", value[0])}
            max={5}
            step={0.5}
            className="w-full"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm">⭐</span>
            <span className="font-medium">{filters.ratingMin}</span>
            <span className="text-muted-foreground text-sm">estrellas</span>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <Label className="font-semibold">Características</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="oficiales"
              checked={filters.oficiales}
              onCheckedChange={(checked) => onUpdateFilter("oficiales", checked)}
            />
            <Label htmlFor="oficiales" className="text-sm font-normal cursor-pointer">
              Tiendas oficiales
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="envioGratis"
              checked={filters.envioGratis}
              onCheckedChange={(checked) => onUpdateFilter("envioGratis", checked)}
            />
            <Label htmlFor="envioGratis" className="text-sm font-normal cursor-pointer">
              Envío gratis
            </Label>
          </div>
        </div>
      </div>

      {hasFilters && (
        <Button variant="outline" onClick={onClearFilters} className="w-full">
          <X className="h-4 w-4 mr-2" />
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}

interface TiendaFiltersProps {
  onFilterChange?: (filters: FiltersState) => void;
  className?: string;
}

export function TiendaFilters({ onFilterChange, className }: TiendaFiltersProps) {
  const [filters, setFilters] = useState<FiltersState>({
    categoria: [],
    ubicacion: "",
    ratingMin: 0,
    oficiales: false,
    envioGratis: false,
  });

  const updateFilter = (key: FilterKey, value: FilterValue) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    const resetFilters: FiltersState = {
      categoria: [],
      ubicacion: "",
      ratingMin: 0,
      oficiales: false,
      envioGratis: false,
    };
    setFilters(resetFilters);
    onFilterChange?.(resetFilters);
  };

  const hasFilters = Object.values(filters).some(v => 
    Array.isArray(v) ? v.length > 0 : Boolean(v)
  );

  return (
    <div className={cn("space-y-4", className)}>
      <div className="hidden lg:block sticky top-24">
        <h3 className="font-bold text-lg mb-4">Filtros</h3>
        <FiltersContent 
          filters={filters}
          onUpdateFilter={updateFilter}
          onClearFilters={clearFilters}
          hasFilters={hasFilters}
        />
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden w-full">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filtros
            {hasFilters && (
              <span className="ml-2 bg-primary text-primary-foreground rounded-full px-1.5 text-xs">
                {Object.values(filters).filter(v => 
                  Array.isArray(v) ? v.length > 0 : Boolean(v)
                ).length}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:w-96 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filtrar tiendas</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FiltersContent 
              filters={filters}
              onUpdateFilter={updateFilter}
              onClearFilters={clearFilters}
              hasFilters={hasFilters}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}