import { Link, useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { categorias } from '../data/categorias'
import PlantaCard from '../components/PlantaCard'
import { DicedHeroSection } from '../components/DicedHeroSection'
import InteractiveImageAccordion from '../components/InteractiveImageAccordion'
import Faq from '../components/Faq'
import { useCart } from '../context/CartContext'
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

const metricas = [
  { valor: '12+', etiqueta: 'Años de experiencia' },
  { valor: '10.000+', etiqueta: 'Plantas entregadas' },
  { valor: '5', etiqueta: 'Categorías de plantas' },
  { valor: '4.8★', etiqueta: 'Calificación promedio' },
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
  const { mostrarToast } = useToast()
  const navigate = useNavigate()

  const destacadas = idsDestacados
    .map((id) => plantas.find((p) => p.id === id))
    .filter(Boolean)

  const nuevosIngresos = idsNuevosIngresos
    .map((id) => plantas.find((p) => p.id === id))
    .filter(Boolean)

  const itemsAccordion = categorias.map((categoria) => ({
    titulo: categoria,
    imagen: plantas.find((p) => p.categoria === categoria)?.imagen,
  }))

  const handleAgregar = (planta) => {
    agregarAlCarrito(planta)
    mostrarToast(`${planta.nombre} agregada al carrito`)
    navigate('/carrito')
  }

  return (
    <div className="flex flex-col gap-20">
      <InteractiveImageAccordion
        topText="🌱 Nueva colección de temporada"
        mainText="Llená tu casa y tu jardín de vida verde"
        subText="Plantas de interior, exterior, suculentas, aromáticas y frutales, cuidadas con cariño y listas para tu hogar."
        buttonText="Ver catálogo"
        items={itemsAccordion}
        beneficios={beneficios}
        onButtonClick={() => navigate('/catalogo')}
        onItemClick={(item) => navigate(`/catalogo?categoria=${encodeURIComponent(item.titulo)}`)}
      />

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-5">Categorías</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {categorias.map((categoria) => {
            const imagenCategoria = plantas.find((p) => p.categoria === categoria)?.imagen
            return (
              <Link
                key={categoria}
                to={`/catalogo?categoria=${encodeURIComponent(categoria)}`}
                className="group relative h-40 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                <img
                  src={imagenCategoria}
                  alt={categoria}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <span className="absolute bottom-3 left-4 text-white font-semibold">
                  {categoria}
                </span>
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

      <section className="bg-primary rounded-3xl py-10 px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {metricas.map((metrica) => (
            <div key={metrica.etiqueta} className="text-center">
              <p className="text-3xl font-bold text-white">{metrica.valor}</p>
              <p className="text-sm text-white/70 mt-1">{metrica.etiqueta}</p>
            </div>
          ))}
        </div>
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
