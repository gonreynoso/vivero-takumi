import { useData } from '../../context/DataContext'
import StatsCard from '../../components/StatsCard'

// Dashboard del admin con métricas generales del vivero
export default function Dashboard() {
  const { plantas, pedidos, usuarios } = useData()

  const totalVentas = pedidos.reduce((acc, p) => acc + p.total, 0)
  const pedidosPendientes = pedidos.filter((p) => p.estado === 'pendiente').length
  const plantasStockBajo = plantas.filter((p) => p.stock < 5).length

  const ventasPorCategoria = plantas.reduce((acc, planta) => {
    const ventas = pedidos
      .flatMap((p) => p.items)
      .filter((item) => item.plantaId === planta.id)
      .reduce((sum, item) => sum + item.precio * item.cantidad, 0)
    acc[planta.categoria] = (acc[planta.categoria] || 0) + ventas
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard titulo="Total de ventas" valor={`$${totalVentas}`} />
        <StatsCard titulo="Pedidos pendientes" valor={pedidosPendientes} color="text-yellow-600" />
        <StatsCard titulo="Plantas con stock bajo" valor={plantasStockBajo} color="text-red-600" />
        <StatsCard titulo="Usuarios registrados" valor={usuarios.length} color="text-blue-600" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Ventas por categoría</h2>
        <div className="flex flex-col gap-3">
          {Object.entries(ventasPorCategoria).map(([categoria, ventas]) => {
            const max = Math.max(...Object.values(ventasPorCategoria), 1)
            return (
              <div key={categoria}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{categoria}</span>
                  <span className="font-medium text-gray-800">${ventas}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full"
                    style={{ width: `${(ventas / max) * 100}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
