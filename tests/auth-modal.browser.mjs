import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
await mkdir(".auth-evidence", { recursive: true });

try {
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width <= 390 ? 844 : 900 });
    await page.goto(process.env.FRONTEND_URL || "http://localhost:3000");
    await page.evaluate(() => document.fonts.ready);
    await page.getByRole("button", { name: "Войти", exact: true }).click();

    const dialog = page.getByRole("dialog", { name: "Войти в LMS Academy" });
    await dialog.waitFor();
    assert.equal(await page.locator("dialog[open]").count(), 1);
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute("data-auth-first")), "true");
    await page.keyboard.press("Shift+Tab");
    assert.ok(await dialog.evaluate((element) => element.contains(document.activeElement)));
    await dialog.getByRole("textbox", { name: "Электронная почта" }).focus();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `horizontal overflow at ${width}`);
    if (width === 1440 || width === 390) await page.screenshot({ path: `.auth-evidence/login-${width}.png` });

    await dialog.getByRole("textbox", { name: "Электронная почта" }).fill("example@email.com");
    await dialog.getByRole("button", { name: "Показать пароль" }).click();
    assert.equal(await dialog.locator('[data-auth-view="login"] input[name="password"]').getAttribute("type"), "text");
    await dialog.getByRole("button", { name: "ВОЙТИ", exact: false }).click();
    assert.ok(await dialog.getByText("Вход пока недоступен. Это демонстрация интерфейса.").isVisible());
    await dialog.getByRole("button", { name: "Зарегистрироваться" }).click();
    const register = page.getByRole("dialog", { name: "Создать аккаунт LMS Academy" });
    assert.ok(await register.getByLabel("Дата рождения").isVisible());
    assert.ok(await register.getByLabel("Имя", { exact: true }).isVisible());
    await page.waitForFunction(() => document.activeElement?.hasAttribute("data-auth-first"));
    if (width === 1440 || width === 390) await page.screenshot({ path: `.auth-evidence/register-${width}.png` });
    const createAccount = register.getByRole("button", { name: "СОЗДАТЬ АККАУНТ" });
    await createAccount.scrollIntoViewIfNeeded();
    assert.ok(await createAccount.isVisible());
    assert.ok(await register.getByRole("button", { name: "Продолжить с Google — скоро" }).isDisabled());
    await createAccount.click();
    assert.ok(await register.getByText("Регистрация пока недоступна. Это демонстрация интерфейса.").isVisible());
    await register.getByRole("button", { name: "Войти ↗" }).click();
    assert.equal(await page.getByRole("dialog", { name: "Войти в LMS Academy" }).getByRole("textbox", { name: "Электронная почта" }).inputValue(), "example@email.com");
    await page.getByRole("dialog", { name: "Войти в LMS Academy" }).getByRole("button", { name: "Забыли пароль?" }).click();
    const forgot = page.getByRole("dialog", { name: "Восстановить пароль LMS Academy" });
    assert.ok(await forgot.getByRole("textbox", { name: "Электронная почта" }).isVisible());
    await page.waitForFunction(() => document.activeElement?.hasAttribute("data-auth-first"));
    if (width === 1440 || width === 390) await page.screenshot({ path: `.auth-evidence/forgot-${width}.png` });
    await forgot.getByRole("button", { name: "ОТПРАВИТЬ ССЫЛКУ" }).click();
    assert.ok(await forgot.getByText("Отправка ссылки пока недоступна. Это демонстрация интерфейса.").isVisible());
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("dialog[open]").count(), 0);
    assert.ok(await page.getByRole("button", { name: "Войти", exact: true }).evaluate((element) => element === document.activeElement));
    await page.getByRole("button", { name: "Войти", exact: true }).click();
    assert.equal(await page.getByRole("dialog", { name: "Войти в LMS Academy" }).getByRole("textbox", { name: "Электронная почта" }).inputValue(), "");
    await page.keyboard.press("Escape");
  }
  assert.deepEqual(errors, []);
  console.log("Auth modal browser checks passed at 1440, 768, 390 and 320px.");
} finally {
  await browser.close();
}
