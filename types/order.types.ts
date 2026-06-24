// types/order.types.ts
export interface Pedido {
  id: string;
  tiendaId: string;
  usuarioId: string | null;
  estado: EstadoPedido;
  total: number;
  subtotal: number;
  impuestos: number;
  envio: number;
  direccion: DireccionEnvio;
  metodoPago: string;
  transaccionId: string | null;
  pagado: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type EstadoPedido =
  | "PENDIENTE"
  | "CONFIRMADO"
  | "PREPARANDO"
  | "ENVIADO"
  | "ENTREGADO"
  | "CANCELADO"
  | "DEVUELTO";

export interface DireccionEnvio {
  calle: string;
  ciudad: string;
  codigoPostal: string;
  pais: string;
}

export interface PedidoProducto {
  id: string;
  pedidoId: string;
  productoId: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}
