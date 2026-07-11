(() => {
  const frame = document.getElementById('teambuch-frame');
  if (!frame) return;

  const photos = [
    {
      id: 'hort-gruppenfoto',
      src: 'assets/stammgruppen/hort/hort-gruppenfoto.svg',
      caption: 'Stammgruppe Hort',
      alt: 'Stammgruppe Hort'
    },
    {
      id: 'hort-chiara',
      src: 'assets/stammgruppen/hort/hort-chiara.svg',
      caption: 'Chiara',
      alt: 'Chiara'
    },
    {
      id: 'hort-matze',
      src: 'assets/stammgruppen/hort/hort-matze.svg',
      caption: 'Matze',
      alt: 'Matze'
    },
    {
      id: 'hort-franzi',
      src: 'assets/stammgruppen/hort/hort-franzi.svg',
      caption: 'Franzi',
      alt: 'Franzi'
    },
    {
      id: 'hort-blenera',
      src: 'assets/stammgruppen/hort/hort-blenera.svg',
      caption: 'Blenera',
      alt: 'Blenera'
    }
  ];

  function installGallery() {
    const doc = frame.contentDocument;
    if (!doc) return;

    const section = doc.getElementById('stammgruppen');
    if (!section) return;

    let card = doc.getElementById('hort-gallery-card');
    if (!card) {
      card = [...section.querySelectorAll('article.card')].find((item) => {
        return item.querySelector('h3')?.textContent.trim() === 'Hort';
      });
    }
    if (!card) return;

    card.id = 'hort-gallery-card';
    card.style.gridColumn = '1 / -1';

    const figures = photos.map((photo) => `
      <figure>
        <a class="gallery-link" href="#${photo.id}">
          <img src="${photo.src}" alt="${photo.alt}" loading="lazy">
        </a>
        <figcaption>${photo.caption}</figcaption>
      </figure>
    `).join('');

    card.innerHTML = `
      <h3>Stammgruppe Hort</h3>
      <p>Chiara, Matze, Franzi und Blenera</p>
      <div class="special-photo-gallery" aria-label="Stammgruppe Hort">
        ${figures}
      </div>
    `;

    photos.forEach((photo) => {
      if (doc.getElementById(photo.id)) return;

      const lightbox = doc.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.id = photo.id;
      lightbox.innerHTML = `
        <a class="lightbox-close-area" href="#stammgruppen" aria-label="Vollbild schließen"></a>
        <div class="lightbox-content">
          <a class="lightbox-close" href="#stammgruppen" aria-label="Vollbild schließen">×</a>
          <img src="${photo.src}" alt="${photo.alt}">
          <p>${photo.caption}</p>
        </div>
      `;
      doc.body.appendChild(lightbox);
    });
  }

  frame.addEventListener('load', installGallery);
  window.setTimeout(installGallery, 250);
})();
