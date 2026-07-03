import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)
const CLAVE_STORAGE = 'vivero-takumi:tema'

export function ThemeProvider({ children }) {
  const [oscuro, setOscuro] = useState(() => {
    const guardado = localStorage.getItem(CLAVE_STORAGE) === 'true'
    document.documentElement.classList.toggle('dark', guardado)
    return guardado
  })

  useEffect(() => {
    localStorage.setItem(CLAVE_STORAGE, String(oscuro))
    document.documentElement.classList.toggle('dark', oscuro)
  }, [oscuro])

  const toggleTema = () => setOscuro((v) => !v)

  return <ThemeContext.Provider value={{ oscuro, toggleTema }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
