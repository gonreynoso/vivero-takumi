import Badge from './Badge'

const colorEstado = {
  pendiente: 'amarillo',
  confirmado: 'azul',
  entregado: 'verde',
}

const flujoEstados = ['pendiente', 'confirmado', 'entregado']

// Card de pedido, muestra items, total y permite avanzar de estado si se pasa onCambiarEstado
export default function PedidoCard({ pedido, onCambiarEstado, mostrarCliente }) {
  const indiceActual = flujoEstados.indexOf(pedido.estado)
  const siguienteEstado = flujoEstados[indiceActual + 1]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-gray-800">Pedido #{pedido.id}</p>
          {mostrarCliente && (
            <p className="text-sm text-gray-500">{pedido.clienteNombre}</p>
          )}
          <p className="text-xs text-gray-400">{pedido.fecha}</p>
        </div>
        <Badge color={colorEstado[pedido.estado]}>{pedido.estado}</Badge>
      </div>

      <ul className="text-sm text-gray-600 divide-y divide-gray-100">
        {pedido.items.map((item) => (
          <li key={item.plantaId} className="py-1 flex justify-between">
            <span>
              {item.nombre} x{item.cantidad}
            </span>
            <span>${item.precio * item.cantidad}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span className="font-bold text-primary">Total: ${pedido.total}</span>
        {onCambiarEstado && siguienteEstado && (
          <button
            onClick={() => onCambiarEstado(pedido.id, siguienteEstado)}
            className="text-sm bg-accent text-white px-3 py-1.5 rounded-lg hover:bg-accent/90"
          >
            Marcar como {siguienteEstado}
          </button>
        )}
      </div>
    </div>
  )
}
