# PR 25 review corrections

Four open review findings are addressed: registration names match varchar(100)
storage, all Identity routes sanitize validation failures, registration success
copy discloses missing test-version email delivery, and the frontend registration
client derives request/response types from generated OpenAPI schemas.

No schema migration, public route, SEO, shared style, permission or visual-direction
change. Existing AuthModal/RegisterForm/FormMessage ownership, props, Russian copy,
typography and layout remain. No new visual reference was supplied or needed for
this bounded factual correction; no human visual approval is claimed.

## Verification

- Backend: Ruff lint and format, strict mypy passed.
- Plain pytest: 135 passed, 45 database-dependent skips; subsequently the isolated
  PostgreSQL 18 harness passed all 180 tests, including 100-character Cyrillic
  names persisted and 101/128-character names rejected before persistence.
- Validation regression tests cover login, registration and recovery secrets;
  responses use sanitized 422 envelopes and no-store headers.
- OpenAPI re-export and TypeScript regeneration completed. Paths, operation IDs
  and success contracts stay unchanged. Registration name maxima tighten to 100;
  legacy validation responses now declare IdentityErrorResponse, with sanitized
  unexpected 500 responses. Frontend type checking passed against the new artifact.
- Frontend: pnpm lint, pnpm exec next typegen, pnpm exec tsc --noEmit and pnpm build
  passed.
- tests/auth-modal.browser.mjs passed against the production build on port 3105.
  Covers keyboard/focus, validation, pending, server failure, successful retry,
  reduced motion and 1440×900, 768×900, 390×844 and 320×844 viewports.
  Registration responses are intercepted test doubles; no email or real account
  is created by the browser test.
- Success text range bounds and document overflow passed at all four widths.
  Inspected desktop/mobile success screenshots: existing composition retained,
  longer copy wraps to two desktop/four mobile lines without horizontal clipping.
  Mobile form remains vertically scrollable.
- Local screenshots: /tmp/lms-pr25-auth/register-success-{1440,768,390,320}.png.
- Premium strict static audit: zero findings; /tmp/lms-pr25-premium-audit.json.
- git diff --check passed.

The test suite emits the existing Starlette/httpx deprecation warning. Email
delivery, legacy verification-token logging and the other documented production
Identity limitations remain follow-up work. No shared database was accessed;
separate shared-target schema checks were not run because schema is unchanged.
