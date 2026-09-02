// src/app/como-vender/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserPlus, Store, Package, CreditCard } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

export const metadata = {
    title: `Cómo vender - ${SITE_NAME}`,
};

const PASOS = [
    {
        icono: UserPlus,
        titulo: "Registrate como vendedor",
        texto: "Creá tu cuenta eligiendo \"Vendedor\". Si ya tenés una cuenta de comprador, no hace falta crear otra distinta.",
    },
    {
        icono: Store,
        titulo: "Creá tu tienda",
        texto: "Elegí un nombre, categoría y ubicación. Después vas a poder completar el logo, la portada y los datos de contacto desde el panel.",
    },
    {
        icono: Package,
        titulo: "Cargá tus productos",
        texto: "Fotos, precio, stock real y descripción. Tu stock se descuenta solo con cada venta confirmada, así que siempre está al día.",
    },
    {
        icono: CreditCard,
        titulo: "Activá el cobro (opcional)",
        texto: "Desde \"Cobros\" en tu panel podés conectar tu propia cuenta de MercadoPago: el dinero de tus ventas va directo a vos, nunca pasa por PortalTiendas. Si no lo activás, coordinás el pago vos mismo con cada comprador.",
    },
];

export default function ComoVenderPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-3xl font-bold mb-2">Cómo vender en {SITE_NAME}</h1>
            <p className="text-muted-foreground mb-10">
                Tu tienda, tus productos, tus reglas. {SITE_NAME} te da el espacio y las herramientas
                para vender; el negocio es tuyo.
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
                Todos los pedidos que recibís empiezan como &quot;Pendiente&quot;: desde tu panel podés
                verlos, actualizarlos a medida que los preparás y enviás, y ver un resumen real de tus
                ventas y pedidos pendientes.
            </div>

            <div className="mt-8">
                <Link href="/register">
                    <Button className="gap-2">Crear mi tienda</Button>
                </Link>
            </div>
        </div>
    );
}
