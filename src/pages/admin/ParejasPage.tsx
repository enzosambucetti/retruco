import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getParejas, getSeriesAdmin, createPareja, updatePareja,
  createInscripcion, deactivateInscripcion,
} from '../../lib/queries'
import { ConfirmSheet } from '../../components/ConfirmSheet'
import type { ParejaConInscripciones } from '../../lib/queries'

interface ParejaForm {
  jugador1_nombre: string; jugador1_apellido: string
  jugador2_nombre: string; jugador2_apellido: string
  serie_id: string
}
const EMPTY_FORM: ParejaForm = { jugador1_nombre: '', jugador1_apellido: '', jugador2_nombre: '', jugador2_apellido: '', serie_id: '' }

export function ParejasPage() {
  const qc = useQueryClient()
  const { data: parejas = [], isLoading } = useQuery({ queryKey: ['parejas'], queryFn: getParejas })
  const { data: series = [] } = useQuery({ queryKey: ['series-admin'], queryFn: getSeriesAdmin })

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<ParejaConInscripciones | null>(null)
  const [form, setForm] = useState<ParejaForm>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<ParejaForm>>({})
  const [confirmDeactivate, setConfirmDeactivate] = useState<{ id: string; label: string } | null>(null)

  const invalidate = () => qc.invalidateQueries({ queryKey: ['parejas'] })

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        jugador1_nombre: form.jugador1_nombre.trim(),
        jugador1_apellido: form.jugador1_apellido.trim(),
        jugador2_nombre: form.jugador2_nombre.trim(),
        jugador2_apellido: form.jugador2_apellido.trim(),
      }
      if (editing) {
        await updatePareja(editing.id, payload)
        if (form.serie_id) await createInscripcion(editing.id, form.serie_id)
      } else {
        const { id } = await createPareja(payload)
        if (form.serie_id) await createInscripcion(id, form.serie_id)
      }
    },
    onSuccess: () => { invalidate(); closeForm() },
  })

  const deactivateInscMutation = useMutation({
    mutationFn: (id: string) => deactivateInscripcion(id),
    onSuccess: invalidate,
  })

  function validateForm() {
    const e: Partial<ParejaForm> = {}
    if (!form.jugador1_nombre.trim()) e.jugador1_nombre = 'Requerido'
    if (!form.jugador1_apellido.trim()) e.jugador1_apellido = 'Requerido'
    if (!form.jugador2_nombre.trim()) e.jugador2_nombre = 'Requerido'
    if (!form.jugador2_apellido.trim()) e.jugador2_apellido = 'Requerido'
    return e
  }

  function openCreate() { setEditing(null); setForm(EMPTY_FORM); setErrors({}); setFormOpen(true) }
  function openEdit(p: ParejaConInscripciones) {
    setEditing(p)
    setForm({ jugador1_nombre: p.jugador1_nombre, jugador1_apellido: p.jugador1_apellido, jugador2_nombre: p.jugador2_nombre, jugador2_apellido: p.jugador2_apellido, serie_id: '' })
    setErrors({}); setFormOpen(true)
  }
  function closeForm() { setFormOpen(false); setEditing(null); setForm(EMPTY_FORM); setErrors({}) }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const errs = validateForm()
    if (Object.keys(errs).length) { setErrors(errs); return }
    saveMutation.mutate()
  }

  const inputCls = (err?: string) =>
    `h-12 px-sm rounded-lg border bg-surface text-body-md text-on-surface focus-visible:outline-2 focus-visible:outline-primary ${err ? 'border-error' : 'border-outline-variant'}`

  return (
    <div className="max-w-md mx-auto px-md py-lg">
      <div className="flex items-center justify-between mb-lg">
        <h1 className="font-condensed text-headline-lg-mobile text-on-surface">Parejas</h1>
        {!formOpen && (
          <button onClick={openCreate} className="flex items-center gap-xs text-primary text-label-sm font-semibold active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Nueva Pareja
          </button>
        )}
      </div>

      {formOpen && (
        <form onSubmit={handleSave} noValidate className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md mb-lg flex flex-col gap-md">
          <h2 className="font-condensed text-headline-md text-on-surface">{editing ? 'Editar pareja' : 'Nueva pareja'}</h2>

          <div className="grid grid-cols-2 gap-sm">
            {(['jugador1_nombre', 'jugador1_apellido', 'jugador2_nombre', 'jugador2_apellido'] as const).map((field) => {
              const labels: Record<string, string> = { jugador1_nombre: 'Jugador 1 — Nombre', jugador1_apellido: 'Jugador 1 — Apellido', jugador2_nombre: 'Jugador 2 — Nombre', jugador2_apellido: 'Jugador 2 — Apellido' }
              return (
                <div key={field} className="flex flex-col gap-xs col-span-2 sm:col-span-1">
                  <label htmlFor={field} className="text-label-sm text-on-surface-variant font-semibold uppercase tracking-wide">{labels[field]}</label>
                  <input id={field} type="text" value={form[field]} onChange={(e) => setForm(f => ({ ...f, [field]: e.target.value }))} className={inputCls(errors[field])} />
                  {errors[field] && <p className="text-label-sm text-error">{errors[field]}</p>}
                </div>
              )
            })}
          </div>

          <div className="flex flex-col gap-xs">
            <label htmlFor="inscribir-serie" className="text-label-sm text-on-surface-variant font-semibold uppercase tracking-wide">
              {editing ? 'Inscribir en otra serie' : 'Inscribir en serie'}
            </label>
            <select id="inscribir-serie" value={form.serie_id} onChange={(e) => setForm(f => ({ ...f, serie_id: e.target.value }))}
              className="h-12 px-md rounded-lg border border-outline-variant bg-surface text-body-md text-on-surface focus-visible:outline-2 focus-visible:outline-primary">
              <option value="">Sin inscripción</option>
              {(series as { id: string; nombre: string; activo: boolean }[]).filter(s => s.activo).map(s => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>
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
        <div className="space-y-sm animate-pulse">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 bg-surface-container-low rounded-lg" />)}</div>
      ) : (
        <div className="space-y-sm">
          {parejas.map((p) => {
            const activeInsc = p.inscripciones.filter(i => i.activa)
            return (
              <div key={p.id} className={`px-md py-sm bg-surface-container-lowest rounded-lg border border-outline-variant ${!p.activo ? 'opacity-50' : ''}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-body-md text-on-surface font-semibold">
                      {p.jugador1_nombre} {p.jugador1_apellido} / {p.jugador2_nombre} {p.jugador2_apellido}
                    </p>
                    <div className="flex flex-wrap gap-xs mt-[2px]">
                      {activeInsc.map(i => (
                        <div key={i.id} className="flex items-center gap-[2px]">
                          <span className="text-label-sm text-on-surface-variant">{i.series?.nombre}</span>
                          <button onClick={() => setConfirmDeactivate({ id: i.id, label: `${p.jugador1_apellido}/${p.jugador2_apellido} de ${i.series?.nombre}` })}
                            className="text-on-surface-variant active:scale-90 transition-transform" aria-label="Retirar de serie">
                            <span className="material-symbols-outlined text-[14px]">close</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => openEdit(p)} className="w-9 h-9 flex items-center justify-center text-on-surface-variant active:scale-95 transition-transform shrink-0" aria-label="Editar">
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <ConfirmSheet
        open={!!confirmDeactivate}
        title="Retirar pareja de serie"
        description={`¿Retirar a ${confirmDeactivate?.label}? Los partidos ya cargados se conservan.`}
        confirmLabel="Retirar"
        destructive
        onConfirm={() => { if (confirmDeactivate) deactivateInscMutation.mutate(confirmDeactivate.id); setConfirmDeactivate(null) }}
        onCancel={() => setConfirmDeactivate(null)}
      />
    </div>
  )
}
