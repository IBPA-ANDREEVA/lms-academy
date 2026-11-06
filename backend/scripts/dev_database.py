"""Own a new local development cluster, with separate migration/runtime roles.

No existing cluster is adopted. Credentials live only in a private directory
outside Git. Commands never print URLs/passwords or load an ambient database URL.
"""

import argparse
import json
import os
import secrets
import shlex
import socket
import subprocess
import sys
from pathlib import Path

BACKEND = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND))

from sqlalchemy import text  # noqa: E402
from sqlalchemy.engine import URL  # noqa: E402

from app.db.config import clean_pg_environment, database_engine  # noqa: E402


def pg(binaries: Path, *args: str) -> None:
    result = subprocess.run(
        [str(binaries / args[0]), *args[1:]],
        stdin=subprocess.DEVNULL,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        env=clean_pg_environment(),
        timeout=60,
        check=False,
    )
    if result.returncode:
        raise RuntimeError(f"Local {args[0]} failed; inspect private server.log.")


def load(directory: Path) -> dict[str, str]:
    raw = json.loads((directory / "lms-local.json").read_text())
    if (
        not isinstance(raw, dict)
        or not all(isinstance(k, str) and isinstance(v, str) for k, v in raw.items())
        or raw.get("directory") != str(directory)
        or raw.get("format") != "lms-local-v1"
    ):
        raise RuntimeError("Unrecognized local cluster manifest.")
    return dict(raw)


def url(state: dict[str, str], role: str, database: str = "lms_dev") -> URL:
    return URL.create(
        "postgresql+psycopg",
        username=role,
        password=state[role],
        host="127.0.0.1",
        port=int(state["port"]),
        database=database,
    )


def private_write(path: Path, value: str) -> None:
    with path.open("x", encoding="utf-8") as stream:
        os.chmod(path, 0o600)
        stream.write(value)


def start(directory: Path, binaries: Path) -> None:
    if directory.exists():
        raise RuntimeError("Use a new empty path; existing clusters are never adopted.")
    if directory.is_relative_to(BACKEND.parent):
        raise RuntimeError("Local data/credentials must be outside the repository.")
    version = subprocess.run(
        [str(binaries / "postgres"), "--version"],
        capture_output=True,
        text=True,
        check=True,
        env=clean_pg_environment(),
    ).stdout
    if "(PostgreSQL) 18." not in version:
        raise RuntimeError("Complete PostgreSQL 18 distribution required.")
    directory.mkdir(mode=0o700, parents=True)
    with socket.socket() as listener:
        listener.bind(("127.0.0.1", 0))
        port = listener.getsockname()[1]
    state = {
        "format": "lms-local-v1",
        "directory": str(directory),
        "binaries": str(binaries),
        "port": str(port),
        **{
            role: secrets.token_hex(24)
            for role in ("lms_local_admin", "lms_migrator", "lms_runtime")
        },
    }
    private_write(directory / "lms-local.json", json.dumps(state))
    password = directory / "init-password"
    private_write(password, state["lms_local_admin"])
    data = directory / "data"
    try:
        pg(
            binaries,
            "initdb",
            "-D",
            str(data),
            "-U",
            "lms_local_admin",
            "--auth=scram-sha-256",
            "--pwfile",
            str(password),
            "--encoding=UTF8",
            "--locale=C",
        )
    finally:
        password.unlink(missing_ok=True)
    with (data / "postgresql.conf").open("a") as stream:
        stream.write(
            f"\nlisten_addresses = '127.0.0.1'\nport = {port}\n"
            "unix_socket_directories = ''\n"
        )
    try:
        pg(
            binaries,
            "pg_ctl",
            "-D",
            str(data),
            "-l",
            str(directory / "server.log"),
            "-w",
            "-t",
            "30",
            "start",
        )
        engine = database_engine(
            url(state, "lms_local_admin", "postgres"), autocommit=True
        )
        try:
            with engine.connect() as connection:
                for role in ("lms_migrator", "lms_runtime"):
                    # Both identifiers and hex passwords are generated internally.
                    connection.execute(
                        text(
                            f"CREATE ROLE {role} LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE "
                            f"PASSWORD '{state[role]}'"
                        )
                    )
                connection.execute(text("CREATE DATABASE lms_dev OWNER lms_migrator"))
        finally:
            engine.dispose()
        engine = database_engine(url(state, "lms_migrator"))
        try:
            with engine.begin() as connection:
                connection.execute(text("REVOKE CREATE ON SCHEMA public FROM PUBLIC"))
        finally:
            engine.dispose()
        environment = {
            "LMS_ENV": "development",
            "DATABASE_URL": url(state, "lms_runtime").render_as_string(
                hide_password=False
            ),
            "MIGRATION_DATABASE_URL": url(state, "lms_migrator").render_as_string(
                hide_password=False
            ),
            "POSTGRES_BIN": str(binaries),
        }
        private_write(
            directory / "environment.sh",
            "".join(
                f"export {key}={shlex.quote(value)}\n"
                for key, value in environment.items()
            ),
        )
        print("Started isolated local development PostgreSQL with separate roles.")
        print(f"Private environment file: {directory / 'environment.sh'}")
    except Exception:
        if (data / "postmaster.pid").exists():
            pg(binaries, "pg_ctl", "-D", str(data), "-m", "fast", "-w", "stop")
        raise


def grants(state: dict[str, str]) -> None:
    engine = database_engine(url(state, "lms_migrator"))
    try:
        with engine.begin() as connection:
            # Run explicitly after migrations; no authority to migrate as runtime.
            connection.execute(text("GRANT USAGE ON SCHEMA public TO lms_runtime"))
            connection.execute(
                text(
                    "GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO lms_runtime"
                )
            )
            connection.execute(text("REVOKE ALL ON alembic_version FROM lms_runtime"))
    finally:
        engine.dispose()
    print("Granted runtime DML; no DELETE, TRUNCATE, schema ownership or DDL.")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=("start", "resume", "grant", "stop"))
    parser.add_argument("--directory", required=True, type=Path)
    args = parser.parse_args()
    directory = args.directory.expanduser().resolve()
    if args.action == "start":
        if not os.environ.get("POSTGRES_BIN"):
            raise RuntimeError(
                "Set POSTGRES_BIN to the complete PostgreSQL 18 bin directory."
            )
        start(directory, Path(os.environ["POSTGRES_BIN"]).resolve())
    else:
        state = load(directory)
        if args.action == "grant":
            grants(state)
        elif args.action == "resume":
            pg(
                Path(state["binaries"]),
                "pg_ctl",
                "-D",
                str(directory / "data"),
                "-l",
                str(directory / "server.log"),
                "-w",
                "-t",
                "30",
                "start",
            )
            print("Resumed this previously created local development cluster.")
        else:
            pg(
                Path(state["binaries"]),
                "pg_ctl",
                "-D",
                str(directory / "data"),
                "-m",
                "fast",
                "-w",
                "-t",
                "30",
                "stop",
            )
            print("Stopped this local cluster; private data/credentials retained.")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(
            f"LOCAL_DATABASE_FAILED error_type={type(exc).__name__}; "
            "check the directory, PostgreSQL tools and private log.",
            file=sys.stderr,
        )
        sys.exit(1)
