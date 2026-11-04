# Python backend architecture migration — 2026-11-03

## Scope and implementation status

Owner-authorized architecture/documentation change, with removal of the obsolete TypeScript Catalog backend and empty Python directory preparation. [ADR-0003](../decisions/0003-python-backend-architecture.md) records approval. No Python runtime, manifest, dependencies, entry point, API endpoint/client, model, service, migration, connection, authentication or worker implementation was created. No commit, deployment or Vault planning change was performed.

The original working tree contained untracked `.next-merge-check/`; it was left untouched. Existing generated build directories are not implementation evidence. Verification used isolated `.next-land03-python-real` and `.next-land03-python-preview` directories; Next-generated additions to `tsconfig.json` were restored to the original file after checks.

## Inspection findings and removal map

Inspected root instructions/README, source tree (including `.gitkeep` directories), seven frontend feature owners, frontend registries, architecture overview/modules/workflow, ADR-0001/0002, product requirements/scope/decisions/open questions, catalog preview contract, SEO guide/checklist, installed Next.js server/client/data-fetching/metadata guidance, source imports and relevant tests.

| Former file | Actual behavior and dependencies | Disposition |
| --- | --- | --- |
| `src/server/catalog/contracts.ts` | Dependency-free serializable types; consumed by Catalog provider, preview data, presentation mapping, state, course/mini sections, detail route/preview and SEO metadata/schema | Removed from server tree. Existing type shapes retained as temporary frontend/preview `src/features/catalog/catalog-view-types.ts`, explicitly not a Python API schema. |
| `src/server/catalog/index.ts` | `server-only`, React `cache`, local types; no I/O. Catalog always unavailable with structured diagnostic. Product lookup rejects reserved/invalid slugs, then receives unavailable. Consumers: root layout, sitemap and detail metadata/route. | Removed from server tree. Existing disconnected compatibility retained at `src/features/catalog/catalog-source.ts`, with comments marking missing real integration. No fabricated data, HTTP client or new backend behavior. |
| `src/server/catalog/policy.ts` | Pure `isPublicProduct`, `isPurchasable`, `selectPublished`; no persistence or complete PD-009 readiness. Actual runtime policy consumers were metadata/schema/sitemap; `isPurchasable` had only test usage. | Retired backend policy removed. Only defensive SEO exclusion survives as `src/lib/seo/product-indexability.ts`; no purchase function or Catalog publication authority remains. Sitemap filters via the SEO-only check. |
| `tests/catalog-contract.test.mjs` | One preview storage test plus one retired backend policy test | Kept the frontend preview test; removed the exclusive backend policy block/import. Added a focused SEO regression test in `tests/product-indexability.test.mjs` for retained crawler exclusion behavior. |

All affected imports point to their actual frontend/SEO owner. No source/test imports remain under `@/server` or `src/server`. Existing server-only guards still protect frontend environment/SEO/disconnected rendering code; their presence does not imply authoritative backend logic.

Working frontend mechanics and explicit demo fixtures are preserved: CatalogProvider storage/control, catalog/mini filters, detail composition, home discovery, demo cart and disabled checkout. Only type/source import paths and SEO ownership changed; no JSX, styles, fonts, shared component props or visual direction changed. `/preview/components` keeps actual shared implementations. No catalog UI/component/page was deleted.

The Python tree has all requested directories with 15 empty `.gitkeep` files plus `backend/AGENTS.md` and `backend/README.md`. `src/app/api/.gitkeep` remains solely as an optional future thin Next.js transport boundary; it contains no route. The existing empty `src/db/.gitkeep` is documented as retired and cannot host business persistence. Other unrelated placeholders are preserved.

## Architecture/documentation outcomes

- Root/backend instructions define the Next.js presentation and FastAPI authoritative boundary, seven domain owners, HTTP/generated OpenAPI integration, Python testing, transactions, migrations, authorization, audit, privacy, idempotency and durable workers.
- Overview/modules/workflow/README preserve detailed business and operational requirements while replacing obsolete TypeScript placement, local frontend-to-domain calls, Next.js webhooks and single-application deployment assumptions.
- ADR-0001/0002 original bodies are retained, with explicit dated supersession notices. Their seven-domain/consistency/security/frontend principles survive. The module ownership table and approved product decisions remain unchanged.
- New integration document specifies versioned REST/OpenAPI, generated TypeScript, proposed session topology, server/browser/BFF responsibilities, errors/correlation, uploads, Stripe and workers. Concrete auth library, generator, database driver, job executor and hosting selections are honestly pending.
- Recommendations prioritize authentication, generated client, PostgreSQL sessions, local domain transactions, durable outbox/jobs, deployment/local development and operational acceptance.
- Frontend registries, catalog preview contract and SEO instructions identify retained owners and missing integration. Historical QA/logs/planning evidence remain historical and were not rewritten.

## Verification

| Check | Result |
| --- | --- |
| `node --test tests/catalog-contract.test.mjs tests/demo-cart.test.mjs tests/product-indexability.test.mjs` | PASS, 4 tests. Node emitted its existing module-type warning for direct TypeScript imports; no package/module setting changed. |
| `pnpm build`, `TEST_PREVIEW=false`, `LMS_BUILD_DIR=.next-land03-python-real`, `SITE_URL=https://academy.example.test` | PASS, including framework TypeScript check. Expected `catalog.read.unavailable` structured diagnostics were emitted. The origin is reserved test data, not an approved production domain. |
| `pnpm build`, `TEST_PREVIEW=true`, `LMS_BUILD_DIR=.next-land03-python-preview`, same test origin | PASS, including framework TypeScript check. |
| `pnpm exec next typegen` then `pnpm exec tsc --noEmit`, preview build environment | PASS. Build-only tsconfig changes subsequently removed. |
| `pnpm lint` | FAIL: scanned pre-existing generated `.next-merge-check` and `.next-ui-refinement` output (628 errors / 9,835 warnings). This is generated-output contamination, not proof of source lint failures. |
| `pnpm lint --ignore-pattern '.next-merge-check/**'` | Still failed on generated `.next-ui-refinement` output; no generated files were edited. |
| `pnpm lint --ignore-pattern '.next*/**'` | PASS. Existing project ignore behavior retained; all generated Next output excluded for this verification command only. |
| Static build artifact audit | PASS: 12 static pages across both modes; canonicals, robots, preview-control gating, JSON-LD and sitemap/robots files. [Machine-readable results](evidence/python-backend-migration-2026-11-03/static-seo-results.json). |
| Source/structure/history audit and `git diff --check` | PASS; no backend Python code/dependencies, retired imports absent, requested leaf directories retained, ownership/product rules preserved. |
| Backend pytest/Ruff/type/database tests | Not applicable: backend runtime/tool configuration intentionally does not exist. No backend implementation claimed. |
| Live browser/SEO/recovery/shared-consumer suites and screenshots | BLOCKED: automatic approval review rejected `pnpm exec next start` for the isolated artifact, including a localhost-only attempt, with only “blocked by policy.” No workaround server was started. |

Static SEO evidence confirms: normal-mode canonicals for the three discovery routes; cart/checkout/component-preview noindex; preview noindex with no canonicals/schema and an empty sitemap; normal sitemap contains exactly the three static public URLs and no products; homepage emits only existing brand schema; normal homepage retains helpful unavailable catalog content. Catalog route bodies use their existing client/Suspense composition, so static artifacts do not establish hydrated state behavior. Dynamic detail responses, Twitterbot/live headers, focus/storage behavior and 1440×900 / 390×844 screenshots were not newly verified. No visual approval is claimed.

## Remaining work

Python initialization, authentication/session decision, real Catalog publication/readiness/persistence and API integration, generated contracts, Commerce pricing/payment/enrollment, worker runtime and production operations are missing implementation. The existing frontend reports unavailable until that integration exists; it does not hide the dependency with fixtures. Product-policy gaps, legal/content approvals, actual production origin and deployment/crawler verification remain unchanged. Preserve `TEST_PREVIEW=true` as the sole demo switch and rebuild on mode changes.
