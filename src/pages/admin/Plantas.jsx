import { useState } from 'react'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import PlantaFila from '../../components/PlantaFila'
import PlantaForm from '../../components/PlantaForm'
import Modal from '../../components/Modal'
import EmptyState from '../../components/EmptyState'
import Paginador from '../../components/Paginador'

const POR_PAGINA = 8

// CRUD completo de plantas para el admin
export default function Plantas() {
  const {
    plantas,
    categorias,
    cargandoPlantas,
    agregarPlanta,
    editarPlanta,
    eliminarPlanta,
    toggleHabilitada,
  } = useData()
  const { mostrarToast } = useToast()
  const [modalForm, setModalForm] = useState(null) // null | 'crear' | planta a editar
  const [plantaAEliminar, setPlantaAEliminar] = useState(null)
  const [pagina, setPagina] = useState(1)

  const totalPaginas = Math.max(1, Math.ceil(plantas.length / POR_PAGINA))
  const plantasPagina = plantas.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  const handleGuardar = async (datos) => {
    try {
      if (modalForm && modalForm !== 'crear') {
        await editarPlanta({ ...datos, id: modalForm.id })
        mostrarToast('Planta actualizada correctamente')
      } else {
        await agregarPlanta(datos)
        mostrarToast('Planta creada correctamente')
      }
      setModalForm(null)
    } catch {
      mostrarToast('No se pudo guardar la planta', 'info')
    }
  }

  const handleToggleHabilitada = async (planta) => {
    try {
      await toggleHabilitada(planta.id)
      mostrarToast(
        planta.habilitada === false ? 'Planta habilitada' : 'Planta deshabilitada',
        'info'
      )
    } catch {
      mostrarToast('No se pudo actualizar la planta', 'info')
    }
  }

  const confirmarEliminar = async () => {
    try {
      await eliminarPlanta(plantaAEliminar.id)
      mostrarToast('Planta eliminada', 'info')
    } catch {
      mostrarToast('No se pudo eliminar la planta', 'info')
    } finally {
      setPlantaAEliminar(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Plantas</h1>
        <button
          onClick={() => setModalForm('crear')}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90"
        >
          + Nueva planta
        </button>
      </div>

      {cargandoPlantas ? (
        <p className="text-sm text-gray-400 dark:text-gray-500">Cargando plantas...</p>
      ) : plantas.length === 0 ? (
        <EmptyState mensaje="Todavía no hay plantas cargadas en el vivero." />
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {plantasPagina.map((planta) => (
              <PlantaFila
                key={planta.id}
                planta={planta}
                onToggleHabilitada={handleToggleHabilitada}
                onEditar={setModalForm}
                onEliminar={setPlantaAEliminar}
              />
            ))}
          </div>
          <Paginador paginaActual={pagina} totalPaginas={totalPaginas} onCambiar={setPagina} />
        </>
      )}

      {modalForm && (
        <Modal
          titulo={modalForm === 'crear' ? 'Nueva planta' : 'Editar planta'}
          onClose={() => setModalForm(null)}
          ancho="lg"
        >
          <PlantaForm
            plantaInicial={modalForm !== 'crear' ? modalForm : null}
            categorias={categorias}
            onGuardar={handleGuardar}
            onCancelar={() => setModalForm(null)}
          />
        </Modal>
      )}

      {plantaAEliminar && (
        <Modal titulo="Confirmar eliminación" onClose={() => setPlantaAEliminar(null)}>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            ¿Seguro que querés eliminar <strong>{plantaAEliminar.nombre}</strong>? Esta
            acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setPlantaAEliminar(null)}
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
