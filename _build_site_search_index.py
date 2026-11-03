"""Build the public, offline-searchable snapshot from sitemap entries.

This deliberately indexes public main content only, never worktrees, drafts,
the chatbot, or demo data. Rebuild after editing content and commit the result.
"""
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urlsplit, unquote
import json, re, subprocess, sys, xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parent
records=[]
for node in ET.parse(ROOT/'sitemap.xml').iter():
 if not node.tag.endswith('loc') or not node.text: continue
 url=urlsplit(node.text); path=unquote(url.path).lstrip('/'); file=ROOT/path
 if file.is_dir():file=file/'index.html'
 if not file.is_file() or file.suffix.lower()!='.html' or '/demo/' in url.path:continue
 soup=BeautifulSoup(file.read_text(encoding='utf8',errors='replace'),'html.parser')
 if soup.select_one('meta[name=robots][content*=noindex]') or not soup.main:continue
 lang=(soup.html.get('lang','cs') if soup.html else 'cs').split('-')[0]
 if lang not in ('cs','en','it'):continue
 main=soup.main
 for tag in main.select('script,style,nav,footer,iframe,svg,template,[aria-hidden=true]'):tag.decompose()
 title=(main.find('h1') or soup.title)
 title=title.get_text(' ',strip=True) if title else path
 current={'title':title,'section':'','url':url.path,'lang':lang,'text':''}
 def save():
  text=re.sub(r'\s+',' ',current['text']).strip()
  if len(text)>=24:
   for offset in range(0,len(text),1000):
    chunk=text[offset:offset+1200].strip()
    if len(chunk)>=24:records.append({**current,'text':chunk})
 for tag in main.find_all(['h1','h2','h3','p','li','figcaption']):
  if tag.find_parent(['p','li','figcaption']):continue
  if tag.name in ('h1','h2','h3'):
   save(); section=tag.get_text(' ',strip=True)
   anchor=tag.get('id') or next((x.get('id') for x in tag.parents if x is not main and x.name in ('section','article') and x.get('id')),None)
   current={'title':title,'section':section,'url':url.path+('#'+anchor if anchor else ''),'lang':lang,'text':''}
  else:current['text']+=' '+tag.get_text(' ',strip=True)
 save()

# Dynamic food content is explicitly public, reviewed structured data.
for filename,fields,label in [('italian-recipes.json',('title','region','city','ingredients','regionalNote'),'Recept'),('pasta-types.json',('name','type','region','bestWith','exampleDish'),'Druh těstovin'),('italian-food-rules.json',('title','category','text'),'Italská kuchyně')]:
 path=ROOT/'cestovani/italie/assets/data'/filename
 if not path.exists():continue
 for item in json.loads(path.read_text(encoding='utf-8-sig')):
  if item.get('status') not in (None,'OVĚŘENO'):continue
  vals=[]
  for key in fields:
   v=item.get(key)
   if isinstance(v,list):v=', '.join(str(x) for x in v if isinstance(x,str))
   if isinstance(v,str) and v.strip():vals.append(v.strip())
  if vals:records.append({'title':label+' – '+vals[0],'section':'','url':'/cestovani/italie/kuchyne.html','lang':'cs','text':'; '.join(vals)})

# Webcams and language lessons are rendered by JavaScript on public pages.
cameras=(ROOT/'assets/js/italia-pocasi.js').read_text(encoding='utf8')
for block in ('CAMS','MORE'):
 section=re.search(r'var '+block+r' = \[(.*?)\];',cameras,re.S)
 if not section:continue
 for line in section.group(1).splitlines():
  if '{' not in line:continue
  names=re.findall(r"(?:n:\s*(?:L\()?|d:\s*(?:L\()?|t:\s*L\()'([^']+)'",line)
  city=re.search(r"c:\s*'([^']+)'",line)
  if city:names.insert(0,{'roma':'Řím Vatikán','milano':'Milán','napoli':'Neapol','firenze':'Florencie','venezia':'Benátky','cinque':'Cinque Terre'}.get(city.group(1),city.group(1)))
  if names:records.append({'title':'Itálie – počasí a webkamery','section':'','url':'/cestovani/italie/pocasi-webkamery.html#webkamery','lang':'cs','text':'Webkamera '+ ' — '.join(names)})
try:
 raw=subprocess.run(['node','-e',"process.stdout.write(JSON.stringify(require('./assets/js/italian-data.js').lessons))"],cwd=ROOT,capture_output=True,check=True,timeout=15).stdout
 for lesson in json.loads(raw.decode('utf8')):
  for language in ('cs','en'):
   title=lesson.get('title',{}).get(language) or lesson.get('title',{}).get('cs','Italština')
   words=[]
   for word in lesson.get('words',[]):
    italian=word.get('italian','');meaning=word.get('meaning',{}).get(language,'')
    if italian and meaning:words.append(italian+' – '+meaning)
   if words:records.append({'title':title,'section':'','url':('/' if language=='cs' else '/'+language+'/')+'cestovani/italie/italstina/','lang':language,'text':' · '.join(words)})
except (OSError,subprocess.SubprocessError,ValueError,TypeError):
 print('Warning: language lesson data could not be indexed.')

out=ROOT/'assets/data/site-search-index.json';out.parent.mkdir(parents=True,exist_ok=True)
data=json.dumps({'documents':records},ensure_ascii=False,separators=(',',':'))
if '--check' in sys.argv:
 if not out.exists() or out.read_text(encoding='utf8')!=data:raise SystemExit('Search index is stale: run python _build_site_search_index.py')
else:out.write_text(data,encoding='utf8')
assert any('pienza' in x['text'].lower() for x in records)
print(f'{len(records)} search sections; {out.stat().st_size:,} bytes')
