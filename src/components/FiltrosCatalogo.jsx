import { categorias } from '../data/categorias'

const dificultades = ['fácil', 'media', 'difícil']

// Filtros del catálogo: búsqueda, categoría, dificultad y rango de precio
export default function FiltrosCatalogo({ filtros, onChange }) {
  const handleChange = (campo, valor) => {
    onChange({ ...filtros, [campo]: valor })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-4 md:flex-row md:items-end md:flex-wrap">
      <div className="flex-1 min-w-[180px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
        <input
          type="text"
          value={filtros.busqueda}
          onChange={(e) => handleChange('busqueda', e.target.value)}
          placeholder="Nombre de la planta..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div className="min-w-[150px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
        <select
          value={filtros.categoria}
          onChange={(e) => handleChange('categoria', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">Todas</option>
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-[150px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">Dificultad</label>
        <select
          value={filtros.dificultad}
          onChange={(e) => handleChange('dificultad', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">Todas</option>
          {dificultades.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-[180px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Precio máximo: ${filtros.precioMax}
        </label>
        <input
          type="range"
          min="0"
          max="10000"
          step="100"
          value={filtros.precioMax}
          onChange={(e) => handleChange('precioMax', Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>
    </div>
  )
}
