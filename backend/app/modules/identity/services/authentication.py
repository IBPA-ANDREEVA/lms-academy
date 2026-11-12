from sqlalchemy.orm import Session

from app.modules.identity.exceptions import AccountBlocked, InvalidCredentials
from app.modules.identity.models import User
from app.modules.identity.services.passwords import verify_password
from app.modules.identity.services.repository import (
  get_password_credentials,
  get_user_by_email,
)


def authenticate_user(
  session: Session,
  email: str,
  password: str,
) -> User:

  user = get_user_by_email(session, email)

  if user is None:
    raise InvalidCredentials

  if user.status == "blocked":
    raise AccountBlocked

  password_credential = get_password_credentials(session, user.id)

  if password_credential is None:
    raise InvalidCredentials

  if not verify_password(password, password_credential.password_hash):
    raise InvalidCredentials

  return user
