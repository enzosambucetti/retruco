import { useQuery } from '@tanstack/react-query'
import { getSerie } from '../lib/queries'

export function useSerie(id: string) {
  return useQuery({
    queryKey: ['serie', id],
    queryFn: () => getSerie(id),
    enabled: !!id,
  })
}
