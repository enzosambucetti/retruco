import { useNavigate, useParams } from 'react-router-dom'
import { useJornadaDetail } from '../hooks/useJornadaDetail'
import { MatchResultRow } from '../components/MatchResultRow'
import { EmptyState } from '../components/EmptyState'
import { ErrorToast } from '../components/ErrorToast'

function formatFecha(fechaStr: string): string {
  const [year, month, day] = fechaStr.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('es-UY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function JornadaPage() {
  const { jornada_id } = useParams<{ id: string; jornada_id: string }>()
  const navigate = useNavigate()
  const { jornada, partidos } = useJornadaDetail(jornada_id ?? '')

  const isLoading = jornada.isLoading || partidos.isLoading
  const isError = jornada.isError || partidos.isError

  return (
    <div>
      <div className="bg-surface border-b border-outline-variant px-md py-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-xs text-primary text-label-sm font-semibold mb-xs active:scale-95 transition-transform"
          aria-label="Volver"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Volver
        </button>
        {jornada.data ? (
          <>
            <h1 className="font-condensed text-headline-lg-mobile text-on-surface">
              Jornada {jornada.data.numero}
            </h1>
            <p className="text-body-md text-on-surface-variant capitalize">
              {formatFecha(jornada.data.fecha)}
            </p>
          </>
        ) : (
          <div className="h-12 bg-surface-container-low animate-pulse rounded" />
        )}
      </div>

      <div className="px-md py-lg max-w-screen-xl mx-auto">
        {isLoading && (
          <div className="space-y-sm animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 bg-surface-container-low rounded" />
            ))}
          </div>
        )}

        {!isLoading && !isError && partidos.data?.length === 0 && (
          <EmptyState
            icon="sports_score"
            message="No se cargaron partidos para esta jornada."
          />
        )}

        {!isLoading && !isError && partidos.data && partidos.data.length > 0 && (
          <div>
            {partidos.data.map((partido) => (
              <MatchResultRow key={partido.id} partido={partido} />
            ))}
          </div>
        )}

        {isError && (
          <ErrorToast
            message="No se pudo cargar la jornada. Intentá de nuevo."
            onRetry={() => {
              void jornada.refetch()
              void partidos.refetch()
            }}
          />
        )}
      </div>
    </div>
  )
}
