// components/dashboard/ProductTable.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { Edit, Trash2, Eye } from "lucide-react";

const mockProducts = [
  {
    id: "1",
    nombre: "Camiseta Premium Algodón",
    imagen: "https://picsum.photos/seed/camiseta/200/200",
    precio: 19990,
    stock: 25,
    estado: "activo",
    categoria: "Ropa",
  },
  {
    id: "2",
    nombre: "Auriculares Bluetooth Pro",
    imagen: "https://picsum.photos/seed/auriculares/200/200",
    precio: 89990,
    stock: 5,
    estado: "bajo-stock",
    categoria: "Electrónica",
  },
  {
    id: "3",
    nombre: "Lámpara LED Decorativa",
    imagen: "https://picsum.photos/seed/lampara/200/200",
    precio: 34990,
    stock: 15,
    estado: "activo",
    categoria: "Hogar",
  },
];

export function ProductTable() {
  const [products] = useState(mockProducts);

  const getStatusBadge = (status: string) => {
    const variants = {
      activo: "default",
      "bajo-stock": "warning",
      agotado: "destructive",
    };
    const labels = {
      activo: "Activo",
      "bajo-stock": "Bajo stock",
      agotado: "Agotado",
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
            <TableHead>Producto</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="flex items-center gap-3">
                <Image
                  src={product.imagen}
                  alt={product.nombre}
                  width={40}
                  height={40}
                  className="rounded-lg object-cover"
                />
                <div>
                  <p className="font-medium">{product.nombre}</p>
                  <p className="text-xs text-muted-foreground">
                    {product.categoria}
                  </p>
                </div>
              </TableCell>
              <TableCell>${product.precio.toLocaleString()}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{getStatusBadge(product.estado)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/productos/${product.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/productos/${product.id}/editar`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
