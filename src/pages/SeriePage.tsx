import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSerie } from '../hooks/useSerie'
import { useStandings } from '../hooks/useStandings'
import { useJornadas } from '../hooks/useJornadas'
import { SerieHeader } from '../components/SerieHeader'
import { StandingsTable } from '../components/StandingsTable'
import { StandingsSkeleton } from '../components/StandingsSkeleton'
import { JornadaCard } from '../components/JornadaCard'
import { EmptyState } from '../components/EmptyState'
import { ErrorToast } from '../components/ErrorToast'

type Tab = 'posiciones' | 'jornadas'

export function SeriePage() {
  const { id } = useParams<{ id: string }>()
  const [tab, setTab] = useState<Tab>('posiciones')

  const { data: serie, isLoading: loadingSerie } = useSerie(id ?? '')
  const {
    data: standings,
    isLoading: loadingStandings,
    isError: errorStandings,
    refetch: refetchStandings,
  } = useStandings(id ?? '')
  const {
    data: jornadas,
    isLoading: loadingJornadas,
    isError: errorJornadas,
    refetch: refetchJornadas,
  } = useJornadas(id ?? '')

  return (
    <div>
      {loadingSerie ? (
        <div className="h-20 bg-surface-container-low animate-pulse" />
      ) : (
        serie && <SerieHeader serie={serie} />
      )}

      <div className="flex border-b border-outline-variant bg-surface sticky top-14 z-40">
        {(['posiciones', 'jornadas'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-sm text-label-sm font-semibold uppercase tracking-wider transition-colors ${
              tab === t
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant'
            }`}
          >
            {t === 'posiciones' ? 'Posiciones' : 'Jornadas'}
          </button>
        ))}
      </div>

      <div className="px-md py-lg max-w-screen-xl mx-auto">
        {tab === 'posiciones' && (
          <>
            {loadingStandings && <StandingsSkeleton />}
            {!loadingStandings && !errorStandings && standings?.length === 0 && (
              <EmptyState
                icon="leaderboard"
                message="Todavía no hay parejas en esta serie."
              />
            )}
            {!loadingStandings && !errorStandings && standings && standings.length > 0 && (
              <StandingsTable rows={standings} />
            )}
            {errorStandings && (
              <ErrorToast
                message="No se pudo cargar la tabla. Intentá de nuevo."
                onRetry={refetchStandings}
              />
            )}
          </>
        )}

        {tab === 'jornadas' && (
          <>
            {loadingJornadas && (
              <div className="space-y-sm animate-pulse">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 bg-surface-container-low rounded-lg" />
                ))}
              </div>
            )}
            {!loadingJornadas && !errorJornadas && jornadas?.length === 0 && (
              <EmptyState
                icon="event"
                message="Todavía no hay jornadas en esta serie."
              />
            )}
            {!loadingJornadas && !errorJornadas && jornadas && jornadas.length > 0 && (
              <div className="space-y-sm">
                {jornadas.map((j) => (
                  <JornadaCard key={j.id} jornada={j} serieId={id ?? ''} />
                ))}
              </div>
            )}
            {errorJornadas && (
              <ErrorToast
                message="No se pudo cargar las jornadas. Intentá de nuevo."
                onRetry={refetchJornadas}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
