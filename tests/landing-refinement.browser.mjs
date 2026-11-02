import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser=await chromium.launch({headless:true,channel:'chrome'});
const base=process.env.FRONTEND_URL || 'http://localhost:3000';
const evidence=process.env.FRONTEND_EVIDENCE || '.landing-evidence';
await mkdir(evidence,{recursive:true});
const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
try {
 for(const width of [1440,768,390,360]) {
  await page.setViewportSize({width,height:width<500?844:900});await page.goto(base);await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(650);
  assert.match(await page.locator('h1').innerText(),/ОБУЧЕНИЕ\.[\s\S]*ПРАКТИКА\.[\s\S]*КАРЬЕРА В БЬЮТИ\./);
  assert.equal(await page.locator('#about li').count(),6);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:`${evidence}/home-${width}.png`,fullPage:true});
  for(const id of ['about','founder','learning-preview','learning-offers','reviews']) {
   await page.locator('#'+id).scrollIntoViewIfNeeded();await page.waitForTimeout(600);
   if(width===1440||width===390) await page.screenshot({path:`${evidence}/${id}-${width}.png`});
  }
  await page.getByRole('tab',{name:'Сдать домашнее задание'}).click();
  assert.equal(await page.getByRole('img',{name:'Место для демонстрационного видеоурока'}).count(),0);
  await page.locator('#learning-comment').fill('Проверка сохранения работы');
  await page.getByRole('button',{name:'К ОБРАТНОЙ СВЯЗИ'}).click();
  await page.getByRole('button',{name:'ДОРАБОТАТЬ ЗАДАНИЕ'}).click();
  assert.equal(await page.locator('#learning-comment').inputValue(),'Проверка сохранения работы');
  await page.getByRole('tab',{name:/Смотреть урок/}).click();
  assert.equal(await page.getByRole('img',{name:'Место для демонстрационного видеоурока'}).count(),1);
  const card=page.locator('#catalog-status article').first();await card.click({position:{x:20,y:20}});await page.waitForURL('**/courses/course-nails');
  await page.goto(base);await page.getByRole('tab',{name:'Мини-курсы',exact:true}).click();
  await page.locator('#mini-courses article').first().click({position:{x:20,y:20}});await page.waitForURL('**/mini-courses/mini-lashes');
 }
 await page.setViewportSize({width:1440,height:900});await page.goto(base);
 const reviews=page.locator('#reviews [aria-label="Отзывы и рекомендации: прокрутка по горизонтали"]');
 await reviews.scrollIntoViewIfNeeded();const box=await reviews.boundingBox();
 await page.mouse.move(box.x+box.width-70,box.y+100);await page.mouse.down();await page.mouse.move(box.x+60,box.y+100,{steps:12});await page.mouse.up();
 await page.waitForTimeout(400);assert.ok(await reviews.evaluate(el=>el.scrollLeft>50));
 await reviews.evaluate(el=>el.scrollTo(0,0));await page.waitForTimeout(400);
 await page.mouse.move(box.x+100,box.y+100);await page.mouse.wheel(500,0);await page.waitForTimeout(400);assert.ok(await reviews.evaluate(el=>el.scrollLeft>50));
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.getByRole('tab',{name:'Ответ куратора'}).click();
 assert.equal(await page.locator('#learning-panel-feedback').evaluate(el=>getComputedStyle(el).opacity),'1');
 assert.deepEqual(errors,[]);
 console.log('Passed: copy, six benefits, responsive layout, learning flow/state, full-card navigation, review drag/wheel, reduced motion.');
} finally {await browser.close();}
