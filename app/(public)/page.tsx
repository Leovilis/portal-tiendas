// app/(public)/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TiendaCard } from "@/components/tiendas/TiendaCard";
import { ProductCard } from "@/components/productos/ProductCard";
import {
  ArrowRight,
  Shield,
  Truck,
  Zap,
  Store,
  ShoppingBag,
  Users,
  Award,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

// Datos de ejemplo (después vendrán de la BD)
const tiendasDestacadas = [
  {
    id: "1",
    nombre: "Moda & Estilo",
    logo: "https://picsum.photos/seed/moda/200/200",
    categoria: "Ropa y Moda",
    ubicacion: "Madrid",
    rating: 4.8,
    totalReviews: 128,
    esOficial: true,
    esVerificada: true,
  },
  {
    id: "2",
    nombre: "TecnoShop",
    logo: "https://picsum.photos/seed/tecno/200/200",
    categoria: "Electrónica",
    ubicacion: "Barcelona",
    rating: 4.9,
    totalReviews: 256,
    esOficial: true,
    esVerificada: true,
  },
  {
    id: "3",
    nombre: "Hogar & Deco",
    logo: "https://picsum.photos/seed/hogar/200/200",
    categoria: "Hogar y Deco",
    ubicacion: "Valencia",
    rating: 4.7,
    totalReviews: 89,
    esOficial: false,
    esVerificada: true,
  },
];

// Productos destacados de ejemplo
const productosDestacados = [
  {
    id: "1",
    tiendaId: "1",
    nombre: "Camiseta Premium Algodón",
    slug: "camiseta-premium",
    descripcion: "Camiseta 100% algodón orgánico",
    precio: 19990,
    precioOferta: 14990,
    imagenes: ["https://picsum.photos/seed/camiseta/400/400"],
    categoria: "Ropa",
    subcategoria: null,
    stock: 25,
    rating: 4.8,
    totalReviews: 128,
    esNuevo: true,
    esDestacado: true,
    tieneEnvioGratis: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    tiendaId: "2",
    nombre: "Auriculares Bluetooth Pro",
    slug: "auriculares-bluetooth",
    descripcion: "Cancelación de ruido activa",
    precio: 89990,
    precioOferta: null,
    imagenes: ["https://picsum.photos/seed/auriculares/400/400"],
    categoria: "Electrónica",
    subcategoria: null,
    stock: 5,
    rating: 4.9,
    totalReviews: 256,
    esNuevo: false,
    esDestacado: true,
    tieneEnvioGratis: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    tiendaId: "3",
    nombre: "Lámpara LED Decorativa",
    slug: "lampara-led",
    descripcion: "Luz cálida regulable",
    precio: 34990,
    precioOferta: 24990,
    imagenes: ["https://picsum.photos/seed/lampara/400/400"],
    categoria: "Hogar",
    subcategoria: null,
    stock: 15,
    rating: 4.7,
    totalReviews: 89,
    esNuevo: true,
    esDestacado: false,
    tieneEnvioGratis: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default async function HomePage() {
  // Aquí después conectas con la BD
  // const tiendas = await prisma.tienda.findMany({ take: 6 })
  // const productos = await prisma.producto.findMany({ take: 6 })

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              El mejor portal de tiendas
              <span className="text-primary"> para tu negocio</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Conecta con miles de clientes y haz crecer tu tienda online. Todo
              lo que necesitas para vender más.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg" asChild>
                <Link href="/register">
                  Crear mi tienda
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg" asChild>
                <Link href="/tiendas">Explorar tiendas</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Store className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">50+</div>
              <div className="text-sm text-muted-foreground">Tiendas</div>
            </div>
            <div className="text-center">
              <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-sm text-muted-foreground">Productos</div>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">5K+</div>
              <div className="text-sm text-muted-foreground">Clientes</div>
            </div>
            <div className="text-center">
              <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">4.9</div>
              <div className="text-sm text-muted-foreground">Valoración</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 border rounded-lg bg-card hover:shadow-lg transition-shadow">
              <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold text-xl mb-2">Compra Segura</h3>
              <p className="text-muted-foreground">
                Protegemos todas tus transacciones con nuestra garantía de
                compra
              </p>
            </div>
            <div className="text-center p-6 border rounded-lg bg-card hover:shadow-lg transition-shadow">
              <Truck className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold text-xl mb-2">Envíos Rápidos</h3>
              <p className="text-muted-foreground">
                Logística integrada con entregas en 24-48 horas
              </p>
            </div>
            <div className="text-center p-6 border rounded-lg bg-card hover:shadow-lg transition-shadow">
              <Zap className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold text-xl mb-2">
                Sin Comisiones Ocultas
              </h3>
              <p className="text-muted-foreground">
                Planes claros y transparentes para tu negocio
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Productos destacados</h2>
              <p className="text-muted-foreground">
                Lo más popular de nuestras tiendas
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/productos">
                Ver todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productosDestacados.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        </div>
      </section>

      {/* Tiendas Destacadas */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Tiendas destacadas</h2>
              <p className="text-muted-foreground">
                Los mejores vendedores del portal
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/tiendas">
                Ver todas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiendasDestacadas.map((tienda) => (
              <TiendaCard key={tienda.id} {...tienda} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
