import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Trash2, Truck } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useData } from '../../context/DataContext'
import CartItem from '../../components/CartItem'
import EmptyState from '../../components/EmptyState'

// Carrito de compras estilo Mercado Libre: los items se seleccionan individualmente y solo
// los seleccionados pasan al checkout; el resto queda guardado en el carrito
export default function Carrito() {
  const {
    items,
    seleccionados,
    cambiarCantidad,
    quitarDelCarrito,
    toggleSeleccion,
    seleccionarTodos,
    vaciarCarrito,
    totalSeleccionado,
    cantidadSeleccionada,
    todosSeleccionados,
  } = useCart()
  const { plantas } = useData()
  const navigate = useNavigate()

  if (items.length === 0) {
    return <EmptyState mensaje="Tu carrito está vacío. ¡Agregá alguna planta del catálogo!" icono="🛒" />
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Carrito ({items.length})</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 px-5 py-3.5">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={todosSeleccionados}
                onChange={(e) => seleccionarTodos(e.target.checked)}
                className="w-4 h-4 accent-primary cursor-pointer"
              />
              Seleccionar todos ({items.length})
            </label>
            <button
              onClick={vaciarCarrito}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Vaciar carrito
            </button>
          </div>

          {items.map((item) => {
            const planta = plantas.find((p) => p.id === item.plantaId)
            return (
              <CartItem
                key={item.plantaId}
                item={item}
                stockDisponible={planta?.stock ?? item.cantidad}
                seleccionado={seleccionados.includes(item.plantaId)}
                onToggleSeleccion={toggleSeleccion}
                onCambiarCantidad={cambiarCantidad}
                onQuitar={quitarDelCarrito}
              />
            )
          })}
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3.5">
            <h2 className="font-semibold text-gray-800">Resumen de compra</h2>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Productos ({cantidadSeleccionada})</span>
              <span>${totalSeleccionado}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-accent" />
                Envío
              </span>
              <span className="text-primary font-medium">Gratis</span>
            </div>
            <div className="border-t border-dashed border-gray-200 pt-3.5 flex items-center justify-between">
              <span className="font-semibold text-gray-800">Total</span>
              <span className="text-xl font-bold text-primary">${totalSeleccionado}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            disabled={cantidadSeleccionada === 0}
            className="w-full bg-gradient-to-b from-accent to-primary text-white font-medium py-2.5 rounded-xl shadow hover:brightness-105 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100"
          >
            Continuar compra
          </button>
        </div>
      </div>
    </div>
  )
}
