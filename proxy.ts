// proxy.ts
// Refresca la sesión de Supabase en cada request (reemplaza al antiguo
// middleware.ts: Next.js 16 renombró esta convención de archivo a "proxy").
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
    return await updateSession(request);
}

export const config = {
    matcher: [
        // Corre en todas las rutas menos assets estáticos y de imagen.
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
