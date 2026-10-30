import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const origin = process.env.FRONTEND_URL || "http://localhost:3000";
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
await mkdir(".detail-evidence", { recursive: true });

try {
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width <= 390 ? 844 : 900 });
    for (const [kind, slug] of [["courses", "course-lashes"], ["mini-courses", "mini-lashes"]]) {
      await page.goto(`${origin}/${kind}/${slug}`);
      await page.getByRole("heading", { level: 1 }).waitFor();
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator("main > section").count(), 6);
      assert.equal(await page.locator('meta[name="robots"]').getAttribute("content"), "noindex, nofollow");
      assert.equal(await page.getByRole("button", { name: "В корзину →" }).count(), 2);
      assert.equal(await page.getByRole("button", { name: "В корзину →" }).first().isDisabled(), true);
      assert.equal(await page.getByText("Публичное видео пока недоступно").isVisible(), true);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${kind} overflow at ${width}`);
      const first = page.locator("#curriculum summary").first();
      await first.click();
      assert.equal(await page.locator("#curriculum details").first().getAttribute("open"), "");
      await first.press("Enter");
      assert.equal(await page.locator("#curriculum details").first().getAttribute("open"), null);
      if (kind === "mini-courses") {
        assert.equal(await page.getByText("Уроки в записи · без куратора").isVisible(), true);
        assert.equal(await page.getByText("Куратора и проверки домашних работ нет.").isVisible(), true);
      }
      if (width === 1440 || width === 390) {
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({ path: `.detail-evidence/${kind}-${width}.png`, fullPage: true });
      }
    }
  }
  await page.goto(`${origin}/courses/not-a-product`);
  await page.getByRole("heading", { name: "Страница курса не найдена" }).waitFor();
  assert.equal(await page.getByRole("heading", { name: "Страница курса не найдена" }).isVisible(), true);
  assert.equal(await page.getByRole("link", { name: /К каталогу курсов/ }).isVisible(), true);
  assert.match(await page.locator('meta[name="robots"]').first().getAttribute("content"), /noindex/);
  await page.goto(`${origin}/mini-courses/not-a-product`);
  await page.getByRole("heading", { name: "Страница мини-курса не найдена" }).waitFor();
  assert.equal(await page.getByRole("heading", { name: "Страница мини-курса не найдена" }).isVisible(), true);
  assert.equal(await page.getByRole("link", { name: /К мини-курсам/ }).isVisible(), true);
  assert.match(await page.locator('meta[name="robots"]').first().getAttribute("content"), /noindex/);
  assert.deepEqual(errors, []);
} finally {
  await browser.close();
}
