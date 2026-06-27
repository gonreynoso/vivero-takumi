import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Home, Leaf, ShoppingCart, Package, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const itemsCliente = [
  { to: '/', icon: Home, label: 'Inicio' },
  { to: '/catalogo', icon: Leaf, label: 'Catálogo' },
  { to: '/carrito', icon: ShoppingCart, label: 'Carrito' },
  { to: '/mis-pedidos', icon: Package, label: 'Mis compras' },
]

const itemsInvitado = [
  { to: '/', icon: Home, label: 'Inicio' },
  { to: '/catalogo', icon: Leaf, label: 'Catálogo' },
  { to: '/carrito', icon: ShoppingCart, label: 'Carrito' },
  { to: '/login', icon: User, label: 'Perfil' },
]

// Menú de navegación flotante, solo visible en mobile, para las páginas de tienda
export default function MobileFloatingNav() {
  const { usuario } = useAuth()
  const { cantidadTotal } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const btnRefs = useRef([])
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 })

  const items = usuario?.rol === 'cliente' ? itemsCliente : itemsInvitado
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.to === location.pathname)
  )

  useEffect(() => {
    const updateIndicator = () => {
      const btn = btnRefs.current[activeIndex]
      const container = containerRef.current
      if (!btn || !container) return
      const btnRect = btn.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      setIndicatorStyle({ width: btnRect.width, left: btnRect.left - containerRect.left })
    }
    updateIndicator()
    window.addEventListener('resize', updateIndicator)
    return () => window.removeEventListener('resize', updateIndicator)
  }, [activeIndex, items.length])

  return (
    <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
      <div
        ref={containerRef}
        className="relative flex items-center justify-between bg-white dark:bg-gray-800 shadow-xl dark:shadow-black/50 rounded-full px-1 py-2 border border-gray-100 dark:border-gray-600"
      >
        {items.map((item, index) => {
          const Icon = item.icon
          const esActivo = index === activeIndex
          return (
            <button
              key={item.to}
              ref={(el) => (btnRefs.current[index] = el)}
              onClick={() => navigate(item.to)}
              className={`relative flex flex-col items-center justify-center flex-1 px-2 py-2 text-xs font-medium transition-colors ${
                esActivo ? 'text-primary dark:text-accent' : 'text-gray-400 dark:text-gray-300'
              }`}
            >
              <div className="z-10 relative">
                <Icon size={20} />
                {item.to === '/carrito' && cantidadTotal > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-accent text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {cantidadTotal}
                  </span>
                )}
              </div>
              <span className="mt-1">{item.label}</span>
            </button>
          )
        })}

        <motion.div
          animate={indicatorStyle}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="absolute top-1 bottom-1 rounded-full bg-primary/10 dark:bg-accent/25 z-0"
        />
      </div>
    </div>
  )
}
