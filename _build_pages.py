"""Idempotent page builder for osobni web."""
import io as _io, sys as _sys
try:
    _sys.stdout = _io.TextIOWrapper(_sys.stdout.buffer, encoding='utf-8', errors='replace')
    _sys.stderr = _io.TextIOWrapper(_sys.stderr.buffer, encoding='utf-8', errors='replace')
except Exception:
    pass
"""Idempotent page builder — full docstring kept below.

Reads each existing per-page HTML, extracts <main> content, and re-wraps
with the current shared template (header/nav + footer).

Source of truth: <main id="main">...</main> block in each HTML file.
Re-running keeps content intact; only header/footer/CSS/JS link refs are updated.

Run from website root:
  py -3.14 _build_pages.py
"""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent

# ─── PAGES ──────────────────────────────────────────────────
# (rel_path, body_class, title, nav_label, css_path, js_path)
# css_path / js_path are relative-to-root depth-aware:
#   index.html           → "assets/css/style.css"
#   finance/index.html   → "../assets/css/style.css"
#   cestovani/italie/idx → "../../assets/css/style.css"

PAGES = [
    {
        'rel':       'index.html',
        'theme':     'home',
        'title':     'Luděk — osobní stránka',
        'depth':     0,
    },
    {
        'rel':       'ai.html',
        'theme':     'home',
        'title':     'AI v praxi — jak používám umělou inteligenci | Luděk Budínský',
        'depth':     0,
        'extra_css': 'assets/css/ai.css',   # page-specific styles (loaded on top of style.css)
    },
    {
        'rel':       'finance/index.html',
        'theme':     'finance',
        'title':     'Finance & investice — Luděk',
        'depth':     1,
    },
    {
        'rel':       'cestovani/index.html',
        'theme':     'travel',
        'title':     'Cestování — Luděk',
        'depth':     1,
    },
    {
        'rel':       'cestovani/italie/index.html',
        'theme':     'italy',
        'title':     'Itálie — Luděk',
        'depth':     2,
    },
    {
        'rel':       'cestovani/italie/pruvodce.html',
        'theme':     'italy',
        'title':     'Praktický průvodce Itálií — Luděk',
        'depth':     2,
    },
    {
        'rel':       'cestovani/italie/toskansko/index.html',
        'theme':     'italy',
        'title':     'Itálie — Toskánsko — Cestování — Luděk',
        'depth':     3,
    },
    {
        'rel':       'cestovani/italie/jih/index.html',
        'theme':     'italy',
        'title':     'Itálie — Jih — Cestování — Luděk',
        'depth':     3,
    },
    {
        'rel':       'cestovani/italie/kuchyne.html',
        'theme':     'italy',
        'title':     'Italská kuchyně — Itálie — Luděk',
        'depth':     2,
    },
    {
        'rel':       'cestovani/bosna/index.html',
        'theme':     'travel',
        'title':     'Bosna a Hercegovina — Cestování — Luděk',
        'depth':     2,
    },
    {'rel': 'cestovani/chorvatsko/index.html', 'theme': 'travel', 'title': 'Chorvatsko — Cestování — Luděk', 'depth': 2},
    {'rel': 'cestovani/estonsko/index.html', 'theme': 'travel', 'title': 'Estonsko — Cestování — Luděk', 'depth': 2},
    {'rel': 'cestovani/holansko/index.html', 'theme': 'travel', 'title': 'Nizozemsko — Cestování — Luděk', 'depth': 2},
    {'rel': 'cestovani/lotyssko/index.html', 'theme': 'travel', 'title': 'Lotyšsko — Cestování — Luděk', 'depth': 2},
    {'rel': 'cestovani/cesko/index.html', 'theme': 'travel', 'title': 'Česká republika — Cestování — Luděk', 'depth': 2},
    {'rel': 'cestovani/madarsko/index.html', 'theme': 'travel', 'title': 'Maďarsko — Cestování — Luděk', 'depth': 2},
    {'rel': 'cestovani/rakousko/index.html', 'theme': 'travel', 'title': 'Rakousko — Cestování — Luděk', 'depth': 2},
    {'rel': 'cestovani/slovensko/index.html', 'theme': 'travel', 'title': 'Slovensko — Cestování — Luděk', 'depth': 2},
    {'rel': 'cestovani/slovinsko/index.html', 'theme': 'travel', 'title': 'Slovinsko — Cestování — Luděk', 'depth': 2},
    {'rel': 'cestovani/svedsko/index.html', 'theme': 'travel', 'title': 'Švédsko — Cestování — Luděk', 'depth': 2},
    {'rel': 'cestovani/svycarsko/index.html', 'theme': 'travel', 'title': 'Švýcarsko — Cestování — Luděk', 'depth': 2},
    {'rel': 'cestovani/italie/benatky/index.html', 'theme': 'italy', 'title': 'Itálie — Benátky — Cestování — Luděk', 'depth': 3},
    {'rel': 'cestovani/italie/roma/index.html', 'theme': 'italy', 'title': 'Itálie — Řím — Cestování — Luděk', 'depth': 3},
    {'rel': 'cestovani/italie/sever/index.html', 'theme': 'italy', 'title': 'Itálie — Sever — Cestování — Luděk', 'depth': 3},
    {
        'rel':       'cestovani/francie/index.html',
        'theme':     'travel',
        'title':     'Francie — Cestování — Luděk',
        'depth':     2,
    },
    {
        'rel':       'cestovani/nemecko/index.html',
        'theme':     'travel',
        'title':     'Německo — Cestování — Luděk',
        'depth':     2,
    },
    {
        'rel':       'cestovani/irsko/index.html',
        'theme':     'travel',
        'title':     'Irsko — Cestování — Luděk',
        'depth':     2,
    },
    {
        'rel':       'cestovani/finsko/index.html',
        'theme':     'travel',
        'title':     'Finsko — Cestování — Luděk',
        'depth':     2,
    },
    {
        'rel':       'cestovani/uk/index.html',
        'theme':     'travel',
        'title':     'Velká Británie — Cestování — Luděk',
        'depth':     2,
    },
    {
        'rel':       'cestovani/norsko/index.html',
        'theme':     'travel',
        'title':     'Norsko — Cestování — Luděk',
        'depth':     2,
    },
    {
        'rel':       'cestovani/rusko/index.html',
        'theme':     'travel',
        'title':     'Rusko — Cestování — Luděk',
        'depth':     2,
    },
    {
        'rel':       'cestovani/pracovni-cesty/index.html',
        'theme':     'travel',
        'title':     'Pracovní cesty řidiče — Cestování — Luděk',
        'depth':     2,
    },
    {
        'rel':       'cestovani/pracovni-cesty/autobusy/index.html',
        'theme':     'travel',
        'title':     'Autobusy, se kterými jsem jezdil — Luděk',
        'depth':     3,
    },
    # POZN. (Wave 2.6): smart-home/index.html ZÁMĚRNĚ NENÍ v PAGES. Má vlastní cizí
    # design (jiný head/footer/lightbox, žádný lang-switcher) jako zbylých 35 smart-home
    # stránek = orphan / vlastní build. Osobní šablona by jí poškodila head+footer.
    {
        'rel':       'zaliby/rybareni/index.html',
        'theme':     'travel',
        'title':     'Rybaření — Luděk',
        'depth':     2,
    },
    # ─── Moje aplikace (hub + 6 sub-pages × 3 jazyky) ───
    {'rel': 'aplikace/index.html',              'theme': 'home', 'title': 'Moje aplikace — Luděk',                       'depth': 1},
    {'rel': 'aplikace/config-center.html',      'theme': 'home', 'title': 'Config Center — Moje aplikace — Luděk',       'depth': 1},
    {'rel': 'aplikace/italia-travel.html',      'theme': 'italy','title': 'Italia Travel Planner — Moje aplikace — Luděk','depth': 1},
    {'rel': 'aplikace/ucetni-kniha.html',       'theme': 'finance','title': 'Účetní kniha — Moje aplikace — Luděk',       'depth': 1},
    {'rel': 'aplikace/finance-analytik.html',   'theme': 'finance','title': 'Finance Analytik — Moje aplikace — Luděk',   'depth': 1},
    {'rel': 'aplikace/krabickova-dieta.html',   'theme': 'home', 'title': 'Krabičková dieta — Moje aplikace — Luděk',     'depth': 1},
    {'rel': 'aplikace/energy-dashboard.html',   'theme': 'smart-home','title': 'Energy Dashboard — Moje aplikace — Luděk', 'depth': 1},
    {'rel': 'aplikace/rpi-kiosk.html',          'theme': 'smart-home','title': 'Domácí panel na zdi — Moje aplikace — Luděk', 'depth': 1},
    {'rel': 'aplikace/ridic-turnusy-mzdy.html', 'theme': 'home', 'title': 'Práce řidiče — Moje aplikace — Luděk',          'depth': 1},
    {'rel': 'en/aplikace/index.html',            'theme': 'home', 'title': 'My apps — Luděk',                              'depth': 2},
    {'rel': 'en/aplikace/config-center.html',    'theme': 'home', 'title': 'Config Center — My apps — Luděk',              'depth': 2},
    {'rel': 'en/aplikace/italia-travel.html',    'theme': 'italy','title': 'Italia Travel Planner — My apps — Luděk',       'depth': 2},
    {'rel': 'en/aplikace/ucetni-kniha.html',     'theme': 'finance','title': 'Ledger — My apps — Luděk',                    'depth': 2},
    {'rel': 'en/aplikace/finance-analytik.html', 'theme': 'finance','title': 'Finance Analyst — My apps — Luděk',           'depth': 2},
    {'rel': 'en/aplikace/krabickova-dieta.html', 'theme': 'home', 'title': 'Meal Planner — My apps — Luděk',                'depth': 2},
    {'rel': 'en/aplikace/energy-dashboard.html', 'theme': 'smart-home','title': 'Energy Dashboard — My apps — Luděk',         'depth': 2},
    {'rel': 'en/aplikace/rpi-kiosk.html',        'theme': 'smart-home','title': 'Home wall panel — My apps — Luděk',          'depth': 2},
    {'rel': 'en/aplikace/ridic-turnusy-mzdy.html','theme': 'home', 'title': 'Driver work — My apps — Luděk',                 'depth': 2},
    {'rel': 'it/aplikace/index.html',            'theme': 'home', 'title': 'Le mie app — Luděk',                            'depth': 2},
    {'rel': 'it/aplikace/config-center.html',    'theme': 'home', 'title': 'Config Center — Le mie app — Luděk',            'depth': 2},
    {'rel': 'it/aplikace/italia-travel.html',    'theme': 'italy','title': 'Italia Travel Planner — Le mie app — Luděk',    'depth': 2},
    {'rel': 'it/aplikace/ucetni-kniha.html',     'theme': 'finance','title': 'Libro contabile — Le mie app — Luděk',        'depth': 2},
    {'rel': 'it/aplikace/finance-analytik.html', 'theme': 'finance','title': 'Finance Analyst — Le mie app — Luděk',        'depth': 2},
    {'rel': 'it/aplikace/krabickova-dieta.html', 'theme': 'home', 'title': 'Meal Planner — Le mie app — Luděk',             'depth': 2},
    {'rel': 'it/aplikace/energy-dashboard.html', 'theme': 'smart-home','title': 'Energy Dashboard — Le mie app — Luděk',      'depth': 2},
    {'rel': 'it/aplikace/rpi-kiosk.html',        'theme': 'smart-home','title': 'Pannello a muro — Le mie app — Luděk',       'depth': 2},
    {'rel': 'it/aplikace/ridic-turnusy-mzdy.html','theme': 'home', 'title': 'Lavoro autista — Le mie app — Luděk',           'depth': 2},
]

# ─── NAV ITEMS (single nav for all pages) ────────────────────
# href is depth-prefixed at render time.
NAV = [
    ('Domů',       ''),
    ('Moje aplikace', 'aplikace/'),
    ('Finance',    'finance/'),
    ('Cestování',  'cestovani/'),
    ('Itálie',     'cestovani/italie/'),
    ('Rybaření',   'zaliby/rybareni/'),
    ('Smart Home', 'smart-home/'),
    ('AI',         'ai.html'),
]

# Smart Home external link (in footer / extra)
SMART_HOME_EXT = 'https://bludek69-lgtm.github.io/smart-home-website/'
YOUTUBE = 'https://www.youtube.com/@cestovatel69'


def build_prefix(depth: int) -> str:
    """Return '' or '../' or '../../' depending on file depth."""
    return '../' * depth


def render_nav(depth: int, current_rel: str) -> str:
    pfx = build_prefix(depth)
    items = []
    for label, href in NAV:
        full_href = pfx + href if href else (pfx or './')
        # determine current
        # current_rel is like 'index.html' or 'finance/index.html'
        is_current = False
        if href == '' and current_rel == 'index.html':
            is_current = True
        elif href and current_rel.startswith(href):
            # 'cestovani/' matches 'cestovani/index.html' AND 'cestovani/italie/index.html'
            # Itálie has its own nav item ('cestovani/italie/'), so prefer the most specific match
            # Find the LONGEST matching href
            longest = max((h for _, h in NAV if h and current_rel.startswith(h)), key=len, default='')
            is_current = (href == longest)
        cur_attr = ' aria-current="page"' if is_current else ''
        items.append(f'    <a href="{full_href}"{cur_attr}>{label}</a>')
    return '\n'.join(items)


# Výchozí trailing (po </footer>) — main.js + lightbox. Použije se JEN jako fallback,
# když živá stránka nemá vlastní obsah za </footer> (běžně ho má → bere se verbatim přes
# body_post). Normální string (single braces), js cesta přes placeholder __JS__.
DEFAULT_TRAILING = """

<script src="__JS__"></script>

<!-- Lightbox: click any main img to zoom. Aplikuje se na všech stránkách. -->
<style>
#__lb { display:none; position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,0.93); cursor:zoom-out; align-items:center; justify-content:center; padding:2vh }
#__lb.open { display:flex }
#__lb img { max-width:100%; max-height:96vh; object-fit:contain; box-shadow:0 8px 40px rgba(0,0,0,0.6); border-radius:8px }
#__lb .__lbhint { position:absolute; bottom:1rem; left:50%; transform:translateX(-50%); color:rgba(255,255,255,0.6); font:13px/1 system-ui,sans-serif }
main img { cursor:zoom-in; transition:transform .15s ease }
main img:hover { transform:scale(1.005) }
</style>
<div id="__lb" role="dialog" aria-modal="true" aria-label="Zvětšený obrázek">
  <img id="__lbimg" alt="">
  <span class="__lbhint">Klikni nebo stiskni ESC pro zavření</span>
</div>
<script>
(function(){
  var lb = document.getElementById('__lb');
  var lbimg = document.getElementById('__lbimg');
  function open(src, alt){ lbimg.src = src; lbimg.alt = alt || ''; lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close(){ lb.classList.remove('open'); lbimg.src = ''; document.body.style.overflow = ''; }
  lb.addEventListener('click', close);
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') close(); });
  document.querySelectorAll('main img').forEach(function(img){
    img.addEventListener('click', function(e){ e.stopPropagation(); open(img.src, img.alt); });
  });
})();
</script>
"""


def page_lang(rel: str) -> str:
    """Jazyk stránky podle cesty (en/… → en, it/… → it, jinak cs)."""
    if rel.startswith('en/'):
        return 'en'
    if rel.startswith('it/'):
        return 'it'
    return 'cs'


def render_template(page: dict, main_html: str, header_extra: str = '\n    ',
                    body_pre: str = '\n\n', body_post: str | None = None,
                    live_title: str | None = None, seo_head: str = '') -> str:
    pfx = build_prefix(page['depth'])
    nav_html = render_nav(page['depth'], page['rel'])
    css_href = pfx + 'assets/css/style.css'
    js_src = pfx + 'assets/js/main.js'
    lang = page_lang(page['rel'])
    kontakt_label = {'en': 'Contact', 'it': 'Contatti'}.get(lang, 'Kontakt')

    # Optional page-specific CSS (per-page extra_css field)
    extra_css_link = ''
    extra_css = page.get('extra_css')
    if extra_css:
        extra_css_link = f'\n  <link rel="stylesheet" href="{pfx + extra_css}">'

    # SEO HEAD POLITIKA (2026-06-12): title + description + canonical + hreflang + og:*
    # se berou VERBATIM z živé stránky (extract_seo_head) — builder je NEgeneruje a NEpřepisuje.
    # Fallbacky níže platí jen pro novou stránku bez SEO bloku.
    title = live_title if live_title else page['title']
    if not seo_head:
        seo_head = ('  <meta name="description" content="Osobní web Luďka — řidič, cestovatel, '
                    'milovník Itálie, technologií a chytré domácnosti.">\n')

    # page-specific obsah za </footer> (lightbox / per-page skripty / vývojový deník) —
    # verbatim z živé stránky; fallback na výchozí shell, pokud chybí.
    trailing = body_post if body_post is not None else DEFAULT_TRAILING.replace('__JS__', js_src)

    return f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
{seo_head}  <link rel="stylesheet" href="{css_href}">{extra_css_link}
  <link rel="icon" href="/favicon.ico">
</head>
<body class="theme-{page['theme']}">

<header class="site-header">
  <div class="site-header__inner">
    <a href="{pfx or './'}" class="brand">
      <span class="brand-dot"></span>
      Luděk
    </a>{header_extra}<button class="nav-toggle" aria-label="Otevřít menu" aria-expanded="false">☰</button>
    <nav class="nav" aria-label="Hlavní navigace">
{nav_html}
    </nav>
  </div>
</header>

<main id="main">
{main_html}
</main>{body_pre}<footer class="site-footer">
  <div class="site-footer__inner">
    <div>© Budinský Luděk · Osobní web</div>
    <div class="footer-links">
      <a href="{YOUTUBE}" target="_blank" rel="noopener">YouTube @cestovatel69</a>
      <a href="https://github.com/bludek69-lgtm" target="_blank" rel="noopener">GitHub</a>
      <a href="/smart-home/kontakt.html">{kontakt_label}</a>
      <a href="{pfx}smart-home/">Smart Home web</a>
    </div>
  </div>
</footer>{trailing}</body>
</html>
"""


def extract_main(content: str) -> str | None:
    """Extract content of <main id="main">...</main>. Returns None if not found."""
    m = re.search(r'<main[^>]*id=["\']main["\'][^>]*>(.*?)</main>', content, re.DOTALL | re.IGNORECASE)
    if not m:
        return None
    return m.group(1).strip('\n')


def extract_header_extra(content: str) -> str:
    """Zachová obsah mezi brand odkazem (</a>) a tlačítkem nav-toggle — typicky
    jazykový přepínač (<div class="lang-switcher">…). Přepínač je do živých stránek
    vkládán samostatným patch skriptem s per-page/per-jazyk URL logikou (i ručně
    upravený, např. ridic), proto ho NEREGENERUJEME — bereme ho verbatim z živého HTML,
    aby rebuild lang-switcher neodebral ani nezměnil. Bez přepínače vrací '\\n    '
    (zachová původní formátování </a>\\n    <button)."""
    m = re.search(r'class="brand"[\s\S]*?</a>([\s\S]*?)<button class="nav-toggle"', content)
    return m.group(1) if m else '\n    '


def extract_body_extra(content: str):
    """Zachová page-specific obsah MIMO <main> z živé stránky, aby ho rebuild neztratil:
      • body_pre  = vše mezi </main> a <footer  (např. vývojový deník / per-page lightbox / styl),
      • body_post = vše mezi </footer> a </body> (trailing skripty, lightbox, deník za patičkou).
    Footer (shell) se NEbere — ten render_template generuje znovu (sync ©). Nic se neduplikuje:
    body_pre končí těsně před <footer>, body_post začíná těsně za </footer>.
    Vrací (body_pre, body_post). Když chybí </main>/</footer>, vrací rozumný default
    ('\\n\\n', None) → render_template použije výchozí trailing shell."""
    mpre = re.search(r'</main>(.*?)<footer', content, re.DOTALL | re.IGNORECASE)
    body_pre = mpre.group(1) if mpre else '\n\n'
    mpost = re.search(r'</footer>(.*?)</body>', content, re.DOTALL | re.IGNORECASE)
    body_post = mpost.group(1) if mpost else None
    return body_pre, body_post


def extract_seo_head(content: str):
    """Zachová SEO head tagy z živé stránky (politika 2026-06-12: live HTML = zdroj pravdy
    pro SEO; tagy vkládal _go4_seo_patch.py / ruční úpravy a rebuild je NESMÍ ztratit):
      • <title> (verbatim — PAGES['title'] je jen fallback pro novou stránku),
      • meta description, link canonical, link rel=alternate hreflang, meta property og:*.
    Vrací (live_title|None, seo_head_block_str)."""
    mt = re.search(r'<title>(.*?)</title>', content, re.DOTALL)
    live_title = mt.group(1).strip() if mt else None
    tags = []
    m = re.search(r'<meta\s+name="description"[^>]*>', content)
    if m:
        tags.append(m.group(0))
    for pat in (r'<link\s+rel="canonical"[^>]*>',
                r'<link\s+rel="alternate"\s+hreflang[^>]*>',
                r'<meta\s+property="og:[^"]+"[^>]*>'):
        tags.extend(re.findall(pat, content))
    seo_head = ''.join(f'  {t}\n' for t in tags)
    return live_title, seo_head


def build_one(page: dict) -> str:
    path = ROOT / page['rel']
    if not path.exists():
        return f"  ⚠ SKIP {page['rel']} — neexistuje (vytvořit ručně)"
    src = path.read_text(encoding='utf-8')
    main_html = extract_main(src)
    if main_html is None:
        return f"  ⚠ SKIP {page['rel']} — chybí <main id=\"main\">...</main> block"
    header_extra = extract_header_extra(src)  # zachová lang-switcher z živého HTML
    body_pre, body_post = extract_body_extra(src)  # zachová page-specific obsah mimo <main>
    live_title, seo_head = extract_seo_head(src)  # zachová SEO head z živého HTML
    rendered = render_template(page, main_html, header_extra, body_pre, body_post,
                               live_title, seo_head)
    # BOM politika: zachovat stav zdrojové stránky — když měla UTF-8 BOM, výstup ho má taky;
    # když ne, nepřidávat. (render_template začíná <!DOCTYPE bez BOM.)
    if src.startswith('﻿'):  # UTF-8 BOM
        rendered = '﻿' + rendered
    path.write_text(rendered, encoding='utf-8')
    return f"  ✓ {page['rel']} ({len(rendered)} chars)"


def main():
    print('═══ Osobní web — page builder ═══\n')
    for page in PAGES:
        print(build_one(page))
    print('\n✓ done')


if __name__ == '__main__':
    main()
