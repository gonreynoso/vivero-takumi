// Item individual del carrito de compras
export default function CartItem({ item, onCambiarCantidad, onQuitar }) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-3">
      <img
        src={item.imagen}
        alt={item.nombre}
        className="w-16 h-16 object-cover rounded-lg"
      />
      <div className="flex-1">
        <p className="font-medium text-gray-800">{item.nombre}</p>
        <p className="text-sm text-gray-500">${item.precio} c/u</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onCambiarCantidad(item.plantaId, item.cantidad - 1)}
          className="w-7 h-7 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
        >
          -
        </button>
        <span className="w-6 text-center">{item.cantidad}</span>
        <button
          onClick={() => onCambiarCantidad(item.plantaId, item.cantidad + 1)}
          className="w-7 h-7 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
        >
          +
        </button>
      </div>
      <p className="w-20 text-right font-semibold text-primary">
        ${item.precio * item.cantidad}
      </p>
      <button
        onClick={() => onQuitar(item.plantaId)}
        className="text-red-500 hover:text-red-700 text-sm"
      >
        Quitar
      </button>
    </div>
  )
}
