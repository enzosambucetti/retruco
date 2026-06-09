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
