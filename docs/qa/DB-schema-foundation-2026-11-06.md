# Initial database schema and development workflow verification

Date: 2026-11-06, America/Los_Angeles. **Implemented and verified locally for this
database-foundation scope.** No product feature, deployment, release acceptance,
Vault completion or working-time estimate is claimed.

## Result and schema disposition

PostgreSQL has **28 domain tables**, plus Alembic bookkeeping, at the single head
`20261106_02`. The local development database contains **zero business rows**.
The [table-by-table and column mapping](../architecture/database/schema-contract.md)
was prepared before the first schema migration and updated with verified results.

| Owner | Implemented physical tables | Phase qualification |
| --- | --- | --- |
| Identity | users, profiles | MVP groundwork; no credentials, sessions or auth service |
| Catalog | categories, courses, course_localizations, modules, lessons, lesson_media, lesson_docs, packages, package_courses | Seven core tables; packages/membership are Phase 2 groundwork only |
| Commerce | orders, order_items, payments, payment_events, refunds | MVP structural constraints; package line reference is later groundwork |
| Learning | enrollments, lesson_progress, student_requests, course_messages | Core learning groundwork; full messaging remains later and MVP request scope still needs reconciliation |
| Assignments | assignments, submissions, submission_attachments, submission_reviews | MVP structural groundwork; no submission/review/upload workflow |
| Certificates | certificate_requests, certificate_templates, certificates | Eligibility cases and issuance evidence storage; no evaluator/issuance/PDF generation |
| Notifications | notifications | Durable intent/retry fields and business identity; no outbox/delivery worker |

Deferred: `promocodes` (OQ-034/035), `commission_accruals` (OQ-058–064), `payouts`
(OQ-062/064), `notification_templates` (optional, OQ-069). Retained source fields,
changed types, added columns, removed derived caches and postponed references are
explicit in the central contract. The attachment's old “verification gate undecided”
wording is superseded by approved PD-014 for purchased-course access; no gate is
implemented here. Course level versus format/Start in USA remains unresolved.

## Preserved work and migration history

Initial tracked working tree and index were clean. **842 pre-existing untracked
files** (primarily duplicate frontend/QA assets) were inventoried and SHA-256 checked
after implementation: none changed or disappeared. No source artwork or Vault
records were modified. No commit, push, merge, branch promotion or deployment ran.

The separate libpq fix was already committed locally as `8edda34`. These files
remain byte-identical to the starting tree:

| File | SHA-256 |
| --- | --- |
| backend/alembic/versions/5c9789a48cba_initial_baseline.py | `1d9f0c5f8691c6f04e51cbde7d3a04c223f7b9e523d505c3bd2041a4ad67ec4b` |
| backend/app/db/config.py | `cac5958fa73de70503198f61bb8542c0caf5ef449ddfbb05878489bed6a0fed2` |
| backend/app/db/recovery.py | `c5a00b3a29bfd266a98d4ee489700543d133f3c44d56de7f41816e5773a40a1e` |
| backend/alembic/env.py | `b72edd36570ebaa4c221006fc50cf2c63d6e3b05ebaef0ae6485d6f962c0ae4b` |
| backend/uv.lock | `2a4ea7626f4532397268863c6910115994f40a45a5af25c43b6fe1d82fdecd74` |

Baseline hash also matches `git show HEAD:<baseline path>` and the historical
BASE02-B report. Existing environment-hardening tests remain intact. Their empty
schema/head assertions were updated; the test fixture/harness additionally bind
credentials to their own live temporary cluster. The harness's Windows flag lookup
was made portable for strict mypy on macOS.

History: `5c9789a48cba → 20261106_01 → 20261106_02`. The first local drift check
found an unintended global unique constraint on provider_payment_id in revision 01.
Revision 02 removes it while retaining `(provider, provider_payment_id)` uniqueness.
Because 01 had already run locally, it was not rewritten. Upgrade from 01 preserves
synthetic user/payment rows; repeat upgrade is a no-op. The empty-only downgrade
refuses populated domain tables and never cascades. A failing migration rolls back
both data/DDL and Alembic revision bookkeeping.

## Environment and actual checks

macOS arm64; Python **3.12.1**, uv **0.13.7**, SQLAlchemy **2.1.8**, Psycopg **3.3.8**,
Alembic **1.20.1**, pytest **9.2.0**, Ruff **0.17.3**, mypy **1.20.2**.
Existing lock and Python selection were reused. Graphviz **12.2.1** rendered the
diagrams; temporary `@dbml/cli` **11.1.0** parsed the generated DBML.

uv was absent from PATH; a private temporary tool venv was created outside Git.
PostgreSQL **18.6** was built from the official source archive outside Git with
SHA-256 `555610c24d53e4316da5b7d3fc25c279d96856d5e0e23ee308c328c5fa881d9f`.
No global service/installation or shared database was changed. Tests use a new
loopback-only SCRAM cluster and UUID databases; the cluster is stopped and removed
after each harness run. A separate local development cluster verified role grants
and the start/stop/resume workflow; it is left **stopped**, with its private data
retained outside Git.

| Command/check (from backend unless stated) | Observed result |
| --- | --- |
| `uv sync --locked` | Passed; existing lock unchanged |
| `uv run ruff check .` | Passed |
| `uv run ruff format --check .` | Passed, 30 files formatted; immutable baseline excluded |
| `uv run mypy` | Passed, 26 source files |
| `uv run pytest -q` without PostgreSQL credentials | **118 passed, 24 explicitly skipped** |
| `POSTGRES_BIN=… uv run python scripts/verify_postgres.py` | **142 passed, zero skips**: 118 non-network/unit checks and 24 PostgreSQL tests |
| `uv run alembic heads/history/current --check-heads` | One head `20261106_02`, baseline ancestry preserved |
| `uv run alembic upgrade head` repeated | Passed, no new data or revision rows |
| `uv run alembic check` | Passed; no upgrade operations detected |
| `uv run python scripts/check_schema.py` | PostgreSQL/model/default/snapshot comparison passed in a read-only transaction |
| `uv run python scripts/schema_docs.py --render` and `--check` | Passed; generated DBML/DOT and rendered-artifact hashes match |
| `dbml2sql <physical/with-proposals DBML> --postgres` | Both parsed successfully; SQL written outside Git and **not executed** |
| `uv run python -m app.db.seed --environment development` | Explicit no-op; zero records written |
| Local runtime-role connection and privileges | SELECT 1 succeeds; DDL, DELETE, TRUNCATE and Alembic access denied with SQLSTATE 42501 |
| Local development cluster inspection | PostgreSQL 18.6; 28 domain tables; zero business rows; head 20261106_02 |
| Local `start`, `grant`, `stop`, `resume`, then `current`, `stop` | Passed; generated private credentials never printed; cluster left stopped |
| `git diff --check` | Passed |
| Initial unrelated-file/protected-file hash checks | All unchanged |

Logs are under [evidence/DB-schema-foundation-2026-11-06](evidence/DB-schema-foundation-2026-11-06).
The [file inventory](evidence/DB-schema-foundation-2026-11-06/file-inventory.json)
lists every task-created/modified file, excluding the 842 preserved pre-existing
untracked files. [Integrity evidence](evidence/DB-schema-foundation-2026-11-06/integrity.json)
records the preservation/hash/head checks.

Coverage includes case-insensitive email/referral uniqueness, role defaults/multiple
memberships/invalid arrays, UUID FK alignment, XOR course/package lines, nonnegative
USD money, provider event and notification business-identity duplicates, competing
event inserts on independent connections, source enrollment uniqueness and manual
provenance, unstarted nullable clocks, cross-course progress/homework, ordered
same-context attempt chains, SLA snapshot completeness, original-file size bounds,
retained review/media rows, cross-order refunds, certificate recipient/case/locale
consistency, explicit commit/rollback/close/timeouts, empty downgrade/re-upgrade,
populated downgrade refusal, prior-version data preservation and pg_dump/restore.
Drift tests deliberately alter a CHECK, default and enum and confirm detection.

Earlier checks exposed portable typing/assertion differences (unordered reflected
table names, raw PostgreSQL enum-array text and RESTRICT's SQLSTATE 23001). Those
tests were corrected against actual PostgreSQL behavior, with no policy changes.
The final results above replace those failed intermediate runs; no skipped test is
reported as passing.

## Files and diagrams

Implementation: seven `backend/app/modules/<owner>/models.py` files;
`backend/app/db/{metadata,session}.py`; two new Alembic revisions;
`backend/scripts/{__init__,dev_database,check_schema,schema_docs,verify_postgres}.py`;
new schema unit/integration tests and adapted foundation fixtures/assertions;
`backend/.env.example`; `.github/workflows/backend-database.yml`.

Documentation: root/backend AGENTS, backend README, architecture overview/modules/
entity-map/database-migrations, the schema contract, physical snapshot, generated
diagrams, exact source proposal and this fresh QA report/evidence. Approved ADRs,
PDs/OQs and historical QA reports remain unchanged. No frontend code, dependencies,
routes, SEO or HTTP/OpenAPI contract changed.

- [Physical DBML](../architecture/database/lms-schema.dbml): 28 migrated tables only.
- [Combined design DBML](../architecture/database/lms-schema.with-proposals.dbml):
  28 physical + four explicitly marked DEFERRED/NOT MIGRATED tables.
- [Original proposed DBML](../architecture/database/lms-schema.proposed.dbml): exact
  31-table input, SHA-256 `b7f5de1f343b406cf2a064918089fe5331d93115638ff7bab3c8f3f30b36aee5`.
- [Full physical SVG](../architecture/database/lms-schema.svg),
  [overview SVG](../architecture/database/lms-overview.svg),
  [overview PNG](../architecture/database/lms-overview.png): seven requested owner
  colors; later groundwork identified; overview visually inspected for readable
  names, legend and domain-level arrows. SVGs are freely rendered with Graphviz.

## Exact local session commands and handoff

The tool paths below exist on this machine from this verification. For portable
installation, use a complete PostgreSQL 18 distribution and uv; the committed CI
workflow contains the checksum-pinned PostgreSQL source-build commands.

```sh
cd /Users/ivanmakovetskyi/Desktop/Work/lms-academy/backend
export PATH=/tmp/lms-schema-tools-20261106/bin:$PATH
export POSTGRES_BIN=/tmp/lms-schema-tools-20261106/pgsql/bin
uv sync --locked
uv run python scripts/dev_database.py resume --directory /tmp/lms-schema-dev-20261106
source /tmp/lms-schema-dev-20261106/environment.sh
uv run alembic current --check-heads
uv run alembic upgrade head
uv run alembic check
uv run python scripts/check_schema.py
uv run python scripts/schema_docs.py --check
uv run python scripts/verify_postgres.py
uv run python scripts/dev_database.py stop --directory /tmp/lms-schema-dev-20261106
```

For a new local database use `start --directory <new-private-path>` then source its
environment, migrate and run `grant`; see the [runbook](../architecture/database-migrations.md).
Never apply DBML-generated SQL. Future schema changes use a reviewed Alembic
successor and update the manifest/snapshot/diagrams/tests together.

No blocker remains for the implemented foundation. **Unverified/out of scope:**
remote CI execution, Neon branch/role/TLS/restore operations, production deployment,
frontend lint/type/build/visual/SEO (no frontend or transport changes), and all
unimplemented services/API/worker tests. The CI definition is ready but was not
pushed or run remotely. Authentication mechanism, final resource conditions and
PD-014 matrix conflicts; historical content/package terms; completion/unlocking;
activation/refund races; finalized aggregate upload limits/recovery; certificate
identity/reissue; notification templates/retry contracts and legal retention remain
the named feature/OQ obligations. A CHECK/snapshot hash does not prove semantic SQL
equivalence or operational policy enforcement.

Next vertical slice: Identity account/profile and registration/verification lifecycle
can build on users/profiles after its authentication/session mechanism and resource
authorization contract are settled; credentials/sessions need their own reviewed
migration. Catalog category/content work can then use existing models without
relocating the frontend. No schema fixture counts as that feature's implementation.

## Owner-reported Neon development verification

After local verification, the owner reported successful `alembic upgrade head`
against Neon development and `alembic check` with no new upgrade operations. This
is owner-reported remote evidence, not an agent-observed connection. Remote runtime
role grants, TLS/recovery operations and production remain unverified. The commit
packaging was subsequently explicitly authorized by the owner; the earlier no-commit
statement above describes the original implementation/verification stage.

## Commit packaging checks

The owner explicitly requested committing everything in separate major-change
commits, including the pre-existing numbered frontend/QA copies. These files are
preserved as-is, not represented as newly implemented or verified UI.
Backend Ruff/format/mypy/schema-doc checks passed again; plain pytest: 118 passed,
24 PostgreSQL skips (the earlier isolated 142-pass evidence remains unchanged).
Frontend lint passed with four warnings and Next route type generation passed.
TypeScript failed with six pre-existing errors in numbered copies: motion-preview
imports a missing canonical circle-loader; academy-story and featured-course-scroll
reference absent storyOverlap/featuredTravel tokens; circle-loader references absent
circleExpand/circleReveal tokens. Build was not rerun after this known type-check
failure. Resolving these duplicate-source conflicts is separate work.
