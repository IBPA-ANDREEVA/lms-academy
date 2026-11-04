import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.FRONTEND_URL || 'http://localhost:3123';
const evidence = process.env.FRONTEND_EVIDENCE || '.landing-evidence/motion-lifecycle';
await mkdir(evidence, {recursive:true});
const browser = await chromium.launch({headless:true,channel:'chrome'});
const results = [], errors = [];
async function instrument(page) {
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if(message.type()==='error' && /hydrat|match|server rendered/i.test(message.text())) errors.push(message.text()); });
  await page.addInitScript(() => {
    window.motionFrames=[]; window.motionDrops=[]; window.motionShifts=[];
    const seen = new WeakMap();
    new PerformanceObserver(list => { for(const entry of list.getEntries()) if(!entry.hadRecentInput) window.motionShifts.push(entry.value); }).observe({type:'layout-shift',buffered:true});
    const sample=()=>{
      const splash=document.querySelector('[data-splash-loader]'), wipe=document.querySelector('[data-page-wipe]');
      const blocking=[splash,wipe].some(el=>el&&!el.hidden&&el.dataset.motionPhase!=='revealing'&&getComputedStyle(el).visibility!=='hidden'&&getComputedStyle(el).display!=='none');
      const main=document.querySelector('[data-home-entrances]');
      const hero=document.querySelector('#hero-title > span');
      if(hero && window.motionFrames.length<2000) window.motionFrames.push({time:performance.now(),phase:splash?.dataset.motionPhase,hidden:splash?.hidden,ready:main?.dataset.homeMotionReady,hero:document.querySelector('[data-home-scene="hero"]')?.dataset.homeSceneState,opacity:Number(getComputedStyle(hero).opacity),clip:hero.style.clipPath});
      if(main&&!blocking&&!main.closest('[data-route-motion]')) for(const el of main.querySelectorAll('h1 > span,h2 > span,h2:not(:has(>span)),article')) {
        const box=el.getBoundingClientRect();
        if(box.height===0 || box.bottom<0 || box.top>innerHeight || el.closest('[hidden],[inert],[aria-hidden="true"]')) continue;
        let opacity=1;
        for(let ancestor=el;ancestor&&ancestor!==main;ancestor=ancestor.parentElement) opacity*=Number(getComputedStyle(ancestor).opacity);
        const previous=seen.get(el);
        if(previous!==undefined&&opacity<previous-.035) window.motionDrops.push({text:el.textContent.slice(0,55),previous,opacity,time:performance.now()});
        seen.set(el,opacity);
      }
      requestAnimationFrame(sample);
    };requestAnimationFrame(sample);
  });
}
async function ready(page) { await page.waitForFunction(()=>document.querySelector('[data-home-scene="hero"]')?.dataset.homeSceneState==='complete'); }
async function report(page,label) {
  const data=await page.evaluate(()=>({frames:window.motionFrames,drops:window.motionDrops,shifts:window.motionShifts}));
  assert.deepEqual(data.drops,[],`${label}: no visible to hidden frame regression`);
  const reveal=data.frames.find(f=>f.phase==='revealing');
  assert.ok(reveal && reveal.ready==='true' && reveal.hero==='playing',`${label}: entrance starts on first curtain-reveal frame`);
  assert.ok(data.frames.some(f=>f.phase==='revealing'&&!f.hidden&&f.opacity>0&&f.opacity<1),`${label}: entrance overlaps existing curtain`);
  results.push({label,firstReveal:reveal,drops:data.drops,layoutShift:data.shifts.reduce((a,b)=>a+b,0),frames:data.frames.length});
}
try {
  for(const width of [1440,390,360,768]) {
    const context=await browser.newContext({viewport:{width,height:width<500?844:900},reducedMotion:'no-preference'});
    const page=await context.newPage();await instrument(page);
    await page.goto(base);await ready(page);
    const prepared=await page.locator('#about h2 > span').evaluateAll(els=>els.map(el=>({opacity:getComputedStyle(el).opacity,clip:el.style.clipPath})));
    assert.ok(prepared.every(el=>el.opacity==='0'&&el.clip.includes('100%')),'offscreen heading initialized before scrolling');
    // A reveal must not finish below the screen or snap through its visible travel.
    await page.locator('#about h2').evaluate(el=>scrollTo({top:scrollY+el.getBoundingClientRect().top-innerHeight*.98,behavior:'instant'}));
    await page.waitForTimeout(650);
    assert.equal(await page.locator('#about h2').getAttribute('data-home-scene-state'),'prepared','wait for the authored in-viewport entry line');
    await page.locator('#about h2').evaluate((el,ratio)=>scrollTo({top:scrollY+el.getBoundingClientRect().top-innerHeight*ratio,behavior:'instant'}),width<=760?.88:.83);
    await page.waitForFunction(()=>document.querySelector('#about h2')?.dataset.homeSceneState==='playing');
    await page.waitForTimeout(300);
    const visibleBeat=await page.locator('#about h2 > span').first().evaluate(el=>({opacity:Number(getComputedStyle(el).opacity),transform:el.style.transform}));
    assert.ok(visibleBeat.opacity>.2&&visibleBeat.opacity<.9&&visibleBeat.transform,'meaningful movement remains 300ms after entry');
    await page.screenshot({path:`${evidence}/visible-entry-${width}.png`});
    results.push({label:`visible-entry-${width}`,visibleBeat});
    await page.waitForFunction(()=>document.querySelector('#about h2')?.dataset.homeSceneState==='complete');
    await page.evaluate(async()=>{
      for(let y=0;y<document.documentElement.scrollHeight-innerHeight;y+=240){scrollTo({top:y,behavior:'instant'});await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);}
      scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'});
    });
    await page.waitForFunction(()=>!document.querySelector('[data-home-scene-state="playing"]'));
    assert.equal(await page.locator('[data-home-scene-state="playing"]').count(),0);
    await page.screenshot({path:`${evidence}/contact-${width}.png`});
    await report(page,`scroll-${width}`);
    await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
    await page.reload();await ready(page);await report(page,`hard-refresh-${width}`);
    // A single very large jump must not strand skipped headings or replay them.
    await page.locator('#contact').evaluate(el=>el.scrollIntoView({behavior:'instant'}));await page.waitForTimeout(1500);
    await page.locator('#about').evaluate(el=>el.scrollIntoView({behavior:'instant'}));await page.waitForTimeout(100);
    assert.equal(await page.locator('#about h2').getAttribute('data-home-scene-state'),'complete');
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.waitForFunction(()=>!document.querySelector('main [style*="opacity: 0"]'));
    assert.equal(await page.locator('main [style*="opacity: 0"]').count(),0);
    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.evaluate(()=>new Promise(requestAnimationFrame));
    assert.equal(await page.locator('main [style*="opacity: 0"]').count(),0,'preference restoration must not re-hide already readable content');
    await context.close();
  }
  const context=await browser.newContext({viewport:{width:1440,height:900}}), page=await context.newPage(); await instrument(page);
  const cdp=await context.newCDPSession(page);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
  await page.goto(base);await ready(page);await report(page,'cpu-4x');await cdp.send('Emulation.setCPUThrottlingRate',{rate:1});
  // Existing route curtain, native history, return, hash, and rapid offer switching.
  await page.locator('#catalog-status a').filter({hasText:'Все курсы'}).click();await page.waitForURL('**/courses');
  await page.waitForFunction(()=>document.querySelector('[data-page-wipe]')?.hidden);
  await page.locator('header').getByRole('link',{name:'Beauty Business Academy',exact:true}).click();await page.waitForURL(base+'/');await ready(page);
  await page.waitForFunction(()=>document.querySelector('[data-page-wipe]')?.hidden);
  await page.goBack();await page.waitForURL('**/courses');await page.waitForFunction(()=>document.querySelector('[data-page-wipe]')?.hidden);
  await page.goForward();await page.waitForURL(base+'/');await ready(page);
  await page.getByRole('tab',{name:'Пакеты',exact:true}).click();await page.waitForTimeout(80);
  await page.getByRole('tab',{name:'Мини-курсы',exact:true}).click();await page.waitForTimeout(80);
  await page.getByRole('tab',{name:'Основные курсы',exact:true}).click();
  await page.waitForFunction(()=>!document.querySelector('[data-offers-track][data-transitioning]'));
  await page.waitForFunction(()=>!document.querySelector('[data-home-scene-state="playing"]'));
  assert.equal(await page.locator('[data-home-scene-state="playing"]').count(),0);
  await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>!document.querySelector('main [style*="opacity: 0"]'));
  assert.equal(await page.locator('main [style*="opacity: 0"]').count(),0);
  await context.close();
  // No-JS and failed client-chunk hydration keep server content readable.
  for(const mode of ['no-js','blocked-js','late-js']) {
    const ctx=await browser.newContext({javaScriptEnabled:mode!=='no-js',viewport:{width:390,height:844}}), p=await ctx.newPage();
    if(mode==='blocked-js') await p.route('**/_next/**/*.js',route=>route.abort());
    if(mode==='late-js') {
      await instrument(p);
      const release=new Promise(resolve=>setTimeout(resolve,5500));
      await p.route('**/_next/**/*.js',async route=>{await release;await route.continue();});
    }
    await p.goto(base);if(mode==='blocked-js') await p.waitForTimeout(5200);
    if(mode==='late-js') {await ready(p);assert.deepEqual(await p.evaluate(()=>window.motionDrops),[],'late hydration must not re-hide exposed SSR');}
    const readable=await p.evaluate(()=>{const h=document.querySelector('#hero-title'),s=document.querySelector('[data-splash-loader]');return getComputedStyle(h).opacity==='1'&&(!s||s.hidden||getComputedStyle(s).display==='none'||getComputedStyle(s).visibility==='hidden')});
    assert.ok(readable,`${mode}: readable SSR and existing splash fail-open`);results.push({label:mode,readable});await ctx.close();
  }
  assert.deepEqual(errors,[]);console.log('Motion lifecycle passed: four widths, frame-by-frame monotonic reveals, synchronized splash, refresh, fast scroll, CPU throttle, navigation/history, preferences, no-JS and failed hydration.');
} finally {await writeFile(`${evidence}/results.json`,JSON.stringify({results,errors},null,2));await browser.close();}
