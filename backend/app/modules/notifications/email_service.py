"""Public transactional-email interface; call only after Identity commits."""

import logging
from urllib.parse import urlencode, urlsplit
from uuid import uuid4

from app.integrations.resend_email import EmailDeliveryError as EmailDeliveryError
from app.integrations.resend_email import ResendEmailSender
from app.modules.notifications.constants import EmailContent
from app.modules.notifications.templates.password_reset import password_reset_template
from app.modules.notifications.templates.verification import verification_template

logger = logging.getLogger(__name__)


class EmailService:
  def __init__(
    self,
    sender: ResendEmailSender | None = None,
    app_base_url: str = "",
  ) -> None:
    if sender is not None:
      parsed = urlsplit(app_base_url)
      local_http = parsed.scheme == "http" and parsed.hostname in {
        "localhost",
        "127.0.0.1",
        "::1",
      }
      if (
        not parsed.hostname
        or (parsed.scheme != "https" and not local_http)
        or parsed.username is not None
        or parsed.password is not None
        or parsed.path not in {"", "/"}
        or parsed.query
        or parsed.fragment
        or any(char.isspace() for char in app_base_url)
      ):
        raise ValueError(
          "APP_BASE_URL must be an HTTPS origin (HTTP loopback for development)."
        )

    self.sender = sender
    self.app_base_url = app_base_url.rstrip("/")

  def _make_url(
    self,
    path: str,
    token: str,
  ) -> str:
    return f"{self.app_base_url}{path}?{urlencode({'token': token})}"

  def _send(
    self,
    to: str,
    content: EmailContent,
  ) -> str:
    try:
      if self.sender is None:
        raise EmailDeliveryError()

      return self.sender.send(
        to=to,
        subject=content.subject,
        html=content.html,
        text=content.text,
      )

    except EmailDeliveryError:
      logger.error(
        "email_delivery_failed correlation_id=%s outcome=unconfirmed",
        uuid4(),
      )
      raise

  def send_verification_email(
    self,
    *,
    to: str,
    raw_token: str,
  ) -> str:
    content = verification_template(self._make_url("/verify-email", raw_token))

    return self._send(to, content)

  def send_password_reset_email(
    self,
    *,
    to: str,
    raw_token: str,
  ) -> str:
    content = password_reset_template(self._make_url("/reset-password", raw_token))

    return self._send(to, content)
