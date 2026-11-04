import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.FRONTEND_URL || 'http://localhost:3113';
const enabled = process.env.TEST_PREVIEW === 'true';
const origin = process.env.SITE_URL;
const evidence = process.env.FRONTEND_EVIDENCE || 'docs/qa/evidence/LAND03-04-2026-11-03';
await mkdir(evidence,{recursive:true});
const browser = await chromium.launch({headless:true,channel:'chrome'});
const context = await browser.newContext({reducedMotion:'reduce'});
const page = await context.newPage();
page.setDefaultTimeout(15000);
const errors=[]; const mutations=[]; const results=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('request',r=>{if(!['GET','HEAD'].includes(r.method())) mutations.push(r.url());});
async function goto(path) {await page.goto(base+path);await page.evaluate(()=>document.fonts.ready);}
async function menu() { const panel=page.locator('#catalog-preview-panel');if(!await panel.isVisible())await page.getByRole('button',{name:'Тестовое меню',exact:true}).click();return panel; }
async function action(name) {await (await menu()).getByRole('button',{name,exact:true}).click();}
async function close() {await page.keyboard.press('Escape');}
async function capture(name,width=1440) {await page.screenshot({path:`${evidence}/${enabled?'preview':'real'}-${name}-${width}.png`,fullPage:true});}
try {
 for (const width of [1440,390,360,768]) {
  await page.setViewportSize({width,height:width<500?844:900});
  await goto('/courses');
  assert.equal(await page.locator('[data-preview-control]').count(), enabled?1:0);
  if(enabled) {
   await page.locator('#catalog-panel-courses article').first().waitFor();
   await action('Сбросить все демо-данные');
   assert.equal(await page.locator('#catalog-panel-courses article').count(),4);
   await page.locator('#catalog-preview-panel').evaluate(e=>e.scrollTop=0); await capture('panel',width); await close();
   await action('Добавить демо-курс'); await close();
   assert.equal(await page.locator('#catalog-panel-courses article').count(),5);
   await action('Очистить каталог'); await close();
   await page.getByRole('heading',{name:'Курсы готовятся к публикации',exact:true}).waitFor();
   await capture('empty',width);
   await page.getByRole('tab',{name:'Мини-курсы',exact:true}).click();
   await page.getByRole('heading',{name:'Мини-курсы готовятся к публикации',exact:true}).waitFor();
   await capture('mini-empty',width);
   await action('Сбросить каталог'); await close();
  } else {
   await page.getByRole('heading',{name:'Каталог временно недоступен',exact:true}).waitFor();
   assert.equal(await page.locator('main article').count(),0);
   await capture('unavailable',width);
   await page.getByRole('button',{name:'Попробовать снова',exact:true}).click();
   await page.getByRole('heading',{name:'Каталог временно недоступен',exact:true}).waitFor();
  }
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`document overflow ${width}`);
  const clipped = await page.locator('main h1,main h2,main h3,#catalog-preview-panel button').evaluateAll(elements=>elements.filter(e=>e.getClientRects().length && e.closest('[inert]')===null && e.scrollWidth>e.clientWidth+2).map(e=>e.textContent));
  assert.deepEqual(clipped,[],`clipped text ${width}`);
  results.push({width,mode:enabled?'preview':'real',responsive:true});
 }
 await page.setViewportSize({width:1440,height:900});
 if(enabled) {
  await goto('/courses?language=en');
  await page.locator('#catalog-panel-courses article').first().waitFor();
  assert.equal(await page.locator('#catalog-panel-courses article').count(),2);
  await goto('/courses?direction=cosmetology');
  await page.getByRole('heading',{name:'По этим фильтрам ничего не найдено',exact:true}).waitFor();
  await page.getByRole('button',{name:'Сбросить фильтры',exact:true}).last().click();
  await page.locator('#catalog-panel-courses article').first().waitFor();
  await action('Показать ошибку каталога');await close();
  await page.getByRole('heading',{name:'Каталог временно недоступен',exact:true}).waitFor();await capture('simulated-error');
  await action('Показать загрузку');await close();
  await page.getByRole('heading',{name:'Загружаем каталог…',exact:true}).waitFor();
  await action('Вернуть каталог');await close();
  await action('Курс в корзину');await action('Мини-курс в корзину');await close();
  await goto('/cart');
  await page.locator('main [aria-label="Выбранные продукты"] li').first().waitFor();
  assert.equal(await page.locator('main [aria-label="Выбранные продукты"] li').count(),2);
  assert.match(await page.locator('main').innerText(),/155,00\s*\$/);
  await capture('cart');
  await page.locator('main button[aria-label^="Удалить:"]').first().click();
  assert.equal(await page.locator('main [aria-label="Выбранные продукты"] li').count(),1);
  await action('Несколько товаров в корзину');await close();
  assert.equal(await page.locator('main [aria-label="Выбранные продукты"] li').count(),11); // Eight products + three package demos.
  await goto('/checkout');assert.ok(await page.getByRole('button',{name:'Оплата недоступна'}).isDisabled());
  await action('Очистить корзину / пустое состояние');await close();
  await goto('/cart');await page.getByRole('heading',{name:'Пока здесь пусто'}).waitFor();await capture('cart-empty');
  await goto('/courses/demo-course-0');
  await page.getByRole('heading',{level:1,name:/Демо:/}).waitFor();
  await page.getByRole('button',{name:'В демо-корзину',exact:false}).first().click();
  await page.getByRole('button',{name:'В демо-корзине',exact:true}).first().waitFor();
  for(const width of [1440,390]) {await page.setViewportSize({width,height:width===390?844:900});await capture('detail',width);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
  await action('Добавить 3 курса');await close();
  await goto('/courses/demo-course-4');assert.ok(await page.getByRole('button',{name:'В корзину',exact:false}).first().isDisabled());
  await goto('/courses/demo-course-5');await page.getByRole('heading',{level:1,name:'Страница курса не найдена'}).waitFor();
  await goto('/mini-courses/demo-mini-0');await page.getByRole('heading',{level:1,name:/Демо:/}).waitFor();
  await page.reload();await page.getByRole('heading',{level:1,name:/Демо:/}).waitFor();
  await goto('/courses');await action('Сбросить все демо-данные');await close();
  await page.getByRole('button',{name:'Тестовое меню',exact:true}).focus();await page.keyboard.press('Enter');
  await page.locator('#catalog-preview-title').waitFor();await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('aria-label')),'Тестовое меню');
 } else {
  await page.evaluate(()=>localStorage.setItem('lms.catalog.preview.v1','["demo-course-0"]'));
  await goto('/cart');await page.getByRole('heading',{name:'Пока здесь пусто'}).waitFor();
  assert.equal(await page.locator('[data-preview-control]').count(),0);
  await goto('/courses/demo-course-0');await page.getByRole('heading',{level:1,name:'Страница курса не найдена'}).waitFor();
  await goto('/courses/unavailable-course');await page.getByRole('heading',{level:1,name:'Программа временно недоступна'}).waitFor();
 }
 for (const path of ['/','/courses','/courses?language=en','/mini-courses','/cart','/checkout','/preview/components','/courses/demo-course-0','/mini-courses/demo-mini-0','/admin','/account','/trainer','/login']) {
  await goto(path);
  const title=await page.title();assert.ok(title.length>5);
  const robots=await page.locator('meta[name="robots"]').first().getAttribute('content');
  const publicPage=['/','/courses','/courses?language=en','/mini-courses'].includes(path);
  assert.equal(robots.includes('noindex'), enabled || !origin || !publicPage,`${path} ${robots}`);
  const canonical=await page.locator('link[rel="canonical"]').count() ? await page.locator('link[rel="canonical"]').getAttribute('href') : null;
  if(!enabled && origin && publicPage)assert.equal(new URL(canonical).href, new URL(origin+(path.split('?')[0])).href);
  else assert.equal(canonical,null);
  const schema=await page.locator('script[type="application/ld+json"]').allTextContents();
  for(const value of schema) {const data=JSON.parse(value);assert.equal(data['@context'],'https://schema.org');assert.doesNotMatch(value,/demo-|aggregateRating|offers/);}
  if(enabled)assert.equal(schema.length,0);
  const response=await context.request.get(base+path,{headers:{'User-Agent':'Twitterbot'}});
  const html=await response.text();
  if(publicPage) {assert.match(html,/<meta name="description"/);assert.match(html,/<meta property="og:title"/);assert.match(html,/<meta name="twitter:card"/);}
  if(path.startsWith('/courses/demo-'))assert.doesNotMatch(html,/<script type="application\/ld\+json"/);
  results.push({path,status:response.status(),title,robots,canonical,jsonLd: schema.length});
 }
 const sitemap=await (await context.request.get(base+'/sitemap.xml')).text();
 assert.doesNotMatch(sitemap,/demo-|course-lashes|cart|checkout|preview|admin|account|trainer/);
 if(!enabled && origin) {for(const path of ['/','/courses','/mini-courses'])assert.ok(sitemap.includes(`<loc>${origin}${path}</loc>`));}
 else assert.doesNotMatch(sitemap,/<loc>/);
 const robots=await (await context.request.get(base+'/robots.txt')).text();
 if(enabled || !origin) assert.match(robots,/Disallow: \/\s*$/);
 for(const asset of ['/favicon.ico','/icon.svg','/apple-icon.png','/brand/logo.svg','/brand/logo-dark.svg','/brand/social.png'])assert.equal((await context.request.get(base+asset)).status(),200,asset);
 assert.deepEqual(errors,[]);assert.deepEqual(mutations,[]);
 await writeFile(`${evidence}/${enabled?'preview':'real'}-results.json`,JSON.stringify({results,errors,mutations,sitemap,robots},null,2));
 console.log(`PASS ${enabled?'preview':'real'}: responsive controls/states, cart, detail, HTML metadata, sitemap, robots, assets; ${results.length} checks`);
} finally {await browser.close();}
