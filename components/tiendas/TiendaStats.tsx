// src/components/tiendas/TiendaStats.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Package, Star, Clock, TrendingUp, Award } from "lucide-react";

interface TiendaStatsProps {
  stats: {
    productos: number;
    ventas: number;
    antiguedad: string;
    ratingPromedio: number;
    nivel?: "bronce" | "plata" | "oro" | "platino";
  };
}

const nivelConfig = {
  bronce: { color: "bg-amber-600", icon: Award },
  plata: { color: "bg-gray-400", icon: Award },
  oro: { color: "bg-yellow-500", icon: Award },
  platino: { color: "bg-slate-300", icon: Award },
};

export function TiendaStats({ stats }: TiendaStatsProps) {
  const nivel = stats.nivel || "bronce";
  const NivelIcon = nivelConfig[nivel].icon;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <Package className="h-8 w-8 text-primary" />
          <div>
            <p className="text-2xl font-bold">{stats.productos}</p>
            <p className="text-xs text-muted-foreground">Productos</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-[oklch(0.45_0.13_140)] dark:text-[oklch(0.72_0.12_140)]" />
          <div>
            <p className="text-2xl font-bold">{stats.ventas.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Ventas totales</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <Clock className="h-8 w-8 text-[oklch(0.42_0.1_200)] dark:text-[oklch(0.75_0.1_200)]" />
          <div>
            <p className="text-xl font-bold">{stats.antiguedad}</p>
            <p className="text-xs text-muted-foreground">En el portal</p>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-2 md:col-span-1">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${nivelConfig[nivel].color}`}>
              <NivelIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold capitalize">{nivel}</p>
              <p className="text-xs text-muted-foreground">Nivel</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-bold">{stats.ratingPromedio}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}