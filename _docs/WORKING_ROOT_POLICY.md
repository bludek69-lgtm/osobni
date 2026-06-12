# osobni / cestovatel69.cz / aplikace — WORKING_ROOT_POLICY

> Datum: 2026-06-07. Před KAŽDOU prací čti tento soubor + `C:\.Projekt\_GLOBAL_CANONICAL_PROJECT_ROOTS.md`.

- **Canonical root (PRACUJ JEN ZDE):** `C:\Users\lbudi\code\osobni`.
- **Mimo .Projekt / VÝJIMKA:** **ANO** — git repo pro **GitHub Pages** (veřejná vrstva); výslovná výjimka.
- **NEpoužívat jako zdroj:** `*.bak*` (staré HTML), `dist`/`build`. Toto je veřejné → **žádná PII/tokeny/hesla/instalační hesla/soukromé cesty**.
- **Pravidlo:** download stránky / version endpointy / app-collection metadata měnit **jen release promptem**.

## Povinná startovací kontrola (před změnou)
1. Vypiš cwd. 2. Ověř = canonical root. 3. Ověř, že NEpracuješ s `.bak`/build. 4. Načti kontext (UPDATE_AND_GITHUB_CONTEXT.md). 5. Ověř, že nevkládáš PII/secrets. 6. Pokud root nesedí → **STOP**. Release metadata jen release promptem.
