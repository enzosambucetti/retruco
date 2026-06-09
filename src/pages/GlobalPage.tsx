import { useGlobalStandings } from '../hooks/useGlobalStandings'
import { StandingsTable } from '../components/StandingsTable'
import { StandingsSkeleton } from '../components/StandingsSkeleton'
import { EmptyState } from '../components/EmptyState'
import { ErrorToast } from '../components/ErrorToast'
import type { StandingRow, GlobalStandingRow } from '../types'

export function GlobalPage() {
  const {
    data: standings,
    isLoading,
    isError,
    refetch,
  } = useGlobalStandings()

  return (
    <div className="max-w-screen-xl mx-auto px-md py-lg">
      <h2 className="font-condensed text-headline-lg-mobile text-on-surface mb-lg">
        Tabla Global
      </h2>

      {isLoading && <StandingsSkeleton />}

      {!isLoading && !isError && standings?.length === 0 && (
        <EmptyState
          icon="leaderboard"
          message="No hay datos en el campeonato aún."
        />
      )}

      {!isLoading && !isError && standings && standings.length > 0 && (
        <StandingsTable
          rows={standings as StandingRow[]}
          extraHeader={
            <th className="px-2 py-2 text-label-sm text-on-surface-variant font-semibold">
              Serie
            </th>
          }
          extraCell={(row) => (
            <td className="px-2 py-2 text-label-sm text-on-surface-variant">
              {(row as GlobalStandingRow).serie_nombre}
            </td>
          )}
        />
      )}

      {isError && (
        <ErrorToast
          message="No se pudo cargar la tabla global. Intentá de nuevo."
          onRetry={refetch}
        />
      )}
    </div>
  )
}
