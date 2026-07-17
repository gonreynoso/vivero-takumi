import { useState } from 'react'
import { IdCard, Mail, MapPin, Phone, User, UserRound } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

function datosIniciales(usuario) {
  return {
    nombre: usuario?.nombre || '',
    apellido: usuario?.apellido || '',
    telefono: usuario?.telefono || '',
    dni: usuario?.dni || '',
    direccion: usuario?.direccion || '',
    ciudad: usuario?.ciudad || '',
  }
}

function Campo({ icono: Icono, label, ...props }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
          <Icono className="w-4 h-4" />
        </span>
        <input
          {...props}
          className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent bg-gray-50 dark:bg-gray-900 dark:text-gray-100 text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
        />
      </div>
    </label>
  )
}

export default function Perfil() {
  const { editarUsuario } = useData()
  const { usuario, actualizarUsuario } = useAuth()
  const { mostrarToast } = useToast()

  const [form, setForm] = useState(() => datosIniciales(usuario))
  const [guardando, setGuardando] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    try {
      const actualizado = await editarUsuario({ ...usuario, ...form })
      actualizarUsuario(actualizado)
      mostrarToast('Perfil actualizado')
    } catch (error) {
      mostrarToast(error.message || 'No se pudo actualizar el perfil', 'info')
    } finally {
      setGuardando(false)
    }
  }

  const iniciales = `${usuario?.nombre?.[0] || ''}${usuario?.apellido?.[0] || ''}`.toUpperCase() || 'U'

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-primary text-white text-lg font-semibold shrink-0">
          {iniciales}
        </span>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Mi perfil</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Guardá tus datos y se completan solos al finalizar una compra.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col gap-4"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Campo
            icono={User}
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            placeholder="Nombre"
          />
          <Campo
            icono={UserRound}
            label="Apellido"
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
            placeholder="Apellido"
          />
        </div>

        <Campo
          icono={Mail}
          label="Email"
          type="email"
          value={usuario?.email || ''}
          disabled
          placeholder="Email"
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <Campo
            icono={Phone}
            label="Teléfono"
            type="tel"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            placeholder="Teléfono de contacto"
          />
          <Campo
            icono={IdCard}
            label="DNI"
            name="dni"
            value={form.dni}
            onChange={handleChange}
            placeholder="DNI"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Campo
            icono={MapPin}
            label="Dirección"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            placeholder="Calle y número"
          />
          <Campo
            icono={MapPin}
            label="Ciudad"
            name="ciudad"
            value={form.ciudad}
            onChange={handleChange}
            placeholder="Ciudad"
          />
        </div>

        <button
          type="submit"
          disabled={guardando}
          className="self-start bg-gradient-to-b from-accent to-primary text-white font-medium px-6 py-2.5 rounded-xl shadow hover:brightness-105 transition mt-2 disabled:opacity-60"
        >
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  )
}
