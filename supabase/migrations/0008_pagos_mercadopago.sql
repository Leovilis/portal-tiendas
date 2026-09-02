-- 0008_pagos_mercadopago.sql
-- Ya aplicada en tu proyecto Supabase (portal-tiendas) vía MCP. Registro
-- versionado (idempotente, se puede re-ejecutar sin romper nada).
--
-- Por qué existe: implementa el cobro real con MercadoPago, con el modelo
-- "marketplace" (cada vendedor cobra a su propia cuenta, como Mercado
-- Libre): cada tienda carga su propio Access Token en tienda_configs, y al
-- pagar, el dinero va directo a la cuenta de MercadoPago de ESE vendedor.
--
-- Piezas:
--   1) Dos columnas nuevas en pedidos para rastrear la preferencia y el pago
--      de MercadoPago asociados.
--   2) Un constraint UNIQUE en tienda_configs."tiendaId" para poder hacer
--      upsert (una config por tienda).
--   3) obtener_datos_pago_pedido(pedidoId): función SECURITY DEFINER que le
--      permite al COMPRADOR obtener el Access Token del vendedor para armar
--      la preferencia de pago desde el servidor (nunca desde el navegador).
--      tienda_configs es owner-only por RLS (el comprador no es el dueño de
--      la tienda), así que esta función expone solo lo mínimo necesario
--      -no la tabla completa- y valida que el pedido sea del que llama.
--   4) tienda_acepta_pagos(tiendaId): función pública (sin datos sensibles)
--      que dice si una tienda tiene MercadoPago activado, para poder
--      mostrar u ocultar el botón "Pagar" sin poder leer el token.

alter table public.pedidos add column if not exists "mercadoPagoPreferenceId" text;
alter table public.pedidos add column if not exists "mercadoPagoPaymentId" text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'tienda_configs_tiendaid_key' and conrelid = 'public.tienda_configs'::regclass
  ) then
    alter table public.tienda_configs add constraint tienda_configs_tiendaid_key unique ("tiendaId");
  end if;
end $$;

create or replace function public.obtener_datos_pago_pedido(p_pedido_id text)
returns table (
  access_token text,
  tienda_id text,
  tienda_nombre text,
  total numeric,
  pagado boolean,
  preference_id text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_usuario_id uuid := auth.uid();
begin
  if v_usuario_id is null then
    raise exception 'Debés iniciar sesión.';
  end if;

  if not exists (
    select 1 from public.pedidos p where p.id = p_pedido_id and p."usuarioId" = v_usuario_id
  ) then
    raise exception 'Pedido no encontrado.';
  end if;

  return query
    select tc."mercadoPagoKey", p."tiendaId", t.nombre, p.total, p.pagado, p."mercadoPagoPreferenceId"
    from public.pedidos p
    join public.tiendas t on t.id = p."tiendaId"
    left join public.tienda_configs tc on tc."tiendaId" = p."tiendaId"
    where p.id = p_pedido_id;
end;
$$;

-- Solo el propio comprador (autenticado) puede pedir esto para SU pedido; la
-- función valida auth.uid() adentro. No tiene sentido exponerla a anon.
revoke all on function public.obtener_datos_pago_pedido(text) from public, anon;
grant execute on function public.obtener_datos_pago_pedido(text) to authenticated;

create or replace function public.tienda_acepta_pagos(p_tienda_id text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select tc."mercadoPago" and tc."mercadoPagoKey" is not null
     from public.tienda_configs tc
     where tc."tiendaId" = p_tienda_id),
    false
  );
$$;

-- Esta sí es pública: solo devuelve un booleano, nunca el token.
revoke all on function public.tienda_acepta_pagos(text) from public;
grant execute on function public.tienda_acepta_pagos(text) to authenticated, anon;
