# Story 1.3: Políticas RLS de seguridad

Status: review

## Story

As a visitor,
I want to be able to read public tournament data without logging in,
so that I can view standings and results freely; and as an admin, all write operations are protected.

## Acceptance Criteria

1. `SELECT` está permitido en todas las tablas para el rol `anon`.
2. `INSERT`, `UPDATE`, `DELETE` con rol `anon` retornan error de permisos en todas las tablas.
3. `INSERT`, `UPDATE`, `DELETE` con rol `authenticated` son permitidos en todas las tablas.
4. RLS está habilitado en las 6 tablas.
5. Datos de usuarios admin (emails, passwords) no son accesibles desde tablas públicas — viven en `auth.users`.

## Tasks / Subtasks

- [ ] Task 1 — Crear migración `002_rls_policies.sql` (AC: 1, 2, 3, 4)
  - [ ] Ejecutar `supabase migration new 002_rls_policies`
  - [ ] Escribir SQL de RLS para las 6 tablas (ver Dev Notes)
  - [ ] Ejecutar `supabase db push` y verificar que aplica sin errores

- [ ] Task 2 — Verificar políticas (AC: 1, 2, 3, 5)
  - [ ] Con cliente anon: verificar que `SELECT` funciona en `series`, `partidos`, etc.
  - [ ] Con cliente anon: verificar que `INSERT` falla con error de permisos
  - [ ] Confirmar que no hay tablas en el schema público que expongan datos de `auth.users`

## Dev Notes

### Prerequisito

Story 1.2 completada — las 6 tablas existen en Supabase.

### SQL completo para `002_rls_policies.sql`

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE bares ENABLE ROW LEVEL SECURITY;
ALTER TABLE series ENABLE ROW LEVEL SECURITY;
ALTER TABLE parejas ENABLE ROW LEVEL SECURITY;
ALTER TABLE inscripciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE jornadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE partidos ENABLE ROW LEVEL SECURITY;

-- =====================
-- Políticas para: bares
-- =====================
CREATE POLICY "bares_select_public" ON bares
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "bares_write_admin" ON bares
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =====================
-- Políticas para: series
-- =====================
CREATE POLICY "series_select_public" ON series
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "series_write_admin" ON series
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ========================
-- Políticas para: parejas
-- ========================
CREATE POLICY "parejas_select_public" ON parejas
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "parejas_write_admin" ON parejas
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================
-- Políticas para: inscripciones
-- ============================
CREATE POLICY "inscripciones_select_public" ON inscripciones
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "inscripciones_write_admin" ON inscripciones
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ========================
-- Políticas para: jornadas
-- ========================
CREATE POLICY "jornadas_select_public" ON jornadas
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "jornadas_write_admin" ON jornadas
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ========================
-- Políticas para: partidos
-- ========================
CREATE POLICY "partidos_select_public" ON partidos
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "partidos_write_admin" ON partidos
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

### Notas sobre el modelo de seguridad

- **anon** = visitante no autenticado (cualquier usuario del sitio público)
- **authenticated** = admin con JWT válido de Supabase Auth
- Los datos de credenciales admin viven exclusivamente en `auth.users` (schema de Supabase, no expuesto)
- Esta política es deliberadamente simple: todos los admins tienen los mismos permisos (PRD FR-005)
- No hay Row-Level Security basada en user_id porque todos los admins son equivalentes en MVP

### Anti-patterns a evitar

- ❌ No crear una tabla `admins` o `usuarios` en el schema público — las credenciales van en Supabase Auth dashboard
- ❌ No exponer `auth.users` via una vista pública
- ❌ No usar `USING (auth.uid() IS NOT NULL)` — es equivalente pero más verboso que `TO authenticated`

### Verificación manual

```ts
// Test con cliente anon (debería funcionar)
const { data } = await supabase.from('series').select('*')

// Test con cliente anon (debería fallar con error 42501)
const { error } = await supabase.from('series').insert({ nombre: 'test' })
console.log(error?.code) // '42501' = RLS violation
```

### Project Structure Notes

- Archivo en: `supabase/migrations/TIMESTAMP_002_rls_policies.sql`
- No modificar las tablas del schema — solo agregar políticas

### Referencias

- [Source: epics.md#Story 1.3] — Acceptance criteria
- [Source: architecture.md#D4] — Decisión RLS: SELECT anon / write authenticated
- [Source: prd.md#NFR-005] — Solo nombre+apellido expuestos públicamente

## Dev Agent Record

### Agent Model Used

_pending_

### Debug Log References

### Completion Notes List

### File List

- `supabase/migrations/TIMESTAMP_002_rls_policies.sql`
