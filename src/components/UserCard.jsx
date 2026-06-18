import { Lock } from 'lucide-react'
import Badge from './Badge'

const colorRol = {
  admin: 'rojo',
  manager: 'amarillo',
  empleado: 'azul',
  cliente: 'verde',
}

// Card de usuario para la gestión de empleados/usuarios del admin
export default function UserCard({ usuario, onEditar, onEliminar }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="min-w-0">
        <p className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-1.5">
          {usuario.nombre}
          {usuario.protegido && <Lock className="w-3.5 h-3.5 text-gray-400" aria-label="Cuenta protegida" />}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{usuario.email}</p>
      </div>
      <div className="flex items-center gap-2 flex-wrap shrink-0">
        <Badge color={colorRol[usuario.rol] || 'gris'}>{usuario.rol}</Badge>
        {onEditar && (
          <button
            onClick={() => onEditar(usuario)}
            className="text-sm text-primary hover:underline"
          >
            Editar
          </button>
        )}
        {onEliminar && !usuario.protegido && (
          <button
            onClick={() => onEliminar(usuario)}
            className="text-sm text-red-600 hover:underline"
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  )
}
