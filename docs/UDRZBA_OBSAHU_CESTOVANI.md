# Údržba cestovatelských informací a hledání

Praktický průvodce uvádí, kdy byly jeho jednotlivé části naposledy ověřeny. Toto je plán další kontroly, nikoli tvrzení, že již byla provedena.

- Před hlavní letní sezonou a znovu na podzim projít měnící se údaje o dopravě, mýtném, ZTL, pokutách, vstupném, přístupu do parků a pravidlech v konkrétních obcích. Ověřovat je u příslušného správce, dopravce nebo úřadu a zaznamenat datum ověření u dané části.
- Při změně pravidel nebo objevení nefunkčního odkazu opravit informaci i příslušné jazykové verze. Neuvádět konkrétní částku ani datum ověření, pokud nejsou ověřeny.
- Při změně veřejného obsahu zkontrolovat `sitemap.xml` a spustit z kořene webu `python _build_site_search_index.py`. Aktualizovaný index se musí vydat spolu se stránkami. Příkaz `python _build_site_search_index.py --check` ověří, že je index aktuální. Do indexu patří veřejný obsah, nikoli koncepty, citlivé údaje či zdrojové kódy.
- Po aktualizaci vyzkoušet vyhledávání alespoň na místě, městě s jiným tvarem slova, aplikaci, receptu a prázdném výsledku. Ověřit odkazy na odpovídající oddíly a zobrazení na mobilu.
- Hledání je statický snímek veřejných stránek v době sestavení a vybraných strukturovaných údajů (recepty, druhy těstovin, webkamery a slovíčka). Neprohledává zvuk nebo obrazy ve videích ani libovolný obsah vznikající až v aplikacích. U nového typu dynamického obsahu je nutné doplnit způsob indexace.
