// Maintains the language packs, src/i18n/locales/<code>.json: flat dictionaries keyed by the
// English text they translate (see src/i18n/index.js). Keys may hold {0}, {1} placeholders.
//
//   node scripts/i18n-build.mjs missing <out.txt> --lang <code> [--scope core|data|all]
//        lists the English strings the pack lacks, one per line as "<n>\t<english>":
//          core — the interface (every T/L/tri call in src) and the short titles on name
//                 boards, plaques, the Monolith, halls, rooms, shelves, map and tour;
//          data — the exhibit texts of src/data (descriptions, notes, panels);
//          all  — both (the default).
//   node scripts/i18n-build.mjs merge <list.txt> <translated.txt> --lang <code>
//        adds the lines "<n>\t<translation>" (numbered as in <list.txt>); "=" keeps the English,
//        "=hi" copies the Hindi pack's entry (for names in Devanagari).
//   node scripts/i18n-build.mjs stats            how complete every pack is.
//
// Kural translations are kept apart, in src/data/kurals/<code>.json (scripts/kural-translations.mjs).
// Packs can also be machine-translated ahead of time: scripts/generateTranslations.mjs, which
// imports this file's string collection.
import { createServer } from 'vite';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const keyOf = (text) => text.replace(/\s+/g, ' ').trim();
export const packFile = (lang) => `src/i18n/locales/${lang}.json`;
const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : fallback;
};
const positional = args.filter((arg, i) => !arg.startsWith('--') && !args[i - 1]?.startsWith('--'));

/* ---------- The interface: literal strings passed to the i18n helpers ---------- */

function sourceFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === 'locales' ? [] : sourceFiles(path);
    return /\.(jsx?|tsx?)$/.test(entry.name) ? [path] : [];
  });
}

/** The first argument of T(…), L(…), tri(…), say(…), translate(…) when it is a literal. */
function interfaceStrings() {
  const found = new Set();
  const call = /\b(?:T|L|tri|say|translate)\(\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"|`((?:[^`\\]|\\.)*)`)/g;
  // Object fields written for translation in the interface files (sections, tutorial steps, …).
  const field = /\b(?:title|description|action|body|en|label|status|idle|playing|missing|play|pause|unavailable):\s*'((?:[^'\\]|\\.)*)'/g;
  const fieldFiles = /(main\.jsx|Tutorial\.jsx|LoadingScreen\.jsx)$/;
  for (const file of sourceFiles('src')) {
    const text = readFileSync(file, 'utf8');
    for (const match of text.matchAll(call)) {
      let value = match[1] ?? match[2] ?? match[3];
      if (match[3] !== undefined) {
        let n = 0;
        value = value.replace(/\$\{[^}]*\}/g, () => `{${n++}}`);
      }
      value = value.replace(/\\(['"`\\])/g, '$1');
      if (/[A-Za-z]{2}/.test(value)) found.add(keyOf(value));
    }
    if (fieldFiles.test(file)) {
      for (const match of text.matchAll(field)) {
        const value = match[1].replace(/\\(['"\\])/g, '$1');
        if (/[A-Za-z]{2}/.test(value) && !/[\u0B80-\u0BFF\u0900-\u097F]/.test(value)) found.add(keyOf(value));
      }
    }
  }
  return found;
}

/* ---------- The data modules ---------- */

const SKIP_KEYS = /^(id|key|url|src|href|folder|file|accent|color|colour|glyph|icon|model|audio|pdf|pdfUrl|image|images|cover|path|slug|kind|work|layout|immersive|feature|shelf|tamil|ta|taText|tamilNote|tamilDescription|headingTa|titleTa|roleTa|sideTa|nameTa|tamilTitle|tamilLine1|tamilLine2|lat|lng|coords|hi|number|year)$/i;
const TAMIL = /[\u0B80-\u0BFF]/g;
const isEnglish = (s) =>
  /[A-Za-z]{2}/.test(s) &&
  (s.match(TAMIL)?.length ?? 0) < s.length / 3 &&
  !/^(\/|https?:|data:|#[0-9a-f]{3,8}$|[\w .-]+\.(jpe?g|png|webp|glb|mp3|mpeg|pdf|json)$)/i.test(s) &&
  !/^[a-z0-9-]+$/.test(s) &&
  !/^[a-z]+[A-Z][A-Za-z]*$/.test(s) &&
  !/^(IMG_|[A-Za-z_.`]+ ?\d{3}|NAN - |Uni \(|TR \d)/.test(s); // palm-leaf photograph labels

async function withModules(use) {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
  try {
    return await use((path) => server.ssrLoadModule(path));
  } finally {
    await server.close();
  }
}

/** Every English display string of src/data (the exhibit texts). */
async function dataStrings() {
  return withModules(async (load) => {
    const found = new Set();
    const seen = new WeakSet();
    const walk = (value, key) => {
      if (typeof value === 'string') {
        if (!SKIP_KEYS.test(key ?? '') && isEnglish(value)) found.add(keyOf(value));
        return;
      }
      if (!value || typeof value !== 'object' || seen.has(value)) return;
      seen.add(value);
      if (Array.isArray(value)) value.forEach((item) => walk(item, key));
      else for (const [k, item] of Object.entries(value)) walk(item, k);
    };
    for (const file of readdirSync('src/data').filter((name) => name.endsWith('.js')).sort()) {
      if (/^(thirukkural|kuralData|kuralAudio)\b/.test(file)) continue;
      const mod = await load(`/src/data/${file}`);
      for (const [name, value] of Object.entries(mod)) walk(value, name);
    }
    return found;
  });
}

/** The short data texts seen at a glance: hall, room and shelf names, name boards, the Monolith, map and kural headings. */
async function titleStrings() {
  return withModules(async (load) => {
    const found = new Set();
    const add = (value) => typeof value === 'string' && isEnglish(value) && found.add(keyOf(value));
    const { MONUMENT } = await load('/src/data/centralHall.js');
    const walkMonument = (value, key) => {
      if (typeof value === 'string') return !SKIP_KEYS.test(key ?? '') && add(value);
      if (value && typeof value === 'object') for (const [k, item] of Object.entries(value)) walkMonument(item, Array.isArray(value) ? key : k);
    };
    walkMonument(MONUMENT);
    const { HALL_EXHIBITS } = await load('/src/data/hallExhibits.js');
    Object.values(HALL_EXHIBITS).forEach((exhibit) => { add(exhibit.title); add(exhibit.detail); });
    const { hallways, roomBooks } = await load('/src/data/roomBooks.js');
    for (const hall of Object.values(hallways)) {
      add(hall.title); add(hall.subtitle); add(hall.spec?.title); add(hall.spec?.subtitle);
      (hall.wings ?? []).forEach((wing) => add(wing.title));
    }
    for (const room of Object.values(roomBooks)) {
      add(room.title);
      add(room.shelf?.title); add(room.shelf?.unit);
      (room.cabinets ?? []).forEach((cabinet) => add(cabinet.title));
      (room.galleries ?? []).forEach((gallery) => { add(gallery.title); if (gallery.layout === 'photobook') add(gallery.detail); });
      (room.olaiShelves ?? []).forEach((shelf) => add(shelf.title));
    }
    const tamilakam = await load('/src/data/tamilakam.js');
    tamilakam.CATEGORIES.forEach((category) => add(category.en));
    tamilakam.TAMILAKAM_PLACES.forEach((place) => { add(place.en); (place.candidates ?? []).forEach((site) => add(site.en)); });
    add(tamilakam.TAMILAKAM_NOTE.en); add(tamilakam.BASEMAP_NOTE.en);
    const thenNow = await load('/src/data/thenAndNow.js');
    thenNow.THEN_NOW_PLACES.forEach((place) => add(place.en));
    Object.values(thenNow.SECTION_TITLES).forEach((title) => add(title.en));
    Object.values(thenNow.KIND_LABELS).forEach((label) => add(label.en));
    const { kuralSections } = await load('/src/data/kuralStructure.js');
    kuralSections.forEach((section) => { add(section.english); section.groups.forEach((group) => add(group.english)); });
    const ainthinai = await load('/src/data/ainthinaiRoom.js');
    ainthinai.CHART_ROWS.forEach(([english]) => add(english));
    ainthinai.LANDSCAPES.forEach((landscape) => {
      add(landscape.key);
      for (const value of Object.values(landscape)) if (Array.isArray(value) && typeof value[0] === 'string') add(value[0]);
    });
    return found;
  });
}

export const loadPack = (lang) => {
  const file = packFile(lang);
  const entries = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};
  return new Map(Object.entries(entries).map(([en, text]) => [keyOf(en), text]));
};

export function savePack(lang, map) {
  const sorted = Object.fromEntries([...map].sort(([a], [b]) => a.localeCompare(b, 'en')));
  writeFileSync(packFile(lang), `${JSON.stringify(sorted, null, 1)}\n`);
}

export async function stringsFor(scope) {
  const all = new Set();
  if (scope === 'core' || scope === 'all') {
    interfaceStrings().forEach((s) => all.add(s));
    (await titleStrings()).forEach((s) => all.add(s));
  }
  if (scope === 'data' || scope === 'all') (await dataStrings()).forEach((s) => all.add(s));
  return [...all];
}

const readNumbered = (file) =>
  new Map(
    readFileSync(file, 'utf8')
      .split(/\r?\n/)
      .filter((line) => /^\d+\t/.test(line))
      .map((line) => {
        const tab = line.indexOf('\t');
        return [Number(line.slice(0, tab)), line.slice(tab + 1).replace(/⏎/g, '\n').trim()];
      }),
  );

const isMain = resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url);
const [mode] = isMain ? positional : [];
if (!isMain) {
  // Imported for its string collection (scripts/generateTranslations.mjs).
} else if (mode === 'missing') {
  const lang = option('lang', 'hi');
  const scope = option('scope', 'all');
  const pack = loadPack(lang);
  const missing = (await stringsFor(scope)).filter((en) => !pack.has(en));
  writeFileSync(positional[1], missing.map((en, i) => `${i + 1}\t${en.replace(/\n/g, '⏎')}`).join('\n') + '\n');
  console.log(`${lang}: ${missing.length} ${scope} strings without a translation (${missing.join('').length} characters) → ${positional[1]}`);
} else if (mode === 'merge') {
  const lang = option('lang');
  if (!lang) throw new Error('merge needs --lang <code>');
  const english = readNumbered(positional[1]);
  const translated = readNumbered(positional[2]);
  const pack = loadPack(lang);
  const hindi = loadPack('hi');
  let added = 0;
  for (const [n, text] of translated) {
    const en = english.get(n);
    if (!en) throw new Error(`line ${n} of ${positional[2]} has no English in ${positional[1]}`);
    if (!text) continue;
    // "=" keeps the English; "=hi" takes the Hindi pack's spelling (names in Devanagari).
    if (text === '=hi' && !hindi.has(keyOf(en))) throw new Error(`line ${n}: no Hindi for “${en}”`);
    pack.set(keyOf(en), text === '=' ? keyOf(en) : text === '=hi' ? hindi.get(keyOf(en)) : text);
    added += 1;
  }
  savePack(lang, pack);
  console.log(`${lang}: merged ${added}; the pack now has ${pack.size}`);
} else if (mode === 'stats') {
  const core = await stringsFor('core');
  const data = await stringsFor('data');
  const LANGUAGES = JSON.parse(readFileSync('src/i18n/languages.json', 'utf8'));
  let without = 0;
  for (const { code, name, group } of LANGUAGES.filter(({ code }) => code !== 'en' && code !== 'ta')) {
    if (group === 'world' && !existsSync(packFile(code))) {
      without += 1;
      continue;
    }
    const pack = loadPack(code);
    const count = (list) => list.filter((s) => pack.has(s)).length;
    console.log(`${code.padEnd(6)}${name.slice(0, 20).padEnd(21)} interface+titles ${count(core)}/${core.length}   exhibit texts ${count(data)}/${data.length}`);
  }
  console.log(`…and ${without} world languages with no pack yet (translated live in the browser, keyless, and cached).`);
} else if (isMain) {
  console.log('usage: node scripts/i18n-build.mjs missing <out.txt> --lang <code> [--scope core|data|all] | merge <list.txt> <translated.txt> --lang <code> | stats');
}
