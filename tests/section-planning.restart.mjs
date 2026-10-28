import {readFile,writeFile,rename,unlink} from 'node:fs/promises';
import assert from 'node:assert/strict';
const file='docs/design/section-planning/pages/home.json';
const backup=file+'.restart-backup.tmp';
const endpoint=(process.env.SECTIONS_URL||'http://127.0.0.1:3000')+'/dev/sections/data';
const origin=new URL(endpoint).origin;
const marker='AUTOMATED RESTART TEST — NOT HUMAN REVIEW';
if(process.argv[2]==='prepare') {
 const raw=await readFile(file,'utf8');const original=JSON.parse(raw);
 assert.equal(original.status,'draft');assert.equal(original.history.length,0);
 await writeFile(backup,raw,{flag:'wx'});
 const bundle=await (await fetch(endpoint)).json();const item=bundle.pages.find(x=>x.page.id==='home');
 const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Origin:origin,'x-planning-token':bundle.token},body:JSON.stringify({id:'home',digest:item.digest,action:'save',reviewer:marker,notes:marker,sections:item.page.sections,acknowledged:[]})});
 assert.equal(response.status,200,await response.text());
 console.log('Prepared persisted revision. Restart the development server, then run verify.');
} else if(process.argv[2]==='verify') {
 const bundle=await (await fetch(endpoint)).json();const item=bundle.pages.find(x=>x.page.id==='home');
 assert.equal(item.page.notes,marker);assert.equal(item.page.revision,2);assert.equal(item.page.history[0].reviewer,marker);
 const current=JSON.parse(await readFile(file,'utf8'));assert.deepEqual(current,item.page);
 const original=await readFile(backup,'utf8');
 await writeFile(file+'.restore.tmp',original);await rename(file+'.restore.tmp',file);await unlink(backup);
 console.log('PASS: saved changes survived a development-server restart; exact original draft restored.');
} else throw new Error('Specify prepare or verify.');
