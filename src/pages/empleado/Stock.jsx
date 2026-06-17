import { useState } from 'react'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import Badge from '../../components/Badge'
import EmptyState from '../../components/EmptyState'

// Catálogo completo con stock real, el empleado puede actualizar las cantidades
export default function Stock() {
  const { plantas, actualizarStock } = useData()
  const { mostrarToast } = useToast()
  const [valores, setValores] = useState({})

  const handleGuardar = async (planta) => {
    const nuevoStock = Number(valores[planta.id] ?? planta.stock)
    try {
      await actualizarStock(planta.id, nuevoStock)
      mostrarToast(`Stock de ${planta.nombre} actualizado a ${nuevoStock}`)
    } catch {
      mostrarToast('No se pudo actualizar el stock', 'info')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-800">Stock del catálogo</h1>

      {plantas.length === 0 ? (
        <EmptyState mensaje="No hay plantas en el catálogo." />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-background text-gray-600 text-left">
              <tr>
                <th className="px-4 py-3">Planta</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3">Stock actual</th>
                <th className="px-4 py-3">Nuevo stock</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {plantas.map((planta) => (
                <tr key={planta.id}>
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={planta.imagen}
                      alt={planta.nombre}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    {planta.nombre}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{planta.categoria}</td>
                  <td className="px-4 py-3">
                    <Badge color={planta.stock === 0 ? 'rojo' : planta.stock < 5 ? 'amarillo' : 'verde'}>
                      {planta.stock}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      defaultValue={planta.stock}
                      onChange={(e) =>
                        setValores((prev) => ({ ...prev, [planta.id]: e.target.value }))
                      }
                      className="w-24 border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleGuardar(planta)}
                      className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm hover:bg-primary/90"
                    >
                      Guardar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
