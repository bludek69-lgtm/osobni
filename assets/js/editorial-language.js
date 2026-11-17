/* Local strings for content emitted after the page loads. No external AI or translator. */
(function () {
 'use strict';
 const lang=(document.documentElement.lang||'cs').split('-')[0];
 if(!['en','it'].includes(lang)||location.pathname.includes('/hry/denni-kviz/'))return;
 const normalize=s=>s.replace(/\s+/g,' ').trim();
 fetch('/assets/data/editorial-runtime-'+lang+'.json?v=20261117-editorial')
 .then(r=>{if(!r.ok)throw new Error('Local language data unavailable');return r.json();})
 .then(dict=>{
  const fragments=Object.keys(dict).filter(s=>s!==dict[s]&&s.length>=4&&s.length<300&&!/[_#{}=<>\\]/.test(s)).sort((a,b)=>b.length-a.length);
  const protectedNames=['Budinský Luděk','Luděk Budinský','Luděk','Cestovatel69','cestovatel69','Homey Pro 2026','Homey Pro','Portfolio Tracker','Italia Travel Planner','AUTO VÝBĚR','BudLine Panel','Smart Home','Config Center','Resident Auditor','App Tester'];
  const word=c=>!!c&&/[\p{L}\p{N}_]/u.test(c);
  function translated(value){
   const text=normalize(value);
   if(Object.hasOwn(dict,text))return value.replace(text,dict[text]);
   // Template literals compose labels with years, counts and amounts. Translate
   // complete known words/phrases while retaining those values and proper names.
   const saved=[];
   let result=value.replace(/https?:\/\/[^\s]+|[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi,match=>{saved.push(match);return '\uE000'+(saved.length-1)+'\uE001';});
   for(const name of protectedNames)result=result.split(name).join((()=>{saved.push(name);return '\uE000'+(saved.length-1)+'\uE001';})());
   result=result.replace(/(?<![\p{L}\p{N}_])(\d[\d\s\u00a0,.]*)\s*(roky|roků|rok|let|dnů|dny|den|Kč|Kc|kusů|kusy|kus|ks)(?![\p{L}\p{N}_])/gu,(_,number,unit)=>{
    if(unit==='Kč'||unit==='Kc')return number.trim()+' CZK';
    const one=Number(number.replace(/[\s\u00a0]/g,'').replace(',','.'))===1;
    if(['kusů','kusy','kus','ks'].includes(unit))return number.trim()+' '+(lang==='en'?(one?'unit':'units'):'unità');
    const day=['den','dny','dnů'].includes(unit);
    const word=lang==='en'?(day?(one?'day':'days'):(one?'year':'years')):(day?(one?'giorno':'giorni'):(one?'anno':'anni'));
    return number.trim()+' '+word;
   });
   for(const source of fragments){
    let from=0,at;
    while((at=result.indexOf(source,from))!==-1){
     const end=at+source.length;
     if((word(source[0])&&word(result[at-1]))||(word(source[source.length-1])&&word(result[end]))){from=end;continue;}
     result=result.slice(0,at)+dict[source]+result.slice(end);from=at+dict[source].length;
    }
   }
   return result.replace(/\uE000(\d+)\uE001/g,(_,i)=>saved[Number(i)]);
  }
  function visit(node){
   if(node.nodeType===Node.TEXT_NODE){
    const parent=node.parentElement;
    if(!parent||parent.closest('script,style,pre,code,kbd,samp,[translate=no],.lang-switcher,.site-search-dialog,.site-search-open,[data-finance-calculators],[data-blog-status],.it-page'))return;
    const authoredLanguage=parent.closest('[lang]');if(authoredLanguage&&authoredLanguage.tagName!=='HTML')return;
    const next=translated(node.nodeValue);if(next!==node.nodeValue)node.nodeValue=next;return;
   }
   if(node.nodeType!==Node.ELEMENT_NODE)return;
   for(const attr of ['aria-label','title','placeholder','alt'])if(node.hasAttribute(attr)){
    const before=node.getAttribute(attr),after=translated(before);if(before!==after)node.setAttribute(attr,after);
   }
   [...node.childNodes].forEach(visit);
  }
  for(const method of ['alert','confirm','prompt']){
   const native=window[method].bind(window);
   window[method]=(message,...args)=>native(translated(String(message)),...args);
  }
  // Chart labels are painted text rather than DOM nodes. Values and drawing
  // coordinates stay unchanged; measuring and drawing use the same wording.
  if(window.CanvasRenderingContext2D){
   for(const method of ['fillText','strokeText','measureText']){
    const native=CanvasRenderingContext2D.prototype[method];
    CanvasRenderingContext2D.prototype[method]=function(text,...args){return native.call(this,translated(String(text)),...args);};
   }
   window.dispatchEvent(new Event('resize'));
  }
  visit(document.body);
  const observer=new MutationObserver(records=>{
   observer.disconnect();
   for(const r of records){if(r.type==='characterData')visit(r.target);else if(r.type==='attributes')visit(r.target);else r.addedNodes.forEach(visit);}
   observer.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','placeholder','alt']});
  });
  observer.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','placeholder','alt']});
 }).catch(()=>{document.documentElement.dataset.editorialLanguageStatus='unavailable';});
})();
