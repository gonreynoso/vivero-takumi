import { useData } from '../../context/DataContext'

const ESTADOS = [
  { key: 'pendiente', label: 'Pendientes', color: '#eab308' },
  { key: 'confirmado', label: 'Confirmados', color: '#3b82f6' },
  { key: 'entregado', label: 'Entregados', color: '#52b788' },
]

export default function Dashboard() {
  const { plantas, pedidos, usuarios } = useData()

  const totalVentas = pedidos.reduce((acc, p) => acc + p.total, 0)
  const ticketPromedio = pedidos.length ? Math.round(totalVentas / pedidos.length) : 0
  const plantasStockBajo = plantas.filter((p) => p.stock < 5)

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

  const estadoData = ESTADOS.map((e) => ({
    ...e,
    cantidad: pedidos.filter((p) => p.estado === e.key).length,
  })).filter((e) => e.cantidad > 0)
  const totalEstados = estadoData.reduce((acc, e) => acc + e.cantidad, 0) || 1

  // conic-gradient stops (cumulative, sin reasignar durante el render)
  const gradientStops = estadoData
    .map((e, i) => {
      const previos = estadoData.slice(0, i).reduce((acc, x) => acc + x.cantidad, 0)
      const inicio = (previos / totalEstados) * 360
      const fin = ((previos + e.cantidad) / totalEstados) * 360
      return `${e.color} ${inicio}deg ${fin}deg`
    })
    .join(', ')

  const maxVentaCategoria = Math.max(...ventasPorCategoria.map((c) => c.ventas), 1)
  const hoy = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-14">
      {/* editorial masthead */}
      <header className="text-center pt-2">
        <Eyebrow center>Vivero Takumi · Reporte interno</Eyebrow>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-gray-900 dark:text-gray-50 leading-[1.05] mt-4">
          El estado de tu <span className="italic text-primary dark:text-accent">vivero</span>,
          <br className="hidden sm:block" /> hoy.
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-5 capitalize tracking-wide">{hoy}</p>
        <Ornamento />
      </header>

      {/* lead metric + supporting stats */}
      <section className="grid md:grid-cols-3 gap-10 md:gap-0 items-center border-t border-gray-200/70 dark:border-gray-800 pt-14">
        <div className="md:col-span-1 md:pr-14">
          <Eyebrow>Ventas acumuladas</Eyebrow>
          <p className="font-serif text-6xl md:text-7xl font-normal text-gray-900 dark:text-gray-50 mt-3 leading-none tracking-tight">
            <span className="text-3xl md:text-4xl align-top text-gray-400 dark:text-gray-500 mr-1">$</span>
            {totalVentas.toLocaleString('es-AR')}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 leading-relaxed">
            A lo largo de {pedidos.length} pedidos, con un ticket promedio de{' '}
            <span className="text-gray-800 dark:text-gray-100 font-medium">${ticketPromedio.toLocaleString('es-AR')}</span>.
          </p>
        </div>

        <div className="md:col-span-2 flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-200/70 dark:divide-gray-800 md:border-l md:border-gray-200/70 md:dark:border-gray-800 md:pl-14">
          <LeadStat valor={usuarios.length} label="Clientes registrados" />
          <LeadStat valor={plantas.length} label="Plantas en catálogo" />
          <LeadStat
            valor={plantasStockBajo.length}
            label="Con stock bajo"
            danger={plantasStockBajo.length > 0}
          />
        </div>
      </section>

      {/* estados con donut editorial */}
      <section className="grid md:grid-cols-2 gap-12 items-center border-t border-gray-200/70 dark:border-gray-800 pt-14">
        <div className="order-2 md:order-1">
          <Eyebrow>Distribución de pedidos</Eyebrow>
          <h2 className="font-serif text-3xl font-normal text-gray-900 dark:text-gray-50 mt-3 mb-7">
            ¿En qué anda cada pedido?
          </h2>
          <ul className="flex flex-col gap-5">
            {estadoData.length === 0 && <li className="text-sm text-gray-400 dark:text-gray-500">Todavía no hay pedidos.</li>}
            {estadoData.map((e) => (
              <li key={e.key} className="flex items-center gap-4">
                <span className="w-2.5 h-2.5 rounded-full shrink-0 ring-4 ring-offset-0" style={{ backgroundColor: e.color, boxShadow: `0 0 0 4px ${e.color}22` }} />
                <span className="flex-1 text-gray-700 dark:text-gray-200">{e.label}</span>
                <span className="text-gray-400 dark:text-gray-500 text-sm tabular-nums">
                  {Math.round((e.cantidad / totalEstados) * 100)}%
                </span>
                <span className="font-serif text-2xl text-gray-900 dark:text-gray-50 tabular-nums w-8 text-right">
                  {e.cantidad}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center order-1 md:order-2">
          {estadoData.length === 0 ? (
            <div className="w-56 h-56 rounded-full border-[3px] border-dashed border-gray-200 dark:border-gray-700" />
          ) : (
            <div className="relative">
              <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-accent/10 to-transparent blur-xl" />
              <div
                className="relative w-56 h-56 rounded-full grid place-items-center shadow-[0_20px_50px_-20px_rgba(45,106,79,0.4)]"
                style={{ background: `conic-gradient(${gradientStops})` }}
              >
                <div className="w-36 h-36 rounded-full bg-background dark:bg-gray-950 grid place-items-center">
                  <div className="text-center">
                    <p className="font-serif text-4xl font-normal text-gray-900 dark:text-gray-50 leading-none">{pedidos.length}</p>
                    <p className="text-[11px] uppercase tracking-widest text-gray-400 dark:text-gray-500 mt-2">pedidos</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* dos columnas editoriales: categorias + productos */}
      <section className="grid md:grid-cols-2 gap-10 md:gap-0 border-t border-gray-200/70 dark:border-gray-800 pt-14">
        <div className="md:pr-14">
          <Eyebrow>Por categoría</Eyebrow>
          <h2 className="font-serif text-3xl font-normal text-gray-900 dark:text-gray-50 mt-3 mb-8">De dónde viene el dinero</h2>
          {ventasPorCategoria.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">Todavía no hay ventas.</p>
          ) : (
            <ul className="flex flex-col gap-6">
              {ventasPorCategoria.map((c) => (
                <li key={c.categoria} className="group">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-200 group-hover:text-primary dark:group-hover:text-accent transition-colors">
                      {c.categoria}
                    </span>
                    <span className="font-serif text-lg text-gray-900 dark:text-gray-50 tabular-nums">
                      ${c.ventas.toLocaleString('es-AR')}
                    </span>
                  </div>
                  <div className="h-px bg-gray-200/80 dark:bg-gray-800 relative">
                    <div
                      className="absolute inset-y-0 left-0 h-px bg-gradient-to-r from-primary to-accent transition-all duration-500"
                      style={{ width: `${(c.ventas / maxVentaCategoria) * 100}%` }}
                    />
                    <div
                      className="absolute -top-1 w-2 h-2 rounded-full bg-accent ring-4 ring-accent/15 transition-all duration-500"
                      style={{ left: `calc(${(c.ventas / maxVentaCategoria) * 100}% - 4px)` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="md:border-l md:border-gray-200/70 md:dark:border-gray-800 md:pl-14">
          <Eyebrow>Ranking</Eyebrow>
          <h2 className="font-serif text-3xl font-normal text-gray-900 dark:text-gray-50 mt-3 mb-8">Las más queridas</h2>
          {topProductos.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">Todavía no hay ventas.</p>
          ) : (
            <ol className="flex flex-col divide-y divide-gray-200/70 dark:divide-gray-800">
              {topProductos.map((p, i) => (
                <li
                  key={p.nombre}
                  className="flex items-center gap-5 py-4 -mx-3 px-3 rounded-lg hover:bg-white/60 dark:hover:bg-white/[0.03] transition-colors"
                >
                  <span className="font-serif text-3xl font-normal text-gray-200 dark:text-gray-700 tabular-nums w-9 group-hover:text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 text-gray-800 dark:text-gray-100">{p.nombre}</span>
                  <span className="text-sm text-gray-400 dark:text-gray-500 tabular-nums">
                    {p.cantidad} {p.cantidad === 1 ? 'unidad' : 'unidades'}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {/* nota al pie de stock bajo */}
      {plantasStockBajo.length > 0 && (
        <section className="border-t border-gray-200/70 dark:border-gray-800 pt-8">
          <Eyebrow danger>Requiere atención</Eyebrow>
          <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed mt-3 max-w-2xl">
            {plantasStockBajo.map((p, i) => (
              <span key={p.id}>
                <span className="text-gray-800 dark:text-gray-100 font-medium">{p.nombre}</span>
                <span className="text-red-500 dark:text-red-400"> ({p.stock}u)</span>
                {i < plantasStockBajo.length - 1 ? ', ' : '.'}
              </span>
            ))}{' '}
            Conviene reponer antes de que se agoten.
          </p>
        </section>
      )}
    </div>
  )
}

function Eyebrow({ children, center, danger }) {
  return (
    <p className={`flex items-center gap-3 text-xs uppercase tracking-[0.25em] ${center ? 'justify-center' : ''} ${danger ? 'text-red-500 dark:text-red-400' : 'text-accent'}`}>
      <span className={`h-px w-6 ${danger ? 'bg-red-500/50 dark:bg-red-400/50' : 'bg-accent/50'}`} />
      {children}
      {center && <span className="h-px w-6 bg-accent/50" />}
    </p>
  )
}

function Ornamento() {
  return (
    <div className="flex items-center justify-center gap-3 mt-8 text-accent/60">
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-accent/40" />
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M12 2c-4 3-6 6-6 10a6 6 0 0 0 12 0c0-4-2-7-6-10Zm0 3c2.5 2 3.5 4 3.5 6.5a3.5 3.5 0 0 1-7 0C8.5 9 9.5 7 12 5Z" />
      </svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-accent/40" />
    </div>
  )
}

function LeadStat({ valor, label, danger }) {
  return (
    <div className="flex-1 flex flex-col items-center text-center py-5 sm:py-0 sm:px-6 first:pt-0 sm:first:pl-0 last:pb-0 sm:last:pr-0">
      <p className={`font-serif text-5xl font-normal leading-none tracking-tight ${danger ? 'text-red-500 dark:text-red-400' : 'text-gray-900 dark:text-gray-50'}`}>
        {valor}
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 leading-snug uppercase tracking-wider">{label}</p>
    </div>
  )
}
