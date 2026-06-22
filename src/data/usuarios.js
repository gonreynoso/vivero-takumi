// Usuarios hardcodeados del sistema, con sus roles. Sin backend: el login valida contra este array.
export const usuariosIniciales = [
  {
    id: 1,
    nombre: 'Admin Vivero',
    email: 'admin@viverotakumi.com',
    password: 'admin123',
    rol: 'admin',
  },
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
