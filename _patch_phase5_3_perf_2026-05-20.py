"""Phase 5.3 — Performance quick wins (safe).

Targets:
  1. Add loading="lazy" to 29 <img> tags that don't have it
     EXCEPT hero/above-the-fold images (ai-hero.svg, etc.)
  2. Add decoding="async" natively to all <img> (currently set via JS at runtime)
  3. Add youtube-nocookie preconnect to kuchyne.html (has iframe embeds)

Marker: WX_PERF_2026-05-20
"""
import re, pathlib, hashlib, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# Files to process — exclude finance/demo (separate app)
TARGETS = [
    'cestovani/pracovni-cesty/autobusy/index.html',
    'cestovani/italie/kuchyne.html',
    'cestovani/bosna/index.html',
    'cestovani/pracovni-cesty/index.html',
    'ai.html',  # SVG hero — skip
]

# For ai.html, ai-hero.svg is above-the-fold (in hero), skip adding lazy
SKIP_LAZY = {
    'ai.html': ['ai-hero.svg'],  # above-the-fold hero SVG
}

# Step 1+2: For each <img> tag, ensure loading="lazy" and decoding="async"
def patch_img_tag(match, skip_substrings):
    tag = match.group(0)
    src_m = re.search(r'src="([^"]+)"', tag)
    src = src_m.group(1) if src_m else ''
    # Skip if matches skip pattern
    if any(s in src for s in skip_substrings):
        # Just add decoding="async" if missing
        if 'decoding=' not in tag:
            tag = tag.replace('<img', '<img decoding="async"', 1)
        return tag
    # Add loading="lazy" if missing
    if 'loading=' not in tag:
        tag = tag.replace('<img', '<img loading="lazy"', 1)
    # Add decoding="async" if missing
    if 'decoding=' not in tag:
        tag = tag.replace('<img', '<img decoding="async"', 1)
    return tag

IMG_RE = re.compile(r'<img\b[^>]*>', re.DOTALL)

# Step 3: preconnect for kuchyne.html (YouTube iframe embeds)
PRECONNECT_INSERT_TARGET = '<link rel="canonical"'
PRECONNECT_BLOCK = '''<link rel="preconnect" href="https://www.youtube-nocookie.com" crossorigin>
  <link rel="dns-prefetch" href="https://www.youtube-nocookie.com">
  <link rel="canonical"'''

total_imgs_patched = 0
for f in TARGETS:
    path = pathlib.Path(f)
    text = path.read_text(encoding='utf-8')
    orig_sha = hashlib.sha256(text.encode()).hexdigest()[:16]
    orig_len = len(text)
    skip_subs = SKIP_LAZY.get(f, [])

    before_lazy = text.count('loading="lazy"')
    before_decode = text.count('decoding="async"')

    text2 = IMG_RE.sub(lambda m: patch_img_tag(m, skip_subs), text)

    after_lazy = text2.count('loading="lazy"')
    after_decode = text2.count('decoding="async"')

    # Kuchyne — add preconnect for youtube embed
    if 'kuchyne' in f and PRECONNECT_INSERT_TARGET in text2 and 'youtube-nocookie' not in text2[:2000]:
        text2 = text2.replace(PRECONNECT_INSERT_TARGET, PRECONNECT_BLOCK, 1)
        print(f'  + preconnect youtube-nocookie added to {f}')

    new_sha = hashlib.sha256(text2.encode()).hexdigest()[:16]
    new_len = len(text2)
    if text2 != text:
        path.write_text(text2, encoding='utf-8', newline='')
        print(f'  {f}: lazy {before_lazy} -> {after_lazy} (+{after_lazy-before_lazy}), decode {before_decode} -> {after_decode} (+{after_decode-before_decode}), {orig_len} -> {new_len} B')
        total_imgs_patched += (after_lazy - before_lazy)

print(f'\nTotal lazy attrs added: {total_imgs_patched}')
