const express = require('express')
const router = express.Router()
const { requireAuth, requireRole } = require('../middlewares/auth')
const plantaController = require('../controllers/plantaController')

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return next()
  return requireAuth(req, res, next)
}

router.get('/plantas', optionalAuth, plantaController.index)
router.get('/plantas/:ID', optionalAuth, plantaController.show)
router.post('/plantas', requireAuth, requireRole('admin', 'manager'), plantaController.store)
router.put('/plantas/:ID', requireAuth, requireRole('admin', 'manager'), plantaController.update)
router.delete('/plantas/:ID', requireAuth, requireRole('admin'), plantaController.destroy)
router.patch('/plantas/:ID/stock', requireAuth, requireRole('admin', 'manager', 'empleado'), plantaController.updateStock)
router.patch('/plantas/:ID/habilitada', requireAuth, requireRole('admin', 'manager'), plantaController.toggleHabilitada)

module.exports = router
