import { useState } from 'react'
import { Lock, Mail, Shield, User } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import UserCard from '../../components/UserCard'
import Modal from '../../components/Modal'
import EmptyState from '../../components/EmptyState'

const rolesDisponibles = ['admin', 'manager', 'empleado', 'cliente']

// CRUD de usuarios, todo contra el array local en DataContext (sin backend).
export default function Usuarios() {
  const { usuarios, agregarUsuario, editarUsuario, eliminarUsuario } = useData()
  const { mostrarToast } = useToast()

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
    if (usuario.rol === 'admin') {
      mostrarToast('Esta cuenta está protegida y no se puede eliminar', 'info')
      return
    }
    setUsuarioAEliminar(usuario)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      if (modalForm !== 'crear') {
        editarUsuario({ ...form, id: modalForm.id })
        mostrarToast('Usuario actualizado correctamente')
      } else {
        agregarUsuario(form)
        mostrarToast('Usuario creado correctamente')
      }
      setModalForm(null)
    } catch (error) {
      mostrarToast(error.message, 'info')
    }
  }

  const confirmarEliminar = () => {
    eliminarUsuario(usuarioAEliminar.id)
    mostrarToast('Usuario eliminado', 'info')
    setUsuarioAEliminar(null)
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

      {usuarios.length === 0 ? (
        <EmptyState mensaje="No hay usuarios registrados todavía." />
      ) : (
        <div className="flex flex-col gap-3">
          {usuarios.map((usuario) => (
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
                disabled={modalForm !== 'crear' && modalForm.rol === 'admin'}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 dark:bg-gray-700 dark:text-gray-100 text-sm capitalize disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {rolesDisponibles.map((r) => (
                  <option key={r} value={r} className="capitalize">
                    {r}
                  </option>
                ))}
              </select>
            </div>
            {modalForm !== 'crear' && modalForm.rol === 'admin' && (
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
