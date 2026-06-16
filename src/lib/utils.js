// Combina clases de Tailwind condicionalmente, filtrando valores falsy
export function cn(...clases) {
  return clases.filter(Boolean).join(' ')
}
