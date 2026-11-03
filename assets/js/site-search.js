(function () {
  'use strict';
  const lang = (document.documentElement.lang || 'cs').split('-')[0];
  const strings = {
    cs: {button:'Hledat', label:'Hledat na celém webu', title:'Co hledáš?', placeholder:'Místo, téma nebo aplikace', hint:'Hledá v článcích, místech, projektech a vybraném obsahu. Vyzkoušej třeba Pienza, rybaření nebo kalkulačky.', close:'Zavřít vyhledávání', loading:'Načítám vyhledávání…', empty:'Nic jsem nenašel. Zkus jiný výraz nebo kratší název.', count:n=>`Nalezeno výsledků: ${n}`, error:'Vyhledávání se nepodařilo načíst. Zkus to znovu.', retry:'Zkusit znovu', other:'Česky'},
    en: {button:'Search', label:'Search the website', title:'What are you looking for?', placeholder:'A place, topic or project', hint:'Search articles, places, projects and selected content. Try Pienza, fishing or calculators.', close:'Close search', loading:'Loading search…', empty:'No results. Try another or shorter search.', count:n=>`${n} results`, error:'Search could not be loaded. Please try again.', retry:'Try again', other:'In Czech'},
    it: {button:'Cerca', label:'Cerca nel sito', title:'Che cosa cerchi?', placeholder:'Un luogo, un tema o un progetto', hint:'Cerca tra articoli, luoghi, progetti e contenuti selezionati. Prova Pienza, pesca o calcolatori.', close:'Chiudi ricerca', loading:'Caricamento della ricerca…', empty:'Nessun risultato. Prova un altro termine o un nome più breve.', count:n=>`${n} risultati`, error:'Impossibile caricare la ricerca. Riprova.', retry:'Riprova', other:'In ceco'}
  }[lang] || null;
  if (!strings) return;
  const header = document.querySelector('.site-header__inner');
  if (!header || document.querySelector('.site-search-open')) return;
  const style = document.createElement('link'); style.rel = 'stylesheet'; style.href = '/assets/css/site-search.css?v=20261103'; document.head.appendChild(style);
  const button = document.createElement('button'); button.type = 'button'; button.className = 'site-search-open'; button.setAttribute('aria-label', strings.label); button.title = strings.label;
  button.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 4.5 4.5"/></svg><span></span>';
  button.querySelector('span').textContent = strings.button;
  const nav = header.querySelector('.nav-toggle'); header.insertBefore(button, nav || header.querySelector('.nav'));
  const dialog = document.createElement('dialog'); dialog.className='site-search-dialog'; dialog.setAttribute('aria-labelledby','site-search-title');
  dialog.innerHTML='<div class="site-search-top"><h2 id="site-search-title"></h2><button type="button" class="site-search-close">×</button></div><form role="search"><label class="site-search-label" for="site-search-query"></label><input id="site-search-query" type="search" autocomplete="off" maxlength="120"></form><p class="site-search-hint"></p><p class="site-search-status" role="status" aria-live="polite"></p><ol class="site-search-results"></ol>';
  document.body.appendChild(dialog);
  const input=dialog.querySelector('input'), list=dialog.querySelector('ol'), status=dialog.querySelector('.site-search-status'), close=dialog.querySelector('.site-search-close');
  dialog.querySelector('h2').textContent=strings.title; dialog.querySelector('label').textContent=strings.label; input.placeholder=strings.placeholder; dialog.querySelector('.site-search-hint').textContent=strings.hint; close.setAttribute('aria-label',strings.close); close.title=strings.close;
  const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  // A small fallback helps with common Czech inflections (Pienza / Pienzy).
  const matchesTerm=(text,term)=>text.includes(term)||(term.length>=5&&text.includes(term.slice(0,-1)));
  let entries=null, promise=null, request=0;
  function load() {
    if (!promise) promise=fetch('/assets/data/site-search-index.json?v=20261103').then(r=>{if(!r.ok) throw new Error('HTTP '+r.status);return r.json();}).then(data=>{entries=data.documents;return entries;}).catch(e=>{promise=null;throw e;});
    return promise;
  }
  function excerpt(text, terms) {
    const normalized=normalize(text); let pos=normalized.length;
    terms.forEach(t=>{const p=normalized.indexOf(t);if(p>=0)pos=Math.min(pos,p);});
    const start=Math.max(0,(pos===normalized.length?0:pos)-75), end=Math.min(text.length,start+190);
    return (start?'…':'')+text.slice(start,end).trim()+(end<text.length?'…':'');
  }
  function render() {
    const terms=normalize(input.value).trim().split(/\s+/).filter(Boolean); const current=++request; list.replaceChildren();
    if (!terms.length) {status.textContent='';return;}
    status.textContent=strings.loading;
    load().then(data=>{
      if(current!==request)return;
      const seen=new Set();
      const matches=data.map(d=>{
        const title=normalize(d.title+' '+(d.section||'')), content=normalize(d.text), path=normalize(decodeURI(d.url).replace(/[-_/#.]/g,' ')), combined=title+' '+content+' '+path;
        if(!terms.every(t=>matchesTerm(combined,t)))return null;
        const score=terms.reduce((s,t)=>s+(matchesTerm(title,t)?12:0)+(normalize(d.title).startsWith(t)?8:0)+(matchesTerm(content,t)?2:0)+(matchesTerm(path,t)?5:0),0)+(d.lang===lang?12:0);
        return {d,score};
      }).filter(Boolean).sort((a,b)=>b.score-a.score);
      const unique=matches.filter(({d})=>{const k=d.url;if(seen.has(k))return false;seen.add(k);return true;});
      const selected=unique.slice(0,30);
      status.textContent=selected.length?strings.count(unique.length)+(unique.length>30 ? ({cs:' · zobrazeno prvních 30',en:' · showing the first 30',it:' · primi 30 risultati'}[lang]) : ''):strings.empty;
      selected.forEach(({d})=>{
        const li=document.createElement('li'), a=document.createElement('a'), small=document.createElement('span');
        a.href=d.url; a.textContent=d.title+(d.section && d.section!==d.title?' — '+d.section:'')+(d.lang!==lang?' · '+(d.lang==='cs'?strings.other:d.lang.toUpperCase()):'');
        small.textContent=excerpt(d.text,terms);li.append(a,small);list.append(li);
      });
    }).catch(()=>{if(current!==request)return;status.textContent=strings.error;const retry=document.createElement('button');retry.type='button';retry.textContent=strings.retry;retry.addEventListener('click',render);status.append(' ',retry);});
  }
  button.addEventListener('click',()=>{dialog.showModal();input.focus();});
  close.addEventListener('click',()=>dialog.close()); dialog.addEventListener('close',()=>button.focus());
  dialog.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();dialog.close();}});
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  dialog.querySelector('form').addEventListener('submit',e=>e.preventDefault());
  let timer;input.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(render,120);});
})();
