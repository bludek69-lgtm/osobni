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
})();
