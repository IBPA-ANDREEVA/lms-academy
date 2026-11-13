# Identity routes and function ownership

Updated 2026-11-13. This is the current development implementation, not production
approval. All URLs below are relative to `/api/v1/auth`. `app/main.py` creates
FastAPI and the database lifespan; `app/api/router.py` mounts the Identity router
under `/api/v1`. Synchronous handlers use the existing synchronous unit of work.
No new UI or schema migration is included.

## Route map

| Method / route | Handler in `identity/router.py` | Operation / persistence owner | Transaction |
| --- | --- | --- | --- |
| GET `/ping` | `ping` | Static router health message | None |
| POST `/register` | `register` | `registrations.register_student`: normalized email lookup, student/profile/credential creation, verification token | Service owns existing unit of work |
| POST `/verify-email` | `verify_email_route` | `verfication.verify_email` → `tokens.consume_action_token`, `repository.get_user_by_id` | Handler |
| POST `/resend_verify_email` | `resend_verification_route` | `verfication.resend_verification`: lookup, cooldown, revoke/replace verification token | Handler |
| POST `/login` | `login` | `authentication.authenticate_user` → repository/password verification; `sessions.create_auth_session`; handler sets cookie | Handler |
| POST `/logout` | `logout` | `sessions.revoke_auth_session` by cookie digest; handler clears cookie | Handler |
| GET `/me` | `get_me` | `dependencies.get_current_user` → `sessions.authenticate_session`; handler projects profile | Dependency authenticates in one unit; handler reads profile in another (existing structure) |
| GET `/sessions` | `list_sessions_route` | `sessions.list_auth_sessions` → `require_session_owner`, `repository.get_active_sessions` | Handler; actor rechecked inside transaction |
| DELETE `/sessions/{id}` | `revoke_session_route` | `sessions.revoke_owned_auth_session` → `require_session_owner`, `repository.revoke_owned_session` | Handler; owner-scoped update |
| POST `/password/forgot` | `forgot_password_route` | `resets.request_password_reset` → user/credential lookup, replacement reset token | Handler |
| POST `/password/reset` | `reset_password_route` | `resets.reset_password` → owner lookup/lock, consume token, hash password, revoke sessions/reset tokens | Handler; one atomic transaction |

The existing misspelled `verfication.py`, resend URL and operation IDs are retained
for compatibility. The frontend's existing `/resend-verification` call does not
match the implemented underscore URL; repairing that consumer is a follow-up,
not a new route alias introduced by this task.

## Function boundaries

- `router.py`: HTTP status/error mapping, safe response construction and cookie
  transport. All Identity routes use `http.IdentityRoute` to sanitize validation and
  unexpected failures without echoing secrets; explicit legacy HTTP errors remain unchanged.
- `dependencies.get_current_user`: extract the cookie and resolve a user for the
  existing `/me` flow. `sessions.authenticate_session`: check digest, absolute and
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
  `get_action_token_owner` locates an owner without locking the token first;
  `get_token_by_digest` locks the purpose-bound token. Account-before-token lock
  order serializes replacement, reset and login. The user-by-ID lock refreshes
  an already-loaded ORM instance after waiting.
- `services/passwords.py`: existing pwdlib Argon2 hashing/verification adapter.
- `services/tokens.py`: random secret generation, SHA-256 digests, purpose-bound
  issuance, consumption and revocation. Recovery uses the random/digest and
  consumption helpers. No raw action token is printed or returned in HTTP responses.
- `constants.py`: purposes/lifetimes. Password reset is 30 minutes per PD-014.
  Verification is 48 hours and sets `email_verified_at` atomically with activation.
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

`DELETE /sessions/{id}` requires the cookie and an `Origin` exactly matching the
request scheme/authority. Cross-origin and missing origins return 403. Deployment
must preserve the public origin through its trusted proxy configuration. Ownership
is enforced in the service; missing and foreign IDs both return 404. Revoking an
already-revoked owned session is idempotent while the caller remains authenticated.
Revoking the current session takes effect immediately; its stale cookie confers no
access. No session rows are deleted.

`POST /password/forgot` accepts `{email}`. Eligible existing accounts get one new
30-minute reset token while earlier unused reset tokens are revoked. Unknown,
blocked, administrator and credential-less accounts get the identical 200 body.
This is response-body resistance, not a claim of timing/rate-limit protection.
Email delivery is attempted synchronously after commit when explicitly enabled.
Provider failure retains the same generic response and emits a sanitized diagnostic.
No raw token is returned/logged. This is not durable delivery or inbox confirmation.

`POST /password/reset` accepts `{token, password}` (8–255 characters, matching
registration). It rejects expired, consumed, revoked, wrong-purpose and unknown
tokens with one 400 response. Administrator/blocked accounts cannot use this
self-service operation. Password change, timestamp update, token consumption,
all-session revocation and other-reset-token revocation commit together. Failures
roll back all changes. Recovery does not activate/verify the account, link purchases
or log the user in. Concurrent consumption permits one success only.

New error bodies are `{detail: {code, message, correlation_id}}`, with Russian-first
messages and separate privacy-safe diagnostics. Responses use `Cache-Control:
no-store`. Explicit HTTP error and success shapes remain unchanged. All Identity validation
failures now use the sanitized 422 envelope, including registration and login. The new cookie DELETE
uses same-origin protection; the reset secret itself authorizes recovery, independent
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

Central legacy error mapping, durable email delivery/audit, abuse controls,
qualifying-interaction refresh and manual
administrator recovery remain unfinished. New route failure logs are not durable
sensitive-action audit evidence. Do not represent this implementation as launch-ready.

## PR 25 review corrections · 2026-11-11

Registration names are limited to 100 characters to match the persisted profile
columns. No migration is needed. The registration modal explicitly states that
verification email is not sent in this test version. That UI copy remains a frontend
integration follow-up now that optional backend delivery exists.

## Email service review · 2026-11-13

Registration, resend and recovery return an internal `(normalized_email, raw_token)`
intent to the route. Ineligible resend/recovery returns `None`; no provider call
occurs. All email calls happen after a successful commit, outside database locks,
in FastAPI's synchronous handler thread pool. The existing Notifications dependency
supplies the public `EmailService`; Identity owns tokens and Notifications owns
rendering/delivery. Verification and recovery lock the user before the token,
matching resend/replacement lock order. Verification refuses non-pending accounts.

`EMAIL_ENABLED` defaults to `false`. Enabling it requires `RESEND_API_KEY`,
`EMAIL_FROM` and `APP_BASE_URL`. Startup validates configuration before creating
the database pool. The URL must be an HTTPS origin, with HTTP permitted only for
loopback development. The Resend client has a 10-second network timeout; there
is no automatic retry of an ambiguous provider outcome. Templates are Russian-first,
HTML-escaped and URL-encoded, with 48-hour verification / 30-minute recovery copy.
The operator-only smoke script requires an explicit `--to`; it is not run by tests.

Registration delivery failure returns a sanitized 503 explaining that the account
exists and a new email can be requested. Resend failure also returns 503; the
existing 60-second cooldown still applies. Recovery failures remain a generic 200
to avoid a new account-existence signal. Provider messages, addresses and tokens
are excluded from diagnostics. Correlation IDs identify delivery failures.

Remaining release work: durable delivery intent/worker/retries and correlated audit,
provider-domain and real inbox verification, abuse/rate limiting, frontend
`/verify-email` and `/reset-password` pages, the existing resend client path mismatch
and stale test-mode registration copy. A crash between commit and send can lose
an email; a new request supersedes its token. This change does not claim otherwise.
No real email was sent during automated verification.
