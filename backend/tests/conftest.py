"""Only create/drop databases minted in this test run; never reset a supplied DB."""

import os
import tempfile
from collections.abc import Iterator
from contextlib import contextmanager
from pathlib import Path
from uuid import uuid4

import pytest
from sqlalchemy import text
from sqlalchemy.engine import URL
from sqlalchemy.exc import SQLAlchemyError

from app.db.config import DatabaseConfigurationError, database_engine, database_url


@pytest.fixture(scope="session")
def postgres_admin_url() -> URL:
    if not os.environ.get("TEST_POSTGRES_ADMIN_URL"):
        pytest.skip(
            "TEST_POSTGRES_ADMIN_URL absent; use scripts/verify_postgres.py for isolation"
        )
    if (
        os.environ.get("TEST_POSTGRES_ALLOW_CREATE_DATABASE")
        != "create-new-databases-only"
    ):
        pytest.fail(
            "Explicit TEST_POSTGRES_ALLOW_CREATE_DATABASE authorization is required"
        )
    try:
        url = database_url("TEST_POSTGRES_ADMIN_URL")
        cluster = Path(os.environ.get("TEST_POSTGRES_CLUSTER_DIRECTORY", "")).resolve()
        # Do not permit manual shared/Neon targets, even with the old opt-in.
        # The harness owns a new temp cluster, and the live pid file binds its
        # exact data directory and port to these credentials before any connect.
        if (
            cluster.parent != Path(tempfile.gettempdir()).resolve()
            or not cluster.name.startswith("lms-base02-")
            or url.host != "127.0.0.1"
            or url.username != "base02_test"
            or url.database != "postgres"
        ):
            pytest.fail(
                "Use scripts/verify_postgres.py: isolated cluster proof required"
            )
        try:
            lines = (cluster / "data/postmaster.pid").read_text().splitlines()
            valid = (
                Path(lines[1]).resolve() == (cluster / "data").resolve()
                and int(lines[3]) == url.port
            )
            os.kill(int(lines[0]), 0)
        except (OSError, ValueError, IndexError):
            valid = False
        if not valid:
            pytest.fail("The isolated test cluster is not running at the selected port")
        return url
    except DatabaseConfigurationError as exc:
        pytest.fail(str(exc))


@contextmanager
def new_database(admin_url: URL) -> Iterator[URL]:
    name = "base02_" + uuid4().hex
    engine = database_engine(admin_url, autocommit=True)
    created = False
    try:
        try:
            with engine.connect() as connection:
                # Identifier consists only of our constant prefix and UUID hex.
                connection.execute(text(f'CREATE DATABASE "{name}" TEMPLATE template0'))
                created = True
        except SQLAlchemyError:
            pytest.fail(
                "Could not create disposable database; verify test credentials/CREATEDB",
                pytrace=False,
            )
        yield admin_url.set(database=name)
    finally:
        try:
            if created:
                with engine.connect() as connection:
                    connection.execute(text(f'DROP DATABASE "{name}"'))
        except SQLAlchemyError:
            pytest.fail(
                "Disposable database cleanup failed; inspect this test server",
                pytrace=False,
            )
        finally:
            engine.dispose()


@pytest.fixture
def disposable_database(postgres_admin_url: URL) -> Iterator[URL]:
    with new_database(postgres_admin_url) as url:
        yield url
