import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.FRONTEND_URL || 'http://localhost:3123';
const evidence = process.env.FRONTEND_EVIDENCE || '.landing-evidence/home-motion';
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const page = await browser.newPage();
page.setDefaultTimeout(15000);
const errors = [], results = [];
page.on('pageerror', e => errors.push(e.message));
async function shot(name) { await page.screenshot({ path: `${evidence}/${name}.png` }); }
async function position(selector) { await page.locator(selector).evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' })); }
async function clean(scope = '[data-home-entrances]') {
  const styles = await page.locator(`${scope} h1,${scope} h2,${scope} h1 > span,${scope} h2 > span,${scope} img,${scope} article,${scope} li[data-motion-item]`).evaluateAll(elements => elements.flatMap(el =>
    // Offscreen prepared scenes intentionally retain their starting styles.
    // Completed/interrupted scenes and reduced motion must release everything.
    !matchMedia('(prefers-reduced-motion:reduce)').matches && (el.closest('[data-home-scene-state="prepared"]') || el.closest('section')?.querySelector('[data-home-scene-state="prepared"]')) ? [] :
    el.style.transform || el.style.clipPath || el.style.opacity || el.style.willChange ? [{ text: el.tagName, style: el.getAttribute('style') }] : []));
  assert.deepEqual(styles, [], 'interrupted/completed scene must release its styles');
}
async function geometry() { return page.evaluate(() => ({
  height: document.documentElement.scrollHeight,
  seams: [...document.querySelectorAll('[data-offers-geometry]')].map(el => ({top:el.offsetTop,left:el.offsetLeft,width:el.offsetWidth,height:el.offsetHeight})),
  pins: document.querySelectorAll('.pin-spacer').length,
})); }
try {
  for (const width of (process.env.MOTION_WIDTHS ? process.env.MOTION_WIDTHS.split(',').map(Number) : [1440, 390, 360, 768])) {
    await page.setViewportSize({ width, height: width < 500 ? 844 : 900 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(base); await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => document.querySelector('[data-home-scene="hero"]')?.dataset.homeSceneState === 'playing');
    const heroFrame = await page.locator('#hero-title > span').evaluateAll(els => els.map(el => ({transform:el.style.transform,clip:el.style.clipPath,opacity:el.style.opacity})));
    assert.ok(heroFrame.some(f => f.transform && f.clip), 'hero has real line motion');
    await page.waitForTimeout(120); await shot(`hero-in-${width}`);
    await page.waitForFunction(() => document.querySelector('[data-home-scene="hero"]')?.dataset.homeSceneState === 'complete');
    await clean(); const before = await geometry();
    for (const [id, selector] of [['about-photo','#about [data-motion-photo]'],['about','#about h2'],['founder-photo','#founder [data-motion-photo]'],['founder','#founder h2'],['learning','#learning-preview h2'],['learning-demo','[data-home-learning-demo]']]) {
      await position(selector); await page.waitForTimeout(130);
      if (['about','founder','learning-demo'].includes(id) && [1440,390].includes(width)) await shot(`${id}-in-${width}`);
      await page.waitForFunction(id => document.querySelector(`[data-home-scene="${id}"]`)?.dataset.homeSceneState === 'complete', id);
    }
    await position('[data-learning-offers]');
    for (const [label,id] of [['Основные курсы','courses'],['Пакеты','packages'],['Мини-курсы','mini-courses'],['Старт в США','start-usa']]) {
      await page.getByRole('tab', {name:label,exact:true}).click();
      await page.waitForFunction(() => !document.querySelector('[data-offers-track]')?.hasAttribute('data-transitioning'));
      await page.waitForTimeout(140);
      if ([1440,390].includes(width)) await shot(`${id}-in-${width}`);
      await page.waitForFunction(id => document.querySelector(`[data-home-scene="${id}"]`)?.dataset.homeSceneState === 'complete', id);
      const size = await page.locator('[data-offers-track]').evaluate(el => ({height:el.getBoundingClientRect().height,active:el.querySelector('[role="tabpanel"][aria-hidden="false"]').getBoundingClientRect().height}));
      assert.ok(Math.abs(size.height-size.active)<2, 'track uses active natural height');
    }
    for (const [id,selector] of [['reviews','#reviews h2'],['faq','#faq h2'],['contact','#contact h2']]) {
      await position(selector); await page.waitForTimeout(140);
      if ([1440,390].includes(width)) await shot(`${id}-in-${width}`);
      await page.waitForFunction(id => document.querySelector(`[data-home-scene="${id}"]`)?.dataset.homeSceneState === 'complete', id);
    }
    await clean(); assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.equal((await geometry()).pins,0);
    // Return to the original offer to compare structural geometry without content-height differences.
    await page.getByRole('tab', {name:'Основные курсы',exact:true}).click(); await page.waitForTimeout(700);
    const after = await geometry(); assert.deepEqual(after,before,'entrances add no scroll travel and do not move seam geometry');
    await position('#about h2'); await page.waitForTimeout(150);
    assert.equal(await page.locator('#about h2').getAttribute('data-home-scene-state'),'complete','seen sections do not replay');
    await page.emulateMedia({ reducedMotion: 'reduce' }); await clean();
    await page.setViewportSize({width:width===390?400:width,height:width<500?844:900}); await clean();
    results.push({width,heroFrame,before,after,states:'all 14 scenes completed, no replay, no extra geometry'});
  }
  // Interrupt an actual running entrance through live preference, focus and resize.
  await page.setViewportSize({width:1440,height:900}); await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto(base); await page.locator('[data-home-scene="hero"]').waitFor();
  await page.emulateMedia({reducedMotion:'reduce'}); await clean();
  await page.emulateMedia({reducedMotion:'no-preference'});
  await position('#contact h2'); await page.waitForTimeout(100);
  const input = page.locator('#contact input[name="name"]'); await input.fill('Сохранённое имя'); await clean('#contact');
  assert.equal(await input.inputValue(),'Сохранённое имя');
  await position('#founder h2'); await page.waitForTimeout(100); await page.setViewportSize({width:768,height:900}); await clean();
  await page.getByRole('tab',{name:'Пакеты',exact:true}).click(); await page.waitForTimeout(80);
  await page.getByRole('tab',{name:'Мини-курсы',exact:true}).click(); await page.waitForTimeout(80);
  await page.getByRole('tab',{name:'Основные курсы',exact:true}).click();
  await page.waitForFunction(() => !document.querySelector('[data-offers-track]')?.hasAttribute('data-transitioning'));
  await page.waitForTimeout(80);
  await page.waitForFunction(() => !document.querySelector('[data-home-scene-state="playing"]'));
  await clean();
  await page.locator('#catalog-status').getByRole('link',{name:'Все курсы'}).click(); await page.waitForURL('**/courses');
  await page.locator('header').getByRole('link',{name:'Beauty Business Academy',exact:true}).click(); await page.waitForURL(base+'/');
  await page.waitForFunction(()=>document.querySelector('[data-home-scene="hero"]')?.dataset.homeSceneState==='complete'); await clean(); assert.equal(await page.locator('[data-home-entrances]:visible').count(),1);
  const nojs = await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const ssr = await nojs.newPage(); await ssr.goto(base);
  assert.ok(await ssr.locator('#hero-title').isVisible()); assert.ok(await ssr.locator('#contact input[name="name"]').isVisible());
  assert.equal(await ssr.locator('main [style*="opacity: 0"]').count(),0); await nojs.close();
  assert.deepEqual(errors,[]);
  console.log(`Homepage entrances passed: 14 scenes x ${results.length} widths; once-only, natural height/static seams, reduced motion, focus, resize, rapid switches, route return and no-JS.`);
} finally { await writeFile(`${evidence}/results.json`,JSON.stringify({errors,results},null,2)); await browser.close(); }
