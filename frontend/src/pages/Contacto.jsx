import { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { useToast } from '../context/ToastContext'

const infoContacto = [
  { icon: Mail, texto: 'hola@viverotakumi.com' },
  { icon: Phone, texto: '(011) 4567-8900' },
  { icon: MapPin, texto: 'Ruta 8 km 45, Buenos Aires' },
]

const codificarFormulario = (data) =>
  Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&')

export default function Contacto() {
  const { mostrarToast } = useToast()
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' })
  const [botField, setBotField] = useState('')
  const [enviando, setEnviando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (botField) {
      setForm({ nombre: '', email: '', mensaje: '' })
      mostrarToast('¡Gracias! Te vamos a responder a la brevedad.')
      return
    }

    setEnviando(true)
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: codificarFormulario({ 'form-name': 'contacto', ...form, 'bot-field': botField }),
      })
      mostrarToast('¡Gracias! Te vamos a responder a la brevedad.')
      setForm({ nombre: '', email: '', mensaje: '' })
    } catch {
      mostrarToast('No pudimos enviar tu mensaje, intentá de nuevo.', 'error')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="text-center max-w-xl mx-auto flex flex-col gap-3">
        <span className="inline-flex self-center bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full">
          Contacto
        </span>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">¿En qué te podemos ayudar?</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Escribinos por el formulario o por cualquiera de nuestros canales y te respondemos a la brevedad.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 flex flex-col gap-4"
        >
          <input
            type="text"
            name="bot-field"
            value={botField}
            onChange={(e) => setBotField(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] w-0 h-0 opacity-0"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
            <input
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mensaje</label>
            <textarea
              value={form.mensaje}
              onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
              required
              rows={4}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button
            type="submit"
            disabled={enviando}
            className="bg-primary text-white rounded-full py-2.5 font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Send className="w-4 h-4" />
            {enviando ? 'Enviando...' : 'Enviar mensaje'}
          </button>
        </form>

        <div className="flex flex-col gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 flex flex-col gap-4">
            {infoContacto.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.texto} className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">{item.texto}</span>
                </div>
              )
            })}
          </div>
          <img
            src="https://images.unsplash.com/photo-1558603668-6570496b66f8?w=700"
            alt="Vivero Takumi"
            className="w-full h-48 object-cover rounded-2xl"
          />
        </div>
      </div>
    </div>
  )
}
