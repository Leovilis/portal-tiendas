// src/app/privacidad/page.tsx
import { CONTACT_INFO, SITE_NAME } from "@/lib/constants";

export const metadata = {
    title: `Política de privacidad - ${SITE_NAME}`,
};

export default function PrivacidadPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-3xl font-bold mb-2">Política de privacidad</h1>
            <p className="text-sm text-muted-foreground mb-10">Última actualización: {new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })}</p>

            <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
                <section className="space-y-2">
                    <h2 className="text-lg font-semibold text-foreground">1. Qué datos recopilamos</h2>
                    <p>
                        Cuando creás una cuenta guardamos tu nombre, email y, si comprás o vendés, los
                        datos necesarios para procesar esa operación: dirección de envío, historial de
                        pedidos, productos publicados (si sos vendedor) y las reseñas que escribís.
                    </p>
                    <p>
                        Si iniciás sesión con Google, recibimos el nombre, email y foto de perfil que tu
                        cuenta de Google comparte con nosotros.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold text-foreground">2. Pagos</h2>
                    <p>
                        No almacenamos números de tarjeta ni datos de pago. Cuando una tienda tiene
                        activado el cobro con MercadoPago, el pago se procesa enteramente en los
                        servidores de MercadoPago; nosotros solo guardamos una referencia del pedido y
                        el resultado (aprobado o no) para poder actualizar su estado. El Access Token
                        que cada tienda carga para cobrar es privado, se guarda de forma protegida, y
                        únicamente nuestro servidor lo usa para generar sus propios cobros — nunca se
                        envía al navegador de los compradores.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold text-foreground">3. Para qué usamos tus datos</h2>
                    <p>
                        Usamos tus datos para operar la plataforma: procesar pedidos, mostrar tu tienda
                        o tus compras, permitirte iniciar sesión, y comunicarnos con vos sobre tu cuenta
                        o tus pedidos. No vendemos tus datos a terceros ni los usamos con fines
                        publicitarios ajenos a la plataforma.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold text-foreground">4. Con quién compartimos información</h2>
                    <p>
                        Compartimos lo estrictamente necesario para que una compra funcione: tu nombre y
                        dirección de envío con la tienda a la que le comprás, y los datos del pedido con
                        MercadoPago cuando corresponde procesar un pago. Nuestra infraestructura corre
                        sobre Supabase (base de datos y autenticación), que actúa como encargado técnico
                        del tratamiento de estos datos.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold text-foreground">5. Cuánto tiempo conservamos tus datos</h2>
                    <p>
                        Conservamos tu cuenta y tu historial de pedidos mientras la cuenta exista. Podés
                        pedirnos que eliminemos tu cuenta y tus datos personales en cualquier momento,
                        salvo la información que estemos obligados a conservar por motivos legales o
                        contables.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold text-foreground">6. Tus derechos</h2>
                    <p>
                        Podés acceder, corregir o eliminar tus datos personales, y podés hacerlo vos
                        mismo desde tu perfil para la mayoría de la información. Para cualquier otro
                        pedido relacionado con tus datos, escribinos.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold text-foreground">7. Contacto</h2>
                    <p>
                        Para consultas sobre privacidad, escribinos a{" "}
                        <a href={`mailto:${CONTACT_INFO.email}`} className="text-primary hover:underline">
                            {CONTACT_INFO.email}
                        </a>
                        .
                    </p>
                </section>
            </div>
        </div>
    );
}
