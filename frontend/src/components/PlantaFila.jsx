import { Eye, EyeOff, Pencil, Star, Trash2 } from 'lucide-react'
import Badge from './Badge'

const colorDificultad = { fácil: 'verde', media: 'amarillo', difícil: 'rojo' }

export default function PlantaFila({ planta, onToggleHabilitada, onEditar, onEliminar }) {
  const habilitada = planta.habilitada !== false
  const colorStock = planta.stock === 0 ? 'rojo' : planta.stock < 5 ? 'amarillo' : 'verde'

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 ${
        !habilitada ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <img
          src={planta.imagen}
          alt={planta.nombre}
          className="w-16 h-16 rounded-lg object-cover shrink-0"
        />

        <div className="flex-1 min-w-0">
          <p className="text-xs text-accent font-medium uppercase tracking-wide">{planta.categoria}</p>
          <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">{planta.nombre}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge color={colorDificultad[planta.dificultad] || 'gris'}>{planta.dificultad}</Badge>
            {planta.rating && (
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                {planta.rating}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
        <div className="text-left sm:text-right shrink-0">
          <p className="font-bold text-primary dark:text-accent">${planta.precio}</p>
          <Badge color={colorStock}>{planta.stock === 0 ? 'Sin stock' : `Stock: ${planta.stock}`}</Badge>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onToggleHabilitada(planta)}
            aria-label={habilitada ? 'Deshabilitar' : 'Habilitar'}
            title={habilitada ? 'Deshabilitar' : 'Habilitar'}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {habilitada ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onEditar(planta)}
            aria-label="Editar"
            title="Editar"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-primary text-primary hover:bg-primary/5"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEliminar(planta)}
            aria-label="Eliminar"
            title="Eliminar"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-red-500 text-red-500 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
