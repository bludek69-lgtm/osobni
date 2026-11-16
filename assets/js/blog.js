// The complete article list remains readable without JavaScript.
document.querySelectorAll('[data-blog-filters]').forEach(filters => {
  const cards = [...document.querySelectorAll('[data-blog-series]')];
  const status = document.querySelector('[data-blog-status]');
  filters.hidden = false;
  const select = button => {
    filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    cards.forEach(card => { card.hidden = button.dataset.series !== 'all' && card.dataset.blogSeries !== button.dataset.series; });
    if (status) status.textContent = `Zobrazeno článků: ${cards.filter(card => !card.hidden).length}`;
  };
  const fromHash = () => {
    const group = location.hash.replace(/^#serie-/, '');
    const button = [...filters.querySelectorAll('button[data-series]')].find(item => item.dataset.series === group);
    select(button || filters.querySelector('[data-series="all"]'));
  };
  filters.addEventListener('click', event => {
    const button = event.target.closest('button[data-series]');
    if (!button) return;
    select(button);
    history.pushState(null, '', '#serie-' + button.dataset.series);
  });
  window.addEventListener('hashchange', fromHash);
  fromHash();
});
