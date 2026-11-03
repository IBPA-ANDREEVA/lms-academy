import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
const require=createRequire(import.meta.url);
const { chromium }=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.FRONTEND_URL||'http://localhost:3112';
const evidence=process.env.FRONTEND_EVIDENCE || 'docs/qa/evidence/LAND02-public-site-2026-11-02';
const browser=await chromium.launch({headless:true,channel:'chrome'});
const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const checks=[];
async function settled() {await page.waitForFunction(()=>{const t=document.querySelector('[data-offers-track]'),p=t.querySelector(':scope > [aria-hidden="false"]');return !t.dataset.transitioning&&Math.abs(t.getBoundingClientRect().height-p.getBoundingClientRect().height)<2;});}
try {
 await page.goto(base+'/#packages');await page.waitForFunction(()=>document.querySelector('[data-learning-offers]')?.dataset.activeOffer==='packages');await settled();assert.equal(await page.locator('[data-public-intro]').count(),0);checks.push('direct hash selection');
 await page.locator('[data-learning-offers]').evaluate(el=>scrollTo(0,scrollY+el.getBoundingClientRect().top-68));
 await page.getByRole('tablist',{name:'Форматы обучения'}).getByRole('tab').evaluateAll(tabs=>{tabs[2].click();tabs[0].click();tabs[3].click();});await settled();assert.equal(await page.locator('[data-learning-offers]').getAttribute('data-active-offer'),'start-usa');
 await page.setViewportSize({width:320,height:844});await settled();await page.setViewportSize({width:768,height:900});await settled();checks.push('rapid switching and resize settle active height');
 await page.getByRole('contentinfo').first().getByRole('link',{name:'Мини-курсы',exact:true}).click();await page.waitForURL('**/mini-courses');await page.goBack();await page.waitForURL('**/#packages');await page.waitForFunction(()=>document.querySelector('[data-learning-offers]')?.dataset.activeOffer==='packages');await settled();checks.push('Back restores hash panel');
 await page.getByRole('tab',{name:'Мини-курсы',exact:true}).click();await page.emulateMedia({reducedMotion:'reduce'});await settled();assert.equal(await page.locator('[aria-hidden="false"][role="tabpanel"]').first().evaluate(el=>getComputedStyle(el).opacity),'1');checks.push('live reduced motion settles panel');
 await page.emulateMedia({reducedMotion:'no-preference'});const faq=page.locator('#faq details').first();await faq.locator('summary').evaluate(el=>{el.click();el.click();el.click();});await page.waitForTimeout(400);assert.equal(await faq.getAttribute('open'),null);await faq.locator('summary').click();await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await faq.getAttribute('open'),'');await page.waitForFunction(()=>!document.querySelector('#faq details [id^="faq-answer-"]').hasAttribute('style'));checks.push('FAQ rapid reversal and live reduced motion');
 await page.screenshot({path:evidence+'/faq-reduced-768.png'});assert.deepEqual(errors,[]);console.log('LAND02 motion: hash/Back, rapid switching, resizing, live reduced motion and FAQ reversal passed.');
} finally {await writeFile(evidence+'/motion-results.json',JSON.stringify({checks,errors},null,2));await browser.close();}
