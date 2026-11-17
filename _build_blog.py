"""Build only the blog and its homepage preview; existing site wrappers stay intact.

Edit _data/blog/posts.json and the matching <slug>.html article body, then run
python _build_blog.py followed by python _build_site_search_index.py.
"""
from pathlib import Path
from html import escape
import json
import re
import xml.etree.ElementTree as ET
from email.utils import formatdate
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parent
ORIGIN = 'https://cestovatel69.cz'
DATA = ROOT / '_data/blog'
SERIES = (
    {'id': 'skryte-klenoty', 'title': 'Skryté klenoty', 'description': 'Zajímavá místa v jednotlivých zemích, která stojí za objevením.', 'sample': 'italie-skryte-klenoty'},
    {'id': 'pohadky', 'title': 'Místa jako z pohádky', 'description': 'Výjimečně vypadající místa napříč Evropou.', 'sample': 'francie-skalni-vesnice'},
    {'id': 'pribehy', 'title': 'Cesty s příběhem', 'description': 'Delší vyprávění o tom, jak se kdysi žilo a pracovalo.', 'sample': 'hoslovicky-mlyn'},
)
SERIES_PATH = '/cestovani/skryte-klenoty/'
LEGACY_ANCHORS = {'italie-skryte-klenoty': 'italie', 'portugalsko-skryte-klenoty': 'portugalsko', 'spanelsko-skryte-klenoty': 'spanelsko', 'hoslovicky-mlyn': 'hoslovice'}


def series_for(post):
    return next((s for s in SERIES if s['title'] == post['series']), None)


def esc(value):
    return escape(str(value), quote=True)


def date_label(value):
    day = datetime.fromisoformat(value)
    return f'{day.day}. {day.month}. {day.year}'


def reading_label(minutes):
    unit = 'minuta' if minutes == 1 else ('minuty' if 2 <= minutes <= 4 else 'minut')
    return f'{minutes} {unit} čtení'


def photo_essay(post):
    """An opt-in layout using the same article, video and source catalogue."""
    return f'''<article class="editorial-article"><header class="editorial-article-header"><a href="/blog/">← Všechny články</a><p class="editorial-eyebrow">Itálie / Toskánsko</p><h1>{esc(post['title'])}</h1><p class="editorial-deck">Fotografie z mého archivu, pohled z výšky a souvislosti pro vlastní cestu.</p><div class="editorial-meta"><span>Budinský Luděk</span><time datetime="{post['published']}">{date_label(post['published'])}</time><span>{reading_label(post['reading_minutes'])}</span></div></header>
<figure class="editorial-panorama"><img src="{esc(post['hero_image'])}" alt="{esc(post['hero_alt'])}" width="1600" height="738" fetchpriority="high" decoding="async"><figcaption><span>{esc(post['hero_caption'])}</span><a href="/cestovani/italie/toskansko/#valdorcia">Celá galerie Val d’Orcia →</a></figcaption></figure>
<div class="editorial-article-content">{(DATA / (post['slug'] + '.html')).read_text(encoding='utf-8')}</div>
<section class="editorial-film" id="film" aria-labelledby="film-title"><p class="editorial-eyebrow">Krajina ve videu</p><h2 id="film-title">Val d’Orcia a Crete Senesi z výšky</h2><p>Krátký film doplňuje fotografie. Video se načte z YouTube po spuštění.</p><div class="featured-video" data-video-id="{post['video_id']}" data-title="{esc(post['video_title'])}"><button class="thumb-cover" type="button" aria-label="Přehrát video: {esc(post['video_title'])}" style="background-image:url('https://img.youtube.com/vi/{post['video_id']}/maxresdefault.jpg')"></button></div><div class="editorial-meta"><span>Délka videa {esc(post['video_duration'])}</span><a href="https://www.youtube.com/watch?v={post['video_id']}" target="_blank" rel="noopener noreferrer">Otevřít na YouTube ↗</a></div><nav class="editorial-actions" aria-label="Podklady k videu"><a href="{esc(post['map_url'])}">Místa na mapě →</a><a href="{esc(post['credits_url'])}">Zdroje fotografií a podklady →</a></nav></section>
<section class="editorial-sources" aria-labelledby="sources-title"><h2 id="sources-title">Podklady k článku</h2><p>Fotografie na této stránce pocházejí z mého archivu. Souvislosti ke krajině vycházejí z následujících zdrojů; podklady k filmu jsou uvedené samostatně nad touto částí.</p><ul><li><a href="https://whc.unesco.org/en/list/1026/" target="_blank" rel="noopener noreferrer">UNESCO: kulturní krajina Val d’Orcia ↗</a></li><li><a href="https://www.visittuscany.com/en/attractions/crete-senesi-life-park/" target="_blank" rel="noopener noreferrer">Visit Tuscany: Crete Senesi Life Park ↗</a></li></ul></section>
<nav class="editorial-next" aria-label="Pokračovat ve čtení"><h2>Ještě chvíli v Toskánsku</h2><div class="editorial-actions"><a href="/blog/montepulciano/">Montepulciano →</a><a href="/blog/toskansko-vsemi-smysly/">Toskánsko všemi smysly →</a><a href="{esc(post['project_url'])}">Další cesty po Itálii →</a><a href="https://www.youtube.com/@cestovatel69?sub_confirmation=1" target="_blank" rel="noopener noreferrer">Odebírat kanál Cestovatel69 ↗</a></div></nav></article>'''


def url(post):
    return '/blog/' + post['slug'] + '/'


def card(post, featured=False, heading='h2'):
    group = series_for(post)
    return f'''<article class="blog-card{' blog-featured' if featured else ''}" data-blog-category="{esc(post['category'])}" data-blog-series="{group['id'] if group else 'ostatni'}">
<a class="blog-card__image" href="{url(post)}" tabindex="-1" aria-hidden="true"><img src="https://img.youtube.com/vi/{post['video_id']}/hqdefault.jpg" alt="" width="480" height="360" loading="lazy" decoding="async"></a>
<div class="blog-card__body"><div class="blog-meta"><span>{esc(post['category'])} · {esc(post['series'])}</span><time datetime="{post['published']}">{date_label(post['published'])}</time></div>
<{heading}><a href="{url(post)}">{esc(post['title'])}</a></{heading}><p>{esc(post['description'])}</p>
<a class="blog-card__link" href="{url(post)}">Přečíst příběh →</a><p class="blog-meta">{reading_label(post['reading_minutes'])} · video {esc(post['video_duration'])}</p></div></article>'''


def video_card(video):
    if video.get('post'):
        return card(video['post'], heading='h3')
    watch = 'https://www.youtube.com/watch?v=' + video['video_id']
    article_link = f'<p><a class="blog-card__link" href="{esc(video["article_url"])}">Přečíst příběh →</a></p>' if video.get('article_url') else ''
    return f'''<article class="blog-card blog-video-card"><a class="blog-card__image" href="{watch}" target="_blank" rel="noopener noreferrer" tabindex="-1" aria-hidden="true"><img src="https://img.youtube.com/vi/{video['video_id']}/hqdefault.jpg" alt="" width="480" height="360" loading="lazy" decoding="async"></a><div class="blog-card__body"><p class="blog-meta">{esc(video['series'])} · {esc(video['duration'])}</p><h3><a href="{watch}" target="_blank" rel="noopener noreferrer">{esc(video['title'])}</a></h3><a class="blog-card__link" href="{watch}" target="_blank" rel="noopener noreferrer" aria-label="Přehrát na YouTube: {esc(video['title'])}">Přehrát na YouTube ↗</a>{article_link}</div></article>'''


def video_block(videos, limit=None):
    more = '<p><a class="blog-card__link" href="/blog/#ostatni-videa">Všechny příběhy →</a></p>' if limit else ''
    return '<section class="blog-videos" id="ostatni-videa" aria-labelledby="other-videos-title"><h2 id="other-videos-title">Další příběhy z cest</h2><p>Vyber si další místo. U každého příběhu najdeš i odpovídající video.</p><div class="blog-grid">' + ''.join(video_card(v) for v in videos[:limit]) + '</div>' + more + '</section>'


def wrapper(title, description, path, body, header, footer, image=None, schema=None):
    image = image or ORIGIN + '/assets/og-default.jpg'
    canonical = ORIGIN + path
    schema_tag = '' if schema is None else '<script type="application/ld+json">' + json.dumps(schema, ensure_ascii=False).replace('<', '\\u003c') + '</script>'
    return f'''<!doctype html>
<html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title)} — Cestovatel69</title><meta name="description" content="{esc(description)}"><link rel="canonical" href="{canonical}">
<meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(description)}"><meta property="og:type" content="{'article' if path != '/blog/' else 'website'}"><meta property="og:url" content="{canonical}"><meta property="og:image" content="{esc(image)}">
<meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/favicon.ico">
<link rel="stylesheet" href="/assets/css/style.css?v=20261116-navsearch"><link rel="stylesheet" href="/assets/css/language-navigation.css?v=20261030-jazyky"><link rel="stylesheet" href="/assets/css/blog.css?v=20261116-travel">
<link rel="stylesheet" href="/assets/css/editorial-preview.css?v=20261117-editorial"><link rel="stylesheet" href="/assets/css/editorial-site.css?v=20261117-editorial">
<script id="cestovatel-analytics-consent" src="/assets/js/analytics-consent.js?v=20261116-3"></script>
<link rel="alternate" type="application/rss+xml" title="Cestovatel69 – Blog z cest" href="/blog/feed.xml">{schema_tag}</head>
<body class="theme-home blog-page editorial-preview editorial-site {'editorial-hub' if path == '/blog/' else 'editorial-reading'}">{header}<main id="main">{body}</main>{footer}
<script src="/assets/js/main.js?v=20261117-editorial"></script><script defer src="/assets/js/blog.js?v=20261117-editorial"></script></body></html>'''


def build_series(posts):
    """Reuse the published articles as the only catalogue of available episodes."""
    groups = [(s, [p for p in posts if p['series'] == s['title']]) for s in SERIES]
    total = sum(len(items) for _, items in groups)
    overview = ''.join(f'<article class="gems-project"><span class="gems-label">{len(items)} {"díl" if len(items) == 1 else "díly" if len(items) < 5 else "dílů"}</span><h3>{s["title"]}</h3><p>{s["description"]}</p><a href="#{s["id"]}">Vybrat díl →</a></article>' for s, items in groups)
    sections = []
    for s, items in groups:
        cards = []
        for post in items:
            anchor = LEGACY_ANCHORS.get(post['slug'], post['slug'])
            cards.append(card(post, heading='h3').replace('<article ', f'<article id="{anchor}" ', 1))
        alias = '<span id="episodes-title" class="gems-anchor"></span>' if s['id'] == 'skryte-klenoty' else ''
        sections.append(f'<section id="{s["id"]}" class="gems-series" aria-labelledby="{s["id"]}-title">{alias}<div class="journey-section-heading"><h2 id="{s["id"]}-title">{s["title"]}</h2></div><div class="blog-grid">{"".join(cards)}</div></section>')
    body = f'''<a class="gems-back" href="/cestovani/">← Zpět na Cestování</a>
<section class="hero journey-hero" aria-labelledby="gems-title"><div class="journey-hero__intro"><div><span class="hero-accent">Inspirace na cesty</span><h1 id="gems-title">Cestovatelské série</h1></div><p class="hero-sub">Tři série, {total} dostupných dílů. Vyber si místo, pohádkovou scenérii nebo příběh starého řemesla.</p></div>
<p class="gems-context" id="prehravac">Každý díl otevře vlastní článek s videem, mapou a podklady. Vše potřebné najdeš pohromadě na stránce příběhu.</p>
</section>
<section id="projekty" class="gems-projects" aria-labelledby="projects-title"><div class="journey-section-heading"><h2 id="projects-title">Vyber si sérii</h2></div><div class="gems-project-grid">{overview}</div></section>
{''.join(sections)}
<aside class="journey-note"><div><h2>Chceš pokračovat jinam?</h2><p>Na blogu jsou všechny příběhy. V cestovních galeriích najdeš moje fotografie z navštívených míst.</p></div><nav class="journey-links" aria-label="Další cesty"><a href="/blog/">Všechny články →</a><a href="/cestovani/#vybrane-cesty">Moje cestovní galerie →</a></nav></aside>'''
    path = ROOT / SERIES_PATH.strip('/') / 'index.html'
    html = path.read_text(encoding='utf-8')
    html = re.sub(r'<main id="main">.*?</main>', lambda _: '<main id="main">' + body + '</main>', html, flags=re.S)
    html = re.sub(r'<title>.*?</title>', '<title>Cestovatelské série — Skryté klenoty, Pohádky a Cesty s příběhem</title>', html)
    html = re.sub(r'(<meta property="og:title" content=")[^"]*', r'\g<1>Cestovatelské série', html)
    html = re.sub(r'(<meta (?:name="description"|property="og:description") content=")[^"]*', rf'\g<1>Tři cestovatelské série a {total} dílů s články, videi a mapami: Skryté klenoty, Místa jako z pohádky a Cesty s příběhem.', html)
    html = re.sub(r'hidden-gems.css\?[^"\s]+', 'hidden-gems.css?v=20261116-serie', html)
    if '/assets/css/blog.css?' not in html:
        html = html.replace('</head>', '<link rel="stylesheet" href="/assets/css/blog.css?v=20261116-serie">\n</head>')
    path.write_text(html, encoding='utf-8')

    # The travel landing page presents series, rather than repeating episode players.
    translations = {
        'cs': ('Cestovatelské série', f'Tři série, {total} dílů. Vyber si téma; video, mapu i podrobnosti najdeš u konkrétního příběhu.', ['Skryté klenoty', 'Místa jako z pohádky', 'Cesty s příběhem'], ['Zajímavá místa od Itálie po Řecko.', 'Skalní vesnice Trôo a Rochemenier ve Francii.', 'Hoslovický mlýn a ruční papírna Velké Losiny.'], 'Vybrat díl →', 'Všechny příběhy na blogu →'),
        'en': ('Travel series', f'Three series, {total} episodes. Choose a theme, then open a story for its video, map and details. Articles and videos are in Czech.', ['Hidden Gems', 'Places Like a Fairytale', 'Journeys with a Story'], ['Unusual places from Italy to Greece.', 'The rock villages of Trôo and Rochemenier in France.', 'Hoslovice watermill and the Velké Losiny handmade paper mill.'], 'Choose an episode → · CS', 'All stories on the blog → · CS'),
        'it': ('Serie di viaggio', f'Tre serie, {total} episodi. Scegli un tema e apri il racconto per il video, la mappa e i dettagli. Articoli e video sono in ceco.', ['Tesori nascosti', 'Luoghi da fiaba', 'Viaggi con una storia'], ['Luoghi insoliti dall’Italia alla Grecia.', 'I villaggi nella roccia di Trôo e Rochemenier in Francia.', 'Il mulino di Hoslovice e la cartiera a mano di Velké Losiny.'], 'Scegli un episodio → · CS', 'Tutti i racconti sul blog → · CS'),
    }
    for lang, (title, intro, names, descriptions, action, blog_action) in translations.items():
        file = ROOT / ('' if lang == 'cs' else lang) / 'cestovani/index.html'
        text = file.read_text(encoding='utf-8')
        cards = []
        language_hint = '' if lang == 'cs' else ' hreflang="cs"'
        for i, (s, items) in enumerate(groups):
            sample = next(p for p in items if p['slug'] == s['sample'])
            n = len(items)
            count = f'{n} ' + ({'cs': 'díl' if n == 1 else 'díly' if n < 5 else 'dílů', 'en': 'episode' if n == 1 else 'episodes', 'it': 'episodio' if n == 1 else 'episodi'}[lang])
            cards.append(f'<a class="card card-link destination-card" href="{SERIES_PATH}#{s["id"]}"{language_hint}><img src="https://img.youtube.com/vi/{sample["video_id"]}/hqdefault.jpg" alt="" width="480" height="360" loading="lazy" decoding="async"><div class="destination-card__body"><span class="gems-label">{count}</span><h3>{names[i]}</h3><p>{descriptions[i]}</p><span class="card-cta">{action}</span></div></a>')
        block = f'<section class="gems-hub" id="inspirace" aria-labelledby="inspiration-title"><div class="journey-section-heading"><h2 id="inspiration-title">{title}</h2><p>{intro}</p></div><div class="destination-grid gems-series-grid">{"".join(cards)}</div><nav class="journey-links" aria-label="{title}"><a href="/blog/"{language_hint}>{blog_action}</a></nav></section>'
        text, count = re.subn(r'<section(?=[^>]*\bid="inspirace")[^>]*>.*?</section>', lambda _: block, text, flags=re.S)
        assert count == 1, f'Missing travel series overview: {lang}'
        text = re.sub(r'<aside class="journey-note"><h2>Příběhy za videem</h2>.*?</aside>', '', text, flags=re.S)
        text = re.sub(r'hidden-gems.css\?[^"\s]+', 'hidden-gems.css?v=20261116-serie', text)
        file.write_text(text, encoding='utf-8')


def main():
    posts = json.loads((DATA / 'posts.json').read_text(encoding='utf-8'))
    videos = json.loads((DATA / 'videos.json').read_text(encoding='utf-8'))
    articles_by_video = {p['video_id']: p for p in posts}
    for video in videos:
        video['post'] = articles_by_video.get(video['video_id'])
        video['article_url'] = url(video['post']) if video['post'] else None
    assert len({v['video_id'] for v in videos}) == len(videos), 'Unique videos are required'
    assert all(re.fullmatch(r'[A-Za-z0-9_-]{11}', v['video_id']) for v in videos), 'Invalid video ID'
    assert posts and len({p['slug'] for p in posts}) == len(posts), 'Unique post slugs are required'
    for post in posts:
        assert re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', post['slug']), 'Invalid slug'
        assert re.fullmatch(r'[A-Za-z0-9_-]{11}', post['video_id']), 'Invalid YouTube video ID'
        assert post['published'] <= post['updated'], 'Invalid dates'
        assert (DATA / (post['slug'] + '.html')).is_file(), 'Missing article body'
    posts.sort(key=lambda p: p['published'], reverse=True)
    home_file = ROOT / 'index.html'
    home = home_file.read_text(encoding='utf-8')
    header = re.search(r'<header class="site-header">.*?</header>', home, re.S).group()
    header = re.sub(r'href="(?!/|https?:|#)([^"]*)"', lambda m: 'href="/' + ('' if m[1] == './' else m[1]) + '"', header)
    header = header.replace(' aria-current="page"', '')
    # No translated blog exists yet: do not send visitors to unrelated translated homepages.
    header = re.sub(r'<nav[^>]*class="lang-switcher".*?</nav>', '<nav aria-label="Jazyk stránky" class="lang-switcher"><a href="/blog/" lang="cs" aria-current="page">CS</a><span class="lang-unavailable" aria-disabled="true" title="English — překlad není dostupný">EN</span><span class="lang-unavailable" aria-disabled="true" title="Italiano — překlad není dostupný">IT</span></nav>', header, flags=re.S)
    header = re.sub(r'<a href="/blog/">[^<]+</a>', '<a href="/blog/" aria-current="page">Blog z cest</a>', header)
    footer = '''<footer class="site-footer"><div class="site-footer__inner"><div>© Budinský Luděk · Cestovatel69</div><div class="footer-links"><a href="/blog/">Blog z cest</a><a href="/blog/feed.xml">RSS</a><a href="/o-mne.html">O mně</a><a href="https://www.youtube.com/@cestovatel69" target="_blank" rel="noopener noreferrer">YouTube @cestovatel69 ↗</a></div></div></footer>'''
    filters = '<button type="button" data-series="all" aria-pressed="true">Všechny články</button>' + ''.join(f'<button type="button" data-series="{s["id"]}" aria-pressed="false">{s["title"]}</button>' for s in SERIES) + '<button type="button" data-series="ostatni" aria-pressed="false">Další cesty</button>'
    index_body = '''<section class="blog-intro"><p class="blog-eyebrow">Cestovatel69 · Blog z cest</p><h1>Příběhy z cest</h1><p>Místa mají své příběhy. Vyber si článek a vydej se za krajinou, městy nebo starým řemeslem. Každý příběh doplňuje video, mapa a tipy pro vlastní cestu.</p><nav class="blog-resource-links" aria-label="Na této stránce"><a href="#clanky">Vybrat příběh ↓</a></nav></section><section id="clanky" aria-labelledby="articles-title"><span id="ostatni-videa"></span><h2 id="articles-title">Přečti si příběh a pusť si video</h2>'''
    index_body = index_body.replace('<a href="#clanky">Vybrat příběh ↓</a>', '<a href="#clanky">Vybrat příběh ↓</a><a href="/cestovani/skryte-klenoty/">Rozcestník tří sérií →</a>')
    index_body += f'<nav class="blog-filters" aria-label="Filtrovat články podle série" data-blog-filters hidden>{filters}</nav><p class="sr-only" aria-live="polite" data-blog-status></p>'
    index_body += ''.join(card(p, featured=True, heading='h3') for p in posts) if len(posts) == 1 else '<div class="blog-grid">' + ''.join(card(p, heading='h3') for p in posts) + '</div>'
    index_body += '</section>'
    index_body += '''<aside class="blog-related"><h2>Další inspirace na cesty</h2><p>Prohlédni si <a href="/cestovani/skryte-klenoty/">cestovatelské série s mapami a podklady</a> nebo <a href="/cestovani/">fotografie z mých cest</a>.</p><p>Nové články můžeš sledovat přes <a href="/blog/feed.xml">RSS</a>.</p></aside>'''
    blog = ROOT / 'blog'
    blog.mkdir(exist_ok=True)
    (blog / 'index.html').write_text(wrapper('Blog z cest – příběhy a cestovatelská videa', 'Cestovatelský blog Cestovatele69: Český ráj, Hoslovický mlýn a další cesty po Česku a Evropě. Články, zveřejněná videa, mapy a tipy k výletům.', '/blog/', index_body, header, footer), encoding='utf-8')
    for post in posts:
        video = post['video_id']
        group = series_for(post)
        series_link = f'<a class="blog-back" href="{SERIES_PATH}#{group["id"]}">← Série: {group["title"]}</a>' if group else ''
        credits = post.get('credits_url')
        credits_link = f'<a href="{esc(credits)}">Zdroje fotografií a podklady →</a>' if credits else ''
        short_link = f'<a href="{esc(post["short_url"])}" target="_blank" rel="noopener noreferrer">Krátká ukázka ↗</a>' if post.get('short_url') else ''
        body = f'''<article class="blog-article"><header class="blog-article__header"><a class="blog-back" href="/blog/">← Všechny články</a><p class="blog-eyebrow">{esc(post['series'])} · {esc(post['category'])}</p><h1>{esc(post['title'])}</h1><div class="blog-meta"><span>Luděk · Cestovatel69</span><time datetime="{post['published']}">{date_label(post['published'])}</time><span>{reading_label(post['reading_minutes'])}</span></div></header>
<div class="featured-video" data-video-id="{video}" data-title="{esc(post['video_title'])}"><button class="thumb-cover" type="button" aria-label="Přehrát video: {esc(post['video_title'])}" style="background-image:url('https://img.youtube.com/vi/{video}/maxresdefault.jpg')"></button></div>
<div class="blog-video-caption"><span>Video · {esc(post['video_duration'])} · YouTube se načte po spuštění</span><a href="https://www.youtube.com/watch?v={video}" target="_blank" rel="noopener noreferrer">Otevřít video na YouTube ↗</a></div>
<nav class="blog-resource-links" aria-label="Podklady k videu"><a href="{esc(post['map_url'])}">Místa na mapě →</a>{credits_link}{short_link}</nav>
<div class="blog-content">{(DATA / (post['slug'] + '.html')).read_text(encoding='utf-8')}</div>
<aside class="blog-related"><h2>Pokračuj v cestování</h2>{series_link}<p><a href="{esc(post['project_url'])}">Prohlédnout další cesty →</a></p><p><a href="https://www.youtube.com/@cestovatel69?sub_confirmation=1" target="_blank" rel="noopener noreferrer">Odebírat Cestovatel69 na YouTube ↗</a></p><a href="/blog/">Zpět na blog →</a></aside></article>'''
        body = body.replace('</article>', video_block([v for v in videos if v['video_id'] != video], limit=3) + '</article>')
        schema = {'@context': 'https://schema.org', '@type': 'BlogPosting', 'headline': post['title'], 'description': post['description'], 'datePublished': post['published'], 'dateModified': post['updated'], 'inLanguage': 'cs', 'author': {'@type': 'Person', 'name': 'Budinský Luděk', 'url': ORIGIN + '/o-mne.html'}, 'mainEntityOfPage': ORIGIN + url(post), 'image': f'https://img.youtube.com/vi/{video}/maxresdefault.jpg'}
        directory = ROOT / url(post).strip('/')
        directory.mkdir(parents=True, exist_ok=True)
        if post.get('layout') == 'photo-essay':
            schema['image'] = ORIGIN + post['hero_image']
            body = photo_essay(post)
        html = wrapper(post['title'], post['description'], url(post), body, header, footer, schema['image'], schema)
        if post.get('layout') == 'photo-essay':
            html = html.replace('editorial-reading"', 'editorial-reading editorial-article-page"')
        (directory / 'index.html').write_text(html, encoding='utf-8')
    # Replace the marked homepage section on repeated runs, rather than duplicating it.
    preview = '<!-- BLOG_PREVIEW_START --><section class="blog-home" aria-labelledby="blog-home-title"><div class="section-header"><p class="blog-eyebrow">Nově na blogu</p><h2 id="blog-home-title">Příběhy za videem</h2><p>Místa, souvislosti a tipy, které doplňují moje videa.</p></div>' + ''.join(card(p, featured=True, heading='h3') for p in posts[:3]) + '<p><a class="blog-card__link" href="/blog/">Všechny články →</a></p></section><!-- BLOG_PREVIEW_END -->'
    if 'editorial-home' in home:
        pass  # The editorial homepage intentionally pins a curated selection of stories.
    elif '<!-- BLOG_PREVIEW_START -->' in home:
        home = re.sub(r'<!-- BLOG_PREVIEW_START -->.*?<!-- BLOG_PREVIEW_END -->', lambda _: preview, home, flags=re.S)
    else:
        home = home.replace('<section aria-labelledby="about-title"', preview + '\n<section aria-labelledby="about-title"', 1)
    if 'href="/assets/css/blog.css?' not in home:
        home = home.replace('</head>', '<link rel="stylesheet" href="/assets/css/blog.css?v=20261116">\n</head>')
    if "if (img.closest('.blog-card')) return;" not in home:
        home = home.replace("document.querySelectorAll('main img').forEach(function(img){", "document.querySelectorAll('main img').forEach(function(img){\n    if (img.closest('.blog-card')) return;")
    home = home.replace('main.js?v=20261116-blog', 'main.js?v=20261116-analytics')
    if 'id="cestovatel-analytics-consent"' not in home:
        home = home.replace('</head>', '<script id="cestovatel-analytics-consent" src="/assets/js/analytics-consent.js?v=20261116-3"></script>\n</head>')
    home_file.write_text(home, encoding='utf-8')
    # RSS gives readers a subscription option without introducing another account.
    rss = ET.Element('rss', version='2.0')
    channel = ET.SubElement(rss, 'channel')
    for name, value in [('title','Cestovatel69 – Blog z cest'),('link',ORIGIN+'/blog/'),('description','Příběhy z cest'),('language','cs')]:
        ET.SubElement(channel,name).text = value
    for post in posts:
        item = ET.SubElement(channel,'item')
        for name, value in [('title',post['title']),('link',ORIGIN+url(post)),('description',post['description']),('guid',ORIGIN+url(post)),('pubDate',formatdate(datetime.fromisoformat(post['published']).replace(tzinfo=timezone.utc).timestamp(), usegmt=True))]:
            ET.SubElement(item,name).text = value
    ET.indent(rss, space='  ')
    ET.ElementTree(rss).write(blog/'feed.xml',encoding='utf-8',xml_declaration=True)
    build_series(posts)
    print(f'Built {len(posts)} article(s), blog index, RSS and homepage preview.')


if __name__ == '__main__':
    main()
