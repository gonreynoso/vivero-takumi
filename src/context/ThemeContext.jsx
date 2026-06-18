import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)
const CLAVE_STORAGE = 'vivero-takumi:tema'

// Tema oscuro exclusivo del panel de admin/empleado. La clase "dark" se aplica
// solo al contenedor de Layout (no a <html>), así el storefront nunca se ve afectado.
export function ThemeProvider({ children }) {
  const [oscuro, setOscuro] = useState(() => localStorage.getItem(CLAVE_STORAGE) === 'true')

  useEffect(() => {
    localStorage.setItem(CLAVE_STORAGE, String(oscuro))
  }, [oscuro])

  const toggleTema = () => setOscuro((v) => !v)

  return <ThemeContext.Provider value={{ oscuro, toggleTema }}>{children}</ThemeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- el hook vive junto a su Provider a propósito
export function useTheme() {
  return useContext(ThemeContext)
}
