# osobni / cestovatel69.cz / aplikace — SECRET_ROTATION_CONTEXT

> Datum: 2026-06-07. Docs-only. **VEŘEJNÁ vrstva.** Žádné hodnoty secretů. Globál: `_SECRET_INVENTORY/SECRET_INVENTORY.md`.

- **Typy secrets/API:** v zásadě **žádné** mají být v tomto repu (je veřejné). Případné Cloudflare/DNS/Pages nastavení = mimo repo.
- **Bezpečné uložení:** nic citlivého do repa; secrets patří do příslušných appek, ne sem.
- **NESMÍ do repa/reportu/ZIPu (ani do HTML/commitů):** PII, jména, e-maily, soukromé cestovní plány, tokeny, API klíče, **instalační hesla** (nikdy do HTML ani do e-mailu), čísla účtů.
- **Po rotaci důležité:** ověřit, že žádný secret/installer heslo neuniklo do veřejných HTML/version endpointů; download stránky odkazují jen na binárky, ne na hesla.
- **Další agent NESMÍ bez GO:** měnit download/version/app-collection metadata, commit/push, vkládat cokoli citlivého.
- **Budoucí změna secretů:** netýká se tohoto repa (veřejné); secrets řešit v příslušné appce.
- **NEEDS_REVIEW:** zkontrolovat, zda historické HTML/commit neobsahují PII/instalační heslo (pokud ano → samostatný secret-hygiene GO).

## Secret / API / Update Context
Viz `UPDATE_AND_GITHUB_CONTEXT.md` + globální soubory. Veřejná vrstva — nikdy PII/tokeny/hesla. Bez GO žádná změna release/version metadat ani commit/push.
