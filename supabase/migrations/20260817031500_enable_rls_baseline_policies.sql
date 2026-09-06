-- RLS en las 9 tablas de public, con políticas base:
-- tiendas/productos/reviews/users: lectura pública (marketplace), escritura
-- restringida al dueño. pedidos y sus tablas relacionadas: privadas entre
-- comprador y la tienda involucrada. tienda_configs/integraciones: privadas,
-- solo el dueño de la tienda (tienen tokens/keys sensibles).

-- USERS
alter table public.users enable row level security;

drop policy if exists "users_select_public" on public.users;
create policy "users_select_public" on public.users for select using (true);

drop policy if exists "users_insert_own" on public.users;
create policy "users_insert_own" on public.users for insert
    with check (auth.uid() = id);

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own" on public.users for update
    using (auth.uid() = id)
    with check (auth.uid() = id);

-- TIENDAS
alter table public.tiendas enable row level security;

drop policy if exists "tiendas_select_public" on public.tiendas;
create policy "tiendas_select_public" on public.tiendas for select using (true);

drop policy if exists "tiendas_insert_vendedor" on public.tiendas;
create policy "tiendas_insert_vendedor" on public.tiendas for insert to authenticated
    with check (exists (
        select 1 from public.users u where u.id = auth.uid() and u.role = 'VENDEDOR'
    ));

drop policy if exists "tiendas_update_owner" on public.tiendas;
create policy "tiendas_update_owner" on public.tiendas for update
    using (exists (select 1 from public.users u where u.id = auth.uid() and u."tiendaId" = tiendas.id))
    with check (exists (select 1 from public.users u where u.id = auth.uid() and u."tiendaId" = tiendas.id));

drop policy if exists "tiendas_delete_owner" on public.tiendas;
create policy "tiendas_delete_owner" on public.tiendas for delete
    using (exists (select 1 from public.users u where u.id = auth.uid() and u."tiendaId" = tiendas.id));

-- PRODUCTOS
alter table public.productos enable row level security;

drop policy if exists "productos_select_public" on public.productos;
create policy "productos_select_public" on public.productos for select using (true);

drop policy if exists "productos_write_owner" on public.productos;
create policy "productos_write_owner" on public.productos for all
    using (exists (select 1 from public.users u where u.id = auth.uid() and u."tiendaId" = productos."tiendaId"))
    with check (exists (select 1 from public.users u where u.id = auth.uid() and u."tiendaId" = productos."tiendaId"));

-- REVIEWS
alter table public.reviews enable row level security;

drop policy if exists "reviews_select_public" on public.reviews;
create policy "reviews_select_public" on public.reviews for select using (true);

drop policy if exists "reviews_insert_own" on public.reviews;
create policy "reviews_insert_own" on public.reviews for insert
    with check (auth.uid() = "usuarioId");

drop policy if exists "reviews_update_own" on public.reviews;
create policy "reviews_update_own" on public.reviews for update
    using (auth.uid() = "usuarioId")
    with check (auth.uid() = "usuarioId");

drop policy if exists "reviews_delete_own" on public.reviews;
create policy "reviews_delete_own" on public.reviews for delete
    using (auth.uid() = "usuarioId");

-- PEDIDOS (privados: comprador o tienda involucrada)
alter table public.pedidos enable row level security;

drop policy if exists "pedidos_select_involved" on public.pedidos;
create policy "pedidos_select_involved" on public.pedidos for select
    using (
        auth.uid() = "usuarioId"
        or exists (select 1 from public.users u where u.id = auth.uid() and u."tiendaId" = pedidos."tiendaId")
    );

drop policy if exists "pedidos_insert_own" on public.pedidos;
create policy "pedidos_insert_own" on public.pedidos for insert
    with check (auth.uid() = "usuarioId");

drop policy if exists "pedidos_update_involved" on public.pedidos;
create policy "pedidos_update_involved" on public.pedidos for update
    using (
        auth.uid() = "usuarioId"
        or exists (select 1 from public.users u where u.id = auth.uid() and u."tiendaId" = pedidos."tiendaId")
    );

-- PEDIDO_PRODUCTOS (siguen al pedido)
alter table public.pedido_productos enable row level security;

drop policy if exists "pedido_productos_select_involved" on public.pedido_productos;
create policy "pedido_productos_select_involved" on public.pedido_productos for select
    using (exists (
        select 1 from public.pedidos p
        where p.id = pedido_productos."pedidoId"
          and (auth.uid() = p."usuarioId"
               or exists (select 1 from public.users u where u.id = auth.uid() and u."tiendaId" = p."tiendaId"))
    ));

drop policy if exists "pedido_productos_insert_own" on public.pedido_productos;
create policy "pedido_productos_insert_own" on public.pedido_productos for insert
    with check (exists (
        select 1 from public.pedidos p where p.id = pedido_productos."pedidoId" and p."usuarioId" = auth.uid()
    ));

-- PEDIDO_HISTORIAL (siguen al pedido)
alter table public.pedido_historial enable row level security;

drop policy if exists "pedido_historial_select_involved" on public.pedido_historial;
create policy "pedido_historial_select_involved" on public.pedido_historial for select
    using (exists (
        select 1 from public.pedidos p
        where p.id = pedido_historial."pedidoId"
          and (auth.uid() = p."usuarioId"
               or exists (select 1 from public.users u where u.id = auth.uid() and u."tiendaId" = p."tiendaId"))
    ));

drop policy if exists "pedido_historial_insert_owner" on public.pedido_historial;
create policy "pedido_historial_insert_owner" on public.pedido_historial for insert
    with check (exists (
        select 1 from public.pedidos p
        join public.users u on u."tiendaId" = p."tiendaId"
        where p.id = pedido_historial."pedidoId" and u.id = auth.uid()
    ));

-- TIENDA_CONFIGS (privado: solo el dueño de la tienda, contiene keys sensibles)
alter table public.tienda_configs enable row level security;

drop policy if exists "tienda_configs_owner_all" on public.tienda_configs;
create policy "tienda_configs_owner_all" on public.tienda_configs for all
    using (exists (select 1 from public.users u where u.id = auth.uid() and u."tiendaId" = tienda_configs."tiendaId"))
    with check (exists (select 1 from public.users u where u.id = auth.uid() and u."tiendaId" = tienda_configs."tiendaId"));

-- INTEGRACIONES (privado: solo el dueño de la tienda, contiene tokens)
alter table public.integraciones enable row level security;

drop policy if exists "integraciones_owner_all" on public.integraciones;
create policy "integraciones_owner_all" on public.integraciones for all
    using (exists (select 1 from public.users u where u.id = auth.uid() and u."tiendaId" = integraciones."tiendaId"))
    with check (exists (select 1 from public.users u where u.id = auth.uid() and u."tiendaId" = integraciones."tiendaId"));
