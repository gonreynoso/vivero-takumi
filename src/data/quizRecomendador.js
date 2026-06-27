// Preguntas del recomendador de plantas y la lógica de puntaje contra el catálogo
export const preguntasRecomendador = [
  {
    id: 'ubicacion',
    pregunta: '¿Dónde vas a poner la planta?',
    opciones: [
      { valor: 'interior', label: 'Adentro de casa' },
      { valor: 'exterior', label: 'Patio, balcón o jardín' },
    ],
  },
  {
    id: 'luz',
    pregunta: '¿Cuánta luz natural recibe ese lugar?',
    opciones: [
      { valor: 'poca', label: 'Poca luz' },
      { valor: 'indirecta', label: 'Luz indirecta' },
      { valor: 'sol', label: 'Sol directo varias horas' },
    ],
  },
  {
    id: 'experiencia',
    pregunta: '¿Cuánta experiencia tenés cuidando plantas?',
    opciones: [
      { valor: 'principiante', label: 'Soy principiante' },
      { valor: 'intermedio', label: 'Tengo algo de experiencia' },
      { valor: 'experto', label: 'Me considero experta/o' },
    ],
  },
  {
    id: 'proposito',
    pregunta: '¿Qué estás buscando?',
    opciones: [
      { valor: 'decorativa', label: 'Algo decorativo' },
      { valor: 'aromatica', label: 'Aromáticas para cocinar' },
      { valor: 'frutal', label: 'Frutales' },
    ],
  },
]

const categoriasPorProposito = {
  decorativa: ['Interior', 'Exterior', 'Suculentas'],
  aromatica: ['Aromáticas'],
  frutal: ['Frutales'],
}

// Heurística simple de puntaje: suma puntos por cada respuesta que coincide con la planta.
// No es una búsqueda exacta, es una recomendación orientativa basada en el catálogo hardcodeado.
function calcularPuntaje(planta, respuestas) {
  let puntaje = 0
  const luz = (planta.guia_cuidado?.luz || '').toLowerCase()

  if (respuestas.ubicacion === 'interior' && planta.categoria === 'Interior') puntaje += 3
  if (respuestas.ubicacion === 'exterior' && planta.categoria !== 'Interior') puntaje += 2

  if (respuestas.luz === 'poca' && (luz.includes('poca luz') || luz.includes('sombra'))) puntaje += 3
  if (respuestas.luz === 'indirecta' && luz.includes('indirecta')) puntaje += 3
  if (respuestas.luz === 'sol' && (luz.includes('pleno sol') || luz.includes('sol directo'))) puntaje += 3

  if (respuestas.experiencia === 'principiante' && planta.dificultad === 'fácil') puntaje += 3
  if (respuestas.experiencia === 'intermedio' && planta.dificultad !== 'difícil') puntaje += 2
  if (respuestas.experiencia === 'experto') puntaje += 1

  if (categoriasPorProposito[respuestas.proposito]?.includes(planta.categoria)) puntaje += 3

  return puntaje
}

export function recomendarPlantas(plantas, respuestas, cantidad = 4) {
  return plantas
    .filter((p) => p.habilitada !== false)
    .map((planta) => ({ planta, puntaje: calcularPuntaje(planta, respuestas) }))
    .sort((a, b) => b.puntaje - a.puntaje)
    .slice(0, cantidad)
    .map((r) => r.planta)
}
