# Příchody z videí YouTube – dokončení 16. 11. 2026

## Výsledek

- Správný kanál cestovatel69 ověřen v přihlášeném YouTube Studiu.
- Prošlo všech 100 současných záznamů: 49 hlavních videí a 51 Shorts.
- Uloženo a ověřeno 199 označených odkazů na cestovatel69.cz.
- U 13 Shorts doplněn odkaz na odpovídající existující cestovatelský článek.
- Hlavní video a Short Italia Travel Planner dosud neměly odkaz na web;
  přidán odkaz na existující `/aplikace/italia-travel.html`.
- Původní texty, kapitoly, odkazy na licence a externí odkazy zachovány.
  Viditelnost, plán publikace, miniatury a související videa se neměnily.
- Původní popisy všech 100 videí jsou mimo repozitář v souboru
  `../youtube-utm-popisy-pred.json`; výsledkový journal je
  `../youtube-utm-vysledky.json`. Soukromé zálohy se nepublikují.

## Analytics

Měření webu nasazeno commitem `06df7ea73efa5fc68378dd2ec21a9f038037c981`;
GitHub Pages potvrzen jako `built`, bez chyby.

Přidána vlastní dimenze **Zdrojové video YouTube**, rozsah událost,
parametr `source_video`. Dřívější **Video YouTube** zůstává ID videa `video_id`.

Uložený průzkum **YouTube → články a stránky**, karta **Příchody na web**:

https://analytics.google.com/analytics/web/#/analysis/a416399643p564368691/edit/um8FO5qNQNGzNItyTYQsOw

- Řádky: Zdrojové video YouTube, Trasa stránky a třída obrazovky.
- Hodnoty: Počet uživatelů, Počet událostí.
- Filtr: Název události přesně odpovídá `youtube_arrival`.
- Výchozí období: tento měsíc. Lze přepnout na požadovaný rozsah.
- Uložení názvu, tabulky, filtru a období ověřeno opětovným načtením stránky.

Počet uživatelů znamená měřené lidi; počet událostí znamená otevření označených
odkazů s uděleným souhlasem. Přehled obsahuje články i další cílové stránky.
Vlastní dimenze a běžné přehledy potřebují čas na zpracování; při dokončení
byl uložený průzkum ještě bez dat. Nejde o statistiky před zavedením měření.

## Ověření

- Na živém označeném odkazu k Hoslovickému mlýnu: při odmítnutí nula Google
  tagů; po povolení správné ID zdrojového videa a callback `youtube_arrival`.
- Přímo v GA4 Realtime přijata jedna událost `youtube_arrival`.
  Parametr `source_video` obsahoval správný veřejný název Hoslovického mlýna,
  `page_location` přesně `https://cestovatel69.cz/blog/hoslovicky-mlyn/`, bez
  parametrů. Potvrzeny i klíče `video_id`, `page_title`.
- Testovací prohlížeč vrácen na odmítnutí; po reloadu nula Google tagů.
- Po novém otevření editoru Hoslovic ověřen trvale uložený označený odkaz.
- Všech 96 rozdílných původních cílů na vlastním webu existuje v repozitáři.
- `node test_youtube_attribution.cjs`: PASS pro všech 100 vydaných označení,
  souhlas/odmítnutí, neplatné kampaně, ochranu parametrů, duplicity a localhost.
- `node --check assets/js/analytics-consent.js`: PASS.
- `python audit_site_analytics.py`: PASS, 588 obsahových/referenčních HTML,
  8 přesměrování, 1 noindex a 1 demo mimo měření. Žádný nepodmíněný Google tag.

Textové odkazy v popisech Shorts YouTube běžně nejsou klikací. Označení funguje
při otevření/kopírování adresy; běžná cesta ze Shortu vede přes související hlavní
video a jeho klikací popis. Statistiky zahrnují jen povolené měření, mohou být
ovlivněny blokováním, přeposláním označeného odkazu a opakovaným otevřením.

Budoucí videa: doplnit `_data/youtube-campaigns.json`, spustit
`python _build_youtube_campaigns.py`, nasadit registr a použít stejné UTM
schéma. Nahodilé nevydané UTM hodnoty se do měření nepřijímají.
