import { supabase } from './supabase'
import type {
  SerieConDetalles,
  SerieConBar,
  Bar,
  StandingRow,
  GlobalStandingRow,
  JornadaConCount,
  Jornada,
  Inscripcion,
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

// ─── Admin queries ────────────────────────────────────────────────────────────

export async function getBares() {
  const { data, error } = await supabase
    .from('bares')
    .select('*')
    .order('activo', { ascending: false })
    .order('nombre')
  if (error) throw error
  return data as Bar[]
}

export async function createBar(nombre: string) {
  const { error } = await supabase.from('bares').insert({ nombre })
  if (error) throw error
}

export async function updateBar(id: string, nombre: string) {
  const { error } = await supabase.from('bares').update({ nombre }).eq('id', id)
  if (error) throw error
}

export async function deactivateBar(id: string) {
  const { error } = await supabase
    .from('bares')
    .update({ activo: false })
    .eq('id', id)
  if (error) throw error
}

export async function getSeriesAdmin() {
  const { data, error } = await supabase
    .from('series')
    .select('*, bares(id, nombre)')
    .order('activo', { ascending: false })
    .order('nombre')
  if (error) throw error
  return data as unknown as SerieConBar[]
}

export async function createSerie(payload: {
  nombre: string
  dia_juego?: string
  bar_id?: string | null
}) {
  const { error } = await supabase.from('series').insert(payload)
  if (error) throw error
}

export async function updateSerie(
  id: string,
  payload: { nombre: string; dia_juego?: string; bar_id?: string | null },
) {
  const { error } = await supabase.from('series').update(payload).eq('id', id)
  if (error) throw error
}

export async function deactivateSerie(id: string) {
  const { error } = await supabase
    .from('series')
    .update({ activo: false })
    .eq('id', id)
  if (error) throw error
}

export async function getParejas() {
  const { data, error } = await supabase
    .from('parejas')
    .select('*, inscripciones(id, activa, series(id, nombre))')
    .order('activo', { ascending: false })
    .order('jugador1_apellido')
  if (error) throw error
  return data as unknown as ParejaConInscripciones[]
}

export async function createPareja(payload: {
  jugador1_nombre: string
  jugador1_apellido: string
  jugador2_nombre: string
  jugador2_apellido: string
}) {
  const { data, error } = await supabase
    .from('parejas')
    .insert(payload)
    .select('id')
    .single()
  if (error) throw error
  return data as { id: string }
}

export async function updatePareja(
  id: string,
  payload: {
    jugador1_nombre: string
    jugador1_apellido: string
    jugador2_nombre: string
    jugador2_apellido: string
  },
) {
  const { error } = await supabase.from('parejas').update(payload).eq('id', id)
  if (error) throw error
}

export async function createInscripcion(parejaId: string, serieId: string) {
  const { error } = await supabase
    .from('inscripciones')
    .insert({ pareja_id: parejaId, serie_id: serieId })
  if (error) throw error
}

export async function deactivateInscripcion(id: string) {
  const { error } = await supabase
    .from('inscripciones')
    .update({ activa: false })
    .eq('id', id)
  if (error) throw error
}

export async function getJornadasAdmin() {
  const { data, error } = await supabase
    .from('jornadas')
    .select('*, series(id, nombre), partidos(id)')
    .order('activa', { ascending: false })
    .order('numero', { ascending: false })
  if (error) throw error
  return data as unknown as JornadaAdminRow[]
}

export async function createJornada(payload: {
  serie_id: string
  numero: number
  fecha: string
}) {
  const { error } = await supabase.from('jornadas').insert(payload)
  if (error) throw error
}

export async function updateJornada(
  id: string,
  payload: { numero: number; fecha: string },
) {
  const { error } = await supabase.from('jornadas').update(payload).eq('id', id)
  if (error) throw error
}

export async function deactivateJornada(id: string) {
  const { error } = await supabase
    .from('jornadas')
    .update({ activa: false })
    .eq('id', id)
  if (error) throw error
}

export interface ParejaConInscripciones {
  id: string
  jugador1_nombre: string
  jugador1_apellido: string
  jugador2_nombre: string
  jugador2_apellido: string
  activo: boolean
  created_at: string
  inscripciones: (Inscripcion & { series: { id: string; nombre: string } | null })[]
}

export interface JornadaAdminRow {
  id: string
  serie_id: string
  numero: number
  fecha: string
  activa: boolean
  created_at: string
  series: { id: string; nombre: string } | null
  partidos: { id: string }[]
}
