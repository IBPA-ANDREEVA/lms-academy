import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.FRONTEND_URL || 'http://localhost:3123';
const evidence = process.env.FRONTEND_EVIDENCE || '.landing-evidence/refinements';
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const page = await browser.newPage({ reducedMotion: 'reduce' });
const errors = [], results = [];
page.on('pageerror', e => errors.push(e.message));
page.setDefaultTimeout(15000);
async function shot(name) { await page.screenshot({ path: `${evidence}/${name}.png` }); }
async function position(selector) { await page.locator(selector).evaluate(el => el.scrollIntoView({ block: 'start', behavior: 'instant' })); }
async function action(name) {
  if (!await page.locator('#catalog-preview-panel').isVisible()) await page.getByRole('button', { name: 'Тестовое меню', exact: true }).click();
  await page.locator('#catalog-preview-panel').getByRole('button', { name, exact: true }).click();
  await page.keyboard.press('Escape');
}
async function fit() {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'document overflow');
  const clipped = await page.locator('#contact h2, #contact label, #packages h3, [role=tab]:visible').evaluateAll(elements => elements.flatMap(el => {
    if (!el.checkVisibility()) return [];
    const box = el.getBoundingClientRect(), range = document.createRange(); range.selectNodeContents(el);
    return [...range.getClientRects()].some(r => r.width && (r.left < box.left - 2 || r.right > box.right + 2)) ? [el.textContent] : [];
  }));
  assert.deepEqual(clipped, [], 'text must fit its container');
}
try {
  for (const width of [1440, 768, 390, 360]) {
    await page.setViewportSize({ width, height: width < 500 ? 844 : 900 });
    await page.goto(base); await page.evaluate(() => document.fonts.ready);
    await action('Сбросить все демо-данные');
    assert.equal(await page.getByText('СВЯЗЬ С АКАДЕМИЕЙ', { exact: true }).count(), 0);
    assert.equal(await page.getByText('ИНТЕРАКТИВНЫЙ ПРИМЕР ОБУЧЕНИЯ', { exact: true }).count(), 0);
    assert.equal(await page.getByText('Поля с * обязательны', { exact: true }).count(), 0);
    await position('#contact'); await fit();
    const contact = await page.locator('#contact').evaluate(el => ({ form: el.querySelector('form').getBoundingClientRect().toJSON(), title: el.querySelector('h2').getBoundingClientRect().toJSON() }));
    if (width > 700) assert.ok(contact.form.right <= contact.title.left, 'form left / title right');
    else assert.ok(contact.title.bottom <= contact.form.top, 'mobile reading order');
    await shot(`contact-${width}`);
    for (const [tab, section, href] of [['Основные курсы', '#catalog-status', '/courses'], ['Мини-курсы', '#mini-courses', '/mini-courses']]) {
      await page.getByRole('tab', { name: tab, exact: true }).click();
      await position('[data-learning-offers]');
      const link = page.locator(`${section} a[href="${href}"]`);
      const button = await link.boundingBox(), card = await page.locator(`${section} article`).first().boundingBox();
      assert.ok(button.bottom <= card.top || button.y + button.height <= card.y, 'catalog link above cards');
      assert.ok(await link.evaluate(el => el.parentElement.getBoundingClientRect().right - el.getBoundingClientRect().right < 2), 'catalog link right aligned');
      await shot(`${tab === 'Мини-курсы' ? 'mini' : 'courses'}-${width}`);
    }
    await page.getByRole('tab', { name: 'Пакеты', exact: true }).click();
    await position('[data-learning-offers]'); await fit();
    assert.equal(await page.locator('[data-package-card]').count(), 3);
    const pack = page.locator('[data-package-card]').first();
    assert.equal(await pack.locator('button').count(), 1, 'one semantic full-card target, no separate CTA');
    await pack.locator('button').click();
    assert.equal(await pack.getAttribute('data-in-cart'), 'true');
    await pack.locator('button').evaluate(el => el.click());
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('lms.catalog.preview-cart.v2')).length), 1, 'repeat clicks do not duplicate');
    await shot(`packages-${width}`);
    await page.reload();
    await page.getByRole('tab', { name: 'Пакеты', exact: true }).click();
    await page.locator('[data-package-card][data-in-cart="true"]').waitFor();
    await action('Очистить каталог');
    await page.locator('#packages').getByRole('heading', { name: 'Пакеты готовятся к публикации' }).waitFor();
    await shot(`packages-empty-${width}`);
    await action('Добавить демо-пакет');
    assert.equal(await page.locator('[data-package-card]').count(), 1);
    await action('Показать загрузку');
    await page.locator('#packages [aria-busy="true"]').waitFor();
    await action('Показать ошибку каталога');
    await page.locator('#packages [role="alert"]').waitFor();
    await action('Сбросить все демо-данные');
    await position('#reviews');
    assert.equal(await page.getByRole('button', { name: 'Следующий макет отзыва' }).count(), 0);
    assert.ok(await page.getByText('Потяните, чтобы листать').isVisible());
    const rail = page.locator('#reviews [tabindex="0"]');
    await rail.focus(); await page.keyboard.press('ArrowRight');
    assert.ok(await rail.evaluate(el => el.scrollLeft) > 0);
    await shot(`reviews-${width}`);
    results.push({ width, contact, packageCartPersistence: true, packageStates: true, keyboardReviews: true });
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(base); await position('#learning-preview');
  await page.getByRole('tab', { name: /Сдать домашнее задание/ }).click(); await page.waitForTimeout(700);
  await page.locator('#learning-comment').fill('Сохраняем комментарий при быстром переключении.');
  const frames = await page.evaluate(async () => {
    const upload = document.querySelector('label:has(input[type="file"])');
    const before = upload.getBoundingClientRect().height;
    document.querySelector('#learning-tab-feedback').click();
    const frames = [];
    const start = performance.now();
    while (performance.now() - start < 240) {
      await new Promise(requestAnimationFrame);
      if (upload.checkVisibility()) frames.push({ t: performance.now() - start, height: upload.getBoundingClientRect().height });
    }
    return { before, frames };
  });
  assert.ok(frames.frames.length > 1);
  assert.ok(frames.frames.every(f => Math.abs(f.height - frames.before) < 1), 'outgoing upload height stays stable');
  results.push({ learningFrames: frames });
  for (const id of ['assignment', 'lesson', 'feedback', 'assignment']) { await page.locator(`#learning-tab-${id}`).click(); await page.waitForTimeout(60); }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.match(await page.locator('#learning-comment').inputValue(), /Сохраняем/);
  await shot('learning-after-interruption');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' })); await page.waitForTimeout(400);
  const summary = page.locator('header nav[aria-label="Основная навигация"] summary');
  const dropdown = page.locator('header nav[aria-label="Основная навигация"] details > ul');
  const openings = [];
  for (let i = 0; i < 2; i++) {
    await summary.click(); await page.waitForTimeout(65);
    openings.push(await dropdown.evaluate(el => ({ opacity: Number(getComputedStyle(el).opacity), transform: getComputedStyle(el).transform })));
    await page.waitForTimeout(260); assert.equal(await dropdown.evaluate(el => Number(getComputedStyle(el).opacity)), 1);
    await shot(`dropdown-open-${i}`);
    await summary.click(); await page.waitForTimeout(300);
  }
  assert.ok(openings.every(f => f.opacity > 0 && f.opacity < 1), 'opening animation repeats each time');
  results.push({ dropdownOpenings: openings });
  assert.deepEqual(errors, []);
  console.log('Landing refinements passed: 4 viewports, package/cart states, learning frame geometry, repeated dropdown motion, keyboard and text fit.');
} finally { await writeFile(`${evidence}/results.json`, JSON.stringify({ errors, results }, null, 2)); await browser.close(); }
