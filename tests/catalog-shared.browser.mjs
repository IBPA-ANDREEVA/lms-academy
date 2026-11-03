import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir,writeFile } from 'node:fs/promises';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.FRONTEND_URL||'http://localhost:3123';
const enabled=process.env.TEST_PREVIEW==='true';
const evidence=process.env.FRONTEND_EVIDENCE||'docs/qa/evidence/LAND03-04-2026-11-03';
await mkdir(evidence,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'});
const page=await browser.newPage({reducedMotion:'reduce'});page.setDefaultTimeout(10000);
const errors=[];const checks=[];page.on('pageerror',e=>errors.push(e.message));
async function inspectText(scope) {
 return page.locator(scope).evaluateAll(roots=>{
  const failures=[];
  for(const root of roots){
   const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
   while(walker.nextNode()){
    const node=walker.currentNode,parent=node.parentElement;
    if(!node.textContent.trim()||!parent||parent.closest('[inert],[aria-hidden="true"]')||!parent.checkVisibility())continue;
    const style=getComputedStyle(parent);if(style.position==='absolute' && parent.clientWidth<=1)continue;
    const range=document.createRange();range.selectNodeContents(node);
    for(const rect of range.getClientRects()){
     let ancestor=parent;while(ancestor&&ancestor!==document.body){
      const css=getComputedStyle(ancestor),box=ancestor.getBoundingClientRect();
      // Off-screen content in a real horizontal scroller is reachable, unlike hidden text.
      if(['auto','scroll'].includes(css.overflowX) && ancestor.scrollWidth>ancestor.clientWidth+2)break;
      if(['hidden','clip'].includes(css.overflowX) && (rect.left<box.left-2||rect.right>box.right+2))failures.push(node.textContent.trim());
      ancestor=ancestor.parentElement;
     }
    }
   }
  }
  return [...new Set(failures)];
 });
}
try {
 for(const width of [1440,390,360,768]){
  await page.setViewportSize({width,height:width<500?844:900});
  await page.goto(base+'/');await page.evaluate(()=>document.fonts.ready);
  if(enabled)await page.locator('#catalog-status article').first().waitFor();
  else {assert.equal(await page.locator('a[href*="/demo-"]').count(),0);assert.equal(await page.locator('#catalog-status article').count(),0);}
  await page.locator('#catalog-status').scrollIntoViewIfNeeded();
  await page.locator('#catalog-status img').evaluateAll(images=>Promise.all(images.map(image=>image.decode().catch(()=>{}))));
  await page.screenshot({path:`${evidence}/${enabled?'preview':'real'}-home-catalog-${width}.png`});
  assert.deepEqual(await inspectText('#catalog-status'),[],`home text clipping ${width}`);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.goto(base+'/mini-courses');
  if(enabled)await page.locator('#catalog-panel-mini-courses article').first().waitFor();
  await page.locator('#catalog-panel-mini-courses').scrollIntoViewIfNeeded();
  assert.deepEqual(await inspectText('#catalog-panel-mini-courses'),[],`mini text clipping ${width}`);
  await page.screenshot({path:`${evidence}/${enabled?'preview':'real'}-mini-results-${width}.png`});
  const icons=await page.locator('link[rel="icon"],link[rel="apple-touch-icon"]').evaluateAll(nodes=>nodes.map(e=>e.getAttribute('href')));
  assert.equal(new Set(icons).size,icons.length);
  checks.push({width,clippedText:[],icons});
 }
 await page.goto(base+'/preview/components');await page.locator('#catalog-states').scrollIntoViewIfNeeded();
 await page.getByLabel('Состояние каталога — демонстрация').selectOption('filtered');
 await page.locator('#catalog-states').getByRole('button',{name:'Сбросить фильтры'}).click();
 await page.locator('#catalog-states').getByRole('heading',{name:'Курсы готовятся к публикации'}).waitFor();
 await page.screenshot({path:`${evidence}/${enabled?'preview':'real'}-shared-states.png`});
 if(enabled){
  await page.goto(base+'/');await page.locator('#catalog-status article').first().waitFor();
  await page.getByRole('button',{name:'Тестовое меню',exact:true}).click();await page.getByRole('button',{name:'Очистить каталог',exact:true}).click();
  await page.locator('#catalog-status').getByRole('heading',{name:'Курсы готовятся к публикации'}).waitFor();
  await page.getByRole('button',{name:'Сбросить каталог',exact:true}).click();await page.keyboard.press('Escape');
  await page.locator('#catalog-status article').first().waitFor();
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto(base+'/courses');await page.locator('#catalog-panel-courses article').first().waitFor();
  await page.getByRole('tab',{name:'Мини-курсы',exact:true}).click();
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForURL('**/mini-courses');
  await page.waitForFunction(()=>document.querySelector('#catalog-panel-courses')?.hasAttribute('inert'));
  assert.equal(await page.locator('#catalog-panel-courses').getAttribute('inert'),'');
 }
 assert.deepEqual(errors,[]);
 await writeFile(`${evidence}/${enabled?'preview':'real'}-shared-results.json`,JSON.stringify({checks,errors},null,2));
 console.log('PASS shared home, mini cards, component states, text-range clipping, icon uniqueness, live motion preference');
}finally{await browser.close();}
