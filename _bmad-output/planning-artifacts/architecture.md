---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 8
status: 'complete'
completedAt: '2026-06-07'
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-retruco-2026-06-06/prd.md
  - _bmad-output/planning-artifacts/briefs/brief-retruco-2026-06-06/brief.md
  - _bmad-output/planning-artifacts/ux-designs/ux-retruco-2026-06-06/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-retruco-2026-06-06/EXPERIENCE.md
workflowType: 'architecture'
project_name: 'retruco'
user_name: 'Enzo'
date: '2026-06-07'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
5 feature groups / ~30 FRs:
- **F1 (Auth):** Login de admins con email+password, sesión persistente, cierre manual. Sin auto-registro; cuentas predefinidas.
- **F2 (Gestión de entidades):** CRUD completo para Series, Parejas, Jornadas. Desactivación lógica conserva historial.
- **F3 (Carga de partidos):** Ingreso manual de tantos, determinación automática de ganador, recálculo en cascada de tabla.
- **F4 (Tablas públicas):** Standings por serie (10 columnas) + tabla global (pareja aparece una vez, mejor serie). 5 criterios de desempate en cascada.
- **F5 (Consulta pública):** Jornadas y resultados visibles sin login. Navegación por serie.

**Non-Functional Requirements:**
- NFR-001: Mobile-first, 375px+, sin scroll horizontal en tablas
- NFR-002: < 3s en 4G, hasta 30 parejas sin degradación
- NFR-003: $0/mes en MVP (hard constraint)
- NFR-004: Frontend React desacoplado del backend
- NFR-005: Solo nombre+apellido expuestos públicamente
- NFR-006: ~200 usuarios concurrentes en vistas públicas; escrituras admin excepcionales
- NFR-007: UI moderna, identidad Truco uruguayo
- NFR-008: Panel admin usable sin documentación; confirmación en acciones destructivas

**Scale & Complexity:**
- Primary domain: Full-stack web (React SPA + Supabase BaaS)
- Complexity level: Baja-Media
- Estimated architectural components: 7 (Frontend SPA, Router + Auth guard, UI component layer, Data access layer, Supabase DB + RLS, Standings calculator, Hosting/CI)

### Technical Constraints & Dependencies

- **Frontend:** React (Vite o Next.js), TailwindCSS, Material Symbols — definido en UX specs
- **BaaS:** Supabase (PostgreSQL + Auth integrada) — decisión D-1 del PRD
- **Hosting:** Vercel o Netlify free tier — URL gratuita para MVP (PRD D-4)
- **Presupuesto:** $0/mes — condiciona cada decisión de infra
- **Vendor lock-in:** Frontend no puede quedar atado a proveedor específico

### Cross-Cutting Concerns Identified

1. **Auth guard** — todas las rutas `/admin/*` requieren sesión activa; redirect a login si no autenticado
2. **Standings recalculation** — trigger o RPC en Supabase garantiza consistencia; nunca en frontend
3. **Row-Level Security** — SELECT público en tablas de lectura; INSERT/UPDATE/DELETE solo con JWT admin
4. **Error + loading states** — skeleton loaders, toasts de error, confirmación en destructivas
5. **Responsive layout** — cada componente mobile-first; bottom nav fijo en todos los breakpoints en MVP

### Open Items from UX Review (Party Mode)

- Validar tabla de 10 columnas en 375px en dispositivo real (riesgo técnico de implementación)
- Definir estado del formulario de partido durante guardado (spinner, bloqueo de stepper)
- Aclarar invalidación de datos post-save en flujo admin (¿redirect o refetch automático?)
- Stepper en desktop: ¿readonly o editable con teclado?
- Columna "Serie" en tabla global: ¿link navegable a la serie o solo texto?

## Starter Template Evaluation

### Primary Technology Domain

Full-stack web (React SPA + Supabase BaaS) — stack definido por PRD (D-1) y UX specs.

### Starter Options Considered

- **Vite + React TS** — SPA puro, sin SSR, mínima complejidad, totalmente desacoplado
- **Next.js** — SSR/App Router incluido, Tailwind en 1 comando, pero complejidad innecesaria para este proyecto y coupling parcial a Vercel

### Selected Starter: Vite + React TypeScript

**Rationale for Selection:**
Retruco no necesita SSR (no hay SEO crítico para una liga local) ni API routes (Supabase client cubre todo). Next.js añadiría complejidad de server/client components sin retorno real. Vite es más predecible, cumple NFR-004 (desacoplamiento), y es más simple para implementación por agentes AI.

**Initialization Command:**

```bash
npm create vite@latest retruco -- --template react-ts
cd retruco
npm install
npm install -D tailwindcss @tailwindcss/vite
npm install @supabase/supabase-js react-router-dom
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
TypeScript estricto. `tsconfig.json` preconfigurado con paths y strict mode.

**Styling Solution:**
TailwindCSS v4 con plugin oficial de Vite (`@tailwindcss/vite`) — sin postcss config separado. Tokens del DESIGN.md se implementan como extensión del theme en `tailwind.config.ts`.

**Build Tooling:**
Vite 6 — HMR instantáneo en desarrollo, build optimizado con Rollup para producción. Output en `dist/`.

**Testing Framework:**
Vitest (se agrega en step de decisiones — compatible nativo con Vite, sin config adicional).

**Code Organization:**
```
src/
  components/     ← UI components reutilizables
  pages/          ← Componentes de ruta (Home, Serie, Jornada, Global, Admin/*)
  hooks/          ← Custom hooks (useAuth, useStandings, etc.)
  lib/            ← supabase client, utils
  types/          ← TypeScript interfaces del dominio
```

**Development Experience:**
ESLint + TypeScript ESLint incluidos. React Router v7 para routing SPA con rutas protegidas.

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- D1: Standings recalculation via PostgreSQL function + trigger
- D4: RLS policies (anon SELECT / authenticated write)
- D9: State management (TanStack Query + local state + AuthContext)
- D10: Route protection via `<ProtectedRoute>` component

**Important Decisions (Shape Architecture):**
- D2: TanStack Query v5 para data fetching y caché
- D7: Capa de acceso a datos en `src/lib/queries.ts`
- D11: Vercel para hosting frontend
- D13: Variables de entorno via `.env.local` / Vercel dashboard

**Deferred Decisions (Post-MVP):**
- Testing framework (Vitest) — se configura en implementación
- Monitoring / logging — no requerido en MVP
- Custom domain — PRD D-4: URL gratuita es suficiente

### Data Architecture

**D1 — Standings Recalculation**
- **Decision:** PostgreSQL function + trigger en Supabase
- **Rationale:** Consistencia atómica garantizada en DB. La lógica de 5 criterios de desempate en cascada y tabla global vive en SQL, versionada como migración. Nunca en el cliente.
- **Affects:** `supabase/migrations/`, todos los componentes de tabla

**D2 — Client Data Fetching**
- **Decision:** TanStack Query v5 (`@tanstack/react-query@5.101.0`)
- **Rationale:** `invalidateQueries(['standings', serieId])` post-mutación resuelve el refetch automático de tabla en 1 línea. Loading/error states uniformes en todos los hooks.
- **Affects:** Todos los hooks de datos en `src/hooks/`

**D3 — Migrations**
- **Decision:** Supabase CLI — `supabase migration new` + `supabase db push`
- **Rationale:** Migraciones versionadas en `supabase/migrations/`. Historia completa del schema en el repo.
- **Affects:** `supabase/` folder en la raíz del proyecto

### Authentication & Security

**D4 — Row-Level Security**
- **Decision:** Políticas RLS en todas las tablas: `SELECT` para rol `anon`, `INSERT/UPDATE/DELETE` solo para rol `authenticated`
- **Rationale:** Modelo simple que cumple NFR-005. Todos los admins tienen mismos permisos en MVP (PRD).
- **Affects:** `supabase/migrations/` (políticas SQL)

**D5 — Sesión Admin**
- **Decision:** Supabase Auth maneja JWT en `localStorage` automáticamente vía `supabase-js`. Sin configuración adicional.
- **Affects:** `src/lib/supabase.ts`, `src/context/AuthContext.tsx`

**D6 — Creación de cuentas admin**
- **Decision:** Directamente desde Supabase dashboard. Sin UI de registro en la app.
- **Rationale:** Número fijo y pequeño de admins en MVP (PRD FR-005).

### API & Communication Patterns

**D7 — Data Access Layer**
- **Decision:** Funciones helper en `src/lib/queries.ts` encapsulan llamadas a Supabase. Los componentes y hooks solo importan de `queries.ts`, nunca el cliente Supabase directamente.
- **Rationale:** Mínima abstracción que cumple NFR-004 sin sobreingenieria. Facilita cambio de backend en el futuro.
- **Affects:** Toda la capa de datos

**D8 — Error Handling**
- **Decision:** Errores de Supabase bubblean a TanStack Query → componentes consumen `error` del hook → toast via `AuthContext` o estado local del componente padre.
- **Affects:** Todos los componentes con llamadas async

### Frontend Architecture

**D9 — State Management**
- **Decision:** TanStack Query para server state + `useState` para UI state efímero + `AuthContext` (React Context) para sesión de usuario. Sin Zustand en MVP.
- **Rationale:** El scope del proyecto no justifica un store global. TanStack Query elimina la necesidad de Redux/Zustand para datos remotos.
- **Affects:** `src/context/`, `src/hooks/`

**D10 — Route Protection**
- **Decision:** Componente `<ProtectedRoute>` que envuelve rutas `/admin/*`. Lee sesión desde `AuthContext`; redirige a `/admin/login` si no autenticado.
- **Affects:** `src/router.tsx`, `src/components/ProtectedRoute.tsx`

### Infrastructure & Deployment

**D11 — Hosting**
- **Decision:** Vercel para frontend (free tier)
- **Rationale:** Deploy automático desde Git, preview URLs por PR, zero config para Vite, cumple NFR-003.

**D12 — CI/CD**
- **Decision:** Push a `main` → Vercel despliega automáticamente. Sin pipeline adicional en MVP.
- **Rationale:** Suficiente para el equipo pequeño y escala acotada del MVP.

**D13 — Environment Variables**
- **Decision:** `.env.local` en desarrollo (git-ignorado), variables en Vercel dashboard para producción.
- **Variables:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

### Decision Impact Analysis

**Implementation Sequence:**
1. Inicializar repo Vite + instalar dependencias
2. Configurar Supabase CLI + schema inicial + RLS
3. Implementar PostgreSQL function de standings
4. Configurar cliente Supabase + AuthContext
5. Implementar React Router + ProtectedRoute
6. Configurar TanStack Query + queries helpers
7. Construir componentes UI (tabla, cards, stepper)
8. Conectar vistas públicas a data layer
9. Construir panel admin + formularios
10. Deploy a Vercel

**Cross-Component Dependencies:**
- Auth guard depende de `AuthContext` que depende del cliente Supabase
- Toda la UI de tabla depende de la PostgreSQL function de standings
- TanStack Query `invalidateQueries` depende de que el trigger DB recalcule antes de que el refetch ocurra (casi instantáneo en Supabase)

## Implementation Patterns & Consistency Rules

### Naming Patterns

**Database Naming Conventions (PostgreSQL / Supabase):**
- Tablas: `snake_case` plural (`series`, `partidos`, `jornadas`, `parejas`)
- Columnas: `snake_case` singular descriptivo (`jornada_id`, `tantos_p1`, `activo`)
- Foreign keys: `{tabla_singular}_id` (`serie_id`, `jornada_id`, `pareja_id`)
- Índices: `idx_{tabla}_{columna}` (`idx_partidos_jornada_id`)

```sql
-- ✅ Correcto
CREATE TABLE partidos (
  id uuid PRIMARY KEY,
  jornada_id uuid REFERENCES jornadas(id),
  pareja_1_id uuid REFERENCES parejas(id),
  tantos_p1 int NOT NULL
);
-- ❌ Incorrecto: Partido, partido, ParejasId
```

**TypeScript Interface Naming:** `snake_case` matching Supabase — sin mapeo innecesario

```ts
// ✅ Interfaces en snake_case (matching DB)
interface Partido {
  id: string
  jornada_id: string
  pareja_1_id: string
  tantos_p1: number
  activo: boolean
}
// ❌ camelCase que requiere transformación: jornadaId, tantosP1
```

**TypeScript Code Naming:**
- Componentes React: `PascalCase` (`SerieCard`, `StandingsTable`)
- Custom hooks: `camelCase` con prefijo `use` (`useStandings`, `useAuth`)
- Funciones helper / queries: `camelCase` (`getStandings`, `crearPartido`)
- Variables: `camelCase` (`serieId`, `queryClient`)
- Contextos: `PascalCase` sufijo `Context` (`AuthContext`)

**File Naming:**
- Componentes: `PascalCase.tsx` (`SerieCard.tsx`, `ProtectedRoute.tsx`)
- Pages: `PascalCase` sufijo `Page.tsx` (`HomePage.tsx`, `LoginPage.tsx`)
- Hooks: `camelCase.ts` (`useStandings.ts`)
- Utilities/lib: `camelCase.ts` (`queries.ts`, `supabase.ts`)
- Tests: co-locados, mismo nombre + `.test.tsx` (`SerieCard.test.tsx`)

### Structure Patterns

**Project Organization:**
```
src/
  components/       ← UI reutilizable sin lógica de negocio
  pages/            ← 1 archivo por ruta; admin/ subfolder
  hooks/            ← custom hooks (datos + lógica)
  lib/
    supabase.ts     ← cliente singleton (ÚNICO punto de entrada a Supabase)
    queries.ts      ← TODAS las llamadas a Supabase aquí
  context/
    AuthContext.tsx ← sesión admin
  types/
    index.ts        ← interfaces del dominio
  router.tsx        ← definición completa de rutas
  main.tsx
supabase/
  migrations/       ← SQL versionado (schema + RLS + functions)
```

**Regla crítica:** Ningún componente importa `supabase` directamente. Solo `queries.ts` lo importa.

### Format Patterns

**TanStack Query — query keys:**
```ts
// Patrón: ['entidad', ...params]
['series']                    // lista completa
['serie', serieId]            // entidad individual
['standings', serieId]        // computed/view
['jornadas', serieId]
['partidos', jornadaId]
['global-standings']
```

**Supabase error handling en queries.ts:**
```ts
// ✅ Patrón estándar — siempre throw, TanStack Query captura
export async function getStandings(serieId: string) {
  const { data, error } = await supabase
    .from('standings_serie')
    .select('*')
    .eq('serie_id', serieId)
  if (error) throw error
  return data
}
```

**Fechas:** ISO strings en DB. Formato display con `Intl.DateTimeFormat('es-UY')` en componente. Nunca librerías de fecha externas en MVP.

### Communication Patterns

**Mutación estándar — patrón obligatorio:**
```ts
const mutation = useMutation({
  mutationFn: (data: NuevoPartidoInput) => crearPartido(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['standings', serieId] })
    queryClient.invalidateQueries({ queryKey: ['partidos', jornadaId] })
  },
  onError: (error) => {
    // mostrar toast — implementación según componente padre
  },
})
```

**Auth state:** Solo vía `useAuth()` hook que consume `AuthContext`. Nunca leer `supabase.auth` directamente en componentes.

### Process Patterns

**Loading states:** Skeleton siempre — no spinners, no texto `"Cargando..."`
```tsx
if (isLoading) return <StandingsSkeleton />   // ✅
if (isLoading) return <Spinner />              // ❌
if (isLoading) return <div>Cargando...</div>  // ❌
```

**Error states:** Propagar a TanStack Query, mostrar mensaje via componente `<ErrorMessage error={error} />`

**Confirmaciones destructivas:** Bottom sheet con dos botones. Nunca `window.confirm()` ni `alert()`.

**Validación de formularios:** Al submit únicamente. El CTA se mantiene habilitado siempre. Errores bajo el campo con `text-red-600 text-xs`.

### Enforcement Guidelines

**Todo agente AI DEBE:**
- Colocar TODA llamada a Supabase en `src/lib/queries.ts`
- Usar `snake_case` en interfaces TypeScript que mapean tablas
- Usar TanStack Query para cualquier fetch — nunca `useEffect + fetch` manual
- Nombrar query keys como array `['entidad', ...params]`
- Envolver rutas `/admin/*` nuevas en `<ProtectedRoute>`
- Usar skeleton loaders, no spinners
- Tipar todos los parámetros de funciones — no `any`

**Anti-patterns prohibidos:**
```ts
// ❌ Supabase directo en componente
useEffect(() => { supabase.from('series').select('*').then(...) }, [])

// ❌ fetch manual
useEffect(() => { fetch('/api/series').then(...) }, [])

// ❌ any type
function crearPartido(data: any) { ... }

// ❌ window.confirm en destructivas
if (window.confirm('¿Eliminar?')) deleteItem()
```

## Project Structure & Boundaries

### Complete Project Directory Structure

```
retruco/
├── README.md
├── package.json
├── vite.config.ts
├── tailwind.config.ts          ← tokens de DESIGN.md como extensión del theme
├── tsconfig.json
├── tsconfig.app.json
├── .env.local                  ← no commiteado (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
├── .env.example                ← commiteado con keys vacías
├── .gitignore
├── index.html
├── src/
│   ├── main.tsx                ← QueryClientProvider + RouterProvider + AuthProvider
│   ├── App.tsx
│   ├── router.tsx              ← definición de TODAS las rutas
│   ├── index.css               ← @import "tailwindcss"
│   ├── components/             ← UI reutilizable, sin lógica de negocio
│   │   ├── TopAppBar.tsx
│   │   ├── BottomNav.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── SerieCard.tsx
│   │   ├── StandingsTable.tsx
│   │   ├── StandingsSkeleton.tsx
│   │   ├── JornadaCard.tsx
│   │   ├── MatchResultRow.tsx
│   │   ├── ScoreStepper.tsx
│   │   ├── WinnerPreview.tsx
│   │   ├── StatusChip.tsx
│   │   ├── ErrorMessage.tsx
│   │   └── ConfirmSheet.tsx    ← bottom sheet confirmaciones destructivas
│   ├── pages/
│   │   ├── HomePage.tsx        ← /                              F5
│   │   ├── SeriePage.tsx       ← /series/:id (tabla + tabs)     F4
│   │   ├── JornadaPage.tsx     ← /series/:id/jornadas/:id       F5
│   │   ├── GlobalPage.tsx      ← /global                        F4
│   │   └── admin/
│   │       ├── LoginPage.tsx           ← /admin/login                F1
│   │       ├── DashboardPage.tsx       ← /admin                      F2
│   │       ├── SeriesPage.tsx          ← /admin/series               F2
│   │       ├── ParejasPage.tsx         ← /admin/parejas              F2
│   │       ├── ~~BaresPage.tsx~~       ← ~~/admin/bares~~            ~~F2~~ [DEPRECADO]
│   │       ├── JornadasPage.tsx        ← /admin/jornadas             F2
│   │       ├── NuevoPartidoPage.tsx    ← /admin/partidos/nuevo       F3
│   │       └── EditarPartidoPage.tsx   ← /admin/partidos/:id/editar  F3
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useSeries.ts
│   │   ├── useStandings.ts
│   │   ├── useGlobalStandings.ts
│   │   ├── useJornadas.ts
│   │   ├── useJornada.ts
│   │   ├── usePartidos.ts
│   │   └── mutations/
│   │       ├── usePartidoMutation.ts
│   │       ├── useSerieMutation.ts
│   │       ├── useParejaMutation.ts
│   │       └── useJornadaMutation.ts
│   ├── lib/
│   │   ├── supabase.ts         ← cliente singleton (ÚNICO import de supabase-js)
│   │   └── queries.ts          ← TODAS las funciones de acceso a datos
│   ├── context/
│   │   └── AuthContext.tsx
│   └── types/
│       └── index.ts            ← interfaces del dominio (snake_case matching DB)
├── supabase/
│   ├── config.toml
│   └── migrations/
│       ├── 001_schema.sql          ← tablas, foreign keys, indexes
│       ├── 002_rls_policies.sql    ← políticas anon/authenticated
│       └── 003_standings_fn.sql    ← function + trigger recálculo (D1)
└── public/
    └── favicon.svg
```

### Architectural Boundaries

**Data Boundary:**
```
Supabase DB
    ↕ supabase.ts (singleton cliente)
    ↕ queries.ts (todas las queries y mutaciones)
    ↕ hooks/ (TanStack Query — cache + loading/error)
    ↕ pages/ y components/ (React UI)
```
`queries.ts` es el único archivo que importa `supabase`. Ningún componente o hook cruza este límite directamente.

**Auth Boundary:**
`AuthContext.tsx` → `useAuth()` hook → componentes. `ProtectedRoute.tsx` aplica guard en rutas `/admin/*`. Nada más lee `supabase.auth` directamente.

**Business Logic Boundary:**
Toda la lógica de negocio (recalculo de standings, criterios de desempate, tabla global) vive en `supabase/migrations/003_standings_fn.sql`. El frontend solo lee vistas/resultados — nunca reimplementa reglas de negocio.

### Requirements to Structure Mapping

| Grupo FR | Archivos principales |
|---|---|
| **F1 Auth** | `LoginPage`, `AuthContext`, `useAuth`, `ProtectedRoute` |
| **F2 CRUD entidades** | `admin/*Page`, `hooks/mutations/*`, queries CRUD en `queries.ts`, `001_schema.sql` |
| **F3 Carga partidos** | `NuevoPartidoPage`, `EditarPartidoPage`, `ScoreStepper`, `WinnerPreview`, `usePartidoMutation` |
| **F4 Tablas públicas** | `SeriePage`, `GlobalPage`, `StandingsTable`, `useStandings`, `useGlobalStandings`, `003_standings_fn.sql` |
| **F5 Consulta pública** | `HomePage`, `JornadaPage`, `SerieCard`, `JornadaCard`, `MatchResultRow`, `useSeries`, `useJornadas` |

**Cross-Cutting Concerns:**

| Concern | Ubicación |
|---|---|
| Auth guard | `ProtectedRoute.tsx` + `AuthContext.tsx` |
| RLS / seguridad | `002_rls_policies.sql` |
| Recálculo standings | `003_standings_fn.sql` (trigger PostgreSQL) |
| Loading states | Skeleton components en `components/` |
| Error states | `ErrorMessage.tsx` + `onError` en mutations |
| Confirmaciones destructivas | `ConfirmSheet.tsx` |
| Design tokens | `tailwind.config.ts` |

### Integration Points

**Internal Communication:**
- Pages consumen hooks vía imports directos
- Hooks usan TanStack Query (`useQuery` / `useMutation`) con funciones de `queries.ts`
- `main.tsx` provee `QueryClientProvider`, `RouterProvider`, `AuthContext.Provider`

**External Integrations:**
- Supabase: base de datos, auth, API REST auto-generada
- Vercel: hosting, CI/CD automático desde Git
- Google Fonts: Barlow Condensed + Inter (cargadas en `index.html`)
- Material Symbols: íconos (cargados en `index.html`)

**Data Flow:**
```
Usuario interactua → Componente → Hook (useMutation)
  → queries.ts → Supabase API
  → PostgreSQL trigger recalcula standings
  → onSuccess: invalidateQueries(['standings', serieId])
  → TanStack Query refetch → UI actualizada
```

### Development Workflow Integration

**Development:** `npm run dev` inicia Vite dev server en `localhost:5173`. Variables desde `.env.local`.

**Build:** `npm run build` genera `dist/` optimizado. Vercel ejecuta este comando en cada deploy.

**Supabase local:** `supabase start` levanta instancia local para desarrollo. `supabase db push` aplica migraciones.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
React 19 + Vite 6 + TailwindCSS v4 (`@tailwindcss/vite`) + React Router v7 + TanStack Query v5.101 + supabase-js v2.107 — sin conflictos de versiones. Todas las bibliotecas son estables y activamente mantenidas.

**Pattern Consistency:**
`snake_case` en interfaces TypeScript + query keys `['entidad', ...params]` + funciones en `queries.ts` son internamente consistentes. El patrón de mutación estándar es coherente con TanStack Query v5 API (`useMutation` con `onSuccess`/`onError`).

**Structure Alignment:**
El árbol del proyecto soporta todos los patrones definidos. Los tres límites (data, auth, business logic) son mutuamente exclusivos. `main.tsx` como punto de envoltura de providers sigue el patrón estándar de React.

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:**

| Grupo | Estado | Soporte arquitectónico |
|---|---|---|
| F1 Auth | ✅ Cubierto | `LoginPage` + `AuthContext` + `ProtectedRoute` + Supabase Auth |
| F2 CRUD | ✅ Cubierto | `admin/*Page` + `hooks/mutations/*` + `queries.ts` + `001_schema.sql` |
| F3 Partidos | ✅ Cubierto | `NuevoPartidoPage` + `ScoreStepper` + `WinnerPreview` + trigger DB |
| F4 Tablas | ✅ Cubierto | `SeriePage` + `GlobalPage` + `StandingsTable` + `003_standings_fn.sql` |
| F5 Consulta | ✅ Cubierto | `HomePage` + `JornadaPage` + `SerieCard` + `MatchResultRow` |

**Non-Functional Requirements Coverage:**

| NFR | Estado | Mecanismo |
|---|---|---|
| NFR-001 Mobile-first 375px | ✅ | TailwindCSS mobile-first + DESIGN.md tokens |
| NFR-002 < 3s en 4G | ✅ | Vite build optimizado + TanStack Query caché |
| NFR-003 $0/mes | ✅ | Vercel free + Supabase free tier |
| NFR-004 Frontend desacoplado | ✅ | `queries.ts` abstraction layer + Vite |
| NFR-005 Solo nombre+apellido | ✅ | RLS `002_rls_policies.sql` |
| NFR-006 ~200 concurrent | ✅ | Supabase free tier soporta esta escala |
| NFR-007 UI moderna | ✅ | DESIGN.md + TailwindCSS + Material Symbols |
| NFR-008 Admin intuitivo | ✅ | EXPERIENCE.md + `ConfirmSheet` + patrones de validación |

### Implementation Readiness Validation ✅

**Decision Completeness:** Todas las decisiones críticas documentadas con versiones exactas. 13 decisiones (D1–D13) con rationale y archivos afectados.

**Structure Completeness:** Árbol completo con 30+ archivos específicos, mapeo FR→archivo, y flujo de datos documentado.

**Pattern Completeness:** Ejemplos de código para todos los patrones críticos. Anti-patterns explícitos definidos.

### Gap Analysis Results

**Brechas importantes (no bloqueantes):**
- Schema SQL exacto de tablas — se detalla en stories de implementación (Epic DB Setup). Agente lee PRD para entidades.
- Lógica SQL de 5 criterios de desempate — en PRD (F4). Se implementa en `003_standings_fn.sql`.
- 5 Open Items de UX (tabla 10 col en 375px, stepper desktop, etc.) — se resuelven en stories de implementación.

**Brechas menores (post-MVP):**
- Testing strategy (Vitest) — diferida
- Diagrama entidad-relación — útil pero no crítico
- Monitoring / logging — post-MVP

### Architecture Completeness Checklist

**Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** Alta — 16/16 checklist items completos, 0 brechas críticas.

**Key Strengths:**
- Stack minimalista y coherente con las restricciones del proyecto ($0, desacoplamiento)
- Lógica de negocio crítica (standings) confinada a la DB — frontend no puede corromperse
- Límites arquitectónicos claros que previenen conflictos entre agentes AI
- Mapeo completo FR → archivo facilita la creación de epics/stories

**Areas for Future Enhancement:**
- Testing automatizado con Vitest (post-MVP)
- Diagrama ER del schema de DB
- Estrategia de monitoring (Sentry free tier)
- Custom domain (post-launch)

### Implementation Handoff

**AI Agent Guidelines:**
- Seguir todas las decisiones arquitectónicas exactamente como están documentadas
- Usar los patrones de implementación consistentemente en todos los componentes
- Respetar los límites del proyecto: `queries.ts` es el único punto de entrada a Supabase
- Consultar este documento ante cualquier decisión arquitectónica
- Los Open Items de UX deben resolverse al implementar la story correspondiente

**First Implementation Priority:**
```bash
npm create vite@latest retruco -- --template react-ts
cd retruco
npm install
npm install -D tailwindcss @tailwindcss/vite
npm install @supabase/supabase-js react-router-dom @tanstack/react-query
```
Luego: `supabase init` + `001_schema.sql`
