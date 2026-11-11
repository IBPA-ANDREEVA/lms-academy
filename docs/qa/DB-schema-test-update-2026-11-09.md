# Schema test maintenance · 2026-11-09

The existing Identity migration `20261109_01` extends `20261106_02` with
three storage tables. Tests and generated artifacts still described the previous
28-table head. Updated the foundation assertions to four revisions, 31 tables
and the new head. Preserved and synchronized the locally present `test_schema 2.py`
and `test_schema_foundation 2.py` copies, which pytest also collects.

Regenerated the physical snapshot on a newly created local PostgreSQL 18.6
cluster after upgrade and a clean Alembic model comparison. Reviewed the JSON
against the committed snapshot: all 28 existing tables and all enums are unchanged;
only the three Identity tables, head and model-check digest changed. Regenerated
DBML, DOT, SVG, overview PNG and the rendered-artifact hash manifest. No migration
or business model was changed by this fix. The original proposed DBML is untouched.

Fixed formatting in the new database/runtime/application and Identity integration
test files, removed unused import type ignores, and used a typed mock-engine
dialect in the Identity metadata test. No application behavior changed.

Verification from `backend/`:

- `uv run ruff check .`: passed.
- `uv run ruff format --check .`: 41 files formatted.
- `uv run mypy`: passed, 36 source files.
- `uv run pytest -q`: 135 passed; 47 integration cases skipped without cluster credentials.
- `POSTGRES_BIN=/opt/homebrew/opt/postgresql@18/bin uv run python scripts/verify_postgres.py`: 182 passed on a newly minted disposable cluster, including duplicate local test copies.
- On a separate newly created isolated development cluster: `uv run alembic upgrade head`, `uv run alembic check`, `uv run python scripts/check_schema.py --record`, and `uv run python scripts/check_schema.py`: passed. Cluster stopped after recording.
- `uv run python scripts/schema_docs.py --render` and `--check`: passed.
- `git diff --check`: passed.

Frontend checks were not run: no frontend or HTTP contract changes. This evidence
establishes schema/test consistency, not working authentication or product delivery.
