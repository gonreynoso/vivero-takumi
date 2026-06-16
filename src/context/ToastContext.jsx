import { createContext, useContext, useState, useCallback } from 'react'
import Toast from '../components/Toast'

const ToastContext = createContext(null)

// Provee una función global para mostrar notificaciones tipo toast
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const mostrarToast = useCallback((mensaje, tipo = 'success') => {
    setToast({ mensaje, tipo })
    setTimeout(() => setToast(null), 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ mostrarToast }}>
      {children}
      {toast && <Toast mensaje={toast.mensaje} tipo={toast.tipo} />}
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- el hook vive junto a su Provider a propósito
export function useToast() {
  return useContext(ToastContext)
}
