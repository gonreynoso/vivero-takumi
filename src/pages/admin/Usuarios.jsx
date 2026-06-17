import { useState } from 'react'
import { Lock, Mail, Shield, User } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import UserCard from '../../components/UserCard'
import Modal from '../../components/Modal'
import EmptyState from '../../components/EmptyState'

const rolesDisponibles = ['admin', 'manager', 'empleado', 'cliente']
const EMAIL_SUPER_ADMIN = 'gonzalo.reynoso9@gmail.com'

// CRUD de usuarios/empleados, exclusivo del admin
export default function Usuarios() {
  const { usuarios, agregarUsuario, editarUsuario, eliminarUsuario } = useData()
  const { usuario: usuarioActual } = useAuth()
  const { mostrarToast } = useToast()
  // El super admin protegido solo se ve a sí mismo en la lista; para cualquier otra cuenta es invisible
  const usuariosVisibles = usuarios.filter((u) => !u.protegido || u.id === usuarioActual.id)
  const [modalForm, setModalForm] = useState(null) // null | 'crear' | usuario a editar
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null)
  const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'empleado' })

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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.email.toLowerCase() === EMAIL_SUPER_ADMIN) {
      mostrarToast('Ese email pertenece a la cuenta protegida, usá otro', 'info')
      return
    }
    if (modalForm !== 'crear') {
      editarUsuario({ ...form, id: modalForm.id })
      mostrarToast('Usuario actualizado correctamente')
    } else {
      agregarUsuario(form)
      mostrarToast('Usuario creado correctamente')
    }
    setModalForm(null)
  }

  const confirmarEliminar = () => {
    eliminarUsuario(usuarioAEliminar.id)
    mostrarToast('Usuario eliminado', 'info')
    setUsuarioAEliminar(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Usuarios</h1>
        <button
          onClick={abrirCrear}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90"
        >
          + Nuevo usuario
        </button>
      </div>

      {usuariosVisibles.length === 0 ? (
        <EmptyState mensaje="No hay usuarios registrados todavía." />
      ) : (
        <div className="flex flex-col gap-3">
          {usuariosVisibles.map((usuario) => (
            <UserCard
              key={usuario.id}
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
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <User className="w-4 h-4" />
              </span>
              <input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
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
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                placeholder="Email"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 text-sm"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                placeholder="Contraseña"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 text-sm"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Shield className="w-4 h-4" />
              </span>
              <select
                value={form.rol}
                onChange={(e) => setForm({ ...form, rol: e.target.value })}
                disabled={modalForm !== 'crear' && modalForm.protegido}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 text-sm capitalize disabled:opacity-60 disabled:cursor-not-allowed"
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
                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
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
          <p className="text-gray-600 mb-6">
            ¿Seguro que querés eliminar a <strong>{usuarioAEliminar.nombre}</strong>?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setUsuarioAEliminar(null)}
              className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
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
