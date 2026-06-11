import { useNavigate } from 'react-router-dom'
import type { Serie } from '../types'

interface SerieHeaderProps {
  serie: Serie
  showBack?: boolean
}

export function SerieHeader({ serie, showBack = false }: SerieHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="bg-surface border-b border-outline-variant px-md py-sm">
      {showBack && (
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-xs text-primary text-label-sm font-semibold mb-xs active:scale-95 transition-transform"
          aria-label="Volver"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Volver
        </button>
      )}
      <h1 className="font-condensed text-headline-lg-mobile text-on-surface">
        {serie.nombre}
      </h1>
      <div className="flex flex-wrap gap-x-md gap-y-xs mt-xs">
        {serie.dia_juego && (
          <span className="text-label-sm text-on-surface-variant flex items-center gap-[2px]">
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            {serie.dia_juego}
          </span>
        )}
      </div>
    </div>
  )
}
