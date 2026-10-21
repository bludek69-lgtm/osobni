/* Počasí a webkamery — Itálie (cestovatel69.cz)
   Počasí: Open-Meteo (zdarma, bez API klíče, data CC BY 4.0). Webkamery: oficiální přehrávač YouTube (až po kliknutí).
   Použití: <div id="pw-app" data-pw="full|strip"></div> – viz cestovani/italie/pocasi-webkamery.html */
(function () {
  'use strict';

  var LANG = (document.documentElement.lang || 'cs').slice(0, 2);
  if (['cs', 'en', 'it'].indexOf(LANG) < 0) LANG = 'cs';
  var LOCALE = { cs: 'cs-CZ', en: 'en-GB', it: 'it-IT' }[LANG];

  var T = {
    cs: {
      today: 'dnes', forecast: '7denní předpověď', updated: 'Aktualizováno', wind: 'vítr', humidity: 'vlhkost', feels: 'pocitově',
      overview: 'Všechna města', loading: 'Načítám počasí…', error: 'Počasí se teď nepodařilo načíst. Zkus to za chvíli, nebo otevři',
      errorLink: 'předpověď na Open-Meteo', live: 'ŽIVĚ', play: 'Spustit živě', source: 'Zdroj', open: 'Otevřít živý přenos',
      all: 'Vše', kmh: 'km/h', rain: 'srážky', now: 'Právě teď'
    },
    en: {
      today: 'today', forecast: '7-day forecast', updated: 'Updated', wind: 'wind', humidity: 'humidity', feels: 'feels like',
      overview: 'All cities', loading: 'Loading weather…', error: 'The weather could not be loaded right now. Try again in a moment, or open the',
      errorLink: 'forecast on Open-Meteo', live: 'LIVE', play: 'Play live', source: 'Source', open: 'Open live stream',
      all: 'All', kmh: 'km/h', rain: 'rain', now: 'Right now'
    },
    it: {
      today: 'oggi', forecast: 'Previsioni a 7 giorni', updated: 'Aggiornato', wind: 'vento', humidity: 'umidità', feels: 'percepita',
      overview: 'Tutte le città', loading: 'Carico il meteo…', error: 'Non è stato possibile caricare il meteo. Riprova tra poco oppure apri le',
      errorLink: 'previsioni su Open-Meteo', live: 'LIVE', play: 'Avvia la diretta', source: 'Fonte', open: 'Apri la diretta',
      all: 'Tutte', kmh: 'km/h', rain: 'pioggia', now: 'Adesso'
    }
  }[LANG];

  /* WMO kódy → [ikona den, ikona noc, text cs, en, it] */
  var WMO = {
    0: ['☀️', '🌙', 'jasno', 'clear sky', 'sereno'],
    1: ['🌤️', '🌙', 'převážně jasno', 'mostly clear', 'prevalentemente sereno'],
    2: ['⛅', '☁️', 'polojasno', 'partly cloudy', 'parzialmente nuvoloso'],
    3: ['☁️', '☁️', 'zataženo', 'overcast', 'coperto'],
    45: ['🌫️', '🌫️', 'mlha', 'fog', 'nebbia'],
    48: ['🌫️', '🌫️', 'namrzající mlha', 'rime fog', 'nebbia con brina'],
    51: ['🌦️', '🌧️', 'slabé mrholení', 'light drizzle', 'pioviggine debole'],
    53: ['🌦️', '🌧️', 'mrholení', 'drizzle', 'pioviggine'],
    55: ['🌧️', '🌧️', 'silné mrholení', 'heavy drizzle', 'pioviggine intensa'],
    56: ['🌧️', '🌧️', 'mrznoucí mrholení', 'freezing drizzle', 'pioviggine gelata'],
    57: ['🌧️', '🌧️', 'mrznoucí mrholení', 'freezing drizzle', 'pioviggine gelata'],
    61: ['🌦️', '🌧️', 'slabý déšť', 'light rain', 'pioggia debole'],
    63: ['🌧️', '🌧️', 'déšť', 'rain', 'pioggia'],
    65: ['🌧️', '🌧️', 'silný déšť', 'heavy rain', 'pioggia forte'],
    66: ['🌧️', '🌧️', 'mrznoucí déšť', 'freezing rain', 'pioggia gelata'],
    67: ['🌧️', '🌧️', 'mrznoucí déšť', 'freezing rain', 'pioggia gelata'],
    71: ['🌨️', '🌨️', 'slabé sněžení', 'light snow', 'neve debole'],
    73: ['❄️', '❄️', 'sněžení', 'snow', 'neve'],
    75: ['❄️', '❄️', 'silné sněžení', 'heavy snow', 'neve intensa'],
    77: ['❄️', '❄️', 'sněhová zrna', 'snow grains', 'granelli di neve'],
    80: ['🌦️', '🌧️', 'přeháňky', 'rain showers', 'rovesci'],
    81: ['🌧️', '🌧️', 'silné přeháňky', 'heavy showers', 'rovesci forti'],
    82: ['⛈️', '⛈️', 'prudké přeháňky', 'violent showers', 'rovesci violenti'],
    85: ['🌨️', '🌨️', 'sněhové přeháňky', 'snow showers', 'rovesci di neve'],
    86: ['🌨️', '🌨️', 'silné sněhové přeháňky', 'heavy snow showers', 'rovesci di neve forti'],
    95: ['⛈️', '⛈️', 'bouřka', 'thunderstorm', 'temporale'],
    96: ['⛈️', '⛈️', 'bouřka s kroupami', 'thunderstorm with hail', 'temporale con grandine'],
    99: ['⛈️', '⛈️', 'silná bouřka s kroupami', 'severe thunderstorm with hail', 'temporale forte con grandine']
  };
  var LI = { cs: 2, en: 3, it: 4 }[LANG];
  function wmo(code, isDay) {
    var w = WMO[code] || WMO[3];
    return { icon: isDay === 0 ? w[1] : w[0], text: w[LI] };
  }

  /* Města: nejlidnatější + Bergamo (odkud jezdím) a Lerici (srdcovka). */
  var CITIES = [
    { id: 'roma', lat: 41.9028, lon: 12.4964, n: { cs: 'Řím', en: 'Rome', it: 'Roma' } },
    { id: 'milano', lat: 45.4642, lon: 9.19, n: { cs: 'Milán', en: 'Milan', it: 'Milano' } },
    { id: 'napoli', lat: 40.8518, lon: 14.2681, n: { cs: 'Neapol', en: 'Naples', it: 'Napoli' } },
    { id: 'torino', lat: 45.0703, lon: 7.6869, n: { cs: 'Turín', en: 'Turin', it: 'Torino' } },
    { id: 'palermo', lat: 38.1157, lon: 13.3615, n: { cs: 'Palermo', en: 'Palermo', it: 'Palermo' } },
    { id: 'genova', lat: 44.4056, lon: 8.9463, n: { cs: 'Janov', en: 'Genoa', it: 'Genova' } },
    { id: 'bologna', lat: 44.4949, lon: 11.3426, n: { cs: 'Boloňa', en: 'Bologna', it: 'Bologna' } },
    { id: 'firenze', lat: 43.7696, lon: 11.2558, n: { cs: 'Florencie', en: 'Florence', it: 'Firenze' } },
    { id: 'bari', lat: 41.1171, lon: 16.8719, n: { cs: 'Bari', en: 'Bari', it: 'Bari' } },
    { id: 'catania', lat: 37.5079, lon: 15.083, n: { cs: 'Catania', en: 'Catania', it: 'Catania' } },
    { id: 'venezia', lat: 45.4408, lon: 12.3155, n: { cs: 'Benátky', en: 'Venice', it: 'Venezia' } },
    { id: 'verona', lat: 45.4384, lon: 10.9916, n: { cs: 'Verona', en: 'Verona', it: 'Verona' } },
    { id: 'bergamo', lat: 45.6983, lon: 9.6773, n: { cs: 'Bergamo', en: 'Bergamo', it: 'Bergamo' } },
    { id: 'lerici', lat: 44.076, lon: 9.911, n: { cs: 'Lerici', en: 'Lerici', it: 'Lerici' } }
  ];
  var STRIP = ['roma', 'milano', 'napoli', 'firenze', 'venezia', 'palermo'];

  /* Webkamery — pouze streamy, u kterých jsem ověřil, že se dají vložit (YouTube přehrávač). */
  var G = {
    roma: 'linear-gradient(135deg,#5a2a1a,#b85c38 55%,#e2a36b)',
    milano: 'linear-gradient(135deg,#1c2733,#46607a 60%,#9fb4c8)',
    napoli: 'linear-gradient(135deg,#0b2a4a,#1d6fa5 55%,#7fc3e8)',
    firenze: 'linear-gradient(135deg,#4a2a14,#a5572a 55%,#d9a05b)',
    venezia: 'linear-gradient(135deg,#0d3b3f,#1f8a8a 55%,#8fd1c4)',
    cinque: 'linear-gradient(135deg,#0d3a3a,#2a8a6a 50%,#e0b25b)'
  };
  var ICO = { roma: '🏛️', milano: '⛪', napoli: '🌋', firenze: '🏰', venezia: '🛶', cinque: '🌊' };
  var CAM_CITIES = [
    { id: 'roma', n: T_n('Řím', 'Rome', 'Roma') },
    { id: 'milano', n: T_n('Milán', 'Milan', 'Milano') },
    { id: 'napoli', n: T_n('Neapol', 'Naples', 'Napoli') },
    { id: 'firenze', n: T_n('Florencie', 'Florence', 'Firenze') },
    { id: 'venezia', n: T_n('Benátky', 'Venice', 'Venezia') },
    { id: 'cinque', n: T_n('Cinque Terre', 'Cinque Terre', 'Cinque Terre') }
  ];
  function T_n(cs, en, it) { return { cs: cs, en: en, it: it }[LANG]; }
  function L(a, b, c) { return { cs: a, en: b, it: c }[LANG]; }

  var CAMS = [
    { c: 'roma', yt: 'VfH8gQJQnBE', t: L('Piazza Venezia a Oltář vlasti', 'Piazza Venezia and the Altare della Patria', 'Piazza Venezia e Altare della Patria'), by: 'Roma Five Suites' },
    { c: 'roma', yt: 'IZtH_58-jKI', t: L('Monte Mario — panorama Říma', 'Monte Mario — panorama of Rome', 'Monte Mario — panorama di Roma'), by: 'Webcam Italia' },
    { c: 'roma', yt: '89d3tEaqImM', t: L('Kupole baziliky sv. Petra', 'Dome of St Peter’s Basilica', 'Cupola di San Pietro'), by: 'RAMSAT / REALVIEWCAM360' },
    { c: 'roma', yt: '03pYP2Nmreo', t: L('Vatikán — náměstí sv. Petra', 'Vatican — St Peter’s Square', 'Vaticano — Piazza San Pietro'), by: 'Vatican News' },
    { c: 'milano', yt: 'lbIa5P0uirA', t: L('Dóm a Piazza del Duomo', 'Duomo and Piazza del Duomo', 'Duomo e Piazza del Duomo'), by: 'SkylineWebcams' },
    { c: 'milano', yt: 'dsoM6TYIkOI', t: L('Panorama Milána', 'Milan skyline', 'Skyline di Milano'), by: 'Espansione TV' },
    { c: 'napoli', yt: 'RB27KB37ldc', t: L('Vesuv a město', 'Vesuvius and the city', 'Vesuvio e la città'), by: 'Il Mattino' },
    { c: 'napoli', yt: 'LO2Fvujwc8M', t: L('Neapolský záliv (Portici)', 'Gulf of Naples (Portici)', 'Golfo di Napoli (Portici)'), by: 'Paesaggi Digitali' },
    { c: 'firenze', yt: 'yhJEW02TfZU', t: L('Piazza della Signoria', 'Piazza della Signoria', 'Piazza della Signoria'), by: 'SkylineWebcams' },
    { c: 'venezia', yt: 'ASqGNET31VY', t: L('Bazén svatého Marka', 'St Mark’s Basin', 'Bacino di San Marco'), by: 'I Love You Venice' },
    { c: 'venezia', yt: 'mt7uE-n0YPI', t: L('Ponte delle Guglie', 'Ponte delle Guglie', 'Ponte delle Guglie'), by: 'I Love You Venice' },
    { c: 'venezia', yt: 'zKGzYuT5tg0', t: L('Canal Grande od Ca’ Angelo', 'Grand Canal from Ca’ Angelo', 'Canal Grande da Ca’ Angelo'), by: 'I Love You Venice' },
    { c: 'cinque', yt: 'QpqsJKI0Wfk', t: L('Manarola', 'Manarola', 'Manarola'), by: 'Paesaggi Digitali' }
  ];

  /* Další kamery u velkých měst (otevřou se na SkylineWebcams, kde jsou vždy aktuální). */
  var SKY = 'https://www.skylinewebcams.com/' + { cs: 'cs', en: 'en', it: 'it' }[LANG] + '/webcam/italia/';
  var MORE = [
    { n: L('Turín', 'Turin', 'Torino'), d: L('kamery v Piemontu', 'webcams in Piedmont', 'webcam in Piemonte'), u: SKY + 'piemonte/torino.html' },
    { n: L('Boloňa', 'Bologna', 'Bologna'), d: L('věže Asinelli a Garisenda', 'Asinelli and Garisenda towers', 'Torri Asinelli e Garisenda'), u: SKY + 'emilia-romagna/bologna/bologna-torre-degli-asinelli.html' },
    { n: L('Janov', 'Genoa', 'Genova'), d: 'Boccadasse', u: SKY + 'liguria/genova/boccadasse-genova.html' },
    { n: 'Verona', d: L('Piazza Bra a Arena', 'Piazza Bra and the Arena', 'Piazza Bra e Arena'), u: SKY + 'veneto/verona/verona.html' },
    { n: 'Palermo', d: L('katedrála a přístav', 'cathedral and port', 'cattedrale e porto'), u: SKY + 'sicilia/palermo/cattedrale-di-palermo.html' },
    { n: 'Bari', d: L('pláž Pane e Pomodoro', 'Pane e Pomodoro beach', 'spiaggia Pane e Pomodoro'), u: SKY + 'puglia/bari/spiaggia-di-bari.html' },
    { n: 'Pisa', d: L('Šikmá věž a panorama', 'Leaning Tower and panorama', 'Torre pendente e panorama'), u: SKY + 'toscana/pisa/pisa.html' },
    { n: 'Catania', d: L('sopka Etna', 'Mount Etna', 'Etna'), u: SKY + 'sicilia/catania/vulcano-etna.html' }
  ];

  /* ───── pomocné ───── */
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function deg(n) { return Math.round(n) + '°'; }
  function cityName(c) { return c.n[LANG]; }
  function dayName(iso, i) {
    if (i === 0) return T.today;
    return new Intl.DateTimeFormat(LOCALE, { weekday: 'short' }).format(new Date(iso + 'T12:00:00'));
  }

  /* ───── data (Open-Meteo, 1 dotaz na všechna města, cache 10 min) ───── */
  var CK = 'pw-cache-v1';
  function load() {
    try {
      var c = JSON.parse(sessionStorage.getItem(CK) || 'null');
      if (c && Date.now() - c.t < 600000 && c.d.length === CITIES.length) return Promise.resolve(c.d);
    } catch (e) { /* sessionStorage nemusí být dostupné */ }
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + CITIES.map(function (c) { return c.lat; }).join(',') +
      '&longitude=' + CITIES.map(function (c) { return c.lon; }).join(',') +
      '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day' +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
      '&timezone=Europe%2FRome&forecast_days=7&wind_speed_unit=kmh';
    return fetch(url).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }).then(function (d) {
      if (!Array.isArray(d)) d = [d];
      try { sessionStorage.setItem(CK, JSON.stringify({ t: Date.now(), d: d })); } catch (e) { /* ignorováno */ }
      return d;
    });
  }

  /* ───── plná stránka: počasí ───── */
  function renderWeather(root, data) {
    var sel = 0;
    var hash = (location.hash || '').replace('#', '');
    CITIES.forEach(function (c, i) { if (c.id === hash) sel = i; });

    var chips = root.querySelector('#pw-chips'), main = root.querySelector('#pw-main'), grid = root.querySelector('#pw-grid');
    chips.innerHTML = ''; grid.innerHTML = '';

    function paint() {
      var c = CITIES[sel], d = data[sel], cur = d.current, w = wmo(cur.weather_code, cur.is_day);
      var upd = cur.time ? cur.time.slice(11, 16) : '';
      var days = d.daily.time.map(function (iso, i) {
        var dw = wmo(d.daily.weather_code[i], 1), rain = d.daily.precipitation_probability_max[i];
        return '<div class="pw-day' + (i === 0 ? ' pw-day--today' : '') + '" title="' + esc(dw.text) + '">' +
          '<div class="pw-day__name">' + esc(dayName(iso, i)) + '</div><div class="pw-day__ico" aria-hidden="true">' + dw.icon + '</div>' +
          '<div class="pw-day__max">' + deg(d.daily.temperature_2m_max[i]) + '</div><div class="pw-day__min">' + deg(d.daily.temperature_2m_min[i]) + '</div>' +
          '<div class="pw-day__rain">' + (rain != null && rain >= 20 ? '💧 ' + rain + ' %' : '') + '</div></div>';
      }).join('');
      main.innerHTML =
        '<div class="pw-main__top"><h3 class="pw-city">' + esc(cityName(c)) + '<small>Italia</small></h3>' +
        '<span class="pw-updated">' + T.updated + ' ' + esc(upd) + '</span></div>' +
        '<div class="pw-now"><div class="pw-now__icon" aria-hidden="true">' + w.icon + '</div><div>' +
        '<div class="pw-now__temp">' + Math.round(cur.temperature_2m) + '<sup>°C</sup></div>' +
        '<div class="pw-now__desc">' + esc(w.text) + '</div>' +
        '<div class="pw-facts"><span>💨 ' + T.wind + ' ' + Math.round(cur.wind_speed_10m) + ' ' + T.kmh + '</span>' +
        '<span>💧 ' + T.humidity + ' ' + Math.round(cur.relative_humidity_2m) + ' %</span>' +
        '<span>🌡️ ' + T.feels + ' ' + deg(cur.apparent_temperature) + '</span></div></div></div>' +
        '<p class="pw-label">' + T.forecast + '</p><div class="pw-days">' + days + '</div>';
      Array.prototype.forEach.call(root.querySelectorAll('[data-city]'), function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-city') === c.id ? 'true' : 'false');
      });
    }
    function select(i) { sel = i; try { history.replaceState(null, '', '#' + CITIES[i].id); } catch (e) { /* file:// */ } paint(); }

    CITIES.forEach(function (c, i) {
      var b = el('button', 'pw-chip', esc(cityName(c)));
      b.type = 'button'; b.setAttribute('data-city', c.id);
      b.addEventListener('click', function () { select(i); });
      chips.appendChild(b);
      var d = data[i], cur = d.current, w = wmo(cur.weather_code, cur.is_day);
      var m = el('button', 'pw-mini',
        '<span class="pw-mini__name">' + esc(cityName(c)) + '</span><span class="pw-mini__ico" aria-hidden="true">' + w.icon + '</span>' +
        '<span class="pw-mini__temp">' + Math.round(cur.temperature_2m) + '°</span>' +
        '<span class="pw-mini__hl">' + deg(d.daily.temperature_2m_max[0]) + ' / ' + deg(d.daily.temperature_2m_min[0]) + ' · ' + esc(w.text) + '</span>');
      m.type = 'button'; m.setAttribute('data-city', c.id); m.setAttribute('aria-label', cityName(c) + ', ' + Math.round(cur.temperature_2m) + '°, ' + w.text);
      m.addEventListener('click', function () { select(i); main.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); });
      grid.appendChild(m);
    });
    paint();
  }

  /* ───── plná stránka: webkamery ───── */
  function renderCams(root) {
    var chips = root.querySelector('#pw-camchips'), list = root.querySelector('#pw-cams'), more = root.querySelector('#pw-more');
    if (!list) return;
    var cur = 'all';
    var all = el('button', 'pw-chip', T.all); all.type = 'button'; all.setAttribute('data-cam', 'all'); chips.appendChild(all);
    CAM_CITIES.forEach(function (c) {
      var b = el('button', 'pw-chip', esc(c.n)); b.type = 'button'; b.setAttribute('data-cam', c.id); chips.appendChild(b);
    });
    function filter(id) {
      cur = id;
      Array.prototype.forEach.call(chips.children, function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-cam') === id ? 'true' : 'false'); });
      Array.prototype.forEach.call(list.children, function (f) { f.hidden = !(id === 'all' || f.getAttribute('data-c') === id); });
    }
    chips.addEventListener('click', function (e) { var b = e.target.closest('[data-cam]'); if (b) filter(b.getAttribute('data-cam')); });

    CAMS.forEach(function (c) {
      var cn = CAM_CITIES.filter(function (x) { return x.id === c.c; })[0].n;
      var card = el('article', 'pw-cam');
      card.setAttribute('data-c', c.c);
      card.innerHTML =
        '<div class="pw-cam__stage"><span class="pw-cam__live">' + T.live + '</span>' +
        '<button type="button" class="pw-cam__play" data-ico="' + ICO[c.c] + '" style="--pw-bg:' + G[c.c] + '" aria-label="' + esc(T.play + ': ' + c.t) + '">' +
        '<span class="pw-cam__btn" aria-hidden="true"></span><span class="pw-cam__txt">' + esc(c.t) + '</span></button></div>' +
        '<div class="pw-cam__body"><span class="pw-cam__city">' + esc(cn) + '</span><h3 class="pw-cam__title">' + esc(c.t) + '</h3>' +
        '<span class="pw-cam__by">' + esc(c.by) + '</span>' +
        '<div class="pw-cam__links"><a href="https://www.youtube.com/watch?v=' + c.yt + '" target="_blank" rel="noopener noreferrer">' + T.source + ' ↗</a></div></div>';
      card.querySelector('.pw-cam__play').addEventListener('click', function () {
        var st = card.querySelector('.pw-cam__stage');
        var f = document.createElement('iframe');
        f.src = 'https://www.youtube-nocookie.com/embed/' + c.yt + '?autoplay=1&mute=1&rel=0&playsinline=1';
        f.title = c.t; f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
        f.setAttribute('allowfullscreen', ''); f.referrerPolicy = 'strict-origin-when-cross-origin';
        st.innerHTML = ''; st.appendChild(f);
      });
      list.appendChild(card);
    });
    filter('all');

    if (more) {
      MORE.forEach(function (m) {
        var a = el('a', 'pw-link', '<b>' + esc(m.n) + '</b><span>' + esc(m.d) + '</span><i>' + T.open + ' ↗</i>');
        a.href = m.u; a.target = '_blank'; a.rel = 'noopener noreferrer';
        more.appendChild(a);
      });
    }
  }

  /* ───── malý pruh na rozcestníku ───── */
  function renderStrip(root, data, link) {
    root.innerHTML = '';
    STRIP.forEach(function (id) {
      var i = CITIES.map(function (c) { return c.id; }).indexOf(id), d = data[i], w = wmo(d.current.weather_code, d.current.is_day);
      var a = el('a', 'pw-strip__item', '<span aria-hidden="true">' + w.icon + '</span>' + esc(cityName(CITIES[i])) + ' <b>' + Math.round(d.current.temperature_2m) + '°</b>');
      a.href = link + '#' + id; a.title = w.text;
      root.appendChild(a);
    });
  }

  /* ───── start ───── */
  function fail(node) {
    node.innerHTML = '<div class="pw-error">' + T.error + ' <a href="https://open-meteo.com/en/docs" target="_blank" rel="noopener noreferrer">' + T.errorLink + '</a>.</div>';
  }
  function start() {
    var full = document.getElementById('pw-weather'), strip = document.getElementById('pw-strip'), cams = document.getElementById('pw-camroot');
    if (cams) renderCams(cams);
    if (!full && !strip) return;
    load().then(function (data) {
      if (full) renderWeather(full, data);
      if (strip) renderStrip(strip, data, strip.getAttribute('data-link') || 'pocasi-webkamery.html');
    }).catch(function () {
      if (full) fail(full.querySelector('#pw-main') || full);
      if (strip) strip.innerHTML = '';
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
