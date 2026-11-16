# Blog – ověření 16. 11. 2026

- Samostatná pracovní kopie od origin/main cd5ae532; původní pracovní složka nezměněna.
- Nový přehled /blog/, článek /blog/hoslovicky-mlyn/, RSS, náhled na homepage,
  vazba z cestování a karty videa, položka Blog ve společné české navigaci.
- Zdrojem textu jsou původní podklady komentáře k Hoslovicím, rešerše projektu
  a aktuální web správce; text nepředstírá osobní návštěvu ani vlastní fotografie.
- Video hqDFJFh8dak a původní mapy/licence odpovídají již zveřejněné kartě dílu.
- Kontrola lokálních href/src, jediné h1, navigace a strukturovaných dat: PASS.
- Syntaxe main.js a blog.js: PASS. RSS XML: PASS.
- Opakované sestavení blogu nezmění výstup: PASS.
- Sitemap truth a jedinečnost meta description: PASS (staré orphan stránky hlásí warning).
- Index interního vyhledávání regenerován a ověřen --check.
- Chrome: desktop a šířka 390 px, bez vodorovného přetékání; filtr funkční.
- Před kliknutím žádný iframe, po kliknutí správný youtube-nocookie embed
  s původním ID a nastaveným referrerpolicy. Úplné přehrání filmu nebylo součástí kontroly.
- Existující test_skiplink_wiring.py FAIL na 34 starých stránkách Smart Home;
  stejný výsledek potvrzen na původní nezměněné složce. Blog tyto stránky nemění.

## Stav reklam a měření při kontrole účtů

AdSense již eviduje cestovatel69.cz. Stav: Vyžaduje vaši pozornost,
Obsah nízké hodnoty. V tabulce je ads.txt Nenalezeno, poslední aktualizace
8. 11. 2026. Dnes veřejná URL https://cestovatel69.cz/ads.txt v Chrome funguje
a obsahuje stejný publisher identifikátor jako účet. Nová žádost o kontrolu
nebyla odeslána a problémy nebyly označeny za vyřešené.

Ve zvoleném Google účtu nebyla v přepínači Analytics dostupná služba pro tento web.
Založení nového účtu Cestovatel69 a služby cestovatel69.cz je předvyplněno
(Česko, česká koruna, návštěvnost a interakce, volitelné sdílení vypnuté).
Závěrečné smluvní podmínky nebyly přijaty. Měření není na webu aktivováno.
