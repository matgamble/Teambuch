(() => {
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
