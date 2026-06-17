import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import PlantaCard from '../../components/PlantaCard'
import PlantaForm from '../../components/PlantaForm'
import Modal from '../../components/Modal'
import EmptyState from '../../components/EmptyState'

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
        <h1 className="text-2xl font-bold text-gray-800">Plantas</h1>
        <button
          onClick={() => setModalForm('crear')}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90"
        >
          + Nueva planta
        </button>
      </div>

      {cargandoPlantas ? (
        <p className="text-sm text-gray-400">Cargando plantas...</p>
      ) : plantas.length === 0 ? (
        <EmptyState mensaje="Todavía no hay plantas cargadas en el vivero." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {plantas.map((planta) => (
            <PlantaCard
              key={planta.id}
              planta={planta}
              acciones={
                <div className="flex flex-col gap-2 flex-1">
                  <button
                    onClick={() => handleToggleHabilitada(planta)}
                    className="flex items-center justify-center gap-1.5 border border-gray-300 text-gray-600 rounded-lg py-2 text-sm font-medium hover:bg-gray-50"
                  >
                    {planta.habilitada === false ? (
                      <>
                        <Eye className="w-4 h-4" />
                        Habilitar
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4" />
                        Deshabilitar
                      </>
                    )}
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setModalForm(planta)}
                      className="flex-1 border border-primary text-primary rounded-lg py-2 text-sm font-medium hover:bg-primary/5"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setPlantaAEliminar(planta)}
                      className="flex-1 border border-red-500 text-red-500 rounded-lg py-2 text-sm font-medium hover:bg-red-50"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              }
            />
          ))}
        </div>
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
          <p className="text-gray-600 mb-6">
            ¿Seguro que querés eliminar <strong>{plantaAEliminar.nombre}</strong>? Esta
            acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setPlantaAEliminar(null)}
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
