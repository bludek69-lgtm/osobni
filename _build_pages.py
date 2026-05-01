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
        'rel':       'smart-home/index.html',
        'theme':     'smart-home',
        'title':     'Smart Home — Luděk',
        'depth':     1,
    },
]

# ─── NAV ITEMS (single nav for all pages) ────────────────────
# href is depth-prefixed at render time.
NAV = [
    ('Domů',       ''),
    ('Finance',    'finance/'),
    ('Cestování',  'cestovani/'),
    ('Itálie',     'cestovani/italie/'),
    ('Smart Home', 'smart-home/'),
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


def render_template(page: dict, main_html: str) -> str:
    pfx = build_prefix(page['depth'])
    nav_html = render_nav(page['depth'], page['rel'])
    css_href = pfx + 'assets/css/style.css'
    js_src = pfx + 'assets/js/main.js'

    return f"""<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{page['title']}</title>
  <meta name="description" content="Osobní web Luďka — řidič, cestovatel, milovník Itálie, technologií a chytré domácnosti.">
  <link rel="stylesheet" href="{css_href}">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E🏠%3C/text%3E%3C/svg%3E">
</head>
<body class="theme-{page['theme']}">

<header class="site-header">
  <div class="site-header__inner">
    <a href="{pfx or './'}" class="brand">
      <span class="brand-dot"></span>
      Luděk
    </a>
    <button class="nav-toggle" aria-label="Otevřít menu" aria-expanded="false">☰</button>
    <nav class="nav" aria-label="Hlavní navigace">
{nav_html}
    </nav>
  </div>
</header>

<main id="main">
{main_html}
</main>

<footer class="site-footer">
  <div class="site-footer__inner">
    <div>© Luděk · Osobní web</div>
    <div class="footer-links">
      <a href="{YOUTUBE}" target="_blank" rel="noopener">YouTube @cestovatel69</a>
      <a href="{SMART_HOME_EXT}" target="_blank" rel="noopener">Smart Home web</a>
    </div>
  </div>
</footer>

<script src="{js_src}"></script>
</body>
</html>
"""


def extract_main(content: str) -> str | None:
    """Extract content of <main id="main">...</main>. Returns None if not found."""
    m = re.search(r'<main[^>]*id=["\']main["\'][^>]*>(.*?)</main>', content, re.DOTALL | re.IGNORECASE)
    if not m:
        return None
    return m.group(1).strip('\n')


def build_one(page: dict) -> str:
    path = ROOT / page['rel']
    if not path.exists():
        return f"  ⚠ SKIP {page['rel']} — neexistuje (vytvořit ručně)"
    src = path.read_text(encoding='utf-8')
    main_html = extract_main(src)
    if main_html is None:
        return f"  ⚠ SKIP {page['rel']} — chybí <main id=\"main\">...</main> block"
    rendered = render_template(page, main_html)
    path.write_text(rendered, encoding='utf-8')
    return f"  ✓ {page['rel']} ({len(rendered)} chars)"


def main():
    print('═══ Osobní web — page builder ═══\n')
    for page in PAGES:
        print(build_one(page))
    print('\n✓ done')


if __name__ == '__main__':
    main()
