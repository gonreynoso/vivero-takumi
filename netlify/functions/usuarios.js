import { createClient } from '@supabase/supabase-js'

// Cliente admin: usa la Secret key (service_role), nunca expuesta al navegador.
// Bypasea RLS por diseño, así que toda la verificación de permisos vive en esta función.
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// Resuelve el rol del usuario autenticado a partir del Bearer token, o null si no es válido
async function obtenerRolDelToken(token) {
  if (!token) return null
  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !data.user) return null
  const { data: perfil } = await supabaseAdmin
    .from('profiles')
    .select('rol')
    .eq('id', data.user.id)
    .single()
  return perfil?.rol ?? null
}

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const token = (req.headers.get('authorization') || '').replace('Bearer ', '')
  const esAdmin = (await obtenerRolDelToken(token)) === 'admin'
  const body = await req.json()
  const { accion } = body

  // Crear es la única acción que puede llegar de un contexto sin sesión admin (ej. un futuro
  // signup público) — en ese caso el rol queda forzado a "cliente" sin importar qué se pida
  if (accion === 'crear') {
    const { nombre, email, password } = body
    const rol = esAdmin ? body.rol || 'cliente' : 'cliente'

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { nombre },
    })
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 })
    }

    // upsert: el trigger on_auth_user_created ya insertó un profile con rol "cliente" al crearse
    // el usuario en auth.users; si quien llama es admin y pidió otro rol, esto lo corrige
    const { error: errorPerfil } = await supabaseAdmin
      .from('profiles')
      .upsert({ id: data.user.id, nombre, email, rol })
    if (errorPerfil) {
      return new Response(JSON.stringify({ error: errorPerfil.message }), { status: 400 })
    }

    return new Response(JSON.stringify({ id: data.user.id, nombre, email, rol }), { status: 200 })
  }

  // El resto de las acciones son exclusivas del panel admin
  if (!esAdmin) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 403 })
  }

  if (accion === 'listar') {
    const { data, error } = await supabaseAdmin.from('profiles').select('id, nombre, email, rol')
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 })
    return new Response(JSON.stringify(data), { status: 200 })
  }

  if (accion === 'editar') {
    const { id, nombre, email, rol, password } = body
    if (password || email) {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(id, {
        ...(password ? { password } : {}),
        ...(email ? { email } : {}),
      })
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 })
    }
    const { error: errorPerfil } = await supabaseAdmin
      .from('profiles')
      .update({ nombre, email, rol })
      .eq('id', id)
    if (errorPerfil) return new Response(JSON.stringify({ error: errorPerfil.message }), { status: 400 })
    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  }

  if (accion === 'eliminar') {
    const { id } = body
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id)
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 })
    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  }

  return new Response(JSON.stringify({ error: 'Acción inválida' }), { status: 400 })
}
