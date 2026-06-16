import { useState } from 'react'
import { Link } from 'react-router-dom'
import Badge from './Badge'

const colorDificultad = {
  fácil: 'verde',
  media: 'amarillo',
  difícil: 'rojo',
}

// Card de planta para catálogo, con acciones opcionales (agregar al carrito, editar, eliminar)
export default function PlantaCard({ planta, onAgregarCarrito, acciones }) {
  const [favorito, setFavorito] = useState(false)
  const colorStock = planta.stock === 0 ? 'rojo' : planta.stock < 5 ? 'amarillo' : 'verde'

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all">
      <div className="relative">
        <Link to={`/planta/${planta.id}`}>
          <img
            src={planta.imagen}
            alt={planta.nombre}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <button
          onClick={() => setFavorito((f) => !f)}
          aria-label="Favorito"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <span className={favorito ? 'text-red-500' : 'text-gray-300'}>
            {favorito ? '♥' : '♡'}
          </span>
        </button>
        <div className="absolute top-3 left-3">
          <Badge color={colorDificultad[planta.dificultad] || 'gris'}>
            {planta.dificultad}
          </Badge>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="text-xs text-accent font-medium uppercase tracking-wide">
          {planta.categoria}
        </p>
        <h3 className="font-semibold text-gray-800 leading-tight">{planta.nombre}</h3>

        {planta.rating && (
          <div className="flex items-center gap-1 text-sm">
            <span className="text-yellow-500">★</span>
            <span className="text-gray-600 font-medium">{planta.rating}</span>
          </div>
        )}

        <div className="flex items-center justify-between mt-1">
          <span className="text-lg font-bold text-primary">${planta.precio}</span>
          <Badge color={colorStock}>
            {planta.stock === 0 ? 'Sin stock' : `Stock: ${planta.stock}`}
          </Badge>
        </div>

        <div className="mt-auto pt-3 flex gap-2">
          {onAgregarCarrito && (
            <button
              onClick={() => onAgregarCarrito(planta)}
              disabled={planta.stock === 0}
              className="flex-1 bg-primary text-white rounded-full py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Agregar al carrito
            </button>
          )}
          {acciones}
        </div>
      </div>
    </div>
  )
}
