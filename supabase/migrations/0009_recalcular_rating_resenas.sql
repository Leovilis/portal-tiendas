-- 0009_recalcular_rating_resenas.sql
-- Ya aplicada en tu proyecto Supabase (portal-tiendas) vía MCP. Registro
-- versionado (idempotente, se puede re-ejecutar sin romper nada).
--
-- Por qué existe: hasta ahora "Escribir reseña" en la página de producto no
-- hacía nada (solo cerraba el modal). Al conectarlo de verdad a un INSERT en
-- public.reviews, hace falta que productos.rating/totalReviews y
-- tiendas.rating/totalReviews (que se muestran en toda la app) se mantengan
-- al día automáticamente, sin depender de que cada lugar del código que
-- inserta/edita/borra una reseña se acuerde de recalcularlos a mano.
--
-- Este trigger corre en cada INSERT/UPDATE/DELETE sobre reviews y
-- recalcula el promedio real y el conteo real, tanto para el producto como
-- para la tienda (el rating de tienda es el promedio de TODAS sus reseñas,
-- de todos sus productos). SECURITY DEFINER porque quien escribe la reseña
-- (un comprador cualquiera) no tiene permiso de UPDATE directo sobre
-- productos/tiendas.

create or replace function public.recalcular_rating_resenas()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_producto_id text := coalesce(new."productoId", old."productoId");
  v_tienda_id text := coalesce(new."tiendaId", old."tiendaId");
  v_producto_id_old text := old."productoId";
  v_tienda_id_old text := old."tiendaId";
begin
  update public.productos p
    set rating = coalesce((select round(avg(r.rating)::numeric, 1) from public.reviews r where r."productoId" = p.id), 0),
        "totalReviews" = (select count(*) from public.reviews r where r."productoId" = p.id)
    where p.id = v_producto_id or p.id = v_producto_id_old;

  update public.tiendas t
    set rating = coalesce((select round(avg(r.rating)::numeric, 1) from public.reviews r where r."tiendaId" = t.id), 0),
        "totalReviews" = (select count(*) from public.reviews r where r."tiendaId" = t.id)
    where t.id = v_tienda_id or t.id = v_tienda_id_old;

  return coalesce(new, old);
end;
$$;

drop trigger if exists reviews_recalcular_rating on public.reviews;
create trigger reviews_recalcular_rating
  after insert or update or delete on public.reviews
  for each row
  execute function public.recalcular_rating_resenas();
