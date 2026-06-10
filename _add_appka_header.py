"""Doplní horní navigační lištu (site-header) na stránky sekce Moje aplikace.

Aplikační stránky (aplikace/*.html, en/aplikace/*.html, it/aplikace/*.html) historicky
neměly horní lištu webu jako zbytek stránek. Tenhle skript ji idempotentně vloží
hned za <body…> (před <main>), depth-aware prefixy, + přilinkuje main.js (mobilní nav-toggle).
Spuštění z osobni rootu:  py -3 _add_appka_header.py
"""
from __future__ import annotations
import io, re, sys
from pathlib import Path

try:
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
except Exception:
    pass

ROOT = Path(__file__).resolve().parent

NAV = [
    ("Domů", ""),
    ("Moje aplikace", "aplikace/"),
    ("Finance", "finance/"),
    ("Cestování", "cestovani/"),
    ("Itálie", "cestovani/italie/"),
    ("Rybaření", "zaliby/rybareni/"),
    ("Smart Home", "smart-home/"),
    ("AI", "ai.html"),
]


def header_html(depth: int) -> str:
    pfx = "../" * depth
    links = []
    for label, href in NAV:
        full = (pfx + href) if href else (pfx or "./")
        cur = ' aria-current="page"' if href == "aplikace/" else ""
        links.append(f'      <a href="{full}"{cur}>{label}</a>')
    nav = "\n".join(links)
    return (
        '<header class="site-header">\n'
        '  <div class="site-header__inner">\n'
        f'    <a href="{pfx or "./"}" class="brand">\n'
        '      <span class="brand-dot"></span>\n'
        '      Luděk\n'
        '    </a><button class="nav-toggle" aria-label="Otevřít menu" aria-expanded="false">☰</button>\n'
        '    <nav class="nav" aria-label="Hlavní navigace">\n'
        f"{nav}\n"
        "    </nav>\n"
        "  </div>\n"
        "</header>\n"
    )


def targets() -> list[Path]:
    out: list[Path] = []
    for sub in ["aplikace", "en/aplikace", "it/aplikace"]:
        d = ROOT / sub
        if d.is_dir():
            out += sorted(d.glob("*.html"))
    return out


def depth_of(p: Path) -> int:
    # počet adresářů mezi rootem a souborem (aplikace/x.html = 1, en/aplikace/x.html = 2)
    return len(p.relative_to(ROOT).parts) - 1


def main() -> int:
    changed = 0
    for f in targets():
        html = f.read_text(encoding="utf-8")
        if 'class="site-header"' in html:
            continue  # už má lištu — idempotence
        m = re.search(r"(<body[^>]*>)", html, re.IGNORECASE)
        if not m:
            print(f"SKIP (bez <body>): {f}")
            continue
        depth = depth_of(f)
        hdr = header_html(depth)
        # vlož header hned za <body…>
        html = html[: m.end()] + "\n" + hdr + html[m.end():]
        # main.js před </body> (kvůli mobilnímu nav-toggle), jen pokud chybí
        if "assets/js/main.js" not in html:
            pfx = "../" * depth
            script = f'<script src="{pfx}assets/js/main.js"></script>\n'
            html = re.sub(r"</body>", script + "</body>", html, count=1, flags=re.IGNORECASE)
        f.write_text(html, encoding="utf-8")
        print(f"+ lišta: {f.relative_to(ROOT)}")
        changed += 1
    print(f"\nHotovo — upraveno {changed} souborů.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
