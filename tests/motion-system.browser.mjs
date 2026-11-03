import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.FRONTEND_URL || 'http://localhost:3114';
const evidence = process.env.FRONTEND_EVIDENCE || 'docs/qa/evidence/LAND02-motion-2026-11-02';
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [], errors = [], frames = [], limitations = [];
const widths = [1920,1440,1280,1024,768,430,390,360,320];
const routes = ['/', '/courses', '/mini-courses', '/courses/course-lashes', '/mini-courses/mini-lashes', '/cart', '/checkout', '/preview/components'];
function monitor(page) { page.on('pageerror', e => errors.push(e.message)); }
try {
 // D-021 provides a bounded welcome Splash and loading-driven Splash/Wipe.
 // Dedicated orchestration coverage lives in premium-motion.browser.mjs.
 for (const width of [1440,390]) {
  const ctx=await browser.newContext({viewport:{width,height:width<500?844:900}});
  const page=await ctx.newPage();monitor(page);await page.goto(base);
  await page.waitForSelector('[data-learning-offers][data-enhanced="true"]');
  assert.equal(await page.locator('[data-public-intro]').count(),0);
  await page.waitForFunction(()=>!document.querySelector('[data-splash-loader]:not([hidden])'));
  assert.equal(await page.evaluate(()=>sessionStorage.getItem('lms.public-intro.v1')),null);
  await page.screenshot({path:`${evidence}/ready-entry-${width}.png`});
  await page.reload();await page.waitForFunction(()=>!document.querySelector('[data-splash-loader]:not([hidden])'));
  assert.equal(await page.locator('[data-public-intro]').count(),0);
  results.push({width,check:'welcome entry/reload settles without a stranded overlay'});await ctx.close();
 }
 // Normal motion at every requested width and every implemented route kind.
 for(const width of widths) {
  const ctx=await browser.newContext({viewport:{width,height:width<500?844:900}});
  const page=await ctx.newPage(); monitor(page);
  for(const route of routes) {
   await page.goto(base+route); await page.evaluate(()=>document.fonts.ready);
   await page.waitForTimeout(650);
   // Fast traversal, then reverse: entrances must never leave hidden or translated content.
   await page.evaluate(async()=>{ for(let y=0;y<document.documentElement.scrollHeight;y+=innerHeight){scrollTo(0,y);await new Promise(r=>requestAnimationFrame(r));}scrollTo(0,0); });
   await page.waitForTimeout(700);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${route}/${width}: overflow`);
   const stranded=await page.locator('[data-motion-reveal]').evaluateAll(roots=>roots.flatMap(root=>[root,...root.querySelectorAll('[data-motion-item]')]).filter(el=>el.checkVisibility()&&(Number(getComputedStyle(el).opacity)<1||el.style.transform)).map(el=>el.tagName));
   assert.deepEqual(stranded,[],`${route}/${width}: unfinished reveal`);
   await page.screenshot({path:`${evidence}/motion-${route.replaceAll('/','_')||'home'}-${width}.png`});
   results.push({width,route,check:'normal motion, fast/reverse scroll, visible content, bounds'});
  }
  await page.goto(base); await page.waitForTimeout(400);
  const founder=page.locator('#founder details');
  await founder.locator('summary').evaluate(el=>{el.click();el.click();el.click();});
  await page.waitForTimeout(400); assert.equal(await founder.getAttribute('open'),'');
  await founder.locator('summary').click(); await page.setViewportSize({width:width+1,height:844});
  await page.waitForTimeout(100); assert.equal(await founder.getAttribute('open'),null);
  await page.setViewportSize({width,height:width<500?844:900});
  await page.emulateMedia({reducedMotion:'reduce'});
  await founder.locator('summary').click(); assert.equal(await founder.getAttribute('open'),'');
  await page.emulateMedia({reducedMotion:'no-preference'});
  if(width<=760) {
   await page.getByRole('button',{name:'Открыть меню'}).click();
   await page.keyboard.press('Escape'); await page.locator('dialog[open]').waitFor({state:'hidden'});
   assert.equal(await page.locator('dialog[open]').count(),0);
   await page.getByRole('button',{name:'Открыть меню'}).click();
   await page.emulateMedia({reducedMotion:'reduce'});
   await page.getByRole('button',{name:'Войти в кабинет'}).click();
  } else await page.getByRole('button',{name:'Войти',exact:true}).first().click();
  const auth=page.getByRole('dialog',{name:'Войти в LMS Academy'}); await auth.waitFor();
  await page.keyboard.press('Escape'); await page.locator('dialog[open]').waitFor({state:'hidden'}); assert.equal(await page.locator('dialog[open]').count(),0);
  assert.equal(await page.evaluate(()=>document.body.style.position),'');
  results.push({width,check:'disclosure reversal, resize, live reduced motion, immediate menu/auth dismissal'});
  await ctx.close();
 }
 // No-JS content on every route, not only the homepage.
 for(const route of routes) {
  const ctx=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await ctx.newPage();await page.goto(base+route);
  assert.ok(await page.locator('main:visible').first().isVisible());assert.equal(await page.locator('[data-public-intro]').count(),0);
  const headings = page.locator('main:visible h1:visible');
  if (await headings.count()) assert.equal(await headings.first().evaluate(el=>getComputedStyle(el).opacity),'1');
  else { limitations.push({route,issue:'No-JS detail stays on existing streamed loading fallback; actual detail is in hidden PPR segment.'}); await page.screenshot({path:`${evidence}/no-js-${route.replaceAll('/','_')}.png`}); }
  results.push({route,check:await headings.count()?'no-JS main/heading visible, overlay absent':'no-JS loading fallback visible; detail content blocked'});await ctx.close();
 }
 // Reduced-motion-first navigation keeps its native interaction and cleanup.
 const reduced=await browser.newContext({reducedMotion:'reduce'});
 const reducedPage=await reduced.newPage();monitor(reducedPage);await reducedPage.goto(base);
 await reducedPage.getByRole('contentinfo').getByRole('link',{name:'Основные курсы',exact:true}).click();
 await reducedPage.waitForURL('**/courses');
 assert.equal(await reducedPage.locator('[data-page-wipe]:not([hidden]),[data-splash-loader]:not([hidden])').count(),0);
 results.push({check:'reduced motion navigation has no overlay'});await reduced.close();
 assert.deepEqual(errors,[]);assert.deepEqual(limitations,[],"No-JS content requirements (pre-existing routing blockers)");console.log(`Motion system: ${results.length} checks passed; ${frames.length} live frames.`);
} finally {await writeFile(`${evidence}/motion-system-results.json`,JSON.stringify({results,errors,frames,limitations},null,2));await browser.close();}
