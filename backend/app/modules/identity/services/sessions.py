from datetime import UTC, datetime, timedelta
from uuid import UUID, uuid4

from sqlalchemy import select, update
from sqlalchemy.orm import Session

from app.modules.identity.auth_models import IdentitySession
from app.modules.identity.exceptions import AuthenticationError, SessionNotFound
from app.modules.identity.models import User
from app.modules.identity.schemas import SessionResponse, SessionsResponse
from app.modules.identity.services.repository import (
  get_active_sessions,
  get_user_by_id,
  revoke_owned_session,
)
from app.modules.identity.services.tokens import generate_token, hash_token


def create_auth_session(
  session: Session,
  user_id: UUID,
) -> str:

  raw_token, digest = generate_token()

  now = datetime.now(UTC)

  session.add(
    IdentitySession(
      id=uuid4(),
      user_id=user_id,
      secret_digest=digest,
      created_at=now,
      last_interaction_at=now,
      absolute_expires_at=now + timedelta(days=30),
      revoked_at=None,
      password_reauthenticated_at=None,
    )
  )

  return raw_token


def revoke_auth_session(
  session: Session,
  raw_token: str,
) -> None:

  digest = hash_token(raw_token)

  now = datetime.now(UTC)

  statement = (
    update(IdentitySession)
    .where(
      IdentitySession.secret_digest == digest,
      IdentitySession.revoked_at.is_(None),
    )
    .values(revoked_at=now)
  )

  session.execute(statement)


def authenticate_session(
  session: Session,
  raw_token: str,
) -> User | None:

  digest = hash_token(raw_token)

  now = datetime.now(UTC)

  user_id = session.scalar(
    select(IdentitySession.user_id).where(
      IdentitySession.secret_digest == digest,
      IdentitySession.last_interaction_at > now - timedelta(days=7),
      IdentitySession.absolute_expires_at > now,
      IdentitySession.revoked_at.is_(None),
    )
  )

  if user_id is None:
    return None

  user = session.get(User, user_id)

  return user if user is not None and user.status != "blocked" else None


def require_session_owner(
  session: Session,
  raw_token: str,
) -> User:
  user = authenticate_session(session, raw_token)

  if user is None:
    raise AuthenticationError()

  # Serialize with login/recovery, then recheck after acquiring the account lock.
  user = get_user_by_id(session, user.id)

  if (
    user is None
    or user.status == "blocked"
    or authenticate_session(session, raw_token) is None
  ):
    raise AuthenticationError()

  return user


def list_auth_sessions(
  session: Session,
  raw_token: str,
  limit: int = 50,
  after: UUID | None = None,
) -> SessionsResponse:
  user = require_session_owner(session, raw_token)

  rows = get_active_sessions(
    session,
    user.id,
    datetime.now(UTC),
    limit + 1,
    after,
  )

  digest = hash_token(raw_token)

  return SessionsResponse(
    sessions=[
      SessionResponse(
        id=row.id,
        created_at=row.created_at,
        last_interaction_at=row.last_interaction_at,
        absolute_expires_at=row.absolute_expires_at,
        is_current=row.secret_digest == digest,
      )
      for row in rows[:limit]
    ],
    next_cursor=rows[limit - 1].id if len(rows) > limit else None,
  )


def revoke_owned_auth_session(
  session: Session,
  raw_token: str,
  session_id: UUID,
) -> UUID:
  user = require_session_owner(session, raw_token)

  if not revoke_owned_session(session, user.id, session_id, datetime.now(UTC)):
    raise SessionNotFound()

  return user.id
