const jwt = require('jsonwebtoken')

exports.requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Token de autenticación no proporcionado' })
  }

  const [bearer, token] = authHeader.split(' ')
  if (bearer !== 'Bearer' || !token) {
    return res.status(401).json({ success: false, message: 'Formato de token no válido' })
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET)
    req.user = decodedToken
    next()
  } catch {
    return res.status(401).json({ success: false, message: 'Token de autenticación inválido' })
  }
}

exports.requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.rol)) {
    return res.status(403).json({ success: false, message: 'No tenés permiso para esta acción' })
  }
  next()
}
