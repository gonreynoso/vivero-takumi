import { Link } from 'react-router-dom'

const CUOTAS = 6

const formatoEntero = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 })
const formatoDecimal = new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// Card minimalista estilo "lookbook" para grillas del storefront: imagen a pantalla completa
// sin card/borde/sombra, info debajo. Para agregar al carrito hay que entrar al detalle.
export default function PlantaCardMinimal({ planta }) {
  const habilitada = planta.habilitada !== false

  return (
    <Link to={`/planta/${planta.id}`} className="group flex flex-col gap-3">
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img
          src={planta.imagen}
          alt={planta.nombre}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
            !habilitada ? 'opacity-50' : ''
          }`}
        />
        {!habilitada && (
          <span className="absolute bottom-3 left-3 bg-white/90 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
            No disponible
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-bold uppercase tracking-wide text-gray-800">{planta.nombre}</h3>
        <p className="text-base font-semibold text-gray-700">${formatoEntero.format(planta.precio)}</p>
        <p className="text-xs text-gray-400">
          {CUOTAS} cuotas sin interés de ${formatoDecimal.format(planta.precio / CUOTAS)}
        </p>
      </div>
    </Link>
  )
}
