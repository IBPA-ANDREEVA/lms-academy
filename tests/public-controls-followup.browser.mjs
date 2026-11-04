import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.FRONTEND_URL||'http://localhost:3123',out=process.env.FRONTEND_EVIDENCE||'.landing-evidence/controls';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true}),errors=[],results=[];
try {
 const page=await browser.newPage({viewport:{width:390,height:844}});page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/courses');await page.locator('[data-page-wipe][data-motion-ready="true"]').waitFor({state:'attached'});
 await page.locator('[data-mobile-menu-trigger]').click();await page.waitForTimeout(600);
 await page.evaluate(()=>{window.navFrames=[];window.sampling=true;const tick=()=>{const d=document.querySelector('dialog[aria-label="Меню сайта"]'),w=document.querySelector('[data-page-wipe]');window.navFrames.push({open:d.open,visible:getComputedStyle(d).visibility,phase:w.dataset.motionPhase,hidden:w.hidden,top:w.matches(':popover-open'),lock:document.body.style.position});if(window.sampling)requestAnimationFrame(tick)};requestAnimationFrame(tick)});
 await page.locator('dialog[open] a[href="/mini-courses"]').click();
 await page.waitForURL('**/mini-courses');await page.waitForFunction(()=>document.querySelector('[data-page-wipe]').hidden);await page.waitForTimeout(100);
 const frames=await page.evaluate(()=>{window.sampling=false;return window.navFrames});
 assert.ok(frames.some(f=>!f.hidden&&f.phase==='covering'&&f.open&&f.top));
 assert.ok(frames.some(f=>!f.hidden&&f.phase==='revealing'&&f.open&&f.visible==='hidden'));
 assert.ok(frames.filter(f=>!f.hidden).every(f=>f.open&&f.lock!=='fixed'),'menu stays open and scroll unlocked throughout wipe');
 assert.equal(await page.locator('dialog[aria-label="Меню сайта"]').getAttribute('open'),null);
 assert.equal(await page.evaluate(()=>document.activeElement?.tagName),'MAIN');
 results.push({menuFrames:frames});
 // Same-page anchor, hard refresh and reduced-motion fallback.
 await page.locator('[data-mobile-menu-trigger]').click();await page.waitForTimeout(550);
 const about=page.locator('dialog[open] a[href="/#about"]');
 if(await about.count()){await about.click();await page.waitForURL('**/#about');await page.waitForFunction(()=>document.querySelector('[data-page-wipe]').hidden);assert.ok(await page.locator('#about').evaluate(el=>Math.abs(el.getBoundingClientRect().top)<200))}
 await page.reload();await page.waitForTimeout(1500);
 await page.emulateMedia({reducedMotion:'reduce'});await page.locator('[data-mobile-menu-trigger]').click();await page.locator('dialog[open] a[href="/courses"]').click();await page.waitForURL('**/courses');await page.waitForFunction(()=>!document.querySelector('dialog[aria-label="Меню сайта"]').open);
 await page.emulateMedia({reducedMotion:'no-preference'});
 // Warm route first; then exercise rapid reversals without overlapping child reveals.
 await page.locator('#catalog-tab-mini-courses').click();await page.waitForURL('**/mini-courses');await page.waitForTimeout(500);
 await page.locator('#catalog-tab-courses').click();await page.waitForTimeout(60);
 assert.equal(await page.locator('#catalog-tab-courses').getAttribute('aria-selected'),'true');
 assert.ok(await page.locator('[data-catalog-experience] [data-animating]').count());
 await page.locator('#catalog-tab-mini-courses').click();await page.waitForTimeout(70);await page.locator('#catalog-tab-courses').click();
 await page.waitForURL('**/courses');await page.waitForTimeout(500);
 assert.equal(await page.locator('#catalog-panel-courses').getAttribute('aria-hidden'),'false');
 assert.equal(await page.locator('#catalog-panel-mini-courses').getAttribute('inert'),'');
 assert.equal(await page.locator('[data-catalog-experience] [data-animating]').count(),0);
 assert.deepEqual(await page.locator('#catalog-panel-courses article').evaluateAll(es=>es.map(e=>e.style.opacity).filter(Boolean)),[]);
 await page.goBack();await page.waitForTimeout(700);
 assert.equal(await page.locator('#catalog-tab-mini-courses').getAttribute('aria-selected'),'true');
 for(const width of [1440,390,360,768]){
  await page.setViewportSize({width,height:width<500?844:900});await page.goto(base);await page.waitForTimeout(1800);
  const tab=page.locator('[role="tab"]').filter({hasText:'Мини-курсы'}).first();await tab.click();await page.waitForTimeout(1800);await page.locator('#mini-courses').scrollIntoViewIfNeeded();
  assert.equal(await page.getByText('Сертификат выдаёт администратор после проверки завершения',{exact:true}).count(),0);
  await page.screenshot({path:`${out}/mini-preview-${width}.png`});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 }
 assert.deepEqual(errors,[]);console.log('Public controls: mobile lifecycle, reduced motion, catalog reversal/history and responsive mini preview passed.');
}finally{await writeFile(`${out}/controls-results.json`,JSON.stringify({results,errors},null,2));await browser.close()}
