import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBares, createBar, updateBar, deactivateBar } from '../../lib/queries'
import { ConfirmSheet } from '../../components/ConfirmSheet'
import { InactiveChip } from '../../components/InactiveChip'
import type { Bar } from '../../types'

export function BaresPage() {
  const qc = useQueryClient()
  const { data: bares = [], isLoading } = useQuery({ queryKey: ['bares'], queryFn: getBares })

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Bar | null>(null)
  const [nombre, setNombre] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const invalidate = () => qc.invalidateQueries({ queryKey: ['bares'] })

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editing) return updateBar(editing.id, nombre.trim())
      return createBar(nombre.trim())
    },
    onSuccess: () => { invalidate(); closeForm() },
  })

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => deactivateBar(id),
    onSuccess: invalidate,
  })

  function openCreate() { setEditing(null); setNombre(''); setFieldError(''); setFormOpen(true) }
  function openEdit(bar: Bar) { setEditing(bar); setNombre(bar.nombre); setFieldError(''); setFormOpen(true) }
  function closeForm() { setFormOpen(false); setEditing(null); setNombre(''); setFieldError('') }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim()) { setFieldError('El nombre es requerido.'); return }
    saveMutation.mutate()
  }

  return (
    <div className="max-w-md mx-auto px-md py-lg">
      <div className="flex items-center justify-between mb-lg">
        <h1 className="font-condensed text-headline-lg-mobile text-on-surface">Bares</h1>
        {!formOpen && (
          <button onClick={openCreate} className="flex items-center gap-xs text-primary text-label-sm font-semibold active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Nuevo Bar
          </button>
        )}
      </div>

      {formOpen && (
        <form onSubmit={handleSave} noValidate className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md mb-lg flex flex-col gap-md">
          <h2 className="font-condensed text-headline-md text-on-surface">{editing ? 'Editar bar' : 'Nuevo bar'}</h2>
          <div className="flex flex-col gap-xs">
            <label htmlFor="bar-nombre" className="text-label-sm text-on-surface-variant font-semibold uppercase tracking-wide">Nombre</label>
            <input id="bar-nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
              className={`h-12 px-md rounded-lg border bg-surface text-body-md text-on-surface focus-visible:outline-2 focus-visible:outline-primary ${fieldError ? 'border-error' : 'border-outline-variant'}`}
            />
            {fieldError && <p className="text-label-sm text-error">{fieldError}</p>}
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
        <div className="space-y-sm animate-pulse">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-14 bg-surface-container-low rounded-lg" />)}</div>
      ) : (
        <div className="space-y-sm">
          {bares.map((bar) => (
            <div key={bar.id} className={`flex items-center justify-between px-md py-sm bg-surface-container-lowest rounded-lg border border-outline-variant ${!bar.activo ? 'opacity-50' : ''}`}>
              <div className="flex items-center gap-sm">
                <span className="text-body-md text-on-surface">{bar.nombre}</span>
                {!bar.activo && <InactiveChip />}
              </div>
              {bar.activo && (
                <div className="flex items-center gap-xs">
                  <button onClick={() => openEdit(bar)} className="w-9 h-9 flex items-center justify-center text-on-surface-variant active:scale-95 transition-transform" aria-label="Editar">
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <button onClick={() => setConfirmId(bar.id)} className="w-9 h-9 flex items-center justify-center text-on-surface-variant active:scale-95 transition-transform" aria-label="Desactivar">
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
        title="Desactivar bar"
        description="El bar dejará de estar disponible para nuevas series."
        confirmLabel="Desactivar"
        destructive
        onConfirm={() => { if (confirmId) deactivateMutation.mutate(confirmId); setConfirmId(null) }}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  )
}
