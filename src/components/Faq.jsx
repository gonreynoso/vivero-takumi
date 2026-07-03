import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'

const faqItemsDefault = [
  {
    id: 'faq-1',
    pregunta: '¿Cómo se cuidan las plantas que compro?',
    respuesta:
      'Cada planta incluye su propia guía de cuidado con riego, luz, temperatura y tips, disponible en su página de detalle dentro del catálogo.',
  },
  {
    id: 'faq-2',
    pregunta: '¿Cuánto tarda el envío?',
    respuesta:
      'Los envíos a domicilio demoran entre 2 y 5 días hábiles según la zona, y las plantas viajan protegidas para llegar en perfecto estado.',
  },
  {
    id: 'faq-3',
    pregunta: '¿Qué pasa si mi planta llega dañada?',
    respuesta:
      'Todas nuestras plantas están garantizadas: si llega con algún problema, la reponemos sin cargo dentro de las 48hs de recibida.',
  },
  {
    id: 'faq-4',
    pregunta: '¿Puedo ver el estado de mi pedido?',
    respuesta:
      'Sí, iniciando sesión con tu cuenta podés ver el historial completo de tus pedidos y su estado actual en "Mis compras".',
  },
  {
    id: 'faq-5',
    pregunta: '¿Qué medios de pago aceptan?',
    respuesta:
      'Aceptamos tarjetas de crédito y débito, transferencia bancaria y efectivo al momento de la entrega.',
  },
  {
    id: 'faq-6',
    pregunta: '¿Hacen asesoramiento para elegir la planta correcta?',
    respuesta:
      'Sí, podés contactarnos por los medios que figuran en el pie de página y te ayudamos a elegir la planta ideal según luz, espacio y experiencia.',
  },
]

export default function Faq({
  heading = 'Preguntas frecuentes',
  description = '¿Tenés dudas sobre tu pedido, el cuidado de tus plantas o los envíos? Acá respondemos las consultas más comunes.',
  items = faqItemsDefault,
}) {
  const { hash } = useLocation()
  const idDesdeHash = hash.replace('#', '')
  const [abierto, setAbierto] = useState(() => {
    const item = items.find((i) => i.id === idDesdeHash)
    return item?.id ?? (idDesdeHash === 'faq' ? null : items[0]?.id ?? null)
  })

  useEffect(() => {
    if (!idDesdeHash) return

    const item = items.find((i) => i.id === idDesdeHash)
    if (item) setAbierto(item.id)

    const delay = item ? 320 : 80
    const timeout = setTimeout(() => {
      const elemento = document.getElementById(idDesdeHash)
      if (!elemento) return
      elemento.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, delay)

    return () => clearTimeout(timeout)
  }, [idDesdeHash, items])

  return (
    <section id="faq" className="scroll-mt-24">
      <div className="flex flex-col text-center gap-3 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{heading}</h2>
        <p className="text-gray-500 dark:text-gray-400">{description}</p>
      </div>

      <div className="w-full flex flex-col divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm dark:shadow-none">
        {items.map((item) => {
          const estaAbierto = abierto === item.id
          return (
            <div key={item.id} id={item.id} className="px-5 scroll-mt-24">
              <button
                onClick={() => setAbierto(estaAbierto ? null : item.id)}
                className="w-full flex items-center justify-between gap-4 py-4 text-left font-medium text-gray-800 dark:text-gray-100 hover:opacity-70 transition-opacity"
              >
                {item.pregunta}
                <ChevronDown
                  size={18}
                  className={`flex-shrink-0 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
                    estaAbierto ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ${
                  estaAbierto ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-gray-500 dark:text-gray-400 text-sm pb-4 pr-8">{item.respuesta}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
