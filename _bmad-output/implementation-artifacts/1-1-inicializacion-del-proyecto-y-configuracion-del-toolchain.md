# Story 1.1: Inicialización del proyecto y configuración del toolchain

Status: review

## Story

As a developer,
I want to initialize the Retruco project with the approved tech stack,
so that all subsequent stories have a consistent, runnable foundation.

## Acceptance Criteria

1. El proyecto arranca con `npm run dev` sin errores en `localhost:5173`.
2. `package.json` incluye todas las dependencias requeridas con las versiones correctas.
3. `tailwind.config.ts` extiende el theme de Tailwind con TODOS los tokens de DESIGN.md (colores, tipografía, radios, espaciado).
4. `index.html` carga Google Fonts: Barlow Condensed (wght 600;700) e Inter (wght 400;600) con `display=swap`.
5. `index.css` contiene únicamente `@import "tailwindcss"`.
6. `.env.example` existe con `VITE_SUPABASE_URL=` y `VITE_SUPABASE_ANON_KEY=` como claves vacías.
7. `.gitignore` incluye `.env.local`.

## Tasks / Subtasks

- [ ] Task 1 — Inicializar proyecto Vite + React TS (AC: 1, 2)
  - [ ] Ejecutar `npm create vite@latest retruco -- --template react-ts`
  - [ ] Instalar dependencias core: `npm install @supabase/supabase-js react-router-dom @tanstack/react-query`
  - [ ] Instalar dependencias de dev: `npm install -D tailwindcss @tailwindcss/vite`
  - [ ] Verificar `npm run dev` arranca sin errores

- [ ] Task 2 — Configurar TailwindCSS v4 con Vite plugin (AC: 3, 5)
  - [ ] Agregar `@tailwindcss/vite` a `vite.config.ts` en el array `plugins`
  - [ ] Reemplazar contenido de `src/index.css` con únicamente `@import "tailwindcss"`
  - [ ] Eliminar cualquier archivo `postcss.config.*` generado por el starter (Tailwind v4 no usa PostCSS)
  - [ ] Crear `tailwind.config.ts` con extensión completa del theme (ver Dev Notes)

- [ ] Task 3 — Configurar Google Fonts en index.html (AC: 4)
  - [ ] Agregar `<link rel="preconnect" href="https://fonts.googleapis.com">` en `<head>`
  - [ ] Agregar `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`
  - [ ] Agregar `<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">`
  - [ ] Verificar que `lang="es"` está en el tag `<html>` (UX-DR16)

- [ ] Task 4 — Variables de entorno (AC: 6, 7)
  - [ ] Crear `.env.example` con las dos variables vacías
  - [ ] Verificar que `.env.local` está en `.gitignore`

- [ ] Task 5 — Limpieza del starter template
  - [ ] Eliminar contenido demo de `App.tsx` (mantener solo el componente vacío o un placeholder)
  - [ ] Eliminar `App.css` si existe (los estilos irán en `index.css` con Tailwind)
  - [ ] Eliminar assets de demo de Vite (`public/vite.svg`, `src/assets/react.svg`) si no son necesarios

## Dev Notes

### Stack exacto a usar

```
Vite 6 + React 19 + TypeScript (strict)
TailwindCSS v4.x con @tailwindcss/vite (SIN postcss.config.ts)
@supabase/supabase-js@2.107.x
react-router-dom@7.x
@tanstack/react-query@5.101.x
```

**Importante:** TailwindCSS v4 cambia la arquitectura respecto a v3:
- Plugin de Vite en lugar de PostCSS
- El CSS entry usa `@import "tailwindcss"` en lugar de las tres directivas `@tailwind base/components/utilities`
- `tailwind.config.ts` sigue siendo compatible pero la configuración puede vivir alternativamente en CSS via `@theme {}`
- Para este proyecto se usa `tailwind.config.ts` tal como especifica la arquitectura

### vite.config.ts resultante

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

### tailwind.config.ts — tokens completos de DESIGN.md

```ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Surfaces
        background: '#fcf9f8',
        surface: '#fcf9f8',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f6f3f2',
        'surface-container': '#f0edec',
        'surface-container-high': '#ebe7e7',
        'surface-container-highest': '#e5e2e1',
        'surface-dim': '#dcd9d9',
        // Content
        'on-surface': '#1c1b1b',
        'on-surface-variant': '#40484f',
        outline: '#707880',
        'outline-variant': '#bfc7d0',
        // Primary — Celeste uruguayo
        primary: '#006493',
        'on-primary': '#ffffff',
        'primary-container': '#4d9fd6',
        'on-primary-container': '#00334e',
        // Secondary — Verde tapete
        secondary: '#3f6653',
        'on-secondary': '#ffffff',
        'secondary-container': '#beead1',
        'on-secondary-container': '#436b58',
        // Tertiary — Dorado Sol de Mayo
        tertiary: '#815500',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#cd8a00',
        'on-tertiary-container': '#442b00',
        gold: '#E8A020',
        'on-tertiary-fixed': '#1a1100',
        // Semantic
        error: '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
      },
      fontFamily: {
        condensed: ['"Barlow Condensed"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['48px', { lineHeight: '52px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg': ['32px', { lineHeight: '36px', letterSpacing: '0.01em', fontWeight: '700' }],
        'headline-lg-mobile': ['28px', { lineHeight: '32px', fontWeight: '700' }],
        'headline-md': ['24px', { lineHeight: '28px', fontWeight: '600' }],
        'ranking-number': ['20px', { lineHeight: '20px', fontWeight: '700' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'label-sm': ['12px', { lineHeight: '16px', letterSpacing: '0.05em', fontWeight: '600' }],
      },
      borderRadius: {
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        full: '9999px',
      },
      spacing: {
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        'container-margin': '16px',
        gutter: '12px',
      },
    },
  },
} satisfies Config
```

### .env.example

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### Estructura de carpetas a crear (vacías / con placeholder)

Esta story crea SOLO la base. Las carpetas y archivos del dominio se crean en stories siguientes:

```
src/
  App.tsx         ← placeholder vacío (retorna null o <></>)
  main.tsx        ← solo ReactDOM.createRoot por ahora
  index.css       ← @import "tailwindcss"
  router.tsx      ← se completa en Story 1.6
  components/     ← vacía (se crea en stories 1.5, 1.6, 2.x)
  pages/          ← vacía
  hooks/          ← vacía
  lib/            ← vacía (se completa en Story 1.5)
  context/        ← vacía
  types/          ← vacía
supabase/
  migrations/     ← vacía (se completa en Story 1.2)
```

**No crear archivos de dominio en esta story.** Solo el scaffolding del toolchain.

### Convenciones de nombres (crítico para consistencia inter-stories)

- Componentes React: `PascalCase.tsx`
- Pages: `PascalCase` + sufijo `Page.tsx`
- Hooks: `use` + `camelCase.ts`
- Lib/utils: `camelCase.ts`
- Interfaces TS: `snake_case` matching DB (ej: `jornada_id`, no `jornadaId`)

### Anti-patterns a evitar

- ❌ No usar PostCSS — Tailwind v4 usa el plugin de Vite directamente
- ❌ No usar las directivas `@tailwind base/components/utilities` — usar `@import "tailwindcss"`
- ❌ No instalar `autoprefixer` o `postcss` — no necesarios con Tailwind v4
- ❌ No crear `App.css` — todos los estilos globales van en `index.css`
- ❌ No dejar código demo del starter (contador de Vite, etc.)

### Project Structure Notes

- Esta story establece el directorio raíz del proyecto. El resto de las stories asumen que este scaffolding existe.
- `supabase/` se inicializa con `supabase init` en Story 1.2; aquí solo crear la carpeta vacía.
- La carpeta `_bmad-output/` ya existe en el workspace pero es solo para artefactos de planificación. El código del proyecto va en el directorio raíz o en una subcarpeta `retruco/` según cómo se ejecute el comando de Vite.

### Referencias

- [Source: architecture.md#Starter Template Evaluation] — Comando de inicialización y rationale
- [Source: architecture.md#Implementation Patterns] — Convenciones de nombres
- [Source: DESIGN.md frontmatter] — Tokens completos de colores, tipografía, radios, espaciado
- [Source: epics.md#Story 1.1] — Acceptance criteria completos
- [Source: architecture.md#D13] — Variables de entorno

## Dev Agent Record

### Agent Model Used

_pending_

### Debug Log References

### Completion Notes List

### File List

- `package.json`
- `vite.config.ts`
- `tailwind.config.ts`
- `tsconfig.json`
- `tsconfig.app.json`
- `index.html`
- `src/index.css`
- `src/App.tsx`
- `src/main.tsx`
- `.env.example`
- `.gitignore`
