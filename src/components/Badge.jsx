// Badge genérico para mostrar estados, stock, dificultad, etc
const colores = {
  verde: 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300',
  rojo: 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300',
  amarillo: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300',
  azul: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300',
  gris: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
}

export default function Badge({ children, color = 'verde' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colores[color]}`}
    >
      {children}
    </span>
  )
}
