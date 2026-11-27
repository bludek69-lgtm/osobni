/* Shared presentation controls for the standalone Smart Home and reference pages. */
(function () {
 'use strict';
 const html=document.documentElement, lang=(html.lang||'cs').split('-')[0];
 const label={cs:['Přepnout světlý a tmavý režim','Tmavý režim','Světlý režim'],en:['Switch light and dark mode','Dark mode','Light mode'],it:['Cambia tema chiaro e scuro','Tema scuro','Tema chiaro']}[lang]||[];
 const standalone=!document.querySelector('script[src*="/assets/js/main.js"]');
 const financeDemo=location.pathname.includes('/finance/demo/');
 if(financeDemo){
  const sync=()=>html.setAttribute('data-theme-mode',html.getAttribute('data-theme')==='light'?'light':'dark');
  sync();new MutationObserver(sync).observe(html,{attributes:true,attributeFilter:['data-theme']});
 }
 if(standalone&&!financeDemo){
  let mode='dark';try{mode=localStorage.getItem('cestovatel69_theme_mode')||'dark';}catch(e){}
  html.setAttribute('data-theme-mode',mode==='light'?'light':'dark');
 }
 function install(){
  if(!standalone || document.querySelector('.theme-toggle') || location.pathname.includes('/finance/demo/'))return;
  const host=document.querySelector('.site-header .header-inner,.site-header__inner,.editorial-language');
  if(!host)return;
  const button=document.createElement('button');button.type='button';button.className='theme-toggle editorial-theme-toggle';
  function update(){const dark=html.getAttribute('data-theme-mode')!=='light';button.textContent=dark?'☀️':'🌙';button.setAttribute('aria-label',label[0]);button.title=dark?label[2]:label[1];}
  button.addEventListener('click',()=>{const mode=html.getAttribute('data-theme-mode')==='light'?'dark':'light';html.setAttribute('data-theme-mode',mode);try{localStorage.setItem('cestovatel69_theme_mode',mode);}catch(e){}update();});
  host.append(button);update();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();

/* Home only: one calendar, seven decorative variants, no external assets or services. */
(function () {
 'use strict';
 const hero=document.querySelector('.home-page .editorial-home-hero');
 if(!hero)return;
 const lang=(document.documentElement.lang||'cs').split('-')[0];
 const local=['localhost','127.0.0.1','[::1]'].includes(location.hostname);
 const params=new URLSearchParams(location.search);
 const names={cs:['Zima','Jaro','Léto','Podzim','Vánoce','Nový rok','Velikonoce'],en:['Winter','Spring','Summer','Autumn','Christmas','New Year','Easter'],it:['Inverno','Primavera','Estate','Autunno','Natale','Capodanno','Pasqua']};
 const keys=['winter','spring','summer','autumn','christmas','new-year','easter'];
 const copy={
  cs:{
   winter:['Zimní zastavení','I zima má svoje příběhy.','Přeji pohodové dny a šťastné návraty z každé cesty.'],
   spring:['Jaro na cestách','Zase o něco blíž slunci.','Přeji spoustu malých objevů a nové důvody vyrazit ven.'],
   summer:['Léto na cestách','Dlouhé dny, nové zážitky.','Ať je tvoje léto plné míst, na která se budeš rád vracet.'],
   autumn:['Podzimní zastavení','Zpomalit. Dívat se kolem.','Podzim přeje barevným cestám i večerům s dobrým příběhem.'],
   christmas:['Vánoční čas','Klidný advent a krásné Vánoce.','Přeji chvíle pohody, čas s blízkými a šťastnou cestu domů.'],
   'new-year':['Nový rok','Na další rok plný příběhů.','Přeji zdraví, dobré lidi kolem sebe a mnoho šťastných kilometrů.'],
   easter:['Velikonoční zastavení','Krásné Velikonoce a svěží jaro.','Užij si sváteční dny, první květy a malé výlety za sluncem.'],
   festive:'Krásné Vánoce a pohodové sváteční dny.',preview:'Náhled sezón',select:'Zvolit podobu úvodní stránky',auto:'Automaticky podle data',calendar:'Podle českého kalendáře · Vánoce od 20. 11., Nový rok 31. 12.–6. 1., Velikonoce od Květné neděle do pondělí.',signature:'Luděk'
  },
  en:{
   winter:['A winter pause','Every winter has its stories.','Wishing you peaceful days and a safe journey home.'],
   spring:['Spring on the road','A little closer to the sun.','Here’s to small discoveries and new reasons to head outdoors.'],
   summer:['Summer on the road','Long days. New memories.','May your summer be full of places you’ll love coming back to.'],
   autumn:['An autumn pause','Slow down. Look around.','A season for colourful journeys and evenings with a good story.'],
   christmas:['Christmas time','A peaceful Advent and a merry Christmas.','Wishing you quiet moments, loved ones nearby and a safe journey home.'],
   'new-year':['A new year','Here’s to another year of stories.','Wishing you good health, good company and many happy miles.'],
   easter:['An Easter pause','Happy Easter and a bright spring.','Enjoy the holiday, the first blossoms and little trips into the sunshine.'],
   festive:'Merry Christmas and peaceful holidays.',preview:'Preview the seasons',select:'Choose the homepage decoration',auto:'Automatic calendar',calendar:'Czech calendar · Christmas from 20 November, New Year 31 December–6 January, Easter from Palm Sunday to Easter Monday.',signature:'Luděk'
  },
  it:{
   winter:['Una pausa d’inverno','Anche l’inverno ha le sue storie.','Ti auguro giornate serene e un buon ritorno da ogni viaggio.'],
   spring:['Primavera in viaggio','Un po’ più vicini al sole.','Ti auguro piccole scoperte e nuovi motivi per uscire all’aperto.'],
   summer:['Estate in viaggio','Giornate lunghe, nuovi ricordi.','Che la tua estate sia piena di luoghi in cui vorrai tornare.'],
   autumn:['Una pausa d’autunno','Rallentare. Guardarsi intorno.','La stagione dei viaggi tra i colori e delle serate con una bella storia.'],
   christmas:['Tempo di Natale','Un sereno Avvento e buon Natale.','Ti auguro momenti di pace, persone care vicine e un buon viaggio verso casa.'],
   'new-year':['Un nuovo anno','Un altro anno di storie da vivere.','Ti auguro salute, belle persone accanto e tanti chilometri felici.'],
   easter:['Una pausa di Pasqua','Buona Pasqua e una luminosa primavera.','Goditi le feste, i primi fiori e le piccole gite al sole.'],
   festive:'Buon Natale e serene feste.',preview:'Anteprima delle stagioni',select:'Scegli la decorazione della pagina iniziale',auto:'Calendario automatico',calendar:'Calendario ceco · Natale dal 20 novembre, Capodanno dal 31 dicembre al 6 gennaio, Pasqua dalla Domenica delle Palme al lunedì.',signature:'Luděk'
  }
 };
 const text=copy[lang]||copy.cs;
 // Meeus/Jones/Butcher Gregorian computus. Work in UTC civil days, never DST hours.
 function easterDay(year){
  const a=year%19,b=Math.floor(year/100),c=year%100,d=Math.floor(b/4),e=b%4;
  const f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30;
  const i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451);
  const n=h+l-7*m+114;
  return Date.UTC(year,Math.floor(n/31)-1,n%31+1);
 }
 function civilToday(){
  // One consistent calendar even when a visitor travels to a different time zone.
  const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Prague',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const get=type=>Number(parts.find(p=>p.type===type).value);
  return [get('year'),get('month'),get('day')];
 }
 function calendar(date){
  const [y,m,d]=date;
  if((m===12&&d===31)||(m===1&&d<=6))return 'new-year';
  if((m===11&&d>=20)||m===12)return 'christmas';
  const delta=(Date.UTC(y,m-1,d)-easterDay(y))/86400000;
  if(delta>=-7&&delta<=1)return 'easter';
  return m>=3&&m<=5?'spring':m>=6&&m<=8?'summer':m>=9&&m<=11?'autumn':'winter';
 }
 function dateForPreview(){
  const value=local&&params.get('season-date');
  if(value&&/^\d{4}-\d{2}-\d{2}$/.test(value)){
   const parts=value.split('-').map(Number),d=new Date(Date.UTC(parts[0],parts[1]-1,parts[2]));
   if(d.getUTCFullYear()===parts[0]&&d.getUTCMonth()===parts[1]-1&&d.getUTCDate()===parts[2])return parts;
  }
  return civilToday();
 }
 const banner=document.createElement('aside');banner.className='home-season';
 banner.innerHTML='<div class="home-season-copy"><p class="home-season-kicker"></p><p class="home-season-message"></p><p class="home-season-caption"></p></div><div class="home-season-art" aria-hidden="true"></div>';
 hero.prepend(banner);
 let override=local&&keys.includes(params.get('season'))?params.get('season'):null;
 function render(){
  const date=dateForPreview(),key=override||calendar(date),content=text[key];
  hero.dataset.homeSeason=key;hero.dataset.seasonDate=date.map((n,i)=>i?String(n).padStart(2,'0'):n).join('-');
  banner.setAttribute('aria-label',content[0]);
  banner.querySelector('.home-season-kicker').textContent=content[0];
  banner.querySelector('.home-season-message').textContent=key==='christmas'&&date[1]===12&&date[2]>=24?text.festive:content[1];
  banner.querySelector('.home-season-caption').textContent=content[2]+' — '+text.signature;
  banner.querySelector('.home-season-art').style.backgroundImage='url("/assets/img/home-seasons/'+key+'.webp")';
 }
 render();
 // Recheck on return to the tab and across midnight without a page reload.
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)render();});
 setInterval(()=>{if(!document.hidden)render();},60000);
 if(local){
  const preview=document.createElement('details');preview.className='home-season-preview';
  const summary=document.createElement('summary');summary.textContent=text.preview;preview.append(summary);
  const label=document.createElement('label');label.textContent=text.select;
  const select=document.createElement('select');select.name='season-preview';
  [text.auto,...(names[lang]||names.cs)].forEach((name,i)=>{const o=document.createElement('option');o.value=i?keys[i-1]:'';o.textContent=name;select.append(o);});
  select.value=override||'';label.append(select);preview.append(label);
  const hint=document.createElement('p');hint.textContent=text.calendar;preview.append(hint);banner.after(preview);
  select.addEventListener('change',()=>{override=select.value||null;const url=new URL(location.href);if(override)url.searchParams.set('season',override);else{url.searchParams.delete('season');url.searchParams.delete('season-date');params.delete('season-date');}history.replaceState(null,'',url);render();});
 }
})();
