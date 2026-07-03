import { useEffect } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export default function ImageLightbox({ imagenes, indice, onClose, onCambiarIndice }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onCambiarIndice((indice + 1) % imagenes.length)
      if (e.key === 'ArrowLeft') onCambiarIndice((indice - 1 + imagenes.length) % imagenes.length)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [indice, imagenes.length, onClose, onCambiarIndice])

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
      >
        <X className="w-5 h-5" />
      </button>

      {imagenes.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onCambiarIndice((indice - 1 + imagenes.length) % imagenes.length)
          }}
          aria-label="Anterior"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      <img
        src={imagenes[indice]}
        alt=""
        onClick={(e) => e.stopPropagation()}
        className="max-w-full max-h-full object-contain rounded-lg cursor-zoom-out"
      />

      {imagenes.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onCambiarIndice((indice + 1) % imagenes.length)
          }}
          aria-label="Siguiente"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
