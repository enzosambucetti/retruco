import { useNavigate } from 'react-router-dom'

const SECTIONS = [
  { label: 'Series', icon: 'emoji_events', path: '/admin/series' },
  { label: 'Parejas', icon: 'group', path: '/admin/parejas' },
  { label: 'Jornadas', icon: 'calendar_month', path: '/admin/jornadas' },
  { label: 'Nuevo Partido', icon: 'sports', path: '/admin/partidos/nuevo' },
]

export function DashboardPage() {
  const navigate = useNavigate()

  return (
    <div className="max-w-md mx-auto px-md py-lg">
      <h1 className="font-condensed text-headline-lg-mobile text-on-surface mb-lg">
        Panel de administración
      </h1>
      <div className="grid grid-cols-2 gap-md">
        {SECTIONS.map(({ label, icon, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex flex-col items-center justify-center gap-sm p-lg bg-surface-container-lowest rounded-xl border border-outline-variant active:scale-95 hover:bg-surface-container-low transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[40px] text-primary">{icon}</span>
            <span className="font-condensed text-headline-md text-on-surface">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
