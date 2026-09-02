-- 0002_enable_rls_baseline_policies.sql
-- Ya aplicada en tu proyecto Supabase (portal-tiendas) vía MCP. Este archivo
-- queda en el repo como registro versionado de lo que se corrió. Es
-- idempotente (drop policy if exists + create policy), se puede re-ejecutar
-- sin romper nada.
--
-- Qué hace: activa Row Level Security en las 9 tablas de public y define un
-- set de políticas base:
--   - Lectura pública en lo que es "vidriera" del marketplace: users,
--     tiendas, productos, reviews.
--   - Escritura limitada al dueño de la tienda (via users.tiendaId) en
--     tiendas, productos, tienda_configs, integraciones.
--   - pedidos / pedido_productos / pedido_historial visibles solo para el
--     comprador (usuarioId) o el vendedor dueño de la tienda del pedido.
--   - tienda_configs / integraciones totalmente privadas (tienen API keys /
--     tokens), solo accesibles por el dueño de la tienda.

alter table public.users enable row level security;
alter table public.tiendas enable row level security;
alter table public.productos enable row level security;
alter table public.reviews enable row level security;
alter table public.pedidos enable row level security;
alter table public.pedido_productos enable row level security;
alter table public.pedido_historial enable row level security;
alter table public.tienda_configs enable row level security;
alter table public.integraciones enable row level security;

-- users: perfil público (nombre/rol visibles para el marketplace), cada
-- quien crea y edita solo su propia fila.
drop policy if exists users_select_public on public.users;
create policy users_select_public on public.users
    for select
    using (true);

drop policy if exists users_insert_own on public.users;
create policy users_insert_own on public.users
    for insert
    with check (auth.uid() = id);

drop policy if exists users_update_own on public.users;
create policy users_update_own on public.users
    for update
    using (auth.uid() = id)
    with check (auth.uid() = id);

-- tiendas: lectura pública, alta solo para VENDEDOR, edición/baja solo del
-- dueño (usuario cuyo tiendaId apunta a esa tienda).
drop policy if exists tiendas_select_public on public.tiendas;
create policy tiendas_select_public on public.tiendas
    for select
    using (true);

drop policy if exists tiendas_insert_vendedor on public.tiendas;
create policy tiendas_insert_vendedor on public.tiendas
    for insert
    to authenticated
    with check (
        exists (
            select 1 from public.users u
            where u.id = auth.uid() and u.role = 'VENDEDOR'::"Role"
        )
    );

drop policy if exists tiendas_update_owner on public.tiendas;
create policy tiendas_update_owner on public.tiendas
    for update
    using (
        exists (
            select 1 from public.users u
            where u.id = auth.uid() and u."tiendaId" = tiendas.id
        )
    )
    with check (
        exists (
            select 1 from public.users u
            where u.id = auth.uid() and u."tiendaId" = tiendas.id
        )
    );

drop policy if exists tiendas_delete_owner on public.tiendas;
create policy tiendas_delete_owner on public.tiendas
    for delete
    using (
        exists (
            select 1 from public.users u
            where u.id = auth.uid() and u."tiendaId" = tiendas.id
        )
    );

-- productos: lectura pública, escritura (insert/update/delete) solo del
-- dueño de la tienda a la que pertenece el producto.
drop policy if exists productos_select_public on public.productos;
create policy productos_select_public on public.productos
    for select
    using (true);

drop policy if exists productos_write_owner on public.productos;
create policy productos_write_owner on public.productos
    for all
    using (
        exists (
            select 1 from public.users u
            where u.id = auth.uid() and u."tiendaId" = productos."tiendaId"
        )
    )
    with check (
        exists (
            select 1 from public.users u
            where u.id = auth.uid() and u."tiendaId" = productos."tiendaId"
        )
    );

-- reviews: lectura pública, cada usuario crea/edita/borra solo las suyas.
drop policy if exists reviews_select_public on public.reviews;
create policy reviews_select_public on public.reviews
    for select
    using (true);

drop policy if exists reviews_insert_own on public.reviews;
create policy reviews_insert_own on public.reviews
    for insert
    with check (auth.uid() = "usuarioId");

drop policy if exists reviews_update_own on public.reviews;
create policy reviews_update_own on public.reviews
    for update
    using (auth.uid() = "usuarioId")
    with check (auth.uid() = "usuarioId");

drop policy if exists reviews_delete_own on public.reviews;
create policy reviews_delete_own on public.reviews
    for delete
    using (auth.uid() = "usuarioId");

-- pedidos: visibles para el comprador o el vendedor dueño de la tienda del
-- pedido. El comprador crea sus propios pedidos; comprador o vendedor
-- pueden actualizarlos (ej. cambios de estado).
drop policy if exists pedidos_select_involved on public.pedidos;
create policy pedidos_select_involved on public.pedidos
    for select
    using (
        auth.uid() = "usuarioId"
        or exists (
            select 1 from public.users u
            where u.id = auth.uid() and u."tiendaId" = pedidos."tiendaId"
        )
    );

drop policy if exists pedidos_insert_own on public.pedidos;
create policy pedidos_insert_own on public.pedidos
    for insert
    with check (auth.uid() = "usuarioId");

drop policy if exists pedidos_update_involved on public.pedidos;
create policy pedidos_update_involved on public.pedidos
    for update
    using (
        auth.uid() = "usuarioId"
        or exists (
            select 1 from public.users u
            where u.id = auth.uid() and u."tiendaId" = pedidos."tiendaId"
        )
    );

-- pedido_productos: mismo criterio que el pedido al que pertenecen.
drop policy if exists pedido_productos_select_involved on public.pedido_productos;
create policy pedido_productos_select_involved on public.pedido_productos
    for select
    using (
        exists (
            select 1 from public.pedidos p
            where p.id = pedido_productos."pedidoId"
              and (
                  auth.uid() = p."usuarioId"
                  or exists (
                      select 1 from public.users u
                      where u.id = auth.uid() and u."tiendaId" = p."tiendaId"
                  )
              )
        )
    );

drop policy if exists pedido_productos_insert_own on public.pedido_productos;
create policy pedido_productos_insert_own on public.pedido_productos
    for insert
    with check (
        exists (
            select 1 from public.pedidos p
            where p.id = pedido_productos."pedidoId"
              and p."usuarioId" = auth.uid()
        )
    );

-- pedido_historial: mismo criterio; el registro de historial lo agrega
-- quien esté involucrado en el pedido (comprador o vendedor).
drop policy if exists pedido_historial_select_involved on public.pedido_historial;
create policy pedido_historial_select_involved on public.pedido_historial
    for select
    using (
        exists (
            select 1 from public.pedidos p
            where p.id = pedido_historial."pedidoId"
              and (
                  auth.uid() = p."usuarioId"
                  or exists (
                      select 1 from public.users u
                      where u.id = auth.uid() and u."tiendaId" = p."tiendaId"
                  )
              )
        )
    );

drop policy if exists pedido_historial_insert_owner on public.pedido_historial;
create policy pedido_historial_insert_owner on public.pedido_historial
    for insert
    with check (
        exists (
            select 1 from public.pedidos p
            join public.users u on u."tiendaId" = p."tiendaId"
            where p.id = pedido_historial."pedidoId"
              and u.id = auth.uid()
        )
    );

-- tienda_configs / integraciones: totalmente privadas, contienen datos
-- sensibles (config de la tienda, API keys / tokens de integraciones).
-- Solo el dueño de la tienda puede leer o escribir.
drop policy if exists tienda_configs_owner_all on public.tienda_configs;
create policy tienda_configs_owner_all on public.tienda_configs
    for all
    using (
        exists (
            select 1 from public.users u
            where u.id = auth.uid() and u."tiendaId" = tienda_configs."tiendaId"
        )
    )
    with check (
        exists (
            select 1 from public.users u
            where u.id = auth.uid() and u."tiendaId" = tienda_configs."tiendaId"
        )
    );

drop policy if exists integraciones_owner_all on public.integraciones;
create policy integraciones_owner_all on public.integraciones
    for all
    using (
        exists (
            select 1 from public.users u
            where u.id = auth.uid() and u."tiendaId" = integraciones."tiendaId"
        )
    )
    with check (
        exists (
            select 1 from public.users u
            where u.id = auth.uid() and u."tiendaId" = integraciones."tiendaId"
        )
    );
