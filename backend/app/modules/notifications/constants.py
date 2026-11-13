from dataclasses import dataclass


@dataclass(frozen=True)
class EmailContent:
    subject: str
    html: str
    text: str
