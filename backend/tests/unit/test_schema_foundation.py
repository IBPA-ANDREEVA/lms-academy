"""Non-network checks for schema registration, configuration and immutable history."""

import hashlib
import os
from pathlib import Path
from unittest.mock import patch

import pytest
from sqlalchemy import DateTime
from sqlalchemy.pool import QueuePool

from app.db.config import LIBPQ_ENVIRONMENT, DatabaseConfigurationError
from app.db.metadata import migration_metadata
from app.db.session import ApplicationDatabase, ApplicationDatabaseSettings
from scripts.schema_docs import artifacts

BACKEND = Path(__file__).resolve().parents[2]


@pytest.fixture(autouse=True)
def clean_environment(monkeypatch: pytest.MonkeyPatch) -> None:
    for key in os.environ:
        if (
            key.upper() in LIBPQ_ENVIRONMENT
            or key.startswith("DATABASE_")
            or key == "LMS_ENV"
        ):
            monkeypatch.delenv(key)


def test_immutable_baseline_hash() -> None:
    baseline = BACKEND / "alembic/versions/5c9789a48cba_initial_baseline.py"
    assert (
        hashlib.sha256(baseline.read_bytes()).hexdigest()
        == "1d9f0c5f8691c6f04e51cbde7d3a04c223f7b9e523d505c3bd2041a4ad67ec4b"
    )


def test_metadata_registration_no_connect_fk_types_and_retention() -> None:
    with patch("psycopg.connect", side_effect=AssertionError("Unexpected connection")):
        metadata = migration_metadata()
        assert len(metadata.tables) == 28
    for table in metadata.tables.values():
        for column in table.columns:
            if isinstance(column.type, DateTime):
                assert column.type.timezone
        for fk in table.foreign_key_constraints:
            assert fk.ondelete == "RESTRICT"
            for element in fk.elements:
                assert (
                    element.parent.type._type_affinity
                    == element.column.type._type_affinity
                )
    for deferred in [
        "promocodes",
        "commission_accruals",
        "payouts",
        "notification_templates",
        "sessions",
        "credentials",
    ]:
        assert deferred not in metadata.tables


def test_generated_documentation_matches() -> None:
    for name, content in artifacts().items():
        assert (
            BACKEND.parent / "docs/architecture/database" / name
        ).read_text() == content


@pytest.mark.parametrize("environment", [None, "production", "staging", "restore-test"])
def test_runtime_fails_closed_outside_development(
    environment: str | None, monkeypatch: pytest.MonkeyPatch
) -> None:
    if environment:
        monkeypatch.setenv("LMS_ENV", environment)
    with pytest.raises(DatabaseConfigurationError, match="development/test"):
        ApplicationDatabaseSettings.from_environment()


def test_runtime_lazy_bounded_pool_and_inherited_connection_guard(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setenv("LMS_ENV", "development")
    monkeypatch.setenv(
        "DATABASE_URL", "postgresql://runtime:synthetic-secret@127.0.0.1/lms_dev"
    )
    settings = ApplicationDatabaseSettings.from_environment()
    assert "synthetic-secret" not in repr(settings)
    with patch("psycopg.connect") as connect:
        database = ApplicationDatabase(settings)
        try:
            connect.assert_not_called()
            assert isinstance(database.engine.pool, QueuePool)
            assert database.engine.pool.size() == 5
            monkeypatch.setenv("PGHOSTADDR", "unintended-target")
            with pytest.raises(DatabaseConfigurationError, match="Inherited"):
                with database.unit_of_work() as session:
                    session.connection()
            connect.assert_not_called()
        finally:
            database.dispose()


def test_runtime_local_name_and_remote_confirmation(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setenv("LMS_ENV", "development")
    monkeypatch.setenv(
        "DATABASE_URL", "postgresql://runtime:secret@localhost/customer_database"
    )
    with pytest.raises(DatabaseConfigurationError):
        ApplicationDatabaseSettings.from_environment()
    monkeypatch.setenv(
        "DATABASE_URL",
        "postgresql://runtime:secret@development.invalid/neondb?sslmode=require",
    )
    with pytest.raises(DatabaseConfigurationError):
        ApplicationDatabaseSettings.from_environment()
    monkeypatch.setenv("DATABASE_NONPRODUCTION_HOST", "development.invalid")
    monkeypatch.setenv("DATABASE_NONPRODUCTION_NAME", "neondb")
    assert (
        ApplicationDatabaseSettings.from_environment().url.host == "development.invalid"
    )
