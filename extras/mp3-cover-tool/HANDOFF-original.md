# MP3 Cover Tool → Android APK — Übergabe an Claude Code

## Was das hier ist

Ein **rein clientseitiges HTML/JS-Tool** (kein Backend), das MP3-Dateien für den
MECHEN-Player vorbereitet: umbenennen, Cover ins ID3-Tag einbetten, nach
Interpret/Album/Jahr sortieren, Doppelalben (CD1/CD2) korrekt handhaben,
Album-Version gegen iTunes abgleichen (Trackzahl/Titel-Check).

Es liegt bereits als PWA-Grundgerüst vor (`manifest.json`, `sw.js`, Icons) und
soll jetzt zu einer **echten installierbaren Android-APK** gemacht werden.

## Ziel dieser Session

Aus `index.html` (+ `manifest.json`, `sw.js`, Icons) eine **APK bauen**, am
sinnvollsten über **Capacitor** (wrapt beliebiges HTML/JS/CSS als native
Android-App, keine Neuprogrammierung nötig):

```bash
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "MP3 Cover Tool" "de.matze.mp3covertool" --web-dir=www
mkdir www && cp index.html manifest.json sw.js icon-192.png icon-512.png www/
npx cap add android
npx cap sync
```

Danach entweder:
- **Android Studio** öffnen (`npx cap open android`) und dort builden/signieren, oder
- per Kommandozeile: `cd android && ./gradlew assembleDebug` (Debug-APK, ungesigned/debug-signed, reicht zum Testen auf dem eigenen Handy)

**Voraussetzung, die hier im Sandbox NICHT gegeben war:** Android SDK + JDK
lokal installiert (Android Studio bringt das mit). Deshalb konnte die APK
nicht direkt in der Chat-Umgebung gebaut werden — dafür ist Claude Code auf
dem eigenen Rechner mit echtem Android-Tooling der richtige Ort.

## Dateien in diesem Ordner

| Datei | Zweck |
|---|---|
| `index.html` | Das komplette Tool (UI + Logik), ca. 940 Zeilen, alles inline |
| `manifest.json` | PWA-Manifest (Name, Icons, standalone display) |
| `sw.js` | Service Worker, cached nur die eigene App-Shell |
| `icon-192.png`, `icon-512.png` | App-Icons (brass/graphite Theme, passend zum MECHEN-Player-Look) |

## Technische Kernpunkte in `index.html` (wichtig für Weiterentwicklung)

**ID3v2.3-Tags werden von Hand geschrieben** (keine externe Library, bewusst
so gewählt wegen CDN-Einschränkungen). Relevante Funktionen:
- `buildId3Tag()`, `makeFrame()`, `makeTextFrame()`, `makeApicFrame()` — Tag-Erstellung
- `stripTags()` — entfernt alte ID3v2/ID3v1-Tags vor dem Neuschreiben
- `readExistingTags()` — liest vorhandene Tags zum Vorausfüllen der Felder
- Encoding: bewusst Latin-1 (0x00) statt UTF-8, weil das MECHEN-Firmware
  vermutlich zuverlässiger parst; deckt deutsche Umlaute vollständig ab.

**Cover-Suche/-Download:**
- `searchItunesCovers()` — iTunes Search API (JSON, funktioniert zuverlässig)
- `getRemoteCoverBytes()` — versucht zwei Lademethoden nacheinander (direktes
  `<img crossorigin>` + Canvas, dann `fetch()` als Fallback), weil reines
  `fetch()` auf Apples Bild-CDN in manchen Browser-Kontexten blockiert war.
  **Bekannter Schwachpunkt:** wenn beide Methoden fehlschlagen, muss der
  Nutzer manuell "Vollbild ↗" öffnen, Bild speichern, dann hochladen. In einer
  nativen Android-WebView (Capacitor) könnte das robuster laufen als im
  mobilen Chrome — das sollte als Erstes getestet werden.
- `resizeCoverToJpeg()` / `resizeRemoteCoverToJpeg()` — Cover wird immer auf
  640×640 zugeschnitten (MECHEN-Player-Vorgabe, siehe Notiz im Tool selbst)

**Album-Versions-Check:**
- `fetchAlbumTracks()` — iTunes Lookup API, liefert Tracklist inkl. Disc-Nummer
- `matchLevel()` / `normTitle()` — Fuzzy-Vergleich lokaler Titel gegen iTunes
  (behandelt Umlaute, Apostrophe, Klammerzusätze wie "(Remastered)")

**Doppelalben (CD1/CD2):**
- Jede Datei hat ein `disc`-Feld, erkannt aus Dateiname
  (`guessFromFilename()`, `guessDiscFromPath()`) oder manuell in der UI
- `batch`-Feld pro Datei: Mobile-Workaround, weil `webkitdirectory`
  (Ordner-Auswahl) auf Android/iOS nicht zuverlässig funktioniert — Nutzer
  lädt CD1/CD2 als zwei getrennte Uploads hoch, Tool bietet dann "Upload N →
  CD X übernehmen" Buttons an
- **In einer nativen APK könnte man das über die native Android File-Picker-
  API (Storage Access Framework via Capacitor-Plugin) sauberer lösen** —
  echte Ordner-Auswahl mit Unterordnern wäre dann möglich. Wäre ein sinnvolles
  Upgrade, sobald es eine native App ist.

**Feat.-Normalisierung:**
- `splitFeat()` — entfernt "feat./ft./featuring" aus dem Interpret-Feld,
  verschiebt es in den Titel, verhindert dass Compilation-artige Alben durch
  wechselnde Features in viele Mini-Gruppen zerfallen

**Manuelles Zusammenführen:**
- Jede Album-Karte hat unten ein Dropdown + "Zusammenführen"-Button als
  Sicherheitsnetz gegen jede Art von Gruppierungs-Fragmentierung

## Sinnvolle native Upgrades, sobald es eine APK ist

1. **Datei-/Ordnerzugriff über Storage Access Framework** statt HTML
   `<input type=file>` — löst das Doppelalbum-Ordner-Problem sauber
2. **Direkter Export in einen gewählten Ordner** statt ZIP-Download — mit
   `@capacitor/filesystem` könnte man die fertigen Dateien direkt in einen
   Zielordner (z. B. auf eine microSD-Karte über SAF) schreiben, ganz ohne
   ZIP-Umweg
3. Cover-Fetch testen — in der nativen WebView evtl. weniger restriktiv als
   mobiles Chrome, ggf. `getRemoteCoverBytes()` vereinfachen

## Offene Punkte / nicht getestet

- Das Tool wurde nur mit Node.js-Unit-Tests der reinen Logik verifiziert
  (ID3-Bytes, Pfad-Aufbau, Feat.-Erkennung) — nie in einem echten Browser
  oder auf dem MECHEN-Player selbst getestet. Vor dem produktiven Einsatz:
  eine erzeugte Datei auf dem Player probehören und Cover-Anzeige prüfen.
- Kein automatisiertes UI-Testing vorhanden.
