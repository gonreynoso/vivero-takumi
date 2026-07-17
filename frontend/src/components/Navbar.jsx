import { useNavigate, Link, useLocation } from 'react-router-dom'
import { Home, Leaf, ShoppingCart, Package, LogOut, Info, Mail, User, Sprout } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { GlowMenu } from './GlowMenu'
import ThemeToggle from './ThemeToggle'
import UserMenu from './UserMenu'

const itemsPorRol = {
  cliente: [
    { to: '/', label: 'Inicio', icon: Home, gradient: 'radial-gradient(circle, rgba(82,183,136,0.25) 0%, rgba(82,183,136,0.08) 50%, transparent 100%)' },
    { to: '/catalogo', label: 'Catálogo', icon: Leaf, gradient: 'radial-gradient(circle, rgba(82,183,136,0.25) 0%, rgba(82,183,136,0.08) 50%, transparent 100%)' },
    { to: '/recomendador', label: 'Recomendador', icon: Sprout, gradient: 'radial-gradient(circle, rgba(82,183,136,0.25) 0%, rgba(82,183,136,0.08) 50%, transparent 100%)' },
    { to: '/mis-pedidos', label: 'Mis compras', icon: Package, gradient: 'radial-gradient(circle, rgba(82,183,136,0.25) 0%, rgba(82,183,136,0.08) 50%, transparent 100%)' },
    { to: '/nosotros', label: 'Nosotros', icon: Info, gradient: 'radial-gradient(circle, rgba(82,183,136,0.25) 0%, rgba(82,183,136,0.08) 50%, transparent 100%)' },
    { to: '/contacto', label: 'Contacto', icon: Mail, gradient: 'radial-gradient(circle, rgba(82,183,136,0.25) 0%, rgba(82,183,136,0.08) 50%, transparent 100%)' },
  ],
  invitado: [
    { to: '/', label: 'Inicio', icon: Home, gradient: 'radial-gradient(circle, rgba(82,183,136,0.25) 0%, rgba(82,183,136,0.08) 50%, transparent 100%)' },
    { to: '/catalogo', label: 'Catálogo', icon: Leaf, gradient: 'radial-gradient(circle, rgba(82,183,136,0.25) 0%, rgba(82,183,136,0.08) 50%, transparent 100%)' },
    { to: '/recomendador', label: 'Recomendador', icon: Sprout, gradient: 'radial-gradient(circle, rgba(82,183,136,0.25) 0%, rgba(82,183,136,0.08) 50%, transparent 100%)' },
    { to: '/nosotros', label: 'Nosotros', icon: Info, gradient: 'radial-gradient(circle, rgba(82,183,136,0.25) 0%, rgba(82,183,136,0.08) 50%, transparent 100%)' },
    { to: '/contacto', label: 'Contacto', icon: Mail, gradient: 'radial-gradient(circle, rgba(82,183,136,0.25) 0%, rgba(82,183,136,0.08) 50%, transparent 100%)' },
  ],
}

export default function Navbar() {
  const { usuario, logout } = useAuth()
  const cart = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const items = itemsPorRol[usuario?.rol] ?? itemsPorRol.invitado
  const activeItem = items?.find((item) =>
    item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)
  )?.label

  const logo = (
    <div className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
      <span className="text-xl">🌿</span>
      <span className="font-bold text-lg whitespace-nowrap">Vivero Takumi</span>
    </div>
  )

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20">
      <div className="h-16 max-w-7xl mx-auto grid grid-cols-[auto_1fr_auto] items-center px-4 sm:px-6 gap-3 sm:gap-6">
        <div className="flex items-center gap-2">
          <Link to="/">{logo}</Link>
        </div>

        <div className="hidden md:flex justify-center">
          <GlowMenu
            items={items}
            activeItem={activeItem}
            onItemClick={(item) => navigate(item.to)}
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 justify-end">
          <ThemeToggle />

          <button
            onClick={() => navigate('/carrito')}
            className="relative flex items-center text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
            aria-label="Carrito"
          >
            <ShoppingCart className="w-6 h-6" />
            {cart.cantidadTotal > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart.cantidadTotal}
              </span>
            )}
          </button>

          {usuario ? (
            usuario.rol === 'cliente' ? (
              <UserMenu />
            ) : (
              <>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium leading-tight text-gray-800 dark:text-gray-100">{usuario.nombre}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 leading-tight capitalize">{usuario.rol}</p>
                </div>
                <button
                  onClick={handleLogout}
                  aria-label="Cerrar sesión"
                  className="text-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-2.5 sm:px-3.5 py-1.5 rounded-full transition-colors whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Salir</span>
                  <LogOut className="w-4 h-4 sm:hidden" />
                </button>
              </>
            )
          ) : (
            <button
              onClick={() => navigate('/login')}
              aria-label="Iniciar sesión"
              className="text-sm bg-primary text-white hover:bg-primary/90 rounded-full transition-colors flex items-center gap-1.5 font-medium whitespace-nowrap px-3 sm:px-4 py-2"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Iniciar sesión</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
