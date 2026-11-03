import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.FRONTEND_URL || 'http://localhost:3117';
const evidence = process.env.FRONTEND_EVIDENCE || 'docs/qa/evidence/premium-motion-2026-11-02';
await mkdir(evidence, {recursive:true});
const browser = await chromium.launch({channel:'chrome',headless:true});
const results = [], errors = [];
const check = (name) => { results.push(name); console.log(`PASS ${name}`); };
const monitor = page => page.on('pageerror', error => errors.push(error.message));
async function settled(page) { await page.waitForFunction(()=>!document.querySelector('[data-offers-track]')?.hasAttribute('data-transitioning')); }
async function noCover(page) { await page.waitForFunction(()=>!document.querySelector('[data-page-wipe]:not([hidden]),[data-splash-loader]:not([hidden])')); }
async function scrollToElement(page, selector, offset=0) { await page.locator(selector).evaluate((el,offset)=>scrollTo(0,el.getBoundingClientRect().top+scrollY-offset),offset); await page.waitForTimeout(120); }
try {
  for (const width of [1440,768,390,360]) {
    const context = await browser.newContext({viewport:{width,height:width<500?844:900}});
    const page = await context.newPage(); monitor(page);
    await page.addInitScript(()=>{
      window.__directions=[];
      new MutationObserver(records=>{for(const record of records){const direction=record.target.getAttribute('data-direction');if(direction)window.__directions.push(direction);}})
        .observe(document,{subtree:true,attributes:true,attributeFilter:['data-direction']});
    });
    await page.goto(base); await page.evaluate(()=>document.fonts.ready);
    await page.waitForSelector('[data-learning-offers][data-enhanced="true"]');
    assert.equal(await page.locator('[data-public-intro]').count(),0);
    await noCover(page);
    assert.equal(await page.locator('[data-featured-scroll]').count(),0);
    await page.screenshot({path:`${evidence}/home-${width}.png`});
    const fullHeight=await page.evaluate(()=>document.documentElement.scrollHeight);
    await scrollToElement(page,'#founder',500);
    const join=await page.evaluate(()=>{
      const about=document.querySelector('#about'),founder=document.querySelector('#founder');
      return {gap:founder.getBoundingClientRect().top-about.getBoundingClientRect().bottom,transform:getComputedStyle(about).transform};
    });
    assert.ok(Math.abs(join.gap)<1,'portrait surfaces share the same seam');
    assert.equal(join.transform,'none','geometry never floats through a surface transform');
    check(`${width}px: integrated portrait seam without pinning`);
    await scrollToElement(page,'[data-learning-offers]',60);
    for (const label of ['Мини-курсы','Пакеты','Старт в США','Основные курсы']) {
      const before=await page.evaluate(()=>scrollY);
      await page.getByRole('tab',{name:label,exact:true}).click(); await settled(page);
      assert.ok(Math.abs(await page.evaluate(()=>scrollY)-before)<3,`switching ${label} must not move scroll at ${width}`);
      assert.equal(await page.locator('[id^="offer-panel-"]:not([inert])').count(),1);
      const gap=await page.locator('[data-offers-track]').evaluate(el=>Math.abs(el.getBoundingClientRect().height-el.querySelector('[aria-hidden="false"]').getBoundingClientRect().height));
      assert.ok(gap<2,'natural active height');
      if(label==='Мини-курсы') {
        const defects=await page.locator('#mini-courses article').evaluateAll(cards=>cards.flatMap(card=>{
          const [media,content]=card.children, image=media.getBoundingClientRect(), box=content.getBoundingClientRect();
          const issues=[];
          if(image.bottom>box.top+1)issues.push('stacked mini image overlaps text');
          for(const target of content.querySelectorAll('h3,p')) {
            const walker=document.createTreeWalker(target,NodeFilter.SHOW_TEXT);
            while(walker.nextNode()) {
              const range=document.createRange();range.selectNodeContents(walker.currentNode);
              for(const rect of range.getClientRects())if(rect.left<box.left-1||rect.right>box.right+1||rect.bottom>box.bottom+1)issues.push('text escapes content');
            }
          }
          return issues;
        }));
        assert.deepEqual(defects,[],`mini-course image/text geometry at ${width}`);
      }
    }
    await page.getByRole('tab',{name:'Пакеты',exact:true}).click();
    await page.getByRole('tab',{name:'Мини-курсы',exact:true}).click();
    await page.getByRole('tab',{name:'Основные курсы',exact:true}).click(); await settled(page);
    assert.equal(await page.locator('[id^="offer-panel-"][style*="transform"]').count(),0);
    await page.getByRole('tab',{name:'Основные курсы',exact:true}).focus();
    await page.keyboard.press('End'); await settled(page);
    assert.equal(await page.getByRole('tab',{name:'Старт в США',exact:true}).getAttribute('aria-selected'),'true');
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.getByRole('tab',{name:'Основные курсы',exact:true}).click(); await settled(page);
    assert.equal(await page.locator('[data-sticky-story],[data-featured-scroll]').count(),0);
    assert.ok(Math.abs(fullHeight-await page.evaluate(()=>document.documentElement.scrollHeight))<=2,'group scroll entrance adds no document height');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'document overflow');
    await page.screenshot({path:`${evidence}/offers-${width}.png`});
    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.getByRole('contentinfo').getByRole('link',{name:'Основные курсы',exact:true}).click();
    await page.waitForURL('**/courses'); await noCover(page);
    assert.equal(await page.locator('main:visible').evaluate(el=>el===document.activeElement||el.contains(document.activeElement)),true,`destination focus: ${await page.evaluate(()=>({active:document.activeElement?.outerHTML.slice(0,350),wipe:document.querySelector('[data-page-wipe]')?.outerHTML})).then(JSON.stringify)}`);
    assert.equal(await page.locator('[data-sticky-story],[data-featured-scroll],.pin-spacer').count(),0);
    await page.screenshot({path:`${evidence}/catalog-${width}.png`});
    await page.locator('main a[href="/courses/course-lashes"]').first().click();
    await page.waitForURL('**/courses/course-lashes'); await noCover(page);
    await page.screenshot({path:`${evidence}/detail-${width}.png`});
    await page.evaluate(()=>window.__directions=[]);
    await page.goBack(); await page.waitForURL('**/courses'); await noCover(page);
    await page.goForward(); await page.waitForURL('**/courses/course-lashes'); await noCover(page);
    const directions=await page.evaluate(()=>window.__directions);
    assert.ok(directions.includes('back')&&directions.includes('forward'),'history mirrors the wipe direction');
    await page.locator('footer').getByRole('link',{name:'Основатель',exact:true}).click();
    await page.waitForURL('**/#founder'); await noCover(page);
    assert.ok(await page.locator('#founder').evaluate(el=>{const y=el.getBoundingClientRect().top;return y>=60&&y<=120;}),'cached route hash is positioned below header');
    await page.locator('footer').getByRole('link',{name:'Пакеты',exact:true}).click(); await noCover(page);
    assert.equal(await page.locator('[data-learning-offers]').getAttribute('data-active-offer'),'packages');
    const faq=page.locator('#faq details').nth(1);
    await faq.locator('summary').click();
    await page.waitForFunction(()=>!document.querySelectorAll('#faq details')[1].style.height);
    assert.equal(await faq.evaluate(el=>getComputedStyle(el).borderRadius),'0px','FAQ shape reaches its expanded endpoint');
    check(`${width}px: hash routing, inactive offer deep link and FAQ shape`);
    await page.goto(base+'/checkout'); assert.equal(await page.locator('[data-page-wipe]:not([hidden])').count(),0);
    await page.goto(base+'/preview/components');
    const preview=page.locator('#motion'); await preview.scrollIntoViewIfNeeded();
    await preview.getByRole('button',{name:'Показать ожидание'}).click();
    await preview.locator('[data-splash-loader]:not([hidden])').waitFor();
    await page.screenshot({path:`${evidence}/splash-${width}.png`});
    await preview.getByRole('button',{name:'Завершить ожидание'}).click();
    await noCover(page);
    await page.emulateMedia({reducedMotion:'reduce'});
    await preview.getByRole('button',{name:'Показать ожидание'}).click();
    await page.waitForTimeout(250); assert.equal(await page.locator('[data-splash-loader]:not([hidden])').count(),0);
    await preview.getByRole('button',{name:'Завершить ожидание'}).click();
    check(`${width}px: rapid/keyboard switching, stable scroll/height, reduced motion, routes/history/focus, splash preview`);
    await context.close();
  }
  // Delay real RSC requests, preserving the production route data and response.
  for (const mode of ['slow','interrupt','reduce','resize','error']) {
    const context=await browser.newContext({viewport:{width:1440,height:900}});
    const page=await context.newPage(); monitor(page);
    await context.addInitScript(()=>{
      window.__motionEvents=[];
      new MutationObserver(()=>{
        const wipe=document.querySelector('[data-page-wipe]');
        const splash=document.querySelector('[data-splash-loader]:not([hidden])');
        if(wipe&&!wipe.hidden)window.__motionEvents.push({wipe:true,splash:!!splash,direction:wipe.dataset.direction});
      }).observe(document,{subtree:true,attributes:true,attributeFilter:['hidden','data-direction']});
    });
    await context.route('**/courses/course-lashes?*',async route=>{
      await new Promise(resolve=>setTimeout(resolve,1600));
      if(mode==='error')await route.abort(); else await route.continue();
    });
    await page.goto(base+'/courses');
    await page.locator('main a[href="/courses/course-lashes"]').first().click();
    await page.locator('[data-page-wipe]:not([hidden])').waitFor();
    await page.waitForTimeout(380);
    const startedEvents=await page.evaluate(()=>window.__motionEvents);
    if(mode==='interrupt')await page.getByRole('link',{name:'Beauty Business Academy',exact:true}).first().click();
    if(mode==='reduce')await page.emulateMedia({reducedMotion:'reduce'});
    if(mode==='resize')await page.setViewportSize({width:390,height:844});
    await noCover(page);
    if(mode==='interrupt')await page.waitForURL(base+'/');
    else await page.waitForURL('**/courses/course-lashes');
    // Next may recover an aborted RSC fetch through a full document navigation.
    const events=[...startedEvents,...await page.evaluate(()=>window.__motionEvents)];
    assert.ok(events.length>0); assert.ok(events.every(e=>!e.splash),'Wipe and Splash never compete');
    assert.ok(await page.locator('main:visible').count()>0);
    check(`navigation ${mode}: latest intent, bounded cleanup, one overlay`);
    await context.close();
  }
  // No script-driven visibility dependencies in server HTML.
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage();
  await page.goto(base); assert.ok(await page.getByRole('heading',{level:1}).isVisible());
  assert.equal(await page.locator('[data-page-wipe]:not([hidden]),[data-splash-loader]:not([hidden])').count(),0);
  assert.equal(await page.locator('[id^="offer-panel-"]:visible').count(),4);
  check('no-JS homepage, all offer panels and unanimated server content'); await context.close();
  assert.deepEqual(errors,[]);
} finally { await writeFile(`${evidence}/results.json`,JSON.stringify({results,errors},null,2)); await browser.close(); }
