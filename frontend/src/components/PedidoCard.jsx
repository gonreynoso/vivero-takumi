import Badge from './Badge'

const colorEstado = {
  pendiente: 'amarillo',
  confirmado: 'azul',
  entregado: 'verde',
}

const flujoEstados = ['pendiente', 'confirmado', 'entregado']

export default function PedidoCard({ pedido, onCambiarEstado, mostrarCliente }) {
  const indiceActual = flujoEstados.indexOf(pedido.estado)
  const siguienteEstado = flujoEstados[indiceActual + 1]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-700 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-gray-800 dark:text-gray-100">Pedido #{pedido.id}</p>
          {mostrarCliente && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{pedido.clienteNombre}</p>
          )}
          <p className="text-xs text-gray-400 dark:text-gray-500">{pedido.fecha}</p>
        </div>
        <Badge color={colorEstado[pedido.estado]}>{pedido.estado}</Badge>
      </div>

      <ul className="text-sm text-gray-600 dark:text-gray-300 divide-y divide-gray-100 dark:divide-gray-700">
        {pedido.items.map((item) => (
          <li key={item.plantaId} className="py-1 flex justify-between">
            <span>
              {item.nombre} x{item.cantidad}
            </span>
            <span>${item.precio * item.cantidad}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
        <span className="font-bold text-primary dark:text-accent">Total: ${pedido.total}</span>
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
