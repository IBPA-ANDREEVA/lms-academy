import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import path from "node:path";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.FRONTEND_URL || "http://localhost:3101";
const evidence = process.env.FRONTEND_EVIDENCE || "/tmp/lms-learning-offers-qa";
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const errors = [];
const labels = ["Основные курсы", "Пакеты", "Мини-курсы", "Старт в США"];
const ids = ["courses", "packages", "mini-courses", "start-usa"];
async function settle(page, index) {
  await page.waitForFunction((i) => {
    const track = document.querySelector("[data-offers-track]");
    const panel = track.children[i];
    return !track.hasAttribute("data-transitioning") && panel.getAttribute("aria-hidden") === "false" && Math.abs(track.getBoundingClientRect().height - panel.getBoundingClientRect().height) < 2;
  }, index);
}
async function select(page, index) {
  await page.getByRole("tablist", { name: "Форматы обучения" }).getByRole("tab", { name: new RegExp(labels[index]) }).click();
  await settle(page, index);
}
async function groupTop(page) {
  await page.evaluate(() => window.scrollTo(0, document.querySelector("[data-learning-offers]").getBoundingClientRect().top + scrollY - document.querySelector("header").getBoundingClientRect().height));
  await page.waitForTimeout(350);
}
async function swipe(page, locator, direction = -1) {
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  const x = direction < 0 ? Math.min(page.viewportSize().width - 35, box.x + box.width - 35) : Math.max(35, box.x + 35);
  const y = Math.max(200, Math.min(page.viewportSize().height - 100, box.y + Math.min(box.height / 2, 100)));
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  for (let step = 1; step <= 10; step++) {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x + direction * step * 26, y }] });
    await page.waitForTimeout(18);
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await cdp.detach();
  await page.waitForTimeout(400);
}
try {
  for (const width of [1440, 1024, 768, 390, 360]) {
    const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, hasTouch: true });
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base);
    await page.evaluate(() => document.fonts.ready);
    await groupTop(page);
    const heights = [];
    const geometry = [];
    for (let index = 0; index < labels.length; index++) {
      await select(page, index);
      await groupTop(page);
      assert.equal(await page.locator(`[id="offer-panel-${ids[index]}"]`).getAttribute("inert"), null);
      assert.equal(await page.locator('[role="tabpanel"][inert]').count(), 3);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow ${width}/${index}`);
      const nextHeight = await page.locator("[data-learning-offers]").evaluate((el) => el.getBoundingClientRect().height);
      heights.push(nextHeight);
      geometry.push(await page.locator('[data-offers-geometry="top"]').evaluate((el) => ({
        top: el.getBoundingClientRect().top - el.parentElement.getBoundingClientRect().top,
        height: el.getBoundingClientRect().height,
        clipPath: getComputedStyle(el).clipPath,
      })));
      const gap = await page.locator("[data-offers-track]").evaluate((el) => Math.abs(el.getBoundingClientRect().height - el.querySelector('[aria-hidden="false"]').getBoundingClientRect().height));
      assert.ok(gap < 2, `active panel leaves unused height ${width}/${index}`);
      await page.screenshot({ path: path.join(evidence, `${ids[index]}-${width}-viewport.png`) });
      await page.evaluate(() => scrollBy(0, Math.min(600, document.querySelector('[data-offers-track]').clientHeight - innerHeight + 200)));
      await page.screenshot({ path: path.join(evidence, `${ids[index]}-${width}-lower.png`) });
    }
    assert.ok(geometry.every((shape) => JSON.stringify(shape) === JSON.stringify(geometry[0])), `shared geometry moves between formats at ${width}`);
    assert.equal(await page.locator('[data-home-flow]').count(), 0, 'right-side rail must remain absent');
    assert.ok(Math.max(...heights) - Math.min(...heights) > 40, `panels should use natural heights ${width}`);
    await select(page, 1);
    await page.getByRole("navigation", { name: "Размер пакета" }).getByRole("button", { name: "3 направления", exact: true }).click();
    assert.equal(await page.locator("#packages article").count(), 1);
    await page.getByRole("button", { name: "СОБРАТЬ СВОЙ ПАКЕТ" }).click();
    const dialog = page.getByRole("dialog", { name: "Собрать свой пакет" });
    await dialog.waitFor();
    await dialog.getByRole("checkbox", { name: /^Ногти/ }).check();
    await dialog.getByRole("checkbox", { name: /^Брови/ }).check();
    assert.equal(await dialog.getByRole("checkbox", { name: /^Макияж/ }).isDisabled(), true);
    await dialog.getByRole("button", { name: /ПОСМОТРЕТЬ СОСТАВ/ }).click();
    assert.equal(await dialog.getByRole("heading", { name: "Ваш пример пакета" }).count(), 1);
    await dialog.screenshot({ path: path.join(evidence, `builder-${width}.png`) });
    if (width === 390) {
      await dialog.getByRole("button", { name: "ИЗМЕНИТЬ ВЫБОР" }).click();
      await dialog.getByRole("radio", { name: "6 направлений", exact: true }).check();
      for (const checkbox of await dialog.getByRole("checkbox").all()) await checkbox.check();
      assert.equal(await dialog.getByRole("checkbox", { checked: true }).count(), 6);
      await dialog.getByRole("radio", { name: "2 направления", exact: true }).check();
      assert.equal(await dialog.getByRole("button", { name: /ПОСМОТРЕТЬ СОСТАВ/ }).isDisabled(), true);
      assert.equal(await dialog.getByRole("checkbox", { checked: true }).count(), 6);
    }
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "hidden" });
    assert.equal(await page.getByRole("button", { name: "СОБРАТЬ СВОЙ ПАКЕТ" }).evaluate((el) => el === document.activeElement), true);
    await select(page, 2);
    await page.getByRole("navigation", { name: "Направления мини-курсов" }).getByRole("button", { name: "Брови", exact: true }).click();
    assert.equal(await page.locator("#mini-courses article").count(), 1);
    await page.getByRole("button", { name: "Все мини-курсы", exact: true }).click();
    assert.equal(await page.locator("#mini-courses article").count(), 3);
    await select(page, 3);
    assert.equal(await page.locator("#usa-topics li").count(), 4);
    assert.equal(await page.locator('a[href="/start-in-usa"]').count(), 0);
    await page.getByRole("button", { name: /УЗНАТЬ О МОДУЛЕ/ }).click();
    assert.equal(await page.locator("#usa-topics").evaluate((el) => el === document.activeElement), true);
    await groupTop(page);
    await page.evaluate(() => scrollBy(0, 280));
    const sticky = await page.evaluate(() => ({ header: document.querySelector("header").getBoundingClientRect().bottom, nav: document.querySelector('[role="tablist"][aria-label="Форматы обучения"]').getBoundingClientRect().top }));
    assert.ok(Math.abs(sticky.header - sticky.nav) < 2, `switcher overlaps header ${width}`);
    if (width === 390) {
      await select(page, 0);
      await swipe(page, page.locator("#courses-title"));
      await settle(page, 1);
      await page.getByRole("button", { name: "Все пакеты", exact: true }).click();
      await swipe(page, page.locator("#packages [data-offer-carousel]"));
      await settle(page, 1); // Inner card swipe must not move the outer track.
      assert.ok(await page.locator("#packages [data-offer-carousel]").evaluate((el) => el.scrollLeft > 10));
      await page.emulateMedia({ reducedMotion: "reduce" });
      await select(page, 2);
      await page.getByRole("tab", { name: "Мини-курсы", exact: true }).focus();
      await page.keyboard.press("ArrowRight");
      await settle(page, 3);
    }
    await context.close();
  }
  assert.deepEqual(errors, []);
  console.log(`Passed: four panels, sticky navigation, keyboard/reduced motion, touch isolation, filters, package dialog and release boundaries. Evidence: ${evidence}`);
} finally { await browser.close(); }
