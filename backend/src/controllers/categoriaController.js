const categoriaModel = require('../models/categoriaModel')
const plantaModel = require('../models/plantaModel')

exports.index = async (req, res) => {
  try {
    const results = await categoriaModel.all()
    res.json({ success: true, results })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error al intentar recuperar las categorías' })
  }
}

exports.store = async (req, res) => {
  const { nombre } = req.body
  if (!nombre?.trim()) {
    return res.status(400).json({ success: false, message: 'El nombre es obligatorio' })
  }
  try {
    if (await categoriaModel.exists(nombre)) {
      return res.status(409).json({ success: false, message: 'La categoría ya existe' })
    }
    await categoriaModel.create(nombre.trim())
    res.status(201).json({ success: true, message: 'Categoría creada correctamente', nombre: nombre.trim() })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error al intentar crear la categoría' })
  }
}

exports.update = async (req, res) => {
  const { nombre } = req.params
  const { nueva } = req.body
  if (!nueva?.trim()) {
    return res.status(400).json({ success: false, message: 'El nuevo nombre es obligatorio' })
  }
  try {
    if (!(await categoriaModel.exists(nombre))) {
      return res.status(404).json({ success: false, message: 'La categoría no existe' })
    }
    await categoriaModel.update(nombre, nueva.trim())
    await plantaModel.renombrarCategoria(nombre, nueva.trim())
    res.json({ success: true, message: 'Categoría actualizada', anterior: nombre, nueva: nueva.trim() })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error al intentar actualizar la categoría' })
  }
}

exports.destroy = async (req, res) => {
  const { nombre } = req.params
  try {
    if (!(await categoriaModel.exists(nombre))) {
      return res.status(404).json({ success: false, message: 'La categoría no existe' })
    }
    await categoriaModel.remove(nombre)
    res.json({ success: true, message: 'Categoría eliminada correctamente' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error al intentar eliminar la categoría' })
  }
}
