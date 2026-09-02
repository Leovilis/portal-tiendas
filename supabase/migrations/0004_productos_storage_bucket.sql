-- 0004_productos_storage_bucket.sql
-- Ya aplicada en tu proyecto Supabase (portal-tiendas) vía MCP. Registro
-- versionado, idempotente (on conflict do nothing + drop/create policy).
--
-- Bucket público de Storage para las fotos de producto que suben los
-- vendedores desde el panel. Cada archivo se guarda bajo la ruta
-- {tiendaId}/{archivo}, y las políticas usan ese primer segmento de carpeta
-- para validar que solo el dueño de esa tienda pueda subir/editar/borrar
-- ahí — el mismo patrón que usamos para las tablas (users.tiendaId).

insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do nothing;

drop policy if exists "productos_bucket_public_read" on storage.objects;
create policy "productos_bucket_public_read" on storage.objects
  for select
  using (bucket_id = 'productos');

drop policy if exists "productos_bucket_owner_insert" on storage.objects;
create policy "productos_bucket_owner_insert" on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'productos'
    and exists (
      select 1 from public.users u
      where u.id = auth.uid()
        and u."tiendaId" = (storage.foldername(name))[1]
    )
  );

drop policy if exists "productos_bucket_owner_update" on storage.objects;
create policy "productos_bucket_owner_update" on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'productos'
    and exists (
      select 1 from public.users u
      where u.id = auth.uid()
        and u."tiendaId" = (storage.foldername(name))[1]
    )
  );

drop policy if exists "productos_bucket_owner_delete" on storage.objects;
create policy "productos_bucket_owner_delete" on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'productos'
    and exists (
      select 1 from public.users u
      where u.id = auth.uid()
        and u."tiendaId" = (storage.foldername(name))[1]
    )
  );
