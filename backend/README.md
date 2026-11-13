# LMS Python backend

## Identity implementation update · 2026-11-11

FastAPI now mounts registration, verification/resend, login/logout/current-user,
owned-session listing/revocation and password recovery. Read the
[route/function map](../docs/architecture/identity-routes.md) for exact URLs,
responsibilities, transaction boundaries, generated contracts and development
limitations. Optional Resend delivery now runs after commit; see the route map for
configuration and remaining delivery/UI gaps. Existing unrelated production FIX items
are retained. Other domain APIs/workers remain unimplemented. Earlier
foundation-only statements below are historical. New/edited Identity code uses
2-space indentation enforced by scoped Ruff configuration.


> Merge update (2026-11-10): the current head is `20261110_01`, with 31 domain
> tables. `20261109_01` adds Identity storage; `20261110_01` adds the incoming
> pending account status/default without changing applied revisions. Existing
> users retain their statuses; downgrade refuses pending accounts. This revision
> replaces the enum under a users-table lock; plan a controlled migration window.
> Incoming Identity API/service work is partial and is not release-verified.
> Earlier foundation-only status statements below describe the November 6 baseline.
> See `docs/architecture/database/schema-contract.md` for the reconciled contract.


**Status: initial physical database and development workflow implemented (2026-11-06).** There are 28 owner-local SQLAlchemy tables, immutable baseline plus reviewed successors through `20261106_02`, bounded sync application sessions, isolated PostgreSQL tests, local role-separated development commands, recovery tools and colored diagrams. No FastAPI application, feature services, authentication, jobs or frontend HTTP integration exists. See the [table/column manifest](../docs/architecture/database/schema-contract.md), [database runbook](../docs/architecture/database-migrations.md), and [new verification evidence](../docs/qa/DB-schema-foundation-2026-11-06.md). The [BASE02-B report](../docs/qa/BASE02-B-database-foundation-2026-11-04.md) remains historical.


Read the root [AGENTS.md](../AGENTS.md), local [AGENTS.md](AGENTS.md), [ADR-0003](../docs/decisions/0003-python-backend-architecture.md), [module contracts](../docs/architecture/modules.md) and [integration contract](../docs/architecture/frontend-backend-integration.md) before implementation.

## Approved architecture and intended stack

One Python FastAPI modular monolith owns authoritative operations. The existing Next.js 16 / React / TypeScript / Tailwind frontend remains in this repository and deploys independently. They communicate through versioned HTTP/JSON REST APIs and OpenAPI contracts. Python modules communicate through narrow local interfaces, not seven network services.

The target stack remains FastAPI, Pydantic v2, SQLAlchemy 2, Alembic and PostgreSQL. The foundation uses Python 3.12, synchronous SQLAlchemy/Psycopg 3 for operator commands and application units of work, uv/uv.lock, pytest, Ruff and strict mypy. FastAPI/Pydantic remain uninitialized. `app/db/session.py` supplies an explicit unit of work, five-connection/no-overflow pool and bounded timeouts; future async handlers must not block their event loop with this sync path. The owner reports a provisioned Neon project with four branches; this task's independent verification uses isolated local PostgreSQL. Hosting, authentication and durable-job selections remain separate work.

## Directory conventions

```text
backend/
  AGENTS.md
  README.md
  app/
    api/                     # future version mounting / HTTP composition
    core/                    # small technical configuration, logging, clock helpers
    db/                      # engine/session/transaction and metadata plumbing
    modules/
      identity/
      catalog/
      commerce/
      learning/
      assignments/
      certificates/
      notifications/
    jobs/                    # durable execution wiring; domain handlers keep owners
  alembic/
    versions/                # immutable baseline and reviewed additive successors
  scripts/
    verify_postgres.py        # creates/stops its own disposable local cluster
  tests/
    unit/
    integration/
    api/
```

Each of the seven domain directories contains its owned `models.py`. API, core and jobs leaves retain `.gitkeep`; no feature services exist. `app/db` contains configuration, metadata/base, session units of work, no-op seed and recovery utilities. API, core, db and jobs remain technical boundaries, never additional business domains.

| Domain | Responsibility |
| --- | --- |
| Identity | Accounts, authentication, sessions, roles and explicit capabilities |
| Catalog | Course/lesson definitions, prices, publication/readiness, course-media references |
| Commerce | Orders, payments, refunds, cart/quotes, consent acceptance and commercial attribution |
| Learning | Enrollments, access/support, progress and enrollment-scoped conversations |
| Assignments | Existing homework-definition baseline, submissions, reviews and homework assets |
| Certificates | Eligibility evaluation and issuance records; admin review/manual issuance |
| Notifications | Delivery of committed notification intents and delivery outcomes |

The complete ownership and dependency matrix in `docs/architecture/modules.md` takes precedence over this short map. PD-013 restores concurrent manager membership; referral capability remains independent. Homework-definition ownership and policy-publication ownership remain their existing preparation decisions.

## Future internal module organization

Create files only when their responsibilities exist; a small operation may need only a few files. These names are conventions, not scaffolding requirements:

| Optional file | Responsibility |
| --- | --- |
| `router.py` | Thin FastAPI routes: HTTP inputs, dependencies, operation call, response mapping |
| `schemas.py` | Pydantic request/response models; never expose ORM records wholesale |
| `models.py` | SQLAlchemy mappings and constraints for this domain's records |
| `service.py` | Named use cases, resource checks and explicit workflow transaction boundary |
| `policies.py` | Business decisions/state transitions independent of FastAPI/ORM where practical |
| `persistence.py` or a focused adapter | Private domain queries/writes when separation has a real purpose |
| `public.py` | Documented narrow cross-module interface when another module actually consumes it |

Split growing files by use case; do not mandate base services, repository-per-table classes, interfaces for every function or empty layers. Technical adapters do not acquire domain ownership.

## Development and verification

Prepare a bounded feature contract and record blocking product questions before changing domain models or adding APIs. Follow the [schema-change process](../docs/architecture/database-migrations.md#adding-the-first-domain-table). Do not rewrite baseline `5c9789a48cba` or put domain mappings in `app/db`.

Run from this directory:

```powershell
uv sync --locked
uv run ruff check .
uv run ruff format --check .
uv run mypy
uv run pytest -q
uv run alembic history
uv run alembic heads
uv run python -m app.db.seed --environment development
# Requires a complete PostgreSQL 18 distribution:
$env:POSTGRES_BIN = 'C:\path\to\postgresql18\bin'
uv run python scripts/verify_postgres.py
```

Without explicit test credentials, pytest reports database skips. The isolated harness provides its own temporary credentials and runs live migration/rollback/recovery checks. The applied baseline is excluded from Ruff to preserve its exact bytes. `uv run mypy` checks app, Alembic environment, tests and the harness. Domain persistence invariants are tested; business policy/API tests remain future work. SQLite cannot substitute for PostgreSQL acceptance.

Alembic online commands require `LMS_ENV` and `MIGRATION_DATABASE_URL`; there is no fallback to the future runtime `DATABASE_URL`, and `.env` is never auto-loaded. Select the authorized direct endpoint before any upgrade. Backup/restore credentials are separate. Commands, environment guards and their limits are documented in the [runbook](../docs/architecture/database-migrations.md).

Alembic revisions are reviewed, tested from an empty and supported prior database, and applied once by a controlled release step. Never migrate automatically from every API/worker process. Use additive expand/contract changes across independently deployed frontend/API versions. Test recovery and data preservation before destructive changes.

Export OpenAPI deterministically, review its compatibility diff and generate TypeScript integration types/client in the implementation slice. Preserve existing frontend preview behavior until real integration is verified. See [prioritized recommendations](../docs/architecture/python-backend-recommendations.md) for unresolved selections and release gates.

## Local quick start (macOS/Linux)

From `backend/`, with uv on PATH and a complete PostgreSQL 18 distribution:

```sh
uv sync --locked
export POSTGRES_BIN=/absolute/path/to/postgresql18/bin
uv run python scripts/dev_database.py start --directory "$HOME/.cache/lms-dev-schema"
source "$HOME/.cache/lms-dev-schema/environment.sh"
uv run alembic upgrade head
uv run python scripts/dev_database.py grant --directory "$HOME/.cache/lms-dev-schema"
uv run alembic current --check-heads
uv run alembic check
uv run python scripts/check_schema.py
uv run python scripts/schema_docs.py --check
uv run python scripts/verify_postgres.py
uv run python scripts/dev_database.py stop --directory "$HOME/.cache/lms-dev-schema"
# Later: resume the same owned cluster, then source its environment again.
uv run python scripts/dev_database.py resume --directory "$HOME/.cache/lms-dev-schema"
```

`start` requires a new directory outside Git and never adopts existing data. The
private environment file contains generated **database-role** credentials, not LMS
users/passwords. Do not print or commit it. `stop` preserves local data; tests use
a different disposable cluster and remove only their own data. No seed records
are created. Runtime grants exclude DELETE/TRUNCATE/DDL and Alembic bookkeeping.

See [physical DBML](../docs/architecture/database/lms-schema.dbml), [full SVG](../docs/architecture/database/lms-schema.svg), [overview](../docs/architecture/database/lms-overview.svg) and the preserved [proposal](../docs/architecture/database/lms-schema.proposed.dbml). The [combined design view](../docs/architecture/database/lms-schema.with-proposals.dbml) adds the four explicitly deferred tables to the physical diagram without claiming they are migrated. Graphviz is only needed for regeneration: `uv run python scripts/schema_docs.py --render`. The workflow in `.github/workflows/backend-database.yml` uses a disposable PostgreSQL 18.6 cluster; its remote execution is not implied by local verification.
