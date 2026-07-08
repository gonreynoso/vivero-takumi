import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const rootElement = document.getElementById('root')

function marcarAppLista() {
  window.__APP_BOOTED__ = true
  sessionStorage.removeItem('vivero-takumi:boot-retry')
  document.documentElement.classList.add('app-ready')
  document.getElementById('app-splash')?.remove()
}

function mostrarErrorDeArranque(error) {
  console.error('Error al iniciar la app', error)
  const splash = document.getElementById('app-splash')
  if (!splash) return
  splash.setAttribute('aria-busy', 'false')
  splash.innerHTML =
    '<span class="app-loader__mark" aria-hidden="true">🌿</span>' +
    '<span class="app-loader__text">No se pudo cargar la app</span>' +
    '<button type="button" class="app-loader__retry" onclick="sessionStorage.removeItem(\'vivero-takumi:boot-retry\'); location.reload()">Reintentar</button>'
}

if (!rootElement) {
  mostrarErrorDeArranque(new Error('No se encontró #root'))
} else {
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
    marcarAppLista()
  } catch (error) {
    mostrarErrorDeArranque(error)
  }
}
