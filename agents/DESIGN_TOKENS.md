# DESIGN_TOKENS — CS Week design system

Single source of truth for **everything visual** in the CS Week website:
palette, typography, spacing, radii, elevation, motion, component anatomy,
and responsive behavior.

- **If styling is involved, it is defined here first.**
- Companion docs: `UI.md` (handoff brief for building the UI), `AGENTS.md`
  (index). Design work in the app should reference this file and `UI.md`,
  never invent new values.
- These tokens are duplicated as CSS custom properties in both apps' global
  shells — keep them in sync if you change a value here:
  - Web: `apps/web/src/routes/+layout.svelte` (`:root`, web also has
    `--radius-sm`)
  - Admin: `apps/admin/src/routes/+layout.svelte` (`:root`, adds `--warn`,
    `--danger`)

## Philosophy

**Sakura, but not flowery.** The Japanese influence lives in the dusky-rose
palette and the Mincho display face — not in floral decoration. Warm paper
backgrounds, hairline rose-tinted borders, restrained use of display type.
Clean, editorial, friendly. No gradients except the brand mark and CTA band.

## 1. Color

### Rose ramp (brand + interactive)

| Token | Hex | Use |
|---|---|---|
| `--rose-900` | `#7a1f3d` | Deep ink-rose; CTA band gradient end, brand-mark end, `status-msg.info` text, admin brand ring |
| `--rose-800` | `#8f2d4c` | `btn-primary:hover`, link hover, brand-mark 72% stop |
| `--rose-700` | `#a63a5c` | **Primary action / brand color**: solid buttons, links, eyebrows, active nav accents |
| `--rose-600` | `#c25072` | Accent; form-control focus border, brand-mark highlight, step-number hover, CTA gradient start |
| `--rose-100` | `#f6e3e9` | Pale wash: icon tiles, active sidebar item, subtle fills, `status-msg.info` border, link-chip hover borders |
| `--rose-050` | `#fbf1f4` | Lightest wash: page-section bands (web props/how-to, admin footer), ghost button hover, table header, avatar bg |

### Ink + surface

| Token | Hex | Use |
|---|---|---|
| `--plum` | `#2b2430` | Ink text (headings + body), `btn-ghost` text, badge closed |
| `--plum-soft` | `#6f6676` | Muted/secondary text, meta, dates, hints |
| `--paper` | `#faf7f4` | Warm-paper page background |
| `--card` | `#ffffff` | Card / panel / table surface |
| `--line` | `#ece3e6` | Rose-tinted hairline borders, dividers |

### Status (semantic)

| Token | Hex | Applies to |
|---|---|---|
| `--ok` | `#3e7a5c` | Registration `confirmed`; event `open` |
| `--warn`* | `#b7791f` | Registration `pending`; event `draft` |
| `--danger`* | `#b13a3a` | Registration `cancelled`; `.status-msg.alert` |
| `--plum-soft` | `#6f6676` | Event `closed` (neutral) |

\* defined in the admin shell; web currently only defines `--ok`.

Badge tint backgrounds (hardcoded, appear in admin shell CSS):
`#e5f2eb` (ok), `#f4efe4` (warn), `#ece6ea` (closed/grey), `#fae7e7`
(danger), `#f1cfcf` (alert border).

## 2. Typography

- **Display:** Shippori Mincho — `--font-display: 'Shippori Mincho','Georgia',serif`.
  Used with restraint: page titles, headings (`h1`–`h3`), stat values,
  brand wordmark. Weights loaded: 500, 600, 700.
- **Body/UI:** IBM Plex Sans — `--font-body: 'IBM Plex Sans',system-ui,
  -apple-system,sans-serif`. Weights: 400, 500, 600 (web also loads 700).
- Loaded via Google Fonts `<link>` in each app's root layout.

### Scale (headings use `clamp()` on web)

| Element | Web | Admin |
|---|---|---|
| Base body | 16px / 1.6 | 15px / 1.55 |
| `h1` | hero `clamp(2.3rem,6vw,3.9rem)` | `clamp(1.5rem,3vw,2rem)` |
| `h2` | section-head `clamp(1.7rem,3.6vw,2.4rem)` | ~1.15–1.4rem |
| `h3` | 1.1–1.2rem | 1.15rem |
| `h1,h2,h3` | weight 600, display face, `--plum` | same |
| `.eyebrow` | 0.74rem / 700 / +0.18em caps | 0.72rem / 600 / +0.16em caps, `--rose-700` |
| small/meta | 0.78–0.9rem, `--plum-soft` | 0.72–0.92rem |

Body uses `-webkit-font-smoothing: antialiased`. Number metrics optional.

## 3. Space, radius, elevation

### Radii
- Controls / inputs / small items: `8px` (`--radius-sm` web, hardcoded 8px admin).
- Cards: `12px` web (`--radius`), `10px` admin (`--radius`). Keep per-app.
- Pills / badges / chips: `999px`. Focus-visible base: `4px`. CTA hero card: `20px`.

### Elevation
- `--shadow`: `0 1px 2px rgba(43,36,48,.05), 0 8px 24px rgba(43,36,48,.06)`
- Card hover: `translateY(-2px)` / `(-3px)` + deeper shadow
  (`0 2px 4px rgba(43,36,48,.05), 0 12px 28px rgba(43,36,48,.08)` admin;
  `0 14px 34px rgba(43,36,48,.09)` web prop cards).
- `--focus`: `0 0 0 3px rgba(194,80,114,.3)` — every focusable element.

### Spacing rhythm
- Section vertical padding (web): `clamp(4rem,9vw,6rem)`; card padding
  `1.5–1.75rem`; gap grids `1–1.25rem`.
- Admin: content padding `2rem` (`1rem` mobile), card padding `1.1–1.25rem`.
- Max content width: `1080px` both apps (web via `.shell`).

## 4. Motion

- Transitions: `background / border-color / box-shadow / transform`,
  `0.12–0.15s ease`; `:active` buttons `translateY(1px)` with `0.05s`.
- Card hover lift: `translateY(-2px)` (admin, web event/prop cards), `-3px` web props.
- Links with arrows animate `translateX(3px)` on hover.
- `@media (prefers-reduced-motion: reduce)` — zero out animation/transition
  durations (both apps already do this).

## 5. Layout & responsiveness

- Max content: `1080px`; sticky web header `64px` high, `rgba(250,247,244,.88)`
  + `backdrop-filter: blur(10px)`.
- Admin shell: sticky sidebar `248px` + `.content` column; topbar (avatar +
  "Signed in as") with `--card` bg + `--line` bottom border.
- Breakpoints:
  - **720px** — admin sidebar collapses to a top bar (nav row, active
    indicator becomes bottom underline); web header switches to hamburger
    `.nav-toggle` + `.mobile-menu`.
  - **900px** — web hero 2-col grid → 1 col (art below copy).
  - **520px** — curtains: heading rows stack, `.btn-lg` full width.

## 6. Shared utility classes (reuse, don't reinvent)

Defined once per app's root layout as `:global()`:
`.shell`, `.page`, `.eyebrow`, `.lede`, `.head`, `.section-head(-row)`,
`.btn` (+ `.btn-primary` `.btn-ghost` `.btn-sm` `.btn-lg` `.btn-full`
`.btn-white`), `.field` (label + input/textarea/select), `.badge`
(+ `-open -confirmed -draft -pending -closed -cancelled`), `.status-msg`
(+ `.alert` `.info`), `.brand-mark`, `.sr-only`, `.arrow-link`, `.empty-card`.

## 7. Component anatomy (existing)

| Component | Key details | Lives in |
|---|---|---|
| Header (web) | sticky, brand mark + "CS Week", nav links right (no auth buttons) | `apps/web/src/routes/+layout.svelte` |
| Mobile menu (web) | `#mobile-menu`, stacked links, `--line` separators | same |
| Footer (web) | `.site-footer`, `--rose-050` bg, brand blurb + footer links | same |
| Hero (web) | 2-col: copy (`h1 em` rose italic) + SVG art; CTA buttons; `hero-meta` pills; `.btn-white` on CTA band | `apps/web/src/routes/+page.svelte` |
| Prop cards | `.prop-card` with `.prop-icon` rose tile | same |
| Event card | `.event-card` + `.event-badge` (ok pill w/ dot), time, title, desc, cap, arrow-link | same (`+page.svelte`, reused pattern for listings) |
| Step list | `.step` `.step-num` (display-face, rose-100, hover → rose-600) | same |
| CTA band | `.cta-card` `linear-gradient(135deg, rose-900, rose-800)`, white text | same |
| Sidebar | `248px`, sticky, brand mark + kicker, `.nav-item.active` with 3px rose-stem indicator | `apps/admin/src/lib/components/AppSidebar.svelte` |
| Topbar | justifies right; `.avatar` 30px rose-100 circle, initial | `apps/admin/src/routes/admin/+layout.svelte` |
| Stat cards | `.stat` ≥190px grid, big display number + underbar accent (rose/plum/ok), link | `apps/admin/src/routes/admin/+page.svelte` |
| Task tiles | `.action` card, display title in rose | same |
| Tables | `.table-wrap` card, sticky-ish header row `--rose-050`, uppercase `th` | `apps/admin/.../registrations/+page.svelte` |
| Filter bar | `.filters` search `.search` + `.status` select + buttons | same |
| Response drilldown | `<details>` rows; `file` answers → `View uploaded image` link | same |
| Login card | centered card on `--paper` | `apps/admin/src/routes/login/+page.svelte` |
| Event form (create/edit) | `.field` groups; status select; capacity input + guards | `apps/admin/.../events/new/+page.svelte`, `[id]/edit/+page.svelte` |

Icons: inline SVG, `viewBox 0 0 24 24`, `stroke="currentColor"`,
`stroke-width 1.8–2`, `stroke-linecap/join round`, `aria-hidden="true"`.

## 8. Brand mark

Rose gradient circle, used in both apps:

- Web (`28px`): `radial-gradient(circle at 32% 30%, var(--rose-600),
  var(--rose-800) 72%)` + inset white ring.
- Admin (`34px`): `linear-gradient(135deg, var(--rose-600), var(--rose-900))`
  + `::after` ring at `inset 7px`, `rgba(255,255,255,.6)`.
- Wordmark: Shippori Mincho 700. Web name "CS Week"; admin brand kicker
  uppercase "COMPUTER SCIENCE WEEK" + title "Admin Console".

## 9. States to always handle

Loading, empty, error — for every data-driven view (see `TESTING.md` and
`UI.md` § States). Every interactive element needs a visible
`:focus-visible` ring, hover state, and pressed (`:active`) feedback.