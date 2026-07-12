(() => {
  const personalratImages = {
    info: '../20260711_165929.jpg',
    dienststelle: '../20260711_165943.jpg',
    termin: '../20260711_165952.jpg',
    kandidierende: '../20260711_170007.jpg'
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
              <img src="${personalratImages.info}" alt="Informationen: Personalrat wählen und mitbestimmen" loading="lazy">
            </a>
            <figcaption>Warum Personalrat?</figcaption>
          </figure>
          <figure>
            <a class="gallery-link" href="#personalrat-dienststelle">
              <img src="${personalratImages.dienststelle}" alt="Kandidierende für den Personalrat der Dienststelle 4d" loading="lazy">
            </a>
            <figcaption>Personalrat · Dienststelle 4d</figcaption>
          </figure>
          <figure>
            <a class="gallery-link" href="#personalrat-termin">
              <img src="${personalratImages.termin}" alt="Personalratswahl am 29. Juli 2026" loading="lazy">
            </a>
            <figcaption>Wahltermin und Dienststelle</figcaption>
          </figure>
          <figure>
            <a class="gallery-link" href="#personalrat-kandidierende">
              <img src="${personalratImages.kandidierende}" alt="Kandidatinnen und Kandidaten für Arbeitnehmerinnen und Arbeitnehmer" loading="lazy">
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
      ['personalrat-info', personalratImages.info, 'Informationen: Personalrat wählen und mitbestimmen'],
      ['personalrat-dienststelle', personalratImages.dienststelle, 'Personalrat der Dienststelle 4d'],
      ['personalrat-termin', personalratImages.termin, 'Personalratswahl am 29. Juli 2026'],
      ['personalrat-kandidierende', personalratImages.kandidierende, 'Kandidierende der Arbeitnehmer*innen']
    ];

    lightboxes.forEach(([id, src, caption]) => {
      if (document.getElementById(id)) return;
      const lightbox = document.createElement('div');
      lightbox.id = id;
      lightbox.className = 'lightbox';
      lightbox.innerHTML = `
        <a class="lightbox-close-area" href="#personalratswahlen" aria-label="Vollbild schließen"></a>
        <div class="lightbox-content">
          <a class="lightbox-close" href="#personalratswahlen" aria-label="Vollbild schließen">×</a>
          <img src="${src}" alt="${caption}">
          <p>${caption}</p>
        </div>
      `;
      document.body.appendChild(lightbox);
    });

    const sommerfestCard = [...document.querySelectorAll('#checklisten .check-card')]
      .find((card) => card.querySelector('h3')?.textContent.trim() === 'Sommerfest 2026');
    sommerfestCard?.remove();
  };

  const buildSpaetdienstChecklist = () => {
    if (document.querySelector('#spaetdienst-checkliste')) return;

    const checklistsSection = document.querySelector('#checklisten');
    if (!checklistsSection) return;

    const checklistGrid = checklistsSection.querySelector('.checklist-grid');
    if (checklistGrid && !checklistGrid.querySelector('[data-checklist-card="spaetdienst"]')) {
      const card = document.createElement('article');
      card.className = 'check-card checklist-link-card';
      card.dataset.checklistCard = 'spaetdienst';
      card.innerHTML = `
        <h3>Spätdienst</h3>
        <p>Die aktualisierte Abschlussrunde für Küche, Räume, Sicherheit und Technik.</p>
        <a class="checklist-open-link" href="#spaetdienst-checkliste">Checkliste öffnen</a>
      `;

      const fruehdienstCard = [...checklistGrid.querySelectorAll('.check-card')]
        .find((item) => item.querySelector('h3')?.textContent.toLowerCase().includes('frühdienst'));

      if (fruehdienstCard) {
        fruehdienstCard.insertAdjacentElement('afterend', card);
      } else {
        checklistGrid.appendChild(card);
      }
    }

    const section = document.createElement('section');
    section.id = 'spaetdienst-checkliste';
    section.className = 'page';
    section.innerHTML = `
      <p class="label">Checklisten & Vorlagen</p>
      <h2>Spätdienst-Checkliste</h2>
      <p class="checklist-lead">Diese Checkliste begleitet dich Schritt für Schritt durch den Abschluss des Tages. Du kannst die Aufgaben direkt abhaken – der Stand bleibt auf diesem Gerät gespeichert.</p>

      <div class="checklist-overview">
        <div><span class="overview-label">Ziel</span>Das Haus sicher, ordentlich und gut vorbereitet hinterlassen.</div>
        <div><span class="overview-label">Reihenfolge</span>Die Bereiche nacheinander öffnen und erledigte Aufgaben direkt abhaken.</div>
        <div><span class="overview-label">Zum Schluss</span>Noch einmal ruhig durch das Haus gehen und Türen, Fenster, Licht und Technik prüfen.</div>
      </div>

      <div class="checklist-toolbar" data-toolbar="spaetdienst">
        <div class="progress-copy">
          <strong>Dein Fortschritt</strong>
          <span class="progress-text">0 von 30 Aufgaben erledigt</span>
        </div>
        <div class="progress-track" aria-hidden="true"><span class="progress-fill"></span></div>
        <button class="checklist-reset" type="button">Alle Häkchen zurücksetzen</button>
        <small>Die Häkchen werden nur auf diesem Gerät gespeichert.</small>
      </div>

      <form class="interactive-checklist" data-checklist="spaetdienst">
        <details class="checklist-group" open>
          <summary>Bistro und Küche</summary>
          <div class="checklist-items">
            <label class="check-item" for="sd-kuehlschraenke">
              <input id="sd-kuehlschraenke" type="checkbox">
              <span><strong>Kühlschränke kontrollieren</strong><small>Prüfen, ob alles richtig eingeräumt und geschlossen ist.</small></span>
            </label>
            <label class="check-item" for="sd-geschirr">
              <input id="sd-geschirr" type="checkbox">
              <span><strong>Restliches Geschirr spülen</strong><small>Übrig gebliebenes Geschirr vollständig wegräumen.</small></span>
            </label>
            <label class="check-item" for="sd-spuelmaschine">
              <input id="sd-spuelmaschine" type="checkbox">
              <span><strong>Spülmaschine abpumpen, reinigen und in Ruheposition bringen</strong><small>Die Maschine sauber und offen beziehungsweise in der vorgesehenen Ruheposition hinterlassen.</small></span>
            </label>
            <label class="check-item" for="sd-oberflaechen">
              <input id="sd-oberflaechen" type="checkbox">
              <span><strong>Oberflächen bei Bedarf abwischen</strong><small>Sichtbare Verschmutzungen entfernen.</small></span>
            </label>
            <label class="check-item" for="sd-kuechenbrause">
              <input id="sd-kuechenbrause" type="checkbox">
              <span><strong>Ventil der Küchenbrause nach unten drehen</strong></span>
            </label>
            <label class="check-item" for="sd-lappen">
              <input id="sd-lappen" type="checkbox">
              <span><strong>Benutzte Lappen und Tücher in den beschrifteten Eimer geben</strong><small>Sie werden nicht auf einem Wäscheständer aufgehängt.</small></span>
            </label>
            <label class="check-item" for="sd-kaffeemaschine">
              <input id="sd-kaffeemaschine" type="checkbox">
              <span><strong>Kaffeemaschine reinigen</strong><small>Den Kaffeesatz vorher vollständig entfernen. Es darf kein Kaffeesatz in die Spülmaschine gelangen.</small></span>
            </label>
          </div>
        </details>

        <details class="checklist-group">
          <summary>Mülleimer leeren</summary>
          <div class="checklist-items">
            <label class="check-item" for="sd-muell-bistro">
              <input id="sd-muell-bistro" type="checkbox">
              <span><strong>Mülleimer im Bistro leeren</strong></span>
            </label>
            <label class="check-item" for="sd-muell-toiletten">
              <input id="sd-muell-toiletten" type="checkbox">
              <span><strong>Mülleimer in den Kindertoiletten leeren</strong></span>
            </label>
            <label class="check-item" for="sd-muell-personal">
              <input id="sd-muell-personal" type="checkbox">
              <span><strong>Mülleimer im Personalzimmer leeren</strong></span>
            </label>
          </div>
        </details>

        <details class="checklist-group">
          <summary>Hort- und Kita-Toiletten</summary>
          <div class="checklist-items">
            <div class="checklist-info meeting-info">
              <h3>Erst wenn alle Kinder abgeholt sind</h3>
              <p>Die Toiletten werden am Ende des Tages kontrolliert.</p>
            </div>
            <label class="check-item" for="sd-toiletten-spuelen">
              <input id="sd-toiletten-spuelen" type="checkbox">
              <span><strong>Alle Toiletten spülen</strong></span>
            </label>
            <label class="check-item" for="sd-toiletten-reinigen">
              <input id="sd-toiletten-reinigen" type="checkbox">
              <span><strong>Toiletten bei Bedarf reinigen und den Boden wischen</strong><small>Nur dort nacharbeiten, wo es nötig ist.</small></span>
            </label>
            <label class="check-item" for="sd-wischer">
              <input id="sd-wischer" type="checkbox">
              <span><strong>Wischer in den beschrifteten Eimer an der Kellertreppe legen</strong></span>
            </label>
          </div>
        </details>

        <details class="checklist-group">
          <summary>Außentüren und Zugänge</summary>
          <div class="checklist-items">
            <label class="check-item" for="sd-tuer-rollenspiel">
              <input id="sd-tuer-rollenspiel" type="checkbox">
              <span><strong>Rollenspielraum abschließen</strong></span>
            </label>
            <label class="check-item" for="sd-tuer-atelier">
              <input id="sd-tuer-atelier" type="checkbox">
              <span><strong>Atelier abschließen</strong></span>
            </label>
            <label class="check-item" for="sd-tuer-hort">
              <input id="sd-tuer-hort" type="checkbox">
              <span><strong>Horteingang abschließen</strong></span>
            </label>
            <label class="check-item" for="sd-tuer-haupt">
              <input id="sd-tuer-haupt" type="checkbox">
              <span><strong>Haupteingang abschließen</strong></span>
            </label>
            <label class="check-item" for="sd-tuer-garten">
              <input id="sd-tuer-garten" type="checkbox">
              <span><strong>Gartentür und Gartentor abschließen</strong></span>
            </label>
            <label class="check-item" for="sd-tuer-krippe">
              <input id="sd-tuer-krippe" type="checkbox">
              <span><strong>Krippe abschließen</strong></span>
            </label>
            <label class="check-item" for="sd-tuer-einhausung">
              <input id="sd-tuer-einhausung" type="checkbox">
              <span><strong>Einhausung abschließen</strong></span>
            </label>
            <div class="checklist-info">
              <h3>Hinweis</h3>
              <p>Die Tür der Bewegungsbaustelle ist nicht abschließbar.</p>
            </div>
          </div>
        </details>

        <details class="checklist-group">
          <summary>Brandschutz</summary>
          <div class="checklist-items">
            <label class="check-item" for="sd-brandschutztueren">
              <input id="sd-brandschutztueren" type="checkbox">
              <span><strong>Alle Brandschutztüren und Zimmertüren schließen</strong><small>Geschlossene Türen können im Brandfall die Ausbreitung von Rauch und Feuer verlangsamen.</small></span>
            </label>
          </div>
        </details>

        <details class="checklist-group">
          <summary>Fenster und Jalousien</summary>
          <div class="checklist-items">
            <label class="check-item" for="sd-fenster">
              <input id="sd-fenster" type="checkbox">
              <span><strong>Alle Fenster schließen</strong></span>
            </label>
            <label class="check-item" for="sd-jalousien">
              <input id="sd-jalousien" type="checkbox">
              <span><strong>Alle Jalousien hochziehen</strong></span>
            </label>
          </div>
        </details>

        <details class="checklist-group">
          <summary>Telefone, Tablets und Technik</summary>
          <div class="checklist-items">
            <label class="check-item" for="sd-telefone">
              <input id="sd-telefone" type="checkbox">
              <span><strong>Alle Telefone in die vorgesehenen Ladestationen stellen</strong><small>Dieser Punkt ist besonders wichtig, damit die Geräte am nächsten Tag einsatzbereit sind.</small></span>
            </label>
            <label class="check-item" for="sd-tablets">
              <input id="sd-tablets" type="checkbox">
              <span><strong>Prüfen, ob noch Tablets in den Räumen liegen</strong><small>Die Stammgruppen bringen ihre Tablets grundsätzlich selbstständig ins Büro. Wird beim Rundgang noch ein vergessenes Tablet entdeckt, bitte mitnehmen und an die Ladestation anschließen.</small></span>
            </label>
            <label class="check-item" for="sd-drucker">
              <input id="sd-drucker" type="checkbox">
              <span><strong>Drucker eingeschaltet lassen</strong></span>
            </label>
          </div>
        </details>

        <details class="checklist-group">
          <summary>Abschlussrunde</summary>
          <div class="checklist-items">
            <label class="check-item" for="sd-lichter">
              <input id="sd-lichter" type="checkbox">
              <span><strong>Alle Lichter ausschalten</strong></span>
            </label>
            <label class="check-item" for="sd-heizung">
              <input id="sd-heizung" type="checkbox">
              <span><strong>Heizungen freiräumen und regulieren</strong><small>Empfohlene Einstellung: 3.</small></span>
            </label>
            <label class="check-item" for="sd-teppiche">
              <input id="sd-teppiche" type="checkbox">
              <span><strong>Teppiche hochlegen</strong></span>
            </label>
            <label class="check-item" for="sd-kehren">
              <input id="sd-kehren" type="checkbox">
              <span><strong>Halle und Windfang zum Garten kehren</strong></span>
            </label>
          </div>
        </details>
      </form>

      <div class="orka-fakt"><img class="orka-symbol" src="orka-symbol.png" alt="Orka-Symbol"><p class="orka-text"><strong class="orka-label-text">Orka-Fakt:</strong><span class="orka-quote">„Ein guter Abschluss schafft Sicherheit und macht den Start am nächsten Morgen leichter.“</span></p></div>
    `;

    const fruehdienstSection = [...document.querySelectorAll('section.page')]
      .find((item) => item.querySelector('h2')?.textContent.toLowerCase().includes('frühdienst'));

    if (fruehdienstSection) {
      fruehdienstSection.insertAdjacentElement('afterend', section);
    } else {
      checklistsSection.insertAdjacentElement('afterend', section);
    }
  };

  buildAktuellesSection();
  buildSpaetdienstChecklist();

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