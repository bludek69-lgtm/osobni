# Starší cestovatelská videa – doplnění blogu

Datum: 16. 11. 2026.

## Rozsah

Ve Studiu bylo ověřeno 49 hlavních videí. Ke 12 již zpracovaným cestovatelským
videím přibylo 18 veřejných cestovatelských videí bez článku; blog nyní obsahuje
30 článků. Technická a aplikační témata i dosud nezveřejněná videa byla vynechána.

Nové slugs: vesuv, val-d-orcia-crete-senesi, rozhledna-u-borovice, turin,
spiagge-bianche, siena, saturnia-bagni-san-filippo, positano, pompeje, pisa,
petrohrad, neapol, semily-na-kruhach, montepulciano, kozakov, ferrari-muzea,
benatky, amalfi.

Texty vycházejí z názvů, kapitol a úplných uložených popisů skutečných videí.
Historické a praktické údaje byly ověřeny u odkazovaných primárních zdrojů:
UNESCO, správci památek, turistické portály obcí/regionů a provozovatelé.
Pověsti jsou odlišeny od doložených událostí; původní záznam není vydáván
za aktuální stav expozic nebo dopravy. Nové texty mají 297–370 slov.

## Změny webu

- Stejná šablona jako dosavadní články, správné video a mapa u každého článku.
- Přehrávač se načte po kliknutí; dostupný zůstává přímý odkaz na YouTube.
- Jednotné tlačítko Přečíst příběh →, související příběhy a přehled 30 karet.
- Doplněny existující karty videí v české, anglické a italské části webu.
  Nové články jsou česky; překladové karty jazyk článku výslovně uvádějí.
- Aktualizovány homepage, RSS, sitemap a index vyhledávání.
- Fotografie se nepřidávaly; původní licenční přehledy ve Zdrojích zůstávají.

## Ověření před publikováním

- 30 jedinečných ID videí a článků, 30 karet a 30 položek RSS.
- Všechny interní odkazy a kotvy v článcích existují; správné canonical a JSON-LD.
- Odkazy kapitol patří ke správnému videu a časy nepřesahují délku záznamu.
- Žádný předem načtený iframe; každý nový článek obsahuje consent loader.
- Audit Analytics: 606 obsahových stránek pokryto, 8 přesměrování, 1 noindex,
  1 demo záměrně vynechány. Žádný nepodmíněný Google skript v HTML.
- Test youtube_attribution: všech 100 registrovaných videí a kampaní prošlo,
  včetně souhlasu, deduplikace, odmítnutí nesprávné kampaně a localhostu.
- Sitemap test prošel: 528 URL odpovídá souborům. Hlášeny pouze již existující
  informační výstrahy o stránkách nezahrnutých do sitemap.
- git diff --check bez obsahových chyb.

Nové vizuální ověření v přihlášeném prohlížeči se nepodařilo dokončit:
připojení prohlížeče bylo během práce ztraceno. Náhradní Computer Use
ukončilo běh, protože nedokázalo spolehlivě určit aktuální URL prohlížeče.
Další ovládání přihlášených oken nebylo prováděno.

## Zbývající propojení z YouTube

Pro 18 hlavních videí a 18 souvisejících Shorts jsou připraveny měřené odkazy.
Každý odkaz obsahuje již vydanou kampaň a vlastní ID konkrétního videa/Shortu;
párování bylo ověřeno proti společnému mapovému odkazu v uložených popisech.

Soubor mimo veřejný repozitář:
`starsi-cestovani-youtube-pripravene-odkazy.json` ve workspace Bloger.
Stav všech 36 položek: pending_browser_reconnection. Nové odstavce v tomto
kroku zatím NEBYLY uloženy do YouTube. Po obnovení připojení nejprve načíst
a zálohovat aktuální popisy, doplnit pouze chybějící odkaz, zachovat zbytek
popisu, uložit a ověřit. Webové články již odkazují na odpovídající video.
