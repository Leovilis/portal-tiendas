// src/lib/types/product.types.ts
export interface Producto {
    id: string;
    tiendaId: string;
    nombre: string;
    slug: string;
    descripcion: string;
    precio: number;
    precioOferta?: number;
    imagenes: string[];
    categoria: string;
    subcategoria?: string;
    stock: number;
    rating: number;
    totalReviews: number;
    esNuevo?: boolean;
    esDestacado?: boolean;
    tieneEnvioGratis?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// src/lib/types/product.types.ts
export interface ProductoFilters {
    categoria?: string;
    precioMin?: number;  // ✅ Ya es opcional, puede ser undefined
    precioMax?: number;  // ✅ Ya es opcional, puede ser undefined
    ratingMin?: number;
    ordenarPor?: "relevancia" | "precio_asc" | "precio_desc" | "rating" | "nuevos";
    soloOferta?: boolean;
    soloEnvioGratis?: boolean;
}

export interface Categoria {
    id: string;
    nombre: string;
    slug: string;
    icono?: string;
    subcategorias?: string[];
}