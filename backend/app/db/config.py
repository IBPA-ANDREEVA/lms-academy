"""Explicit, secret-safe configuration for operator database commands."""

import os

from sqlalchemy import create_engine, event
from sqlalchemy.engine import URL, Engine, make_url
from sqlalchemy.exc import ArgumentError
from sqlalchemy.pool import NullPool

ENVIRONMENTS = ("development", "migration-test", "restore-test", "production", "test")
CONNECTION_OPTIONS = {"sslmode", "sslrootcert", "channel_binding", "connect_timeout"}
# PostgreSQL 18 libpq connection/session inputs, including service-file lookup
# and the deprecated PGREQUIRESSL alias. PGDATA/PGLOCALEDIR are not connection
# configuration. Keep this list aligned with the supported client major version.
LIBPQ_ENVIRONMENT = frozenset(
    """
    PGHOST PGHOSTADDR PGPORT PGDATABASE PGUSER PGPASSWORD PGPASSFILE
    PGSERVICE PGSERVICEFILE PGSYSCONFDIR PGOPTIONS PGAPPNAME
    PGSSLMODE PGREQUIRESSL PGSSLNEGOTIATION PGSSLCOMPRESSION PGSSLCERT
    PGSSLKEY PGSSLCERTMODE PGSSLROOTCERT PGSSLCRL PGSSLCRLDIR PGSSLSNI
    PGSSLMINPROTOCOLVERSION PGSSLMAXPROTOCOLVERSION PGREQUIREPEER PGREQUIREAUTH
    PGCHANNELBINDING PGGSSENCMODE PGKRBSRVNAME PGGSSLIB PGGSSDELEGATION
    PGCONNECT_TIMEOUT PGCLIENTENCODING PGTARGETSESSIONATTRS PGLOADBALANCEHOSTS
    PGMINPROTOCOLVERSION PGMAXPROTOCOLVERSION PGDATESTYLE PGTZ PGGEQO
    SSL_CERT_FILE SSL_CERT_DIR
    """.split()
)


class DatabaseConfigurationError(ValueError):
    """A safe message that never includes the supplied connection string."""


def clean_pg_environment() -> dict[str, str]:
    """Copy subprocess environment without inherited connection/session inputs."""
    return {
        key: value
        for key, value in os.environ.items()
        if key.upper() not in LIBPQ_ENVIRONMENT
    }


def require_clean_pg_environment(*_args: object) -> None:
    """Reject ambient inputs before every DBAPI connect; never mutate os.environ."""
    if any(key.upper() in LIBPQ_ENVIRONMENT for key in os.environ):
        # Even shadowed or empty variables are refused: one operator contract,
        # independent of which optional fields a particular URL supplies.
        raise DatabaseConfigurationError(
            "Inherited PostgreSQL connection settings are not supported. "
            "Unset libpq/TLS environment overrides and configure the selected database URL."
        )


def database_engine(url: URL, *, autocommit: bool = False) -> Engine:
    """Operator/test engine; URL must come from database_url (or a derived test DB)."""
    engine = create_engine(
        url.set(port=url.port or 5432),
        poolclass=NullPool,
        hide_parameters=True,
        # Never inherit ~/.pgpass (or Windows pgpass.conf) when a URL omits a
        # password. Explicit URL timeout wins over the operator default.
        connect_args={
            "connect_timeout": url.query.get("connect_timeout", "10"),
            "passfile": os.devnull,
        },
        **({"isolation_level": "AUTOCOMMIT"} if autocommit else {}),
    )
    # URL parsing/engine creation is too early: engines are lazy and reconnect.
    event.listen(engine, "do_connect", require_clean_pg_environment)
    return engine


def require_environment(environment: str | None) -> str:
    if environment not in ENVIRONMENTS:
        raise DatabaseConfigurationError(
            "Select an environment explicitly: " + ", ".join(ENVIRONMENTS)
        )
    assert environment is not None
    return environment


def database_url(variable: str) -> URL:
    raw = os.environ.get(variable)
    if not raw:
        raise DatabaseConfigurationError(f"Set {variable} in this process environment.")
    try:
        url = make_url(raw)
        if url.drivername not in {"postgresql", "postgresql+psycopg"}:
            raise ValueError
        if not url.host or not url.database or not url.username:
            raise ValueError
        # Query parameters must not override the selected host/database.
        if set(url.query) - CONNECTION_OPTIONS:
            raise ValueError
        if any(not isinstance(value, str) for value in url.query.values()):
            raise ValueError
        if url.port is not None and not 0 < url.port < 65536:
            raise ValueError
    except (ValueError, TypeError, ArgumentError):
        raise DatabaseConfigurationError(
            f"{variable} must be an explicit PostgreSQL URL with host, user and database; "
            "only sslmode, sslrootcert, channel_binding and connect_timeout options are supported."
        ) from None
    if "-pooler" in url.host:
        raise DatabaseConfigurationError(
            f"{variable} must use a direct PostgreSQL endpoint."
        )
    return url.set(drivername="postgresql+psycopg")
