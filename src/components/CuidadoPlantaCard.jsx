import { useState } from 'react'
import { CheckCircle2, Droplet, Sun } from 'lucide-react'
import { diasDesde, diasEntreRiegos, obtenerUltimoRiego, registrarRiego } from '../lib/riego'

// Tarjeta de seguimiento de riego de una planta comprada: estima cada cuántos días
// regarla según su guía de cuidado y deja registrar "la regué hoy" (persiste en localStorage).
export default function CuidadoPlantaCard({ planta, email }) {
  const [ultimoRiego, setUltimoRiego] = useState(() => obtenerUltimoRiego(email, planta.id))

  const frecuencia = diasEntreRiegos(planta.guia_cuidado?.riego)
  const diasTranscurridos = ultimoRiego ? diasDesde(ultimoRiego) : null
  const necesitaRiego = diasTranscurridos === null || diasTranscurridos >= frecuencia

  const handleRegar = () => setUltimoRiego(registrarRiego(email, planta.id))

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-4 sm:items-center">
      <img
        src={planta.imagen}
        alt={planta.nombre}
        className="w-full sm:w-20 h-32 sm:h-20 rounded-xl object-cover shrink-0"
      />
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <h3 className="font-semibold text-gray-800">{planta.nombre}</h3>
        <p className="text-xs text-gray-500 flex items-center gap-1.5">
          <Droplet className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          {planta.guia_cuidado?.riego || 'Sin datos de riego'}
        </p>
        <p className="text-xs text-gray-500 flex items-center gap-1.5">
          <Sun className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
          {planta.guia_cuidado?.luz || 'Sin datos de luz'}
        </p>
        <p className={`text-sm font-medium ${necesitaRiego ? 'text-red-500' : 'text-green-600'}`}>
          {ultimoRiego
            ? `Regada hace ${diasTranscurridos} día${diasTranscurridos === 1 ? '' : 's'}`
            : 'Todavía no registraste el riego'}
          {!necesitaRiego && ` · próximo riego en ${frecuencia - diasTranscurridos} día(s)`}
          {necesitaRiego && ultimoRiego && ' · ¡le toca agua!'}
        </p>
      </div>
      <button
        onClick={handleRegar}
        className="flex items-center justify-center gap-1.5 text-sm bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary/90 shrink-0"
      >
        <CheckCircle2 className="w-4 h-4" />
        Regué hoy
      </button>
    </div>
  )
}
