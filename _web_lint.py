#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
_web_lint.py — kontrola jednotnosti app-stránek webového hubu (cestovatel69.cz).

Hlídá invarianty, které dřív "driftovaly" (každá stránka jiná):
  1) stránka načítá sdílený assets/js/main.js  -> tím dostane lightbox + nav + theme zdarma
  2) má <main> wrapper                          -> lightbox (main img) + sémantika
  3) má navigaci (.nav nebo .site-header)
  4) má patičku (<footer>)
  5) VŠECHNY lokální obrázky (img src/href .png/.jpg/.webp) reálně existují na disku

Spuštění:   python _web_lint.py            (jen aplikace/*.html)
            python _web_lint.py --all      (+ en/aplikace, it/aplikace)
Návrat: 0 = vše OK, 1 = nalezen drift (vhodné pro CI / pre-deploy gate).
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DIRS = [ROOT / "aplikace"]
if "--all" in sys.argv:
    DIRS += [ROOT / "en" / "aplikace", ROOT / "it" / "aplikace"]

IMG_RE = re.compile(r'(?:src|href)\s*=\s*["\']([^"\']+\.(?:png|jpe?g|webp))["\']', re.I)


def resolve_ref(html_path: Path, ref: str) -> Path:
    """Resolvuje relativní odkaz JAKO PROHLÍŽEČ — `..` klampuje na kořen webu (ROOT),
    nejde nad něj (na rozdíl od Path.resolve, který by spadl mimo osobni/)."""
    page_dir = html_path.parent.relative_to(ROOT).as_posix()
    segs = [] if page_dir == "." else page_dir.split("/")
    if ref.startswith("/"):
        segs = []  # absolutní od root webu
    for part in ref.split("/"):
        if part in ("", "."):
            continue
        if part == "..":
            if segs:
                segs.pop()           # klamp na root (chování prohlížeče)
        else:
            segs.append(part)
    return ROOT.joinpath(*segs)


REDIRECT_RE = re.compile(r'location\.(?:replace|href)|http-equiv\s*=\s*["\']refresh', re.I)


def check_page(html_path: Path) -> list[str] | None:
    """Vrátí seznam problémů (prázdný = OK), nebo None pro redirect-stub (přeskočit)."""
    txt = html_path.read_text(encoding="utf-8", errors="replace")
    if REDIRECT_RE.search(txt):
        return None  # alias / redirect stránka — nemá smysl řešit footer/main
    problems: list[str] = []

    if "assets/js/main.js" not in txt:
        problems.append("chybí <script src=…/assets/js/main.js> (bez něj není lightbox/nav/theme)")
    if "<main" not in txt:
        problems.append("chybí <main> wrapper (lightbox cílí na 'main img')")
    if not re.search(r'class\s*=\s*["\'][^"\']*\bnav\b', txt) and "site-header" not in txt:
        problems.append("chybí navigace (.nav / .site-header)")
    if "<footer" not in txt:
        problems.append("chybí <footer>")

    # obrázky existují?
    for ref in IMG_RE.findall(txt):
        if ref.startswith(("http://", "https://", "data:", "//")):
            continue
        if not resolve_ref(html_path, ref).exists():
            problems.append(f"odkazovaný obrázek neexistuje: {ref}")

    return problems


def main() -> int:
    pages: list[Path] = []
    for d in DIRS:
        if d.exists():
            pages += sorted(d.glob("*.html"))

    fails = skipped = 0
    for p in pages:
        problems = check_page(p)
        rel = p.relative_to(ROOT)
        if problems is None:
            skipped += 1
            print(f"SKIP  {rel}  (redirect/alias)")
        elif problems:
            fails += 1
            print(f"FAIL  {rel}")
            for pr in problems:
                print(f"        - {pr}")
        else:
            print(f"OK    {rel}")

    print(f"\n{len(pages)} stránek · {fails} s problémem · {skipped} přeskočeno (redirect).")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
