import { useNavigate } from 'react-router-dom'
import type { JornadaConCount } from '../types'

interface JornadaCardProps {
  jornada: JornadaConCount
  serieId: string
}

function formatFecha(fechaStr: string): string {
  const [year, month, day] = fechaStr.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('es-UY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function JornadaCard({ jornada, serieId }: JornadaCardProps) {
  const navigate = useNavigate()

  function handleClick() {
    navigate(`/series/${serieId}/jornadas/${jornada.id}`)
  }

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center justify-between px-md py-sm bg-surface-container-lowest rounded-lg border border-outline-variant active:scale-95 hover:bg-surface-container-low transition-all text-left"
    >
      <div className="flex flex-col gap-[2px]">
        <span className="font-condensed text-headline-md text-on-surface">
          Jornada {jornada.numero}
        </span>
        <span className="text-body-md text-on-surface-variant capitalize">
          {formatFecha(jornada.fecha)}
        </span>
        <span className="text-label-sm text-on-surface-variant">
          {jornada.partidos.length}{' '}
          {jornada.partidos.length === 1 ? 'partido' : 'partidos'}
        </span>
      </div>
      <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
    </button>
  )
}
