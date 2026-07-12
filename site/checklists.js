(() => {
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
          <h3>Personalratswahlen</h3>
          <p>Aktuelle Informationen, Termine, Unterlagen und Hinweise zur Personalratswahl.</p>
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
      <h2>Personalratswahlen</h2>
      <p>Hier sammeln wir alle Informationen, Termine, Fristen und Unterlagen, die für das Team wichtig sind.</p>
      <div class="note">Die konkreten Inhalte werden ergänzt, sobald sie vorliegen.</div>
      <p><a class="checklist-open-link" href="#aktuelles">Zurück zu Aktuelles</a></p>
    `;

    if (sommerfest) {
      sommerfest.insertAdjacentElement('afterend', personalrat);
    } else {
      aktuelles.insertAdjacentElement('afterend', personalrat);
    }

    const sommerfestCard = [...document.querySelectorAll('#checklisten .check-card')]
      .find((card) => card.querySelector('h3')?.textContent.trim() === 'Sommerfest 2026');
    sommerfestCard?.remove();
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
