from app.integrations.resend_email import ResendEmailSender


class EmailService:
    def __init__(self, sender: ResendEmailSender, app_base_url: str) -> None:
        self.sender = sender
        self.app_base_url = app_base_url

    def send(
        self,
        *,
        to: str,
        subject: str,
        html: str,
        text: str,
    ) -> str:
        return self.sender.send(
            to=to,
            subject=subject,
            html=html,
            text=text,
        )
