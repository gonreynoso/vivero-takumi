import { ChevronLeft, ChevronRight } from 'lucide-react'

// Paginador genérico: botones anterior/siguiente + números de página
export default function Paginador({ paginaActual, totalPaginas, onCambiar }) {
  if (totalPaginas <= 1) return null

  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-center gap-1.5 pt-2">
      <button
        onClick={() => onCambiar(paginaActual - 1)}
        disabled={paginaActual === 1}
        className="flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Anterior</span>
      </button>

      <div className="flex items-center gap-1">
        {paginas.map((pagina) => (
          <button
            key={pagina}
            onClick={() => onCambiar(pagina)}
            className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
              pagina === paginaActual
                ? 'bg-primary text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {pagina}
          </button>
        ))}
      </div>

      <button
        onClick={() => onCambiar(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
        className="flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="hidden sm:inline">Siguiente</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
