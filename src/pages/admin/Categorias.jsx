import { useState } from 'react'
import { Check, Pencil, Plus, Tag, Trash2, X } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import EmptyState from '../../components/EmptyState'

// Gestión de categorías de plantas: crear, renombrar (con cascada a las plantas que la usan) y eliminar
export default function Categorias() {
  const { categorias, plantas, cargandoPlantas, agregarCategoria, editarCategoria, eliminarCategoria } =
    useData()
  const { mostrarToast } = useToast()
  const [nueva, setNueva] = useState('')
  const [editando, setEditando] = useState(null)
  const [valorEdicion, setValorEdicion] = useState('')

  const contarPlantas = (categoria) => plantas.filter((p) => p.categoria === categoria).length

  const handleAgregar = async (e) => {
    e.preventDefault()
    const nombre = nueva.trim()
    if (!nombre) return
    if (categorias.includes(nombre)) {
      mostrarToast('Esa categoría ya existe', 'info')
      return
    }
    try {
      await agregarCategoria(nombre)
      setNueva('')
      mostrarToast('Categoría creada correctamente')
    } catch {
      mostrarToast('No se pudo crear la categoría', 'info')
    }
  }

  const iniciarEdicion = (categoria) => {
    setEditando(categoria)
    setValorEdicion(categoria)
  }

  const guardarEdicion = async () => {
    const nombre = valorEdicion.trim()
    if (!nombre || nombre === editando) {
      setEditando(null)
      return
    }
    if (categorias.includes(nombre)) {
      mostrarToast('Ya existe una categoría con ese nombre', 'info')
      return
    }
    try {
      await editarCategoria(editando, nombre)
      mostrarToast('Categoría actualizada correctamente')
      setEditando(null)
    } catch {
      mostrarToast('No se pudo actualizar la categoría', 'info')
    }
  }

  const handleEliminar = async (categoria) => {
    const cantidad = contarPlantas(categoria)
    if (cantidad > 0) {
      mostrarToast(`No se puede eliminar: ${cantidad} planta(s) usan esta categoría`, 'info')
      return
    }
    try {
      await eliminarCategoria(categoria)
      mostrarToast('Categoría eliminada', 'info')
    } catch {
      mostrarToast('No se pudo eliminar la categoría', 'info')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Categorías</h1>

      <form onSubmit={handleAgregar} className="flex gap-3">
        <input
          value={nueva}
          onChange={(e) => setNueva(e.target.value)}
          placeholder="Nueva categoría (ej: Bonsái)"
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent bg-white dark:bg-gray-700 dark:text-gray-100"
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          Agregar
        </button>
      </form>

      {cargandoPlantas ? (
        <p className="text-sm text-gray-400 dark:text-gray-500">Cargando categorías...</p>
      ) : categorias.length === 0 ? (
        <EmptyState mensaje="Todavía no hay categorías creadas." />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          {categorias.map((categoria) => (
            <div key={categoria} className="flex items-center gap-3 px-5 py-3.5">
              <Tag className="w-4 h-4 text-accent shrink-0" />

              {editando === categoria ? (
                <>
                  <input
                    autoFocus
                    value={valorEdicion}
                    onChange={(e) => setValorEdicion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && guardarEdicion()}
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-white dark:bg-gray-700 dark:text-gray-100"
                  />
                  <button onClick={guardarEdicion} className="text-primary hover:text-primary/70" aria-label="Guardar">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditando(null)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" aria-label="Cancelar">
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-gray-700 dark:text-gray-200">{categoria}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {contarPlantas(categoria)} {contarPlantas(categoria) === 1 ? 'planta' : 'plantas'}
                  </span>
                  <button
                    onClick={() => iniciarEdicion(categoria)}
                    className="text-gray-400 dark:text-gray-500 hover:text-primary"
                    aria-label="Renombrar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEliminar(categoria)}
                    className="text-gray-400 dark:text-gray-500 hover:text-red-500"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
