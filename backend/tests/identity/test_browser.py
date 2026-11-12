"""Opt-in production-browser integration, only on the verifier's minted database.

Build .next-auth-qa with API_INTERNAL_ORIGIN=http://127.0.0.1:8015 first.
Run TEST_IDENTITY_BROWSER=1 scripts/verify_postgres.py with Playwright available.
"""

import os
import socket
import subprocess
import sys
import time
from datetime import UTC, datetime, timedelta
from pathlib import Path
from uuid import uuid4

import httpx
import pytest
from alembic import command
from alembic.config import Config
from sqlalchemy import select
from sqlalchemy.engine import URL

from app.db.session import ApplicationDatabase, ApplicationDatabaseSettings
from app.modules.identity.auth_models import IdentityActionToken, PasswordCredential
from app.modules.identity.constants import TokenPurpose
from app.modules.identity.models import User
from app.modules.identity.services.passwords import hash_password, verify_password
from app.modules.identity.services.sessions import create_auth_session
from app.modules.identity.services.tokens import hash_token


@pytest.mark.skipif(
  os.environ.get("TEST_IDENTITY_BROWSER") != "1",
  reason="Opt-in browser integration; requires the isolated production frontend build",
)
def test_real_browser_auth(
  disposable_database: URL,
  monkeypatch: pytest.MonkeyPatch,
) -> None:
  for port in (8015, 3115):
    with socket.socket() as listener:
      listener.bind(("127.0.0.1", port))
  backend = Path(__file__).resolve().parents[2]
  root = backend.parent
  url = disposable_database.render_as_string(hide_password=False)
  monkeypatch.setenv("LMS_ENV", "test")
  monkeypatch.setenv("MIGRATION_DATABASE_URL", url)
  command.upgrade(Config("alembic.ini"), "head")
  database = ApplicationDatabase(ApplicationDatabaseSettings(disposable_database))
  user_id = uuid4()
  verification = uuid4().hex
  recovery = uuid4().hex
  now = datetime.now(UTC)
  try:
    with database.unit_of_work() as session:
      session.add(
        User(
          id=user_id, email="browser@example.com", roles=["student"], status="pending"
        )
      )
      session.flush()
      session.add(
        PasswordCredential(
          user_id=user_id, password_hash=hash_password("old-test-password")
        )
      )
      for purpose, raw in (
        (TokenPurpose.EMAIL_VERIFICATION, verification),
        (TokenPurpose.PASSWORD_RESET, recovery),
      ):
        session.add(
          IdentityActionToken(
            id=uuid4(),
            user_id=user_id,
            purpose=purpose,
            secret_digest=hash_token(raw),
            created_at=now,
            expires_at=now + timedelta(minutes=30),
          )
        )
      create_auth_session(session, user_id)
    env = {
      **os.environ,
      "DATABASE_URL": url,
      "IDENTITY_PUBLIC_ORIGIN": "http://localhost:3115",
      "LMS_BUILD_DIR": ".next-auth-qa",
      "TEST_PREVIEW": "false",
      "API_INTERNAL_ORIGIN": "http://127.0.0.1:8015",
      "FRONTEND_URL": "http://localhost:3115",
      "AUTH_TEST_VERIFICATION": verification,
      "AUTH_TEST_RECOVERY": recovery,
    }
    processes: list[subprocess.Popen[bytes]] = []
    try:
      processes.append(
        subprocess.Popen(
          [
            sys.executable,
            "-m",
            "uvicorn",
            "app.main:app",
            "--host",
            "127.0.0.1",
            "--port",
            "8015",
            "--no-access-log",
          ],
          cwd=backend,
          env=env,
          stdout=subprocess.DEVNULL,
          stderr=subprocess.DEVNULL,
        )
      )
      processes.append(
        subprocess.Popen(
          ["node", "node_modules/next/dist/bin/next", "start", "--port", "3115"],
          cwd=root,
          env=env,
          stdout=subprocess.DEVNULL,
          stderr=subprocess.DEVNULL,
        )
      )
      for address in ("http://127.0.0.1:8015/health", "http://localhost:3115/login"):
        for _ in range(100):
          assert all(process.poll() is None for process in processes), (
            "Owned test server exited"
          )
          try:
            if httpx.get(address, timeout=1).status_code == 200:
              break
          except httpx.HTTPError:
            pass
          time.sleep(0.1)
        else:
          pytest.fail("Owned test server did not become ready")
      result = subprocess.run(
        ["node", "tests/auth-integration.browser.mjs"],
        cwd=root,
        env=env,
        capture_output=True,
        text=True,
        timeout=240,
        check=False,
      )
      assert result.returncode == 0, result.stdout + result.stderr
      with database.unit_of_work() as session:
        user = session.get(User, user_id)
        credential = session.get(PasswordCredential, user_id)
        assert user and user.email_verified_at is not None
        assert credential and verify_password(
          "new-test-password", credential.password_hash
        )
        assert all(
          token.consumed_at is not None
          for token in session.scalars(
            select(IdentityActionToken).where(IdentityActionToken.user_id == user_id)
          )
        )
    finally:
      for process in reversed(processes):
        process.terminate()
        try:
          process.wait(timeout=10)
        except subprocess.TimeoutExpired:
          process.kill()
          process.wait(timeout=5)
  finally:
    database.dispose()
