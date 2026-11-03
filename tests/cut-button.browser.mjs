import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base=process.env.FRONTEND_URL||'http://localhost:3112';
const evidence=process.env.FRONTEND_EVIDENCE || 'docs/qa/evidence/LAND02-public-site-2026-11-02';
await mkdir(evidence,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'});
const results=[];
async function layers(button) { return button.evaluate(el=>{
 const xy=(e,p)=>{const c=getComputedStyle(e,p),m=new DOMMatrixReadOnly(c.transform==='none'?undefined:c.transform);return {x:m.m41,y:m.m42,color:c.color,background:c.backgroundColor,duration:c.transitionDuration,opacity:c.opacity,outline:c.outlineStyle};};
 return {body:xy(el,'::before'),slash:xy(el,'::after'),label:xy(el.querySelector(':scope > span')),arrow:xy(el.querySelector(':scope > span > [aria-hidden="true"]')),depth:xy(el.querySelector(':scope > span[aria-hidden="true"]')),button:xy(el)};
 }); }
try {
 const page=await browser.newPage({viewport:{width:1440,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'/preview/components');await page.evaluate(()=>document.fonts.ready);
 for(const variant of ['primary','secondary','inverse','link']) {
  const button=page.locator(`[data-cut-variant="${variant}"]`);await button.scrollIntoViewIfNeeded();await page.mouse.move(2,100);await page.waitForTimeout(350);
  const rest=await layers(button),box=await button.boundingBox();assert.equal(rest.body.x,0);await page.screenshot({path:`${evidence}/cut-${variant}-default.png`});
  await button.hover();await page.waitForTimeout(340);const hover=await layers(button);assert.equal(hover.body.x,-3);assert.equal(hover.body.y,-4);assert.equal(hover.slash.x,6);assert.equal(hover.label.x,-3);assert.equal(hover.arrow.x,5);assert.equal(hover.depth.x,5);assert.equal(hover.depth.y,6);assert.equal(hover.button.color,rest.button.color);assert.equal(hover.body.background,rest.body.background);assert.deepEqual(await button.boundingBox(),box);await page.screenshot({path:`${evidence}/cut-${variant}-hover.png`});
  await page.mouse.down();await page.waitForTimeout(150);const press=await layers(button);assert.equal(press.body.x,2);assert.equal(press.body.y,3);assert.equal(press.slash.x,4);assert.equal(press.depth.y,4);await page.screenshot({path:`${evidence}/cut-${variant}-pressed.png`});await page.mouse.up();await page.waitForTimeout(330);
  if(variant==='link') {await page.goto(base+'/preview/components');await button.scrollIntoViewIfNeeded();}
  await page.mouse.move(2,100);await button.evaluate(el=>el.blur());await page.waitForTimeout(350);assert.equal((await layers(button)).body.x,0);results.push({variant,rest,hover,press});
 }
 const target=page.locator('[data-cut-variant="primary"]');await target.scrollIntoViewIfNeeded();await target.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');await page.waitForTimeout(350);assert.equal(await target.evaluate(el=>el.matches(':focus-visible')),true);assert.equal((await layers(target)).button.outline,'solid');await page.screenshot({path:`${evidence}/cut-focus.png`});
 for(const selector of ['[data-cut-variant="loading"]','[aria-label="Parallax Cut: состояния"] button:disabled']) {
  const button=page.locator(selector).first();await button.hover({force:true});await page.waitForTimeout(350);assert.equal((await layers(button)).body.x,0);assert.equal((await layers(button)).slash.x,0);
 }
 await page.emulateMedia({reducedMotion:'reduce'});await target.hover();await page.waitForTimeout(50);const reduced=await layers(target);assert.equal(reduced.body.x,0);assert.equal(reduced.arrow.x,0);assert.equal(reduced.body.duration,'0s');await page.screenshot({path:`${evidence}/cut-reduced-motion.png`});
 await page.emulateMedia({reducedMotion:'no-preference'});await page.mouse.move(2,100);await target.evaluate(el=>el.blur());await page.setViewportSize({width:390,height:844});await page.locator('[aria-label="Parallax Cut: состояния"]').screenshot({path:`${evidence}/cut-states-390.png`});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.setViewportSize({width:1440,height:900});await page.locator('[aria-label="Parallax Cut: состояния"]').screenshot({path:`${evidence}/cut-states-1440.png`});assert.deepEqual(errors,[]);await page.close();
 const touch=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const p=await touch.newPage();await p.goto(base+'/preview/components');const button=p.locator('[data-cut-variant="primary"]');await button.scrollIntoViewIfNeeded();const box=await button.boundingBox();const cdp=await touch.newCDPSession(p);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+box.width/2,y:box.y+box.height/2}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(30);const touchPress=await layers(button);assert.ok(touchPress.body.x>0&&touchPress.body.x<=2,'native touch pressed feedback');await p.waitForTimeout(600);assert.equal((await layers(button)).body.x,0);await touch.close();
 console.log('Parallax Cut: layers, variants, stable hit area, press/release, focus, disabled/loading, reduced motion and touch passed.');
} finally {await writeFile(`${evidence}/cut-results.json`,JSON.stringify(results,null,2));await browser.close();}
