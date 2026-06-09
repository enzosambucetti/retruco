import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

export function LoginPage() {
  const { session, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && session) navigate('/admin', { replace: true })
  }, [session, loading, navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email.trim()) { setError('El email es requerido.'); return }
    if (!password) { setError('La contraseña es requerida.'); return }
    setSubmitting(true)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    setSubmitting(false)
    if (authError) {
      setError('Email o contraseña incorrectos.')
    } else {
      navigate('/admin', { replace: true })
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-md">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-xs mb-xl">
          <span className="material-symbols-outlined text-primary text-[48px]">playing_cards</span>
          <h1 className="font-condensed text-headline-lg text-on-surface">Retruco Admin</h1>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-md">
          <div className="flex flex-col gap-xs">
            <label htmlFor="email" className="text-label-sm text-on-surface-variant font-semibold uppercase tracking-wide">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 px-md rounded-lg border border-outline-variant bg-surface-container-lowest text-body-md text-on-surface focus-visible:outline-2 focus-visible:outline-primary"
              placeholder="admin@ejemplo.com"
            />
          </div>

          <div className="flex flex-col gap-xs">
            <label htmlFor="password" className="text-label-sm text-on-surface-variant font-semibold uppercase tracking-wide">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 px-md rounded-lg border border-outline-variant bg-surface-container-lowest text-body-md text-on-surface focus-visible:outline-2 focus-visible:outline-primary"
            />
          </div>

          {error && <p className="text-label-sm text-error">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="h-14 rounded-full bg-tertiary text-on-tertiary font-condensed text-label-sm uppercase tracking-widest active:scale-95 transition-transform disabled:opacity-60"
          >
            {submitting ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
