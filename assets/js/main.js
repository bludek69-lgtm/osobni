// Osobní web — Luděk
// Minimal JS: mobile nav toggle + lazy-load helper + theme toggle (Phase 5.1)

// Theme toggle — runs EARLY (before DOMContentLoaded) to prevent flash of wrong theme
(function () {
  'use strict';
  const STORAGE_KEY = 'cestovatel69_theme_mode'; // 'dark' | 'light' | 'auto'
  const stored = (() => { try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; } })();
  const prefersDark = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  let mode;
  if (stored === 'dark' || stored === 'light') {
    mode = stored;
  } else {
    // 'auto' or unset → fall back to system preference; if no preference, respect per-page theme (no override)
    mode = prefersDark ? 'dark' : 'light';
    // Note: if user has never toggled, we still APPLY system preference to keep behavior predictable.
    // Saved value "auto" would mean explicit user choice for "system", overrides default to no-override.
    if (stored === 'auto') mode = null; // no override → respect per-page designed theme
  }
  if (mode === 'dark' || mode === 'light') {
    document.documentElement.setAttribute('data-theme-mode', mode);
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
    btn.setAttribute('aria-label', 'Přepnout tmavý / světlý režim');
    btn.setAttribute('title', 'Tmavý / světlý režim');
    const updateIcon = () => {
      const current = document.documentElement.getAttribute('data-theme-mode');
      // Show icon for NEXT mode (clickable affordance)
      if (current === 'dark') { btn.textContent = '☀️'; btn.setAttribute('aria-label', 'Přepnout na světlý režim'); }
      else if (current === 'light') { btn.textContent = '🌙'; btn.setAttribute('aria-label', 'Přepnout na tmavý režim'); }
      else { btn.textContent = '🌓'; btn.setAttribute('aria-label', 'Auto režim — klikni pro přepnutí'); }
    };
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme-mode');
      const next = current === 'dark' ? 'light' : (current === 'light' ? null : 'dark');
      if (next === null) {
        document.documentElement.removeAttribute('data-theme-mode');
        try { localStorage.setItem(STORAGE_KEY, 'auto'); } catch (e) {}
      } else {
        document.documentElement.setAttribute('data-theme-mode', next);
        try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
      }
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

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('is-open');
      const expanded = nav.classList.contains('is-open');
      toggle.setAttribute('aria-expanded', String(expanded));
    });
    // Close menu on link click (mobile)
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => nav.classList.remove('is-open'));
    });
  }

  // Native lazy-load fallback (browser handles loading="lazy", but we ensure decoding="async")
  document.querySelectorAll('img:not([decoding])').forEach(img => {
    img.setAttribute('decoding', 'async');
  });

  // Set aria-current on active nav link based on path
  const path = location.pathname.replace(/\/+$/, '').toLowerCase();
  document.querySelectorAll('.nav a').forEach(a => {
    const href = (a.getAttribute('href') || '').replace(/\/+$/, '').toLowerCase();
    if (path.endsWith(href) || (href === '' && path.endsWith('/osobni'))) {
      a.setAttribute('aria-current', 'page');
    }
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
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>
        ${title ? `<div class="meta"><h3>${title}</h3>${description ? `<p>${description}</p>` : ''}</div>` : ''}
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
      const playBtn = card.querySelector('.btn-play');
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
      if (playBtn) playBtn.addEventListener('click', handler);
    });
  }
})();
