# Story 1.7: Deploy a Vercel

Status: review

## Story

As an admin,
I want the app live on a public URL,
so that the team can verify the shell in production before building features.

## Acceptance Criteria

1. Vercel detecta Vite automáticamente con `npm run build` y output en `dist/`.
2. Las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` están configuradas en Vercel con valores de producción.
3. La URL pública carga el shell sin errores de consola.
4. Deploy automático se activa en cada push a `main`.
5. El costo mensual es $0 (Vercel Hobby + Supabase free tier).

## Tasks / Subtasks

- [ ] Task 1 — Verificar build local antes de deploy (AC: 1)
  - [ ] Ejecutar `npm run build` y verificar que termina sin errores TypeScript
  - [ ] Ejecutar `npm run preview` y verificar que la app funciona desde `dist/`

- [ ] Task 2 — Conectar repositorio a Vercel (AC: 1, 4)
  - [ ] Push del código a repositorio GitHub/GitLab
  - [ ] Crear nuevo proyecto en Vercel (vercel.com → New Project → Import Git Repository)
  - [ ] Verificar que Vercel detecta automáticamente: Framework=Vite, Build Command=`npm run build`, Output=`dist`

- [ ] Task 3 — Configurar variables de entorno en Vercel (AC: 2)
  - [ ] En Vercel dashboard → Settings → Environment Variables
  - [ ] Agregar `VITE_SUPABASE_URL` con el valor de producción (desde Supabase dashboard)
  - [ ] Agregar `VITE_SUPABASE_ANON_KEY` con el valor de producción
  - [ ] Seleccionar entornos: Production, Preview, Development

- [ ] Task 4 — Verificar deploy (AC: 3, 4, 5)
  - [ ] Esperar que Vercel complete el primer deploy
  - [ ] Abrir la URL pública generada (ej: `retruco-xxx.vercel.app`)
  - [ ] Verificar que el shell carga: TopAppBar y BottomNav visibles, sin errores en consola
  - [ ] Hacer un segundo commit y verificar que Vercel despliega automáticamente

## Dev Notes

### Prerequisito

Stories 1.1–1.6 completadas — app funciona localmente.

### Configuración de Vercel (auto-detectada para Vite)

Vercel detecta proyectos Vite automáticamente. No se necesita `vercel.json`. Las settings auto-detectadas son:

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### SPA Routing — configuración crítica

Vite genera una SPA. Sin configuración adicional, las rutas como `/global` o `/admin` darán 404 al refrescar. Para solucionar, crear `public/vercel.json` o un archivo `vercel.json` en la raíz:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Esto redirige todas las rutas al `index.html` para que React Router las maneje.

### Variables de entorno

Las variables que empiezan con `VITE_` son expuestas al cliente por Vite durante el build. Los valores de producción se obtienen de Supabase dashboard → Project Settings → API.

**Nunca** commitear `.env.local` con valores reales. Ya está en `.gitignore` desde Story 1.1.

### Costo $0

- **Vercel Hobby:** Deploy ilimitado de proyectos estáticos, 100GB bandwidth/mes, dominio `*.vercel.app` gratuito
- **Supabase Free:** 500MB DB, 2GB bandwidth, auth incluido, edge functions incluidas

### Anti-patterns a evitar

- ❌ No usar `vercel build` localmente — el CI de Vercel lo maneja
- ❌ No agregar variables de entorno como secretos en el repo — solo en Vercel dashboard
- ❌ No olvidar el `vercel.json` con rewrites — sin él, refresh en rutas SPA da 404

### Project Structure Notes

```
vercel.json    ← NUEVO (en raíz del proyecto)
```

### Referencias

- [Source: architecture.md#D11] — Decisión Vercel hosting free tier
- [Source: architecture.md#D12] — CI/CD: push a main → deploy automático
- [Source: architecture.md#D13] — Variables de entorno: .env.local y Vercel dashboard
- [Source: epics.md#Story 1.7] — Acceptance criteria

## Dev Agent Record

### Agent Model Used

_pending_

### Debug Log References

### Completion Notes List

### File List

- `vercel.json`
