import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import PedidoCard from '../../components/PedidoCard'
import EmptyState from '../../components/EmptyState'

// Historial de pedidos del cliente logueado con su estado actual
export default function MisPedidos() {
  const { pedidos } = useData()
  const { usuario } = useAuth()

  const misPedidos = pedidos
    .filter((p) => p.clienteEmail === usuario.email)
    .sort((a, b) => b.id - a.id)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-800">Mis pedidos</h1>

      {misPedidos.length === 0 ? (
        <EmptyState mensaje="Todavía no realizaste ningún pedido." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {misPedidos.map((pedido) => (
            <PedidoCard key={pedido.id} pedido={pedido} />
          ))}
        </div>
      )}
    </div>
  )
}
