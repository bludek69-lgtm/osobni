# -*- coding: utf-8 -*-
"""Vygeneruje stránku „Počasí a webkamery“ (CS/EN/IT), doplní odkazy na rozcestníky Itálie a do sitemap.xml.
Idempotentní – lze spouštět opakovaně. Použití: python _build_pocasi_pages.py"""
import re
from pathlib import Path

ROOT = Path(__file__).parent
DATE = "2026-10-21"
CSSV = "20261021-pocasi"
PAGE = "pocasi-webkamery.html"

LANGS = {
    "cs": dict(
        dir="cestovani/italie", up="../../", assets="../../assets", home="../../", lang_attr="cs",
        title="Počasí a webkamery v Itálii — Luděk",
        desc="Aktuální počasí a 7denní předpověď v největších italských městech a živé webkamery z Říma, Milána, Neapole, Florencie, Benátek a Cinque Terre.",
        accent="Živě", h1="Počasí a webkamery",
        sub="Jak vypadá Itálie právě teď: aktuální počasí a sedmidenní předpověď v největších městech a živé webkamery z míst, která mám rád.",
        toc_label="Skok na:", toc=[("pocasi", "🌦 Počasí"), ("webkamery", "📹 Webkamery"), ("zdroje", "ℹ️ Zdroje")],
        w_h="🌦 Počasí v největších městech", w_sub="Klikni na město. Data se načítají živě z Open-Meteo.",
        w_over="Přehled měst", c_h="📹 Živé webkamery", c_sub="Přehrávač se načte až po kliknutí.",
        m_h="Další kamery", m_sub="U těchto měst vedou odkazy na SkylineWebcams, kde jsou přenosy vždy aktuální.",
        s_h="Zdroje a poznámky",
        notes=[
            "<strong>Počasí:</strong> data poskytuje <a href=\"https://open-meteo.com/\" target=\"_blank\" rel=\"noopener noreferrer\">Open-Meteo.com</a> (licence CC BY 4.0), zdarma a bez API klíče. Hodnoty se načítají přímo ve tvém prohlížeči a aktualizují se přibližně každých deset minut. Je to model předpovědi, ne oficiální výstraha — při cestě sleduj i <a href=\"https://www.meteoam.it/\" target=\"_blank\" rel=\"noopener noreferrer\">Aeronautica Militare (meteoam.it)</a>.",
            "<strong>Webkamery:</strong> přenosy provozují třetí strany (SkylineWebcams, I Love You Venice, Webcam Italia, Il Mattino, Espansione TV, RAMSAT, Vatican News, Paesaggi Digitali, Roma Five Suites) a zobrazují se pomocí oficiálního přehrávače YouTube. Přehrávač se načte až po kliknutí, takže YouTube o tobě nic nezjistí, dokud video nespustíš. Pokud některá kamera zrovna nevysílá, použij odkaz „Zdroj“.",
            "Webkamery nejsou moje a nemám nad nimi kontrolu; dostupnost přenosů se může měnit.",
        ],
        loading="Načítám počasí… (vyžaduje zapnutý JavaScript)", back="← Zpět na Itálii", noscript="Počasí a webkamery se načítají JavaScriptem. Povol ho, nebo otevři přímo",
        t_h="🌦 Počasí a webkamery",
        t_p="Aktuální počasí a sedmidenní předpověď v největších italských městech a živé webkamery z Říma, Milána, Neapole, Florencie, Benátek a Cinque Terre.",
        t_card_h="Otevřít počasí a webkamery", t_card_p="14 měst, předpověď na týden a 13 živých kamer. Přehrávač se načte až po kliknutí.", t_cta="Otevřít →",
        t_btn="Počasí a webkamery", t_toc="🌦 Počasí", t_id="pocasi-sek", anchors=("#regiony", "regiony"),
        nav=[("../../", "Domů"), ("../../aplikace/", "Moje aplikace"), ("../../finance/", "Finance"), ("../../cestovani/", "Cestování"), ("../../cestovani/italie/", "Itálie", True),
             ("../../zaliby/rybareni/", "Rybaření"), ("../../smart-home/", "Smart Home"), ("../../ai.html", "AI")],
        switch=("Jazyk", "Otevřít menu", "Hlavní navigace"), kicon="Česky",
        lang_links=("./" + PAGE, "../../en/cestovani/italie/" + PAGE, "../../it/cestovani/italie/" + PAGE),
        canon="https://cestovatel69.cz/cestovani/italie/" + PAGE, js="../../assets/js/italia-pocasi.js",
    ),
    "en": dict(
        dir="en/cestovani/italie", up="../../../", assets="../../../assets", home="../../", lang_attr="en",
        title="Weather and webcams in Italy — Luděk",
        desc="Current weather and a 7-day forecast in Italy's biggest cities, plus live webcams from Rome, Milan, Naples, Florence, Venice and the Cinque Terre.",
        accent="Live", h1="Weather and webcams",
        sub="What Italy looks like right now: current weather and a seven-day forecast in the biggest cities, and live webcams from places I love.",
        toc_label="Jump to:", toc=[("pocasi", "🌦 Weather"), ("webkamery", "📹 Webcams"), ("zdroje", "ℹ️ Sources")],
        w_h="🌦 Weather in the biggest cities", w_sub="Click a city. Data is loaded live from Open-Meteo.",
        w_over="All cities", c_h="📹 Live webcams", c_sub="The player loads only after you click.",
        m_h="More webcams", m_sub="These links lead to SkylineWebcams, where the streams are always up to date.",
        s_h="Sources and notes",
        notes=[
            "<strong>Weather:</strong> data by <a href=\"https://open-meteo.com/\" target=\"_blank\" rel=\"noopener noreferrer\">Open-Meteo.com</a> (CC BY 4.0), free and without an API key. Values are fetched directly in your browser and refreshed about every ten minutes. This is a forecast model, not an official warning — before you travel, also check <a href=\"https://www.meteoam.it/\" target=\"_blank\" rel=\"noopener noreferrer\">Aeronautica Militare (meteoam.it)</a>.",
            "<strong>Webcams:</strong> the streams are run by third parties (SkylineWebcams, I Love You Venice, Webcam Italia, Il Mattino, Espansione TV, RAMSAT, Vatican News, Paesaggi Digitali, Roma Five Suites) and shown with the official YouTube player. The player loads only after you click, so YouTube learns nothing about you until you press play. If a camera is not broadcasting at the moment, use the “Source” link.",
            "The webcams are not mine and I have no control over them; availability of the streams may change.",
        ],
        loading="Loading weather… (requires JavaScript)", back="← Back to Italy", noscript="Weather and webcams are loaded with JavaScript. Enable it, or open",
        t_h="🌦 Weather and webcams",
        t_p="Current weather and a seven-day forecast in Italy's biggest cities, plus live webcams from Rome, Milan, Naples, Florence, Venice and the Cinque Terre.",
        t_card_h="Open weather and webcams", t_card_p="14 cities, a week-long forecast and 13 live cameras. The player loads only after you click.", t_cta="Open →",
        t_btn="Weather and webcams", t_toc="🌦 Weather", t_id="weather-sec", anchors=("#regions", "regions"),
        nav=[("../../", "Home"), ("../../finance/", "Finance"), ("../", "Travel"), ("./", "Italy", True), ("../../zaliby/rybareni/", "Fishing"), ("../../smart-home/", "Smart Home"), ("../../ai.html", "AI")],
        switch=("Language", "Open menu", "Main navigation"), kicon="English",
        lang_links=("../../../cestovani/italie/" + PAGE, "./" + PAGE, "../../../it/cestovani/italie/" + PAGE),
        canon="https://cestovatel69.cz/en/cestovani/italie/" + PAGE, js="../../../assets/js/italia-pocasi.js",
    ),
    "it": dict(
        dir="it/cestovani/italie", up="../../../", assets="../../../assets", home="../../", lang_attr="it",
        title="Meteo e webcam in Italia — Luděk",
        desc="Meteo attuale e previsioni a 7 giorni nelle maggiori città italiane e webcam in diretta da Roma, Milano, Napoli, Firenze, Venezia e dalle Cinque Terre.",
        accent="In diretta", h1="Meteo e webcam",
        sub="Com'è l'Italia in questo momento: meteo attuale e previsioni a sette giorni nelle maggiori città e webcam in diretta dai luoghi che amo.",
        toc_label="Vai a:", toc=[("pocasi", "🌦 Meteo"), ("webkamery", "📹 Webcam"), ("zdroje", "ℹ️ Fonti")],
        w_h="🌦 Meteo nelle maggiori città", w_sub="Clicca su una città. I dati arrivano in diretta da Open-Meteo.",
        w_over="Tutte le città", c_h="📹 Webcam in diretta", c_sub="Il player si carica solo dopo il clic.",
        m_h="Altre webcam", m_sub="Questi link portano a SkylineWebcams, dove le dirette sono sempre aggiornate.",
        s_h="Fonti e note",
        notes=[
            "<strong>Meteo:</strong> dati di <a href=\"https://open-meteo.com/\" target=\"_blank\" rel=\"noopener noreferrer\">Open-Meteo.com</a> (CC BY 4.0), gratuiti e senza chiave API. I valori vengono caricati direttamente nel tuo browser e aggiornati circa ogni dieci minuti. È un modello di previsione, non un'allerta ufficiale: prima di partire controlla anche <a href=\"https://www.meteoam.it/\" target=\"_blank\" rel=\"noopener noreferrer\">Aeronautica Militare (meteoam.it)</a>.",
            "<strong>Webcam:</strong> le dirette sono gestite da terzi (SkylineWebcams, I Love You Venice, Webcam Italia, Il Mattino, Espansione TV, RAMSAT, Vatican News, Paesaggi Digitali, Roma Five Suites) e mostrate con il player ufficiale di YouTube. Il player si carica solo dopo il clic, quindi YouTube non sa nulla di te finché non premi play. Se una webcam non trasmette in questo momento, usa il link “Fonte”.",
            "Le webcam non sono mie e non ho alcun controllo su di esse; la disponibilità delle dirette può cambiare.",
        ],
        loading="Carico il meteo… (richiede JavaScript)", back="← Torna all'Italia", noscript="Meteo e webcam si caricano con JavaScript. Attivalo oppure apri",
        t_h="🌦 Meteo e webcam",
        t_p="Meteo attuale e previsioni a sette giorni nelle maggiori città italiane e webcam in diretta da Roma, Milano, Napoli, Firenze, Venezia e dalle Cinque Terre.",
        t_card_h="Apri meteo e webcam", t_card_p="14 città, previsioni per una settimana e 13 webcam in diretta. Il player si carica solo dopo il clic.", t_cta="Apri →",
        t_btn="Meteo e webcam", t_toc="🌦 Meteo", t_id="meteo-sec", anchors=("#regioni", "regioni"),
        nav=[("../../", "Home"), ("../../finance/", "Finanza"), ("../", "Viaggi"), ("./", "Italia", True), ("../../zaliby/rybareni/", "Pesca"), ("../../smart-home/", "Smart Home"), ("../../ai.html", "AI")],
        switch=("Lingua", "Apri menu", "Navigazione principale"), kicon="Italiano",
        lang_links=("../../../cestovani/italie/" + PAGE, "../../../en/cestovani/italie/" + PAGE, "./" + PAGE),
        canon="https://cestovatel69.cz/it/cestovani/italie/" + PAGE, js="../../../assets/js/italia-pocasi.js",
    ),
}
ALT = {"cs": "https://cestovatel69.cz/cestovani/italie/", "en": "https://cestovatel69.cz/en/cestovani/italie/", "it": "https://cestovatel69.cz/it/cestovani/italie/"}


def page(lang):
    L = LANGS[lang]
    nav = "\n".join('    <a href="%s"%s>%s</a>' % (h, ' aria-current="page"' if len(x) == 3 else "", t)
                    for x in L["nav"] for h, t in [(x[0], x[1])])
    sw = []
    for code, href in zip(("cs", "en", "it"), L["lang_links"]):
        cur = ' aria-current="page"' if code == lang else ""
        sw.append('      <a href="%s" hreflang="%s"%s>%s</a>' % (href, code, cur, code.upper()))
    toc = "\n".join('      <li><a href="#%s">%s</a></li>' % (i, t) for i, t in L["toc"])
    notes = "\n".join("      <p>%s</p>" % n for n in L["notes"])
    return f"""<!DOCTYPE html>
<html lang="{L['lang_attr']}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{L['title']}</title>
  <meta name="description" content="{L['desc']}">
  <link rel="canonical" href="{L['canon']}">
  <link rel="alternate" hreflang="cs" href="{ALT['cs']}{PAGE}">
  <link rel="alternate" hreflang="en" href="{ALT['en']}{PAGE}">
  <link rel="alternate" hreflang="it" href="{ALT['it']}{PAGE}">
  <link rel="alternate" hreflang="x-default" href="{ALT['cs']}{PAGE}">
  <meta property="og:title" content="{L['title']}">
  <meta property="og:description" content="{L['desc']}">
  <meta property="og:image" content="https://cestovatel69.cz/assets/og-default.jpg">
  <meta property="og:url" content="{L['canon']}">
  <meta property="og:type" content="website">
  <link rel="stylesheet" href="{L['assets']}/css/style.css?v=20261016-medaile">
  <link rel="stylesheet" href="{L['assets']}/css/pocasi.css?v={CSSV}">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E🌦%3C/text%3E%3C/svg%3E">
</head>
<body class="theme-italy">

<header class="site-header">
  <div class="site-header__inner">
    <a href="{L['up']}" class="brand"><span class="brand-dot"></span>Luděk</a>
    <div class="lang-switcher" aria-label="{L['switch'][0]}">
{chr(10).join(sw)}
    </div>
    <button class="nav-toggle" aria-label="{L['switch'][1]}" aria-expanded="false">☰</button>
    <nav class="nav" aria-label="{L['switch'][2]}">
{nav}
    </nav>
  </div>
</header>

<main id="main" class="pw">
  <div class="italy-flag-bar"><span></span><span></span><span></span></div>

  <section class="hero">
    <span class="hero-accent">{L['accent']}</span>
    <h1>{L['h1']}</h1>
    <p class="hero-sub">{L['sub']}</p>
  </section>

  <nav class="page-toc-sticky" aria-label="{L['toc_label']}">
    <span class="toc-label">{L['toc_label']}</span>
    <ul>
{toc}
    </ul>
  </nav>

  <section id="pocasi" aria-labelledby="pocasi-h">
    <div class="pw-head"><h2 id="pocasi-h">{L['w_h']}</h2><p class="pw-sub">{L['w_sub']}</p></div>
    <div id="pw-weather" aria-live="polite">
      <div class="pw-chips" id="pw-chips" role="group" aria-label="{L['w_h']}"></div>
      <div class="pw-main" id="pw-main"><div class="pw-skel">{L['loading']}</div></div>
      <div class="pw-head"><h2 style="font-size:1.1rem">{L['w_over']}</h2></div>
      <div class="pw-grid" id="pw-grid"></div>
    </div>
  </section>

  <section id="webkamery" aria-labelledby="webkamery-h">
    <div class="pw-head"><h2 id="webkamery-h">{L['c_h']}</h2><p class="pw-sub">{L['c_sub']}</p></div>
    <div id="pw-camroot">
      <div class="pw-chips" id="pw-camchips" role="group" aria-label="{L['c_h']}"></div>
      <div class="pw-cams" id="pw-cams"></div>
      <div class="pw-head"><h2 style="font-size:1.1rem">{L['m_h']}</h2><p class="pw-sub">{L['m_sub']}</p></div>
      <div class="pw-more" id="pw-more"></div>
    </div>
  </section>

  <section id="zdroje" aria-labelledby="zdroje-h">
    <div class="pw-head"><h2 id="zdroje-h">{L['s_h']}</h2></div>
    <div class="pw-note">
{notes}
    </div>
    <p style="margin-top:1.6rem"><a class="btn" href="./">{L['back']}</a></p>
  </section>
</main>

<script src="{L['assets']}/js/italia-pocasi.js?v={CSSV}"></script>
<script src="{L['assets']}/js/main.js?v=2026-10-11"></script>
</body>
</html>
"""


def teaser(lang):
    L = LANGS[lang]
    return f"""  <!-- PW_TEASER -->
  <section id="{L['t_id']}" class="pw">
    <h2>{L['t_h']}</h2>
    <p>{L['t_p']}</p>
    <div class="pw-strip" id="pw-strip" data-link="{PAGE}" aria-live="polite"></div>
    <a href="{PAGE}" class="card card-link" style="display:block; max-width:520px; margin:1.5rem 0;">
      <div class="card-icon" aria-hidden="true" style="font-size:1.6rem">🌦</div>
      <h3>{L['t_card_h']}</h3>
      <p>{L['t_card_p']}</p>
      <div class="card-cta">{L['t_cta']}</div>
    </a>
  </section>

"""


def patch_hub(lang):
    L = LANGS[lang]
    p = ROOT / L["dir"] / "index.html"
    s = p.read_text(encoding="utf-8")
    if "PW_TEASER" in s:
        return False
    # css + js
    s = s.replace("</head>", '  <link rel="stylesheet" href="%s/css/pocasi.css?v=%s">\n</head>' % (L["assets"], CSSV), 1)
    s = re.sub(r'(<script src="%s/js/main\.js[^"]*"></script>)' % re.escape(L["assets"]),
               r'<script src="%s/js/italia-pocasi.js?v=%s"></script>\n\1' % (L["assets"], CSSV), s, count=1)
    # launcher button
    s = re.sub(r'(<nav class="italy-launcher"[^>]*>)', r'\1\n      <a class="btn" href="%s">%s</a>' % (PAGE, L["t_btn"]), s, count=1)
    # toc
    anchor = L["anchors"][0]
    s = s.replace('<li><a href="%s">' % anchor, '<li><a href="#%s">%s</a></li>\n      <li><a href="%s">' % (L["t_id"], L["t_toc"], anchor), 1)
    # section before regions
    s = re.sub(r'(\s*)(<section id="%s"[^>]*>)' % L["anchors"][1], lambda m: "\n" + teaser(lang) + "  " + m.group(2), s, count=1)
    p.write_text(s, encoding="utf-8")
    return True


def patch_sitemap():
    p = ROOT / "sitemap.xml"
    s = p.read_text(encoding="utf-8")
    add = ""
    for lang in LANGS:
        loc = LANGS[lang]["canon"]
        if loc not in s:
            add += "  <url>\n    <loc>%s</loc>\n    <lastmod>%s</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n" % (loc, DATE)
    if add:
        s = s.replace("</urlset>", add + "</urlset>")
        p.write_text(s, encoding="utf-8")
    return bool(add)


if __name__ == "__main__":
    for lang in LANGS:
        out = ROOT / LANGS[lang]["dir"] / PAGE
        out.write_text(page(lang), encoding="utf-8")
        print("page", out.relative_to(ROOT), "| hub patched:", patch_hub(lang))
    print("sitemap updated:", patch_sitemap())
