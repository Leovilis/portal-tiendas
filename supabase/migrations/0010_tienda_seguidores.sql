-- 0010_tienda_seguidores.sql
-- Ya aplicada en tu proyecto Supabase (portal-tiendas) vía MCP. Registro
-- versionado (idempotente, se puede re-ejecutar sin romper nada).
--
-- Por qué existe: el botón "Seguir" de la tienda era puramente visual
-- (useState local, se perdía al recargar la página). Esta tabla lo hace
-- real: quién sigue a qué tienda, para poder mostrar el estado real y un
-- contador real de seguidores.

create table if not exists public.tienda_seguidores (
  "tiendaId" text not null references public.tiendas(id) on delete cascade,
  "usuarioId" uuid not null references public.users(id) on delete cascade,
  "createdAt" timestamp without time zone not null default current_timestamp,
  primary key ("tiendaId", "usuarioId")
);

alter table public.tienda_seguidores enable row level security;

-- Público: quién sigue a quién no es información sensible (como en
-- cualquier red social), y hace falta para poder mostrar el contador.
drop policy if exists tienda_seguidores_select_public on public.tienda_seguidores;
create policy tienda_seguidores_select_public on public.tienda_seguidores for select using (true);

drop policy if exists tienda_seguidores_insert_own on public.tienda_seguidores;
create policy tienda_seguidores_insert_own on public.tienda_seguidores for insert with check (auth.uid() = "usuarioId");

drop policy if exists tienda_seguidores_delete_own on public.tienda_seguidores;
create policy tienda_seguidores_delete_own on public.tienda_seguidores for delete using (auth.uid() = "usuarioId");
