import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getJornadasAdmin, getSeriesAdmin, createJornada, updateJornada, deactivateJornada,
} from '../../lib/queries'
import { ConfirmSheet } from '../../components/ConfirmSheet'
import { InactiveChip } from '../../components/InactiveChip'
import type { JornadaAdminRow } from '../../lib/queries'

interface FormState { serie_id: string; numero: string; fecha: string }
const EMPTY: FormState = { serie_id: '', numero: '', fecha: '' }

function formatFecha(s: string) {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('es-UY', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function JornadasPage() {
  const qc = useQueryClient()
  const { data: jornadas = [], isLoading } = useQuery({ queryKey: ['jornadas-admin'], queryFn: getJornadasAdmin })
  const { data: series = [] } = useQuery({ queryKey: ['series-admin'], queryFn: getSeriesAdmin })

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<JornadaAdminRow | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['jornadas-admin'] })
    qc.invalidateQueries({ queryKey: ['jornadas'] })
    qc.invalidateQueries({ queryKey: ['standings'] })
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editing) {
        return updateJornada(editing.id, { numero: Number(form.numero), fecha: form.fecha })
      }
      return createJornada({ serie_id: form.serie_id, numero: Number(form.numero), fecha: form.fecha })
    },
    onSuccess: () => { invalidate(); closeForm() },
  })

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => deactivateJornada(id),
    onSuccess: invalidate,
  })

  function validateForm() {
    const e: Partial<FormState> = {}
    if (!editing && !form.serie_id) e.serie_id = 'Requerido'
    if (!form.numero || isNaN(Number(form.numero))) e.numero = 'Número requerido'
    if (!form.fecha) e.fecha = 'Fecha requerida'
    return e
  }

  function openCreate() { setEditing(null); setForm(EMPTY); setErrors({}); setFormOpen(true) }
  function openEdit(j: JornadaAdminRow) {
    setEditing(j)
    setForm({ serie_id: j.serie_id, numero: String(j.numero), fecha: j.fecha })
    setErrors({}); setFormOpen(true)
  }
  function closeForm() { setFormOpen(false); setEditing(null); setForm(EMPTY); setErrors({}) }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const errs = validateForm()
    if (Object.keys(errs).length) { setErrors(errs); return }
    saveMutation.mutate()
  }

  const fieldCls = (err?: string) =>
    `h-12 px-md rounded-lg border bg-surface text-body-md text-on-surface focus-visible:outline-2 focus-visible:outline-primary ${err ? 'border-error' : 'border-outline-variant'}`

  return (
    <div className="max-w-md mx-auto px-md py-lg">
      <div className="flex items-center justify-between mb-lg">
        <h1 className="font-condensed text-headline-lg-mobile text-on-surface">Jornadas</h1>
        {!formOpen && (
          <button onClick={openCreate} className="flex items-center gap-xs text-primary text-label-sm font-semibold active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Nueva Jornada
          </button>
        )}
      </div>

      {formOpen && (
        <form onSubmit={handleSave} noValidate className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md mb-lg flex flex-col gap-md">
          <h2 className="font-condensed text-headline-md text-on-surface">{editing ? 'Editar jornada' : 'Nueva jornada'}</h2>

          {!editing && (
            <div className="flex flex-col gap-xs">
              <label htmlFor="j-serie" className="text-label-sm text-on-surface-variant font-semibold uppercase tracking-wide">Serie *</label>
              <select id="j-serie" value={form.serie_id} onChange={(e) => setForm(f => ({ ...f, serie_id: e.target.value }))}
                className={fieldCls(errors.serie_id)}>
                <option value="">Seleccionar serie</option>
                {series.filter(s => s.activo).map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
              </select>
              {errors.serie_id && <p className="text-label-sm text-error">{errors.serie_id}</p>}
            </div>
          )}

          <div className="grid grid-cols-2 gap-sm">
            <div className="flex flex-col gap-xs">
              <label htmlFor="j-numero" className="text-label-sm text-on-surface-variant font-semibold uppercase tracking-wide">Número *</label>
              <input id="j-numero" type="number" min="1" value={form.numero} onChange={(e) => setForm(f => ({ ...f, numero: e.target.value }))}
                className={fieldCls(errors.numero)} />
              {errors.numero && <p className="text-label-sm text-error">{errors.numero}</p>}
            </div>
            <div className="flex flex-col gap-xs">
              <label htmlFor="j-fecha" className="text-label-sm text-on-surface-variant font-semibold uppercase tracking-wide">Fecha *</label>
              <input id="j-fecha" type="date" value={form.fecha} onChange={(e) => setForm(f => ({ ...f, fecha: e.target.value }))}
                className={fieldCls(errors.fecha)} />
              {errors.fecha && <p className="text-label-sm text-error">{errors.fecha}</p>}
            </div>
          </div>

          <div className="flex gap-sm">
            <button type="button" onClick={closeForm} className="flex-1 h-11 rounded-full border border-outline text-on-surface text-label-sm font-semibold active:scale-95 transition-transform">Cancelar</button>
            <button type="submit" disabled={saveMutation.isPending} className="flex-1 h-11 rounded-full bg-primary text-on-primary text-label-sm font-semibold active:scale-95 transition-transform disabled:opacity-60">
              {saveMutation.isPending ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="space-y-sm animate-pulse">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-surface-container-low rounded-lg" />)}</div>
      ) : (
        <div className="space-y-sm">
          {jornadas.map((j) => (
            <div key={j.id} className={`flex items-center justify-between px-md py-sm bg-surface-container-lowest rounded-lg border border-outline-variant ${!j.activa ? 'opacity-50' : ''}`}>
              <div className="flex flex-col gap-[2px]">
                <div className="flex items-center gap-sm">
                  <span className="text-body-md text-on-surface">
                    {j.series?.nombre} · Jornada {j.numero}
                  </span>
                  {!j.activa && <InactiveChip />}
                </div>
                <span className="text-label-sm text-on-surface-variant capitalize">
                  {formatFecha(j.fecha)} · {j.partidos.length} partidos
                </span>
              </div>
              {j.activa && (
                <div className="flex items-center gap-xs">
                  <button onClick={() => openEdit(j)} className="w-9 h-9 flex items-center justify-center text-on-surface-variant active:scale-95 transition-transform" aria-label="Editar">
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <button onClick={() => setConfirmId(j.id)} className="w-9 h-9 flex items-center justify-center text-on-surface-variant active:scale-95 transition-transform" aria-label="Desactivar">
                    <span className="material-symbols-outlined text-[20px]">archive</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmSheet
        open={!!confirmId}
        title="Desactivar jornada"
        description="¿Desactivar esta jornada? Los partidos no se eliminarán."
        confirmLabel="Desactivar"
        destructive
        onConfirm={() => { if (confirmId) deactivateMutation.mutate(confirmId); setConfirmId(null) }}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  )
}
