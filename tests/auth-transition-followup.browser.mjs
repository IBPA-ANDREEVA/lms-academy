import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.FRONTEND_URL || 'http://localhost:3102';
const evidence = process.env.FRONTEND_EVIDENCE || '/tmp/lms-ui-followup';
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width < 400 ? 844 : 900 });
    await page.goto(base);
    if (width < 761) {
      await page.getByRole('button', { name: 'Открыть меню' }).click();
      await page.getByRole('button', { name: 'Войти в кабинет' }).click();
    } else await page.getByRole('button', { name: 'Войти', exact: true }).click();
    await page.getByRole('button', { name: 'Зарегистрироваться' }).click();
    const dialog = page.getByRole('dialog', { name: 'Регистрация' });
    if (width >= 768) assert.ok(await dialog.evaluate(el => el.scrollHeight <= el.clientHeight + 1), 'Empty registration must fit');
    await dialog.getByRole('button', { name: 'СОЗДАТЬ АККАУНТ' }).click();
    await page.waitForTimeout(300);
    if (width >= 768) assert.ok(await dialog.evaluate(el => el.scrollHeight <= el.clientHeight + 1), 'All-empty validation must fit at desktop/tablet height');
    for (const name of ['first-name', 'last-name']) {
      await dialog.locator(`[name="${name}"]`).fill('Тест');
      if (width > 600) {
        const first = await dialog.locator('[name="first-name"]').boundingBox();
        const last = await dialog.locator('[name="last-name"]').boundingBox();
        assert.equal(first.y, last.y);
        assert.equal(first.height, last.height);
      }
      await page.screenshot({ path: `${evidence}/name-${name}-${width}.png` });
      await dialog.locator(`[name="${name}"]`).fill('');
      await dialog.getByRole('button', { name: 'СОЗДАТЬ АККАУНТ' }).click();
    }
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.keyboard.press('Escape');
  }
  // Hold real route responses so the pending presentation can be inspected.
  for (const width of [1440, 390]) {
    const routePage = await browser.newPage();
    routePage.on("pageerror", error => errors.push(error.message));
    await routePage.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await routePage.route('**/courses?*', async route => { await new Promise(resolve => setTimeout(resolve, 2200)); await route.continue(); });
    await routePage.goto(base);
    await routePage.waitForTimeout(900);
    await routePage.getByRole('contentinfo').getByRole('link', { name: 'Основные курсы', exact: true }).click();
    await routePage.locator('[data-page-wipe][data-waiting]').waitFor();
    const strokes = routePage.locator('[data-loading-stroke]');
    const start = await strokes.first().evaluate(el => getComputedStyle(el).transform);
    await routePage.waitForTimeout(250);
    assert.notEqual(await strokes.first().evaluate(el => getComputedStyle(el).transform), start);
    assert.equal(await routePage.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--scrollbar-track').trim()), '#782858');
    await routePage.screenshot({ path: `${evidence}/transition-${width}.png` });
    if (width === 390) await routePage.emulateMedia({ reducedMotion: 'reduce' });
    await routePage.waitForURL('**/courses');
    await routePage.locator('[data-page-wipe]').waitFor({ state: 'hidden' });
    await routePage.emulateMedia({ reducedMotion: 'no-preference' });
    await routePage.unrouteAll({ behavior: "wait" });
    await routePage.close();
  }
  assert.deepEqual(errors, []);
  console.log('PASS: mixed-name alignment, modal sizing, circled feedback captures, delayed route animation, rail, live reduced motion.');
} finally { await browser.close(); }
