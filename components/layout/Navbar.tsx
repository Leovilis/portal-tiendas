"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ShoppingBag, Store, User } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Store className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">PortalTiendas</span>
          </Link>

          {/* Navegación central */}
          <NavigationMenu>
            <NavigationMenuList className="hidden md:flex space-x-6">
              <NavigationMenuItem>
                <Link href="/tiendas" className="text-sm font-medium hover:text-primary">
                  Tiendas
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/categorias" className="text-sm font-medium hover:text-primary">
                  Categorías
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/ofertas" className="text-sm font-medium hover:text-primary">
                  Ofertas
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Acciones */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-5 w-5" />
            </Button>
            <Button variant="default" size="sm">
              <User className="h-4 w-4 mr-2" />
              Mi Cuenta
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}