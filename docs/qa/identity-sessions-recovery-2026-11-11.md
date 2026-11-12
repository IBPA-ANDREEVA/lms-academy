# Identity sessions and recovery verification · 2026-11-11

## Scope and ownership

The owner requested inspection, route/function guidance, two-space indentation,
four new Identity endpoints, no new UI, preservation of existing route logic except
errors, retention of production FIX items, email delivery TODO and separate commits.
See [route/function map](../architecture/identity-routes.md) for the implementation
and request/response contracts. All pre-existing workspace changes were preserved
in commit `9e02a23` before implementation, including the owner's UI changes.

New routes are `GET /api/v1/auth/sessions`,
`DELETE /api/v1/auth/sessions/{id}`, `POST /api/v1/auth/password/forgot` and
`POST /api/v1/auth/password/reset`. The missing slash in the supplied DELETE URL
was interpreted as the conventional path parameter boundary. No device metadata
or schema changes were invented. Session timestamps/current-session identity are
returned; names, IP addresses and browser/device labels are not stored.

## Existing errors fixed

- `/me` can return null names when a profile is missing instead of raising an
  AttributeError; covered by a PostgreSQL/API regression test.
- Session authentication rejects blocked users immediately and avoids a null-PK
  database lookup for absent/expired sessions. Existing failure statuses remain.
- User-by-ID locks refresh a cached ORM record after waiting, preventing stale
  account state in new session/recovery operations.
- Two byte-identical migration copies created extra Alembic heads. They were
  renamed to `.py.archive` with no byte changes; canonical revisions remain intact.
  Before this correction, the baseline had two unit failures and the isolated run
  had nine failures/32 setup errors. The final verification passes.

## Verification

From `backend/`:

- `uv run ruff check .` — pass.
- `uv run ruff format --check .` — pass, including two-space Identity/test scopes.
- `uv run mypy` — pass, strict checking.
- `uv run pytest -q` — database-free checks pass; PostgreSQL tests intentionally
  skip without harness-generated credentials.
- `POSTGRES_BIN=/opt/homebrew/opt/postgresql@18/bin uv run python scripts/verify_postgres.py`
  — **182 tests pass** on a fresh, loopback-only PostgreSQL 18.6 cluster. The harness exercises
  migration/schema/recovery checks plus API persistence tests, then tears down its
  owned cluster. No shared or remote database is used.

Coverage includes owned-only pagination/revocation, foreign-resource denial,
current-session invalidation, missing/cross-origin mutation defense, blocked,
revoked, absolute-expired and inactivity-expired sessions, generic recovery
responses, administrator exclusion, 30-minute issuance, replacement revocation,
expired/consumed/revoked/wrong-purpose/unknown tokens, atomic all-session revocation,
foreign-account preservation, concurrent token consumption, failure rollback,
sanitized validation/errors and absent-profile regression.

`httpx` is a development-only dependency for the FastAPI test client. The installed
Starlette emits one deprecation warning recommending `httpx2`; tests still pass.

From the repository root:

- `pnpm lint` — pass.
- `pnpm exec next typegen` — pass.
- `pnpm exec tsc --noEmit` — pass.
- `pnpm build` — pass.
- `pnpm exec openapi-typescript backend/openapi/identity.json -o src/lib/api/generated/schema.d.ts`
  — pass using pinned generator 7.10.1.
- `git diff --check` — pass.

Contract comparison exported the pre-implementation application from commit
`9e02a23` in a temporary directory and compared every existing path operation and
component schema against the new artifact: all eight original paths and all
existing component schemas remain identical. Added paths, schemas and the cookie
security scheme are additive. The new generated TypeScript has no runtime/UI
consumer yet. No browser screenshots or visual approval are applicable.

## Remaining limits

Email sending is explicitly TODO. Raw recovery tokens are neither returned nor
logged; no deliverable recovery email currently exists. Existing cookie production
FIX and verification-token debug output remain unchanged by request. Recovery and
owned revocation emit safe success diagnostics only after commit; these do not
replace a durable audit store. Rate limiting, uniform account timing, production
cookie/CSRF rollout, durable delivery/audit and interaction-based inactivity refresh
remain follow-up work. The existing verification lifetime/timestamp and frontend
resend URL discrepancies are documented in the route map. This verification is
not production acceptance or a completed Identity epic.
