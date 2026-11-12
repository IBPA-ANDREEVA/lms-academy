# Identity routes and function ownership

Updated 2026-11-12. This is the current development implementation, not production
approval. All URLs below are relative to `/api/v1/auth`. `app/main.py` creates
FastAPI and the database lifespan; `app/api/router.py` mounts the Identity router
under `/api/v1`. Synchronous handlers use the existing synchronous unit of work.
UI integration is described below. No schema migration is included.

## Route map

| Method / route | Handler in `identity/router.py` | Operation / persistence owner | Transaction |
| --- | --- | --- | --- |
| GET `/ping` | `ping` | Static router health message | None |
| POST `/register` | `register` | `registrations.register_student`: normalized email lookup, student/profile/credential creation, verification token | Service owns existing unit of work |
| POST `/verify-email` | `verify_email_route` | `verfication.verify_email` → `tokens.consume_action_token`, `repository.get_user_by_id` | Handler |
| POST `/resend_verify_email` | `resend_verification_route` | `verfication.resend_verification`: lookup, cooldown, revoke/replace verification token | Handler |
| POST `/login` | `login` | `authentication.authenticate_user` → repository/password verification; `sessions.create_auth_session`; handler sets cookie | Handler |
| POST `/logout` | `logout` | `sessions.revoke_auth_session` by cookie digest; handler clears cookie | Handler |
| GET `/me` | `get_me` | `dependencies.get_current_user` → `sessions.authenticate_session`; handler projects profile | Dependency rechecks session/account and projects profile in one transaction |
| GET `/sessions` | `list_sessions_route` | `sessions.list_auth_sessions` → `require_session_owner`, `repository.get_active_sessions` | Handler; actor rechecked inside transaction |
| DELETE `/sessions/{id}` | `revoke_session_route` | `sessions.revoke_owned_auth_session` → `require_session_owner`, `repository.revoke_owned_session` | Handler; owner-scoped update |
| POST `/password/forgot` | `forgot_password_route` | `resets.request_password_reset` → user/credential lookup, replacement reset token | Handler |
| POST `/password/reset` | `reset_password_route` | `resets.reset_password` → owner lookup/lock, consume token, hash password, revoke sessions/reset tokens | Handler; one atomic transaction |

The existing misspelled `verfication.py`, resend URL and operation IDs are retained
for compatibility. The frontend now uses the implemented underscore URL; no compatibility alias was added.

## Function boundaries

- `router.py`: HTTP status/error mapping, safe response construction and cookie
  transport. All Identity routes use `http.IdentityRoute` to sanitize failures without echoing secrets; explicit errors use the same Russian envelope.
- `dependencies.get_current_user`: extract the cookie, recheck current session ownership, and return a safe profile DTO for `/me` within one transaction. `sessions.authenticate_session`: check digest, absolute and
  inactivity deadlines, revocation and current blocked status. Neither refreshes
  inactivity on polling. `require_session_owner`: lock the account and recheck the
  session inside new protected operations, including after waiting for recovery.
- `schemas.py`: Pydantic bodies and explicit projections; no ORM/secret dump.
- `services/authentication.py`: credential verification and blocked-account check.
- `services/registrations.py`: existing registration workflow; do not move its
  transaction boundary incidentally while extending another operation.
- `services/sessions.py`: session issuance, authentication and owned session use
  cases. Existing issuance/revocation SQL stays here; new list/owned-write queries
  use the existing repository. No per-table repository classes are needed.
- `services/resets.py`: eligibility, replacement, token consumption and atomic
  credential/session changes. Administrator memberships use manual recovery.
- `services/repository.py`: private Identity queries, row locks and writes, never
  commits. `get_user_by_email`/`get_user_by_id` lock the account;
  `get_reset_token_owner` locates an owner without locking the token first;
  `get_token_by_digest` locks the purpose-bound token. Account-before-token lock
  order serializes replacement, reset and login. The user-by-ID lock refreshes
  an already-loaded ORM instance after waiting.
- `services/passwords.py`: existing pwdlib Argon2 hashing/verification adapter.
- `services/tokens.py`: random secret generation, SHA-256 digests, purpose-bound
  issuance, consumption and revocation. Recovery uses the random/digest and
  consumption helpers but stores its token without the legacy debug print.
- `constants.py`: purposes/lifetimes. Password reset is 30 minutes per PD-014.
  Email verification is 48 hours per PD-014; it records `email_verified_at`, rejects blocked/admin accounts, and locks account before token like resend/recovery.
- `models.py` / `auth_models.py`: owned storage mappings, no new schema.
- `http.py`: new endpoint error envelope, privacy-safe failure diagnostics,
  non-cacheable responses and same-origin browser mutation protection.
  `record_identity_change` logs safe actor/action/resource/time/outcome diagnostics
  after successful recovery/revocation transactions commit.
- `export_openapi.py`: deterministic schema export; no lifespan/DB connection.

## New API contracts

`GET /sessions` requires the existing `lms-session` cookie. It returns
`{sessions: [{id, created_at, last_interaction_at, absolute_expires_at, is_current}],
next_cursor}`. Only owned, nonrevoked, unexpired sessions are listed. `limit` is
1–100 (default 50); pass `next_cursor` as `after` for the next page. Ordering is
ascending UUID. Reads do not extend inactivity. No device/IP/user-agent metadata
exists in the current schema; do not invent device labels.

`DELETE /sessions/{id}` requires the cookie and an `Origin` exactly matching operator-configured `IDENTITY_PUBLIC_ORIGIN` (or request scheme/authority when unset). Login and logout use the same protection. Cross-origin and missing origins return 403. Next.js rewrites preserve the browser Origin; configure the exact public origin, including port and without trailing slash, on FastAPI. Never trust browser-supplied forwarded headers. Ownership
is enforced in the service; missing and foreign IDs both return 404. Revoking an
already-revoked owned session is idempotent while the caller remains authenticated.
Revoking the current session takes effect immediately; its stale cookie confers no
access. No session rows are deleted.

`POST /password/forgot` accepts `{email}`. Eligible existing accounts get one new
30-minute reset token while earlier unused reset tokens are revoked. Unknown,
blocked, administrator and credential-less accounts get the identical 200 body.
This is response-body resistance, not a claim of timing/rate-limit protection.
**Email sending is TODO**: no raw token is returned/logged and no email is actually
sent. The flow cannot be completed by an end user until delivery is implemented.

`POST /password/reset` accepts `{token, password}` (8–255 characters, matching
registration). It rejects expired, consumed, revoked, wrong-purpose and unknown
tokens with one 400 response. Administrator/blocked accounts cannot use this
self-service operation. Password change, timestamp update, token consumption,
all-session revocation and other-reset-token revocation commit together. Failures
roll back all changes. Recovery does not activate/verify the account, link purchases
or log the user in. Concurrent consumption permits one success only.

New error bodies are `{detail: {code, message, correlation_id}}`, with Russian-first
messages and separate privacy-safe diagnostics. Responses use `Cache-Control:
no-store`. Success bodies retain `{message}`; legacy errors now use the documented envelope. All Identity validation
failures now use the sanitized 422 envelope, including registration and login. Cookie DELETE, login and logout use same-origin protection; the reset secret itself authorizes recovery, independent
of browser session cookies.

## Formatting and contracts

Use two spaces, no tabs. Identity and its tests have scoped Ruff configurations;
unrelated legacy modules and immutable migrations retain their formatting.

From the repository root:

```sh
(cd backend && uv run python -m app.modules.identity.export_openapi)
pnpm exec openapi-typescript backend/openapi/identity.json -o src/lib/api/generated/schema.d.ts
```

The committed OpenAPI artifact includes the app's existing health/Identity routes.
The registration client in `src/features/identity/api.ts` derives its request
and base response types from the generated schemas. Review old path/method/schema/operation-ID compatibility
on export. New cookie operations declare the API-key cookie security scheme.

## Remaining development limitations

Existing production cookie FIX and verification-token debug print remain deliberately
unchanged at the owner's request to preserve explicit TODOs. They are production
blockers. Durable email delivery/audit, abuse controls, qualifying-interaction
refresh and manual administrator setup/recovery remain unfinished. Recovery and
resend responses/UI explicitly disclose that no email is sent. Failure/change logs
are diagnostics, not durable sensitive-action audit evidence. This is not launch-ready.

## Frontend integration · 2026-11-12

The existing same-origin Next.js rewrite forwards requests to FastAPI; no duplicate
auth authority or database access was introduced. `IdentityProvider` reads `/me` on
mount/focus/visibility and after mutations, never refreshes session activity, and
keeps only safe profile data in memory. AuthModal (header, checkout, component
preview) connects login, registration, recovery request, resend, account, owned
session pagination/revocation and logout. `/login`, `/register`, `/forgot-password`,
`/verify-email`, `/reset-password` reuse feature-owned forms. `/login` shows account
controls after sign-in; the unresolved protected workspace namespace is not selected.

Email-link proposal: `/verify-email#token=…` and `/reset-password#token=…` keep secrets
out of HTTP GETs. The client captures the fragment after hydration and immediately
removes it from history. Tokens remain only in component memory; explicit button
submission performs the POST. Reload after capture requires reopening the original
link. Query-string tokens are not supported. Delivery must adopt this contract when
implemented. Pages are noindex/nofollow, no-referrer, without canonical or sitemap
entries. Authentication never claims paid access or activates course timers.

Generated contracts: export OpenAPI, run `openapi-typescript`, then
`node scripts/generate-identity-constraints.mjs` at the root. The generated numeric
constraints drive client validation (names 2–100, registration/reset passwords
8–255); login retains its existing 8–1024 request limit. The owner's pre-existing
8-character frontend correction is preserved. Python remains authoritative.

Compatibility: route names/methods/operation IDs are retained, including legacy
spellings. `/me` adds nullable `email_verified_at`; expired sessions now return 401
instead of 400. Resend cooldown uses 429 instead of 400. Legacy errors adopt the
structured envelope and all failures are non-cacheable. New origin enforcement on
login/logout requires browser origin configuration; non-browser callers must send
that exact Origin. Deploy these coordinated development consumers together.

[Route audit, references and verification](../qa/auth-audit-2026-11-12.md).

## PR 25 review corrections · 2026-11-11

Registration names are limited to 100 characters to match the persisted profile
columns. No migration is needed. The registration modal explicitly states that
verification email is not sent in this test version; email delivery remains missing.
