// src/components/tiendas/TiendasExplorer.tsx
"use client";

import { useMemo, useState } from "react";
import { TiendaGrid } from "@/components/tiendas/TiendaGrid";
import { TiendaFilters } from "@/components/tiendas/TiendaFilters";
import { TiendaSearch } from "@/components/tiendas/TiendaSearch";
import type { TiendaCardProps } from "@/components/tiendas/TiendaCard";

interface FiltersState {
    categoria: string[];
    ubicacion: string;
    ratingMin: number;
    oficiales: boolean;
    envioGratis: boolean;
}

function normalizar(texto: string) {
    return texto
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase();
}

interface TiendasExplorerProps {
    tiendas: TiendaCardProps[];
}

export function TiendasExplorer({ tiendas }: TiendasExplorerProps) {
    const [query, setQuery] = useState("");
    const [filters, setFilters] = useState<FiltersState>({
        categoria: [],
        ubicacion: "",
        ratingMin: 0,
        oficiales: false,
        envioGratis: false,
    });

    const tiendasFiltradas = useMemo(() => {
        return tiendas.filter((tienda) => {
            if (query && !normalizar(tienda.nombre).includes(normalizar(query))) {
                return false;
            }
            if (
                filters.categoria.length > 0 &&
                !filters.categoria.some((catId) => normalizar(tienda.categoria).startsWith(catId))
            ) {
                return false;
            }
            if (filters.ubicacion && tienda.ubicacion !== filters.ubicacion) {
                return false;
            }
            if (filters.ratingMin > 0 && tienda.rating < filters.ratingMin) {
                return false;
            }
            if (filters.oficiales && !tienda.esOficial) {
                return false;
            }
            return true;
        });
    }, [tiendas, query, filters]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Explorá tiendas</h1>
                <p className="text-muted-foreground">
                    Descubrí los mejores vendedores de PortalTiendas
                </p>
            </div>

            <TiendaSearch onSearch={setQuery} className="max-w-xl mb-6" />

            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="lg:w-72">
                    <TiendaFilters onFilterChange={setFilters} />
                </aside>

                <main className="flex-1">
                    <p className="text-sm text-muted-foreground mb-4">
                        Mostrando {tiendasFiltradas.length} de {tiendas.length} tiendas
                    </p>
                    <TiendaGrid tiendas={tiendasFiltradas} columns={3} />
                </main>
            </div>
        </div>
    );
}
