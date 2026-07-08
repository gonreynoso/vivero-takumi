const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const openapi = require('./src/config/openapi')

const app = express()
const port = process.env.PORT || 8888

const allowedOrigins = new Set(
  [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4173',
    'http://127.0.0.1:4173',
  ].filter(Boolean)
)

const corsOptions = {
  origin(origin, callback) {
    // Peticiones sin Origin (curl, Postman) o desde el frontend permitido
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, origin || process.env.FRONTEND_URL || 'http://localhost:5173')
      return
    }
    callback(new Error(`CORS: origen no permitido (${origin})`))
  },
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors(corsOptions))

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapi, {
  customSiteTitle: 'Vivero Takumi API',
}))

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API Vivero Takumi OK' })
})

app.use('/api/auth', require('./src/routes/authRoutes'))
app.use('/api', require('./src/routes/usuarioRoutes'))
app.use('/api', require('./src/routes/plantaRoutes'))
app.use('/api', require('./src/routes/categoriaRoutes'))
app.use('/api', require('./src/routes/pedidoRoutes'))

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' })
})

app.listen(port, () => {
  console.log(`Servidor iniciado en: http://localhost:${port}`)
})

module.exports = app
