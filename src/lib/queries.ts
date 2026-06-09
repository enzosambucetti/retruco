import { supabase } from './supabase'
import type {
  SerieConDetalles,
  SerieConBar,
  StandingRow,
  GlobalStandingRow,
  JornadaConCount,
  Jornada,
  PartidoConNombres,
} from '../types'

export { supabase }

export async function getSeries(): Promise<SerieConDetalles[]> {
  const { data, error } = await supabase
    .from('series')
    .select('*, bares(id, nombre), inscripciones(id, activa)')
    .eq('activo', true)
    .order('nombre')
  if (error) throw error
  return data as unknown as SerieConDetalles[]
}

export async function getSerie(id: string): Promise<SerieConBar> {
  const { data, error } = await supabase
    .from('series')
    .select('*, bares(id, nombre)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as unknown as SerieConBar
}

export async function getStandings(serieId: string): Promise<StandingRow[]> {
  const { data, error } = await supabase.rpc('get_standings', {
    p_serie_id: serieId,
  })
  if (error) throw error
  return data as StandingRow[]
}

export async function getGlobalStandings(): Promise<GlobalStandingRow[]> {
  const { data, error } = await supabase.rpc('get_global_standings')
  if (error) throw error
  return data as GlobalStandingRow[]
}

export async function getJornadas(serieId: string): Promise<JornadaConCount[]> {
  const { data, error } = await supabase
    .from('jornadas')
    .select('*, partidos(id)')
    .eq('serie_id', serieId)
    .eq('activa', true)
    .order('numero', { ascending: false })
  if (error) throw error
  return data as unknown as JornadaConCount[]
}

export async function getJornada(jornadaId: string): Promise<Jornada> {
  const { data, error } = await supabase
    .from('jornadas')
    .select('*')
    .eq('id', jornadaId)
    .single()
  if (error) throw error
  return data as Jornada
}

export async function getPartidosJornada(
  jornadaId: string,
): Promise<PartidoConNombres[]> {
  const { data, error } = await supabase
    .from('partidos')
    .select(
      `*, inscripcion1:inscripciones!inscripcion1_id(pareja:parejas(jugador1_nombre, jugador1_apellido, jugador2_nombre, jugador2_apellido)), inscripcion2:inscripciones!inscripcion2_id(pareja:parejas(jugador1_nombre, jugador1_apellido, jugador2_nombre, jugador2_apellido))`,
    )
    .eq('jornada_id', jornadaId)
    .eq('activo', true)
    .order('created_at')
  if (error) throw error
  return data as unknown as PartidoConNombres[]
}
