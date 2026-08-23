/**
 * Generates the site's original explainer diagrams as WebP.
 *
 * These are drawn rather than photographed on purpose: the articles explain
 * specs and technique, which a stock photo of a shiny car cannot illustrate.
 * They are also our own assets, with no licence attached.
 *
 * Run: node scripts/make-diagrams.mjs
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const OUT = 'src/assets/images';
const W = 1200, H = 675;

// Field Manual palette — mirrors src/styles/global.css so diagrams and page
// share one set of colours.
const C = {
  bg: '#f7f6f2', card: '#ffffff', ink: '#16181a', ink2: '#4a5157', ink3: '#6c737a',
  line: '#dcdad2', brand: '#c4451e', brandLight: '#fbede8', accent: '#a8792f',
  good: '#1b6e4a', goodBg: '#edf6f1', bad: '#a3302b', badBg: '#fbeeed',
};

const F = `-apple-system, 'Helvetica Neue', Helvetica, Arial, sans-serif`;

const frame = (title, sub, body) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${C.bg}"/>
  <rect x="0" y="0" width="${W}" height="6" fill="${C.brand}"/>
  <text x="56" y="74" font-family="${F}" font-size="34" font-weight="700" fill="${C.ink}">${title}</text>
  <text x="56" y="108" font-family="${F}" font-size="19" fill="${C.ink3}">${sub}</text>
  ${body}
  <text x="${W - 56}" y="${H - 30}" text-anchor="end" font-family="${F}" font-size="16" font-weight="700" fill="${C.ink3}" letter-spacing="3">MOSHAKHA</text>
</svg>`;

/** Repeating pile shapes for a towel cross-section. */
function pile(kind, x, y, w, h, color) {
  let s = '';
  if (kind === 'twisted') {
    for (let i = 0; i < 26; i++) {
      const px = x + 6 + i * ((w - 12) / 26);
      s += `<path d="M${px} ${y + h} q6 -${h * 0.55} 0 -${h * 0.85} q-6 -${h * 0.18} 2 -${h * 0.3}"
            stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    }
  } else if (kind === 'plush') {
    for (let i = 0; i < 40; i++) {
      const px = x + 5 + i * ((w - 10) / 40);
      const jitter = (i % 5) * 4;
      s += `<line x1="${px}" y1="${y + h}" x2="${px + (i % 3) - 1}" y2="${y + h - (h * 0.78) + jitter}"
            stroke="${color}" stroke-width="3.4" stroke-linecap="round"/>`;
    }
  } else if (kind === 'waffle') {
    const cell = (w - 12) / 7;
    for (let i = 0; i < 7; i++) {
      const px = x + 6 + i * cell;
      s += `<rect x="${px + 3}" y="${y + h - h * 0.42}" width="${cell - 6}" height="${h * 0.42}"
            fill="none" stroke="${color}" stroke-width="3.5" rx="2"/>`;
    }
  }
  return s;
}


/** librsvg has no foreignObject support, so wrap text into <text> lines manually. */
function wrap(text, x, y, maxChars, size, fill, lh = 1.45) {
  const clean = String(text).replace(/<\/?b>/g, '');
  const words = clean.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxChars) { lines.push(cur.trim()); cur = w; }
    else cur += ' ' + w;
  }
  if (cur.trim()) lines.push(cur.trim());
  return lines.map((l, i) =>
    `<text x="${x}" y="${y + i * size * lh}" font-family="${F}" font-size="${size}" fill="${fill}">${l}</text>`
  ).join('');
}

const diagrams = {};

/* ---------- 1. Weave types ---------- */
{
  const cols = [
    { k: 'twisted', name: 'Twisted loop', use: 'Drying panels', note: 'Loops pull water up into the pile — the towel glides', ok: true },
    { k: 'plush', name: 'Plush / high pile', use: 'Wax + sealant removal', note: 'Soft and deep, but saturates sooner', ok: true },
    { k: 'waffle', name: 'Waffle weave', use: 'Glass', note: 'Thin and low-lint — poor at drying a whole car', ok: true },
  ];
  let body = '';
  cols.forEach((c, i) => {
    const x = 56 + i * 366, w = 330;
    body += `<rect x="${x}" y="150" width="${w}" height="400" rx="14" fill="${C.card}" stroke="${C.line}" stroke-width="2"/>
      <text x="${x + 24}" y="192" font-family="${F}" font-size="22" font-weight="700" fill="${C.ink}">${c.name}</text>
      <rect x="${x + 24}" y="300" width="${w - 48}" height="26" fill="${C.ink2}" rx="3"/>
      ${pile(c.k, x + 24, 214, w - 48, 86, C.brand)}
      <text x="${x + 24}" y="368" font-family="${F}" font-size="13" font-weight="700" fill="${C.brand}" letter-spacing="1.2">BEST FOR</text>
      <text x="${x + 24}" y="396" font-family="${F}" font-size="20" font-weight="600" fill="${C.ink}">${c.use}</text>
      ${wrap(c.note, x + 24, 434, 34, 16, C.ink2)}`;
  });
  diagrams['weave-types'] = frame('Microfibre weave types', 'The spec that matters more than GSM — matched to the job each one actually does', body);
}

/* ---------- 2. GSM ladder ---------- */
{
  const rows = [
    { r: '200–350', job: 'Glass, mirrors, final buff', bad: 'No capacity for drying panels', pct: 0.18 },
    { r: '350–500', job: 'Interiors, door shuts, general purpose', bad: 'Too thin to dry a whole car', pct: 0.32 },
    { r: '500–800', job: 'All-rounder — wax removal, quick detailer', bad: 'Streaks on glass', pct: 0.5 },
    { r: '800–1200', job: 'Drying panels — the sweet spot', bad: 'Clumsy on tight areas', pct: 0.75 },
    { r: '1200–1600+', job: 'Large SUVs, trucks, two cars back to back', bad: 'Wrong for glass and interiors', pct: 1.0 },
  ];
  let body = `<text x="56" y="168" font-family="${F}" font-size="13" font-weight="700" fill="${C.ink3}" letter-spacing="1.2">GSM</text>
    <text x="230" y="168" font-family="${F}" font-size="13" font-weight="700" fill="${C.good}" letter-spacing="1.2">RIGHT JOB</text>
    <text x="740" y="168" font-family="${F}" font-size="13" font-weight="700" fill="${C.bad}" letter-spacing="1.2">WRONG JOB</text>`;
  rows.forEach((row, i) => {
    const y = 186 + i * 78;
    const barW = 120 * row.pct;
    body += `<rect x="56" y="${y}" width="1088" height="66" rx="10" fill="${C.card}" stroke="${C.line}" stroke-width="2"/>
      <rect x="72" y="${y + 40}" width="${barW}" height="12" rx="3" fill="${C.brand}" opacity="${0.4 + row.pct * 0.6}"/>
      <text x="72" y="${y + 30}" font-family="${F}" font-size="19" font-weight="700" fill="${C.ink}">${row.r}</text>
      <text x="230" y="${y + 40}" font-family="${F}" font-size="18" fill="${C.ink}">${row.job}</text>
      <text x="740" y="${y + 40}" font-family="${F}" font-size="17" fill="${C.ink3}">${row.bad}</text>`;
  });
  diagrams['gsm-scale'] = frame('What GSM is actually for', 'GSM measures density, not quality — the right number depends entirely on the task', body);
}

/* ---------- 3. Mitt vs sponge ---------- */
{
  const panel = (x, title, ok, desc) => {
    const col = ok ? C.good : C.bad, bg = ok ? C.goodBg : C.badBg;
    let grit = '';
    if (ok) {
      // grit lifted up into the pile, away from paint
      for (let i = 0; i < 7; i++) grit += `<circle cx="${x + 60 + i * 62}" cy="${300 - (i % 3) * 22}" r="7" fill="${col}"/>`;
      for (let i = 0; i < 30; i++) {
        const px = x + 36 + i * ((470 - 72) / 30);
        grit += `<line x1="${px}" y1="360" x2="${px + (i % 3) - 1}" y2="286" stroke="${C.brand}" stroke-width="3.4" stroke-linecap="round"/>`;
      }
    } else {
      // grit pinned against the paint by a flat face
      grit += `<rect x="${x + 32}" y="286" width="438" height="74" rx="8" fill="#f0dcbc" stroke="${C.accent}" stroke-width="3"/>`;
      for (let i = 0; i < 7; i++) grit += `<circle cx="${x + 60 + i * 62}" cy="372" r="7" fill="${col}"/>`;
    }
    return `<rect x="${x}" y="150" width="502" height="400" rx="14" fill="${C.card}" stroke="${col}" stroke-width="2.5"/>
      <rect x="${x}" y="150" width="502" height="52" rx="14" fill="${bg}"/>
      <rect x="${x}" y="188" width="502" height="14" fill="${bg}"/>
      <text x="${x + 24}" y="184" font-family="${F}" font-size="22" font-weight="700" fill="${col}">${title}</text>
      ${grit}
      <rect x="${x + 32}" y="380" width="438" height="22" fill="${C.ink2}" rx="3"/>
      <text x="${x + 32}" y="424" font-family="${F}" font-size="13" font-weight="700" fill="${C.ink3}" letter-spacing="1.2">PAINT SURFACE</text>
      ${wrap(desc, x + 24, 462, 46, 17, C.ink2)}`;
  };
  const body =
    panel(56, 'Wash mitt — grit lifted away', true,
      'Deep pile draws particles <b>up and away</b> from the contact surface, where they stay suspended until you rinse.') +
    panel(642, 'Sponge — grit trapped against paint', false,
      'A flat, closed face has nowhere to put the grit except <b>between the sponge and your clear coat</b>. Every pass drags it.');
  diagrams['mitt-vs-sponge'] = frame('Why a sponge causes swirl marks', 'The difference is structural — not a matter of being careful enough', body);
}

/* ---------- 4. Two bucket method ---------- */
{
  const bucket = (x, label, color, sub) => `
    <path d="M${x} 250 L${x + 24} 430 L${x + 156} 430 L${x + 180} 250 Z" fill="${C.card}" stroke="${color}" stroke-width="3"/>
    <path d="M${x + 8} 300 L${x + 26} 424 L${x + 154} 424 L${x + 172} 300 Z" fill="${color}" opacity="0.16"/>
    <ellipse cx="${x + 90}" cy="250" rx="90" ry="16" fill="${C.card}" stroke="${color}" stroke-width="3"/>
    <rect x="${x + 26}" y="404" width="128" height="10" rx="3" fill="${color}" opacity="0.55"/>
    <text x="${x + 90}" y="466" text-anchor="middle" font-family="${F}" font-size="21" font-weight="700" fill="${C.ink}">${label}</text>
    <text x="${x + 90}" y="492" text-anchor="middle" font-family="${F}" font-size="16" fill="${C.ink3}">${sub}</text>`;
  const body = `
    ${bucket(150, 'SOAP', C.brand, 'Load the mitt here')}
    ${bucket(830, 'RINSE', C.ink3, 'Release grit here')}
    <path d="M400 300 q200 -70 400 0" stroke="${C.accent}" stroke-width="5" fill="none" marker-end="url(#a)"/>
    <path d="M800 400 q-200 70 -400 0" stroke="${C.brand}" stroke-width="5" fill="none" marker-end="url(#b)"/>
    <defs>
      <marker id="a" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto"><path d="M0 0 L12 6 L0 12 z" fill="${C.accent}"/></marker>
      <marker id="b" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto"><path d="M0 0 L12 6 L0 12 z" fill="${C.brand}"/></marker>
    </defs>
    <text x="600" y="268" text-anchor="middle" font-family="${F}" font-size="17" font-weight="600" fill="${C.accent}">1. Wash one panel</text>
    <text x="600" y="452" text-anchor="middle" font-family="${F}" font-size="17" font-weight="600" fill="${C.brand}">2. Rinse before reloading</text>
    <rect x="150" y="540" width="900" height="52" rx="10" fill="${C.brandLight}"/>
    <text x="600" y="573" text-anchor="middle" font-family="${F}" font-size="18" font-weight="600" fill="${C.brand}">Grit guards in both buckets keep settled dirt from being stirred back up</text>`;
  diagrams['two-bucket-method'] = frame('The two-bucket method', 'The single highest-impact habit in the entire wash process', body);
}

/* ---------- 5. Microfibre laundry do / don't ---------- */
{
  const item = (x, y, ok, text) => `
    <circle cx="${x + 18}" cy="${y - 6}" r="15" fill="${ok ? C.goodBg : C.badBg}" stroke="${ok ? C.good : C.bad}" stroke-width="2"/>
    <text x="${x + 18}" y="${y}" text-anchor="middle" font-family="${F}" font-size="17" font-weight="700" fill="${ok ? C.good : C.bad}">${ok ? '✓' : '✕'}</text>
    <text x="${x + 46}" y="${y}" font-family="${F}" font-size="18" fill="${C.ink}">${text}</text>`;
  let body = `
    <rect x="56" y="150" width="530" height="400" rx="14" fill="${C.card}" stroke="${C.good}" stroke-width="2.5"/>
    <text x="86" y="196" font-family="${F}" font-size="23" font-weight="700" fill="${C.good}">Do</text>
    <rect x="614" y="150" width="530" height="400" rx="14" fill="${C.card}" stroke="${C.bad}" stroke-width="2.5"/>
    <text x="644" y="196" font-family="${F}" font-size="23" font-weight="700" fill="${C.bad}">Don't</text>`;
  const dos = ['Wash cold or warm, max 40°C', 'Air dry, or tumble on low heat', 'Wash microfibre alone', 'Separate glass, paint, wax, wheels', 'Use plain detergent, sparingly', 'Strip wash with white vinegar'];
  const donts = ['Wash hot — it melts split fibres', 'Tumble dry on high heat', 'Mix with cotton — lint transfers', 'Wash all towel types together', 'Use fabric softener, ever', 'Use dryer sheets'];
  dos.forEach((t, i) => { body += item(86, 250 + i * 50, true, t); });
  donts.forEach((t, i) => { body += item(644, 250 + i * 50, false, t); });
  diagrams['microfibre-laundry'] = frame('Microfibre laundry rules', 'Laundering habits affect towel life more than what you paid for the towel', body);
}

/* ---------- 6. 500 vs 800 GSM ---------- */
{
  const col = (x, gsm, pileH, jobs, weak) => `
    <rect x="${x}" y="150" width="502" height="400" rx="14" fill="${C.card}" stroke="${C.line}" stroke-width="2"/>
    <text x="${x + 28}" y="200" font-family="${F}" font-size="30" font-weight="700" fill="${C.brand}">${gsm}</text>
    ${pile('plush', x + 28, 300 - pileH, 446, pileH, C.brand)}
    <rect x="${x + 28}" y="300" width="446" height="22" fill="${C.ink2}" rx="3"/>
    <text x="${x + 28}" y="358" font-family="${F}" font-size="13" font-weight="700" fill="${C.good}" letter-spacing="1.2">GOOD AT</text>
    ${wrap(jobs, x + 28, 384, 44, 17, C.ink)}
    <text x="${x + 28}" y="478" font-family="${F}" font-size="13" font-weight="700" fill="${C.bad}" letter-spacing="1.2">POOR AT</text>
    ${wrap(weak, x + 28, 504, 44, 17, C.ink2)}`;
  const body =
    col(56, '500 GSM', 58, 'Interiors, door shuts, general wiping, applying product', 'Drying a whole car') +
    col(642, '800 GSM', 108, 'Wax and sealant removal, quick detailer, light drying', 'Interiors, trim, anything tight');
  diagrams['500-vs-800-gsm'] = frame('500 GSM vs 800 GSM', 'Different tools — not better and worse', body);
}

/* ---------- 7. How swirl marks form ---------- */
{
  const body = `
    <rect x="56" y="150" width="1088" height="240" rx="14" fill="${C.card}" stroke="${C.line}" stroke-width="2"/>
    <rect x="88" y="330" width="1024" height="28" fill="${C.ink2}" rx="3"/>
    <text x="88" y="384" font-family="${F}" font-size="13" font-weight="700" fill="${C.ink3}" letter-spacing="1.2">CLEAR COAT</text>
    ${[0, 1, 2, 3, 4, 5].map(i => {
      const x = 150 + i * 165;
      return `<circle cx="${x}" cy="300" r="9" fill="${C.bad}"/>
        <path d="M${x} 330 q14 14 34 22" stroke="${C.bad}" stroke-width="3" fill="none" opacity="0.75"/>
        <text x="${x}" y="270" text-anchor="middle" font-family="${F}" font-size="15" fill="${C.ink3}">grit</text>`;
    }).join('')}
    <path d="M120 300 L1080 300" stroke="${C.accent}" stroke-width="4" stroke-dasharray="10 8" marker-end="url(#sw)"/>
    <defs><marker id="sw" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto"><path d="M0 0 L12 6 L0 12 z" fill="${C.accent}"/></marker></defs>
    <text x="600" y="222" text-anchor="middle" font-family="${F}" font-size="19" font-weight="600" fill="${C.ink}">Each trapped particle cuts a shallow scratch as the towel or mitt is dragged across the panel</text>
    <rect x="56" y="418" width="352" height="132" rx="12" fill="${C.badBg}" stroke="${C.bad}" stroke-width="2"/>
    <text x="80" y="456" font-family="${F}" font-size="18" font-weight="700" fill="${C.bad}">Circular motion</text>
    <text x="80" y="486" font-family="${F}" font-size="16" fill="${C.ink2}">Overlapping arcs catch light</text>
    <text x="80" y="510" font-family="${F}" font-size="16" fill="${C.ink2}">from every angle — highly</text>
    <text x="80" y="534" font-family="${F}" font-size="16" fill="${C.ink2}">visible as swirls</text>
    <rect x="424" y="418" width="352" height="132" rx="12" fill="${C.goodBg}" stroke="${C.good}" stroke-width="2"/>
    <text x="448" y="456" font-family="${F}" font-size="18" font-weight="700" fill="${C.good}">Straight lines</text>
    <text x="448" y="486" font-family="${F}" font-size="16" fill="${C.ink2}">Parallel scratches catch</text>
    <text x="448" y="510" font-family="${F}" font-size="16" fill="${C.ink2}">light from one angle only —</text>
    <text x="448" y="534" font-family="${F}" font-size="16" fill="${C.ink2}">far less visible</text>
    <rect x="792" y="418" width="352" height="132" rx="12" fill="${C.brandLight}" stroke="${C.brand}" stroke-width="2"/>
    <text x="816" y="456" font-family="${F}" font-size="18" font-weight="700" fill="${C.brand}">Dark paint</text>
    <text x="816" y="486" font-family="${F}" font-size="16" fill="${C.ink2}">Doesn't swirl more than</text>
    <text x="816" y="510" font-family="${F}" font-size="16" fill="${C.ink2}">light paint. It just shows</text>
    <text x="816" y="534" font-family="${F}" font-size="16" fill="${C.ink2}">what is already there.</text>`;
  diagrams['swirl-marks'] = frame('How swirl marks form', 'Thousands of microscopic scratches, all catching light from a single point source', body);
}

/* ---------- 8. Towel-to-task map ---------- */
{
  const tasks = [
    ['Drying panels', '900–1200', 'Twisted loop', C.brand],
    ['Glass + mirrors', '300–400', 'Waffle / low pile', C.accent],
    ['Interior + trim', '350–500', 'Low pile, edgeless', C.good],
    ['Wax + sealant removal', '500–800', 'Plush', '#7c3aed'],
    ['Wheels + engine bay', 'Any', 'Dedicated, never reused on paint', C.bad],
  ];
  let body = `<text x="56" y="176" font-family="${F}" font-size="13" font-weight="700" fill="${C.ink3}" letter-spacing="1.2">JOB</text>
    <text x="520" y="176" font-family="${F}" font-size="13" font-weight="700" fill="${C.ink3}" letter-spacing="1.2">GSM</text>
    <text x="700" y="176" font-family="${F}" font-size="13" font-weight="700" fill="${C.ink3}" letter-spacing="1.2">WEAVE</text>`;
  tasks.forEach((t, i) => {
    const y = 196 + i * 82;
    body += `<rect x="56" y="${y}" width="1088" height="70" rx="10" fill="${C.card}" stroke="${C.line}" stroke-width="2"/>
      <rect x="56" y="${y}" width="7" height="70" rx="3" fill="${t[3]}"/>
      <text x="88" y="${y + 43}" font-family="${F}" font-size="20" font-weight="600" fill="${C.ink}">${t[0]}</text>
      <text x="520" y="${y + 43}" font-family="${F}" font-size="20" font-weight="700" fill="${t[3]}">${t[1]}</text>
      <text x="700" y="${y + 43}" font-family="${F}" font-size="18" fill="${C.ink2}">${t[2]}</text>`;
  });
  diagrams['towel-task-map'] = frame('One towel per job', 'Matching the towel to the task beats buying a more expensive towel', body);
}

await mkdir(OUT, { recursive: true });
for (const [name, svg] of Object.entries(diagrams)) {
  await sharp(Buffer.from(svg)).webp({ quality: 90 }).toFile(`${OUT}/${name}.webp`);
  console.log(`  ${name}.webp`);
}
console.log(`\n${Object.keys(diagrams).length} diagrams written to ${OUT}`);
