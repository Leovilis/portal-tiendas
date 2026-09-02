# PortalTiendas

Marketplace donde tiendas independientes venden sus propios productos: alta de tienda para
vendedores, gestión de productos con stock real, carrito y checkout, pedidos reales, reseñas de
compradores verificados, y cobro online con MercadoPago (cada tienda cobra a su propia cuenta).

## Desarrollo local

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

### Variables de entorno

Creá un archivo `.env.local` en la raíz (nunca lo subas a git) con:

```bash
# Panel de Supabase → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key

# Panel de Supabase → Settings → API → "service_role" (secreto, nunca lo expongas al cliente).
# Lo usa únicamente el webhook de MercadoPago (app/api/mercadopago/webhook), que corre sin
# sesión de usuario y necesita saltarse RLS para confirmar un pago.
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# URL pública donde corre el sitio. En local podés dejarla en localhost (MercadoPago no va a
# poder llamar al webhook ahí, pero "Mis pedidos" igual verifica el pago al volver). En
# producción, poné el dominio real (ver sección de deploy).
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Base de datos

Todo el esquema y las funciones viven en `supabase/migrations/`, en orden. Cada archivo indica si
ya está aplicado en el proyecto de Supabase vía MCP; son idempotentes, así que también se pueden
correr con `supabase db push` en un proyecto nuevo.

## Cobro con MercadoPago

Cada tienda conecta su propia cuenta desde su panel (`Panel de vendedor → Cobros`), pegando su
Access Token de MercadoPago:

- **Modo prueba**: se consigue gratis en el [panel de desarrollador de MercadoPago](https://www.mercadopago.com.ar/developers/panel/app),
  dentro de tu aplicación → "Credenciales de prueba". Sirve para probar el flujo completo sin
  plata real (usando [usuarios de prueba](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/additional-content/your-integrations/test/accounts)).
- **Modo producción**: mismas pantallas, pestaña "Credenciales de producción". Ahí sí se cobra
  plata real, directo a la cuenta de esa tienda — PortalTiendas nunca la recibe.

El webhook (`/api/mercadopago/webhook`) es quien confirma el pago de forma autoritativa (siempre
re-consulta la API de MercadoPago, nunca confía en el aviso en sí). **Solo puede recibir avisos si
el sitio es públicamente accesible por HTTPS** — en `localhost` no va a llegar. Para probar el
flujo completo en desarrollo sin deployar, hay dos opciones:

1. Con un túnel como [ngrok](https://ngrok.com/) apuntando a tu `localhost:3000`, y esa URL de
   ngrok como `NEXT_PUBLIC_SITE_URL`.
2. Sin túnel: al volver del pago, `/pedidos` re-verifica el estado automáticamente contra la API de
   MercadoPago (no depende únicamente del webhook), así que también funciona en local, solo que con
   unos segundos de diferencia respecto a producción.

## Deploy en Vercel

1. Subí este proyecto a un repositorio de GitHub/GitLab/Bitbucket.
2. En [vercel.com/new](https://vercel.com/new), importá ese repositorio (Vercel detecta Next.js
   automáticamente, no hace falta configurar nada del build).
3. En "Environment Variables", cargá las mismas variables de `.env.local` de arriba. Como
   `NEXT_PUBLIC_SITE_URL`, poné el dominio que Vercel te asigna (por ejemplo
   `https://portaltiendas.vercel.app`) — podés actualizarlo después de la primera vez que
   deployes si querés usar un dominio propio.
4. Deployá. Una vez que el sitio esté online:
   - Los vendedores que ya cargaron su Access Token de MercadoPago van a poder recibir pagos y
     confirmaciones automáticas de inmediato (el webhook ya tiene una URL pública real).
   - Si el login con Google está habilitado en tu proyecto de Supabase, agregá la URL de
     producción (`https://tu-dominio/auth/callback`) a las "Redirect URLs" permitidas en
     Supabase → Authentication → URL Configuration.
5. Cada `git push` a la rama principal genera un nuevo deploy automáticamente.

### Nota sobre el plan gratuito de Supabase

Un proyecto de Supabase en el plan gratuito se pausa solo después de varios días sin actividad. Si
eso pasa, el sitio va a mostrar errores hasta que lo reactivés manualmente desde el dashboard de
Supabase (tarda un par de minutos en volver a estar activo). Para un sitio en producción real, vale
la pena evaluar pasar a un plan pago para evitar ese riesgo.
