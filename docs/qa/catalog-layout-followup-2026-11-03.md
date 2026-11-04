# Catalog and sticky-layout follow-up — 2026-11-03

Owner request: repair the sticky offer-switcher join, carry desktop review cards to the viewport edge, replace the course/mini-course marketing hero with direct catalog controls, and change mobile public navigation to an upward wipe.

## Reference contract and boundaries

- `codex-clipboard-26b8cb13-4537-4c96-8317-2fa307aa13a6.png`: desktop defect evidence for HOME-01 + HOME-06–09 connection. Keep the existing white rounded header and offer pill; remove the white extension and continuous squared lower edge. The bounded repair continues the plum dock surface behind the header only while docked. Does not authorize other shell colors, routes or content.
- `codex-clipboard-bbf3ef5a-380c-4309-b4d1-917a1c0d9432.png`: desktop review rail clips at the container boundary before the screen edge. Extend its scroll viewport through the right gutter, including beyond the 1920px inner-width cap. Keep the heading column, card sizes, native scrolling/drag/keyboard/dots and trailing resting gutter. Mobile keeps its previously verified two-edge rail. Blank cards remain unreleased review placeholders.
- Written scope: `/courses` and `/mini-courses` become compact discovery pages: one H1, existing type switch and filters, then results. Remove the photo/marketing headline/CTA from rendered markup; preserve the original artwork file. No new visual reference is implied for unrelated detail, cart or account screens.
- Written motion scope: at <=760px public route/hash navigation wipes from bottom to top, including history. Desktop keeps its horizontal history direction. HOME-05 internal ordered step wipes and HOME-06–09 format transitions are unchanged.

All use existing Russian-first Manrope/Unbounded and semantic colors. Numerical spacing and the repaired connection are bounded proposals awaiting human review. TEST_PREVIEW gating, publication policies and release phases are unchanged.

## Changed owners

| Owner / actual path | API and consumers | Result |
| --- | --- | --- |
| `src/features/public-shell/public-header.module.css` | PublicHeader API unchanged; RootLayout and ComponentPreviewPage | Remove docked white pseudo-element and squared lower corners. Docked desktop header uses plum behind the rounded white bar. Mobile remains opaque light. |
| `src/features/home/learning-offers/learning-offers-showcase.tsx` | `LearningOffersShowcase({panels})`, HomePage | Dock state follows actual header contact and measured dock height at the group's end. Remove the old measured white-bridge custom property. Stationary group geometry and panel switching retained. |
| `src/features/home/sections/10-reviews/reviews-section.module.css` | ReviewsSection / ReviewsCarousel, no props, HomePage | Desktop container-query calculation extends rail to document viewport edge even above 1920px; initial and final content alignment retained. No duplicate carousel. |
| `src/features/catalog/sections/01-introduction/introduction-section.tsx` and `.module.css` | IntroductionSection, no props, persistent CatalogPage | Compact “Каталог обучения” H1 only; removes photo, giant slogan and redundant CTA. Existing numbered section owner retained. |
| `src/features/catalog/sections/03-courses/courses-section.module.css` | CoursesSection and MiniCoursesSection, existing result props | Compact functional result headings and reduced top spacing make results visible immediately below filters. |
| `src/features/public-shell/page-wipe-transition.tsx` | `PageWipeTransition({content,pathname,loading,onActive})`, PublicMotion | Per-navigation axis snapshot: mobile yPercent 100→0→−100, vertical 12px heading push; desktop existing x direction/28px push. Other axis zeroed; resize cannot turn a transition diagonal. Routing, focus, reduced-motion and readiness lifecycle remain with existing owner. |
| `tests/public-layout-followup.browser.mjs` | Browser regression | Catalog first-viewport geometry; actual dock join/corner/pseudo-element checks; desktop/mobile rail bounds; actual vertical/horizontal animation samples; history, resize and reduced-motion settling. |

Root layout and persistent catalog route layout still own composition. No new shared APIs, dependencies, routes or services. `/preview/components` continues to embed the actual PublicHeader; its shell reflects these changes automatically.

## Visual and functional verification

Captures: `.header-evidence/layout-followup/` (local ignored evidence), including `courses-*`, `mini-courses-*`, `docked-*`, `reviews-*`, `wipe-cover-*` and `results.json`. Viewports: 2546×900 for the supplied wide-desktop defect, 1440×900, 768×900, 390×844 and 360×844; motion probes use 1440×900 and 390×900.

Observed: uninterrupted plum joining surface with 16px lower header corners; no white extension; review rail right bound equals document content viewport at every width (accounting for Chromium's reserved scrollbar gutter). Catalog filters start below 230px and first cards below 520px, with no hero photograph. Cyrillic headings and labels remain readable. Mobile wipe enters from below, desktop from the side. Browser screenshots are not human approval.

Completed checks:

- `pnpm exec eslint src tests next.config.ts eslint.config.mjs`: pass.
- `pnpm exec tsc --noEmit`: pass, including after removing only the verification build's generated tsconfig include entries.
- `node --test tests/catalog-contract.test.mjs tests/demo-cart.test.mjs`: 4/4 pass (existing Node module-type warning only).
- `pnpm build`: pass with TEST_PREVIEW=true in `.next-land03-layout-followup` and false in `.next-land03-layout-followup-real`; no origin invented. Expected real-source unavailable diagnostics remain.
- `node tests/public-layout-followup.browser.mjs`: pass in development and preview production, 2546/1440/768/390/360 widths, no page errors.
- `node tests/public-ui-fixes.browser.mjs`: pass against the production artifact, preserving prior shell/menu/learning-step fixes.
- `node tests/catalog-seo.browser.mjs`: 17 checks pass in each production mode, including filter/state/recovery, crawler metadata, sitemap/robots and clipped headings.
- `git diff --check`: pass.

Browser tests use `PLAYWRIGHT_MODULE=C:/Users/im061/AppData/Local/Temp/la09-browser-tools/node_modules/playwright`; production verification ports were 3120/3121 and were stopped afterward. Existing owner servers on 3000/3001 were preserved. Existing full-project lint issue remains: pre-existing untracked `.next-merge-check` output is traversed by `pnpm lint`; source-only lint is the meaningful check and no unrelated generated files are deleted.

## SEO and remaining limits

Reviewed `docs/seo/README.md`, verification checklist, metadata helper and actual route files. One meaningful H1 remains. Existing course-specific titles/descriptions still describe the visible catalog; no metadata rewrite needed. Canonical query stripping, preview noindex, schema/publication checks, sitemap/robots and original social/logo assets remain unchanged. No production origin was supplied or invented. Browser SEO checks run against both separately built TEST_PREVIEW modes, including clipped-heading, catalog state/filter and crawler HTML checks.

Real Catalog/Commerce integration, approved public inventory/legal/domain, physical-device Safari and final human visual/motion approval remain pending. No commit, push, deployment or Vault record change.
