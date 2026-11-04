import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.FRONTEND_URL || 'http://localhost:3000';
const evidence = process.env.FRONTEND_EVIDENCE || '.header-evidence/public-ui-fixes';
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const context = await browser.newContext({ reducedMotion: 'reduce' });
const page = await context.newPage();
const errors = [];
const results = [];
page.on('pageerror', error => errors.push(error.message));
async function goto(path) { await page.goto(base + path); await page.evaluate(() => document.fonts.ready); }
async function capture(name) { await page.screenshot({ path: `${evidence}/${name}.png` }); }
async function settled() { await page.waitForFunction(() => !document.querySelector('[data-learning-transition]')); }
try {
 for (const width of [1440, 768, 390, 360]) {
  await page.setViewportSize({ width, height: width < 500 ? 844 : 900 });
  for (const path of ['/courses', '/mini-courses', '/cart', '/checkout', '/courses/demo-course-1', '/mini-courses/demo-mini-1', '/preview/components']) {
   await goto(path);
   const header = page.locator('header').first();
   assert.equal(await header.getAttribute('data-home-route'), 'false');
   assert.equal(await header.evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(250, 249, 250)');
   const logo = await header.locator('a > svg:visible').first().boundingBox();
   assert.ok(logo && logo.height >= (width === 768 ? 26 : 32));
   if (width < 500) assert.equal(logo.x, 16, 'visible SVG must align with mobile gutter');
   assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
   if (path === '/courses' || path === '/preview/components') await capture(`${path.slice(1).replaceAll('/', '-')}-${width}`);
  }
  if (width < 500) {
   await page.getByRole('button', { name: 'Открыть меню', exact: true }).first().click();
   const menu = page.getByRole('dialog', { name: 'Меню сайта', exact: true });
   assert.equal(await menu.locator('small').count(), 0);
   assert.ok(!/[↗⌃→]/u.test(await menu.innerText()));
   assert.equal(await menu.getByRole('link', { name: 'Основные курсы', exact: true }).count(), 1);
   await capture(`menu-${width}`);
   await page.keyboard.press('Escape');
   await menu.waitFor({ state: 'hidden' });
   assert.ok(await page.getByRole('button', { name: 'Открыть меню', exact: true }).first().evaluate(el => el === document.activeElement));
  }
  await goto('/');
  assert.equal(await page.locator('header').first().getAttribute('data-home-route'), 'true');
  await capture(`home-${width}`);
  if (width < 500) {
   await page.locator('#catalog-status').scrollIntoViewIfNeeded();
   const filters = page.getByRole('navigation', { name: 'Направления курсов', exact: true });
   const rect = await filters.boundingBox();
   assert.ok(rect.height <= 64, `single-row filters: ${rect.height}`);
   await filters.getByRole('button', { name: 'Ногти', exact: true }).click();
   assert.equal(await filters.getByRole('button', { name: 'Ногти', exact: true }).getAttribute('aria-pressed'), 'true');
   await filters.getByRole('button', { name: 'Все направления', exact: true }).click();
   const courses = page.locator('[aria-label="Карточки курсов"]');
   const reviews = page.locator('#reviews [tabindex="0"]');
   for (const [name, rail] of [['courses', courses], ['reviews', reviews]]) {
    await rail.scrollIntoViewIfNeeded();
    const bounds = await rail.evaluate(el => ({ left: el.getBoundingClientRect().left, right: el.getBoundingClientRect().right, screen: document.body.getBoundingClientRect().right }));
    assert.ok(Math.abs(bounds.left) <= 1 && Math.abs(bounds.right - bounds.screen) <= 1, `${name} clips at viewport edges: ${JSON.stringify(bounds)}`);
    await rail.evaluate(el => { el.scrollLeft = 180; });
    await capture(`${name}-scrolled-${width}`);
   }
   await page.locator('#offer-tab-mini-courses').click();
   assert.ok((await page.getByRole('navigation', { name: 'Направления мини-курсов', exact: true }).boundingBox()).height <= 64);
  }
  await page.locator('#learning-preview').scrollIntoViewIfNeeded();
  await page.locator('#learning-tab-assignment').click();
  await page.locator('#learning-comment').fill('Сохранить комментарий при переключении');
  await page.locator('#learning-tab-feedback').click();
  await page.locator('#learning-tab-assignment').click();
  assert.equal(await page.locator('#learning-comment').inputValue(), 'Сохранить комментарий при переключении');
  assert.equal(await page.locator('#learning-preview [role="tabpanel"][aria-hidden="false"]').count(), 1);
  assert.equal(await page.locator('#learning-preview [role="tabpanel"][aria-hidden="true"]:not([inert])').count(), 0);
  await capture(`learning-${width}`);
  results.push({ width, shell: 'opaque non-home', menu: 'no labels/arrows', state: 'preserved', overflow: 'none' });
 }
 // Real motion, both directions, rapid input, keyboard, resize and live preference changes.
 await page.emulateMedia({ reducedMotion: 'no-preference' });
 await goto('/');
 await page.locator('#learning-preview').scrollIntoViewIfNeeded();
 await page.waitForTimeout(600);
 for (const [from, to, direction, sign] of [['lesson', 'assignment', 'left', 1], ['assignment', 'lesson', 'right', -1], ['lesson', 'feedback', 'left', 1], ['feedback', 'assignment', 'right', -1]]) {
  assert.equal(await page.locator(`#learning-tab-${from}`).getAttribute('aria-selected'), 'true');
  const sample = await page.evaluate(async ({ from, to }) => {
   document.querySelector(`#learning-tab-${to}`).click();
   await new Promise(resolve => setTimeout(resolve, 90));
   const body = document.querySelector('#learning-preview [data-stage]');
   const curtain = document.querySelector('[data-learning-curtain]');
   const tabs = document.querySelector('#learning-preview [role="tablist"]');
   if (curtain.getBoundingClientRect().top > tabs.getBoundingClientRect().top || curtain.getBoundingClientRect().bottom < tabs.getBoundingClientRect().bottom) throw Error('Wipe does not cover step pickers');
   return { outgoingVisible: getComputedStyle(document.querySelector(`#learning-panel-${from}`)).display !== "none", direction: body.dataset.learningDirection, transitioning: body.dataset.learningTransition, x: new DOMMatrix(getComputedStyle(curtain).transform).m41 };
  }, { from, to });
  assert.equal(sample.direction, direction);
  assert.equal(sample.transitioning, 'true');
  assert.equal(sample.outgoingVisible, true, 'outgoing content remains painted until covered');
  assert.ok(sample.x * sign > 0, `wipe follows ${direction}: ${JSON.stringify(sample)}`);
  await capture(`wipe-${from}-${to}`);
  await settled();
 }
 await page.locator('#learning-comment').fill('Быстрые переходы');
 await page.evaluate(async () => { for (const id of ['feedback', 'lesson', 'assignment']) { document.querySelector(`#learning-tab-${id}`).click(); await new Promise(resolve => setTimeout(resolve, 45)); } });
 await settled();
 assert.equal(await page.locator('#learning-comment').inputValue(), 'Быстрые переходы');
 await page.locator('#learning-tab-assignment').focus(); await page.keyboard.press('ArrowLeft'); await settled();
 assert.equal(await page.locator('#learning-tab-lesson').getAttribute('aria-selected'), 'true');
 await page.locator('#learning-tab-feedback').click();
 await page.emulateMedia({ reducedMotion: 'reduce' }); await settled();
 await page.emulateMedia({ reducedMotion: 'no-preference' });
 assert.equal(await page.locator('[data-learning-transition]').count(), 0, 'preference reset does not replay old transition');
 await page.locator('#learning-tab-assignment').click(); await page.setViewportSize({ width: 390, height: 844 }); await settled();
 assert.equal(await page.locator('#learning-preview [role="tabpanel"][aria-hidden="false"]').count(), 1);
 assert.deepEqual(errors, []);
 await writeFile(`${evidence}/results.json`, JSON.stringify({ results, motion: 'both directions, skipped steps, rapid input, keyboard, resize, live reduced motion pass', errors }, null, 2));
 console.log('Public UI fixes: all checks passed');
} finally { await browser.close(); }
