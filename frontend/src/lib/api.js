const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888/api'

const TOKEN_KEY = 'vivero-takumi:accessToken'
const REFRESH_KEY = 'vivero-takumi:refreshToken'

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY)
}

export function setTokens({ accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken)
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken)
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

const API_DOWN_MESSAGE =
  'No se pudo conectar con el API. ¿Está corriendo el backend? (npm run dev en backend/)'

export async function checkApiHealth() {
  try {
    const res = await fetch(`${API_URL}/health`, { cache: 'no-store' })
    if (!res.ok) throw new Error(API_DOWN_MESSAGE)
    const data = await res.json().catch(() => ({}))
    if (!data.success) throw new Error(API_DOWN_MESSAGE)
    return data
  } catch (error) {
    if (error.message === API_DOWN_MESSAGE) throw error
    throw new Error(API_DOWN_MESSAGE)
  }
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return null

  const res = await fetch(`${API_URL}/auth/refresh-token`, {
    headers: { Authorization: `Bearer ${refreshToken}` },
  })
  const data = await res.json()
  if (data.success && data.accessToken) {
    localStorage.setItem(TOKEN_KEY, data.accessToken)
    return data.accessToken
  }
  clearTokens()
  return null
}

export async function apiFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  const token = getAccessToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const fetchOptions = { ...options, headers, cache: 'no-store' }

  let res
  try {
    res = await fetch(`${API_URL}${path}`, fetchOptions)
  } catch {
    throw new Error(API_DOWN_MESSAGE)
  }

  if (res.status === 401 && getRefreshToken()) {
    const newToken = await refreshAccessToken()
    if (newToken) {
      headers.Authorization = `Bearer ${newToken}`
      try {
        res = await fetch(`${API_URL}${path}`, { ...options, headers, cache: 'no-store' })
      } catch {
        throw new Error(API_DOWN_MESSAGE)
      }
    }
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || 'Error en la solicitud')
  }
  return data
}

export const authApi = {
  login: (email, password) =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (payload) =>
    apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => apiFetch('/auth/me'),
}

export const plantasApi = {
  list: () => apiFetch('/plantas'),
  get: (id) => apiFetch(`/plantas/${id}`),
  create: (planta) => apiFetch('/plantas', { method: 'POST', body: JSON.stringify(planta) }),
  update: (id, planta) => apiFetch(`/plantas/${id}`, { method: 'PUT', body: JSON.stringify(planta) }),
  remove: (id) => apiFetch(`/plantas/${id}`, { method: 'DELETE' }),
  updateStock: (id, stock) =>
    apiFetch(`/plantas/${id}/stock`, { method: 'PATCH', body: JSON.stringify({ stock }) }),
  toggleHabilitada: (id) => apiFetch(`/plantas/${id}/habilitada`, { method: 'PATCH' }),
}

export const categoriasApi = {
  list: () => apiFetch('/categorias'),
  create: (nombre) => apiFetch('/categorias', { method: 'POST', body: JSON.stringify({ nombre }) }),
  update: (anterior, nueva) =>
    apiFetch(`/categorias/${encodeURIComponent(anterior)}`, {
      method: 'PUT',
      body: JSON.stringify({ nueva }),
    }),
  remove: (nombre) => apiFetch(`/categorias/${encodeURIComponent(nombre)}`, { method: 'DELETE' }),
}

export const pedidosApi = {
  list: () => apiFetch('/pedidos'),
  create: (pedido) => apiFetch('/pedidos', { method: 'POST', body: JSON.stringify(pedido) }),
  updateEstado: (id, estado) =>
    apiFetch(`/pedidos/${id}/estado`, { method: 'PATCH', body: JSON.stringify({ estado }) }),
  update: (id, pedido) => apiFetch(`/pedidos/${id}`, { method: 'PUT', body: JSON.stringify(pedido) }),
}

export const usuariosApi = {
  list: () => apiFetch('/usuarios'),
  create: (usuario) => apiFetch('/usuarios', { method: 'POST', body: JSON.stringify(usuario) }),
  update: (id, usuario) => apiFetch(`/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(usuario) }),
  remove: (id) => apiFetch(`/usuarios/${id}`, { method: 'DELETE' }),
  updateProfile: (payload) => apiFetch('/perfil', { method: 'PATCH', body: JSON.stringify(payload) }),
}
