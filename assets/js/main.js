// Osobní web — Luděk
// Minimal JS: mobile nav toggle + lazy-load helper + theme toggle (Phase 5.1)

// Theme toggle — runs EARLY (before DOMContentLoaded) to prevent flash of wrong theme
(function () {
  'use strict';
  const STORAGE_KEY = 'cestovatel69_theme_mode'; // 'dark' | 'light' | 'auto'
  const stored = (() => { try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; } })();
  // New visitors see the dark presentation; an existing preference always wins.
  // Preserve the former "auto" option for visitors who already selected it.
  const mode = stored === 'light' || stored === 'dark' ? stored :
    (stored === 'auto' ? null : 'dark');
  if (mode === 'dark' || mode === 'light') {
    document.documentElement.setAttribute('data-theme-mode', mode);
  }
})();

/* Skip-to-main-content link — WCAG 2.4.1 Bypass Blocks.
   Injected as the very first element inside <body> so it's the first Tab stop on every page. */
(function () {
  'use strict';
  function installSkipLink() {
    if (document.querySelector('.skip-link')) return;
    var main = document.getElementById('main');
    if (!main) return;
    // Without tabindex, an <a href="#main"> jump moves the URL hash and
    // scroll position but NOT actual DOM focus (only focusable elements can
    // receive focus) — screen reader users land visually at #main but their
    // focus context stays wherever it was. tabindex="-1" makes #main
    // programmatically focusable (still not in the normal Tab order).
    if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
    var link = document.createElement('a');
    link.className = 'skip-link';
    link.href = '#main';
    link.textContent = { cs: 'Přeskočit na hlavní obsah', en: 'Skip to main content', it: 'Vai al contenuto principale' }[document.documentElement.lang] || 'Skip to main content';
    link.addEventListener('click', function () {
      // href="#main" alone only scrolls; explicitly focus it too.
      setTimeout(function () { main.focus(); }, 0);
    });
    document.body.insertBefore(link, document.body.firstChild);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installSkipLink);
  } else {
    installSkipLink();
  }
})();

(function () {
  'use strict';

  // Theme toggle button — inserted into header after DOM ready
  function installThemeToggle() {
    const header = document.querySelector('.site-header__inner');
    if (!header || header.querySelector('.theme-toggle')) return;
    const STORAGE_KEY = 'cestovatel69_theme_mode';
    const btn = document.createElement('button');
    btn.className = 'theme-toggle';
    const themeLabels = {
      cs: ['Tmavý / světlý režim', 'Přepnout na světlý režim', 'Přepnout na tmavý režim', 'Auto režim — klikni pro přepnutí'],
      en: ['Dark / light mode', 'Switch to light mode', 'Switch to dark mode', 'Automatic mode — click to switch'],
      it: ['Tema scuro / chiaro', 'Passa al tema chiaro', 'Passa al tema scuro', 'Tema automatico — fai clic per cambiare']
    }[document.documentElement.lang] || ['Dark / light mode', 'Switch to light mode', 'Switch to dark mode', 'Automatic mode — click to switch'];
    btn.setAttribute('aria-label', themeLabels[0]);
    btn.setAttribute('title', themeLabels[0]);
    const updateIcon = () => {
      const current = document.documentElement.getAttribute('data-theme-mode');
      // Show icon for NEXT mode (clickable affordance)
      if (current === 'dark') { btn.textContent = '☀️'; btn.setAttribute('aria-label', themeLabels[1]); }
      else if (current === 'light') { btn.textContent = '🌙'; btn.setAttribute('aria-label', themeLabels[2]); }
      else { btn.textContent = '🌓'; btn.setAttribute('aria-label', themeLabels[3]); }
    };
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme-mode');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme-mode', next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
      updateIcon();
    });
    // Insert before nav-toggle so it appears as button group on mobile
    const navToggle = header.querySelector('.nav-toggle');
    if (navToggle) header.insertBefore(btn, navToggle);
    else header.appendChild(btn);
    updateIcon();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installThemeToggle);
  } else {
    installThemeToggle();
  }

  // Shared mobile menu: keep visible state, accessible labels and focus in sync.
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    const labels = {
      cs: ['Otevřít menu', 'Zavřít menu'],
      en: ['Open menu', 'Close menu'],
      it: ['Apri menu', 'Chiudi menu']
    }[document.documentElement.lang] || ['Open menu', 'Close menu'];
    if (!nav.id) nav.id = 'site-navigation';
    toggle.setAttribute('aria-controls', nav.id);
    toggle.type = 'button';
    function setMenu(open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', labels[open ? 1 : 0]);
    }
    setMenu(false);
    toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => setMenu(false));
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });
    document.addEventListener('click', event => {
      if (!event.target.closest('.site-header')) setMenu(false);
    });
    window.matchMedia('(max-width: 1199px)').addEventListener('change', () => setMenu(false));
  }

  // Native lazy-load fallback (browser handles loading="lazy", but we ensure decoding="async")
  document.querySelectorAll('img:not([decoding])').forEach(img => {
    img.setAttribute('decoding', 'async');
  });

  // Resolve relative and root links alike; select only the closest section.
  // A root href must not match every page via endsWith('').
  const normalizePath = path => path.replace(/\/index\.html$/i, '/').replace(/\/+$/, '') || '/';
  const path = normalizePath(location.pathname);
  const navLinks = [...document.querySelectorAll('.site-header .nav a')];
  let activeLink = null;
  let activeLength = -1;
  navLinks.forEach(a => {
    const url = new URL(a.href, location.href);
    const target = normalizePath(url.pathname);
    const matches = url.origin === location.origin &&
      (path === target || (target !== '/' && path.startsWith(target + '/')));
    a.removeAttribute('aria-current');
    if (matches && target.length > activeLength) {
      activeLink = a;
      activeLength = target.length;
    }
  });
  if (activeLink) activeLink.setAttribute('aria-current', 'page');

  // Enhance the existing recipe checklist; the two-serving recipe works without JS.
  document.querySelectorAll('.recipe-cooking').forEach(cooking => {
    const portions = cooking.querySelector('.recipe-portions');
    portions.hidden = false;
    portions.addEventListener('change', event => {
      const value = event.target.value;
      if (value !== '2' && value !== '4') return;
      cooking.querySelectorAll('[data-portion-2]').forEach(item => {
        item.textContent = item.getAttribute(`data-portion-${value}`);
      });
    });
  });

  // One screen wake lock for the currently selected cooking instructions.
  const cookingSteps = document.querySelectorAll('.recipe-steps');
  if (cookingSteps.length) {
    const wakeLabels = {
      cs: ['Nezhasínat displej', 'Povolit zhasnutí', 'Platí jen při otevřeném postupu a zobrazené stránce.', 'Displej zůstává zapnutý.', 'Zapínám…', 'Po návratu do stránky se zapne znovu.', 'Tento prohlížeč nezhasínání displeje nepodporuje.', 'Nepodařilo se zapnout. Zkus to znovu; překážkou může být úsporný režim.', 'Zařízení nezhasínání vypnulo. Můžeš ho zkusit zapnout znovu.'],
      en: ['Keep screen on', 'Allow screen to sleep', 'Only while these instructions are open and the page is visible.', 'The screen is staying on.', 'Turning on…', 'Will resume when you return to this page.', 'This browser does not support keeping the screen on.', 'Could not turn on. Try again; battery saving may prevent it.', 'The device stopped keeping the screen on. You can try again.'],
      it: ['Mantieni lo schermo acceso', 'Consenti spegnimento schermo', 'Solo con il procedimento aperto e la pagina visibile.', 'Lo schermo rimane acceso.', 'Attivazione…', 'Si riattiverà al ritorno su questa pagina.', 'Questo browser non supporta lo schermo sempre acceso.', 'Attivazione non riuscita. Riprova; il risparmio energetico potrebbe impedirla.', 'Il dispositivo ha disattivato la funzione. Puoi riprovare.']
    };
    const labels = wakeLabels[document.documentElement.lang.split('-')[0]] || wakeLabels.cs;
    const supported = window.isSecureContext && typeof navigator.wakeLock?.request === 'function';
    const controls = [];
    let owner = null;
    let sentinel = null;
    let generation = 0;
    const render = message => controls.forEach(control => {
      const selected = owner === control;
      control.button.textContent = labels[selected ? 1 : 0];
      control.button.setAttribute('aria-pressed', String(selected && !!sentinel));
      control.status.textContent = selected ? message : labels[supported ? 2 : 6];
    });
    const release = () => {
      generation++;
      const previous = sentinel;
      sentinel = null;
      if (previous) previous.release().catch(() => {});
    };
    const stop = () => { owner = null; release(); render(); };
    const acquire = async () => {
      if (!owner || !owner.details.open || document.visibilityState !== 'visible') return;
      const selected = owner;
      const requestGeneration = ++generation;
      render(labels[4]);
      try {
        const lock = await navigator.wakeLock.request('screen');
        if (requestGeneration !== generation || owner !== selected || !selected.details.open || document.visibilityState !== 'visible') {
          await lock.release();
          return;
        }
        if (lock.released) throw new Error('Wake lock already released');
        sentinel = lock;
        lock.addEventListener('release', () => {
          if (sentinel !== lock) return;
          sentinel = null;
          if (document.visibilityState !== 'visible') render(labels[5]);
          else {
            owner = null;
            render();
            selected.status.textContent = labels[8];
          }
        });
        render(labels[3]);
      } catch (_) {
        if (requestGeneration !== generation) return;
        owner = null;
        render();
        selected.status.textContent = labels[7];
      }
    };
    cookingSteps.forEach((details, index) => {
      const container = document.createElement('div');
      container.className = 'recipe-wake';
      const button = document.createElement('button');
      button.type = 'button';
      button.disabled = !supported;
      const status = document.createElement('p');
      status.id = `recipe-wake-status-${index}`;
      status.setAttribute('role', 'status');
      button.setAttribute('aria-describedby', status.id);
      container.append(button, status);
      details.querySelector('summary').after(container);
      const control = { details, button, status };
      controls.push(control);
      button.addEventListener('click', () => {
        if (owner === control) { stop(); return; }
        release();
        owner = control;
        acquire();
      });
      details.addEventListener('toggle', () => {
        if (!details.open && owner === control) stop();
      });
    });
    document.addEventListener('visibilitychange', () => {
      if (!owner) return;
      if (document.visibilityState !== 'visible') { release(); render(labels[5]); }
      else if (owner.details.open) acquire();
      else stop();
    });
    window.addEventListener('pagehide', stop);
    render();
  }

  // Recipe videos stay beside their dish; only the selected player is loaded.
  const recipeLabels = {
    cs: ['▶ Přehrát video · GialloZafferano', 'Zavřít video', 'Otevřít na YouTube'],
    en: ['▶ Play video · GialloZafferano', 'Close video', 'Open on YouTube'],
    it: ['▶ Riproduci video · GialloZafferano', 'Chiudi video', 'Apri su YouTube']
  };
  const recipeText = recipeLabels[document.documentElement.lang.split('-')[0]] || recipeLabels.cs;
  let closeRecipeVideo = null;
  document.querySelectorAll('a.recipe-video').forEach((link, index) => {
    const videoId = new URL(link.href).searchParams.get('v');
    if (!/^[\w-]{11}$/.test(videoId || '')) return;
    const title = link.closest('.recipe-card').querySelector('h3').textContent;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = link.className;
    button.textContent = recipeText[0];
    button.setAttribute('aria-label', `${recipeText[0]} — ${title}`);
    button.setAttribute('aria-expanded', 'false');
    const panel = document.createElement('div');
    panel.className = 'recipe-player';
    panel.id = `recipe-player-${index}`;
    panel.hidden = true;
    button.setAttribute('aria-controls', panel.id);
    link.replaceWith(button, panel);
    const close = () => {
      panel.replaceChildren();
      panel.hidden = true;
      button.textContent = recipeText[0];
      button.setAttribute('aria-label', `${recipeText[0]} — ${title}`);
      button.setAttribute('aria-expanded', 'false');
      closeRecipeVideo = null;
    };
    button.addEventListener('click', () => {
      if (!panel.hidden) { close(); return; }
      if (closeRecipeVideo) closeRecipeVideo();
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`;
      iframe.title = `${title} · GialloZafferano`;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allow = 'autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
      iframe.allowFullscreen = true;
      link.className = 'recipe-player-fallback';
      link.textContent = recipeText[2];
      link.setAttribute('aria-label', `${recipeText[2]} — ${title}`);
      panel.append(iframe, link);
      panel.hidden = false;
      button.textContent = recipeText[1];
      button.setAttribute('aria-label', `${recipeText[1]} — ${title}`);
      button.setAttribute('aria-expanded', 'true');
      closeRecipeVideo = close;
    });
  });

  // YouTube section — click-to-swap featured video
  // Pattern: each .video-card has data-video-id + data-title + data-description.
  // Click swaps the .featured-video iframe. "Otevřít na YouTube" link je separátní (anchor inside card).
  const featured = document.querySelector('.featured-video');
  if (featured) {
    const setFeatured = (videoId, title, description) => {
      if (!videoId || videoId.startsWith('TODO_')) return; // placeholder mode
      // Replace cover with iframe (lazy until first click; then swap)
      featured.innerHTML = `
        <iframe
          src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0"
          title="${(title || '').replace(/"/g,'&quot;')}"
          loading="lazy"
          referrerpolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>
      `;
    };

    // If featured starts as cover (data-video-id present), wire click to play
    const cover = featured.querySelector('.thumb-cover');
    if (cover) {
      cover.addEventListener('click', () => {
        const id    = featured.dataset.videoId;
        const title = featured.dataset.title;
        const desc  = featured.dataset.description;
        setFeatured(id, title, desc);
      });
    }

    // Cards swap into featured player
    document.querySelectorAll('.video-card').forEach(card => {
      const handler = (e) => {
        if (e) e.preventDefault();
        const id    = card.dataset.videoId;
        const title = card.dataset.title;
        const desc  = card.dataset.description;
        if (!id || id.startsWith('TODO_')) return;
        setFeatured(id, title, desc);
        document.querySelectorAll('.video-card').forEach(c => c.classList.remove('is-active'));
        card.classList.add('is-active');
        // Scroll to featured (smooth)
        featured.scrollIntoView({ behavior: 'smooth', block: 'center' });
      };
      // Card click (anywhere) triggers swap, except external link
      card.addEventListener('click', (e) => {
        if (e.target.closest('a.btn-mini.secondary')) return; // let external link work
        handler(e);
      });
    });
  }
})();


/* Drobna ochrana fotek: vypne "ulozit obrazek" (prave tlacitko) a tazeni mysi na obrazcich.
   Neni neprustrelne (screenshot / DevTools to obejdou), jen odstrasi bezne stazeni. */
(function () {
  document.addEventListener('contextmenu', function (e) {
    if (e.target && e.target.tagName === 'IMG') e.preventDefault();
  });
  document.addEventListener('dragstart', function (e) {
    if (e.target && e.target.tagName === 'IMG') e.preventDefault();
  });
  var st = document.createElement('style');
  st.textContent = 'img{-webkit-user-drag:none;user-select:none;-webkit-touch-callout:none}';
  document.head.appendChild(st);
})();


/* Sdílený lightbox — klik na jakýkoli <main> obrázek = zvětšení přes celou obrazovku.
   JEDNOTNÝ zdroj: každá stránka, která načítá main.js, dostane zoom automaticky.
   Guard: pokud stránka má vlastní inline #__lb (legacy / builder), main.js se nezapojí
   (žádná kolize). Běží až po DOMContentLoaded, aby guard viděl celý DOM. */
(function () {
  function init() {
    if (document.getElementById('__lb')) return;            // stránka má vlastní inline lightbox
    // Linked album photographs navigate; only standalone images open the lightbox.
    var imgs = Array.from(document.querySelectorAll('main img')).filter(function (img) { return !img.closest('a'); });
    if (!imgs.length) return;                                 // není co zvětšovat
    var style = document.createElement('style');
    style.textContent = '#__lb{display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.93);cursor:zoom-out;align-items:center;justify-content:center;padding:2vh}#__lb.open{display:flex}#__lb img{max-width:100%;max-height:96vh;object-fit:contain;box-shadow:0 8px 40px rgba(0,0,0,0.6);border-radius:8px}#__lb .__lbhint{position:absolute;bottom:1rem;left:50%;transform:translateX(-50%);color:rgba(255,255,255,0.6);font:13px/1 system-ui,sans-serif}main img{cursor:zoom-in;transition:transform .15s ease}main img:hover{transform:scale(1.005)}';
    document.head.appendChild(style);
    var lb = document.createElement('div');
    lb.id = '__lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Zvětšený obrázek');
    lb.innerHTML = '<img id="__lbimg" alt=""><button type="button" id="__lbclose" class="__lbclose" aria-label="Zavřít zvětšený obrázek">✕</button><span class="__lbhint">Klikni nebo stiskni ESC pro zavření</span>';
    document.body.appendChild(lb);
    var closeStyle = document.createElement('style');
    closeStyle.textContent = '.__lbclose{position:absolute;top:1rem;right:1rem;width:2.5rem;height:2.5rem;border:none;border-radius:50%;background:rgba(255,255,255,0.15);color:#fff;font-size:1.25rem;line-height:1;cursor:pointer}.__lbclose:hover,.__lbclose:focus-visible{background:rgba(255,255,255,0.3)}.__lbclose:focus-visible{outline:2px solid #fff;outline-offset:2px}';
    document.head.appendChild(closeStyle);
    var lbimg = document.getElementById('__lbimg');
    var lbclose = document.getElementById('__lbclose');
    var lastTrigger = null;

    function focusables() {
      return [lbclose].filter(function (el) { return el; });
    }

    function open(src, alt, trigger) {
      lastTrigger = trigger || null;
      lbimg.src = src; lbimg.alt = alt || '';
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onKeydown);
      lbclose.focus();
    }
    function close() {
      lb.classList.remove('open'); lbimg.src = ''; document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeydown);
      if (lastTrigger && typeof lastTrigger.focus === 'function') lastTrigger.focus();
      lastTrigger = null;
    }
    function onKeydown(e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') {
        // Single focusable element (close button) — keep focus trapped inside it.
        var els = focusables();
        if (!els.length) { e.preventDefault(); return; }
        e.preventDefault();
        els[0].focus();
      }
    }
    lb.addEventListener('click', close);
    imgs.forEach(function (img) {
      // A plain <img> isn't focusable, so lastTrigger.focus() on close would
      // silently no-op. tabindex="-1" makes it a valid programmatic focus
      // target without adding it to the normal Tab order (clicking already
      // opens the lightbox; this only matters for focus restoration on close).
      if (!img.hasAttribute('tabindex')) img.setAttribute('tabindex', '-1');
      img.addEventListener('click', function (e) { e.stopPropagation(); open(img.src, img.alt, img); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
