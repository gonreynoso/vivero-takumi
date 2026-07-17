import { Navigate, Link, useLocation } from 'react-router-dom'
import { CheckCircle2, CreditCard, Mail, MapPin, Store, Truck, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function PedidoConfirmado() {
  const location = useLocation()
  const { usuario } = useAuth()
  const { pedido, direccion, ultimosDigitos } = location.state || {}

  if (!pedido) {
    return <Navigate to="/catalogo" replace />
  }

  return (
    <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto">
      <div className="flex flex-col items-center gap-3 text-center pt-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">¡Compra realizada con éxito!</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Te enviamos los detalles a {pedido.clienteEmail}. Pronto nos pondremos en contacto para coordinar la entrega.
        </p>
      </div>

      <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex flex-col gap-3.5">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Resumen del pedido</h2>
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {pedido.items.map((item) => (
            <li key={item.plantaId} className="py-2 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>{item.cantidad} × {item.nombre}</span>
              <span>${item.precio * item.cantidad}</span>
            </li>
          ))}
        </ul>
        {pedido.costoEnvio != null && (
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 pt-1">
            <span>Productos</span>
            <span>${pedido.total - pedido.costoEnvio}</span>
          </div>
        )}
        {pedido.costoEnvio != null && (
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Envío</span>
            <span>{pedido.costoEnvio > 0 ? `$${pedido.costoEnvio}` : 'Gratis'}</span>
          </div>
        )}
        <div className="border-t border-dashed border-gray-200 dark:border-gray-700 pt-3.5 flex items-center justify-between">
          <span className="font-semibold text-gray-800 dark:text-gray-100">Total</span>
          <span className="text-xl font-bold text-primary">${pedido.total}</span>
        </div>
      </div>

      <div className="w-full grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-2.5">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            {pedido.metodoEnvio === 'retiro' ? (
              <Store className="w-4 h-4 text-accent" />
            ) : (
              <Truck className="w-4 h-4 text-accent" />
            )}
            {pedido.metodoEnvio === 'retiro' ? 'Retiro en el local' : 'Datos de envío'}
          </h2>
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-gray-400" />
            {pedido.clienteNombre}
          </p>
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-gray-400" />
            {pedido.clienteEmail}
          </p>
          {direccion && (
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              {direccion}
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-2.5">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-accent" />
            Método de pago
          </h2>
          <p className="text-sm text-gray-600">Tarjeta terminada en •••• {ultimosDigitos}</p>
          <p className="text-sm text-gray-600">
            Estado: <span className="font-medium text-yellow-600">{pedido.estado}</span>
          </p>
          <p className="text-xs text-gray-400">Fecha: {pedido.fecha}</p>
        </div>
      </div>

      <div className="w-full flex flex-col sm:flex-row gap-3 pb-4">
        {usuario && (
          <Link
            to="/mis-pedidos"
            className="flex-1 text-center bg-gradient-to-b from-accent to-primary text-white font-medium py-2.5 rounded-xl shadow hover:brightness-105 transition"
          >
            Ver mis pedidos
          </Link>
        )}
        <Link
          to="/catalogo"
          className={`flex-1 text-center font-medium py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition ${!usuario ? 'sm:w-full' : ''}`}
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  )
}
