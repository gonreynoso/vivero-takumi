import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// React Router no resetea el scroll al navegar; sin esto, una página nueva
// puede arrancar scrolleada a la mitad si la anterior lo estaba
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
