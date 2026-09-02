// src/lib/mock-data.ts
// Datos de ejemplo centralizados. Cuando conectes tu API/BD, reemplaza estos
// arrays por llamadas reales (fetch, ORM, etc.) manteniendo las mismas formas.
import type { Producto, Resena } from "@/lib/types/product.types";

export interface TiendaCompleta {
    id: string;
    nombre: string;
    slug: string;
    logo: string;
    portada?: string;
    descripcion: string;
    categoria: string;
    ubicacion: string;
    rating: number;
    totalReviews: number;
    esOficial?: boolean;
    esVerificada?: boolean;
    tiempoRespuesta?: string;
    enOferta?: boolean;
    contacto: {
        direccion: string;
        telefono: string;
        email: string;
        horario: string;
    };
    redesSociales?: {
        instagram?: string;
        facebook?: string;
        whatsapp?: string;
    };
    stats: {
        productos: number;
        ventas: number;
        seguidores: number;
        antiguedad: string;
        ratingPromedio: number;
        nivel: "bronce" | "plata" | "oro" | "platino";
    };
}

export const MOCK_TIENDAS: TiendaCompleta[] = [
    {
        id: "1",
        nombre: "Moda & Estilo",
        slug: "moda-estilo",
        logo: "https://picsum.photos/64/64?random=1",
        portada: "https://picsum.photos/1200/300?random=101",
        descripcion:
            "Ropa y accesorios seleccionados para todos los estilos. Nuevas colecciones cada temporada, con envíos a toda la península.",
        categoria: "Ropa",
        ubicacion: "Madrid",
        rating: 4.8,
        totalReviews: 342,
        esOficial: true,
        esVerificada: true,
        tiempoRespuesta: "responde en minutos",
        contacto: {
            direccion: "Calle Gran Vía 45, Madrid",
            telefono: "+34 910 000 001",
            email: "contacto@modayestilo.com",
            horario: "Lunes a sábado, 9:00 - 20:00",
        },
        redesSociales: { instagram: "https://instagram.com", facebook: "https://facebook.com" },
        stats: {
            productos: 128,
            ventas: 5420,
            seguidores: 3200,
            antiguedad: "3 años",
            ratingPromedio: 4.8,
            nivel: "oro",
        },
    },
    {
        id: "2",
        nombre: "TecnoShop",
        slug: "tecnoshop",
        logo: "https://picsum.photos/64/64?random=2",
        portada: "https://picsum.photos/1200/300?random=102",
        descripcion:
            "Electrónica y gadgets con garantía oficial. Los últimos lanzamientos al mejor precio y soporte técnico especializado.",
        categoria: "Electrónica",
        ubicacion: "Barcelona",
        rating: 4.9,
        totalReviews: 891,
        esOficial: true,
        esVerificada: true,
        tiempoRespuesta: "responde en minutos",
        enOferta: true,
        contacto: {
            direccion: "Avinguda Diagonal 200, Barcelona",
            telefono: "+34 930 000 002",
            email: "soporte@tecnoshop.com",
            horario: "Lunes a viernes, 9:00 - 19:00",
        },
        redesSociales: { instagram: "https://instagram.com", whatsapp: "https://wa.me/34930000002" },
        stats: {
            productos: 256,
            ventas: 12300,
            seguidores: 8900,
            antiguedad: "5 años",
            ratingPromedio: 4.9,
            nivel: "platino",
        },
    },
    {
        id: "3",
        nombre: "Hogar & Deco",
        slug: "hogar-deco",
        logo: "https://picsum.photos/64/64?random=3",
        portada: "https://picsum.photos/1200/300?random=103",
        descripcion:
            "Todo para decorar tu hogar con estilo: muebles, iluminación y objetos de diseño a precios accesibles.",
        categoria: "Hogar",
        ubicacion: "Valencia",
        rating: 4.7,
        totalReviews: 156,
        esOficial: false,
        esVerificada: true,
        tiempoRespuesta: "responde en 1 hora",
        contacto: {
            direccion: "Calle Colón 12, Valencia",
            telefono: "+34 960 000 003",
            email: "hola@hogaryDeco.com",
            horario: "Lunes a sábado, 10:00 - 20:00",
        },
        redesSociales: { instagram: "https://instagram.com" },
        stats: {
            productos: 94,
            ventas: 2100,
            seguidores: 1450,
            antiguedad: "1 año",
            ratingPromedio: 4.7,
            nivel: "plata",
        },
    },
    {
        id: "4",
        nombre: "SportZone",
        slug: "sportzone",
        logo: "https://picsum.photos/64/64?random=4",
        portada: "https://picsum.photos/1200/300?random=104",
        descripcion:
            "Ropa y equipamiento deportivo para todos los niveles. Marcas líderes y asesoramiento personalizado.",
        categoria: "Deportes",
        ubicacion: "Sevilla",
        rating: 4.6,
        totalReviews: 210,
        esOficial: false,
        esVerificada: false,
        tiempoRespuesta: "responde en 2 horas",
        contacto: {
            direccion: "Calle Sierpes 8, Sevilla",
            telefono: "+34 950 000 004",
            email: "info@sportzone.com",
            horario: "Lunes a sábado, 9:00 - 21:00",
        },
        stats: {
            productos: 73,
            ventas: 980,
            seguidores: 620,
            antiguedad: "8 meses",
            ratingPromedio: 4.6,
            nivel: "bronce",
        },
    },
    {
        id: "5",
        nombre: "Librería Central",
        slug: "libreria-central",
        logo: "https://picsum.photos/64/64?random=5",
        portada: "https://picsum.photos/1200/300?random=105",
        descripcion:
            "Libros de todos los géneros, novedades editoriales y clásicos de siempre con envío en 24-48h.",
        categoria: "Libros",
        ubicacion: "Bilbao",
        rating: 4.9,
        totalReviews: 430,
        esOficial: true,
        esVerificada: true,
        tiempoRespuesta: "responde en minutos",
        contacto: {
            direccion: "Gran Vía Don Diego López de Haro 30, Bilbao",
            telefono: "+34 940 000 005",
            email: "pedidos@libreriacentral.com",
            horario: "Lunes a sábado, 9:30 - 20:30",
        },
        stats: {
            productos: 512,
            ventas: 7800,
            seguidores: 4100,
            antiguedad: "6 años",
            ratingPromedio: 4.9,
            nivel: "oro",
        },
    },
    {
        id: "6",
        nombre: "Belleza Natural",
        slug: "belleza-natural",
        logo: "https://picsum.photos/64/64?random=6",
        portada: "https://picsum.photos/1200/300?random=106",
        descripcion:
            "Cosmética natural y productos de cuidado personal cruelty-free. Belleza consciente para cada día.",
        categoria: "Salud y Belleza",
        ubicacion: "Málaga",
        rating: 4.5,
        totalReviews: 98,
        esOficial: false,
        esVerificada: true,
        tiempoRespuesta: "responde en 3 horas",
        enOferta: true,
        contacto: {
            direccion: "Calle Larios 5, Málaga",
            telefono: "+34 952 000 006",
            email: "hola@bellezanatural.com",
            horario: "Lunes a viernes, 10:00 - 19:00",
        },
        stats: {
            productos: 61,
            ventas: 540,
            seguidores: 390,
            antiguedad: "4 meses",
            ratingPromedio: 4.5,
            nivel: "bronce",
        },
    },
];

export function getTiendaById(id: string): TiendaCompleta | undefined {
    return MOCK_TIENDAS.find((t) => t.id === id);
}

export const MOCK_PRODUCTOS: Producto[] = [
    {
        id: "1",
        tiendaId: "1",
        nombre: "Camiseta de Algodón Premium",
        slug: "camiseta-algodon-premium",
        descripcion:
            "Camiseta 100% algodón peinado, corte regular y costuras reforzadas. Disponible en varios colores y tallas de la S a la XXL. Ideal para el uso diario gracias a su tejido transpirable y suave al tacto.",
        precio: 19990,
        precioOferta: 14990,
        imagenes: [
            "https://picsum.photos/600/600?random=1",
            "https://picsum.photos/600/600?random=11",
            "https://picsum.photos/600/600?random=12",
        ],
        categoria: "ropa",
        stock: 25,
        rating: 4.8,
        totalReviews: 128,
        esNuevo: true,
        esDestacado: true,
        tieneEnvioGratis: true,
        createdAt: new Date("2026-06-01"),
        updatedAt: new Date("2026-07-15"),
    },
    {
        id: "2",
        tiendaId: "2",
        nombre: "Auriculares Bluetooth",
        slug: "auriculares-bluetooth",
        descripcion:
            "Auriculares inalámbricos con cancelación activa de ruido, hasta 30 horas de batería y resistencia al agua IPX4. Incluyen estuche de carga rápida.",
        precio: 89990,
        imagenes: [
            "https://picsum.photos/600/600?random=2",
            "https://picsum.photos/600/600?random=21",
            "https://picsum.photos/600/600?random=22",
        ],
        categoria: "electronica",
        stock: 5,
        rating: 4.9,
        totalReviews: 256,
        esDestacado: true,
        tieneEnvioGratis: true,
        createdAt: new Date("2026-05-20"),
        updatedAt: new Date("2026-07-10"),
    },
    {
        id: "3",
        tiendaId: "3",
        nombre: "Lámpara de Mesa LED",
        slug: "lampara-mesa-led",
        descripcion:
            "Lámpara de mesa regulable con luz cálida y fría, tres niveles de intensidad y puerto USB para carga. Base antideslizante y diseño minimalista.",
        precio: 34990,
        precioOferta: 24990,
        imagenes: [
            "https://picsum.photos/600/600?random=3",
            "https://picsum.photos/600/600?random=31",
        ],
        categoria: "hogar",
        stock: 15,
        rating: 4.7,
        totalReviews: 89,
        esNuevo: true,
        tieneEnvioGratis: false,
        createdAt: new Date("2026-07-01"),
        updatedAt: new Date("2026-08-01"),
    },
    {
        id: "4",
        tiendaId: "1",
        nombre: "Zapatillas Urbanas",
        slug: "zapatillas-urbanas",
        descripcion:
            "Zapatillas cómodas para el día a día, suela antideslizante y materiales transpirables. Combinan con cualquier look casual.",
        precio: 54990,
        imagenes: [
            "https://picsum.photos/600/600?random=4",
            "https://picsum.photos/600/600?random=41",
        ],
        categoria: "ropa",
        stock: 12,
        rating: 4.6,
        totalReviews: 74,
        tieneEnvioGratis: true,
        createdAt: new Date("2026-04-10"),
        updatedAt: new Date("2026-06-20"),
    },
    {
        id: "5",
        tiendaId: "2",
        nombre: "Smartwatch Deportivo",
        slug: "smartwatch-deportivo",
        descripcion:
            "Reloj inteligente con monitor de frecuencia cardíaca, GPS integrado y más de 20 modos deportivos. Resistente al agua hasta 50m.",
        precio: 129990,
        precioOferta: 99990,
        imagenes: [
            "https://picsum.photos/600/600?random=5",
            "https://picsum.photos/600/600?random=51",
            "https://picsum.photos/600/600?random=52",
        ],
        categoria: "electronica",
        stock: 8,
        rating: 4.8,
        totalReviews: 312,
        esDestacado: true,
        tieneEnvioGratis: true,
        createdAt: new Date("2026-03-15"),
        updatedAt: new Date("2026-07-28"),
    },
    {
        id: "6",
        tiendaId: "4",
        nombre: "Balón de Fútbol Profesional",
        slug: "balon-futbol-profesional",
        descripcion:
            "Balón oficial talla 5, cámara de butilo para mayor retención de aire y cubierta termosellada resistente a la abrasión.",
        precio: 29990,
        imagenes: ["https://picsum.photos/600/600?random=6"],
        categoria: "deportes",
        stock: 30,
        rating: 4.7,
        totalReviews: 45,
        esNuevo: true,
        tieneEnvioGratis: true,
        createdAt: new Date("2026-07-20"),
        updatedAt: new Date("2026-08-05"),
    },
    {
        id: "7",
        tiendaId: "5",
        nombre: "Novela: El Jardín Silencioso",
        slug: "novela-jardin-silencioso",
        descripcion:
            "Edición tapa dura de la última novela premiada del año. Incluye marcapáginas exclusivo y prólogo de la autora.",
        precio: 22990,
        precioOferta: 17990,
        imagenes: ["https://picsum.photos/600/600?random=7"],
        categoria: "libros",
        stock: 40,
        rating: 4.9,
        totalReviews: 167,
        esDestacado: true,
        tieneEnvioGratis: true,
        createdAt: new Date("2026-06-15"),
        updatedAt: new Date("2026-07-30"),
    },
    {
        id: "8",
        tiendaId: "6",
        nombre: "Set de Cuidado Facial Natural",
        slug: "set-cuidado-facial-natural",
        descripcion:
            "Rutina completa de limpieza, tónico e hidratante con ingredientes naturales y sin testeo en animales. Apto para todo tipo de piel.",
        precio: 44990,
        imagenes: ["https://picsum.photos/600/600?random=8"],
        categoria: "salud",
        stock: 0,
        rating: 4.5,
        totalReviews: 38,
        tieneEnvioGratis: false,
        createdAt: new Date("2026-05-05"),
        updatedAt: new Date("2026-07-01"),
    },
    {
        id: "9",
        tiendaId: "3",
        nombre: "Set de Almohadones Decorativos",
        slug: "set-almohadones-decorativos",
        descripcion:
            "Pack de 2 fundas de almohadón con relleno incluido, tela suave al tacto y diseño exclusivo. Lavables a máquina.",
        precio: 27990,
        imagenes: ["https://picsum.photos/600/600?random=9"],
        categoria: "hogar",
        stock: 18,
        rating: 4.4,
        totalReviews: 22,
        esNuevo: true,
        tieneEnvioGratis: true,
        createdAt: new Date("2026-07-25"),
        updatedAt: new Date("2026-08-08"),
    },
    {
        id: "10",
        tiendaId: "4",
        nombre: "Mancuernas Ajustables 20kg",
        slug: "mancuernas-ajustables-20kg",
        descripcion:
            "Set de mancuernas ajustables de 2 a 20kg por unidad, ideales para entrenar en casa ahorrando espacio.",
        precio: 74990,
        precioOferta: 59990,
        imagenes: ["https://picsum.photos/600/600?random=10"],
        categoria: "deportes",
        stock: 6,
        rating: 4.8,
        totalReviews: 61,
        esDestacado: true,
        tieneEnvioGratis: true,
        createdAt: new Date("2026-06-10"),
        updatedAt: new Date("2026-07-22"),
    },
];

export function getProductoById(id: string): Producto | undefined {
    return MOCK_PRODUCTOS.find((p) => p.id === id);
}

export function getProductosByTienda(tiendaId: string): Producto[] {
    return MOCK_PRODUCTOS.filter((p) => p.tiendaId === tiendaId);
}

export function getProductosRelacionados(producto: Producto, limit = 4): Producto[] {
    return MOCK_PRODUCTOS.filter(
        (p) => p.id !== producto.id && p.categoria === producto.categoria
    ).slice(0, limit);
}

// --- Reseñas (datos fijos, no aleatorios, para evitar diferencias entre
// el render de servidor y de cliente) ---

const AUTORES = [
    { autor: "Lucía Fernández", avatar: "https://i.pravatar.cc/40?img=1" },
    { autor: "Martín Gómez", avatar: "https://i.pravatar.cc/40?img=2" },
    { autor: "Sofía Ramírez", avatar: "https://i.pravatar.cc/40?img=3" },
    { autor: "Diego Torres", avatar: "https://i.pravatar.cc/40?img=4" },
    { autor: "Valentina Ruiz", avatar: "https://i.pravatar.cc/40?img=5" },
];

const COMENTARIOS = [
    { titulo: "Justo lo que esperaba", comentario: "Llegó antes de lo previsto y la calidad es excelente. Repetiré compra sin dudarlo." },
    { titulo: "Muy buena relación calidad-precio", comentario: "Cumple con lo prometido en la descripción. El empaque llegó en perfecto estado." },
    { titulo: "Recomendado", comentario: "La atención fue rápida y resolvieron todas mis dudas antes de comprar." },
    { titulo: "Podría mejorar", comentario: "El producto está bien pero tardó un poco más de lo esperado en llegar." },
    { titulo: "Superó mis expectativas", comentario: "No pensé que fuera tan buena calidad por ese precio. Totalmente recomendado." },
];

export function generarResenas(entidadId: string, cantidad = 5): Resena[] {
    const seed = entidadId
        .split("")
        .reduce((acc, c) => acc + c.charCodeAt(0), 0);

    return Array.from({ length: cantidad }).map((_, i) => {
        const autorInfo = AUTORES[(seed + i) % AUTORES.length];
        const textoInfo = COMENTARIOS[(seed + i * 2) % COMENTARIOS.length];
        const rating = [5, 4, 5, 3, 4, 5][(seed + i) % 6];
        const diasAtras = 3 + i * 9;
        const fecha = new Date();
        fecha.setDate(fecha.getDate() - diasAtras);

        return {
            id: `${entidadId}-resena-${i + 1}`,
            entidadId,
            autor: autorInfo.autor,
            avatar: autorInfo.avatar,
            rating,
            titulo: textoInfo.titulo,
            comentario: textoInfo.comentario,
            fecha,
            util: (seed + i * 3) % 24,
            compraVerificada: i % 3 !== 0,
            ...(i === 0
                ? {
                    respuestaTienda: {
                        mensaje: "¡Gracias por tu reseña! Nos alegra que hayas tenido una buena experiencia.",
                        fecha: new Date(fecha.getTime() + 1000 * 60 * 60 * 24 * 2),
                    },
                }
                : {}),
        };
    });
}

export function calcularResumenResenas(resenas: Resena[]) {
    const total = resenas.length;
    const distribucion: Record<1 | 2 | 3 | 4 | 5, number> = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
    };
    let suma = 0;
    for (const r of resenas) {
        const rating = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
        distribucion[rating] += 1;
        suma += r.rating;
    }
    return {
        promedio: total > 0 ? Math.round((suma / total) * 10) / 10 : 0,
        total,
        distribucion,
    };
}
