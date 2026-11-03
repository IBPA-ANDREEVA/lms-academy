import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
const require=createRequire(import.meta.url);
const { chromium }=require(process.env.PLAYWRIGHT_MODULE||"playwright");
const browser=await chromium.launch({headless:true,channel:"chrome"});
const page=await browser.newPage();
const evidence=process.env.FRONTEND_EVIDENCE || ".catalog-evidence";
await mkdir(evidence,{recursive:true});
const failures=[];page.on("pageerror",error=>failures.push(error.message));
try{
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:width<=390?844:900});
  await page.goto(`${process.env.FRONTEND_URL||"http://localhost:3000"}/courses`);
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(700);
  await page.locator('#catalog-panel-courses article').first().waitFor({state:"visible"});
  assert.equal(await page.locator('[role="tabpanel"]:not([aria-hidden="true"])').count(),1);
  assert.equal(await page.locator('#catalog-panel-courses article').count(),4);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width}`);
  if(width===1440||width===390)await page.screenshot({path:`${evidence}/courses-${width}.png`,fullPage:true});
  if(width===1440||width===390){
   await page.locator('#catalog-panel-courses article').first().click({position:{x:20,y:20}});
   await page.waitForURL('**/courses/demo-course-0');
   await page.getByRole('heading', {level:1}).waitFor();
   // TEST_PREVIEW now explicitly permits local cart simulation, while payment stays disabled.
   assert.ok(await page.getByRole('button', {name:'В демо-корзину',exact:false}).first().isEnabled());
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
   await page.waitForURL('**/mini-courses/demo-mini-0');
   await page.getByRole('heading', {level:1}).waitFor();
   // TEST_PREVIEW now explicitly permits local cart simulation, while payment stays disabled.
   assert.ok(await page.getByRole('button', {name:'В демо-корзину',exact:false}).first().isEnabled());
   await page.goBack();await page.waitForURL('**/mini-courses');
   await page.locator('#catalog-panel-mini-courses article').first().waitFor({state:'visible'});
  }
  const disclosure=page.locator('#catalog-filters details');
  if(!await disclosure.evaluate(el=>el.open))await disclosure.locator('summary').click();
  await page.getByRole("button",{name:"Направление Все направления"}).click();
  await page.getByRole("option",{name:"Брови"}).click();
  await page.waitForURL("**/mini-courses?direction=brows");
  assert.equal(await page.locator('#catalog-panel-mini-courses article').count(),1);
  await page.goBack();await page.waitForURL("**/mini-courses");
  assert.ok(await page.getByRole("button",{name:"Направление Все направления"}).isVisible());
  await page.getByRole("tab",{name:"Курсы",exact:true}).focus();
  await page.keyboard.press("ArrowRight");await page.waitForURL("**/mini-courses");
  assert.equal(await page.getByRole("tab",{name:"Мини-курсы"}).getAttribute("aria-selected"),"true");
  await page.locator('#catalog-filters').evaluate(el=>scrollTo(0,scrollY+el.getBoundingClientRect().top));
  await page.waitForTimeout(650);
  const filterTop=await page.locator('#catalog-filters').evaluate(el=>el.getBoundingClientRect().top);
  const headerBottom=await page.locator('header').first().evaluate(el=>el.getBoundingClientRect().bottom);
  assert.ok(Math.abs(filterTop-headerBottom)<3,`sticky filter ${filterTop}, header ${headerBottom}`);
 }
 await page.emulateMedia({reducedMotion:"reduce"});
 await page.getByRole("tab",{name:"Курсы",exact:true}).click();await page.waitForURL("**/courses");
 assert.equal(await page.locator('#catalog-panel-mini-courses').getAttribute('aria-hidden'),'true');
 assert.deepEqual(failures,[]);
 console.log("Catalog navigation/filter/history/sticky/reduced-motion checks passed with TEST_PREVIEW data.");
}finally{await browser.close()}
