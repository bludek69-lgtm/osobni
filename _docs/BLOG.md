# Blog Cestovatel69

Články se publikují přímo jako statické stránky na cestovatel69.cz/blog/.
Blogger ani další redakční účet nejsou potřeba.

1. Do `_data/blog/posts.json` přidat metadata a ID skutečného zveřejněného videa.
2. Text vložit do `_data/blog/<slug>.html`; uvést zdroje, autory a licence obrázků.
3. Spustit `python _build_blog.py` (pouze blog a označený náhled na homepage).
4. Novou adresu přidat do sitemap.xml, aktualizovat lastmod dotčených stránek.
5. Spustit `python _build_site_search_index.py` a zkontrolovat nové stránky.
6. Publikovat ověřenou změnu běžným GitHub Pages postupem.

Nepoužívat zastaralé `_build_pages.py` / `_build_aplikace_pages.py` pro obnovu celého webu.
Články a přehled jsou čitelné bez JavaScriptu. JS pouze doplňuje filtry a přehrávač.
Videa se načítají až po kliknutí; přímý odkaz na YouTube je dostupný stále.

## Odkaz k Hoslovicím do popisu videa

Příběh mlýna, mapa a tipy k návštěvě: https://cestovatel69.cz/blog/hoslovicky-mlyn/

Odkaz přidat teprve poté, co článek skutečně běží. Dosavadní odkazy na licence
a mapu zachovat. Popis YouTube není tímto skriptem automaticky upravován.

## Analytics a AdSense

Analytics měří návštěvnost; AdSense slouží k reklamě a podléhá schválení webu.
Soubor ads.txt už obsahoval existující publisher ID; žádné nové ID nevymýšlet.
Bez kontroly skutečných účtů nelze tvrdit, že je měření nebo reklama aktivní.
Schválení YouTube samo nepotvrzuje schválení samostatného webu.

## Oddělení témat a ostatní videa

`/blog/` je pouze cestovatelský blog. Smart Home zůstává samostatně na
`/smart-home/blog.html`; technické zápisky ani aplikace se nepřidávají do
cestovatelských článků a RSS. Globální navigace na ostatní části webu zůstává.

Blok ostatních zveřejněných cestovatelských videí spravuje `_data/blog/videos.json`.
Na přehledu se zobrazí celý výběr, pod článkem první tři videa a odkaz na zbytek.
Názvy, ID a délky ověřeny na veřejné kartě kanálu 16. 11. 2026; délky 32 a 35
minut YouTube zaokrouhluje. Krkonošské boudy jsou podle uživatele nedokončené
a nejsou publikované ani v seznamu. Nevytvářet články k nedokončeným videím.

## Český ráj – 16. 11. 2026

Článek `/blog/cesky-raj/` navazuje na veřejné video `KIXA5yxV6-U`.
Obsah ověřen podle aktuálního popisu, kapitol a exportovaného přepisu
(získána anglická stopa; žádný nový komentář ani změna videa). Délka ve Studiu
8:08, veřejný přehrávač ukazuje 8:07; metadata zachovávají údaj Studia.
Historie a návštěvnické údaje ověřeny na odkazovaných oficiálních stránkách
regionu, KČT Semily a CzechTourism. Výběry výletů nejsou vydávané za hotové trasy.
Pověsti a filmová místa odděleny od doložené historie. Fotografie v existující
miniatuře odkazují na původní autory a licence.

## Jednotná nabídka příběhů – 16. 11. 2026

Na výslovné přání uživatele má každé ze 12 videí v dosavadním výběru svůj článek.
Všechny karty používají Přečíst příběh → a shodnou šablonu. Starší odkaz
/blog/#ostatni-videa zůstává funkční a vede na přehled příběhů.
Uživatel nechce v blogu opakovat autory a licence fotografií. Jejich původní
stránky /zdroje/ a odkazy v popisech YouTube zůstávají zachované, viditelné
licenční bloky a odkazy se v článcích nevykreslují. Věcné zdroje k historii
a praktickým údajům v textu mohou zůstat.
Podklady: aktuální názvy a celé popisy všech deseti zbývajících videí načteny
v YouTube Studiu, včetně kapitol a mapových odkazů. Záloha mimo veřejný repo:
youtube-blog-puvodni-popisy.json ve workspace Bloger. Zpětné odkazy přidávat
až po živém ověření článků, původní popisy a licenční informace zachovat.
