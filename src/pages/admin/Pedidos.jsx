import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import PedidoFila from '../../components/PedidoFila'
import EmptyState from '../../components/EmptyState'
import Paginador from '../../components/Paginador'

const estados = ['todos', 'pendiente', 'confirmado', 'entregado']
const POR_PAGINA = 6

// Vista del admin para ver y gestionar todos los pedidos del vivero
export default function Pedidos() {
  const { pedidos, actualizarEstadoPedido, editarPedido } = useData()
  const { mostrarToast } = useToast()
  const [searchParams] = useSearchParams()
  const [filtro, setFiltro] = useState(searchParams.get('estado') || 'todos')
  const [pagina, setPagina] = useState(1)

  const pedidosFiltrados =
    filtro === 'todos' ? pedidos : pedidos.filter((p) => p.estado === filtro)

  const totalPaginas = Math.max(1, Math.ceil(pedidosFiltrados.length / POR_PAGINA))
  const pedidosPagina = pedidosFiltrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  const handleFiltro = (e) => {
    setFiltro(e)
    setPagina(1)
  }

  const handleCambiarEstado = (id, estado) => {
    actualizarEstadoPedido(id, estado)
    mostrarToast(`Pedido #${id} marcado como ${estado}`)
  }

  const handleGuardarEdicion = (pedido) => {
    editarPedido(pedido)
    mostrarToast(`Pedido #${pedido.id} actualizado`)
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Pedidos</h1>

      <div className="flex gap-2 flex-wrap">
        {estados.map((e) => (
          <button
            key={e}
            onClick={() => handleFiltro(e)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize ${
              filtro === e ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {e}
          </button>
        ))}
      </div>

      {pedidosFiltrados.length === 0 ? (
        <EmptyState mensaje="No hay pedidos para mostrar con este filtro." />
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {pedidosPagina.map((pedido) => (
              <PedidoFila
                key={pedido.id}
                pedido={pedido}
                onCambiarEstado={handleCambiarEstado}
                onGuardarEdicion={handleGuardarEdicion}
              />
            ))}
          </div>
          <Paginador paginaActual={pagina} totalPaginas={totalPaginas} onCambiar={setPagina} />
        </>
      )}
    </div>
  )
}
