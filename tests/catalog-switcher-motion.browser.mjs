import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.FRONTEND_URL||'http://localhost:3123',out=process.env.FRONTEND_EVIDENCE||'.landing-evidence/switcher/after';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true}),results=[],errors=[];
try{
 for(const width of [1440,390,360,768]){
  const context=await browser.newContext({viewport:{width,height:width<500?844:900},reducedMotion:'no-preference'});
  // Delayed RSC responses exercise the optimistic UI independently of route commits.
  await context.route(/_rsc=/,async route=>{await new Promise(resolve=>setTimeout(resolve,650));await route.continue()});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   window.switchFrames=[];window.switchClicks=0;
   document.addEventListener('click',e=>{if(e.target.closest('[id^="catalog-tab-"]'))window.switchClicks++},true);
   const sample=()=>{
    const root=document.querySelector('[data-catalog-experience]'),track=root?.lastElementChild;
    if(track){const box=track.getBoundingClientRect(),panels=[...track.children].map(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return {kind:el.dataset.kind,hidden:el.inert,left:r.left,right:r.right,opacity:Number(s.opacity),visibility:s.visibility}});
     window.switchFrames.push({time:performance.now(),click:window.switchClicks,animating:track.hasAttribute('data-animating'),width:box.width,left:box.left,height:box.height,selected:root.querySelector('[aria-selected="true"]')?.id,path:location.pathname,panels});
    }requestAnimationFrame(sample)
   };requestAnimationFrame(sample)
  });
  await page.goto(base+'/courses?language=ru');await page.locator('[data-page-wipe][data-motion-ready="true"]').waitFor({state:'attached'});await page.waitForTimeout(100);
  if(width===390){const cdp=await context.newCDPSession(page);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4})}
  for(let i=0;i<24;i++){
   const mini=i%2===0;
   await page.locator(mini?'#catalog-tab-mini-courses':'#catalog-tab-courses').click();
   await page.waitForTimeout([45,85,390,120,410,60][i%6]);
  }
  await page.waitForURL('**/courses?language=ru');await page.waitForTimeout(600);
  assert.equal(await page.locator('#catalog-panel-courses').getAttribute('aria-hidden'),'false');
  assert.equal(await page.locator('[data-catalog-experience] [data-animating]').count(),0);
  const frames=await page.evaluate(()=>window.switchFrames);
  await writeFile(`${out}/frames-${width}.json`,JSON.stringify(frames));
  const moving=frames.filter(f=>f.animating);
  assert.ok(moving.length>20,'sample actual in-between frames');
  for(const f of moving){
   assert.ok(f.panels.every(p=>p.opacity===1&&p.visibility==='visible'),'both surfaces remain opaque, no crossfade');
   assert.ok(Math.abs(f.panels[0].right-f.panels[1].left)<1,'panels share an edge without overlapping or a blank gap');
   assert.ok(f.height>100,'track retains its content height');
  }
  for(let i=1;i<frames.length;i++){
   const f=frames[i],last=frames[i-1];
   if(f.click!==last.click&&f.animating&&last.animating){
    const progress=(f.left-f.panels[0].left)/f.width,previous=(last.left-last.panels[0].left)/last.width;
    assert.ok(Math.abs(progress-previous)<((f.time-last.time)+17)*.009+.025,'rapid reversal preserves the current pose (allow one ticker frame)');
   }
   if(f.click!==last.click||!f.click)continue;
   assert.equal(f.selected,last.selected,'route commits must not flash the tab back');
   if(f.animating&&last.animating){
    const progress=(f.left-f.panels[0].left)/f.width,previous=(last.left-last.panels[0].left)/last.width;
    const forward=f.selected==='catalog-tab-mini-courses';
    assert.ok(forward?progress>=previous-.001:progress<=previous+.001,'no timeline restart or stale transform after routing');
   }
  }
  await page.locator('#catalog-tab-mini-courses').click();await page.waitForURL('**/mini-courses?language=ru');await page.waitForTimeout(450);
  await page.screenshot({path:`${out}/mini-${width}.png`});
  await page.goBack();await page.waitForURL('**/courses?language=ru');await page.waitForTimeout(500);
  await page.goForward();await page.waitForURL('**/mini-courses?language=ru');await page.waitForTimeout(500);
  await page.reload();await page.waitForTimeout(500);assert.equal(await page.locator('#catalog-tab-mini-courses').getAttribute('aria-selected'),'true');
  await page.locator('#catalog-tab-courses').focus();await page.keyboard.press('Enter');await page.waitForTimeout(70);await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);
  assert.equal(await page.locator('[data-catalog-experience] [data-animating]').count(),0);
  assert.equal(await page.locator('#catalog-panel-courses').getAttribute('inert'),null);
  await page.setViewportSize({width:width===1440?768:1440,height:900});await page.waitForTimeout(100);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  results.push({width,clicks:24,frames:frames.length,movingFrames:moving.length});
  await writeFile(`${out}/frames-${width}.json`,JSON.stringify(frames));await context.close();
 }
 assert.deepEqual(errors,[]);console.log('PASS switcher: 96 switches, opaque non-overlapping frames, continuous reversal, delayed navigation, CPU throttle, history, refresh, keyboard, resize and reduced motion.');
}finally{await writeFile(`${out}/results.json`,JSON.stringify({results,errors},null,2));await browser.close()}
