import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const evidence = process.env.FRONTEND_EVIDENCE || ".auth-evidence";
await mkdir(evidence, { recursive: true });

try {
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width <= 390 ? 844 : 900 });
    await page.goto(process.env.FRONTEND_URL || "http://localhost:3000");
    await page.evaluate(() => document.fonts.ready);
    const bodyWidth = await page.evaluate(() => document.body.getBoundingClientRect().width);
    if (width <= 760) {
      await page.getByRole("button", { name: "Открыть меню" }).click();
      await page.getByRole("button", { name: "Войти в кабинет" }).click();
    } else await page.getByRole("button", { name: "Войти", exact: true }).click();

    const dialog = page.getByRole("dialog", { name: "Вход" });
    await dialog.waitFor();
    assert.equal(await page.locator("dialog[open]").count(), 1);
    assert.equal(await page.evaluate(() => document.body.getBoundingClientRect().width), bodyWidth, "Scroll lock must preserve content width");
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute("data-auth-first")), "true");
    await page.keyboard.press("Shift+Tab");
    assert.ok(await dialog.evaluate((element) => element.contains(document.activeElement)));
    await dialog.getByRole("textbox", { name: "Электронная почта" }).focus();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `horizontal overflow at ${width}`);
    if (width === 1440 || width === 390) await page.screenshot({ path: `${evidence}/login-${width}.png` });

    await dialog.getByRole("textbox", { name: "Электронная почта" }).fill("example@email.com");
    await dialog.getByRole("button", { name: "Показать пароль" }).click();
    assert.equal(await dialog.locator('[data-auth-view="login"] input[name="password"]').getAttribute("type"), "text");
    await dialog.getByRole("button", { name: "ВОЙТИ", exact: false }).click();
    assert.ok(await dialog.getByText("Вход пока недоступен.").isVisible());
    await dialog.getByRole("button", { name: "Зарегистрироваться" }).click();
    const register = page.getByRole("dialog", { name: "Регистрация" });
    assert.equal(await register.getByLabel("Дата рождения").count(), 0);
    assert.ok(await register.getByLabel("Имя", { exact: true }).isVisible());
    await page.waitForFunction(() => document.activeElement?.hasAttribute("data-auth-first"));
    if (width === 1440 || width === 390) await page.screenshot({ path: `${evidence}/register-${width}.png` });
    const createAccount = register.getByRole("button", { name: "СОЗДАТЬ АККАУНТ" });
    await createAccount.scrollIntoViewIfNeeded();
    assert.ok(await createAccount.isVisible());
    assert.ok(await register.getByRole("button", { name: "Продолжить с Google — скоро" }).isDisabled());
    await createAccount.click();
    await register.locator('[name="first-name"]').focus();
    assert.ok(await register.getByText("Введите имя", { exact: true }).isVisible());
    assert.equal(await register.locator('[aria-invalid="true"]').count(), 5);
    if (width === 1440 || width === 390) await page.screenshot({ path: `${evidence}/register-errors-${width}.png` });
    await register.getByRole("button", { name: "Войти ↗" }).click();
    assert.equal(await page.getByRole("dialog", { name: "Вход" }).getByRole("textbox", { name: "Электронная почта" }).inputValue(), "example@email.com");
    await page.getByRole("dialog", { name: "Вход" }).getByRole("button", { name: "Забыли пароль?" }).click();
    const forgot = page.getByRole("dialog", { name: "Восстановление пароля" });
    assert.ok(await forgot.getByRole("textbox", { name: "Электронная почта" }).isVisible());
    await page.waitForFunction(() => document.activeElement?.hasAttribute("data-auth-first"));
    if (width === 1440 || width === 390) await page.screenshot({ path: `${evidence}/forgot-${width}.png` });
    await forgot.getByRole("button", { name: "ОТПРАВИТЬ ССЫЛКУ" }).click();
    assert.ok(await forgot.getByText("Отправка ссылки пока недоступна.").isVisible());
    await page.keyboard.press("Escape");
    await page.locator("dialog[open]").waitFor({ state: "detached", timeout: 1000 });
    assert.equal(await page.locator("dialog[open]").count(), 0);
    assert.ok(await page.getByRole("button", { name: width <= 760 ? "Открыть меню" : "Войти", exact: true }).evaluate((element) => element === document.activeElement));
    if (width <= 760) {
      await page.getByRole("button", { name: "Открыть меню" }).click();
      await page.getByRole("button", { name: "Войти в кабинет" }).click();
    } else await page.getByRole("button", { name: "Войти", exact: true }).click();
    assert.equal(await page.getByRole("dialog", { name: "Вход" }).getByRole("textbox", { name: "Электронная почта" }).inputValue(), "");
    await page.keyboard.press("Escape");
    await page.locator("dialog[open]").waitFor({ state: "detached", timeout: 1000 });
  }
  // Exercise real registration UI with intercepted responses, never creating accounts.
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(process.env.FRONTEND_URL || "http://localhost:3000");
  await page.getByRole("button", { name: "Войти", exact: true }).click();
  await page.getByRole("button", { name: "Зарегистрироваться" }).click();
  const form = page.locator('[data-auth-view="register"]');
  await form.getByLabel("Имя", { exact: true }).fill("Тест");
  await form.getByLabel("Фамилия").fill("Проверка");
  await form.getByLabel("Электронная почта").fill("qa@example.com");
  await form.getByLabel("Пароль", { exact: true }).fill("test-password-123");
  await form.getByLabel("Подтвердите пароль").fill("test-password-123");
  let reply;
  await page.route("**/api/v1/auth/register", async route => {
    await new Promise(resolve => { reply = resolve; });
    await route.fulfill({ status: 503, contentType: "application/json", body: "{}" });
  });
  await form.getByRole("button", { name: "СОЗДАТЬ АККАУНТ" }).click();
  await page.waitForFunction(() => !!document.querySelector('[data-auth-view="register"] button[aria-busy="true"]'));
  assert.ok(await form.getByRole("button", { name: "СОЗДАНИЕ" }).isDisabled());
  await page.screenshot({ path: `${evidence}/register-pending.png` });
  while (!reply) await page.waitForTimeout(20);
  reply();
  await form.getByRole("alert").waitFor();
  await page.screenshot({ path: `${evidence}/register-server-error.png` });
  await page.unroute("**/api/v1/auth/register");
  await page.route("**/api/v1/auth/register", route => route.fulfill({ status: 201, contentType: "application/json", body: '{"message":"ok"}' }));
  await form.getByRole("button", { name: "СОЗДАТЬ АККАУНТ" }).click();
  const success = form.getByText("Аккаунт создан. В тестовой версии письма не отправляются — подтверждение почты пока недоступно.", { exact: true });
  await success.waitFor();
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width <= 390 ? 844 : 900 });
    await success.scrollIntoViewIfNeeded();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.ok(await success.evaluate(el => {
      const range = document.createRange();
      range.selectNodeContents(el);
      const bounds = el.getBoundingClientRect();
      return [...range.getClientRects()].every(rect => rect.left >= bounds.left - 1 && rect.right <= bounds.right + 1);
    }), "Success copy must wrap without clipped text");
    await page.screenshot({ path: `${evidence}/register-success-${width}.png` });
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.keyboard.press("Escape");
  await page.locator("dialog[open]").waitFor({ state: "detached" });
  assert.deepEqual(errors, []);
  console.log("Auth modal browser checks passed at 1440, 768, 390 and 320px.");
} finally {
  await browser.close();
}
