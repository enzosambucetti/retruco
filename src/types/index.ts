export interface Bar {
  id: string
  nombre: string
  activo: boolean
  created_at: string
}

export interface Serie {
  id: string
  nombre: string
  dia_juego: string | null
  bar_id: string | null
  activo: boolean
  created_at: string
}

export interface Pareja {
  id: string
  jugador1_nombre: string
  jugador1_apellido: string
  jugador2_nombre: string
  jugador2_apellido: string
  activo: boolean
  created_at: string
}

export interface Inscripcion {
  id: string
  pareja_id: string
  serie_id: string
  activa: boolean
  created_at: string
}

export interface Jornada {
  id: string
  serie_id: string
  numero: number
  fecha: string
  activa: boolean
  created_at: string
}

export interface Partido {
  id: string
  jornada_id: string
  inscripcion1_id: string
  inscripcion2_id: string
  tantos1: number
  tantos2: number
  activo: boolean
  created_at: string
}

export interface SerieConDetalles extends Serie {
  inscripciones: { id: string; activa: boolean }[]
}

export interface JornadaConCount extends Jornada {
  partidos: { id: string }[]
}

export interface ParejaResumen {
  jugador1_nombre: string
  jugador1_apellido: string
  jugador2_nombre: string
  jugador2_apellido: string
}

export interface PartidoConNombres extends Partido {
  inscripcion1: { pareja: ParejaResumen } | null
  inscripcion2: { pareja: ParejaResumen } | null
}

export interface StandingRow {
  inscripcion_id: string
  pareja_id: string
  nombre_pareja: string
  pj: number
  g: number
  p: number
  tf: number
  tc: number
  dif: number
  tantos: number
  pts: number
  posicion: number
}

export interface GlobalStandingRow extends StandingRow {
  serie_referencia_id: string
  serie_nombre: string
}
