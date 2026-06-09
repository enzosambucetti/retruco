import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

export function TopAppBar() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isAdminArea =
    location.pathname.startsWith('/admin') &&
    location.pathname !== '/admin/login'

  async function handleAccountClick() {
    if (isAdminArea && session) {
      await supabase.auth.signOut()
      navigate('/')
    } else {
      navigate('/admin/login')
    }
  }

  return (
    <header className="sticky top-0 z-50 h-14 bg-surface border-b border-outline-variant flex items-center justify-between px-md">
      <div className="flex items-center gap-xs">
        <span className="material-symbols-outlined text-primary">playing_cards</span>
        <span className="font-condensed text-headline-lg-mobile text-primary font-bold tracking-wide">
          Retruco
        </span>
      </div>
      <button
        onClick={handleAccountClick}
        className="w-10 h-10 flex items-center justify-center text-primary active:scale-95 transition-transform"
        aria-label={
          isAdminArea && session
            ? 'Cerrar sesión'
            : 'Ir al panel de administración'
        }
      >
        <span className="material-symbols-outlined">account_circle</span>
      </button>
    </header>
  )
}
