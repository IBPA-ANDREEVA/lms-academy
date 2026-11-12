from typing import cast

from fastapi import Depends, Request
from fastapi.security import APIKeyCookie

from app.db.session import ApplicationDatabase
from app.modules.identity.exceptions import AuthenticationError
from app.modules.identity.http import identity_error
from app.modules.identity.models import Profile
from app.modules.identity.schemas import CurrentUserResponse
from app.modules.identity.services.sessions import require_session_owner

session_cookie = APIKeyCookie(name="lms-session", auto_error=False)


def get_current_user(
  request: Request,
  credential: str | None = Depends(session_cookie),
) -> CurrentUserResponse:
  db = cast(ApplicationDatabase, request.app.state.database)

  try:
    with db.unit_of_work() as session:
      user = require_session_owner(session, credential or "")
      profile = session.get(Profile, user.id)

      return CurrentUserResponse(
        id=user.id,
        email=user.email,
        first_name=profile.first_name if profile else None,
        last_name=profile.last_name if profile else None,
        roles=user.roles,
        status=user.status,
        email_verified_at=user.email_verified_at,
      )

  except AuthenticationError:
    raise identity_error(
      401,
      "authentication_required",
      "Войдите в аккаунт.",
    ) from None
