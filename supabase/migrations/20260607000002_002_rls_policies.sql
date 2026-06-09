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
