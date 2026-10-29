import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const playwright = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const browser = await playwright.chromium.launch({ channel: process.env.BROWSER_CHANNEL || "chrome", headless: true });
const baseURL = process.env.FRONTEND_URL || "http://localhost:3100";
const evidence = process.env.FRONTEND_EVIDENCE || "/tmp/lms-home-10-11";
await mkdir(evidence, { recursive: true });

try {
  for (const width of [1440, 768, 390, 360]) {
    const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 900 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(baseURL, { waitUntil: "networkidle" });
    const reviews = page.locator("#reviews");
    const contact = page.locator("#contact");
    await assert.equal(await reviews.getByRole("heading", { name: /ОПЫТ, КОТОРЫМ ДЕЛЯТСЯ/ }).count(), 1);
    await assert.equal(await contact.getByRole("heading", { name: /ОСТАЛИСЬ ВОПРОСЫ/ }).count(), 1);
    assert.equal(await reviews.getByText("ПРЕДПРОСМОТР РАЗДЕЛА · ЭТАП 3").count(), 1);
    assert.equal(await reviews.getByText("ЗДЕСЬ БУДЕТ ПОДТВЕРЖДЁННАЯ").count(), 1);
    assert.equal(await contact.getByRole("button", { name: /ОТПРАВИТЬ СООБЩЕНИЕ/ }).isDisabled(), true);
    await reviews.scrollIntoViewIfNeeded();
    await reviews.screenshot({ path: `${evidence}/reviews-${width}.png` });
    await reviews.evaluate((element) => window.scrollTo({ top: element.offsetTop - 100, behavior: "instant" }));
    await page.screenshot({ path: `${evidence}/reviews-${width}-viewport.png` });
    await contact.scrollIntoViewIfNeeded();
    await contact.screenshot({ path: `${evidence}/contact-${width}.png` });
    await contact.evaluate((element) => window.scrollTo({ top: element.offsetTop - 100, behavior: "instant" }));
    await page.screenshot({ path: `${evidence}/contact-${width}-viewport.png` });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    assert.ok(overflow <= 1, `Page overflow at ${width}px: ${overflow}px`);
    assert.deepEqual(errors, []);
    await page.close();
  }

  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const page = await context.newPage();
  await page.goto(baseURL, { waitUntil: "networkidle" });
  const contact = page.locator("#contact");
  const email = contact.getByRole("textbox", { name: "Email *" });
  await email.fill("неверный-email");
  await email.blur();
  await assert.equal(await contact.getByText("Введите корректный email").count(), 1);
  await email.fill("student@example.com");
  await assert.equal(await contact.getByText("Введите корректный email").count(), 0);
  const message = contact.getByRole("textbox", { name: "Сообщение *" });
  await message.fill("Тестовый вопрос об обучении");
  await message.blur();
  assert.equal(await message.inputValue(), "Тестовый вопрос об обучении");
  assert.equal(await contact.getByRole("button", { name: /ОТПРАВИТЬ СООБЩЕНИЕ/ }).isDisabled(), true);
  const reviews = page.locator("#reviews");
  const track = reviews.locator('[aria-roledescription="карусель"] > div:nth-child(2)');
  await track.scrollIntoViewIfNeeded();
  const box = await track.boundingBox();
  const y = Math.max(150, Math.min(700, box.y + 110));
  const x = Math.min(340, box.x + box.width - 30);
  const cdp = await context.newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  for (let step = 1; step <= 10; step++) {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x - step * 22, y }] });
    await page.waitForTimeout(15);
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await cdp.detach();
  await page.waitForTimeout(500);
  await assert.equal(await reviews.getByRole("button", { name: "Показать макет отзыва 2" }).getAttribute("aria-current"), "true");
  await reviews.getByRole("button", { name: "Следующий макет отзыва" }).click();
  await assert.equal(await reviews.getByRole("button", { name: "Показать макет отзыва 3" }).getAttribute("aria-current"), "true");
  await page.close();
  await context.close();
  console.log(`HOME-10/11 browser checks passed. Evidence: ${evidence}`);
} finally {
  await browser.close();
}
