import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import CartItem from '../../components/CartItem'
import EmptyState from '../../components/EmptyState'

// Carrito de compras del cliente, permite confirmar el pedido
export default function Carrito() {
  const { items, cambiarCantidad, quitarDelCarrito, vaciarCarrito, total } = useCart()
  const { agregarPedido, descontarStock } = useData()
  const { usuario } = useAuth()
  const { mostrarToast } = useToast()
  const navigate = useNavigate()

  const handleConfirmar = () => {
    const hoy = new Date().toISOString().slice(0, 10)
    agregarPedido({
      clienteEmail: usuario.email,
      clienteNombre: usuario.nombre,
      items: items.map(({ plantaId, nombre, precio, cantidad }) => ({
        plantaId,
        nombre,
        precio,
        cantidad,
      })),
      total,
      estado: 'pendiente',
      fecha: hoy,
    })
    descontarStock(items)
    vaciarCarrito()
    mostrarToast('Pedido confirmado correctamente')
    navigate('/mis-pedidos')
  }

  if (items.length === 0) {
    return <EmptyState mensaje="Tu carrito está vacío. ¡Agregá alguna planta del catálogo!" icono="🛒" />
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-800">Mi carrito</h1>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <CartItem
            key={item.plantaId}
            item={item}
            onCambiarCantidad={cambiarCantidad}
            onQuitar={quitarDelCarrito}
          />
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
        <span className="text-lg font-semibold text-gray-800">Total: ${total}</span>
        <button
          onClick={handleConfirmar}
          className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90"
        >
          Confirmar pedido
        </button>
      </div>
    </div>
  )
}
