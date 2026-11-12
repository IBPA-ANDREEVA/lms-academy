from html import escape

from app.modules.notifications.constants import EmailContent


def verification_template(url: str) -> EmailContent:
    safe_url = escape(url, quote=True)

    return EmailContent(
        subject="Reset your password - LMS Academy",
        html=f"""
            <h2>Password reset</h2>
            <p>Someone requested a password reset.</p>
            <a href="{safe_url}">Reset password</a>
            <p>This link expires in 60 minutes.</p>
            <p>If you didn't request this, ignore this email.</p>
        """,
        text=(
            f"Reset your password: {url}\n"
            "The link expires in 60 minutes."
        ),
    )
