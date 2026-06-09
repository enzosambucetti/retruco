import { useQuery } from '@tanstack/react-query'
import { getJornada, getPartidosJornada } from '../lib/queries'

export function useJornadaDetail(jornadaId: string) {
  const jornada = useQuery({
    queryKey: ['jornada', jornadaId],
    queryFn: () => getJornada(jornadaId),
    enabled: !!jornadaId,
  })

  const partidos = useQuery({
    queryKey: ['partidos', jornadaId],
    queryFn: () => getPartidosJornada(jornadaId),
    enabled: !!jornadaId,
  })

  return { jornada, partidos }
}
