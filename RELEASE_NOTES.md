# JOBKREATORS — Homepage Overhaul (Phases 2→6)

Branch: `redesign/polish-v1` · Working tree only (not committed/pushed).
Scope: **homepage + layout + shared infra + SEO/social/a11y/perf.** Inner pages
(`/services`, `/about`, `/jobs`, `/contact`, `/submit-cv`, `/submit-role`,
`/privacy`, `/terms`) were intentionally **not** redesigned — they get a separate
pass (see "Known / deferred" below).

## Headline outcome

A deliberate, **dark-only**, brand-consistent, accessible, SEO-complete homepage
built entirely from design tokens + primitives, with the **AI Matching Engine** as
the signature visual. Build + lint clean; stats now render real values in SSR.

- `npm run build` → ✅ 0 errors, 0 warnings (17 routes, all statically prerendered)
- `npm run lint` → ✅ 0 errors, 0 warnings
- Homepage first-load JS ≈ **238 kB gzipped** (framer-motion dominates)
- SSR HTML now contains real `3,400` / `242` / `94%` (was `0`), plus JSON-LD ✅

## Big decisions

1. **Dark-only brand, theme switching removed (per client).** `next-themes` +
   `ThemeProvider` deleted, navbar toggle gone, no `dark:` prefixes on the
   homepage; tokens apply unconditionally. Documented in `CLAUDE.md` + `DESIGN.md`.
   (Tailwind v4 here resolves `dark:` via `prefers-color-scheme`, not the `.dark`
   class, so removing next-themes does **not** change inner-page behavior.)
2. **Logo identity preserved** — original navy mark + navy wordmark + cyan tagline,
   seated on a refined cream tile on dark surfaces (`<Logo surface="tile">`). No
   recoloring anywhere.

## Files changed

### Infra / config
- `package.json`, `package-lock.json` — removed `next-themes`.
- `app/layout.tsx` — removed ThemeProvider; added skip-to-content link; upgraded
  root metadata (metadataBase, OG `en_IN`, Twitter `summary_large_image`).
- `app/page.tsx` — `<main id="main">`, swapped `ClientLogos`→`LogoWall`, added
  Organization + LocalBusiness JSON-LD.
- `app/globals.css` — bumped `--color-text-subtle` `#6b7888`→`#8794a4` (now AA
  ≥4.5:1 on every surface).
- `lib/data.ts` — `SERVICES` icons keyed by id on the homepage (legacy `icon`/
  `color` kept only for the out-of-scope `/services` page, flagged); added
  `role` + client TODO to `TESTIMONIALS`.
- `CLAUDE.md`, `DESIGN.md` — documented the dark-only decision + Logo3D status.

### Layout
- `components/layout/Navbar.tsx` — rebuilt on tokens; no toggle; left-origin
  underline hover; right-side full-height mobile drawer; scroll-triggered blur.
- `components/layout/Footer.tsx` — rebuilt on tokens; 3-col; accent social hover;
  middle-dot fine print.

### Homepage sections (all on tokens + primitives + `useMotionSafe`)
- `components/home/Hero.tsx` — 60/40 layout, locked copy, `<Eyebrow dot>`, CTAs,
  trust strip, `MatchingEngine` on the right (dropped `Logo3D`).
- `components/home/MatchingEngine.tsx` — **NEW** signature visual (deterministic
  SVG constellation, forming match lines, scanline, stat chips; rAF +
  IntersectionObserver pause; static snapshot for reduced motion).
- `components/home/StatsBar.tsx` — **SSR fix**: real value in markup, count-up on
  mount (motion-safe), `en-IN` formatting.
- `components/home/ServicesGrid.tsx` — token cards, single accent icons, hover
  border/glow.
- `components/home/AIDashboard.tsx` — compact accent constellation (was rainbow).
- `components/home/ProcessSteps.tsx` — connected horizontal flow (desktop) /
  vertical timeline (mobile), scroll-drawn line, staggered reveal.
- `components/home/LogoWall.tsx` — **NEW** (replaces `ClientLogos`): placeholder
  cards + config, marquee desktop / grid mobile, static industries tag cloud.
- `components/home/Testimonials.tsx` — 3 cards, accent quote marks, single column
  mobile (no carousel).
- `components/home/FounderSection.tsx` — framed photo + accent halo, **optimized**
  image (dropped `unoptimized`), credential pills.
- `components/home/CandidateCTA.tsx` — confident closer on `surface-2` (was a full
  blue billboard).
- `components/three/Logo3D.tsx` — unused (commented), kept for now.

### UI primitives / shared
- `components/ui/buttonClasses.ts` — **NEW** server-safe button class helper.
- `components/ui/Button.tsx` — consumes the shared helper (re-exports preserved).
- `components/ui/Reveal.tsx` — **NEW** canonical motion-safe reveal-on-scroll.
- `components/ui/ThemeProvider.tsx` — **DELETED**.
- `components/JsonLd.tsx` — **NEW** structured-data helper.

### SEO / social / icons
- `app/icon.png` (from `jk-mark-512.png`), `app/apple-icon.png` (from
  `jk-mark-180.png`) — **NEW**; `app/favicon.ico` (default Next icon) **deleted**.
- `app/manifest.ts`, `app/opengraph-image.tsx`, `app/robots.ts`, `app/sitemap.ts`
  — **NEW**.
- `app/submit-cv/layout.tsx`, `app/submit-role/layout.tsx` — **NEW** (metadata only
  for the two client form pages; no UI change).

## TODOs the client must complete

1. **Client logos** — drop SVGs in `/public/logos/` (`scaler.svg`, `upgrad.svg`,
   `great-learning.svg`, `univo.svg`, `interview-kickstart.svg`, `emeritus.svg`),
   then swap the placeholders in `LogoWall.tsx` for `<Image>` (config + TODO in file).
2. **Testimonials** — replace placeholder initials/titles (TL/CS/BD) with **real
   names + headshots** and sharper, outcome-specific quotes (templates in
   `lib/data.ts`).
3. **Founder photo** — `public/founder.jpg` is now optimized; supply a higher-res
   portrait if available.
4. **Jobs data + `/jobs` JSON-LD** — wire real jobs, then add `ItemList` /
   `JobPosting` structured data (deferred with the inner-page pass).
5. **Optional 6th service** — add to `SERVICES` to balance the grid's last row.
6. **Optional cleanup** — if `Logo3D` stays unused, remove it + `three`/R3F deps +
   `transpilePackages: ["three"]` in `next.config.ts`.
7. **Domain** — `metadataBase`/JSON-LD/sitemap assume `https://jobkreators.com`;
   update if the production domain differs.

## Known / deferred (out of scope this pass)

- **Inner pages** still use the old Apple-style build (`bg-white`, `dark:` pairs,
  off-brand hex). They follow OS `prefers-color-scheme` and will look light on a
  light-mode OS — to be migrated to the dark-only token system in the inner-page
  pass. `lib/data.ts` `SERVICES.color`/`icon` are kept only for `/services` until
  then.

## Rollback

- Revert everything: `git checkout redesign/polish-v1 -- .` (working tree only —
  nothing was committed), or reset to the last commit: `git reset --hard 42c68ed`.
- Revert a single file: `git checkout 42c68ed -- <path>` (e.g.
  `components/home/Hero.tsx`). Restore deleted files the same way
  (`git checkout 42c68ed -- components/ui/ThemeProvider.tsx app/favicon.ico
  components/home/ClientLogos.tsx`), then `npm install` to restore `next-themes`.
