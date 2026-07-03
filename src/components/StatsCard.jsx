
export default function StatsCard({
  titulo,
  valor,
  subtitulo,
  color = 'text-primary dark:text-accent',
  icon: Icon,
  iconBg = 'bg-primary/10 dark:bg-accent/10',
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex items-start justify-between gap-3">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{titulo}</p>
        <p className={`text-2xl sm:text-3xl font-bold mt-1 ${color}`}>{valor}</p>
        {subtitulo && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitulo}</p>}
      </div>
      {Icon && (
        <span className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </span>
      )}
    </div>
  )
}
