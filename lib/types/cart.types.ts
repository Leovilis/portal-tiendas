// src/lib/types/cart.types.ts
export interface CartItem {
    productoId: string;
    tiendaId: string;
    tiendaNombre?: string;
    nombre: string;
    slug: string;
    precio: number;
    precioOferta?: number;
    imagen?: string;
    stock: number;
    cantidad: number;
}
