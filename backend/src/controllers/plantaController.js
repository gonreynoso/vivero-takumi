const plantaModel = require('../models/plantaModel')

exports.index = async (req, res) => {
  try {
    const soloHabilitadas = !req.user || req.user.rol === 'cliente'
    const results = await plantaModel.all({ soloHabilitadas: req.query.todas !== '1' && soloHabilitadas })
    res.json({ success: true, results })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error al intentar recuperar las plantas' })
  }
}

exports.show = async (req, res) => {
  const { ID } = req.params
  try {
    const result = await plantaModel.find(ID)
    if (!result) {
      return res.status(404).json({ success: false, message: 'La planta no existe' })
    }
    if (result.habilitada === false && (!req.user || !['admin', 'manager', 'empleado'].includes(req.user.rol))) {
      return res.status(404).json({ success: false, message: 'La planta no está disponible' })
    }
    res.json({ success: true, result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error al intentar recuperar la planta' })
  }
}

exports.store = async (req, res) => {
  try {
    const planta = await plantaModel.create(req.body)
    res.status(201).json({ success: true, message: 'Planta creada correctamente', planta })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error al intentar crear la planta' })
  }
}

exports.update = async (req, res) => {
  const { ID } = req.params
  try {
    const actual = await plantaModel.find(ID)
    if (!actual) {
      return res.status(404).json({ success: false, message: 'La planta no existe' })
    }
    const planta = await plantaModel.update({ ...actual, ...req.body, id: Number(ID) })
    res.json({ success: true, message: 'Planta actualizada correctamente', planta })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error al intentar actualizar la planta' })
  }
}

exports.destroy = async (req, res) => {
  const { ID } = req.params
  try {
    const actual = await plantaModel.find(ID)
    if (!actual) {
      return res.status(404).json({ success: false, message: 'La planta no existe' })
    }
    await plantaModel.remove(ID)
    res.json({ success: true, message: 'Planta eliminada correctamente' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error al intentar eliminar la planta' })
  }
}

exports.updateStock = async (req, res) => {
  const { ID } = req.params
  const { stock } = req.body
  try {
    const planta = await plantaModel.updateStock(ID, stock)
    if (!planta) {
      return res.status(404).json({ success: false, message: 'La planta no existe' })
    }
    res.json({ success: true, message: 'Stock actualizado', planta })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error al actualizar el stock' })
  }
}

exports.toggleHabilitada = async (req, res) => {
  const { ID } = req.params
  try {
    const planta = await plantaModel.toggleHabilitada(ID)
    if (!planta) {
      return res.status(404).json({ success: false, message: 'La planta no existe' })
    }
    res.json({ success: true, message: 'Estado actualizado', planta })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error al actualizar la planta' })
  }
}
