from uuid import uuid4

from sqlalchemy.exc import IntegrityError

from app.db.session import ApplicationDatabase
from app.modules.identity.auth_models import PasswordCredential
from app.modules.identity.constants import TokenPurpose
from app.modules.identity.exceptions import EmailAlreadyRegistered
from app.modules.identity.models import Profile, User
from app.modules.identity.services.passwords import hash_password
from app.modules.identity.services.repository import get_user_by_email
from app.modules.identity.services.tokens import create_action_token


def register_student(
  db: ApplicationDatabase,
  first_name: str,
  last_name: str,
  email: str,
  password: str,
) -> tuple[str, str]:

  try:
    with db.unit_of_work() as session:
      if get_user_by_email(session, email) is not None:
        raise EmailAlreadyRegistered()

      user_id = uuid4()

      user = User(
        id=user_id,
        email=email.strip().lower(),
        roles=["student"],
        status="pending",
      )

      session.add(user)
      session.flush()

      session.add(
        Profile(
          user_id=user_id,
          first_name=first_name,
          last_name=last_name,
        )
      )

      session.add(
        PasswordCredential(
          user_id=user_id,
          password_hash=hash_password(password),
        )
      )

      return user.email, create_action_token(
        session, user_id, TokenPurpose.EMAIL_VERIFICATION
      )

  except IntegrityError as exc:
    constraint = getattr(
      getattr(exc.orig, "diag", None),
      "constraint_name",
      None,
    )

    if constraint == "uq_users_email_ci":
      raise EmailAlreadyRegistered() from None

    raise
