# Analytics na cestovatel69.cz

Založeno 16. 11. 2026 po výslovném potvrzení uživatele k přijetí českých podmínek
Google Analytics a podmínek zpracování dat GDPR.

- Účet: Cestovatel69 (416399643).
- Služba: cestovatel69.cz (564368691), Česko / Europe/Prague, CZK.
- Stream: Cestovatel69 – web, https://cestovatel69.cz, 16351996527.
- ID měření: G-BM11EHQG00. Jde o veřejné ID, nikoli tajný klíč.
- Volitelné sdílení účtu vypnuto; vylepšené automatické měření vypnuto.
- Retence ověřená v UI: události 2 měsíce, uživatelská data 14 měsíců,
  reset při nové aktivitě zapnut. Souhrnné přehledy mají odlišné uchování.

## Implementace

`assets/js/analytics-consent.js` se načítá z obou sdílených JS souborů:
`assets/js/main.js` a `smart-home/script.js`. Duplicitní spuštění je blokované.
Zdrojové a mapové přehledy také používají stejný souhlasový skript, aby byly zachyceny příchody přes odkazy z YouTube.
Ukázkové aplikace v `/demo/` jsou z instalace vynechány.

Samostatné obsahové stránky bez společné šablony (přehled pracovních tras a
novinky z 31. 10. a 2. 11.) používají přímo stejný souhlasový skript. Kompletní
hardware Smart Home používá `smart-home/script.js`, který zajišťuje i mobilní
menu a rok v patičce. Kontrola `python audit_site_analytics.py` prověří všechny
sledované veřejné HTML soubory, nejen sitemap, a selže při chybějícím měření
nebo nepodmíněně vloženém Google tagu. Výsledky auditu: ANALYTICS_AUDIT_20261116.md.

Zvolen basic consent mode: do udělení souhlasu žádný Google tag ani analytický
požadavek. Povolení a odmítnutí mají rovnocenná tlačítka. Volba se uchovává
180 dní v localStorage; v patičce je Nastavení soukromí a odkaz na /soukromi/.
Při odvolání se nastaví ga-disable, odešle změna dříve uděleného souhlasu
a odstraní vlastní _ga cookies. Reklamní consent je vždy denied.

Google se načítá pouze na skutečné doméně cestovatel69.cz a www variantě.
Místní náhled umožňuje testovat UI, ale neposílá testovací návštěvy do produkce.

Události:

- page_view: URL a referrer bez query/fragmentu, název stránky.
- video_play_click: kliknutí na tlačítko přehrání, validované ID videa.
- youtube_click: přechod na YouTube, ID videa nebo označení channel.

Kliknutí na přehrání není důkaz přehrání ani délky sledování. Nezapínat formuláře
ani automatický sběr vyhledávacích dotazů bez samostatného posouzení obsahu.
AdSense tímto není aktivováno a nejde o Googlem certifikovanou CMP pro reklamy.

## Ověření před nasazením

Chrome: nepřítomný Google tag před volbou; odmítnutí se pamatuje po reloadu;
povolení a odvolání fungují; anglické ovládání i samostatná Smart Home stránka
mají právě jeden panel. Mobil 390 px bez přetékání, obě volby mají stejnou
výšku a plochu. Syntaxe JS a interní odkazy kontrolovány samostatně.

Dokumentace: https://developers.google.com/tag-platform/security/guides/consent

## Příchody z jednotlivých videí YouTube

Od 16. 11. 2026 používají odkazy v popisech parametr `utm_source=youtube`,
`utm_medium=organic_video`, `utm_campaign=<čitelný název>` a `utm_content=<ID videa>`.
Registr `_data/youtube-campaigns.json` obsahuje ověřená ID, názvy a označení
100 aktuálních videí (49 hlavních, 51 Shorts). Při dalším videu doplň registr
a spusť `python _build_youtube_campaigns.py`. Samotný text URL v popisu Shortu
YouTube běžně nečiní klikacím; funkce souvisejícího videa zůstává zachovaná.

Měření přijme jen přesnou kombinaci z registru. `page_location` i referrer
zůstávají bez query a fragmentu; ověřená kampaň se předá explicitně přes
`campaign_source`, `campaign_medium`, `campaign_name`, `campaign_content`.
Po povolení se kromě `page_view` pošle `youtube_arrival` s parametry `video_id`,
`source_video` (veřejný název, nejvýše 100 znaků), `page_location`, `page_title`.
Před souhlasem ani při odmítnutí se tyto údaje Googlu neposílají.
Žádné nové úložiště se nezavádí. Následující návštěvy stránek se přiřazují
ke kampani standardní relací GA4; `youtube_arrival` označuje přímé otevření
vydaného odkazu a není počtem zhlédnutí na YouTube ani důkazem kliknutí.

Kontroly: `node test_youtube_attribution.cjs`, `node --check assets/js/analytics-consent.js`,
`python audit_site_analytics.py`. Celkem 588 obsahových a referenčních HTML
s měřením, 8 přesměrování, 1 noindex a 1 demo mimo měření. Předchozí audit
519+69 popisuje stav před tímto rozšířením.

Dokumentace Google: https://developers.google.com/analytics/devguides/collection/ga4/reference/config
