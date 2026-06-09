import { useQuery } from '@tanstack/react-query'
import { getSeries } from '../lib/queries'

export function useSeries() {
  return useQuery({
    queryKey: ['series'],
    queryFn: getSeries,
  })
}
