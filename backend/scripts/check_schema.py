"""Read-only PostgreSQL/model comparison plus a reviewed physical schema snapshot.

Alembic doesn't detect all CHECK/enum changes. The snapshot catches independent
physical drift in checks, enums, defaults, references, indexes and nullability.
--record updates a local documentation artifact, never the database. Review the
snapshot and migration together; this is not a SQL semantic-equivalence prover.
"""

import argparse
import hashlib
import json
import os
import sys
from collections.abc import Iterable, Mapping
from pathlib import Path

BACKEND = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND))

from alembic.autogenerate import compare_metadata  # noqa: E402
from alembic.config import Config  # noqa: E402
from alembic.migration import MigrationContext  # noqa: E402
from alembic.script import ScriptDirectory  # noqa: E402
from sqlalchemy import CheckConstraint, Connection, inspect, text  # noqa: E402
from sqlalchemy.dialects.postgresql.base import PGInspector  # noqa: E402

from app.db.config import database_engine, database_url, require_environment  # noqa: E402
from app.db.metadata import migration_metadata  # noqa: E402

SNAPSHOT = BACKEND.parent / "docs/architecture/database/physical-schema.json"


def sorted_named(items: Iterable[Mapping[str, object]]) -> list[dict[str, object]]:
    return sorted(
        (dict(item) for item in items), key=lambda item: str(item.get("name"))
    )


def schema_snapshot(connection: Connection) -> dict[str, object]:
    metadata = migration_metadata()
    inspector = inspect(connection)
    assert isinstance(inspector, PGInspector)
    tables: dict[str, object] = {}
    for name in sorted(inspector.get_table_names(schema="public")):
        if name == "alembic_version":
            continue
        columns = [
            {
                "name": c["name"],
                "type": str(c["type"]),
                "nullable": c["nullable"],
                "default": c["default"],
            }
            for c in inspector.get_columns(name, schema="public")
        ]
        tables[name] = {
            "columns": columns,
            "primary_key": inspector.get_pk_constraint(name, schema="public"),
            "foreign_keys": sorted_named(
                inspector.get_foreign_keys(name, schema="public")
            ),
            "unique_constraints": sorted_named(
                inspector.get_unique_constraints(name, schema="public")
            ),
            "checks": sorted_named(
                inspector.get_check_constraints(name, schema="public")
            ),
            "indexes": sorted_named(inspector.get_indexes(name, schema="public")),
        }
    model_checks = {
        table.name: sorted(
            (str(c.name), str(c.sqltext))
            for c in table.constraints
            if isinstance(c, CheckConstraint)
        )
        for table in metadata.sorted_tables
    }
    return {
        "head": connection.scalar(text("SELECT version_num FROM alembic_version")),
        "tables": tables,
        "enums": sorted(inspector.get_enums(schema="public"), key=lambda e: e["name"]),
        "reviewed_model_checks_sha256": hashlib.sha256(
            json.dumps(model_checks, sort_keys=True).encode()
        ).hexdigest(),
    }


def verify(connection: Connection, *, record: bool = False) -> None:
    head = ScriptDirectory.from_config(
        Config(str(BACKEND / "alembic.ini"))
    ).get_current_head()
    if connection.scalar(text("SELECT version_num FROM alembic_version")) != head:
        raise RuntimeError(
            "SCHEMA_HEAD_MISMATCH: migrate this isolated target before inspection."
        )
    metadata = migration_metadata()
    context = MigrationContext.configure(
        connection, opts={"compare_type": True, "compare_server_default": True}
    )
    if compare_metadata(context, metadata):
        raise RuntimeError(
            "SCHEMA_MODEL_DRIFT: review Alembic comparison before recording."
        )
    actual = (
        json.dumps(schema_snapshot(connection), sort_keys=True, indent=2, default=str)
        + "\n"
    )
    if record:
        SNAPSHOT.write_text(actual)
    elif not SNAPSHOT.exists() or SNAPSHOT.read_text() != actual:
        raise RuntimeError(
            "SCHEMA_SNAPSHOT_DRIFT: review physical constraints, enums and defaults."
        )


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--record", action="store_true")
    args = parser.parse_args()
    environment = require_environment(os.environ.get("LMS_ENV"))
    if environment not in {"development", "test", "migration-test"}:
        raise RuntimeError(
            "Read-only schema workflow requires an explicit non-production environment."
        )
    engine = database_engine(database_url("MIGRATION_DATABASE_URL"))
    try:
        with engine.connect() as connection:
            connection.execute(text("SET TRANSACTION READ ONLY"))
            verify(connection, record=args.record)
    finally:
        engine.dispose()
    print(
        "Recorded reviewed physical snapshot."
        if args.record
        else "PostgreSQL, models and physical snapshot agree."
    )


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        message = (
            str(exc)
            if isinstance(exc, RuntimeError)
            else "Inspect the selected environment and revision."
        )
        print(
            f"SCHEMA_CHECK_FAILED error_type={type(exc).__name__}: {message}",
            file=sys.stderr,
        )
        sys.exit(1)
