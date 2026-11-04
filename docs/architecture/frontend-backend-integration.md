# Frontend/backend integration contract

Authority: [ADR-0003](../decisions/0003-python-backend-architecture.md). This describes future integration, not implemented endpoints, clients or authentication. Product rules and unresolved questions remain in their existing registers.

## Runtime and contract ownership

FastAPI owns the authoritative API. Next.js owns routes, SEO, rendering, presentation and interactions. The Python domain matrix in [modules.md](modules.md) applies behind every API, webhook, job and administration entry. Neither browser nor Next.js may query authoritative business tables. A UI check is never an authorization, price or publication decision.

Use HTTP/JSON REST under `/api/v1`. Resource names, operation IDs, pagination limits, filter vocabulary and concrete endpoints are specified in each feature contract before implementation. Use appropriate HTTP methods/statuses: reads do not mutate; successful lists may be empty; missing resources and unavailable services remain distinct. Use 401 for missing/invalid authentication, 403 or a deliberately documented non-disclosing 404 for resource denials, 409 for state/idempotency conflicts, and 503 for service unavailability. Document validation status consistently (422 recommended). A timeout never proves that a mutation failed to commit.

Represent opaque IDs as strings, instants as UTC ISO 8601, money as integer minor units plus currency, and localized content explicitly. Define field naming once at initialization (snake_case JSON recommended; existing UI names can be mapped). Bound collections and request sizes; design stable pagination with the first real list operation. Return only safe response projections, never raw ORM records or private media keys.

## OpenAPI and generated TypeScript

Pydantic request/response schemas and FastAPI route declarations generate OpenAPI. Export a deterministic artifact without production credentials or network access once the application exists. Include stable operation IDs, errors, security requirements and version information. Review the schema diff alongside backend changes and generate TypeScript types/client from that same artifact; generated files are not hand-edited.

The generator and artifact paths are **not selected or created** in this preparation. Evaluate `@hey-api/openapi-ts` against a small real contract, including nullable/optional fields, enums, discriminated responses, multipart/control requests, errors, cancellation and server/browser usage. [FastAPI documents client generation from OpenAPI](https://fastapi.tiangolo.com/advanced/generate-clients/). Decide generator version and committed-artifact/CI regeneration policy before integration. CI should reject unexplained generation drift and breaking schema changes.

Within v1, preserve meanings and existing consumers. Add optional fields conservatively; required fields, enum additions and status changes can break exhaustive/generated consumers and need review. Breaking changes need a compatible transition or a new major API version with a documented removal window. Backend and frontend may roll out independently; test old/new combinations required by that window. Domain-internal interfaces are Python contracts, not generated HTTP clients.

## Authentication and session boundary

**Recommended topology, pending Identity initialization:** one browser-facing origin routes `/api/v1` to FastAPI at ingress; Identity owns a revocable opaque server session in a Secure, HttpOnly cookie. This avoids inventing a second Next.js auth authority. Cookie name/path/SameSite policy, session store/lifetimes, auth library/provider, reset/verification handling and deployment domain are unresolved technical selections. Do not infer OQ-013/016/032 or account-linking policy from this proposal.

Cookie-authenticated unsafe requests require CSRF protection plus validated Origin/Referer according to the selected design. Session rotation, logout/revocation, account blocking and credential recovery must work across API and SSR requests. Do not store bearer credentials in localStorage. A provider/token design is an alternative only after documenting revocation, storage and trust boundaries. If cross-origin browser API calls are selected, use explicit origin/credential allowlists and test cookie/browser behavior; wildcard credentialed CORS is not acceptable. CORS is not authorization.

Identity validates session credentials and supplies trusted actor identity/capabilities. Resource-owning operations authorize every protected read/write using current relationships and state. Next.js may perform optimistic navigation checks, but direct API requests get the same enforcement. Never forward browser-supplied role or trusted-user headers as authority.

## Next.js server requests, browser requests and optional BFF

- Server Components and metadata loaders call the configured FastAPI service over HTTP, through the future generated contract wrapper. They do not loop through their own Next.js Route Handler or connect to PostgreSQL. Forward only explicitly allowed credentials/correlation headers to a fixed configured backend; never accept an arbitrary backend URL from a request.
- Keep session credentials, internal API origins and diagnostics server-only. Pass only necessary serializable data to Client Components. User-private results must not enter a shared cache. Public caching requires publication/unpublication/price invalidation shared by lists, details, home projections, metadata and sitemap; do not cache a current disconnected outage as a production content strategy.
- Browser interactions use the selected same-origin ingress or an explicitly justified thin BFF. Apply bounded timeouts/cancellation and clear recoverable states. Reads may have bounded retries; writes retry only with a documented idempotency/reconciliation contract. Revalidate UI after confirmed backend commit, not assumed submission success.
- `src/app/api/.gitkeep` is retained solely for a future optional Next.js transport boundary. If needed, Route Handlers/actions may forward allowed requests, translate safe responses, manage agreed cookie transport and compose presentation data. They cannot own sessions, price/refund/access/completion rules, authoritative persistence, Stripe webhooks or durable workers. Avoid a second parallel API surface when ingress forwarding suffices.
- SSR cannot freely set browser cookies while rendering. Login/refresh/logout response-cookie propagation must be designed in the chosen ingress/action/handler flow and tested. Streaming, cache behavior and server/client boundaries follow the installed Next.js docs, not older framework assumptions.

## Error contract and diagnostics

Adopt a consistent JSON error envelope when the API is implemented. Proposed fields are `error.code` (stable machine code), `error.message` (safe localized fallback), `error.correlation_id` (safe support reference), and optional `error.fields` (allowlisted field name/code/message). Never return rejected raw input, stack traces, SQL/provider messages, credentials or personal data. Agree exact schema/status/localization rules in initialization, then generate client types; this prose is not a manually maintained TypeScript contract.

Frontend maps known codes to Russian-first helpful feedback and handles unknown codes with a safe fallback. Distinguish empty data, not found, denied, conflict, unavailable and uncertain mutation outcome. A payment timeout must not tell the user to pay again. Logs carry separate structured diagnostics under PD-001: operation/domain, UTC time, safe resource reference, correlation, known outcome, retry/attempt and root cause where safe. Validate or replace incoming correlation IDs, propagate them through API/outbox/workers/provider events, and exclude secrets and raw bodies. PD-007 retention and access restrictions apply.

## Uploads and private media

The owning backend domain authorizes an upload intent before issuing a short-lived, narrowly scoped direct-to-private-R2 grant. The browser sends media to storage, not through Next.js or FastAPI memory. Resume/multipart mechanism is a technical decision, not implemented here. Bind intent to actor/resource, expected size/type and a server-chosen key; enforce actual object size/type and combined-submission limits on finalization, not just client metadata. Finalization is idempotent, ownership-checked and records pending processing, never immediate publication. Handle expired grants, interrupted parts, stale intents and orphan cleanup with retention/review/legal safeguards.

Assignments owns homework originals/versions/previews under PD-005; Catalog owns course-media references and publishable versions under PD-003/009. Learning authorizes playback/segments/keys through short-lived grants. Downloads need resource authorization. Private keys, permanent media URLs and storage credentials never enter public read models. Separate FFmpeg workers process encrypted adaptive HLS; failed processing preserves originals and prior published versions. No new media domain is introduced.

## Stripe and jobs

Commerce owns Stripe API calls and FastAPI webhook entry points, raw-body signature verification, durable deduplication, authoritative event mapping, fulfillment, refunds and reconciliation. Browser return URLs and forwarded Next.js events cannot authorize fulfillment. The exact event/state contract remains dependent on OQ-031/036/037 and PD-002 launch verification. Accepted events must be durably recorded before success acknowledgment according to Stripe's retry contract; slow work uses a durable backend job, not request-local background execution.

Python domain operations coordinate atomic authoritative writes and outbox facts. Separate Python workers deliver notifications, reminders and external work with durable claim/retry/recovery. `app/jobs` is execution wiring; Notifications owns delivery, Assignments owns review deadlines, Catalog owns publication, Learning owns access. Broker/executor and outbox persistence are pending technical choices; durability, replay safety and observability are required. PD-003 FFmpeg workers remain on a separate VPS/VM with their approved retry/concurrency behavior.

## Current disconnected frontend

`src/features/catalog/catalog-source.ts` retains the pre-existing unavailable result/diagnostic and reserved demo-slug rejection. It makes no HTTP/database call. `catalog-view-types.ts` retains only temporary frontend/preview shapes. It is not the API schema and must not constrain Python's internal models. `src/lib/seo/product-indexability.ts` defensively excludes unsuitable content from metadata/schema/sitemap; it grants no publication/purchase permission. Actual publication, prices and purchases must be implemented in Python.

`TEST_PREVIEW=true` remains the only fixture authorization. False/missing ignores browser demo data and returns unavailable until integration exists. A successful empty catalog must come from a successful real API read later. Existing preview cart/checkout creates no order/payment/enrollment. Do not add a mock backend to conceal the missing service. See [catalog preview contract](catalog-preview-contract.md) and the [migration verification note](../qa/python-backend-migration-2026-11-03.md).
