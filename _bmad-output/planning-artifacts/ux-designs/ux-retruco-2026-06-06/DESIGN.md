---
name: Retruco
description: Plataforma web de campeonato de Truco uruguayo. Tablas públicas, resultados y panel de administración. Mobile-first, light mode only.
status: final
created: "2026-06-06"
updated: "2026-06-06"
sources:
  - imports/retruco_league_system/DESIGN.md
  - _bmad-output/planning-artifacts/prds/prd-retruco-2026-06-06/prd.md
  - _bmad-output/planning-artifacts/briefs/brief-retruco-2026-06-06/brief.md
colors:
  # Surfaces
  background: '#fcf9f8'
  surface: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0edec'
  surface-container-high: '#ebe7e7'
  surface-container-highest: '#e5e2e1'
  surface-dim: '#dcd9d9'
  # Content
  on-surface: '#1c1b1b'
  on-surface-variant: '#40484f'
  outline: '#707880'
  outline-variant: '#bfc7d0'
  # Primary — Celeste uruguayo
  primary: '#006493'
  on-primary: '#ffffff'
  primary-container: '#4d9fd6'
  on-primary-container: '#00334e'
  # Secondary — Verde tapete
  secondary: '#3f6653'
  on-secondary: '#ffffff'
  secondary-container: '#beead1'
  on-secondary-container: '#436b58'
  # Tertiary — Dorado Sol de Mayo
  tertiary: '#815500'
  on-tertiary: '#ffffff'
  tertiary-container: '#cd8a00'
  on-tertiary-container: '#442b00'
  gold: '#E8A020'
  # Semantic
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
typography:
  display-lg:
    fontFamily: Barlow Condensed
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Barlow Condensed
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: 0.01em
  headline-lg-mobile:
    fontFamily: Barlow Condensed
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Barlow Condensed
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 28px
  ranking-number:
    fontFamily: Barlow Condensed
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 20px
    note: Usar tabular figures (dígitos mono-spaced) para que columnas de tabla alineen perfectamente
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 2px
  DEFAULT: 4px
  md: 6px
  lg: 8px
  xl: 12px
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  container-margin: 16px
  gutter: 12px
components:
  top-app-bar:
    height: 56px
    background: '{colors.surface}'
    border-bottom: '1px solid {colors.outline-variant}'
    position: sticky top-0 z-50
    logo: ícono playing_cards (Material Symbols) + wordmark "Retruco" en {colors.primary}, font headline-lg-mobile
    right-action: account_circle icon, {colors.primary}, 40×40px tap target
  bottom-nav:
    height: 64px
    background: '{colors.surface}'
    shadow: '0px -4px 12px rgba(0,0,0,0.1)'
    border-radius-top: 12px
    position: fixed bottom-0 z-50
    items:
      - label: Inicio
        icon: home
      - label: Tabla Global
        icon: leaderboard
      - label: Admin
        icon: admin_panel_settings
    active-state: ícono filled + label bold + {colors.primary}
    inactive-state: ícono outlined + {colors.on-surface-variant}
  series-card:
    background: '{colors.surface}'
    border: '1px solid {colors.outline-variant}'
    border-radius: '{rounded.xl}'
    image-header-height: 128px
    image-overlay: 'gradient-to-t from {colors.surface} to transparent'
    content-padding: '{spacing.md}'
    cta: full-width, {colors.primary} bg, {colors.on-primary} text, label-sm uppercase, rounded-lg
  standings-table:
    row-divider: '1px solid {colors.outline-variant}'
    rank-1-row-bg: '{colors.surface-container-low}'
    rank-col: ranking-number bold, {colors.primary} para posición 1
    numeric-cols: ranking-number
    header-row: label-sm uppercase {colors.on-surface-variant}
    tied-rows: mismo número de posición visible en ambas filas
    min-touch-row-height: 44px
  score-stepper:
    button-size: 48×56px
    value-display: 64×56px, ranking-number centrado, readonly
    border: '1px solid {colors.outline-variant}'
    active-press: scale(0.9)
    container-bg: '{colors.surface-container-low}'
    container-border: '1px solid {colors.outline-variant}'
    container-radius: '{rounded.xl}'
  winner-preview:
    background: '{colors.secondary-container}/30'
    border: '1px solid {colors.secondary-container}'
    icon: emoji_events filled, {colors.secondary-container} bg círculo 40×40px
    label: label-sm uppercase "PREVISUALIZACIÓN"
    text: body-md bold {colors.on-secondary-container}
    border-radius: '{rounded.xl}'
  cta-button-primary:
    background: '{colors.gold}'
    text: '{colors.on-tertiary-fixed}'
    height: 56px
    border-radius: '{rounded.xl}'
    font: headline-md bold
    shadow: shadow-lg
    active-press: scale(0.95)
    width: full cuando es acción principal en formulario
  button-secondary:
    background: '{colors.primary}'
    text: '{colors.on-primary}'
    border-radius: '{rounded.lg}'
    font: label-sm uppercase
    active-press: scale(0.95)
  status-chip:
    font: label-sm uppercase
    border-radius: '{rounded.full}'
    padding: '4px 12px'
    en-curso: '{colors.secondary-container}' bg, '{colors.on-secondary-container}' text
    finalizado: '{colors.surface-container-highest}' bg, '{colors.on-surface-variant}' text
  jornada-card:
    background: '{colors.surface-container-low}'
    border: '1px solid {colors.outline-variant}'
    border-radius: '{rounded.xl}'
    padding: '{spacing.md}'
    min-touch-height: 44px
  match-result-row:
    winner-pair: font-weight bold, {colors.on-surface}
    loser-pair: font-weight normal, {colors.on-surface-variant}
    score: ranking-number
    divider: '1px solid {colors.outline-variant}'
  input-field:
    height: 56px
    background: '{colors.surface}'
    border: '1px solid {colors.outline-variant}'
    border-radius: '{rounded.xl}'
    padding-x: '{spacing.md}'
    focus-ring: '2px solid {colors.primary}'
    font: body-md
  select-field:
    inherits: input-field
    icon-right: expand_more (Material Symbols), {colors.on-surface-variant}, pointer-events none
---

## Brand & Style

Retruco es la arena oficial del Truco uruguayo. El diseño equilibra la autoridad de una liga profesional con la calidez de un deporte de barrio. La identidad es **deportivo editorial**: tipografía condensada y contundente, datos al frente, ornamentos al mínimo.

La identidad cultural uruguaya vive en la paleta — no en ilustraciones. El celeste institucional evoca la bandera; el verde tapete, la mesa de juego; el dorado, el Sol de Mayo. Ningún elemento ilustrativo de naipes en el MVP.

El panel de administración hereda la misma identidad visual pero prioriza eficiencia operativa: formularios amplios, botones de acción claros, cero ambigüedad en acciones destructivas.

## Colors

La paleta tiene tres roles diferenciados:

- **Celeste uruguayo (`primary: #006493`)** — color estructural. Header, links activos, íconos de navegación, botones secundarios. Representa la liga como institución.
- **Verde tapete (`secondary: #3f6653` / container `#beead1`)** — color contextual. Fondos de preview de ganador, chips de estado activo, acentos de jornada en curso. Evoca la mesa de juego sin ser literal.
- **Dorado Sol (`gold: #E8A020` / `tertiary: #815500`)** — color de acción. Exclusivamente en el botón CTA primario (Guardar, Ingresar) y en highlights de campeón. Nunca decorativo.

Las superficies van de `background (#fcf9f8)` — levemente cálido, no clínico — hasta `surface-container-lowest (#ffffff)` para campos de entrada. Los dividers usan `outline-variant (#bfc7d0)` al menor contraste legible.

Evitar: gradientes saturados, fondos de error fuera de mensajes de error, el dorado en texto o decoración.

## Typography

Dos familias, roles estrictos:

**Barlow Condensed** maneja toda la capa de datos deportivos: títulos de sección, nombres de series, posiciones, tantos, puntajes. Su proporción condensada permite más columnas en 375px sin scroll horizontal. Pesos 600 y 700.

**Inter** maneja toda la capa funcional: cuerpo de texto, labels de formulario, mensajes de estado, descripciones. Alta legibilidad en tamaños pequeños. Pesos 400 y 600.

La escala `ranking-number` (Barlow Condensed 20px/700) es el token de datos críticos: se usa en cada celda numérica de tablas y en los steppers de puntaje. Siempre con tabular figures para alineación perfecta de columnas.

## Layout & Spacing

Grid de 4px base. Escala: 4 · 8 · 12 · 16 · 24 · 32px. Los saltos grandes (24–32px) separan secciones; los pequeños (4–8px) agrupan elementos relacionados.

Mobile: una sola columna, 16px de margen lateral. Contenido centrado con `max-w-md` en formularios de admin, `max-w-screen-xl` en vistas de tabla con desktop en mente. Desktop: grid de 2 o 4 columnas para las cards de series.

El `pb-20` del body acomoda el bottom nav fijo sin que el contenido quede tapado.

## Elevation & Depth

La jerarquía se comunica por tono de superficie, no por sombras.

- **Contenido en superficie base** (`surface / #fcf9f8`) — pantalla, headers.
- **Contenido elevado** (`surface-container-low / #f6f3f2`) — cards de series, jornadas, preview de ganador.
- **Entrada de datos** (`surface-container-lowest / #ffffff`) — campos de formulario y selects.
- **Sombra real**: solo para el bottom nav fijo (`0px -4px 12px rgba(0,0,0,0.1)`) y el CTA principal (`shadow-lg`). En ningún otro caso.

Separadores de tabla y bordes de card usan `outline-variant` — nunca sombra.

## Shapes

Geometría disciplinada. Sin "bubbly" ni completamente pill.

- `2px` — sin uso directo; borde mínimo de sistema.
- `4px (DEFAULT)` — botones inline, chips pequeños.
- `8px (lg)` — botones de acción secundaria, filas de tabla con hover.
- `12px (xl)` — cards de series, inputs, selects, preview cards, CTA principal. Forma dominante de la UI.
- `9999px (full)` — status chips únicamente (distinción visual deliberada del lenguaje estructural).

Imágenes en series-card siguen exactamente el radio del contenedor superior.

## Components

Ver tokens `components:` en frontmatter para especificación visual detallada. Resumen de intención:

- **Top App Bar** — sticky, siempre visible, wordmark + acción de cuenta. Establece marca en cada scroll.
- **Bottom Nav** — 3 ítems fijos: Inicio · Tabla Global · Admin. El estado activo usa ícono filled + primary. Es el único nav global; no hay drawer ni hamburger.
- **Series Card** — imagen de ambiente + datos clave + CTA. En mobile apila verticalmente; en desktop grid de 4.
- **Standings Table** — hero del producto. Tipografía de datos, columnas compactas, posición 1 destacada. Sin scroll horizontal en 375px.
- **Score Stepper** — entrada de tantos con +/− de 48×56px mínimo. No teclado numérico libre en mobile; el stepper evita errores de tipeo en contexto de juego.
- **Winner Preview** — feedback inmediato antes de guardar. Verde tapete señala resultado positivo sin ser un modal bloqueante.
- **CTA Button (gold)** — único en pantalla a la vez. Guardar partido, Ingresar al panel. Altura 56px, dorado, sombra.

## Do's and Don'ts

| Do | Don't |
|---|---|
| Usar `ranking-number` (Barlow Condensed 700) en todas las celdas numéricas de tabla | Mezclar Inter y Barlow en la misma celda de dato |
| Dorado exclusivamente en el CTA principal y highlights de campeón | Usar dorado como color decorativo o de estado |
| Steppers +/− para ingreso de tantos en mobile | Input numérico de teclado libre para datos deportivos en pantalla chica |
| Confirmar antes de acciones destructivas (desactivar, eliminar) | Eliminar datos sin diálogo de confirmación |
| `outline-variant` para todos los dividers de tabla y bordes de card | Sombras drop-shadow en elementos inline |
| Posición compartida visible en tabla cuando hay empate real | Ocultar o resolver empates de forma arbitraria sin criterio visible |
| `surface-container-lowest (#ffffff)` para campos de formulario | Fondo gris en inputs (confunde con estado deshabilitado) |
