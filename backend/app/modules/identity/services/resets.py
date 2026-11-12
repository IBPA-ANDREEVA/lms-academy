"""Recovery operations participate in the caller's single transaction."""

from datetime import UTC, datetime
from uuid import UUID, uuid4

from sqlalchemy.orm import Session

from app.modules.identity.auth_models import IdentityActionToken
from app.modules.identity.constants import TOKEN_LIFETIMES, TokenPurpose
from app.modules.identity.exceptions import TokenInvalid
from app.modules.identity.services.passwords import hash_password
from app.modules.identity.services.repository import (
  get_password_credentials,
  get_reset_token_owner,
  get_user_by_email,
  get_user_by_id,
  revoke_all_sessions,
)
from app.modules.identity.services.tokens import (
  consume_action_token,
  generate_token,
  hash_token,
  revoke_token,
)


def request_password_reset(session: Session, email: str) -> None:
  user = get_user_by_email(session, email)
  if user is None or user.status == "blocked" or "admin" in user.roles:
    return
  if get_password_credentials(session, user.id) is None:
    return
  now = datetime.now(UTC)
  revoke_token(session, user.id, TokenPurpose.PASSWORD_RESET, now)
  raw_token, digest = generate_token()
  session.add(
    IdentityActionToken(
      id=uuid4(),
      user_id=user.id,
      purpose=TokenPurpose.PASSWORD_RESET,
      secret_digest=digest,
      created_at=now,
      expires_at=now + TOKEN_LIFETIMES[TokenPurpose.PASSWORD_RESET],
    )
  )
  # TODO: Add email sending through a durable delivery intent before production.
  # Never log or return the raw secret. Delivery is deliberately not implemented.
  del raw_token


def reset_password(session: Session, raw_token: str, password: str) -> UUID:
  user_id = get_reset_token_owner(session, hash_token(raw_token))
  if user_id is None:
    raise TokenInvalid()
  user = get_user_by_id(session, user_id)
  if user is None or user.status == "blocked" or "admin" in user.roles:
    raise TokenInvalid()
  credential = get_password_credentials(session, user.id)
  if credential is None:
    raise TokenInvalid()
  consume_action_token(session, raw_token, TokenPurpose.PASSWORD_RESET)
  now = datetime.now(UTC)
  credential.password_hash = hash_password(password)
  credential.updated_at = now
  revoke_all_sessions(session, user.id, now)
  revoke_token(session, user.id, TokenPurpose.PASSWORD_RESET, now)
  return user.id
