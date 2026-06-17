import { createContext, useContext, useState } from 'react'
import { useData } from './DataContext'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

// Provee el usuario logueado y las acciones de login/logout
// Debe montarse dentro de DataProvider para acceder a la lista de usuarios actualizada.
// Login intenta primero contra Supabase Auth (cuentas reales, hoy solo el super admin);
// si no coincide, cae al array local en memoria (manager/empleado/cliente)
export function AuthProvider({ children }) {
  const { usuarios } = useData()
  const [usuario, setUsuario] = useState(null)

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error && data.user) {
      const { data: perfil } = await supabase
        .from('profiles')
        .select('nombre, apellido, telefono, direccion, ciudad, dni, rol')
        .eq('id', data.user.id)
        .single()
      const usuarioSupabase = {
        id: data.user.id,
        nombre: perfil?.nombre || data.user.email,
        apellido: perfil?.apellido || '',
        telefono: perfil?.telefono || '',
        direccion: perfil?.direccion || '',
        ciudad: perfil?.ciudad || '',
        dni: perfil?.dni || '',
        email: data.user.email,
        rol: perfil?.rol || 'cliente',
      }
      setUsuario(usuarioSupabase)
      return { ok: true, usuario: usuarioSupabase }
    }

    const encontrado = usuarios.find(
      (u) => u.email === email && u.password === password
    )
    if (encontrado) {
      setUsuario(encontrado)
      return { ok: true, usuario: encontrado }
    }
    return { ok: false, error: 'Email o contraseña incorrectos' }
  }

  const logout = () => {
    supabase.auth.signOut()
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- el hook vive junto a su Provider a propósito
export function useAuth() {
  return useContext(AuthContext)
}
