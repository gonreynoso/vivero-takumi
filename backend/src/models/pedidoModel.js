const connection = require('../../db')
const { formatToday, todayDate } = require('../helpers/dateHelper')

function mapPedido(row) {
  if (!row) return null
  return {
    id: row.id,
    clienteEmail: row.cliente_email,
    clienteNombre: row.cliente_nombre,
    clienteTelefono: row.cliente_telefono || '',
    clienteDni: row.cliente_dni || '',
    clienteDireccion: row.cliente_direccion || '',
    clienteCiudad: row.cliente_ciudad || '',
    items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
    total: Number(row.total),
    estado: row.estado,
    metodoEnvio: row.metodo_envio || '',
    fecha: row.fecha,
  }
}

exports.all = async ({ emailCliente } = {}) => {
  if (emailCliente) {
    const [results] = await connection.query(
      'SELECT * FROM pedidos WHERE cliente_email = ? ORDER BY id DESC',
      [emailCliente]
    )
    return results.map(mapPedido)
  }
  const [results] = await connection.query('SELECT * FROM pedidos ORDER BY id DESC')
  return results.map(mapPedido)
}

exports.find = async (id) => {
  const [results] = await connection.query('SELECT * FROM pedidos WHERE id = ?', [id])
  return results.length === 1 ? mapPedido(results[0]) : null
}

exports.create = async (pedido) => {
  const now = formatToday()
  const [result] = await connection.query(
    `INSERT INTO pedidos (cliente_email, cliente_nombre, cliente_telefono, cliente_dni, cliente_direccion, cliente_ciudad, items, total, estado, metodo_envio, fecha, fecha_creacion, fecha_modificacion)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      pedido.clienteEmail,
      pedido.clienteNombre,
      pedido.clienteTelefono || null,
      pedido.clienteDni || null,
      pedido.clienteDireccion || null,
      pedido.clienteCiudad || null,
      JSON.stringify(pedido.items),
      pedido.total,
      pedido.estado || 'pendiente',
      pedido.metodoEnvio || null,
      pedido.fecha || todayDate(),
      now,
      now,
    ]
  )
  return exports.find(result.insertId)
}

exports.updateEstado = async (id, estado) => {
  await connection.query('UPDATE pedidos SET estado = ?, fecha_modificacion = ? WHERE id = ?', [
    estado,
    formatToday(),
    id,
  ])
  return exports.find(id)
}

exports.update = async (pedido) => {
  const total = pedido.items
    ? pedido.items.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
    : pedido.total
  await connection.query(
    `UPDATE pedidos SET cliente_email = ?, cliente_nombre = ?, cliente_telefono = ?, cliente_dni = ?, cliente_direccion = ?, cliente_ciudad = ?, items = ?, total = ?, estado = ?, metodo_envio = ?, fecha = ?, fecha_modificacion = ? WHERE id = ?`,
    [
      pedido.clienteEmail,
      pedido.clienteNombre,
      pedido.clienteTelefono || null,
      pedido.clienteDni || null,
      pedido.clienteDireccion || null,
      pedido.clienteCiudad || null,
      JSON.stringify(pedido.items),
      total,
      pedido.estado,
      pedido.metodoEnvio || null,
      pedido.fecha,
      formatToday(),
      pedido.id,
    ]
  )
  return exports.find(pedido.id)
}
