// types/tienda.types.ts
export interface Tienda {
  id: string;
  nombre: string;
  slug: string;
  logo: string | null;
  portada: string | null;
  descripcion: string | null;
  categoria: string;
  ubicacion: string | null;
  telefono: string | null;
  email: string | null;
  sitioWeb: string | null;
  esOficial: boolean;
  esVerificada: boolean;
  tiempoRespuesta: string;
  nivel: "BRONCE" | "PLATA" | "ORO" | "PLATINO";
  rating: number;
  totalReviews: number;
  productosDestacados: number;
  configuracion: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface TiendaConfig {
  id: string;
  tiendaId: string;
  mercadoPago: boolean;
  mercadoPagoKey: string | null;
  stripe: boolean;
  stripeKey: string | null;
  instagram: boolean;
  instagramToken: string | null;
  googleShopping: boolean;
  googleToken: string | null;
  whatsapp: boolean;
  whatsappNumber: string | null;
  colores: any;
  customDomain: string | null;
}

export interface TiendaFilters {
  categoria?: string;
  ubicacion?: string;
  ratingMin?: number;
  oficiales?: boolean;
  envioGratis?: boolean;
  ordenarPor?: "relevancia" | "rating" | "productos" | "reviews";
}
