import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getSeriesAdmin, createSerie, updateSerie, deactivateSerie } from '../../lib/queries'
import { ConfirmSheet } from '../../components/ConfirmSheet'
import { InactiveChip } from '../../components/InactiveChip'
import type { Serie } from '../../types'

interface FormState { nombre: string; dia_juego: string }
const EMPTY: FormState = { nombre: '', dia_juego: '' }

export function SeriesPage() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const { data: series = [], isLoading } = useQuery({ queryKey: ['series-admin'], queryFn: getSeriesAdmin })

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Serie | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [fieldError, setFieldError] = useState('')
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['series-admin'] })
    qc.invalidateQueries({ queryKey: ['series'] })
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { nombre: form.nombre.trim(), dia_juego: form.dia_juego.trim() || undefined, bar_id: null }
      if (editing) return updateSerie(editing.id, payload)
      return createSerie(payload)
    },
    onSuccess: () => { invalidate(); closeForm() },
  })

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => deactivateSerie(id),
    onSuccess: invalidate,
  })

  function openCreate() { setEditing(null); setForm(EMPTY); setFieldError(''); setFormOpen(true) }
  function openEdit(s: Serie) {
    setEditing(s)
    setForm({ nombre: s.nombre, dia_juego: s.dia_juego ?? '' })
    setFieldError(''); setFormOpen(true)
  }
  function closeForm() { setFormOpen(false); setEditing(null); setForm(EMPTY); setFieldError('') }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nombre.trim()) { setFieldError('El nombre es requerido.'); return }
    saveMutation.mutate()
  }

  return (
    <div className="max-w-md mx-auto px-md py-lg">
      <div className="flex items-center justify-between mb-lg">
        <div className="flex items-center gap-sm">
          <button onClick={() => navigate('/admin')} className="text-primary active:scale-95 transition-transform" aria-label="Volver">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-condensed text-headline-lg-mobile text-on-surface">Series</h1>
        </div>
        {!formOpen && (
          <button onClick={openCreate} className="flex items-center gap-xs text-primary text-label-sm font-semibold active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Nueva Serie
          </button>
        )}
      </div>

      {formOpen && (
        <form onSubmit={handleSave} noValidate className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md mb-lg flex flex-col gap-md">
          <h2 className="font-condensed text-headline-md text-on-surface">{editing ? 'Editar serie' : 'Nueva serie'}</h2>

          <div className="flex flex-col gap-xs">
            <label htmlFor="serie-nombre" className="text-label-sm text-on-surface-variant font-semibold uppercase tracking-wide">Nombre *</label>
            <input id="serie-nombre" type="text" value={form.nombre} onChange={(e) => setForm(f => ({ ...f, nombre: e.target.value }))}
              className={`h-12 px-md rounded-lg border bg-surface text-body-md text-on-surface focus-visible:outline-2 focus-visible:outline-primary ${fieldError ? 'border-error' : 'border-outline-variant'}`}
            />
            {fieldError && <p className="text-label-sm text-error">{fieldError}</p>}
          </div>

          <div className="flex flex-col gap-xs">
            <label htmlFor="serie-dia" className="text-label-sm text-on-surface-variant font-semibold uppercase tracking-wide">Día de juego</label>
            <input id="serie-dia" type="text" value={form.dia_juego} onChange={(e) => setForm(f => ({ ...f, dia_juego: e.target.value }))}
              placeholder="Ej: Lunes" className="h-12 px-md rounded-lg border border-outline-variant bg-surface text-body-md text-on-surface focus-visible:outline-2 focus-visible:outline-primary"
            />
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
        <div className="space-y-sm animate-pulse">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 bg-surface-container-low rounded-lg" />)}</div>
      ) : (
        <div className="space-y-sm">
          {series.map((s) => (
            <div key={s.id} className={`flex items-center justify-between px-md py-sm bg-surface-container-lowest rounded-lg border border-outline-variant ${!s.activo ? 'opacity-50' : ''}`}>
              <div className="flex flex-col gap-[2px]">
                <div className="flex items-center gap-sm">
                  <span className="text-body-md text-on-surface">{s.nombre}</span>
                  {!s.activo && <InactiveChip />}
                </div>
                {s.dia_juego && (
                  <span className="text-label-sm text-on-surface-variant">{s.dia_juego}</span>
                )}
              </div>
              {s.activo && (
                <div className="flex items-center gap-xs">
                  <button onClick={() => openEdit(s)} className="w-9 h-9 flex items-center justify-center text-on-surface-variant active:scale-95 transition-transform" aria-label="Editar">
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <button onClick={() => setConfirmId(s.id)} className="w-9 h-9 flex items-center justify-center text-on-surface-variant active:scale-95 transition-transform" aria-label="Desactivar">
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
        title="Desactivar serie"
        description="¿Desactivar esta serie? Los datos se conservan."
        confirmLabel="Desactivar"
        destructive
        onConfirm={() => { if (confirmId) deactivateMutation.mutate(confirmId); setConfirmId(null) }}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  )
}
