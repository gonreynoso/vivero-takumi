import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Leaf, Users, Package, ChevronDown, LogOut, MoreVertical } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navegacionPorRol = {
  admin: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/plantas', label: 'Plantas', icon: Leaf },
    { to: '/admin/usuarios', label: 'Usuarios', icon: Users },
  ],
  empleado: [{ to: '/empleado/stock', label: 'Stock', icon: Leaf }],
}

const estadosPedido = ['todos', 'pendiente', 'confirmado', 'entregado']

// Submenú colapsable con links anidados (usado para filtrar pedidos por estado)
function SubMenu({ children, icon: Icon, items }) {
  const [abierto, setAbierto] = useState(false)

  return (
    <div>
      <button
        className="w-full flex items-center justify-between text-gray-600 p-2 rounded-lg hover:bg-background active:bg-gray-100 duration-150"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
      >
        <div className="flex items-center gap-x-2">
          <Icon className="w-5 h-5 text-gray-500" />
          {children}
        </div>
        <ChevronDown className={`w-4 h-4 duration-150 ${abierto ? 'rotate-180' : ''}`} />
      </button>

      {abierto && (
        <ul className="mx-4 px-2 border-l border-gray-200 text-sm font-medium">
          {items.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `block p-2 rounded-lg capitalize hover:bg-background active:bg-gray-100 duration-150 ${
                    isActive ? 'text-primary font-semibold' : 'text-gray-600'
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Sidebar fijo del panel de admin/empleado, con perfil, navegación y submenú de pedidos
export default function Sidebar({ rol }) {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const navegacion = navegacionPorRol[rol] || []
  const pedidosPath = rol === 'admin' ? '/admin/pedidos' : '/empleado/pedidos'

  const menuRef = useRef(null)
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAbierto(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const iniciales = usuario?.nombre
    ?.split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <nav className="fixed top-0 left-0 w-full h-full border-r border-gray-100 bg-white sm:w-72 z-30 overflow-y-auto">
      <div className="flex flex-col h-full px-4">
        <div className="h-20 flex items-center pl-2">
          <div className="w-full flex items-center gap-x-3">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold flex-shrink-0">
              {iniciales}
            </div>
            <div className="flex-1 truncate">
              <span className="block text-gray-700 text-sm font-semibold truncate">
                {usuario?.nombre}
              </span>
              <span className="block mt-px text-gray-500 text-xs capitalize">{usuario?.rol}</span>
            </div>

            <div className="relative" ref={menuRef}>
              <button
                className="p-1.5 rounded-md text-gray-500 hover:bg-background active:bg-gray-100"
                onClick={() => setMenuAbierto((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuAbierto}
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {menuAbierto && (
                <div className="absolute z-10 top-10 right-0 w-56 rounded-lg bg-white shadow-md border border-gray-100 text-sm text-gray-600">
                  <div className="p-2 text-left">
                    <span className="block text-gray-400 p-2 truncate">{usuario?.email}</span>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full p-2 text-left rounded-md hover:bg-background active:bg-gray-100 duration-150"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-auto flex-1">
          <ul className="text-sm font-medium space-y-1">
            {navegacion.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-x-2 p-2 rounded-lg hover:bg-background active:bg-gray-100 duration-150 ${
                        isActive ? 'bg-primary text-white' : 'text-gray-600'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </NavLink>
                </li>
              )
            })}

            <li>
              <SubMenu
                icon={Package}
                items={estadosPedido.map((estado) => ({
                  to: `${pedidosPath}?estado=${estado}`,
                  label: estado,
                }))}
              >
                Pedidos
              </SubMenu>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
