import { createContext, useContext, useState } from 'react'
import { useData } from './DataContext'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { usuarios } = useData()
  const [usuario, setUsuario] = useState(null)

  const login = async (email, password) => {
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
