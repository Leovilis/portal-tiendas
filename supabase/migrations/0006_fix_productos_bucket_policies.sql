-- 0006_fix_productos_bucket_policies.sql
-- Ya aplicada en tu proyecto Supabase (portal-tiendas) vía MCP. Registro
-- versionado, idempotente (drop/create policy).
--
-- Bug: las políticas de 0004 comparaban tiendaId contra
-- storage.foldername(name), pero public.users también tiene una columna
-- "name" (el nombre del usuario). Dentro del EXISTS correlacionado, la
-- referencia sin calificar a "name" se resolvía contra users.name (shadowing
-- de subquery en Postgres) en vez de storage.objects.name (el path real del
-- archivo). Resultado: la condición nunca matcheaba y toda subida, edición o
-- borrado de imágenes de producto fallaba con "new row violates row-level
-- security policy". Se corrige calificando explícitamente storage.objects.name.

drop policy if exists "productos_bucket_owner_insert" on storage.objects;
create policy "productos_bucket_owner_insert" on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'productos'
    and exists (
      select 1 from public.users u
      where u.id = auth.uid()
        and u."tiendaId" = (storage.foldername(storage.objects.name))[1]
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
        and u."tiendaId" = (storage.foldername(storage.objects.name))[1]
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
        and u."tiendaId" = (storage.foldername(storage.objects.name))[1]
    )
  );
