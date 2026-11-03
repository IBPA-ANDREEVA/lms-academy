import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,channel:'chrome'});
const page=await browser.newPage();const errors=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
await mkdir('.landing-evidence',{recursive:true});
try {
for(const width of [1440,768,390,360]) {
 await page.setViewportSize({width,height:width<500?844:900});await page.goto(process.env.FRONTEND_URL||'http://localhost:3000');await page.evaluate(()=>document.fonts.ready);
 assert.equal(await page.locator('#about a').count(),0);
 const story=page.locator('#founder summary');await story.click();await page.waitForTimeout(850);
 assert.equal(await page.locator('#founder details').getAttribute('open'),'');
 assert.equal(await page.locator('#founder details p').count(),3);
 await page.screenshot({path:`.landing-evidence/founder-open-${width}.png`,fullPage:false});
 await page.locator('#founder summary').click();await page.waitForTimeout(650);
 assert.equal(await page.locator('#founder details').getAttribute('open'),null);
 await page.locator('#learning-offers').evaluate(el=>scrollTo(0,el.getBoundingClientRect().top+scrollY-40));await page.waitForTimeout(800);
 const gap=await page.evaluate(()=>{const bar=document.querySelector('header > div > div');const tabs=document.querySelector('#learning-offers [role="tablist"]');return tabs.getBoundingClientRect().top-bar.getBoundingClientRect().bottom;});
 assert.ok(Math.abs(gap)<3,`header connection ${width}: ${gap}`);
 const tabs=page.getByRole('tablist',{name:'Форматы обучения'});await tabs.getByRole('tab',{name:'Мини-курсы',exact:true}).click();await page.waitForTimeout(650);
 const selected=tabs.locator('[aria-selected="true"]');assert.equal(await selected.evaluate(el=>getComputedStyle(el).backgroundColor),width<=760?'rgb(120, 40, 88)':'rgba(0, 0, 0, 0)');
 await page.screenshot({path:`.landing-evidence/switcher-v2-${width}.png`});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
}
await page.emulateMedia({reducedMotion:'reduce'});await page.locator('#founder summary').click();await page.waitForTimeout(50);assert.equal(await page.locator('#founder details').getAttribute('open'),'');
await page.emulateMedia({reducedMotion:'no-preference'});
await page.getByRole('button',{name:'Открыть меню'}).click();await page.getByRole('button',{name:'Войти в кабинет'}).click();
await page.getByRole('dialog',{name:'Войти в LMS Academy'}).waitFor();
await page.waitForTimeout(500);
assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('data-auth-first')),'true');
await page.screenshot({path:'.landing-evidence/modal-motion-360.png'});
await page.keyboard.press('Escape');
const cut=page.locator('#learning-preview button[class*="cut"]').first();await cut.hover();await page.waitForTimeout(550);
assert.notEqual(await cut.locator(':scope > span').first().evaluate(el=>getComputedStyle(el).transform),'none');
await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(50);
assert.equal(await cut.locator(':scope > span').first().evaluate(el=>new DOMMatrixReadOnly(getComputedStyle(el).transform).m41),0);
assert.deepEqual(errors,[]);console.log('Passed: header attachment, quiet tabs, founder disclosure, responsive widths, reduced motion, hydration.');
}finally{await browser.close();}
