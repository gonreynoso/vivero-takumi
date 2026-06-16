// Notificación flotante simple para feedback de acciones
const estilos = {
  success: 'bg-primary text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-blue-600 text-white',
}

export default function Toast({ mensaje, tipo = 'success' }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
      <div className={`px-4 py-3 rounded-lg shadow-lg ${estilos[tipo]}`}>
        {mensaje}
      </div>
    </div>
  )
}
