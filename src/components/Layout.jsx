import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useAuth } from '../context/AuthContext'

// Layout para las vistas autenticadas de admin/empleado: sidebar fijo con perfil + navegación
export default function Layout() {
  const { usuario } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <Sidebar rol={usuario?.rol} />
      <main className="sm:pl-72 p-6">
        <Outlet />
      </main>
    </div>
  )
}
