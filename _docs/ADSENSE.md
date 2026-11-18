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
pubblicitarie“. Od opravy z 18. 11. 2026 se zpřístupní až po úspěšné odpovědi
TCF API s cmpStatus=loaded a gdprApplies=true. CONSENT_API_READY samo nestačí:
Google může načíst API i bez aktivní souhlasové zprávy. Volá podporované
googlefc.showRevocationMessage přes googlefc.callbackQueue. Při blokování
Google CMP rozšířením může být toto tlačítko nedostupné. Informace jsou také
na stránkách soukromí ve třech jazycích.

Na localhostu, jiných hostitelích a uvnitř /demo/ se integrace nespouští.
Souhlas s reklamami sám nespouští Google Analytics. Nepřipojovat Analytics k
souhlasu pro účel 1 v AdSense bez změny této logiky a informací pro návštěvníka.

URL tří vstupních skriptů mají verzi 20261118-cmpfix, včetně přímých značek
v HTML. `_refresh_consent_assets.py` je obnoví bez přeformátování obsahu.
Generátory blogu, šablon a jazykových stránek zachovávají tuto verzi.

Před budoucím spuštěním automatických reklam vybrat vhodné obsahové stránky
a vyloučit chybové, navigační, pomocné či demonstrační obrazovky.

## Ověření

- `node test_youtube_attribution.cjs`: skutečná konfigurace GA4, ověřené YouTube
  kampaně, oddělení reklamního souhlasu, výchozí odmítnutí a opětovné otevření CMP.
- `python audit_site_analytics.py`: pokrytí veřejných stránek společnými skripty.
- Syntaxe tří změněných JS souborů a `git diff --check`.
- Živá zpráva se ověřuje po nasazení; Google uvádí možnost prodlevy až jednu
  hodinu po publikování. Testovací URL: /?fc=alwaysshow&fctype=gdpr.

## Diagnostika z 18. 11. 2026

Značka AdSense i přímá značka Google Privacy & messaging vracely inicializaci
bez viditelného souhlasového okna. V DOM vznikal rámec googlefcInactive,
přesto již běžel callback CONSENT_API_READY. To odhalilo chybu původní
kontroly dostupnosti tlačítka. Oprava sleduje podporovaný TCF addEventListener;
nevytváří vlastní řetězec souhlasu ani nepředstírá certifikovanou CMP.

Stavy pro ověření jsou v data-advertising-consent-ui,
data-advertising-cmp-status a data-advertising-gdpr-applies na html elementu.
Neobsahují TC řetězec ani osobní identifikátory. Při neúspěšné nebo neplatné
odpovědi zůstává tlačítko skryté a oprava neuděluje reklamní souhlasy.

V AdSense bylo ověřeno správné přiřazení domény a zásad soukromí i standardní
seznam reklamních partnerů; konfigurace téže zprávy byla znovu publikována.
Žádost o nové posouzení webu tím nebyla odeslána. Úplné ověření zobrazení
a změny reklamního souhlasu je nutné dokončit na skutečně doručeném okně.

Dokumentace:
- https://support.google.com/adsense/answer/10924669?hl=cs
- https://developers.google.com/funding-choices/fc-api-docs
