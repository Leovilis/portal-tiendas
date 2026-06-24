// app/(dashboard)/dashboard/page.tsx
"use client";

import { StatsCard } from "@/components/dashboard/StatsCard";
import { ProductTable } from "@/components/dashboard/ProductTable";
import { OrderTable } from "@/components/dashboard/OrderTable";
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
export default function DashboardPage() {
  // Datos de ejemplo
  const stats = [
    {
      title: "Productos",
      value: "45",
      icon: <Package className="h-5 w-5" />,
      trend: "up" as const,
      trendValue: "+12%",
      description: "vs mes anterior",
    },
    {
      title: "Pedidos",
      value: "128",
      icon: <ShoppingCart className="h-5 w-5" />,
      trend: "up" as const,
      trendValue: "+8%",
      description: "vs mes anterior",
    },
    {
      title: "Clientes",
      value: "342",
      icon: <Users className="h-5 w-5" />,
      trend: "up" as const,
      trendValue: "+23%",
      description: "vs mes anterior",
    },
    {
      title: "Ventas",
      value: "$1,234,567",
      icon: <TrendingUp className="h-5 w-5" />,
      trend: "up" as const,
      trendValue: "+15%",
      description: "vs mes anterior",
    },
  ];

  // Estadísticas de pedidos
  const orderStats = [
    {
      label: "Pendientes",
      value: 12,
      icon: Clock,
      color: "text-yellow-600 bg-yellow-50",
    },
    {
      label: "Confirmados",
      value: 8,
      icon: CheckCircle,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Enviados",
      value: 45,
      icon: Eye,
      color: "text-purple-600 bg-purple-50",
    },
    {
      label: "Entregados",
      value: 63,
      icon: CheckCircle,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Cancelados",
      value: 3,
      icon: XCircle,
      color: "text-red-600 bg-red-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen de tu tienda en tiempo real
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Estado de pedidos */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {orderStats.map((stat) => (
          <div key={stat.label} className="p-4 rounded-lg border bg-card">
            <div className="flex items-center justify-between">
              <div className={cn("p-2 rounded-lg", stat.color)}>
                <stat.icon className="h-4 w-4" />
              </div>
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tablas */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Últimos productos</h2>
          <ProductTable />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Últimos pedidos</h2>
          <OrderTable />
        </div>
      </div>
    </div>
  );
}
