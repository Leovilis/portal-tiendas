"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ShoppingBag, Store, User, LogOut, LayoutDashboard, PackageSearch, CreditCard } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";

export function Navbar() {
  const { user, profile, loading, signOut } = useAuth();
  const { cantidadTotal } = useCart();

  const nombreVisible = profile?.name || user?.email?.split("@")[0] || "Mi cuenta";
  const inicial = nombreVisible.charAt(0).toUpperCase();

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
            <Link href="/carrito">
              <Button variant="ghost" size="icon" aria-label="Carrito" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {cantidadTotal > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                    {cantidadTotal > 99 ? "99+" : cantidadTotal}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2 rounded-full pr-2 pl-1 py-1 hover:bg-muted transition-colors"
                    disabled={loading}
                  >
                    <Avatar size="sm">
                      <AvatarImage src={profile?.image ?? undefined} alt={nombreVisible} />
                      <AvatarFallback>{inicial}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm font-medium max-w-28 truncate">
                      {nombreVisible}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex flex-col gap-1">
                    <span className="font-medium text-foreground">{nombreVisible}</span>
                    <span className="text-xs font-normal text-muted-foreground truncate">
                      {user.email}
                    </span>
                    {profile?.role && (
                      <Badge variant="outline" className="w-fit capitalize mt-1">
                        {profile.role.toLowerCase()}
                      </Badge>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {profile?.role === "VENDEDOR" && (
                    <>
                      {profile.tiendaId ? (
                        <>
                          <DropdownMenuItem asChild>
                            <Link href={`/tienda/${profile.tiendaId}`}>
                              Mi tienda
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/tienda/${profile.tiendaId}/panel`}>
                              <LayoutDashboard className="h-3.5 w-3.5" />
                              Panel de vendedor
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/tienda/${profile.tiendaId}/panel/perfil`}>
                              <Store className="h-3.5 w-3.5" />
                              Editar perfil de la tienda
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/tienda/${profile.tiendaId}/panel/pagos`}>
                              <CreditCard className="h-3.5 w-3.5" />
                              Cobros
                            </Link>
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <DropdownMenuItem asChild>
                          <Link href="/tienda/crear">
                            <Store className="h-3.5 w-3.5" />
                            Crear mi tienda
                          </Link>
                        </DropdownMenuItem>
                      )}
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/pedidos">
                      <PackageSearch className="h-3.5 w-3.5" />
                      Mis pedidos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={(e) => {
                      e.preventDefault();
                      signOut();
                    }}
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="default" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Iniciar sesión
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
