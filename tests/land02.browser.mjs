import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.FRONTEND_URL || 'http://localhost:3112';
const evidence = process.env.FRONTEND_EVIDENCE || 'docs/qa/evidence/LAND02-public-site-2026-11-02';
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const errors = [], matrix = [], states = [];
const widths = [1920, 1440, 1280, 1024, 768, 430, 390, 360, 320];
const routes = [['home','/'],['courses','/courses'],['minis','/mini-courses'],['course-detail','/courses/course-lashes'],['mini-detail','/mini-courses/mini-lashes'],['components','/preview/components']];
const shot = (page, name, fullPage = false) => page.screenshot({ path: `${evidence}/${name}.png`, fullPage });
async function ready(page) { await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(500); }
async function scrollTo(page, selector, offset=90) { await page.locator(selector).first().evaluate((el, gap) => window.scrollTo({ top: scrollY + el.getBoundingClientRect().top - gap, behavior: 'instant' }), offset); await page.waitForTimeout(550); }
async function settle(page) { await page.waitForFunction(() => { const t=document.querySelector('[data-offers-track]'); const p=t?.querySelector(':scope > [aria-hidden="false"]'); return t && p && !t.dataset.transitioning && Math.abs(t.offsetHeight-p.offsetHeight)<2; }); }
async function select(page,index) { await page.getByRole('tablist',{name:'Форматы обучения'}).getByRole('tab').nth(index).click(); await settle(page); }
async function auth(page,width) { if(width<=760) { await page.getByRole('button',{name:'Открыть меню'}).click(); await page.getByRole('button',{name:'Войти в кабинет'}).click(); } else await page.getByRole('button',{name:'Войти',exact:true}).first().click(); await page.getByRole('dialog',{name:'Войти в LMS Academy'}).waitFor(); await page.waitForTimeout(200); }
// Check text ranges against clipping ancestors; intentional scroll strips are checked separately.
async function bounds(page) { return page.evaluate(() => {
 const failures=[];
 const root=document.querySelector('main'); if(!root)return failures;
 for(const el of root.querySelectorAll('h1,h2,h3,p,summary,[data-home-hero] a')) {
  if(el.closest('[aria-hidden="true"],[inert],[hidden]') || !el.checkVisibility())continue;
  const box=el.getBoundingClientRect(); if(!box.width||!box.height)continue;
  let scrollStrip=false; for(let a=el.parentElement;a&&a!==root;a=a.parentElement) { const c=getComputedStyle(a); if(['auto','scroll'].includes(c.overflowX)&&a.scrollWidth>a.clientWidth+2)scrollStrip=true; }
  if(scrollStrip)continue;
  const range=document.createRange();range.selectNodeContents(el);
  const rects=[...range.getClientRects()];
  for(const b of rects) {
   if(!b.width||!b.height)continue;
   if(b.left < -1 || b.right > innerWidth+1) { failures.push({text:el.textContent.slice(0,60),reason:'viewport',left:b.left,right:b.right});break; }
   for(let a=el.parentElement;a&&a!==root;a=a.parentElement) { const c=getComputedStyle(a),r=a.getBoundingClientRect(); if(['hidden','clip'].includes(c.overflowX)&&(b.left<r.left-1||b.right>r.right+1)) { failures.push({text:el.textContent.slice(0,60),reason:'ancestor',left:b.left,right:b.right,frame:[r.left,r.right]});break; } }
  }
 }
 return failures;
 }); }
try {
 for(const width of widths) {
  const context=await browser.newContext({viewport:{width,height:width<500?844:900},reducedMotion:'reduce',hasTouch:true});
  const page=await context.newPage(); page.on('pageerror',e=>errors.push(e.message));
  for(const [name,route] of routes) {
   await page.goto(base+route); await ready(page);
   for(let y=0;y<await page.evaluate(()=>document.documentElement.scrollHeight);y+=700) await page.evaluate(y=>window.scrollTo(0,y),y);
   await page.evaluate(()=>scrollTo(0,0)); await ready(page);
   const clips=await bounds(page); const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   matrix.push({width,route,overflow,clips});
   assert.ok(overflow<=0,`${route}/${width}: document overflow ${overflow}`);
   assert.deepEqual(clips,[],`${route}/${width}: clipped text`);
   await shot(page,`${name}-${width}`,true);
   if(route==='/') {
    const header=await page.locator('header').first().boundingBox();
    if(width<=760) { assert.equal(header.height,68); assert.ok(await page.getByRole('button',{name:'Открыть меню'}).isVisible()); assert.equal(await page.getByRole('navigation',{name:'Основная навигация'}).isVisible(),false); }
    const cta=await page.locator('[data-home-hero] a').boundingBox();assert.ok(cta.x>=0&&cta.x+cta.width<=width,`hero CTA ${width}`);
    if(width<=430)assert.ok(cta.y+cta.height<=780,`hero CTA early ${width}`);
    for(const [id,label] of [['about','about'],['founder','founder'],['learning-preview','learning'],['faq','faq']]) { await scrollTo(page,'#'+id); await shot(page,`${label}-${width}`); }
    await page.locator('#founder summary').click();await shot(page,`founder-open-${width}`);assert.ok(await page.locator('#founder details[open]').count());await page.locator('#founder summary').click();
    await scrollTo(page,'[data-learning-offers]',68);
    const geometry=[];
    for(let i=0;i<4;i++) {
     await select(page,i);await scrollTo(page,'[data-learning-offers]',68);
     geometry.push(await page.locator('[data-offers-geometry="top"]').evaluate(el=>({top:el.offsetTop,height:el.offsetHeight,clip:getComputedStyle(el).clipPath})));
     await shot(page,`offer-${i}-${width}`);
     assert.deepEqual(await bounds(page),[],`offer ${i}/${width} bounds`);
    }
    assert.ok(geometry.every(g=>JSON.stringify(g)===JSON.stringify(geometry[0])),`geometry ${width}`);
    await select(page,0); await page.getByRole('navigation',{name:'Пример выбора направления'}).getByRole('button',{name:'Брови',exact:true}).click();
    assert.equal(await page.locator('#catalog-status article').count(),1);await page.getByRole('button',{name:'Следующая карточка',exact:true}).waitFor({state:'detached'});
    await page.getByRole('button',{name:'Все направления',exact:true}).click();
    await scrollTo(page,'[data-learning-offers]',68);await page.evaluate(()=>scrollBy(0,150));await page.waitForTimeout(100);
    const sticky=await page.evaluate(()=>({header:document.querySelector('header > div > div').getBoundingClientRect().bottom,nav:document.querySelector('[aria-label="Форматы обучения"]').getBoundingClientRect().top}));
    assert.ok(Math.abs(sticky.header-sticky.nav)<2,`sticky ${width}: ${JSON.stringify(sticky)}`);
    const y=await page.evaluate(()=>scrollY); await select(page,2);assert.ok(Math.abs(await page.evaluate(()=>scrollY)-y)<2,`panel switch scroll jump ${width}`);
    await page.getByRole('tab',{name:'Мини-курсы',exact:true}).focus();await page.keyboard.press('End');await settle(page);
    await page.evaluate(()=>scrollTo(0,240)); const before=await page.evaluate(()=>scrollY);await auth(page,width);
    assert.equal(await page.evaluate(()=>document.activeElement?.hasAttribute('data-auth-first')),true);
    const bodyTop=await page.evaluate(()=>document.body.style.top);await page.mouse.move(2,400);await page.mouse.wheel(0,600);await page.waitForTimeout(150);assert.equal(await page.evaluate(()=>document.body.style.top),bodyTop);
    await shot(page,`auth-${width}`); await page.keyboard.press('Escape');await page.waitForTimeout(150);assert.ok(Math.abs(await page.evaluate(()=>scrollY)-before)<2,`auth restore ${width}`);assert.equal(await page.evaluate(()=>document.body.style.position),'');
    if(width<=760) {
     await page.getByRole('button',{name:'Открыть меню'}).click();const dialog=page.getByRole('dialog',{name:'Меню сайта'});await dialog.waitFor();assert.ok(await dialog.getByRole('link',{name:'Основные курсы'}).isVisible());await shot(page,`menu-${width}`);
     for(let t=0;t<18;t++)await page.keyboard.press('Tab');assert.ok(await dialog.evaluate(el=>el.contains(document.activeElement)));
     await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});assert.ok(await page.getByRole('button',{name:'Открыть меню'}).evaluate(el=>el===document.activeElement));
     await page.getByRole('button',{name:'Открыть меню'}).click();await page.getByRole('dialog',{name:'Меню сайта'}).getByRole('link',{name:'Контакты'}).click();await page.waitForTimeout(150);assert.equal(await page.locator('dialog[open]').count(),0);
    }
    await scrollTo(page,'#faq');const item=page.locator('#faq details').nth(1);await item.locator('summary').focus();await page.keyboard.press('Enter');assert.equal(await item.getAttribute('open'),'');await page.keyboard.press('Space');assert.equal(await item.getAttribute('open'),null);
   }
   if(route==='/courses'||route==='/mini-courses') {
    await scrollTo(page,'#catalog-filters',68);const disclosure=page.locator('#catalog-filters details');if(!await disclosure.evaluate(el=>el.open))await disclosure.locator('summary').click();
    for(const label of ['Направление','Язык курса','Уровень']) {
     const trigger=page.getByRole('button',{name:new RegExp('^'+label)});await trigger.click();const popup=page.getByRole('listbox');await popup.waitFor();const b=await popup.boundingBox();assert.ok(b.x>=0&&b.x+b.width<=width,`popup ${label}/${width}`);await shot(page,`filter-${name}-${label==='Направление'?'direction':label==='Уровень'?'level':'language'}-${width}`);await page.keyboard.press('Escape');assert.equal(await page.getByRole('listbox').count(),0);assert.ok(await trigger.evaluate(el=>el===document.activeElement));
    }
    await page.getByRole('button',{name:/^Язык курса/}).click();await page.getByRole('option',{name:'Английский'}).click();await page.waitForURL('**?language=en');assert.equal(await page.locator('[role="tabpanel"]:not([aria-hidden="true"]) article').count(),0);await shot(page,`empty-${name}-${width}`);await page.locator('#catalog-filters').getByRole('button',{name:'Сбросить фильтры',exact:true}).click();await page.waitForURL(base+route);await page.goBack();await page.waitForURL('**?language=en');await page.goForward();await page.waitForURL(base+route);
   }
  }
  states.push({width,passed:true});await context.close();
 }
 // D-020: ready entry/reload, native mobile-menu navigation and no welcome timer. Dedicated async cases: premium-motion.browser.mjs.
 const motion=await browser.newContext({viewport:{width:390,height:844}});const p=await motion.newPage();p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base);await ready(p);assert.equal(await p.locator('[data-public-intro]').count(),0);await shot(p,'ready-entry');assert.equal(await p.evaluate(()=>sessionStorage.getItem('lms.public-intro.v1')),null);
 await p.reload();await ready(p);assert.equal(await p.locator('[data-public-intro]').count(),0);await p.getByRole('button',{name:'Открыть меню'}).click();await p.getByRole('dialog',{name:'Меню сайта'}).getByRole('link',{name:'Основные курсы'}).click();await p.waitForURL('**/courses');assert.equal(await p.locator('[data-public-intro]').count(),0);await motion.close();
 for(const entry of ['/courses','/mini-courses/mini-lashes','/cart','/checkout','/preview/components']) {
  const ctx=await browser.newContext();const p=await ctx.newPage();await p.goto(base+entry);await ready(p);assert.equal(await p.locator('[data-public-intro]').count(),0);await ctx.close();
 }
 const restricted=await browser.newContext();await restricted.addInitScript(()=>{Object.defineProperty(window,'sessionStorage',{get(){throw new Error('blocked')}})});const rp=await restricted.newPage();await rp.goto(base);await ready(rp);assert.equal(await rp.locator('[data-public-intro]').count(),0);await rp.emulateMedia({reducedMotion:'reduce'});await rp.waitForSelector('[data-public-intro]',{state:'detached'});await rp.emulateMedia({reducedMotion:'no-preference'});await rp.getByRole('contentinfo').first().getByRole('link',{name:'Основные курсы',exact:true}).click();await rp.waitForURL('**/courses');await ready(rp);assert.equal(await rp.locator('[data-public-intro]').count(),0);await restricted.close();
 const slow=await browser.newContext();await slow.route('**/*.js',async route=>{await new Promise(r=>setTimeout(r,2700));await route.continue();});const sp=await slow.newPage();await sp.goto(base);await ready(sp);assert.equal(await sp.locator('[data-public-intro]').count(),0);await slow.close();
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const np=await nojs.newPage();await np.goto(base);assert.equal(await np.locator('[data-public-intro]').count(),0);assert.equal(await np.locator('[data-offers-track] > [inert]').count(),0);for(const id of ['catalog-status','packages','mini-courses','start-usa'])assert.ok(await np.locator('#'+id).isVisible());await np.locator('details[class*="fallback"] > summary').click();assert.ok(await np.getByRole('navigation',{name:'Мобильная навигация'}).getByRole('link',{name:'Основные курсы'}).isVisible());await np.locator('details[class*="fallback"] > summary').click();await np.locator('#faq details').last().locator('summary').click();assert.ok(await np.locator('#faq details').last().locator('p').isVisible());await shot(np,'no-js-home',true);await nojs.close();
 assert.deepEqual(errors,[]);console.log('LAND02 matrix, bounds, menus, auth lock, filters, offers, FAQ, ready entry and no-JS passed.');
} finally { await writeFile(`${evidence}/results.json`,JSON.stringify({matrix,states,errors},null,2));await browser.close(); }
