from html import escape

from app.modules.notifications.constants import EmailContent


def verification_template(url: str) -> EmailContent:
    safe_url = escape(url, quote=True)

    return EmailContent(
        subject="Verify your email - LMS Academy",
        html=f"""
            <h2>Welcome to LMS Academy!</h2>
            <p>Please verify your email address.</p>
            <a href="{safe_url}">Verify email</a>
            <p>This link expires in 24 hours.</p>
        """,
        text=f"Verify your email: {url}",
    )
