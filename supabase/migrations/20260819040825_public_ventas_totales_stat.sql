create or replace function public.get_tienda_ventas_totales(p_tienda_id text)
returns numeric
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(sum(total), 0)
  from public.pedidos
  where "tiendaId" = p_tienda_id
    and pagado = true;
$$;

revoke all on function public.get_tienda_ventas_totales(text) from public, anon, authenticated;
grant execute on function public.get_tienda_ventas_totales(text) to anon, authenticated;