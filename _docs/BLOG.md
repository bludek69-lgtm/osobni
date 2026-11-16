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
