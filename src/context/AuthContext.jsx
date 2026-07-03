import { createContext, useContext, useEffect, useState } from 'react'
import { useData } from './DataContext'

const AuthContext = createContext(null)
const SESION_KEY = 'vivero-takumi:sesion'

export function AuthProvider({ children }) {
  const { usuarios } = useData()
  const [usuario, setUsuario] = useState(null)

  useEffect(() => {
    if (!usuarios.length) return

    if (usuario?.id) {
      const actualizado = usuarios.find((u) => u.id === usuario.id)
      if (
        actualizado &&
        (actualizado.nombre !== usuario.nombre ||
          actualizado.email !== usuario.email ||
          actualizado.rol !== usuario.rol ||
          actualizado.password !== usuario.password)
      ) {
        setUsuario(actualizado)
      }
      return
    }

    try {
      const id = localStorage.getItem(SESION_KEY)
      if (!id) return
      const encontrado = usuarios.find((u) => u.id === Number(id))
      if (encontrado) setUsuario(encontrado)
      else localStorage.removeItem(SESION_KEY)
    } catch {
      void 0
    }
  }, [usuarios, usuario?.id])

  const login = async (email, password) => {
    const encontrado = usuarios.find(
      (u) => u.email === email && u.password === password
    )
    if (encontrado) {
      setUsuario(encontrado)
      try {
        localStorage.setItem(SESION_KEY, String(encontrado.id))
      } catch {
        void 0
      }
      return { ok: true, usuario: encontrado }
    }
    return { ok: false, error: 'Email o contraseña incorrectos' }
  }

  const logout = () => {
    try {
      localStorage.removeItem(SESION_KEY)
    } catch {
      void 0
    }
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
