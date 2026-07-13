# Teambuch – Hinweise für Claude Code

Dieses Repository ist das digitale Teambuch der Kita Reischlestraße (Augsburg). Die Leitung kann nicht coden – alle inhaltlichen Änderungen werden von Claude umgesetzt. Es gelten folgende feste Konventionen aus der bisherigen Zusammenarbeit:

## Layout & Bilder
- Bestehendes Layout nie ohne Auftrag verändern.
- Bilder immer als scrollbare Galerie einfügen, nie als einzelnes `<img>`. Muster (siehe z. B. Teamfotos):
  ```html
  <div class="special-photo-gallery" aria-label="...">
    <figure>
      <a class="gallery-link" href="#eindeutige-id"><img src="assets/.../bild.jpg" alt="..."></a>
      <figcaption>Bildunterschrift</figcaption>
    </figure>
  </div>
  <div id="eindeutige-id" class="lightbox">...</div>
  ```
- `site/slideshow.js` erkennt jede `.special-photo-gallery` automatisch und macht sie im Vollbild swipebar (Touch, Pfeiltasten, Escape). Für kuratierte Foliendecks (z. B. Fortbildungen) stattdessen eine Karte mit `class="slideshow-trigger"` + `data-slideshow-images` (JSON-Array der Bildpfade) + `data-slideshow-title` verwenden.
- Skriptreihenfolge am Ende von `site/index.html` beachten: `checklists.js` muss vor `slideshow.js` geladen werden, damit dynamisch erzeugte Galerien schon im DOM stehen, wenn slideshow.js scannt.
- CSS-Grid: Karten (`.card`, `.check-card`, `.moment-card`) brauchen `min-width: 0`, sonst sprengen breite Foto-Galerien darin die Grid-Spaltenbreite.
- Reihenfolge der Bilder innerhalb einer Galerie immer: 1. Teambild/Gruppenfoto, 2. Einzelbilder der Personen, 3. Raumbilder.

## Git-Workflow
- Entwickelt wird ausschließlich auf dem Branch `claude/teambuch-visibility-6bk15p`.
- Niemals direkt auf `main` pushen.
- Nach jeder abgeschlossenen Änderung explizit fragen: „Soll ich das nach main mergen?" und erst nach einem „ja" mergen (fast-forward).
- Vor riskanten/destruktiven Aktionen (z. B. große Aufräumarbeiten, Löschungen) immer warnen, wenn Folgen nicht einfach rückgängig zu machen sind, und wenn sinnvoll vorher einen Backup-Branch anlegen.

## Externe Quellen & Daten
- Nie URLs, Adressen, Telefonnummern oder E-Mails raten – nur verwenden, was die Nutzerin explizit angibt oder in einem hochgeladenen Dokument steht.
- `augsburg.de` ist aus dieser Umgebung per Netzwerk-Policy blockiert (auch curl/WebFetch) – bei Bedarf die Nutzerin um manuellen Upload der Datei bitten, nicht selbst versuchen zu fetchen.
- Inline in den Chat eingefügte Bilder sind in dieser Remote-Umgebung nicht als Datei zugänglich – die Nutzerin muss Dateien über die GitHub-Weboberfläche hochladen (z. B. ins `main`-Verzeichnis), damit Claude sie lesen kann.

## PowerPoint-Folien zu Fortbildungen verarbeiten
Etablierter Ablauf für hochgeladene .pptx-Dateien:
1. Text extrahieren: `unzip file.pptx -d dir`, dann `grep -o '<a:t>[^<]*</a:t>' ppt/slides/slideN.xml`.
2. Eingebettete Bilder über `ppt/slides/_rels/slideN.xml.rels` referenzieren.
3. Folien im Teambuch-Design neu bauen (gleiche Palette, Orka-Symbol als wiederkehrendes Footer-Motiv), als HTML/CSS-Folien.
4. Per Playwright (Headless-Chromium) als Bilder rendern/screenshotten.
5. Als `slideshow-trigger`-Karte unter Fortbildungen einbinden.

## Urheberrecht
- Inhalte aus Dokumenten, die die Nutzerin selbst hochlädt, dürfen frei verwendet werden.
- Bestätigt urheberrechtlich geschützte Drittanbieter-Charakterbilder (z. B. Pokémon, Disney, Nintendo, Marvel) werden nicht auf der öffentlichen Website eingebettet – auch nicht auf ausdrückliche Anweisung, da die Kita-Leitung solche Drittrechte nicht einseitig klären kann. Stattdessen: Original-Textinhalte als Alternative anbieten und die Einschränkung kurz erklären.

## Kontext-Management
- Wenn der Gesprächskontext in einer Session sehr groß wird (Richtwert: ca. 500k Tokens), proaktiv (ohne Nachfrage) eine kurze Zusammenfassung der in dieser Session vorgenommenen Änderungen unten unter „Session-Log" ergänzen und die Nutzerin darauf hinweisen, dass jetzt ein guter Zeitpunkt für `/clear` ist. `/clear` selbst kann nicht automatisch ausgelöst werden (kein Hook-Event für Token-Schwellen, kein Hook kann Slash-Commands ausführen) – die Nutzerin muss es manuell eingeben.

### Session-Log

## Architektur-Hinweis
- `site/index.html` ist die zentrale, statische Seite (Stammgruppen, Lernwerkstätten, Hauswirtschaft, Fortbildungen, Bilder & Momente, Checklisten, ...), gestylt über `site/style.css` und `site/checklists.css`.
- Wo möglich, Inhalte lieber direkt statisch in `index.html` schreiben statt JS-Injection zur Laufzeit hinzuzufügen – hat in der Vergangenheit zu Duplikat-Bugs geführt (z. B. doppelte Karten/Fotos, wenn Inhalt sowohl statisch als auch per JS eingefügt wurde). `site/hort-gallery-shell.js` (Hort-Fotogalerie per Laufzeit-Injection ins iframe) wurde deshalb entfernt und die Hort-Galerie direkt statisch in `site/index.html` eingebaut (Juli 2026) – dadurch bekommt sie wie alle anderen Galerien automatisch die swipebare Vollbildansicht von `slideshow.js`. Aus demselben Grund wurden auch die vormals per `checklists.js` zur Laufzeit erzeugten Abschnitte „Aktuelles" und „Personalratswahl 2026" statisch in `site/index.html` geschrieben.
- Root `index.html` bindet `site/index.html` weiterhin per `<iframe id="teambuch-frame">` ein. Der ursprüngliche Grund dafür (`hort-gallery-shell.js`) ist entfallen; die Iframe-Einbindung besteht aktuell nur noch aus historischen Gründen und könnte bei Gelegenheit vereinfacht werden.
- `checklists.js` enthält noch JS für: Checklisten-Fortschritt (localStorage), automatisches Schließen des Menüs/Inhaltsverzeichnisses beim Klick auf einen Link, und ab 1024px Breite eine dauerhaft sichtbare (nicht mehr eingeklappte) Kopfzeilen-Navigation.
