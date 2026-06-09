import { useQuery } from '@tanstack/react-query'
import { getGlobalStandings } from '../lib/queries'

export function useGlobalStandings() {
  return useQuery({
    queryKey: ['global-standings'],
    queryFn: getGlobalStandings,
  })
}
