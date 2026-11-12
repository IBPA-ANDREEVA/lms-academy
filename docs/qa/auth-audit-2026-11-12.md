# Auth implementation audit and integration · 2026-11-12

Scope: inspect every existing Identity endpoint, correct demonstrated defects,
connect missing frontend flows, create bounded visual references, and verify real
integration. No migrations, domain moves, payment/learning features, provider
selection, or production TODO implementation. Existing `verfication.py`, endpoint
spellings and operation IDs remain compatible. The owner's initial uncommitted
8-character frontend password correction is preserved in generated validation.

Authority: SECURITY.md, backend/AGENTS.md, PD-013/014, identity-access-policy.md,
identity-routes.md, ADR-0003, the integration contract, public sitemap, frontend
registries, DESIGN.md and design README/DECISIONS/DIRECTION/SYSTEM/QA. No unresolved
matrix condition, multi-role algorithm, administrator self-service, course timer
or purchase-linking proof was inferred. Existing provider choices and explicit
TODOs remain development-only.

## Every route: before, delivered, remaining

Paths below are relative to `/api/v1/auth`.

| Route | Before audit | Delivered / actual UI | Remaining |
| --- | --- | --- | --- |
| GET `/ping` | Static health message | Inspected; intentionally unchanged. Diagnostic endpoint needs no product UI. | Production exposure/health convention can be reviewed at deployment. |
| POST `/register` | Working student/profile/password/token transaction; only connected frontend form; inconsistent name/password validation | Trim/bound names server-side; generated client constraints; owner’s 8-character minimum preserved; 255-character registration maximum aligned; safe errors/pending/duplicate-submit guard. `/register` and existing modal share RegisterForm. | Verification email delivery, enumeration/timing/rate controls, production hardening. No privileged role assignment accepted. |
| POST `/verify-email` | Single-use token consumption, but 24-hour lifetime, no verified timestamp, and could unblock account; no UI | 48 hours; records `email_verified_at`; rejects blocked/admin self-service; consistent account-before-token locking; single-use/replay tests. Explicit confirmation/result/error/resend UI at `/verify-email`. | Email delivery and durable audit. Existing debug-token TODO retained. |
| POST `/resend_verify_email` | Token replacement/cooldown; frontend called nonexistent `/resend-verification`; no UI | Consumer corrected without alias/rename; legacy active accounts without a verified timestamp can request a replacement. 429 cooldown and safe Russian envelope. Modal/account/page resend form connected. | Delivery; registration/resend abuse and enumeration protections remain unfinished. |
| POST `/login` | Credentials and opaque cookie existed; modal only showed unavailable notice | Same-origin defense including login CSRF; sanitized errors. Actual modal and `/login` submission, disabled/pending/error states, `/me` refresh, account display. | Explicit `secure=False` production TODO remains; abuse/timing controls and deployment cookie policy. Pending account login does not authorize purchased content. |
| POST `/logout` | Cookie/session revocation existed without origin check or UI | Origin check; repeated logout preserves original revocation time; actual logout control and identity refresh. | Durable security audit. |
| GET `/me` | Authenticated in one transaction, projected profile in another; expired session returned 400; no UI | One transaction with locked owner/current-session recheck; safe DTO with nullable verified timestamp; cookie security declared in OpenAPI; uniform 401. Shared in-memory IdentityProvider connects desktop/mobile header, modal, pages and checkout auth. | This is identity, not resource authorization. Exact interaction refresh remains deferred. |
| GET `/sessions` | Owner-only bounded pagination and no polling refresh existed; no UI | Account panel uses actual cursor pages, local dates, current-session marker, loading/empty/error/retry. No invented IP/device labels. | Device metadata/remembered-device UX is optional future scope; schema currently has none. |
| DELETE `/sessions/{id}` | Owner-scoped, idempotent revocation with origin guard existed; no UI | Confirmation explains current/other-session consequences; success/error states and immediate current-session exit. Foreign IDs remain indistinguishable from missing IDs. | Durable audit. |
| POST `/password/forgot` | Safe uniform body, replacement reset token; email intentionally absent; form was placeholder | Real request UI in modal and `/forgot-password`; honest “test version does not send email” copy before/after request. No automatic retry. | Explicit durable delivery TODO, abuse/rate/timing controls; admins remain manual. |
| POST `/password/reset` | Atomic reset, 30-minute single-use token, revocation of all sessions already implemented; no UI | `/reset-password` uses generated constraints, confirmation field, missing/expired/replayed-link errors and success-to-login flow. Real browser reset verified against PostgreSQL. | Delivery prevents ordinary end-user completion until implemented. Manual admin recovery remains separate. |

## Code quality and boundary corrections

- Preserve Python domain ownership and existing service/route layout; no ORM or
  session authority in Next.js. Existing same-origin rewrite forwards HTTP only.
- Reuse `require_session_owner` for `/me`, and the shared APIKeyCookie dependency
  for complete generated authentication documentation.
- Remove the import-time `datetime.now()` default in token revocation. Serialize
  verification using the same user-before-token lock order as resend/recovery.
- Retain two-space Python formatting; strict mypy, Ruff and reviewed generated
  OpenAPI/TypeScript output. Generated numeric limits avoid independently maintained
  frontend schemas. Route methods/names/operation IDs are unchanged.
- All explicit Identity errors use the sanitized Russian `{detail:{code,message,
  correlation_id}}` envelope and no-store headers. Transport failures get a separate
  privacy-safe client diagnostic; raw response messages/secrets are not rendered.
- Frontend requests use same-origin cookies, no-store, cancellation and bounded
  timeouts. Shared Identity-local mutation handling prevents duplicate submits and
  late view changes after unmount; fields/view links disable during pending actions.
- Forms/components remain in `features/identity`; routes compose IdentityPage →
  IdentitySection. Existing Button/FormControls/AuthModal are reused. No generic
  form framework, duplicated design system or new dashboard namespace.

Compatibility changes: `/me` expired-session response is now 401; resend cooldown
is 429; legacy error strings become the documented envelope. `/me` adds a nullable
verification timestamp. Login/logout now require an exact Origin. Configure
`IDENTITY_PUBLIC_ORIGIN=http://localhost:3000` for ordinary local development (or
the exact deployed browser origin); do not trust forwarded browser identity headers.
Deploy the coordinated development consumer/server changes together.

## UI, references and verification scope

[Reference contract and board](../design/auth/REFERENCE.md) derive the new panels
from the website's existing 2026-11-11 auth frame, fields, controls and tokens.
Reference copy/data are illustrative; no photos, credentials, course inventory,
legal text or additional brand identity were invented. The existing brand remains
unchanged. Manrope handles these functional headings/body; existing Unbounded
brand/display usage is preserved elsewhere. Native browser screenshots confirmed
Cyrillic rendering, opaque panels, readable feedback and reachable controls.

New pages: `/login`, `/register`, `/forgot-password`, `/verify-email`,
`/reset-password`. `/login` displays account/session controls after sign-in; it does
not resolve `/account` or role navigation. Header/checkout modals preserve their
caller’s location and cart input. `/preview/components` has an explicit live-API
AuthModal example; it never presents synthetic accounts as real users.

Link contract: `#token=…` is captured after hydration, immediately scrubbed from
history, held only in component memory, and consumed only after explicit POST.
Opening another link while on the same page resets the form, including replay
errors. Query-token transport and arbitrary return URLs are not supported. Reload
requires reopening the original link. The future delivery adapter must adopt the
fragment contract; this work does not claim an email delivery pipeline.

All five routes use Russian metadata, noindex/nofollow, no-referrer, no canonical,
no fabricated JSON-LD and no sitemap entries. Preview/real-mode SEO were checked
separately. A premature old screenshot showed a compositor artifact immediately
after viewport resizing; stable fresh captures and two animation frames plus a
short settling interval verified one actual header and no duplicate UI.

Viewport matrix: 1440×900, 768×900, 390×844, 320×844. Tests check document overflow
and individual text bounds, not just scrollWidth. Long synthetic email, form errors,
missing/expired links, pending/offline/retry/cooldown, session pagination/revocation,
keyboard/focus restoration, disabled social actions, modal scroll lock and reduced
motion are exercised. Focused pages use 540px/650px columns and natural document
scroll; mobile gutters/inner padding preserve readable fields. Human visual approval
is still pending; Chrome viewport emulation is not physical iOS/Safari/Firefox QA.

Representative committed evidence (synthetic isolated accounts only):

- [Verification desktop](evidence/auth-2026-11-12/verification-reference-1440.png)
- [Reset mobile](evidence/auth-2026-11-12/reset-reference-390.png)
- [Account mobile](evidence/auth-2026-11-12/account-unverified-390.png)
- [Login error](evidence/auth-2026-11-12/login-error-390.png)
- [Reset success](evidence/auth-2026-11-12/reset-success-1440.png)
- [Pending](evidence/auth-2026-11-12/login-pending-390.png)
- [Resend cooldown](evidence/auth-2026-11-12/resend-cooldown-390.png)

Additional local captures: `/tmp/lms-auth-qa`, `/tmp/lms-auth-modal`,
`/tmp/lms-auth-states`, `/tmp/lms-auth-shared`, `/tmp/lms-auth-seo`,
`/tmp/lms-auth-seo-preview`. These local paths are not portable PR artifacts.

## Checks actually run

- Frontend: `pnpm lint`, `pnpm exec next typegen`, `pnpm exec tsc --noEmit`.
  An existing duplicate generated `.next/types/routes.d 2.ts` initially broke
  typechecking; it was moved outside the repo, preserving source files. Next's
  isolated-build tsconfig additions are not retained as project changes.
- Production builds: `LMS_BUILD_DIR=.next-auth-qa API_INTERNAL_ORIGIN=http://127.0.0.1:8015 TEST_PREVIEW=false pnpm build` and the analogous `.next-auth-preview` / `TEST_PREVIEW=true` build. Build and start use matching preview values.
- Backend: `uv run ruff check .`, `uv run ruff format --check .`, `uv run mypy`,
  `uv run pytest -q`. Ordinary pytest intentionally skips isolated-PostgreSQL tests.
- Full isolated verification: `TEST_IDENTITY_BROWSER=1 PLAYWRIGHT_MODULE=<installed-playwright> POSTGRES_BIN=/opt/homebrew/opt/postgresql@18/bin uv run python scripts/verify_postgres.py`.
  The optional test owns a newly minted database, FastAPI :8015 and the production
  Next server :3115, then tears down only its processes/database. No shared/Neon
  database, existing user, email or payment is touched. The browser tests real
  registration, invalid/valid login, verification/replay, resend, current/other
  session revocation, logout, forgot/reset and prior-session invalidation; Python
  checks the committed password hash/token/verification state afterwards.
- Browser scripts: `auth-modal.browser.mjs`, `auth-states.browser.mjs`,
  `auth-integration.browser.mjs` (through isolated harness), and
  `public-ui-polish.browser.mjs`. Shared preview/header, catalog/detail/cart/checkout
  smoke checks passed; no browser page errors.
- `catalog-seo.browser.mjs` passed in real and preview modes (17 checks each).
  The first real-mode attempt started with a mismatched runtime preview setting;
  restarting with explicit `TEST_PREVIEW=false` resolved it without product changes.
- `node --test tests/catalog-contract.test.mjs tests/demo-cart.test.mjs tests/product-indexability.test.mjs`: 4 passed.
- Premium strict static audit: zero findings. Generated contracts/constraints were
  regenerated from FastAPI. New/touched form code was formatted; no dependency or
  lockfile changes. Browser-only state tests are clearly separated from real API
  tests; mocked success never counts as backend evidence.

Final backend count: **193 passed** on isolated PostgreSQL including real browser
integration; default pytest: **135 passed, 58 skipped** (intentional isolation/opt-in
gates). The existing FastAPI/Starlette warning recommends a future test-client
HTTPX2 migration; dependencies were not changed just to suppress it. No schema
models or migrations changed, so separate schema-doc regeneration was not needed.
The isolated verifier still exercises the existing migration/schema suite.

A focused real-browser follow-up also verifies authenticated header state on checkout.
The preview-only state test verifies CheckoutBuyer's signed-in trigger/status and
preserves its typed contact email; production correctly keeps its buyer form absent
without a real cart. Neither check establishes purchase ownership. Broader historical
animation/product browser suites were not all rerun; the affected shared public
UI smoke, auth suites, SEO modes and data-contract checks above define this pass.

## Missing work and useful next steps

**Required before production (preserved TODOs / incomplete capabilities):**

1. Durable verification/reset delivery with approved sender/template/domain,
   retry/deduplication, token redaction and the documented link contract. Currently
   tokens are issued but no email is sent; reset tokens are deliberately discarded.
2. Resolve the existing cookie `secure=False` production TODO and the raw verification
   token debug-print TODO. These were explicitly preserved, not judged safe for launch.
   Use HTTPS, confirm proxy/origin configuration and review cookie/deployment scope.
3. Abuse protection: login/register/resend/recovery throttling, uniform failure/timing
   behavior, credential-stuffing monitoring and resend limits. Registration status
   differences and resend cooldown can still disclose account state.
4. Durable security audit/delivery outcomes and operational monitoring. Current
   diagnostics are privacy-safe logs, not durable actor/action/resource evidence.
5. Genuine-interaction inactivity refresh after the event taxonomy is approved
   (OQ-097). Current reads do not refresh; do not keep sessions alive with polling.
6. Manual administrator provisioning/setup/recovery/email-change workflow; recent
   password reauthentication for sensitive actions after scope/window decisions.
7. Resource authorization/verified-email enforcement in future protected APIs,
   multi-role/Conditional predicates and matrix conflicts (OQ-095/096), and secure
   purchase claiming/linking (OQ-032). Account login/session UI does not complete these.

**Useful bounded follow-ups:** password-policy/breached-password review, session
metadata only if justified by privacy requirements, dedicated session-change tests
across actual devices, a reviewed safe-continuation contract for future protected
routes, secret-safe delivery/observability acceptance tests, accessibility/physical
mobile and additional-browser QA. Email-change UI depends on its backend and
reauthentication contract. Social login stays later scope; MFA remains optional,
not an invented MVP requirement. Do not add a role picker or manager dashboard
while role semantics and destination URLs remain open.

Technical cross-checks consulted: [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html),
[OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html),
and [OWASP Forgot Password](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html).
Repository product decisions determine scope; these references do not approve a
provider or change the owner's existing password policy.
