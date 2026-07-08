const jwt = require('jsonwebtoken')
const usuarioModel = require('../models/usuarioModel')

function buildTokens(usuario) {
  const payload = { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
  return { accessToken, refreshToken }
}

exports.register = async (req, res) => {
  const { nombre, email, password } = req.body
  if (!nombre || !email || !password) {
    return res.status(400).json({ success: false, message: 'Nombre, email y contraseña son obligatorios' })
  }

  try {
    const existente = await usuarioModel.findByEmail(email)
    if (existente) {
      return res.status(409).json({ success: false, message: 'Ya existe una cuenta con ese email' })
    }

    const usuario = await usuarioModel.create({ nombre, email, password, rol: 'cliente' })
    res.status(201).json({ success: true, message: 'Usuario registrado correctamente', usuario })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error al intentar registrar al usuario' })
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body
  try {
    const usuario = await usuarioModel.login({ email, password })
    if (!usuario) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' })
    }

    const { accessToken, refreshToken } = buildTokens(usuario)
    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      nombre: usuario.nombre,
      usuario,
      accessToken,
      refreshToken,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error al intentar iniciar sesión' })
  }
}

exports.me = async (req, res) => {
  try {
    const usuario = await usuarioModel.findById(req.user.id)
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' })
    }
    res.json({ success: true, usuario })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error al recuperar el usuario' })
  }
}

exports.refreshToken = (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Token de autenticación no proporcionado' })
  }

  const [bearer, token] = authHeader.split(' ')
  if (bearer !== 'Bearer' || !token) {
    return res.status(401).json({ success: false, message: 'Formato de token no válido' })
  }

  try {
    const usuario = jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET)
    const payload = { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
    res.json({ success: true, accessToken })
  } catch {
    return res.status(401).json({ success: false, message: 'Token de autenticación inválido' })
  }
}
