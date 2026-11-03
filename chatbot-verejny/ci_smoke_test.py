"""Exercise the isolated Worker using two conversational requests."""
import json
import urllib.request

URL = 'https://cestovatel69-test.bludek69.workers.dev/api/chat'
HEADERS = {
    'Origin': 'https://cestovatel69.cz',
    'Content-Type': 'application/json',
    'User-Agent': 'Cestovatel69GitHubActionsTest/1.0',
}
history = []
for question in ('Co je národní park Gran Paradiso?', 'Co tam mohu navštívit u jezera?'):
    history.append({'role': 'user', 'content': question})
    body = json.dumps({'messages': history}, ensure_ascii=False).encode('utf-8')
    request = urllib.request.Request(URL, data=body, headers=HEADERS, method='POST')
    with urllib.request.urlopen(request, timeout=60) as response:
        result = json.load(response)
    assert result.get('answer'), 'Empty AI answer'
    assert any('/parky/gran-paradiso/' in s.get('url', '') for s in result.get('sources', [])), 'Missing park source'
    history.append({'role': 'assistant', 'content': result['answer']})
    print('PASS: answer includes the expected park source')
