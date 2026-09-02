// src/app/ayuda/page.tsx
import Link from "next/link";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { CONTACT_INFO, SITE_NAME } from "@/lib/constants";

export const metadata = {
    title: `Centro de ayuda - ${SITE_NAME}`,
};

const PREGUNTAS = [
    {
        pregunta: "¿Qué significa que un pedido esté \"Pendiente\"?",
        respuesta:
            "Es el estado inicial de todo pedido nuevo: la tienda todavía no lo confirmó. A medida que lo procesa, va a pasar a Confirmado, Preparando, Enviado y Entregado (o Cancelado/Devuelto si corresponde). Podés ver el estado actualizado en \"Mis pedidos\".",
    },
    {
        pregunta: "¿Cómo pago mi pedido?",
        respuesta:
            "Depende de la tienda. Si activó el cobro online vas a ver un botón para pagar con MercadoPago directo a su cuenta, ya sea al confirmar la compra o después desde \"Mis pedidos\". Si no lo activó, vas a coordinar el pago directamente con ella (transferencia, efectivo u otro medio).",
    },
    {
        pregunta: "Pagué pero mi pedido sigue como \"no pagado\"",
        respuesta:
            "A veces la confirmación tarda unos segundos en llegar. Volvé a la página de \"Mis pedidos\": al entrar después de pagar, intentamos verificar el pago automáticamente. Si después de unos minutos sigue igual, contactá a la tienda desde el pedido.",
    },
    {
        pregunta: "¿Puedo dejar una reseña de cualquier producto?",
        respuesta:
            "Solo podés reseñar productos que compraste. El botón \"Escribir reseña\" aparece en la página del producto una vez que tu compra quedó registrada.",
    },
    {
        pregunta: "¿Cómo creo mi propia tienda?",
        respuesta:
            "Registrate eligiendo la opción \"Vendedor\" y vas a poder crear tu tienda al instante. Mirá la guía completa en \"Cómo vender\".",
    },
    {
        pregunta: "¿PortalTiendas se queda con parte de mis pagos?",
        respuesta:
            "No. Cuando una tienda cobra con MercadoPago, el dinero va directo a su propia cuenta — nosotros nunca lo recibimos ni lo retenemos.",
    },
    {
        pregunta: "Olvidé mi contraseña",
        respuesta: "Desde la pantalla de inicio de sesión, tocá \"¿Olvidaste tu contraseña?\" y te enviamos un enlace para elegir una nueva.",
    },
];

export default function AyudaPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-3xl font-bold mb-2">Centro de ayuda</h1>
            <p className="text-muted-foreground mb-10">
                Las preguntas más comunes sobre comprar y vender en {SITE_NAME}.
            </p>

            <Accordion type="single" collapsible className="w-full">
                {PREGUNTAS.map((item, i) => (
                    <AccordionItem key={item.pregunta} value={`item-${i}`}>
                        <AccordionTrigger className="text-left">{item.pregunta}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                            {item.respuesta}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            <div className="mt-10 rounded-lg border bg-muted/30 p-5 text-sm text-muted-foreground leading-relaxed">
                ¿No encontraste lo que buscabas? Escribinos a{" "}
                <a href={`mailto:${CONTACT_INFO.email}`} className="text-primary hover:underline">
                    {CONTACT_INFO.email}
                </a>
                . También podés revisar{" "}
                <Link href="/como-comprar" className="text-primary hover:underline">
                    Cómo comprar
                </Link>{" "}
                o{" "}
                <Link href="/como-vender" className="text-primary hover:underline">
                    Cómo vender
                </Link>
                .
            </div>
        </div>
    );
}
