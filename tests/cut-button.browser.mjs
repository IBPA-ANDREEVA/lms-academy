import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.FRONTEND_URL||'http://localhost:3123',out=process.env.FRONTEND_EVIDENCE||'.landing-evidence/controls';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'}),results=[],errors=[];
const style=button=>button.evaluate(el=>{const s=getComputedStyle(el),arrow=getComputedStyle(el.querySelector('[class*="arrow"]'));return {background:s.backgroundColor,color:s.color,radius:s.borderRadius,outline:s.outlineStyle,x:new DOMMatrixReadOnly(arrow.transform).m41,line:getComputedStyle(el.querySelector('[class*="cutText"]'),'::after').transform,stripe:getComputedStyle(el,'::before').transform}});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'/preview/components');await page.evaluate(()=>document.fonts.ready);
 for(const variant of ['line','soft']) for(const tone of ['default','inverse']){
  const button=page.locator(`[data-cut-preview="${variant}"] [data-cut-example="${tone}"]`);
  await button.scrollIntoViewIfNeeded();await page.mouse.move(0,0);await page.waitForTimeout(350);
  const rest=await style(button),box=await button.boundingBox();assert.equal(rest.radius,variant==='line'?'3px':'14px');
  assert.equal(rest.color,tone==='inverse'?'rgb(255, 255, 255)':'rgb(120, 40, 88)');
  await button.hover();await page.waitForTimeout(350);const hover=await style(button);
  assert.equal(hover.x,3);assert.notEqual(hover.background,rest.background);assert.deepEqual(await button.boundingBox(),box);
  assert.notEqual(variant==='line'?hover.line:hover.stripe,variant==='line'?rest.line:rest.stripe);
  await page.mouse.move(0,0);await page.waitForTimeout(350);assert.deepEqual(await style(button),rest);
  results.push({variant,tone,rest,hover});
 }
 const target=page.locator('[data-cut-preview="line"] [data-cut-example="default"]');await target.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');await page.waitForTimeout(350);assert.equal((await style(target)).outline,'solid');await page.keyboard.press('Enter');assert.match(await page.locator('[aria-label="Cut: два варианта"] [role="status"]').innerText(),/1/);
 for(const button of await page.locator('[data-cut-preview] button:disabled').all()){await button.hover({force:true});await page.waitForTimeout(350);assert.equal((await style(button)).x,0)}
 await page.emulateMedia({reducedMotion:'reduce'});await target.hover();assert.equal((await style(target)).x,0);
 await target.evaluate(el=>el.blur());await page.mouse.move(0,0);
 for(const width of [1440,390,360,768]){await page.setViewportSize({width,height:width<500?844:900});await page.locator('[aria-label="Cut: два варианта"]').screenshot({path:`${out}/cut-states-${width}.png`});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 assert.ok(await page.locator('[data-cut-preview] button').evaluateAll(es=>es.every(el=>{const r=el.getBoundingClientRect();return r.right<=innerWidth+1&&r.left>=0&&el.scrollWidth<=el.clientWidth+1}))) }
 assert.deepEqual(errors,[]);console.log('Cut line/soft: inverse, hover/reversal, keyboard, disabled/loading, reduced motion and four widths passed.');
}finally{await writeFile(`${out}/cut-results.json`,JSON.stringify({results,errors},null,2));await browser.close()}
