import type { StandingRow } from '../types'

interface StandingsTableProps {
  rows: StandingRow[]
  extraHeader?: React.ReactNode
  extraCell?: (row: StandingRow) => React.ReactNode
}

export function StandingsTable({ rows, extraHeader, extraCell }: StandingsTableProps) {
  return (
    <div className="overflow-x-auto -mx-md">
      <table className="w-full text-left border-collapse" style={{ minWidth: 320 }}>
        <thead>
          <tr className="border-b border-outline-variant bg-surface-container">
            <th className="px-2 py-2 text-label-sm text-on-surface-variant font-semibold w-7">#</th>
            <th className="px-2 py-2 text-label-sm text-on-surface-variant font-semibold">Pareja</th>
            {extraHeader}
            <th className="px-1 py-2 text-label-sm text-on-surface-variant font-semibold text-right w-7">PJ</th>
            <th className="px-1 py-2 text-label-sm text-on-surface-variant font-semibold text-right w-7">G</th>
            <th className="px-1 py-2 text-label-sm text-on-surface-variant font-semibold text-right w-7">P</th>
            <th className="px-1 py-2 text-label-sm text-on-surface-variant font-semibold text-right w-8">TF</th>
            <th className="px-1 py-2 text-label-sm text-on-surface-variant font-semibold text-right w-8">TC</th>
            <th className="px-1 py-2 text-label-sm text-on-surface-variant font-semibold text-right w-9">DIF</th>
            <th className="px-1 py-2 text-label-sm text-on-surface-variant font-semibold text-right w-10">Tnts</th>
            <th className="px-2 py-2 text-label-sm text-on-surface-variant font-semibold text-right w-8">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isFirst = row.posicion === 1
            return (
              <tr
                key={row.inscripcion_id}
                className={`border-b border-outline-variant ${isFirst ? 'bg-surface-container-low' : ''}`}
                style={{ minHeight: 44 }}
              >
                <td className="px-2 py-2 font-condensed text-ranking-number text-on-surface-variant w-7">
                  {row.posicion}
                </td>
                <td className="px-2 py-2 text-body-md text-on-surface leading-tight">
                  {row.nombre_pareja}
                </td>
                {extraCell?.(row)}
                <td className="px-1 py-2 font-condensed text-ranking-number text-on-surface text-right w-7 tabular-nums">
                  {row.pj}
                </td>
                <td className="px-1 py-2 font-condensed text-ranking-number text-on-surface text-right w-7 tabular-nums">
                  {row.g}
                </td>
                <td className="px-1 py-2 font-condensed text-ranking-number text-on-surface text-right w-7 tabular-nums">
                  {row.p}
                </td>
                <td className="px-1 py-2 font-condensed text-ranking-number text-on-surface text-right w-8 tabular-nums">
                  {row.tf}
                </td>
                <td className="px-1 py-2 font-condensed text-ranking-number text-on-surface text-right w-8 tabular-nums">
                  {row.tc}
                </td>
                <td className="px-1 py-2 font-condensed text-ranking-number text-on-surface text-right w-9 tabular-nums">
                  {row.dif > 0 ? `+${row.dif}` : row.dif}
                </td>
                <td className="px-1 py-2 font-condensed text-ranking-number text-on-surface text-right w-10 tabular-nums">
                  {row.tantos}
                </td>
                <td className="px-2 py-2 font-condensed text-ranking-number text-primary font-bold text-right w-8 tabular-nums">
                  {row.pts}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
