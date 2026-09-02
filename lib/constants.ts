// src/lib/constants.ts
import type { Categoria } from "@/lib/types/product.types";

export const SITE_NAME = "PortalTiendas";
export const SITE_DESCRIPTION =
    "El marketplace donde miles de tiendas venden y miles de clientes compran.";

export const NAV_LINKS = [
    { href: "/tiendas", label: "Tiendas" },
    { href: "/categorias", label: "Categorías" },
    { href: "/ofertas", label: "Ofertas" },
] as const;

// "icono" guarda el nombre de un ícono de lucide-react (ver el mapa ICONOS_CATEGORIA
// en app/categorias/page.tsx), no un emoji — para un look consistente y profesional.
export const CATEGORIAS: Categoria[] = [
    { id: "ropa", nombre: "Ropa y Moda", slug: "ropa", icono: "Shirt" },
    { id: "electronica", nombre: "Electrónica", slug: "electronica", icono: "Smartphone" },
    { id: "hogar", nombre: "Hogar y Deco", slug: "hogar", icono: "Home" },
    { id: "deportes", nombre: "Deportes", slug: "deportes", icono: "Dumbbell" },
    { id: "libros", nombre: "Libros", slug: "libros", icono: "BookOpen" },
    { id: "juguetes", nombre: "Juguetes", slug: "juguetes", icono: "Puzzle" },
    { id: "salud", nombre: "Salud y Belleza", slug: "salud", icono: "Sparkles" },
    { id: "alimentos", nombre: "Alimentos", slug: "alimentos", icono: "UtensilsCrossed" },
];

export const UBICACIONES = [
    "Madrid",
    "Barcelona",
    "Valencia",
    "Sevilla",
    "Bilbao",
    "Málaga",
] as const;

export const FOOTER_LINKS = {
    marketplace: [
        { href: "/tiendas", label: "Explorar tiendas" },
        { href: "/categorias", label: "Categorías" },
        { href: "/ofertas", label: "Ofertas del día" },
    ],
    vendedores: [
        { href: "/register", label: "Crear mi tienda" },
        { href: "/login", label: "Iniciar sesión" },
    ],
    ayuda: [
        { href: "/ayuda", label: "Centro de ayuda" },
        { href: "/como-comprar", label: "Cómo comprar" },
        { href: "/como-vender", label: "Cómo vender" },
    ],
} as const;

export const SOCIAL_LINKS = [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Facebook", href: "https://facebook.com" },
    { label: "X", href: "https://x.com" },
] as const;

export const CONTACT_INFO = {
    email: "hola@portaltiendas.com",
    telefono: "+34 900 123 456",
} as const;
