// Osobní web — Luděk
// Minimal JS: mobile nav toggle + lazy-load helper

(function () {
  'use strict';

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
