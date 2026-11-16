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


def esc(value):
    return escape(str(value), quote=True)


def date_label(value):
    day = datetime.fromisoformat(value)
    return f'{day.day}. {day.month}. {day.year}'


def url(post):
    return '/blog/' + post['slug'] + '/'


def card(post, featured=False, heading='h2'):
    return f'''<article class="blog-card{' blog-featured' if featured else ''}" data-blog-category="{esc(post['category'])}">
<a class="blog-card__image" href="{url(post)}" tabindex="-1" aria-hidden="true"><img src="https://img.youtube.com/vi/{post['video_id']}/hqdefault.jpg" alt="" width="480" height="360" loading="lazy" decoding="async"></a>
<div class="blog-card__body"><div class="blog-meta"><span>{esc(post['category'])} · {esc(post['series'])}</span><time datetime="{post['published']}">{date_label(post['published'])}</time></div>
<{heading}><a href="{url(post)}">{esc(post['title'])}</a></{heading}><p>{esc(post['description'])}</p>
<a class="blog-card__link" href="{url(post)}">Přečíst příběh →</a><p class="blog-meta">{post['reading_minutes']} minut čtení · video {esc(post['video_duration'])}</p></div></article>'''


def wrapper(title, description, path, body, header, footer, image=None, schema=None):
    image = image or ORIGIN + '/assets/og-default.jpg'
    canonical = ORIGIN + path
    schema_tag = '' if schema is None else '<script type="application/ld+json">' + json.dumps(schema, ensure_ascii=False).replace('<', '\\u003c') + '</script>'
    return f'''<!doctype html>
<html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title)} — Cestovatel69</title><meta name="description" content="{esc(description)}"><link rel="canonical" href="{canonical}">
<meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(description)}"><meta property="og:type" content="{'article' if path != '/blog/' else 'website'}"><meta property="og:url" content="{canonical}"><meta property="og:image" content="{esc(image)}">
<meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/favicon.ico">
<link rel="stylesheet" href="/assets/css/style.css?v=20261030-header"><link rel="stylesheet" href="/assets/css/language-navigation.css?v=20261030-jazyky"><link rel="stylesheet" href="/assets/css/blog.css?v=20261116">
<link rel="alternate" type="application/rss+xml" title="Cestovatel69 – Blog" href="/blog/feed.xml">{schema_tag}</head>
<body class="theme-home blog-page">{header}<main id="main">{body}</main>{footer}
<script src="/assets/js/main.js?v=20261116-blog"></script><script defer src="/assets/js/blog.js?v=20261116"></script></body></html>'''


def main():
    posts = json.loads((DATA / 'posts.json').read_text(encoding='utf-8'))
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
    if 'href="/blog/">Blog</a>' not in header:
        header = header.replace('<nav aria-label="Hlavní navigace" class="nav">', '<nav aria-label="Hlavní navigace" class="nav"><a href="/blog/" aria-current="page">Blog</a>')
    else:
        header = header.replace('href="/blog/">Blog</a>', 'href="/blog/" aria-current="page">Blog</a>')
    footer = '''<footer class="site-footer"><div class="site-footer__inner"><div>© Budinský Luděk · Cestovatel69</div><div class="footer-links"><a href="/blog/">Blog</a><a href="/blog/feed.xml">RSS</a><a href="/o-mne.html">O mně</a><a href="https://www.youtube.com/@cestovatel69" target="_blank" rel="noopener noreferrer">YouTube @cestovatel69 ↗</a></div></div></footer>'''
    categories = list(dict.fromkeys(p['category'] for p in posts))
    filters = '<button type="button" data-category="all" aria-pressed="true">Všechny články</button>' + ''.join(f'<button type="button" data-category="{esc(c)}" aria-pressed="false">{esc(c)}</button>' for c in categories)
    index_body = '''<section class="blog-intro"><p class="blog-eyebrow">Cestovatel69 · Blog</p><h1>Příběhy z cest<br>a mých projektů</h1><p>Místa mají své příběhy. Tady je najdeš spolu s videi, mapami a tipy pro vlastní cestu. Postupně přibudou i zkušenosti s aplikacemi a chytrou domácností.</p></section>'''
    index_body += f'<nav class="blog-filters" aria-label="Filtrovat články podle tématu" data-blog-filters hidden>{filters}</nav><p class="sr-only" aria-live="polite" data-blog-status></p>'
    index_body += ''.join(card(p, featured=(len(posts) == 1)) for p in posts) if len(posts) == 1 else '<div class="blog-grid">' + ''.join(card(p) for p in posts) + '</div>'
    index_body += '''<aside class="blog-related"><h2>Další příběhy a projekty</h2><p>Prohlédni si <a href="/cestovani/skryte-klenoty/">cestovatelské série na videu</a>, <a href="/cestovani/">fotografie z mých cest</a> nebo <a href="/smart-home/blog.html">vývojový deník chytré domácnosti</a>.</p><p>Nové články můžeš sledovat přes <a href="/blog/feed.xml">RSS</a>.</p></aside>'''
    blog = ROOT / 'blog'
    blog.mkdir(exist_ok=True)
    (blog / 'index.html').write_text(wrapper('Příběhy z cest a mých projektů', 'Blog Cestovatele69: příběhy míst, videa z YouTube, mapy a praktické tipy. Začínáme Hoslovickým mlýnem.', '/blog/', index_body, header, footer), encoding='utf-8')
    for post in posts:
        video = post['video_id']
        body = f'''<article class="blog-article"><header class="blog-article__header"><a class="blog-back" href="/blog/">← Všechny články</a><p class="blog-eyebrow">{esc(post['series'])} · {esc(post['category'])}</p><h1>{esc(post['title'])}</h1><div class="blog-meta"><span>Luděk · Cestovatel69</span><time datetime="{post['published']}">{date_label(post['published'])}</time><span>{post['reading_minutes']} minut čtení</span></div></header>
<div class="featured-video" data-video-id="{video}" data-title="{esc(post['video_title'])}"><button class="thumb-cover" type="button" aria-label="Přehrát video: {esc(post['video_title'])}" style="background-image:url('https://img.youtube.com/vi/{video}/maxresdefault.jpg')"></button></div>
<div class="blog-video-caption"><span>Video · {esc(post['video_duration'])} · YouTube se načte po spuštění</span><a href="https://www.youtube.com/watch?v={video}" target="_blank" rel="noopener noreferrer">Otevřít video na YouTube ↗</a></div>
<nav class="blog-resource-links" aria-label="Podklady k videu"><a href="{esc(post['map_url'])}">Místo na mapě →</a><a href="{esc(post['credits_url'])}">Autoři a licence fotografií →</a></nav>
<div class="blog-content">{(DATA / (post['slug'] + '.html')).read_text(encoding='utf-8')}</div>
<aside class="blog-related"><h2>Pokračuj v cestách s příběhem</h2><p><a href="{esc(post['project_url'])}">Prohlédnout cestovatelské série →</a></p><p><a href="https://www.youtube.com/@cestovatel69?sub_confirmation=1" target="_blank" rel="noopener noreferrer">Odebírat Cestovatel69 na YouTube ↗</a></p><a href="/blog/">Zpět na blog →</a></aside></article>'''
        schema = {'@context': 'https://schema.org', '@type': 'BlogPosting', 'headline': post['title'], 'description': post['description'], 'datePublished': post['published'], 'dateModified': post['updated'], 'inLanguage': 'cs', 'author': {'@type': 'Person', 'name': 'Luděk Budínský', 'url': ORIGIN + '/o-mne.html'}, 'mainEntityOfPage': ORIGIN + url(post), 'image': f'https://img.youtube.com/vi/{video}/maxresdefault.jpg'}
        directory = ROOT / url(post).strip('/')
        directory.mkdir(parents=True, exist_ok=True)
        (directory / 'index.html').write_text(wrapper(post['title'], post['description'], url(post), body, header, footer, schema['image'], schema), encoding='utf-8')
    # Replace the marked homepage section on repeated runs, rather than duplicating it.
    preview = '<!-- BLOG_PREVIEW_START --><section class="blog-home" aria-labelledby="blog-home-title"><div class="section-header"><p class="blog-eyebrow">Nově na blogu</p><h2 id="blog-home-title">Příběhy za videem</h2><p>Místa, souvislosti a tipy, které doplňují moje videa.</p></div>' + ''.join(card(p, featured=True, heading='h3') for p in posts[:3]) + '<p><a class="blog-card__link" href="/blog/">Všechny články →</a></p></section><!-- BLOG_PREVIEW_END -->'
    if '<!-- BLOG_PREVIEW_START -->' in home:
        home = re.sub(r'<!-- BLOG_PREVIEW_START -->.*?<!-- BLOG_PREVIEW_END -->', lambda _: preview, home, flags=re.S)
    else:
        home = home.replace('<section aria-labelledby="about-title"', preview + '\n<section aria-labelledby="about-title"', 1)
    if 'href="/assets/css/blog.css?' not in home:
        home = home.replace('</head>', '<link rel="stylesheet" href="/assets/css/blog.css?v=20261116">\n</head>')
    if "if (img.closest('.blog-card')) return;" not in home:
        home = home.replace("document.querySelectorAll('main img').forEach(function(img){", "document.querySelectorAll('main img').forEach(function(img){\n    if (img.closest('.blog-card')) return;")
    home_file.write_text(home, encoding='utf-8')
    # RSS gives readers a subscription option without introducing another account.
    rss = ET.Element('rss', version='2.0')
    channel = ET.SubElement(rss, 'channel')
    for name, value in [('title','Cestovatel69 – Blog'),('link',ORIGIN+'/blog/'),('description','Příběhy z cest a mých projektů'),('language','cs')]:
        ET.SubElement(channel,name).text = value
    for post in posts:
        item = ET.SubElement(channel,'item')
        for name, value in [('title',post['title']),('link',ORIGIN+url(post)),('description',post['description']),('guid',ORIGIN+url(post)),('pubDate',formatdate(datetime.fromisoformat(post['published']).replace(tzinfo=timezone.utc).timestamp(), usegmt=True))]:
            ET.SubElement(item,name).text = value
    ET.indent(rss, space='  ')
    ET.ElementTree(rss).write(blog/'feed.xml',encoding='utf-8',xml_declaration=True)
    print(f'Built {len(posts)} article(s), blog index, RSS and homepage preview.')


if __name__ == '__main__':
    main()
