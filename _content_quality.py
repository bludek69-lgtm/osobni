"""Maintain public authorship, original-photo links and researched visit notes.

Run after a page generator: python _content_quality.py. Does not change releases,
remove pages, fabricate first-hand experiences or submit anything to AdSense.
"""
from pathlib import Path
from html import escape
import json
import re
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent
NOTES = json.loads((ROOT / '_data/blog/visit-notes.json').read_text(encoding='utf-8'))
LABELS = {
 'cs': {'photo':'Z mého fotografického archivu', 'album':'Celé album a další fotografie →', 'author':'Autor a podklady', 'bio':'Článek připravil Luděk Budinský, autor webu a kanálu Cestovatel69. Fotografie označené jako vlastní pocházejí z mého archivu. U převzatých podkladů jsou autorství a licence uvedené v odkazovaných zdrojích.', 'about':'O autorovi', 'contact':'Kontakt a opravy', 'privacy':'Soukromí', 'update':'Praktické doplnění', 'date':'18. 11. 2026', 'more':'Článek, vlastní video a plán návštěvy →', 'place':'Více než stručný přehled místa', 'placecopy':'K tomuto místu je k dispozici také podrobnější příběh s vlastním videem. Navazuje na něj fotografický archiv; pro výběr zastávek otevři celý článek.', 'how':'Jak vzniká obsah webu', 'process':'Cestovatelský blog spojuje moje videozáznamy a fotografie s vysvětlením míst a návrhy pro vlastní výlet. U videí sestavených z fotografických podkladů jsou zdroje uvedené samostatně. Návrhy tras rozlišuji od osobního záznamu cesty; praktické informace doplňuji podle správců památek a uvádím datum, pokud byly nově ověřené. Starší fotografie nejsou dokladem dnešních cen, provozu nebo přístupnosti.', 'contactcopy':'Pro dotazy k článkům, upozornění na chybu nebo dotazy k soukromí napiš na', 'contactend':'Připoj prosím adresu stránky a popis, co je potřeba upřesnit. Web provozuji jako osobní projekt.'},
 'en': {'photo':'From my photographic archive', 'album':'Full album and more photographs →', 'author':'Author and sources', 'bio':'Prepared by Luděk Budinský, creator of this website and the Cestovatel69 channel. Photographs marked as my own come from my archive. Credits and licences for third-party materials are listed in the linked source pages.', 'about':'About the author', 'contact':'Contact and corrections', 'privacy':'Privacy', 'update':'Practical update', 'date':'18 November 2026', 'more':'Article, original video and visit planning →', 'place':'Beyond a brief introduction', 'placecopy':'A more detailed story with my own video is available for this destination. The photographic archive accompanies it; open the full article to choose your stops.', 'how':'How this website is made', 'process':'The travel blog combines my videos and photographs with context about places and suggestions for your own trip. Videos assembled from photographic source material have separate credit pages. Suggested routes are distinguished from personal travel records. Practical details are based on official operators, with a date when newly checked. Older photographs do not establish today’s prices, opening arrangements or accessibility.', 'contactcopy':'For questions about articles, corrections or privacy, email', 'contactend':'Please include the page address and what needs clarification. I run this website as a personal project.'},
 'it': {'photo':'Dal mio archivio fotografico', 'album':'Album completo e altre fotografie →', 'author':'Autore e fonti', 'bio':'Articolo a cura di Luděk Budinský, autore del sito e del canale Cestovatel69. Le fotografie indicate come personali provengono dal mio archivio. Autori e licenze dei materiali di terzi sono elencati nelle pagine delle fonti collegate.', 'about':'L’autore', 'contact':'Contatti e correzioni', 'privacy':'Privacy', 'update':'Aggiornamento pratico', 'date':'18 novembre 2026', 'more':'Articolo, video originale e organizzazione della visita →', 'place':'Oltre una breve presentazione', 'placecopy':'Per questa destinazione è disponibile un racconto più dettagliato con un mio video. L’archivio fotografico lo accompagna; apri l’articolo completo per scegliere le tappe.', 'how':'Come nasce il contenuto del sito', 'process':'Il blog di viaggio unisce i miei video e le mie fotografie al contesto dei luoghi e a proposte per organizzare un viaggio. I video realizzati con materiali fotografici hanno pagine separate con le fonti. Distinguo gli itinerari proposti dai ricordi personali. Le informazioni pratiche si basano sui gestori ufficiali e riportano la data quando vengono nuovamente verificate. Le fotografie storiche non documentano prezzi, apertura o accessibilità attuali.', 'contactcopy':'Per domande sugli articoli, correzioni o privacy scrivi a', 'contactend':'Indica l’indirizzo della pagina e cosa occorre chiarire. Gestisco il sito come progetto personale.'}
}
# Albums on these pages explicitly identify these photographs as the owner's archive.
PHOTOS = {
 'pisa': ('cestovani/italie/toskansko/index.html', 'album-3'),
 'siena': ('cestovani/italie/toskansko/index.html', 'album-4'),
 'montepulciano': ('cestovani/italie/toskansko/index.html', 'album-5'),
 'saturnia-bagni-san-filippo': ('cestovani/italie/toskansko/index.html', 'album-6'),
 'spiagge-bianche': ('cestovani/italie/toskansko/index.html', 'album-8'),
 'toskansko-vsemi-smysly': ('cestovani/italie/toskansko/index.html', 'album-1'),
 'neapol': ('cestovani/italie/jih/index.html', 'album-1'),
 'amalfi': ('cestovani/italie/jih/index.html', 'album-2'),
 'positano': ('cestovani/italie/jih/index.html', 'album-3'),
 'pompeje': ('cestovani/italie/jih/index.html', 'album-4'),
 'vesuv': ('cestovani/italie/jih/index.html', 'album-5'),
 'benatky': ('cestovani/italie/benatky/index.html', 'album-4')
}

def prefix(lang):
 return '' if lang == 'cs' else '/' + lang

def strip_blocks(text):
 return re.sub(r'<!-- QUALITY_[A-Z]+_START -->.*?<!-- QUALITY_[A-Z]+_END -->\s*', '', text, flags=re.S)

def photo_block(slug, lang):
 if slug not in PHOTOS: return ''
 file, anchor = PHOTOS[slug]
 album_file = ROOT / (prefix(lang).lstrip('/') + '/' if lang != 'cs' else '') / file
 soup = BeautifulSoup(album_file.read_text(encoding='utf-8'), 'html.parser')
 section = soup.find(id=anchor)
 img = section.find('img')
 # Reuse the existing source and its translated alt, never claim library photos.
 attrs = {k: img.get(k) for k in ('src', 'alt', 'width', 'height') if img.get(k)}
 attrs.update(loading='lazy', decoding='async')
 image = '<img ' + ' '.join(f'{k}="{escape(v, quote=True)}"' for k,v in attrs.items()) + '>'
 label = LABELS[lang]
 album = prefix(lang) + '/' + file.removesuffix('index.html') + '#' + anchor
 return f'<!-- QUALITY_PHOTO_START --><figure class="blog-archive-photo">{image}<figcaption>{label["photo"]} · <a href="{album}">{label["album"]}</a></figcaption></figure><!-- QUALITY_PHOTO_END -->'

def enrich_article_body(slug, lang, body):
 body = strip_blocks(body).rstrip() + '\n'
 note = NOTES.get(slug, {}).get(lang)
 if note:
  body += f'\n<!-- QUALITY_VISIT_START --><section class="blog-visit-notes" id="plan-navstevy">{note}</section><!-- QUALITY_VISIT_END -->'
 body += photo_block(slug, lang)
 lab=LABELS[lang]; base=prefix(lang)
 body += f'<!-- QUALITY_AUTHOR_START --><aside class="blog-author"><h2>{lab["author"]}</h2><p>{lab["bio"]}</p><p><a href="{base}/o-mne.html">{lab["about"]}</a> · <a href="{base}/o-mne.html#kontakt">{lab["contact"]}</a></p></aside><!-- QUALITY_AUTHOR_END -->'
 return body

def static_footer(text, lang):
 lab=LABELS[lang]; base=prefix(lang)
 def replace(match):
  inner=match[2]
  for url,label in [(base+'/o-mne.html',lab['about']),(base+'/o-mne.html#kontakt',lab['contact']),(base+'/soukromi/',lab['privacy'])]:
   if not re.search(r'href=[\"\']'+re.escape(url)+r'[\"\']',inner):inner+=f'<a href="{url}">{label}</a>'
  return match[1]+inner+match[3]
 pattern=r'(<(?:div|nav)\b[^>]*class="[^\"]*\bfooter-links\b[^\"]*"[^>]*>)(.*?)(</(?:div|nav)>)'
 text,count=re.subn(pattern,replace,text,flags=re.S)
 if not count and '</footer>' in text and 'class="quality-footer-links"' not in text:
  links=' · '.join(f'<a href="{base+url}">{lab[label]}</a>' for url,label in [('/o-mne.html','about'),('/o-mne.html#kontakt','contact'),('/soukromi/','privacy')])
  text=text.replace('</footer>',f'<nav class="quality-footer-links" aria-label="{lab["contact"]}" style="text-align:center;padding:1rem">{links}</nav></footer>',1)
 return text

def enrich_page(file, text):
 name=file.relative_to(ROOT).as_posix()
 lang=name.split('/')[0] if name.startswith(('en/','it/')) else 'cs'
 local=name[3:] if lang!='cs' else name
 if local.startswith('aplikace/'): return text  # Release-owned download pages are untouched.
 lab=LABELS[lang];base=prefix(lang)
 if re.fullmatch(r'blog/[^/]+/index.html',local):
  slug=local.split('/')[1]
  # Standard layout and the existing photo-essay layout have distinct containers.
  pat = r'(<div class="blog-content">)(.*?)(</div>\s*<aside class="blog-related")'
  if 'class="editorial-article-content"' in text:
   pat=r'(<div class="editorial-article-content">)(.*?)(</div>\s*<section\b[^>]*\bclass="editorial-film")'
  text,n=re.subn(pat,lambda m:m[1]+enrich_article_body(slug,lang,m[2])+m[3],text,count=1,flags=re.S)
  if n!=1:raise ValueError('Unrecognised article layout: '+name)
  if slug in NOTES or slug in PHOTOS:
   text=re.sub(r'("dateModified"\s*:\s*")([^"]+)',lambda m:m[1]+max(m[2],'2026-11-18'),text)
  if slug in NOTES:
   body=BeautifulSoup((ROOT/'_data/blog'/f'{slug}.html').read_text(encoding='utf-8')+NOTES[slug][lang],'html.parser').get_text(' ',strip=True)
   minutes=max(1,round(len(re.findall(r'\w+',body))/200))
   label=(f'{minutes} '+('minuta' if minutes==1 else 'minuty' if minutes<5 else 'minut')+' čtení') if lang=='cs' else (f'{minutes} min read' if lang=='en' else f'{minutes} min di lettura')
   text=re.sub(r'(<div class="blog-meta">.*?<time\b[^>]*>.*?</time>\s*<span>).*?(</span>)',lambda m:m[1]+label+m[2],text,count=1,flags=re.S)
 if local=='o-mne.html':
  text=strip_blocks(text)
  block=f'<!-- QUALITY_CONTACT_START --><section class="prose" id="jak-vznika-obsah"><h2>{lab["how"]}</h2><p>{lab["process"]}</p></section><section class="prose" id="kontakt"><h2>{lab["contact"]}</h2><p>{lab["contactcopy"]} <a href="mailto:cestovatel1969@gmail.com">cestovatel1969@gmail.com</a>.</p><p>{lab["contactend"]}</p><p><a href="{base}/soukromi/">{lab["privacy"]} →</a></p></section><!-- QUALITY_CONTACT_END -->'
  text=text.replace('</main>',block+'</main>',1)
 if re.fullmatch(r'cestovani/italie/mista/(?:pisa|benatky|pompeje|neapol)/index.html',local):
  text=strip_blocks(text); slug=local.split('/')[-2]
  block=f'<!-- QUALITY_PLACE_START --><section class="place-block"><h2>{lab["place"]}</h2><p>{lab["placecopy"]}</p><p><a href="{base}/blog/{slug}/">{lab["more"]}</a></p></section><!-- QUALITY_PLACE_END -->'
  text=text.replace('</main>',block+'</main>',1)
 return re.sub(r'/assets/css/blog\.css\?[^"\s]+','/assets/css/blog.css?v=20261118-quality1',static_footer(text,lang))

def main():
 changed=[]
 for file in ROOT.rglob('*.html'):
  rel=file.relative_to(ROOT)
  if any(p.startswith(('_','.')) for p in rel.parts) or 'demo' in rel.parts:continue
  raw=file.read_text(encoding='utf-8');new=enrich_page(file,raw)
  if new!=raw:file.write_text(new,encoding='utf-8');changed.append(rel.as_posix())
 # Keep truthful modification dates without changing publication dates.
 posts_file=ROOT/'_data/blog/posts.json'; posts=json.loads(posts_file.read_text(encoding='utf-8'))
 for post in posts:
  if post['slug'] in NOTES or post['slug'] in PHOTOS:post['updated']=max(post['updated'],'2026-11-18')
  if post['slug'] in NOTES:
   body=BeautifulSoup((ROOT/'_data/blog'/f'{post["slug"]}.html').read_text(encoding='utf-8')+NOTES[post['slug']]['cs'],'html.parser').get_text(' ',strip=True)
   post['reading_minutes']=max(1,round(len(re.findall(r'\w+',body))/200))
 posts_file.write_text(json.dumps(posts,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 tree=ET.parse(ROOT/'sitemap.xml');ns='{http://www.sitemaps.org/schemas/sitemap/0.9}'
 for entry in tree.getroot():
  loc=entry.find(ns+'loc')
  if loc is None:continue
  path=loc.text.removeprefix('https://cestovatel69.cz').strip('/')
  key=path+'/index.html' if '.' not in path.split('/')[-1] else path
  content_key=re.sub(r'^(?:en|it)/','',key)
  content_changed=(content_key=='o-mne.html' or content_key.startswith('blog/') and content_key!='blog/index.html' or re.fullmatch(r'cestovani/italie/mista/(?:pisa|benatky|pompeje|neapol)/index.html',content_key))
  if key in changed and content_changed:
   mod=entry.find(ns+'lastmod')
   if mod is None:mod=ET.SubElement(entry,ns+'lastmod')
   mod.text=max(mod.text or '', '2026-11-18')
 tree.write(ROOT/'sitemap.xml',encoding='utf-8',xml_declaration=True)
 print(f'Updated {len(changed)} public pages; {len(NOTES)} researched/planning supplements, {len(PHOTOS)} original photo connections per language.')

if __name__=='__main__':main()
