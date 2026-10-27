// A short, decorative welcome on the home page; the page stays usable throughout.
(function () {
  'use strict';

  const storageKey = 'cestovatel69_bus_intro_v1';
  const imageUrl = '/assets/img/bus-intro/ludek-mercedes-bila-kosile.webp';
  const duration = 4200;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (reducedMotion.matches || typeof Element.prototype.animate !== 'function') return;
  try {
    if (sessionStorage.getItem(storageKey)) return;
  } catch (_) {
    // Storage can be unavailable in private or restricted browsing modes.
  }

  function welcome() {
    if (document.hidden || document.querySelector('.bus-intro')) return;

    let stopped = false;
    let animation;
    let startTimer;
    let deadline;
    const layer = document.createElement('div');
    layer.className = 'bus-intro';
    layer.setAttribute('aria-hidden', 'true');

    const bus = new Image();
    bus.className = 'bus-intro__vehicle';
    bus.alt = '';
    bus.decoding = 'async';
    bus.draggable = false;

    function dismiss() {
      if (stopped) return;
      stopped = true;
      clearTimeout(startTimer);
      clearTimeout(deadline);
      bus.onload = null;
      bus.onerror = null;
      if (animation) animation.cancel();
      layer.remove();
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('scroll', dismiss, true);
      window.removeEventListener('pagehide', dismiss);
      window.removeEventListener('resize', dismiss);
      if (reducedMotion.removeEventListener) reducedMotion.removeEventListener('change', onMotion);
      else reducedMotion.removeListener(onMotion);
    }

    function onKey(event) {
      if (event.key === 'Escape') dismiss();
    }

    function onVisibility() {
      if (document.hidden) dismiss();
    }

    function onMotion(event) {
      if (event.matches) dismiss();
    }

    function start() {
      if (stopped || document.hidden || reducedMotion.matches) {
        dismiss();
        return;
      }
      layer.appendChild(bus);
      document.body.appendChild(layer);

      // If the small companion stylesheet did not load, skip the decoration.
      if (getComputedStyle(layer).position !== 'fixed') {
        dismiss();
        return;
      }
      const width = bus.getBoundingClientRect().width;
      try {
        animation = bus.animate([
          { transform: `translate3d(${-width - 24}px, -50%, 0)` },
          { transform: `translate3d(${window.innerWidth + 24}px, -50%, 0)` }
        ], { duration, easing: 'linear', fill: 'forwards' });
      } catch (_) {
        dismiss();
        return;
      }
      try { sessionStorage.setItem(storageKey, '1'); } catch (_) {}
      clearTimeout(deadline);
      deadline = setTimeout(dismiss, duration + 250);
      animation.finished.then(dismiss, dismiss);
    }

    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', dismiss, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('scroll', dismiss, { passive: true, capture: true });
    window.addEventListener('pagehide', dismiss);
    window.addEventListener('resize', dismiss);
    if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', onMotion);
    else reducedMotion.addListener(onMotion);

    // An optional decoration must never appear late after a slow download.
    deadline = setTimeout(dismiss, 5000);
    bus.onerror = dismiss;
    bus.onload = function () {
      const decoded = typeof bus.decode === 'function' ? bus.decode() : Promise.resolve();
      decoded.then(function () {
        if (!stopped) startTimer = setTimeout(start, 250);
      }, dismiss);
    };
    bus.src = imageUrl;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', welcome, { once: true });
  } else {
    welcome();
  }
})();
