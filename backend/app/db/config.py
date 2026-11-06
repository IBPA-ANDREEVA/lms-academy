"""Explicit, secret-safe configuration for operator database commands."""

import os

from sqlalchemy.engine import URL, make_url
from sqlalchemy.exc import ArgumentError

ENVIRONMENTS = ("development", "migration-test", "restore-test", "production", "test")
CONNECTION_OPTIONS = {"sslmode", "sslrootcert", "channel_binding", "connect_timeout"}


class DatabaseConfigurationError(ValueError):
    """A safe message that never includes the supplied connection string."""


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
