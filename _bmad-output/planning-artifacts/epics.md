---
stepsCompleted: [1, 2, 3, 4]
status: 'complete'
completedAt: '2026-06-07'
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-retruco-2026-06-06/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/ux-designs/ux-retruco-2026-06-06/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-retruco-2026-06-06/EXPERIENCE.md
---

# Retruco - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Retruco, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

FR-001: El sistema debe permitir que administradores inicien sesión con email y contraseña.
FR-002: El sistema debe mantener la sesión activa durante un período razonable sin requerir re-autenticación frecuente.
FR-003: El sistema debe permitir cerrar sesión manualmente.
FR-004: Toda operación de escritura debe requerir sesión activa de administrador.
FR-005: El sistema debe soportar múltiples administradores simultáneos con los mismos permisos.
FR-010: El sistema debe permitir crear una serie con nombre, día de juego y bar asociado.
FR-011: El nombre de una serie debe ser editable en cualquier momento.
FR-012: El sistema debe permitir desactivar una serie; las series desactivadas no aparecen en las vistas públicas pero conservan su historial completo.
FR-013: El panel de administración debe listar todas las series activas e inactivas.
FR-030: El sistema debe permitir crear una pareja identificada por nombre y apellido de cada uno de sus dos integrantes.
FR-031: El sistema debe permitir inscribir una pareja en una o más series.
FR-032: Una pareja inscripta en más de una serie acumula puntos de forma independiente en la tabla de cada serie.
FR-033: El sistema debe permitir editar el nombre de los integrantes de una pareja.
FR-034: El sistema debe permitir desactivar la inscripción de una pareja en una serie; los partidos ya registrados se conservan.
FR-040: El sistema debe permitir crear una jornada para una serie con número de jornada y fecha.
FR-041: El sistema debe permitir editar el número y la fecha de una jornada.
FR-042: El sistema debe permitir desactivar una jornada; las jornadas desactivadas no aparecen en la vista pública pero conservan sus partidos.
FR-043: El sistema debe listar las jornadas de cada serie en orden cronológico.
FR-050: El sistema debe permitir agregar un partido a una jornada seleccionando dos parejas e ingresando los tantos de cada una.
FR-051: El sistema debe determinar automáticamente la pareja ganadora según los tantos ingresados.
FR-052: El sistema debe permitir editar el resultado de un partido ya cargado.
FR-053: El sistema debe permitir desactivar un partido cargado por error, recalculando automáticamente las estadísticas.
FR-054: Al guardar un partido, el sistema debe calcular y actualizar automáticamente: puntos de tabla, tantos a favor/contra, diferencia de tantos y posición en la tabla de la serie.
FR-055: Si se edita o desactiva un partido, todos los cálculos asociados deben recalcularse automáticamente.
FR-060: La vista pública debe mostrar una tabla de posiciones por cada serie activa.
FR-061: La tabla de cada serie debe mostrar por pareja: posición, nombre (ambos integrantes), PJ, G, P, TF, TC, DIF, tantos acumulados y puntos de tabla.
FR-062: La tabla debe ordenarse aplicando en cascada los 5 criterios de desempate: puntos, tantos acumulados, diferencia de tantos, tantos a favor, posición compartida.
FR-063: La tabla debe actualizarse automáticamente cada vez que se carga, edita o desactiva un partido.
FR-064: La vista de tabla debe indicar el bar sede y el día de juego de la serie.
FR-070: La vista pública debe mostrar una tabla global que incluye a cada pareja una sola vez.
FR-071: Para cada pareja, la tabla global usa los datos de la serie donde obtuvo su mayor cantidad de puntos de tabla.
FR-072: Si una pareja tiene el mismo puntaje máximo en dos series, se usa la serie con mayor tantos acumulados como referencia.
FR-073: La tabla global aplica los mismos cinco criterios de desempate que la tabla por serie.
FR-074: La tabla global debe indicar qué serie se tomó como referencia para el puntaje de cada pareja.
FR-080: La vista pública debe listar las jornadas de cada serie activa en orden cronológico, indicando número y fecha.
FR-081: Al seleccionar una jornada, el visitante debe ver todos los partidos con: nombres de ambas parejas, tantos de cada una y pareja ganadora.
FR-082: La vista pública debe permitir navegar entre series para consultar tablas y jornadas.
FR-083: La vista pública debe mostrar el bar donde se juega cada serie.
FR-084: Los jugadores se muestran solo con nombre y apellido. No se publican datos sensibles.

### NonFunctional Requirements

NFR-001: Mobile-first. Interfaz completamente funcional y legible desde 375px. Las tablas no deben requerir scroll horizontal.
NFR-002: Performance. Páginas públicas cargan en < 3s en 4G. Tablas con hasta 30 parejas renderizan sin degradación.
NFR-003: Costo operativo mínimo. MVP opera a $0/mes. Arquitectura permite migrar a opciones pagas sin rediseño.
NFR-004: Desacoplamiento frontend/backend. Frontend React no queda atado a proveedor específico.
NFR-005: Privacidad básica. Solo nombre y apellido de jugadores expuestos públicamente.
NFR-006: Escala acotada. Sin degradación para ~200 usuarios concurrentes en vistas públicas.
NFR-007: Estética y coherencia visual. UI moderna con identidad Truco uruguayo. Admin prioriza claridad operativa.
NFR-008: Intuitividad operativa. Panel admin usable sin documentación. Acciones destructivas requieren confirmación.

### Additional Requirements

- **Starter / Setup:** Inicializar proyecto con `npm create vite@latest retruco -- --template react-ts` e instalar dependencias (`tailwindcss @tailwindcss/vite`, `@supabase/supabase-js`, `react-router-dom`, `@tanstack/react-query`).
- **Tailwind config:** Implementar `tailwind.config.ts` con extensión del theme para tokens de DESIGN.md (colores, tipografía, radios, espaciado).
- **Supabase schema:** Crear migración `001_schema.sql` con tablas: `series`, `bares`, `parejas`, `inscripciones` (pareja-serie), `jornadas`, `partidos`.
- **RLS policies:** Crear migración `002_rls_policies.sql` — `SELECT` para rol `anon` en todas las tablas públicas; `INSERT/UPDATE/DELETE` solo para rol `authenticated`.
- **Standings function:** Crear migración `003_standings_fn.sql` — PostgreSQL function + trigger que recalcula standings automáticamente al insertar/actualizar/desactivar un partido, aplicando los 5 criterios de desempate.
- **Data access layer:** Implementar `src/lib/supabase.ts` (cliente singleton) y `src/lib/queries.ts` (todas las llamadas a Supabase).
- **Auth infrastructure:** Implementar `AuthContext.tsx` + `useAuth.ts` hook + `ProtectedRoute.tsx` component.
- **Router setup:** Configurar React Router v7 con `router.tsx` incluyendo todas las rutas públicas y admin protegidas.
- **TanStack Query setup:** Configurar `QueryClientProvider` en `main.tsx`.
- **Environment vars:** Crear `.env.example` con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` como claves vacías. `.env.local` nunca commiteado.
- **Deploy:** Configurar proyecto en Vercel con variables de entorno de producción y deploy automático desde `main`.

### UX Design Requirements

UX-DR1: Implementar tokens de diseño de DESIGN.md como extensión del theme de TailwindCSS — paleta completa (primary, secondary, tertiary, surfaces, semantic), escala tipográfica (Barlow Condensed + Inter), radios (2/4/6/8/12/9999px) y espaciado (4/8/12/16/24/32px).
UX-DR2: Implementar componente `TopAppBar` — sticky `top-0 z-50`, altura 56px, wordmark izquierda (ícono `playing_cards` + "Retruco" en primary), ícono `account_circle` derecha; en admin abre menú "Cerrar sesión", en público navega a `/admin/login`.
UX-DR3: Implementar componente `BottomNav` — fijo `bottom-0 z-50`, 3 ítems (Inicio/home, Tabla Global/leaderboard, Admin/admin_panel_settings), estado activo por ruta actual (ícono filled + primary), `pb-safe` para iOS, `-webkit-tap-highlight-color: transparent`.
UX-DR4: Implementar componente `SeriesCard` — imagen de cabecera 128px con overlay gradiente, datos de serie, CTA "VER POSICIONES", animación fade-in + translate-y con IntersectionObserver (respeta `prefers-reduced-motion`).
UX-DR5: Implementar componente `StandingsTable` — 10 columnas (#, Pareja, PJ, G, P, TF, TC, DIF, Tantos, Pts) en 375px sin scroll horizontal, columna Pareja flexible, columnas numéricas ancho fijo, fila rank 1 con `surface-container-low` bg, empates mismo número, altura mínima fila 44px, tipografía `ranking-number` en celdas numéricas.
UX-DR6: Implementar componente `ScoreStepper` — botones +/− de 48×56px, display de valor 64×56px con `ranking-number`, input subyacente `readonly`, feedback `active:scale-90`, recalcula `WinnerPreview` en cada cambio.
UX-DR7: Implementar componente `WinnerPreview` — fondo `secondary-container/30`, borde `secondary-container`, ícono `emoji_events`, siempre visible bajo steppers, texto bold `on-secondary-container`; estado empate: "Empate: {n} — {n}".
UX-DR8: Implementar `StandingsSkeleton` y skeleton genérico — barras grises replicando forma del contenido. Nunca spinner. Timeout de 3s muestra error.
UX-DR9: Implementar estado Empty — ícono Material Symbols grande `outline-variant` + mensaje informativo contextual para: sin series, sin jornadas, sin partidos.
UX-DR10: Implementar toast de error de red — posicionado sobre bottom nav, autocierre en 5s, botón "Reintentar", accesible.
UX-DR11: Implementar componente `ConfirmSheet` — bottom sheet (no `window.confirm()`), título bold, descripción de consecuencia, botón Cancelar (secondary, foco por defecto) + botón de acción destructiva (`error` bg). Aplica a: desactivar serie, pareja, jornada, partido.
UX-DR12: Implementar patrón de validación de formularios — errores al submit, mensaje bajo el campo con `error` text + `label-sm`, borde `error` en campo, CTA siempre habilitado.
UX-DR13: Implementar comportamiento de sesión expirada — toast "Sesión vencida. Ingresá de nuevo." + redirect a `/admin/login`.
UX-DR14: Implementar layout responsive — mobile 1 col cards, tablet 2 col, desktop 4 col; `max-w-screen-xl mx-auto` en vistas con tabla; `max-w-md` en formularios admin; `pb-20` en body para clearance de bottom nav.
UX-DR15: Implementar interacciones de touch/hover — `active:scale-95` en botones/cards/nav, `active:scale-90` en steppers, `hover:bg-surface-container-low` en cards/nav (desktop), `hover:shadow-lg` en series-card, transición 300ms.
UX-DR16: Implementar accesibilidad base — contraste ≥ 4.5:1 en texto principal, touch targets ≥ 44px en todos los interactivos, `<label for>` en todos los inputs/selects, `alt=""` en imágenes decorativas de series-card, `focus-visible` sin supresión, `lang="es"` en `<html>`.
UX-DR17: Cargar fuentes desde Google Fonts en `index.html` — Barlow Condensed (600, 700) + Inter (400, 600) con `font-display: swap`; fallback `sans-serif`.
UX-DR18: Implementar patrones admin CRUD — lista con filas: nombre/id + metadata + acciones inline (editar lápiz / desactivar archivo); entidades inactivas al final con opacidad reducida + chip "Inactivo"; botón "Nueva [entidad]" en header; formulario reutilizable create/edit; regreso a lista tras guardar exitoso.

### FR Coverage Map

FR-001: Epic 3 — Login con email y contraseña
FR-002: Epic 3 — Sesión persistente (Supabase Auth)
FR-003: Epic 3 — Cerrar sesión manualmente
FR-004: Epic 1 — ProtectedRoute bloquea escritura sin sesión
FR-005: Epic 1 — Multi-admin vía Supabase dashboard (config, no código)
FR-010: Epic 3 — Crear serie
FR-011: Epic 3 — Editar nombre de serie
FR-012: Epic 3 — Desactivar serie con ConfirmSheet
FR-013: Epic 3 — Listar series activas e inactivas en admin
FR-030: Epic 3 — Crear pareja con nombre y apellido de cada integrante
FR-031: Epic 3 — Inscribir pareja en una o más series
FR-032: Epic 1 — Schema: tabla inscripciones (pareja-serie independiente)
FR-033: Epic 3 — Editar nombre de integrantes de pareja
FR-034: Epic 3 — Desactivar inscripción de pareja en serie
FR-040: Epic 3 — Crear jornada con número y fecha
FR-041: Epic 3 — Editar número y fecha de jornada
FR-042: Epic 3 — Desactivar jornada con ConfirmSheet
FR-043: Epic 3 — Listar jornadas en orden cronológico
FR-050: Epic 4 — Agregar partido seleccionando parejas e ingresando tantos
FR-051: Epic 4 — Determinación automática de ganador por tantos
FR-052: Epic 4 — Editar resultado de partido ya cargado
FR-053: Epic 4 — Desactivar partido con recálculo automático
FR-054: Epic 4 — Trigger DB recalcula puntos, tantos, posición al guardar
FR-055: Epic 4 — Trigger DB recalcula al editar o desactivar partido
FR-060: Epic 2 — Vista pública tabla de posiciones por serie activa
FR-061: Epic 2 — 10 columnas en tabla: #, Pareja, PJ, G, P, TF, TC, DIF, Tantos, Pts
FR-062: Epic 2 — Ordenamiento con 5 criterios de desempate en cascada
FR-063: Epic 4 — Tabla se actualiza tras guardar/editar/desactivar partido (invalidateQueries)
FR-064: Epic 2 — Tabla indica bar sede y día de juego de la serie
FR-070: Epic 2 — Tabla global con cada pareja una sola vez
FR-071: Epic 2 — Global usa datos de la mejor serie de cada pareja
FR-072: Epic 1 — Lógica de selección de mejor serie en standings function SQL
FR-073: Epic 2 — Global aplica los mismos 5 criterios de desempate
FR-074: Epic 2 — Global indica qué serie fue la de referencia
FR-080: Epic 2 — Listar jornadas de cada serie en orden cronológico
FR-081: Epic 2 — Detalle de jornada con todos los partidos, tantos y ganador
FR-082: Epic 2 — Navegación entre series para consultar tablas y jornadas
FR-083: Epic 2 — Vista pública muestra el bar de cada serie
FR-084: Epic 1 — RLS garantiza que solo nombre y apellido sean accesibles

## Epic List

### Epic 1: Fundamentos y shell de la aplicación
El equipo puede levantar el proyecto localmente, conectarse a Supabase y ver el shell navegable (TopAppBar + BottomNav) con rutas funcionando y la base de datos lista para recibir datos.
**FRs cubiertos:** FR-004, FR-005, FR-023, FR-032, FR-072, FR-084
**Additional Reqs cubiertos:** Todos los 11 items de setup e infraestructura
**UX-DRs cubiertos:** UX-DR1, UX-DR2, UX-DR3, UX-DR17
**NFRs abordados:** NFR-003 ($0/mes — Vercel + Supabase free), NFR-004 (desacoplamiento)

### Epic 2: Experiencia pública — tablas y resultados
Silvana puede abrir Retruco, ver las series activas, consultar la tabla de posiciones de su serie, ver los resultados de la última jornada y revisar su posición en la tabla global — todo desde el celular, sin login, en menos de 3 segundos.
**FRs cubiertos:** FR-060, FR-061, FR-062, FR-064, FR-070, FR-071, FR-073, FR-074, FR-080, FR-081, FR-082, FR-083
**UX-DRs cubiertos:** UX-DR4, UX-DR5, UX-DR8, UX-DR9, UX-DR10, UX-DR14, UX-DR15, UX-DR16
**NFRs abordados:** NFR-001 (mobile-first 375px), NFR-002 (< 3s, 30 parejas), NFR-006 (~200 concurrent), NFR-007 (UI Truco uruguayo)

### Epic 3: Panel de administración — gestión de entidades
Marcelo puede iniciar sesión, y desde el panel admin gestionar la estructura completa del torneo: crear y editar series, parejas y jornadas; desactivar entidades con confirmación explícita.
**FRs cubiertos:** FR-001, FR-002, FR-003, FR-010, FR-011, FR-012, FR-013, FR-030, FR-031, FR-033, FR-034, FR-040, FR-041, FR-042, FR-043
**UX-DRs cubiertos:** UX-DR11, UX-DR12, UX-DR13, UX-DR18
**NFRs abordados:** NFR-008 (admin intuitivo sin documentación)

### Epic 4: Carga y gestión de partidos
Marcelo puede cargar todos los resultados de una jornada usando steppers táctiles, ver el ganador calculado en tiempo real antes de confirmar, y corregir o anular cualquier partido cargado — con la tabla de posiciones actualizándose automáticamente tras cada acción.
**FRs cubiertos:** FR-050, FR-051, FR-052, FR-053, FR-054, FR-055, FR-063
**UX-DRs cubiertos:** UX-DR6, UX-DR7
**NFRs abordados:** NFR-002 (recálculo sin degradación perceptible)

---

## Epic 1: Fundamentos y shell de la aplicación

El equipo puede levantar el proyecto localmente, conectarse a Supabase y ver el shell navegable (TopAppBar + BottomNav) con rutas funcionando y la base de datos lista para recibir datos.

### Story 1.1: Inicialización del proyecto y configuración del toolchain

As a developer,
I want to initialize the Retruco project with the approved tech stack,
So that all subsequent stories have a consistent, runnable foundation.

**Acceptance Criteria:**

**Given** un directorio vacío
**When** se ejecutan los comandos de setup
**Then** el proyecto arranca con `npm run dev` sin errores en `localhost:5173`
**And** el `package.json` incluye: `react`, `react-dom`, `typescript`, `vite`, `tailwindcss`, `@tailwindcss/vite`, `@supabase/supabase-js`, `react-router-dom`, `@tanstack/react-query`
**And** `tailwind.config.ts` extiende el theme con todos los tokens de DESIGN.md: paleta de colores completa (primary, secondary, tertiary, surfaces, semantic), escala tipográfica (Barlow Condensed + Inter con los 7 estilos), radios (sm/DEFAULT/md/lg/xl/full) y espaciado (xs/sm/md/lg/xl/container-margin/gutter)
**And** `index.html` carga Google Fonts: Barlow Condensed (wght 600;700) e Inter (wght 400;600) con `display=swap`
**And** `index.css` contiene únicamente `@import "tailwindcss"`
**And** `.env.example` existe con `VITE_SUPABASE_URL=` y `VITE_SUPABASE_ANON_KEY=` como claves vacías
**And** `.gitignore` incluye `.env.local`

### Story 1.2: Schema de base de datos en Supabase

As a developer,
I want to define the complete database schema as a Supabase migration,
So that all entities of the tournament exist in the database ready to receive data.

**Acceptance Criteria:**

**Given** un proyecto Supabase inicializado (`supabase init`)
**When** se aplica la migración `001_schema.sql`
**Then** existen las tablas: `bares`, `series`, `parejas`, `inscripciones`, `jornadas`, `partidos`
**And** `bares`: `id uuid PK`, `nombre text NOT NULL`, `activo boolean DEFAULT true`, `created_at timestamptz`
**And** `series`: `id uuid PK`, `nombre text NOT NULL`, `dia_juego text`, `bar_id uuid FK→bares`, `activo boolean DEFAULT true`, `created_at timestamptz`
**And** `parejas`: `id uuid PK`, `jugador1_nombre text NOT NULL`, `jugador1_apellido text NOT NULL`, `jugador2_nombre text NOT NULL`, `jugador2_apellido text NOT NULL`, `activo boolean DEFAULT true`, `created_at timestamptz`
**And** `inscripciones`: `id uuid PK`, `pareja_id uuid FK→parejas`, `serie_id uuid FK→series`, `activa boolean DEFAULT true`, UNIQUE(pareja_id, serie_id)
**And** `jornadas`: `id uuid PK`, `serie_id uuid FK→series`, `numero int NOT NULL`, `fecha date NOT NULL`, `activa boolean DEFAULT true`, `created_at timestamptz`
**And** `partidos`: `id uuid PK`, `jornada_id uuid FK→jornadas`, `inscripcion1_id uuid FK→inscripciones`, `inscripcion2_id uuid FK→inscripciones`, `tantos1 int NOT NULL`, `tantos2 int NOT NULL`, `activo boolean DEFAULT true`, `created_at timestamptz`
**And** todas las FK tienen `ON DELETE RESTRICT`
**And** `supabase db push` aplica sin errores

### Story 1.3: Políticas RLS de seguridad

As a visitor,
I want to be able to read public tournament data without logging in,
So that I can view standings and results freely; and as an admin, all write operations are protected.

**Acceptance Criteria:**

**Given** la migración `002_rls_policies.sql` aplicada
**When** se consulta cualquier tabla con rol `anon`
**Then** `SELECT` está permitido en: `bares`, `series`, `parejas`, `inscripciones`, `jornadas`, `partidos`
**And** `INSERT`, `UPDATE`, `DELETE` con rol `anon` retornan error de permisos en todas las tablas
**When** se realiza `INSERT`, `UPDATE`, o `DELETE` con rol `authenticated`
**Then** la operación es permitida en todas las tablas
**And** RLS está habilitado (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`) en las 6 tablas
**And** un visitante no puede acceder a columnas de usuarios admin ya que esos datos viven en `auth.users` de Supabase, no en tablas públicas

### Story 1.4: Función SQL de recálculo de standings

As a developer,
I want a PostgreSQL function and trigger that automatically recalculates standings whenever a match result changes,
So that the standings table is always consistent without any frontend logic.

**Acceptance Criteria:**

**Given** la migración `003_standings_fn.sql` aplicada
**When** se inserta, actualiza o desactiva (`activo=false`) un registro en `partidos`
**Then** el trigger se dispara automáticamente para ambas inscripciones involucradas
**And** para cada inscripción el sistema calcula: PJ, G, P, TF, TC, DIF, tantos acumulados, puntos de tabla (G×2) — solo partidos con `activo=true` de jornadas con `activa=true`
**And** existe una función `get_standings(serie_id uuid)` que retorna inscripciones ordenadas por: 1. puntos DESC, 2. tantos acumulados DESC, 3. DIF DESC, 4. TF DESC
**And** existe una función `get_global_standings()` que retorna cada pareja una sola vez usando los datos de la serie donde tiene más puntos (desempate: más tantos acumulados), con columna `serie_referencia_id`
**And** un test manual: insertar 2 partidos en la misma serie y verificar que `get_standings()` refleja el resultado correctamente

### Story 1.5: Infraestructura de autenticación y capa de datos

As a developer,
I want the Supabase client, AuthContext, and data access layer scaffolded,
So that all subsequent stories can import these without duplication or conflict.

**Acceptance Criteria:**

**Given** `.env.local` con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` válidos
**When** la aplicación arranca
**Then** `src/lib/supabase.ts` exporta un único cliente Supabase creado con `createClient()`
**And** `src/lib/queries.ts` existe como módulo scaffold que importa `supabase` de `supabase.ts` — ningún otro archivo importa `@supabase/supabase-js` directamente
**And** `src/context/AuthContext.tsx` provee `{ session, user, loading }` usando `supabase.auth.onAuthStateChange`
**And** `src/hooks/useAuth.ts` expone el contexto con hook `useAuth()`
**And** `src/components/ProtectedRoute.tsx` redirige a `/admin/login` si `session` es null
**And** `src/types/index.ts` define interfaces TypeScript: `Serie`, `Bar`, `Pareja`, `Inscripcion`, `Jornada`, `Partido` (campos en snake_case matching DB)

### Story 1.6: Shell navegable — router, providers y componentes de navegación

As a visitor,
I want to see the app shell with the top bar and bottom navigation from any screen,
So that I can always orient myself and navigate between the main sections.

**Acceptance Criteria:**

**Given** la app cargada en el browser
**When** se navega a cualquier ruta
**Then** `TopAppBar` es visible: sticky `top-0 z-50`, altura 56px, fondo `surface`, borde inferior `outline-variant`, wordmark "Retruco" (ícono `playing_cards` + texto `primary` en `headline-lg-mobile`), ícono `account_circle` derecha
**And** en rutas públicas, tap en `account_circle` navega a `/admin/login`
**And** en rutas admin con sesión activa, tap en `account_circle` muestra opción "Cerrar sesión" que ejecuta `supabase.auth.signOut()`
**And** `BottomNav` es visible: fijo `bottom-0 z-50`, 3 ítems (Inicio/home, Tabla Global/leaderboard, Admin/admin_panel_settings), ítem activo por ruta (ícono filled + `primary`), ítem inactivo (`on-surface-variant`)
**And** `router.tsx` define todas las rutas: `/`, `/series/:id`, `/series/:id/jornadas/:jornada_id`, `/global`, `/admin/login`, `/admin`, `/admin/series`, `/admin/parejas`, `/admin/bares`, `/admin/jornadas`, `/admin/partidos/nuevo`, `/admin/partidos/:id/editar`
**And** rutas `/admin/*` (excepto `/admin/login`) están envueltas en `ProtectedRoute`
**And** `main.tsx` envuelve en: `AuthContext.Provider` → `QueryClientProvider` → `RouterProvider`
**And** `lang="es"` en `<html>` y `pb-20` en body para clearance del bottom nav

### Story 1.7: Deploy a Vercel

As an admin,
I want the app live on a public URL,
So that the team can verify the shell in production before building features.

**Acceptance Criteria:**

**Given** el repositorio Git con el código del Epic 1
**When** se conecta el repo a Vercel y se hace el primer deploy
**Then** Vercel detecta Vite automáticamente con `npm run build` y output en `dist/`
**And** las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` están configuradas en Vercel con valores de producción
**And** la URL pública carga el shell sin errores de consola
**And** deploy automático se activa en cada push a `main`
**And** el costo mensual es $0 (Vercel Hobby + Supabase free tier)

---

## Epic 2: Experiencia pública — tablas y resultados

Silvana puede abrir Retruco, ver las series activas, consultar la tabla de posiciones de su serie, ver los resultados de la última jornada y revisar su posición en la tabla global — todo desde el celular, sin login, en menos de 3 segundos.

### Story 2.1: Pantalla Home — listado de series activas

As a visitor,
I want to see all active series on the home screen as visual cards,
So that I can quickly find and navigate to the series I follow.

**Acceptance Criteria:**

**Given** la app cargada en `/`
**When** hay series activas en la base de datos
**Then** se muestran `SeriesCard` para cada serie con `activo=true`, mostrando: imagen de cabecera (128px con overlay gradiente), nombre de serie, día de juego, nombre del bar, cantidad de parejas inscriptas y botón "VER POSICIONES"
**And** tap en la card o en el botón navega a `/series/:id`
**And** mientras carga, se muestra un skeleton placeholder (rectángulos grises replicando la forma de las cards)
**And** si no hay series activas, se muestra ícono Material Symbols grande + "El campeonato aún no tiene series. Ingresá como admin para configurarlo."
**And** las cards tienen animación fade-in + `translate-y-4 → translate-y-0` con IntersectionObserver (omitida si `prefers-reduced-motion: reduce`)
**And** layout responsive: 1 col en mobile, 2 col en tablet (≥768px), 4 col en desktop (≥1280px) con `max-w-screen-xl mx-auto`
**And** `useSeries` hook usa TanStack Query con query key `['series']` llamando a `queries.getSeries()` que filtra `activo=true`

### Story 2.2: Pantalla de serie — tabla de posiciones

As a visitor,
I want to see the standings table for a series with all statistics,
So that I can check my pair's position and compare with others.

**Acceptance Criteria:**

**Given** la ruta `/series/:id` con tab "Posiciones" activo (default)
**When** la serie existe y tiene inscripciones
**Then** el header muestra nombre de la serie, bar sede y día de juego (FR-064)
**And** `StandingsTable` muestra 10 columnas: # · Pareja · PJ · G · P · TF · TC · DIF · Tantos · Pts
**And** columna "Pareja" muestra `jugador1_nombre jugador1_apellido / jugador2_nombre jugador2_apellido` con ancho flexible; columnas numéricas con ancho fijo (~28–36px) en tipografía `ranking-number`
**And** la tabla no requiere scroll horizontal en 375px (NFR-001)
**And** la fila del rank 1 tiene fondo `surface-container-low`; empates muestran el mismo número en ambas filas
**And** los datos provienen de `get_standings(serie_id)` via `queries.getStandings(serieId)` y hook `useStandings(serieId)` con query key `['standings', serieId]`
**And** durante la carga se muestra `StandingsSkeleton` (barras grises en lugar de filas); si supera 3s muestra error
**And** si no hay inscripciones: ícono + "Todavía no hay parejas en esta serie."
**And** si falla la carga: toast "No se pudo cargar la tabla. Intentá de nuevo." con botón "Reintentar", autocierre 5s, posicionado sobre el bottom nav

### Story 2.3: Pantalla de serie — tab de jornadas

As a visitor,
I want to browse the list of jornadas for a series,
So that I can select a specific jornada to view its match results.

**Acceptance Criteria:**

**Given** la ruta `/series/:id` con tab "Jornadas" seleccionado
**When** la serie tiene jornadas activas
**Then** se listan `JornadaCard` en orden cronológico inverso (más reciente arriba), cada una mostrando: número de jornada, fecha formateada ("14 de abril de 2025") y cantidad de partidos
**And** tap en una `JornadaCard` navega a `/series/:id/jornadas/:jornada_id`
**And** las tabs "Posiciones" y "Jornadas" son accesibles desde el mismo header sin perder el contexto de la serie
**And** si no hay jornadas: ícono + "Todavía no hay jornadas en esta serie."
**And** `useJornadas(serieId)` usa TanStack Query con query key `['jornadas', serieId]` filtrando `activa=true`

### Story 2.4: Pantalla de detalle de jornada

As a visitor,
I want to see all match results for a specific jornada,
So that I can review how each pair performed that night.

**Acceptance Criteria:**

**Given** la ruta `/series/:id/jornadas/:jornada_id`
**When** la jornada tiene partidos cargados
**Then** el header muestra número de jornada y fecha; chevron `arrow_back` usa `history.back()`
**And** se listan `MatchResultRow` para cada partido activo: `[Pareja A] [score A] — [score B] [Pareja B]`
**And** el nombre de la pareja ganadora va en bold (`on-surface`); el perdedor en `on-surface-variant`; los tantos en tipografía `ranking-number`
**And** si no hay partidos: ícono + "No se cargaron partidos para esta jornada."
**And** `useJornada(jornadaId)` usa TanStack Query con query key `['jornada', jornadaId]`

### Story 2.5: Pantalla de tabla global

As a visitor,
I want to see the global standings with every pair appearing only once,
So that I can understand the overall championship ranking.

**Acceptance Criteria:**

**Given** la ruta `/global`
**When** hay datos en el campeonato
**Then** `StandingsTable` muestra la misma estructura de 10 columnas más una columna "Serie" indicando la serie de referencia de cada pareja (FR-074)
**And** cada pareja aparece una sola vez con los datos de su mejor serie (FR-071); ordenamiento con los 5 criterios de desempate (FR-073)
**And** los datos provienen de `get_global_standings()` via `queries.getGlobalStandings()` y hook `useGlobalStandings()` con query key `['global-standings']`
**And** skeleton, empty state ("No hay datos en el campeonato aún.") y error toast siguen los mismos patrones que la tabla de serie

---

## Epic 3: Panel de administración — gestión de entidades

Marcelo puede iniciar sesión, y desde el panel admin gestionar la estructura completa del torneo: crear y editar series, bares, parejas y jornadas; desactivar entidades con confirmación explícita.

### Story 3.1: Login de administrador

As an admin,
I want to log in with email and password,
So that I can access the administration panel securely.

**Acceptance Criteria:**

**Given** la ruta `/admin/login`
**When** el usuario no tiene sesión activa
**Then** se muestra `LoginPage` con: wordmark centrado, campo email, campo password, CTA dorado "Ingresar" (altura 56px, full-width)
**And** al completar credenciales correctas y tocar "Ingresar", la sesión se establece via `supabase.auth.signInWithPassword()` y se redirige a `/admin`
**And** si las credenciales son incorrectas, se muestra mensaje bajo el campo: "Email o contraseña incorrectos." en `error` text
**And** el CTA permanece siempre habilitado; la validación de campos vacíos ocurre al submit
**And** si hay sesión activa y se navega a `/admin/login`, se redirige automáticamente a `/admin`
**And** `active:scale-95` en el CTA; `focus-visible` sin supresión en inputs; `<label for>` en ambos campos

### Story 3.2: Dashboard de administración y logout

As an admin,
I want to see a dashboard with quick access to all management sections and be able to log out,
So that I can navigate efficiently and close my session when done.

**Acceptance Criteria:**

**Given** la ruta `/admin` con sesión activa
**When** se carga el dashboard
**Then** se muestran accesos directos a: Series, Bares, Parejas, Jornadas, Partidos (ícono + label cada uno)
**And** el ícono `account_circle` en `TopAppBar` muestra menú con "Cerrar sesión" que ejecuta `supabase.auth.signOut()` y redirige a `/`
**And** si el token expira mid-session, el próximo request fallido muestra toast "Sesión vencida. Ingresá de nuevo." y redirige a `/admin/login`
**And** sin sesión activa, cualquier ruta `/admin/*` redirige a `/admin/login` via `ProtectedRoute`

### Story 3.3: ~~Gestión de bares~~ [DEPRECADO]

> **Nota:** La entidad "bar" fue eliminada del MVP. El nombre del lugar de juego se incluye directamente en el nombre de la serie (ej: "Serie Los Ángeles — Bar La Esquina").

### Story 3.4: Gestión de series

As an admin,
I want to create, edit, and deactivate series,
So that I can manage the tournament's active series and their venues.

**Acceptance Criteria:**

**Given** la ruta `/admin/series`
**When** se carga la sección
**Then** se lista cada serie con: nombre, día de juego + acciones inline; series inactivas al final con chip "Inactivo"
**And** formulario "Nueva Serie" incluye: nombre (requerido), campo día de juego (texto)
**And** al guardar nueva serie o editar, regresa a la lista con los datos actualizados
**And** desactivar serie abre `ConfirmSheet`: "¿Desactivar esta serie? Los datos se conservan." — al confirmar `activo=false` y la serie desaparece de vistas públicas
**And** `useSerieMutation` invalida queries `['series']` en `onSuccess`

### Story 3.5: Gestión de parejas e inscripciones

As an admin,
I want to create pairs, edit their members, and manage their series enrollments,
So that players are correctly registered in the championship.

**Acceptance Criteria:**

**Given** la ruta `/admin/parejas`
**When** se carga la sección
**Then** se lista cada pareja con: nombre completo de ambos integrantes, series donde está inscripta + acciones inline
**And** formulario "Nueva Pareja" incluye: `jugador1_nombre`, `jugador1_apellido`, `jugador2_nombre`, `jugador2_apellido` (todos requeridos) + selector multi-serie para inscribirla (crea registros en `inscripciones`)
**And** editar pareja permite modificar nombres de integrantes
**And** desactivar inscripción en una serie abre `ConfirmSheet`: "¿Retirar a [Pareja] de [Serie]? Los partidos ya cargados se conservan." — al confirmar `inscripciones.activa=false`
**And** `useParejaMutation` invalida queries `['parejas']` en `onSuccess`

### Story 3.6: Gestión de jornadas

As an admin,
I want to create, edit, and deactivate jornadas for each series,
So that I can organize the monthly match sessions.

**Acceptance Criteria:**

**Given** la ruta `/admin/jornadas`
**When** se carga la sección
**Then** se listan jornadas agrupadas por serie en orden cronológico con: número, fecha, cantidad de partidos + acciones inline; jornadas inactivas al final con chip "Inactivo"
**And** formulario "Nueva Jornada" incluye: selector serie (requerido), número de jornada (int, requerido), fecha (input type=date, requerido)
**And** editar jornada permite modificar número y fecha
**And** desactivar jornada abre `ConfirmSheet`: "¿Desactivar esta jornada? Los partidos no se eliminarán." — al confirmar `activa=false` y deja de aparecer en vistas públicas
**And** `useJornadaMutation` invalida queries `['jornadas']` y `['standings']` en `onSuccess` (desactivar jornada afecta el recálculo de standings)

---

## Epic 4: Carga y gestión de partidos

Marcelo puede cargar todos los resultados de una jornada usando steppers táctiles, ver el ganador calculado en tiempo real antes de confirmar, y corregir o anular cualquier partido cargado — con la tabla de posiciones actualizándose automáticamente tras cada acción.

### Story 4.1: Formulario de carga de nuevo partido

As an admin,
I want to add a match result by selecting two pairs and entering their scores with touch-friendly steppers,
So that I can quickly load results from my phone right after the match, without keyboard errors.

**Acceptance Criteria:**

**Given** la ruta `/admin/partidos/nuevo`
**When** se carga el formulario
**Then** se muestran: selector de jornada (lista de jornadas activas, agrupadas por serie), selector Pareja 1 (parejas inscriptas en la serie de la jornada seleccionada), selector Pareja 2 (misma lógica, excluye Pareja 1 ya seleccionada)
**And** dos `ScoreStepper` independientes: botones +/− de 48×56px, display de valor 64×56px en `ranking-number`, input subyacente `readonly`, valor mínimo 0, sin máximo forzado, feedback `active:scale-90`
**And** `WinnerPreview` aparece siempre visible debajo de los steppers: fondo `secondary-container/30`, muestra "Ganador: [Pareja] ([n] tantos)" actualizado en cada cambio de stepper; si los tantos son iguales muestra "Empate: [n] — [n]"
**And** CTA "Guardar Partido" (dorado, 56px, full-width) habilitado siempre; al tocar ejecuta validación (ambas parejas seleccionadas, tantos distintos no requeridos pero sí distintas parejas)
**And** si la validación falla, muestra errores bajo los campos correspondientes

### Story 4.2: Guardar partido y recálculo automático de standings

As an admin,
I want saving a match to automatically update the standings table,
So that the public view reflects the new result immediately without any manual step.

**Acceptance Criteria:**

**Given** el formulario de nuevo partido con datos válidos
**When** se toca "Guardar Partido"
**Then** se abre `ConfirmSheet` con resumen: pareja 1, tantos 1, tantos 2, pareja 2, ganador calculado; botones "Cancelar" y "Guardar" (`primary` bg)
**And** al confirmar, `queries.createPartido()` inserta el registro en `partidos`
**And** el trigger DB recalcula automáticamente los standings de la serie (FR-054)
**And** `onSuccess`: `queryClient.invalidateQueries(['standings', serieId])` y `queryClient.invalidateQueries(['jornada', jornadaId])`
**And** tras el guardado exitoso se muestra toast "Partido guardado." y el formulario se resetea listo para cargar el siguiente partido de la misma jornada
**And** si falla el guardado: toast "No se pudo guardar. Intentá de nuevo." con botón "Reintentar"

### Story 4.3: Editar resultado de partido existente

As an admin,
I want to edit a previously loaded match result,
So that I can correct data entry errors without losing other match history.

**Acceptance Criteria:**

**Given** la ruta `/admin/partidos/:id/editar`
**When** se carga el formulario
**Then** el formulario muestra los mismos `ScoreStepper` y `WinnerPreview` pre-completados con los valores actuales del partido
**And** los selectores de pareja y jornada están pre-seleccionados y son editables
**And** al guardar, `queries.updatePartido()` actualiza el registro
**And** el trigger DB recalcula automáticamente los standings (FR-055)
**And** `onSuccess`: `queryClient.invalidateQueries(['standings', serieId])`, `queryClient.invalidateQueries(['jornada', jornadaId])` y `queryClient.invalidateQueries(['global-standings'])`
**And** tras el guardado exitoso se navega de regreso a la lista o al detalle de jornada

### Story 4.4: Desactivar partido

As an admin,
I want to deactivate a match that was loaded by mistake,
So that it stops affecting the standings without permanently deleting the record.

**Acceptance Criteria:**

**Given** un partido visible en la lista de partidos de una jornada en el panel admin
**When** se toca el ícono de desactivar
**Then** se abre `ConfirmSheet`: "¿Desactivar este partido? Los tantos se eliminarán del cálculo de la tabla." con botones "Cancelar" (foco por defecto) y "Desactivar" (`error` bg)
**And** al confirmar, `queries.deactivatePartido()` ejecuta `UPDATE partidos SET activo=false WHERE id=:id`
**And** el trigger DB recalcula automáticamente los standings excluyendo el partido desactivado (FR-053, FR-055)
**And** `onSuccess`: `queryClient.invalidateQueries(['standings', serieId])`, `queryClient.invalidateQueries(['jornada', jornadaId])` y `queryClient.invalidateQueries(['global-standings'])`
**And** el partido desactivado deja de aparecer en la vista pública del detalle de jornada
