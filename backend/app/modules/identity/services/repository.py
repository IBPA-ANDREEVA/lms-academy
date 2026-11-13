from datetime import datetime, timedelta
from uuid import UUID

from sqlalchemy import func, select, update
from sqlalchemy.orm import Session

from app.modules.identity.auth_models import (
  IdentityActionToken,
  IdentitySession,
  PasswordCredential,
)
from app.modules.identity.constants import TokenPurpose
from app.modules.identity.models import User


def get_user_by_email(
  session: Session,
  email: str,
) -> User | None:

  statement = (
    select(User)
    .where(func.lower(User.email) == email.strip().lower())
    .with_for_update()
  )

  return session.scalar(statement)


def get_user_by_id(
  session: Session,
  user_id: UUID,
) -> User | None:

  statement = (
    select(User)
    .where(User.id == user_id)
    .with_for_update()
    .execution_options(populate_existing=True)
  )

  return session.scalar(statement)


def get_token_by_digest(
  session: Session,
  digest: bytes,
  purpose: TokenPurpose,
) -> IdentityActionToken | None:

  statement = (
    select(IdentityActionToken)
    .where(
      IdentityActionToken.secret_digest == digest,
      IdentityActionToken.purpose == purpose,
      IdentityActionToken.revoked_at.is_(None),
    )
    .with_for_update()
    .execution_options(populate_existing=True)
  )

  return session.scalar(statement)


def get_last_token_time(
  session: Session,
  user_id: UUID,
  purpose: TokenPurpose,
) -> datetime | None:

  statement = (
    select(IdentityActionToken.created_at)
    .where(
      IdentityActionToken.user_id == user_id,
      IdentityActionToken.purpose == purpose,
    )
    .order_by(IdentityActionToken.created_at.desc())
    .limit(1)
  )

  return session.scalar(statement)


def get_password_credentials(
  session: Session,
  user_id: UUID,
) -> PasswordCredential | None:

  return session.get(PasswordCredential, user_id)


def get_action_token_owner(
  session: Session,
  digest: bytes,
  purpose: TokenPurpose,
) -> UUID | None:
  # Read identity first; all action-token writes lock user before token to avoid
  # deadlocks between replacement requests and consumption.
  return session.scalar(
    select(IdentityActionToken.user_id).where(
      IdentityActionToken.secret_digest == digest,
      IdentityActionToken.purpose == purpose,
    )
  )


def get_active_sessions(
  session: Session,
  user_id: UUID,
  now: datetime,
  limit: int,
  after: UUID | None,
) -> list[IdentitySession]:
  statement = select(IdentitySession).where(
    IdentitySession.user_id == user_id,
    IdentitySession.revoked_at.is_(None),
    IdentitySession.absolute_expires_at > now,
    IdentitySession.last_interaction_at > now - timedelta(days=7),
  )

  if after is not None:
    statement = statement.where(IdentitySession.id > after)

  return list(session.scalars(statement.order_by(IdentitySession.id).limit(limit)))


def revoke_owned_session(
  session: Session,
  user_id: UUID,
  session_id: UUID,
  now: datetime,
) -> bool:
  owned = session.scalar(
    select(IdentitySession)
    .where(
      IdentitySession.id == session_id,
      IdentitySession.user_id == user_id,
    )
    .with_for_update()
  )

  if owned is None:
    return False

  if owned.revoked_at is None:
    owned.revoked_at = now

  return True


def revoke_all_sessions(
  session: Session,
  user_id: UUID,
  now: datetime,
) -> None:
  session.execute(
    update(IdentitySession)
    .where(
      IdentitySession.user_id == user_id,
      IdentitySession.revoked_at.is_(None),
    )
    .values(revoked_at=now)
  )
