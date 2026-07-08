import { AlertTriangle, RefreshCw } from 'lucide-react'
import { useData } from '../context/DataContext'

export default function ApiStatusBanner() {
  const { errorApi, cargando, recargar } = useData()

  if (cargando || !errorApi) return null

  return (
    <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-2 sm:gap-4 text-sm text-amber-900 dark:text-amber-100">
        <span className="flex items-center justify-center sm:justify-start gap-2 font-medium">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          Sin conexión al API — los datos no pueden cargarse desde el backend.
        </span>
        <span className="text-amber-800/80 dark:text-amber-200/80 flex-1">{errorApi}</span>
        <button
          type="button"
          onClick={recargar}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-200/80 dark:bg-amber-900/60 hover:bg-amber-200 dark:hover:bg-amber-900 font-medium transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reintentar
        </button>
      </div>
    </div>
  )
}
