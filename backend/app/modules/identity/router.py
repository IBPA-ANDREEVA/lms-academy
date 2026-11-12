from typing import cast
from uuid import UUID

from fastapi import APIRouter, Depends, Query, Request, Response, status

from app.db.session import ApplicationDatabase
from app.modules.identity.dependencies import get_current_user, session_cookie
from app.modules.identity.exceptions import (
  AuthenticationError,
  EmailAlreadyRegistered,
  ResendError,
  ResendWasSentEarlier,
  SessionNotFound,
  TokenError,
)
from app.modules.identity.http import (
  IdentityRoute,
  identity_error,
  record_identity_change,
  require_same_origin,
)
from app.modules.identity.schemas import (
  BaseResponse,
  CurrentUserResponse,
  ForgotPasswordRequest,
  IdentityErrorResponse,
  LoginRequest,
  RegisterRequest,
  ResendVerificationRequest,
  ResetPasswordRequest,
  SessionsResponse,
  VerifyEmailRequest,
)
from app.modules.identity.services.authentication import authenticate_user
from app.modules.identity.services.registrations import register_student
from app.modules.identity.services.resets import request_password_reset, reset_password
from app.modules.identity.services.sessions import (
  create_auth_session,
  list_auth_sessions,
  revoke_auth_session,
  revoke_owned_auth_session,
)
from app.modules.identity.services.verfication import resend_verification, verify_email

identity_errors: dict[int | str, dict[str, object]] = {
  code: {"model": IdentityErrorResponse}
  for code in (400, 401, 403, 404, 409, 422, 429, 500)
}

router = APIRouter(
  prefix="/auth",
  tags=["Identity"],
  route_class=IdentityRoute,
  responses=identity_errors,
)


@router.get("/ping", operation_id="identityPing")
def ping() -> dict[str, str]:
  return {"message": "Identity router connected"}


@router.post(
  "/register",
  response_model=BaseResponse,
  status_code=status.HTTP_201_CREATED,
  operation_id="identityRegister",
)
def register(
  body: RegisterRequest,
  request: Request,
) -> BaseResponse:
  db = cast(
    ApplicationDatabase,
    request.app.state.database,
  )

  try:
    register_student(
      db=db,
      first_name=body.first_name,
      last_name=body.last_name,
      email=str(body.email),
      password=body.password,
    )

  except EmailAlreadyRegistered:
    raise identity_error(
      409,
      "registration_unavailable",
      "Не удалось зарегистрировать этот адрес. Попробуйте войти или восстановить пароль.",
    ) from None

  return BaseResponse(
    message="Аккаунт создан. В тестовой версии письма не отправляются.",
  )


@router.post(
  "/verify-email",
  response_model=BaseResponse,
  status_code=status.HTTP_200_OK,
  operation_id="identityVerifyEmail",
)
def verify_email_route(
  body: VerifyEmailRequest,
  request: Request,
) -> BaseResponse:

  db = cast(ApplicationDatabase, request.app.state.database)

  try:
    with db.unit_of_work() as session:
      verify_email(session, body.token)

  except TokenError:
    raise identity_error(
      400,
      "invalid_verification_link",
      "Ссылка недействительна или устарела. Запросите новую.",
    ) from None

  return BaseResponse(
    message="Электронная почта подтверждена.",
  )


@router.post(
  "/resend_verify_email",
  response_model=BaseResponse,
  status_code=status.HTTP_201_CREATED,
  operation_id="IdentityResendVerificaiton",
)
def resend_verification_route(
  body: ResendVerificationRequest,
  request: Request,
) -> BaseResponse:
  db = cast(ApplicationDatabase, request.app.state.database)

  try:
    with db.unit_of_work() as session:
      resend_verification(session, body.email)

  except ResendWasSentEarlier:
    raise identity_error(
      429,
      "verification_cooldown",
      "Подождите минуту перед повторным запросом.",
    ) from None

  except ResendError as exc:
    raise identity_error(
      400,
      "verification_unavailable",
      "Не удалось обработать запрос. Попробуйте позже.",
    ) from exc

  return BaseResponse(
    message="Запрос принят. В тестовой версии письма не отправляются.",
  )


@router.post(
  "/login",
  response_model=BaseResponse,
  status_code=status.HTTP_200_OK,
  operation_id="IdentityLogin",
)
def login(
  body: LoginRequest,
  request: Request,
  response: Response,
) -> BaseResponse:
  require_same_origin(request)
  db = cast(ApplicationDatabase, request.app.state.database)

  try:
    with db.unit_of_work() as session:
      user = authenticate_user(session, str(body.email), body.password)
      raw_token = create_auth_session(session, user.id)

  except AuthenticationError as exc:
    raise identity_error(
      401,
      "invalid_credentials",
      "Не удалось войти. Проверьте почту и пароль.",
    ) from exc

  # TODO: Fix before production
  response.set_cookie(
    key="lms-session",
    value=raw_token,
    httponly=True,
    secure=False,  # Local HTTP development only
    samesite="lax",
    path="/",
    max_age=30 * 24 * 60 * 60,
  )

  return BaseResponse(
    message="Вы вошли в аккаунт.",
  )


@router.post(
  "/logout",
  response_model=BaseResponse,
  status_code=status.HTTP_200_OK,
  operation_id="IdentityLogout",
)
def logout(
  request: Request,
  response: Response,
) -> BaseResponse:

  require_same_origin(request)
  raw_token = request.cookies.get("lms-session")

  if raw_token:
    db = cast(ApplicationDatabase, request.app.state.database)

    with db.unit_of_work() as session:
      revoke_auth_session(session, raw_token)

  response.delete_cookie(
    key="lms-session",
    path="/",
  )

  return BaseResponse(
    message="Вы вышли из аккаунта.",
  )


@router.get(
  "/me",
  response_model=CurrentUserResponse,
  status_code=status.HTTP_200_OK,
  operation_id="IdentityGetCurrentUser",
)
def get_me(
  user: CurrentUserResponse = Depends(get_current_user),
) -> CurrentUserResponse:
  return user


@router.get(
  "/sessions",
  response_model=SessionsResponse,
  operation_id="identityListSessions",
  responses=identity_errors,
)
def list_sessions_route(
  request: Request,
  response: Response,
  limit: int = Query(default=50, ge=1, le=100),
  after: UUID | None = None,
  credential: str | None = Depends(session_cookie),
) -> SessionsResponse:
  db = cast(ApplicationDatabase, request.app.state.database)
  response.headers["Cache-Control"] = "no-store"

  try:
    with db.unit_of_work() as session:
      return list_auth_sessions(session, credential or "", limit, after)

  except AuthenticationError:
    raise identity_error(
      401,
      "authentication_required",
      "Войдите в аккаунт.",
    ) from None


@router.delete(
  "/sessions/{id}",
  response_model=BaseResponse,
  operation_id="identityRevokeSession",
  responses=identity_errors,
)
def revoke_session_route(
  id: UUID,
  request: Request,
  response: Response,
  credential: str | None = Depends(session_cookie),
) -> BaseResponse:
  require_same_origin(request)

  db = cast(ApplicationDatabase, request.app.state.database)
  response.headers["Cache-Control"] = "no-store"

  try:
    with db.unit_of_work() as session:
      actor_id = revoke_owned_auth_session(session, credential or "", id)

  except AuthenticationError:
    raise identity_error(
      401,
      "authentication_required",
      "Войдите в аккаунт.",
    ) from None

  except SessionNotFound:
    raise identity_error(
      404,
      "session_not_found",
      "Сеанс не найден.",
    ) from None

  record_identity_change("revoke_session", actor_id, id)

  return BaseResponse(
    message="Сеанс завершён.",
  )


@router.post(
  "/password/forgot",
  response_model=BaseResponse,
  operation_id="identityForgotPassword",
  responses=identity_errors,
)
def forgot_password_route(
  body: ForgotPasswordRequest,
  request: Request,
  response: Response,
) -> BaseResponse:
  db = cast(ApplicationDatabase, request.app.state.database)
  response.headers["Cache-Control"] = "no-store"

  with db.unit_of_work() as session:
    request_password_reset(session, str(body.email))

  return BaseResponse(
    message="Запрос принят. В тестовой версии письма не отправляются.",
  )


@router.post(
  "/password/reset",
  response_model=BaseResponse,
  operation_id="identityResetPassword",
  responses=identity_errors,
)
def reset_password_route(
  body: ResetPasswordRequest,
  request: Request,
  response: Response,
) -> BaseResponse:
  db = cast(ApplicationDatabase, request.app.state.database)
  response.headers["Cache-Control"] = "no-store"

  try:
    with db.unit_of_work() as session:
      actor_id = reset_password(session, body.token, body.password)

  except TokenError:
    raise identity_error(
      400,
      "invalid_recovery_link",
      "Ссылка недействительна или устарела. Запросите новую.",
    ) from None

  record_identity_change("reset_password", actor_id, actor_id)

  return BaseResponse(
    message="Пароль изменён. Войдите с новым паролем.",
  )
