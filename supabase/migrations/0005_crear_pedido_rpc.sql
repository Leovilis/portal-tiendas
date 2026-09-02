-- 0005_crear_pedido_rpc.sql
-- Ya aplicada en tu proyecto Supabase (portal-tiendas) vía MCP. Registro
-- versionado (create or replace, se puede re-ejecutar sin romper nada).
--
-- Por qué existe: el checkout (sin pasarela de pago) necesita, en una sola
-- operación atómica: crear el pedido, crear sus líneas (pedido_productos),
-- descontar stock real de productos, y dejar un registro en
-- pedido_historial. Un comprador no tiene permiso de UPDATE sobre
-- productos (esa política es solo para el dueño de la tienda), así que
-- descontar stock directo desde el cliente no es posible ni deseable.
--
-- Esta función RPC hace todo eso con SECURITY DEFINER, pero validando del
-- lado del servidor lo importante:
--   - que haya sesión iniciada (auth.uid())
--   - que haya stock suficiente (con "for update" para evitar oversell si
--     dos compras concurrentes agarran el mismo producto)
--   - que el precio se calcule con los datos reales de public.productos,
--     nunca con lo que mande el cliente (evita manipular precios desde el
--     navegador)
--
-- Devuelve el id del pedido creado.

create or replace function public.crear_pedido(
  p_tienda_id text,
  p_direccion jsonb,
  p_metodo_pago text,
  p_items jsonb -- [{"productoId": "...", "cantidad": 2}, ...]
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_usuario_id uuid := auth.uid();
  v_pedido_id text := gen_random_uuid()::text;
  v_item jsonb;
  v_producto_id text;
  v_cantidad int;
  v_precio numeric;
  v_precio_oferta numeric;
  v_stock int;
  v_tienda_producto text;
  v_precio_unitario numeric;
  v_subtotal numeric := 0;
begin
  if v_usuario_id is null then
    raise exception 'Debés iniciar sesión para confirmar un pedido.';
  end if;

  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'El pedido no tiene productos.';
  end if;

  insert into public.pedidos (
    id, "tiendaId", "usuarioId", estado, total, subtotal, impuestos, envio,
    direccion, "metodoPago", pagado, "updatedAt"
  ) values (
    v_pedido_id, p_tienda_id, v_usuario_id, 'PENDIENTE', 0, 0, 0, 0,
    p_direccion, p_metodo_pago, false, now()
  );

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_producto_id := v_item->>'productoId';
    v_cantidad := (v_item->>'cantidad')::int;

    if v_cantidad is null or v_cantidad <= 0 then
      raise exception 'Cantidad inválida para el producto %.', v_producto_id;
    end if;

    select precio, "precioOferta", stock, "tiendaId"
      into v_precio, v_precio_oferta, v_stock, v_tienda_producto
      from public.productos
      where id = v_producto_id
      for update;

    if not found then
      raise exception 'El producto % ya no existe.', v_producto_id;
    end if;

    if v_tienda_producto <> p_tienda_id then
      raise exception 'Todos los productos del pedido deben pertenecer a la misma tienda.';
    end if;

    if v_stock < v_cantidad then
      raise exception 'No queda stock suficiente de un producto (quedan %).', v_stock;
    end if;

    v_precio_unitario := coalesce(v_precio_oferta, v_precio);
    v_subtotal := v_subtotal + v_precio_unitario * v_cantidad;

    insert into public.pedido_productos (id, "pedidoId", "productoId", cantidad, "precioUnitario", subtotal)
    values (gen_random_uuid()::text, v_pedido_id, v_producto_id, v_cantidad, v_precio_unitario, v_precio_unitario * v_cantidad);

    update public.productos set stock = stock - v_cantidad where id = v_producto_id;
  end loop;

  update public.pedidos set total = v_subtotal, subtotal = v_subtotal where id = v_pedido_id;

  insert into public.pedido_historial (id, "pedidoId", estado, descripcion)
  values (gen_random_uuid()::text, v_pedido_id, 'PENDIENTE', 'Pedido creado por el comprador.');

  return v_pedido_id;
end;
$$;

-- Solo usuarios logueados pueden ejecutarla (no anon): igual la función
-- valida auth.uid() adentro por las dudas, pero no tiene sentido exponerla
-- a anon.
revoke all on function public.crear_pedido(text, jsonb, text, jsonb) from public, anon;
grant execute on function public.crear_pedido(text, jsonb, text, jsonb) to authenticated;
