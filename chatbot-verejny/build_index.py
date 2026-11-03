"""Build a retrieval index from tracked website pages and selected dynamic data."""
from collections import Counter
from pathlib import Path
import importlib.util
import base64
import gzip
import json
import subprocess

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('local_chat', ROOT / 'chatbot-verejny' / 'indexer.py')
local = importlib.util.module_from_spec(spec)
spec.loader.exec_module(local)
tracked = subprocess.run(['git', 'ls-files', '-z', '--', '*.html'], cwd=ROOT, check=True, stdout=subprocess.PIPE).stdout.decode('utf-8').split('\0')
# Include the explicitly selected, not-yet-tracked Italian guides in local builds.
# Restrict the addition to these public-facing paths, never arbitrary drafts.
prepared = [
    'cestovani/italie/regiony-a-mista.html',
    'cestovani/italie/historie.html',
    'cestovani/italie/italie-podrobne.html',
    'cestovani/italie/narodni-parky.html',
]
prepared.extend(p.relative_to(ROOT).as_posix() for p in
                (ROOT / 'cestovani/italie/parky').glob('*/index.html'))
for lang in ('en', 'it'):
    prepared.extend(f'{lang}/{path}' for path in list(prepared)
                    if not path.startswith(('en/', 'it/')))
tracked = list(dict.fromkeys(tracked + prepared))
documents = []
for name in tracked:
    path = ROOT / name
    if not name or not path.is_file() or any(part.startswith('.') for part in Path(name).parts):
        continue
    parser = local.Extract()
    parser.feed(path.read_text(encoding='utf-8-sig', errors='replace'))
    content = '\n'.join(line.strip() for line in ''.join(parser.parts).splitlines() if line.strip())
    if len(content) < 60:
        continue
    title = parser.title.strip().split(' | ')[0].split(' — ')[0] or name
    url = '/' + (name[:-10] if name.endswith('index.html') else name)
    for pos in range(0, len(content), 1500):
        documents.append({'title': title, 'url': url, 'text': content[pos:pos+1900]})

# The existing local index also extracts cameras, lessons and curated food data.
for item in local.index_site(include_html=False):
    if item['title'].startswith(('Itálie – počasí a webkamery', 'Italština – ', 'Recept – ', 'Druh těstovin – ', 'Italská kuchyně – ')):
        documents.append({key: item[key] for key in ('title', 'url', 'text')})

# A partial extraction must never silently replace a working public index.
for prefix in ('Itálie – počasí a webkamery', 'Italština – ', 'Recept – ',
               'Druh těstovin – ', 'Italská kuchyně – '):
    if not any(doc['title'].startswith(prefix) for doc in documents):
        raise RuntimeError(f'Chybí dynamický obsah: {prefix}')
for slug in ('cinque-terre', 'gran-paradiso', 'vesuvio'):
    if not any(doc['url'] == f'/cestovani/italie/parky/{slug}/' for doc in documents):
        raise RuntimeError(f'Chybí článek parku: {slug}')

postings = {}
for idx, doc in enumerate(documents):
    for term, freq in Counter(local.words(doc['title']+' '+doc['url'].replace('/', ' ')+' '+doc['text'])).items():
        postings.setdefault(term, []).append([idx, min(freq, 5)])
output = {'docs': documents, 'postings': postings}
target = Path(__file__).with_name('index.json')
target.write_text(json.dumps(output, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
encoded = base64.b64encode(gzip.compress(target.read_bytes(), mtime=0)).decode('ascii')
compact = Path(__file__).with_name('index.compact.mjs')
compact.write_text(
    "const b='" + encoded + "';let cache;"
    "export default async function getIndex(){"
    "if(!cache)cache=(async()=>{const bytes=Uint8Array.from(atob(b),c=>c.charCodeAt(0));"
    "const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));"
    "return JSON.parse(await new Response(stream).text());})();"
    "try{return await cache}catch(e){cache=undefined;throw e;}}\n",
    encoding='ascii')
print(f'{len(documents)} textových úseků, {len(postings)} hledaných slov, {target.stat().st_size} bajtů')
