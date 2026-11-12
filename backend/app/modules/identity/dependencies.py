from typing import cast

from fastapi import HTTPException, Request

from app.db.session import ApplicationDatabase
from app.modules.identity.models import User
from app.modules.identity.services.sessions import authenticate_session


def get_current_user(
  request: Request,
) -> User:
  raw_token = request.cookies.get("lms-session")

  if raw_token is None:
    raise HTTPException(
      status_code=401,
      detail="Not authenticated",
    )

  db = cast(ApplicationDatabase, request.app.state.database)

  with db.unit_of_work() as session:
    user = authenticate_session(session, raw_token)

    if user is None:
      raise HTTPException(
        status_code=400,
        detail="Session has expired",
      )

    return user
