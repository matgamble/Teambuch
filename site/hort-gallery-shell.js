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

  const planningPhoto = {
    id: 'planungstag-fruehstueck-2026',
    src: '../20260710_080305.jpg',
    caption: 'Gemeinsames Frühstück vor dem Planungstag',
    alt: 'Gemeinsames Frühstück des Teams vor dem Planungstag am 10. Juli 2026'
  };

  function addLightbox(doc, photo, returnTarget) {
    if (doc.getElementById(photo.id)) return;

    const lightbox = doc.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.id = photo.id;
    lightbox.innerHTML = `
      <a class="lightbox-close-area" href="#${returnTarget}" aria-label="Vollbild schließen"></a>
      <div class="lightbox-content">
        <a class="lightbox-close" href="#${returnTarget}" aria-label="Vollbild schließen">×</a>
        <img src="${photo.src}" alt="${photo.alt}">
        <p>${photo.caption}</p>
      </div>
    `;
    doc.body.appendChild(lightbox);
  }

  function installHortGallery(doc) {
    if (!doc.getElementById('hort-gallery-compact-style')) {
      const style = doc.createElement('style');
      style.id = 'hort-gallery-compact-style';
      style.textContent = `
        #hort-gallery-card {
          align-self: start;
          padding: 12px;
          overflow: hidden;
        }
        #hort-gallery-card .special-photo-gallery {
          display: flex;
          gap: .75rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding: .25rem 0 .75rem;
          margin-top: .5rem;
          -webkit-overflow-scrolling: touch;
        }
        #hort-gallery-card .special-photo-gallery figure {
          flex: 0 0 155px;
          width: 155px;
          margin: 0;
          padding: 6px;
          scroll-snap-align: start;
          border-radius: 14px;
        }
        #hort-gallery-card .special-photo-gallery figure:first-child {
          flex-basis: 205px;
          width: 205px;
        }
        #hort-gallery-card .special-photo-gallery img {
          display: block;
          width: 100%;
          height: 205px;
          object-fit: cover;
          border-radius: 11px;
        }
        #hort-gallery-card figcaption {
          margin-top: .4rem;
          text-align: center;
          font-size: .9rem;
        }
        @media (max-width: 600px) {
          #hort-gallery-card {
            padding: 10px;
          }
          #hort-gallery-card .special-photo-gallery figure {
            flex-basis: 140px;
            width: 140px;
          }
          #hort-gallery-card .special-photo-gallery figure:first-child {
            flex-basis: 190px;
            width: 190px;
          }
          #hort-gallery-card .special-photo-gallery img {
            height: 185px;
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
    card.style.gridColumn = '';

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

    photos.forEach((photo) => addLightbox(doc, photo, 'stammgruppen'));
  }

  function installPlanningDayPhoto(doc) {
    if (doc.getElementById('planungstag-juli-2026')) return;

    const planningSection = doc.getElementById('planungstage')
      || [...doc.querySelectorAll('section')].find((section) => {
        const heading = section.querySelector('h2');
        return heading && heading.textContent.trim().toLowerCase().includes('planungstag');
      });

    if (!planningSection) return;

    const album = doc.createElement('article');
    album.id = 'planungstag-juli-2026';
    album.className = 'moment-album';
    album.innerHTML = `
      <h3>Planungstag 10. Juli 2026</h3>
      <p>Gemeinsamer Start in den Planungstag mit Frühstück und Zeit zum Ankommen.</p>
      <div class="special-photo-gallery" aria-label="Planungstag 10. Juli 2026">
        <figure>
          <a class="gallery-link" href="#${planningPhoto.id}">
            <img src="${planningPhoto.src}" alt="${planningPhoto.alt}" loading="lazy">
          </a>
          <figcaption>${planningPhoto.caption}</figcaption>
        </figure>
      </div>
    `;

    const existingAlbum = planningSection.querySelector('.moment-album');
    if (existingAlbum?.parentElement) {
      existingAlbum.insertAdjacentElement('afterend', album);
    } else {
      planningSection.appendChild(album);
    }

    addLightbox(doc, planningPhoto, 'planungstag-juli-2026');
  }

  function installGalleries() {
    const doc = frame.contentDocument;
    if (!doc) return;

    installHortGallery(doc);
    installPlanningDayPhoto(doc);
  }

  frame.addEventListener('load', installGalleries);
  window.setTimeout(installGalleries, 250);
})();