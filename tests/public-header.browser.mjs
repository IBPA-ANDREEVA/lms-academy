import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const base = process.env.FRONTEND_URL || "http://localhost:3000";
const evidence = ".header-evidence";
await mkdir(evidence, { recursive: true });

try {
  for (const width of [1440, 1024, 768, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: width <= 390 ? 844 : 900 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base);
    await page.evaluate(() => document.fonts.ready);
    const header = page.locator("header").first();
    const bar = header.locator("div[class*='bar']").first();
    const nav = header.getByRole("navigation", { name: "Основная навигация" });
    assert.equal(await header.getByRole("button", { name: "Открыть меню" }).count(), 0);
    assert.ok(await header.getByRole("button", { name: "Войти", exact: true }).isVisible());
    assert.ok(await header.getByRole("button", { name: /^Корзина, продуктов:/ }).isEnabled());
    assert.equal(await nav.locator(":scope > ul > li").count(), 4);
    assert.equal(await nav.getByText("Личный кабинет").count(), 0);
    assert.equal(await nav.getByText("Корзина").count(), 0);
    assert.equal(await nav.locator("small").count(), 0);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow at ${width}`);
    const start = await header.evaluate((element) => ({
      height: element.getBoundingClientRect().height,
      progress: Number.parseFloat(getComputedStyle(element).getPropertyValue("--header-progress")),
      ink: getComputedStyle(element).getPropertyValue("--header-ink").trim(),
      heroTop: document.querySelector("[data-home-hero]").getBoundingClientRect().top,
    }));
    assert.equal(start.progress, 0);
    assert.ok(start.ink === "#fff" || start.ink === "#ffffff" || start.ink.startsWith("rgb(255") || start.ink.startsWith("rgba(255"), `top ink ${start.ink}`);
    if (width === 1440 || width === 390) await page.screenshot({ path: `${evidence}/home-top-${width}.png` });

    await nav.locator("summary").click();
    const courseLink = nav.getByRole("link", { name: "Основные курсы" });
    assert.ok(await courseLink.isVisible());
    const dropdown = await courseLink.boundingBox();
    assert.ok(dropdown.x >= 0 && dropdown.x + dropdown.width <= width, `dropdown horizontal fit ${width}`);
    assert.ok(dropdown.y >= 0 && dropdown.y < 500, `dropdown vertical fit ${width}: ${dropdown.y}`);
    if (width === 390) await page.screenshot({ path: `${evidence}/mobile-dropdown-390.png` });
    await page.keyboard.press("Escape");
    assert.equal(await nav.locator("details[open]").count(), 0);

    await page.evaluate(() => scrollTo(0, 160));
    await page.waitForFunction(() => document.querySelector("header")?.dataset.homeScrolled === "true");
    await page.waitForFunction(() => Number.parseFloat(getComputedStyle(document.querySelector("header")).getPropertyValue("--header-progress")) > .99);
    const end = await header.evaluate((element) => ({
      height: element.getBoundingClientRect().height,
      progress: Number.parseFloat(getComputedStyle(element).getPropertyValue("--header-progress")),
      heroTop: document.querySelector("[data-home-hero]").getBoundingClientRect().top,
    }));
    assert.equal(start.height, end.height, `header slot changed at ${width}`);
    assert.ok(Math.abs(end.heroTop - (start.heroTop - 160)) < 2, `hero reflow at ${width}`);
    assert.match(await bar.evaluate((element) => getComputedStyle(element).backgroundColor), /^rgba?\(255, 255, 255/);
    if (width === 1440 || width === 390) await page.screenshot({ path: `${evidence}/home-filled-${width}.png` });
    await header.getByRole("button", { name: "Войти", exact: true }).click();
    assert.ok(await page.getByRole("dialog", { name: "Войти в LMS Academy" }).isVisible());
    await page.keyboard.press("Escape");
    assert.ok(await header.getByRole("button", { name: "Войти", exact: true }).evaluate((element) => element === document.activeElement));
    const filledBounds = await bar.boundingBox();
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForFunction(() => document.querySelector("header")?.dataset.homeScrolled === "false");
    await page.waitForFunction(() => {
      const progress = Number.parseFloat(getComputedStyle(document.querySelector("header")).getPropertyValue("--header-progress"));
      return progress > .05 && progress < .95;
    });
    const returningBounds = await bar.boundingBox();
    assert.ok(returningBounds.width > filledBounds.width, `return must expand the surface at ${width}`);
    assert.ok(returningBounds.height > filledBounds.height, `return must grow vertically at ${width}`);
    if (width === 1440 || width === 390) await page.screenshot({ path: `${evidence}/home-returning-${width}.png` });
    await page.waitForFunction(() => Number.parseFloat(getComputedStyle(document.querySelector("header")).getPropertyValue("--header-progress")) < .01);
    assert.ok(Math.abs((await bar.boundingBox()).width - (await header.boundingBox()).width) < 1, `top surface must reach viewport edges at ${width}`);
    await page.evaluate(() => { scrollTo(0, 160); requestAnimationFrame(() => scrollTo(0, 0)); });
    await page.waitForFunction(() => document.querySelector("header")?.dataset.homeScrolled === "false" && Number.parseFloat(getComputedStyle(document.querySelector("header")).getPropertyValue("--header-progress")) < .01);
    assert.deepEqual(errors, []);
    await page.close();
  }
  const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  await reduced.goto(base);
  await reduced.evaluate(() => scrollTo(0, 160));
  await reduced.waitForFunction(() => document.querySelector("header")?.dataset.homeScrolled === "true");
  await reduced.waitForFunction(() => Number.parseFloat(getComputedStyle(document.querySelector("header")).getPropertyValue("--header-progress")) === 1);
  await reduced.emulateMedia({ reducedMotion: "no-preference" });
  await reduced.evaluate(() => scrollTo(0, 0));
  await reduced.waitForFunction(() => Number.parseFloat(getComputedStyle(document.querySelector("header")).getPropertyValue("--header-progress")) < .01);
  await reduced.emulateMedia({ reducedMotion: "reduce" });
  await reduced.evaluate(() => scrollTo(0, 160));
  await reduced.waitForFunction(() => Number.parseFloat(getComputedStyle(document.querySelector("header")).getPropertyValue("--header-progress")) === 1);
  await reduced.close();

  const catalog = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await catalog.goto(`${base}/courses`);
  assert.ok(await catalog.getByRole("navigation", { name: "Основная навигация" }).isVisible());
  assert.ok(await catalog.getByRole("button", { name: "Войти", exact: true }).isVisible());
  await catalog.waitForFunction(() => {
    const header = document.querySelector("header");
    const filters = document.querySelector("#catalog-filters");
    return header && filters && Math.abs(Number.parseFloat(getComputedStyle(filters).top) - header.getBoundingClientRect().height) < 3;
  });
  await catalog.evaluate(() => scrollTo(0, 1000));
  const sticky = await catalog.evaluate(() => ({
    header: document.querySelector("header").getBoundingClientRect().bottom,
    filters: document.querySelector("#catalog-filters").getBoundingClientRect().top,
  }));
  assert.ok(Math.abs(sticky.header - sticky.filters) < 3, `catalog sticky offset: ${JSON.stringify(sticky)}`);
  await catalog.close();
  console.log("PublicHeader states, navigation, cart preview, auth and reversal passed at 1440, 1024, 768, 390 and 320px.");
} finally {
  await browser.close();
}
