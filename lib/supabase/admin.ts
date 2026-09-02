// src/lib/supabase/admin.ts
// Cliente de Supabase con la service role key: se salta RLS por completo.
// USO EXCLUSIVO EN CÓDIGO DE SERVIDOR (Route Handlers) que no tiene una
// sesión de usuario para trabajar, como el webhook de MercadoPago (lo llama
// MercadoPago, no un usuario logueado de la app). Nunca importar este
// archivo desde un Client Component ni exponer la service role key al
// navegador.
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceRoleKey) {
        throw new Error(
            "Falta SUPABASE_SERVICE_ROLE_KEY en las variables de entorno del servidor (ver .env.local)."
        );
    }

    return createSupabaseClient(url, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });
}
