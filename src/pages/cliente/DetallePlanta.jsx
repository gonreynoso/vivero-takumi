import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CreditCard, Info, MapPin, Sprout, ZoomIn } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'
import Badge from '../../components/Badge'
import GuiaCuidado from '../../components/GuiaCuidado'
import ImageLightbox from '../../components/ImageLightbox'

const colorDificultad = { fácil: 'verde', media: 'amarillo', difícil: 'rojo' }
const CUOTAS = 6

const formatoEntero = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 })
const formatoDecimal = new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function DetallePlanta() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { plantas } = useData()
  const { agregarAlCarrito } = useCart()
  const { mostrarToast } = useToast()

  const [imagenActiva, setImagenActiva] = useState(0)
  const [lightboxAbierto, setLightboxAbierto] = useState(false)

  const planta = plantas.find((p) => p.id === Number(id))

  if (!planta) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p>Planta no encontrada.</p>
        <button onClick={() => navigate('/catalogo')} className="text-primary underline mt-2">
          Volver al catálogo
        </button>
      </div>
    )
  }

  const habilitada = planta.habilitada !== false
  const imagenes = [planta.imagen, ...(planta.imagenes || [])].filter(Boolean)

  const handleAgregar = () => {
    agregarAlCarrito(planta)
    mostrarToast(`${planta.nombre} agregada al carrito`)
    navigate('/carrito')
  }

  return (
    <div className="flex flex-col gap-6">
      <button onClick={() => navigate('/catalogo')} className="text-sm text-primary self-start">
        ← Volver al catálogo
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 grid md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setLightboxAbierto(true)}
            className="group relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50"
          >
            <img
              src={imagenes[imagenActiva]}
              alt={planta.nombre}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-4 h-4 text-gray-700" />
            </span>
          </button>

          {imagenes.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {imagenes.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImagenActiva(i)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    i === imagenActiva ? 'border-primary' : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <img src={img} alt={`${planta.nombre} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-2xl font-bold text-gray-800">{planta.nombre}</h1>
            <div className="flex gap-1.5 shrink-0">
              {!habilitada && <Badge color="gris">Deshabilitada</Badge>}
              <Badge color={colorDificultad[planta.dificultad]}>{planta.dificultad}</Badge>
            </div>
          </div>
          <p className="text-sm text-gray-500">{planta.categoria}</p>
          <p className="text-gray-600">{planta.descripcion}</p>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-primary">${formatoEntero.format(planta.precio)}</span>
              <p className="text-xs text-gray-400">
                {CUOTAS} cuotas sin interés de ${formatoDecimal.format(planta.precio / CUOTAS)}
              </p>
            </div>
            <Badge color={planta.stock === 0 ? 'rojo' : planta.stock < 5 ? 'amarillo' : 'verde'}>
              {planta.stock === 0 ? 'Sin stock' : `Stock: ${planta.stock}`}
            </Badge>
          </div>

          <button
            onClick={handleAgregar}
            disabled={!habilitada || planta.stock === 0}
            className="bg-primary text-white rounded-lg py-2.5 font-medium hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {habilitada ? 'Agregar al carrito' : 'No disponible'}
          </button>

          <div className="flex flex-col divide-y divide-gray-100 border border-gray-100 rounded-xl">
            <details className="group p-4" open>
              <summary className="flex items-center justify-between gap-2 cursor-pointer font-semibold text-gray-800 text-sm">
                <span className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-accent" />
                  Medios de pago
                </span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">⌄</span>
              </summary>
              <div className="mt-3 text-sm text-gray-600 flex flex-col gap-1.5">
                <p>
                  {CUOTAS} cuotas sin interés de ${formatoDecimal.format(planta.precio / CUOTAS)}
                </p>
                <p className="font-medium text-primary">10% de descuento pagando con transferencia bancaria</p>
              </div>
            </details>

            <details className="group p-4" open>
              <summary className="flex items-center justify-between gap-2 cursor-pointer font-semibold text-gray-800 text-sm">
                <span className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-accent" />
                  Importante
                </span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">⌄</span>
              </summary>
              <div className="mt-3 text-sm text-gray-600 flex flex-col gap-1.5">
                <p>Las fotos son ilustrativas: podés recibir variaciones naturales propias de cada ejemplar.</p>
                <p>¿Tenés dudas sobre esta planta? Escribinos desde la página de Contacto.</p>
              </div>
            </details>

            <details className="group p-4" open>
              <summary className="flex items-center justify-between gap-2 cursor-pointer font-semibold text-gray-800 text-sm">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  Retiro en local
                </span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">⌄</span>
              </summary>
              <div className="mt-3 text-sm text-gray-600 flex flex-col gap-1.5">
                <p>Ruta 8 km 45, Buenos Aires</p>
                <p>Lunes a viernes de 9 a 18 hs</p>
              </div>
            </details>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Sprout className="w-4 h-4 text-accent" />
          Guía de cuidado
        </h2>
        <GuiaCuidado guia={planta.guia_cuidado} />
      </div>

      {lightboxAbierto && (
        <ImageLightbox
          imagenes={imagenes}
          indice={imagenActiva}
          onClose={() => setLightboxAbierto(false)}
          onCambiarIndice={setImagenActiva}
        />
      )}
    </div>
  )
}
