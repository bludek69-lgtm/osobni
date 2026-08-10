// Kontrola verzí aplikací na webu — MĚŘÍ CHOVÁNÍ, ne přítomnost řetězců.
//
// Skripty stránek se opravdu spustí nad minimálním DOM a proti ŽIVÉMU latest.json.
// Sleduje se:
//   1) naplní se každý odznak verze číslem z manifestu? (žádné natvrdo psané drifty)
//   2) nezůstal někde v HTML odkaz na instalátor s JINOU verzí, než je aktuální?
//   3) BudLine: nesmí se doplnit ŽÁDNÝ odkaz ke stažení (předává se osobně)
//
// Vznikl poté, co grep na atribut `data-bl-dl` přehlédl tlačítko ke stažení, které
// ten atribut nemělo a mířilo natvrdo na starou verzi. Kontrolovat se musí výsledek.
//
// Spuštění: node _web_check_verze.js
const fs = require('fs');
const path = require('path');

const KOREN = __dirname;
const ATTR = {                       // atribut -> klíč v latest.json
  'data-bl-ver': 'budline', 'data-mp-ver': 'meal-planner', 'data-it-ver': 'italia',
  'data-col-ver': 'collection', 'data-tp-ver': 'tenispark', 'data-app-version': 'italia',
};
const SOUBOR = {                     // název instalátoru -> klíč (pro kontrolu odkazů)
  'BudLinePanel': 'budline', 'MealPlanner': 'meal-planner', 'ItaliaTravel': 'italia',
  'Collection': 'collection', 'TenisPark': 'tenispark',
};
const BEZ_STAZENI = new Set(['budline', 'meal-planner']);   // předávají se osobně
// Aplikace, které NEJSOU v latest.json — nemají se odkud plnit, takže u nich zůstává
// číslo natvrdo. Výjimka je VĚDOMÁ a pojmenovaná; kdyby se do manifestu přidaly,
// stačí je odsud vyškrtnout a kontrola je začne hlídat.
// POZOR: CS ukazuje v0.20.0, EN/IT v0.19.17 — jsou rozjeté, ale nevím, které je správné.
const MIMO_MANIFEST = ['portfolio-tracker'];

function strankyRekurzivne(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'node_modules' || e.name === '_docs') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) strankyRekurzivne(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function minidom(html) {
  const prvky = [];
  const re = /<([a-z0-9]+)\b([^>]*\bdata-(?:bl|mp|it|col|tp)-(?:ver|dl|dl-mac)\b[^>]*|[^>]*\bdata-app-version\b[^>]*)>/gi;
  let m;
  while ((m = re.exec(html))) {
    const el = { tag: m[1], attrs: {}, textContent: '', href: null };
    const ar = /([a-z0-9-]+)(?:="([^"]*)")?/gi;
    let a;
    while ((a = ar.exec(m[2]))) el.attrs[a[1]] = a[2] === undefined ? '' : a[2];
    el.getAttribute = k => (k in el.attrs ? el.attrs[k] : null);
    el.setAttribute = (k, v) => { el.attrs[k] = v; };
    prvky.push(el);
  }
  const dom = {
    querySelectorAll(sel) {
      const key = (sel.match(/\[([^\]]+)\]/) || [null, ''])[1];
      return prvky.filter(e => key in e.attrs);
    },
    querySelector(sel) { return dom.querySelectorAll(sel)[0] || null; },
    _prvky: prvky,
  };
  return dom;
}

(async () => {
  const man = await fetch('https://raw.githubusercontent.com/bludek69-lgtm/aplikace/main/latest.json',
                          { cache: 'no-store' }).then(r => r.json());
  console.log('MANIFEST: ' + Object.entries(man).map(([k, v]) => `${k}=${v.version}`).join('  '));
  let chyb = 0, kontrol = 0;

  for (const abs of strankyRekurzivne(KOREN)) {
    const rel = path.relative(KOREN, abs).replace(/\\/g, '/');
    const html = fs.readFileSync(abs, 'utf8');
    const potize = [];

    // (2) odkaz na instalátor s jinou verzí, než je aktuální
    for (const m of html.matchAll(/(BudLinePanel|MealPlanner|ItaliaTravel|Collection|TenisPark)-v([\d.]+)-Setup\.exe/g)) {
      const klic = SOUBOR[m[1]];
      kontrol++;
      if (BEZ_STAZENI.has(klic)) potize.push(`odkaz ke stažení ${m[0]} — ${klic} se z webu nestahuje`);
      else if (man[klic] && man[klic].version !== m[2])
        potize.push(`odkaz na ${m[0]}, ale aktuální je ${man[klic].version}`);
    }

    // (4) OBRÁCENÁ kontrola: každý odznak, který vypadá jako „aktuální verze", MUSÍ nést
    // atribut z manifestu. Bez tohohle by odebrání atributu prošlo — prvek by se prostě
    // nesebral a nikdo by si nevšiml (ověřeno mutací: dřív to opravdu prošlo).
    const ODZNAK = /<(span|strong)\b([^>]*)>\s*(v?\d+\.\d+\.\d+(?:\s+BETA)?)\s*<\/(?:span|strong)>/gi;
    for (const m of html.matchAll(ODZNAK)) {
      kontrol++;
      const maAttr = Object.keys(ATTR).some(a => m[2].includes(a));
      const vyjimka = MIMO_MANIFEST.some(x => rel.includes(x));
      if (!maAttr && !vyjimka)
        potize.push(`odznak "${m[3]}" nemá atribut z manifestu (natvrdo → driftne)`);
    }

    // (1)+(3) spusť skripty stránky nad minimálním DOM
    const skripty = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x => x[1])
                    .filter(s => s.includes('latest.json'));
    if (skripty.length) {
      const dom = minidom(html);
      global.document = dom;
      // `ok: true` je nutne — nektere skripty delaji `r.ok ? r.json() : null` a bez toho
      // by se tvarily jako nedostupny manifest a test by hlasil falesny nalez.
      global.fetch = () => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(man) });
      for (const s of skripty) { try { eval(s); } catch (e) { potize.push('skript spadl: ' + e.message); } }
      await new Promise(r => setTimeout(r, 120));
      for (const el of dom._prvky) {
        for (const [attr, klic] of Object.entries(ATTR)) {
          if (!(attr in el.attrs)) continue;
          kontrol++;
          const ocek = man[klic] && man[klic].version;
          if (!ocek) { potize.push(`${attr}: v manifestu není ${klic}`); continue; }
          if (!el.textContent.includes(ocek))
            potize.push(`${attr} ukazuje "${el.textContent || '(nenaplněno)'}", čekáno ${ocek}`);
        }
        const jeDl = 'data-bl-dl' in el.attrs || 'data-bl-dl-mac' in el.attrs;
        if (jeDl && el.href !== null) { kontrol++; potize.push('BudLine dostal odkaz ke stažení'); }
      }
    }
    if (potize.length) { chyb += potize.length; console.log(`  🔴 ${rel}`); potize.forEach(p => console.log('       ' + p)); }
  }
  console.log(`\n${kontrol} kontrol · ${chyb} problémů`);
  console.log(chyb === 0 ? 'VÝSLEDEK: PASS — všechny verze jdou z manifestu, žádný odkaz na starou verzi'
                         : 'VÝSLEDEK: FAIL');
  process.exit(chyb === 0 ? 0 : 1);
})();
