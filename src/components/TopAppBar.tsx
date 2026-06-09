import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

export function TopAppBar() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const isAdminArea =
    location.pathname.startsWith('/admin') &&
    location.pathname !== '/admin/login'

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [menuOpen])

  async function handleSignOut() {
    setMenuOpen(false)
    await supabase.auth.signOut()
    navigate('/')
  }

  function handleAccountClick() {
    if (isAdminArea && session) {
      setMenuOpen((v) => !v)
    } else {
      navigate('/admin/login')
    }
  }

  return (
    <header className="sticky top-0 z-50 h-14 bg-surface border-b border-outline-variant flex items-center justify-between px-md">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-xs active:scale-95 transition-transform"
        aria-label="Ir al inicio"
      >
        <span className="material-symbols-outlined text-primary">playing_cards</span>
        <span className="font-condensed text-headline-lg-mobile text-primary font-bold tracking-wide">
          Retruco
        </span>
      </button>

      <div className="relative" ref={menuRef}>
        <button
          onClick={handleAccountClick}
          className="w-10 h-10 flex items-center justify-center text-primary active:scale-95 transition-transform"
          aria-label={
            isAdminArea && session
              ? 'Menú de cuenta'
              : 'Ir al panel de administración'
          }
          aria-expanded={menuOpen}
        >
          <span className="material-symbols-outlined">account_circle</span>
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-xs bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg min-w-[160px] py-xs z-50">
            <button
              onClick={handleSignOut}
              className="w-full text-left px-md py-sm text-body-md text-on-surface hover:bg-surface-container-low active:scale-95 transition-all"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
