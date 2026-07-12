(() => {
  const personalratImages = {
    info: [
      'assets/aktuelles/personalratswahl-2026/img1-01.txt',
      'assets/aktuelles/personalratswahl-2026/img1-02.txt'
    ],
    dienststelle: [
      'assets/aktuelles/personalratswahl-2026/img2-01.txt',
      'assets/aktuelles/personalratswahl-2026/img2-02.txt'
    ],
    termin: [
      'assets/aktuelles/personalratswahl-2026/img3-01.txt',
      'assets/aktuelles/personalratswahl-2026/img3-02.txt'
    ],
    kandidierende: [
      'assets/aktuelles/personalratswahl-2026/img4-01.txt',
      'assets/aktuelles/personalratswahl-2026/img4-02.txt',
      'assets/aktuelles/personalratswahl-2026/img4-03.txt'
    ]
  };

  const personalratImageCache = new Map();

  const getPersonalratImage = (key) => {
    if (!personalratImageCache.has(key)) {
      const paths = personalratImages[key] || [];
      const imagePromise = Promise.all(paths.map(async (path) => {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Bild konnte nicht geladen werden: ${path}`);
        return response.text();
      })).then((parts) => `data:image/jpeg;base64,${parts.join('').replace(/\s/g, '')}`);
      personalratImageCache.set(key, imagePromise);
    }
    return personalratImageCache.get(key);
  };

  const hydratePersonalratImages = () => {
    document.querySelectorAll('img[data-personalrat-image]').forEach((image) => {
      const key = image.dataset.personalratImage;
      getPersonalratImage(key)
        .then((source) => {
          image.src = source;
          image.classList.remove('image-loading');
        })
        .catch(() => {
          image.alt = 'Das Bild konnte leider nicht geladen werden.';
          image.classList.remove('image-loading');
        });
    });
  };

  const addAktuellesLink = (container) => {
    if (!container || container.querySelector('a[href="#aktuelles"]')) return;
    const link = document.createElement('a');
    link.href = '#aktuelles';
    link.textContent = 'Aktuelles';
    container.insertBefore(link, container.firstElementChild);
  };

  const buildAktuellesSection = () => {
    if (document.querySelector('#aktuelles')) return;

    addAktuellesLink(document.querySelector('.mobile-menu nav'));
    addAktuellesLink(document.querySelector('.toc'));

    const firstContentSection = document.querySelector('#macht-uns-aus');
    if (!firstContentSection) return;

    const aktuelles = document.createElement('section');
    aktuelles.id = 'aktuelles';
    aktuelles.className = 'page';
    aktuelles.innerHTML = `
      <p class="label">Aktuelles</p>
      <h2>Was gerade wichtig ist</h2>
      <p>Hier findest du zeitlich aktuelle Themen, Planungen und Informationen, die das Team gerade braucht.</p>
      <div class="checklist-grid">
        <article class="check-card checklist-link-card">
          <h3>Sommerfest 2026</h3>
          <p>Die komplette Planung mit Zeiten, Zuständigkeiten, Stationen und Ablauf.</p>
          <a class="checklist-open-link" href="#sommerfest-2026">Planung öffnen</a>
        </article>
        <article class="check-card checklist-link-card">
          <h3>Personalratswahl 2026</h3>
          <p>Wahltermin, Abgabefristen, Informationen und die vorgestellten Kandidierenden.</p>
          <a class="checklist-open-link" href="#personalratswahlen">Informationen öffnen</a>
        </article>
      </div>
    `;
    firstContentSection.parentNode.insertBefore(aktuelles, firstContentSection);

    const sommerfest = document.querySelector('#sommerfest-2026');
    if (sommerfest) {
      const label = sommerfest.querySelector('.label');
      if (label) label.textContent = 'Aktuelles';
      aktuelles.insertAdjacentElement('afterend', sommerfest);
    }

    const personalrat = document.createElement('section');
    personalrat.id = 'personalratswahlen';
    personalrat.className = 'page';
    personalrat.innerHTML = `
      <p class="label">Aktuelles</p>
      <h2>Personalratswahl 2026</h2>
      <p>Hier findest du die aktuellen Unterlagen zur Personalratswahl für die Gruppe der Arbeitnehmer*innen der Dienststelle 4d.</p>

      <div class="checklist-grid">
        <article class="check-card">
          <h3>Wahltermin</h3>
          <p><strong>Mittwoch, 29. Juli 2026</strong></p>
        </article>
        <article class="check-card">
          <h3>Abgabe des Stimmzettels</h3>
          <p>Per Post im Rücksendeumschlag bis <strong>25. Juli 2026</strong> oder persönlich bis <strong>29. Juli 2026, 14:00 Uhr</strong>.</p>
        </article>
      </div>

      <section class="moment-album">
        <h3>Informationen und Kandidierende</h3>
        <p>Tippe ein Bild an, um es groß zu öffnen und den Text besser lesen zu können.</p>
        <div class="special-photo-gallery" aria-label="Unterlagen zur Personalratswahl 2026">
          <figure>
            <a class="gallery-link" href="#personalrat-info">
              <img class="image-loading" data-personalrat-image="info" alt="Informationen: Personalrat wählen und mitbestimmen">
            </a>
            <figcaption>Warum Personalrat?</figcaption>
          </figure>
          <figure>
            <a class="gallery-link" href="#personalrat-dienststelle">
              <img class="image-loading" data-personalrat-image="dienststelle" alt="Kandidierende für den Personalrat der Dienststelle 4d">
            </a>
            <figcaption>Personalrat · Dienststelle 4d</figcaption>
          </figure>
          <figure>
            <a class="gallery-link" href="#personalrat-termin">
              <img class="image-loading" data-personalrat-image="termin" alt="Personalratswahl am 29. Juli 2026">
            </a>
            <figcaption>Wahltermin und Dienststelle</figcaption>
          </figure>
          <figure>
            <a class="gallery-link" href="#personalrat-kandidierende">
              <img class="image-loading" data-personalrat-image="kandidierende" alt="Kandidatinnen und Kandidaten für Arbeitnehmerinnen und Arbeitnehmer">
            </a>
            <figcaption>Kandidierende der Arbeitnehmer*innen</figcaption>
          </figure>
        </div>
      </section>

      <p><a class="checklist-open-link" href="#aktuelles">Zurück zu Aktuelles</a></p>
    `;

    if (sommerfest) {
      sommerfest.insertAdjacentElement('afterend', personalrat);
    } else {
      aktuelles.insertAdjacentElement('afterend', personalrat);
    }

    const lightboxes = [
      ['personalrat-info', 'info', 'Informationen: Personalrat wählen und mitbestimmen'],
      ['personalrat-dienststelle', 'dienststelle', 'Personalrat der Dienststelle 4d'],
      ['personalrat-termin', 'termin', 'Personalratswahl am 29. Juli 2026'],
      ['personalrat-kandidierende', 'kandidierende', 'Kandidierende der Arbeitnehmer*innen']
    ];

    lightboxes.forEach(([id, key, caption]) => {
      if (document.getElementById(id)) return;
      const lightbox = document.createElement('div');
      lightbox.id = id;
      lightbox.className = 'lightbox';
      lightbox.innerHTML = `
        <a class="lightbox-close-area" href="#personalratswahlen" aria-label="Vollbild schließen"></a>
        <div class="lightbox-content">
          <a class="lightbox-close" href="#personalratswahlen" aria-label="Vollbild schließen">×</a>
          <img class="image-loading" data-personalrat-image="${key}" alt="${caption}">
          <p>${caption}</p>
        </div>
      `;
      document.body.appendChild(lightbox);
    });

    const sommerfestCard = [...document.querySelectorAll('#checklisten .check-card')]
      .find((card) => card.querySelector('h3')?.textContent.trim() === 'Sommerfest 2026');
    sommerfestCard?.remove();

    hydratePersonalratImages();
  };

  buildAktuellesSection();

  const forms = document.querySelectorAll('.interactive-checklist[data-checklist]');

  forms.forEach((form) => {
    const name = form.dataset.checklist;
    const storageKey = `teambuch-checklist-${name}-v1`;
    const boxes = [...form.querySelectorAll('input[type="checkbox"]')];
    const toolbar = document.querySelector(`[data-toolbar="${name}"]`);
    if (!toolbar || boxes.length === 0) return;

    const progressText = toolbar.querySelector('.progress-text');
    const progressFill = toolbar.querySelector('.progress-fill');
    const resetButton = toolbar.querySelector('.checklist-reset');

    const readStored = () => {
      try {
        return JSON.parse(localStorage.getItem(storageKey) || '[]');
      } catch {
        return [];
      }
    };

    const save = () => {
      try {
        const checked = boxes.filter((box) => box.checked).map((box) => box.id);
        localStorage.setItem(storageKey, JSON.stringify(checked));
      } catch {
        // Die Checkliste bleibt auch ohne lokalen Speicher nutzbar.
      }
    };

    const updateProgress = () => {
      const done = boxes.filter((box) => box.checked).length;
      const total = boxes.length;
      progressText.textContent = `${done} von ${total} Aufgaben erledigt`;
      progressFill.style.width = `${Math.round((done / total) * 100)}%`;
    };

    const stored = new Set(readStored());
    boxes.forEach((box) => {
      box.checked = stored.has(box.id);
      box.addEventListener('change', () => {
        save();
        updateProgress();
      });
    });

    resetButton.addEventListener('click', () => {
      if (!window.confirm('Alle Häkchen dieser Checkliste zurücksetzen?')) return;
      boxes.forEach((box) => { box.checked = false; });
      save();
      updateProgress();
    });

    updateProgress();
  });
})();