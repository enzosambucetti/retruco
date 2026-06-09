# Story 1.6: Shell navegable — router, providers y componentes de navegación

Status: review

## Story

As a visitor,
I want to see the app shell with the top bar and bottom navigation from any screen,
so that I can always orient myself and navigate between the main sections.

## Acceptance Criteria

1. `TopAppBar` visible en todas las rutas: sticky top, wordmark "Retruco", ícono de cuenta.
2. En rutas públicas, tap en `account_circle` navega a `/admin/login`.
3. En rutas admin con sesión activa, tap en `account_circle` muestra "Cerrar sesión" que ejecuta `signOut()`.
4. `BottomNav` visible en todas las rutas: 3 ítems, ítem activo determinado por ruta actual.
5. `router.tsx` define todas las rutas de la app; rutas `/admin/*` (excepto login) envueltas en `ProtectedRoute`.
6. `main.tsx` envuelve en `AuthProvider` → `QueryClientProvider` → `RouterProvider`.
7. `lang="es"` en `<html>` y `pb-20` en body para clearance del bottom nav.

## Tasks / Subtasks

- [ ] Task 1 — Router con todas las rutas (AC: 5)
  - [ ] Crear `src/router.tsx` con `createBrowserRouter` y las 12 rutas
  - [ ] Crear páginas placeholder vacías para cada ruta (se implementan en epics 2 y 3)
  - [ ] Envolver rutas `/admin/*` (excepto `/admin/login`) en `<ProtectedRoute>`

- [ ] Task 2 — Providers en main.tsx (AC: 6)
  - [ ] Actualizar `src/main.tsx` con la cadena de providers correcta
  - [ ] Crear `QueryClient` con configuración por defecto

- [ ] Task 3 — Componente TopAppBar (AC: 1, 2, 3)
  - [ ] Crear `src/components/TopAppBar.tsx`
  - [ ] Implementar comportamiento diferenciado público/admin

- [ ] Task 4 — Componente BottomNav (AC: 4, 7)
  - [ ] Crear `src/components/BottomNav.tsx`
  - [ ] Usar `useLocation()` para determinar ítem activo
  - [ ] Agregar `pb-safe` para iOS y `-webkit-tap-highlight-color: transparent`

- [ ] Task 5 — Layout wrapper y App.tsx (AC: 7)
  - [ ] Actualizar `src/App.tsx` para incluir `TopAppBar`, `<Outlet>` y `BottomNav`
  - [ ] Verificar `lang="es"` en `index.html` y `pb-20` en body

## Dev Notes

### Prerequisito

Story 1.5 completada — `AuthContext`, `useAuth`, `ProtectedRoute` existen.
Story 1.1 completada — Tailwind tokens disponibles.

### `src/main.tsx`

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import { router } from './router'
import './index.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
)
```

### `src/router.tsx`

```tsx
import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import App from './App'

// Pages — placeholders vacíos hasta Epic 2 y 3
import { HomePage } from './pages/HomePage'
import { SeriePage } from './pages/SeriePage'
import { JornadaPage } from './pages/JornadaPage'
import { GlobalPage } from './pages/GlobalPage'
import { LoginPage } from './pages/admin/LoginPage'
import { DashboardPage } from './pages/admin/DashboardPage'
import { SeriesPage } from './pages/admin/SeriesPage'
import { ParejasPage } from './pages/admin/ParejasPage'
import { BaresPage } from './pages/admin/BaresPage'
import { JornadasPage } from './pages/admin/JornadasPage'
import { NuevoPartidoPage } from './pages/admin/NuevoPartidoPage'
import { EditarPartidoPage } from './pages/admin/EditarPartidoPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'series/:id', element: <SeriePage /> },
      { path: 'series/:id/jornadas/:jornada_id', element: <JornadaPage /> },
      { path: 'global', element: <GlobalPage /> },
      { path: 'admin/login', element: <LoginPage /> },
      {
        path: 'admin',
        element: <ProtectedRoute><DashboardPage /></ProtectedRoute>,
      },
      {
        path: 'admin/series',
        element: <ProtectedRoute><SeriesPage /></ProtectedRoute>,
      },
      {
        path: 'admin/parejas',
        element: <ProtectedRoute><ParejasPage /></ProtectedRoute>,
      },
      {
        path: 'admin/bares',
        element: <ProtectedRoute><BaresPage /></ProtectedRoute>,
      },
      {
        path: 'admin/jornadas',
        element: <ProtectedRoute><JornadasPage /></ProtectedRoute>,
      },
      {
        path: 'admin/partidos/nuevo',
        element: <ProtectedRoute><NuevoPartidoPage /></ProtectedRoute>,
      },
      {
        path: 'admin/partidos/:id/editar',
        element: <ProtectedRoute><EditarPartidoPage /></ProtectedRoute>,
      },
    ],
  },
])
```

### `src/App.tsx`

```tsx
import { Outlet } from 'react-router-dom'
import { TopAppBar } from './components/TopAppBar'
import { BottomNav } from './components/BottomNav'

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <TopAppBar />
      <main className="pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
```

### `src/components/TopAppBar.tsx`

```tsx
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

export function TopAppBar() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login'

  async function handleAccountClick() {
    if (isAdmin && session) {
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
        <span className="font-condensed text-headline-lg-mobile text-primary font-bold">Retruco</span>
      </div>
      <button
        onClick={handleAccountClick}
        className="w-10 h-10 flex items-center justify-center text-primary active:scale-95 transition-transform"
        aria-label={isAdmin && session ? 'Cerrar sesión' : 'Ir al panel de administración'}
      >
        <span className="material-symbols-outlined">account_circle</span>
      </button>
    </header>
  )
}
```

### `src/components/BottomNav.tsx`

```tsx
import { Link, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', icon: 'home', label: 'Inicio' },
  { to: '/global', icon: 'leaderboard', label: 'Tabla Global' },
  { to: '/admin', icon: 'admin_panel_settings', label: 'Admin' },
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
      style={{ boxShadow: '0px -4px 12px rgba(0,0,0,0.1)', borderRadius: '12px 12px 0 0' }}
    >
      <ul className="flex h-full items-center justify-around pb-safe" style={{ WebkitTapHighlightColor: 'transparent' }}>
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
                <span className={`material-symbols-outlined ${active ? 'font-variation-settings-filled' : ''}`}>
                  {icon}
                </span>
                <span className="text-label-sm font-semibold">{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
```

### Páginas placeholder

Crear un placeholder simple para cada página que aún no se implementa. Ejemplo:

```tsx
// src/pages/HomePage.tsx
export function HomePage() {
  return <div className="p-md">Home — próximamente</div>
}
```

Crear el mismo patrón para: `SeriePage`, `JornadaPage`, `GlobalPage`, y todas las páginas admin. Se reemplazarán en Epic 2 y 3.

### Nota sobre Material Symbols

Google Fonts Material Symbols se carga en `index.html` en Story 1.1 (ya incluido). El ícono filled vs outlined se controla via `font-variation-settings`:

```html
<!-- En index.html, agregar junto a las otras fuentes -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
```

Si no se agregó en Story 1.1, agregarlo ahora en `index.html`.

### Anti-patterns a evitar

- ❌ No poner la lógica de `signOut()` directamente en `TopAppBar` llamando a `supabase` — en este caso está permitido porque es el único lugar y `supabase` ya está importado via `lib/supabase.ts`
- ❌ No usar `window.location.href` para navegar — usar `useNavigate()` de React Router
- ❌ No hardcodear el estado activo del nav — usar `useLocation()`
- ❌ No usar `window.confirm()` para logout — es una acción no destructiva, no necesita confirmación

### Project Structure Notes

```
src/
  main.tsx            ← ACTUALIZADO (providers)
  App.tsx             ← ACTUALIZADO (shell layout)
  router.tsx          ← NUEVO (todas las rutas)
  components/
    TopAppBar.tsx     ← NUEVO
    BottomNav.tsx     ← NUEVO
  pages/
    HomePage.tsx      ← NUEVO (placeholder)
    SeriePage.tsx     ← NUEVO (placeholder)
    JornadaPage.tsx   ← NUEVO (placeholder)
    GlobalPage.tsx    ← NUEVO (placeholder)
    admin/
      LoginPage.tsx       ← NUEVO (placeholder)
      DashboardPage.tsx   ← NUEVO (placeholder)
      SeriesPage.tsx      ← NUEVO (placeholder)
      ParejasPage.tsx     ← NUEVO (placeholder)
      BaresPage.tsx       ← NUEVO (placeholder)
      JornadasPage.tsx    ← NUEVO (placeholder)
      NuevoPartidoPage.tsx   ← NUEVO (placeholder)
      EditarPartidoPage.tsx  ← NUEVO (placeholder)
```

### Referencias

- [Source: architecture.md#D9, D10] — State management y route protection
- [Source: EXPERIENCE.md#Component Patterns — Top App Bar] — Especificación UX-DR2
- [Source: EXPERIENCE.md#Component Patterns — Bottom Navigation] — Especificación UX-DR3
- [Source: DESIGN.md#components.top-app-bar] — Tokens visuales del TopAppBar
- [Source: DESIGN.md#components.bottom-nav] — Tokens visuales del BottomNav

## Dev Agent Record

### Agent Model Used

_pending_

### Debug Log References

### Completion Notes List

### File List

- `src/main.tsx`
- `src/App.tsx`
- `src/router.tsx`
- `src/components/TopAppBar.tsx`
- `src/components/BottomNav.tsx`
- `src/pages/HomePage.tsx`
- `src/pages/SeriePage.tsx`
- `src/pages/JornadaPage.tsx`
- `src/pages/GlobalPage.tsx`
- `src/pages/admin/LoginPage.tsx`
- `src/pages/admin/DashboardPage.tsx`
- `src/pages/admin/SeriesPage.tsx`
- `src/pages/admin/ParejasPage.tsx`
- `src/pages/admin/BaresPage.tsx`
- `src/pages/admin/JornadasPage.tsx`
- `src/pages/admin/NuevoPartidoPage.tsx`
- `src/pages/admin/EditarPartidoPage.tsx`
