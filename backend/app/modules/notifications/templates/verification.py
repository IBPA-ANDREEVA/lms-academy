from html import escape

from app.modules.notifications.constants import EmailContent


def verification_template(url: str) -> EmailContent:
  safe_url = escape(url, quote=True)

  return EmailContent(
    subject="Подтвердите адрес электронной почты — LMS Academy",
    html=f"""
      <h2>Подтверждение адреса электронной почты</h2>
      <p>Чтобы подтвердить адрес, перейдите по ссылке ниже.</p>
      <a href="{safe_url}">Подтвердить адрес</a>
      <p>Ссылка действует 48 часов.</p>
      <p>Если вы не создавали аккаунт, проигнорируйте это письмо.</p>
    """,
    text=(
      f"Подтвердить адрес: {url}\nСсылка действует 48 часов.\n"
      "Если вы не создавали аккаунт, проигнорируйте это письмо."
    ),
  )
