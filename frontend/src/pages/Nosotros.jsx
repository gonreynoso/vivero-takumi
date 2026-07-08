import { Link } from 'react-router-dom'
import { Sprout, Heart, ShieldCheck, Users } from 'lucide-react'

const valores = [
  {
    icon: Sprout,
    titulo: 'Pasión por las plantas',
    descripcion: 'Cada planta que vendemos pasa por nuestras manos antes de llegar a las tuyas.',
  },
  {
    icon: Heart,
    titulo: 'Atención personalizada',
    descripcion: 'Te asesoramos para elegir la planta ideal según tu espacio y experiencia.',
  },
  {
    icon: ShieldCheck,
    titulo: 'Calidad garantizada',
    descripcion: 'Si una planta llega dañada, la reponemos sin cargo dentro de las 48hs.',
  },
  {
    icon: Users,
    titulo: 'Comunidad verde',
    descripcion: 'Más de 10 mil clientes que ya transformaron sus hogares con nosotros.',
  },
]

const stats = [
  { valor: '12+', etiqueta: 'Años de experiencia' },
  { valor: '10.000+', etiqueta: 'Plantas entregadas' },
  { valor: '5', etiqueta: 'Categorías de plantas' },
  { valor: '4.8★', etiqueta: 'Calificación promedio' },
]

export default function Nosotros() {
  return (
    <div className="flex flex-col gap-16">
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div className="flex flex-col gap-4">
          <span className="inline-flex self-start bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full">
            Sobre nosotros
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Hacemos que cuidar plantas sea fácil
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Vivero Takumi nació de una idea simple: que cualquiera, sin importar su
            experiencia, pueda llenar su casa de vida verde. Empezamos como un pequeño
            vivero familiar y hoy ayudamos a miles de personas a encontrar, cuidar y
            disfrutar de sus plantas, con guías de cuidado claras y asesoramiento real.
          </p>
          <Link
            to="/catalogo"
            className="self-start mt-2 bg-primary text-white font-semibold px-6 py-3 rounded-full hover:bg-primary/90 transition-colors"
          >
            Ver catálogo
          </Link>
        </div>
        <img
          src="https://images.unsplash.com/photo-1758524052905-a2bf66c22e62?w=800"
          alt="Equipo de Vivero Takumi"
          className="w-full h-72 sm:h-96 object-cover rounded-3xl"
        />
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.etiqueta}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center"
          >
            <p className="text-2xl font-bold text-primary">{stat.valor}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.etiqueta}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-5 text-center">Nuestros valores</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {valores.map((valor) => {
            const Icon = valor.icon
            return (
              <div
                key={valor.titulo}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center gap-2"
              >
                <span className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Icon className="w-6 h-6" />
                </span>
                <h3 className="font-semibold text-gray-800">{valor.titulo}</h3>
                <p className="text-sm text-gray-500">{valor.descripcion}</p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
