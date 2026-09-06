-- Ver supabase/migrations/0007_crear_tienda_propia_rpc.sql en el repo para el
-- comentario completo. RPC atómica para que un VENDEDOR sin tienda cree la suya.

create or replace function public.crear_tienda_propia(
  p_nombre text,
  p_slug text,
  p_categoria text,
  p_descripcion text,
  p_ubicacion text,
  p_telefono text,
  p_email text,
  p_sitio_web text,
  p_tiempo_respuesta text
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_usuario_id uuid := auth.uid();
  v_role "Role";
  v_tienda_actual text;
  v_tienda_id text := gen_random_uuid()::text;
  v_slug text;
begin
  if v_usuario_id is null then
    raise exception 'Debés iniciar sesión para crear una tienda.';
  end if;

  if p_nombre is null or length(trim(p_nombre)) = 0 then
    raise exception 'El nombre de la tienda es obligatorio.';
  end if;

  if p_categoria is null or length(trim(p_categoria)) = 0 then
    raise exception 'La categoría es obligatoria.';
  end if;

  -- Lock de la fila del usuario: evita que un doble click (dos llamadas
  -- concurrentes a esta función) cree dos tiendas para la misma persona.
  select role, "tiendaId" into v_role, v_tienda_actual
    from public.users
    where id = v_usuario_id
    for update;

  if not found then
    raise exception 'No se encontró tu perfil de usuario.';
  end if;

  if v_role <> 'VENDEDOR' then
    raise exception 'Solo las cuentas de vendedor pueden crear una tienda.';
  end if;

  if v_tienda_actual is not null then
    raise exception 'Ya tenés una tienda creada.';
  end if;

  v_slug := coalesce(
    nullif(trim(p_slug), ''),
    lower(regexp_replace(trim(p_nombre), '[^a-zA-Z0-9]+', '-', 'g'))
  );

  insert into public.tiendas (
    id, nombre, slug, categoria, descripcion, ubicacion, telefono, email, "sitioWeb",
    "tiempoRespuesta", "esOficial", "esVerificada", nivel, rating, "totalReviews",
    "productosDestacados", "updatedAt"
  ) values (
    v_tienda_id, trim(p_nombre), v_slug,
    trim(p_categoria), nullif(trim(p_descripcion), ''), nullif(trim(p_ubicacion), ''),
    nullif(trim(p_telefono), ''), nullif(trim(p_email), ''), nullif(trim(p_sitio_web), ''),
    coalesce(nullif(trim(p_tiempo_respuesta), ''), 'Responde en minutos'),
    false, false, 'BRONCE', 0, 0, 0, now()
  );

  update public.users set "tiendaId" = v_tienda_id where id = v_usuario_id;

  return v_tienda_id;
end;
$$;

revoke all on function public.crear_tienda_propia(text, text, text, text, text, text, text, text, text) from public, anon;
grant execute on function public.crear_tienda_propia(text, text, text, text, text, text, text, text, text) to authenticated;
