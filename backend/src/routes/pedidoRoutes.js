const express = require('express')
const router = express.Router()
const { requireAuth, requireRole } = require('../middlewares/auth')
const pedidoController = require('../controllers/pedidoController')

router.get('/pedidos', requireAuth, pedidoController.index)
router.get('/pedidos/:ID', requireAuth, pedidoController.show)
router.post('/pedidos', pedidoController.store)
router.patch('/pedidos/:ID/estado', requireAuth, requireRole('admin', 'manager', 'empleado'), pedidoController.updateEstado)
router.put('/pedidos/:ID', requireAuth, requireRole('admin'), pedidoController.update)

module.exports = router
