import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
const require=createRequire(import.meta.url);
const { chromium }=require(process.env.PLAYWRIGHT_MODULE||"playwright");
const browser=await chromium.launch({headless:true,channel:"chrome"});
const page=await browser.newPage();
const evidence=".catalog-evidence";
await mkdir(evidence,{recursive:true});
const failures=[];page.on("pageerror",error=>failures.push(error.message));
try{
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:width<=390?844:900});
  await page.goto(`${process.env.FRONTEND_URL||"http://localhost:3000"}/courses`);
  await page.evaluate(()=>document.fonts.ready);
  await page.locator('#catalog-panel-courses article').first().waitFor({state:"visible"});
  assert.equal(await page.locator('[role="tabpanel"]:not([aria-hidden="true"])').count(),1);
  assert.equal(await page.locator('#catalog-panel-courses article').count(),4);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width}`);
  if(width===1440||width===390)await page.screenshot({path:`${evidence}/courses-${width}.png`,fullPage:true});
  if(width===1440||width===390){
   await page.locator('#catalog-panel-courses article').first().click({position:{x:20,y:20}});
   await page.waitForURL('**/courses/course-lashes');
   await page.locator('main[data-kind="course"]').getByText('ДЕМОНСТРАЦИЯ СТРАНИЦЫ · ПРОДУКТ НЕ ОПУБЛИКОВАН').waitFor();
   assert.ok(await page.locator('main[data-kind="course"]').getByText('ДЕМОНСТРАЦИЯ СТРАНИЦЫ · ПРОДУКТ НЕ ОПУБЛИКОВАН').isVisible());
   await page.goBack();await page.waitForURL('**/courses');
   await page.locator('#catalog-panel-courses article').first().waitFor({state:'visible'});
  }
  await page.getByRole("tab",{name:"Мини-курсы"}).click();
  await page.waitForURL("**/mini-courses");
  await page.locator('#catalog-panel-mini-courses article').first().waitFor({state:"visible"});
  assert.equal(await page.locator('#catalog-panel-mini-courses article').count(),4);
  assert.equal(await page.locator('[role="tabpanel"]:not([aria-hidden="true"])').count(),1);
  if(width===1440||width===390)await page.screenshot({path:`${evidence}/mini-${width}.png`,fullPage:true});
  if(width===1440||width===390){
   await page.locator('#catalog-panel-mini-courses article').first().click({position:{x:20,y:20}});
   await page.waitForURL('**/mini-courses/mini-lashes');
   await page.locator('main[data-kind="mini-course"]').getByText('ДЕМОНСТРАЦИЯ СТРАНИЦЫ · ПРОДУКТ НЕ ОПУБЛИКОВАН').waitFor();
   assert.ok(await page.locator('main[data-kind="mini-course"]').getByText('ДЕМОНСТРАЦИЯ СТРАНИЦЫ · ПРОДУКТ НЕ ОПУБЛИКОВАН').isVisible());
   await page.goBack();await page.waitForURL('**/mini-courses');
   await page.locator('#catalog-panel-mini-courses article').first().waitFor({state:'visible'});
  }
  await page.getByRole("button",{name:"Направление Все направления"}).click();
  await page.getByRole("option",{name:"Брови"}).click();
  await page.waitForURL("**/mini-courses?direction=brows");
  assert.equal(await page.locator('#catalog-panel-mini-courses article').count(),1);
  await page.goBack();await page.waitForURL("**/mini-courses");
  assert.ok(await page.getByRole("button",{name:"Направление Все направления"}).isVisible());
  await page.getByRole("tab",{name:"Курсы",exact:true}).focus();
  await page.keyboard.press("ArrowRight");await page.waitForURL("**/mini-courses");
  assert.equal(await page.getByRole("tab",{name:"Мини-курсы"}).getAttribute("aria-selected"),"true");
  await page.evaluate(()=>scrollTo(0,1000));
  await page.waitForFunction(()=>scrollY>=990);
  const filterTop=await page.locator('#catalog-filters').evaluate(el=>el.getBoundingClientRect().top);
  const headerBottom=await page.locator('header').first().evaluate(el=>el.getBoundingClientRect().bottom);
  assert.ok(Math.abs(filterTop-headerBottom)<3,`sticky filter ${filterTop}, header ${headerBottom}`);
 }
 await page.emulateMedia({reducedMotion:"reduce"});
 await page.getByRole("tab",{name:"Курсы",exact:true}).click();await page.waitForURL("**/courses");
 assert.equal(await page.locator('#catalog-panel-mini-courses').getAttribute('aria-hidden'),'true');
 assert.deepEqual(failures,[]);
}finally{await browser.close()}
