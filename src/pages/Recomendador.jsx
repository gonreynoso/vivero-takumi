import { useData } from '../context/DataContext'
import QuizRecomendador from '../components/QuizRecomendador'

// Página pública con el wizard que recomienda plantas según gustos y nivel de experiencia
export default function Recomendador() {
  const { plantas } = useData()

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Encontrá tu planta ideal</h1>
        <p className="text-sm text-gray-500">Respondé 4 preguntas y te sugerimos las mejores opciones del catálogo.</p>
      </div>

      <QuizRecomendador plantas={plantas} />
    </div>
  )
}
