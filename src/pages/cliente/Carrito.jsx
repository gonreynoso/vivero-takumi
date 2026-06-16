import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import CartItem from '../../components/CartItem'
import EmptyState from '../../components/EmptyState'

// Carrito de compras, permite confirmar el pedido con o sin sesión iniciada
export default function Carrito() {
  const { items, cambiarCantidad, quitarDelCarrito, vaciarCarrito, total } = useCart()
  const { agregarPedido, descontarStock } = useData()
  const { usuario } = useAuth()
  const { mostrarToast } = useToast()
  const navigate = useNavigate()
  const [datosInvitado, setDatosInvitado] = useState({ nombre: '', email: '' })

  const handleConfirmar = (e) => {
    e.preventDefault()
    const hoy = new Date().toISOString().slice(0, 10)
    agregarPedido({
      clienteEmail: usuario?.email || datosInvitado.email,
      clienteNombre: usuario?.nombre || datosInvitado.nombre,
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
    navigate(usuario ? '/mis-pedidos' : '/catalogo')
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

      <form
        onSubmit={handleConfirmar}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4"
      >
        {!usuario && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre y apellido
              </label>
              <input
                value={datosInvitado.nombre}
                onChange={(e) => setDatosInvitado({ ...datosInvitado, nombre: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={datosInvitado.email}
                onChange={(e) => setDatosInvitado({ ...datosInvitado, email: e.target.value })}
                required
                placeholder="Para coordinar la entrega"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-800">Total: ${total}</span>
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90"
          >
            Confirmar pedido
          </button>
        </div>
      </form>
    </div>
  )
}
