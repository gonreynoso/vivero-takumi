const connection = require('../../db')
const { formatToday } = require('../helpers/dateHelper')

exports.all = async () => {
  const [results] = await connection.query('SELECT nombre FROM categorias ORDER BY nombre')
  return results.map((r) => r.nombre)
}

exports.create = async (nombre) => {
  const now = formatToday()
  await connection.query('INSERT INTO categorias (nombre, fecha_creacion, fecha_modificacion) VALUES (?, ?, ?)', [
    nombre,
    now,
    now,
  ])
  return nombre
}

exports.update = async (anterior, nueva) => {
  const now = formatToday()
  await connection.query('UPDATE categorias SET nombre = ?, fecha_modificacion = ? WHERE nombre = ?', [
    nueva,
    now,
    anterior,
  ])
  return nueva
}

exports.remove = async (nombre) => {
  await connection.query('DELETE FROM categorias WHERE nombre = ?', [nombre])
}

exports.exists = async (nombre) => {
  const [results] = await connection.query('SELECT id FROM categorias WHERE nombre = ?', [nombre])
  return results.length > 0
}
