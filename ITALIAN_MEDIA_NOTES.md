# Média lekcí — 2026-10-15

## Aktuální stav — 2026-10-23

Všech 12 lekcí má souvislé video nové AI lektorky (32–41 sekund) se scénou podle tématu, italským hlasem Nora a přepisem na stránce. Soubory a plakáty jsou v `assets/video/italian/`, zdrojové scénáře v `ITALIAN_TUTOR_VIDEO_PLAN.md`. Kavárenská osmivteřinová ukázka i restaurační přehrávač Freyi byly nahrazeny; starší pokusy níže jsou historický záznam, nikoli aktuální stav webu.

## Ilustrace

Všech 12 lekcí má nový samostatný motiv v `assets/img/italian/lessons/`.
Obrázek se používá v přehledu i v úvodu konkrétní lekce. Zadání a původ
jsou v README ve stejné složce. Původní obrázky slovíček zůstaly zachovány.

## Freya — V hotelu

### Nový pokus 2026-10-23

Po ověření, že starší pokusy `0f679c2c3416412bd18db7220b18840b`
a `27e4ef898dc227def64b7e3b066f4582` selhaly na měsíčním limitu Avatar IV
a pokus `75f520a09634260318c4a1ad62cf5492` selhal na nedostatku kreditů
Avatar III, bylo spuštěno **jedno** nové video přes podporovaný režim Avatar V:
`8511c6918435051b1dcd4e766a70d2af`. Vzhled Freya Office 9,
hlas `49a8e79358994a949e968847edc71159`, italština, 16:9, 720p,
rychlost 0,9 a připravený hotelový scénář z `italian-data.js`.
HeyGen vrátil stav `processing`; přehrávač sleduje dokončení. Před vložením
na web ověřit stav, obsah a zvuk. Tento záznam není potvrzením dokončení.

Ve 12 lekcích mají ověřené veřejné video jen `bar` (Freya) a `ristorante`
(Freya). `hotel` čeká na výsledek uvedeného pokusu. Bez videa dále zůstávají
`saluti`, `citta`, `passato`, `racconto`, `progetti`, `pronomi`, `opinioni`,
`ipotesi` a `registro`. Všechny mají samostatný dialog a předem připravený zvuk.

Na výslovnou žádost byl spuštěn nový pokus o video, ID
`27e4ef898dc227def64b7e3b066f4582`. Stejná Freya Office9, hlas Ivanna,
Avatar IV, 720p, 16:9, rychlost 0.9, původní připravený italský scénář.
HeyGen přijal generování a přehrávač sledoval stav processing. Při kontrole
veřejného přehrávače nebylo video dostupné; stránka videa hlásila zpracování.
Do webu se nepřidává neověřené video. Původní dialog a nahrávky fungují.
Nespouštět další generování místo kontroly tohoto existujícího ID.

## ElevenLabs — nová lektorka v kavárně (2026-10-23)

Samostatná osmivteřinová ukázka nové dospělé lektorky v prostředí kavárny
vznikla ve flow `DlY85sqWqaxYwMQ5tVsu` v ElevenLabs.
Obrázek: `k1xgroEkFQRFwlVXnw6k` (Gemini 3 Pro Image); italský hlas Nora:
`3ymCSvg25AOrBCItYPEJ` (Eleven Multilingual v2); video s lip-sync:
`da92DlvBLRVPzMKwrAOM` (Creatify Aurora, 8,4 s, 1280 × 704 px).
Projev: „Ciao! Siamo in un bar italiano. Se vuoi ordinare, di': Vorrei un caffè
e un cornetto, per favore. Ora prova tu!“ Video je dokončené v ElevenLabs,
ale před použitím na veřejném webu ještě vyžaduje lidskou vizuální kontrolu.
Na web ani do repozitáře nebyl nahrán žádný soubor videa.

Přímý náhled v účtu:
https://elevenlabs.io/app/image-video/history?modality=video&generationId=da92DlvBLRVPzMKwrAOM

## Canva a avatary

Canva podporuje mluvící avatary prostřednictvím aplikace HeyGen AI Avatars:
https://www.canva.com/apps/AAFSMHx80yA/heygen-ai-avatars

Oficiální popis práce se scénářem a avatary:
https://www.canva.com/features/script-to-video/

V aktuálně dostupném Canva konektoru jsou nástroje pro návrhy a generování
obrázků, nikoli přímý nástroj pro mluvící avatar nebo synchronizaci rtů.
Samotné propojení s Canvou nepotvrzuje jiné limity generování HeyGenu.
