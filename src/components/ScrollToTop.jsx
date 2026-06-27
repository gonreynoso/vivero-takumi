import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// React Router no resetea el scroll al navegar; sin esto, una página nueva
// puede arrancar scrolleada a la mitad si la anterior lo estaba.
// Si la URL trae hash (#faq, #faq-1), no forzamos scroll arriba: lo maneja el destino.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
