-- 0001_link_users_to_auth.sql
-- Ya aplicada en tu proyecto Supabase (portal-tiendas) vía MCP. Este archivo
-- queda en el repo como registro versionado de lo que se corrió, y para que
-- `supabase db push`/CLI no la vuelva a intentar en otro entorno sin este
-- historial. Es idempotente: se puede re-ejecutar sin romper nada.
--
-- Qué hace: reconecta public.users (que tenía id de texto tipo Prisma y una
-- columna password propia) a Supabase Auth. Las filas existentes (por
-- ejemplo cuentas de prueba ya cargadas) se conservan con un uuid nuevo;
-- cuando esa persona se registre de nuevo con el mismo email vía Supabase
-- Auth, el trigger de más abajo reconecta esa fila en vez de duplicarla.

-- 0) Limpiar restos de intentos previos
drop index if exists public.users_email_key;

-- 1) FKs que dependen del tipo de users.id
alter table public.pedidos drop constraint if exists "pedidos_usuarioId_fkey";
alter table public.reviews drop constraint if exists "reviews_usuarioId_fkey";
alter table public.users drop constraint if exists "users_pkey";

-- 2) Reemplazar id (text) por uuid nuevo, preservando el resto de columnas
alter table public.users add column if not exists id_new uuid not null default gen_random_uuid();

do $$
begin
    if exists (
        select 1 from information_schema.columns
        where table_schema = 'public' and table_name = 'users' and column_name = 'id'
    ) then
        alter table public.users drop column id;
    end if;
end $$;

do $$
begin
    if exists (
        select 1 from information_schema.columns
        where table_schema = 'public' and table_name = 'users' and column_name = 'id_new'
    ) then
        alter table public.users rename column id_new to id;
    end if;
end $$;

do $$
begin
    if not exists (select 1 from pg_constraint where conrelid = 'public.users'::regclass and contype = 'p') then
        alter table public.users add primary key (id);
    end if;
end $$;

-- 3) usuarioId en pedidos/reviews -> uuid (tablas vacías, cast trivial)
alter table public.pedidos alter column "usuarioId" type uuid using "usuarioId"::uuid;
alter table public.reviews alter column "usuarioId" type uuid using "usuarioId"::uuid;

-- 4) Ya no gestionamos contraseñas nosotros: eso lo hace Supabase Auth
alter table public.users drop column if exists password;

-- 5) email sin duplicados + updatedAt con default
do $$
begin
    if not exists (select 1 from pg_constraint where conname = 'users_email_key' and conrelid = 'public.users'::regclass) then
        alter table public.users add constraint users_email_key unique (email);
    end if;
end $$;

alter table public.users alter column "updatedAt" set default now();

-- 6) FK a auth.users (NOT VALID: filas legacy aún sin cuenta real en auth.users)
do $$
begin
    if not exists (select 1 from pg_constraint where conname = 'users_id_fkey' and conrelid = 'public.users'::regclass) then
        alter table public.users
            add constraint users_id_fkey foreign key (id) references auth.users (id) on delete cascade not valid;
    end if;
end $$;

-- 7) Volver a crear las FKs hacia users (uuid -> uuid)
do $$
begin
    if not exists (select 1 from pg_constraint where conname = 'pedidos_usuarioId_fkey' and conrelid = 'public.pedidos'::regclass) then
        alter table public.pedidos
            add constraint "pedidos_usuarioId_fkey" foreign key ("usuarioId") references public.users (id) on delete set null;
    end if;
end $$;

do $$
begin
    if not exists (select 1 from pg_constraint where conname = 'reviews_usuarioId_fkey' and conrelid = 'public.reviews'::regclass) then
        alter table public.reviews
            add constraint "reviews_usuarioId_fkey" foreign key ("usuarioId") references public.users (id) on delete cascade;
    end if;
end $$;

-- 8) Mantener updatedAt al día en cada UPDATE
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
    new."updatedAt" = now();
    return new;
end;
$$;

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
    before update on public.users
    for each row
    execute function public.set_updated_at();

-- 9) Trigger: cada signup en auth.users crea/reconecta su fila en public.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.users (id, email, name, role, image, "updatedAt")
    values (
        new.id,
        new.email,
        coalesce(
            new.raw_user_meta_data ->> 'name',
            new.raw_user_meta_data ->> 'full_name',
            split_part(new.email, '@', 1)
        ),
        case
            when upper(coalesce(new.raw_user_meta_data ->> 'role', 'USER')) = 'VENDEDOR'
                then 'VENDEDOR'::"Role"
            else 'USER'::"Role"
        end,
        coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture'),
        now()
    )
    on conflict (email) do update
        set id = excluded.id,
            "updatedAt" = now();
    return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row
    execute function public.handle_new_user();
