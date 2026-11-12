# Python backend agent instructions

Applies to every file under `backend/`, together with root `AGENTS.md`. Root product safety, approved decisions, release boundaries and planning rules remain binding. This file specializes Python work; it does not authorize implementation during an architecture-only task. Frontend rules apply to frontend changes in the same slice. Read [ADR-0003](../docs/decisions/0003-python-backend-architecture.md), [modules](../docs/architecture/modules.md), [integration](../docs/architecture/frontend-backend-integration.md) and the relevant product decisions in full before affected work.

## Current status and scope

The 2026-11-06 schema foundation extends BASE02-B with 28 explicitly registered domain tables, reviewed revisions through `20261106_02`, bounded synchronous application units of work, generated DBML/Graphviz, schema drift checks and isolated PostgreSQL verification. Identity now has partial FastAPI routes and focused services; other feature APIs and workers remain absent. See `docs/architecture/identity-routes.md` for the current route/function map and remaining release gaps. Follow [the schema contract](../docs/architecture/database/schema-contract.md) and [database runbook](../docs/architecture/database-migrations.md); preserve the applied baseline and successors. Tables do not establish working product functionality. Four later/optional proposal tables remain deferred.


Use one FastAPI modular monolith with seven domains under `app/modules`: identity, catalog, commerce, learning, assignments, certificates, notifications. Preserve the ownership/dependency matrix. No eighth business domain, generic service per table or domain microservices. `app/api`, `core`, `db` and `jobs` are technical composition/plumbing. Next.js cannot query authoritative tables or implement a competing policy/auth/payment layer.

## Python conventions and dependency direction

- Use uv and the existing Python 3.12 selection/`uv.lock`. Ruff, pytest and strict mypy are configured. Read installed-version documentation before adopting APIs.
- Use **2 spaces per indentation level, never tabs**, for new backend code and edited route/service modules. Identity enforces this with its scoped `ruff.toml`; extend the formatter scope when adopting other modules. Preserve applied migrations and unrelated legacy formatting.
- Identity uses `router.py` for HTTP mapping, `dependencies.py` for request authentication, `schemas.py` for safe contracts, and focused `services/{authentication,registrations,sessions,resets,tokens,passwords,repository,verfication}.py` files. Keep the existing `verfication.py` spelling until an explicit rename. Operations receive the caller-owned SQLAlchemy session and never commit; registration retains its existing database-owned transaction. New protected operations recheck ownership/current account/session state inside their transaction.
- Preserve existing route behavior unless fixing a demonstrated error. Keep existing production FIX/TODO items during bounded feature work; add an explicit email-delivery TODO for recovery, never imply that a token has actually been emailed.
- Use normal Python naming, explicit imports and type annotations on public functions, inputs and results. Prefer small functions and concrete types. Document meaningful invariants and non-obvious failure behavior. Avoid unbounded `Any`, silent type ignores and generic frameworks without demonstrated consumers.
- Keep pure policies independent of FastAPI, SQLAlchemy and provider SDKs where practical. Inject clocks and external effects when needed for deterministic tests. Do not access environment or connect to services as a side effect of importing domain rules.
- Routes depend on operations; operations use policies and owned persistence/provider adapters. Other domains depend only on documented public commands/queries and safe contracts. Never import another domain's ORM model, session store, private persistence or provider adapter, or write its tables.
- Use `router.py`, `schemas.py`, `models.py`, `service.py`, `policies.py`, and optional focused persistence/public-interface files only when needed; see README. Split by real responsibilities, not a mandatory layering template.
- Keep money in integer minor units plus currency, aware UTC timestamps for instants, and explicit timezone/calendar semantics for policies. Do not resolve OQ-049 with a convenient date library default.

## HTTP and validation

- FastAPI is the authoritative HTTP boundary; mount versioned domain routers through `app/api`. Keep route functions thin: receive/validate, establish actor context, call operation, map outcome. Jobs and webhooks call the same domain operations.
- Validate all untrusted API inputs with Pydantic v2, including path/query/body and relevant headers. Bound lengths/counts and reject inappropriate fields; perform state/business validation in the owning operation. Validate external/job payloads too. Transport validation never substitutes for authorization.
- Use explicit response schemas and safe DTOs; do not serialize ORM objects, credential hashes, private storage keys or provider objects by default. Map validation failures to the shared sanitized error envelope rather than returning submitted secrets.
- Keep stable operation IDs and deterministic OpenAPI export. Generated TypeScript contracts are derived artifacts; never manually duplicate API schemas in frontend code. Review compatibility and client-generation diffs with API changes.

## Identity, authorization and integrations

- Read [SECURITY.md](../SECURITY.md) for the shared security boundary and unresolved-decision references; the detailed backend rules below remain applicable.
- Identity establishes trusted actors/sessions; each protected resource/operation enforces deny-by-default capability and relationship checks, including direct API, job and admin paths. UI, proxy, CORS and route dependency checks alone are insufficient.
- Never trust browser roles, user/owner IDs, amounts, completion, entitlements or payment state. Treat IDs as references requiring authorization. PD-013 restores manager membership alongside student/trainer/admin; preserve independent PD-011 capabilities/attribution. PD-014 and the [matrix](../docs/product/permission-matrix.md) govern selected permissions; final resource/Conditional checks and conflicts remain OQ-095/OQ-096.
- Read the [identity/access policy](../docs/architecture/identity-access-policy.md) before identity work. PD-014 fixes verification, recovery, manual admin management and session lifecycles; technical mechanisms remain unselected. PD-013 governs first-opening enrollment activation, access periods, refunds and preservation. Do not implement superseded acknowledgment/three-month-for-all/unattended-refund assumptions.
- Authentication provider/session implementation is undecided. Follow the documented proposed cookie/session boundary only after its technical decision; no custom cryptography or duplicate Next.js session authority. Apply CSRF/origin defenses to cookie-authenticated mutations and explicit CORS allowlists if cross-origin access is chosen.
- Commerce owns Stripe verification, idempotency and fulfillment/refunds. Verify raw webhook payload signatures before domain handling. Return URLs do not prove payment; uncertain results require reconciliation, not blind retries. Keep external I/O outside long database transactions.
- Catalog owns course-video versions/publication, Learning playback authorization, Assignments homework assets. Grant narrowly scoped direct-to-private-R2 uploads after authorization; verify actual size/type/ownership and processing before finalization. Preserve PD-003/005 limits, original recovery, encrypted HLS and protected keys/segments. Only admins publish.

## SQLAlchemy and transactions

- PostgreSQL is authoritative; Neon is intended hosting, not a browser database API. Only backend processes hold database credentials. `app/db` owns engine/session/transaction plumbing; mappings and writes have one module owner.
- Use SQLAlchemy 2 APIs. Choose sync/async and driver deliberately during initialization; never block an async route/event loop with synchronous database/provider work. Do not share a mutable Session/AsyncSession across concurrent threads/tasks. Scope one to the request/job unit of work and close reliably.
- A workflow owner starts/commits/rolls back the transaction. Participating domain commands use that explicit transaction context and must not independently commit. Flush is not permission to commit another owner's work. Avoid hidden commits in helpers and response serialization after session closure that triggers lazy database access.
- Put invariants in unique/foreign-key/check constraints as appropriate. Use conditional updates, version checks or locks for competing transitions; define conflict behavior. Do not use a process-local lock as database concurrency protection.
- Commit payment/order/enrollment changes and their durable facts atomically; refund confirmation/access revocation likewise. Cross-domain commands remain local Python calls. An outbox cannot replace atomic authoritative state changes.
- Do not cascade-delete retained financial, learning, review or certificate evidence. Honor legal/review holds, approved retention and deletion-restoration safeguards.

## Alembic and database tests

- Alembic owns schema history under `alembic/versions`. Autogeneration is a draft: review constraints, data conversions, defaults, indexes, locks and accidental drops. Never rewrite an applied revision.
- Coordinate a coherent migration head and apply once per release, independently from API/worker startup. Use least-privilege runtime credentials and separate migration credentials. Document compatibility window, backfill and rollback/forward-repair behavior; do not promise a safe downgrade that would lose data.
- Test new revisions against isolated PostgreSQL from empty schema and a supported prior revision with synthetic data. Verify rollback, constraints, duplicate delivery and concurrent sessions. SQLite or mocked repositories alone cannot establish PostgreSQL correctness. Tests must never target production; fail closed if the test database cannot be identified as isolated.

## Errors, logs, audit and privacy

- Follow PD-001: useful nontechnical Russian-first feedback plus a separate structured diagnostic. Use stable error codes/correlation IDs; sanitize unexpected failures and validation echoes. Log module/operation, time, safe resource references, known outcome, retry/attempt and root-cause context where safe.
- Propagate correlation through HTTP, provider events, outbox and jobs; validate or replace externally supplied IDs. Do not log raw request bodies, credentials, cookies, tokens, signed URLs, financial payloads or student media/contact data.
- Domain owners define audit semantics. Sensitive actions require server authorization and explicit intent/confirmation evidence, with actor/action/resource/time/outcome. Committed state changes and required audit facts must not diverge; denied/failed attempts need safe diagnostics without falsely recording success.
- PD-007 applies: routine technical/admin logs and restricted encrypted backups 30 days; permanent certificate verification evidence; critical legal periods and exceptions remain pending. Do not turn nominal expiry into unconditional deletion. Recovery must preserve deletion restrictions.

## Idempotency and reliable background work

- Scope idempotency to actor/operation and bind it to the request content. Reject conflicting reuse; enforce uniqueness transactionally and return the recorded result on replay. Define retention before cleanup. Provider event IDs, order-line enrollments, refunds, issuance and delivery jobs need their own durable duplicate protection.
- Use separate Python workers with durable jobs for retryable obligations. FastAPI in-process background tasks are not sufficient for fulfillment, reminders, media or durable notifications. The executor/broker remains undecided; a PostgreSQL transactional outbox is the proposed baseline.
- Specify durable claim/lease, retry/backoff, crash recovery, dead-letter/manual recovery and observability before shipping jobs. Assume at-least-once delivery; handlers must tolerate duplicates and stale input. A worker rechecks current authorization/state where required and uses least-privilege credentials.
- `app/jobs` owns execution plumbing, not business decisions. Keep handlers with their domains. Separate VPS/VM FFmpeg execution preserves PD-003 (initial concurrency one, three automatic retries, manual recovery); generic worker recommendations do not override that policy.

## Tests and definition of done

- For affected Identity flows, test registration privilege injection, verification/recovery tokens used for the wrong user or purpose, expired/consumed/revoked token rejection, unauthorized session revocation and role changes, and privileged operations without required reauthentication. Verify recovery invalidates prior sessions and blocking/role revocation removes access immediately, including direct API requests.
- Unit tests cover pure rules, authorization and transitions; integration tests use PostgreSQL for persistence/migrations/concurrency; API tests exercise real validation, schemas, direct unauthorized access, safe errors and contract compatibility. Test invalid/duplicate/out-of-order inputs and rollback, not just happy paths.
- Use synthetic test data. Provider doubles are test-only and cannot count as real integration; include appropriate provider sandbox/signature-contract evidence. Never encode guesses for unresolved product policies; name the blocking OQ.
- Run `uv run ruff check .`, `uv run ruff format --check .`, `uv run mypy` and applicable `uv run pytest` suites from `backend/`. Run `uv run python scripts/verify_postgres.py` with a complete PostgreSQL 18 `POSTGRES_BIN` for isolated migration/recovery verification. The harness mints a loopback cluster and live pid/data-directory proof; arbitrary `TEST_POSTGRES_ADMIN_URL` targets are refused. On the isolated development target run `uv run alembic check` and `uv run python scripts/check_schema.py`. After reviewed schema changes regenerate `scripts/schema_docs.py --render`, review `scripts/check_schema.py --record`, and enforce `scripts/schema_docs.py --check`; update the manifest and fresh QA evidence. Never reset shared databases. Run frontend type/build and affected consumer tests when changing its contract; run integrated end-to-end checks when available.
- Done requires the named requirement, owner/public contract, backend enforcement, transaction/idempotency and failure evidence, migration verification where relevant, actual integration for integrated scope, updated docs/OpenAPI/client artifacts and disclosed remaining blockers. Report exact commands/results and skipped checks. Do not mark an epic complete without scheduled verification. Never commit, merge, deploy or force-push without explicit authorization.
