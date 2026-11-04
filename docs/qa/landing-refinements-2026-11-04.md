# Landing refinements · 2026-11-04

Target: `/` and existing `appearance="cut"` consumers. Russian-first public discovery; packages remain TEST_PREVIEW demonstrations. Owner authorizes first commit/push on `refactor/landing`, then homepage entrance work on a new branch. Unrelated untracked backend work is excluded.

## Supplied references

All six Temp PNGs were opened. IDs below are the `codex-clipboard-*.png` suffixes.

| Reference | Scope / borrowed relationship | Exclusions and limits |
| --- | --- | --- |
| `7a1292c0-3d2f-4c78-a45e-085f9fef43be`, `6f15b6a1-6661-459e-97ff-511130545d95` | HOME-05 outgoing assignment upload retains full height throughout wipe | Bug evidence, not a redesign; desktop captures do not establish mobile dimensions |
| `1afd7f55-0ce9-40a0-bac9-50d602d2fab1` | Remove Contact notice headed «СВЯЗЬ С АКАДЕМИЕЙ» | Preserve honest delivery-unavailable explanation beside disabled submit |
| `ab16239b-114d-4522-9fe2-d1c006358d26` | Header dropdown animates on every opening and reverses on closing | Preserve native navigation, dimensions and destinations |
| `4e6eebef-9ca3-4bab-81cb-439103df28cb`, `d5a7587a-4e78-44d0-9440-e6e72f263ede` | Double Cut + Panel: hexagonal face, right panel, detached slash, right-to-left expansion | Existing plum token overrides sampled raster color; mobile adapts existing API |

Written request also selects form-left/title-right desktop Contact, upper-right catalog links, brutalist whole-card package actions, review drag hint without arrows, removal of learning note and required-fields legend. Mobile Contact retains title before form in DOM reading order. No new photography, production prices, routes, policy or reviews.

## Owners and behavior

- `components/ui/button.tsx` / CSS preserve Button/ButtonLink props/native behavior. Private CutSurface uses two aligned text planes: white ink follows the clipped panel edge. CSS alone drives 650ms cubic-bezier(.22,1,.36,1), arrow +4px, slash +5px and reversal. Inverse has a white edge for plum; focus/press/disabled/loading/live reduced motion remain. Other families are unchanged.
- Cut consumers verified: home learning/course/mini/USA; identity login/register/forgot; commerce cart/checkout/preview/payment; detail purchase/not-found/preview/video retry; component preview. Preview demonstrates the real shared implementation and inverse on plum.
- HOME-05 `.upload` owns its height independently of parent `data-stage`; outgoing assignment no longer shrinks 150→90px (mobile minimum 110px). Existing state, wipe direction and focus survive.
- PublicHeader removes mount-only `data-css-motion`. Native details uses opacity/transform, `@starting-style`, discrete content visibility; reduced motion and unsupported transition browsers open directly. Close/outside/Escape remain native/existing.
- PackageExplorer reuses CatalogProvider, CartProvider, OfferCarousel, CatalogState. PackageCard has one semantic action stretched over the full article, with no separate CTA/modal. In-cart state is announced and repeat clicks do not duplicate IDs. Historical unconsumed PackageBuilder source is preserved.
- `catalog/preview/preview-data.ts` owns deterministic `demo-package-N` PreviewPackage records (sizes 2/3/6), separate from production CatalogProduct/ProductKind. Storage contains IDs only. New sessions/reset: eight products + three packages. Old valid storage is preserved. Clear/reset/loading/error and 200-record cap include packages. Fictional USD amounts cannot pay/enroll. Real mode exposes no package fixtures even with seeded storage.
- CatalogState adds optional `productType="package"`, keeping existing props/consumers. Empty packages recover to actual `/courses`. PreviewControl adds package-create/cart actions.
- Numbered Contact/course/mini/reviews owners remain. Reviews keep drag/touch/keyboard/dots with a written hint. Catalog links precede cards at the right edge at every verified width.
- ESLint excludes `.next-*/**`: initial lint scanned pre-existing generated merge/UI chunks. Source lint passes without deleting those outputs.

## Verification

- `pnpm lint`, `pnpm exec tsc --noEmit` — pass after generated-output ignore correction.
- `node --test tests/catalog-contract.test.mjs tests/demo-cart.test.mjs` — five pass, including ID-only package restoration. Existing Node typeless-package warning remains.
- `TEST_PREVIEW=true LMS_BUILD_DIR=.next-land03-landing-preview pnpm build` — pass.
- `TEST_PREVIEW=false LMS_BUILD_DIR=.next-land03-landing-real pnpm build` — pass; expected structured catalog-adapter-not-connected diagnostics.
- `tests/landing-refinements.browser.mjs` — pass at 1440×900, 768×900, 390×844, 360×844: Contact order, text ranges/overflow, upper-right links, package add/dedup/persistence/clear/recreate/loading/error, review keyboard navigation, interrupted learning/comment retention, repeated menu animation.
- `tests/cut-button.browser.mjs` — pass: sweep/reverse, four variants, stable hit area, focus/activation, disabled/loading, live reduced motion, four widths and touch.
- `tests/catalog-seo.browser.mjs` — preview and real production artifacts pass, 17 checks each. Bulk-cart assertion updated from eight to eleven because the requested three package fixtures are included.
- `tests/catalog-preview-recovery.browser.mjs` — pass: corrupt/blocked storage and cross-tab recovery.
- `tests/catalog-shared.browser.mjs` — both modes pass: home/mini/shared preview/text clipping/icon uniqueness/live reduced motion.

Runtime: bundled Playwright + installed Chrome. Full captures/results: `.landing-evidence/refinements/`; selected durable evidence: `docs/qa/evidence/landing-refinements-2026-11-04/`. Outgoing upload remained **150px in every visible sampled frame**; dropdown opacity about 65ms into both openings was **0.826**, reaching 1 at rest. Actual self-hosted Cyrillic Manrope/Unbounded verified. Screenshots are implementation evidence, pending human review.

SEO guide/checklist reviewed. No metadata/route/canonical/sitemap/schema content change is needed. Preview stays noindex without fixture sitemap/schema. No approved SITE_URL was supplied: canonical remains absent and sitemap empty. SEO suite checks normal/Twitterbot HTML, robots, sitemap and assets. Production origin, live content/services/legal readiness, real crawler validation and human visual approval remain pending.
