import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useData } from '../context/DataContext'
import PlantaCardMinimal from '../components/PlantaCardMinimal'
import { DicedHeroSection } from '../components/DicedHeroSection'
import InteractiveImageAccordion from '../components/InteractiveImageAccordion'
import Faq from '../components/Faq'

const dicedSlides = [
  { title: 'Monstera Deliciosa', image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500' },
  { title: 'Lavanda', image: 'https://images.unsplash.com/photo-1611909023032-2d6b3134ecba?w=500' },
  { title: 'Echeveria', image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=500' },
  { title: 'Limonero', image: 'https://images.unsplash.com/photo-1575574202227-6b68bd6e3f29?w=500' },
]

const idsDestacados = [1, 5, 8, 14]

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

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
}

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

export default function Home() {
  const { plantas, categorias } = useData()
  const navigate = useNavigate()

  const destacadas = idsDestacados
    .map((id) => plantas.find((p) => p.id === id))
    .filter((p) => p && p.habilitada !== false)

  const tienda = plantas.filter((p) => p.habilitada !== false)

  const itemsAccordion = categorias.map((categoria) => ({
    titulo: categoria,
    imagen: plantas.find((p) => p.categoria === categoria)?.imagen,
  }))

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
        <motion.h2 {...fadeUp} transition={{ duration: 0.5 }} className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-5">
          Categorías
        </motion.h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {categorias.map((categoria, i) => {
            const imagenCategoria = plantas.find((p) => p.categoria === categoria)?.imagen
            return (
              <motion.div
                key={categoria}
                {...fadeUp}
                transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.3) }}
              >
                <Link
                  to={`/catalogo?categoria=${encodeURIComponent(categoria)}`}
                  className="group relative h-40 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow block"
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
              </motion.div>
            )
          })}
        </div>
      </section>

      <section>
        <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="flex items-center justify-between mb-5">
          <div>
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">
              Lo más elegido
            </span>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Plantas destacadas</h2>
          </div>
          <Link to="/catalogo" className="text-sm font-medium text-primary dark:text-accent hover:underline">
            Ver todo el catálogo →
          </Link>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 sm:gap-x-5 gap-y-6 sm:gap-y-8">
          {destacadas.map((planta, i) => (
            <motion.div key={planta.id} {...fadeUp} transition={{ duration: 0.4, delay: Math.min(i * 0.08, 0.3) }}>
              <PlantaCardMinimal planta={planta} />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-primary rounded-3xl py-10 px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {metricas.map((metrica, i) => (
            <motion.div
              key={metrica.etiqueta}
              {...fadeUp}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl font-bold text-white">{metrica.valor}</p>
              <p className="text-sm text-white/70 mt-1">{metrica.etiqueta}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="flex items-center justify-between mb-5">
          <div>
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">
              Catálogo completo
            </span>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Tienda</h2>
          </div>
          <Link to="/catalogo" className="text-sm font-medium text-primary dark:text-accent hover:underline">
            Ver todo el catálogo →
          </Link>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 sm:gap-x-5 gap-y-6 sm:gap-y-8">
          {tienda.map((planta, i) => (
            <motion.div key={planta.id} {...fadeUp} transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}>
              <PlantaCardMinimal planta={planta} />
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <motion.h2 {...fadeUp} transition={{ duration: 0.5 }} className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-5">
          Lo que dicen nuestros clientes
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {testimonios.map((testimonio, i) => (
            <motion.div
              key={testimonio.nombre}
              {...fadeUp}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm dark:shadow-none p-5 flex flex-col gap-3"
            >
              <div className="text-yellow-500 text-sm">
                {'★'.repeat(testimonio.rating)}
                <span className="text-gray-300 dark:text-gray-600">{'★'.repeat(5 - testimonio.rating)}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 flex-1">“{testimonio.texto}”</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{testimonio.nombre}</p>
            </motion.div>
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
