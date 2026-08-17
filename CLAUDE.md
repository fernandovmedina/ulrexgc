# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# ORCHESTRATION
## Multi-Agent Workflow

You are the lead/orchestrator.

You have two Codex workers available.

### Codex 1
Role: implementation

Send tasks using:

./scripts/1send.codex.sh "TASK"

Read its output using:

./scripts/1read.codex.sh

### Codex 2
Role: testing and code review

Send tasks using:

./scripts/2send.codex.sh "TASK"

Read its output using:

./scripts/2read.codex.sh

### Workflow

For every feature:

1. Analyze the request.
2. Create an implementation plan.
3. Send implementation work to Codex 1.
4. Monitor Codex 1.
5. When implementation is complete, send review/testing to Codex 2.
6. Monitor Codex 2.
7. If Codex 2 finds problems, send fixes to Codex 1.
8. Repeat until tests pass.
9. Perform your own final review.
10. Report completion to the user.

Do not implement the feature yourself unless necessary.
Act primarily as the lead engineer.

## Commands

```bash
pnpm dev     # dev server on :3000 (Turbopack)
pnpm build   # static export into out/
pnpm lint    # eslint (next core-web-vitals + typescript)
npx serve out  # preview the export as it will be served
```

There is no test runner and no test files in this repo — `pnpm build` (which
runs a full TypeScript check) and `pnpm lint` are the only verification gates.

Deploy to Hostinger:

```bash
pnpm build
rm -f ulrexgc-hostinger.zip
cd out && zip -rq ../ulrexgc-hostinger.zip . && cd ..
```

The zip must have the site at its **root**, not nested under `out/` — it is
extracted directly into `public_html`. The archive is committed to the repo.

## Architecture

Single-page static marketing site for Ulrex General Contracting. No backend, no
API routes, no data fetching.

**Static export is a hard constraint.** `next.config.ts` sets `output: "export"`,
`images.unoptimized`, and `trailingSlash`. Anything requiring a Node server —
route handlers, middleware, server actions, ISR, `next/image` optimization — will
break the build or silently not work on Hostinger. `app/page.tsx` is a thin
wrapper; `components/home-page.tsx` is `"use client"` and holds everything.

**The whole page lives in `components/home-page.tsx`.** `Header`, `Hero`,
`Services`, `About`, `Projects`, `Reviews`, `Contact`, `Footer`, plus the shared
`Reveal` and `Eyebrow` helpers, are all defined in that one file and composed by
the default-exported `HomePage`. Don't split sections into separate files unless
asked. The JSX there is deliberately dense — deeply nested elements on a single
long line. Match that style when editing; don't reformat surrounding code.

### Bilingual content (EN/ES)

All page copy lives in two objects at the top of `components/home-page.tsx`:

- `englishCopy` — source of truth; its shape defines `type PageCopy`
- `spanishCopy: typeof englishCopy` — a missing or misspelled key is a build error

`HomePage` owns `language` state, the header flag buttons set it, and an effect
syncs `document.documentElement.lang`. There is no i18n library, no context, and
no persistence — language resets on reload, and the prerendered HTML is always
English (Spanish is a client-side switch).

Child components under `components/ui/` that carry their own strings
(`marquee-01.tsx`, `luxury-home-scene.tsx`, `card-stack.tsx`) receive a
`language?: "en" | "es"` prop and select from their own local dictionaries —
including `aria-label`s. When adding copy anywhere, add both languages.

### 3D hero scene

`components/ui/luxury-home-scene.tsx` builds a house in three.js imperatively
inside a `useEffect` (no react-three-fiber). It reveals five stages on a
`STAGE_MS` timer, is drag-to-orbit, and the stage bar jumps to any layer.

Camera framing: the code pre-samples `fitPoints` on the built envelope at
multiple rotation angles, and `fitCamera` — driven by a `ResizeObserver` — solves
distance/height from those points, so the house stays framed at every container
size and orbit angle. Changing geometry means the fit points must cover it too.

### Styling

Tailwind CSS v4 via `@tailwindcss/postcss`; there is no `tailwind.config`. Brand
colors are written as **hardcoded hex in arbitrary values** (`#061426` navy,
`#d6aa55` / `#e2be6c` gold, `#f3efe7` paper) rather than theme tokens — stay
consistent with the literals already in use. `app/globals.css` holds the CSS
custom properties and the custom utilities `.text-outline-gold`,
`.blueprint-grid`, `.font-mono`, `.animate-marquee`, and `.loader`.

Use `cn()` from `@/lib/utils` for conditional classes. Imports use the `@/*` alias.

### Motion and accessibility

Every animated component gates on Framer Motion's `useReducedMotion`, and
`globals.css` additionally neutralizes animations under
`prefers-reduced-motion: reduce`. Keep both when adding animation.

### Assets

Images are `.webp` in `public/`, referenced by plain path (optimization is off).
`public/.htaccess` is copied into the export and provides the custom 404, gzip,
cache headers, and the HTTPS redirect — edit it there, never in `out/`.

`components/ui/splite.tsx` is dead code from the original Spline hero and is no
longer imported. `PROMPT.md` is the original client brief plus the 21st.dev
component sources the UI was derived from.
