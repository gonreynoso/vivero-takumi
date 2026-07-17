import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import Badge from './Badge'

const colorDificultad = { fácil: 'verde', media: 'amarillo', difícil: 'rojo' }

export default function CartItem({ item, stockDisponible, seleccionado, onToggleSeleccion, onCambiarCantidad, onQuitar }) {
  return (
    <div className="group flex gap-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md hover:border-accent/30 transition-all">
      <input
        type="checkbox"
        checked={seleccionado}
        onChange={() => onToggleSeleccion(item.plantaId)}
        className="mt-1 w-4 h-4 accent-primary cursor-pointer shrink-0"
      />

      <Link to={`/planta/${item.plantaId}`} className="shrink-0">
        <img
          src={item.imagen}
          alt={item.nombre}
          className="w-24 h-24 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        {item.categoria && (
          <p className="text-xs text-accent font-medium uppercase tracking-wide">
            {item.categoria}
          </p>
        )}

        <Link
          to={`/planta/${item.plantaId}`}
          className="font-semibold text-gray-800 dark:text-gray-100 hover:text-primary leading-tight truncate"
        >
          {item.nombre}
        </Link>

        <div className="flex items-center gap-1.5">
          {item.dificultad && (
            <Badge color={colorDificultad[item.dificultad] || 'gris'}>{item.dificultad}</Badge>
          )}
          <Badge color={stockDisponible === 0 ? 'rojo' : stockDisponible < 5 ? 'amarillo' : 'verde'}>
            {stockDisponible === 0 ? 'Sin stock' : `Stock: ${stockDisponible}`}
          </Badge>
        </div>

        <p className="text-sm text-gray-400 dark:text-gray-500">${item.precio} c/u</p>

        <div className="flex items-center gap-4 mt-1.5">
          <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full p-0.5">
            <button
              onClick={() => onCambiarCantidad(item.plantaId, item.cantidad - 1)}
              disabled={item.cantidad <= 1}
              className="w-7 h-7 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center text-sm font-medium text-gray-700 dark:text-gray-300">{item.cantidad}</span>
            <button
              onClick={() => onCambiarCantidad(item.plantaId, item.cantidad + 1)}
              disabled={item.cantidad >= stockDisponible}
              className="w-7 h-7 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <Link to={`/planta/${item.plantaId}`} className="text-sm text-gray-400 dark:text-gray-500 hover:text-primary hover:underline">
            Ver detalle
          </Link>

          <button
            onClick={() => onQuitar(item.plantaId)}
            className="flex items-center gap-1 text-sm text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors ml-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Eliminar</span>
          </button>
        </div>
      </div>

      <p className="font-bold text-primary shrink-0 self-start">
        ${item.precio * item.cantidad}
      </p>
    </div>
  )
}
