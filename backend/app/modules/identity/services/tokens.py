import hashlib
import secrets
from datetime import UTC, datetime
from uuid import UUID, uuid4

from sqlalchemy import update
from sqlalchemy.orm import Session

from app.modules.identity.auth_models import IdentityActionToken
from app.modules.identity.constants import TOKEN_LIFETIMES, TokenPurpose
from app.modules.identity.exceptions import (
  TokenAlreadyUsed,
  TokenExpired,
  TokenInvalid,
  TokenRevoked,
)
from app.modules.identity.services.repository import get_token_by_digest


def hash_token(token: str) -> bytes:
  return hashlib.sha256(token.encode("utf-8")).digest()


def generate_token() -> tuple[str, bytes]:
  raw_token = secrets.token_urlsafe(32)
  digest = hash_token(raw_token)

  return raw_token, digest


def create_action_token(
  session: Session,
  user_id: UUID,
  purpose: TokenPurpose,
) -> str:

  raw_token, digest = generate_token()
  now = datetime.now(UTC)

  session.add(
    IdentityActionToken(
      id=uuid4(),
      user_id=user_id,
      purpose=purpose,
      secret_digest=digest,
      created_at=now,
      expires_at=now + TOKEN_LIFETIMES[purpose],
    )
  )

  return raw_token


def consume_action_token(
  session: Session,
  raw_token: str,
  purpose: TokenPurpose,
) -> UUID:
  digest = hash_token(raw_token)

  token = get_token_by_digest(session, digest, purpose)

  if token is None:
    raise TokenInvalid()

  if token.consumed_at is not None:
    raise TokenAlreadyUsed()

  if token.revoked_at is not None:
    raise TokenRevoked()

  now = datetime.now(UTC)

  if token.expires_at <= now:
    raise TokenExpired()

  token.consumed_at = now

  return token.user_id


def revoke_token(
  session: Session,
  user_id: UUID,
  purpose: TokenPurpose = TokenPurpose.EMAIL_VERIFICATION,
  now: datetime | None = None,
) -> None:

  now = now or datetime.now(UTC)

  statement = (
    update(IdentityActionToken)
    .where(
      IdentityActionToken.user_id == user_id,
      IdentityActionToken.purpose == purpose,
      IdentityActionToken.consumed_at.is_(None),
      IdentityActionToken.revoked_at.is_(None),
    )
    .values(revoked_at=now)
  )

  session.execute(statement)
