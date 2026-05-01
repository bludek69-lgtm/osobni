# Osobní web — Luděk

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

- Smart Home web: https://bludek69-lgtm.github.io/smart-home-website/
- YouTube: https://www.youtube.com/@cestovatel69

## Pravidla

- **Smart Home web NEPŘEPISOVAT** — jen odkaz z lokálního rozcestníku
- **Finance** — povinné upozornění "Nejde o investiční doporučení"
- **Foto originály** v `C:\PROJEK_WEB\DATA\Foto_cestovaní\` — NEMAZAT, jen kopírovat do `photos/`
