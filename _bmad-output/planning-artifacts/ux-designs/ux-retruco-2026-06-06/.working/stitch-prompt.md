# Retruco — Google Stitch Design Prompt

## Instrucciones de uso

1. Abrí https://stitch.withgoogle.com
2. Pegá el bloque "PROMPT" completo (desde el separador hasta el final)
3. Guardá todos los archivos que Stitch genere en `imports/` (DESIGN.md + HTMLs de pantallas)
4. Volvé a este IDE y corré `bmad-ux` → modo Update para distillar el output en los spines finales

---

## PROMPT

---

Design a mobile-first web application called **Retruco** — a tournament management platform for a Uruguayan Truco card-game league.

### Product context

Retruco manages a single active championship organized in monthly **series** (each series plays on a fixed weekday at a neighborhood bar). Within each series, **pairs** of players compete in **jornadas** (monthly game nights). Administrators manually enter match results; the system auto-calculates rankings. The public views standings and results without logging in.

**Two user types:**
- **Visitor / Player (no login):** Browses public standings, results, and jornada history. Primarily on mobile, often checking scores right after or during a game night.
- **Administrator (logged in):** Creates/edits series, pairs, bars, jornadas, and match results. Also mobile. Needs fast, low-friction data entry.

---

### Visual direction

**Style:** Sports-league classic — clean, data-forward, strong typography, easy-to-scan tables.

**Cultural identity:** Subtle references to Uruguay and the Truco card game woven into the palette:
- Celeste uruguayo (Uruguayan sky blue, ~`#4D9FD6`) as the primary brand color
- Deep green (~`#1B4332`) evoking the card-table felt, used as a dark surface or accent in dark mode
- Warm gold (~`#E8A020`) evoking the Sun of May on the Uruguayan flag, used sparingly as the primary action/highlight accent
- No literal card illustrations or iconography in the MVP — the identity lives in the palette and typography only

**Modes:** Both **light mode** and **dark mode**.
- Light: white/very light gray base, celeste primary, gold accent
- Dark: deep charcoal or dark green base, celeste lighter, gold accent

**Typography:** Strong, legible, sports-league feel. Consider a condensed or semi-condensed sans-serif for headings/rankings (numbers must be crisp). Body text comfortable at small sizes on mobile.

**Tables:** This app is primarily a rankings viewer. Tables must be the hero element — clear row separations, rank numbers prominent, winner/loser distinction subtle but clear.

---

### Screens to design

Design all 8 screens in both light and dark mode. Primary viewport: **375px wide (iPhone SE / standard mobile)**.

---

#### Screen 1 — Home / Series overview (public)

The landing page. Shows the active championship with a list of series cards.

Content:
- App header: "Retruco" wordmark + tagline (e.g. "Campeonato de Truco")
- Section: "Series activas" — list of series cards, each showing:
  - Series name (e.g. "Serie Lunes", "Serie Miércoles Marlon")
  - Weekday badge (e.g. "Lunes", "Miércoles")
  - Bar name (e.g. "Bar El Palmar")
  - Quick stat: number of pairs enrolled
  - Tap → goes to Series detail (Screen 2)
- Bottom nav or tab bar: "Inicio" · "Tabla Global" · (Admin icon if logged in)

States: at least 4 series cards visible.

---

#### Screen 2 — Series detail / Standings table (public)

The core public screen. Shows the standings table for one series.

Content:
- Back nav + Series name header + bar name + weekday
- Tab selector: **"Posiciones"** | "Jornadas"
- Standings table (Posiciones tab active):
  - Columns: # · Pareja · PJ · G · P · TF · TC · DIF · Tantos · Pts
  - Column labels abbreviated; full names visible on long-press or header tooltip
  - Rank 1 row subtly highlighted
  - Tied pairs show shared rank (e.g. two rows with "2")
  - Minimum 8 rows of data visible
  - Table must NOT require horizontal scroll on 375px — abbreviate columns, use compact numeric cells

Sample data for the table (use this exactly):
```
# | Pareja              | PJ | G | P | TF  | TC  | DIF  | Tantos | Pts
1 | García / Rodríguez  |  5 | 4 | 1 | 175 | 120 |  +55 |   295  |  8
2 | Silva / Núñez       |  5 | 3 | 2 | 160 | 135 |  +25 |   295  |  6
2 | Martínez / López    |  5 | 3 | 2 | 155 | 130 |  +25 |   285  |  6
4 | Pérez / Fernández   |  5 | 2 | 3 | 140 | 150 |  -10 |   275  |  4
5 | González / Suárez   |  5 | 1 | 4 | 120 | 165 |  -45 |   260  |  2
6 | Herrera / Castro    |  5 | 0 | 5 | 100 | 180 |  -80 |   245  |  0
```

---

#### Screen 3 — Jornadas list (public, Series detail — Jornadas tab)

Same header as Screen 2 but with "Jornadas" tab active.

Content:
- List of jornadas in chronological order, each row showing:
  - Jornada number (e.g. "Jornada 3")
  - Date (e.g. "14 de abril de 2025")
  - Number of matches played
  - Tap → Jornada detail (Screen 4)

Sample: 5 jornadas listed, most recent at top.

---

#### Screen 4 — Jornada detail / Match results (public)

Content:
- Back nav + "Jornada 3 — 14 abr 2025" header
- Series name sub-header
- List of match result cards, each showing:
  - Left pair name + score | Right pair name + score
  - Winner visually distinguished (bold name or subtle highlight, NOT a colored badge)
  - Clean, card-like rows

Sample data (6 matches):
```
García / Rodríguez  40 — 28  Silva / Núñez         → García wins
Martínez / López    40 — 32  Pérez / Fernández      → Martínez wins
González / Suárez   38 — 40  Herrera / Castro       → Herrera wins
Silva / Núñez       40 — 25  González / Suárez      → Silva wins
García / Rodríguez  40 — 30  Herrera / Castro       → García wins
Pérez / Fernández   40 — 35  Martínez / López       → Pérez wins
```

---

#### Screen 5 — Global standings table (public)

Same structure as Screen 2 standings table, but:
- Header: "Tabla Global — Campeonato 2025"
- Extra column after Pareja: "Serie" (which series their best score comes from)
- All pairs from all series appear once, ranked by their best-series performance
- 10+ rows of sample data mixing pairs from different series

---

#### Screen 6 — Admin login (auth)

Simple, clean authentication screen.

Content:
- Retruco wordmark/logo centered
- "Panel de Administración" label
- Email input field
- Password input field
- "Ingresar" primary button (gold accent)
- No "sign up" or "forgot password" link in MVP (accounts are predefined)

---

#### Screen 7 — Admin dashboard / Panel (admin, logged in)

Landing screen after login. Navigation hub for all admin tasks.

Content:
- Header: "Panel Admin" + user email + logout icon
- Quick stats row: total active series · total pairs · last jornada date
- Action cards / menu list:
  - "Series" → manage series
  - "Parejas" → manage pairs
  - "Bares" → manage bars
  - "Jornadas" → manage jornadas
  - "Partidos" → manage/enter match results
- Each card shows icon + label + brief description

---

#### Screen 8 — Add match result (admin)

The most-used admin action: entering a match result after a game night.

Content:
- Back nav + "Agregar Partido" header
- "Jornada" selector (pre-selected if coming from a jornada context): "Jornada 3 — Serie Lunes"
- "Pareja 1" dropdown/selector: shows pairs enrolled in that series
- "Pareja 2" dropdown/selector: same list, excludes Pareja 1
- "Tantos Pareja 1" number input (0–40, large touch target)
- "Tantos Pareja 2" number input (0–40, large touch target)
- Auto-calculated winner preview: "Ganador: García / Rodríguez (40 tantos)"
- "Guardar Partido" primary button (gold, full width)
- Confirmation required before saving

---

### Technical notes for implementation

- **Framework:** React (Vite or Next.js)
- **Styling:** TailwindCSS preferred
- **No backend in the design:** Use realistic mock data in all screens
- **Responsive:** Design for 375px; note any breakpoints for tablet (768px) or desktop (1280px)
- **Accessibility:** Sufficient contrast in both modes; touch targets ≥ 44px

---

### Output requested

Please generate:
1. A `DESIGN.md` file following the Google Labs design.md spec (YAML frontmatter with color tokens, typography, spacing, rounded, components + markdown body sections)
2. Individual HTML files for each screen (both light and dark variants, or a toggle within the file)

---
