import { Button } from "@/components/ui/button";
import { TiendaCard } from "@/components/tiendas/TiendaCard";
import { ArrowRight, Shield, Truck, Zap } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { TiendaCardProps } from "@/components/tiendas/TiendaCard";

export default async function Home() {
  const supabase = await createClient();
  const { data: tiendaRows } = await supabase
    .from("tiendas")
    .select("id, nombre, logo, categoria, ubicacion, rating, esOficial")
    .order("rating", { ascending: false })
    .limit(3);

  const tiendasDestacadas: TiendaCardProps[] = (tiendaRows ?? []).map((t) => ({
    id: t.id,
    nombre: t.nombre,
    logo: t.logo ?? undefined,
    categoria: t.categoria,
    ubicacion: t.ubicacion ?? "Ubicación no especificada",
    rating: t.rating,
    esOficial: t.esOficial,
  }));

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
              Conecta con miles de clientes y haz crecer tu tienda online.
              Todo lo que necesitas para vender más.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-lg">
                  Crear mi tienda
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/tiendas">
                <Button size="lg" variant="outline" className="text-lg">
                  Explorar tiendas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold text-xl mb-2">Compra Segura</h3>
              <p className="text-muted-foreground">
                Protegemos todas tus transacciones con nuestra garantía de compra
              </p>
            </div>
            <div className="text-center p-6">
              <Truck className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold text-xl mb-2">Envíos Rápidos</h3>
              <p className="text-muted-foreground">
                Logística integrada con entregas en 24-48 horas
              </p>
            </div>
            <div className="text-center p-6">
              <Zap className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold text-xl mb-2">Sin Comisiones Ocultas</h3>
              <p className="text-muted-foreground">
                Planes claros y transparentes para tu negocio
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stores */}
      {tiendasDestacadas.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Tiendas destacadas</h2>
              <p className="text-muted-foreground">
                Los mejores vendedores están en PortalTiendas
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tiendasDestacadas.map((tienda) => (
                <TiendaCard key={tienda.id} {...tienda} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
