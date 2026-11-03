import {test} from 'node:test';
import assert from 'node:assert/strict';
import worker, {search as searchIndex} from './worker.mjs';
import index from './index.json' with {type:'json'};
const search = history => searchIndex(history, index);

test('hledá konkrétní region, kameru a navazující místo', () => {
  assert(search([{role:'user',content:'Jaké jídlo je typické pro Ligurii?'}])[0].url.includes('/regiony/ligurie/'));
  assert(search([{role:'user',content:'Kde najdu webkameru v Římě?'}])[0].url.includes('pocasi-webkamery'));
  const chain=[{role:'user',content:'Co mohu vidět v Sieně?'},{role:'assistant',content:'Náměstí.'},{role:'user',content:'A co tam platí pro vjezd do centra?'}];
  assert(search(chain).some(x=>x.url.includes('/siena/')));
});

test('vyhledá nový park a naváže na předchozí dotaz', () => {
  const first = [{role:'user',content:'Jaké výlety doporučíš v Cinque Terre?'}];
  assert(search(first).some(x => x.url === '/cestovani/italie/parky/cinque-terre/'));
  const followup = [...first, {role:'assistant',content:'Můžete navštívit vesnice.'},
    {role:'user',content:'A co tam ještě navštívit?'}];
  assert(search(followup).some(x => x.url === '/cestovani/italie/parky/cinque-terre/'));
});

test('služba předává podklady modelu a odmítá nepovolený původ a překročený limit',async()=>{
  const calls=[],env={CHAT_RATE_LIMITER:{limit:async()=>({success:true})},AI:{run:async(model,body)=>{calls.push(body);return {response:'Ověřená zkušební odpověď.'}}}};
  const req=(origin,question='Ligurie')=>new Request('https://worker.invalid/api/chat',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','CF-Connecting-IP':'192.0.2.1'},body:JSON.stringify({messages:[{role:'user',content:question}]})});
  let r=await worker.fetch(req('https://cestovatel69.cz'),env);assert.equal(r.status,200);let data=await r.json();assert(data.sources.length);assert(calls[0].messages[0].content.includes('PODKLADY'));
  r=await worker.fetch(req('https://cizi.example'),env);assert.equal(r.status,403);
  env.CHAT_RATE_LIMITER.limit=async()=>({success:false});r=await worker.fetch(req('https://cestovatel69.cz'),env);assert.equal(r.status,429);
});
