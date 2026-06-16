import { useState } from 'react'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import UserCard from '../../components/UserCard'
import Modal from '../../components/Modal'
import EmptyState from '../../components/EmptyState'

const rolesDisponibles = ['admin', 'empleado', 'cliente']

// CRUD de usuarios/empleados, exclusivo del admin
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

  const handleSubmit = (e) => {
    e.preventDefault()
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

      {usuarios.length === 0 ? (
        <EmptyState mensaje="No hay usuarios registrados todavía." />
      ) : (
        <div className="flex flex-col gap-3">
          {usuarios.map((usuario) => (
            <UserCard
              key={usuario.id}
              usuario={usuario}
              onEditar={abrirEditar}
              onEliminar={setUsuarioAEliminar}
            />
          ))}
        </div>
      )}

      {modalForm && (
        <Modal
          titulo={modalForm === 'crear' ? 'Nuevo usuario' : 'Editar usuario'}
          onClose={() => setModalForm(null)}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <select
                value={form.rol}
                onChange={(e) => setForm({ ...form, rol: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {rolesDisponibles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

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
                className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90"
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
