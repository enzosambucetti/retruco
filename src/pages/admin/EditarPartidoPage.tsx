import { useEffect, useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import {
  getPartidoById,
  getJornadasActivasConSerie,
  getInscripcionesActivas,
  updatePartido,
} from '../../lib/queries'
import { ScoreStepper } from '../../components/ScoreStepper'
import { WinnerPreview } from '../../components/WinnerPreview'
import { ConfirmSheet } from '../../components/ConfirmSheet'

function nombrePareja(p: { jugador1_nombre: string; jugador1_apellido: string; jugador2_nombre: string; jugador2_apellido: string } | null | undefined) {
  if (!p) return '—'
  const inicial1 = p.jugador1_nombre.charAt(0).toUpperCase()
  const inicial2 = p.jugador2_nombre.charAt(0).toUpperCase()
  return `${inicial1}.${p.jugador1_apellido} / ${inicial2}.${p.jugador2_apellido}`
}

export function EditarPartidoPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data: partido, isLoading: loadingPartido } = useQuery({
    queryKey: ['partido', id],
    queryFn: () => getPartidoById(id!),
    enabled: !!id,
  })

  const [jornadaId, setJornadaId] = useState('')
  const [insc1Id, setInsc1Id] = useState('')
  const [insc2Id, setInsc2Id] = useState('')
  const [tantos1, setTantos1] = useState(0)
  const [tantos2, setTantos2] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [initialized, setInitialized] = useState(false)

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

  useEffect(() => {
    if (partido && jornadas.length > 0 && !initialized) {
      setJornadaId(partido.jornada_id)
      setInsc1Id(partido.inscripcion1_id)
      setInsc2Id(partido.inscripcion2_id)
      setTantos1(partido.tantos1)
      setTantos2(partido.tantos2)
      setInitialized(true)
    }
  }, [partido, jornadas, initialized])

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
      updatePartido(id!, { jornada_id: jornadaId, inscripcion1_id: insc1Id, inscripcion2_id: insc2Id, tantos1, tantos2 }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['standings'] })
      qc.invalidateQueries({ queryKey: ['jornada', jornadaId] })
      qc.invalidateQueries({ queryKey: ['global-standings'] })
      navigate(-1)
    },
  })

  function handleGuardar() {
    const e: Record<string, string> = {}
    if (!jornadaId) e.jornada = 'Seleccioná una jornada'
    if (!insc1Id) e.pareja1 = 'Seleccioná la pareja 1'
    if (!insc2Id) e.pareja2 = 'Seleccioná la pareja 2'
    if (tantos1 > 40 || tantos2 > 40) e.tantos = 'Los tantos no pueden superar 40'
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

  if (loadingPartido) {
    return (
      <div className="max-w-md mx-auto px-md py-lg space-y-md animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 bg-surface-container-low rounded-lg" />)}
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-md py-lg">
      <div className="flex items-center gap-sm mb-lg">
        <button onClick={() => navigate(-1)} className="text-primary active:scale-95 transition-transform" aria-label="Volver">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-condensed text-headline-lg-mobile text-on-surface">Editar Partido</h1>
      </div>

      <div className="flex flex-col gap-md">
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

        <div className="grid grid-cols-2 gap-md">
          <ScoreStepper label={nombrePareja(pareja1)} value={tantos1} onChange={setTantos1} />
          <ScoreStepper label={nombrePareja(pareja2)} value={tantos2} onChange={setTantos2} />
        </div>

        <WinnerPreview pareja1={nombrePareja(pareja1)} pareja2={nombrePareja(pareja2)} tantos1={tantos1} tantos2={tantos2} />

        {errors.tantos && <p className="text-label-sm text-error text-center">{errors.tantos}</p>}
        <button
          type="button"
          onClick={handleGuardar}
          disabled={saveMutation.isPending}
          className="h-14 rounded-full bg-tertiary text-on-tertiary font-condensed text-label-sm uppercase tracking-widest active:scale-95 transition-transform disabled:opacity-60"
        >
          {saveMutation.isPending ? 'Guardando…' : 'Guardar Partido'}
        </button>
      </div>

      <ConfirmSheet
        open={confirmOpen}
        title="Confirmar edición"
        description={`${nombrePareja(pareja1)} ${tantos1} — ${tantos2} ${nombrePareja(pareja2)}${tantos1 !== tantos2 ? `\n\nGanador: ${tantos1 > tantos2 ? nombrePareja(pareja1) : nombrePareja(pareja2)}` : ''}`}
        confirmLabel="Guardar"
        onConfirm={() => { setConfirmOpen(false); saveMutation.mutate() }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
