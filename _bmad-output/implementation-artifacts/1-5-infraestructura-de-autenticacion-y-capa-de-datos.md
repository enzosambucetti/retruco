# Story 1.5: Infraestructura de autenticación y capa de datos

Status: review

## Story

As a developer,
I want the Supabase client, AuthContext, and data access layer scaffolded,
so that all subsequent stories can import these without duplication or conflict.

## Acceptance Criteria

1. `src/lib/supabase.ts` exporta un único cliente Supabase singleton.
2. `src/lib/queries.ts` importa el cliente de `supabase.ts` y es el ÚNICO archivo que importa `@supabase/supabase-js`.
3. `src/context/AuthContext.tsx` provee `{ session, user, loading }` via `supabase.auth.onAuthStateChange`.
4. `src/hooks/useAuth.ts` expone el contexto con hook `useAuth()`.
5. `src/components/ProtectedRoute.tsx` redirige a `/admin/login` si `session` es null.
6. `src/types/index.ts` define las interfaces TypeScript del dominio en `snake_case`.

## Tasks / Subtasks

- [ ] Task 1 — Cliente Supabase singleton (AC: 1, 2)
  - [ ] Crear `src/lib/supabase.ts` con `createClient()` usando variables de entorno
  - [ ] Crear `src/lib/queries.ts` vacío (scaffold) que importa `supabase` de `supabase.ts`

- [ ] Task 2 — Tipos del dominio (AC: 6)
  - [ ] Crear `src/types/index.ts` con interfaces de las 6 entidades

- [ ] Task 3 — AuthContext (AC: 3, 4)
  - [ ] Crear `src/context/AuthContext.tsx` con provider y onAuthStateChange
  - [ ] Crear `src/hooks/useAuth.ts` con hook que consume el contexto

- [ ] Task 4 — ProtectedRoute (AC: 5)
  - [ ] Crear `src/components/ProtectedRoute.tsx`
  - [ ] Verificar que redirige a `/admin/login` sin sesión activa

## Dev Notes

### Prerequisito

Story 1.1 completada — proyecto inicializado. Story 1.2 — tablas existen en Supabase.
`.env.local` creado con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` válidos.

### `src/lib/supabase.ts`

```ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Regla crítica:** Este es el ÚNICO archivo en todo el proyecto que importa `@supabase/supabase-js`. Ningún componente, hook ni página importa supabase directamente.

### `src/lib/queries.ts` (scaffold)

```ts
import { supabase } from './supabase'

// Las funciones de acceso a datos se agregan en cada story.
// Este archivo es el ÚNICO punto de entrada a Supabase desde el frontend.

export { supabase }
```

### `src/types/index.ts`

```ts
// Interfaces en snake_case, matching exacto con columnas de DB

export interface Bar {
  id: string
  nombre: string
  activo: boolean
  created_at: string
}

export interface Serie {
  id: string
  nombre: string
  dia_juego: string | null
  bar_id: string | null
  activo: boolean
  created_at: string
}

export interface Pareja {
  id: string
  jugador1_nombre: string
  jugador1_apellido: string
  jugador2_nombre: string
  jugador2_apellido: string
  activo: boolean
  created_at: string
}

export interface Inscripcion {
  id: string
  pareja_id: string
  serie_id: string
  activa: boolean
  created_at: string
}

export interface Jornada {
  id: string
  serie_id: string
  numero: number
  fecha: string
  activa: boolean
  created_at: string
}

export interface Partido {
  id: string
  jornada_id: string
  inscripcion1_id: string
  inscripcion2_id: string
  tantos1: number
  tantos2: number
  activo: boolean
  created_at: string
}

// Tipos para queries con joins
export interface SerieConBar extends Serie {
  bares: Bar | null
}

export interface StandingRow {
  inscripcion_id: string
  pareja_id: string
  nombre_pareja: string
  pj: number
  g: number
  p: number
  tf: number
  tc: number
  dif: number
  tantos: number
  pts: number
  posicion: number
}

export interface GlobalStandingRow extends StandingRow {
  serie_referencia_id: string
  serie_nombre: string
}
```

### `src/context/AuthContext.tsx`

```tsx
import { createContext, useContext, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextValue {
  session: Session | null
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ session, user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
```

### `src/hooks/useAuth.ts`

```ts
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export function useAuth() {
  return useContext(AuthContext)
}
```

### `src/components/ProtectedRoute.tsx`

```tsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()

  if (loading) return null  // evitar flash de redirect mientras carga sesión

  if (!session) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}
```

### Convenciones críticas

- `snake_case` en todas las interfaces TypeScript (matching DB columns)
- `camelCase` en variables de código (`serieId`, `queryClient`)
- `PascalCase` en componentes y contextos
- Ningún componente llama a `supabase` directamente — solo via `queries.ts`

### Anti-patterns a evitar

- ❌ No importar `@supabase/supabase-js` en ningún archivo excepto `supabase.ts`
- ❌ No usar `camelCase` en interfaces que mapean tablas (ej: `jornadaId` en lugar de `jornada_id`)
- ❌ No crear múltiples instancias de `createClient()` — singleton obligatorio
- ❌ No leer `supabase.auth` directamente en componentes — usar `useAuth()` hook

### Project Structure Notes

```
src/
  lib/
    supabase.ts     ← NUEVO (singleton client)
    queries.ts      ← NUEVO (scaffold vacío)
  context/
    AuthContext.tsx ← NUEVO
  hooks/
    useAuth.ts      ← NUEVO
  components/
    ProtectedRoute.tsx ← NUEVO
  types/
    index.ts        ← NUEVO
```

### Referencias

- [Source: architecture.md#D5] — Supabase Auth con JWT en localStorage
- [Source: architecture.md#D7] — Data Access Layer en queries.ts
- [Source: architecture.md#D9] — State management: TanStack Query + AuthContext
- [Source: architecture.md#D10] — Route protection via ProtectedRoute
- [Source: architecture.md#Enforcement Guidelines] — Reglas críticas de consistencia

## Dev Agent Record

### Agent Model Used

_pending_

### Debug Log References

### Completion Notes List

### File List

- `src/lib/supabase.ts`
- `src/lib/queries.ts`
- `src/types/index.ts`
- `src/context/AuthContext.tsx`
- `src/hooks/useAuth.ts`
- `src/components/ProtectedRoute.tsx`
