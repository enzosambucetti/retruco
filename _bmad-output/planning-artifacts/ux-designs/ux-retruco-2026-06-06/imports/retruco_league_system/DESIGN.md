---
name: Retruco League System
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0edec'
  surface-container-high: '#ebe7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#40484f'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#707880'
  outline-variant: '#bfc7d0'
  surface-tint: '#006493'
  primary: '#006493'
  on-primary: '#ffffff'
  primary-container: '#4d9fd6'
  on-primary-container: '#00334e'
  inverse-primary: '#8dcdff'
  secondary: '#3f6653'
  on-secondary: '#ffffff'
  secondary-container: '#beead1'
  on-secondary-container: '#436b58'
  tertiary: '#815500'
  on-tertiary: '#ffffff'
  tertiary-container: '#cd8a00'
  on-tertiary-container: '#442b00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cae6ff'
  primary-fixed-dim: '#8dcdff'
  on-primary-fixed: '#001e30'
  on-primary-fixed-variant: '#004b70'
  secondary-fixed: '#c1ecd4'
  secondary-fixed-dim: '#a5d0b9'
  on-secondary-fixed: '#002114'
  on-secondary-fixed-variant: '#274e3d'
  tertiary-fixed: '#ffddb2'
  tertiary-fixed-dim: '#ffb94c'
  on-tertiary-fixed: '#291800'
  on-tertiary-fixed-variant: '#624000'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
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
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
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
---

## Brand & Style
The design system embodies the prestige and competitive intensity of a professional sports league, specifically tailored for the traditional game of Truco. The aesthetic is a fusion of **Corporate Modern** and **High-Contrast Sports Editorial**. It aims to evoke a sense of "The Professional Arena," transforming a casual card game into a structured, high-stakes tournament environment.

The UI is authoritative and data-centric. It utilizes sharp geometry, intentional white space, and a clear hierarchy to ensure that players and admins feel they are engaging with an official sporting body. The emotional response is one of reliability, focus, and competitive pride.

## Colors
The palette is rooted in national identity and the physical environment of the game.
- **Primary (Celeste):** Used for primary branding, active states, and structural accents. It represents the "League" itself.
- **Secondary (Felt Green):** Drawing inspiration from card-table surfaces, this is used as a deep surface color in dark mode or for "Table" specific context in light mode.
- **Highlight (Gold):** Reserved strictly for primary calls to action (CTA), championship statuses, and high-priority wins.
- **Neutral:** A range from Deep Charcoal for high-readability text to Light Gray for subtle grouping containers.

**Dark Mode Strategy:** Surface layers shift to Deep Charcoal with Secondary Green used as a tonal container for card elements, maintaining the "card-room" atmosphere.

## Typography
Typography is the backbone of the league's authority. 
- **Barlow Condensed** is used for all "Sports Stats" contexts—headings, scores, and rankings. Its verticality allows for more data columns on mobile devices and provides an aggressive, athletic feel.
- **Inter** handles all functional and body text, ensuring high legibility for tournament rules and player lists.
- **Numbers:** In scoreboards and ranking tables, always use `ranking-number` with tabular figures (mono-spacing for digits) to ensure columns align perfectly.

## Layout & Spacing
This design system utilizes a **Fluid Grid** with a strict 4px baseline rhythm. 
- **Mobile First:** Content follows a single-column layout with a 16px side margin. Data tables are allowed to overflow horizontally or use "pinned" first columns for player names.
- **Desktop:** A 12-column grid with 24px gutters. Content is typically centered in a maximum 1280px container.
- **Touch Targets:** All interactive elements (scoring buttons, navigation) must maintain a minimum height of 44px to accommodate rapid entry during live card games.

## Elevation & Depth
Visual hierarchy is achieved through **Tonal Layers** and **Low-Contrast Outlines**. 
- In Light Mode, use subtle 1px borders (#E2E8F0) rather than heavy shadows to maintain a clean, professional look. 
- In Dark Mode, depth is created by shifting from the background (#121212) to a raised surface of Deep Green (#1B4332) for cards and modals.
- **Elevation Shadow:** Reserved only for active "Floating" elements like the mobile bottom navigation bar, using a soft, neutral-tinted shadow (0px 4px 12px rgba(0,0,0,0.1)).

## Shapes
Shapes are disciplined and "Soft." We avoid overly rounded or "bubbly" aesthetics to maintain the professional league feel.
- **Base Components:** 4px radius (e.g., Input fields, small buttons).
- **Cards/Containers:** 8px radius (e.g., Jornada cards, Series overviews).
- **Status Pills:** 12px radius for a distinct visual departure from structural blocks.

## Components
- **Data Tables:** High-density with 1px horizontal dividers. The 'Rank' column should use `ranking-number` with a Celeste or Gold background highlight for top-tier performers.
- **Action Buttons:** Primary buttons use Gold (#E8A020) with black text for maximum visibility. Secondary actions use the Celeste outline style.
- **Jornada Cards:** Grouped by date; use a Secondary Green header for "Active" match-days to differentiate from "Completed" or "Upcoming" series.
- **Score Input:** Large, dedicated +/- steppers with a minimum height of 56px for "No-look" data entry during a match.
- **Bottom Navigation:** Fixed on mobile for public users. Icons should be clear and accompanied by `label-sm` text. The active state is indicated by a Celeste highlight.
- **Status Chips:** Small, uppercase labels used for "En Curso," "Finalizado," and "Pendiente."