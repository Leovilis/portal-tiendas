-- Endurece las 2 funciones que crea la migración anterior, siguiendo los
-- avisos de seguridad de Supabase: search_path fijo (evita hijacking) y
-- sacarle el permiso de ejecución directa vía API a handle_new_user (solo
-- debe dispararse como trigger, no como RPC público).

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
    new."updatedAt" = now();
    return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
