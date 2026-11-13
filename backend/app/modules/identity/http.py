"""Transport helpers scoped to the new Identity endpoints."""

import logging
from collections.abc import Callable, Coroutine
from datetime import UTC, datetime
from typing import Any
from urllib.parse import urlsplit
from uuid import UUID, uuid4

from fastapi import HTTPException, Request, Response
from fastapi.exceptions import RequestValidationError
from fastapi.routing import APIRoute

logger = logging.getLogger(__name__)


def identity_error(
  status: int,
  code: str,
  message: str,
) -> HTTPException:
  correlation_id = str(uuid4())

  logger.info("identity_request_failed code=%s correlation_id=%s", code, correlation_id)

  return HTTPException(
    status,
    detail={
      "code": code,
      "message": message,
      "correlation_id": correlation_id,
    },
    headers={"Cache-Control": "no-store"},
  )


def require_same_origin(request: Request) -> None:
  # Browser Origin cannot be forged by cross-origin page scripts. Require it for
  # cookie mutations, including login/logout. Proxy headers must be trusted explicitly.
  origin = request.headers.get("origin")
  expected = f"{request.url.scheme}://{request.url.netloc}"

  if not origin or origin != expected or urlsplit(origin).path:
    raise identity_error(
      403,
      "origin_rejected",
      "Обновите страницу и повторите попытку.",
    )


class IdentityRoute(APIRoute):
  def get_route_handler(self) -> Callable[[Request], Coroutine[Any, Any, Response]]:
    original = super().get_route_handler()

    async def handle(request: Request) -> Response:
      try:
        response = await original(request)
        response.headers["Cache-Control"] = "no-store"

        return response

      except RequestValidationError:
        raise identity_error(
          422,
          "invalid_request",
          "Проверьте введённые данные.",
        ) from None

      except HTTPException:
        raise

      except Exception as exc:
        # Exception type only: SQL/driver exceptions may include submitted secrets.
        logger.error("identity_unexpected_failure error_type=%s", type(exc).__name__)

        raise identity_error(
          500,
          "request_failed",
          "Не удалось выполнить запрос. Попробуйте позже.",
        ) from None

    return handle


def record_identity_change(
  action: str,
  actor_id: UUID,
  resource_id: UUID,
) -> None:
  # Call only after unit-of-work commit. This is an operational diagnostic,
  # not a replacement for future durable sensitive-action audit storage.
  # Do not log raw identifiers for security/privacy-sensitive identity actions.
  logger.info(
    "identity_change action=%s actor_present=%s resource_present=%s time=%s outcome=success",
    action,
    actor_id is not None,
    resource_id is not None,
    datetime.now(UTC).isoformat(),
  )
