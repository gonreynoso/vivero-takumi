import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DollarSign, Leaf, PackageCheck, Receipt, ShoppingCart, Users } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useTheme } from '../../context/ThemeContext'
import StatsCard from '../../components/StatsCard'

const COLORES_ESTADO = { pendiente: '#eab308', confirmado: '#3b82f6', entregado: '#52b788' }

export default function Dashboard() {
  const { plantas, pedidos, usuarios } = useData()
  const { oscuro } = useTheme()

  const colorEje = oscuro ? '#9ca3af' : '#6b7280'
  const colorGrilla = oscuro ? '#374151' : '#e5e7eb'
  const colorTooltipBg = oscuro ? '#1f2937' : '#ffffff'
  const colorTooltipTexto = oscuro ? '#f3f4f6' : '#1f2937'

  const totalVentas = pedidos.reduce((acc, p) => acc + p.total, 0)
  const pedidosPendientes = pedidos.filter((p) => p.estado === 'pendiente').length
  const pedidosConfirmados = pedidos.filter((p) => p.estado === 'confirmado').length
  const pedidosEntregados = pedidos.filter((p) => p.estado === 'entregado').length
  const ticketPromedio = pedidos.length ? Math.round(totalVentas / pedidos.length) : 0
  const plantasStockBajo = plantas.filter((p) => p.stock < 5).length
  const usuariosTotales = usuarios.length

  const ventasPorCategoria = Object.entries(
    plantas.reduce((acc, planta) => {
      const ventas = pedidos
        .flatMap((p) => p.items)
        .filter((item) => item.plantaId === planta.id)
        .reduce((sum, item) => sum + item.precio * item.cantidad, 0)
      acc[planta.categoria] = (acc[planta.categoria] || 0) + ventas
      return acc
    }, {})
  )
    .map(([categoria, ventas]) => ({ categoria, ventas }))
    .sort((a, b) => b.ventas - a.ventas)

  const ventasPorFecha = Object.entries(
    pedidos.reduce((acc, p) => {
      acc[p.fecha] = (acc[p.fecha] || 0) + p.total
      return acc
    }, {})
  )
    .map(([fecha, total]) => ({ fecha, total }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha))

  const pedidosPorEstado = [
    { estado: 'Pendiente', cantidad: pedidosPendientes },
    { estado: 'Confirmado', cantidad: pedidosConfirmados },
    { estado: 'Entregado', cantidad: pedidosEntregados },
  ].filter((e) => e.cantidad > 0)

  const cantidadPorPlanta = pedidos
    .flatMap((p) => p.items)
    .reduce((acc, item) => {
      acc[item.nombre] = (acc[item.nombre] || 0) + item.cantidad
      return acc
    }, {})
  const topProductos = Object.entries(cantidadPorPlanta)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          titulo="Total de ventas"
          valor={`$${totalVentas}`}
          subtitulo={`${pedidos.length} pedidos en total`}
          icon={DollarSign}
        />
        <StatsCard
          titulo="Ticket promedio"
          valor={`$${ticketPromedio}`}
          color="text-accent dark:text-accent"
          iconBg="bg-accent/10"
          icon={Receipt}
        />
        <StatsCard
          titulo="Pedidos pendientes"
          valor={pedidosPendientes}
          subtitulo={`${pedidosEntregados} entregados`}
          color="text-yellow-600 dark:text-yellow-400"
          iconBg="bg-yellow-100 dark:bg-yellow-900/30"
          icon={ShoppingCart}
        />
        <StatsCard
          titulo="Usuarios registrados"
          valor={usuariosTotales}
          color="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          icon={Users}
        />
        <StatsCard
          titulo="Plantas con stock bajo"
          valor={plantasStockBajo}
          subtitulo={`de ${plantas.length} plantas en total`}
          color="text-red-600 dark:text-red-400"
          iconBg="bg-red-100 dark:bg-red-900/30"
          icon={Leaf}
        />
        <StatsCard
          titulo="Pedidos confirmados"
          valor={pedidosConfirmados}
          color="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          icon={PackageCheck}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Ventas en el tiempo</h2>
          {ventasPorFecha.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">Todavía no hay ventas registradas.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={ventasPorFecha}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#52b788" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#52b788" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={colorGrilla} />
                <XAxis dataKey="fecha" tick={{ fontSize: 12, fill: colorEje }} />
                <YAxis tick={{ fontSize: 12, fill: colorEje }} />
                <Tooltip
                  contentStyle={{ backgroundColor: colorTooltipBg, border: 'none', borderRadius: 8 }}
                  labelStyle={{ color: colorTooltipTexto }}
                  formatter={(value) => [`$${value}`, 'Total']}
                />
                <Area type="monotone" dataKey="total" stroke="#2d6a4f" fill="url(#colorVentas)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Pedidos por estado</h2>
          {pedidosPorEstado.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">Todavía no hay pedidos registrados.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pedidosPorEstado}
                  dataKey="cantidad"
                  nameKey="estado"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {pedidosPorEstado.map((entry) => (
                    <Cell
                      key={entry.estado}
                      fill={COLORES_ESTADO[entry.estado.toLowerCase()]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: colorTooltipBg, border: 'none', borderRadius: 8 }}
                  labelStyle={{ color: colorTooltipTexto }}
                />
                <Legend wrapperStyle={{ fontSize: 13, color: colorEje }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Ventas por categoría</h2>
          {ventasPorCategoria.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">Todavía no hay ventas registradas.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={ventasPorCategoria}>
                <CartesianGrid strokeDasharray="3 3" stroke={colorGrilla} />
                <XAxis dataKey="categoria" tick={{ fontSize: 12, fill: colorEje }} />
                <YAxis tick={{ fontSize: 12, fill: colorEje }} />
                <Tooltip
                  contentStyle={{ backgroundColor: colorTooltipBg, border: 'none', borderRadius: 8 }}
                  labelStyle={{ color: colorTooltipTexto }}
                  formatter={(value) => [`$${value}`, 'Ventas']}
                />
                <Bar dataKey="ventas" fill="#52b788" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Productos más vendidos</h2>
          {topProductos.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">Todavía no hay ventas registradas.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topProductos} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={colorGrilla} />
                <XAxis type="number" tick={{ fontSize: 12, fill: colorEje }} allowDecimals={false} />
                <YAxis type="category" dataKey="nombre" tick={{ fontSize: 12, fill: colorEje }} width={110} />
                <Tooltip
                  contentStyle={{ backgroundColor: colorTooltipBg, border: 'none', borderRadius: 8 }}
                  labelStyle={{ color: colorTooltipTexto }}
                  formatter={(value) => [value, 'Vendidos']}
                />
                <Bar dataKey="cantidad" fill="#2d6a4f" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}
