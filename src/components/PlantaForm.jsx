import { useState } from 'react'
import { Boxes, DollarSign, FileText, Gauge, Image as ImageIcon, Sprout, Tag, Upload, X } from 'lucide-react'
import { convertirAWebp } from '../lib/imagenes'

const dificultades = ['fácil', 'media', 'difícil']
const MAX_IMAGENES_GALERIA = 4

function formatearKb(bytes) {
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

// Formulario para crear o editar una planta, usado dentro de un Modal
export default function PlantaForm({ plantaInicial, categorias, onGuardar, onCancelar }) {
  const [form, setForm] = useState(
    plantaInicial || {
      nombre: '',
      categoria: categorias[0] ?? '',
      precio: '',
      stock: '',
      imagen: '',
      imagenes: [],
      dificultad: dificultades[0],
      descripcion: '',
      guia_cuidado: { riego: '', luz: '', temperatura: '', tips: '' },
    }
  )
  const [errorImagen, setErrorImagen] = useState('')
  const [convirtiendoImagen, setConvirtiendoImagen] = useState(false)
  const [infoCompresion, setInfoCompresion] = useState(null)
  const [convirtiendoGaleria, setConvirtiendoGaleria] = useState(false)

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

  const handleArchivoImagen = async (e) => {
    const archivo = e.target.files[0]
    if (!archivo) return
    if (!archivo.type.startsWith('image/')) {
      setErrorImagen('El archivo debe ser una imagen')
      return
    }
    setErrorImagen('')
    setInfoCompresion(null)
    setConvirtiendoImagen(true)
    try {
      const { dataUrl, tamanoOriginal, tamanoFinal } = await convertirAWebp(archivo)
      setForm((prev) => ({ ...prev, imagen: dataUrl }))
      setInfoCompresion({ original: tamanoOriginal, final: tamanoFinal })
    } catch {
      setErrorImagen('No se pudo convertir la imagen, probá con otro archivo')
    } finally {
      setConvirtiendoImagen(false)
    }
  }

  const handleArchivoGaleria = async (e) => {
    const archivo = e.target.files[0]
    e.target.value = ''
    if (!archivo) return
    if (!archivo.type.startsWith('image/')) {
      setErrorImagen('El archivo debe ser una imagen')
      return
    }
    if ((form.imagenes || []).length >= MAX_IMAGENES_GALERIA) return
    setErrorImagen('')
    setConvirtiendoGaleria(true)
    try {
      const { dataUrl } = await convertirAWebp(archivo)
      setForm((prev) => ({ ...prev, imagenes: [...(prev.imagenes || []), dataUrl] }))
    } catch {
      setErrorImagen('No se pudo convertir la imagen, probá con otro archivo')
    } finally {
      setConvirtiendoGaleria(false)
    }
  }

  const quitarImagenGaleria = (indice) => {
    setForm((prev) => ({ ...prev, imagenes: prev.imagenes.filter((_, i) => i !== indice) }))
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
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
          <Sprout className="w-4 h-4" />
        </span>
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          placeholder="Nombre de la planta"
          className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 dark:bg-gray-700 dark:text-gray-100 text-sm"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <Tag className="w-4 h-4" />
          </span>
          <select
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 dark:bg-gray-700 dark:text-gray-100 text-sm"
          >
            {categorias.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <Gauge className="w-4 h-4" />
          </span>
          <select
            name="dificultad"
            value={form.dificultad}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 dark:bg-gray-700 dark:text-gray-100 text-sm"
          >
            {dificultades.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <DollarSign className="w-4 h-4" />
          </span>
          <input
            type="number"
            name="precio"
            value={form.precio}
            onChange={handleChange}
            min="0"
            required
            placeholder="Precio"
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 dark:bg-gray-700 dark:text-gray-100 text-sm"
          />
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <Boxes className="w-4 h-4" />
          </span>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            min="0"
            required
            placeholder="Stock"
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 dark:bg-gray-700 dark:text-gray-100 text-sm"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-24 h-24 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 overflow-hidden shrink-0 flex items-center justify-center">
          {form.imagen ? (
            <img src={form.imagen} alt="Vista previa" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-6 h-6 text-gray-300" />
          )}
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <input
            name="imagen"
            value={form.imagen}
            onChange={handleChange}
            required
            placeholder="URL de la imagen (https://...)"
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 dark:bg-gray-700 dark:text-gray-100 text-sm"
          />
          <label
            className={`flex items-center gap-1.5 text-xs w-fit ${
              convirtiendoImagen
                ? 'text-gray-300 cursor-wait'
                : 'text-gray-500 dark:text-gray-400 cursor-pointer hover:text-primary'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            {convirtiendoImagen ? 'Convirtiendo a WebP...' : 'o subí una imagen desde tu computadora'}
            <input
              type="file"
              accept="image/*"
              onChange={handleArchivoImagen}
              disabled={convirtiendoImagen}
              className="hidden"
            />
          </label>
          {infoCompresion && (
            <p className="text-xs text-accent">
              Convertida a WebP: {formatearKb(infoCompresion.original)} → {formatearKb(infoCompresion.final)}
            </p>
          )}
          {errorImagen && <p className="text-xs text-red-500">{errorImagen}</p>}
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-2">
          Galería adicional ({(form.imagenes || []).length}/{MAX_IMAGENES_GALERIA})
        </p>
        <div className="flex gap-2 flex-wrap">
          {(form.imagenes || []).map((img, i) => (
            <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
              <img src={img} alt={`Imagen ${i + 2}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => quitarImagenGaleria(i)}
                className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 text-white flex items-center justify-center"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
          {(form.imagenes || []).length < MAX_IMAGENES_GALERIA && (
            <label
              className={`w-16 h-16 rounded-lg border border-dashed border-gray-300 flex items-center justify-center ${
                convirtiendoGaleria ? 'text-gray-300 cursor-wait' : 'text-gray-400 cursor-pointer hover:text-primary hover:border-primary'
              }`}
            >
              <Upload className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleArchivoGaleria}
                disabled={convirtiendoGaleria}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      <div className="relative">
        <span className="absolute left-3 top-3 text-gray-400 dark:text-gray-500">
          <FileText className="w-4 h-4" />
        </span>
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          rows={2}
          required
          placeholder="Descripción"
          className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 dark:bg-gray-700 dark:text-gray-100 text-sm"
        />
      </div>

      <fieldset className="border border-gray-200 dark:border-gray-600 rounded-xl p-4">
        <legend className="text-sm font-medium text-gray-700 dark:text-gray-300 px-1">Guía de cuidado</legend>
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            name="riego"
            value={form.guia_cuidado.riego}
            onChange={handleGuiaChange}
            placeholder="Riego"
            required
            className="border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 dark:bg-gray-700 dark:text-gray-100 text-sm"
          />
          <input
            name="luz"
            value={form.guia_cuidado.luz}
            onChange={handleGuiaChange}
            placeholder="Luz"
            required
            className="border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 dark:bg-gray-700 dark:text-gray-100 text-sm"
          />
          <input
            name="temperatura"
            value={form.guia_cuidado.temperatura}
            onChange={handleGuiaChange}
            placeholder="Temperatura"
            required
            className="border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 dark:bg-gray-700 dark:text-gray-100 text-sm"
          />
          <input
            name="tips"
            value={form.guia_cuidado.tips}
            onChange={handleGuiaChange}
            placeholder="Tips"
            required
            className="border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 dark:bg-gray-700 dark:text-gray-100 text-sm"
          />
        </div>
      </fieldset>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancelar}
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
  )
}
