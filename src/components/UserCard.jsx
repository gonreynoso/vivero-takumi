import Badge from './Badge'

const colorRol = {
  admin: 'rojo',
  empleado: 'azul',
  cliente: 'verde',
}

// Card de usuario para la gestión de empleados/usuarios del admin
export default function UserCard({ usuario, onEditar, onEliminar }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between gap-3">
      <div>
        <p className="font-semibold text-gray-800">{usuario.nombre}</p>
        <p className="text-sm text-gray-500">{usuario.email}</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge color={colorRol[usuario.rol] || 'gris'}>{usuario.rol}</Badge>
        {onEditar && (
          <button
            onClick={() => onEditar(usuario)}
            className="text-sm text-primary hover:underline"
          >
            Editar
          </button>
        )}
        {onEliminar && (
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
