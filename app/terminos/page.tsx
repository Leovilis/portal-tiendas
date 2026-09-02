// src/app/terminos/page.tsx
import { CONTACT_INFO, SITE_NAME } from "@/lib/constants";

export const metadata = {
    title: `Términos y condiciones - ${SITE_NAME}`,
};

export default function TerminosPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-3xl font-bold mb-2">Términos y condiciones</h1>
            <p className="text-sm text-muted-foreground mb-10">Última actualización: {new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })}</p>

            <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
                <section className="space-y-2">
                    <h2 className="text-lg font-semibold text-foreground">1. Qué es {SITE_NAME}</h2>
                    <p>
                        {SITE_NAME} es un marketplace: un espacio donde tiendas independientes publican
                        y venden sus propios productos, y donde cualquier persona puede comprarlos.
                        Nosotros ponemos la plataforma, pero cada tienda es responsable de sus propios
                        productos, precios, stock, tiempos de entrega y atención al cliente. No somos
                        la parte vendedora en ninguna operación de compra.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold text-foreground">2. Cuentas de usuario</h2>
                    <p>
                        Para comprar o vender necesitás crear una cuenta con un email válido. Sos
                        responsable de mantener la confidencialidad de tu contraseña y de toda la
                        actividad que ocurra desde tu cuenta. Si sospechás de un uso no autorizado,
                        avisanos de inmediato.
                    </p>
                    <p>
                        Al registrarte elegís un tipo de cuenta: comprador o vendedor. Una cuenta
                        vendedora puede crear una única tienda propia, administrar sus productos y
                        recibir pedidos.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold text-foreground">3. Cómo funcionan los pedidos</h2>
                    <p>
                        Cuando confirmás una compra, se genera un pedido directamente entre vos y la
                        tienda correspondiente (si tu carrito tiene productos de más de una tienda, se
                        generan pedidos separados, uno por tienda). Todo pedido nuevo empieza en estado
                        &quot;Pendiente&quot; hasta que la tienda lo confirma.
                    </p>
                    <p>
                        Cada tienda decide cómo cobra: algunas tienen activado el cobro online con
                        MercadoPago (el pago va directo a la cuenta de MercadoPago de esa tienda,
                        {SITE_NAME} nunca recibe ni retiene ese dinero), y otras coordinan el pago
                        directamente con el comprador (transferencia, efectivo u otro medio que
                        acuerden). El estado del pago y del envío se actualiza en &quot;Mis pedidos&quot;.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold text-foreground">4. Responsabilidad de las tiendas</h2>
                    <p>
                        Cada tienda es responsable de la veracidad de sus publicaciones, de tener stock
                        real de lo que ofrece, de cumplir con los tiempos y condiciones que informa, y de
                        responder ante reclamos de sus compradores. {SITE_NAME} puede suspender una
                        tienda que incumpla reiteradamente estas condiciones o que publique contenido
                        engañoso, ilegal o fraudulento.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold text-foreground">5. Reseñas</h2>
                    <p>
                        Solo pueden dejar una reseña de un producto las personas que efectivamente lo
                        compraron a través de la plataforma. Las reseñas deben reflejar una experiencia
                        real; nos reservamos el derecho de eliminar contenido falso, ofensivo o que no
                        corresponda a una compra real.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold text-foreground">6. Cancelaciones y devoluciones</h2>
                    <p>
                        Las condiciones de cancelación y devolución dependen de cada tienda. Te
                        recomendamos revisarlas antes de comprar y, ante cualquier problema, contactar
                        primero directamente a la tienda desde la página del pedido.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold text-foreground">7. Cambios a estos términos</h2>
                    <p>
                        Podemos actualizar estos términos ocasionalmente para reflejar cambios en la
                        plataforma. Si el cambio es significativo, lo vamos a comunicar de forma visible
                        en el sitio.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold text-foreground">8. Contacto</h2>
                    <p>
                        Ante cualquier duda sobre estos términos, escribinos a{" "}
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
