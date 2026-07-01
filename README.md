# Solar Checklist — Virtual Inspection

A front-end prototype for **virtual inspection of solar installations**. An
installer works through a project's checklist on-site, capturing photo evidence
for each required item. Photos are GPS-checked against the site location, with
an override flow when GPS is unavailable or out of tolerance.

The app is a design / front-end exploration: the data layer is seeded in-memory
(no backend, no persistence). It's built around a clear, accessible design
system whose rationale is logged in [`DECISIONS.md`](DECISIONS.md).

## Features

- **Project list** with text search, jurisdiction (AHJ) filter, and live
  per-status counts.
- **Checklist** grouped into collapsible sections, with derived per-section and
  per-project completion counts and a "needs attention" flag for GPS failures.
- **Item detail** with drag-and-drop / browse upload on desktop, camera capture
  on mobile, evidence tiles with skeleton loaders, and prev/next pagination
  through the checklist.
- **GPS override flow**: any photo outside the site tolerance is flagged, and a
  saved written reason resolves the exception and flips the item back to
  captured.
- **Derived status everywhere**: item and project status are computed from
  evidence rather than stored, so the UI stays internally consistent as
  evidence changes.
- **Animated navigation**: direction-aware page transitions (forward vs. back)
  driven by a monotonic navigation rank.
- **Accessible custom `<select>`**, confirmation dialogs, focus rings, and
  keyboard support throughout.

## Flow

Three screens, navigated with animated transitions:

1. **Projects** (`/`) — list of inspection projects with status filters and
   counts (not started / in progress / complete).
2. **Checklist** (`/project/:projectId`) — sections of checklist items for a
   project, each showing capture status; optional items are excluded from
   completion totals.
3. **Item Detail** (`/project/:projectId/item/:itemId`) — evidence for a single
   item: photo thumbnails, GPS status, and the override form for failed GPS.
   Prev/next pagination moves between items without leaving the screen.

## Key concepts

- **Derived status.** Item and project status are **derived** from evidence
  (see `deriveItemStatus` and `deriveProjectStatus` in
  [`src/data.ts`](src/data.ts)) rather than stored. An item with no photos is
  _Pending_; a photo with an unexcused GPS failure makes it _GPS Failed_; a
  saved override note excuses the failure and returns it to _Captured_.
- **Optional items** are excluded from completion math — they don't count toward
  a section/project total, and a project can be Complete with them still empty.
- **In-memory store.** [`src/store.tsx`](src/store.tsx) holds the project tree in
  React context and exposes `setItemEvidence` to update an item immutably and
  re-derive its status. Reloading resets everything to the seed data in
  [`src/data.ts`](src/data.ts).

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) — dev server and build
- [React Router](https://reactrouter.com/) — routing
- [Motion](https://motion.dev/) — page and evidence transitions
- [oxlint](https://oxc.rs/docs/guide/usage/linter) — linting

## Getting started

Requires [Node.js](https://nodejs.org/) (18+ recommended) and npm.

```bash
npm install      # install dependencies
npm run dev      # start the dev server (Vite prints the local URL)
```

Then open the URL Vite prints (default http://localhost:5173).

## Scripts

| Command           | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Start the Vite dev server with HMR            |
| `npm run build`   | Type-check (`tsc -b`) and build to `dist/`    |
| `npm run preview` | Serve the production build locally            |
| `npm run lint`    | Run oxlint                                     |

## Project structure

```
src/
  main.tsx            App entry; mounts the router and ProjectsProvider
  App.tsx             App shell
  AnimatedRoutes.tsx  Route definitions + direction-aware page transitions
  data.ts             Types, seed data, and status-derivation helpers
  store.tsx           In-memory projects context (read + update evidence)
  styles.css          Two-tier design tokens (color + type) and component styles
  pages/              Projects, Checklist, ItemDetail
  components/         Cards, badges, forms, pager, icons, etc.
public/               favicon
index.html            HTML entry; loads the Instrument Sans webfont
```

## Design system

Colors and typography use a **two-tier token architecture** — a raw palette
(Tier 1) referenced only through semantic role tokens (Tier 2) — so reskinning
or adding dark mode is a small, localized edit. The full rationale, including
the "Solar Amber" palette, WCAG-AA button contrast rules, and the Instrument
Sans type scale, is logged in [`DECISIONS.md`](DECISIONS.md).

## Notes

- Data is seeded in memory; there is no persistence or backend. Reloading
  resets evidence to the seed state.
- Manually added photos are treated as GPS-verified — the on-site GPS check is
  not simulated for uploads; only the seeded evidence carries GPS failures.
- Instrument Sans is loaded from Google Fonts at runtime (see
  [`index.html`](index.html)), so the first paint of the intended typeface
  depends on network access.
