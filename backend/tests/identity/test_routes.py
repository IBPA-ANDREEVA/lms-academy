"""API/persistence checks on a newly minted PostgreSQL database only."""

from collections.abc import Iterator
from concurrent.futures import ThreadPoolExecutor
from datetime import UTC, datetime, timedelta
from typing import cast
from unittest.mock import Mock
from uuid import UUID, uuid4

import pytest
from alembic import command
from alembic.config import Config
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.engine import URL

from app.api.router import api_router
from app.db.session import ApplicationDatabase, ApplicationDatabaseSettings
from app.integrations.resend_email import ResendEmailSender
from app.modules.identity.auth_models import (
  IdentityActionToken,
  IdentitySession,
  PasswordCredential,
)
from app.modules.identity.constants import TokenPurpose
from app.modules.identity.models import Profile, User
from app.modules.identity.services.passwords import hash_password, verify_password
from app.modules.identity.services.sessions import create_auth_session
from app.modules.identity.services.tokens import hash_token
from app.modules.notifications.email_service import EmailService


@pytest.fixture
def db(
  disposable_database: URL, monkeypatch: pytest.MonkeyPatch
) -> Iterator[ApplicationDatabase]:
  monkeypatch.setenv("LMS_ENV", "test")
  monkeypatch.setenv(
    "MIGRATION_DATABASE_URL", disposable_database.render_as_string(hide_password=False)
  )
  command.upgrade(Config("alembic.ini"), "head")
  database = ApplicationDatabase(ApplicationDatabaseSettings(disposable_database))
  yield database
  database.dispose()


@pytest.fixture
def client(db: ApplicationDatabase) -> TestClient:
  application = FastAPI()
  application.state.database = db
  application.state.email_service = EmailService(
    sender=Mock(spec=ResendEmailSender),
    app_base_url="https://academy.example",
  )
  application.include_router(api_router)
  return TestClient(application)


def account(
  db: ApplicationDatabase, *, roles: list[str] | None = None
) -> tuple[UUID, str, UUID]:
  user_id = uuid4()
  with db.unit_of_work() as session:
    session.add(
      User(
        id=user_id,
        email=f"{user_id}@example.com",
        roles=roles or ["student"],
        status="active",
      )
    )
    session.flush()
    session.add(
      PasswordCredential(user_id=user_id, password_hash=hash_password("old-password"))
    )
    raw = create_auth_session(session, user_id)
    session.flush()
    session_id = session.scalar(
      select(IdentitySession.id).where(IdentitySession.user_id == user_id)
    )
    assert session_id is not None
  return user_id, raw, session_id


def recovery_token(db: ApplicationDatabase, user_id: UUID, **changes: object) -> str:
  raw = str(uuid4())
  now = datetime.now(UTC)
  values: dict[str, object] = dict(
    id=uuid4(),
    user_id=user_id,
    purpose=TokenPurpose.PASSWORD_RESET,
    secret_digest=hash_token(raw),
    created_at=now,
    expires_at=now + timedelta(minutes=30),
  )
  values.update(changes)
  with db.unit_of_work() as session:
    session.add(IdentityActionToken(**values))
  return raw


def test_owned_sessions_and_revocation(
  db: ApplicationDatabase, client: TestClient
) -> None:
  user_id, raw, current_id = account(db)
  _, _, foreign_id = account(db)
  with db.unit_of_work() as session:
    create_auth_session(session, user_id)
  client.cookies.set("lms-session", raw)
  response = client.get("/api/v1/auth/sessions?limit=1")
  assert response.status_code == 200
  assert response.headers["cache-control"] == "no-store"
  data = response.json()
  assert len(data["sessions"]) == 1 and data["next_cursor"]
  following = client.get(f"/api/v1/auth/sessions?after={data['next_cursor']}").json()
  rows = data["sessions"] + following["sessions"]
  assert len(rows) == 2 and sum(row["is_current"] for row in rows) == 1
  assert "secret_digest" not in response.text and raw not in response.text
  assert client.delete(f"/api/v1/auth/sessions/{current_id}").status_code == 403
  assert (
    client.delete(
      f"/api/v1/auth/sessions/{current_id}",
      headers={"Origin": "https://foreign.example"},
    ).status_code
    == 403
  )
  headers = {"Origin": "http://testserver"}
  assert (
    client.delete(f"/api/v1/auth/sessions/{foreign_id}", headers=headers).status_code
    == 404
  )
  assert (
    client.delete(f"/api/v1/auth/sessions/{current_id}", headers=headers).status_code
    == 200
  )
  assert client.get("/api/v1/auth/sessions").status_code == 401


@pytest.mark.parametrize("state", ["expired", "idle", "blocked", "revoked"])
def test_unusable_sessions(
  db: ApplicationDatabase, client: TestClient, state: str
) -> None:
  user_id, raw, session_id = account(db)
  with db.unit_of_work() as session:
    row = session.get(IdentitySession, session_id)
    user = session.get(User, user_id)
    assert row and user
    now = datetime.now(UTC)
    if state == "blocked":
      user.status = "blocked"
    elif state == "revoked":
      row.revoked_at = now
    else:
      row.created_at = now - timedelta(days=40)
      row.last_interaction_at = now - timedelta(days=8)
      if state == "expired":
        row.absolute_expires_at = now - timedelta(seconds=1)
  client.cookies.set("lms-session", raw)
  assert client.get("/api/v1/auth/sessions").status_code == 401


def test_recovery_request_replaces_token_without_disclosure(
  db: ApplicationDatabase, client: TestClient, capsys: pytest.CaptureFixture[str]
) -> None:
  user_id, _, _ = account(db)
  admin_id, _, _ = account(db, roles=["student", "admin"])
  old = recovery_token(db, user_id)
  responses = [
    client.post("/api/v1/auth/password/forgot", json={"email": email})
    for email in (
      f"{user_id}@example.com",
      "unknown@example.com",
      f"{admin_id}@example.com",
    )
  ]
  assert all(response.status_code == 200 for response in responses)
  assert responses[0].json() == responses[1].json() == responses[2].json()
  with db.unit_of_work() as session:
    tokens = list(session.scalars(select(IdentityActionToken)))
    assert len(tokens) == 2
    previous = next(token for token in tokens if token.secret_digest == hash_token(old))
    current = next(token for token in tokens if token.secret_digest != hash_token(old))
    assert previous.revoked_at is not None
    assert current.expires_at - current.created_at == timedelta(minutes=30)
  assert capsys.readouterr().out == ""


def test_reset_atomic_and_single_use(
  db: ApplicationDatabase, client: TestClient
) -> None:
  user_id, raw, _ = account(db)
  _, foreign_raw, _ = account(db)
  with db.unit_of_work() as session:
    create_auth_session(session, user_id)
  token = recovery_token(db, user_id)
  other = recovery_token(db, user_id)
  response = client.post(
    "/api/v1/auth/password/reset", json={"token": token, "password": "new-password"}
  )
  assert response.status_code == 200
  with db.unit_of_work() as session:
    credential = session.get(PasswordCredential, user_id)
    assert credential and verify_password("new-password", credential.password_hash)
    assert all(
      row.revoked_at
      for row in session.scalars(
        select(IdentitySession).where(IdentitySession.user_id == user_id)
      )
    )
  for invalid in (token, other):
    assert (
      client.post(
        "/api/v1/auth/password/reset",
        json={"token": invalid, "password": "another-password"},
      ).status_code
      == 400
    )
  client.cookies.set("lms-session", raw)
  assert client.get("/api/v1/auth/sessions").status_code == 401
  client.cookies.set("lms-session", foreign_raw)
  assert client.get("/api/v1/auth/sessions").status_code == 200


@pytest.mark.parametrize(
  "invalid", ["expired", "consumed", "revoked", "purpose", "admin", "unknown"]
)
def test_invalid_reset_does_not_change_credentials(
  db: ApplicationDatabase, client: TestClient, invalid: str
) -> None:
  user_id, raw, _ = account(db, roles=["admin"] if invalid == "admin" else None)
  changes: dict[str, object] = {}
  now = datetime.now(UTC)
  if invalid == "expired":
    changes.update(
      created_at=now - timedelta(hours=1), expires_at=now - timedelta(seconds=1)
    )
  elif invalid in ("consumed", "revoked"):
    changes[f"{invalid}_at"] = now
  elif invalid == "purpose":
    changes["purpose"] = TokenPurpose.EMAIL_VERIFICATION
  token = recovery_token(db, user_id, **changes) if invalid != "unknown" else "unknown"
  assert (
    client.post(
      "/api/v1/auth/password/reset", json={"token": token, "password": "new-password"}
    ).status_code
    == 400
  )
  with db.unit_of_work() as session:
    credential = session.get(PasswordCredential, user_id)
    assert credential and verify_password("old-password", credential.password_hash)
  client.cookies.set("lms-session", raw)
  assert client.get("/api/v1/auth/sessions").status_code == 200


def test_concurrent_consumption(db: ApplicationDatabase, client: TestClient) -> None:
  user_id, _, _ = account(db)
  token = recovery_token(db, user_id)

  def attempt(index: int) -> int:
    return int(
      client.post(
        "/api/v1/auth/password/reset",
        json={"token": token, "password": f"new-password-{index}"},
      ).status_code
    )

  with ThreadPoolExecutor(max_workers=2) as executor:
    assert sorted(executor.map(attempt, range(2))) == [200, 400]


@pytest.mark.parametrize(
  ("path", "payload"),
  [
    ("/password/reset", {"token": "private-token", "password": "short"}),
    ("/login", {"email": "private@example.com", "password": "short"}),
    (
      "/register",
      {
        "first_name": "Test",
        "last_name": "Student",
        "email": "private@example.com",
        "password": "short",
      },
    ),
  ],
)
def test_validation_does_not_echo_secrets(
  path: str,
  payload: dict[str, str],
  caplog: pytest.LogCaptureFixture,
) -> None:
  application = FastAPI()
  application.include_router(api_router)
  client = TestClient(application)

  response = client.post("/api/v1/auth" + path, json=payload)

  assert response.status_code == 422
  assert response.headers["cache-control"] == "no-store"
  assert response.json()["detail"]["code"] == "invalid_request"
  assert UUID(response.json()["detail"]["correlation_id"])
  for value in payload.values():
    assert value not in response.text
    assert value not in caplog.text
  assert client.get("/api/v1/auth/sessions?limit=101").status_code == 422


@pytest.mark.parametrize("field", ["first_name", "last_name"])
@pytest.mark.parametrize("length", [101, 128])
def test_registration_rejects_oversized_names(
  field: str,
  length: int,
) -> None:
  application = FastAPI()
  application.include_router(api_router)
  client = TestClient(application)
  payload = {
    "first_name": "Test",
    "last_name": "Student",
    "email": "boundary@example.com",
    "password": "test-password",
  }
  payload[field] = "Я" * length

  response = client.post("/api/v1/auth/register", json=payload)

  # No database is configured: rejection must happen before persistence.
  assert response.status_code == 422
  assert response.json()["detail"]["code"] == "invalid_request"


def test_registration_persists_maximum_length_names(
  db: ApplicationDatabase,
  client: TestClient,
) -> None:
  response = client.post(
    "/api/v1/auth/register",
    json={
      "first_name": "Я" * 100,
      "last_name": "Ю" * 100,
      "email": "boundary@example.com",
      "password": "test-password",
    },
  )

  assert response.status_code == 201
  with db.unit_of_work() as session:
    profile = session.scalar(
      select(Profile).join(User).where(User.email == "boundary@example.com")
    )
    assert profile is not None
    assert profile.first_name == "Я" * 100
    assert profile.last_name == "Ю" * 100


def test_reset_failure_rolls_back_consumption(
  db: ApplicationDatabase, client: TestClient, monkeypatch: pytest.MonkeyPatch
) -> None:
  from app.modules.identity.services import resets

  user_id, raw, _ = account(db)
  token = recovery_token(db, user_id)

  def failed_hash(password: str) -> str:
    raise RuntimeError("synthetic hashing failure")

  with monkeypatch.context() as patch:
    patch.setattr(resets, "hash_password", failed_hash)
    response = client.post(
      "/api/v1/auth/password/reset", json={"token": token, "password": "new-password"}
    )
    assert response.status_code == 500
    assert "synthetic" not in response.text
  client.cookies.set("lms-session", raw)
  assert client.get("/api/v1/auth/sessions").status_code == 200
  assert (
    client.post(
      "/api/v1/auth/password/reset", json={"token": token, "password": "new-password"}
    ).status_code
    == 200
  )


def test_me_handles_absent_optional_profile(
  db: ApplicationDatabase, client: TestClient
) -> None:
  user_id, raw, _ = account(db)
  client.cookies.set("lms-session", raw)
  response = client.get("/api/v1/auth/me")
  assert response.status_code == 200
  assert response.json()["id"] == str(user_id)
  assert response.json()["first_name"] is None
  assert response.json()["last_name"] is None


def test_email_delivery_after_commit_and_verification(
  db: ApplicationDatabase,
  client: TestClient,
) -> None:
  from urllib.parse import parse_qs, urlsplit

  sender = Mock(spec=ResendEmailSender)
  delivered: list[str] = []

  def send(**kwargs: str) -> str:
    url = kwargs["text"].splitlines()[0].split(": ", 1)[1]
    token = parse_qs(urlsplit(url).query)["token"][0]
    # A separate connection sees the token only once the request has committed.
    with db.unit_of_work() as session:
      row = session.scalar(
        select(IdentityActionToken).where(
          IdentityActionToken.secret_digest == hash_token(token),
        )
      )
      assert row is not None
      if row.purpose == TokenPurpose.EMAIL_VERIFICATION:
        assert row.expires_at - row.created_at == timedelta(hours=48)
    delivered.append(token)
    return "synthetic-provider-id"

  sender.send.side_effect = send
  cast(FastAPI, client.app).state.email_service = EmailService(
    sender, "https://academy.example"
  )
  payload = {
    "first_name": "Test",
    "last_name": "Student",
    "email": "delivery@example.com",
    "password": "test-password",
  }
  assert client.post("/api/v1/auth/register", json=payload).status_code == 201
  with db.unit_of_work() as session:
    row = session.scalar(
      select(IdentityActionToken).where(
        IdentityActionToken.secret_digest == hash_token(delivered[0]),
      )
    )
    assert row is not None
    row.created_at -= timedelta(minutes=2)
  assert (
    client.post(
      "/api/v1/auth/resend_verify_email", json={"email": payload["email"]}
    ).status_code
    == 201
  )
  assert (
    client.post("/api/v1/auth/verify-email", json={"token": delivered[-1]}).status_code
    == 200
  )
  with db.unit_of_work() as session:
    user = session.scalar(select(User).where(User.email == payload["email"]))
    assert user and user.status == "active" and user.email_verified_at is not None
  assert (
    client.post(
      "/api/v1/auth/password/forgot", json={"email": payload["email"]}
    ).status_code
    == 200
  )
  assert len(delivered) == 3
  assert (
    client.post(
      "/api/v1/auth/password/reset",
      json={"token": delivered[-1], "password": "new-password"},
    ).status_code
    == 200
  )
  assert (
    client.post(
      "/api/v1/auth/resend_verify_email", json={"email": "unknown@example.com"}
    ).status_code
    == 201
  )
  assert len(delivered) == 3


def test_delivery_failure_preserves_generic_recovery_response(
  db: ApplicationDatabase,
  client: TestClient,
) -> None:
  from app.integrations.resend_email import EmailDeliveryError

  sender = Mock(spec=ResendEmailSender)
  sender.send.side_effect = EmailDeliveryError()
  cast(FastAPI, client.app).state.email_service = EmailService(
    sender, "https://academy.example"
  )
  user_id, _, _ = account(db)
  known = client.post(
    "/api/v1/auth/password/forgot", json={"email": f"{user_id}@example.com"}
  )
  unknown = client.post(
    "/api/v1/auth/password/forgot", json={"email": "unknown@example.com"}
  )
  assert known.status_code == unknown.status_code == 200
  assert known.json() == unknown.json()
  response = client.post(
    "/api/v1/auth/register",
    json={
      "first_name": "Test",
      "last_name": "Student",
      "email": "failed-delivery@example.com",
      "password": "test-password",
    },
  )
  assert response.status_code == 503
  assert response.json()["detail"]["code"] == "verification_delivery_failed"
  with db.unit_of_work() as session:
    assert (
      session.scalar(select(User).where(User.email == "failed-delivery@example.com"))
      is not None
    )


def test_secure_cookie_login_logout(
  db: ApplicationDatabase,
  client: TestClient,
) -> None:
  client.base_url = "https://testserver"
  user_id, _, _ = account(db)
  headers = {"Origin": "https://testserver"}
  response = client.post(
    "/api/v1/auth/login",
    headers=headers,
    json={
      "email": f"{user_id}@example.com",
      "password": "old-password",
    },
  )
  assert response.status_code == 200
  cookie = response.headers["set-cookie"]
  for attribute in ("Secure", "HttpOnly", "SameSite=lax", "Path=/", "Max-Age=2592000"):
    assert attribute in cookie
  assert "Domain=" not in cookie
  assert client.get("/api/v1/auth/me").status_code == 200
  raw = client.cookies.get("lms-session")
  response = client.post("/api/v1/auth/logout", headers=headers)
  assert response.status_code == 200
  assert "Max-Age=0" in response.headers["set-cookie"]
  for attribute in ("Secure", "HttpOnly", "SameSite=lax"):
    assert attribute in response.headers["set-cookie"]
  assert raw is not None
  client.cookies.set("lms-session", raw)
  assert client.get("/api/v1/auth/sessions").status_code == 401


def test_concurrent_verification_and_resend(
  db: ApplicationDatabase,
  client: TestClient,
) -> None:
  from app.modules.identity.services.tokens import create_action_token

  user_id, _, _ = account(db)
  with db.unit_of_work() as session:
    user = session.get(User, user_id)
    assert user is not None
    user.status = "pending"
    token = create_action_token(session, user_id, TokenPurpose.EMAIL_VERIFICATION)
    session.flush()
    row = session.scalar(
      select(IdentityActionToken).where(
        IdentityActionToken.secret_digest == hash_token(token),
      )
    )
    assert row is not None
    row.created_at -= timedelta(minutes=2)

  def attempt(index: int) -> int:
    if index == 0:
      return int(
        client.post("/api/v1/auth/verify-email", json={"token": token}).status_code
      )
    return int(
      client.post(
        "/api/v1/auth/resend_verify_email", json={"email": f"{user_id}@example.com"}
      ).status_code
    )

  with ThreadPoolExecutor(max_workers=2) as executor:
    verification, resend = list(executor.map(attempt, range(2)))
  assert verification in {200, 400}
  assert resend == 201


def test_commit_failure_does_not_send_email(
  db: ApplicationDatabase,
  client: TestClient,
) -> None:
  from sqlalchemy import event
  from sqlalchemy.orm import Session

  sender = Mock(spec=ResendEmailSender)
  cast(FastAPI, client.app).state.email_service = EmailService(
    sender, "https://academy.example"
  )

  def fail_commit(session: Session) -> None:
    raise RuntimeError("synthetic commit failure")

  event.listen(db.sessions, "before_commit", fail_commit)
  try:
    response = client.post(
      "/api/v1/auth/register",
      json={
        "first_name": "Test",
        "last_name": "Student",
        "email": "rollback@example.com",
        "password": "test-password",
      },
    )
  finally:
    event.remove(db.sessions, "before_commit", fail_commit)
  assert response.status_code == 500
  sender.send.assert_not_called()
  with db.unit_of_work() as session:
    assert (
      session.scalar(select(User).where(User.email == "rollback@example.com")) is None
    )
