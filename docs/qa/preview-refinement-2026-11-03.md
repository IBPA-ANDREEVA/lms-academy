# Public preview and motion refinement — 2026-11-03

## Request and reference scope

Targets: `/` HOME-02–09 and HOME-12, `/courses`, `/mini-courses`, shared CourseCard/Cut/header/loading surfaces, and `/preview/components`. Discovery remains MVP; packages remain gated later-phase previews and Start in USA release policy is unchanged. No prices, records, routes, legal claims or service capabilities were invented.

The supplied `codex-clipboard-7cd09f3d-6b6b-4aeb-9a4c-bf3ed415c956.png` shows the redundant catalog heading above the retained catalog filters. Borrow the compact filter relationship; remove “Каталог обучения” and promote the actual result label to the single active H1. `codex-clipboard-7dbc6e70-6538-4708-b0a1-a99309932ece.png` shows the homepage preview spilling into several rows with redundant card actions. Keep its three-column desktop relationship; cap each preview at three approved/published source records and link to the full catalog. Raster fixture facts are not production content. The screenshots establish desktop issues, not approved mobile pixels or a new brand system.

The owner explicitly clarified: **remove homepage filters on all screen sizes**. This supersedes the initial mobile request to retain an edge-to-edge filter rail. Full catalog filters remain. Written requests authorize the bounded Cut, motion, scrollbar, copy and geometry refinements below; final browser appearance still requires owner review.

## Implementation and canonical owners

| Owner / path under `src/` | Change, consumers and contract |
| --- | --- |
| `features/home/sections/06-courses/components/course-showcase.tsx` | No props; CoursesSection consumer. First three eligible records, no category controls, existing snap rail/dots and state feedback, “Все курсы” -> `/courses`. |
| `features/home/sections/08-mini-courses/components/mini-course-explorer.tsx` | No props; MiniCoursesSection consumer. First three eligible records, no category controls, existing OfferCarousel/mobileGrid, “Все мини-курсы” -> `/mini-courses`. Long Cyrillic words wrap in two-column mobile cards. |
| `features/home/sections/07-packages/{packages-section.tsx,components/package-explorer.tsx}` | No props; HomePage/PackagesSection consumers. Remove section title/description, size filtering, standalone demo explanation and bottom custom-package callout. Existing per-package exploration/modal stays; TEST_PREVIEW gate is preserved. |
| `features/home/sections/09-start-usa/start-usa-section.tsx` | No props; HomePage consumer. Remove standalone demo explanation; gated unavailable outcome retained. |
| `features/catalog/course-card.tsx` | Import `@/features/catalog` or catalog-local owner. Remove `action` prop and all internal buttons/duplicate detail links. One native title link overlays the card. Preserve course, headingLevel, status, variant and demonstration inputs; demonstration marks data attributes, while source titles/images still identify fixtures. Consumers: HOME-06, HOME-08, both catalog result sections, component preview and frontend fixture. |
| `features/catalog/catalog-page.tsx` | Persistent catalog layout still composes CatalogExperience. Remove IntroductionSection consumer; source file retained as unused, not recreated in routes. |
| `features/catalog/sections/{03-courses/courses-section.tsx,04-mini-courses/mini-courses-section.tsx}` | Props `items,active,filtered,onReset,demonstration,status?`. Active section uses H1 “Курсы”/“Мини-курсы”; inactive mounted panel uses H2. No intro/description or demo sentence. Quiet result count retained. CatalogExperience supplies active state. |
| `features/catalog/sections/02-filtering/components/filter-dropdown.*` | Existing `label,value,options,onChange` API; FilteringSection consumer. Bounded native overflow menu with stable scrollbar gutter, plum thumb and internal hit zone. Null-relatedTarget scrollbar blur no longer dismisses popup; outside pointerdown, real focus departure and Escape still close it. |
| `components/ui/button.module.css` | Existing Button/ButtonLink Cut API and stable hit area. Resting shadow opacity/offset zero; hover/focus adds depth and small lift, press settles; disabled/loading/reduced-motion remain still. Actual consumers: home learning and preview links, detail purchase/video/fallbacks, cart/checkout/cart preview, identity forms, route errors and component preview. Other appearance families unchanged. |
| `features/component-preview/{component-preview-page.tsx,cut-button-preview.tsx}` | Actual components reused; removed CourseCard actions and updated explanation, explicit flat resting Cut state. No new preview route. |
| `features/public-shell/{splash-loader.tsx,public-motion.tsx,public-motion.module.css}` | SplashLoader `active,suppressed?,inline?,welcome?`, PublicMotion and route-loading consumers. Welcome is visible in server HTML, solid plum, before route content; 800ms diagonal top-to-bottom clearance. Fullscreen splash/wipe stack at 80 above header 20; inline loader stays local. No-JS/reduced-motion skip; pre-hydration CSS failsafe clears after five seconds; input/resize/visibility cleanup retained. |
| `features/public-shell/page-wipe-transition.tsx` | Existing `content,pathname,loading,onActive`; PublicMotion consumer. Mobile enters from above and exits below, including history; desktop direction unchanged. Existing route readiness, focus and interruption lifecycle retained. |
| `features/public-shell/public-header.module.css` | PublicHeader API and consumers RootLayout/ComponentPreviewPage unchanged. Desktop outer backing transitions to/from docked plum in 320ms; reduced motion direct. |
| `features/home/sections/03-about/about-section.module.css` | Hide “ОБ АКАДЕМИИ” kicker only at <=760px. |
| `features/home/sections/05-learning-preview/{components/learning-preview-demo.tsx,learning-preview-section.module.css}` | Remove internal LMS environment heading; 01/02/03 selectors form the first row with numbers above labels. Existing local step-wipe directions and mounted form state retained. |
| `features/home/sections/12-faq/faq-section.tsx` | Remove internal “Не нашли ответ?” / “Напишите нам” block. Existing adjacent Contact section remains. |
| `features/home/{composition/home-section-seam.module.css,sections/02-hero/hero-section.module.css}` | Suppress detached hero/portrait/learning seam overlays. Mobile hero plum band follows the photograph’s existing diagonal exactly; founder’s existing connected photo band remains. No floating replacement ornament or new section boundary. |
| `app/globals.css` | Existing palette -> scrollbar tokens: plum thumb, blush track, brand hover/pressed. Authored 14px document rail, 10px overflow baseline, standards fallback and forced-colors. Existing requested swipe-rail scrollbar exceptions retained. |

## Verification and evidence

Evidence: `.header-evidence/preview-refinement/` (local ignored PNG/JSON), 1440x900, 768x900, 390x844, 360x844. Individual hero/about/founder/learning/course/mini/package/USA/catalog/filter captures avoid claiming unloaded lazy photographs as evidence. Original photos, Manrope and Unbounded Cyrillic were inspected. The supplied screenshot’s multi-row homepage grid is replaced with a single three-card desktop row; the catalog remains complete. Mobile filter/dropdown content and card text fit; both document width and text ranges were checked. Geometric differences are intentional removals/alignment described above, not human approval.

`tests/preview-refinement.browser.mjs` verifies caps and full-catalog counts, all removed controls, whole-card single-link semantics, visible and single DOM H1, popup gutter click/wheel/selection, URL reset, keyboard selection/Escape/focus, text ranges, cold HTML splash with JS deliberately held, forward/back wipe axis/stacking, real mobile menu navigation, Cut hover/focus/reduced state and stable hit area. Browser page errors: none. Test launches keep native scrollbars visible (Playwright otherwise hides them by default).

Additional runtime sample: header enter rgba(120,40,88,0.34) -> solid plum, leave rgba(120,40,88,0.698) -> transparent. No-JS homepage splash is hidden. `authored-scrollbars-1440.png` confirms document and popup plum thumbs; popups use a real native scroll gutter. This is Chromium automation; physical touch/Safari/low-end device verification remains outstanding.

Commands/results:
- `pnpm build` with TEST_PREVIEW=true and false, separate `.next-land03-refinement-{preview,real}` directories: passed.
- `pnpm exec tsc --noEmit`: passed after final source changes.
- `pnpm exec eslint src tests/preview-refinement.browser.mjs tests/frontend.fixture.tsx`: passed.
- `pnpm lint`: failed on generated build output, including the pre-existing untracked `.next-merge-check` directory and the initial temporary verification build. No generated files or unrelated source were deleted. Focused source lint passes; baseline lint hygiene is separate.
- `npx --yes -p @google/design.md designmd lint DESIGN.md`: zero errors; one warning for the existing prose-only document (no YAML frontmatter).
- `node --experimental-strip-types --test tests/catalog-contract.test.mjs`: 2 passed (Node module-format warning only).
- `node tests/preview-refinement.browser.mjs`: passed the viewport/action/motion matrix; final run includes single DOM H1 and visible-scrollbar checks.
- `node tests/catalog-seo.browser.mjs`: preview and real modes passed, 17 checks each; responsive data controls, empty/unavailable/loading/no-match, cart/detail regression, metadata/canonical/robots/sitemap/assets.

SEO: routes and existing metadata titles/descriptions remain accurate; no new canonical origin. No SITE_URL was supplied for these builds, so noindex, omitted canonicals, empty sitemap and disallow-all robots remain deliberate. Preview/unpublished products emit no product schema and remain nonindexable. Actual live-origin/schema/crawler checks require approved domain and published records. No backend completion or publication approval is inferred. Legacy browser scripts asserting the removed heading, home filters or upward mobile wipe describe superseded requirements and were not treated as acceptance for this request.

No commit, deployment, Vault edit or production publication performed. Pre-existing UI work is preserved. Final human visual review remains pending.
