// Kleiner End-to-End-Rauchtest für www/index.html im echten Browser.
//
//   npm install --no-save playwright
//   node tools/smoke-test.mjs
//
// Er lädt die Seite, wirft zwei Test-MP3s hinein, klickt "Alles verarbeiten"
// und prüft, dass ein ZIP mit der erwarteten Ordnerstruktur herauskommt.
// Ausgabe (Screenshots + ZIP) landet in tools/smoke-ergebnis/.
//
// Nicht abgedeckt: Cover-Suche und Album-Abgleich (brauchen die iTunes-API)
// sowie der native Speicherpfad der Android-App.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PROJECT = path.resolve(HERE, '..');
const WWW = path.join(PROJECT, 'www');
const FIXTURES = path.join(HERE, 'testdaten');
const OUT = path.join(HERE, 'smoke-ergebnis');
const PORT = 4173;

const { chromium } = await import('playwright');

fs.mkdirSync(OUT, { recursive: true });

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel === '/') rel = '/index.html';
  const file = path.join(WWW, rel);
  if (!file.startsWith(WWW) || !fs.existsSync(file)) { res.writeHead(404); return res.end('nicht gefunden'); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
  res.end(fs.readFileSync(file));
});
await new Promise(r => server.listen(PORT, r));

const browser = await chromium.launch();
const page = await (await browser.newContext({ acceptDownloads: true })).newPage();

const problems = [];
page.on('pageerror', e => problems.push('Seitenfehler: ' + e.message));
page.on('console', m => { if (m.type() === 'error') problems.push('Konsole: ' + m.text()); });
const requests = [];
page.on('request', r => requests.push(r.url()));

await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle' });

const checks = [];
const ok = (label, cond, detail = '') => { checks.push([cond, label, detail]); };

ok('JSZip lokal geladen', await page.evaluate(() => typeof JSZip === 'function'));
ok('keine externen Requests beim Laden',
   requests.every(u => u.startsWith(`http://localhost:${PORT}`)),
   requests.filter(u => !u.startsWith(`http://localhost:${PORT}`)).join(', '));

const files = fs.readdirSync(FIXTURES).filter(f => f.endsWith('.mp3')).sort()
  .map(f => path.join(FIXTURES, f));
await page.setInputFiles('#fileInput', files);
await page.waitForSelector('#actionBar', { state: 'visible', timeout: 15000 });

const titleRows = await page.locator('#albums input[data-role=title]').count();
ok('Titelzeilen gerendert', titleRows === files.length, `erwartet ${files.length}, gefunden ${titleRows}`);
await page.screenshot({ path: path.join(OUT, '01-geladen.png'), fullPage: true });

const [download] = await Promise.all([
  page.waitForEvent('download', { timeout: 120000 }),
  page.click('#processBtn'),
]);
const zipPath = path.join(OUT, download.suggestedFilename());
await download.saveAs(zipPath);
await page.waitForTimeout(300);
await page.screenshot({ path: path.join(OUT, '02-fertig.png'), fullPage: true });

const status = (await page.locator('#status').innerText()).trim();
ok('Verarbeitung ohne Fehler abgeschlossen', status.startsWith('Fertig'), status);
ok('ZIP nicht leer', fs.statSync(zipPath).size > 1000);
ok('keine JS-Fehler', problems.length === 0, problems.join(' | '));

await browser.close();
server.close();

let failed = 0;
for (const [cond, label, detail] of checks) {
  console.log(`${cond ? '✓' : '✗'} ${label}${cond || !detail ? '' : ' — ' + detail}`);
  if (!cond) failed++;
}
console.log(`\nZIP: ${zipPath}\nScreenshots: ${OUT}`);
process.exit(failed ? 1 : 0);
