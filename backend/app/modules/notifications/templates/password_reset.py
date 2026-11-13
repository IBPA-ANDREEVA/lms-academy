from html import escape

from app.modules.notifications.constants import EmailContent


def password_reset_template(url: str) -> EmailContent:
  safe_url = escape(url, quote=True)

  return EmailContent(
    subject="Восстановление пароля — LMS Academy",
    html=f"""
      <h2>Восстановление пароля</h2>
      <p>Вы можете установить новый пароль по ссылке ниже.</p>
      <a href="{safe_url}">Установить новый пароль</a>
      <p>Ссылка действует 30 минут и может быть использована один раз.</p>
      <p>Если вы не запрашивали восстановление, проигнорируйте это письмо.</p>
    """,
    text=(
      f"Установить новый пароль: {url}\n"
      "Ссылка действует 30 минут и может быть использована один раз.\n"
      "Если вы не запрашивали восстановление, проигнорируйте это письмо."
    ),
  )
