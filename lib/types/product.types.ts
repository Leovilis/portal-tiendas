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

// src/lib/types/product.types.ts
// Reseña genérica: se usa tanto para reseñas de productos como de tiendas.
export interface Resena {
    id: string;
    entidadId: string; // id del producto o de la tienda reseñada
    autor: string;
    avatar?: string;
    rating: number; // 1 a 5
    titulo?: string;
    comentario: string;
    fecha: Date;
    util: number; // cantidad de "le fue útil"
    compraVerificada?: boolean;
    respuestaTienda?: {
        mensaje: string;
        fecha: Date;
    };
}

export interface ResenasResumen {
    promedio: number;
    total: number;
    distribucion: Record<1 | 2 | 3 | 4 | 5, number>;
}
