from typing import cast

from fastapi import Request

from app.modules.notifications.email_service import EmailService


def get_email_service(request: Request) -> EmailService:
  service = getattr(request.app.state, "email_service", None)

  return cast(EmailService, service) if service is not None else EmailService()
