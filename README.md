# Ulrex General Contracting

Marketing site for Ulrex General Contracting — residential remodeling, commercial
construction, roofing and exterior restoration, specialty work, and residential
painting. Single-page site, statically exported and hosted on Hostinger at
[ulrexgc.com](https://ulrexgc.com).

## Stack

- **Next.js 16** (App Router, Turbopack) with **React 19** and **TypeScript**
- **Tailwind CSS v4** via `@tailwindcss/postcss`
- **three.js** for the hand-built 3D hero scene
- **Framer Motion** for scroll and entrance animations
- **pnpm** as the package manager

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
pnpm build   # static export into out/
pnpm lint    # eslint
```

## Project structure

```
app/
  layout.tsx    # metadata, favicon, OpenGraph
  page.tsx      # renders <HomePage />
  globals.css   # Tailwind entry + custom utilities
components/
  home-page.tsx # all copy dictionaries + every page section
  ui/           # card-stack, luxury-home-scene, marquee, spotlight, card
lib/utils.ts    # cn() class merger
public/         # webp imagery, logos, .htaccess
```

`components/home-page.tsx` holds the whole page: `Header`, `Hero`, `Services`,
`About`, `Projects`, `Reviews`, `Contact`, and `Footer` are all defined there and
composed by the default-exported `HomePage`.

## Bilingual content

The site ships English and Spanish side by side. All strings live in two objects
at the top of `components/home-page.tsx`:

- `englishCopy` — the source of truth; its shape defines the `PageCopy` type
- `spanishCopy` — typed as `typeof englishCopy`, so a missing key fails the build

`HomePage` keeps the active `Language` in state, the flag buttons in the header
switch it, and an effect mirrors it onto `document.documentElement.lang`.
Components with their own copy (`marquee-01.tsx`, `luxury-home-scene.tsx`,
`card-stack.tsx`) take a `language` prop and pick their own strings.

**To add or change copy:** edit the key in `englishCopy`, then add the matching
key to `spanishCopy`. TypeScript will flag anything you forget.

## 3D hero scene

`components/ui/luxury-home-scene.tsx` builds a luxury home in three.js and reveals
it across five stages (site & grading → foundation → structure → enclosure →
signature finish), auto-advancing every 2s. The scene is drag-to-orbit, and the
stage bar underneath lets you jump to any layer. Camera framing is refit to the
container on resize.

## Build & deploy to Hostinger

`next.config.ts` sets `output: "export"`, `images.unoptimized`, and
`trailingSlash`, so the build produces a fully static site in `out/`.

```bash
pnpm build
cd out && zip -rq ../ulrexgc-hostinger.zip . && cd ..
```

The archive keeps the site at its root (not nested in an `out/` folder) — upload
it in hPanel → File Manager → `public_html`, then extract it there.

To preview the export locally before uploading:

```bash
npx serve out
```

### Apache config

`public/.htaccess` is copied into the export and handles the custom 404, gzip
compression, long-lived caching for hashed assets (HTML stays uncached), and the
HTTP → HTTPS redirect.

## Notes

- `components/ui/splite.tsx` is a leftover Spline wrapper from the original hero;
  it is no longer imported anywhere.
- `PROMPT.md` holds the original project brief and the 21st.dev component sources
  the UI was built from.
