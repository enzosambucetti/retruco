import { useEffect, useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import {
  getJornadasActivasConSerie,
  getInscripcionesActivas,
  createPartido,
} from '../../lib/queries'
import { ScoreStepper } from '../../components/ScoreStepper'
import { WinnerPreview } from '../../components/WinnerPreview'
import { ConfirmSheet } from '../../components/ConfirmSheet'

function nombrePareja(p: { jugador1_nombre: string; jugador1_apellido: string; jugador2_nombre: string; jugador2_apellido: string } | null | undefined) {
  if (!p) return '—'
  return `${p.jugador1_nombre} ${p.jugador1_apellido} / ${p.jugador2_nombre} ${p.jugador2_apellido}`
}

export function NuevoPartidoPage() {
  const qc = useQueryClient()
  const [searchParams] = useSearchParams()
  const preselectedJornada = searchParams.get('jornada_id') ?? ''

  const [jornadaId, setJornadaId] = useState(preselectedJornada)
  const [insc1Id, setInsc1Id] = useState('')
  const [insc2Id, setInsc2Id] = useState('')
  const [tantos1, setTantos1] = useState(0)
  const [tantos2, setTantos2] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toast, setToast] = useState<'success' | 'error' | null>(null)

  const { data: jornadas = [] } = useQuery({
    queryKey: ['jornadas-activas'],
    queryFn: getJornadasActivasConSerie,
  })

  const selectedJornada = jornadas.find(j => j.id === jornadaId)
  const serieId = selectedJornada?.serie_id ?? ''

  const { data: inscripciones = [] } = useQuery({
    queryKey: ['inscripciones', serieId],
    queryFn: () => getInscripcionesActivas(serieId),
    enabled: !!serieId,
  })

  useEffect(() => { setInsc1Id(''); setInsc2Id('') }, [serieId])

  const jornadasBySerie = useMemo(() => {
    const map: Record<string, typeof jornadas> = {}
    jornadas.forEach(j => {
      const key = j.series?.nombre ?? 'Sin serie'
      if (!map[key]) map[key] = []
      map[key].push(j)
    })
    return map
  }, [jornadas])

  const pareja1 = inscripciones.find(i => i.id === insc1Id)?.parejas
  const pareja2 = inscripciones.find(i => i.id === insc2Id)?.parejas
  const insc2Options = inscripciones.filter(i => i.id !== insc1Id)

  const saveMutation = useMutation({
    mutationFn: () =>
      createPartido({ jornada_id: jornadaId, inscripcion1_id: insc1Id, inscripcion2_id: insc2Id, tantos1, tantos2 }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['standings'] })
      qc.invalidateQueries({ queryKey: ['jornada', jornadaId] })
      qc.invalidateQueries({ queryKey: ['jornadas-admin'] })
      setInsc1Id(''); setInsc2Id(''); setTantos1(0); setTantos2(0)
      setToast('success')
      setTimeout(() => setToast(null), 3000)
    },
    onError: () => {
      setToast('error')
      setTimeout(() => setToast(null), 4000)
    },
  })

  function handleGuardar() {
    const e: Record<string, string> = {}
    if (!jornadaId) e.jornada = 'Seleccioná una jornada'
    if (!insc1Id) e.pareja1 = 'Seleccioná la pareja 1'
    if (!insc2Id) e.pareja2 = 'Seleccioná la pareja 2'
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setConfirmOpen(true)
  }

  function formatFecha(s: string) {
    const [y, m, d] = s.split('-').map(Number)
    return new Date(y, m - 1, d).toLocaleDateString('es-UY', { day: 'numeric', month: 'short' })
  }

  const selCls = (err?: string) =>
    `h-12 px-md rounded-lg border bg-surface text-body-md text-on-surface focus-visible:outline-2 focus-visible:outline-primary ${err ? 'border-error' : 'border-outline-variant'}`

  return (
    <div className="max-w-md mx-auto px-md py-lg">
      <h1 className="font-condensed text-headline-lg-mobile text-on-surface mb-lg">Nuevo Partido</h1>

      <div className="flex flex-col gap-md">
        {/* Jornada */}
        <div className="flex flex-col gap-xs">
          <label className="text-label-sm text-on-surface-variant font-semibold uppercase tracking-wide">Jornada *</label>
          <select value={jornadaId} onChange={e => setJornadaId(e.target.value)} className={selCls(errors.jornada)}>
            <option value="">Seleccionar jornada</option>
            {Object.entries(jornadasBySerie).map(([serie, js]) => (
              <optgroup key={serie} label={serie}>
                {js.map(j => (
                  <option key={j.id} value={j.id}>
                    Jornada {j.numero} — {formatFecha(j.fecha)}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {errors.jornada && <p className="text-label-sm text-error">{errors.jornada}</p>}
        </div>

        {/* Pareja 1 */}
        <div className="flex flex-col gap-xs">
          <label className="text-label-sm text-on-surface-variant font-semibold uppercase tracking-wide">Pareja 1 *</label>
          <select value={insc1Id} onChange={e => setInsc1Id(e.target.value)} disabled={!serieId} className={selCls(errors.pareja1)}>
            <option value="">Seleccionar pareja</option>
            {inscripciones.map(i => (
              <option key={i.id} value={i.id}>{nombrePareja(i.parejas)}</option>
            ))}
          </select>
          {errors.pareja1 && <p className="text-label-sm text-error">{errors.pareja1}</p>}
        </div>

        {/* Pareja 2 */}
        <div className="flex flex-col gap-xs">
          <label className="text-label-sm text-on-surface-variant font-semibold uppercase tracking-wide">Pareja 2 *</label>
          <select value={insc2Id} onChange={e => setInsc2Id(e.target.value)} disabled={!serieId} className={selCls(errors.pareja2)}>
            <option value="">Seleccionar pareja</option>
            {insc2Options.map(i => (
              <option key={i.id} value={i.id}>{nombrePareja(i.parejas)}</option>
            ))}
          </select>
          {errors.pareja2 && <p className="text-label-sm text-error">{errors.pareja2}</p>}
        </div>

        {/* Steppers */}
        <div className="grid grid-cols-2 gap-md">
          <ScoreStepper
            label={nombrePareja(pareja1)}
            value={tantos1}
            onChange={setTantos1}
          />
          <ScoreStepper
            label={nombrePareja(pareja2)}
            value={tantos2}
            onChange={setTantos2}
          />
        </div>

        {/* Winner preview — always visible */}
        <WinnerPreview
          pareja1={nombrePareja(pareja1)}
          pareja2={nombrePareja(pareja2)}
          tantos1={tantos1}
          tantos2={tantos2}
        />

        {/* CTA */}
        <button
          type="button"
          onClick={handleGuardar}
          className="h-14 rounded-full bg-tertiary text-on-tertiary font-condensed text-label-sm uppercase tracking-widest active:scale-95 transition-transform"
        >
          Guardar Partido
        </button>
      </div>

      {/* Toast */}
      {toast === 'success' && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-secondary text-on-secondary px-md py-sm rounded-full text-label-sm font-semibold shadow-lg z-50">
          Partido guardado.
        </div>
      )}
      {toast === 'error' && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-error text-on-error px-md py-sm rounded-full text-label-sm font-semibold shadow-lg z-50">
          No se pudo guardar. Intentá de nuevo.
        </div>
      )}

      {/* Confirm sheet */}
      <ConfirmSheet
        open={confirmOpen}
        title="Confirmar partido"
        description={`${nombrePareja(pareja1)} ${tantos1} — ${tantos2} ${nombrePareja(pareja2)}\n\nGanador: ${tantos1 !== tantos2 ? (tantos1 > tantos2 ? nombrePareja(pareja1) : nombrePareja(pareja2)) : 'Empate'}`}
        confirmLabel="Guardar"
        onConfirm={() => { setConfirmOpen(false); saveMutation.mutate() }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
