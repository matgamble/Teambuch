from pathlib import Path

INDEX = Path("site/index.html")
CSS = Path("site/checklists.css")
JS = Path("site/checklists.js")

html = INDEX.read_text(encoding="utf-8")

stylesheet_marker = "<link rel='stylesheet' href='style.css' />"
stylesheet_link = "<link rel='stylesheet' href='checklists.css' />"
if stylesheet_link not in html:
    if stylesheet_marker not in html:
        raise SystemExit("Stylesheet-Marker nicht gefunden")
    html = html.replace(stylesheet_marker, stylesheet_marker + stylesheet_link, 1)

old_card = "<article class='check-card'><h3>Frühdienst</h3><p>Was muss morgens vorbereitet, geprüft und weitergegeben werden?</p><ul><li>Räume öffnen und Überblick verschaffen</li><li>Ankommen der Kinder begleiten</li><li>Infos aus KidsFox / Krankmeldungen beachten</li><li>Übergabe an Stammgruppen sichern</li></ul></article>"
new_card = "<article class='check-card checklist-link-card'><h3>Frühdienst</h3><p>Gemeinsam für einen ruhigen, freundlichen und gut organisierten Start in den Tag sorgen.</p><a class='checklist-open-link' href='#fruehdienst'>Frühdienst-Checkliste öffnen</a></article>"
if old_card in html:
    html = html.replace(old_card, new_card, 1)
elif "href='#fruehdienst'" not in html:
    raise SystemExit("Frühdienst-Karte nicht gefunden")

section_marker = "<section id='sommerfest-2026' class='page'>"
fruehdienst_section = """<section id='fruehdienst' class='page service-checklist-page'>
<p class='label'>Checklisten &amp; Vorlagen</p>
<h2>Frühdienst</h2>
<p class='checklist-lead'>Wir sorgen gemeinsam dafür, dass Kinder und Familien gut in den Tag starten und alle wichtigen Informationen zuverlässig weitergegeben werden.</p>

<div class='checklist-overview'>
  <div><span class='overview-label'>Ziel</span><strong>Ein sicherer und herzlicher Start</strong></div>
  <div><span class='overview-label'>Arbeitsweise</span><strong>Flexibel und an den Kindern orientiert</strong></div>
  <div><span class='overview-label'>Stand</span><strong>Juli 2026</strong></div>
</div>

<div class='checklist-toolbar' data-toolbar='fruehdienst'>
  <div class='progress-copy'><strong>Dein Fortschritt</strong><span class='progress-text' aria-live='polite'>0 von 10 Aufgaben erledigt</span></div>
  <div class='progress-track' aria-hidden='true'><span class='progress-fill'></span></div>
  <button class='checklist-reset' type='button'>Häkchen zurücksetzen</button>
  <small>Der Stand wird nur auf diesem Gerät gespeichert.</small>
</div>

<form class='interactive-checklist' data-checklist='fruehdienst'>
  <details class='checklist-group' open>
    <summary>Gut vorbereitet starten</summary>
    <div class='checklist-items'>
      <label class='check-item' for='fd-ueberblick'>
        <input id='fd-ueberblick' type='checkbox'>
        <span><strong>Einen kurzen Überblick verschaffen</strong><small>Welche Kinder sind bereits da? Gibt es wichtige Informationen oder Besonderheiten für den heutigen Tag?</small></span>
      </label>
      <label class='check-item' for='fd-bereich'>
        <input id='fd-bereich' type='checkbox'>
        <span><strong>Den Frühdienstbereich einladend vorbereiten</strong><small>Der Raum soll für die ankommenden Kinder übersichtlich, sicher und angenehm gestaltet sein.</small></span>
      </label>
      <label class='check-item' for='fd-raumwahl'>
        <input id='fd-raumwahl' type='checkbox'>
        <span><strong>Den passenden Raum für die Kinder wählen</strong><small>Der Frühdienst findet dort statt, wo die Bedürfnisse der anwesenden Kinder gut aufgegriffen werden können.</small></span>
      </label>
      <details class='check-help'>
        <summary>Beispiele für die Raumwahl</summary>
        <ul>
          <li>Haben die Kinder viel Bewegungsenergie, kann die <strong>Bewegungsbaustelle</strong> geöffnet werden.</li>
          <li>Möchten die Kinder malen oder gestalten, eignet sich das <strong>Atelier</strong> oder ein anderer passender Raum.</li>
          <li>Entscheidend ist, was die Kinder gerade brauchen und welcher Raum einen guten und sicheren Start ermöglicht.</li>
        </ul>
      </details>
      <label class='check-item' for='fd-getraenke'>
        <input id='fd-getraenke' type='checkbox'>
        <span><strong>Die Getränkestation vorbereiten</strong><small>Darauf achten, dass die Kinder selbstständig und jederzeit etwas trinken können.</small></span>
      </label>
    </div>
  </details>

  <details class='checklist-group' open>
    <summary>Gemeinsam in den Morgen starten</summary>
    <div class='checklist-items'>
      <label class='check-item' for='fd-krippe'>
        <input id='fd-krippe' type='checkbox'>
        <span><strong>Um 7:30 Uhr die Krippe öffnen</strong></span>
      </label>
      <label class='check-item' for='fd-hort'>
        <input id='fd-hort' type='checkbox'>
        <span><strong>Die Hortkinder um 7:30 Uhr rechtzeitig in die Schule verabschieden</strong></span>
      </label>
      <label class='check-item' for='fd-buffet'>
        <input id='fd-buffet' type='checkbox'>
        <span><strong>Gemeinsam mit den Kindern das Frühstücksbuffet im Bistro vorbereiten</strong><small>Die Kinder werden altersgerecht beteiligt und können kleine Aufgaben übernehmen.</small></span>
      </label>
      <label class='check-item' for='fd-snackteller'>
        <input id='fd-snackteller' type='checkbox'>
        <span><strong>Einen Snackteller für den Frühdienst vorbereiten</strong></span>
      </label>
    </div>
  </details>

  <section class='checklist-info welcome-info' aria-labelledby='willkommenskultur-title'>
    <h3 id='willkommenskultur-title'>Willkommenskultur</h3>
    <label class='check-item' for='fd-willkommen'>
      <input id='fd-willkommen' type='checkbox'>
      <span><strong>Alle Kinder und Eltern freundlich, aufmerksam und persönlich begrüßen</strong><small>Wir nehmen Blickkontakt auf, verwenden nach Möglichkeit den Namen und hören bei kurzen Informationen oder Anliegen aufmerksam zu. Jedes Kind soll spüren: Du bist willkommen und wir freuen uns, dass du da bist.</small></span>
    </label>
  </section>

  <section class='checklist-info meeting-info' aria-labelledby='morgenbesprechung-title'>
    <h3 id='morgenbesprechung-title'>8:00–8:15 Uhr · Morgenbesprechung</h3>
    <p>An der Morgenbesprechung nehmen alle Mitarbeitenden teil, die an diesem Tag <strong>weder im Frühdienst noch im Spätdienst</strong> eingesetzt sind.</p>
    <p>Die Kolleginnen im Frühdienst bleiben während dieser Zeit bei den Kindern und sorgen für einen verlässlichen Rahmen.</p>
  </section>

  <section class='checklist-info media-info' aria-labelledby='medien-title'>
    <h3 id='medien-title'>Medien im Frühdienst</h3>
    <p><strong>Tablets und Handys werden nicht zur Unterhaltung der Kinder eingesetzt.</strong></p>
    <p>Im Frühdienst werden keine Filme, Videos oder vergleichbaren Medienangebote gezeigt. Digitale Geräte werden nur genutzt, wenn sie für eine konkrete dienstliche oder bewusst geplante pädagogische Aufgabe benötigt werden.</p>
    <p>Der frühe Morgen bietet den Kindern Zeit zum Ankommen, Spielen, Erzählen und für den persönlichen Kontakt.</p>
  </section>

  <details class='checklist-group' open>
    <summary>Gut übergeben</summary>
    <div class='checklist-items'>
      <label class='check-item' for='fd-infos'>
        <input id='fd-infos' type='checkbox'>
        <span><strong>Wichtige Informationen zuverlässig weitergeben</strong><small>Besonderheiten, Elterninformationen und Beobachtungen werden an die zuständigen Kolleginnen übergeben.</small></span>
      </label>
      <label class='check-item' for='fd-offen'>
        <input id='fd-offen' type='checkbox'>
        <span><strong>Offene Aufgaben kurz benennen</strong><small>So weiß die nachfolgende Kollegin, was bereits erledigt wurde und was noch zu tun ist.</small></span>
      </label>
    </div>
  </details>
</form>

<div class='orka-fakt'><img class='orka-symbol' src='orka-symbol.png' alt='Orka-Symbol'><p class='orka-text'><strong class='orka-label-text'>Orka-Fakt:</strong><span class='orka-quote'>„Ein guter Start entsteht, wenn alle aufmerksam füreinander sind und sich aufeinander verlassen können.“</span></p></div>
</section>"""

if "id='fruehdienst'" not in html:
    if section_marker not in html:
        raise SystemExit("Einfügeposition vor Sommerfest nicht gefunden")
    html = html.replace(section_marker, fruehdienst_section + section_marker, 1)

script_link = "<script src='checklists.js'></script>"
if script_link not in html:
    html = html.replace("</body>", script_link + "</body>", 1)

INDEX.write_text(html, encoding="utf-8")

CSS.write_text(r"""
.checklist-link-card {
  display: flex;
  flex-direction: column;
}

.checklist-open-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  margin-top: auto;
  padding: 12px 16px;
  border-radius: 14px;
  background: #12264a;
  color: #fff;
  text-decoration: none;
  font-weight: 800;
  text-align: center;
  box-shadow: 0 6px 16px rgba(18, 38, 74, 0.2);
}

.checklist-open-link:focus-visible,
.checklist-reset:focus-visible,
.check-item:focus-within,
.checklist-group summary:focus-visible,
.check-help summary:focus-visible {
  outline: 3px solid #c58b2b;
  outline-offset: 3px;
}

.checklist-lead {
  max-width: 760px;
  font-size: clamp(1.05rem, 4vw, 1.2rem);
}

.checklist-overview {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin: 22px 0;
}

.checklist-overview > div {
  padding: 15px;
  border-radius: 16px;
  background: rgba(231, 234, 223, 0.86);
  border-left: 5px solid #5d765d;
}

.overview-label {
  display: block;
  margin-bottom: 4px;
  color: #6c6250;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.checklist-toolbar {
  margin: 24px 0;
  padding: 18px;
  border-radius: 18px;
  background: #f3efe6;
  border: 1px solid rgba(197, 139, 43, 0.24);
}

.progress-copy {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 6px 18px;
}

.progress-text {
  font-weight: 700;
  color: #5d765d;
}

.progress-track {
  height: 12px;
  margin: 12px 0 16px;
  overflow: hidden;
  border-radius: 999px;
  background: #ded8ca;
}

.progress-fill {
  display: block;
  width: 0;
  height: 100%;
  border-radius: inherit;
  background: #5d765d;
  transition: width 180ms ease;
}

.checklist-reset {
  width: 100%;
  min-height: 46px;
  padding: 10px 14px;
  border: 1px solid rgba(18, 38, 74, 0.25);
  border-radius: 12px;
  background: #fffaf0;
  color: #12264a;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
}

.checklist-toolbar small {
  display: block;
  margin-top: 10px;
  color: #6c6250;
}

.interactive-checklist {
  display: grid;
  gap: 18px;
}

.checklist-group,
.checklist-info {
  border: 1px solid rgba(93, 118, 93, 0.22);
  border-radius: 20px;
  background: rgba(248, 241, 223, 0.92);
  box-shadow: 0 7px 18px rgba(0, 0, 0, 0.045);
}

.checklist-group {
  overflow: hidden;
}

.checklist-group > summary,
.check-help > summary {
  cursor: pointer;
  list-style: none;
  font-weight: 800;
}

.checklist-group > summary::-webkit-details-marker,
.check-help > summary::-webkit-details-marker {
  display: none;
}

.checklist-group > summary {
  position: relative;
  min-height: 58px;
  padding: 17px 52px 17px 18px;
  color: #12264a;
  font-size: 1.18rem;
  background: rgba(231, 234, 223, 0.8);
}

.checklist-group > summary::after {
  content: "＋";
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.35rem;
}

.checklist-group[open] > summary::after {
  content: "−";
}

.checklist-items {
  display: grid;
  gap: 12px;
  padding: 14px;
}

.check-item {
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  gap: 12px;
  align-items: flex-start;
  min-height: 58px;
  padding: 14px;
  border-radius: 15px;
  background: rgba(255, 250, 240, 0.95);
  border: 1px solid rgba(18, 38, 74, 0.1);
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease, transform 150ms ease;
}

.check-item:active {
  transform: scale(0.995);
}

.check-item input {
  width: 27px;
  height: 27px;
  margin: 1px 0 0;
  accent-color: #5d765d;
  cursor: pointer;
}

.check-item span,
.check-item strong,
.check-item small {
  display: block;
}

.check-item strong {
  color: #12264a;
  line-height: 1.35;
}

.check-item small {
  margin-top: 6px;
  color: #4f5665;
  font-size: 0.94rem;
  line-height: 1.55;
}

.check-item:has(input:checked) {
  background: rgba(216, 228, 209, 0.82);
  border-color: rgba(93, 118, 93, 0.45);
}

.check-item:has(input:checked) strong {
  text-decoration: line-through;
  text-decoration-thickness: 1.5px;
  text-decoration-color: rgba(18, 38, 74, 0.42);
}

.check-help {
  margin: 0 4px;
  border-radius: 14px;
  background: rgba(141, 184, 210, 0.15);
}

.check-help > summary {
  min-height: 46px;
  padding: 12px 42px 12px 14px;
  color: #12264a;
  position: relative;
}

.check-help > summary::after {
  content: "▾";
  position: absolute;
  right: 15px;
}

.check-help[open] > summary::after {
  content: "▴";
}

.check-help ul {
  margin: 0;
  padding: 0 20px 16px 34px;
}

.check-help li {
  margin-bottom: 8px;
}

.checklist-info {
  padding: 18px;
}

.checklist-info h3 {
  margin: 0 0 10px;
  color: #12264a;
}

.checklist-info p {
  margin: 8px 0;
  font-size: 1rem;
}

.welcome-info {
  background: linear-gradient(135deg, rgba(216, 228, 209, 0.9), rgba(255, 250, 240, 0.96));
  border-left: 6px solid #5d765d;
}

.welcome-info .check-item {
  margin-top: 12px;
}

.meeting-info {
  background: linear-gradient(135deg, rgba(141, 184, 210, 0.2), rgba(255, 250, 240, 0.96));
  border-left: 6px solid #5a86a2;
}

.media-info {
  background: linear-gradient(135deg, rgba(233, 214, 181, 0.65), rgba(255, 250, 240, 0.96));
  border-left: 6px solid #c58b2b;
}

@media (min-width: 760px) {
  .checklist-overview {
    grid-template-columns: repeat(3, 1fr);
  }

  .checklist-toolbar {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    column-gap: 20px;
    align-items: center;
  }

  .progress-copy,
  .progress-track,
  .checklist-toolbar small {
    grid-column: 1;
  }

  .checklist-reset {
    grid-column: 2;
    grid-row: 1 / span 3;
    width: auto;
    min-width: 190px;
  }

  .checklist-items {
    padding: 18px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .progress-fill,
  .check-item {
    transition: none;
  }
}
""".strip() + "\n", encoding="utf-8")

JS.write_text(r"""
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
""".strip() + "\n", encoding="utf-8")

print("Frühdienst-Checkliste, Styles und Interaktion wurden eingefügt.")
