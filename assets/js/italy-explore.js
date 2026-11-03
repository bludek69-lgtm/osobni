(function () {
  'use strict';
  var section = document.getElementById('regiony-prehled');
  if (!section) return;
  var controls = section.querySelector('[data-italy-controls]');
  var query = section.querySelector('[data-italy-query]');
  var kind = section.querySelector('[data-italy-kind]');
  var empty = section.querySelector('[data-italy-empty]');
  var cards = Array.prototype.slice.call(section.querySelectorAll('[data-italy-item]'));
  if (!controls || !query || !kind || !empty || !cards.length) return;
  function normalize(value) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); }
  function filter() {
    var term = normalize(query.value), selected = kind.value, visible = 0;
    cards.forEach(function (card) {
      var matches = (!term || normalize(card.getAttribute('data-search') || card.textContent).indexOf(term) !== -1) && (selected === 'all' || (card.getAttribute('data-kind') || '').split(/\s+/).indexOf(selected) !== -1);
      card.hidden = !matches;
      if (matches) visible++;
    });
    empty.hidden = visible !== 0;
  }
  controls.hidden = false;
  query.addEventListener('input', filter);
  kind.addEventListener('change', filter);
}());
