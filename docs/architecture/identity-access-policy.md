# Authentication, authorization and account lifecycle · BASE03-A

Status: approved product-policy documentation, recorded 2026-11-04; no implementation.
Authority: [PD-014](../product/decisions.md#pd-014--base03-a-authentication-authorization-and-account-lifecycle),
the [approved permission matrix](../product/permission-matrix.md), and
[PD-013](../product/decisions.md#pd-013--base02-a-domain-policy-overrides).
The owner supplied the BASE03-A decisions directly in this repository chat.
This document selects no provider, schema, API, UI, dependency or configuration.

## Roles and permission authority

| Account context | Meaning and limits |
| --- | --- |
| Guest | Unauthenticated visitor; not an authenticated role membership. Preserve the matrix's Guest selections without treating them as proof of identity. |
| Student | Learner context for enrollments and learning activity, subject to each selected permission and applicable lifecycle. |
| Trainer | Matrix label for the existing trainer/curator responsibilities. One current trainer/curator per course under PD-013; author/reviewer separation and reassignment visibility remain unresolved. |
| Manager | Membership restored by PD-013. Use the exact matrix selections; neither the name nor a referral link grants additional powers, a dashboard or a route. |
| Admin | Administrator context with the selected permissions and manual account management. It is not an unrestricted bypass of Deny, Conditional or NAN cells. |

One application-owned user may hold multiple roles. Role switching and combination
semantics remain open (OQ-013/OQ-014/OQ-095); do not choose union-of-grants or
deny-overrides behavior here. Commerce preserves historical partner attribution
independently of current roles and Identity capability grants (PD-011/PD-013).

The live Google Sheet is authoritative for all 90 resource-action selections.
The [dated snapshot](../product/permission-matrix.md) preserves every source cell.
Allow means permitted; Deny forbidden; Conditional requires additional checks;
NAN means that action does not exist for that account type. Do not fill blank
resource/condition cells, invent ownership relationships, or treat an Approved
row as proof that its detailed conditions, implementation or release conflicts
have been resolved. Existing non-superseded business constraints still apply.

## Registration, verification and email changes

- MVP uses email/password authentication. Google/Apple login remains later scope;
  the matrix's “Link another identity” row does not select a provider or linking flow.
- Email verification is required before accessing purchased courses.
- Account activation links expire after **48 hours**. Users can securely request
  replacement activation links. Expiry of a link does not invalidate a paid purchase.
- Email changes require reauthentication and verification. Administrator email
  changes follow the manual process below, not the public self-service operation.
- Account activation/email verification and enrollment activation are different:
  verifying email, signing in, purchasing or claiming never starts course timers.

## Password recovery and manual administrator provisioning

For non-administrator self-service recovery, email password-reset links are
**single-use** and expire after **30 minutes**. Successful recovery revokes **all
previous sessions**, across devices. The mechanism for establishing a new session
after recovery is not selected here.

Administrator accounts are created and managed manually; there is no public admin
registration. Password setup/recovery and email changes are handled manually with
secure one-time credential setup and appropriate identity verification. Manual
handling does not waive reauthentication/verification requirements for email
changes or the session-revocation requirement after successful recovery. The
matrix's Admin NAN cells describe absent self-service actions, not an absence of
secure provisioning or recovery.

`.env` may hold bootstrap/application secrets, **never permanent user passwords**.
The authentication system stores password hashes. No temporary password scheme,
hash algorithm, setup-link lifetime, operator identity, recovery proof or bootstrap
procedure is selected in BASE03-A. Manual account management does not authorize
direct unaudited database edits or a competing authentication authority.

## Session lifecycle

| Policy | Approved behavior |
| --- | --- |
| Absolute lifetime | Maximum **30 days after login**; activity cannot extend that login's absolute limit. |
| Inactivity | Expire after **7 days** without genuine authenticated user interaction. |
| Activity qualification | Only genuine authenticated user interactions refresh inactivity; background polling does not count. The exact event taxonomy is still to be specified. |
| Multiple devices | Multiple simultaneous sessions/devices are allowed. |
| Role consistency | The same session policy applies to every role, including administrators. |
| MFA | Not required for MVP; no MFA implementation is selected. |
| Sensitive admin operations | Require recent password reauthentication, in addition to PD-010 explanatory confirmation, explicit consent, server authorization and audit. “Recent” has no approved numeric window yet. |
| Blocking and revoked roles | Take effect immediately; existing sessions cannot continue exercising blocked access or revoked permissions. This does not select whether all sessions are physically deleted on a role change. |
| Expiration | Require login again; preserve learning progress. Session expiry is not enrollment revocation or record deletion. |
| Recovery | Successful password recovery invalidates every prior session, including other devices. |

Neither polling nor an active browser tab can keep a session alive by itself.
Authentication/session expiration and Learning's independent access/support
deadlines are separate. Reauthentication does not reset an enrollment clock.

## Guest purchases and account claiming

1. Commerce owns payment confirmation and the durable purchase record. Payment
   and Learning enrollment remain separate domain concepts under PD-013.
2. A guest purchase may create an account through email activation. Purchased
   course access requires verified email and an authorized authenticated identity.
3. If an account already exists, verify ownership before linking the purchase.
   Matching a supplied checkout email alone is never ownership proof.
4. A paid but unclaimed purchase remains claimable after its activation link
   expires. Secure resend/recovery continues from the original purchase; do not
   require another payment or discard the purchase because its link expired.
5. Claiming, account linking and fulfillment must preserve the original purchase
   and avoid duplicate grants. Exact matching/proof/retry mechanics remain OQ-032.

This is a lifecycle contract, not a prescribed ordering of database operations.
Account resolution may begin earlier in checkout. No new claim-expiry period is
introduced, and payment alone never starts course-access or curator-support timers.

## Enrollment activation, expiration and history

The student's **first authorized opening of an enrolled course** activates that
enrollment, once. Standard courses receive **1 year** of access; mini-courses
receive **3 calendar months**. Lessons/materials follow the applicable access
deadline. Courses with curator support receive **14 consecutive calendar days**
of support from the same activation. Mini-courses have no curator support.
Every enrollment has its own access and, where applicable, support deadlines.

PD-013 supersedes PD-004's introductory-page-acknowledgment trigger and uniform
three-month duration. Neither payment, an enrollment grant, email verification,
account claiming nor subsequent login starts or restarts those clocks. Exact
qualifying opening, accidental/prefetched requests, calendar/year/month boundaries,
timezone and overlap rules remain OQ-049; no endpoint or calculation is designed here.

Non-superseded PD-004 rules remain:

- Students may request an extension after support expires. Assigned curators may
  extend support by up to 14 calendar days per request, never course access.
- Administrators may adjust both deadlines, approve longer exceptions and pause
  access. Pauses freeze applicable timers and restore the exact remaining duration;
  support extensions do not automatically extend course access.
- Support closes at its own deadline; lessons/materials close at the access
  deadline unless extended. Timely homework still requires review even if overdue.
  Post-expiry revisions and certificate effects remain OQ-048.
- Confirmed refunds/revocations immediately remove affected access, server-side
  and with auditable, replay-safe effects. A refund request alone is not a confirmed
  monetary refund. PD-013 retains within-24-hours AND unstarted-course eligibility
  and administration-handled execution; OQ-037/OQ-093 govern residual details.
- Preserve historical learning and financial records. Preserve all homework
  attempts, attachments, reviews and feedback through revisions, closure and refunds.
  Expiry alone never authorizes their destruction. OQ-008/OQ-094 still reconcile
  preservation with lawful deletion; no permanent homework-retention term is invented.

## Known security requirements and technical choices

Existing [runtime boundaries](frontend-backend-integration.md) remain binding:
Identity supplies trusted identity/current authorization context; each existing
resource owner enforces its own protected operations on the server. Next.js and
the browser are not authentication or business-policy authorities. Never trust
client roles, typed email, return URLs or resource identifiers as authorization.
Keep credentials/tokens out of logs and public responses; protect private media;
preserve audit and replay safety. Failures follow PD-001: useful Russian-first
messages plus separate structured, privacy-safe, traceable diagnostics.

The integration document's same-origin ingress and revocable opaque cookie session
are **engineering recommendations**, not selected implementations. Authentication
provider/library, session storage/rotation and immediate invalidation mechanism,
cookie settings, CSRF transport, token issuance/storage/replacement, email delivery
and abuse controls, password hashing parameters and manual bootstrap/recovery
procedures remain technical work. The 30-day/7-day and 48-hour/30-minute product
limits are approved and must not be reopened as unspecified technical defaults.

## Source discrepancies requiring follow-up

These are observations, not changes to sheet values or completed authorization design.
Sheet row numbers include the header.

| Evidence | Required interpretation / unresolved reconciliation |
| --- | --- |
| Rows 45 and 48–55: Admin Deny for task/submission/review/file/conversation actions | Preserve Deny exactly; older PD-005/008/010 admin viewing/review prose cannot override these selections. Reconcile review escalation, monitoring and certificate-evidence workflows without inventing a bypass (OQ-096). Curator timely-review duties and manual certificate issuance remain. |
| Guest Allow for own account/profile/roles/sessions/orders/receipts, sometimes alongside “Own authenticated user ID” | Preserve both selections and source condition text. Guest is still unauthenticated; the identity transition and exact resource proof need follow-up, not a new ownership assumption (OQ-095/OQ-096). |
| Rows 54–55 conversation actions and row 58 certificate revocation are tagged MVP | Preserve source stage labels, but do not silently promote full messaging or define certificate-revocation policy. Reconcile against existing scope/OQ-054–057/OQ-090 (OQ-096). |
| Rows 83–84: Trainer Conditional for deadline/access-period edits | Conditions are unfinished. Do not infer authority to extend course access contrary to retained PD-004 rules; identify the support-only versus access meaning in follow-up (OQ-095). |
| Blank Resource cells in rows 24–84; blank conditions on several Conditional rows; broad or mismatched existing condition text | Preserve blanks/text exactly. Resource mapping and final checks remain deferred (OQ-095); no guessed resource names or grant predicates. |

## Handoff: Resource Ownership & Security Validation — not performed

The next task must use the live matrix and this dated evidence to:

- map resource-specific ownership relationships to the seven existing domain owners;
- define final authorization conditions for all Conditional selections, resolve
  blank/ambiguous source context and multi-role/separation-of-duties semantics;
- reconcile the source discrepancies above without silently changing selected values
  or release scope; obtain owner decisions where business behavior conflicts;
- specify security acceptance-test scenarios, including protection against
  cross-user resource access and enforcement of approved session/revocation rules.

BASE03-A deliberately supplies no resource-level predicates, final acceptance-test
catalog or security implementation. Product questions remain OQ-011–016/OQ-032,
OQ-048–049/OQ-092–097 and linked legal/certificate dependencies; technical choices
are listed separately above. [Verification evidence](../qa/BASE03-A-documentation-2026-11-04.md)
records this task's documentation checks, not working authentication.
