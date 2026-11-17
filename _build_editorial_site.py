"""Local editorial migration; source snapshots and translation memory stay outside the site.

The existing HTML is authoritative. This tool preserves its content and behaviour,
applies the approved stylesheet, and builds complete parallel language pages.
It never commits, pushes, deploys, or calls the obsolete page generators.
"""
from pathlib import Path
from bs4 import BeautifulSoup, NavigableString, Comment, Doctype
from urllib.parse import urlsplit, urlunsplit, urljoin, urlencode
import argparse, concurrent.futures, hashlib, json, re, shutil, subprocess, time
import urllib.error
import urllib.request, xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent
STATE = ROOT.parent / 'reports' / 'editorial-migration-20261117'
ORIGINAL = STATE / 'original'
LANGS = ('cs', 'en', 'it')
SITE = 'https://cestovatel69.cz'
VERSION = '20261117-editorial'
CONSENT_VERSION = '20261117-adsense'
SKIP = {'script', 'style', 'code', 'pre', 'kbd', 'samp', 'math', 'template'}
ATTRS = ('alt', 'title', 'aria-label', 'placeholder', 'data-title')
COPY_EDITS={
 'vnímat nejen památku samotnou, ale i její okolí':'vnímat památku samotnou i její okolí',
 'zastavit se nejen u otázky „kdo to vynalezl“, ale i u toho':'zastavit se u otázky „kdo to vynalezl“ i u toho',
 'sledovat nejen jednotlivé domy, ale také samotné stoupání':'sledovat jednotlivé domy i samotné stoupání',
 'místo práce, skladování a obchodování, nejen vyhlídka':'místo práce, skladování a obchodování i vyhlídka',
 'sledovat nejen lidi ve vodě, ale hlavně způsob':'sledovat lidi ve vodě i způsob',
 'všímat nejen nejsvětlejšího pruhu pláže, ale i přechodu':'všímat nejsvětlejšího pruhu pláže i přechodu',
 'zakazuje nejen vyhledávání, ale i detail inzerátu':'zakazuje vyhledávání i detail inzerátu',
 'Průsvitka tak připomíná konkrétní dochovanou stopu výroby, nejen datum napsané na informační tabuli.':'Průsvitka je dochovanou stopou výroby, která dává uvedenému datu konkrétní význam.',
}
MANUAL = {
 'en': {
  'Apulie':'Apulia','Basilicata':'Basilicata','Furlansko':'Friuli Venezia Giulia','Ligurie':'Liguria',
  'Lombardie':'Lombardy','Piemont':'Piedmont','Sardinie':'Sardinia','Sicílie':'Sicily',
  'Toskánsko':'Tuscany','Umbrie':'Umbria','Abruzzo':'Abruzzo','Lazio':'Lazio',
  'Z kabiny autobusu': 'From the bus cab', 'do kódu': 'to code',
  'Z kabiny autobusu do kódu': 'From the bus cab to code',
  'Přestavba dodávky': 'Camper van conversion', 'Hledání dodávky': 'Finding a van',
  'Černý les': 'Black Forest', 'Kampánie': 'Campania', 'Marche': 'Marche', 'Benátsko': 'Veneto',
  'Skryté klenoty': 'Hidden gems', 'Místa jako z pohádky': 'Places like a fairytale',
  'Cesty s příběhem': 'Journeys with a story', 'Blog z cest': 'Travel blog',
  'Domů': 'Home', 'Moje aplikace': 'My apps', 'Cestování': 'Travel', 'Itálie': 'Italy',
  'Rybaření': 'Fishing', 'Užitečné odkazy': 'Useful links', 'Hledat': 'Search',
  'O mně': 'About me', 'Přeskočit na obsah': 'Skip to content',
 },
 'it': {
  'Apulie':'Puglia','Basilicata':'Basilicata','Furlansko':'Friuli Venezia Giulia','Ligurie':'Liguria',
  'Lombardie':'Lombardia','Piemont':'Piemonte','Sardinie':'Sardegna','Sicílie':'Sicilia',
  'Toskánsko':'Toscana','Umbrie':'Umbria','Abruzzo':'Abruzzo','Lazio':'Lazio',
  'Z kabiny autobusu': 'Dalla cabina dell’autobus', 'do kódu': 'al codice',
  'Z kabiny autobusu do kódu': 'Dalla cabina dell’autobus al codice',
  'Přestavba dodávky': 'Conversione di un furgone camper', 'Hledání dodávky': 'Cercare un furgone',
  'Černý les': 'Foresta Nera', 'Kampánie': 'Campania', 'Marche': 'Marche', 'Benátsko': 'Veneto',
  'Skryté klenoty': 'Tesori nascosti', 'Místa jako z pohádky': 'Luoghi da fiaba',
  'Cesty s příběhem': 'Viaggi con una storia', 'Blog z cest': 'Blog di viaggio',
  'Domů': 'Home', 'Moje aplikace': 'Le mie app', 'Cestování': 'Viaggi', 'Itálie': 'Italia',
  'Rybaření': 'Pesca', 'Užitečné odkazy': 'Link utili', 'Hledat': 'Cerca',
  'O mně': 'Chi sono', 'Přeskočit na obsah': 'Vai al contenuto',
 }
}
for _lang in ('en','it'):
 MANUAL[_lang].update({name:name for name in ['Cestovatel69','CESTOVATEL69','Budinský Luděk','Luděk Budinský','Luděk','BudLine Panel','Homey Pro 2026','Portfolio Tracker','Italia Travel Planner','AUTO VÝBĚR','Smart Home','Config Center','Resident Auditor','App Tester']})
 MANUAL[_lang].update({name:name for name in ['CS','EN','IT','AI','API','JSON','HTML','CSS','SVG','MQTT','ESP32','USB','Wi-Fi','Zigbee','Z-Wave','Matter']})
MANUAL['en']['© Budinský Luděk · Osobní web']='© Budinský Luděk · Personal website'
MANUAL['it']['© Budinský Luděk · Osobní web']='© Budinský Luděk · Sito personale'
_intro='Jsem Luděk. Jezdím autobusem, fotím na cestách a ve volném čase tvořím vlastní aplikace. Nějaký čas jsem pobýval v italském Lerici. Tady najdeš moje cesty a projekty.'
MANUAL['en'][_intro]='I’m Luděk. I drive buses, take photographs on my travels and build my own apps in my spare time. I spent some time living in Lerici, Italy. This website brings together my travels and projects.'
MANUAL['it'][_intro]='Sono Luděk. Guido autobus, fotografo durante i miei viaggi e nel tempo libero sviluppo le mie app. Per un periodo ho vissuto a Lerici. Qui raccolgo i miei viaggi e i miei progetti.'
MANUAL['en']['Vybrat cestu →']='Explore my travels →'
MANUAL['it']['Vybrat cestu →']='Scopri i miei viaggi →'
MANUAL['en'].update({'Originál fotografie':'Original photograph','podmínky licence':'licence terms'})
MANUAL['it'].update({'Originál fotografie':'Fotografia originale','podmínky licence':'condizioni della licenza'})
for _number in ('02','03','12','13','15','22','26','31'):
 MANUAL['en']['Rochemenier – fotografie '+_number]='Rochemenier – photograph '+_number
 MANUAL['it']['Rochemenier – fotografie '+_number]='Rochemenier – fotografia '+_number
for _lang in ('en','it'):
 MANUAL[_lang].update({'GIUSEPPE':'GIUSEPPE','WC':'WC'})
 for _count in (4,5,6,7,14,19):MANUAL[_lang][str(_count)+' zařízení']=str(_count)+(' devices' if _lang=='en' else ' dispositivi')
MANUAL['en'].update({'Přehledná mapa Itálie s očíslovanými regiony':'Map of Italy with numbered regions','Půdorys bytu se 7 klikacími zónami':'Apartment floor plan with seven interactive zones','Robot vysavač Giuseppe':'Giuseppe robot vacuum','VSTUP':'ENTRANCE','● ready · battery 87%':'● ready · battery 87%'})
MANUAL['it'].update({'Přehledná mapa Itálie s očíslovanými regiony':'Mappa dell’Italia con le regioni numerate','Půdorys bytu se 7 klikacími zónami':'Planimetria dell’appartamento con sette zone interattive','Robot vysavač Giuseppe':'Robot aspirapolvere Giuseppe','VSTUP':'INGRESSO','● ready · battery 87%':'● pronto · batteria 87%'})
MANUAL['en'].update({'Upozornění':'Alerts','Výplatní pásky':'Payslips','Výplatní pásky Demo s.r.o.':'Payslips — Demo s.r.o.','Daňové prahy':'Tax thresholds','Daňové prahy 2026 — ukázka':'2026 tax thresholds — sample data','Využití modelového limitu krypta':'Usage of the sample crypto threshold','Semafory':'Status indicators','Čistá mzda':'Net pay','Hrubá mzda':'Gross pay','Detail výplatních pásek':'Payslip details','Přehled po měsících':'Monthly overview','Souhrn podle let — pouze vybrané měsíce':'Annual totals for the selected months','Předpovědi':'Projections','Daňové přiznání':'Tax return','Roční přehled':'Annual overview','Účetní kniha':'Accounting ledger'})
MANUAL['it'].update({'Upozornění':'Avvisi','Výplatní pásky':'Buste paga','Výplatní pásky Demo s.r.o.':'Buste paga — Demo s.r.o.','Daňové prahy':'Soglie fiscali','Daňové prahy 2026 — ukázka':'Soglie fiscali 2026 — dati di esempio','Využití modelového limitu krypta':'Utilizzo della soglia d’esempio per le criptovalute','Semafory':'Indicatori di stato','Čistá mzda':'Retribuzione netta','Hrubá mzda':'Retribuzione lorda','Detail výplatních pásek':'Dettaglio delle buste paga','Přehled po měsících':'Riepilogo mensile','Souhrn podle let — pouze vybrané měsíce':'Totali annuali per i mesi selezionati','Předpovědi':'Proiezioni','Daňové přiznání':'Dichiarazione dei redditi','Roční přehled':'Riepilogo annuale','Účetní kniha':'Libro contabile'})
MANUAL['en'].update({'Krypto':'Crypto','Krypto — modelový roční přehled':'Crypto — sample annual overview','Rozdělení majetku':'Asset allocation','Cashflow měsíčně':'Monthly cash flow','Podklady k povinnosti podat přiznání':'Tax return filing requirements — supporting data','Víceletý plán z ukázkových dat':'Multi-year example plan','Příjmy':'Income','Výdaje':'Expenses','Pohledávky':'Receivables','Závazky':'Liabilities','Zůstatek':'Balance','let':'years','rok':'year','roky':'years','roků':'years','den':'day','dny':'days','dnů':'days','Kč':'CZK','Kc':'CZK'})
MANUAL['it'].update({'Krypto':'Criptovalute','Krypto — modelový roční přehled':'Criptovalute — riepilogo annuo di esempio','Rozdělení majetku':'Composizione del patrimonio','Cashflow měsíčně':'Flusso di cassa mensile','Podklady k povinnosti podat přiznání':'Obbligo di dichiarazione: dati di supporto','Víceletý plán z ukázkových dat':'Piano pluriennale di esempio','Příjmy':'Entrate','Výdaje':'Uscite','Pohledávky':'Crediti','Závazky':'Debiti','Zůstatek':'Saldo','let':'anni','rok':'anno','roky':'anni','roků':'anni','den':'giorno','dny':'giorni','dnů':'giorni','Kč':'CZK','Kc':'CZK'})
for _lang in ('en','it'):
 MANUAL[_lang].update({code:code for code in ['CZK','EUR','USD','GBP','CHF','NOK','SEK','PLN']})

def prepare_cache(cache):
 """Keep personal names and region names out of generic machine translations."""
 identities=json.loads((ROOT/'_editorial/credit-identities.json').read_text(encoding='utf8'))
 overrides=json.loads((ROOT/'_editorial/translation-overrides.json').read_text(encoding='utf8'))
 for lang in ('en','it'):
  # A photographer's name or Commons username is an attribution, not prose.
  aliases={name:cache[lang].get(name,name) for name in identities}
  cache[lang].update(MANUAL[lang]);cache[lang].update(overrides[lang])
  for src,dst in list(cache[lang].items()):
   for name,alias in aliases.items():
    if name in src and alias!=name and len(alias)>=3:
     dst=re.sub(r'(?<!\w)'+re.escape(alias)+r'(?!\w)',lambda _:name,dst)
   if src in identities:dst=src
   if lang=='it' and re.fullmatch(r'Video · [\d:]+ · YouTube se načte po spuštění',src):dst=src.replace('YouTube se načte po spuštění','YouTube viene caricato all’avvio')
   if 'cestovatel69' in src.lower():
    dst=re.sub(r'\b(?:travell?er|viaggiatore)69\b','Cestovatel69',dst,flags=re.I)
   if 'Luděk' in src:dst=re.sub(r'\b(?:Ludek|Ludwig)\b','Luděk',dst)
   if 'Budinský' in src:dst=re.sub(r'\bBudinsky\b','Budinský',dst)
   if 'AUTO VÝBĚR' in src:dst=re.sub(r'\b(?:CAR SELECTION|AUTO SELECTION|SELEZIONE AUTO|SCELTA AUTO|CAR CHOICE)\b','AUTO VÝBĚR',dst,flags=re.I)
   if re.search(r'Kampáni',src):dst=re.sub(r'\b(?:Campaign|Campagna)\b','Campania',dst,flags=re.I)
   if 'Marche' in src:dst=re.sub(r'\b(?:Brands|Marche commerciali)\b','Marche',dst,flags=re.I)
   if re.search(r'Benátsk',src) and 'Furlansko' not in src:
    ss=re.split(r'(?<=[.!?])\s+',src);dd=re.split(r'(?<=[.!?])\s+',dst)
    if len(ss)==len(dd):
     for i,part in enumerate(ss):
      if 'Benátsk' in part:dd[i]=re.sub(r'\b(?:Venice|Venezia)\b','Veneto',dd[i],count=1)
     dst=' '.join(dd)
    elif not re.search(r'Benátk',src):dst=re.sub(r'\b(?:Venice|Venezia)\b','Veneto',dst)
   if 'podrobný průvodce' in src.lower():dst=dst.replace('step-by-step guide','detailed guide').replace('guida passo passo','guida dettagliata')
   cache[lang][src]=dst
 return cache

def read_json(p, default=None):
 return json.loads(p.read_text(encoding='utf-8')) if p.exists() else default

def write_json(p, data):
 p.parent.mkdir(parents=True, exist_ok=True)
 tmp=p.with_suffix('.tmp'); tmp.write_text(json.dumps(data,ensure_ascii=False,indent=1),encoding='utf-8'); tmp.replace(p)

def normalize(t):
 return re.sub(r'\s+', ' ', str(t)).strip()

def translatable(t):
 return len(re.findall(r'[^\W\d_]',t)) >= 2 and not (re.match(r'^(?:https?://|[\w.+-]+@)',t) or re.fullmatch(r'[/#][\w./#?=&%+-]+',t))

def text_nodes(soup):
 for n in soup.find_all(string=True):
  if isinstance(n,(Comment,Doctype)) or not n.parent: continue
  if any(p.name in SKIP for p in n.parents): continue
  if n.find_parent('svg') and n.parent.name not in ('text','tspan','title','desc'):continue
  if n.find_parent(attrs={'translate':'no'}): continue
  if any(p.name!='html' and p.has_attr('lang') for p in n.parents):continue
  credit=n.find_parent('a',href=re.compile(r'(?:commons\.wikimedia\.org/wiki/File:|creativecommons\.org/licenses/|pexels\.com/.*/(?:photo|photographer)/)'))
  if credit and not re.search(r'zdroj|fotograf|stránk|licen|originál|původ|otevř|podklad',str(n),re.I):continue
  t=normalize(n)
  if translatable(t): yield n,t

def attributes(soup):
 for tag in soup.find_all(True):
  if tag.name in ('script','style'): continue
  for attr in ATTRS:
   if tag.has_attr(attr) and translatable(normalize(tag[attr])): yield tag,attr,normalize(tag[attr])
  if tag.name=='meta' and (tag.get('name')=='description' or tag.get('property') in ('og:title','og:description','twitter:title','twitter:description')):
   if tag.get('content'): yield tag,'content',normalize(tag['content'])

def url_for(file,lang='cs'):
 p='/' + ('' if lang=='cs' else lang+'/') + file
 return p[:-10] if p.endswith('index.html') else p

def removed_news(soup):
 # Remove only the combined news feature; keep the standalone AI and finance sections.
 # Every canonical route now has all three languages; old fallback banners lie.
 for note in list(soup.select('.language-note')):note.decompose()
 for a in list(soup.select('a[href]')):
  if re.match(r'^(?:https://cestovatel69.cz)?/(?:en/|it/)?novinky(?:/|$)',a['href']):
   block=a.find_parent(['aside','section'])
   if block and not block.find('h1') and len(block.select('a'))<=5: block.decompose()
   elif a.parent: a.decompose()
 return soup

def edit_copy(soup):
 for n in list(soup.find_all(string=True)):
  if isinstance(n,Comment) or any(p.name in SKIP for p in n.parents):continue
  before=str(n);after=before
  for old,new in COPY_EDITS.items():after=after.replace(old,new)
  if before!=after:n.replace_with(after)
 return soup

def metadata_texts(value):
 if isinstance(value,dict):
  for key,child in value.items():
   if key in ('name','headline','description','caption','articleBody','text') and isinstance(child,str) and translatable(normalize(child)):yield normalize(child)
   elif isinstance(child,(dict,list)):yield from metadata_texts(child)
 elif isinstance(value,list):
  for child in value:yield from metadata_texts(child)

def human_fragment(text):
 text=normalize(text)
 if not translatable(text):return False
 if re.search(r'(?:\b(?:class|style|data-[\w-]+|aria-[\w-]+)\s*=|\b(?:background|border-radius|transition|padding|margin|width|height)\s*:|var\(--)',text):return False
 if text.startswith(('<','" style',"' style")):return False
 return True

def family(file,s):
 if file=='index.html': return 'home'
 if file.startswith('zdroje/'): return 'credits'
 if '/demo/' in file or file.startswith('hry/'): return 'tool'
 if file=='smart-home/index.html': return 'smart-home'
 if file.startswith('smart-home/'): return 'technical'
 if file.startswith('aplikace/') and file!='aplikace/index.html': return 'app'
 if '/regiony/' in file and file.endswith('/index.html'): return 'region'
 if file.startswith('blog/') and file!='blog/index.html': return 'reading'
 if any(t in file for t in ['/mista/','/parky/','podrobne.html','historie','pruvodce.html']): return 'reading'
 if s.select_one('.photo-grid,.gallery-grid,.travel-gallery,.gallery'): return 'gallery'
 return 'hub'

def plan():
 STATE.mkdir(parents=True,exist_ok=True)
 existing=(STATE/'plan.json').exists()
 files=[str(x.relative_to(ORIGINAL)).replace('\\','/') for x in ORIGINAL.rglob('*.html')] if existing else subprocess.check_output(['git','ls-files','*.html'],cwd=ROOT,text=True).splitlines()
 files=[x for x in files if not x.startswith(('_','docs/','.'))]
 pages=[]; strings=set(); old={}
 for file in files:
  p=(ORIGINAL if existing else ROOT)/file
  if not p.exists():continue
  if not existing:
   dest=ORIGINAL/file; dest.parent.mkdir(parents=True,exist_ok=True); shutil.copy2(p,dest)
  if file.startswith(('en/','it/')):
   old[file]=True; continue
  if file.startswith('novinky/'):continue
  s=edit_copy(removed_news(BeautifulSoup(p.read_text(encoding='utf-8'),'html.parser')))
  redirect=bool(s.select_one('meta[http-equiv="refresh" i]'))
  pages.append({'file':file,'family':family(file,s),'redirect':redirect,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
  if not redirect:
   strings.update(t for _,t in text_nodes(s));strings.update(t for _,_,t in attributes(s))
   for tag in s.select('script[type="application/ld+json"]'):
    try:strings.update(metadata_texts(json.loads(tag.get_text())))
    except ValueError:pass
 # Public structured text used in recipe, gallery and hardware widgets.
 dynamic=[]
 for file in subprocess.check_output(['git','ls-files','*.json'],cwd=ROOT,text=True).splitlines():
  if file.startswith(('cestovani/italie/assets/data/','cestovani/pracovni-cesty/assets/data/','smart-home/data/')):
   dynamic.append(file)
   def walk(x,key=''):
    if isinstance(x,dict):
     for k,v in x.items():walk(v,k)
    elif isinstance(x,list):
     for v in x:walk(v,key)
    elif isinstance(x,str) and key not in ('id','url','src','image','imageUrl','href','slug','file','status','license','source','sourceUrl'):
     if translatable(normalize(x)) and '<' not in x and not x.startswith(('http','/')):strings.add(normalize(x))
   walk(read_json(ROOT/file,{}))
 quiz=read_json(STATE/'quiz-questions.json',[])
 walk(quiz)
 # Human text emitted by existing scripts is translated as text, never as selectors,
 # variable names, data keys, formulae or executable JavaScript.
 runtime=set()
 scripts=[]
 for item in pages:
  page=BeautifulSoup((ORIGINAL/item['file']).read_text(encoding='utf8'),'html.parser')
  for tag in page.find_all('script'):
   if tag.get('src') or tag.get('type')=='application/ld+json':continue
   code=tag.get_text();kind=tag.get('type','')
   if kind=='application/json':code='('+code+')'
   elif kind not in ('','text/javascript','application/javascript','module'):code=json.dumps(code)
   scripts.append({'file':item['file'],'text':code})
 for name in ('assets/js/blog.js','assets/js/finance-calculators.js','smart-home/script.js','hry/denni-kviz/kviz.js'):
  scripts.append({'file':name,'text':(ROOT/name).read_text(encoding='utf8')})
 write_json(STATE/'js-extraction-input.json',scripts)
 extraction=subprocess.run(['node',str(STATE/'extract-js-strings.cjs')],cwd=ROOT.parent,capture_output=True,text=True,encoding='utf8',check=True)
 parsed=read_json(STATE/'js-string-literals.json')
 if parsed['errors']:raise RuntimeError('JavaScript text extraction failed: '+str(parsed['errors']))
 for raw in parsed['values']:
  has_czech=bool(re.search(r'[řěůďťňáíýéčšžóú]',raw,re.I))
  ascii_label=bool(re.fullmatch(r'[A-Za-z][A-Za-z0-9 /,.():;!?%+—–-]{2,100}',raw))
  if not (has_czech or ascii_label or '<' in raw):continue
  if '<' in raw and '>' in raw:
   fragment=BeautifulSoup(raw,'html.parser')
   runtime.update(normalize(n) for n in fragment.find_all(string=True) if human_fragment(n))
   runtime.update(t for _,_,t in attributes(fragment) if human_fragment(t))
  elif human_fragment(raw):runtime.add(normalize(raw))
  for match in re.finditer(r'''(?:aria-label|placeholder|title|alt|data-title)\s*=\s*["']([^"']*)''',raw):
   if human_fragment(match[1]):runtime.add(normalize(match[1]))
 strings.update(runtime)
 write_json(STATE/'plan.json',{'pages':pages,'strings':sorted(strings),'old_languages':old,'dynamic':dynamic,'runtime_strings':sorted(runtime)})
 print(f'Snapshot: {len(pages)} Czech routes, {len(strings)} unique text fragments, {sum(map(len,strings)):,} characters per new language.')

def translate_request(items,lang):
 marker='ZXQSEPARATORQXZ'
 q=('\n\n'+marker+'\n\n').join(items)
 url='https://translate.googleapis.com/translate_a/single?'+urlencode({'client':'gtx','sl':'cs','tl':lang,'dt':'t','q':q})
 for attempt in range(5):
  try:
   req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
   data=json.load(urllib.request.urlopen(req,timeout=45))
   out=''.join(p[0] for p in data[0] if p[0])
   values=re.split(r'\s*'+marker+r'\s*',out)
   if len(values)!=len(items):
    if len(items)==1:return [out.strip()]
    mid=len(items)//2
    return translate_request(items[:mid],lang)+translate_request(items[mid:],lang)
   return [v.strip() for v in values]
  except urllib.error.HTTPError as e:
   if e.code==429:raise RuntimeError('RATE_LIMIT: '+str(e.headers.get('Retry-After','not specified'))) from e
   if attempt==4:raise
   time.sleep(2**attempt)
  except Exception:
   if attempt==4:raise
   time.sleep(2**attempt)

def translate():
 p=read_json(STATE/'plan.json'); cache=read_json(STATE/'translations.json',{'en':{},'it':{}})
 for lang in ('en','it'):cache[lang].update(MANUAL[lang])
 jobs=[]
 for lang in ('en','it'):
  batch=[]; size=0
  for t in p['strings']:
   if t in cache[lang]:continue
   if size+len(t)+30>3000 and batch:jobs.append((lang,batch));batch=[];size=0
   batch.append(t);size+=len(t)+30
  if batch:jobs.append((lang,batch))
 print(f'Translation queue: {len(jobs)} batches; cached {sum(map(len,cache.values()))} fragments.',flush=True)
 done=0;errors=[]
 def job(pair):return pair[0],pair[1],translate_request(pair[1],pair[0])
 with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
  futures={pool.submit(job,j):j for j in jobs}
  for f in concurrent.futures.as_completed(futures):
   try:
    lang,src,dst=f.result();cache[lang].update(zip(src,dst));done+=1
   except Exception as e:
    errors.append(str(e));print('Translation error:',str(e),flush=True)
    if 'RATE_LIMIT' in str(e):
     for future in futures:future.cancel()
     write_json(STATE/'translations.json',cache)
     raise RuntimeError('Rate limit reached; completed translations saved. Retry after cooldown.') from e
   if done%10==0 or done==len(jobs):
    write_json(STATE/'translations.json',cache)
    print(f'Completed {done}/{len(jobs)} batches; {sum(map(len,cache.values()))} cached fragments; errors {len(errors)}.',flush=True)
   time.sleep(1.5)
 write_json(STATE/'translations.json',cache)
 if errors:raise RuntimeError(f'{len(errors)} batches failed; rerun to resume.')

def recover_translations():
 """Reuse only paired nodes whose complete DOM text layout is identical.

 Never zip loosely matching articles: older language versions often omit sections.
 """
 p=read_json(STATE/'plan.json');cache=read_json(STATE/'translations.json',{'en':{},'it':{}})
 for lang in ('en','it'):
  added=0;matched=0
  for item in p['pages']:
   f=item['file'];other=ORIGINAL/lang/f
   if not other.exists() or item['redirect']:continue
   a=removed_news(BeautifulSoup((ORIGINAL/f).read_text(encoding='utf8'),'html.parser'))
   b=removed_news(BeautifulSoup(other.read_text(encoding='utf8'),'html.parser'))
   a=a.main or a.body or a;b=b.main or b.body or b
   an=list(text_nodes(a));bn=list(text_nodes(b))
   def shape(n):
    out=[]
    for x in n.parents:
     out.append((x.name,x.get('id','')))
     if x.name=='main':break
    return tuple(out)
   if len(an)!=len(bn) or [shape(n) for n,t in an]!=[shape(n) for n,t in bn]:continue
   matched+=1
   for (n,src),(m,dst) in zip(an,bn):
    if src in cache[lang] or (src==dst and re.search(r'[řěůďťň]',src,re.I)):continue
    if not .2<=len(dst)/max(1,len(src))<=5:continue
    cache[lang][src]=dst;added+=1
  cache[lang].update(MANUAL[lang]);print(lang,'matching complete pages',matched,'recovered fragments',added)
 write_json(STATE/'translations.json',cache)

def localize_url(value,file,lang,available):
 if not value or value.startswith(('mailto:','tel:','data:','javascript:','blob:')):return value
 parsed=urlsplit(urljoin(SITE+url_for(file),value))
 if parsed.netloc not in ('cestovatel69.cz','www.cestovatel69.cz'):return value
 path=parsed.path
 # Resolve links and assets relative to their original source, then change only page routes.
 bare=re.sub(r'^/(?:en|it)/','/',path)
 target=bare.lstrip('/')+('index.html' if bare.endswith('/') else '')
 if target in available:path=url_for(target,lang)
 if bare.startswith('/novinky'):return url_for('index.html',lang)
 return urlunsplit(('', '',path,parsed.query,parsed.fragment))

def render(file,lang,p,cache):
 s=edit_copy(removed_news(BeautifulSoup((ORIGINAL/file).read_text(encoding='utf8'),'html.parser')))
 if file.startswith('zdroje/'):
  identities=set(json.loads((ROOT/'_editorial/credit-identities.json').read_text(encoding='utf8')))
  for tag in s.find_all(['dd','b','strong','a']):
   if normalize(tag.get_text()) in identities:tag['translate']='no'
  if file=='zdroje/jizni-morava-fotografie.html':
   for tag in s.select('article h2,strong'):tag['translate']='no'
 if not s.html:
  html=s.new_tag('html');children=list(s.children);s.append(html)
  for child in children:
   if isinstance(child,Doctype):continue
   if getattr(child,'name',None) or (isinstance(child,NavigableString) and child.strip()):html.append(child.extract())
 if not s.head:s.html.insert(0,s.new_tag('head'))
 if not s.body:
  body=s.new_tag('body');s.html.append(body)
  for child in list(s.html.children):
   if child is s.head or child is body:continue
   if getattr(child,'name',None) in ('meta','title','link','style'):s.head.append(child.extract())
   else:body.append(child.extract())
 for tag in list(s.html.find_all(['meta','title','link','style'],recursive=False)):s.head.append(tag.extract())
 if not s.select_one('meta[charset]'):s.head.insert(0,s.new_tag('meta',charset='utf-8'))
 if not s.select_one('meta[name=viewport]'):s.head.append(s.new_tag('meta',attrs={'name':'viewport','content':'width=device-width,initial-scale=1'}))
 available={x['file'] for x in p['pages']}
 classes=s.body.get('class',[])
 classes+=['editorial-preview','editorial-site','editorial-'+next(x['family'] for x in p['pages'] if x['file']==file)]
 s.body['class']=list(dict.fromkeys(classes));s.html['lang']=lang
 for calculators in s.select('[data-finance-calculators]'):calculators['data-locale']=lang
 if file=='404.html':
  for a in s.select('.en a'):
   text=normalize(a.get_text())
   if text in ('English','Italiano'):a['hreflang']='en' if text=='English' else 'it'
 # Reuse the accessible shared viewer instead of the older per-page duplicate.
 if s.select_one('script[src*="/assets/js/main.js"]') and s.select_one('#__lb'):
  legacy=s.select_one('#__lb');legacy.decompose()
  for style in list(s.find_all('style')):
   t=style.get_text()
   if '#__lb' in t and len(t)<4000:style.decompose()
  for script in list(s.find_all('script')):
   t=script.get_text()
   if "getElementById('__lb')" in t and len(t)<3000:script.decompose()
 # Licensed credit pages used to have their document body outside the reading area.
 # Move it into main without removing licence tables, maps, scripts or attribution.
 if file.startswith('zdroje/') or file=='cestovani/pracovni-cesty/prehled-tras.html':
  if not s.main:
   m=s.new_tag('main',id='main');s.body.insert(0,m)
  m=s.main
  for header in list(s.body.find_all('header',recursive=False)):
   if 'site-header' not in header.get('class',[]):m.insert(0,header.extract())
  for child in list(s.body.children):
   if child is m or getattr(child,'name',None) in ('script','style','header','footer'):continue
   m.append(child.extract())
  shared=BeautifulSoup((ORIGINAL/'index.html').read_text(encoding='utf8'),'html.parser')
  for tag in shared.select('[href],[src]'):
   for attr in ('href','src'):
    if tag.has_attr(attr):tag[attr]=localize_url(tag[attr],'index.html','cs',available)
  for tag in shared.select('[aria-current]'):tag.attrs.pop('aria-current',None)
  if not s.select_one('.site-header'):s.body.insert(0,BeautifulSoup(str(shared.select_one('.site-header')),'html.parser'))
  if not s.select_one('.site-footer'):s.body.append(BeautifulSoup(str(shared.select_one('.site-footer')),'html.parser'))
  if not s.select_one('script[src*="/assets/js/main.js"]'):s.body.append(s.new_tag('script',src='/assets/js/main.js?v='+VERSION))
 # A region opens with the existing introduction beside its photograph.
 if '/regiony/' in file and file.endswith('/index.html') and s.main:
  sec=s.main.find('section');photo=sec.select_one('figure.region-photo') if sec else None
  if photo:
   intro=s.new_tag('div',attrs={'class':'editorial-region-intro'});copy=s.new_tag('div')
   photo.insert_before(intro)
   for paragraph in list(sec.select('p.explore-intro')):copy.append(paragraph.extract())
   intro.append(copy);intro.append(photo.extract())
 # Scroll wide tabular references locally; do not make the whole mobile page scroll.
 for table in list(s.select('main table')):
  if table.find_parent(class_=re.compile(r'(?:table-wrap|table-scroll|overflow)')):continue
  wrap=s.new_tag('div',attrs={'class':'editorial-table-scroll','tabindex':'0','role':'region',
   'aria-label':{'cs':'Tabulka – lze posouvat do stran','en':'Table – scroll horizontally','it':'Tabella – scorri orizzontalmente'}[lang]})
  table.wrap(wrap)
 if lang!='cs':
  for n,t in list(text_nodes(s)):
   replacement=cache[lang].get(t)
   if replacement is None:raise ValueError(f'Missing {lang}: {t[:90]}')
   raw=str(n);n.replace_with(re.match(r'^\s*',raw)[0]+replacement+re.search(r'\s*$',raw)[0])
  for tag,attr,t in list(attributes(s)):tag[attr]=cache[lang].get(t,t)
 # Language and person identity in structured metadata must agree with the page.
 def ld(value,parent=''):
  if isinstance(value,list):return [ld(v,parent) for v in value]
  if not isinstance(value,dict):return value
  out={}
  for key,v in value.items():
   if key=='inLanguage':out[key]=lang
   elif key=='name' and parent=='author':out[key]='Budinský Luděk'
   elif key in ('name','headline','description','caption','articleBody','text') and isinstance(v,str):out[key]=cache.get(lang,{}).get(normalize(v),v)
   elif key in ('url','@id','mainEntityOfPage') and isinstance(v,str) and v.startswith(SITE):out[key]=SITE+localize_url(v,file,lang,available)
   else:out[key]=ld(v,key)
  return out
 for tag in s.select('script[type="application/ld+json"]'):
  try:tag.string=json.dumps(ld(json.loads(tag.get_text())),ensure_ascii=False).replace('<','\\u003c')
  except ValueError:pass
 # Normalize all resource paths; translated pages must not look for CSS/media in /en or /it.
 for tag in s.find_all(True):
  for a in ('href','src','poster','data-src'):
   if tag.has_attr(a):tag[a]=localize_url(tag[a],file,lang,available)
  if tag.name=='script' and tag.get('src','').startswith('/') and urlsplit(tag['src']).path.endswith('.js'):
   asset_path = urlsplit(tag['src']).path
   asset_version = CONSENT_VERSION if asset_path in ('/assets/js/analytics-consent.js','/assets/js/main.js','/smart-home/script.js') else VERSION
   tag['src']=asset_path+'?v='+asset_version
  if tag.name=='script' and urlsplit(tag.get('src','')).hostname=='widget.getyourguide.com':
   # This widget observes document.body; async can execute before it exists.
   tag.attrs.pop('async',None);tag['defer']=''
  if lang!='cs' and tag.name=='link' and tag.get('type')=='application/rss+xml' and tag.get('href')=='/blog/feed.xml':tag['href']='/'+lang+'/blog/feed.xml'
  if tag.name=='script' and tag.get('src','').startswith('/assets/js/italian.js'):
   tag.insert_before(s.new_tag('script',src='/assets/js/editorial-italian-ui.js?v='+VERSION))
  if tag.name=='a' and tag.get('hreflang')=='cs' and lang!='cs' and tag.get('href','').startswith('/'+lang+'/'):tag['hreflang']=lang
  if file=='404.html' and tag.name=='a' and tag.get('hreflang') in ('en','it') and tag.find_parent(class_='en'):tag['href']=url_for('index.html',tag['hreflang'])
  if tag.has_attr('srcset'):
   tag['srcset']=', '.join(localize_url(part.strip().split()[0],file,'cs',set())+' '+ ' '.join(part.strip().split()[1:]) for part in tag['srcset'].split(','))
 if lang!='cs' and file=='hry/denni-kviz/index.html':
  for script in s.select('script[src]'):
   if script['src'].split('?')[0]=='/hry/denni-kviz/questions.js':script['src']=f'/assets/js/editorial-quiz-{lang}.js?v='+VERSION
 image_manifest=read_json(STATE/'images.json',{})
 for img in s.select('main img[src]'):
  record=image_manifest.get(img['src'])
  if not record:continue
  img['width']=str(record['width']);img['height']=str(record['height']);img['decoding']='async'
  if 'preview' in record:
   img['data-full-src']=img['src'];img['src']=record['preview']
 if s.head:
  for tag in list(s.head.select('link[rel=canonical],link[rel=alternate][hreflang],link[href*="editorial-preview.css"],link[href*="editorial-site.css"]')):tag.decompose()
  s.head.append(s.new_tag('link',rel='canonical',href=SITE+url_for(file,lang)))
  for l in LANGS:s.head.append(s.new_tag('link',rel='alternate',hreflang=l,href=SITE+url_for(file,l)))
  s.head.append(s.new_tag('link',rel='stylesheet',href='/assets/css/editorial-preview.css?v='+VERSION))
  s.head.append(s.new_tag('link',rel='stylesheet',href='/assets/css/editorial-site.css?v='+VERSION))
  s.head.append(s.new_tag('script',src='/assets/js/editorial-ui.js?v='+VERSION,defer=''))
  if (file.startswith('zdroje/') or file in ('404.html','cestovani/pracovni-cesty/prehled-tras.html')) and not s.select_one('link[href*="/assets/css/style.css"]'):
   s.head.insert(0,s.new_tag('link',rel='stylesheet',href='/assets/css/style.css?v=20261116-navsearch'))
  # Resource attributes are absolute paths. Keep the document's own language URL
  # as its base, so filters, forms and history.pushState stay in that language.
  for b in s.head.find_all('base'):b.decompose()
  for m in s.head.select('meta[property="og:url"]'):m['content']=SITE+url_for(file,lang)
 # Full language navigation for every page, including formerly Czech-only articles and credits.
 switch=s.select_one('.lang-switcher')
 if switch:switch.clear()
 else:
  switch=s.new_tag('nav',attrs={'class':'lang-switcher editorial-language','aria-label':{'cs':'Jazyk stránky','en':'Page language','it':'Lingua della pagina'}[lang]})
  (s.main or s.body).insert(0,switch)
 for l in LANGS:
  a=s.new_tag('a',href=url_for(file,l),hreflang=l,lang=l);a.string=l.upper()
  if l==lang:a['aria-current']='page'
  switch.append(a)
 if file.startswith('smart-home/'):
  bar=s.select_one('.visitor-bar .container')
  if bar:
   old=bar.select_one('.visitor-links:last-child')
   if old and old.select_one('a[hreflang=en]') and old.select_one('a[hreflang=it]'):
    intro=next((a for a in old.select('a[href]') if not a.has_attr('hreflang') and a['href'].endswith('/smart-home/')),None)
    first=bar.select_one('.visitor-links')
    if intro and first and first is not old:first.append(intro.extract())
    old.decompose()
   bar.append(switch.extract())
 # Keep image-only additions in the old Norwegian translations (the galleries are not identical).
 if lang!='cs' and (ORIGINAL/lang/file).exists():
  old=BeautifulSoup((ORIGINAL/lang/file).read_text(encoding='utf8'),'html.parser')
  used={i.get('data-full-src',i.get('src')) for i in s.select('main img')}
  extras=[]
  for img in old.select('main img'):
   src=localize_url(img.get('src',''),lang+'/'+file,'cs',set())
   if src and src not in used:
    parent=img.find_parent('figure') or img.find_parent('a') or img
    cloned=BeautifulSoup(str(parent),'html.parser')
    for el in cloned.select('[src]'):el['src']=localize_url(el['src'],lang+'/'+file,'cs',set())
    extras.append(cloned);used.add(src)
  if extras and s.main:
   section=s.new_tag('section',attrs={'class':'editorial-preserved-media'})
   for x in extras:section.append(x)
   s.main.append(section)
 # Apply previews to the few photographs unique to older language galleries too.
 for img in s.select('main img[src]'):
  if img.has_attr('data-full-src'):continue
  record=image_manifest.get(img['src'])
  if record and 'preview' in record:
   img['data-full-src']=img['src'];img['src']=record['preview'];img['width']=str(record['width']);img['height']=str(record['height'])
 if lang!='cs':
  if file=='cestovani/italie/italstina/index.html':
   pronunciation=read_json(ROOT/'_editorial/italian-pronunciation.json')[lang]
   for card,(heading,body) in zip(s.select('.it-pronunciation__card'),pronunciation):
    card.h3.string=heading;card.h3['lang']=lang
    paragraph=card.find('p');paragraph.clear();paragraph['lang']=lang
    for child in list(BeautifulSoup(body,'html.parser').contents):paragraph.append(child)
  data=s.new_tag('script',src='/assets/js/editorial-language.js?v='+VERSION,defer='')
  s.head.append(data)
 return str(s).lstrip('\ufeff')

def preview_cs():
 p=read_json(STATE/'plan.json')
 for item in p['pages']:
  if not item['redirect']:(ROOT/item['file']).write_text(render(item['file'],'cs',p,{}),encoding='utf8')
 print('Czech design preview generated; source snapshots unchanged.')

def preview_en():
 p=read_json(STATE/'plan.json');cache=prepare_cache(read_json(STATE/'translations.json'))
 for item in p['pages']:
  if item['redirect']:continue
  dest=ROOT/'en'/item['file'];dest.parent.mkdir(parents=True,exist_ok=True)
  dest.write_text(render(item['file'],'en',p,cache),encoding='utf8')
 write_json(ROOT/'assets/data/editorial-runtime-en.json',{t:cache['en'][t] for t in set(p['runtime_strings'])|set(MANUAL['en']) if t in cache['en']})
 make_quiz('en',cache)
 print('English pages built for local review.')

def make_quiz(lang,cache):
 bank=read_json(STATE/'quiz-questions.json',[])
 def tr(value):
  if isinstance(value,list):return [tr(v) for v in value]
  return cache[lang].get(value,value) if isinstance(value,str) else value
 localized=tr(bank);issues=[]
 for index,row in enumerate(localized):
  if lang=='en':row[1]=row[1].replace('mean in Czech','mean').replace('What does Czech mean','What does it mean')
  else:row[1]=row[1].replace('significa in ceco','significa').replace('in lingua ceca','')
  if len(set([row[2]]+row[3]))!=4:issues.append({'question':index,'source':bank[index],'translated':row})
 write_json(STATE/f'quiz-{lang}-issues.json',issues)
 (ROOT/f'assets/js/editorial-quiz-{lang}.js').write_text('// Same question bank and answer order; localized display strings.\nvar QUESTIONS = '+json.dumps(localized,ensure_ascii=False,indent=1)+';\n',encoding='utf8')
 print(lang,'quiz questions',len(localized),'duplicate option issues',len(issues))

def images():
 """Create light page previews, retaining the original for zoom and download."""
 from PIL import Image, ImageOps
 from urllib.parse import unquote
 found={}; manifest={}
 for page in ORIGINAL.rglob('*.html'):
  if 'novinky' in page.parts:continue
  s=BeautifulSoup(page.read_text(encoding='utf8'),'html.parser')
  origin=SITE+'/'+str(page.relative_to(ORIGINAL)).replace('\\','/')
  for img in s.select('img[src]'):
   u=urlsplit(urljoin(origin,img['src']));f=ROOT/unquote(u.path.lstrip('/'))
   if u.netloc=='cestovatel69.cz' and f.is_file() and f.suffix.lower() in ('.jpg','.jpeg','.png','.webp'):
    found[u.path]=f
 out=ROOT/'assets/img/editorial/media';out.mkdir(parents=True,exist_ok=True)
 for i,(url,f) in enumerate(found.items()):
  try:
   with Image.open(f) as source:
    im=ImageOps.exif_transpose(source)
    size=im.size;record={'width':size[0],'height':size[1],'original':url}
    if f.stat().st_size>300_000:
     im.thumbnail((1600,1600),Image.Resampling.LANCZOS)
     if im.mode not in ('RGB','RGBA'):im=im.convert('RGB')
     dest=out/(hashlib.sha256(f.read_bytes()).hexdigest()[:18]+'.webp')
     quality=84
     while True:
      im.save(dest,'WEBP',quality=quality,method=5)
      if dest.stat().st_size<295_000 or quality<=44:break
      quality-=8
     while dest.stat().st_size>295_000:
      im.thumbnail((int(im.width*.85),int(im.height*.85)),Image.Resampling.LANCZOS)
      im.save(dest,'WEBP',quality=76,method=5)
     record.update(preview='/'+str(dest.relative_to(ROOT)).replace('\\','/'),width=im.width,height=im.height,bytes=dest.stat().st_size)
    manifest[url]=record
  except (OSError,ValueError) as error:print('Image skipped',url,str(error))
  if (i+1)%200==0:print(f'Images checked {i+1}/{len(found)}',flush=True)
 write_json(STATE/'images.json',manifest)
 print('Image manifest:',len(manifest),'previews:',sum('preview' in x for x in manifest.values()))

def build():
 p=read_json(STATE/'plan.json');cache=prepare_cache(read_json(STATE/'translations.json',{}))
 missing={l:sum(t not in cache.get(l,{}) for t in p['strings']) for l in ('en','it')}
 if any(missing.values()):raise RuntimeError(f'Translations incomplete: {missing}')
 write_json(ROOT/'_editorial/translations.json',cache)
 (ROOT/'assets/js/editorial-italian-ui.js').write_text('/* Local Italian UI and situation descriptions; no translation service at runtime. */\nwindow.ItalianEditorialCopy = '+json.dumps(read_json(ROOT/'_editorial/italian-ui.json'),ensure_ascii=False)+';\n',encoding='utf8')
 for item in p['pages']:
  for lang in LANGS:
   dest=ROOT/('' if lang=='cs' else lang)/item['file'];dest.parent.mkdir(parents=True,exist_ok=True)
   if item['redirect']:
    source=(ORIGINAL/item['file']).read_text(encoding='utf8')
    s=BeautifulSoup(source,'html.parser')
    refresh=s.select_one('meta[http-equiv="refresh" i]')
    if refresh:
     match=re.search(r'url\s*=\s*(.*)',refresh.get('content',''),re.I)
     if match:refresh['content']='0;url='+localize_url(match[1].strip(),item['file'],lang,{i['file'] for i in p['pages']})
    dest.write_text(str(s),encoding='utf8')
   else:dest.write_text(render(item['file'],lang,p,cache),encoding='utf8')
 # Publish only static, public translation strings; no credentials or service calls in the browser.
 for lang in ('en','it'):write_json(ROOT/'assets/data'/f'editorial-runtime-{lang}.json',{t:cache[lang][t] for t in sorted(set(p['runtime_strings'])|set(MANUAL[lang])) if t in cache[lang]})
 for lang in ('en','it'):make_quiz(lang,cache)
 sitemap=ET.parse(ROOT/'sitemap.xml');root=sitemap.getroot();ns='{http://www.sitemaps.org/schemas/sitemap/0.9}'
 noindex={x['file'] for x in p['pages'] if x['redirect'] or x['file']=='404.html' or BeautifulSoup((ORIGINAL/x['file']).read_text(encoding='utf8'),'html.parser').select_one('meta[name=robots][content*=noindex]')}
 for node in list(root):
  loc=node.find(ns+'loc')
  if loc is None:continue
  path=re.sub(r'^/(?:en|it)/','/',urlsplit(loc.text or '').path).lstrip('/')
  if path.endswith('/') or not path:path+='index.html'
  if '/novinky/' in (loc.text or '') or path in noindex:root.remove(node)
 known={n.text for n in root.iter() if n.tag.endswith('loc')}
 for item in p['pages']:
  if item['file'] in noindex:continue
  for lang in LANGS:
   u=SITE+url_for(item['file'],lang)
   if u not in known:
    entry=ET.SubElement(root,ns+'url');ET.SubElement(entry,ns+'loc').text=u;known.add(u)
 sitemap.write(ROOT/'sitemap.xml',encoding='utf-8',xml_declaration=True)
 for lang in ('en','it'):
  feed=ET.parse(ROOT/'blog/feed.xml');channel=feed.getroot().find('channel')
  channel.find('language').text=lang
  channel.find('title').text='Cestovatel69 – '+('Travel blog' if lang=='en' else 'Blog di viaggio')
  channel.find('description').text='Stories from the road' if lang=='en' else 'Racconti di viaggio'
  channel.find('link').text=SITE+'/'+lang+'/blog/'
  for item in channel.findall('item'):
   for key in ('title','description'):
    tag=item.find(key)
    if tag is not None and tag.text:tag.text=cache[lang].get(normalize(tag.text),tag.text)
   for key in ('link','guid'):
    tag=item.find(key)
    if tag is not None and tag.text:tag.text=SITE+'/'+lang+urlsplit(tag.text).path
  feed.write(ROOT/lang/'blog/feed.xml',encoding='utf-8',xml_declaration=True)
 # Retired news URLs keep a small compatibility redirect, no withdrawn content.
 for page in (ORIGINAL/'novinky').rglob('*.html'):
  relative=page.relative_to(ORIGINAL)
  (ROOT/relative).write_text('<!doctype html><html lang="cs"><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=/"><title>Cestovatel69</title><a href="/">Cestovatel69 →</a></html>',encoding='utf8')
 print(f'Built {len(p["pages"])*3} routes locally. Nothing committed or published.')

if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('command',choices=['plan','translate','build','preview_cs','preview_en','recover_translations','images']);args=parser.parse_args()
 globals()[args.command]()
