import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import PlantaCardMinimal from '../../components/PlantaCardMinimal'
import FiltrosCatalogo from '../../components/FiltrosCatalogo'
import EmptyState from '../../components/EmptyState'

const filtrosIniciales = { busqueda: '', categoria: '', dificultad: '', precioMax: 10000 }

// Catálogo de plantas, navegable y comprable sin necesidad de login
export default function Catalogo() {
  const { plantas, categorias } = useData()
  const [searchParams] = useSearchParams()
  const [filtros, setFiltros] = useState({
    ...filtrosIniciales,
    categoria: searchParams.get('categoria') || '',
  })

  const plantasFiltradas = plantas.filter((planta) => {
    if (planta.habilitada === false) return false
    const coincideBusqueda = planta.nombre
      .toLowerCase()
      .includes(filtros.busqueda.toLowerCase())
    const coincideCategoria = !filtros.categoria || planta.categoria === filtros.categoria
    const coincideDificultad = !filtros.dificultad || planta.dificultad === filtros.dificultad
    const coincidePrecio = planta.precio <= filtros.precioMax
    return coincideBusqueda && coincideCategoria && coincideDificultad && coincidePrecio
  })

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Catálogo de plantas</h1>

      <FiltrosCatalogo filtros={filtros} onChange={setFiltros} categorias={categorias} />

      {plantasFiltradas.length === 0 ? (
        <EmptyState mensaje="No encontramos plantas que coincidan con tu búsqueda." />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 sm:gap-x-5 gap-y-6 sm:gap-y-8">
          {plantasFiltradas.map((planta) => (
            <PlantaCardMinimal key={planta.id} planta={planta} />
          ))}
        </div>
      )}
    </div>
  )
}
