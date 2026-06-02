import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  variable: "--font-jakarta" 
});

export const metadata: Metadata = {
  title: "PortalTiendas - El marketplace para tu negocio",
  description: "Crea tu tienda online y empieza a vender hoy mismo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.variable,
        jakarta.variable
      )}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}