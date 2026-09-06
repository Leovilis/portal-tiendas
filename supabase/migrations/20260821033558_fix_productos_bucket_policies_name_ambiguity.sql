-- Fix: las políticas del bucket "productos" comparaban tiendaId contra
-- storage.foldername(name) pero, como public.users también tiene una
-- columna "name" (el nombre del usuario), la referencia sin calificar a
-- "name" dentro del EXISTS se resolvía contra users.name en vez de
-- storage.objects.name (el path del archivo) — shadowing clásico de
-- subquery correlacionada en Postgres. Resultado: la condición nunca
-- matcheaba y toda subida/edición/borrado fallaba con "violates row-level
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
