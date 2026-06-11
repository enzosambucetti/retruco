import type { PartidoConNombres } from '../types'

interface MatchResultRowProps {
  partido: PartidoConNombres
}

function nombrePareja(p: { jugador1_nombre: string; jugador1_apellido: string; jugador2_nombre: string; jugador2_apellido: string } | null | undefined): string {
  if (!p) return '—'
  const inicial1 = p.jugador1_nombre.charAt(0).toUpperCase()
  const inicial2 = p.jugador2_nombre.charAt(0).toUpperCase()
  return `${inicial1}.${p.jugador1_apellido} / ${inicial2}.${p.jugador2_apellido}`
}

export function MatchResultRow({ partido }: MatchResultRowProps) {
  const pareja1 = partido.inscripcion1?.pareja ?? null
  const pareja2 = partido.inscripcion2?.pareja ?? null
  const winner = partido.tantos1 > partido.tantos2 ? 1 : partido.tantos2 > partido.tantos1 ? 2 : 0

  return (
    <div className="flex items-center gap-xs py-sm border-b border-outline-variant last:border-0">
      <p
        className={`flex-1 text-body-md leading-tight text-right ${winner === 1 ? 'font-semibold text-on-surface' : 'text-on-surface-variant'}`}
      >
        {nombrePareja(pareja1)}
      </p>
      <div className="flex items-center gap-xs shrink-0">
        <span className="font-condensed text-ranking-number text-on-surface tabular-nums w-6 text-right">
          {partido.tantos1}
        </span>
        <span className="text-on-surface-variant text-label-sm">—</span>
        <span className="font-condensed text-ranking-number text-on-surface tabular-nums w-6 text-left">
          {partido.tantos2}
        </span>
      </div>
      <p
        className={`flex-1 text-body-md leading-tight ${winner === 2 ? 'font-semibold text-on-surface' : 'text-on-surface-variant'}`}
      >
        {nombrePareja(pareja2)}
      </p>
    </div>
  )
}
