const connection = require('../../db')
const { formatToday } = require('../helpers/dateHelper')

function mapPlanta(row) {
  if (!row) return null
  return {
    id: row.id,
    nombre: row.nombre,
    categoria: row.categoria,
    precio: Number(row.precio),
    stock: row.stock,
    imagen: row.imagen,
    dificultad: row.dificultad,
    descripcion: row.descripcion,
    guia_cuidado: typeof row.guia_cuidado === 'string' ? JSON.parse(row.guia_cuidado) : row.guia_cuidado,
    rating: Number(row.rating),
    habilitada: row.habilitada === 1 || row.habilitada === true,
  }
}

exports.all = async ({ soloHabilitadas = false } = {}) => {
  const where = soloHabilitadas ? 'WHERE habilitada = 1' : ''
  const [results] = await connection.query(`SELECT * FROM plantas ${where} ORDER BY id`)
  return results.map(mapPlanta)
}

exports.find = async (id) => {
  const [results] = await connection.query('SELECT * FROM plantas WHERE id = ?', [id])
  return results.length === 1 ? mapPlanta(results[0]) : null
}

exports.create = async (planta) => {
  const now = formatToday()
  const [result] = await connection.query(
    `INSERT INTO plantas (nombre, categoria, precio, stock, imagen, dificultad, descripcion, guia_cuidado, rating, habilitada, fecha_creacion, fecha_modificacion)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      planta.nombre,
      planta.categoria,
      planta.precio,
      planta.stock ?? 0,
      planta.imagen,
      planta.dificultad,
      planta.descripcion,
      JSON.stringify(planta.guia_cuidado || {}),
      planta.rating ?? 4.5,
      planta.habilitada === false ? 0 : 1,
      now,
      now,
    ]
  )
  return exports.find(result.insertId)
}

exports.update = async (planta) => {
  const now = formatToday()
  await connection.query(
    `UPDATE plantas SET nombre = ?, categoria = ?, precio = ?, stock = ?, imagen = ?, dificultad = ?, descripcion = ?, guia_cuidado = ?, rating = ?, habilitada = ?, fecha_modificacion = ? WHERE id = ?`,
    [
      planta.nombre,
      planta.categoria,
      planta.precio,
      planta.stock,
      planta.imagen,
      planta.dificultad,
      planta.descripcion,
      JSON.stringify(planta.guia_cuidado || {}),
      planta.rating,
      planta.habilitada === false ? 0 : 1,
      now,
      planta.id,
    ]
  )
  return exports.find(planta.id)
}

exports.remove = async (id) => {
  await connection.query('DELETE FROM plantas WHERE id = ?', [id])
}

exports.updateStock = async (id, stock) => {
  const now = formatToday()
  await connection.query('UPDATE plantas SET stock = ?, fecha_modificacion = ? WHERE id = ?', [stock, now, id])
  return exports.find(id)
}

exports.descontarStock = async (items) => {
  for (const item of items) {
    await connection.query('UPDATE plantas SET stock = GREATEST(0, stock - ?) WHERE id = ?', [
      item.cantidad,
      item.plantaId,
    ])
  }
}

exports.toggleHabilitada = async (id) => {
  await connection.query('UPDATE plantas SET habilitada = NOT habilitada, fecha_modificacion = ? WHERE id = ?', [
    formatToday(),
    id,
  ])
  return exports.find(id)
}

exports.renombrarCategoria = async (anterior, nueva) => {
  await connection.query('UPDATE plantas SET categoria = ?, fecha_modificacion = ? WHERE categoria = ?', [
    nueva,
    formatToday(),
    anterior,
  ])
}
