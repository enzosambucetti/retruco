# Story 1.2: Schema de base de datos en Supabase

Status: review

## Story

As a developer,
I want to define the complete database schema as a Supabase migration,
so that all entities of the tournament exist in the database ready to receive data.

## Acceptance Criteria

1. Las tablas `bares`, `series`, `parejas`, `inscripciones`, `jornadas`, `partidos` existen en Supabase tras aplicar la migración.
2. Cada tabla tiene las columnas exactas especificadas en Dev Notes con los tipos correctos.
3. Todas las foreign keys tienen `ON DELETE RESTRICT`.
4. `supabase db push` aplica sin errores.

## Tasks / Subtasks

- [ ] Task 1 — Inicializar Supabase CLI en el proyecto (AC: 4)
  - [ ] Ejecutar `supabase init` en la raíz del proyecto (crea carpeta `supabase/` con `config.toml`)
  - [ ] Verificar que `supabase/` aparece en el repo con `config.toml`

- [ ] Task 2 — Crear migración `001_schema.sql` (AC: 1, 2, 3)
  - [ ] Ejecutar `supabase migration new 001_schema` (crea el archivo en `supabase/migrations/`)
  - [ ] Escribir SQL completo de las 6 tablas (ver Dev Notes)
  - [ ] Ejecutar `supabase db push` y verificar que aplica sin errores

## Dev Notes

### Prerequisito

Story 1.1 completada — proyecto inicializado. Supabase CLI instalado globalmente (`npm install -g supabase` o via binario).

### SQL completo para `001_schema.sql`

```sql
-- Extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla: bares
CREATE TABLE bares (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre      text NOT NULL,
  activo      boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Tabla: series
CREATE TABLE series (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre      text NOT NULL,
  dia_juego   text,
  bar_id      uuid REFERENCES bares(id) ON DELETE RESTRICT,
  activo      boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Tabla: parejas
CREATE TABLE parejas (
  id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  jugador1_nombre     text NOT NULL,
  jugador1_apellido   text NOT NULL,
  jugador2_nombre     text NOT NULL,
  jugador2_apellido   text NOT NULL,
  activo              boolean NOT NULL DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- Tabla: inscripciones (relación pareja-serie)
CREATE TABLE inscripciones (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  pareja_id   uuid NOT NULL REFERENCES parejas(id) ON DELETE RESTRICT,
  serie_id    uuid NOT NULL REFERENCES series(id) ON DELETE RESTRICT,
  activa      boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (pareja_id, serie_id)
);

-- Tabla: jornadas
CREATE TABLE jornadas (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  serie_id    uuid NOT NULL REFERENCES series(id) ON DELETE RESTRICT,
  numero      integer NOT NULL,
  fecha       date NOT NULL,
  activa      boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Tabla: partidos
CREATE TABLE partidos (
  id               uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  jornada_id       uuid NOT NULL REFERENCES jornadas(id) ON DELETE RESTRICT,
  inscripcion1_id  uuid NOT NULL REFERENCES inscripciones(id) ON DELETE RESTRICT,
  inscripcion2_id  uuid NOT NULL REFERENCES inscripciones(id) ON DELETE RESTRICT,
  tantos1          integer NOT NULL CHECK (tantos1 >= 0),
  tantos2          integer NOT NULL CHECK (tantos2 >= 0),
  activo           boolean NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- Índices para queries frecuentes
CREATE INDEX idx_series_bar_id ON series(bar_id);
CREATE INDEX idx_inscripciones_pareja_id ON inscripciones(pareja_id);
CREATE INDEX idx_inscripciones_serie_id ON inscripciones(serie_id);
CREATE INDEX idx_jornadas_serie_id ON jornadas(serie_id);
CREATE INDEX idx_partidos_jornada_id ON partidos(jornada_id);
CREATE INDEX idx_partidos_inscripcion1_id ON partidos(inscripcion1_id);
CREATE INDEX idx_partidos_inscripcion2_id ON partidos(inscripcion2_id);
```

### Convenciones de naming en DB

- Tablas: `snake_case` plural
- Columnas: `snake_case` singular descriptivo
- FK: `{tabla_singular}_id`
- Índices: `idx_{tabla}_{columna}`

### Anti-patterns a evitar

- ❌ No usar `SERIAL` ni `INTEGER` para PKs — usar `uuid` con `uuid_generate_v4()`
- ❌ No usar `CASCADE` en FK — usar `RESTRICT` para prevenir borrado accidental
- ❌ No crear columnas de stats calculados (PJ, G, P, etc.) en estas tablas — los standings se calculan en Story 1.4 via función SQL, no se almacenan en estas tablas

### Verificación

Tras `supabase db push`, verificar en Supabase Studio (o via `supabase db diff`) que las 6 tablas existen con los índices correctos.

### Project Structure Notes

- El archivo de migración va en: `supabase/migrations/TIMESTAMP_001_schema.sql`
- El timestamp lo genera `supabase migration new` automáticamente
- No editar `supabase/config.toml` en esta story

### Referencias

- [Source: epics.md#Story 1.2] — Acceptance criteria y estructura de tablas
- [Source: architecture.md#D3] — Decisión de usar Supabase CLI migrations
- [Source: architecture.md#Naming Patterns] — Convenciones snake_case en DB

## Dev Agent Record

### Agent Model Used

_pending_

### Debug Log References

### Completion Notes List

### File List

- `supabase/config.toml` (generado por `supabase init`)
- `supabase/migrations/TIMESTAMP_001_schema.sql`
