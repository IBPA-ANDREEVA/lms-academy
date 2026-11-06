import os
import subprocess
import sys
from pathlib import Path
from unittest.mock import Mock, patch

import psycopg
import pytest
from alembic.config import Config
from alembic.script import ScriptDirectory
from alembic.util import CommandError
from psycopg import pq

from alembic import command
from app.db.config import (
    LIBPQ_ENVIRONMENT,
    DatabaseConfigurationError,
    clean_pg_environment,
    database_engine,
    database_url,
)
from app.db.metadata import migration_metadata
from app.db.recovery import (
    RecoveryError,
    archive_path,
    pg_environment,
    require_empty_target,
    revision,
    run_pg,
)
from app.db.recovery import (
    main as recovery_main,
)
from app.db.seed import seed

BACKEND = Path(__file__).resolve().parents[2]
BASELINE = "5c9789a48cba"


@pytest.fixture(autouse=True)
def clean_connection_environment(monkeypatch: pytest.MonkeyPatch) -> None:
    for key in os.environ:
        if key.upper() in LIBPQ_ENVIRONMENT:
            monkeypatch.delenv(key)


def test_environment_policy_covers_installed_libpq() -> None:
    # Parse metadata only: unlike conndefaults(), no environment/service lookup.
    supported = {opt.envvar.decode() for opt in pq.Conninfo.parse(b"") if opt.envvar}
    assert supported <= LIBPQ_ENVIRONMENT


@pytest.mark.parametrize("variable", sorted(LIBPQ_ENVIRONMENT))
@pytest.mark.parametrize("value", ["", "sensitive-ambient-value"])
def test_inherited_settings_rejected_before_dbapi_connect(
    variable: str, value: str, monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.setenv(
        "MIGRATION_DATABASE_URL", "postgresql://u:url-secret@selected.invalid/db"
    )
    engine = database_engine(database_url("MIGRATION_DATABASE_URL"))
    # Injection after URL validation and engine creation must still be caught.
    monkeypatch.setenv(variable, value)
    try:
        with patch.object(engine.dialect.loaded_dbapi, "connect") as connect:
            with pytest.raises(DatabaseConfigurationError) as error:
                engine.connect()
            connect.assert_not_called()
        assert "sensitive-ambient-value" not in str(error.value)
        assert "url-secret" not in str(error.value)
        assert "selected.invalid" not in str(error.value)
        assert os.environ[variable] == value
    finally:
        engine.dispose()


def test_explicit_connection_options_and_reconnect_guard(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setenv(
        "MIGRATION_DATABASE_URL",
        "postgresql://u:p%40ss@selected.invalid:5433/db"
        "?sslmode=verify-full&sslrootcert=approved.pem"
        "&channel_binding=require&connect_timeout=7",
    )
    engine = database_engine(database_url("MIGRATION_DATABASE_URL"))
    try:
        # Stop at DBAPI entry; no DNS or socket operation occurs.
        with patch.object(
            engine.dialect.loaded_dbapi, "connect", side_effect=RuntimeError("probe")
        ) as connect:
            with pytest.raises(RuntimeError, match="probe"):
                engine.connect()
            parameters = dict(connect.call_args.kwargs)
            parameters.pop("context")  # SQLAlchemy's Psycopg type-adapter context.
            assert parameters == {
                "host": "selected.invalid",
                "port": 5433,
                "dbname": "db",
                "user": "u",
                "password": "p@ss",
                "sslmode": "verify-full",
                "sslrootcert": "approved.pem",
                "channel_binding": "require",
                "connect_timeout": "7",
                "passfile": os.devnull,
            }
            monkeypatch.setenv("PGHOSTADDR", "192.0.2.1")
            monkeypatch.setenv("PGOPTIONS", "-c search_path=unintended_schema")
            with pytest.raises(DatabaseConfigurationError):
                engine.connect()
            assert connect.call_count == 1
    finally:
        engine.dispose()


def test_connection_defaults_do_not_use_ambient_password_file(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setenv("MIGRATION_DATABASE_URL", "postgresql://u@selected.invalid/db")
    url = database_url("MIGRATION_DATABASE_URL")
    engine = database_engine(url)
    try:
        with patch.object(
            engine.dialect.loaded_dbapi, "connect", side_effect=RuntimeError("probe")
        ) as connect:
            with pytest.raises(RuntimeError, match="probe"):
                engine.connect()
            assert connect.call_args.kwargs["port"] == 5432
            assert connect.call_args.kwargs["connect_timeout"] == "10"
            assert connect.call_args.kwargs["passfile"] == os.devnull
            assert "password" not in connect.call_args.kwargs
        assert pg_environment(url)["PGPASSFILE"] == os.devnull
        assert "PGPASSWORD" not in pg_environment(url)
    finally:
        engine.dispose()


@pytest.mark.parametrize("operation", ["migration", "revision", "empty-target"])
def test_all_online_entry_points_reject_inheritance(
    operation: str, monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.setenv("LMS_ENV", "test")
    monkeypatch.setenv(
        "MIGRATION_DATABASE_URL", "postgresql://u:secret@selected.invalid/db"
    )
    url = database_url("MIGRATION_DATABASE_URL")
    monkeypatch.setenv("PGHOSTADDR", "192.0.2.1")
    monkeypatch.setenv("PGOPTIONS", "-c search_path=unintended_schema")
    with patch("psycopg.connect") as connect:
        with pytest.raises(
            (DatabaseConfigurationError, CommandError), match="Inherited"
        ):
            if operation == "migration":
                command.current(Config(str(BACKEND / "alembic.ini")))
            elif operation == "revision":
                revision(url)
            else:
                require_empty_target(url, "db")
        connect.assert_not_called()


def test_connection_failures_are_sanitized(
    monkeypatch: pytest.MonkeyPatch, capsys: pytest.CaptureFixture[str], tmp_path: Path
) -> None:
    monkeypatch.setenv("LMS_ENV", "test")
    monkeypatch.setenv(
        "MIGRATION_DATABASE_URL", "postgresql://u:secret@selected.invalid/db"
    )
    monkeypatch.setenv(
        "BACKUP_SOURCE_DATABASE_URL", os.environ["MIGRATION_DATABASE_URL"]
    )
    with patch(
        "psycopg.connect", side_effect=psycopg.OperationalError("driver-secret")
    ):
        with pytest.raises(CommandError) as error:
            command.current(Config(str(BACKEND / "alembic.ini")))
        assert "driver-secret" not in str(error.value)
        assert error.value.__suppress_context__
        monkeypatch.setattr(
            sys, "argv", ["recovery", "backup", "--file", str(tmp_path / "unused.dump")]
        )
        with pytest.raises(SystemExit) as exit_info:
            recovery_main()
        assert exit_info.value.code == 1
    captured = capsys.readouterr()
    assert "driver-secret" not in captured.out + captured.err
    assert "DB_RECOVERY_FAILED" in captured.err
    assert "Traceback" not in captured.out + captured.err


def test_postgres_utilities_receive_only_explicit_settings(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setenv("POSTGRES_BIN", "unused-bin")
    monkeypatch.setenv(
        "BACKUP_SOURCE_DATABASE_URL", "postgresql://u:secret@selected.invalid/db"
    )
    url = database_url("BACKUP_SOURCE_DATABASE_URL")
    for key in LIBPQ_ENVIRONMENT:
        monkeypatch.setenv(key, "ambient-secret")
    monkeypatch.setenv("PG_NOT_A_LIBPQ_OPTION", "preserved")
    monkeypatch.setenv("PGLOCALEDIR", "preserved-locale")
    assert clean_pg_environment()["PG_NOT_A_LIBPQ_OPTION"] == "preserved"
    assert clean_pg_environment()["PGLOCALEDIR"] == "preserved-locale"
    run = Mock(
        side_effect=[
            subprocess.CompletedProcess([], 0, "pg_dump (PostgreSQL) 18.4", ""),
            subprocess.CompletedProcess([], 0, b"", b""),
        ]
    )
    monkeypatch.setattr(subprocess, "run", run)
    run_pg("pg_dump", ["--no-password"], url)
    version_env = run.call_args_list[0].kwargs["env"]
    assert not LIBPQ_ENVIRONMENT.intersection(version_env)
    connection_env = run.call_args_list[1].kwargs["env"]
    assert "ambient-secret" not in connection_env.values()
    assert connection_env["PGHOST"] == "selected.invalid"
    assert connection_env["PGPASSWORD"] == "secret"
    assert connection_env["PGPASSFILE"] == os.devnull
    assert "secret" not in str(run.call_args.args)
    assert os.environ["PGOPTIONS"] == "ambient-secret"


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
