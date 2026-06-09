import { useQuery } from '@tanstack/react-query'
import { getStandings } from '../lib/queries'

export function useStandings(serieId: string) {
  return useQuery({
    queryKey: ['standings', serieId],
    queryFn: () => getStandings(serieId),
    enabled: !!serieId,
  })
}
