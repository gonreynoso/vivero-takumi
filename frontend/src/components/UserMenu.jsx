import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Boxes, ChevronDown, LayoutDashboard, LogOut, Package, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const enlacesPorRol = {
  cliente: [
    { to: '/perfil', label: 'Mi perfil', icon: User },
    { to: '/mis-pedidos', label: 'Mis compras', icon: Package },
  ],
  admin: [{ to: '/admin/dashboard', label: 'Panel de administración', icon: LayoutDashboard }],
  manager: [{ to: '/admin/dashboard', label: 'Panel de administración', icon: LayoutDashboard }],
  empleado: [{ to: '/empleado/stock', label: 'Panel de empleado', icon: Boxes }],
}

export default function UserMenu() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const [abierto, setAbierto] = useState(false)
  const contenedorRef = useRef(null)
  // Solo abrir por hover en dispositivos con puntero fino (mouse), nunca en touch.
  // Algunos navegadores mobile reportan `hover: hover`, por eso sumamos `pointer: fine`.
  const [puedeHover] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  )

  // Cerrar al hacer clic fuera o presionar Escape
  useEffect(() => {
    if (!abierto) return
    const alClickAfuera = (e) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
        setAbierto(false)
      }
    }
    const alPresionarTecla = (e) => {
      if (e.key === 'Escape') setAbierto(false)
    }
    document.addEventListener('mousedown', alClickAfuera)
    document.addEventListener('keydown', alPresionarTecla)
    return () => {
      document.removeEventListener('mousedown', alClickAfuera)
      document.removeEventListener('keydown', alPresionarTecla)
    }
  }, [abierto])

  if (!usuario) return null

  const iniciales = `${usuario.nombre?.[0] || ''}${usuario.apellido?.[0] || ''}`.toUpperCase() || 'U'
  const enlaces = enlacesPorRol[usuario.rol] ?? []

  const handleLogout = () => {
    setAbierto(false)
    logout()
    navigate('/login')
  }

  return (
    <div
      ref={contenedorRef}
      className="relative"
      onPointerEnter={puedeHover ? () => setAbierto(true) : undefined}
      onPointerLeave={puedeHover ? () => setAbierto(false) : undefined}
    >
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={abierto}
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-1.5 sm:pr-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-accent to-primary text-white text-sm font-semibold shrink-0">
          {iniciales}
        </span>
        <span className="text-right hidden sm:block leading-tight">
          <span className="block text-sm font-medium text-gray-800 dark:text-gray-100">{usuario.nombre}</span>
          <span className="block text-xs text-gray-400 dark:text-gray-500 capitalize">{usuario.rol}</span>
        </span>
        <ChevronDown
          className={`hidden sm:block w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${abierto ? 'rotate-180' : ''}`}
        />
      </button>

      {abierto && (
        <div className="absolute right-0 top-full pt-2 w-56 z-30">
          <div
            role="menu"
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 origin-top-right"
          >
          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 mb-1">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{usuario.nombre}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{usuario.email}</p>
          </div>

          {enlaces.map(({ to, label, icon: Icono }) => (
            <Link
              key={to}
              to={to}
              role="menuitem"
              onClick={() => setAbierto(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <Icono className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              {label}
            </Link>
          ))}

          <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
            <button
              type="button"
              onClick={handleLogout}
              role="menuitem"
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
          </div>
        </div>
      )}
    </div>
  )
}
