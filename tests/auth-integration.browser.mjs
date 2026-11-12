import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.FRONTEND_URL;
assert.equal(base, "http://localhost:3115", "Run through the isolated PostgreSQL browser harness");
assert.ok(process.env.AUTH_TEST_VERIFICATION && process.env.AUTH_TEST_RECOVERY);
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const context = await browser.newContext({ reducedMotion: "reduce" });
const page = await context.newPage();
const errors = [];
page.on("pageerror", error => errors.push(error.message));
const evidence = process.env.FRONTEND_EVIDENCE || "/tmp/lms-auth-qa";
await mkdir(evidence, { recursive: true });
const main = page.locator("main");
async function capture(name) {
  await page.evaluate(() => document.fonts.ready);
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width <= 390 ? 844 : 900 });
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await page.waitForTimeout(150);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    const clipped = await main.evaluate(root => [...root.querySelectorAll("p,label,h1,h3,button,dd,dt")].filter(el => {
      if (!el.getClientRects().length) return false;
      const range = document.createRange(); range.selectNodeContents(el);
      const bounds = el.getBoundingClientRect();
      return [...range.getClientRects()].some(rect => rect.width > 0 && (rect.left < Math.max(0, bounds.left) - 2 || rect.right > Math.min(innerWidth, bounds.right) + 2));
    }).map(el => el.tagName));
    assert.deepEqual(clipped, [], `${name}: clipped text at ${width}`);
    await page.screenshot({ path: `${evidence}/${name}-${width}.png`, fullPage: false });
  }
}
async function signIn(password) {
  await page.goto(`${base}/login`);
  await main.getByLabel("Электронная почта", { exact: true }).filter({ visible: true }).fill("browser@example.com");
  await main.getByLabel("Пароль", { exact: true }).filter({ visible: true }).fill(password);
  await main.getByRole("button", { name: "ВОЙТИ", exact: true }).click();
  await main.getByRole("heading", { name: "Мой аккаунт" }).waitFor();
  await main.getByText("Текущий сеанс", { exact: true }).waitFor();
}
try {
  await page.goto(`${base}/register`);
  await capture("register-reference");
  await main.getByRole("button", { name: "СОЗДАТЬ АККАУНТ" }).click();
  assert.equal(await main.locator('[aria-invalid="true"]').count(), 5);
  await main.getByLabel("Имя", { exact: true }).filter({ visible: true }).fill("Тест");
  await main.getByLabel("Фамилия").filter({ visible: true }).fill("Проверка");
  await main.getByLabel("Электронная почта").filter({ visible: true }).fill("registered-browser@example.com");
  await main.getByLabel("Пароль", { exact: true }).filter({ visible: true }).fill("testpass");
  await main.getByLabel("Подтвердите пароль").filter({ visible: true }).fill("testpass");
  await main.getByRole("button", { name: "СОЗДАТЬ АККАУНТ" }).click();
  await main.getByText("Аккаунт создан.", { exact: false }).waitFor();
  await page.goto(`${base}/login`);
  await main.getByLabel("Электронная почта").filter({ visible: true }).fill("browser@example.com");
  await main.getByLabel("Пароль", { exact: true }).filter({ visible: true }).fill("wrong-password");
  await main.getByRole("button", { name: "ВОЙТИ", exact: true }).click();
  await main.getByRole("alert").waitFor();
  await capture("login-error");
  await signIn("old-test-password");
  await capture("account-unverified");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/checkout`);
  await page.locator("header").getByRole("button", { name: "Аккаунт", exact: true }).click();
  await page.getByRole("dialog", { name: "Мой аккаунт", exact: true }).waitFor();
  await page.waitForFunction(() => document.activeElement?.hasAttribute("data-auth-first"));
  await page.keyboard.press("Escape");
  await page.goto(`${base}/login`);
  await main.getByText("Текущий сеанс", { exact: true }).waitFor();
  assert.ok((await context.cookies()).find(cookie => cookie.name === "lms-session")?.httpOnly);
  assert.ok(!(await page.evaluate(() => document.cookie)).includes("lms-session"));
  await main.getByRole("button", { name: "Завершить сеанс", exact: true }).first().click();
  await main.getByText("Для продолжения работы в этом сеансе понадобится войти заново.").waitFor();
  await main.getByRole("button", { name: "Завершить сеанс", exact: true }).click();
  await main.getByText("Сеанс завершён.", { exact: true }).waitFor();
  assert.equal(await main.getByText("Другой сеанс", { exact: true }).count(), 0);
  await main.getByRole("button", { name: "Выйти из аккаунта" }).click();
  await main.getByRole("heading", { name: "Вход", exact: true }).waitFor();
  assert.equal((await page.request.get(`${base}/api/v1/auth/me`)).status(), 401);

  // Fragment secrets are scrubbed; GET/navigation never consumes the token.
  await page.goto(`${base}/verify-email#token=${process.env.AUTH_TEST_VERIFICATION}`);
  await main.getByRole("button", { name: "ПОДТВЕРДИТЬ ПОЧТУ", exact: true }).waitFor();
  assert.equal(new URL(page.url()).hash, "");
  await capture("verification-reference");
  await main.getByRole("button", { name: "ПОДТВЕРДИТЬ ПОЧТУ", exact: true }).click();
  await main.getByText("Электронная почта подтверждена. Теперь можно войти в аккаунт.").waitFor();
  await capture("verification-success");
  await page.goto(`${base}/verify-email#token=${process.env.AUTH_TEST_VERIFICATION}`);
  await main.getByRole("button", { name: "ПОДТВЕРДИТЬ ПОЧТУ", exact: true }).click();
  await main.getByRole("alert").waitFor();
  await capture("verification-expired");
  await page.goto(`${base}/verify-email`);
  await main.getByLabel("Электронная почта").filter({ visible: true }).fill("missing@example.com");
  await main.getByRole("button", { name: "ЗАПРОСИТЬ НОВУЮ ССЫЛКУ" }).click();
  await main.getByText("Запрос принят. В тестовой версии письма не отправляются.", { exact: true }).waitFor();

  await signIn("old-test-password");
  await capture("account-verified");
  await page.goto(`${base}/reset-password#token=${process.env.AUTH_TEST_RECOVERY}`);
  await main.locator('input[name="password"]:visible').waitFor();
  assert.equal(new URL(page.url()).hash, "");
  await capture("reset-reference");
  await main.locator('input[name="password"]:visible').fill("new-test-password");
  await main.getByLabel("Подтвердите пароль").filter({ visible: true }).fill("different-password");
  await main.getByRole("button", { name: "СОХРАНИТЬ ПАРОЛЬ" }).click();
  await main.getByText("Пароли не совпадают", { exact: true }).waitFor();
  await main.getByLabel("Подтвердите пароль").filter({ visible: true }).fill("new-test-password");
  await main.getByRole("button", { name: "СОХРАНИТЬ ПАРОЛЬ" }).click();
  await main.getByText("Пароль изменён.", { exact: false }).waitFor();
  assert.equal((await page.request.get(`${base}/api/v1/auth/me`)).status(), 401);
  await capture("reset-success");
  await signIn("new-test-password");
  await main.getByRole("button", { name: "Завершить текущий сеанс" }).click();
  await main.getByRole("button", { name: "Завершить сеанс", exact: true }).click();
  await main.getByRole("heading", { name: "Вход", exact: true }).waitFor();
  await page.goto(`${base}/forgot-password`);
  await main.getByLabel("Электронная почта").filter({ visible: true }).fill("missing@example.com");
  await main.getByRole("button", { name: "ЗАПРОСИТЬ ВОССТАНОВЛЕНИЕ" }).click();
  await main.getByText("Запрос принят. В тестовой версии письма не отправляются.", { exact: true }).waitFor();
  await capture("forgot-success");
  for (const route of ["login", "register", "forgot-password", "verify-email", "reset-password"]) {
    const response = await page.request.get(`${base}/${route}`, { headers: { "User-Agent": "Twitterbot" } });
    const html = await response.text();
    assert.match(html, /name="robots" content="noindex, nofollow"/);
    assert.match(html, /name="referrer" content="no-referrer"/);
    assert.ok(!html.includes('rel="canonical"'));
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.ok(!html.includes("application/ld+json"));
  }
  const sitemap = await (await page.request.get(`${base}/sitemap.xml`)).text();
  assert.ok(!/\/(login|register|forgot-password|verify-email|reset-password)</.test(sitemap));
  assert.deepEqual(errors, []);
  console.log("Real auth integration and responsive/SEO checks passed.");
} finally { await browser.close(); }
