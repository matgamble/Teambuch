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

  function repairOrcaFacts(doc) {
    const facts = [
      'Orkas gehören zur Familie der Delfine und sind die größten Delfine der Welt.',
      'Orkas schlafen mit nur einer Gehirnhälfte, weil sie zum Atmen bewusst an die Wasseroberfläche kommen müssen.',
      'Jede Orka-Familie entwickelt eigene Rufe und Dialekte, die von Generation zu Generation weitergegeben werden.',
      'Orkas leben in stabilen Familiengruppen und bleiben oft ihr ganzes Leben eng mit ihrer Mutter verbunden.',
      'An der Form der Rückenflosse und am hellen Sattelfleck können Forschende einzelne Orkas unterscheiden.',
      'Weibliche Orkas können mehr als 80 Jahre alt werden.'
    ];

    let factIndex = 0;
    doc.querySelectorAll('.orka-fakt .orka-quote').forEach((quote) => {
      if (/orka/i.test(quote.textContent)) return;
      quote.textContent = `„${facts[factIndex % facts.length]}“`;
      factIndex += 1;
    });
  }

  function installGalleries() {
    const doc = frame.contentDocument;
    if (!doc) return;

    installHortGallery(doc);
    repairOrcaFacts(doc);
  }

  frame.addEventListener('load', installGalleries);
  window.setTimeout(installGalleries, 250);
  window.setTimeout(installGalleries, 900);
})();