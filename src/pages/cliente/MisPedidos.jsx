import { Droplets, Package } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import PedidoCard from '../../components/PedidoCard'
import CuidadoPlantaCard from '../../components/CuidadoPlantaCard'
import EmptyState from '../../components/EmptyState'
import { diasDesde, diasEntreRiegos, obtenerUltimoRiego } from '../../lib/riego'

function plantasCompradas(pedidos, plantas, email) {
  const ids = [
    ...new Set(
      pedidos
        .filter((p) => p.clienteEmail === email)
        .flatMap((p) => p.items.map((item) => item.plantaId))
    ),
  ]
  return ids.map((id) => plantas.find((p) => p.id === id)).filter(Boolean)
}

function necesitaRiego(planta, email) {
  const ultimo = obtenerUltimoRiego(email, planta.id)
  const frecuencia = diasEntreRiegos(planta.guia_cuidado?.riego)
  if (!ultimo) return true
  return diasDesde(ultimo) >= frecuencia
}

// Historial de pedidos y seguimiento de riego de plantas compradas, en una sola vista
export default function MisPedidos() {
  const { pedidos, plantas } = useData()
  const { usuario } = useAuth()

  const misPedidos = pedidos
    .filter((p) => p.clienteEmail === usuario.email)
    .sort((a, b) => b.id - a.id)

  const misPlantas = plantasCompradas(pedidos, plantas, usuario.email).sort((a, b) => {
    const aRiego = necesitaRiego(a, usuario.email)
    const bRiego = necesitaRiego(b, usuario.email)
    if (aRiego !== bRiego) return aRiego ? -1 : 1
    return a.nombre.localeCompare(b.nombre)
  })

  const plantasConSed = misPlantas.filter((p) => necesitaRiego(p, usuario.email)).length

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Mis compras</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Revisá tus pedidos y llevá el control del riego de las plantas que ya tenés en casa.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-accent">
            <Package className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Pedidos realizados</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {misPedidos.length === 0
                ? 'Acá vas a ver el historial de tus compras'
                : `${misPedidos.length} pedido${misPedidos.length === 1 ? '' : 's'} en total`}
            </p>
          </div>
        </div>

        {misPedidos.length === 0 ? (
          <EmptyState mensaje="Todavía no realizaste ningún pedido." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {misPedidos.map((pedido) => (
              <PedidoCard key={pedido.id} pedido={pedido} />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <div className="rounded-2xl border border-accent/20 dark:border-gray-700 bg-gradient-to-br from-accent/5 to-primary/5 dark:from-gray-800 dark:to-gray-800/80 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-white dark:bg-gray-700 shadow-sm text-accent shrink-0">
            <Droplets className="w-5 h-5" />
          </span>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Cómo regar tus plantas</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
              Marcá cada riego con &quot;Regué hoy&quot; y te avisamos cuándo toca la próxima vez según la
              guía de cada especie.
            </p>
          </div>
          {misPlantas.length > 0 && (
            <p
              className={`text-sm font-medium shrink-0 px-3 py-1.5 rounded-full ${
                plantasConSed > 0
                  ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                  : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
              }`}
            >
              {plantasConSed > 0
                ? `${plantasConSed} planta${plantasConSed === 1 ? '' : 's'} con sed`
                : '¡Todo al día!'}
            </p>
          )}
        </div>

        {misPlantas.length === 0 ? (
          <EmptyState mensaje="Cuando compres plantas, acá vas a poder seguir cuándo regarlas." />
        ) : (
          <div className="flex flex-col gap-3">
            {misPlantas.map((planta) => (
              <CuidadoPlantaCard key={planta.id} planta={planta} email={usuario.email} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
