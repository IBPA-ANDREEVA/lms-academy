import resend
from resend.exceptions import ResendError


class EmailDeliveryError(Exception):
  """Delivery was not confirmed; never include provider payloads or credentials."""


class ResendEmailSender:
  def __init__(self, from_address: str) -> None:
    self.from_address = from_address

  def send(
    self,
    *,
    to: str,
    subject: str,
    html: str,
    text: str,
  ) -> str:
    params: resend.Emails.SendParams = {
      "from": self.from_address,
      "to": [to],
      "subject": subject,
      "html": html,
      "text": text,
    }

    try:
      response = resend.Emails.send(params)

    except ResendError:
      raise EmailDeliveryError() from None

    email_id = response.get("id")
    if not isinstance(email_id, str) or not email_id:
      raise EmailDeliveryError()

    return email_id
