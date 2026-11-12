# Initial physical schema contract · 2026-11-06

Scope: development database structure, not delivered LMS workflows. The exact
31-table input is preserved in `lms-schema.proposed.dbml`. The generated
`lms-schema.dbml` describes only implemented tables; it never drives migrations.
SQLAlchemy declarations, reviewed Alembic revisions and PostgreSQL must agree.
The original BASE02-B revision `5c9789a48cba` stays byte-identical. Successors
are `20261106_01` and head `20261106_02`. The latter removes an unintended global
provider-payment-ID unique constraint found by the first live drift check; the
applied local revision was preserved. The initial mapping was written **before the
first schema migration**; this final manifest reflects local verification of both successors.

## Table manifest and input mapping

All retained tables keep their original names. UUIDs are application-supplied,
not email/provider identities. All instant fields use TIMESTAMPTZ. Every FK uses
RESTRICT, including review/media/financial history; there are no delete cascades.
`M` means MVP structural groundwork, not feature completion. `L` means later
groundwork only. The status below describes the migration definition; execution
evidence is in the dated QA report.

| Owner | Table | Phase / disposition | Principal references and constraints; changes from input |
| --- | --- | --- | --- |
| Identity | users | M / migrated locally | Original fields retained. Case-insensitive email/referral indexes; required role enum array defaults to student, rejects NULL elements, duplicate roles and multidimensional arrays; empty set permitted for no memberships. Account active/blocked independent of verification. |
| Identity | profiles | M / migrated locally | user_id remains both PK/FK (1:0..1); optional attributes and RU default retained. |
| Catalog | categories | M / migrated locally | UUID/title retained; omit derived course_count; add archived_at. |
| Catalog | courses | M / migrated locally | Nullable primary category and single current trainer FKs retained; no assertion that these exhaust taxonomy/staffing policy. Keep title/author/locales/price_cents; add USD currency, independent is_visible/is_for_sale/archived_at, content_approved_at and price_approved_at. Omit derived lessons_count/bought_total. type retains exact source codes course/miniCourse; defer startInUsa (OQ-019). No beginner/advanced mapping is inferred. |
| Catalog | course_localizations | M/L / added, migrated locally | Same course identity plus RU/EN locale composite PK, title and optional description; stores supplied translations only. No translation/entitlement fallback policy (OQ-024/088). Original course title remains the Russian-first base title; locales is declared availability, validated against approved content by future publication service. |
| Catalog | modules | M / migrated locally | Course FK; unique course/position, position >= 0; omit derived lesson_count; add unique id/course target for composite FKs. These are sections, not the Start in USA product. |
| Catalog | lessons | M / migrated locally | module_id retained; add required course_id with composite module/course FK; unique module/position and id/course; position >= 0. |
| Catalog | lesson_media | M / migrated locally | Keep original storage_key (original private object). Add locale, positive version, processing_status, processed_key, published_at/by, created_at. Unique lesson/locale/version; multiple retained versions, no replacement-on-failure mechanism. Published timestamp/actor must appear together. Exact processing vocabulary, HLS/key/rendition protocol and version entitlement remain VIDEO001/OQ-022/023. |
| Catalog | lesson_docs | M / migrated locally | Lesson FK, original type/title/storage key retained; add locale/version and creation time, positive version. |
| Catalog | packages | L / migrated locally, stable identity only | Original UUID/title/description/price/type retained; add USD currency. Nonnegative money. Nullable 2/3/6 choice is not a cross-row count invariant. No authoring/sale workflow or composition approval is claimed (OQ-025–028). |
| Catalog | package_courses | L / migrated locally, stable membership only | UUID and required package/course FKs; unique pair. Mutable membership cannot establish historical purchase composition (OQ-028). |
| Commerce | orders | M / migrated locally | Nullable buyer FK preserves unresolved guest claiming. Nonnegative amounts and USD, policy JSONB retained without treating it as verified consent. Defer promocode_id, referred_by_user_id and attribution_source with their Phase 2 accounting contract (OQ-034–041). No guessed tax/total formula. |
| Commerce | order_items | M/L / migrated locally | Required order FK; course/package UUID FKs and exactly one product; original snapshots retained, nonnegative amounts/USD. Add unique id/order for refund integrity. No static is_refundable. |
| Commerce | payments | M / migrated locally | Many per order; text provider IDs, provider/payment-id unique; nonnegative amount/USD. Add unique id/order. No fulfillment state mapping (OQ-031). |
| Commerce | payment_events | M / migrated locally | Original TEXT provider_event_id PK (Stripe-only PD-002), optional payment FK, unrestricted event_type, processing timestamps. Event deduplication is enforced; signature checking and replay processing absent. Multiple providers require a later provider-scoped key migration. |
| Commerce | refunds | M / migrated locally | Payment/order composite FK and optional item/order composite FK prevent cross-order references; positive amount/USD; unique provider_refund_id. Nullable item reference is groundwork, not partial-refund approval. Add request_key unique to deduplicate a future authorized refund command. No eligibility calculation or aggregate refund cap (OQ-036/037/093). |
| Learning | enrollments | M / migrated locally | Required user/course; nullable order item; unique paid source (order_item_id,course_id), no global user/course uniqueness. Manual source requires granted_by, nonblank grant_reason and granted_at; paid source forbids manual provenance. All clocks nullable without defaults. Omit derived completion_rate. Add id/course and id/user candidate keys. |
| Learning | lesson_progress | M / migrated locally | Unique enrollment/lesson; add course_id and two composite FKs to require same course. Nonnegative position. Completion fields retained without completion/unlocking rules (OQ-021/042). |
| Learning | student_requests | M/L / migrated locally | Original references/fields retained. Remove externalRefund request code: money requests belong to Commerce. Remaining type values retained as an extensible text vocabulary, rejecting externalRefund. Exact permitted transitions await OQ-048/049/090. |
| Learning | course_messages | L / migrated locally, requested structure | Enrollment/sender FKs; content/attachment retained. status becomes delivery-only draft/sent/failed vocabulary. Add delivered_at/read_at/edited_at/deleted_at; source seen/edited/deleted states map to independent timestamps, never one exclusive state. Access/moderation/recipient-read semantics remain OQ-047/068/090. |
| Assignments | assignments | M / migrated locally | Keep definition attachments JSONB distinct from student files. Add course_id with composite lesson/course FK and id/course key. No one-assignment-per-lesson restriction. |
| Assignments | submissions | M / migrated locally | Unique assignment/enrollment/attempt; add course_id to constrain both parents to one course. Same-assignment/enrollment predecessor composite FK uses previous_attempt plus CHECK previous_attempt < attempt; first attempt has no predecessor, later attempts require one. Branching/review authorization remains service policy. Add created_at and assigned_curator_id snapshot; submitted attempts require curator/timezone/deadline. No SLA calculator or unique final decision. |
| Assignments | submission_attachments | M / migrated locally | Original fields retained. Add upload_status, upload_id, object_version, derived_key and positive version; original/derived/preview references separate. Known size must be 0..1,000,000,000 bytes (SI GB technical encoding of PD-005). Aggregate originals/submission cap and finalized actual-size validation need locked service transactions. No file count cap. |
| Assignments | submission_reviews | M / migrated locally | Many review records per attempt, reviewer FK; content/attachments/decision retained. No unrestricted-final-decision policy implied. |
| Certificates | certificate_requests | M / migrated locally | Eligibility/review case, not necessarily student request; original nullable actors retained; add unique id/enrollment for issuance consistency. Eligibility deduplication waits for policy-version/language rules. |
| Certificates | certificate_templates | M / migrated locally | Unique name/locale/version, positive version; add approved_at/by and issuer_identity snapshot. These nullable draft fields must all be present together for approval evidence. No fabricated academy identity or approval. |
| Certificates | certificates | M / migrated locally | Unique number, template and issuer; composite request/enrollment and enrollment/issued_to FKs. Add template/locale composite FK and issuer_identity snapshot. Printed fields/PDF retained. No unique enrollment, automatic issuance/revocation, or inferred reissue policy. |
| Notifications | notifications | M / migrated locally | Recipient FK, original delivery/retry/content fields, unique nonblank deduplication_key. Add event_key and unique (event_key,user_id,channel) so random row IDs cannot bypass event-recipient-channel deduplication. Defer template_id alongside optional table. type is extensible text for certificate/SLA/legal events too. No worker/outbox completion implied. |
| Commerce | promocodes | L / DEFERRED | Preserve complete proposal only; stacking, caps and concurrent redemption OQ-034/035. |
| Commerce | commission_accruals | L / DEFERRED | Preserve complete proposal only; amounts, beneficiary attribution/reversals OQ-058–064. |
| Commerce | payouts | L / DEFERRED | Preserve complete proposal only; currency/beneficiary required by proposal, accounting/approval OQ-062/064 unresolved. |
| Notifications | notification_templates | Optional / DEFERRED | Versioned code templates are the bounded initial direction; no template content or engine is added. DB editing/version approval unselected (OQ-069). |

Result: **28 implemented tables** (27 retained plus one localization table), four
deferred source tables. `lms-schema.with-proposals.dbml` is the combined 32-table
design view (28 physical + four explicitly DEFERRED/NOT MIGRATED), while the original
31-table proposal remains unchanged. There is no credentials/session, roles/membership, cart,
outbox, pause-history, audit-framework or invented legal-policy table.

## Storage vocabulary versus approved behavior

Stable enums are user_role, account_status, locale, course_type (course/miniCourse),
package_type (offered choices only), lesson_doc and notification_channel. Other
proposed lifecycle enums become nonblank TEXT, because their transition vocabularies
are not finalized. This preserves proposed values without freezing guessed workflows;
course_messages alone has the bounded delivery-only check described above.
services must validate allowed transitions before any feature ships. No current
status string grants authorization. updated_at is stored with an insert default;
future writes explicitly update it, with no hidden trigger/ORM onupdate policy.

PD-014 already requires verified email before purchased-course access, contrary to
the attachment's older “verification gate undecided” sentence. We preserve
email_verified_at but implement no authentication/access gate. Other unverified-page
behavior stays open. No matrix permissions or OQs are changed by this schema.

Course classification has separate concepts: standard/mini format, beginner/advanced
level and the unresolved optional Start in USA product. No level field or Start
in USA physical product behavior is guessed. Primary category cardinality,
translations, historical content entitlement and current curator propagation still
need feature contracts. Published media versions are separate rows; existing version
selection and immutability enforcement belong to Catalog's future authorized writes.

## Database guarantees and service obligations

FK/check/unique constraints protect reference integrity under concurrent writes.
RESTRICT prevents ancestor deletion while referenced, not direct deletion/update of
leaf evidence by an owner/superuser. The local runtime role has no DELETE/TRUNCATE/DDL;
future services must preserve issued/submitted/published snapshots and use authorized,
audited changes. No service or general-purpose retention system exists yet.

Paid enrollment source uniqueness permits package expansion, but membership must be
validated against an immutable purchase snapshot in Commerce/Learning before fulfillment.
Current package membership alone is insufficient. User/course and item/course correctness,
ownership-proof claiming, activation/refund races, partial amounts, submitted aggregate
size, exactly-once review/issuance effects and external delivery need future transactions,
authorization, idempotency contracts and race tests. They are not solved by a migration.

Sync SQLAlchemy/Psycopg is selected for application units of work. Future synchronous
FastAPI handlers run in its threadpool; async handlers must offload the entire unit
or introduce a reviewed AsyncSession path. Sessions are never shared across threads.
The explicit transaction owner uses `with database.unit_of_work() as session`;
normal exit commits, exceptional exit rolls back, all exits close. Commands receive
that session and do not commit independently. No import connects, and no startup
migrates. Pool bounds are 5 connections + 0 overflow per process, 10s acquisition,
10s connection, 30s statements, 5s lock and 60s idle transaction timeouts for dev.

## Schema and diagram change protocol

1. Read the owner contract/OQs, change owner-local models, and register any new owner
   explicitly in app/db/metadata.py. Cross-domain string FKs do not authorize ORM writes.
2. Generate a new Alembic draft on isolated PostgreSQL, review it and freeze all DDL
   inside the revision. Never import live models into a historical revision.
3. Verify fresh upgrade, supported prior revision, repeat upgrade, rollback/preservation,
   `alembic check`, enum/check/default drift and relevant concurrent constraints.
4. Regenerate physical DBML/DOT/SVG using scripts/schema_docs.py; `--check` fails on
   stale text artifacts. Do not edit generated physical DBML as migration input.
   Keep the exact source proposal and this explicit field mapping as provenance.
5. Update this manifest, the runbook, instructions and fresh QA evidence. Later tables
   remain conceptual until an explicit new reviewed revision adds them.

References: [SQLAlchemy transaction ownership](https://docs.sqlalchemy.org/en/21/orm/session_basics.html),
[PostgreSQL composite constraints](https://www.postgresql.org/docs/18/ddl-constraints.html),
[DBML syntax](https://dbml.dbdiagram.io/docs/). These describe mechanisms, not LMS policy.
