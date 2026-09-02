// src/lib/types/auth.types.ts
// Coincide con la tabla real public.users de tu proyecto Supabase.
export type UserRole = "USER" | "VENDEDOR" | "ADMIN";

export interface Profile {
    id: string;
    email: string;
    name: string | null;
    role: UserRole;
    image: string | null;
    tiendaId: string | null;
    createdAt: string;
    updatedAt: string;
}
