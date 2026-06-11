import { useNavigate } from 'react-router-dom'
import { useInView } from '../hooks/useInView'
import type { SerieConDetalles } from '../types'

interface SeriesCardProps {
  serie: SerieConDetalles
}

export function SeriesCard({ serie }: SeriesCardProps) {
  const navigate = useNavigate()
  const { ref, inView } = useInView()
  const parejasCount = serie.inscripciones.filter((i) => i.activa).length

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const animClass = reducedMotion
    ? 'opacity-100'
    : inView
      ? 'opacity-100 translate-y-0 transition-all duration-500 ease-out'
      : 'opacity-0 translate-y-4'

  function handleClick() {
    navigate(`/series/${serie.id}`)
  }

  return (
    <div
      ref={ref}
      className={`rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm hover:shadow-lg transition-shadow cursor-pointer active:scale-95 transition-transform ${animClass}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={`Ver posiciones de ${serie.nombre}`}
    >
      <div className="relative h-32 bg-gradient-to-br from-primary to-primary-container overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <span
          className="material-symbols-outlined absolute bottom-3 left-3 text-[48px] text-white/30"
          aria-hidden="true"
        >
          playing_cards
        </span>
      </div>
      <div className="p-md space-y-xs">
        <h3 className="font-condensed text-headline-md text-on-surface leading-tight">
          {serie.nombre}
        </h3>
        <div className="flex flex-col gap-[2px]">
          {serie.dia_juego && (
            <p className="text-label-sm text-on-surface-variant uppercase tracking-wide">
              {serie.dia_juego}
            </p>
          )}
          <p className="text-label-sm text-on-surface-variant">
            {parejasCount} {parejasCount === 1 ? 'pareja' : 'parejas'} inscriptas
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleClick()
          }}
          className="mt-xs w-full h-10 rounded-full bg-primary text-on-primary font-condensed text-label-sm uppercase tracking-widest active:scale-95 transition-transform hover:bg-primary-container hover:text-on-primary-container"
        >
          Ver Posiciones
        </button>
      </div>
    </div>
  )
}
