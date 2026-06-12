# osobni / cestovatel69.cz / aplikace — UPDATE_AND_GITHUB_CONTEXT

> Datum: 2026-06-07. Docs-only. **VEŘEJNÁ vrstva.** Globál: `C:\.Projekt\_GLOBAL_UPDATE_GITHUB_CONTEXT.md`.
> Root: `C:\Users\lbudi\code\osobni` (git repo → `bludek69-lgtm.github.io/osobni/`, doména cestovatel69.cz).

- **GitHub:** ANO (`bludek69-lgtm/osobni`). **GitHub Pages:** ANO (hostuje web + download stránky).
- **GitHub Actions:** NEEDS_REVIEW (Pages build).
- **Updater (hostovaný):** osobni **hostí release metadata** ostatních appek: `aplikace/<projekt>.html` (download) + `aplikace/<projekt>-version.json` (version endpointy). Vlastní `version.json` pro web.
- **latest.json:** sdílené je v repu `bludek69-lgtm/aplikace` (ne přímo zde); zde jsou `*-version.json` endpointy + download HTML.
- **version.json:** ANO (web + per-app endpointy).
- **Source of truth verze:** per-app (zrcadlí se sem z příslušného projektu při releasu).
- **Release artefakty:** download stránky + odkazy na Setup.exe/APK (skutečné binárky v repu `aplikace`).
- **Co se NESMÍ měnit bez release GO:** download stránky, `*-version.json` endpointy, app collection metadata, jakýkoli HTML s verzemi/odkazy.
- **WATCH:** je to veřejné → **žádná PII, tokeny, hesla, soukromé cesty, instalační hesla** v HTML/commitech.

## Secret / API / Update Context
Před prací s download stránkami / version endpointy / app collection metadaty číst `SECRET_ROTATION_CONTEXT.md`, tento soubor a globální soubory. Bez GO: žádná změna release/version metadat, žádný commit/push. **Nikdy** PII/tokeny/hesla do veřejného webu.
