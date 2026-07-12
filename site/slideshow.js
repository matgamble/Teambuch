(() => {
  function openSlideshow(images, title, startIndex) {
    let index = startIndex || 0;

    const overlay = document.createElement('div');
    overlay.className = 'slideshow-overlay';
    overlay.innerHTML = `
      <button class="slideshow-close" aria-label="Schließen">&times;</button>
      <button class="slideshow-prev" aria-label="Vorherige Folie">&lsaquo;</button>
      <div class="slideshow-viewport"><img class="slideshow-image" alt=""></div>
      <button class="slideshow-next" aria-label="Nächste Folie">&rsaquo;</button>
      <div class="slideshow-counter"></div>
    `;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const imgEl = overlay.querySelector('.slideshow-image');
    const counterEl = overlay.querySelector('.slideshow-counter');

    function render() {
      imgEl.src = images[index];
      imgEl.alt = `${title} – Folie ${index + 1} von ${images.length}`;
      counterEl.textContent = `${index + 1} / ${images.length}`;
    }

    function close() {
      document.body.style.overflow = '';
      overlay.remove();
      document.removeEventListener('keydown', onKeydown);
    }

    function next() {
      index = (index + 1) % images.length;
      render();
    }

    function prev() {
      index = (index - 1 + images.length) % images.length;
      render();
    }

    function onKeydown(e) {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    }

    overlay.querySelector('.slideshow-close').addEventListener('click', close);
    overlay.querySelector('.slideshow-next').addEventListener('click', next);
    overlay.querySelector('.slideshow-prev').addEventListener('click', prev);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', onKeydown);

    let touchStartX = null;
    overlay.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    overlay.addEventListener('touchend', (e) => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) next(); else prev();
      }
      touchStartX = null;
    });

    render();
  }

  document.querySelectorAll('.slideshow-trigger').forEach((trigger) => {
    const open = () => {
      const images = JSON.parse(trigger.dataset.slideshowImages);
      const title = trigger.dataset.slideshowTitle || '';
      openSlideshow(images, title, 0);
    };
    trigger.addEventListener('click', open);
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  });
})();
