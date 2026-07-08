const express = require('express')
const router = express.Router()
const { requireAuth, requireRole } = require('../middlewares/auth')
const categoriaController = require('../controllers/categoriaController')

router.get('/categorias', categoriaController.index)
router.post('/categorias', requireAuth, requireRole('admin', 'manager'), categoriaController.store)
router.put('/categorias/:nombre', requireAuth, requireRole('admin', 'manager'), categoriaController.update)
router.delete('/categorias/:nombre', requireAuth, requireRole('admin', 'manager'), categoriaController.destroy)

module.exports = router
