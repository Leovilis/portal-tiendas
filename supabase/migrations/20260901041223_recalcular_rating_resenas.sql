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
