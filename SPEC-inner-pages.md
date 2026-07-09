# SPEC — Inner-Page Theme Migration

> Verification-walk inventory from the Phase-7 dual-theme run (branch
> `redesign/polish-v1`). This is the **brief for the next run**, not a change log.
> Scope of that run: migrate the 8 inner pages onto the token system. Do **not**
> touch auth/proxy/business logic/`/api` (none exist). UI/UX only.

## Context

- **Build is clean** — all 17 routes compile, no errors. Every issue below is
  **visual/thematic regression**, not a compile or readability failure.
- **Navbar & Footer are done** — fully tokenized, brand-correct in both themes.
- **All 8 inner pages were never migrated.** They run the pre-redesign palette:
  `#0066FF` (electric blue accent), `#1D1D1F`/`#6E6E73` (neutral text greys),
  `bg-white`/`#F5F5F7` (light surfaces), `#0A0A0A`/`#1A1A1A` (dark surfaces).
  They *do* carry `dark:` variants, and because `@custom-variant dark` rebinds
  `dark:` to our toggle, dark mode "works" — but in the **wrong, off-token palette**.
- **Target tokens** (already declared in `app/globals.css`): accent
  `--color-accent` (`#1C7C99` light / `#7CD4EC` dark), text `--color-text` /
  `--color-text-muted` / `--color-text-subtle`, surfaces `--color-bg` /
  `--color-surface` / `--color-surface-2`, borders `--color-border`,
  focus `--color-ring`. Reference tokens — never hardcode hex.

## Method

Source-level render audit: each element's classes mapped to active-theme token
values (deterministic from the class→token mapping), giving exact `file:line`.
Not pixel screenshots. No files were modified during the walk.

---

## Ranked breakage

### 🔴 P0 — Systemic (every inner page, both themes)

**1. Off-brand accent `#0066FF` (electric blue) is the accent on 100% of inner pages.**
Redesign premise is brand cyan (`--color-accent`). Every eyebrow, link, button,
icon, hover, and CTA on the inner pages is the old electric blue. Occurrences:
about (21, 42, 59), services (22), jobs (78, 88, 102, 107–115, 129, 136, 145),
contact (22, 38, 113, 117), submit-cv (36, 58, 162–168), submit-role (39, 56,
153, 159), privacy/terms eyebrows. Inner pages read as a *different brand* than
the homepage/navbar/footer.

**2. Background color-temperature seam against the fixed frame.**
Navbar (scrolled `bg-bg/80`) and Footer (`bg-surface`) are token-driven: light =
warm `#FAFAF7`/white, dark = pure-black `#000000` + navy-tinted `#0A0F14`. Inner
page bodies use pure `#FFFFFF`+cool `#F5F5F7` (light) and neutral
`#0A0A0A`+`#1A1A1A` (dark). In **dark** the frame is cooler/darker (navy-tinted)
than the content — visible temperature seam at the top edge (under navbar) and
bottom edge (above footer) of every inner page. Subtler in light.

### 🟠 P1 — High (specific pages/sections)

**3. `/about` mid-page palette rupture — both themes, worst in dark.**
`app/about/page.tsx` lines 18–87 are legacy (cool greys + electric blue); line 89
drops in `<FounderSection>`, which is fully tokenized (warm/navy-tinted surfaces +
brand cyan). Palette and color temperature snap mid-scroll. Worst in dark: neutral
`#1A1A1A` cards above vs navy-tinted token surfaces below.

**4. `/about` hero — two clashing blues stacked.**
Eyebrow "Our Story" is `#0066FF` (about:21) directly above an h1 whose second line
uses `.gradient-text` = brand-cyan gradient (about:24). Two different blues ~one
line apart. Both themes.

**5. `/contact` "Hiring someone?" CTA — solid electric-blue slab, no dark variant** (contact:113).
`bg-[#0066FF]` panel that does not dim/shift in dark theme, so on the near-black
page it's a harsh bright-blue block. Sits beside a correctly-dimmed neutral card
(contact:121), making the mismatch obvious. Both themes.

**6. Arbitrary multi-hue accent palette outside the brand system.**
`/about` mission bars: `#0066FF / #6366F1 (indigo) / #06B6D4 (teal)` (about:42–52).
`/contact` channel icons: `#0066FF / #25D366 (green) / #6366F1 / #F59E0B (amber) /
#0A66C2 / #E1306C (pink)` (contact:38–78). Five+ non-brand hues. Both themes.

### 🟡 P2 — Medium (a11y / polish)

**7. Off-brand focus rings on every form field** — `focus:ring-[#0066FF]/50` on all
inputs/selects/textareas in submit-cv (76, 88, 102, 113, 126, 143, 156) and
submit-role (91, 96, 104, 109, 117, 122, 135, 144, 150). Focus shows electric blue
instead of brand-cyan `--color-ring`. Both themes, ~13 fields.

**8. Low-contrast muted footnote in forms** (submit-cv:173, submit-role:157) —
`text-[#6E6E73] dark:text-[#6E6E73]` (identical in both). On dark `#0A0A0A` this is
a dim grey, borderline WCAG. Dark theme only.

**9. Hardcoded icon colors** — `Briefcase color="#0066FF"` (jobs:108),
`Upload color="#0066FF"` (submit-cv:162), success checks `color="#22C55E"`
(submit-cv:48, submit-role:65). Off-token, both themes.

**10. Pure-white page bodies instead of warm `--color-bg`** — `bg-white` /
`min-h-screen bg-white` on services (19), jobs (74), contact (19), submit-cv (32),
submit-role (35), privacy (14), terms (14). In light, inner pages are clinical pure
white vs the homepage's warm `#FAFAF7`. Light theme only.

---

## Per-page index

| Page | Notable sections (file:line) | Themes |
| ---- | ---- | ---- |
| `/services` | hero (19), service cards (38), industries pills (67–76) | both |
| `/jobs` | job cards (98), tag chips (122), dashed CTA box (136) | both |
| `/contact` | #5 blue slab (113), #6 multi-hue icons (38–78) | both |
| `/about` | #3 FounderSection seam (89), #4 blue clash (21/24), #6 mission bars (42–52) | both |
| `/submit-cv` | #7 focus rings, #8 footnote (173), success card (46) | both |
| `/submit-role` | #7 focus rings, #8 footnote (157), success card (63) | both |
| `/privacy` | eyebrow/heading/body only (14–56) | both |
| `/terms` | eyebrow/heading/body only (14–60) | both |

`/privacy` and `/terms` are the lowest-effort migrations; `/about` and `/contact`
are the highest-value (most visible breakage).

## Definition of done (next run)

- No `#0066FF`, `#1D1D1F`, `#6E6E73`, `#F5F5F7`, `#0A0A0A`, `#1A1A1A`,
  `#A1A1A6`, or other raw hex in the 8 inner pages — all reference tokens.
- Accent, text, surface, border, and focus-ring all resolve through the token
  system so both themes follow automatically.
- No palette/temperature seam between inner-page bodies and the navbar/footer.
- `/about` reads as one continuous palette through the `<FounderSection>` handoff.
- `npm run build` and `npm run lint` clean.
