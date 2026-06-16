import { useState } from 'react'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import PlantaCard from '../../components/PlantaCard'
import PlantaForm from '../../components/PlantaForm'
import Modal from '../../components/Modal'
import EmptyState from '../../components/EmptyState'

// CRUD completo de plantas para el admin
export default function Plantas() {
  const { plantas, agregarPlanta, editarPlanta, eliminarPlanta } = useData()
  const { mostrarToast } = useToast()
  const [modalForm, setModalForm] = useState(null) // null | 'crear' | planta a editar
  const [plantaAEliminar, setPlantaAEliminar] = useState(null)

  const handleGuardar = (datos) => {
    if (modalForm && modalForm !== 'crear') {
      editarPlanta({ ...datos, id: modalForm.id })
      mostrarToast('Planta actualizada correctamente')
    } else {
      agregarPlanta(datos)
      mostrarToast('Planta creada correctamente')
    }
    setModalForm(null)
  }

  const confirmarEliminar = () => {
    eliminarPlanta(plantaAEliminar.id)
    mostrarToast('Planta eliminada', 'info')
    setPlantaAEliminar(null)
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

      {plantas.length === 0 ? (
        <EmptyState mensaje="Todavía no hay plantas cargadas en el vivero." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {plantas.map((planta) => (
            <PlantaCard
              key={planta.id}
              planta={planta}
              acciones={
                <div className="flex gap-2 flex-1">
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
              }
            />
          ))}
        </div>
      )}

      {modalForm && (
        <Modal
          titulo={modalForm === 'crear' ? 'Nueva planta' : 'Editar planta'}
          onClose={() => setModalForm(null)}
        >
          <PlantaForm
            plantaInicial={modalForm !== 'crear' ? modalForm : null}
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
