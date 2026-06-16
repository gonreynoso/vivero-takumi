import { useState } from 'react'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import PedidoCard from '../../components/PedidoCard'
import EmptyState from '../../components/EmptyState'

const estados = ['todos', 'pendiente', 'confirmado', 'entregado']

// Vista del admin para ver y gestionar todos los pedidos del vivero
export default function Pedidos() {
  const { pedidos, actualizarEstadoPedido } = useData()
  const { mostrarToast } = useToast()
  const [filtro, setFiltro] = useState('todos')

  const pedidosFiltrados =
    filtro === 'todos' ? pedidos : pedidos.filter((p) => p.estado === filtro)

  const handleCambiarEstado = (id, estado) => {
    actualizarEstadoPedido(id, estado)
    mostrarToast(`Pedido #${id} marcado como ${estado}`)
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-800">Pedidos</h1>

      <div className="flex gap-2">
        {estados.map((e) => (
          <button
            key={e}
            onClick={() => setFiltro(e)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize ${
              filtro === e ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {e}
          </button>
        ))}
      </div>

      {pedidosFiltrados.length === 0 ? (
        <EmptyState mensaje="No hay pedidos para mostrar con este filtro." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pedidosFiltrados.map((pedido) => (
            <PedidoCard
              key={pedido.id}
              pedido={pedido}
              mostrarCliente
              onCambiarEstado={handleCambiarEstado}
            />
          ))}
        </div>
      )}
    </div>
  )
}
