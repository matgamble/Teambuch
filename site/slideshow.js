(() => {
  function openSlideshow(slides, title, startIndex) {
    let index = startIndex || 0;

    const overlay = document.createElement('div');
    overlay.className = 'slideshow-overlay';
    overlay.innerHTML = `
      <button class="slideshow-close" aria-label="Schließen">&times;</button>
      <button class="slideshow-prev" aria-label="Vorherige Folie">&lsaquo;</button>
      <div class="slideshow-viewport"><img class="slideshow-image" alt=""></div>
      <button class="slideshow-next" aria-label="Nächste Folie">&rsaquo;</button>
      <div class="slideshow-caption"></div>
      <div class="slideshow-counter"></div>
    `;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const imgEl = overlay.querySelector('.slideshow-image');
    const captionEl = overlay.querySelector('.slideshow-caption');
    const counterEl = overlay.querySelector('.slideshow-counter');

    function render() {
      const slide = slides[index];
      imgEl.src = slide.src;
      imgEl.alt = slide.alt || title;
      captionEl.textContent = slide.caption || '';
      captionEl.style.display = slide.caption ? '' : 'none';
      counterEl.textContent = `${index + 1} / ${slides.length}`;
    }

    function close() {
      document.body.style.overflow = '';
      overlay.remove();
      document.removeEventListener('keydown', onKeydown);
    }

    function next() {
      index = (index + 1) % slides.length;
      render();
    }

    function prev() {
      index = (index - 1 + slides.length) % slides.length;
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

    if (slides.length <= 1) {
      overlay.querySelector('.slideshow-prev').style.display = 'none';
      overlay.querySelector('.slideshow-next').style.display = 'none';
      counterEl.style.display = 'none';
    }

    render();
  }

  // Fortbildungen-style triggers: whole card opens a named deck of images.
  document.querySelectorAll('.slideshow-trigger').forEach((trigger) => {
    const open = () => {
      const images = JSON.parse(trigger.dataset.slideshowImages);
      const title = trigger.dataset.slideshowTitle || '';
      const slides = images.map((src) => ({ src, alt: title }));
      openSlideshow(slides, title, 0);
    };
    trigger.addEventListener('click', open);
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  });

  // Every existing photo gallery: tapping an image opens the same
  // fullscreen viewer, starting at the tapped image, swipeable through
  // the rest of that gallery.
  document.querySelectorAll('.special-photo-gallery').forEach((gallery) => {
    const figures = [...gallery.querySelectorAll(':scope > figure')];
    if (!figures.length) return;

    const slides = figures.map((figure) => {
      const img = figure.querySelector('img');
      const caption = figure.querySelector('figcaption');
      return {
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt') || '',
        caption: caption ? caption.textContent.trim() : ''
      };
    });

    const title = gallery.getAttribute('aria-label') || '';

    figures.forEach((figure, i) => {
      const link = figure.querySelector('a.gallery-link');
      if (!link) return;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openSlideshow(slides, title, i);
      });
    });
  });
})();
