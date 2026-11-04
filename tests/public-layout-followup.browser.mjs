import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.FRONTEND_URL || 'http://localhost:3000';
const evidence = process.env.FRONTEND_EVIDENCE || '.header-evidence/layout-followup';
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const page = await browser.newPage({ reducedMotion: 'reduce' });
const errors = [], results = [];
page.on('pageerror', e => errors.push(e.message));
async function goto(path) { await page.goto(base + path); await page.evaluate(() => document.fonts.ready); }
async function capture(name) { await page.screenshot({ path: `${evidence}/${name}.png` }); }
try {
 for (const width of [2546, 1440, 768, 390, 360]) {
  await page.setViewportSize({ width, height: width < 500 ? 844 : 900 });
  for (const path of ['/courses', '/mini-courses']) {
   await goto(path);
   assert.equal(await page.locator('main h1').count(), 1);
   assert.equal(await page.locator('main h1').innerText(), 'Каталог обучения');
   assert.equal(await page.locator('main img[alt="Две женщины читают газеты на бирюзовом фоне"]').count(), 0);
   assert.ok((await page.locator('#catalog-filters').boundingBox()).y < 230, 'filters immediately below compact title');
   const cards = page.locator('[role="tabpanel"][aria-hidden="false"] article');
   await cards.first().waitFor();
   assert.ok((await cards.first().boundingBox()).y < 520, 'results visible in first viewport');
   assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
   await capture(`${path.slice(1)}-${width}`);
  }
  await goto('/');
  await page.evaluate(() => scrollTo(0, document.querySelector('[data-learning-offers]').getBoundingClientRect().top + scrollY + 180));
  await page.waitForFunction(() => document.querySelector('header').dataset.offersDocked === 'true');
  const dock = await page.evaluate(() => {
   const header = document.querySelector('header'), bar = header.querySelector(':scope > div > div'), dock = document.querySelector('[data-offers-dock]');
   return { gap: dock.getBoundingClientRect().top - header.getBoundingClientRect().bottom, background: getComputedStyle(header).backgroundColor, radius: getComputedStyle(bar).borderBottomLeftRadius, bridge: getComputedStyle(bar, '::after').content };
  });
  assert.ok(Math.abs(dock.gap) < 1, JSON.stringify(dock));
  assert.equal(dock.bridge, 'none');
  if (width > 760) { assert.equal(dock.background, 'rgb(120, 40, 88)'); assert.equal(dock.radius, '16px'); }
  await capture(`docked-${width}`);
  await page.locator('#reviews').scrollIntoViewIfNeeded();
  const rail = page.locator('#reviews [tabindex="0"]');
  const rect = await rail.evaluate(el => ({ right: el.getBoundingClientRect().right, screen: document.body.getBoundingClientRect().right }));
  assert.ok(Math.abs(rect.right - rect.screen) < 1, `review edge at ${width}: ${JSON.stringify(rect)}`);
  await rail.evaluate(el => { el.scrollLeft = 180; });
  await capture(`reviews-${width}`);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  results.push({ width, compactCatalog: true, joinedDock: dock, reviewViewport: rect });
 }
 await page.emulateMedia({ reducedMotion: 'no-preference' });
 for (const width of [1440, 390]) {
  await page.setViewportSize({ width, height: 900 }); await goto('/');
  await page.waitForFunction(() => document.querySelector('[data-page-wipe]').dataset.motionReady === 'true');
  const sample = await page.evaluate(async () => {
   document.querySelector('footer a[href="/courses"]').click();
   await new Promise(resolve => setTimeout(resolve, 90));
   const wipe = document.querySelector('[data-page-wipe]'), matrix = new DOMMatrix(getComputedStyle(wipe).transform);
   return { axis: wipe.dataset.axis, x: matrix.m41, y: matrix.m42, hidden: wipe.hidden };
  });
  assert.equal(sample.hidden, false);
  assert.equal(sample.axis, width <= 760 ? 'vertical' : 'horizontal');
  assert.ok(width <= 760 ? sample.y > 0 && sample.x === 0 : sample.x > 0 && sample.y === 0, JSON.stringify(sample));
  await capture(`wipe-cover-${width}`);
  await page.waitForURL('**/courses');
  await page.waitForFunction(() => document.querySelector('[data-page-wipe]').hidden);
  // Back history still settles and reveals correctly with the requested axis.
  await page.goBack(); await page.waitForURL(base + '/');
  await page.waitForFunction(() => document.querySelector('[data-page-wipe]').hidden);
  results.push({ width, navigationSample: sample, backSettled: true });
 }
 // Resizing during a navigation retains one axis; reduced motion settles it.
 await page.evaluate(() => document.querySelector('footer a[href="/courses"]').click());
 await page.setViewportSize({ width: 768, height: 900 });
 await page.emulateMedia({ reducedMotion: 'reduce' });
 await page.waitForURL('**/courses');
 await page.waitForFunction(() => document.querySelector('[data-page-wipe]').hidden);
 assert.deepEqual(errors, []);
 await writeFile(`${evidence}/results.json`, JSON.stringify({ results, errors }, null, 2));
 console.log('Layout follow-up: compact catalogs, joined dock, viewport-edge reviews, vertical mobile navigation pass');
} finally { await browser.close(); }
