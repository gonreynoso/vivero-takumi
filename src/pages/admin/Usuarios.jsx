import { useEffect, useState } from 'react'
import { Lock, Mail, Shield, User } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { llamarFuncionUsuarios } from '../../lib/usuariosApi'
import UserCard from '../../components/UserCard'
import Modal from '../../components/Modal'
import EmptyState from '../../components/EmptyState'

const rolesDisponibles = ['admin', 'manager', 'empleado', 'cliente']

// CRUD de usuarios. Los usuarios reales (Supabase Auth) se manejan vía Netlify Function
// con la Secret key del lado del servidor; solo el admin puede crearlos con un rol distinto
// de "cliente" — esa regla se aplica en el servidor, no acá. Los 3 usuarios locales de
// demo (manager/empleado/cliente) siguen viviendo en DataContext mientras se termina la migración.
export default function Usuarios() {
  const { usuarios: usuariosLocales, editarUsuario, eliminarUsuario } = useData()
  const { usuario: usuarioActual } = useAuth()
  const { mostrarToast } = useToast()

  const [usuariosSupabase, setUsuariosSupabase] = useState([])
  const [cargando, setCargando] = useState(true)
  const [modalForm, setModalForm] = useState(null) // null | 'crear' | usuario a editar
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null)
  const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'empleado' })

  const cargarUsuariosSupabase = async () => {
    try {
      const data = await llamarFuncionUsuarios({ accion: 'listar' })
      setUsuariosSupabase(data.map((u) => ({ ...u, origen: 'supabase', protegido: u.rol === 'admin' })))
    } catch {
      // si quien mira la lista no es admin (ej. manager), la función responde 403 y listamos solo lo local
      setUsuariosSupabase([])
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    let cancelado = false
    llamarFuncionUsuarios({ accion: 'listar' })
      .then((data) => {
        if (cancelado) return
        setUsuariosSupabase(data.map((u) => ({ ...u, origen: 'supabase', protegido: u.rol === 'admin' })))
      })
      .catch(() => {
        if (!cancelado) setUsuariosSupabase([])
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })
    return () => {
      cancelado = true
    }
  }, [])

  // El super admin (rol "admin" en Supabase) solo se ve a sí mismo en la lista
  const usuariosVisibles = [
    ...usuariosLocales,
    ...usuariosSupabase.filter((u) => !u.protegido || u.id === usuarioActual.id),
  ]

  const abrirCrear = () => {
    setForm({ nombre: '', email: '', password: '', rol: 'empleado' })
    setModalForm('crear')
  }

  const abrirEditar = (usuario) => {
    setForm(usuario)
    setModalForm(usuario)
  }

  const handleEliminarClick = (usuario) => {
    if (usuario.protegido) {
      mostrarToast('Esta cuenta está protegida y no se puede eliminar', 'info')
      return
    }
    setUsuarioAEliminar(usuario)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (modalForm !== 'crear') {
        if (modalForm.origen === 'supabase') {
          await llamarFuncionUsuarios({ accion: 'editar', id: modalForm.id, ...form })
          await cargarUsuariosSupabase()
        } else {
          editarUsuario({ ...form, id: modalForm.id })
        }
        mostrarToast('Usuario actualizado correctamente')
      } else {
        await llamarFuncionUsuarios({ accion: 'crear', ...form })
        await cargarUsuariosSupabase()
        mostrarToast('Usuario creado correctamente')
      }
      setModalForm(null)
    } catch (error) {
      mostrarToast(error.message, 'info')
    }
  }

  const confirmarEliminar = async () => {
    try {
      if (usuarioAEliminar.origen === 'supabase') {
        await llamarFuncionUsuarios({ accion: 'eliminar', id: usuarioAEliminar.id })
        await cargarUsuariosSupabase()
      } else {
        eliminarUsuario(usuarioAEliminar.id)
      }
      mostrarToast('Usuario eliminado', 'info')
    } catch (error) {
      mostrarToast(error.message, 'info')
    } finally {
      setUsuarioAEliminar(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Usuarios</h1>
        <button
          onClick={abrirCrear}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90"
        >
          + Nuevo usuario
        </button>
      </div>

      {!cargando && usuariosVisibles.length === 0 ? (
        <EmptyState mensaje="No hay usuarios registrados todavía." />
      ) : (
        <div className="flex flex-col gap-3">
          {usuariosVisibles.map((usuario) => (
            <UserCard
              key={`${usuario.origen ?? 'local'}-${usuario.id}`}
              usuario={usuario}
              onEditar={abrirEditar}
              onEliminar={handleEliminarClick}
            />
          ))}
        </div>
      )}

      {modalForm && (
        <Modal
          titulo={modalForm === 'crear' ? 'Nuevo usuario' : 'Editar usuario'}
          onClose={() => setModalForm(null)}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                <User className="w-4 h-4" />
              </span>
              <input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
                placeholder="Nombre y apellido"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 dark:bg-gray-700 dark:text-gray-100 text-sm"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                placeholder="Email"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 dark:bg-gray-700 dark:text-gray-100 text-sm"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                value={form.password || ''}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required={modalForm === 'crear'}
                placeholder={modalForm === 'crear' ? 'Contraseña' : 'Nueva contraseña (opcional)'}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 dark:bg-gray-700 dark:text-gray-100 text-sm"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                <Shield className="w-4 h-4" />
              </span>
              <select
                value={form.rol}
                onChange={(e) => setForm({ ...form, rol: e.target.value })}
                disabled={modalForm !== 'crear' && modalForm.protegido}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 dark:bg-gray-700 dark:text-gray-100 text-sm capitalize disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {rolesDisponibles.map((r) => (
                  <option key={r} value={r} className="capitalize">
                    {r}
                  </option>
                ))}
              </select>
            </div>
            {modalForm !== 'crear' && modalForm.protegido && (
              <p className="text-xs text-gray-400">Esta cuenta está protegida: el rol no se puede cambiar.</p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalForm(null)}
                className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-gradient-to-b from-accent to-primary text-white font-medium shadow hover:brightness-105 transition"
              >
                Guardar
              </button>
            </div>
          </form>
        </Modal>
      )}

      {usuarioAEliminar && (
        <Modal titulo="Confirmar eliminación" onClose={() => setUsuarioAEliminar(null)}>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            ¿Seguro que querés eliminar a <strong>{usuarioAEliminar.nombre}</strong>?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setUsuarioAEliminar(null)}
              className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              onClick={confirmarEliminar}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
