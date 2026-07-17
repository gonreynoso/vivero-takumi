import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { preguntasRecomendador, recomendarPlantas } from '../data/quizRecomendador'
import PlantaCardMinimal from './PlantaCardMinimal'
import EmptyState from './EmptyState'

export default function QuizRecomendador({ plantas }) {
  const [paso, setPaso] = useState(0)
  const [respuestas, setRespuestas] = useState({})

  const terminado = paso >= preguntasRecomendador.length
  const preguntaActual = preguntasRecomendador[paso]

  const elegirOpcion = (idPregunta, valor) => {
    setRespuestas((prev) => ({ ...prev, [idPregunta]: valor }))
    setPaso((p) => p + 1)
  }

  const reiniciar = () => {
    setRespuestas({})
    setPaso(0)
  }

  if (terminado) {
    const recomendadas = recomendarPlantas(plantas, respuestas)
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Estas plantas son para vos</h2>
          <button
            onClick={reiniciar}
            className="flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <RotateCcw className="w-4 h-4" />
            Volver a empezar
          </button>
        </div>

        {recomendadas.length === 0 ? (
          <EmptyState mensaje="No encontramos una buena coincidencia, probá de nuevo." />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 sm:gap-x-5 gap-y-6">
            {recomendadas.map((planta) => (
              <PlantaCardMinimal key={planta.id} planta={planta} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
      <div className="flex items-center gap-2">
        {preguntasRecomendador.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i <= paso ? 'bg-primary' : 'bg-gray-100 dark:bg-gray-700'}`}
          />
        ))}
      </div>

      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{preguntaActual.pregunta}</h2>

      <div className="flex flex-col gap-3">
        {preguntaActual.opciones.map((opcion) => (
          <button
            key={opcion.valor}
            onClick={() => elegirOpcion(preguntaActual.id, opcion.valor)}
            className="text-left px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-primary hover:bg-primary/5 transition-colors text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            {opcion.label}
          </button>
        ))}
      </div>
    </div>
  )
}
