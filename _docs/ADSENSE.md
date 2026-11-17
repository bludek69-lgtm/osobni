# AdSense a reklamní souhlas

Nastaveno 17. 11. 2026 na výslovné zadání vlastníka. Žádost o nové posouzení webu
neodesílat bez dalšího zadání. Publikování souhlasové zprávy není žádost o kontrolu.

## Účet a zpráva

- Veřejné publisher ID: pub-2131933406219379, doména cestovatel69.cz.
- AdSense → Ochrana soukromí a sdělení → Evropské předpisy.
- Publikovaná zpráva „Cestovatel69 – souhlas s reklamami“.
- Výchozí čeština, další angličtina a italština.
- Název webu Cestovatel69, zásady https://cestovatel69.cz/soukromi/.
- Na prvním panelu Souhlasím, Nesouhlasím (zapnuto pro všechny oblasti),
  Spravovat možnosti. Logo je vypnuté, používá se textový název webu.
- Optimalizace variant souhlasové zprávy je vypnutá.
- Režim souhlasu pro reklamní účely zapnutý. Interpretace souhlasu pro
  analytické účely vypnutá; Analytics používá vlastní dobrovolný souhlas.

## Propojení webu

`assets/js/analytics-consent.js` zavádí publikovanou CMP přes standardní
AdSense tag s client=ca-pub-2131933406219379. Nedoplňuje reklamní jednotky,
nezapíná automatické reklamy v účtu a neodesílá žádost o kontrolu.

Výchozí hodnoty analytics_storage, ad_storage, ad_user_data a ad_personalization
jsou denied před vložením značky AdSense. Google CMP mění reklamní účely.
Povolení ani odvolání Analytics nemění reklamní účely. Nastavení GA4 nadále
zakazuje Google Signals a reklamní personalizaci analytických dat.

V patičce je „Nastavení reklam“ / „Advertising settings“ / „Impostazioni
pubblicitarie“. Zpřístupní se po CONSENT_API_READY. Volá podporované
googlefc.showRevocationMessage přes googlefc.callbackQueue. Při blokování
Google CMP rozšířením může být toto tlačítko nedostupné. Informace jsou také
na stránkách soukromí ve třech jazycích.

Na localhostu, jiných hostitelích a uvnitř /demo/ se integrace nespouští.
Souhlas s reklamami sám nespouští Google Analytics. Nepřipojovat Analytics k
souhlasu pro účel 1 v AdSense bez změny této logiky a informací pro návštěvníka.

Před budoucím spuštěním automatických reklam vybrat vhodné obsahové stránky
a vyloučit chybové, navigační, pomocné či demonstrační obrazovky.

## Ověření

- `node test_youtube_attribution.cjs`: skutečná konfigurace GA4, ověřené YouTube
  kampaně, oddělení reklamního souhlasu, výchozí odmítnutí a opětovné otevření CMP.
- `python audit_site_analytics.py`: pokrytí veřejných stránek společnými skripty.
- Syntaxe tří změněných JS souborů a `git diff --check`.
- Živá zpráva se ověřuje po nasazení; Google uvádí možnost prodlevy až jednu
  hodinu po publikování. Testovací URL: /?fc=alwaysshow&fctype=gdpr.

Dokumentace:
- https://support.google.com/adsense/answer/10924669?hl=cs
- https://developers.google.com/funding-choices/fc-api-docs
