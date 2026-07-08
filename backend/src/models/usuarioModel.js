const connection = require('../../db')
const bcrypt = require('bcrypt')
const { formatToday } = require('../helpers/dateHelper')

function mapUsuario(row) {
  if (!row) return null
  return {
    id: row.id,
    nombre: row.nombre,
    apellido: row.apellido || '',
    email: row.email,
    rol: row.rol,
    telefono: row.telefono || '',
    dni: row.dni || '',
    direccion: row.direccion || '',
    ciudad: row.ciudad || '',
  }
}

exports.all = async () => {
  const [results] = await connection.query(
    'SELECT id, nombre, apellido, email, rol, telefono, dni, direccion, ciudad FROM usuarios ORDER BY id'
  )
  return results.map(mapUsuario)
}

exports.findById = async (id) => {
  const [results] = await connection.query(
    'SELECT id, nombre, apellido, email, rol, telefono, dni, direccion, ciudad FROM usuarios WHERE id = ?',
    [id]
  )
  return results.length === 1 ? mapUsuario(results[0]) : null
}

exports.findByEmail = async (email) => {
  const [results] = await connection.query(
    'SELECT id, nombre, apellido, email, password, rol, telefono, dni, direccion, ciudad FROM usuarios WHERE email = ?',
    [email]
  )
  return results.length === 1 ? results[0] : null
}

exports.create = async ({ nombre, apellido, email, password, rol, telefono, dni, direccion, ciudad }) => {
  const passwordHash = await bcrypt.hash(password, 10)
  const now = formatToday()
  const [result] = await connection.query(
    `INSERT INTO usuarios (nombre, apellido, email, password, rol, telefono, dni, direccion, ciudad, fecha_creacion, fecha_modificacion)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nombre,
      apellido || null,
      email,
      passwordHash,
      rol || 'cliente',
      telefono || null,
      dni || null,
      direccion || null,
      ciudad || null,
      now,
      now,
    ]
  )
  return exports.findById(result.insertId)
}

exports.update = async ({ id, nombre, apellido, email, password, rol, telefono, dni, direccion, ciudad }) => {
  const now = formatToday()
  if (password) {
    const passwordHash = await bcrypt.hash(password, 10)
    await connection.query(
      `UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, password = ?, rol = ?, telefono = ?, dni = ?, direccion = ?, ciudad = ?, fecha_modificacion = ? WHERE id = ?`,
      [nombre, apellido || null, email, passwordHash, rol, telefono || null, dni || null, direccion || null, ciudad || null, now, id]
    )
  } else {
    await connection.query(
      `UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, rol = ?, telefono = ?, dni = ?, direccion = ?, ciudad = ?, fecha_modificacion = ? WHERE id = ?`,
      [nombre, apellido || null, email, rol, telefono || null, dni || null, direccion || null, ciudad || null, now, id]
    )
  }
  return exports.findById(id)
}

exports.remove = async (id) => {
  await connection.query('DELETE FROM usuarios WHERE id = ?', [id])
}

exports.login = async ({ email, password }) => {
  const usuario = await exports.findByEmail(email)
  if (!usuario) return null
  const ok = await bcrypt.compare(password, usuario.password)
  if (!ok) return null
  return mapUsuario(usuario)
}
