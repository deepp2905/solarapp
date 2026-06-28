# Design Decisions Log

A running record of design and front-end decisions for the Virtual
Inspection app — the problem, what was decided, and why. Written as
raw material for a later case study.

Each phase corresponds to a branch merged into `main`. The git history
(merge commits per phase) is the technical trail; this file is the
narrative and rationale.

---

## Phase 0 — Baseline

**State:** Initial prototype. Plain HTML/CSS exploration, then migrated
to a React + Vite + TypeScript project with a Projects → Checklist →
Item Detail flow and a GPS-evidence override flow.

**Why React + Vite + TS:** component reuse across the three screens,
type safety on the checklist/evidence data model, and fast local dev.

---

## Phase 1 — Color & Typography (`color-and-typography`)

### 1a. Two-tier color token system

**Problem:** Colors were hardcoded hex values scattered across the
stylesheet (~53 literals, plus duplicate/aliased variables). Reskinning
or adding dark mode would mean a find-and-replace across the whole file.

**Decision:** Adopt a two-tier token architecture.
- **Tier 1 — raw palette:** the only place hex literals live
  (`--amber-*`, `--gray-*`, `--green-*`, `--gold-*`, `--red-*`,
  `--blue-*`).
- **Tier 2 — semantic roles:** what the UI references
  (`--color-bg`, `--color-text`, `--color-brand`, `--color-error`, …).
- Rewired all hardcoded hexes to role tokens; kept short back-compat
  aliases so existing rules resolved without a mass rename.

**Palette:** "Solar Amber" primary (brand `#F79120`) + a warm-gray
neutral ramp with a subtle amber undertone, so neutrals harmonize with
the brand. Dedicated success / warning / error / info ramps.

**Why:** Swapping the palette later is a Tier-1 edit; re-pointing a role
is one Tier-2 line; dark mode becomes a ~15-line override block instead
of a rewrite. Same pattern the type system later reused.

### 1b. Button hierarchy & contrast

**Problem:** Two side-by-side actions ("Take Photo" / "Choose from
Library") both rendered as solid fills — no clear primary, and the
brand amber failed WCAG AA for white text.

**Decision:**
- Primary = solid amber fill; secondary = outline button; tertiary =
  text link. One primary per context.
- Primary fill uses **Amber 600 + white text** for AA (~4.5:1). Amber
  500 on white is only ~2.1:1, so it is reserved for fills/accents, not
  text. Amber 700 is reserved for amber *text* on white.

**Why:** A single focal action; color is not the only differentiator
(fill vs. outline); accessible contrast on every label.

### 1c. Focus rings

**Decision:** Focus rings use a light amber (`--color-focus` = Amber
300) via a single role token; removed the amber border recolor on
focused inputs (kept the ring only).

**Why:** On-brand focus state, controlled from one token; the input's
own border stays neutral so the ring reads as the focus cue.

### 1d. Instrument Sans type scale

**Problem:** Font sizes were one-off px values (10 distinct sizes incl.
near-duplicate 13 / 13.5 / 15px) with line-heights barely set —
inconsistent vertical rhythm.

**Decision:** A two-tier type system mirroring the color tokens.
- **Tier 1:** raw scale — size + line-height (px) + tracking per step
  (display, h1, h2, h3, title, body-lg, body, body-sm, label, caption,
  overline) and a four-weight roster (400/500/600/700).
- **Tier 2:** semantic role rules (`.text-*`) that bundle
  size + line-height + weight + tracking; component selectors grouped
  into the matching role.
- Anchored at 16px body, ~1.2 ratio. Hierarchy leans on weight + color
  more than size. Responsive rule (<768px): only large sizes shrink;
  reading sizes never drop below 16.

**Why:** One scale eliminates the size drift, fixes line-heights
globally, and makes type changes a token edit.

### 1e. Load Instrument Sans

**Problem:** The scale specified Instrument Sans but nothing loaded the
webfont, so browsers fell back down the stack (Segoe UI on Windows,
mistaken for Roboto).

**Decision:** Load Instrument Sans from Google Fonts (weights
400/500/600/700, `display=swap`) with preconnect hints.

**Why:** The first family in the stack now resolves for all users.
Note: depends on network at runtime; self-hosting is an option if
offline/privacy requirements arise.

---

## Phase 2 — UX & Layout (`layout-and-structure`)

_In progress._

<!--
Template for each decision:

### <short title>
**Problem:** …
**Decision:** …
**Why:** …
**Before / After:** (screenshot links or description)
-->

---

## Workflow notes

- One theme per branch; each phase is merged to `main` with a `--no-ff`
  merge commit so phase boundaries are visible in history.
- New phases branch from updated `main` (not stacked on the previous
  branch) to avoid rebase chains.
