"""Run tests on a new loopback-only PostgreSQL 18 cluster outside the repository."""

import os
import secrets
import socket
import subprocess
import sys
import tempfile
from pathlib import Path

BACKEND = Path(__file__).resolve().parents[1]


def main() -> int:
    # Direct script invocation puts scripts/, not backend/, on Python's path.
    sys.path.insert(0, str(BACKEND))
    from app.db.config import clean_pg_environment

    binary_dir = os.environ.get("POSTGRES_BIN")
    if not binary_dir:
        print("Set POSTGRES_BIN to the PostgreSQL 18 bin directory.", file=sys.stderr)
        return 1
    binaries = Path(binary_dir)
    if not (binaries.parent / "share/postgres.bki").exists():
        raise RuntimeError(
            "Complete PostgreSQL server distribution required; share/postgres.bki is missing"
        )
    flags = getattr(subprocess, "CREATE_NO_WINDOW", 0) if os.name == "nt" else 0

    def pg(tool: str, *args: str) -> None:
        result = subprocess.run(
            [str(binaries / tool), *args],
            stdin=subprocess.DEVNULL,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            check=False,
            creationflags=flags,
            timeout=60,
            env=clean_pg_environment(),
        )
        if result.returncode:
            raise RuntimeError(
                f"{tool} failed (exit {result.returncode}); raw output suppressed"
            )

    version = subprocess.run(
        [str(binaries / "postgres"), "--version"],
        capture_output=True,
        text=True,
        check=True,
        env=clean_pg_environment(),
    )
    if "(PostgreSQL) 18." not in version.stdout:
        raise RuntimeError("PostgreSQL 18 server required")
    print(version.stdout.strip(), flush=True)
    # tempfile creates a new owned directory; never uses an existing cluster.
    with tempfile.TemporaryDirectory(prefix="lms-base02-") as directory:
        root = Path(directory).resolve()
        if root.is_relative_to(BACKEND.parent):
            raise RuntimeError("Temporary cluster must be outside the repository")
        data = root / "data"
        password = secrets.token_hex(24)
        password_file = root / "init-password"
        password_file.write_text(password, encoding="utf-8")
        try:
            pg(
                "initdb",
                "-D",
                str(data),
                "-U",
                "base02_test",
                "--auth=scram-sha-256",
                "--pwfile",
                str(password_file),
                "--encoding=UTF8",
                "--locale=C",
            )
        finally:
            password_file.unlink(missing_ok=True)
        with socket.socket() as listener:
            listener.bind(("127.0.0.1", 0))
            port = listener.getsockname()[1]
        # Configuration belongs only to this newly initialized temp directory.
        with (data / "postgresql.conf").open("a", encoding="utf-8") as stream:
            stream.write(
                f"\nlisten_addresses = '127.0.0.1'\nport = {port}\nunix_socket_directories = ''\n"
            )
        try:
            pg(
                "pg_ctl",
                "-D",
                str(data),
                "-l",
                str(root / "server.log"),
                "-w",
                "-t",
                "30",
                "start",
            )
            env = clean_pg_environment()
            # Shared/Neon credentials are neither loaded nor passed to tests.
            for key in (
                "DATABASE_URL",
                "MIGRATION_DATABASE_URL",
                "BACKUP_SOURCE_DATABASE_URL",
                "RESTORE_TARGET_DATABASE_URL",
            ):
                env.pop(key, None)
            env.update(
                {
                    "POSTGRES_BIN": str(binaries),
                    "LMS_ENV": "test",
                    "TEST_POSTGRES_ADMIN_URL": f"postgresql+psycopg://base02_test:{password}@127.0.0.1:{port}/postgres",
                    "TEST_POSTGRES_ALLOW_CREATE_DATABASE": "create-new-databases-only",
                    # Tests verify the live pid/data path/port of this minted cluster.
                    "TEST_POSTGRES_CLUSTER_DIRECTORY": str(root),
                }
            )
            print(
                "Running tests on a newly created disposable local cluster.", flush=True
            )
            result = subprocess.run(
                [sys.executable, "-m", "pytest", "-q"],
                cwd=BACKEND,
                env=env,
                check=False,
            )
            return result.returncode
        finally:
            # Stop only our own cluster, including after timeout/test failure.
            if (data / "postmaster.pid").exists():
                pg("pg_ctl", "-D", str(data), "-m", "fast", "-w", "-t", "30", "stop")


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as exc:
        detail = (
            str(exc)
            if isinstance(exc, RuntimeError)
            else "Check PostgreSQL tools and local filesystem permissions."
        )
        print(
            f"LOCAL_POSTGRES_VERIFICATION_FAILED error_type={type(exc).__name__}: {detail}",
            file=sys.stderr,
        )
        sys.exit(1)
