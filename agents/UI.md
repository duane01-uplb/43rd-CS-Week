# UI

Note: UI/UX is implemented as part of feature tasks (see sprint plan), not a
separate design phase. This file tracks conventions so output stays consistent
across prompts/sessions.

## Design Tokens (Sakura theme — Administrator console)

Sakura, but not flowery: the Japanese influence lives in the dusky-rose
palette and the Mincho display face, not in floral decoration.

- Primary color: `--rose-700 #a63a5c` (solid buttons / brand), `--rose-600 #c25072` (accent)
- Secondary color: `--rose-100 #f6e3e9` pale wash, `--rose-900 #7a1f3d` deep ink-rose
- Ink (text): `--plum #2b2430`, muted `--plum-soft #6f6676`
- Background: `--paper #faf7f4` (warm paper), `--card #ffffff`, hairline `--line #ece3e6`
- Status: confirmed/open `--ok #3e7a5c`, pending/draft `--warn #b7791f`, cancelled `--danger #b13a3a`
- Font (display): Shippori Mincho (used with restraint — brand, page titles)
- Font (body/UI): IBM Plex Sans
- Logo location: sidebar brand mark (rose gradient circle)

## Layout Conventions
- Admin console: fixed sidebar (248px, sticky) + content column; collapses to top bar < 720px
- Max content width: 1080px
- Corner radius: 10px (cards), 8px (controls)
- Breakpoints: 720px (sidebar → top bar)
- Shared utilities: `.btn`/`.btn-primary`/`.btn-ghost`, `.field`, `.badge` (+ status suffix), `.status-msg`, `.eyebrow`/`.head`/`.lede`

## Component Inventory (update as built)
- Sidebar shell (`AppSidebar`) — active-item rose-stem indicator, brand mark
- Top bar (`admin/+layout.svelte`) — signed-in avatar + name
- Stat cards (overview)
- Table + status badges (admin)
- Event form (create/edit)
- Registration filter bar + response drilldown
- Login card
- Nav
- Footer
- Event card
- Event detail hero
- Registration form
- Admin table
- Status badges (pending/confirmed/cancelled)

## States to Always Handle
Loading, empty, error — for every data-driven view.
