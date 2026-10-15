# Kontrola italštiny — 2026-10-15

Rozsah: všech 12 lekcí, 136 replik dialogů, české a anglické překlady,
84 výrazů s příklady a 72 gramatických otázek. Existující videa se neměnila.

## Opravy

- V kavárně: doplněno `io` do zadání zdvořilé objednávky. Bez osoby byly
  gramaticky možné i další nabízené tvary podmiňovacího způsobu.
- V restauraci: otázka na jídelní lístek nyní uvádí účel `Per scegliere i piatti`.
  Původní věta umožňovala požádat také o účet nebo ukázání stolu.
- V hotelu: odstraněn distraktor `Per` z otázky na čas opuštění pokoje;
  formulace `Per che ora…?` může vyjadřovat časový limit.
- Pozdravy: doplněno `origine` do otázky s `di Roma`, aby byla výslovně
  zaměřena na původ, nikoli aktuální místo pobytu.
- Zájmena: český význam `la vedo` upřesňuje italský ženský rod. Český překlad
  zájmena závisí na českém podstatném jménu, například nádraží → vidím ho.
- Anglická restaurace: role obsluhy změněna z `Barista` na `Waiter`.

Text italských nahrávek zůstal beze změny. Identifikátory slov a otázek
zůstaly zachovány pro uložený pokrok.

## Ověření

- Všech 304 používaných MP3 vrací úspěšnou HTTP odpověď a dekóduje se
  pomocí AudioContext; celková délka přibližně 980 sekund.
- Všech 304 mapování text → soubor souhlasí s místními generačními manifesty.
  Jde o kontrolu zdrojového textu, přiřazení a technické přehratelnosti,
  nikoli nezávislý přepis nebo lidský poslech každé nahrávky.
- Všech 12 lekcí v CS a EN při šířce 390 px: přítomné překlady, načtený
  obrázek, bez vodorovného přetékání a bez chyb JavaScriptu.
- V každé jazykové verzi dokončeno všech 72 gramatických otázek přes UI:
  všech 24 průchodů jednotlivými lekcemi skončilo 6/6.
- U každé lekce v CS ověřen výběr významu, skutečně běžící zvuk
  v poslechovém cvičení a odmítnutí chybné psané odpovědi.
- Automatické testy navíc kontrolují jedinečnost nabídek a vyhodnocení
  správných i chybných odpovědí pro všechny lekce, čtyři režimy a CS/EN.

Kontrola nepotvrzuje úplné pokrytí úrovní CEFR ani odbornou jazykovou certifikaci.
