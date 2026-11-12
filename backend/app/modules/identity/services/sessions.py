from datetime import UTC, datetime, timedelta
from uuid import UUID, uuid4

from sqlalchemy import select, update
from sqlalchemy.orm import Session

from app.modules.identity.auth_models import IdentitySession
from app.modules.identity.models import User
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
    )
    .values(revoked_at=now)
  )

  session.execute(statement)


def authenticate_session(session: Session, raw_token: str) -> User | None:

  digest = hash_token(raw_token)

  now = datetime.now(UTC)

  user_id = session.scalar(
    select(IdentitySession.user_id).where(
      IdentitySession.secret_digest == digest,
      IdentitySession.last_interaction_at > now - timedelta(days=7),
      IdentitySession.absolute_expires_at > now,
      IdentitySession.revoked_at == None,
    )
  )

  return session.get(User, user_id)
