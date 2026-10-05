// Bouwt de statische pagina's (index.html, beeld-1..6.html) uit de Claude Design-export in ontwerp/.
// Gebruik vanuit de root van de repo: node tools/bouw.js
// Overschrijft index.html en beeld-*.html. Handmatige wijzigingen in die bestanden gaan daarbij verloren.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = ROOT;
const EXPORT = path.join(ROOT, 'ontwerp', 'Bijlage C mockups.dc.html');

const html = fs.readFileSync(EXPORT, 'utf8');
const lucide = require(path.join(__dirname, 'vendor', 'lucide-0.417.0.js'));

// ---- data from the dc-script -------------------------------------------------
const script = html.slice(html.indexOf('data-dc-script>') + 'data-dc-script>'.length, html.indexOf('class Component'));
const data = new Function(`${script}; return { ROWS_1, ROWS_2 };`)();
const rows = {
  rows: data.ROWS_1.map((r) => ({ titel: r[0], soort: r[1], datum: r[2], organisatie: r[3], verlener: r[4] })),
  rows2: data.ROWS_2.map((r) => ({ titel: r[0], soort: r[1], datum: r[2], organisatie: r[3], verlener: r[4], annotatie: r[5] || false })),
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---- icons: same output as lucide.createIcons(), inlined -----------------------
const pascal = (s) => s.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
function icon(name, style) {
  const node = lucide.icons[pascal(name)];
  if (!node) throw new Error(`unknown icon ${name}`);
  const [, attrs, children] = node;
  const all = { ...attrs, 'data-lucide': name };
  if (style) all.style = style;
  all.class = `lucide lucide-${name}`;
  all['aria-hidden'] = 'true';
  const a = Object.entries(all).map(([k, v]) => `${k}="${esc(v)}"`).join(' ');
  const kids = children.map(([t, ca]) => `<${t} ${Object.entries(ca).map(([k, v]) => `${k}="${esc(v)}"`).join(' ')}></${t}>`).join('');
  return `<svg ${a}>${kids}</svg>`;
}

// ---- DS Avatar (components/core/Avatar.jsx), rendered statically ----------------
function avatar(name, tone, size) {
  const tones = { blue: ['var(--blue-10)', 'var(--medmij-blue)'], green: ['var(--green-10)', '#2c7d70'], orange: ['var(--orange-10)', '#b96d16'], gray: ['var(--gray-10)', '#5d5d5d'] };
  const [bg, fg] = tones[tone] || tones.blue;
  const initials = name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  return `<span style="width: ${size}px; height: ${size}px; border-radius: 50%; flex: none; display: inline-flex; align-items: center; justify-content: center; overflow: hidden; font-family: var(--font-sans); font-weight: var(--weight-semibold); font-size: ${size * 0.4}px; background: ${bg}; color: ${fg};">${esc(initials)}</span>`;
}

// ---- screens ------------------------------------------------------------------
const SCREENS = [
  {
    n: 1, scherm: 'Documentoverzicht', toepassing: 'Metadatering', situatie: 'Huidige situatie',
    kaart: 'De metadata zoals zorgaanbieders die nu aanleveren.',
    tekst: 'Het documentoverzicht van een PGO met de metadata zoals zorgaanbieders die nu aanleveren. De meeste regels zijn goed gevuld. Een deel heeft een Engelse of technische titel, een bestandsnaam als titel of staat er twee keer in. Aan de lijst is niet te zien welke regels dat zijn.',
    rowLinks: { rows: { 'Pathology report|26-02-2026': 'beeld-3.html' } },
  },
  {
    n: 2, scherm: 'Documentoverzicht', toepassing: 'Metadatering', situatie: 'Gewenste situatie',
    kaart: 'Hetzelfde overzicht met afgeleide titels en zonder dubbele regels.',
    tekst: 'Hetzelfde overzicht met dezelfde documenten. Titels die niets zeggen, zijn vervangen door een afgeleide titel in het Nederlands, aangeduid met ‘afgeleide titel’. De titel zoals de bron die levert, blijft op te vragen. Een document met meerdere versies staat er één keer in. Velden die de bron leeg laat, blijven leeg.',
    rowLinks: { rows2: { 'Pathologieverslag|26-02-2026': 'beeld-4.html' } },
  },
  {
    n: 3, scherm: 'Detailscherm pathologieverslag', toepassing: 'Uitleg in begrijpelijke taal', situatie: 'Huidige situatie',
    kaart: 'Alleen het originele document, zonder uitleg.',
    tekst: 'Het detailscherm van het pathologieverslag zoals een PGO het nu toont: de metadata en het originele document in de viewer. Het verslag is geschreven voor de aanvragend specialist en staat vol vaktaal. Een uitleg voor de burger is er niet.',
    crumb: 'beeld-1.html',
  },
  {
    n: 4, scherm: 'Detailscherm pathologieverslag', toepassing: 'Uitleg in begrijpelijke taal', situatie: 'Gewenste situatie',
    kaart: 'Het origineel met een uitleg in begrijpelijke taal ernaast.',
    tekst: 'Hetzelfde detailscherm, nu met een uitleg in begrijpelijke taal naast het originele document. Het origineel blijft volledig en ongewijzigd in beeld en is leidend. De gemarkeerde alinea in de uitleg hoort bij de gemarkeerde passage in het document.',
    crumb: 'beeld-2.html',
  },
  {
    n: 5, scherm: 'Detailscherm pathologieverslag', toepassing: 'Vertaling', situatie: 'Huidige situatie',
    kaart: 'Gelijk aan beeld 4. Het verschil zit bij de gebruiker.',
    tekst: 'Dit scherm is gelijk aan beeld 4: het originele document met de uitleg in begrijpelijke taal, alles in het Nederlands. Het verschil zit bij de gebruiker. Wie het Nederlands onvoldoende beheerst, kan ook deze uitleg niet lezen. Beeld 5 en beeld 6 verschillen alleen in de taal van de uitleg.',
    crumb: 'beeld-2.html',
  },
  {
    n: 6, scherm: 'Detailscherm pathologieverslag', toepassing: 'Vertaling', situatie: 'Gewenste situatie',
    kaart: 'Uitleg in het Turks. Origineel en metadata blijven Nederlands.',
    tekst: 'Hetzelfde scherm als beeld 5, nu met de uitleg in het Turks. Het originele document en de metadata blijven in het Nederlands, omdat die uit de bron komen. Alleen de uitleg is vertaald.',
    crumb: 'beeld-2.html', lang: 'tr',
  },
];

const FOOTER = 'Mockup bij memo AI in het MedMij-stelsel. Geen werkend product, geen echte patiëntgegevens.';
const TITLE_SPAN = '<span style="white-space: nowrap; font-size: var(--text-base); color: var(--text-link);">';

function renderSection(src, s) {
  let out = src;

  // sc-for -> static rows
  out = out.replace(/<sc-for list="\{\{ (\w+) \}\}" as="row"[^>]*>\n([\s\S]*?)\n\s*<\/sc-for>/g, (_, list, body) => {
    const links = (s.rowLinks || {})[list] || {};
    return rows[list].map((row) => {
      let r = body.replace(/<sc-if value="\{\{ row\.annotatie \}\}"[^>]*>\n([\s\S]*?)\n\s*<\/sc-if>/g, (__, inner) => (row.annotatie ? inner : ''));
      r = r.replace(/\{\{ row\.(\w+) \}\}/g, (__, k) => esc(row[k]));
      const href = links[`${row.titel}|${row.datum}`];
      if (href) {
        const span = `${TITLE_SPAN}${esc(row.titel)}</span>`;
        if (!r.includes(span)) throw new Error(`title span not found for ${row.titel}`);
        r = r.replace(span, `<a href="${href}" style="white-space: nowrap; font-size: var(--text-base); color: var(--text-link);">${esc(row.titel)}</a>`);
      }
      return r.replace(/\n\s*\n/g, '\n');
    }).join('\n');
  });

  // breadcrumb "Documenten" -> back to the matching overview
  if (s.crumb) {
    const crumb = '<span style="color: var(--text-link);">Documenten</span>';
    if (!out.includes(crumb)) throw new Error('breadcrumb not found');
    out = out.replace(crumb, `<a href="${s.crumb}" style="color: var(--text-link);">Documenten</a>`);
  }

  // Turkish explanation panel: mark the language (no visual change)
  if (s.lang) {
    const h2 = '<h2 style="margin: 0; font-size: var(--text-md); font-weight: var(--weight-semibold); color: var(--text-strong);">Anlaşılır dilde açıklama</h2>';
    const start = out.indexOf(h2);
    if (start < 0) throw new Error('turkish panel not found');
    const open = out.lastIndexOf('<div style="min-height: 0; display: flex; flex-direction: column;', start);
    out = out.slice(0, open + 4) + ` lang="${s.lang}"` + out.slice(open + 4);
  }

  out = out.replace(/<x-import component-from-global-scope="DesignSystem_0165d5\.Avatar" name="([^"]+)" tone="(\w+)" size="\{\{ (\d+) \}\}"[^>]*><\/x-import>/g,
    (_, name, tone, size) => avatar(name, tone, Number(size)));
  out = out.replace(/<i data-lucide="([a-z0-9-]+)"(?: style="([^"]*)")?><\/i>/g, (_, name, style) => icon(name, style));

  // caption directly under the screen label
  const headerEnd = out.indexOf('</div>') + '</div>'.length;
  const caption = `

  <div class="proto-caption">
    <dl class="proto-caption-meta">
      <div><dt>Toepassing</dt><dd>${esc(s.toepassing)}</dd></div>
      <div><dt>Situatie</dt><dd>${esc(s.situatie)}</dd></div>
    </dl>
    <p>${esc(s.tekst)}</p>
  </div>`;
  out = out.slice(0, headerEnd) + caption + out.slice(headerEnd);

  if (/<(sc-|x-import)|data-lucide="[^"]*"><\/i>|\{\{/.test(out)) throw new Error(`unrendered template in beeld ${s.n}`);
  return out;
}

const head = (title) => `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${esc(title)}</title>
<link rel="icon" href="data:,">
<link rel="stylesheet" href="assets/ds/styles.css">
<link rel="stylesheet" href="assets/mockup.css">
<link rel="stylesheet" href="assets/prototype.css">
<script src="assets/prototype.js" defer></script>
</head>
<body>
`;

const footer = `<footer class="proto-footer">
  <p>${esc(FOOTER)}</p>
</footer>
</body>
</html>
`;

function bar(s) {
  const prev = s.n > 1
    ? `<a class="proto-btn" href="beeld-${s.n - 1}.html" rel="prev">${icon('arrow-left', 'width: 16px; height: 16px;')}Vorige</a>`
    : `<span class="proto-btn" aria-disabled="true">${icon('arrow-left', 'width: 16px; height: 16px;')}Vorige</span>`;
  const next = s.n < SCREENS.length
    ? `<a class="proto-btn" href="beeld-${s.n + 1}.html" rel="next">Volgende${icon('arrow-right', 'width: 16px; height: 16px;')}</a>`
    : `<span class="proto-btn" aria-disabled="true">Volgende${icon('arrow-right', 'width: 16px; height: 16px;')}</span>`;
  const steps = SCREENS.map((t) => `<li><a href="beeld-${t.n}.html"${t.n === s.n ? ' aria-current="page"' : ''} title="Beeld ${t.n}: ${esc(t.toepassing.toLowerCase())}, ${esc(t.situatie.toLowerCase())}">${t.n}</a></li>`).join('');
  return `<nav class="proto-bar" aria-label="Mockups">
  <a class="proto-btn" href="index.html">${icon('layout-grid', 'width: 16px; height: 16px;')}Overzicht</a>
  <ol class="proto-steps" aria-label="Beelden">${steps}</ol>
  <div class="proto-pager">${prev}${next}</div>
</nav>
`;
}

const sections = [...html.matchAll(/<section data-screen-label="Beeld (\d)"[\s\S]*?<\/section>/g)];
if (sections.length !== 6) throw new Error(`expected 6 sections, got ${sections.length}`);

for (const s of SCREENS) {
  const src = sections.find((m) => Number(m[1]) === s.n)[0];
  const page = head(`Beeld ${s.n}: ${s.toepassing.toLowerCase()}, ${s.situatie.toLowerCase()} | Bijlage C`)
    + bar(s) + '\n' + renderSection(src, s) + '\n\n' + footer;
  fs.writeFileSync(path.join(OUT, `beeld-${s.n}.html`), page);
}

// ---- overview -----------------------------------------------------------------
const groups = ['Metadatering', 'Uitleg in begrijpelijke taal', 'Vertaling'];
const card = (s) => `<a class="proto-card" href="beeld-${s.n}.html">
        <span class="proto-eyebrow">Beeld ${s.n}</span>
        <span class="proto-card-title">${esc(s.scherm)}</span>
        <span class="proto-card-text">${esc(s.kaart)}</span>
      </a>`;
const grid = groups.map((g) => {
  const [a, b] = SCREENS.filter((s) => s.toepassing === g);
  return `    <div class="proto-grid-row">
      <h2 class="proto-grid-label">${esc(g)}</h2>
      ${card(a)}
      ${card(b)}
    </div>`;
}).join('\n');

const index = head('Bijlage C: mockups | Memo AI in het MedMij-stelsel') + `<main class="proto-index">
  <span class="proto-eyebrow">Memo AI in het MedMij-stelsel</span>
  <h1>Bijlage C: mockups</h1>
  <p class="proto-lead">Zes schermen van een persoonlijke gezondheidsomgeving (PGO). Drie toepassingen, telkens in de huidige en de gewenste situatie. Open een beeld, of begin bij beeld 1 en blader met vorige en volgende. De pijltjestoetsen werken ook.</p>
  <a class="proto-btn proto-start" href="beeld-1.html">Begin bij beeld 1${icon('arrow-right', 'width: 16px; height: 16px;')}</a>

  <div class="proto-grid">
    <div class="proto-grid-row proto-grid-head" aria-hidden="true">
      <span></span>
      <span>Huidige situatie</span>
      <span>Gewenste situatie</span>
    </div>
${grid}
  </div>
</main>

` + footer;
fs.writeFileSync(path.join(OUT, 'index.html'), index);
console.log('built', SCREENS.length + 1, 'pages into', OUT);
