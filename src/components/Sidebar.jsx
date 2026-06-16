import { NavLink } from 'react-router-dom'

const opcionesPorRol = {
  admin: [
    { to: '/admin/dashboard', label: 'Dashboard', icono: '📊' },
    { to: '/admin/plantas', label: 'Plantas', icono: '🌿' },
    { to: '/admin/usuarios', label: 'Usuarios', icono: '👥' },
    { to: '/admin/pedidos', label: 'Pedidos', icono: '📦' },
  ],
  empleado: [
    { to: '/empleado/stock', label: 'Stock', icono: '🌿' },
    { to: '/empleado/pedidos', label: 'Pedidos', icono: '📦' },
  ],
}

// Sidebar lateral con las opciones de navegación, usado en los paneles de admin y empleado
export default function Sidebar({ rol }) {
  const opciones = opcionesPorRol[rol] || []

  return (
    <aside className="w-56 bg-white border-r border-gray-100 min-h-[calc(100vh-4rem)] py-4">
      <nav className="flex flex-col gap-1 px-3">
        {opciones.map((op) => (
          <NavLink
            key={op.to}
            to={op.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-background'
              }`
            }
          >
            <span>{op.icono}</span>
            {op.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
