-- 0001_profiles.sql
-- Tabla de perfiles públicos, uno por usuario de auth.users.
-- Corré este archivo completo en Supabase → SQL Editor → New query → Run.

create table if not exists public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    nombre text,
    tipo_cuenta text not null default 'comprador' check (tipo_cuenta in ('comprador', 'vendedor')),
    avatar_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Perfil público de cada usuario autenticado (1 a 1 con auth.users).';

-- Mantener updated_at al día en cada UPDATE
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
    before update on public.profiles
    for each row
    execute function public.set_updated_at();

-- Row Level Security: cada quien lee/edita su propio perfil, pero el nombre
-- y avatar de una tienda deben poder mostrarse públicamente (p. ej. "Vendido
-- por Juan"), así que permitimos lectura pública y solo restringimos escritura.
alter table public.profiles enable row level security;

drop policy if exists "Los perfiles son visibles públicamente" on public.profiles;
create policy "Los perfiles son visibles públicamente"
    on public.profiles for select
    using (true);

drop policy if exists "Un usuario puede insertar su propio perfil" on public.profiles;
create policy "Un usuario puede insertar su propio perfil"
    on public.profiles for insert
    with check (auth.uid() = id);

drop policy if exists "Un usuario puede actualizar su propio perfil" on public.profiles;
create policy "Un usuario puede actualizar su propio perfil"
    on public.profiles for update
    using (auth.uid() = id)
    with check (auth.uid() = id);

-- Crea automáticamente la fila en profiles cuando alguien se registra,
-- ya sea con email/contraseña (usamos las opciones "data" del signUp) o con
-- Google OAuth (Supabase completa raw_user_meta_data con full_name/avatar_url).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.profiles (id, nombre, tipo_cuenta, avatar_url)
    values (
        new.id,
        coalesce(
            new.raw_user_meta_data ->> 'nombre',
            new.raw_user_meta_data ->> 'full_name',
            new.raw_user_meta_data ->> 'name',
            split_part(new.email, '@', 1)
        ),
        coalesce(new.raw_user_meta_data ->> 'tipo_cuenta', 'comprador'),
        coalesce(
            new.raw_user_meta_data ->> 'avatar_url',
            new.raw_user_meta_data ->> 'picture'
        )
    )
    on conflict (id) do nothing;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row
    execute function public.handle_new_user();
