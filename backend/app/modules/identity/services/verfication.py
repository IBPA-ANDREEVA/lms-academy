from datetime import UTC, datetime, timedelta

from sqlalchemy.orm import Session

from app.modules.identity.constants import TokenPurpose
from app.modules.identity.exceptions import ResendWasSentEarlier, UserNotFound
from app.modules.identity.services.repository import (
  get_last_token_time,
  get_user_by_email,
  get_user_by_id,
)
from app.modules.identity.services.tokens import (
  consume_action_token,
  create_action_token,
  revoke_token,
)


def verify_email(
  session: Session,
  raw_token: str,
) -> None:

  user_id = consume_action_token(session, raw_token, TokenPurpose.EMAIL_VERIFICATION)

  user = get_user_by_id(session, user_id)

  if user is None:
    raise UserNotFound()

  user.status = "active"


def resend_verification(
  session: Session,
  email: str,
) -> tuple[str, str] | None:

  now = datetime.now(UTC)

  user = get_user_by_email(session, email)

  purpose = TokenPurpose.EMAIL_VERIFICATION

  if user is None or user.status != "pending":
    return None

  last_verification_time = get_last_token_time(session, user.id, purpose)

  # 60-second resend cooldown
  if last_verification_time is not None and (now - last_verification_time) < timedelta(
    seconds=60
  ):
    raise ResendWasSentEarlier()

  revoke_token(session, user.id, purpose, now)

  raw_token = create_action_token(session, user.id, purpose)

  return email, raw_token
