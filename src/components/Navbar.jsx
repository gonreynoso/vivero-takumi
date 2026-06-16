import { useNavigate, Link, useLocation } from 'react-router-dom'
import { Home, Leaf, ShoppingCart, Package, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { GlowMenu } from './GlowMenu'

const itemsPorRol = {
  cliente: [
    { to: '/', label: 'Inicio', icon: Home, gradient: 'radial-gradient(circle, rgba(82,183,136,0.25) 0%, rgba(82,183,136,0.08) 50%, transparent 100%)' },
    { to: '/catalogo', label: 'Catálogo', icon: Leaf, gradient: 'radial-gradient(circle, rgba(82,183,136,0.25) 0%, rgba(82,183,136,0.08) 50%, transparent 100%)' },
    { to: '/mis-pedidos', label: 'Mis pedidos', icon: Package, gradient: 'radial-gradient(circle, rgba(82,183,136,0.25) 0%, rgba(82,183,136,0.08) 50%, transparent 100%)' },
  ],
  invitado: [
    { to: '/', label: 'Inicio', icon: Home, gradient: 'radial-gradient(circle, rgba(82,183,136,0.25) 0%, rgba(82,183,136,0.08) 50%, transparent 100%)' },
    { to: '/catalogo', label: 'Catálogo', icon: Leaf, gradient: 'radial-gradient(circle, rgba(82,183,136,0.25) 0%, rgba(82,183,136,0.08) 50%, transparent 100%)' },
  ],
}

// Barra superior con el nombre de la app, menú con efecto glow, carrito y logout
export default function Navbar() {
  const { usuario, logout } = useAuth()
  const cart = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const esTienda = !usuario || usuario.rol === 'cliente'
  const items = itemsPorRol[usuario?.rol] || (!usuario ? itemsPorRol.invitado : null)
  const activeItem = items?.find((item) =>
    item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)
  )?.label

  const logo = (
    <div className="flex items-center gap-2">
      <span className="text-xl">🌿</span>
      <span className="font-bold text-lg">Vivero Takumi</span>
    </div>
  )

  return (
    <header className="h-16 bg-primary text-white flex items-center justify-between px-6 shadow-sm gap-6">
      <div className="flex items-center gap-8">
        {esTienda ? <Link to="/">{logo}</Link> : logo}

        {items && (
          <div className="hidden md:block">
            <GlowMenu
              items={items}
              activeItem={activeItem}
              onItemClick={(item) => navigate(item.to)}
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-5">
        {usuario?.rol === 'cliente' && (
          <button
            onClick={() => navigate('/carrito')}
            className="relative flex items-center"
            aria-label="Carrito"
          >
            <ShoppingCart className="w-6 h-6" />
            {cart.cantidadTotal > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart.cantidadTotal}
              </span>
            )}
          </button>
        )}

        {usuario ? (
          <>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium leading-tight">{usuario.nombre}</p>
              <p className="text-xs text-white/70 leading-tight capitalize">{usuario.rol}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              Salir
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <LogIn className="w-4 h-4" />
            Iniciar sesión
          </button>
        )}
      </div>
    </header>
  )
}
