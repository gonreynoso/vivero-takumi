import { useState } from 'react'
import {
  ChevronDown,
  CreditCard,
  IdCard,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Save,
  User,
  X,
} from 'lucide-react'
import Badge from './Badge'

const colorEstado = { pendiente: 'amarillo', confirmado: 'azul', entregado: 'verde' }
const estadosDisponibles = ['pendiente', 'confirmado', 'entregado']

export default function PedidoFila({ pedido, onCambiarEstado, onGuardarEdicion }) {
  const [abierto, setAbierto] = useState(false)
  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState(null)

  const abrirEdicion = () => {
    setForm({
      clienteNombre: pedido.clienteNombre || '',
      clienteEmail: pedido.clienteEmail || '',
      clienteTelefono: pedido.clienteTelefono || '',
      clienteDni: pedido.clienteDni || '',
      clienteDireccion: pedido.clienteDireccion || '',
      clienteCiudad: pedido.clienteCiudad || '',
      items: pedido.items.map((item) => ({ ...item })),
    })
    setEditando(true)
  }

  const cancelarEdicion = () => {
    setEditando(false)
    setForm(null)
  }

  const guardarEdicion = () => {
    onGuardarEdicion({ ...pedido, ...form })
    setEditando(false)
    setForm(null)
  }

  const cambiarCantidad = (plantaId, cantidad) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.plantaId === plantaId ? { ...item, cantidad: Math.max(1, cantidad) } : item
      ),
    }))
  }

  const totalForm = form ? form.items.reduce((acc, item) => acc + item.precio * item.cantidad, 0) : 0
  const resumenItems = pedido.items.map((item) => `${item.nombre} x${item.cantidad}`).join(', ')

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <button
        onClick={() => setAbierto((v) => !v)}
        className="w-full grid grid-cols-[1fr_auto] sm:grid-cols-[50px_1.3fr_1.4fr_90px_90px_140px] items-center gap-2 sm:gap-4 p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <span className="font-semibold text-gray-800 dark:text-gray-100 hidden sm:block">#{pedido.id}</span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
            <span className="sm:hidden">#{pedido.id} · </span>
            {pedido.clienteNombre}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{pedido.clienteEmail}</p>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate hidden sm:block">{resumenItems}</p>
        <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">{pedido.fecha}</span>
        <span className="font-semibold text-primary dark:text-accent text-sm">${pedido.total}</span>
        <span className="justify-self-end sm:justify-self-auto flex items-center gap-2">
          <Badge color={colorEstado[pedido.estado]}>{pedido.estado}</Badge>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform hidden sm:block ${abierto ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {abierto && (
        <div className="border-t border-gray-100 dark:border-gray-700 p-4 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex gap-2 flex-wrap">
              {estadosDisponibles.map((e) => (
                <button
                  key={e}
                  onClick={() => onCambiarEstado(pedido.id, e)}
                  disabled={pedido.estado === e}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${
                    pedido.estado === e
                      ? 'bg-primary text-white cursor-default'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
            {!editando ? (
              <button
                onClick={abrirEdicion}
                className="flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                <Pencil className="w-3.5 h-3.5" />
                Editar pedido
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={cancelarEdicion}
                  className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:underline"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancelar
                </button>
                <button
                  onClick={guardarEdicion}
                  className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
                >
                  <Save className="w-3.5 h-3.5" />
                  Guardar
                </button>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-background dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-700 p-4 flex flex-col gap-2.5">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Comprador</h3>
              {!editando ? (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-gray-400" /> {pedido.clienteNombre}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-gray-400" /> {pedido.clienteEmail}
                  </p>
                  {pedido.clienteTelefono && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gray-400" /> {pedido.clienteTelefono}
                    </p>
                  )}
                  {pedido.clienteDni && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                      <IdCard className="w-3.5 h-3.5 text-gray-400" /> DNI {pedido.clienteDni}
                    </p>
                  )}
                  {pedido.clienteDireccion && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {pedido.clienteDireccion}
                      {pedido.clienteCiudad ? `, ${pedido.clienteCiudad}` : ''}
                    </p>
                  )}
                  {pedido.ultimosDigitos && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                      Tarjeta terminada en •••• {pedido.ultimosDigitos}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <input
                    value={form.clienteNombre}
                    onChange={(e) => setForm({ ...form, clienteNombre: e.target.value })}
                    placeholder="Nombre y apellido"
                    className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-700 dark:text-gray-100"
                  />
                  <input
                    value={form.clienteTelefono}
                    onChange={(e) => setForm({ ...form, clienteTelefono: e.target.value })}
                    placeholder="Teléfono"
                    className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-700 dark:text-gray-100"
                  />
                  <input
                    value={form.clienteDni}
                    onChange={(e) => setForm({ ...form, clienteDni: e.target.value })}
                    placeholder="DNI"
                    className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-700 dark:text-gray-100"
                  />
                  <input
                    value={form.clienteDireccion}
                    onChange={(e) => setForm({ ...form, clienteDireccion: e.target.value })}
                    placeholder="Dirección"
                    className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-700 dark:text-gray-100"
                  />
                  <input
                    value={form.clienteCiudad}
                    onChange={(e) => setForm({ ...form, clienteCiudad: e.target.value })}
                    placeholder="Ciudad"
                    className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-700 dark:text-gray-100"
                  />
                </>
              )}
            </div>

            <div className="bg-background dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-700 p-4 flex flex-col gap-2.5">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Productos</h3>
              <ul className="flex flex-col gap-3">
                {(editando ? form.items : pedido.items).map((item) => (
                  <li key={item.plantaId} className="flex items-center gap-3">
                    {item.imagen && (
                      <img src={item.imagen} alt={item.nombre} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{item.nombre}</p>
                      {item.categoria && <p className="text-xs text-gray-400">{item.categoria}</p>}
                    </div>
                    {!editando ? (
                      <span className="text-sm text-gray-600 dark:text-gray-300 shrink-0">
                        {item.cantidad} × ${item.precio}
                      </span>
                    ) : (
                      <input
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) => cambiarCantidad(item.plantaId, Number(e.target.value))}
                        className="w-16 border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:text-gray-100 shrink-0"
                      />
                    )}
                  </li>
                ))}
              </ul>
              <div className="border-t border-dashed border-gray-200 dark:border-gray-700 pt-2.5 flex items-center justify-between">
                <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Total</span>
                <span className="font-bold text-primary dark:text-accent">${editando ? totalForm : pedido.total}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
