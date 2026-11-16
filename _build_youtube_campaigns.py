"""Generate the approved YouTube campaign registry used by consent-controlled GA4."""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parent
data = json.loads((ROOT / '_data/youtube-campaigns.json').read_text(encoding='utf-8'))
registry = {}
for item in data:
    assert re.fullmatch(r'[\w-]{11}', item['id'])
    assert re.fullmatch(r'[a-z0-9-]{1,48}', item['campaign'])
    assert item['id'] not in registry
    registry[item['id']] = {'campaign': item['campaign'], 'title': item['title'][:100]}
target = ROOT / 'assets/js/analytics-consent.js'
source = target.read_text(encoding='utf-8')
block = '// BEGIN APPROVED YOUTUBE CAMPAIGNS\n  const YOUTUBE_CAMPAIGNS = ' + json.dumps(registry, ensure_ascii=False, separators=(',', ':')) + ';\n  // END APPROVED YOUTUBE CAMPAIGNS'
source, count = re.subn(r'// BEGIN APPROVED YOUTUBE CAMPAIGNS.*?// END APPROVED YOUTUBE CAMPAIGNS', lambda _: block, source, flags=re.S)
assert count == 1
target.write_text(source, encoding='utf-8', newline='\n')
print(f'Approved YouTube campaigns: {len(registry)}')
