import { useNavigate, Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const linksPorRol = {
  cliente: [
    { to: '/', label: 'Inicio' },
    { to: '/catalogo', label: 'Catálogo' },
    { to: '/mis-pedidos', label: 'Mis pedidos' },
  ],
  invitado: [
    { to: '/', label: 'Inicio' },
    { to: '/catalogo', label: 'Catálogo' },
  ],
}

// Barra superior con el nombre de la app, links de navegación, carrito y logout
export default function Navbar() {
  const { usuario, logout } = useAuth()
  const cart = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const esTienda = !usuario || usuario.rol === 'cliente'
  const links = linksPorRol[usuario?.rol] || (!usuario ? linksPorRol.invitado : null)
  const logo = (
    <div className="flex items-center gap-2">
      <span className="text-xl">🌿</span>
      <span className="font-bold text-lg">Verde Vivo</span>
    </div>
  )

  return (
    <header className="h-16 bg-primary text-white flex items-center justify-between px-6 shadow-sm gap-6">
      <div className="flex items-center gap-8">
        {esTienda ? <Link to="/">{logo}</Link> : logo}

        {links && (
          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? 'text-white' : 'text-white/70 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>

      <div className="flex items-center gap-5">
        {usuario?.rol === 'cliente' && (
          <button
            onClick={() => navigate('/carrito')}
            className="relative flex items-center"
            aria-label="Carrito"
          >
            <span className="text-2xl">🛒</span>
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
            className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
          >
            Iniciar sesión
          </button>
        )}
      </div>
    </header>
  )
}
