# Catalog read contract and TEST_PREVIEW

Implemented for LAND03-A, 2026-11-03; frontend boundary ownership updated by ADR-0003 on the same date. This is a presentation/read boundary, **not a database, Admin publication service, authoritative cart or purchase implementation**. Authority: PD-001, PD-002, PD-009, ADR-0003. Existing feature and section owners remain in place.

## Configuration and isolation

`TEST_PREVIEW=true` explicitly enables the browser-local demonstration. Any other/missing value disables it. It is independent of NODE_ENV and supports production-mode preview builds. The root server layout reads `src/lib/site-environment.ts`, passes only a boolean and safe CatalogResult to CatalogProvider, and conditionally renders PreviewControl. No NEXT_PUBLIC secret, process.env object, database credentials or connection string is serialized. The local ignored `.env` enables preview; `.env.example` explains opt-in. Set `TEST_PREVIEW=false` for deployment.

Environment values affect prerendered HTML and metadata: restart development after changes and **rebuild for each deployment mode/domain**. Do not change only the `next start` environment and expect a previously built artifact to change. `LMS_BUILD_DIR` optionally isolates verification output from the owner's active `.next`; the framework indicator is bottom-right to avoid the preview button.

With preview disabled, root reads `src/features/catalog/catalog-source.ts`. Its source is deliberately unconnected and returns `{status:'unavailable', products:[], diagnosticId:'catalog-adapter-not-connected'}` with a structured server diagnostic. No fake production store or fallback inventory exists. Client catalog/cart never query or write a database. All preview mode pages are noindex; see [SEO guide](../seo/README.md).

## Preview store and controls

`src/features/catalog/catalog-provider.tsx` owns temporary catalog IDs. `preview/preview-data.ts` reconstructs fictional CatalogProduct records. Browser localStorage keys are `lms.catalog.preview.v1` and `lms.catalog.preview-cart.v2`; version changes are intentional. Storage accepts only unique allowlisted ID shapes, at most 200 entries. Prices, titles and objects from storage are never trusted. Corrupt catalog storage falls back to session defaults with a visible warning; corrupt cart storage shows the existing recoverable cart error. Writes denied by browser policy remain in memory with warnings. Storage events synchronize tabs. Nothing is uploaded.

The fixed bottom-left code-icon button opens a non-modal, scroll-bounded panel. It supports keyboard activation, named controls, heading focus, Escape/close focus return, and outside dismissal. It uses the shared Button owner, inspected `/icons/line/code.svg`, existing Manrope/tokens, no new motion or UI framework. Native/framework overlays retain their owners. Counts include hidden drafts; result counts include published examples only.

Actions:
- Add course, mini-course, or three courses; clear catalog (also clears cart); reset catalog to eight examples; reset all data (catalog defaults + empty cart).
- Show loading/unavailable catalog scenarios, then return to normal. These never change real-source state.
- Add an existing eligible course/mini-course or all eligible examples to cart; individually remove selected items; clear cart/test empty state. When no eligible example exists, add/reset catalog first.
- Existing `/preview/components` commerce scenarios remain available only with TEST_PREVIEW enabled. All prices now use integer USD cents, consistent with PD-002.

Initial examples: four course + four mini-course records. Every sixth sequential example is a hidden draft; the preceding example has paused sales. Other records vary direction, beginner/advanced level, RU/RU+EN content availability, lessons, duration and price. All names/descriptions/media/trainer labels say demo; no credentials, actual reviews or video claims are fabricated. Demo SVG media is an illustration, not a staff portrait. The source timestamps are fixed synthetic test data.

Preview cards, home discovery, detail sections and cart use existing canonical UI. Detail URLs use `/courses/demo-course-N` and `/mini-courses/demo-mini-N`; draft/deleted records show not-found content, and production rejects the reserved namespace. Preview details resolve from browser state; metadata is generic and noindex even on direct links. Old allowlisted fixture detail URLs are no longer a production data source. The old catalog example exports were removed; unused historical home fixture files remain untouched and are not catalog input.

Cart stores only selected IDs and derives current preview amounts from catalog records. Removed, draft or paused records cannot produce cart rows or totals. Repeated add is idempotent and bulk additions do not lose selections. Preview checkout is the existing disabled UI: no fetch, server action, order, Stripe call, enrollment or external side effect is introduced. A real cart/quote/checkout remains a separate Commerce dependency.

## Read model

Temporary frontend/preview view types: `src/features/catalog/catalog-view-types.ts`. These preserve current consumers, not an authoritative backend API schema; generate transport contracts from FastAPI OpenAPI during integration. Frontend mapping: `src/features/catalog/catalog-presentation.ts` adapts this DTO to **existing** CatalogItem/CourseCard and DetailProduct presentation contracts, rather than replacing them or moving UI into server domains.

| Field | Meaning / integration rule |
| --- | --- |
| id, slug, kind | Stable opaque identity; stable public slug; course or mini-course. Reserve demo namespace. Slug history needs backend redirects when approved published slugs change. |
| category | Admin-managed category reference and approved public title. Static preview categories are not a production taxonomy decision. |
| publication, approval | Independent draft/published/archived and pending/approved values. Only approved+published+publishedAt with public Russian description/title enters this RU presentation. English-language lessons may have Russian discovery descriptions. |
| sale, priceApproval | Independent open/paused sale flag and Admin-approved price. Visibility alone never authorizes checkout. |
| content | Localized title/description/outcomes. RU is the current UI; EN record availability does not create an English route or hreflang. |
| languages | Available course language versions; safe BCP-47 ru/en values. |
| trainer | Stable reference, approved display name/photo/alt and approved credentials only. No invented biography. |
| level | Current beginner/advanced presentation IDs; final taxonomy remains Admin/backend responsibility. |
| curriculum, lessonCount, durationMinutes | Approved module/recorded-lesson summaries and derived counts/durations. Not private lesson video keys or lesson authorization. |
| cover, preview | Approved public cover and optional public preview/caption URL. Never expose private R2/HLS secrets or paid media grants. |
| price | Nullable integer minor-unit amount and USD. Admin approval is explicit. This read projection is not a Commerce quote. |
| curatorSupport, completionRequirements | Supported courses require assigned curator readiness upstream. Mini-course: recorded lessons, false curatorSupport, no homework review; completion per approved requirements. Certificates always require admin evidence review/manual issuance. |
| reviews | Optional approved public review text and approved display name; no rating/aggregate inference. |
| createdAt, updatedAt, publishedAt | ISO timestamps from source; actual content update time, never sitemap generation time. |
| demonstration | Mandatory false for a real public record; true records are always rejected at production boundary. |

## Disconnected frontend boundary and future integration

`fetchPublishedCatalog(query?: {kind, category, language})` returns success with products, empty with an empty collection, or unavailable with a safe diagnostic reference. `fetchPublishedProduct(kind, slug)` returns success, missing, or unavailable. Loading belongs to the asynchronous UI/Suspense state; it is not a stored publication status. Query methods cover main and mini lists through kind, keeping a single contract.

The retained source is frontend compatibility only: no HTTP client, mock API or persistence is implemented. Python Catalog will own publication/readiness and public queries under `backend/app/modules/catalog`. When a real FastAPI contract exists, replace disconnected frontend reads with generated HTTP integration and map safe responses to existing presentation. Return `empty` only after a successful read with zero matches; no TypeScript publication or purchase policy is restored. Handle bounded timeout/retry/connection failure as `unavailable`; catch and log safe structured request-correlated diagnostics, not SQL, credentials or personal data. A backend outage is never a 404/missing result. Do not create speculative endpoints/migrations for this seam.

Admin alone approves content/prices and independently publishes, pauses sales, hides or archives. Upstream publication must validate required lessons/videos/materials/homework and assigned curator (supported courses), correct locale/media availability and version-matched readiness per PD-009. The retired TypeScript `isPublicProduct`, `isPurchasable` and `selectPublished` backend policy is removed. `src/lib/seo/product-indexability.ts` now retains only a defensive SEO exclusion check; it grants no publication or purchase authority. Python Catalog must supply approved public projections; Python Commerce must authorize price, eligibility and availability at quote/purchase time. Real purchase controls stay disabled until that integration exists, even for a visible record.

Wire actual request-time reads under appropriate Suspense boundaries or use Next cache tags with explicit publication/price invalidation. Current disconnected results can be prerendered because no source can change; **do not retain static outage snapshots when connecting a live backend**. React `cache` only deduplicates a render; it is not a persistence cache. Publication invalidates listing, detail metadata, sitemap and related home projections together. Preserve enrollment entitlements when sales pause/archive. No access/refund/retention policy is added here.

## User states and owners

| State | Russian UI | Owner |
| --- | --- | --- |
| Loading | «Загружаем каталог…» | CatalogState + existing catalog Suspense |
| Successful zero courses | «Курсы готовятся к публикации» | CoursesSection / home CourseShowcase |
| Successful zero minis | «Мини-курсы готовятся к публикации» | MiniCoursesSection / home MiniCourseExplorer |
| Filters with no match | «По этим фильтрам ничего не найдено» + reset | CatalogState; URL filters remain CatalogExperience-owned |
| Source unavailable | «Каталог временно недоступен» + retry/navigation | CatalogState, server diagnostic |
| Missing product | Existing DetailNotFound | Both route kinds; production reserved demo URLs return 404 |
| Empty cart | «Пока здесь пусто» + catalog/mini navigation | Existing CartSection/CartPreview |

Preview status and draft/sale distinctions are test data, not production publication evidence. HOME-07/09 experimental package/module content is also gated from production; no Phase 2 feature is promoted. Remaining backend dependencies: actual persistence/readiness/publication/category/price workflows, Commerce cart/quote and eligibility, approved media/content and legal policies, request-time error/invalidation behavior.

## Migration ownership and missing work

See [integration conventions](frontend-backend-integration.md) and [migration evidence](../qa/python-backend-migration-2026-11-03.md). The Python runtime is not initialized. Existing `fetchPublishedCatalog(query?)` and `fetchPublishedProduct(kind, slug)` signatures are retained solely so the current frontend compiles and keeps honest unavailable/missing states; they are not promised API endpoint signatures. Preview fixtures and UI storage behavior are unchanged. Future API integration must define authentication, generated schemas, request-time cache invalidation, real publication/readiness and Commerce authorization before enabling purchases.

## Package preview extension - 2026-11-04

CatalogProvider additionally reconstructs browser-only PreviewPackage records from `demo-package-N` IDs. New/reset stores have eight course/mini records plus three package records (2/3/6); old valid stores are preserved. Same ID-only storage key, 200-record cap and corruption recovery. Packages have explicit fictional USD cents and no production CatalogProduct/ProductKind change, detail URL, server mutation, payment or entitlement. PreviewControl creates packages and adds them to cart; bulk add includes them. Clear/reset/loading/unavailable apply to all preview records. PackageExplorer reuses CatalogState and OfferCarousel; one full-card action adds a unique package ID, announces in-cart state and preserves restoration/removal in existing Commerce views. TEST_PREVIEW false/missing always has no package fixtures and the calm unpublished state. [Reference and verification](../qa/landing-refinements-2026-11-04.md).
