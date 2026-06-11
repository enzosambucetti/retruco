import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getJornadasAdmin, getPartidosAdminByJornada, deactivatePartido } from '../../lib/queries'
import { ConfirmSheet } from '../../components/ConfirmSheet'
import { InactiveChip } from '../../components/InactiveChip'

function nombrePareja(p: { jugador1_nombre: string; jugador1_apellido: string; jugador2_nombre: string; jugador2_apellido: string } | null | undefined) {
  if (!p) return '—'
  const inicial1 = p.jugador1_nombre.charAt(0).toUpperCase()
  const inicial2 = p.jugador2_nombre.charAt(0).toUpperCase()
  return `${inicial1}.${p.jugador1_apellido} / ${inicial2}.${p.jugador2_apellido}`
}

function formatFecha(s: string) {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('es-UY', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function AdminJornadaPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data: jornadas = [] } = useQuery({ queryKey: ['jornadas-admin'], queryFn: getJornadasAdmin })
  const jornada = jornadas.find(j => j.id === id)

  const { data: partidos = [], isLoading } = useQuery({
    queryKey: ['partidos-admin', id],
    queryFn: () => getPartidosAdminByJornada(id!),
    enabled: !!id,
  })

  const [confirmId, setConfirmId] = useState<string | null>(null)

  const deactivateMutation = useMutation({
    mutationFn: (pid: string) => deactivatePartido(pid),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['partidos-admin', id] })
      qc.invalidateQueries({ queryKey: ['standings'] })
      qc.invalidateQueries({ queryKey: ['jornada', id] })
      qc.invalidateQueries({ queryKey: ['global-standings'] })
    },
  })

  return (
    <div className="max-w-md mx-auto px-md py-lg">
      <div className="flex items-center gap-sm mb-xs">
        <button onClick={() => navigate('/admin/jornadas')} className="text-primary active:scale-95 transition-transform" aria-label="Volver">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-condensed text-headline-lg-mobile text-on-surface">
          {jornada ? `${jornada.series?.nombre} · Jornada ${jornada.numero}` : 'Detalle Jornada'}
        </h1>
      </div>

      {jornada && (
        <p className="text-label-sm text-on-surface-variant mb-lg capitalize ml-9">
          {formatFecha(jornada.fecha)}
        </p>
      )}

      <div className="flex items-center justify-between mb-md">
        <span className="font-condensed text-headline-md text-on-surface">Partidos</span>
        <button
          onClick={() => navigate(`/admin/partidos/nuevo?jornada_id=${id}`)}
          className="flex items-center gap-xs text-primary text-label-sm font-semibold active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Nuevo Partido
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-sm animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 bg-surface-container-low rounded-lg" />)}
        </div>
      ) : partidos.length === 0 ? (
        <div className="flex flex-col items-center gap-sm py-xl text-center">
          <span className="material-symbols-outlined text-[48px] text-outline-variant">sports</span>
          <p className="text-body-md text-on-surface-variant">No hay partidos cargados.</p>
        </div>
      ) : (
        <div className="space-y-sm">
          {partidos.map((p) => {
            const n1 = nombrePareja(p.inscripcion1?.parejas)
            const n2 = nombrePareja(p.inscripcion2?.parejas)
            const winner = p.tantos1 > p.tantos2 ? n1 : p.tantos2 > p.tantos1 ? n2 : null
            return (
              <div
                key={p.id}
                className={`flex items-center justify-between px-md py-sm bg-surface-container-lowest rounded-lg border border-outline-variant ${!p.activo ? 'opacity-50' : ''}`}
              >
                <div className="flex flex-col gap-[2px] min-w-0">
                  <div className="flex items-center gap-xs">
                    <span className="text-body-md text-on-surface font-semibold tabular-nums">
                      {p.tantos1} — {p.tantos2}
                    </span>
                    {!p.activo && <InactiveChip />}
                  </div>
                  <span className="text-label-sm text-on-surface-variant truncate">
                    {n1} vs {n2}
                  </span>
                  {winner && (
                    <span className="text-label-sm text-secondary font-semibold truncate">
                      Ganador: {winner}
                    </span>
                  )}
                </div>
                {p.activo && (
                  <div className="flex items-center gap-xs shrink-0">
                    <button
                      onClick={() => navigate(`/admin/partidos/${p.id}/editar`)}
                      className="w-9 h-9 flex items-center justify-center text-on-surface-variant active:scale-95 transition-transform"
                      aria-label="Editar"
                    >
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button
                      onClick={() => setConfirmId(p.id)}
                      className="w-9 h-9 flex items-center justify-center text-on-surface-variant active:scale-95 transition-transform"
                      aria-label="Desactivar"
                    >
                      <span className="material-symbols-outlined text-[20px]">cancel</span>
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <ConfirmSheet
        open={!!confirmId}
        title="Desactivar partido"
        description="¿Desactivar este partido? Los tantos se eliminarán del cálculo de la tabla."
        confirmLabel="Desactivar"
        destructive
        onConfirm={() => { if (confirmId) deactivateMutation.mutate(confirmId); setConfirmId(null) }}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  )
}
