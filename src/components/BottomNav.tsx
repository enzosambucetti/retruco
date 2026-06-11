import { Link, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', icon: 'home', label: 'Inicio' },
  { to: '/global', icon: 'leaderboard', label: 'Tabla Global' },
] as const

export function BottomNav() {
  const { pathname } = useLocation()

  function isActive(to: string) {
    if (to === '/') return pathname === '/'
    return pathname.startsWith(to)
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-surface border-t border-outline-variant"
      style={{ borderRadius: '12px 12px 0 0', boxShadow: '0px -4px 12px rgba(0,0,0,0.08)' }}
    >
      <ul
        className="flex h-full items-center justify-around"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        {NAV_ITEMS.map(({ to, icon, label }) => {
          const active = isActive(to)
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className={`flex flex-col items-center gap-0.5 py-2 active:scale-95 transition-transform ${
                  active ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">{icon}</span>
                <span className="text-label-sm font-semibold">{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
