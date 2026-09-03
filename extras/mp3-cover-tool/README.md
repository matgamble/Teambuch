# MP3 Cover Tool — Android-App

Das Tool aus `HANDOFF-original.md` (MP3s für den MECHEN-Player umbenennen,
taggen, Cover einbetten) liegt hier als fertig eingerichtetes **Capacitor-Projekt**.
Es muss nichts mehr initialisiert werden — nur noch gebaut.

Das ist kein Website-Inhalt des Teambuchs, sondern ein eigenständiges Werkzeug,
wie die anderen Ordner unter `extras/`.

## APK bauen

Die APK **konnte hier nicht gebaut werden**: In dieser Sandbox ist `dl.google.com`
per Netzwerk-Policy gesperrt (403), und sowohl das Android SDK als auch das
Android-Gradle-Plugin kommen ausschließlich von dort. Alles, was ohne Google
erreichbar war, ist deshalb schon erledigt — der Build selbst muss auf einem
Rechner mit Android Studio laufen.

Voraussetzung: **Android Studio** (bringt SDK und JDK mit) oder JDK 21 + Android SDK.

```bash
cd extras/mp3-cover-tool
npm install
npx cap sync android
```

Danach entweder in Android Studio öffnen …

```bash
npx cap open android
```

… oder direkt auf der Kommandozeile:

```bash
cd android && ./gradlew assembleDebug
# Ergebnis: android/app/build/outputs/apk/debug/app-debug.apk
```

Die Debug-APK ist mit dem Debug-Schlüssel signiert — das reicht, um sie auf dem
eigenen Handy zu installieren (in den Android-Einstellungen "Installation aus
unbekannten Quellen" für den Dateimanager erlauben). Für eine Weitergabe an
andere bräuchte es einen eigenen Release-Keystore.

Nach jeder Änderung an `www/` einmal `npx cap sync android` laufen lassen,
damit die Dateien in das Android-Projekt kopiert werden.

## Was gegenüber dem Handoff-Stand geändert wurde

**Ein echter Fehler im Tool wurde gefunden und behoben.** Die Album-Karte wurde
gar nicht fertig gerendert: `batchToolEl` wurde benutzt, bevor es deklariert war
(`let` in der temporal dead zone), was bei jedem Rendern eine `ReferenceError`
warf. Titelliste, Cover-Bereich und CD-Spalte fehlten dadurch komplett. Das
passt zur Notiz im Handoff, dass das Tool nie in einem echten Browser lief —
im Browser war es faktisch unbenutzbar.

**JSZip liegt jetzt lokal** unter `www/vendor/jszip.min.js` statt beim CDN.
Eine installierte App, die zum Start erst `cdnjs.cloudflare.com` erreichen muss,
wäre offline kaputt gewesen. Die Seite lädt jetzt ohne einen einzigen externen
Request.

**Export ohne ZIP-Umweg auf dem Handy** (Punkt 2 der Upgrade-Liste im Handoff):
In der nativen App schreibt das Tool die fertigen Dateien über
`@capacitor/filesystem` direkt nach `Dokumente/MP3-Sammlung/Interpret/Jahr - Album/…`,
statt ein ZIP zum Download anzubieten (das eine Android-WebView ohnehin nicht
sauber entgegennimmt). Schlägt das fehl, fällt es automatisch auf den ZIP-Weg
zurück. Im normalen Browser bleibt alles wie vorher.

**Service Worker nur im Browser.** In der App liefert Capacitor die Dateien
ohnehin lokal aus; ein zusätzlicher Cache würde dort nur veraltete Stände
festhalten.

**App-Erscheinungsbild**: Launcher-Icons (inkl. adaptivem Icon und runder
Variante) und Splash-Screens aus `icon-512.png` erzeugt, Theme in Graphit
(`#26221D`) mit Messing-Akzent (`#C9A15A`) — passend zum Tool selbst.
Reproduzierbar über `tools/icons-erzeugen.py` (braucht Pillow):

```bash
python3 tools/icons-erzeugen.py www/icon-512.png android/app/src/main/res
```

**Speicherberechtigung** für Android 10 und älter im Manifest ergänzt
(`maxSdkVersion=29`); ab Android 11 regelt das die Plattform selbst.

## Test

`tools/smoke-test.mjs` fährt das Tool einmal komplett in einem echten Chromium
durch — Dateien einlesen, verarbeiten, ZIP prüfen:

```bash
npm install --no-save playwright
node tools/smoke-test.mjs
```

Läuft grün: keine JS-Fehler, keine externen Requests, ZIP mit korrekter
Ordnerstruktur `Interpret/Album/01 - Titel.mp3` und gültigen ID3v2.3-Tags
(TIT2/TPE1/TALB/TRCK, Audio-Frames unmittelbar hinter dem Tag).

## Was weiterhin ungetestet ist

- **Cover-Suche und Album-Abgleich.** `itunes.apple.com` ist in dieser Umgebung
  ebenfalls gesperrt, der Weg konnte nicht ausprobiert werden. Der im Handoff
  beschriebene Schwachpunkt (`getRemoteCoverBytes()` mit zwei Ladeversuchen)
  ist unverändert — ob die native WebView damit besser zurechtkommt als
  mobiles Chrome, zeigt sich erst auf dem Gerät.
- **Der native Speicherpfad** selbst. Der Code ist da und fällt bei Problemen
  auf ZIP zurück, gelaufen ist er mangels Android-Gerät hier noch nie.
- **Der MECHEN-Player.** Wie im Handoff: vor dem großen Durchlauf eine erzeugte
  Datei probehören und die Cover-Anzeige prüfen.
- Die echte Ordner-Auswahl über das Storage Access Framework (Punkt 1 der
  Upgrade-Liste) ist nicht umgesetzt — der Workaround mit zwei getrennten
  Uploads für CD1/CD2 ist weiterhin der Weg.
