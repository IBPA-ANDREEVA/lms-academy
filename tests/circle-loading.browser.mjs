// Historical filename retained; D-021 now verifies the real Splash loading boundary.
import assert from 'node:assert/strict';
import http from 'node:http';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { createLoopbackProxyOptions } from './helpers/loopback-proxy.mjs';
const { chromium }=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.FRONTEND_URL||'http://localhost:3117';
const proxyOptions=createLoopbackProxyOptions(base);
const evidence=process.env.FRONTEND_EVIDENCE||'docs/qa/evidence/premium-motion-2026-11-02';
await mkdir(evidence,{recursive:true});
// Model a slow server by delivering Next's actual shell/Flight data before
// its resolved detail segment. No route, component or product data is replaced.
// The fixture resolves synchronously, so simply slowing the whole HTML would
// also prevent shell hydration and could never exercise the loading boundary.
let delay=1500;
const server=http.createServer((request,response)=>{
 let options;
 try {options=proxyOptions(request);} catch {response.writeHead(400);response.end('Invalid test proxy request');return;}
 const upstream=http.request(options,incoming=>{
  const headers={...incoming.headers};delete headers['content-length'];delete headers['transfer-encoding'];
  if(request.url.startsWith('/courses/course-lashes')&&request.headers.accept?.includes('text/html')) {
   const chunks=[];incoming.on('data',chunk=>chunks.push(chunk));incoming.on('end',()=>{
    const html=Buffer.concat(chunks),body=html.toString(),split=body.indexOf('<div hidden id="S:');
    response.writeHead(incoming.statusCode,headers);
    if(split<0||!delay){response.end(html);return;}
    const bootstrap=body.match(/<script>\(self\.__next_f=self\.__next_f\|\|\[\]\)\.push\(\[0\]\)<\/script>/)?.[0];
    const flight=body.match(/<script>self\.__next_f\.push\((.*?)\)<\/script>/);
    if(!bootstrap||!flight)throw Error('Next stream format changed');
    const payload=JSON.parse(flight[1]);
    const records=payload[1].split('\n');
    const deferred=records.filter(record=>record.includes('"data-kind":"course"'));
    assert.equal(deferred.length,1,'Resolved page record');
    const shell=records.filter(record=>!deferred.includes(record)).join('\n');
    const push=data=>`<script>self.__next_f.push(${JSON.stringify([1,data])})</script>`;
    const tail=body.slice(split).replace(bootstrap,'').replace(flight[0],()=>push(deferred.join('\n')+'\n'));
    response.write(body.slice(0,split)+bootstrap+push(shell));
    setTimeout(()=>{if(!response.destroyed)response.end(tail);},delay);
   });
  } else {response.writeHead(incoming.statusCode,headers);incoming.pipe(response);}
 });
 upstream.on('error',()=>{response.writeHead(502);response.end('Test proxy upstream unavailable');});request.pipe(upstream);
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[],errors=[];
try {
 for(const scenario of ['slow','fast','interrupted','reduced','live-reduced']) {
  delay=scenario==='fast'?0:1800;
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:scenario==='reduced'?'reduce':'no-preference'});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{window.splashCount=0;new MutationObserver(records=>{for(const record of records)if(record.attributeName==='hidden'&&record.target.matches('[data-splash-loader]')&&!record.target.hidden)window.splashCount++;}).observe(document,{subtree:true,attributes:true,attributeFilter:['hidden']});});
  const navigation=page.goto(origin+'/courses/course-lashes',{waitUntil:'load'}).catch(e=>{if(scenario!=='interrupted')throw e;});
  if(['slow','interrupted','live-reduced'].includes(scenario)) {
   await page.locator('[data-splash-loader]:not([hidden])').waitFor({timeout:10000});
   assert.ok(await page.locator('[data-route-loading]').isVisible(),'Splash represents the real fallback');
   assert.equal(await page.locator('[data-page-wipe]:not([hidden])').count(),0);
   await page.screenshot({path:`${evidence}/cold-splash-${scenario}.png`});
   if(scenario==='interrupted')await page.getByRole('link',{name:'Beauty Business Academy',exact:true}).first().click();
   if(scenario==='live-reduced')await page.emulateMedia({reducedMotion:'reduce'});
  }
  await navigation;
  await page.waitForFunction(()=>!document.querySelector('[data-splash-loader]:not([hidden])'));
  await page.getByRole('heading',{level:1}).first().waitFor();
  if(scenario==='fast'||scenario==='reduced')assert.equal(await page.evaluate(()=>window.splashCount),0,'No loader flash on fast/reduced entry');
  if(scenario==='interrupted')await page.waitForURL(origin+'/');
  results.push(scenario);console.log(`PASS real streamed Splash: ${scenario}`);await context.close();
 }
 assert.deepEqual(errors,[]);
} finally {await writeFile(`${evidence}/splash-results.json`,JSON.stringify({results,errors},null,2));server.closeAllConnections();server.close();await browser.close();}
