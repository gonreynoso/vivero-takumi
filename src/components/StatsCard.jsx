// Card de estadística para el dashboard del admin
export default function StatsCard({ titulo, valor, color = 'text-primary' }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <p className="text-sm text-gray-500">{titulo}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{valor}</p>
    </div>
  )
}
