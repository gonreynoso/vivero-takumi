// Mensaje amigable para mostrar cuando una lista no tiene datos
export default function EmptyState({ mensaje, icono = '🌱' }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 text-gray-400 dark:text-gray-500">
      <span className="text-5xl mb-3">{icono}</span>
      <p className="text-sm">{mensaje}</p>
    </div>
  )
}
