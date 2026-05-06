# Demo — Účetní kniha v4

**Anonymizované showcase finančního dashboardu.**

Žádná reálná data. Vše vygenerováno deterministicky (seed=42) skriptem `tools/generate_demo_data.py`.

## Rychlé spuštění

### Statické (bez refresh tlačítek)
Otevři `Ucetni_kniha_v4.html` přímo v prohlížeči.

### Se serverem
```bash
cd demo
python tools/serve.py
```
Pak: http://localhost:8080/Ucetni_kniha_v4.html

## Soubory

| Soubor | Co je | Velikost |
|---|---|---|
| `Ucetni_kniha_v4.html` | Single-file dashboard s embedded demo daty | ~390 KB |
| `finance-data-v4.json` | Demo dataset (Jan Novák, fake portfolio) | ~64 KB |
| `tools/generate_demo_data.py` | Generator demo dat (deterministický, seed=42) | ~12 KB |
| `tools/serve.py` | Static HTTP server pro localhost | ~1 KB |
| `TASK_FOR_CLAUDE_CODE_web_demo.md` | Brief pro AI/copywriting o architektuře a featurách | ~12 KB |

## Re-generovat demo data

```bash
python tools/generate_demo_data.py
```

## Deploy na web (read-only)

Demo HTML je single-file → upload kamkoliv:
- GitHub Pages: commitnout do gh-pages branche
- Netlify/Vercel: drag&drop
- Vlastní hosting: jen ten jeden HTML soubor

Refresh tlačítka v dashboardu na webu **nebudou fungovat** (vyžadují localhost server) — to je OK pro showcase.

---
Verze: 1.0 | 2026-05-06
