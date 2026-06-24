// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Redirigir a login si no está autenticado
    if (!token && path.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Si tiene tiendaId, tiene acceso a su dashboard
    if (
      token?.role === "VENDEDOR" &&
      !token?.tiendaId &&
      path.startsWith("/dashboard")
    ) {
      return NextResponse.redirect(
        new URL("/dashboard/configuracion", req.url),
      );
    }

    // Solo admin puede acceder a ciertas rutas
    if (token?.role !== "ADMIN" && path.startsWith("/dashboard/admin")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Permitir acceso público a rutas que no son dashboard
        return true;
      },
    },
  },
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/tiendas/:path*",
    "/api/productos/:path*",
    "/api/pedidos/:path*",
  ],
};
