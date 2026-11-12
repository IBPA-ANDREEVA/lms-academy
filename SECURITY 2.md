# LMS security instructions

Read with [AGENTS.md](AGENTS.md) and, for backend work, [backend/AGENTS.md](backend/AGENTS.md). This is a navigation and enforcement guide, not a new product decision or security certification. The [current schema contract](docs/architecture/database/schema-contract.md) distinguishes storage and unfinished Identity work from verified authentication.

## Authority

[PD-013](docs/product/decisions.md#pd-013--base02-a-domain-policy-overrides) and [PD-014](docs/product/decisions.md#pd-014--base03-a-authentication-authorization-and-account-lifecycle), the [identity/access policy](docs/architecture/identity-access-policy.md) and the [permission matrix](docs/product/permission-matrix.md) govern identity and permissions. The matrix links to the authoritative live sheet; its repository snapshot is dated evidence. Preserve Allow/Deny/Conditional/NAN selections, supersession notes and open questions. This guide does not complete Resource Ownership & Security Validation or choose multi-role union, deny precedence or active-role semantics.

## Threat model and trust boundaries

Protect accounts, paid entitlements, private student work/media, financial and certificate evidence, and operational secrets. Consider anonymous abuse, compromised accounts (including privileged accounts), cross-user access, forged/replayed requests, malicious uploads and credential leakage.

- **Browser → Next.js → FastAPI:** browser state and identifiers are untrusted. Next.js renders and forwards only agreed transport data; Identity establishes the actor and Python resource owners enforce policy. Private responses must not enter shared caches. See [ADR-0003](docs/decisions/0003-python-backend-architecture.md) and the [integration contract](docs/architecture/frontend-backend-integration.md).
- **API → domains/database:** entry-point checks and foreign keys do not establish resource permission. Preserve [domain ownership](docs/architecture/modules.md); jobs, webhooks and administrative paths use the same protected operations.
- **Providers/storage/workers → domains:** verify external messages and uploaded objects before authoritative state transitions; signed grants are bounded capabilities, not proof of an entitlement. Retries must preserve audit and replay safety.

## Confirmed requirements and existing engineering constraints

- **Authorization:** enforce every resource permission server-side, deny by default, using current approved capabilities, relationships and state. Role membership alone never proves ownership. Client owner IDs, hidden controls, CORS and an administrator label grant no bypass. Missing Conditional predicates remain unresolved, not unconditional grants.
- **Identity lifecycle:** apply the [identity policy](docs/architecture/identity-access-policy.md#registration-verification-and-email-changes) to registration, verification/resend, recovery, email changes and purchase claiming. Registration must not accept client-assigned privileges or verified status. Preserve manual administrator provisioning/recovery and ownership proof for purchase linking. Enforce approved token lifetimes and single-use requirements; do not substitute a token from another user or purpose.
- **Sessions and privileged changes:** enforce the policy's [session lifecycle](docs/architecture/identity-access-policy.md#session-lifecycle), including authenticated/authorized session revocation, immediate blocking/role revocation and invalidation of prior sessions after recovery. Role assignment/revocation requires its matrix permission and audit. Sensitive administration additionally requires recent password reauthentication, explanatory confirmation and explicit consent under [PD-010](docs/product/decisions.md#pd-010--mvp-administration--operations)/PD-014; confirmation alone is insufficient.
- **Session transport / CSRF:** follow the [integration boundary](docs/architecture/frontend-backend-integration.md#authentication-and-session-boundary): cookie-authenticated unsafe requests require CSRF protection and validated Origin/Referer under the selected design. CORS is not CSRF protection or authorization. Do not put bearer credentials in localStorage or trust forwarded browser identity/role headers. Exact mechanisms remain unselected.
- **Secrets:** keep credentials, tokens, signed URLs and private keys out of Git, client bundles, public DTOs, logs and reports. Use placeholder examples only. Follow the [credential runbook](docs/architecture/database-migrations.md#environment-and-credentials); permanent user passwords never belong in `.env`, and password storage uses hashes under PD-014.
- **Payments:** [Commerce](docs/architecture/frontend-backend-integration.md#stripe-and-jobs) owns Stripe signature verification, deduplication, fulfillment/refunds and reconciliation. Browser amounts, return URLs and timeouts do not prove payment or failure. Preserve [PD-002](docs/product/decisions.md#pd-002--payment-infrastructure), PD-013 refund constraints and [PD-006](docs/product/decisions.md#pd-006--legal-documents--policies) checkout acceptance.
- **Uploads/media:** follow [upload and delivery boundaries](docs/architecture/frontend-backend-integration.md#uploads-and-private-media): authorize grants and downloads, verify actual object size/type/ownership at finalization, keep storage private and processing separate from publication. PD-003/005 protection and recovery remain subject to PD-014 permissions; older administrator-access prose cannot bypass matrix Deny cells.
- **Logs, evidence and migrations:** use privacy-safe diagnostics and sensitive-action audit under [backend rules](backend/AGENTS.md#errors-logs-audit-and-privacy) and PD-001/007/010. Preserve PD-013 history and legal holds. Follow the [migration runbook](docs/architecture/database-migrations.md) for separate runtime/migration credentials, immutable applied revisions and isolated verification; never migrate at API/worker startup. Schema constraints do not replace authorization.

## Recommendations and unresolved decisions

The integration contract's same-origin ingress and revocable opaque Secure/HttpOnly cookie session are **recommendations**, not approved implementation choices. Before implementing affected flows, document the selected auth library, hashing parameters, token issuance/storage/replacement, session rotation/invalidation, cookie/CSRF design and manual provisioning procedure. Existing code or storage does not itself approve those choices.

**Recommended threat-driven work:** evaluate enumeration-resistant responses and abuse limits for registration, login, verification/resend and recovery. Exact controls, thresholds and delivery mechanisms remain technical decisions; this guide selects no provider or algorithm.

Keep product approvals in the [existing question register](docs/product/open-questions.md):

- OQ-013/014/095/096: role combinations, ownership/Conditional predicates and matrix/workflow conflicts.
- OQ-016/032/097: residual blocked-user actions, purchase-claim proof, recent-reauthentication scope/window and qualifying session activity.
- OQ-048/049: post-expiry work transitions and the exact authorized opening/calendar rules for enrollment activation.
- OQ-031/036/037/093, OQ-043/044/084 and OQ-008/079/094: payment/refund edge cases, upload/playback safeguards and retention/audit obligations.

Do not implement a guessed permission or treat an open decision as an exemption from protection. Resolve only the decisions blocking the affected slice with the appropriate owner.

## External references

- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/): use relevant, version-qualified requirements for verification; no ASVS level or compliance claim is adopted here.
- [OWASP API Security Top 10 (2023)](https://owasp.org/API-Security/editions/2023/en/0x11-t10/): prioritize object/property/function authorization, authentication and abuse risks for this LMS; it does not define product permissions.
- [Official Codex AGENTS.md guidance](https://developers.openai.com/codex/guides/agents-md/) and [Claude Code instruction documentation](https://code.claude.com/docs/en/memory): shared rules live in AGENTS.md; [CLAUDE.md](CLAUDE.md) imports the root rules and this guide, then directs backend work to its scoped instructions. These files guide agents; runtime controls and verification provide enforcement.
