import { Link, useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { categorias } from '../data/categorias'
import PlantaCard from '../components/PlantaCard'
import { DicedHeroSection } from '../components/DicedHeroSection'
import Faq from '../components/Faq'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const dicedSlides = [
  { title: 'Monstera Deliciosa', image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500' },
  { title: 'Lavanda', image: 'https://images.unsplash.com/photo-1611909023032-2d6b3134ecba?w=500' },
  { title: 'Echeveria', image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=500' },
  { title: 'Limonero', image: 'https://images.unsplash.com/photo-1575574202227-6b68bd6e3f29?w=500' },
]

const idsDestacados = [1, 5, 8, 14]
const idsNuevosIngresos = [2, 6, 11, 15]

const beneficios = [
  { icono: '🚚', titulo: 'Envío a domicilio', descripcion: 'Recibí tus plantas en casa, sin moverte del sillón.' },
  { icono: '🌱', titulo: 'Plantas garantizadas', descripcion: 'Cuidadas y revisadas antes de salir del vivero.' },
  { icono: '📋', titulo: 'Guías de cuidado', descripcion: 'Cada planta incluye su ficha completa de cuidados.' },
  { icono: '🔒', titulo: 'Compra segura', descripcion: 'Tus pedidos y datos siempre protegidos.' },
]

const testimonios = [
  {
    nombre: 'Carla M.',
    texto: 'Llegó perfecta y con una guía de cuidados súper clara. Ya pedí mi segunda planta.',
    rating: 5,
  },
  {
    nombre: 'Diego R.',
    texto: 'El catálogo es enorme y los precios muy buenos. El envío fue rapidísimo.',
    rating: 5,
  },
  {
    nombre: 'Sofía L.',
    texto: 'Excelente atención, me ayudaron a elegir plantas para un departamento con poca luz.',
    rating: 4,
  },
]

// Home pública con hero, categorías, destacados, beneficios, novedades y testimonios
export default function Home() {
  const { plantas } = useData()
  const { agregarAlCarrito } = useCart()
  const { usuario } = useAuth()
  const { mostrarToast } = useToast()
  const navigate = useNavigate()

  const destacadas = idsDestacados
    .map((id) => plantas.find((p) => p.id === id))
    .filter(Boolean)

  const nuevosIngresos = idsNuevosIngresos
    .map((id) => plantas.find((p) => p.id === id))
    .filter(Boolean)

  const handleAgregar = (planta) => {
    if (!usuario) {
      mostrarToast('Iniciá sesión para agregar plantas al carrito', 'info')
      navigate('/login')
      return
    }
    agregarAlCarrito(planta)
    mostrarToast(`${planta.nombre} agregada al carrito`)
  }

  return (
    <div className="flex flex-col gap-14">
      <section className="relative bg-primary rounded-3xl overflow-hidden">
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full border-[2px] border-dashed border-white/15" />
        <div className="grid md:grid-cols-2 items-center">
          <div className="relative z-10 p-8 sm:p-12 flex flex-col gap-5">
            <span className="inline-flex self-start items-center gap-1.5 bg-white/15 text-white text-xs font-medium px-3 py-1.5 rounded-full">
              🌱 Nueva colección de temporada
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight max-w-md">
              Llená tu casa y tu jardín de vida verde
            </h1>
            <p className="text-white/80 max-w-sm">
              Plantas de interior, exterior, suculentas, aromáticas y frutales,
              cuidadas con cariño y listas para tu hogar.
            </p>
            <Link
              to="/catalogo"
              className="self-start bg-white text-primary font-semibold px-6 py-3 rounded-full hover:bg-white/90 transition-colors"
            >
              Ver catálogo
            </Link>
          </div>
          <div className="relative h-56 md:h-96">
            <img
              src="https://images.unsplash.com/photo-1569736957322-b5e515f249b0?w=900"
              alt="Plantas Verde Vivo"
              className="absolute inset-0 w-full h-full object-cover md:rounded-l-[3rem]"
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-5">Categorías</h2>
        <div className="flex gap-6 overflow-x-auto pb-2">
          {categorias.map((categoria) => {
            const imagenCategoria = plantas.find((p) => p.categoria === categoria)?.imagen
            return (
              <Link
                key={categoria}
                to={`/catalogo?categoria=${encodeURIComponent(categoria)}`}
                className="group flex flex-col items-center gap-2 flex-shrink-0"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-transparent shadow-sm group-hover:border-accent group-hover:shadow-md transition-all">
                  <img
                    src={imagenCategoria}
                    alt={categoria}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">{categoria}</span>
              </Link>
            )
          })}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">
              Lo más elegido
            </span>
            <h2 className="text-xl font-bold text-gray-800">Plantas destacadas</h2>
          </div>
          <Link to="/catalogo" className="text-sm font-medium text-primary hover:underline">
            Ver todo el catálogo →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {destacadas.map((planta) => (
            <PlantaCard key={planta.id} planta={planta} onAgregarCarrito={handleAgregar} />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {beneficios.map((beneficio) => (
          <div
            key={beneficio.titulo}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center gap-2"
          >
            <span className="text-3xl">{beneficio.icono}</span>
            <h3 className="font-semibold text-gray-800">{beneficio.titulo}</h3>
            <p className="text-sm text-gray-500">{beneficio.descripcion}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">
              Recién llegadas
            </span>
            <h2 className="text-xl font-bold text-gray-800">Nuevos ingresos</h2>
          </div>
          <Link to="/catalogo" className="text-sm font-medium text-primary hover:underline">
            Ver todo el catálogo →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {nuevosIngresos.map((planta) => (
            <PlantaCard key={planta.id} planta={planta} onAgregarCarrito={handleAgregar} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-5">Lo que dicen nuestros clientes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {testimonios.map((testimonio) => (
            <div
              key={testimonio.nombre}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3"
            >
              <div className="text-yellow-500 text-sm">
                {'★'.repeat(testimonio.rating)}
                <span className="text-gray-300">{'★'.repeat(5 - testimonio.rating)}</span>
              </div>
              <p className="text-sm text-gray-600 flex-1">“{testimonio.texto}”</p>
              <p className="text-sm font-semibold text-gray-800">{testimonio.nombre}</p>
            </div>
          ))}
        </div>
      </section>

      <Faq />

      <DicedHeroSection
        topText="Descubrí"
        mainText="Tu próxima planta favorita"
        subMainText="Explorá una selección vibrante de plantas de interior, exterior, suculentas, aromáticas y frutales. Encontrá la compañera verde perfecta para cada rincón de tu casa."
        buttonText="Ver catálogo"
        slides={dicedSlides}
        onMainButtonClick={() => navigate('/catalogo')}
      />
    </div>
  )
}
