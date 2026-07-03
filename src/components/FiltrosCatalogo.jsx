import { useState } from 'react'
import { ChevronDown, DollarSign, Gauge, Search, SlidersHorizontal, Tag } from 'lucide-react'

const dificultades = ['fácil', 'media', 'difícil']

export default function FiltrosCatalogo({ filtros, onChange, categorias }) {
  const [abierto, setAbierto] = useState(false)

  const handleChange = (campo, valor) => {
    onChange({ ...filtros, [campo]: valor })
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-700 p-5 flex flex-col gap-4 md:flex-row md:items-center md:flex-wrap">
      <div className="flex gap-2 md:flex-1 md:min-w-[180px]">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={filtros.busqueda}
            onChange={(e) => handleChange('busqueda', e.target.value)}
            placeholder="Buscar planta..."
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-400 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          className="md:hidden flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-600 dark:text-gray-200 shrink-0"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtros
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${abierto ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div
        className={`flex-col gap-4 md:flex md:flex-row md:items-center md:flex-1 md:flex-wrap ${
          abierto ? 'flex' : 'hidden'
        }`}
      >
      <div className="relative min-w-[160px]">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
          <Tag className="w-4 h-4" />
        </span>
        <select
          value={filtros.categoria}
          onChange={(e) => handleChange('categoria', e.target.value)}
          className="w-full appearance-none pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 dark:bg-gray-700 dark:text-gray-100 text-sm"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
      </div>

      <div className="relative min-w-[150px]">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
          <Gauge className="w-4 h-4" />
        </span>
        <select
          value={filtros.dificultad}
          onChange={(e) => handleChange('dificultad', e.target.value)}
          className="w-full appearance-none pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 dark:bg-gray-700 dark:text-gray-100 text-sm capitalize"
        >
          <option value="">Toda dificultad</option>
          {dificultades.map((d) => (
            <option key={d} value={d} className="capitalize">
              {d}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
      </div>

      <div className="flex-1 min-w-[200px] flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
            Precio máximo
          </span>
          <span className="font-semibold text-primary dark:text-accent">${filtros.precioMax}</span>
        </div>
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
    </div>
  )
}
