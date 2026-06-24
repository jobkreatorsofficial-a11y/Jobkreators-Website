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
| next-themes      | `^0.4.6`       | `class` strategy, `defaultTheme="dark"`, system disabled. |
| three / R3F      | `^0.184` / `@react-three/fiber 9`, `drei 10` | `transpilePackages: ["three"]` in `next.config.ts`. |
| lucide-react     | `^1.16.0`      | Icons. |
| gsap / @gsap/react | `^3.15` / `^2.1.2` | Available; not yet used. |
| sharp            | dev dependency | Build-time only, for `scripts/generate-brand-assets.mjs`. |

Fonts: `Inter` via `next/font/google` in `app/layout.tsx`, exposed as
`--font-inter` and consumed by the Tailwind `--font-sans` token.

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

- **Never use `jk-logo-original.jpg` in a component.** It is the source only.
- **Never use the legacy `public/logo.png`** (a white-background lockup). It is
  what currently forces the "logo on a white card" anti-pattern.
- **Always use the trimmed transparent PNGs:**
  - On light surfaces → `jk-lockup.png` / `jk-mark.png` / `jk-wordmark.png`
  - On dark surfaces → `jk-lockup-light.png` / `jk-mark-light.png` / `jk-wordmark-light.png`
- **Never put the logo on a white card on a dark page.** Use the `-light` variant
  directly on the dark surface instead.
- Measured brand anchors: `--brand-navy #152A37`, `--brand-cyan #5B9FBC`,
  dark-surface `--brand-cream #F4F5F0`, `--brand-cyan-2 #7CD4EC`.
- If the client ever updates the source logo, drop the new JPEG at
  `public/brand/jk-logo-original.jpg` and re-run
  `node scripts/generate-brand-assets.mjs` to regenerate the whole family.
