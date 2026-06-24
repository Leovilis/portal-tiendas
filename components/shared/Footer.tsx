// components/shared/Footer.tsx
'use client';
import Link from "next/link";
import { Store, Mail, Phone, MapPin } from "lucide-react";
import { SiInstagram, SiYoutube } from "@icons-pack/react-simple-icons";
export function Footer() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Store className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">PortalTiendas</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              El marketplace que conecta tiendas y clientes en Latinoamérica.
              Crea tu tienda online y empieza a vender hoy.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <SiInstagram className="h-5 w-5" />
              </Link>

              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <SiYoutube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="font-semibold mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/tiendas"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Tiendas
                </Link>
              </li>
              <li>
                <Link
                  href="/productos"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Productos
                </Link>
              </li>
              <li>
                <Link
                  href="/ofertas"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Ofertas
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Crear tienda
                </Link>
              </li>
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h3 className="font-semibold mb-4">Ayuda</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/preguntas-frecuentes"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link
                  href="/terminos"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidad"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-muted-foreground">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>soporte@portal-tiendas.com</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>+54 3884369843</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Jujuy, Argentina</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} PortalTiendas. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
