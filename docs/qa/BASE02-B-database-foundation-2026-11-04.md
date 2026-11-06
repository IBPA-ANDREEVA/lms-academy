# BASE02-B database foundation verification

Date: 2026-11-04 (America/Los_Angeles). Status: **COMPLETE for the migration foundation**.
No domain feature, deployment, production operational acceptance or Vault task
completion is claimed. No working-time entry was created.

## Reused implementation and initial findings

Preserved Python 3.12 selection, uv project/runtime dependencies, Psycopg 3,
Alembic configuration/template and the applied empty baseline. Runtime versions
remain SQLAlchemy 2.1.8, Alembic 1.20.1 and Psycopg 3.3.8. The lock adds only the
configured development toolchain and its dependencies.

Baseline `5c9789a48cba_initial_baseline.py` is byte-identical before/after:
SHA-256 `1D9F0C5F8691C6F04E51CBDE7D3A04C223F7B9E523D505C3BD2041A4AD67EC4B`.
Its upgrade/downgrade are empty, parent is null, and it is the sole head. Generated
unused imports/formatting are retained intentionally and excluded from Ruff.

Initial gaps: no metadata registration, no seed/testing/checker workflow, migration
credentials shared the generic `DATABASE_URL` convention, engine disposal was not
guaranteed on error, Python caches were unignored, and documentation still claimed
an empty Python scaffold. These are addressed by this change.

Existing unrelated product/architecture edits and the pre-existing deletion of
`alembic/versions/.gitkeep` were preserved. Historical manual Neon migration and
backup/restore steps are **owner-reported**, not relabeled as independently verified.

## Files created or modified by this task

| Area | Files |
| --- | --- |
| Environment/tooling | `.gitignore`, `backend/pyproject.toml`, `backend/uv.lock` |
| Alembic | `backend/alembic.ini`, `backend/alembic/env.py` |
| Database plumbing | `backend/app/__init__.py`, `backend/app/db/__init__.py`, `base.py`, `config.py`, `metadata.py`, `seed.py`, `recovery.py` under `backend/app/db/` |
| Tests/harness | `backend/tests/conftest.py`, `backend/tests/unit/test_foundation.py`, `backend/tests/integration/test_migrations.py`, `backend/scripts/verify_postgres.py` |
| Instructions/status | `AGENTS.md`, `backend/AGENTS.md`, `backend/README.md`, `docs/architecture/development-workflow.md`, `entity-map.md`, `modules.md`, `overview.md` under `docs/architecture/` |
| Runbook/evidence | `docs/architecture/database-migrations.md`, this file |

The pre-existing `.python-version`, migration template and applied baseline were
reviewed/reused without modification. No files were added to domain directories;
no API/startup integration or LMS schema was introduced.

## Executed checks

Commands run from `backend/`; the existing uv executable was addressed by its
absolute WinGet path because uv was not on this session's PATH.

| Check | Observed result |
| --- | --- |
| `uv sync`, then `uv sync --locked` | Passed; lock consistent, 20 packages resolved / 19 installed checked |
| `uv run alembic history` | `<base> -> 5c9789a48cba (head), initial_baseline` |
| `uv run alembic heads` | Exactly `5c9789a48cba (head)` |
| `uv run alembic current` without selected environment | Expected nonzero, safe environment-selection message; no database access |
| `alembic current --check-heads` inside integration test | Passed against the newly created database after upgrade |
| `alembic check` inside integration test | Passed after baseline upgrade, before adding test-only probe data |
| `uv run python -m app.db.seed --environment development` | Explicit no-op, zero records written, no connection |
| `uv run ruff check .` | Passed |
| `uv run ruff format --check .` | Passed; 14 files already formatted |
| `uv run mypy` | Passed; no issues in 12 source files |
| `uv run pytest -q` without test credentials | **15 passed, 3 explicitly skipped**, 1.73 seconds |
| `uv run python scripts/verify_postgres.py` with complete PostgreSQL 18 distribution | **18 passed, no skips**, 19.29 seconds for pytest |
| `git check-ignore` for `.env`, `.venv`, Python cache and private dump paths | All ignored |
| Baseline SHA-256 before/after | Identical |
| Documentation relative file links (README, new runbook/evidence) | No missing targets |
| Known local credential scan of backend deliverables/new documentation | Zero matches; credential values were not printed |
| Domain-directory inspection | No implementation files beyond existing `.gitkeep` placeholders |
| `git diff --check` | Passed |

The complete suite verifies fresh upgrade, repeat upgrade without extra revision
rows, one expected history head, DB/head equality, metadata comparison, a failed
migration rolling back DDL/DML while preserving the prior revision/data, and twice-run
seed no-op. A failing revision is written only into a temporary Alembic copy.
Synthetic preservation/recovery tables exist only in disposable databases.

Recovery verification actually executed PostgreSQL 18 `pg_dump` custom format and
`pg_restore` into a second newly created empty database. The restored revision and
synthetic record matched. Tests also rejected the source as destination, incorrect
confirmation, populated destinations, extra schemas, archive overwrite and checksum
tampering. Unit tests cover explicit configuration, credential-safe errors, absence
of runtime credential fallback, repository backup rejection and inherited libpq
destination-option removal.

## Database environments and execution issues

Only a fresh loopback-only local PostgreSQL **18.6** cluster was used. Tests allocated
UUID-named `base02_*` databases from `template0`; the harness stopped its server and
removed its cluster afterwards; final process/directory inspection confirmed no
test PostgreSQL process or cluster remained. No Neon URL was used for a connection and no production,
development, shared migration-test or restore-test branch was accessed or changed.

The installed PostgreSQL 18 command-line bundle lacks `share/postgres.bki`, so the
first local attempt failed before database creation. A complete official EDB 18.6
archive was downloaded/extracted outside Git into the Windows temporary tools
directory `lms-base02-tools-186/pgsql`. The global installation was not changed.
Docker was not used: its configured daemon was unreachable.

A subsequent Windows `pg_ctl` attempt exposed inherited captured-pipe handles.
Its newly created local cluster was explicitly stopped; the harness was changed
to use null standard handles for PostgreSQL lifecycle commands. Both subsequent
live runs succeeded (15 tests before the final safety tests, then 18 tests).
These earlier setup failures are not reported as passing checks.

## Scope limits and handoff

No blocker remains for this foundation. Live **local** restoration is verified;
independent Neon restore/role/TLS checks remain unperformed. Real runtime role grants,
production encrypted backup scheduling/retention, recovery objectives, deployment
serialization/cutover and domain-data recovery are future operational/domain work.
The no-op seed proves no mutation, not an unimplemented domain upsert. No feature
records exist to verify. Environment labels alone cannot prove endpoint identity.

Frontend lint/type/build/visual/SEO checks were not run: no frontend route, component,
HTTP/OpenAPI contract or metadata changed. FastAPI/API/worker tests do not yet exist.
No commits, pushes, deployment, branch creation/promotion, Obsidian completion
updates or recorded working-time changes were made.

Use [backend README](../../backend/README.md) for runnable checks and the
[migration/recovery runbook](../architecture/database-migrations.md) for the exact
future domain-table, seed and operational procedures.
