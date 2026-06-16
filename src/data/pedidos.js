// Pedidos de ejemplo con distintos estados
export const pedidosIniciales = [
  {
    id: 1,
    clienteEmail: "cliente@viverotakumi.com",
    clienteNombre: "Cliente Ejemplo",
    items: [
      { plantaId: 1, nombre: "Monstera Deliciosa", precio: 4500, cantidad: 1 },
      { plantaId: 11, nombre: "Albahaca", precio: 900, cantidad: 2 },
    ],
    total: 6300,
    estado: "entregado",
    fecha: "2026-06-01",
  },
  {
    id: 2,
    clienteEmail: "cliente@viverotakumi.com",
    clienteNombre: "Cliente Ejemplo",
    items: [{ plantaId: 5, nombre: "Lavanda", precio: 1800, cantidad: 3 }],
    total: 5400,
    estado: "confirmado",
    fecha: "2026-06-10",
  },
  {
    id: 3,
    clienteEmail: "cliente@viverotakumi.com",
    clienteNombre: "Cliente Ejemplo",
    items: [
      { plantaId: 8, nombre: "Echeveria", precio: 1200, cantidad: 4 },
      { plantaId: 14, nombre: "Limonero", precio: 7500, cantidad: 1 },
    ],
    total: 12300,
    estado: "pendiente",
    fecha: "2026-06-14",
  },
];
