import { useState } from 'react'
import { categorias } from '../data/categorias'

const dificultades = ['fácil', 'media', 'difícil']

// Formulario para crear o editar una planta, usado dentro de un Modal
export default function PlantaForm({ plantaInicial, onGuardar, onCancelar }) {
  const [form, setForm] = useState(
    plantaInicial || {
      nombre: '',
      categoria: categorias[0],
      precio: '',
      stock: '',
      imagen: '',
      dificultad: dificultades[0],
      descripcion: '',
      guia_cuidado: { riego: '', luz: '', temperatura: '', tips: '' },
    }
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleGuiaChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      guia_cuidado: { ...prev.guia_cuidado, [name]: value },
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onGuardar({
      ...form,
      precio: Number(form.precio),
      stock: Number(form.stock),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {categorias.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dificultad</label>
          <select
            name="dificultad"
            value={form.dificultad}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {dificultades.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
          <input
            type="number"
            name="precio"
            value={form.precio}
            onChange={handleChange}
            min="0"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            min="0"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Imagen (URL)</label>
        <input
          name="imagen"
          value={form.imagen}
          onChange={handleChange}
          required
          placeholder="https://images.unsplash.com/..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          rows={2}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <fieldset className="border border-gray-200 rounded-lg p-3">
        <legend className="text-sm font-medium text-gray-700 px-1">Guía de cuidado</legend>
        <div className="grid grid-cols-2 gap-3">
          <input
            name="riego"
            value={form.guia_cuidado.riego}
            onChange={handleGuiaChange}
            placeholder="Riego"
            required
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <input
            name="luz"
            value={form.guia_cuidado.luz}
            onChange={handleGuiaChange}
            placeholder="Luz"
            required
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <input
            name="temperatura"
            value={form.guia_cuidado.temperatura}
            onChange={handleGuiaChange}
            placeholder="Temperatura"
            required
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <input
            name="tips"
            value={form.guia_cuidado.tips}
            onChange={handleGuiaChange}
            placeholder="Tips"
            required
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </fieldset>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancelar}
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
  )
}
