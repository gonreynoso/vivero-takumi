// Usuarios hardcodeados del sistema, con sus roles.
// El super admin real ya no vive acá: es una cuenta auténtica en Supabase Auth + tabla profiles.
export const usuariosIniciales = [
  {
    id: 2,
    nombre: 'Empleado Vivero',
    email: 'empleado@viverotakumi.com',
    password: 'emp123',
    rol: 'empleado',
  },
  {
    id: 4,
    nombre: 'Encargado Vivero',
    email: 'manager@viverotakumi.com',
    password: 'manager123',
    rol: 'manager',
  },
  {
    id: 3,
    nombre: 'Cliente Ejemplo',
    email: 'cliente@viverotakumi.com',
    password: 'cli123',
    rol: 'cliente',
  },
]
