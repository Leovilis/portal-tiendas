-- 0003_public_ventas_totales_stat.sql
-- Ya aplicada en tu proyecto Supabase (portal-tiendas) vía MCP. Registro
-- versionado, idempotente (create or replace + revoke/grant se pueden
-- re-ejecutar sin romper nada).
--
-- Por qué existe: el dashboard de cada tienda ahora muestra "Ventas
-- totales" con datos 100% reales (sumados desde public.pedidos). Pero
-- pedidos tiene RLS que solo deja ver cada pedido a su comprador o al
-- dueño de la tienda — así que una visita pública a /tienda/[tiendaId] no
-- puede sumar pedidos.total directamente sin saltarse esa protección.
--
-- Esta función expone SOLO el agregado (un número), nunca las filas de
-- pedidos individuales (que tienen direcciones, montos, método de pago,
-- etc.). Es el patrón recomendado por Supabase para exponer estadísticas
-- públicas sin debilitar RLS en la tabla protegida.

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

-- Es intencional que anon/authenticated puedan ejecutarla: es un dato
-- público de la tienda (igual que su rating o cantidad de productos).
revoke all on function public.get_tienda_ventas_totales(text) from public, anon, authenticated;
grant execute on function public.get_tienda_ventas_totales(text) to anon, authenticated;
