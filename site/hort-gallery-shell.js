(() => {
  const frame = document.getElementById('teambuch-frame');
  if (!frame) return;

  const photos = [
    { id: 'hort-gruppenfoto', src: 'assets/stammgruppen/hort/hort-gruppenfoto.svg', caption: 'Stammgruppe Hort', alt: 'Stammgruppe Hort' },
    { id: 'hort-chiara', src: 'assets/stammgruppen/hort/hort-chiara.svg', caption: 'Chiara', alt: 'Chiara' },
    { id: 'hort-matze', src: 'assets/stammgruppen/hort/hort-matze.svg', caption: 'Matze', alt: 'Matze' },
    { id: 'hort-franzi', src: 'assets/stammgruppen/hort/hort-franzi.svg', caption: 'Franzi', alt: 'Franzi' },
    { id: 'hort-blenera', src: 'assets/stammgruppen/hort/hort-blenera.svg', caption: 'Blenera', alt: 'Blenera' }
  ];

  function installGallery() {
    const doc = frame.contentDocument;
    if (!doc) return;

    if (!doc.getElementById('hort-gallery-compact-style')) {
      const style = doc.createElement('style');
      style.id = 'hort-gallery-compact-style';
      style.textContent = `
        #hort-gallery-card .special-photo-gallery {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding: .5rem 0 1rem;
          -webkit-overflow-scrolling: touch;
        }
        #hort-gallery-card .special-photo-gallery figure {
          flex: 0 0 170px;
          width: 170px;
          margin: 0;
          scroll-snap-align: start;
        }
        #hort-gallery-card .special-photo-gallery figure:first-child {
          flex-basis: 230px;
          width: 230px;
        }
        #hort-gallery-card .special-photo-gallery img {
          display: block;
          width: 100%;
          height: 220px;
          object-fit: cover;
          border-radius: 16px;
        }
        #hort-gallery-card .special-photo-gallery figure:first-child img {
          height: 220px;
        }
        #hort-gallery-card figcaption {
          margin-top: .5rem;
          text-align: center;
        }
        @media (max-width: 600px) {
          #hort-gallery-card .special-photo-gallery figure {
            flex-basis: 145px;
            width: 145px;
          }
          #hort-gallery-card .special-photo-gallery figure:first-child {
            flex-basis: 205px;
            width: 205px;
          }
          #hort-gallery-card .special-photo-gallery img,
          #hort-gallery-card .special-photo-gallery figure:first-child img {
            height: 190px;
          }
        }
      `;
      doc.head.appendChild(style);
    }

    const section = doc.getElementById('stammgruppen');
    if (!section) return;

    let card = doc.getElementById('hort-gallery-card');
    if (!card) {
      card = [...section.querySelectorAll('article.card')].find((item) => item.querySelector('h3')?.textContent.trim() === 'Hort');
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
      <div class="special-photo-gallery" aria-label="Stammgruppe Hort">${figures}</div>
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