@AGENTS.md

# JOBKREATORS — Project guide

Live client website for **JOBKREATORS**, a premium AI-powered recruitment &
consultancy firm in Agra, India. We are overhauling **UI/UX only**.

> ⚠️ `@AGENTS.md` above is binding: this is a modified Next.js. Read the relevant
> guide in `node_modules/next/dist/docs/` before writing framework code, and heed
> deprecation notices.

## Stack (exact versions)

| Thing            | Version        | Notes |
| ---------------- | -------------- | ----- |
| Next.js          | `16.2.6`       | **App Router** (`app/`). No `pages/`, no `src/`. |
| React / ReactDOM | `19.2.4`       | |
| TypeScript       | `^5`           | `strict: true`, path alias `@/* -> ./*` |
| Tailwind CSS     | `^4`           | v4, configured in CSS via `@theme` in `app/globals.css` + `@tailwindcss/postcss`. No `tailwind.config.js`. |
| framer-motion    | `^12.38.0`     | Primary animation lib (used heavily). |
| three / R3F      | `^0.184` / `@react-three/fiber 9`, `drei 10` | `transpilePackages: ["three"]` in `next.config.ts`. Currently unused on the homepage (see `Logo3D` note). |
| lucide-react     | `^1.16.0`      | Icons. |
| gsap / @gsap/react | `^3.15` / `^2.1.2` | Available; not yet used. |
| sharp            | dev dependency | Build-time only, for `scripts/generate-brand-assets.mjs`. |

Fonts: `Inter` via `next/font/google` in `app/layout.tsx`, exposed as
`--font-inter` and consumed by the Tailwind `--font-sans` token.

> **Dual-theme brand — LIGHT is the default, DARK is the alternative (decided
> Phase 7, reversing the earlier dark-only call).** The client's collateral
> (LinkedIn, decks, cards) lives on light surfaces, so light is canonical and
> dark is the deliberate alternative. `next-themes` is back, configured with
> `attribute="data-theme"`, `defaultTheme="light"`, `enableSystem={false}`
> (a brand Sun/Moon toggle in the navbar, NOT an OS-follower),
> `disableTransitionOnChange`. Token architecture (Tailwind v4):
>
> - **`@theme`** in `app/globals.css` declares every `--color-*`/`--shadow-*`
>   token with its **LIGHT** value (so the utilities generate and the default
>   cascade is light) plus the theme-invariant scale/radius/motion/fonts.
> - **`:root[data-theme="dark"]`** overrides only the swapping color + elevation
>   tokens with their dark values (the previous dark-only palette — unchanged).
> - A **`@custom-variant dark (&:where([data-theme="dark"], …))`** makes Tailwind
>   `dark:` utilities respond to **our toggle**, not `prefers-color-scheme`. Use
>   `dark:` sparingly — only where a treatment genuinely diverges (navbar blur
>   depth, matching-engine stat chips, `.glass`, the logo tile).
>
> **Accent is theme-split:** light `--color-accent` is a **deeper** cyan
> `#1C7C99` (the bright `#7CD4EC` washes out on white; `#1C7C99` also clears WCAG
> AA both as small text on `--color-bg` (4.56:1) and as white-on-accent fill
> (4.77:1)); dark `--color-accent` stays bright `#7CD4EC`. A shared
> **`--color-accent-bright` `#7CD4EC`** pop tier is used in BOTH themes for small
> live signals (eyebrow dot, match-pulse). **Elevation** is dual: soft
> navy-tinted shadows on light, rgba-black + inner-highlight on dark. Never add a
> `.dark` class or hardcode a hex once tokens exist; reference tokens so both
> themes follow automatically.

## Commands (locked)

```bash
npm run dev      # next dev
npm run build    # next build
npm run lint     # eslint
npm run start    # next start
node scripts/generate-brand-assets.mjs   # regenerate brand PNGs from the JPEG
```

## Git / branch (locked)

- Work on **`redesign/polish-v1`**. **Never push to `main` directly.**
- No `console.log` in committed code.

## House rules

- **TypeScript strict.** No `any` unless unavoidable and commented.
- **Mobile-first.** Author base styles for mobile, layer `md:`/`lg:` up.
- **All images via `next/image`.** No raw `<img>`. (Today every `<Image>` of the
  logo is wrapped in a white card — see brand rules; fix in Phase 2.)
- **No hardcoded hex once tokens exist.** Phase 2 introduces `--brand-*` tokens;
  after that, reference tokens, not literals like `#0066FF` / `#152A37`.
- **No `console.log` in commits.** (Currently present in `app/submit-cv/page.tsx`
  and `app/submit-role/page.tsx` — remove during Phase 2.)
- **Do not touch auth, proxy, business logic, or `/api` routes.** None exist in
  this repo today (no `src/proxy.ts`, no Clerk, no `app/api/`) — if they appear,
  they are off-limits for the UI/UX overhaul.
- **Every animation respects `prefers-reduced-motion`.** Gate framer-motion with
  `useReducedMotion()` and CSS animations with an
  `@media (prefers-reduced-motion: reduce)` block. (Not currently honored anywhere.)

## Brand rules

The logo asset family in `public/brand/` is **canonical**. See `DESIGN.md` for the
full table, measured colors, and how the assets are produced.

- **Always render the logo via `<Logo>` (`components/Logo.tsx`)** — never an ad-hoc
  `<Image>`. The component owns the asset + the theme-aware tile.
- **Never use `jk-logo-original.jpg` in a component.** It is the source only.
- **Never use the legacy `public/logo.png`** (a white-background lockup).
- **`<Logo>` always renders the ORIGINAL-color trimmed PNGs** (`jk-lockup.png` /
  `jk-mark.png` / `jk-wordmark.png`) — the brand is never recolored. The `-light`
  recolored rasters in `public/brand/` remain unused.
- **The cream tile is now AUTOMATIC and theme-driven (no `surface` prop).** In
  **light** the logo sits **bare** on the warm-white page; in **dark** `dark:`
  utilities seat it on the refined cream brand stamp. This is pure CSS keyed on
  `<html data-theme>`, so it is SSR-correct and never flickers. Never put the logo
  on a white card on a dark page — the auto-tile handles dark.
- Measured brand anchors: `--brand-navy #152A37`, `--brand-cyan #5B9FBC`,
  `--brand-cream #F4F5F0`, bright `--accent-bright #7CD4EC`.
- If the client ever updates the source logo, drop the new JPEG at
  `public/brand/jk-logo-original.jpg` and re-run
  `node scripts/generate-brand-assets.mjs` to regenerate the whole family.
