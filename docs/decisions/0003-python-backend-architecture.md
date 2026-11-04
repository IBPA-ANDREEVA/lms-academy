# ADR-0003: Python backend with an independent Next.js frontend

- Status: Accepted architecture; implementation not started
- Date: 2026-11-03
- Authority: explicit owner request, “LMS Academy: Python Backend Architecture Migration”, in this repository session. No external approval URL supplied.
- Supersedes: ADR-0001/0002 runtime, backend code placement and direct frontend-to-domain-call provisions only. Their original decision bodies remain historical.

## Context and decision

The public Next.js frontend exists, with explicit browser-local previews. The partial TypeScript Catalog boundary consisted of read types, pure visibility/purchase checks and a disconnected adapter; it had no database or real catalog service. No other authoritative business backend was implemented. Moving the planned backend now does not require migrating production records.

Keep one repository. Keep Next.js 16, React, TypeScript, Tailwind and pnpm for presentation. Put authoritative backend logic in one Python FastAPI modular monolith under `backend/app/modules`, preserving Identity, Catalog, Commerce, Learning, Assignments, Certificates and Notifications. Independently deploy frontend and backend; API replicas and separate workers do not make the seven modules microservices.

Use Pydantic v2 for untrusted API input and response contracts, SQLAlchemy 2 for persistence, Alembic for schema revisions, PostgreSQL as primary database, and Neon as intended hosting. Use uv, pytest, Ruff and a suitable static checker; mypy is recommended pending initialization. Exact package/Python versions, driver and sync/async strategy are not selected here. No runtime initialization or dependencies are delivered by this ADR.

FastAPI fits the owner's Python direction with typed validation and OpenAPI support. Keeping Next.js preserves existing UI, rendering, SEO and interaction investment. The modular monolith preserves local transactions and the seven established owners without independently operating seven services. HTTP/JSON REST provides an explicit boundary between languages and separately deployable runtimes. [FastAPI's documented features](https://fastapi.tiangolo.com/features/) support these framework capabilities; this is not a performance or delivery-time guarantee.

## Preserved and superseded provisions

| Earlier decision | Preserved | Superseded |
| --- | --- | --- |
| ADR-0001 | Seven domains, one owner per record, narrow local domain interfaces, explicit transactions, durable effects, authorization/audit/idempotency, no premature microservices | All business logic in one Next.js application, TypeScript backend interfaces, single application release unit |
| ADR-0002 | Existing frontend feature/page/section/component ownership, generic UI rules, server authority, seven-domain responsibility matrix, PD-011 and unresolved ownership preparations | `src/server/<domain>`, `src/db` business persistence, direct Server Component/action calls to TypeScript domains |

Next.js Server Components consume FastAPI HTTP contracts and map safe data to UI. Optional actions/Route Handlers are transport/session forwarding or presentation composition only. No authoritative tables, prices, eligibility, access, auth authority, Stripe webhook handling or job execution moves into Next.js. Backend endpoints delegate to domain operations. Cross-domain operations inside Python stay local and use documented interfaces with explicit transactions; they do not use internal HTTP calls.

PD-001–PD-012 and the complete module mapping remain unchanged, including Commerce attribution, Learning enrollment conversations, Assignments homework assets and existing definition ownership, Catalog course-media references, and manual certificate issuance. SALE002 and SITE009/WORK001 still own unresolved publication/definition preparation. No open business policy is settled here.

## Contracts and deployment

Use versioned REST under `/api/v1` (an API convention, not approval of any public page URL). FastAPI OpenAPI is the transport source of truth; generate TypeScript types/client when integration begins. Keep stable operation IDs, review schema diffs, test compatibility and allow overlapping frontend/API deployments. Do not manually maintain a second API model in TypeScript. Existing catalog view types are temporary presentation/preview compatibility only. See [integration contract](../architecture/frontend-backend-integration.md).

Deploy Next.js and Python API independently; run durable Python workers separately and preserve the approved separate VPS/VM FFmpeg runtime/private R2 encrypted HLS. Use one controlled Alembic migration step and compatible API/worker schema versions. The frontend gets no database credentials. Database hosting readiness, application hosts, auth/session topology, job executor, backups, recovery objectives and monitoring still need implementation decisions/evidence. Stripe remains Commerce-owned under PD-002; no subscriptions are introduced.

Benefits: explicit backend ownership, Python tooling, reusable backend enforcement for UI/webhooks/jobs, generated language boundary, independently scalable frontend/API processes. Costs: two toolchains and deployments, network failures/latency, session/CSRF/CORS design, schema generation and compatibility checks, distributed tracing and operational coordination. Same-repository changes do not imply simultaneous rollout or atomic HTTP/database transactions.

## Migration strategy and evidence

1. Inspect current source/imports and preserve frontend behavior and product documentation.
2. Remove `src/server/catalog` and its retired policy tests. Retain existing disconnected frontend handling and type-only view data under the Catalog feature; preserve defensive SEO exclusion under SEO ownership. Neither is a mock API or Python implementation.
3. Keep `TEST_PREVIEW=true` as the only demo switch; false/missing stays unavailable, never fixture fallback. Keep empty and unavailable distinct. No endpoints, clients, Python functions, models, migrations or jobs are added.
4. Add instructions and empty backend directories, update active architecture references, and preserve ADR/history/evidence.
5. In separate implementation tasks initialize tooling, settle the needed technical contracts, implement one backend capability, generate contracts and integrate existing frontend owners. Retire temporary view transport assumptions only with verified replacement; test both preview modes and SEO.

The [migration verification note](../qa/python-backend-migration-2026-11-03.md) inventories actual files, consumers and checks. Existing release milestones and completed Vault records are not rewritten; extra work must be reforecast explicitly in the relevant future planning task.

## Remaining technical decisions

Authentication library/provider and cookie/session topology; OpenAPI generator and artifact location/versioning; Python/dependency pins; sync/async database driver and pool sizing; durable-job executor/outbox schema; API/worker hosting and ingress; observability/secrets/recovery. Resolve them just before their dependent implementation, following [recommendations](../architecture/python-backend-recommendations.md). They are not unresolved product-policy answers or permission to initialize those systems in this task.
