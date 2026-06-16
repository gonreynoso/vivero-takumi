// Muestra la guía de cuidado completa de una planta
export default function GuiaCuidado({ guia }) {
  const items = [
    { label: 'Riego', valor: guia.riego, icono: '💧' },
    { label: 'Luz', valor: guia.luz, icono: '☀️' },
    { label: 'Temperatura', valor: guia.temperatura, icono: '🌡️' },
    { label: 'Tips', valor: guia.tips, icono: '🌱' },
  ]

  return (
    <div className="bg-background rounded-xl border border-gray-100 p-4 grid sm:grid-cols-2 gap-4">
      {items.map((item) => (
        <div key={item.label} className="flex gap-3">
          <span className="text-2xl">{item.icono}</span>
          <div>
            <p className="font-semibold text-gray-800">{item.label}</p>
            <p className="text-sm text-gray-600">{item.valor}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
