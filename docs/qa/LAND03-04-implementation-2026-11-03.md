# LAND03-A / LAND04-A / LAND04-B implementation — 2026-11-03

Scope: explicit catalog testing mode, production data boundary/empty states, SEO audit and infrastructure, supplied-logo vector assets, and persistent maintenance instructions. No database, payment/enrollment service, approved production inventory, new legal content or deployment was created. Source/diff/AGENTS and relevant product, architecture, registry, design and installed Next.js guides were inspected before edits. Unrelated untracked numbered source/document/artwork copies were preserved.

## LAND03-A

Implemented `TEST_PREVIEW=true` as a server-read, exact opt-in independent of NODE_ENV. Local `.env` now enables it; tracked `.env.example` explains usage. A root CatalogProvider supplies one safe DTO collection to existing catalog cards, home course/mini sections, detail sections and the canonical CartProvider. Browser persistence stores IDs only, validates/caps input, reconstructs fictional records, synchronizes tabs, and exposes recovery for corrupt/blocked storage. All examples visibly say demo; USD cents follow PD-002. No preview request invokes a server mutation, real quote/payment/order, enrollment or external service.

The bottom-left icon button opens a keyboard-accessible non-modal panel. Actions: add course, mini or three courses; clear catalog and cart; reset catalog; reset all; display current counts; simulate unavailable/loading; return to ready; add course/mini/multiple items to cart; remove individual selected items; clear cart/test empty. Empty selection cannot enable payment. Catalog records vary direction, level, language availability, program length and USD price; hidden drafts and sale-paused records exercise independent publication/sale states. Preview detail pages use reserved demo slugs and existing detail UI. The original unconditional catalog example exports are removed. HOME-07/09 experimental package/module examples are also gated from real-mode public content, without release promotion.

With preview false/missing, no testing control is rendered and browser demo storage is ignored. `src/server/catalog/index.ts` is an explicitly **unconnected adapter** returning unavailable with a privacy-safe structured diagnostic. It is not a fake production database. Successful empty and unavailable are distinct DTO states. CatalogState reuses Button/ButtonLink and existing tokens for zero main courses, zero minis, no filtered results, loading and failure/retry. Existing CartSection/CartPreview empty states are preserved. A paused program no longer incorrectly says its visible price is unpublished. Real purchases stay disabled pending authoritative Commerce integration.

Canonical architecture/data documentation: [catalog-preview-contract.md](../architecture/catalog-preview-contract.md). It defines product identity/category/publication/approval/sale/localization/trainer/credentials/program/media/price/review/timestamps, mini-course differences, read results and future server integration. Admin controls/readiness follow PD-009; server authorization, publication invalidation, Commerce revalidation and backend error boundaries remain required when persistence is connected. No endpoints/migrations are invented.

Key implementation paths:
- `src/lib/site-environment.ts`, `src/server/catalog/{contracts,policy,index}.ts`.
- `src/features/catalog/catalog-provider.tsx`, `catalog-presentation.ts`, `preview/{preview-data.ts,preview-control.tsx,preview-control.module.css}`.
- Existing CatalogExperience, result sections, CourseCard, home 06/08, CartProvider and demo-cart utility.
- `src/features/catalog/components/catalog-state.{tsx,module.css}`; `src/features/course-detail/{product-route,preview-detail}.tsx` and existing DetailPage/PurchasePanel.
- Existing `/preview/components` now includes a local CatalogStatesPreview using the actual shared state component.

Remaining backend dependencies: persistence/public reads, Admin category/content/price/publication/readiness, real taxonomy/media/approved curriculum, request-time reads/cache invalidation, authoritative cart/quote/purchase. Production successful-empty UI is verified through the shared component and preview-empty state, not a live empty database; the real disconnected path is verified as unavailable.

## LAND04-A / LAND04-B

[Initial audit](../seo/initial-audit-2026-11-03.md) records the concrete pre-change routes/issues/severity. Main findings: unconditional fixture fallback; missing canonicals/descriptions/OG/Twitter/sitemap/robots/schema; default favicon; supplied logo different from prior concept. Existing cart/checkout/component-preview noindex and html lang=ru were retained.

Corrections: central server metadata helpers and default-noindex root, explicit static public opt-in, route-specific RU titles/descriptions/OG/Twitter, query-free canonicals only with a configured approved SITE_URL, no fictional language alternates; Next robots/sitemap metadata routes; real publication filtering; minimal verified-brand WebSite/Organization JSON-LD, and guarded real-product Course/BreadcrumbList builders with safe serialization. Preview, draft, missing and unavailable products do not generate product schema or sitemap entries. Domain missing/invalid means no absolute SEO URLs, empty sitemap and noindex/disallow; no production domain was invented. A local reserved `https://academy.example.test` origin was used solely to validate generated URLs.

Actual indexable routes with preview off and configured domain: `/`, `/courses`, `/mini-courses`; source unavailability preserves these sitemap entries. Future real approved/published products may be added through the server adapter; paused sales alone do not remove public content. Private/auth/legal routes are currently absent, so tests of `/admin`, `/account`, `/trainer`, `/login` verify 404/noindex, **not authentication or role authorization**. Robots does not provide access control. No absent legal/informational route was published.

Assets: `public/brand/logo.svg`, `logo-dark.svg`, `mark.svg`, `social.png`; inline shell path data `src/features/public-shell/supplied-logo-artwork.ts`; `src/app/favicon.ico` (16/32/48), `icon.svg`, `apple-icon.png` (180). The sole supplied PNG is archived at `docs/design/brand/supplied/IMG_4590.PNG`, with checksum/provenance in `public/brand/source-provenance.json`. SVGs use spline paths, including traced original lettering, with no embedded PNG/font substitution. Flat sampled colors replace slight raster color variation/noisy edges; the dark lockup uses a white wordmark. Source artwork proportions are preserved while transparent canvas margins are trimmed. Prior concept assets remain historical. D-021 scopes this replacement only; no legal-identity decision is inferred.

Permanent instructions: [SEO guide](../seo/README.md), [verification checklist](../seo/verification-checklist.md), and concise mandatory references in root AGENTS.md. All four frontend registries, DESIGN.md and design decisions describe owners/consumers/state and missing integration. No scheduled automation was requested or created; maintenance instructions apply to future route/component work.

Unresolved: approved production origin/content/legal/media rights, live backend product records and publication invalidation, real product metadata/schema validation and Search Console/live crawler checks. Brand source/name is not evidence of a legal entity, credentials or accreditation. Human visual approval remains pending.

## Verification evidence

Evidence directory: [LAND03-04-2026-11-03](evidence/LAND03-04-2026-11-03). [Complete changed-file manifest](evidence/LAND03-04-2026-11-03/changed-files.txt). Final status: lint, typecheck, both production builds, 4 unit tests, both main browser matrices, both shared-consumer matrices, recovery tests, updated existing catalog tests and existing Commerce production tests passed. No new application/runtime dependencies. One-off vtracer was installed outside the repository under `/tmp/lms-logo-tools`; asset rasterization uses Next's existing sharp dependency.

- Unit: 4 tests covering storage validation/rejection of stored objects/amounts, USD cents, production publication versus independent sale state, rejection of demos/reserved demo slugs, and kind/language filters.
- Main browser suite, both modes against production builds: control gating; add/clear/reset; filtered/no-course/no-mini/loading/unavailable states; cart add/remove/multiple/empty/USD totals; disabled checkout; open/paused/draft/deleted preview details; persistence; keyboard Escape focus return; document/heading clipping; actual HTML metadata; robots; sitemap; JSON-LD parse/facts; favicon/brand asset responses; no application mutation requests or browser page errors.
- Viewports: 1440×900, 390×844, 360×844, 768×900; legacy catalog adds 320×844. Screenshots retained for menu, empty/error, detail, cart, shared states, home/mini consumers and logo light/dark usage.
- Tested metadata routes: `/`, `/courses`, `/courses?language=en`, `/mini-courses`, `/cart`, `/checkout`, `/preview/components`, `/courses/demo-course-0`, `/mini-courses/demo-mini-0`, `/admin`, `/account`, `/trainer`, `/login`; raw HTML additionally fetched as Twitterbot. Product outage `/courses/unavailable-course` and reserved-demo 404 exercised in real mode.
- Recovery suite: corrupt catalog/cart storage has visible warnings plus structured diagnostics and reset; cross-tab clear/reset; blocked writes retain in-memory UI with catalog/cart warnings.
- Shared-consumer suite: home and mini listings at four widths, text ranges against clipping ancestors (reachable native horizontal scroll content is distinguished), icon declaration uniqueness, actual component-state reset, home clear/reset and live reduced-motion switch.
- Existing catalog suite: navigation, filters, history, sticky geometry, keyboard tabs and reduced motion. Initial run expected retired `/courses/course-lashes` but actually navigated to `/courses/demo-course-0`; preserved in `catalog-legacy-initial.log`. Test expectations were explicitly updated for the requested demo namespaces/local add action, without weakening navigation/filter/layout checks. Current run passes.
- Existing Commerce production suite passes: stored old demo cart ignored and no demo actions. Legacy development/detail/home suites that assume old fixture names/prices/inventory were not all migrated/run; current focused suites cover the changed flows. No claim that every historical suite passes.
- Strict premium UI audit: zero findings. Lint, TypeScript and production builds checked in both modes; see individual logs.

Visual review: the new state blocks use existing Manrope, surface/border/plum tokens and shared controls. The catalog hero/filter/card composition is preserved; home retains its persistent section group. Panel is bounded/scrollable with a 44px icon trigger; mobile long text wraps. Supplied logo is readable on light header and dark footer. Draft/deleted/unavailable states retain navigation, and no real price/purchase action is fabricated. These are implementation observations, not owner approval. No materially new aesthetic was asserted as approved.

## Commands executed

From repository root (shell environment variables shown are verification settings, not production configuration):

```sh
pnpm lint
pnpm exec tsc --noEmit
node --test tests/catalog-contract.test.mjs tests/demo-cart.test.mjs
git diff --check

LMS_BUILD_DIR=.next-land03-preview TEST_PREVIEW=true NODE_ENV=development pnpm dev --port 3113
LMS_BUILD_DIR=.next-land03-real TEST_PREVIEW=false SITE_URL=https://academy.example.test NODE_ENV=development pnpm dev --port 3114
LMS_BUILD_DIR=.next-land03-build-preview TEST_PREVIEW=true NODE_ENV=production pnpm build
LMS_BUILD_DIR=.next-land03-build-real TEST_PREVIEW=false SITE_URL=https://academy.example.test NODE_ENV=production pnpm build
LMS_BUILD_DIR=.next-land03-build-preview TEST_PREVIEW=true NODE_ENV=production pnpm start --port 3123
LMS_BUILD_DIR=.next-land03-build-real TEST_PREVIEW=false SITE_URL=https://academy.example.test NODE_ENV=production pnpm start --port 3124
```

Browser commands use:
`PLAYWRIGHT_MODULE=/Users/ivanmakovetskyi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright`.

```sh
TEST_PREVIEW=true FRONTEND_URL=http://localhost:3123 node tests/catalog-seo.browser.mjs
TEST_PREVIEW=false SITE_URL=https://academy.example.test FRONTEND_URL=http://localhost:3124 node tests/catalog-seo.browser.mjs
FRONTEND_URL=http://localhost:3123 node tests/catalog-preview-recovery.browser.mjs
TEST_PREVIEW=true FRONTEND_URL=http://localhost:3123 node tests/catalog-shared.browser.mjs
TEST_PREVIEW=false FRONTEND_URL=http://localhost:3124 node tests/catalog-shared.browser.mjs
FRONTEND_URL=http://localhost:3123 FRONTEND_EVIDENCE=docs/qa/evidence/LAND03-04-2026-11-03/legacy-catalog node tests/catalog.browser.mjs
FRONTEND_URL=http://localhost:3124 COMMERCE_PRODUCTION=1 FRONTEND_EVIDENCE=docs/qa/evidence/LAND03-04-2026-11-03/legacy-commerce node tests/commerce.browser.mjs

python3 /Users/ivanmakovetskyi/.codex/plugins/cache/openai-curated-remote/frontend-design-premium/1.4.0/skills/frontend-design-premium/scripts/audit_project.py . --mode strict
python3 -m pip install --target /tmp/lms-logo-tools vtracer --quiet
PYTHONPATH=/tmp/lms-logo-tools python3 scripts/brand/vectorize-logo.py /Users/ivanmakovetskyi/Library/Containers/ru.keepcoder.Telegram/Data/tmp/IMG_4590.PNG
node scripts/brand/render-assets.mjs
```

Additional inspection used rg/cat/git, curl for rendered HTML, official Schema.org/Google search documentation and local image viewing. The supplied source was copied into the documented brand archive. No source art/docs/student data were deleted.

Resolved verification issues: initial ICO PNG entries lacked RGBA (fixed exports); Next dev indicator covered preview button (moved framework indicator right); random UUID in static unconnected adapter violated Next 16.4 prerendering (stable readiness diagnostic); numbered copies of generated `routes.d *.ts` produced duplicate global LayoutProps (tsconfig excludes only generated filenames containing spaces inside `.next*`, leaving source copies untouched); ESLint excludes isolated generated build directories. Existing owner's port-3000 dev server was not killed. Isolated servers/builds use separate output directories.
