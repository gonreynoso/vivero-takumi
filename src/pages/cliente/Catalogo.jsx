import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'
import PlantaCard from '../../components/PlantaCard'
import FiltrosCatalogo from '../../components/FiltrosCatalogo'
import EmptyState from '../../components/EmptyState'

const filtrosIniciales = { busqueda: '', categoria: '', dificultad: '', precioMax: 10000 }

// Catálogo de plantas, navegable y comprable sin necesidad de login
export default function Catalogo() {
  const { plantas } = useData()
  const { agregarAlCarrito } = useCart()
  const { mostrarToast } = useToast()
  const [searchParams] = useSearchParams()
  const [filtros, setFiltros] = useState({
    ...filtrosIniciales,
    categoria: searchParams.get('categoria') || '',
  })

  const plantasFiltradas = plantas.filter((planta) => {
    const coincideBusqueda = planta.nombre
      .toLowerCase()
      .includes(filtros.busqueda.toLowerCase())
    const coincideCategoria = !filtros.categoria || planta.categoria === filtros.categoria
    const coincideDificultad = !filtros.dificultad || planta.dificultad === filtros.dificultad
    const coincidePrecio = planta.precio <= filtros.precioMax
    return coincideBusqueda && coincideCategoria && coincideDificultad && coincidePrecio
  })

  const handleAgregar = (planta) => {
    agregarAlCarrito(planta)
    mostrarToast(`${planta.nombre} agregada al carrito`)
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-800">Catálogo de plantas</h1>

      <FiltrosCatalogo filtros={filtros} onChange={setFiltros} />

      {plantasFiltradas.length === 0 ? (
        <EmptyState mensaje="No encontramos plantas que coincidan con tu búsqueda." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {plantasFiltradas.map((planta) => (
            <PlantaCard key={planta.id} planta={planta} onAgregarCarrito={handleAgregar} />
          ))}
        </div>
      )}
    </div>
  )
}
