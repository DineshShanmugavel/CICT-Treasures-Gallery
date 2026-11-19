// Maintains the kurals' translations, src/data/kurals/<code>.json (one file per language):
//   { "<number>": { "translation": "<two-line rendering>", "meaning": "<meaning>" } }
// A file is loaded only when the museum is in its language (loadKuralTranslation in
// src/data/kuralData.js); kurals without an entry show their English.
//
//   node scripts/kural-translations.mjs sheet <out.txt> --lang <code>
//        writes the kurals not yet in that language, "<number> | <Tamil> | <English meaning>",
//        for a translator to work from;
//   node scripts/kural-translations.mjs merge <file.txt> --lang <code>
//        adds the translator's lines "<number>\t<line 1> / <line 2>\t<meaning>";
//   node scripts/kural-translations.mjs stats
//        how many kurals each language has.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const option = (name) => (args.includes(`--${name}`) ? args[args.indexOf(`--${name}`) + 1] : undefined);
const positional = args.filter((arg, i) => !arg.startsWith('--') && !args[i - 1]?.startsWith('--'));
const DIR = 'src/data/kurals';
const fileFor = (lang) => `${DIR}/${lang}.json`;
const load = (lang) => (existsSync(fileFor(lang)) ? JSON.parse(readFileSync(fileFor(lang), 'utf8')) : {});
const save = (lang, data) => {
  mkdirSync(DIR, { recursive: true });
  const sorted = Object.fromEntries(Object.entries(data).sort(([a], [b]) => Number(a) - Number(b)));
  writeFileSync(fileFor(lang), `${JSON.stringify(sorted, null, 1)}\n`);
};

const [mode, file] = positional;
const lang = option('lang');
if (mode === 'merge') {
  if (!lang) throw new Error('merge needs --lang <code>');
  const data = load(lang);
  let added = 0;
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^(\d+)\t([^\t]+)\t([^\t]+)$/);
    if (!match) {
      if (line.trim()) throw new Error(`Malformed line: ${line.slice(0, 80)}`);
      continue;
    }
    const [, number, translation, meaning] = match;
    if (Number(number) < 1 || Number(number) > 1330) throw new Error(`No kural ${number}`);
    data[number] = { translation: translation.split(/\s+\/\s+/).map((part) => part.trim()).join('\n'), meaning: meaning.trim() };
    added += 1;
  }
  save(lang, data);
  console.log(`${lang}: merged ${added}; ${Object.keys(data).length} of 1330 kurals translated`);
} else if (mode === 'sheet') {
  if (!lang) throw new Error('sheet needs --lang <code>');
  const done = load(lang);
  const { kurals } = JSON.parse(readFileSync('src/data/thirukkural.json', 'utf8'));
  const lines = kurals.filter((k) => !done[k.number]).map((k) => `${k.number} | ${k.tamilLine1} ${k.tamilLine2} | ${k.explanation.replace(/\s+/g, ' ')}`);
  writeFileSync(file, `${lines.join('\n')}\n`);
  console.log(`${lang}: ${lines.length} kurals to translate → ${file}`);
} else if (mode === 'stats') {
  const LANGUAGES = JSON.parse(readFileSync('src/i18n/languages.json', 'utf8'));
  const present = new Set(existsSync(DIR) ? readdirSync(DIR).map((name) => name.replace(/\.json$/, '')) : []);
  // The Indian languages always; the world's only once they have kurals.
  for (const { code, name, group } of LANGUAGES.filter(({ code, group }) => code !== 'en' && code !== 'ta' && (group !== 'world' || present.has(code)))) {
    console.log(`${code.padEnd(6)}${name.slice(0, 20).padEnd(21)} ${present.has(code) ? Object.keys(load(code)).length : 0}/1330`);
  }
} else {
  console.log('usage: node scripts/kural-translations.mjs sheet <out.txt> --lang <code> | merge <file.txt> --lang <code> | stats');
}
