const pedidoModel = require('../models/pedidoModel')
const plantaModel = require('../models/plantaModel')

exports.index = async (req, res) => {
  try {
    const emailCliente = req.user.rol === 'cliente' ? req.user.email : undefined
    const results = await pedidoModel.all({ emailCliente })
    res.json({ success: true, results })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error al intentar recuperar los pedidos' })
  }
}

exports.show = async (req, res) => {
  const { ID } = req.params
  try {
    const result = await pedidoModel.find(ID)
    if (!result) {
      return res.status(404).json({ success: false, message: 'El pedido no existe' })
    }
    if (req.user.rol === 'cliente' && result.clienteEmail !== req.user.email) {
      return res.status(403).json({ success: false, message: 'No tenés permiso para ver este pedido' })
    }
    res.json({ success: true, result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error al intentar recuperar el pedido' })
  }
}

exports.store = async (req, res) => {
  try {
    const pedido = await pedidoModel.create(req.body)
    if (req.body.items?.length) {
      await plantaModel.descontarStock(req.body.items)
    }
    res.status(201).json({ success: true, message: 'Pedido creado correctamente', pedido })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error al intentar crear el pedido' })
  }
}

exports.updateEstado = async (req, res) => {
  const { ID } = req.params
  const { estado } = req.body
  try {
    const actual = await pedidoModel.find(ID)
    if (!actual) {
      return res.status(404).json({ success: false, message: 'El pedido no existe' })
    }
    const pedido = await pedidoModel.updateEstado(ID, estado)
    res.json({ success: true, message: 'Estado actualizado', pedido })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error al actualizar el pedido' })
  }
}

exports.update = async (req, res) => {
  const { ID } = req.params
  try {
    const actual = await pedidoModel.find(ID)
    if (!actual) {
      return res.status(404).json({ success: false, message: 'El pedido no existe' })
    }
    const pedido = await pedidoModel.update({ ...actual, ...req.body, id: Number(ID) })
    res.json({ success: true, message: 'Pedido actualizado', pedido })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error al actualizar el pedido' })
  }
}
