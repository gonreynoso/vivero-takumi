import { supabase } from './supabaseClient'

// Llama a la Netlify Function de usuarios (listar/crear/editar/eliminar), mandando
// el token de sesión del admin actual para que el servidor verifique permisos
export async function llamarFuncionUsuarios(body) {
  const { data: sesion } = await supabase.auth.getSession()
  const token = sesion?.session?.access_token
  const respuesta = await fetch('/.netlify/functions/usuarios', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  })
  const json = await respuesta.json()
  if (!respuesta.ok) throw new Error(json.error || 'Error en el servidor')
  return json
}
