# Osobní web — Luděk

> Aktualizace 17. 11. 2026: web má společný redakční vzhled v CS/EN/IT.
> Aktuálním zdrojem jsou uložené HTML stránky. Nespouštějte historické
> `_build_pages.py` ani `_build_aplikace_pages.py`: přepsaly by hotový obsah.
> Níže uvedený původní popis builderu je archivní a neplatí.

Místní náhled: `python -m http.server 8924 --bind 127.0.0.1` v kořeni repozitáře.
Kontrola: `python _web_lint.py --all` a `python _build_site_search_index.py --check`.
Při změně obsahu přegenerujte vyhledávání příkazem `python _build_site_search_index.py`.
Společný vzhled definují `assets/css/editorial-preview.css` a `editorial-site.css`.
Jednorázový `_build_editorial_site.py` vyžaduje místní podklady migrace;
neslouží k běžné údržbě článků. Nahrání na větev `main` spouští GitHub Pages.

Statický web jako rozcestník na osobní sekce: Finance, Cestování, Itálie, Smart Home.

## Stack
- Plain HTML + CSS + minimal JS
- 1 `style.css` s tématickými třídami `body.theme-{home|finance|travel|italy|smart-home}`
- Idempotent builder `_build_pages.py` (čte `<main>` z každé page jako source of truth, obaluje shared header/nav/footer)
- GitHub Pages

## Struktura

```
osobni/
├── index.html                     # Domů — rozcestník
├── _build_pages.py                # idempotent wrapper
├── README.md
│
├── finance/index.html             # theme-finance (grafit + zlato)
├── cestovani/index.html           # theme-travel (béžová + mořská)
├── cestovani/italie/index.html    # theme-italy (zelená/bílá/červená/krém)
├── smart-home/index.html          # theme-smart-home (cyan + tmavá) — rozcestník na externí web
│
├── assets/
│   ├── css/style.css              # base + 5 themes
│   ├── js/main.js                 # mobile nav toggle, lazy-load
│   └── images/                    # placeholdery + ikony
│
└── photos/                        # postupně doplňovat z DATA/Foto_web_roztříděno
```

## Build

```bash
py -3.14 _build_pages.py
```

Idempotentní — projde všechny stránky, extrahuje `<main>` block, znovu obalí share template (head, nav, footer). Bezpečné re-run kdykoli.

## Externí odkazy

- Smart Home web: https://cestovatel69.cz/smart-home/
- YouTube: https://www.youtube.com/@cestovatel69

## Pravidla

- **Smart Home web NEPŘEPISOVAT** — jen odkaz z lokálního rozcestníku
- **Finance** — povinné upozornění "Nejde o investiční doporučení"
- **Foto originály** v `C:\PROJEK_WEB\DATA\Foto_cestovaní\` — NEMAZAT, jen kopírovat do `photos/`
