import { createContext, useContext, useEffect, useState } from 'react'
import { authApi, clearTokens, setTokens, getAccessToken } from '../lib/api'

const AuthContext = createContext(null)
const SESION_KEY = 'vivero-takumi:sesion'

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function restaurarSesion() {
      if (!getAccessToken()) {
        setCargando(false)
        return
      }
      try {
        const data = await authApi.me()
        setUsuario(data.usuario)
        localStorage.setItem(SESION_KEY, String(data.usuario.id))
      } catch {
        clearTokens()
        localStorage.removeItem(SESION_KEY)
      } finally {
        setCargando(false)
      }
    }
    restaurarSesion()
  }, [])

  const login = async (email, password) => {
    try {
      const data = await authApi.login(email, password)
      setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken })
      setUsuario(data.usuario)
      localStorage.setItem(SESION_KEY, String(data.usuario.id))
      return { ok: true, usuario: data.usuario }
    } catch (error) {
      return { ok: false, error: error.message || 'Email o contraseña incorrectos' }
    }
  }

  const logout = () => {
    clearTokens()
    localStorage.removeItem(SESION_KEY)
    setUsuario(null)
  }

  const actualizarUsuario = (nuevo) => {
    setUsuario(nuevo)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout, actualizarUsuario, cargando }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
