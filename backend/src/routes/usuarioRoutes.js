const express = require('express')
const router = express.Router()
const { requireAuth, requireRole } = require('../middlewares/auth')
const usuarioController = require('../controllers/usuarioController')

router.get('/usuarios', requireAuth, requireRole('admin'), usuarioController.index)
router.post('/usuarios', requireAuth, requireRole('admin'), usuarioController.store)
router.put('/usuarios/:ID', requireAuth, requireRole('admin'), usuarioController.update)
router.delete('/usuarios/:ID', requireAuth, requireRole('admin'), usuarioController.destroy)
router.patch('/perfil', requireAuth, usuarioController.updateProfile)

module.exports = router
