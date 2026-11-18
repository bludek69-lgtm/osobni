# Obsah a příprava AdSense – 18. listopadu 2026

Žádost o kontrolu webu nebyla odeslána. Tento dokument není potvrzení schválení.

## Co lze o příčině říci

AdSense uvádí obecný důvod „Obsah nízké hodnoty“, bez seznamu konkrétních URL.
Řádek webu byl naposledy aktualizován 8. 11. 2026, tedy před přidáním současného
cestovatelského blogu. Není to důkaz nového zamítnutí těchto článků.

Při vlastní kontrole byly nalezeny stručné přehledy míst, obecné rady v některých
článcích a nedostatečné propojení článků s existujícím vlastním fotoarchivem.
Jde o redakční zjištění, ne o neveřejné vysvětlení algoritmu Googlu. Krátký text
sám o sobě není porušení; důležitý je účel a přínos stránky.

## Provedené změny

- Osm článků má konkrétní návrhy plánování návštěvy: Pisa, Pompeje, Vesuv,
  Benátky, muzea Ferrari, Siena, Montepulciano a Neapol. Nové praktické údaje
  o dopravě a provozu odkazují na oficiální správce a mají datum kontroly.
- Dvanáct článků je přímo doplněno vlastní fotografií z existujícího veřejného
  archivu a odkazem do příslušného alba. Nepřidávaly se smyšlené zážitky.
- U všech 30 cestovatelských článků je uveden autor a kontakt pro opravy.
- O autorovi obsahuje postup tvorby obsahu a veřejný kontakt, schválený vlastníkem.
  Patičky obsahových stránek zpřístupňují soukromí a kontakt i bez JavaScriptu.
- Doplnění jsou v češtině, angličtině a italštině. Smart Home zůstává samostatný.
- Čtyři krátké přehledy italských míst odkazují na podrobnější článek a vlastní video.
- AdSense se nenačítá na zdrojových/licenčních a mapových přehledech, ukázkách,
  chybových a starých přesměrovacích stránkách, soukromí, stránce autora,
  základních rozcestnících a stručných rozcestnících míst/regionů. Samostatný
  analytický souhlas a měření příchodů z YouTube zůstávají zachovány.
- Vývojové reporty a testy jsou vyloučené z publikování GitHub Pages.
- Opraveno šest chybných cest ke sdílenému skriptu v EN/IT přesměrováních aplikací.
  Verze aplikací ani instalační odkazy se neměnily.

## Údržba

Obsah doplnění: `_data/blog/visit-notes.json`. Fotografie se berou výhradně
z vyjmenovaných existujících osobních alb, včetně přeložených popisků.
Po změně generovaných stránek spustit `python _content_quality.py`, pak
`python _build_site_search_index.py`. Generátory blogu a jazykového webu
mají doplnění zapojené. Skript je opakovatelný bez duplikování bloků.
`python _audit_adsense_quality.py` kontroluje skutečné výstupy a místní odkazy.

## Ověření a omezení

- 935 HTML souborů, 912 URL v sitemapě, 40 567 místních odkazů/odkazů na soubory:
  bez chybějících místních cílů a kotev mimo vnitřek ukázkových aplikací.
- 90 jazykových verzí článků: video, autor, kontakt a soukromí přítomné.
- Funkční test 112 vydaných YouTube odkazů, oddělených souhlasů, výchozího odmítnutí
  a vyloučení AdSense na pomocných obrazovkách. Syntaxe JS/Python ověřena.
- Analytics audit: 909 obsahových stránek pokrytých; 9 noindex, 14 přesměrování,
  3 ukázkové aplikace rozlišeny podle jejich účelu.
- Kontrola úniků interních údajů prošla. Test opraven, aby nezaměňoval odkazy
  na oficiální docs.github.com s odkazem na osobní GitHub účet; zachována
  konkrétní povinná autorství knihovny a mapových dat.
- Sitemap test používá XML parser, aby nepřeskakoval platné URL bez nepovinného
  lastmod. Datum publikace článků se neměnilo.

Zbývá rozhodnutí Googlu o aktuálním obsahu. Nelze garantovat schválení počtem
slov, stránek ani technickým testem. Stav ads.txt v účtu čekal na aktualizaci,
přestože živý soubor odpovídal 200 a obsahoval správné ID. Zveřejněná konfigurace
Google CMP je propojena, ale její skutečný dialog nebyl při předchozím testu
Googlem doručen. Přijetí/odmítnutí reklamy proto ještě nelze označit za otestované.
Automatické reklamy ani nová žádost o schválení nebyly při této práci zapnuty.

Primární pokyny:
- https://support.google.com/adsense/answer/7299563
- https://support.google.com/adsense/answer/81904
- https://support.google.com/publisherpolicies/answer/11112688
