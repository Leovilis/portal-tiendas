// src/app/como-comprar/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, CreditCard, PackageSearch } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

export const metadata = {
    title: `Cómo comprar - ${SITE_NAME}`,
};

const PASOS = [
    {
        icono: Search,
        titulo: "Explorá tiendas y productos",
        texto: "Buscá por categoría o desde el buscador. Cada producto muestra la tienda que lo vende, su stock real y sus reseñas.",
    },
    {
        icono: ShoppingCart,
        titulo: "Agregalo al carrito",
        texto: "Podés comprar productos de varias tiendas a la vez: al confirmar, se arma un pedido separado por cada tienda.",
    },
    {
        icono: CreditCard,
        titulo: "Pagá según lo que ofrezca la tienda",
        texto: "Si la tienda activó el cobro online, vas a ver un botón para pagar con MercadoPago directo a su cuenta. Si no, coordinás el pago con ella (transferencia, efectivo, etc.) desde el pedido.",
    },
    {
        icono: PackageSearch,
        titulo: "Seguí tu pedido",
        texto: "Desde \"Mis pedidos\" ves el estado real de cada compra, y podés dejar tu reseña en cada producto una vez que lo recibiste.",
    },
];

export default function ComoComprarPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-3xl font-bold mb-2">Cómo comprar en {SITE_NAME}</h1>
            <p className="text-muted-foreground mb-10">
                Comprar acá es simple: elegís productos de una o varias tiendas independientes, y cada
                una gestiona su propia venta.
            </p>

            <div className="space-y-8">
                {PASOS.map((paso, i) => (
                    <div key={paso.titulo} className="flex gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                            {i + 1}
                        </div>
                        <div>
                            <h2 className="font-semibold flex items-center gap-2">
                                <paso.icono className="h-4 w-4 text-muted-foreground" />
                                {paso.titulo}
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{paso.texto}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-10 rounded-lg border bg-muted/30 p-5 text-sm text-muted-foreground leading-relaxed">
                Cada tienda es independiente: sus tiempos de entrega, política de cambios y forma de
                cobrar pueden variar. Revisá esa información en la página de cada tienda antes de
                comprar.
            </div>

            <div className="mt-8">
                <Link href="/tiendas">
                    <Button className="gap-2">Explorar tiendas</Button>
                </Link>
            </div>
        </div>
    );
}
