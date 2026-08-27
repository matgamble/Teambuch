# Teambuch – Hinweise für Claude Code

Dieses Repository ist das digitale Teambuch der Kita Reischlestraße (Augsburg). Die Leitung kann nicht coden – alle inhaltlichen Änderungen werden von Claude umgesetzt. Es gelten folgende feste Konventionen aus der bisherigen Zusammenarbeit:

Die Nutzerin/der Nutzer, mit dem Claude hier zusammenarbeitet, ist Matze – die Kita-Leitung selbst (nicht nur Stammgruppe Hort / Lernwerkstatt Medien, wie es aus der Personalplanung-Auswertung allein hervorgeht). Im Steckbrief-Bereich zeigt seine Karte deshalb "Leitung" (Kita-Leitung) unter dem Namen.

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
- Ausnahme „Die Verrückten" (Bilder & Momente): dort immer nach Upload-Datum sortiert, neuestes Bild ganz vorne. Neue Fotos werden am Anfang der Galerie eingefügt, nicht am Ende.

## Trägerin-Logo auf Druckmaterialien
- Logo (Orka + „Kita Reischlestraße") liegt unter `site/assets/branding/logo-kita-reischlestrasse.png`.
- Seit 24. Juli 2026 gilt: Dieses Logo gehört auf **alles, was die Kita nach außen verlässt bzw. ausgedruckt werden kann** – Türschilder, Infoblätter, Flyer, Aushänge etc. (siehe z. B. `site/assets/buero/tuerschilder/`, dort im Footer unterhalb der Trennlinie anstelle des reinen Orka-Icons eingesetzt).
- Bei neuen Druck-/Aushang-Inhalten das Logo standardmäßig mit einbauen, ohne dass es jedes Mal extra angefragt werden muss.
- **25. August 2026:** Auf Wunsch der Nutzerin wurde der Stadt-Augsburg-Logo-Teil entfernt, das Logo zeigt jetzt nur noch Orka + „Kita Reischlestraße" (alte Datei `logo-stadt-augsburg-kita-reischlestrasse.png` gelöscht). Die bereits als PNG exportierten Türschilder unter `site/assets/buero/tuerschilder/` zeigten zunächst noch die alte Logo-Version; da die ursprüngliche HTML-Vorlage nicht mehr vorlag, wurde der Stadt-Augsburg-Teil direkt per Bildbearbeitung aus den 5 fertigen PNGs entfernt (Bereich mit Hintergrundfarbe/-verlauf überdeckt, Kita-Logo blieb an Ort und Stelle stehen) statt neu gerendert.

## Ton bei Inhalten aus Sprachnotizen/Diktat
- Wenn die Nutzerin Inhalte diktiert oder als Sprachnotiz/frei erzählten Text gibt (z. B. Aufgabenbeschreibungen für Bereiche wie Lernwerkstätten), diese nie roh/wörtlich übernehmen.
- Stattdessen in einen wertschätzenden, warmen Ton umformulieren und inhaltlich leicht ausschmücken – ohne den Inhalt zu verändern oder zu erfinden. Ziel: Mitarbeitenden soll beim Lesen klar werden, worum es geht und warum es wichtig ist.

## Git-Workflow
- Entwickelt wird ausschließlich auf dem Branch `claude/teambuch-visibility-6bk15p`.
- Niemals direkt auf `main` pushen.
- Nach jeder abgeschlossenen Änderung an `site/` immer zuerst einen Playwright-Screenshot des geänderten Abschnitts zeigen, dann explizit fragen: „Soll ich das nach main mergen?" und erst nach einem „ja" mergen (fast-forward).
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

**13. Juli 2026:**
- Stammgruppen-Teamfotos ergänzt: Hort (Chiara, Matze, Franzi, Blenera + Gruppenfoto, ersetzt SVG-Platzhalter), Rollenspiel (Team, Alma, Faja), Vorschule (gemeinsames Team-Foto mit Hort, Corinna, Katrin). Feste Bildreihenfolge etabliert: Team → Einzelbilder → Räume (siehe oben unter Layout & Bilder).
- Neuer Bereich „Angebote und Aktivitäten" (eigener Menüpunkt): Praxisideen-Karten pro Lernwerkstatt. Bisher gefüllt: „Medien" (Deck „Ideen für die Ruhezeit": Geräuschememory, Montagsmaler mit Tablet & Beamer – an die reale Ausstattung angepasst, kein App Store, HDMI-Adapter statt AirPlay, Sketchbook ist vorinstalliert) und „Forschen" (Deck mit 8 MINT-Aktivitäten: Kettenreaktion, Regenmesser, Wellenmaschine, Kraft des Windes, Geräuschepfad, Schwer und leicht, Fotosafari, Alles was rund ist). Karten mit „Ruhezeit"-Symbol sind fürs direkte Loslegen am iPad geeignet.
- Die Forschen-Inhalte basierten teils auf Material der Stiftung Kinder Forschen (Forscherkreis-Grafik, „Thema X"-Karten) – **nicht** 1:1 übernommen (Urheberrecht), sondern in eigenen Worten neu geschrieben, mit eigenen pädagogischen Ergänzungen (Alter, Gruppengröße, Dauer) und einem selbst gestalteten „Forscherkreis"-Symbol (eigene Icons/Farben) als wiederkehrendem Motiv auf jeder Folie.
- Alle Fortbildungs-/Angebote-Foliendecks (Inklusion, Startchance Kita Digital, Hort-Quiz, Ruhezeit, Forschen – 97 Folien) haben jetzt einen dezenten Identitäts-Spruch im Footer: 3 kleine Icons (Menschen/Herz/Glühbirne) + „Gemeinsam. Für Kinder. Mit Herz und Ideen." (aus dem Titelbild-Motto übernommen).
- Ruhezeit- und Forschen-Folien aufs iPad-Seitenverhältnis (ca. 3:2 statt 16:9) umgestellt, Schrift vergrößert; die Vollbild-Slideshow-Ansicht (`.slideshow-viewport`) war auf 1400×800px gedeckelt und wurde auf ca. 1900×1320px angehoben, damit Folien auf dem iPad wirklich bildschirmfüllend erscheinen.
- Kontaktbereich erweitert: QR-Code der WhatsApp-Gruppe „Die Verrückten" (eigenes Kartendesign statt Screenshot, mit Hinweis auf Freiwilligkeit sowie Bitte, keine Kindernamen/-fotos zu teilen und Hinweis zum Entfernen ausgeschiedener Kolleg:innen), außerdem interne Telefon-Durchwahlen (Büro/Hort/Küche/Krippe/Team) als Dropdown mit Kurzanleitung; ausführliche Anleitung (Verbinden über „R", Telefon weiterreichen, Melde-Floskel, Datenschutz/Lautsprecher) liegt als neue Checkliste „Telefonieren".
- Repository am Ende der Session aufgeräumt (Roh-Uploads und ungenutzte Bilder aus dem Hauptverzeichnis entfernt); `main` und der Feature-Branch waren zum Zeitpunkt dieses Eintrags exakt synchron.
- Offen/unerledigt: Ein von der Nutzerin hochgeladenes Foto (sollte „ordentlicher und kreativer" umgesetzt werden) konnte in dieser Session nicht angezeigt werden – wiederholte Anzeigeversuche (Originalgröße, verkleinert, zugeschnitten, ohne EXIF) wurden alle von der Vision-API abgelehnt, während andere Testbilder problemlos funktionierten. Das deutet eher auf eine inhaltliche Ablehnung durch einen Sicherheitsfilter hin als auf ein Größen-/Technikproblem. Falls die Nutzerin darauf zurückkommt: neu hochladen lassen und ggf. nach dem genauen Bildinhalt fragen, falls es erneut nicht angezeigt werden kann.

**24.–26. Juli 2026:**
- Jotform-Mitarbeiter:innen-Fragebogen „Personalplanung September 2026" unter Aktuelles eingebaut (Formular, Benachrichtigung an Gmail, Datenschutz-Hinweis zur Tablet-Nutzung); Auswertung nach Stammgruppen/Lernwerkstätten war zeitweise durch einen hartnäckigen Connector-Verbindungsfehler blockiert (Jotform/Gmail `enabledInChat:false` trotz korrekter Einstellungen) – Ursache blieb unklar, ein neuer Chat hat es meist behoben.
- Katrin (Vorschule): neues Stammgruppen-Porträt sowie ein „Fun"-Foto bei Die Verrückten ergänzt.
- Salamander-Ausstellung im Lichterhof (Halle) als Foto-Galerie ergänzt, später um Steckbrief + 3 Nahaufnahmen erweitert.
- Kamila (Rollenspiel): auf ausdrücklichen Wunsch der Nutzerin **keine** Fotos veröffentlichen (weder Stammgruppe noch sonstwo) – feste Regel für künftige Sessions.
- Betriebsausflug-Foto (München) bei Die Verrückten ergänzt; dabei Sortierregel etabliert: „Die Verrückten" wird nach Upload-Datum sortiert, neuestes Bild immer ganz vorne (siehe oben unter Layout & Bilder) – bei Katrins Fun-Foto und dem Betriebsausflug-Foto rückwirkend angewendet.
- „Special Moments" (Floßlände 6. Mai 2026) aus Bilder & Momente entfernt und deren zwei Fotos in die Die-Verrückten-Galerie integriert (ans Ende, da ältester Upload); dadurch wurde `.special-moments`-CSS als jetzt ungenutzt entfernt.
- Umwandlungstage 2027 bereinigt: Karte „Nach dem Umwandlungstag" (interne Meldung ans Personalamt, nur für die Leitung relevant) und das Dokument „Information zur Einbringung" (Anrede „Liebe Leitungen…", ebenfalls nicht fürs Team gedacht) aus der Aktuelles-Ansicht entfernt.
- Sommerfest-Detailseite war seit ihrer Verschiebung ins Archiv nur im `<p class='label'>`-Text als „Archiv" markiert, physisch aber noch mitten im Dokument (nach Umwandlungstage/Fortbildungen) platziert – jetzt tatsächlich direkt hinter der Archiv-Übersichtsseite einsortiert.
- kita.digital-Fortbildungsinhalte (Herbst-Veranstaltungen 2026 + Teamtage-Flyer) vom Aktuelles-Bereich in den regulären Fortbildungen-Bereich verschoben; bei Aktuelles steht jetzt nur noch ein Link dorthin (Anker `#fortbildung-kitadigital-herbst-2026`), um Redundanz zwischen den Bereichen zu vermeiden.
- Türschilder fürs Büro als druckfertiges A4-PDF exportiert (nicht Teil der Website, nur zum Ausdrucken).
- 26 Commits aus einer parallel in einem anderen Chat laufenden Session (Fortbildungs-Decks neu gestaltet, Türschilder aktualisiert, Trägerin-Logo ergänzt, Hort-Quiz erweitert) waren ohne gültige Commit-Signatur auf `main` gelandet (GitHub zeigte sie als „Unverified"); rückwirkend per `git rebase --exec "commit --amend --reset-author"` neu signiert und mit `--force-with-lease` auf beide Branches gepusht. Vorher Backup-Branches `backup/main-before-signing-fix-20260724` und `backup/feature-before-signing-fix-20260724` angelegt (liegen auch auf GitHub).
- Umfangreiches Set an WhatsApp-Profilbildern/Icons für die neue WhatsApp-Community „Die Verrückten" gebaut (liegt unter `extras/whatsapp-profilbild/`, jeweils `build_*.py` + PNG, alle im gleichen Stil: Orka-Symbol aus `site/orka-symbol.png` **unverändert in Schwarz-Weiß** – NICHT einfärben, sonst wirkt es wie ein Schatten –, gebogener Georgia-Italic-Schriftzug wie das „Teambuch"-Wortlogo, „Kita Reischlestraße" unten, dünner Gold-Ring): Community-Hauptbild „Die Verrückten" (ein Orka), „Vertretung" (zwei Orkas hintereinander), „Bilder" (ein Orka), „Pod" (vier Orkas als Familie), „Ankündigungen" (ein Orka), „Blitzer und Parkscheiben" (ein Orka, zweizeiliger Schriftzug). Dazu ein Hochformat-Status-Bild mit Teambuch-Link (Link im Bild selbst nicht klickbar – muss als Bildunterschrift separat gepostet werden, WhatsApp verlinkt Text automatisch).
- Es gibt seit Emoji 17.0 (September 2025) ein eigenes Orca-Emoji: 🫍 (nicht 🐋 Wal) – für künftige WhatsApp-Texte/Beschreibungen der Kita verwenden.

**1. August 2026:**
- Personalplanung-September-2026-Umfrage (Jotform-Formular) unter Aktuelles entfernt, durch schlichte Dankeschön-Kachel ersetzt.
- Personalratswahl 2026: die ursprüngliche Info-/Kandidierenden-Seite entfernt (samt 4 Fotos in `site/assets/aktuelles/personalratswahl-2026/`); die Ergebnisse-Seite („Ergebnisse der Personalratswahl 2026") ausdrücklich **behalten** (Nutzerkorrektur mitten in der Session: „ergebnisse behalten").
- Neuer Bereich „Das sind wir" mit Steckbriefen (Funktion, Stammgruppe, Lernwerkstatt) für alle Mitarbeitenden ergänzt, direkt nach Aktuelles einsortiert. Daten stammen aus einem von der Nutzerin in einer anderen Session gebauten Jotform-Auswertungs-Dashboard („Personalplanung – Mitarbeiter…", per Screenshots geteilt, da WebFetch auf `claude.ai/code/artifact/...`-URLs in dieser Sandbox mit HTTP 403 fehlschlägt) – **Kollegen-/Team-Liste und Feedback-Freitext aus diesem Dashboard wurden auf ausdrücklichen Wunsch nie veröffentlicht**, nur Funktion/Stammgruppe/Lernwerkstatt.
  - Namenskollision gelöst: Es gab bereits eine unabhängige Sektion `#das-sind-wir` (Willkommensseite „Unser Teambuch") mit demselben Label. Die Steckbriefe bekamen deshalb keinen eigenen Navigationspunkt, sondern sind über eine Link-Kachel auf der bestehenden „Das sind wir"-Seite erreichbar (Muster wie „Ergebnisse der Personalratswahl 2026" unter Aktuelles: Kachel + Zurück-Link).
  - Karten-Design ist an ein von der Nutzerin gebautes Namensschild-Muster angelehnt (Screenshot „Version 1 – Name über dem Foto", auch als reale Vorlage unter `site/assets/buero/mitarbeiterschilder/muster-v1-name-ueber-foto.jpg` bzw. via der noch aktiven internen Jotform-Seite `#design-feedback-eingangsbereich` vorhanden): navy Doppelrahmen, Name oben groß (Serif), Foto, Rolle, Stammgruppe, Lernwerkstatt-Pill, Trennlinie, kompakte Fußzeile (kleines Orka-Icon + Trägerin-Logo nebeneinander – Motto-Textzeile testweise ergänzt, dann auf Wunsch „schlichter" wieder entfernt).
  - Wichtige Rollenklärung, die zunächst falsch verstanden wurde: Die Krone 👑 markiert **Lernwerkstatt-Leitung** (eine Person pro Lernwerkstatt: Katrin–Garten, Chiara–Halle, Matze–Medien, Kamila–Rollenspiel, Anja–Atelier, Yildiz–Bistro, Nathalie–Bauen), NICHT Gruppenleitung (Stammgruppe) und NICHT „Anleitung". „Gruppenleitung" wird bei den 5 Stammgruppen-Leitungen ausgeschrieben. „Anleitung: [Namen]" ist wieder ein eigenes, drittes Konzept (Praxisanleitung/Mentoring, aus einer separaten Dashboard-Ansicht „Nach Stammgruppe"/Verschiebungen): Chiara→Eftelya,Blenera; Yildiz→Esra; Matze→Anja,Lucia; Valentina→Sinem – steht schlicht/klein unter der Lernwerkstatt-Zeile.
  - **Matze ist die Kita-Leitung selbst** (siehe Hinweis oben) – seine Karte zeigt zusätzlich „Leitung" unter dem Namen, sein Foto ist ein separat verarbeiteter Eingangstür-Schnappschuss (`site/assets/team/matze-tuer.jpg`, Rohupload `Matze Tür.JPG` aus dem Root verarbeitet und entfernt), seine Karte steht als einzige Ausnahme ganz vorne; alle anderen sind nach Stammgruppe sortiert (Reihenfolge wie im Stammgruppen-Bereich: Vorschule, Rollenspiel, Bauen, Krippe, Hort), innerhalb jeder Stammgruppe beginnend mit der Gruppenleitung.
  - Auf Wunsch entfernt: Lisa, Denise, Julia, Lilian (aus dem ursprünglichen 25-Personen-Datensatz) – aktuell 21 Karten.
  - Fotos sind wie alle anderen Galerien als swipebare Vollbild-Slideshow eingebunden (`.special-photo-gallery`/`slideshow.js`): dafür wurden nur die 16 Karten mit echtem Foto zu `<figure>` (mit `<figcaption>` als Name), die 5 Platzhalter-Karten blieben `<article>` (slideshow.js selektiert nur `:scope > figure`, ignoriert Nicht-Figuren gefahrlos). **Wichtige Falle**: `.special-photo-gallery`/`.special-photo-gallery figure`/`.special-photo-gallery img` sind sitework für horizontal scrollende Foto-Filmstreifen vorgesehen (`display:flex`, `overflow-x:auto`, Bild `object-fit:contain`) und kollidieren mit dem Grid-Karten-Layout, wenn man die Klasse einfach wiederverwendet – gelöst über gezielte, höher-spezifische Overrides unter `#team-steckbriefe .special-photo-gallery …`. Ein erster Versuch hat außerdem versehentlich per `#team-steckbriefe .special-photo-gallery img` (zu allgemeiner Selektor) auch das kleine Orka-Icon/Logo in der Fußzeile auf Fotogröße gestreckt – Fix: Selektor auf `.steckbrief-photo-frame img` einschränken, nicht pauschal auf alle `img` im Gallery-Container.
  - Mitarbeitende ohne Foto zeigen jetzt eine einfache Personen-Silhouette (Inline-SVG) statt einer leeren gestrichelten Box.
- CLAUDE.md um einen festen Hinweis ergänzt: Die Nutzerin/der Nutzer dieser Zusammenarbeit ist Matze, die Kita-Leitung selbst (siehe ganz oben).

### Fehlerprotokoll

Ab sofort werden wiederkehrende oder ungelöste technische Fehler hier kurz protokolliert (Datum, Kurzbeschreibung, was schon versucht wurde), damit eine neue Session nicht bei null anfangen muss. Bei neuen relevanten Fehlern bitte kurz ergänzen.

**13. Juli 2026 – Bilder werden beim Anzeigen zeitweise abgelehnt („media removed — rejected by API")**
- Trat mehrfach auf: bei einem von der Nutzerin hochgeladenen Foto ebenso wie bei selbst erzeugten Playwright-Screenshots (z. B. Vorschau-Bilder von Website-Änderungen).
- Nicht dauerhaft reproduzierbar: Derselbe Bildinhalt hat, unter neuem Dateinamen erneut gespeichert (z. B. als JPEG neu komprimiert oder um ca. 40 % verkleinert), bei einem späteren Versuch oft funktioniert. Ein einfaches Test-Bild (einfarbiges Quadrat) hat währenddessen immer zuverlässig funktioniert – die generelle Bildanzeige war also nicht komplett ausgefallen.
- Deutet eher auf ein temporäres/flackerndes Anzeigeproblem hin als auf ein echtes Größen- oder Inhaltsproblem (auch wenn eine inhaltliche Ablehnung durch einen Sicherheitsfilter bei einzelnen Fällen nicht auszuschließen ist, siehe Eintrag oben).
- Workaround, der wiederholt geholfen hat: Bei „rejected by API" die Datei unter neuem Namen erneut speichern bzw. leicht verändern (Format wechseln, z. B. PNG → JPEG, oder Auflösung um ca. 40 % verkleinern) und erneut per Read-Tool versuchen. Meist reicht ein zweiter oder dritter Versuch.

## Desktop-Hintergrund (Wallpaper)
- Liegt in `extras/wallpaper-orka-zirbelnuss/` (kein Website-Content, nur zum Download für die Nutzerin persönlich).
- Motiv: Orka + Zirbelnuss, ausgeschnitten aus der Illustration von `site/teambuch-cover.png` (Hintergrund per Farbschwellenwert freigestellt), mit gebogenem „Kita Reischlestraße"-Schriftzug darüber und der Icon-Motto-Zeile „Gemeinsam. Für Kinder. Mit Herz und Ideen." mittig unten.
- Abgestimmter Endstand: einfarbig grauer Hintergrund (`#A3A39B`), kein „Teambuch"-Schriftzug, Illustration + Bogentext unten rechts positioniert (viel Platz links/oben für Desktop-Icons), Illustration bewusst klein gehalten.
- Reproduzierbar/anpassbar über `extras/wallpaper-orka-zirbelnuss/build.py` (reines PIL-Skript, braucht die im selben Ordner liegenden `crop_illustration.png`, `arctext.png`, `motto.png`). Erzeugt aktuell die Formate 1920×1200 und 3840×2160.
- Falls die Nutzerin ein neues Format oder Farbe möchte: einfach `build.py` mit neuen Parametern (Skalierung, Position, Hintergrundfarbe) erneut aufrufen statt alles neu zu bauen.

## Architektur-Hinweis
- `site/index.html` ist die zentrale, statische Seite (Stammgruppen, Lernwerkstätten, Hauswirtschaft, Fortbildungen, Bilder & Momente, Checklisten, ...), gestylt über `site/style.css` und `site/checklists.css`.
- Wo möglich, Inhalte lieber direkt statisch in `index.html` schreiben statt JS-Injection zur Laufzeit hinzuzufügen – hat in der Vergangenheit zu Duplikat-Bugs geführt (z. B. doppelte Karten/Fotos, wenn Inhalt sowohl statisch als auch per JS eingefügt wurde). `site/hort-gallery-shell.js` (Hort-Fotogalerie per Laufzeit-Injection ins iframe) wurde deshalb entfernt und die Hort-Galerie direkt statisch in `site/index.html` eingebaut (Juli 2026) – dadurch bekommt sie wie alle anderen Galerien automatisch die swipebare Vollbildansicht von `slideshow.js`. Aus demselben Grund wurden auch die vormals per `checklists.js` zur Laufzeit erzeugten Abschnitte „Aktuelles" und „Personalratswahl 2026" statisch in `site/index.html` geschrieben.
- Root `index.html` bindet `site/index.html` weiterhin per `<iframe id="teambuch-frame">` ein. Der ursprüngliche Grund dafür (`hort-gallery-shell.js`) ist entfallen; die Iframe-Einbindung besteht aktuell nur noch aus historischen Gründen und könnte bei Gelegenheit vereinfacht werden.
- `checklists.js` enthält noch JS für: Checklisten-Fortschritt (localStorage), automatisches Schließen des Menüs/Inhaltsverzeichnisses beim Klick auf einen Link, und ab 1024px Breite eine dauerhaft sichtbare (nicht mehr eingeklappte) Kopfzeilen-Navigation.
