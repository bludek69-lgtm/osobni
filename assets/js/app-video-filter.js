document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('app-video-filter');
  const cards = [...document.querySelectorAll('#youtube .video-card')];
  if (!select || !cards.length) return;
  cards.forEach((card) => {
    const option = document.createElement('option');
    option.value = card.dataset.videoId;
    option.textContent = card.dataset.title || card.querySelector('h4')?.textContent || option.value;
    select.append(option);
  });
  select.addEventListener('change', () => {
    cards.forEach((card) => { card.hidden = !!select.value && card.dataset.videoId !== select.value; });
  });
});
