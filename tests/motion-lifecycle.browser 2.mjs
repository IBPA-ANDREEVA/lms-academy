import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium }=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.FRONTEND_URL||'http://localhost:3114';
const evidence=process.env.FRONTEND_EVIDENCE||'docs/qa/evidence/LAND02-motion-2026-11-02';
await mkdir(evidence,{recursive:true});
const browser=await chromium.launch({channel:'chrome'}), results=[];
try {
 for(const scenario of ['cpu','storage','utility','slow']) {
  const context=await browser.newContext({viewport:{width:390,height:844}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await context.addInitScript(()=>{window.__introTimes=[];new MutationObserver(records=>{for(const record of records){for(const node of record.addedNodes)if(node instanceof Element&&node.matches('[data-public-intro]'))window.__introTimes.push({event:'start',time:performance.now()});for(const node of record.removedNodes)if(node instanceof Element&&node.matches('[data-public-intro]'))window.__introTimes.push({event:'end',time:performance.now()});}}).observe(document,{subtree:true,childList:true});});
  if(scenario==='storage')await context.addInitScript(()=>Object.defineProperty(window,'sessionStorage',{get(){throw Error('disabled')}}));
  if(scenario==='cpu'){const cdp=await context.newCDPSession(page);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});}
  if(scenario==='slow')await context.route('**/*.js',async route=>{await new Promise(resolve=>setTimeout(resolve,2700));await route.continue();});
  await page.goto(base+(scenario==='utility'?'/cart':'/'));
  await page.waitForTimeout(2100);
  assert.equal(await page.locator('[data-public-intro]').count(),0);
  const times=await page.evaluate(()=>window.__introTimes);
  assert.deepEqual(times,[], 'Ready pages never play a timed welcome');
  if(scenario==='utility'||scenario==='storage'){
   if(scenario==='utility') await page.locator('main a[href="/courses"]').first().click(); else await page.getByRole('contentinfo').getByRole('link',{name:'Основные курсы',exact:true}).click();await page.waitForURL('**/courses');await page.waitForTimeout(300);assert.equal(await page.locator('[data-public-intro]').count(),0);assert.deepEqual(await page.evaluate(()=>window.__introTimes),times);
  }
  assert.deepEqual(errors,[]);results.push({scenario,times,errors});await context.close();
 }
 console.log('Motion lifecycle: 4x CPU, denied storage, utility entry/internal navigation and slow hydration passed.');
}finally{await writeFile(`${evidence}/lifecycle-results.json`,JSON.stringify(results,null,2));await browser.close();}
