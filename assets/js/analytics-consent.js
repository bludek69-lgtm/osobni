// First-party consent UI. Google Analytics is loaded only after an explicit opt-in.
(function () {
  'use strict';
  if (window.__cestovatelAnalyticsInstalled) return;
  window.__cestovatelAnalyticsInstalled = true;
  const MEASUREMENT_ID = 'G-BM11EHQG00';
  const KEY = 'cestovatel69_analytics_consent_v1';
  const AGE = 180 * 24 * 60 * 60 * 1000;
  const production = ['cestovatel69.cz', 'www.cestovatel69.cz'].includes(location.hostname);
  const language = document.documentElement.lang.split('-')[0];
  const words = {
    cs: ['Měření návštěvnosti', 'Se souhlasem používám Google Analytics, abych zjistil, které články a videa vás zajímají. Odmítnutí nijak neomezí používání webu.', 'Povolit měření', 'Odmítnout měření', 'Podrobnosti o soukromí', 'Nastavení soukromí', 'Měření je povolené. Svou volbu můžeš kdykoli změnit.', 'Měření je vypnuté. Svou volbu můžeš kdykoli změnit.', 'Zavřít'],
    en: ['Visitor statistics', 'With your permission, I use Google Analytics to understand which articles and videos interest you. Declining does not limit this website.', 'Allow analytics', 'Decline analytics', 'Privacy details (Czech)', 'Privacy settings', 'Analytics is enabled. You can change your choice at any time.', 'Analytics is disabled. You can change your choice at any time.', 'Close'],
    it: ['Statistiche delle visite', 'Con il tuo consenso uso Google Analytics per capire quali articoli e video ti interessano. Il rifiuto non limita il sito.', 'Consenti statistiche', 'Rifiuta statistiche', 'Informazioni sulla privacy (ceco)', 'Impostazioni privacy', 'Statistiche attive. Puoi cambiare la scelta in qualsiasi momento.', 'Statistiche disattivate. Puoi cambiare la scelta in qualsiasi momento.', 'Chiudi']
  }[language] || null;
  const text = words || ['Visitor statistics', 'With your permission, I use Google Analytics to understand which articles and videos interest you. Declining does not limit this website.', 'Allow analytics', 'Decline analytics', 'Privacy details (Czech)', 'Privacy settings', 'Analytics is enabled. You can change your choice at any time.', 'Analytics is disabled. You can change your choice at any time.', 'Close'];
  let allowed = false;
  let started = false;
  let banner;
  let status;
  let previousFocus;

  function readChoice() {
    try {
      const choice = JSON.parse(localStorage.getItem(KEY));
      return choice && typeof choice.allowed === 'boolean' && Number.isFinite(choice.at) && choice.at <= Date.now() && Date.now() - choice.at < AGE ? choice : null;
    } catch (_) { return null; }
  }

  function cleanURL(value) {
    try { const parsed = new URL(value); return /^https?:$/.test(parsed.protocol) ? parsed.origin + parsed.pathname : ''; }
    catch (_) { return ''; }
  }

  function tag() { window.dataLayer.push(arguments); }

  function enable() {
    if (!production || !/^G-[A-Z0-9]+$/.test(MEASUREMENT_ID)) return;
    window['ga-disable-' + MEASUREMENT_ID] = false;
    if (started) {
      tag('consent', 'update', { analytics_storage: 'granted' });
      return;
    }
    started = true;
    window.dataLayer = window.dataLayer || [];
    tag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    tag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    tag('js', new Date());
    tag('config', MEASUREMENT_ID, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: AGE / 1000,
      cookie_update: false,
      page_location: location.origin + location.pathname,
      page_referrer: cleanURL(document.referrer)
    });
    tag('event', 'page_view', { page_location: location.origin + location.pathname, page_title: document.title, page_referrer: cleanURL(document.referrer) });
    const script = document.createElement('script');
    script.async = true;
    script.id = 'cestovatel-google-tag';
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
    document.head.appendChild(script);
  }

  function disable() {
    window['ga-disable-' + MEASUREMENT_ID] = true;
    if (started) tag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    const names = ['_ga', '_ga_' + MEASUREMENT_ID.replace(/^G-/, '')];
    const domains = ['', location.hostname, '.cestovatel69.cz'];
    names.forEach(name => domains.forEach(domain => {
      document.cookie = name + '=;Max-Age=0;Path=/;SameSite=Lax' + (domain ? ';Domain=' + domain : '') + (location.protocol === 'https:' ? ';Secure' : '');
    }));
  }

  function apply(value) {
    allowed = value;
    document.documentElement.dataset.analyticsConsent = value ? 'granted' : 'denied';
    if (value) enable(); else disable();
    if (status) status.textContent = text[value ? 6 : 7];
  }

  function save(value) {
    try { localStorage.setItem(KEY, JSON.stringify({ allowed: value, at: Date.now() })); } catch (_) { /* Choice still applies for this page. */ }
    apply(value);
    banner.hidden = true;
    if (previousFocus && previousFocus.isConnected) previousFocus.focus();
  }

  function open() {
    previousFocus = document.activeElement;
    banner.hidden = false;
    banner.querySelector('button').focus();
  }

  function install() {
    // Public content only: no tracking inside demos or embedded local app examples.
    if (location.pathname.includes('/demo/')) return;
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = '/assets/css/analytics-consent.css?v=20261116';
    document.head.appendChild(css);
    banner = document.createElement('section');
    banner.className = 'analytics-consent';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-labelledby', 'analytics-consent-title');
    banner.innerHTML = '<div><h2 id="analytics-consent-title"></h2><p class="analytics-consent__explanation"></p><a class="analytics-consent__details" href="/soukromi/"></a><p class="analytics-consent__status"></p></div><div class="analytics-consent__actions"><button type="button" data-choice="yes"></button><button type="button" data-choice="no"></button><button type="button" data-choice="close" hidden></button></div>';
    banner.querySelector('h2').textContent = text[0];
    banner.querySelector('.analytics-consent__explanation').textContent = text[1];
    banner.querySelector('a').textContent = text[4];
    banner.querySelector('[data-choice="yes"]').textContent = text[2];
    banner.querySelector('[data-choice="no"]').textContent = text[3];
    banner.querySelector('[data-choice="close"]').textContent = text[8];
    status = banner.querySelector('.analytics-consent__status');
    document.body.appendChild(banner);
    const controls = document.createElement('span');
    controls.className = 'analytics-privacy-links';
    const settings = document.createElement('button');
    settings.type = 'button';
    settings.textContent = text[5];
    settings.addEventListener('click', open);
    const policy = document.createElement('a');
    policy.href = '/soukromi/';
    policy.textContent = text[4];
    controls.append(settings, policy);
    const footer = document.querySelector('.footer-links, .site-footer, footer');
    if (footer) footer.appendChild(controls);
    else { controls.classList.add('analytics-privacy-links--floating'); document.body.appendChild(controls); }
    const choice = readChoice();
    banner.hidden = !!choice;
    banner.querySelector('[data-choice="close"]').hidden = !choice;
    if (choice) apply(choice.allowed);
    else { window['ga-disable-' + MEASUREMENT_ID] = true; document.documentElement.dataset.analyticsConsent = 'unset'; }
    banner.addEventListener('click', event => {
      const button = event.target.closest('button[data-choice]');
      if (!button) return;
      if (button.dataset.choice === 'close') { banner.hidden = true; if (previousFocus?.isConnected) previousFocus.focus(); }
      else { save(button.dataset.choice === 'yes'); banner.querySelector('[data-choice="close"]').hidden = false; }
    });
    document.addEventListener('click', event => {
      if (!allowed || !started) return;
      const button = event.target.closest('.thumb-cover, .btn-play');
      const card = button?.closest('[data-video-id]');
      if (card && /^[\w-]{11}$/.test(card.dataset.videoId || '')) {
        tag('event', 'video_play_click', { video_id: card.dataset.videoId, video_provider: 'YouTube' });
      }
      const link = event.target.closest('a[href]');
      if (!link) return;
      try {
        const target = new URL(link.href);
        if (['youtube.com', 'www.youtube.com', 'youtu.be'].includes(target.hostname)) {
          const id = target.hostname === 'youtu.be' ? target.pathname.slice(1) : target.searchParams.get('v');
          tag('event', 'youtube_click', { video_id: /^[\w-]{11}$/.test(id || '') ? id : 'channel', link_domain: target.hostname });
        }
      } catch (_) { /* Invalid links are not measured. */ }
    }, true);
    window.addEventListener('storage', event => { if (event.key === KEY) { const next = readChoice(); apply(!!next?.allowed); } });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();
