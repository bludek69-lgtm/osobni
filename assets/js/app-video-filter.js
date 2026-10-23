document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('app-video-filter');
  const cards = [...document.querySelectorAll('#youtube .video-card')];
  const featured = document.querySelector('#youtube .featured-video');
  if (!select || !featured || !cards.length) return;

  const original = {
    videoId: featured.dataset.videoId,
    title: featured.dataset.title,
    description: featured.dataset.description || ''
  };
  const kioskOption = document.createElement('option');
  kioskOption.value = original.videoId;
  kioskOption.textContent = original.title;
  select.append(kioskOption);
  cards.forEach((card) => {
    const option = document.createElement('option');
    option.value = card.dataset.videoId;
    option.textContent = card.dataset.title || card.querySelector('h4')?.textContent || option.value;
    select.append(option);
  });

  select.addEventListener('change', () => {
    const selected = cards.find((card) => card.dataset.videoId === select.value);
    const video = selected ? {
      videoId: selected.dataset.videoId,
      title: selected.dataset.title,
      description: selected.dataset.description || ''
    } : original;
    cards.forEach((card) => {
      card.hidden = !!select.value && card.dataset.videoId !== select.value;
      card.classList.remove('is-active');
    });
    Object.assign(featured.dataset, video);

    // Reset a playing iframe to a cover for the newly selected video.
    let cover = featured.querySelector('.thumb-cover');
    if (!cover) {
      cover = document.createElement('button');
      cover.type = 'button';
      cover.className = 'thumb-cover';
      cover.addEventListener('click', () => {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(featured.dataset.videoId)}?autoplay=1&rel=0`;
        iframe.title = featured.dataset.title || '';
        iframe.loading = 'lazy';
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        featured.replaceChildren(iframe);
      });
      featured.replaceChildren(cover);
    }
    const playLabel = { cs: 'Přehrát', en: 'Play', it: 'Riproduci' }[document.documentElement.lang] || 'Play';
    cover.setAttribute('aria-label', `${playLabel}: ${video.title}`);
    cover.style.backgroundImage = `url("https://img.youtube.com/vi/${encodeURIComponent(video.videoId)}/hqdefault.jpg")`;
  });
});
