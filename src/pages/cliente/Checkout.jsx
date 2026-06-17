import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { CreditCard, Lock, Mail, MapPin, ShieldCheck, User } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

function datosEnvioIniciales(usuario) {
  return {
    nombre: usuario ? `${usuario.nombre}${usuario.apellido ? ` ${usuario.apellido}` : ''}` : '',
    email: usuario?.email || '',
    direccion: usuario?.direccion || '',
    ciudad: usuario?.ciudad || '',
  }
}

function datosPagoIniciales(usuario) {
  return {
    titular: usuario ? `${usuario.nombre}${usuario.apellido ? ` ${usuario.apellido}` : ''}` : '',
    numero: '',
    vencimiento: '',
    cvv: '',
  }
}

// Deja solo dígitos (máx 4: MM + AA) e inserta la barra automáticamente
function formatearVencimiento(valor) {
  const digitos = valor.replace(/\D/g, '').slice(0, 4)
  return digitos.length > 2 ? `${digitos.slice(0, 2)}/${digitos.slice(2)}` : digitos
}

// Checkout estilo Mercado Libre: paso final donde se ingresan datos de envío y pago
// antes de confirmar el pedido. Solo se procesan los items seleccionados en el carrito
export default function Checkout() {
  const { itemsSeleccionados, totalSeleccionado, quitarVarios } = useCart()
  const { agregarPedido, descontarStock } = useData()
  const { usuario } = useAuth()
  const { mostrarToast } = useToast()
  const navigate = useNavigate()

  const [datosEnvio, setDatosEnvio] = useState(() => datosEnvioIniciales(usuario))
  const [datosPago, setDatosPago] = useState(() => datosPagoIniciales(usuario))
  const [confirmado, setConfirmado] = useState(false)

  if (itemsSeleccionados.length === 0 && !confirmado) {
    return <Navigate to="/carrito" replace />
  }

  const handleConfirmar = async (e) => {
    e.preventDefault()
    setConfirmado(true)
    const hoy = new Date().toISOString().slice(0, 10)
    const pedido = {
      clienteEmail: usuario?.email || datosEnvio.email,
      clienteNombre: usuario?.nombre || datosEnvio.nombre,
      items: itemsSeleccionados.map(({ plantaId, nombre, precio, cantidad }) => ({
        plantaId,
        nombre,
        precio,
        cantidad,
      })),
      total: totalSeleccionado,
      estado: 'pendiente',
      fecha: hoy,
    }
    agregarPedido(pedido)
    try {
      await descontarStock(itemsSeleccionados)
    } catch (error) {
      console.error('No se pudo descontar el stock', error)
    }
    quitarVarios(itemsSeleccionados.map((item) => item.plantaId))
    mostrarToast('¡Compra realizada con éxito!')

    fetch('/.netlify/functions/enviar-confirmacion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pedido }),
    })
      .then(async (res) => {
        if (!res.ok) console.error('No se pudo enviar el mail de confirmación', await res.text())
      })
      .catch((error) => console.error('No se pudo enviar el mail de confirmación', error))

    navigate('/pedido-confirmado', {
      state: {
        pedido,
        direccion: datosEnvio.direccion,
        ultimosDigitos: datosPago.numero.replace(/\s/g, '').slice(-4),
      },
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-800">Finalizar compra</h1>

      <form onSubmit={handleConfirmar} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent" />
              Datos de envío
              {usuario && (
                <span className="text-xs font-normal text-gray-400">(precargados de tu cuenta, podés editarlos)</span>
              )}
            </h2>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <User className="w-4 h-4" />
              </span>
              <input
                value={datosEnvio.nombre}
                onChange={(e) => setDatosEnvio({ ...datosEnvio, nombre: e.target.value })}
                required
                placeholder="Nombre y apellido"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 text-sm"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                value={datosEnvio.email}
                onChange={(e) => setDatosEnvio({ ...datosEnvio, email: e.target.value })}
                required
                placeholder="Email, para coordinar la entrega"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 text-sm"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <MapPin className="w-4 h-4" />
              </span>
              <input
                value={datosEnvio.direccion}
                onChange={(e) => setDatosEnvio({ ...datosEnvio, direccion: e.target.value })}
                required
                placeholder="Dirección de entrega"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 text-sm"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <MapPin className="w-4 h-4" />
              </span>
              <input
                value={datosEnvio.ciudad}
                onChange={(e) => setDatosEnvio({ ...datosEnvio, ciudad: e.target.value })}
                required
                placeholder="Ciudad"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 text-sm"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-accent" />
              Datos de pago
            </h2>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <User className="w-4 h-4" />
              </span>
              <input
                value={datosPago.titular}
                onChange={(e) => setDatosPago({ ...datosPago, titular: e.target.value })}
                required
                placeholder="Nombre del titular"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 text-sm"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <CreditCard className="w-4 h-4" />
              </span>
              <input
                value={datosPago.numero}
                onChange={(e) => setDatosPago({ ...datosPago, numero: e.target.value })}
                required
                inputMode="numeric"
                pattern="[0-9 ]{13,19}"
                maxLength={19}
                placeholder="Número de tarjeta"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                value={datosPago.vencimiento}
                onChange={(e) =>
                  setDatosPago({ ...datosPago, vencimiento: formatearVencimiento(e.target.value) })
                }
                required
                inputMode="numeric"
                placeholder="MM/AA"
                maxLength={5}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 text-sm"
              />
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  value={datosPago.cvv}
                  onChange={(e) => setDatosPago({ ...datosPago, cvv: e.target.value })}
                  required
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="CVV"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 text-sm"
                />
              </div>
            </div>
            <p className="flex items-center gap-1.5 text-xs text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Tus datos de pago están protegidos
            </p>
          </div>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3.5">
            <h2 className="font-semibold text-gray-800">Resumen de compra</h2>
            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto">
              {itemsSeleccionados.map((item) => (
                <div key={item.plantaId} className="flex items-center justify-between text-sm text-gray-600">
                  <span className="truncate pr-2">{item.cantidad} × {item.nombre}</span>
                  <span className="shrink-0">${item.precio * item.cantidad}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-dashed border-gray-200 pt-3.5 flex items-center justify-between">
              <span className="font-semibold text-gray-800">Total</span>
              <span className="text-xl font-bold text-primary">${totalSeleccionado}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-b from-accent to-primary text-white font-medium py-2.5 rounded-xl shadow hover:brightness-105 transition"
          >
            Confirmar compra
          </button>
        </div>
      </form>
    </div>
  )
}
