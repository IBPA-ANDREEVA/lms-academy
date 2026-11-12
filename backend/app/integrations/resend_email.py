
import resend


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

        response = resend.Emails.send(params)

        return response["id"]
