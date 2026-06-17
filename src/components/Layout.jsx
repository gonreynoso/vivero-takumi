import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'
import { useAuth } from '../context/AuthContext'

// Layout para las vistas autenticadas de admin/empleado: sidebar fijo con perfil + navegación
export default function Layout() {
  const { usuario } = useAuth()
  const [sidebarAbierto, setSidebarAbierto] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        rol={usuario?.rol}
        abierto={sidebarAbierto}
        onCerrar={() => setSidebarAbierto(false)}
      />

      <header className="sm:hidden h-16 bg-white border-b border-gray-100 flex items-center px-4 sticky top-0 z-20">
        <button
          onClick={() => setSidebarAbierto(true)}
          aria-label="Abrir menú"
          className="p-2 rounded-lg text-gray-600 hover:bg-background"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      <main className="p-6 sm:pl-[19.5rem]">
        <Outlet />
      </main>
    </div>
  )
}
