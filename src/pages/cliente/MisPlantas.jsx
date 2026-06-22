import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import CuidadoPlantaCard from '../../components/CuidadoPlantaCard'
import EmptyState from '../../components/EmptyState'

// Plantas ya compradas por el cliente, con seguimiento de riego (sin backend: vive en localStorage)
export default function MisPlantas() {
  const { pedidos, plantas } = useData()
  const { usuario } = useAuth()

  const idsCompradas = [
    ...new Set(
      pedidos
        .filter((p) => p.clienteEmail === usuario.email)
        .flatMap((p) => p.items.map((item) => item.plantaId))
    ),
  ]
  const misPlantas = idsCompradas.map((id) => plantas.find((p) => p.id === id)).filter(Boolean)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Mis plantas</h1>
        <p className="text-sm text-gray-500">Llevá el control del riego de las plantas que ya compraste.</p>
      </div>

      {misPlantas.length === 0 ? (
        <EmptyState mensaje="Todavía no compraste ninguna planta." />
      ) : (
        <div className="flex flex-col gap-3">
          {misPlantas.map((planta) => (
            <CuidadoPlantaCard key={planta.id} planta={planta} email={usuario.email} />
          ))}
        </div>
      )}
    </div>
  )
}
