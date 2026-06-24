// components/dashboard/OrderTable.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Package } from "lucide-react";

const mockOrders = [
  {
    id: "ORD-001",
    cliente: "Juan Pérez",
    total: 45990,
    estado: "confirmado",
    fecha: "2024-01-15",
    productos: 3,
  },
  {
    id: "ORD-002",
    cliente: "María García",
    total: 129990,
    estado: "enviado",
    fecha: "2024-01-14",
    productos: 2,
  },
  {
    id: "ORD-003",
    cliente: "Carlos López",
    total: 24990,
    estado: "pendiente",
    fecha: "2024-01-14",
    productos: 1,
  },
];

export function OrderTable() {
  const [orders] = useState(mockOrders);

  const getStatusBadge = (status: string) => {
    const variants = {
      pendiente: "outline",
      confirmado: "default",
      preparando: "secondary",
      enviado: "info",
      entregado: "success",
      cancelado: "destructive",
    };
    const labels = {
      pendiente: "Pendiente",
      confirmado: "Confirmado",
      preparando: "Preparando",
      enviado: "Enviado",
      entregado: "Entregado",
      cancelado: "Cancelado",
    };
    return (
      <Badge variant={variants[status as keyof typeof variants] as any}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pedido</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">
                <div>
                  <p>{order.id}</p>
                  <p className="text-xs text-muted-foreground">{order.fecha}</p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p>{order.cliente}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.productos} productos
                  </p>
                </div>
              </TableCell>
              <TableCell>${order.total.toLocaleString()}</TableCell>
              <TableCell>{getStatusBadge(order.estado)}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/dashboard/pedidos/${order.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
