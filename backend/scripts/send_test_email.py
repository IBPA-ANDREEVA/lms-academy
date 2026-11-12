
import os

import resend

from app.integrations.resend_email import ResendEmailSender
from app.modules.notifications.email_service import EmailService


def main() -> None:
    resend.api_key = os.environ["RESEND_API_KEY"]

    sender = ResendEmailSender(from_address=os.environ["EMAIL_FROM"])

    email_service = EmailService(sender=sender)

    email_id = email_service.send(
        to="dev@ibpassocitations.org",
        subject="TEST SUBJECT",
        html="<p> TEST EMAIL </p>",
        text="TEST EMAIL"
    )

    print(f"Email accepted by Resend: {email_id}")


if __name__ == "__main__":
    main()
