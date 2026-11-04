import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.FRONTEND_URL || 'http://localhost:3122';
const evidence = process.env.FRONTEND_EVIDENCE || '.header-evidence/preview-refinement';
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome', ignoreDefaultArgs: ['--hide-scrollbars'] });
const page = await browser.newPage({ reducedMotion: 'reduce' });
const errors = [], results = [];
page.on('pageerror', e => errors.push(e.message));
page.setDefaultTimeout(12000);
async function goto(path) { await page.goto(base + path); await page.evaluate(() => document.fonts.ready); }
async function capture(name) { await page.screenshot({ path: `${evidence}/${name}.png` }); }
async function position(selector) {
 await page.locator(selector).scrollIntoViewIfNeeded();
 await page.locator(selector).evaluate(el => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
 await page.waitForTimeout(140);
 await page.locator(`${selector} img`).evaluateAll(imgs => Promise.all(imgs.map(img => img.decode().catch(() => {}))));
}
async function overflow() {
 assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'document must not overflow');
 const clipped = await page.locator('h1:visible, h2:visible, article:visible h3, [role=tab]:visible').evaluateAll(elements => elements.flatMap(el => {
  const range = document.createRange(); range.selectNodeContents(el);
  const box = el.getBoundingClientRect();
  if (box.right < 0 || box.left > innerWidth) return [];
  return [...range.getClientRects()].some(r => r.width && (r.left < box.left - 2 || r.right > box.right + 2)) ? [el.textContent] : [];
 }));
 assert.deepEqual(clipped, [], 'text must fit its control/card');
}
try {
 for (const width of [1440, 768, 390, 360]) {
  await page.setViewportSize({ width, height: width < 500 ? 844 : 900 });
  await goto('/');
  await page.locator('#catalog-status article').first().waitFor();
  assert.equal(await page.locator('#catalog-status article').count(), 3);
  assert.equal(await page.locator('#catalog-status nav, #mini-courses nav, #packages nav').count(), 0);
  assert.equal(await page.locator('#catalog-status article button, #catalog-status article a').count(), 3);
  assert.equal(await page.locator('#faq a[href="#contact"]').count(), 0);
  assert.equal(await page.getByText('СОЗДАЙТЕ СВОЙ ПАКЕТ', { exact: true }).count(), 0);
  assert.equal(await page.getByText('LMS ACADEMY / Учебная среда').count(), 0);
  if (width <= 760) assert.equal(await page.locator('#about').getByText('ОБ АКАДЕМИИ', { exact: true }).isVisible(), false);
  await capture(`hero-${width}`);
  await position('#about'); await capture(`about-${width}`);
  await position('#founder'); await capture(`founder-${width}`);
  await position('#learning-preview'); await capture(`learning-${width}`);
  await position('[data-learning-offers]'); await overflow(); await capture(`courses-${width}`);
  if (width > 760) {
   const tops = await page.locator('#catalog-status article').evaluateAll(els => els.map(e => e.getBoundingClientRect().top));
   assert.ok(Math.max(...tops) - Math.min(...tops) < 1, 'three cards in one desktop row');
  }
  await page.getByRole('tab', { name: 'Мини-курсы', exact: true }).click();
  await page.locator('#mini-courses').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#mini-courses article').count(), 3);
  assert.equal(await page.locator('#mini-courses article a').count(), 3);
  await overflow(); await capture(`mini-${width}`);
  await page.getByRole('tab', { name: 'Пакеты', exact: true }).click();
  assert.equal(await page.locator('#packages h2').count(), 0);
  await capture(`packages-${width}`);
  await page.getByRole('tab', { name: 'Старт в США', exact: true }).click();
  await capture(`usa-${width}`);
  for (const path of ['/courses', '/mini-courses']) {
   await goto(path);
   assert.equal(await page.locator('main h1').count(), 1);
   assert.equal(await page.locator('h1:visible').innerText(), path === '/courses' ? 'Курсы' : 'Мини-курсы');
   assert.equal(await page.getByText('Каталог обучения', { exact: true }).count(), 0);
   const cards = page.locator('[role=tabpanel][aria-hidden=false] article');
   await cards.first().waitFor(); assert.equal(await cards.count(), 4);
   assert.equal(await cards.locator('button').count(), 0);
   assert.equal(await cards.locator('a').count(), 4);
   await overflow(); await capture(`${path.slice(1)}-catalog-${width}`);
   if (width <= 600) await page.locator('#catalog-filters summary').click();
   const trigger = page.getByRole('button', { name: 'Направление Все направления' });
   await trigger.click();
   const list = page.getByRole('listbox');
   await list.waitFor();
   const r = await list.boundingBox();
   assert.ok(r.x >= 0 && r.x + r.width <= width, 'popup fits screen');
   // Click the real scrollbar gutter, then scroll and choose the last option.
   await page.mouse.click(r.x + r.width - 5, r.y + 25);
   assert.ok(await list.isVisible(), 'scrollbar pointer must not dismiss popup');
   await page.mouse.move(r.x + r.width / 2, r.y + r.height / 2);
   await page.mouse.wheel(0, 280); await page.waitForTimeout(160);
   assert.ok(await list.evaluate(el => el.scrollTop > 0), 'menu must actually scroll');
   await capture(`filter-${path.slice(1)}-${width}`);
   await list.getByRole('option').last().click();
   await page.waitForURL(/direction=/);
   assert.equal(await list.count(), 0);
   await page.locator('#catalog-filters').getByRole('button', { name: 'Сбросить фильтры', exact: true }).click();
   await page.waitForURL(base + path);
   await trigger.focus(); await page.keyboard.press('ArrowDown');
   await page.getByRole('listbox').waitFor(); await page.keyboard.press('End');
   await page.keyboard.press('Escape'); assert.equal(await page.getByRole('listbox').count(), 0);
   assert.ok(await trigger.evaluate(el => el === document.activeElement));
  }
  results.push({ width, previewLimit: 3, fullCatalog: 4, filters: 'pointer/scroll/selection/keyboard verified' });
 }
 // Deliberately delay hydration to inspect the actual first server-rendered frame.
 const cold = await browser.newPage({ viewport: { width: 390, height: 844 } });
 let release; const gate = new Promise(resolve => { release = resolve; });
 await cold.route('**/*.js*', async route => { await gate; await route.continue(); });
 const navigation = cold.goto(base, { waitUntil: 'load' });
 await cold.locator('[data-welcome-splash]').waitFor();
 const initial = await cold.locator('[data-welcome-splash]').evaluate(el => ({ hidden: el.hidden, rect: el.getBoundingClientRect().toJSON(), color: getComputedStyle(el).backgroundColor, z: getComputedStyle(el).zIndex }));
 assert.equal(initial.hidden, false); assert.equal(initial.color, 'rgb(120, 40, 88)'); assert.equal(initial.rect.y, 0); assert.equal(initial.rect.height, 844);
 await cold.screenshot({ path: `${evidence}/first-frame-before-hydration.png` });
 release(); await navigation;
 await cold.waitForFunction(() => document.querySelector('[data-splash-loader]').hidden);
 await cold.close(); results.push({ initial });
 await page.emulateMedia({ reducedMotion: 'no-preference' });
 for (const width of [1440, 390]) {
  await page.setViewportSize({ width, height: 900 }); await goto('/');
  await page.waitForFunction(() => document.querySelector('[data-page-wipe]').dataset.motionReady === 'true');
  const sample = await page.evaluate(async () => {
   document.querySelector('footer a[href="/courses"]').click();
   await new Promise(resolve => setTimeout(resolve, 90));
   const el = document.querySelector('[data-page-wipe]'), matrix = new DOMMatrix(getComputedStyle(el).transform);
   return { y: matrix.m42, x: matrix.m41, z: +getComputedStyle(el).zIndex, headerZ: +getComputedStyle(document.querySelector('header')).zIndex };
  });
  assert.ok(sample.z > sample.headerZ);
  assert.ok(width <= 760 ? sample.y < 0 && sample.x === 0 : sample.x > 0 && sample.y === 0);
  await capture(`wipe-${width}`);
  await page.waitForURL('**/courses'); await page.waitForFunction(() => document.querySelector('[data-page-wipe]').hidden);
  await page.goBack(); await page.waitForFunction(() => location.pathname === '/' && document.querySelector('[data-page-wipe]').hidden);
  results.push({ width, sample, back: 'settled' });
 }
 // A real mobile menu link closes its top-layer dialog and exposes the covering wipe.
 await page.getByRole('button', { name: 'Открыть меню' }).click();
 await page.getByRole('dialog', { name: 'Меню сайта' }).locator('a[href="/courses"]').click();
 await page.waitForURL('**/courses'); assert.equal(await page.getByRole('dialog', { name: 'Меню сайта' }).count(), 0);
 await page.waitForFunction(() => document.querySelector('[data-page-wipe]').hidden);
 // Hover changes depth without changing the button's hit box.
 await page.setViewportSize({ width: 1440, height: 900 }); await goto('/preview/components');
 const cut = page.locator('[data-cut-variant="primary"]'); await cut.scrollIntoViewIfNeeded();
 const before = await cut.boundingBox();
 assert.equal(await cut.evaluate(el => getComputedStyle(el).getPropertyValue('--cut-depth-opacity').trim()), '0');
 await cut.hover(); await page.waitForTimeout(300);
 assert.equal(await cut.evaluate(el => getComputedStyle(el).getPropertyValue('--cut-depth-opacity').trim()), '1');
 assert.deepEqual(await cut.boundingBox(), before);
 await capture('cut-hover-1440');
 await page.emulateMedia({ reducedMotion: 'reduce' });
 assert.equal(await cut.evaluate(el => getComputedStyle(el).getPropertyValue('--cut-depth-opacity').trim()), '0');
 assert.deepEqual(errors, []);
 await writeFile(`${evidence}/results.json`, JSON.stringify({ results, errors }, null, 2));
 console.log(JSON.stringify({ passed: true, results }, null, 2));
} finally { await browser.close(); }
