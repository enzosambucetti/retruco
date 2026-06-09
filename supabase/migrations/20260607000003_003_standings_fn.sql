-- Tabla de standings precalculados por inscripción
CREATE TABLE standings (
  inscripcion_id  uuid PRIMARY KEY REFERENCES inscripciones(id) ON DELETE CASCADE,
  serie_id        uuid NOT NULL REFERENCES series(id) ON DELETE CASCADE,
  pj              integer NOT NULL DEFAULT 0,
  g               integer NOT NULL DEFAULT 0,
  p               integer NOT NULL DEFAULT 0,
  tf              integer NOT NULL DEFAULT 0,
  tc              integer NOT NULL DEFAULT 0,
  dif             integer NOT NULL DEFAULT 0,
  tantos          integer NOT NULL DEFAULT 0,
  pts             integer NOT NULL DEFAULT 0,
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_standings_serie_id ON standings(serie_id);

-- Habilitar RLS en standings (lectura pública)
ALTER TABLE standings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "standings_select_public" ON standings
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "standings_write_system" ON standings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- Función: recalcular standings de una inscripción específica
-- ============================================================
CREATE OR REPLACE FUNCTION recalcular_standings_inscripcion(p_inscripcion_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_serie_id uuid;
  v_pj integer := 0;
  v_g  integer := 0;
  v_p  integer := 0;
  v_tf integer := 0;
  v_tc integer := 0;
  v_pj2 integer := 0;
  v_g2  integer := 0;
  v_p2  integer := 0;
  v_tf2 integer := 0;
  v_tc2 integer := 0;
BEGIN
  -- Obtener serie_id de la inscripción
  SELECT serie_id INTO v_serie_id FROM inscripciones WHERE id = p_inscripcion_id;

  IF v_serie_id IS NULL THEN
    RETURN;
  END IF;

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

  -- Calcular stats como inscripcion2
  SELECT
    COUNT(*),
    COUNT(*) FILTER (WHERE tantos2 > tantos1),
    COUNT(*) FILTER (WHERE tantos2 < tantos1),
    COALESCE(SUM(tantos2), 0),
    COALESCE(SUM(tantos1), 0)
  INTO v_pj2, v_g2, v_p2, v_tf2, v_tc2
  FROM partidos p
  JOIN jornadas j ON j.id = p.jornada_id
  WHERE p.inscripcion2_id = p_inscripcion_id
    AND p.activo = true
    AND j.activa = true;

  -- Sumar ambos lados
  v_pj := v_pj + v_pj2;
  v_g  := v_g  + v_g2;
  v_p  := v_p  + v_p2;
  v_tf := v_tf + v_tf2;
  v_tc := v_tc + v_tc2;

  -- Upsert en standings
  INSERT INTO standings (inscripcion_id, serie_id, pj, g, p, tf, tc, dif, tantos, pts, updated_at)
  VALUES (
    p_inscripcion_id,
    v_serie_id,
    v_pj, v_g, v_p,
    v_tf, v_tc,
    v_tf - v_tc,
    v_tf,
    v_g * 2,
    now()
  )
  ON CONFLICT (inscripcion_id) DO UPDATE SET
    pj         = EXCLUDED.pj,
    g          = EXCLUDED.g,
    p          = EXCLUDED.p,
    tf         = EXCLUDED.tf,
    tc         = EXCLUDED.tc,
    dif        = EXCLUDED.dif,
    tantos     = EXCLUDED.tantos,
    pts        = EXCLUDED.pts,
    updated_at = now();
END;
$$;

-- ============================================================
-- Trigger: se dispara en INSERT / UPDATE / DELETE en partidos
-- ============================================================
CREATE OR REPLACE FUNCTION trigger_recalcular_standings()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
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
-- Retorna posiciones con los 5 criterios de desempate
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
) LANGUAGE sql STABLE SECURITY DEFINER AS $$
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
-- Cada pareja una sola vez con su mejor serie como referencia
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
) LANGUAGE sql STABLE SECURITY DEFINER AS $$
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
