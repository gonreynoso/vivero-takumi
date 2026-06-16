import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import PedidoCard from '../../components/PedidoCard'
import EmptyState from '../../components/EmptyState'

// El empleado puede ver todos los pedidos y avanzar su estado
export default function Pedidos() {
  const { pedidos, actualizarEstadoPedido } = useData()
  const { mostrarToast } = useToast()

  const handleCambiarEstado = (id, estado) => {
    actualizarEstadoPedido(id, estado)
    mostrarToast(`Pedido #${id} marcado como ${estado}`)
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-800">Pedidos</h1>

      {pedidos.length === 0 ? (
        <EmptyState mensaje="No hay pedidos registrados todavía." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pedidos.map((pedido) => (
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
