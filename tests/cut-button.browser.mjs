import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.FRONTEND_URL || 'http://localhost:3123';
const evidence = process.env.FRONTEND_EVIDENCE || '.landing-evidence/refinements';
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const results = [], errors = [];
async function layers(button) { return button.evaluate(el => {
  const style = (target, pseudo) => {
    const css = getComputedStyle(target, pseudo), matrix = new DOMMatrixReadOnly(css.transform === 'none' ? undefined : css.transform);
    return { x: matrix.m41, y: matrix.m42, color: css.color, background: css.backgroundColor, clip: css.clipPath, duration: css.transitionDuration, outline: css.outlineStyle };
  };
  const panel = el.querySelector('[class*="cutPanel"]');
  return { panel: style(panel), slash: style(el, '::after'), arrow: style(panel.querySelector('[aria-hidden="true"]')), root: style(el) };
}); }
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(base + '/preview/components'); await page.evaluate(() => document.fonts.ready);
  for (const variant of ['primary','secondary','inverse','link']) {
    const button = page.locator(`[data-cut-variant="${variant}"]`);
    await button.scrollIntoViewIfNeeded(); await page.mouse.move(2,100); await page.waitForTimeout(700);
    const rest = await layers(button), box = await button.boundingBox();
    assert.equal(rest.panel.background, 'rgb(29, 27, 31)');
    assert.equal(rest.panel.duration, '0.65s, 0.65s');
    await button.hover(); await page.waitForTimeout(150);
    const during = await layers(button); assert.notEqual(during.panel.clip, rest.panel.clip);
    await page.waitForTimeout(550);
    const hover = await layers(button);
    assert.equal(hover.panel.background, 'rgb(120, 40, 88)');
    assert.equal(hover.panel.color, 'rgb(255, 255, 255)');
    assert.equal(hover.arrow.x, 4); assert.equal(hover.slash.x, 5);
    assert.deepEqual(await button.boundingBox(), box, 'hit area stays still');
    await page.screenshot({ path: `${evidence}/cut-${variant}-hover.png` });
    await page.mouse.move(2,100); await page.waitForTimeout(120);
    const reversing = await layers(button); assert.notEqual(reversing.panel.clip, rest.panel.clip);
    await page.waitForTimeout(580); assert.deepEqual((await layers(button)).panel, rest.panel);
    await page.screenshot({ path: `${evidence}/cut-${variant}-rest.png` });
    results.push({ variant, rest, during, hover, reversing });
  }
  const target = page.locator('[data-cut-variant="primary"]');
  await target.focus(); await page.keyboard.press('Tab'); await page.keyboard.press('Shift+Tab'); await page.waitForTimeout(700);
  assert.equal(await target.evaluate(el => el.matches(':focus-visible')), true);
  assert.equal((await layers(target)).root.outline, 'solid');
  await page.keyboard.press('Enter');
  assert.match(await page.locator('[aria-label="Double Cut + Panel: состояния"] [role="status"]').innerText(), /1/);
  await target.evaluate(el => el.blur());
  for (const selector of ['[data-cut-variant="loading"]','[aria-label="Double Cut + Panel: состояния"] button:disabled']) {
    const button = page.locator(selector).first(); await button.hover({ force: true }); await page.waitForTimeout(700);
    assert.equal((await layers(button)).arrow.x, 0); assert.equal((await layers(button)).slash.x, 0);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' }); await target.hover();
  const reduced = await layers(target);
  assert.equal(reduced.arrow.x, 0); assert.equal(reduced.slash.x, 0); assert.equal(reduced.panel.duration, '0s');
  for (const width of [1440,768,390,360]) {
    await page.setViewportSize({ width, height: width < 500 ? 844 : 900 });
    const review = page.locator('[aria-label="Double Cut + Panel: состояния"]');
    await review.screenshot({ path: `${evidence}/cut-states-${width}.png` });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  }
  assert.deepEqual(errors, []);
  const touch = await browser.newContext({ viewport: {width:390,height:844}, hasTouch:true, isMobile:true, reducedMotion:'reduce' });
  const phone = await touch.newPage(); await phone.goto(base + '/preview/components');
  await phone.locator('[data-cut-variant="primary"]').tap();
  assert.match(await phone.locator('[aria-label="Double Cut + Panel: состояния"] [role="status"]').innerText(), /1/);
  await touch.close();
  console.log('Double Cut + Panel passed: CSS sweep, reversal, variants, stable hit area, keyboard, disabled/loading, live reduced motion and touch.');
} finally { await writeFile(`${evidence}/cut-results.json`, JSON.stringify({results,errors}, null, 2)); await browser.close(); }
