const CLAVE_STORAGE = 'vivero-takumi:riego'

function leerTodo() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_STORAGE)) || {}
  } catch {
    return {}
  }
}

export function obtenerUltimoRiego(email, plantaId) {
  return leerTodo()[email]?.[plantaId] || null
}

export function registrarRiego(email, plantaId) {
  const todo = leerTodo()
  const fecha = new Date().toISOString().slice(0, 10)
  todo[email] = { ...(todo[email] || {}), [plantaId]: fecha }
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(todo))
  return fecha
}

const MS_POR_DIA = 1000 * 60 * 60 * 24

export function diasDesde(fechaIso) {
  return Math.floor((Date.now() - new Date(fechaIso).getTime()) / MS_POR_DIA)
}

export function diasEntreRiegos(texto = '') {
  const t = texto.toLowerCase()
  const numero = t.match(/(\d+)/)
  if (numero) return parseInt(numero[1], 10)
  if (t.includes('mes')) return 30
  if (t.includes('escaso')) return 14
  if (t.includes('semana')) return 7
  if (t.includes('húmedo') || t.includes('humedo') || t.includes('frecuente')) return 3
  return 7
}
