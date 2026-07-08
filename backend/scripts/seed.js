const bcrypt = require('bcrypt')
const connection = require('../db')
const { formatToday } = require('../src/helpers/dateHelper')
const path = require('path')

async function loadFrontendData() {
  const plantasModule = await import(path.join(__dirname, '../../frontend/src/data/plantas.js'))
  const pedidosModule = await import(path.join(__dirname, '../../frontend/src/data/pedidos.js'))
  return {
    categorias: plantasModule.categoriasIniciales,
    plantas: plantasModule.plantasIniciales,
    pedidos: pedidosModule.pedidosIniciales,
  }
}

const usuariosSeed = [
  { nombre: 'Gonzalo', email: 'gonzalo.reynoso9@gmail.com', password: 'nmb_yxa8pxa_EFD7hzn', rol: 'admin' },
  { nombre: 'Empleado Vivero', email: 'empleado@viverotakumi.com', password: 'emp123', rol: 'empleado' },
  { nombre: 'Encargado Vivero', email: 'manager@viverotakumi.com', password: 'manager123', rol: 'manager' },
  { nombre: 'Cliente Ejemplo', email: 'cliente@viverotakumi.com', password: 'cli123', rol: 'cliente' },
]

async function seed() {
  const { categorias, plantas, pedidos } = await loadFrontendData()
  const now = formatToday()

  await connection.query('SET FOREIGN_KEY_CHECKS = 0')
  await connection.query('TRUNCATE TABLE pedidos')
  await connection.query('TRUNCATE TABLE plantas')
  await connection.query('TRUNCATE TABLE categorias')
  await connection.query('TRUNCATE TABLE usuarios')
  await connection.query('SET FOREIGN_KEY_CHECKS = 1')

  for (const u of usuariosSeed) {
    const hash = await bcrypt.hash(u.password, 10)
    await connection.query(
      'INSERT INTO usuarios (nombre, email, password, rol, fecha_creacion, fecha_modificacion) VALUES (?, ?, ?, ?, ?, ?)',
      [u.nombre, u.email, hash, u.rol, now, now]
    )
  }

  for (const nombre of categorias) {
    await connection.query('INSERT INTO categorias (nombre, fecha_creacion, fecha_modificacion) VALUES (?, ?, ?)', [
      nombre,
      now,
      now,
    ])
  }

  for (const p of plantas) {
    await connection.query(
      `INSERT INTO plantas (id, nombre, categoria, precio, stock, imagen, dificultad, descripcion, guia_cuidado, rating, habilitada, fecha_creacion, fecha_modificacion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p.id,
        p.nombre,
        p.categoria,
        p.precio,
        p.stock,
        p.imagen,
        p.dificultad,
        p.descripcion,
        JSON.stringify(p.guia_cuidado),
        p.rating,
        p.habilitada === false ? 0 : 1,
        now,
        now,
      ]
    )
  }

  for (const pedido of pedidos) {
    await connection.query(
      `INSERT INTO pedidos (id, cliente_email, cliente_nombre, items, total, estado, fecha, fecha_creacion, fecha_modificacion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        pedido.id,
        pedido.clienteEmail,
        pedido.clienteNombre,
        JSON.stringify(pedido.items),
        pedido.total,
        pedido.estado,
        pedido.fecha,
        now,
        now,
      ]
    )
  }

  console.log('Seed completado: usuarios, categorías, plantas y pedidos cargados.')
  process.exit(0)
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
