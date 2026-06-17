import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'
import Badge from '../../components/Badge'
import GuiaCuidado from '../../components/GuiaCuidado'

const colorDificultad = { fácil: 'verde', media: 'amarillo', difícil: 'rojo' }

// Detalle de una planta con su guía de cuidado completa, navegable y comprable sin login
export default function DetallePlanta() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { plantas } = useData()
  const { agregarAlCarrito } = useCart()
  const { mostrarToast } = useToast()

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
        <img
          src={planta.imagen}
          alt={planta.nombre}
          className="w-full h-72 object-cover rounded-xl"
        />

        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <h1 className="text-2xl font-bold text-gray-800">{planta.nombre}</h1>
            <Badge color={colorDificultad[planta.dificultad]}>{planta.dificultad}</Badge>
          </div>
          <p className="text-sm text-gray-500">{planta.categoria}</p>
          <p className="text-gray-600">{planta.descripcion}</p>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">${planta.precio}</span>
            <Badge color={planta.stock === 0 ? 'rojo' : planta.stock < 5 ? 'amarillo' : 'verde'}>
              {planta.stock === 0 ? 'Sin stock' : `Stock: ${planta.stock}`}
            </Badge>
          </div>

          <button
            onClick={handleAgregar}
            disabled={planta.stock === 0}
            className="bg-primary text-white rounded-lg py-2.5 font-medium hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Agregar al carrito
          </button>
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-gray-800 mb-3">Guía de cuidado</h2>
        <GuiaCuidado guia={planta.guia_cuidado} />
      </div>
    </div>
  )
}
