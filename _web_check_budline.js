// Ověření CHOVÁNÍ stránek po odstranění stahování: skript se opravdu spustí nad
// minimálním DOM a proti ŽIVÉMU manifestu. Měří se, co skript udělá — ne co je v HTML.
const fs = require('fs');
const path = require('path');
const WEB = 'C:/Users/Admin/code/osobni';
const STRANKY = ['aplikace/budline.html','aplikace/index.html',
                 'en/aplikace/budline.html','en/aplikace/index.html',
                 'it/aplikace/budline.html','it/aplikace/index.html'];

function minidom(html) {
  // posbírej prvky s data-bl-ver / data-bl-dl / data-bl-dl-mac
  const prvky = [];
  const re = /<([a-z0-9]+)\b([^>]*\bdata-bl-(?:ver|dl|dl-mac)\b[^>]*)>/gi;
  let m;
  while ((m = re.exec(html))) {
    const attrs = m[2];
    const el = { tag: m[1], attrs: {}, textContent: '', href: null, _dl: false };
    const ar = /([a-z0-9-]+)(?:="([^"]*)")?/gi;
    let a;
    while ((a = ar.exec(attrs))) el.attrs[a[1]] = a[2] === undefined ? '' : a[2];
    el.getAttribute = k => (k in el.attrs ? el.attrs[k] : null);
    el.setAttribute = (k, v) => { el.attrs[k] = v; if (k === 'download') el._dl = true; };
    Object.defineProperty(el, 'hrefSet', { get: () => el.href !== null });
    prvky.push(el);
  }
  return {
    querySelectorAll(sel) {
      const key = (sel.match(/\[([^\]]+)\]/) || [null, ''])[1];
      return prvky.filter(e => key in e.attrs);
    },
    _prvky: prvky
  };
}

(async () => {
  const manifest = await fetch('https://raw.githubusercontent.com/bludek69-lgtm/aplikace/main/latest.json',
                               { cache: 'no-store' }).then(r => r.json());
  console.log('manifest budline:', manifest.budline.version, '| url:', manifest.budline.url.slice(-34));
  let chyb = 0;
  for (const rel of STRANKY) {
    const html = fs.readFileSync(path.join(WEB, rel), 'utf8');
    const skripty = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1])
                    .filter(s => s.includes('latest.json') && s.includes('data-bl-ver'));
    if (!skripty.length) { console.log(`  ?? ${rel}: skript s verzí nenalezen`); chyb++; continue; }
    const dom = minidom(html);
    global.document = dom;
    global.fetch = () => Promise.resolve({ json: () => Promise.resolve(manifest) });
    for (const s of skripty) { try { eval(s); } catch (e) { console.log('  eval chyba', rel, e.message); chyb++; } }
    await new Promise(r => setTimeout(r, 60));
    const vers = dom._prvky.filter(e => 'data-bl-ver' in e.attrs);
    const dls  = dom._prvky.filter(e => 'data-bl-dl' in e.attrs || 'data-bl-dl-mac' in e.attrs);
    const naplnene = vers.filter(e => /1\.2\.\d+/.test(e.textContent));
    const sOdkazem = dls.filter(e => e.href !== null);
    const ok = vers.length > 0 && naplnene.length === vers.length && sOdkazem.length === 0;
    if (!ok) chyb++;
    console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${rel.padEnd(26)} verzí=${vers.length} naplněno=${naplnene.length}` +
                ` (${naplnene.map(e => e.textContent).slice(0,1)}) · tlačítek ke stažení=${dls.length}` +
                ` · z toho s odkazem=${sOdkazem.length}`);
  }
  console.log(chyb === 0 ? '\nVÝSLEDEK: PASS — verze se plní, odkaz ke stažení se NEDOPLŇUJE nikde'
                         : `\nVÝSLEDEK: ${chyb} problémů`);
  process.exit(chyb === 0 ? 0 : 1);
})();
