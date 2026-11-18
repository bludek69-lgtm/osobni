"""Check the actual public pages and local links; does not predict AdSense approval."""
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urlsplit, urljoin, unquote
import json
import re
import sys
import xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parent
ORIGIN='https://cestovatel69.cz'
pages={}; failures=[]; references=0; summaries={}
for file in ROOT.rglob('*.html'):
 relative=file.relative_to(ROOT)
 if any(p.startswith(('_','.')) for p in relative.parts):continue
 pages[relative.as_posix()]=BeautifulSoup(file.read_text(encoding='utf-8'),'html.parser')

def resolve(url):
 path=unquote(urlsplit(url).path).lstrip('/')
 if not path or (ROOT/path).is_dir():path=path.rstrip('/')+'/index.html' if path else 'index.html'
 return path

for name,soup in pages.items():
 if '/demo/' in '/'+name:continue
 for element in soup.select('[href],[src]'):
  reference=element.get('href') or element.get('src')
  url=urlsplit(urljoin(ORIGIN+'/'+name,reference))
  if url.hostname!='cestovatel69.cz' or url.scheme not in ('http','https'):continue
  references+=1; destination=resolve(url.geturl())
  if not (ROOT/destination).is_file():failures.append([name,reference,'missing local file']);continue
  fragment=unquote(url.fragment)
  if fragment and destination in pages and not pages[destination].find(id=fragment) and not pages[destination].find(attrs={'name':fragment}):
   failures.append([name,reference,'missing anchor'])
 if re.fullmatch(r'(?:(?:en|it)/)?blog/[^/]+/index.html',name):
  for selector in ('.blog-author','[data-video-id]','a[href$="/o-mne.html#kontakt"]','a[href$="/soukromi/"]'):
   if not soup.select_one(selector):failures.append([name,selector,'missing article feature'])
  for selector in ('.blog-author','.blog-visit-notes','.blog-archive-photo'):
   if len(soup.select(selector))>1:failures.append([name,selector,'duplicated content block'])
  main=soup.select_one('.blog-content, .editorial-article-content')
  if main:summaries[name]={'words':len(re.findall(r'\w+',main.get_text(' ',strip=True))),'visitNotes':bool(soup.select_one('.blog-visit-notes')),'originalPhoto':bool(soup.select_one('.blog-archive-photo'))}
ns='{http://www.sitemaps.org/schemas/sitemap/0.9}'
entries=ET.parse(ROOT/'sitemap.xml').getroot().findall(ns+'url')
for entry in entries:
 url=entry.findtext(ns+'loc','');name=resolve(url)
 if name not in pages:failures.append(['sitemap.xml',url,'missing HTML'])
 elif pages[name].select_one('meta[name="robots"][content*="noindex"],meta[http-equiv="refresh" i]'):
  failures.append(['sitemap.xml',url,'noindex or redirect included'])
report={'htmlPages':len(pages),'sitemapEntries':len(entries),'localReferences':references,'articles':summaries,'failures':failures}
(ROOT.parent/'adsense-quality-link-audit-20261118.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(f'{len(pages)} HTML pages, {len(entries)} sitemap entries, {references} local references, {len(summaries)} articles; {len(failures)} failures.')
for problem in failures[:30]:print(problem)
sys.exit(bool(failures))
