---
name: Retruco — Experience
status: final
created: "2026-06-06"
updated: "2026-06-06"
sources:
  - DESIGN.md
  - imports/retruco_league_system/DESIGN.md
  - imports/home_light/code.html
  - imports/add_match_result_light/code.html
  - imports/admin_dashboard_light/code.html
  - _bmad-output/planning-artifacts/prds/prd-retruco-2026-06-06/prd.md
  - _bmad-output/planning-artifacts/briefs/brief-retruco-2026-06-06/brief.md
mockups:
  - imports/home_light/screen.png
  - imports/series_detail_light/screen.png
  - imports/jornadas_list_light/
  - imports/jornada_detail_light/
  - imports/global_standings_light/
  - imports/admin_login_light/
  - imports/admin_dashboard_light/
  - imports/add_match_result_light/
---

# Retruco — Experience Specification

Los tokens visuales referenciados como `{path.token}` corresponden a `DESIGN.md`.

---

## Foundation

**Form factor primario:** Mobile-first. Viewport de referencia 375px. Toda decisión de IA y componente parte de 375px y escala hacia arriba.

**UI System:** React + TailwindCSS + Material Symbols Outlined (Google Fonts). El sistema de tokens de `DESIGN.md` se implementa como extensión del theme de Tailwind (ver `imports/home_light/code.html` como referencia de configuración).

**Modo:** Light mode exclusivo. No hay soporte de dark mode en el MVP.

**Referencia visual:** `DESIGN.md` es la fuente de verdad para colores, tipografía, espaciado, radios y componentes visuales. Este documento especifica comportamiento, estados, flujos e interacciones.

---

## Information Architecture

### Árbol de pantallas

```
/ (Home)
  └── /series/:id (Serie — Posiciones)
        ├── [tab] Posiciones           ← default
        └── [tab] Jornadas
              └── /series/:id/jornadas/:jornada_id (Detalle de Jornada)
/global                                ← Tabla Global
/admin/login                           ← Autenticación
/admin (Panel Admin)
  ├── /admin/series                   ← Gestión de series
  ├── /admin/parejas                  ← Gestión de parejas
  ├── /admin/bares                    ← Gestión de bares
  ├── /admin/jornadas                 ← Gestión de jornadas
  └── /admin/partidos/nuevo           ← Carga de resultado
        └── /admin/partidos/:id/editar
```

### Superficies por rol

| Superficie | Visitante / Jugador | Administrador |
|---|---|---|
| Home / Series | ✅ lectura | ✅ lectura |
| Tabla de serie | ✅ lectura | ✅ lectura |
| Jornadas / Detalle | ✅ lectura | ✅ lectura |
| Tabla Global | ✅ lectura | ✅ lectura |
| Admin Login | — | ✅ acceso |
| Panel Admin + CRUD | — | ✅ escritura |

### Cierre de IA

Toda necesidad del PRD tiene superficie:
- Ver tabla de serie → `/series/:id` (tab Posiciones)
- Ver jornadas y resultados → `/series/:id` (tab Jornadas) + `/series/:id/jornadas/:id`
- Ver tabla global → `/global`
- Cargar resultados → `/admin/partidos/nuevo`
- Gestionar entidades → `/admin/series`, `/admin/parejas`, `/admin/bares`, `/admin/jornadas`

---

## Voice and Tone

El producto habla con autoridad ligera y directa, como el locutor de una liga local bien organizada. No es corporativo frío ni informal descuidado.

**Microcopy:**

- Acciones: verbos cortos e imperativos. "Guardar Partido", "Ver Posiciones", "Ingresar". No "Haga clic para guardar".
- Labels de tabla: abreviaturas estándar del deporte. PJ (partidos jugados), G, P, TF, TC, DIF, Pts. Tooltip disponible en long-press/hover.
- Confirmaciones destructivas: directas, sin dramatismo. "¿Desactivar esta serie? Los datos se conservan."
- Estados vacíos: informativos sin apología. "Todavía no hay jornadas en esta serie."
- Errores de red: breves y accionables. "No se pudo guardar. Intentá de nuevo."
- Títulos de sección: Barlow Condensed, sin puntuación final. "Series activas", "Tabla Global".

**Idioma:** Español rioplatense. Voseo natural ("ingresá", "guardá", "tocá"). Sin anglicismos innecesarios.

---

## Component Patterns

Comportamiento de los componentes principales. Especificación visual en `DESIGN.md.components`.

### Top App Bar

Sticky en `top-0`. Siempre visible durante el scroll. No colapsa.

Contiene: wordmark izquierda + ícono de cuenta derecha. En contexto admin con sesión activa, el ícono de cuenta abre menú con "Cerrar sesión". En contexto público, el ícono de cuenta navega a `/admin/login`.

### Bottom Navigation

Fijo en `bottom-0`. Tres ítems: **Inicio · Tabla Global · Admin**. El ítem activo se determina por ruta actual. Tap en ítem ya activo no hace nada (no recarga).

En pantallas de detalle anidadas (jornada, formulario de partido) el bottom nav permanece visible. La navegación "atrás" usa el back chevron inline en el header de la pantalla, no un cambio en el bottom nav.

### Series Card

Imagen de cabecera con overlay gradiente. La imagen es ambiental (bar, mesa de juego); no es foto del establecimiento real. En producción puede ser placeholder estático o imagen de Unsplash por categoría.

Tap en cualquier parte de la card navega a `/series/:id`. El botón "VER POSICIONES" es redundante con el tap de card — ambos van al mismo destino. Incluido por claridad en el primer acceso.

Card en estado inactive (serie desactivada) no aparece en la vista pública.

### Standings Table

Columnas en 375px (en orden, izquierda a derecha): **#** · **Pareja** · **PJ** · **G** · **P** · **TF** · **TC** · **DIF** · **Tantos** · **Pts**

La columna "Pareja" (texto) recibe el ancho disponible; el resto son columnas numéricas de ancho fijo mínimo (~28–36px). Sin scroll horizontal — esto se garantiza con `ranking-number` condensado y anchos ajustados.

Fila rank 1 con `{colors.surface-container-low}` background. Empates: mismo número en ambas filas, sin asterisco ni nota. El criterio de desempate es automático (el orden ya lo refleja); la tabla no explica el algoritmo inline.

La tabla no es paginada en MVP (máximo esperado ~30 parejas por serie, carga en una sola pantalla).

### Score Stepper

Usado exclusivamente en el formulario de carga de partido. Dos steppers independientes: Pareja 1 y Pareja 2.

Valor mínimo: 0. Sin máximo forzado (PRD D-3: el admin ingresa tantos reales, el sistema no fuerza 40). El input numérico subyacente es `readonly` — solo se modifica vía botones +/−. Esto previene entrada de teclado accidental en mobile durante el juego.

El winner-preview se recalcula en cada cambio de stepper sin necesitar confirmación. Si los tantos son iguales, muestra "Empate: {n} — {n}".

### Winner Preview

Aparece inline debajo del stepper, siempre visible (no es un toast ni un modal). Actualización instantánea. Fondo verde tapete. No bloquea el formulario.

### Jornada Card (lista)

Cada card muestra: número de jornada · fecha formateada ("14 de abril de 2025") · cantidad de partidos. Tap navega al detalle.

Ordenadas cronológicamente, más reciente arriba.

### Match Result Row

Dentro del detalle de jornada. Estructura: `[Pareja A] [score A] — [score B] [Pareja B]`. El nombre de la pareja ganadora va en bold; el perdedor en `{colors.on-surface-variant}`. Sin ícono de trofeo ni chip de color — la tipografía hace el trabajo.

---

## State Patterns

### Loading

Skeleton placeholder que replica la forma del contenido: barras grises en lugar de filas de tabla, rectángulo gris en lugar de cards. Duración máxima de skeleton: 3s. Si supera, mostrar error.

### Empty

Pantalla sin datos muestra ilustración mínima (ícono de Material Symbols grande, `{colors.outline-variant}`) + mensaje informativo. Ejemplos:

- Sin series: "El campeonato aún no tiene series. Ingresá como admin para configurarlo."
- Sin jornadas en serie: "Todavía no hay jornadas en esta serie."
- Sin partidos en jornada: "No se cargaron partidos para esta jornada."

### Error de red

Toast en la parte inferior (sobre el bottom nav) con mensaje corto y botón "Reintentar". Autocierra en 5s si no hay interacción.

### Confirmación de acción destructiva

Diálogo bottom sheet (no alert nativo del browser). Título: acción en bold. Descripción: consecuencia. Dos botones: "Cancelar" (secondary, izquierda) y acción destructiva en `{colors.error}` bg (derecha). El foco va al botón cancelar por defecto.

Aplica a: desactivar serie, desactivar pareja de serie, desactivar jornada, desactivar partido.

### Formulario con validación

Errores de campo se muestran debajo del input con `{colors.error}` text, label-sm. El borde del campo cambia a `{colors.error}`. El CTA queda habilitado siempre; la validación se ejecuta al submit.

### Sesión expirada

Si el token de admin expira mid-session, el próximo request muestra el toast "Sesión vencida. Ingresá de nuevo." y redirige a `/admin/login`.

---

## Interaction Primitives

**Touch targets:** Mínimo 44×44px para todo elemento interactivo. Steppers: 48×56px. CTA: 56px alto full-width.

**Press feedback:** `active:scale-95` en botones, cards y nav items. `active:scale-90` en botones de alta frecuencia (steppers). Duración 150ms.

**Hover (desktop):** `hover:bg-surface-container-low` en cards y nav items. `hover:shadow-lg` en series-card. Transición 300ms.

**Scroll:** Tablas sin scroll horizontal. Listas verticales con scroll nativo del body (no `overflow-y: scroll` contenido — permite el pull-to-refresh nativo en mobile).

**Animaciones de entrada:** Cards de series con fade-in + translate-y-4 → translate-y-0 al entrar en viewport (IntersectionObserver). Duración 500ms. Reducido a none si `prefers-reduced-motion`.

**Navegación atrás:** El chevron `arrow_back` (Material Symbols) en el header de pantallas de detalle usa `history.back()`. Sin lógica de breadcrumb.

**Selects:** Native `<select>` con ícono `expand_more` decorativo superpuesto. Comportamiento del SO en mobile (sheet nativo). No custom dropdowns en MVP.

---

## Accessibility Floor

- **Contraste:** `{colors.on-surface}` sobre `{colors.background}` ≥ 4.5:1. `{colors.on-primary}` sobre `{colors.primary}` ≥ 4.5:1. `{colors.on-tertiary-fixed}` sobre `{colors.gold}` verificado ≥ 3:1 (texto grande en CTA).
- **Touch targets:** 44px mínimo en todos los elementos interactivos (ver Interaction Primitives).
- **Labels de formulario:** Todos los inputs tienen `<label>` asociado por `for`/`id`. Los selects también.
- **Imágenes:** `alt=""` en imágenes decorativas de series-card (no aportan información estructural).
- **Focus visible:** El navegador aplica `focus-visible` en elementos focusables. No suprimir outline en interacciones de teclado.
- **Idioma:** `lang="es"` en `<html>`.
- **Reduced motion:** Las animaciones de entrada de cards respetan `prefers-reduced-motion: reduce` (omiten transición, muestran directamente).

---

## Key Flows

### Flujo 1 — Marcelo carga los resultados de una jornada

*Marcelo organiza la liga. La jornada de los lunes terminó y tiene los resultados en papel. Son las 11 PM, está en el bar.*

1. Abre Retruco en el celular. Ve la pantalla Home con las series activas. El bottom nav muestra "Admin" con ícono de escudo.
2. Toca "Admin" en el bottom nav → pantalla `/admin/login`. Wordmark centrado, campos email y password, CTA dorado "Ingresar".
3. Completa credenciales y toca "Ingresar". Transición a Panel Admin. Ve el acceso rápido a "Partidos".
4. Toca "Partidos" → formulario "Agregar Partido". El selector de jornada ya tiene la jornada activa de la Serie Lunes pre-seleccionada (o la selecciona manualmente).
5. **Clímax:** Selecciona Pareja 1 (García / Rodríguez), Pareja 2 (Silva / Núñez). Usa los steppers +/− para ingresar 40 y 28. El winner-preview actualiza al instante: "Ganador: García / Rodríguez (40 tantos)". Toca "Guardar Partido".
6. Diálogo de confirmación: "¿Guardar este partido?" con los datos resumidos. Toca confirmar.
7. La tabla de posiciones se recalcula. Marcelo repite los pasos 4–6 para cada partido de la noche. Al terminar, comparte el link de la tabla con el grupo de WhatsApp.

**Puntos de fricción a eliminar:** Ningún paso requiere teclado para los tantos (steppers). El winner-preview confirma antes de guardar que no hubo error de pareja.

---

### Flujo 2 — Silvana consulta posiciones desde el celular

*Silvana juega en la Serie Miércoles. Son las 10 PM, acaba de terminar su última mano. Abre Retruco para ver cómo quedó la tabla.*

1. Abre el link de Retruco en el navegador. Carga el Home en < 3s. Ve las series activas en cards con foto de ambiente.
2. Toca la card "Serie Miércoles Marlon". Navega a `/series/miercoles`.
3. **Clímax:** Ve la tabla de posiciones ya actualizada con la jornada de esta noche. Su pareja (Silva / Núñez) está en la posición 2 con los tantos frescos de esta noche. La columna "Pts" confirma que siguen en carrera.
4. Toca el tab "Jornadas". Ve la jornada de esta noche arriba del todo (más reciente). La toca.
5. Ve el detalle: todos los partidos de la noche con resultados, el nombre de su pareja en bold en los partidos que ganaron.
6. Toca el ícono de leaderboard en el bottom nav → Tabla Global. Ve la posición de su pareja en el campeonato general, con la columna "Serie" indicando que su puntaje viene de la Serie Miércoles.

**Puntos de fricción a eliminar:** No requiere login. Tabla visible sin scroll horizontal. La tab de Jornadas está a un tap desde la tabla sin perder el contexto de la serie.

---

## Admin CRUD Patterns

Patrones aplicables a todas las entidades gestionadas: Series, Bares, Parejas, Jornadas, Partidos.

### Lista de entidades

Cada sección admin muestra una lista de filas con: nombre/identificador · metadata clave · acciones inline (editar · desactivar). Las entidades inactivas aparecen al final de la lista con opacidad reducida y chip "Inactivo".

### Crear entidad

Botón "Nueva [entidad]" (FAB o botón secundario en header de sección). Navega a formulario de creación. Al guardar exitosamente, regresa a la lista con la nueva entidad visible.

### Editar entidad

Ícono de lápiz en la fila. Navega al mismo formulario pre-completado con los datos actuales. Al guardar, regresa a la lista.

### Desactivar entidad

Ícono de archivo/desactivar en la fila. Abre diálogo de confirmación (ver State Patterns). Al confirmar: la entidad deja de aparecer en vistas públicas pero conserva su historial. Acción reversible desde la lista admin (reactivar).

### Recálculo automático

Después de guardar, editar o desactivar un partido, la tabla de posiciones de la serie se recalcula automáticamente en el backend. La vista pública refleja el estado actualizado en el próximo load.

---

## Responsive & Platform

### Mobile (375px — 767px)

Layout de referencia. Una columna. Bottom nav fijo. Cards de series en stack vertical. Tablas de datos con columnas compactas de ancho fijo. Steppers de tantos con targets generosos.

### Tablet (768px — 1279px)

Cards de series en grid de 2 columnas. Tablas con algo más de padding en celdas. Bottom nav permanece (no cambia a sidebar en MVP).

### Desktop (1280px+)

Cards de series en grid de 4 columnas. Contenido centrado con `max-w-screen-xl` + `mx-auto`. Tablas aprovechan el ancho con más separación entre columnas. Bottom nav permanece visible — no hay sidebar en MVP. Hover states activos.

### Consideraciones de plataforma

- **iOS Safari:** `pb-safe` en el bottom nav para respetar el home indicator. `-webkit-tap-highlight-color: transparent` para eliminar el highlight azul nativo en taps.
- **Android Chrome:** Comportamiento nativo de selects. Sin customización.
- **Fuentes:** Cargadas desde Google Fonts (Barlow Condensed + Inter). Si la carga falla, el fallback es `sans-serif` — la UI es legible aunque pierde la identidad deportiva.
