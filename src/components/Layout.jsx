import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

// Layout para las vistas autenticadas de admin/empleado: sidebar fijo con perfil + navegación.
// La clase "dark" se aplica acá (no en <html>), así el modo oscuro queda exclusivo del admin.
export default function Layout() {
  const { usuario } = useAuth()
  const { oscuro } = useTheme()
  const [sidebarAbierto, setSidebarAbierto] = useState(false)

  return (
    <div className={oscuro ? 'dark' : ''}>
      <div className="min-h-screen bg-background dark:bg-gray-900">
        <Sidebar
          rol={usuario?.rol}
          abierto={sidebarAbierto}
          onCerrar={() => setSidebarAbierto(false)}
        />

        <header className="sm:hidden h-16 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex items-center px-4 sticky top-0 z-20">
          <button
            onClick={() => setSidebarAbierto(true)}
            aria-label="Abrir menú"
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-background dark:hover:bg-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <main className="p-6 sm:pl-[19.5rem]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
