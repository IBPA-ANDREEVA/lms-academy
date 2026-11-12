from fastapi import Request
from typing import cast

from app.modules.notifications.email_service import EmailService

def get_email_service(request: Request) -> EmailService:
  return cast(EmailService, request.app.state.email_service)
