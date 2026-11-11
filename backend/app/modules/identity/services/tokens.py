import secrets, hashlib
from datetime import datetime, timezone

from uuid import uuid4, UUID

from sqlalchemy import update

from app.db.session import Session
from app.modules.identity.auth_models import IdentityActionToken
from app.modules.identity.constants import TokenPurpose, TOKEN_LIFETIMES
from app.modules.identity.services.repository import get_token_by_digest
from app.modules.identity.exceptions import (
  TokenInvalid, 
  TokenAlreadyUsed, 
  TokenExpired, 
  TokenRevoked 
)

def hash_token(token: str) -> bytes:
  return hashlib.sha256(token.encode("utf-8")).digest()


def generate_token() -> tuple[str, str]:
  raw_token = secrets.token_urlsafe(32)
  digest = hash_token(raw_token)

  return raw_token, digest


def create_action_token(
  session: Session,
  user_id: UUID,
  purpose: TokenPurpose
) -> bytes:
  
  raw_token, digest = generate_token()
  now = datetime.now(timezone.utc)

  session.add(
    IdentityActionToken(
      id = uuid4(),
      user_id = user_id,
      purpose = purpose,
      secret_digest = digest,
      created_at = now,
      expires_at = now + TOKEN_LIFETIMES[purpose]
    )
  )

  #TODO:REMOVE BEFORE PROD FOR TESTING ONLY
  print(f"Token created: {raw_token}")


  return raw_token


def consume_action_token(
    session:Session,
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
  
  now = datetime.now(timezone.utc)
  
  if token.expires_at <= now:
    raise TokenExpired()
  
  token.consumed_at = now

  return token.user_id

def revoke_token(
    session: Session,
    user_id: UUID,
    purpose: TokenPurpose = TokenPurpose.EMAIL_VERIFICATION,
    now: datetime = datetime.now(timezone.utc),
) -> None:
  
  statement = (update(IdentityActionToken).where(
          IdentityActionToken.user_id == user_id,
          IdentityActionToken.purpose == purpose,
          IdentityActionToken.consumed_at.is_(None),
          IdentityActionToken.revoked_at.is_(None),
      ).values(revoked_at=now)
  )

  session.execute(statement)
