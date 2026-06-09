import { useSeries } from '../hooks/useSeries'
import { SeriesCard } from '../components/SeriesCard'
import { SeriesCardSkeleton } from '../components/SeriesCardSkeleton'
import { EmptyState } from '../components/EmptyState'
import { ErrorToast } from '../components/ErrorToast'

export function HomePage() {
  const { data: series, isLoading, isError, refetch } = useSeries()

  return (
    <div className="max-w-screen-xl mx-auto px-md py-lg">
      <h2 className="font-condensed text-headline-lg-mobile text-on-surface mb-lg">
        Series activas
      </h2>

      {isLoading && (
        <div className="grid grid-cols-1 gap-md sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SeriesCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && !isError && series?.length === 0 && (
        <EmptyState
          icon="playing_cards"
          message="El campeonato aún no tiene series. Ingresá como admin para configurarlo."
        />
      )}

      {!isLoading && !isError && series && series.length > 0 && (
        <div className="grid grid-cols-1 gap-md sm:grid-cols-2 xl:grid-cols-4">
          {series.map((serie) => (
            <SeriesCard key={serie.id} serie={serie} />
          ))}
        </div>
      )}

      {isError && (
        <ErrorToast
          message="No se pudo cargar las series. Intentá de nuevo."
          onRetry={refetch}
        />
      )}
    </div>
  )
}
