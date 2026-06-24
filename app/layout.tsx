// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Providers } from "./providers";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: {
    default: "PortalTiendas - El marketplace para tu negocio",
    template: "%s | PortalTiendas",
  },
  description: "Crea tu tienda online y empieza a vender hoy mismo.",
  keywords:
    "tiendas online, ecommerce, marketplace, vender en línea, tiendas virtuales",
  authors: [{ name: "PortalTiendas" }],
  creator: "PortalTiendas",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://portal-tiendas.com",
    title: "PortalTiendas - El marketplace para tu negocio",
    description: "Crea tu tienda online y empieza a vender hoy mismo.",
    siteName: "PortalTiendas",
  },
  twitter: {
    card: "summary_large_image",
    title: "PortalTiendas - El marketplace para tu negocio",
    description: "Crea tu tienda online y empieza a vender hoy mismo.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={cn("scroll-smooth", "font-sans", geist.variable)}>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col",
          inter.variable,
          jakarta.variable,
        )}
      >
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={4000}
          />
        </Providers>
      </body>
    </html>
  );
}
