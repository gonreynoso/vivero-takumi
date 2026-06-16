// Badge genérico para mostrar estados, stock, dificultad, etc
const colores = {
  verde: 'bg-green-100 text-green-800',
  rojo: 'bg-red-100 text-red-800',
  amarillo: 'bg-yellow-100 text-yellow-800',
  azul: 'bg-blue-100 text-blue-800',
  gris: 'bg-gray-100 text-gray-700',
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
