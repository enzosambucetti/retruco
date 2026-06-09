# Story 1.4: Función SQL de recálculo de standings

Status: review

## Story

As a developer,
I want a PostgreSQL function and trigger that automatically recalculates standings whenever a match result changes,
so that the standings table is always consistent without any frontend logic.

## Acceptance Criteria

1. El trigger se dispara al insertar, actualizar o desactivar (`activo=false`) un registro en `partidos`.
2. Para cada inscripción afectada se calculan: PJ, G, P, TF, TC, DIF, tantos acumulados, puntos de tabla (G×2) — solo con partidos `activo=true` de jornadas `activa=true`.
3. Existe una función `get_standings(serie_id uuid)` que retorna inscripciones ordenadas por los 5 criterios de desempate.
4. Existe una función `get_global_standings()` que retorna cada pareja una sola vez con la mejor serie como referencia.
5. Test manual: insertar 2 partidos y verificar que `get_standings()` retorna el orden correcto.

## Tasks / Subtasks

- [ ] Task 1 — Crear migración `003_standings_fn.sql` (AC: 1, 2, 3, 4)
  - [ ] Ejecutar `supabase migration new 003_standings_fn`
  - [ ] Implementar tabla `standings` para cachear resultados calculados
  - [ ] Implementar función `recalcular_standings_serie(serie_id uuid)` 
  - [ ] Implementar trigger en tabla `partidos`
  - [ ] Implementar función `get_standings(serie_id uuid)`
  - [ ] Implementar función `get_global_standings()`
  - [ ] Ejecutar `supabase db push` y verificar que aplica sin errores

- [ ] Task 2 — Test manual (AC: 5)
  - [ ] Insertar datos de prueba: 1 serie, 1 bar, 2 parejas, 1 jornada, 2 partidos
  - [ ] Llamar `SELECT * FROM get_standings(serie_id)` y verificar orden correcto
  - [ ] Desactivar un partido y verificar que standings se recalcula

## Dev Notes

### Prerequisito

Stories 1.2 y 1.3 completadas — tablas y RLS existen.

### Diseño de la solución

**Enfoque:** Tabla `standings` como caché calculado. El trigger la actualiza on-write en `partidos`. Las queries frontend leen de `get_standings()` (view/función que lee standings).

### SQL completo para `003_standings_fn.sql`

```sql
-- Tabla de standings precalculados por inscripción
CREATE TABLE standings (
  inscripcion_id  uuid PRIMARY KEY REFERENCES inscripciones(id) ON DELETE CASCADE,
  serie_id        uuid NOT NULL REFERENCES series(id) ON DELETE CASCADE,
  pj              integer NOT NULL DEFAULT 0,
  g               integer NOT NULL DEFAULT 0,
  p               integer NOT NULL DEFAULT 0,
  tf              integer NOT NULL DEFAULT 0,  -- tantos a favor
  tc              integer NOT NULL DEFAULT 0,  -- tantos en contra
  dif             integer NOT NULL DEFAULT 0,  -- diferencia (tf - tc)
  tantos          integer NOT NULL DEFAULT 0,  -- tantos acumulados (tf)
  pts             integer NOT NULL DEFAULT 0,  -- puntos de tabla (g * 2)
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_standings_serie_id ON standings(serie_id);

-- Habilitar RLS en standings (lectura pública)
ALTER TABLE standings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "standings_select_public" ON standings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "standings_write_admin" ON standings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- Función principal: recalcular standings de una inscripción
-- ============================================================
CREATE OR REPLACE FUNCTION recalcular_standings_inscripcion(p_inscripcion_id uuid)
RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  v_serie_id uuid;
  v_pj integer := 0;
  v_g  integer := 0;
  v_p  integer := 0;
  v_tf integer := 0;
  v_tc integer := 0;
BEGIN
  -- Obtener serie_id de la inscripción
  SELECT serie_id INTO v_serie_id FROM inscripciones WHERE id = p_inscripcion_id;

  -- Calcular stats como inscripcion1
  SELECT
    COUNT(*),
    COUNT(*) FILTER (WHERE tantos1 > tantos2),
    COUNT(*) FILTER (WHERE tantos1 < tantos2),
    COALESCE(SUM(tantos1), 0),
    COALESCE(SUM(tantos2), 0)
  INTO v_pj, v_g, v_p, v_tf, v_tc
  FROM partidos p
  JOIN jornadas j ON j.id = p.jornada_id
  WHERE p.inscripcion1_id = p_inscripcion_id
    AND p.activo = true
    AND j.activa = true;

  -- Sumar stats como inscripcion2
  SELECT
    v_pj + COUNT(*),
    v_g + COUNT(*) FILTER (WHERE tantos2 > tantos1),
    v_p + COUNT(*) FILTER (WHERE tantos2 < tantos1),
    v_tf + COALESCE(SUM(tantos2), 0),
    v_tc + COALESCE(SUM(tantos1), 0)
  INTO v_pj, v_g, v_p, v_tf, v_tc
  FROM partidos p
  JOIN jornadas j ON j.id = p.jornada_id
  WHERE p.inscripcion2_id = p_inscripcion_id
    AND p.activo = true
    AND j.activa = true;

  -- Upsert en standings
  INSERT INTO standings (inscripcion_id, serie_id, pj, g, p, tf, tc, dif, tantos, pts, updated_at)
  VALUES (
    p_inscripcion_id,
    v_serie_id,
    v_pj, v_g, v_p,
    v_tf, v_tc,
    v_tf - v_tc,  -- dif
    v_tf,         -- tantos = tf
    v_g * 2,      -- pts = ganados * 2
    now()
  )
  ON CONFLICT (inscripcion_id) DO UPDATE SET
    pj = EXCLUDED.pj,
    g  = EXCLUDED.g,
    p  = EXCLUDED.p,
    tf = EXCLUDED.tf,
    tc = EXCLUDED.tc,
    dif = EXCLUDED.dif,
    tantos = EXCLUDED.tantos,
    pts = EXCLUDED.pts,
    updated_at = now();
END;
$$;

-- ============================================================
-- Trigger function: se dispara en INSERT/UPDATE/DELETE partidos
-- ============================================================
CREATE OR REPLACE FUNCTION trigger_recalcular_standings()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  -- Determinar la fila afectada (NEW en insert/update, OLD en delete)
  IF TG_OP = 'DELETE' THEN
    PERFORM recalcular_standings_inscripcion(OLD.inscripcion1_id);
    PERFORM recalcular_standings_inscripcion(OLD.inscripcion2_id);
    RETURN OLD;
  ELSE
    PERFORM recalcular_standings_inscripcion(NEW.inscripcion1_id);
    PERFORM recalcular_standings_inscripcion(NEW.inscripcion2_id);
    RETURN NEW;
  END IF;
END;
$$;

CREATE TRIGGER trg_partidos_standings
AFTER INSERT OR UPDATE OR DELETE ON partidos
FOR EACH ROW EXECUTE FUNCTION trigger_recalcular_standings();

-- ============================================================
-- Función pública: get_standings(serie_id)
-- 5 criterios de desempate en cascada
-- ============================================================
CREATE OR REPLACE FUNCTION get_standings(p_serie_id uuid)
RETURNS TABLE (
  inscripcion_id  uuid,
  pareja_id       uuid,
  nombre_pareja   text,
  pj              integer,
  g               integer,
  p               integer,
  tf              integer,
  tc              integer,
  dif             integer,
  tantos          integer,
  pts             integer,
  posicion        integer
) LANGUAGE sql STABLE AS $$
  SELECT
    s.inscripcion_id,
    i.pareja_id,
    pa.jugador1_nombre || ' ' || pa.jugador1_apellido || ' / ' ||
    pa.jugador2_nombre || ' ' || pa.jugador2_apellido AS nombre_pareja,
    s.pj, s.g, s.p, s.tf, s.tc, s.dif, s.tantos, s.pts,
    RANK() OVER (
      ORDER BY s.pts DESC, s.tantos DESC, s.dif DESC, s.tf DESC
    )::integer AS posicion
  FROM standings s
  JOIN inscripciones i ON i.id = s.inscripcion_id
  JOIN parejas pa ON pa.id = i.pareja_id
  WHERE s.serie_id = p_serie_id
    AND i.activa = true
  ORDER BY posicion, pa.jugador1_apellido;
$$;

-- ============================================================
-- Función pública: get_global_standings()
-- Cada pareja aparece una sola vez con su mejor serie
-- ============================================================
CREATE OR REPLACE FUNCTION get_global_standings()
RETURNS TABLE (
  pareja_id           uuid,
  nombre_pareja       text,
  serie_referencia_id uuid,
  serie_nombre        text,
  pj                  integer,
  g                   integer,
  p                   integer,
  tf                  integer,
  tc                  integer,
  dif                 integer,
  tantos              integer,
  pts                 integer,
  posicion            integer
) LANGUAGE sql STABLE AS $$
  WITH mejor_serie AS (
    SELECT DISTINCT ON (i.pareja_id)
      i.pareja_id,
      s.inscripcion_id,
      s.serie_id,
      s.pj, s.g, s.p, s.tf, s.tc, s.dif, s.tantos, s.pts
    FROM standings s
    JOIN inscripciones i ON i.id = s.inscripcion_id
    WHERE i.activa = true
    ORDER BY i.pareja_id, s.pts DESC, s.tantos DESC
  )
  SELECT
    ms.pareja_id,
    pa.jugador1_nombre || ' ' || pa.jugador1_apellido || ' / ' ||
    pa.jugador2_nombre || ' ' || pa.jugador2_apellido AS nombre_pareja,
    ms.serie_id AS serie_referencia_id,
    se.nombre AS serie_nombre,
    ms.pj, ms.g, ms.p, ms.tf, ms.tc, ms.dif, ms.tantos, ms.pts,
    RANK() OVER (
      ORDER BY ms.pts DESC, ms.tantos DESC, ms.dif DESC, ms.tf DESC
    )::integer AS posicion
  FROM mejor_serie ms
  JOIN parejas pa ON pa.id = ms.pareja_id
  JOIN series se ON se.id = ms.serie_id
  ORDER BY posicion;
$$;
```

### Los 5 criterios de desempate (PRD FR-062, FR-073)

1. Puntos (`pts`) DESC
2. Tantos acumulados (`tantos`) DESC
3. Diferencia de tantos (`dif`) DESC
4. Tantos a favor (`tf`) DESC
5. En caso de empate total: misma posición (RANK, no ROW_NUMBER)

### Anti-patterns a evitar

- ❌ No calcular standings en el frontend — toda la lógica vive en SQL
- ❌ No usar `ROW_NUMBER()` — usar `RANK()` para que empates compartan posición
- ❌ No olvidar el filtro `j.activa = true` — jornadas desactivadas no cuentan
- ❌ No olvidar el filtro `p.activo = true` — partidos desactivados no cuentan
- ❌ No olvidar `i.activa = true` en get_standings — inscripciones inactivas no aparecen

### Project Structure Notes

- Archivo en: `supabase/migrations/TIMESTAMP_003_standings_fn.sql`
- La tabla `standings` es interna al backend — el frontend solo llama `get_standings()` y `get_global_standings()` via RPC

### Referencias

- [Source: epics.md#Story 1.4] — Acceptance criteria
- [Source: architecture.md#D1] — Decisión standings via PostgreSQL function + trigger
- [Source: prd.md#FR-062] — 5 criterios de desempate
- [Source: prd.md#FR-071, FR-072] — Lógica tabla global

## Dev Agent Record

### Agent Model Used

_pending_

### Debug Log References

### Completion Notes List

### File List

- `supabase/migrations/TIMESTAMP_003_standings_fn.sql`
