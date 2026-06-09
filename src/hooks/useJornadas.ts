import { useQuery } from '@tanstack/react-query'
import { getJornadas } from '../lib/queries'

export function useJornadas(serieId: string) {
  return useQuery({
    queryKey: ['jornadas', serieId],
    queryFn: () => getJornadas(serieId),
    enabled: !!serieId,
  })
}
