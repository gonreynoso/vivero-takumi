import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Check, CreditCard, IdCard, Lock, Mail, MapPin, Phone, ShieldCheck, Store, Truck, User } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { cn } from '../../lib/utils'

const COSTO_ENVIO_DOMICILIO = 3000

const METODOS_ENVIO = [
  {
    id: 'domicilio',
    titulo: 'Envío a domicilio',
    descripcion: 'Lo recibís en la dirección que indiques',
    costo: COSTO_ENVIO_DOMICILIO,
    icono: Truck,
  },
  {
    id: 'retiro',
    titulo: 'Retiro en el local',
    descripcion: 'Retirás tu pedido en el vivero, sin costo adicional',
    costo: 0,
    icono: Store,
  },
]

function datosEnvioIniciales(usuario) {
  const nombreCompleto = usuario
    ? `${usuario.nombre}${usuario.apellido ? ` ${usuario.apellido}` : ''}`
    : ''
  return {
    nombre: nombreCompleto,
    email: usuario?.email || '',
    telefono: usuario?.telefono || '',
    dni: usuario?.dni || '',
    direccion: usuario?.direccion || '',
    ciudad: usuario?.ciudad || '',
  }
}

function necesitaCampo(usuario, campo) {
  if (!usuario) return true
  return !usuario[campo]?.trim()
}

function datosPagoIniciales(usuario) {
  return {
    titular: usuario ? `${usuario.nombre}${usuario.apellido ? ` ${usuario.apellido}` : ''}` : '',
    numero: '',
    vencimiento: '',
    cvv: '',
  }
}

function formatearVencimiento(valor) {
  const digitos = valor.replace(/\D/g, '').slice(0, 4)
  return digitos.length > 2 ? `${digitos.slice(0, 2)}/${digitos.slice(2)}` : digitos
}

function PasoHeader({ numero, titulo, nota }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary text-white text-sm font-semibold shrink-0">
        {numero}
      </span>
      <h2 className="font-semibold text-gray-800 dark:text-gray-100">
        {titulo}
        {nota && <span className="ml-2 text-xs font-normal text-gray-400 dark:text-gray-500">{nota}</span>}
      </h2>
    </div>
  )
}

function Campo({ icono: Icono, ...props }) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
        <Icono className="w-4 h-4" />
      </span>
      <input
        {...props}
        className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent bg-gray-50 dark:bg-gray-900 dark:text-gray-100 text-sm transition"
      />
    </div>
  )
}

export default function Checkout() {
  const { itemsSeleccionados, totalSeleccionado, quitarVarios } = useCart()
  const { agregarPedido, editarUsuario } = useData()
  const { usuario, actualizarUsuario } = useAuth()
  const { mostrarToast } = useToast()
  const navigate = useNavigate()

  const [datosEnvio, setDatosEnvio] = useState(() => datosEnvioIniciales(usuario))
  const [datosPago, setDatosPago] = useState(() => datosPagoIniciales(usuario))
  const [metodoEnvio, setMetodoEnvio] = useState('domicilio')
  const [confirmado, setConfirmado] = useState(false)

  if (itemsSeleccionados.length === 0 && !confirmado) {
    return <Navigate to="/carrito" replace />
  }

  const esRetiro = metodoEnvio === 'retiro'
  const costoEnvio = METODOS_ENVIO.find((metodo) => metodo.id === metodoEnvio)?.costo ?? 0
  const totalConEnvio = totalSeleccionado + costoEnvio

  const pedirTelefono = necesitaCampo(usuario, 'telefono')
  const pedirDni = !esRetiro && necesitaCampo(usuario, 'dni')
  const pedirDireccion = !esRetiro && necesitaCampo(usuario, 'direccion')
  const pedirCiudad = !esRetiro && necesitaCampo(usuario, 'ciudad')
  const pedirNombre = necesitaCampo(usuario, 'nombre')
  const pedirEmail = necesitaCampo(usuario, 'email')
  const datosCompletos = usuario && !pedirNombre && !pedirEmail && !pedirTelefono && !pedirDni && !pedirDireccion && !pedirCiudad

  const handleConfirmar = async (e) => {
    e.preventDefault()
    const hoy = new Date().toISOString().slice(0, 10)
    const telefono = datosEnvio.telefono || usuario?.telefono || ''
    const dni = datosEnvio.dni || usuario?.dni || ''
    const direccion = esRetiro ? '' : datosEnvio.direccion || usuario?.direccion || ''
    const ciudad = esRetiro ? '' : datosEnvio.ciudad || usuario?.ciudad || ''

    const pedido = {
      clienteEmail: usuario?.email || datosEnvio.email,
      clienteNombre: usuario?.nombre || datosEnvio.nombre,
      clienteTelefono: telefono,
      clienteDni: dni,
      clienteDireccion: direccion,
      clienteCiudad: ciudad,
      ultimosDigitos: datosPago.numero.replace(/\s/g, '').slice(-4),
      items: itemsSeleccionados.map(({ plantaId, nombre, precio, cantidad, imagen, categoria }) => ({
        plantaId,
        nombre,
        precio,
        cantidad,
        imagen,
        categoria,
      })),
      metodoEnvio,
      costoEnvio,
      total: totalConEnvio,
      estado: 'pendiente',
      fecha: hoy,
    }

    try {
      if (usuario) {
        const actualizado = await editarUsuario({
          ...usuario,
          telefono: telefono || usuario.telefono,
          dni: dni || usuario.dni,
          direccion: direccion || usuario.direccion,
          ciudad: ciudad || usuario.ciudad,
        })
        actualizarUsuario(actualizado)
      }

      await agregarPedido(pedido)
      setConfirmado(true)
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
          direccion: pedido.clienteDireccion,
          ultimosDigitos: pedido.ultimosDigitos,
        },
      })
    } catch (error) {
      mostrarToast(error.message || 'No se pudo confirmar la compra', 'info')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Finalizar compra</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Completá los siguientes pasos para confirmar tu pedido</p>
      </div>

      <form onSubmit={handleConfirmar} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex flex-col gap-4">
            <PasoHeader numero={1} titulo="Método de envío" />
            <div className="grid sm:grid-cols-2 gap-3">
              {METODOS_ENVIO.map((metodo) => {
                const Icono = metodo.icono
                const seleccionado = metodoEnvio === metodo.id
                return (
                  <label
                    key={metodo.id}
                    className={cn(
                      'relative flex flex-col gap-2.5 p-4 rounded-2xl border-2 cursor-pointer transition',
                      seleccionado ? 'border-accent bg-accent/5' : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'
                    )}
                  >
                    <input
                      type="radio"
                      name="metodoEnvio"
                      value={metodo.id}
                      checked={seleccionado}
                      onChange={() => setMetodoEnvio(metodo.id)}
                      className="sr-only"
                    />
                    <span
                      className={cn(
                        'absolute top-3 right-3 flex items-center justify-center w-5 h-5 rounded-full transition',
                        seleccionado ? 'bg-accent text-white' : 'bg-gray-100 dark:bg-gray-700 text-transparent'
                      )}
                    >
                      <Check className="w-3 h-3" />
                    </span>
                    <span
                      className={cn(
                        'flex items-center justify-center w-10 h-10 rounded-xl',
                        seleccionado ? 'bg-accent/15 text-accent' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                      )}
                    >
                      <Icono className="w-5 h-5" />
                    </span>
                    <span className="flex flex-col gap-0.5 pr-4">
                      <span className="font-medium text-sm text-gray-800 dark:text-gray-100">{metodo.titulo}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{metodo.descripcion}</span>
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {metodo.costo > 0 ? `$${metodo.costo}` : 'Gratis'}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex flex-col gap-3.5">
            <PasoHeader
              numero={2}
              titulo={esRetiro ? 'Datos de contacto' : 'Datos de envío'}
              nota={usuario ? '(completá solo lo que falte en tu cuenta)' : null}
            />
            {datosCompletos ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Usamos los datos de tu cuenta ({usuario.email}
                {!esRetiro && usuario.direccion ? ` · ${usuario.direccion}, ${usuario.ciudad}` : ''}).
              </p>
            ) : (
              <>
            {pedirNombre && (
              <Campo
                icono={User}
                value={datosEnvio.nombre}
                onChange={(e) => setDatosEnvio({ ...datosEnvio, nombre: e.target.value })}
                required
                placeholder="Nombre y apellido"
              />
            )}
            {pedirEmail && (
              <Campo
                icono={Mail}
                type="email"
                value={datosEnvio.email}
                onChange={(e) => setDatosEnvio({ ...datosEnvio, email: e.target.value })}
                required
                placeholder={esRetiro ? 'Email, para avisarte cuando esté listo' : 'Email, para coordinar la entrega'}
              />
            )}
            {pedirTelefono && (
              <Campo
                icono={Phone}
                type="tel"
                value={datosEnvio.telefono}
                onChange={(e) => setDatosEnvio({ ...datosEnvio, telefono: e.target.value })}
                required
                placeholder="Teléfono de contacto"
              />
            )}
            {pedirDni && (
              <Campo
                icono={IdCard}
                value={datosEnvio.dni}
                onChange={(e) => setDatosEnvio({ ...datosEnvio, dni: e.target.value })}
                required
                placeholder="DNI"
              />
            )}
            {pedirDireccion && (
              <Campo
                icono={MapPin}
                value={datosEnvio.direccion}
                onChange={(e) => setDatosEnvio({ ...datosEnvio, direccion: e.target.value })}
                required
                placeholder="Dirección de entrega"
              />
            )}
            {pedirCiudad && (
              <Campo
                icono={MapPin}
                value={datosEnvio.ciudad}
                onChange={(e) => setDatosEnvio({ ...datosEnvio, ciudad: e.target.value })}
                required
                placeholder="Ciudad"
              />
            )}
              </>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex flex-col gap-3.5">
            <PasoHeader numero={3} titulo="Datos de pago" />
            <Campo
              icono={User}
              value={datosPago.titular}
              onChange={(e) => setDatosPago({ ...datosPago, titular: e.target.value })}
              required
              placeholder="Nombre del titular"
            />
            <Campo
              icono={CreditCard}
              value={datosPago.numero}
              onChange={(e) => setDatosPago({ ...datosPago, numero: e.target.value })}
              required
              inputMode="numeric"
              pattern="[0-9 ]{13,19}"
              maxLength={19}
              placeholder="Número de tarjeta"
            />
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
                className="w-full px-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent bg-gray-50 dark:bg-gray-900 dark:text-gray-100 text-sm transition"
              />
              <Campo
                icono={Lock}
                value={datosPago.cvv}
                onChange={(e) => setDatosPago({ ...datosPago, cvv: e.target.value })}
                required
                inputMode="numeric"
                maxLength={4}
                placeholder="CVV"
              />
            </div>
            <p className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
              <ShieldCheck className="w-3.5 h-3.5" />
              Tus datos de pago están protegidos
            </p>
          </div>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start flex flex-col gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
            <div className="p-5 flex flex-col gap-3.5">
              <h2 className="font-semibold text-gray-800 dark:text-gray-100">Resumen de compra</h2>
              <div className="flex flex-col gap-3 max-h-56 overflow-y-auto pr-1">
                {itemsSeleccionados.map((item) => (
                  <div key={item.plantaId} className="flex items-center gap-3 text-sm">
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="w-11 h-11 rounded-lg object-cover bg-gray-100 dark:bg-gray-700 shrink-0"
                    />
                    <span className="flex-1 truncate text-gray-600 dark:text-gray-300">
                      {item.cantidad} × {item.nombre}
                    </span>
                    <span className="shrink-0 text-gray-700 dark:text-gray-200 font-medium">${item.precio * item.cantidad}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-gray-200 dark:border-gray-700 pt-3.5 flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>Productos</span>
                  <span>${totalSeleccionado}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>Envío</span>
                  <span>{costoEnvio > 0 ? `$${costoEnvio}` : 'Gratis'}</span>
                </div>
              </div>
            </div>
            <div className="px-5 py-4 bg-primary/5 dark:bg-primary/10 flex items-center justify-between">
              <span className="font-semibold text-gray-800 dark:text-gray-100">Total</span>
              <span className="text-xl font-bold text-primary">${totalConEnvio}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-b from-accent to-primary text-white font-medium py-3 rounded-xl shadow hover:brightness-105 transition"
          >
            Confirmar compra
          </button>
        </div>
      </form>
    </div>
  )
}
