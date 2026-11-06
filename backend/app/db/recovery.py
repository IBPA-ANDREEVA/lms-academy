"""PostgreSQL 18 logical backup/recovery into an explicitly selected empty database."""

import argparse
import hashlib
import json
import os
import subprocess
from pathlib import Path

from psycopg.conninfo import make_conninfo
from sqlalchemy import text
from sqlalchemy.engine import URL

from app.db.config import (
    clean_pg_environment,
    database_engine,
    database_url,
    require_environment,
)

REPOSITORY = Path(__file__).resolve().parents[3]


class RecoveryError(RuntimeError):
    """Safe operator error, without database values or driver output."""


def archive_path(path: Path) -> Path:
    path = path.resolve()
    if path.is_relative_to(REPOSITORY):
        raise RecoveryError("Backups must be outside the Git repository.")
    return path


def endpoint_id(url: URL) -> str:
    identity = f"{(url.host or '').lower()}:{url.port or 5432}/{url.database}"
    return hashlib.sha256(identity.encode()).hexdigest()


def pg_environment(url: URL) -> dict[str, str]:
    env = clean_pg_environment()
    env.update(
        {
            "PGHOST": str(url.host),
            "PGPORT": str(url.port or 5432),
            "PGDATABASE": str(url.database),
            "PGUSER": str(url.username),
            "PGCONNECT_TIMEOUT": "10",
            "PGAPPNAME": "lms-recovery",
            "PGPASSFILE": os.devnull,
        }
    )
    if url.password is not None:
        env["PGPASSWORD"] = url.password
    for key, value in url.query.items():
        assert isinstance(value, str)
        option = {
            "connect_timeout": "PGCONNECT_TIMEOUT",
            "channel_binding": "PGCHANNELBINDING",
        }.get(key, "PG" + key.upper())
        env[option] = value
    return env


def run_pg(tool: str, arguments: list[str], url: URL) -> None:
    binary = Path(os.environ["POSTGRES_BIN"]) / tool
    version = subprocess.run(
        [str(binary), "--version"],
        env=clean_pg_environment(),
        capture_output=True,
        text=True,
        check=True,
    )
    if "(PostgreSQL) 18." not in version.stdout:
        raise RecoveryError("PostgreSQL 18 client tools are required.")
    result = subprocess.run(
        [str(binary), *arguments],
        env=pg_environment(url),
        capture_output=True,
        check=False,
    )
    if result.returncode:
        # pg_restore/driver stderr can contain data, SQL and authentication details.
        raise RecoveryError(
            f"{tool} failed (exit {result.returncode}); raw output suppressed."
        )
    if result.stderr:
        raise RecoveryError(
            f"{tool} emitted diagnostics; verification requires operator review."
        )


def revision(url: URL) -> str:
    engine = database_engine(url)
    try:
        with engine.connect() as connection:
            revisions = list(
                connection.scalars(
                    text("SELECT version_num FROM public.alembic_version")
                )
            )
            if len(revisions) != 1 or not isinstance(revisions[0], str):
                raise RecoveryError("Expected exactly one database revision.")
            return revisions[0]
    finally:
        engine.dispose()


def require_empty_target(url: URL, confirmation: str) -> None:
    if confirmation != url.database:
        raise RecoveryError(
            "--confirm-target must match the destination database name."
        )
    engine = database_engine(url)
    try:
        with engine.connect() as connection:
            # Reject tables, views, sequences, types, functions, extensions, extra
            # schemas and large objects, not merely rows in application tables.
            occupied = connection.scalar(
                text("""
                SELECT EXISTS (
                    SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
                    WHERE n.nspname !~ '^pg_' AND n.nspname <> 'information_schema'
                ) OR EXISTS (
                    SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
                    WHERE n.nspname !~ '^pg_' AND n.nspname <> 'information_schema'
                ) OR EXISTS (
                    SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid=t.typnamespace
                    WHERE n.nspname !~ '^pg_' AND n.nspname <> 'information_schema'
                ) OR EXISTS (
                    SELECT 1 FROM pg_namespace
                    WHERE nspname !~ '^pg_' AND nspname NOT IN ('public', 'information_schema')
                ) OR EXISTS (SELECT 1 FROM pg_extension WHERE extname <> 'plpgsql')
                  OR EXISTS (SELECT 1 FROM pg_largeobject_metadata)
            """)
            )
            if occupied:
                raise RecoveryError(
                    "Destination is not empty; no restore was attempted."
                )
    finally:
        engine.dispose()


def checksum(path: Path) -> str:
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def backup(path: Path, source: URL) -> None:
    path = archive_path(path)
    manifest = path.with_suffix(path.suffix + ".json")
    if path.exists() or manifest.exists():
        raise RecoveryError("Backup or manifest already exists; choose a new filename.")
    before = revision(source)
    # Reserve the path exclusively; a failed dump remains unverified, without a manifest.
    with path.open("xb"):
        pass
    run_pg(
        "pg_dump",
        [
            "--format=custom",
            "--no-owner",
            "--no-acl",
            "--no-password",
            "--file",
            str(path),
        ],
        source,
    )
    if revision(source) != before:
        raise RecoveryError(
            "Revision changed during backup; freeze migrations and take a new backup."
        )
    with manifest.open("x", encoding="utf-8") as stream:
        json.dump(
            {
                "revision": before,
                "sha256": checksum(path),
                "source_id": endpoint_id(source),
            },
            stream,
        )


def restore(path: Path, target: URL, confirmation: str) -> None:
    path = archive_path(path)
    manifest = json.loads(
        path.with_suffix(path.suffix + ".json").read_text(encoding="utf-8")
    )
    if manifest["source_id"] == endpoint_id(target):
        raise RecoveryError("Source and destination must differ.")
    if manifest["sha256"] != checksum(path):
        raise RecoveryError("Archive checksum does not match its manifest.")
    require_empty_target(target, confirmation)
    # No --clean or --create: never replace an existing database. One transaction
    # ensures a restore SQL error cannot leave partially restored schema/data.
    run_pg(
        "pg_restore",
        [
            "--single-transaction",
            "--exit-on-error",
            "--no-owner",
            "--no-acl",
            "--no-password",
            "--dbname",
            make_conninfo(dbname=target.database),
            str(path),
        ],
        target,
    )
    if revision(target) != manifest["revision"]:
        raise RecoveryError("Restored revision does not match the backup manifest.")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="operation", required=True)
    commands.add_parser("backup").add_argument("--file", type=Path, required=True)
    restore_parser = commands.add_parser("restore")
    restore_parser.add_argument("--file", type=Path, required=True)
    restore_parser.add_argument("--confirm-target", required=True)
    args = parser.parse_args()
    try:
        require_environment(os.environ.get("LMS_ENV"))
        if args.operation == "backup":
            backup(args.file, database_url("BACKUP_SOURCE_DATABASE_URL"))
        else:
            restore(
                args.file,
                database_url("RESTORE_TARGET_DATABASE_URL"),
                args.confirm_target,
            )
    except Exception as exc:
        # No raw exception or traceback: drivers and subprocess errors can leak secrets.
        detail = (
            str(exc)
            if isinstance(exc, RecoveryError)
            else "Check configuration and the recovery runbook."
        )
        parser.exit(
            1,
            f"DB_RECOVERY_FAILED operation={args.operation} error_type={type(exc).__name__}: {detail}\n",
        )
    print(json.dumps({"operation": args.operation, "status": "verified"}))


if __name__ == "__main__":
    main()
