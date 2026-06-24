// types/product.types.ts
export interface Producto {
  id: string;
  tiendaId: string;
  nombre: string;
  slug: string;
  descripcion: string;
  precio: number;
  precioOferta: number | null;
  imagenes: string[];
  categoria: string;
  subcategoria: string | null;
  stock: number;
  rating: number;
  totalReviews: number;
  esNuevo: boolean;
  esDestacado: boolean;
  tieneEnvioGratis: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductoFilters {
  categoria?: string;
  precioMin?: number;
  precioMax?: number;
  ratingMin?: number;
  ordenarPor?:
    | "relevancia"
    | "precio_asc"
    | "precio_desc"
    | "rating"
    | "nuevos";
  soloOferta?: boolean;
  soloEnvioGratis?: boolean;
}
