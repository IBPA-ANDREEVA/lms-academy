import os
import subprocess
import sys
from pathlib import Path

import pytest
from alembic.config import Config
from alembic.script import ScriptDirectory

from app.db.config import DatabaseConfigurationError, database_url
from app.db.metadata import migration_metadata
from app.db.recovery import RecoveryError, archive_path, pg_environment
from app.db.seed import seed

BACKEND = Path(__file__).resolve().parents[2]
BASELINE = "5c9789a48cba"


def test_one_reviewed_baseline_and_no_domain_tables() -> None:
    script = ScriptDirectory.from_config(Config(str(BACKEND / "alembic.ini")))
    assert script.get_heads() == [BASELINE]
    assert script.get_bases() == [BASELINE]
    assert len(list(script.walk_revisions())) == 1
    assert not migration_metadata().tables


@pytest.mark.parametrize(
    "raw",
    [
        "not-a-url-secret",
        "sqlite:///local.db",
        "postgresql+psycopg2://u:secret@host/db",
        "postgresql://u:secret@host",
        "postgresql://u:secret@host:bad/db",
        "postgresql://u:secret@host/db?host=other",
        "postgresql://u:secret@ep-pooler.neon.tech/db",
        "postgresql://u:secret@host/db?sslmode=require&sslmode=disable",
    ],
)
def test_rejects_invalid_urls_without_secret(
    raw: str, monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.setenv("MIGRATION_DATABASE_URL", raw)
    with pytest.raises(DatabaseConfigurationError) as error:
        database_url("MIGRATION_DATABASE_URL")
    assert "secret" not in str(error.value)
    assert raw not in str(error.value)


def test_encoded_password_and_psycopg3(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv(
        "MIGRATION_DATABASE_URL", "postgresql://u:p%40ss%25@host/db?sslmode=require"
    )
    url = database_url("MIGRATION_DATABASE_URL")
    assert url.drivername == "postgresql+psycopg"
    assert url.password == "p@ss%"


def test_no_runtime_credential_fallback(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("MIGRATION_DATABASE_URL", raising=False)
    monkeypatch.setenv("DATABASE_URL", "postgresql://runtime:secret@host/db")
    with pytest.raises(DatabaseConfigurationError, match="Set MIGRATION_DATABASE_URL"):
        database_url("MIGRATION_DATABASE_URL")


def test_recovery_isolates_libpq_environment(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("PGSERVICE", "wrong-target")
    monkeypatch.setenv("PGOPTIONS", "-c search_path=wrong_schema")
    monkeypatch.setenv("PGDATABASE", "wrong-database")
    monkeypatch.setenv("PGHOSTADDR", "192.0.2.1")
    monkeypatch.setenv(
        "BACKUP_SOURCE_DATABASE_URL",
        "postgresql://u:p%40ss@localhost/db?connect_timeout=7&channel_binding=require",
    )
    env = pg_environment(database_url("BACKUP_SOURCE_DATABASE_URL"))
    assert not {"PGSERVICE", "PGOPTIONS", "PGHOSTADDR"} & env.keys()
    assert env["PGDATABASE"] == "db"
    assert env["PGCONNECT_TIMEOUT"] == "7"
    assert env["PGCHANNELBINDING"] == "require"
    assert env["PGPASSWORD"] == "p@ss"


def test_rejects_backups_inside_repository() -> None:
    with pytest.raises(RecoveryError, match="outside the Git repository"):
        archive_path(BACKEND / "private.dump")


def test_seed_requires_environment_and_is_noop() -> None:
    with pytest.raises(DatabaseConfigurationError):
        seed("")
    assert seed("test") == seed("test") == 0


def test_cli_missing_credentials_fails_safely() -> None:
    env = {
        key: value
        for key, value in os.environ.items()
        if key != "MIGRATION_DATABASE_URL"
    }
    env["LMS_ENV"] = "test"
    result = subprocess.run(
        [
            sys.executable,
            "-m",
            "alembic",
            "-c",
            str(BACKEND / "alembic.ini"),
            "current",
        ],
        cwd=BACKEND.parent,
        env=env,
        capture_output=True,
        text=True,
        check=False,
    )
    assert result.returncode != 0
    assert "Set MIGRATION_DATABASE_URL" in result.stdout + result.stderr
    assert "Traceback" not in result.stdout + result.stderr
