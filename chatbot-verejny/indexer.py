from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, quote
import collections, html, json, math, re, subprocess, unicodedata, urllib.request, urllib.error, time, threading

ROOT=Path(__file__).resolve().parents[1]
INDEX=[]
STOP=set('jak jaka jake jaky kde kdo co kdy jestli jakou ktere ktera ktery kterych mam mas ma je jsou byl byla jsou jsem jsem se si to na v ve a i o do u z ze s pro po za od pri bez nebo ale ano ne tak mi me muj muj moje tvoje tvuj tam tady kde bych chci muzu jakym vice nejake jsou chtel vubec tedy tohle najdu najit povis rekni reknout teto ted toho ten vubec s nim jaky je take taky jeste tom jakeho tomuto informace najdes'.split())
def norm(t): return ''.join(c for c in unicodedata.normalize('NFD',t.lower()) if unicodedata.category(c)!='Mn')
def words(t):
 out=[]
 for word in re.findall(r'[a-z0-9]+',norm(t)):
  if len(word)<3 or word in STOP: continue
  out.append(word)
  if len(word)>=5:
   for suffix in ('skeho','skych','skou','skem','ovani','eho','ami','emi','ich','ech','ych','ove','ami','ium','ska','sko','sku','sky','ove','eni','ach','ost','ou','em','mi','ch','ka','ky','ku','in','y','a','e','o','u','i'):
    if word.endswith(suffix) and len(word)-len(suffix)>=4: out.append(word[:-len(suffix)]);break
 return out
class Extract(HTMLParser):
 def __init__(self): super().__init__();self.active=False;self.skip=0;self.parts=[];self.title='';self.intitle=False
 def handle_starttag(self,t,a):
  if t=='title':self.intitle=True
  if t=='main':self.active=True
  if self.active and t in ('script','style','nav','footer','iframe'): self.skip+=1
  if self.active and not self.skip and t=='img':
   alt=dict(a).get('alt','').strip()
   if alt:self.parts.append(' Fotografie: '+alt+' ')
  if self.active and not self.skip and t in ('p','h1','h2','h3','li','figcaption','article','section','br'):self.parts.append('\n')
 def handle_endtag(self,t):
  if t=='title':self.intitle=False
  if self.active and t in ('script','style','nav','footer','iframe') and self.skip:self.skip-=1
  if t=='main':self.active=False
 def handle_data(self,s):
  if self.intitle:self.title+=s
  if self.active and not self.skip and s.strip():self.parts.append(' '.join(s.split())+' ')
def index_site(include_html=True):
 docs=[]
 for path in ROOT.rglob('*.html') if include_html else ():
  rel=path.relative_to(ROOT); p=rel.as_posix()
  if any(x.startswith('.') or x in ('en','it','node_modules','__pycache__') for x in rel.parts) or p.startswith('nahled-'):continue
  try:
   parser=Extract();parser.feed(path.read_text(encoding='utf-8-sig',errors='replace'))
   text='\n'.join(x.strip() for x in ''.join(parser.parts).splitlines() if x.strip())
   if len(text)<60:continue
   url='/'+p[:-10] if p.endswith('index.html') else '/'+p
   title=parser.title.strip().split(' | ')[0].split(' — ')[0] or p
   chunks=[text[i:i+1900] for i in range(0,len(text),1500)]
   for chunk in chunks:
    terms=collections.Counter(words(title+' '+p.replace('/',' ')+' '+chunk)); docs.append({'title':title,'url':url,'text':chunk,'terms':terms})
  except (OSError,ValueError):continue
 # Webcams are rendered from this script, not present as HTML text.
 camera_js=(ROOT/'assets/js/italia-pocasi.js').read_text(encoding='utf-8')
 for block in ('CAMS','MORE'):
  section=re.search(r'var '+block+r' = \[(.*?)\];',camera_js,re.S)
  if not section:continue
  for line in section.group(1).splitlines():
   if '{' not in line:continue
   names=re.findall(r"(?:n:\s*(?:L\()?|d:\s*(?:L\()?|t:\s*L\()'([^']+)'",line)
   city=re.search(r"c:\s*'([^']+)'",line)
   cities={'roma':'Řím Vatikán','milano':'Milán','napoli':'Neapol','firenze':'Florencie','venezia':'Benátky','cinque':'Cinque Terre'}
   if city:names.insert(0,cities.get(city.group(1),city.group(1)))
   if not names:continue
   text='Webkamera Itálie '+ ' — '.join(names)+'. Kamera je od externího provozovatele, dostupnost se může měnit.'
   docs.append({'title':'Itálie – počasí a webkamery','url':'/cestovani/italie/pocasi-webkamery.html#webkamery','text':text,'terms':collections.Counter(words(text+' webkamery kamera'))})
 # Public structured content explicitly used by the Italian language and food pages.
 def add_dynamic(title,url,text):
  docs.append({'title':title,'url':url,'text':text,'terms':collections.Counter(words(title+' '+text))})
 data_root=ROOT/'cestovani/italie/assets/data'
 for filename,fields,label in [
  ('italian-recipes.json',('title','region','city','ingredients','methodShort','regionalNote','personalNote','cookingNote'),'Recept'),
  ('pasta-types.json',('name','type','region','bestWith','exampleDish'),'Druh těstovin'),
  ('italian-food-rules.json',('title','category','text'),'Italská kuchyně')]:
  try:
   for item in json.loads((data_root/filename).read_text(encoding='utf-8-sig')):
    if item.get('status') not in (None,'OVĚŘENO'):continue
    values=[]
    for field in fields:
     value=item.get(field)
     if isinstance(value,list):value=', '.join(str(x) for x in value if isinstance(x,str))
     if isinstance(value,str) and value.strip():values.append(value.strip())
    if values:add_dynamic(label+' – '+values[0],'/cestovani/italie/kuchyne.html',label+': '+'; '.join(values))
  except (OSError,ValueError,TypeError):pass
 try:
  # This maintained script exports its data as a CommonJS module; do not index code or secrets.
  raw=subprocess.run(['node','-e',"process.stdout.write(JSON.stringify(require('./assets/js/italian-data.js').lessons))"],cwd=ROOT,capture_output=True,check=True,timeout=15).stdout
  for lesson in json.loads(raw.decode('utf-8')):
   title=lesson.get('title',{}).get('cs','Italština');level=lesson.get('level','');note=lesson.get('note',{}).get('cs','')
   base='Lekce italštiny '+title+' ('+level+'). '+note
   add_dynamic('Italština – '+title,'/cestovani/italie/italstina/',base)
   for word in lesson.get('words',[]):
    italian=word.get('italian','');meaning=word.get('meaning',{}).get('cs','');example=word.get('example','')
    if italian and meaning:add_dynamic('Italština – '+italian,'/cestovani/italie/italstina/',base+' Slovíčko: '+italian+' znamená '+meaning+'. Příklad: '+example)
   for question in lesson.get('questions',[]):
    explanation=question.get('explanation',{}).get('cs','');prompt=question.get('prompt','')
    if explanation:add_dynamic('Italština – '+title,'/cestovani/italie/italstina/',base+' Procvičování: '+prompt+' '+explanation)
 except (OSError,subprocess.SubprocessError,ValueError,TypeError):pass
 df=collections.Counter()
 for d in docs:df.update(d['terms'].keys())
 for d in docs:d['df']=df
 return docs
