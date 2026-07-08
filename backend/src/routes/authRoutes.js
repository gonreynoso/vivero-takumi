const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middlewares/auth')
const authController = require('../controllers/authController')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/refresh-token', authController.refreshToken)
router.get('/me', requireAuth, authController.me)

module.exports = router
