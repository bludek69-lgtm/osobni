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
