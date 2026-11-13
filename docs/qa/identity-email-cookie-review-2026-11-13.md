# Identity email and cookie review · 2026-11-13

Scope: review the new Resend integration and uncommitted auth-route delivery work,
repair correctness/security defects, remove the insecure cookie TODO. No schema,
UI, deployment, production database or live mailbox changes.

## Findings corrected

- Startup called `os.environ` as a function. Configuration now uses validated
  lookups, explicit email enablement and a bounded provider timeout, before pool creation.
- Resend/recovery unpacked absent delivery intents. Ineligible requests now skip
  delivery; recovery retains the same generic response even during provider failure.
- Provider calls ran inside transactions. All three routes send after commit;
  a commit failure sends nothing. Registration/resend delivery failures return
  helpful sanitized 503 responses; committed account/token state is retained.
- Delivery interfaces and return annotations disagreed; the smoke script used a
  removed method and a fixed recipient. Interfaces are typed and the script now
  requires an explicit operator-controlled destination.
- Templates misstated reset expiry and used English-first copy. They now use
  Russian text, escaped fragment-token links compatible with the merged frontend, 30-minute reset and 48-hour verification lifetimes.
  Base URLs are validated; trailing slashes and reserved token characters are handled.
- Verification omitted `email_verified_at` and could reactivate blocked accounts.
  Activation rejects blocked/admin users, preserves legacy active-account recovery,
  persists the timestamp atomically and
  uses account-before-token locking shared with resend/reset. Revocation timestamps
  are evaluated per call, and raw-token debug printing is removed.
- Login created a non-Secure cookie and login/logout lacked origin validation.
  Cookies are always Secure/HttpOnly/host-only/SameSite=Lax, with matching deletion
  attributes; login/logout now use the same exact-origin CSRF defense as session DELETE.
- OpenAPI/generated TypeScript document the new delivery error responses. The route
  ownership/configuration guide and backend README now describe actual behavior.

## Verification

Passed from `backend/`:

- `uv run ruff check .`
- `uv run ruff format --check .`
- `uv run mypy`
- `POSTGRES_BIN=/opt/homebrew/opt/postgresql@18/bin uv run python scripts/verify_postgres.py`
  — **203 passed** before upstream reconciliation, including full isolated PostgreSQL migration, schema,
  persistence, recovery, concurrency and transport tests. One existing Starlette
  warning recommends migrating the TestClient transport from httpx to httpx2.

Passed from repository root:

- `pnpm exec openapi-typescript backend/openapi/identity.json -o src/lib/api/generated/schema.d.ts`
  after `uv run python -m app.modules.identity.export_openapi` in `backend/`.
- `pnpm lint`
- `pnpm exec next typegen`
- `pnpm exec tsc --noEmit`
- `pnpm build`
- `git diff --check`

Provider calls used doubles only. New checks cover post-commit token visibility
from a separate database session, rollback without sending, usable emailed tokens,
verification/resend concurrency, provider privacy, generic recovery outcomes,
URL validation/encoding, cookie flags/deletion/revocation and origin rejection.
No schema changes required snapshot or diagram regeneration. Browser/visual tests
were not run: this change contains no UI implementation, and the generated TypeScript
change only adds documented 503 responses. No live provider/inbox test was run.

## Remaining release work

Synchronous delivery is not durable: process death after commit can lose delivery,
and provider timeout can leave an ambiguous outcome. Durable intents/worker retry,
rate limiting, provider/domain validation and audit correlation remain follow-ups.
The latest main already supplies verification/reset pages and the corrected
resend API path; these are preserved, and emails now use their fragment-token
contract. Stale frontend test-mode copy still needs integration work. Cookie security requires
same-origin HTTPS and correctly restricted proxy forwarding. The development-only
database deployment guard is intentionally retained. This review is not approval
for production launch or evidence of actual inbox delivery.

References: [OWASP session management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html),
installed Resend 2.53.2 request/client/send implementation, and the repository's
PD-014 and Identity/access policy.

## Upstream reconciliation

The PR base advanced to `f65a79a` while this branch was under review. Reconciled
PR #26 without replacing its frontend/auth work: preserve configured public origin,
sanitary error envelopes, safe `/me` projections, administrator exclusions and
legacy active-but-unverified account recovery. Consolidate token-owner lookup by
purpose and adapt email links to the frontend's `#token=` contract. The cookie
integration test now uses HTTPS; production Secure cookies are never disabled.

Revalidated combined state: **215 passed, 1 skipped** with the isolated PostgreSQL
harness. The skipped test is the opt-in full browser integration; backend transport
and persistence coverage ran. Ruff, format, strict mypy, OpenAPI/client/constraint
generation, frontend lint, type generation, TypeScript and build also passed.

The combined frontend typecheck initially found a stale duplicate generated file,
`.next/types/routes.d 2.ts`, containing the older route list. Preserved that generated
file in a system temporary directory outside the source tree, then regenerated
route types; TypeScript and the production build passed. No source file was removed.
