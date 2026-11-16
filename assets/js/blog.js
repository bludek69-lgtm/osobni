// The complete article list remains readable without JavaScript.
document.querySelectorAll('[data-blog-filters]').forEach(filters => {
  const cards = [...document.querySelectorAll('[data-blog-category]')];
  const status = document.querySelector('[data-blog-status]');
  filters.hidden = false;
  filters.addEventListener('click', event => {
    const button = event.target.closest('button[data-category]');
    if (!button) return;
    filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    cards.forEach(card => { card.hidden = button.dataset.category !== 'all' && card.dataset.blogCategory !== button.dataset.category; });
    if (status) status.textContent = `Zobrazeno článků: ${cards.filter(card => !card.hidden).length}`;
  });
});
