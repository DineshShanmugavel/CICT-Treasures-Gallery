// Machine-translates the museum ahead of time, into static packs that ship with the site:
//   src/i18n/locales/<code>.json  (interface, titles and, with --scope data|all, exhibit texts)
//   src/data/kurals/<code>.json   (with --kurals: each kural's two-line rendering and meaning)
// Only what a pack lacks is translated, so translators' work is never overwritten; a pack can
// be generated first and corrected by hand afterwards (or the other way round).
//
//   node scripts/generateTranslations.mjs --lang fr[,de,ja] [--scope core|data|all] [--kurals]
//   node scripts/generateTranslations.mjs --group world|india|all [...]
//   options: --provider gtx|google|libre (default: google or libre if configured, else gtx)
//            --concurrency <n>         languages translated at once (gtx: 3)
//            --dry-run                 count what would be sent, send nothing
//            --limit <n>               at most n strings per language (to try a provider out)
//            --repair-tamil            retranslate entries whose Tamil words came back changed
//
// Tamil written inside English texts is shielded from translation and must come back exactly
// (see shieldTamil); a translation that alters it is not saved.
//
// Providers:
//   gtx    — no setup: Google Translate's free, keyless web endpoint (unofficial; rate limited,
//            so requests are retried with backoff). Languages it lacks are skipped and listed.
// Configured in the environment (never in the source, never as VITE_ variables):
//   google — GOOGLE_TRANSLATE_KEY: a Google Cloud Translation (v2) API key.
//   libre  — LIBRETRANSLATE_URL: a LibreTranslate /translate endpoint (self-hosted, or a
//            hosted one), and LIBRETRANSLATE_KEY if it needs one.
//
// Machine translation is a starting point: names of works, poets and places, and the kurals
// above all, deserve a reader of the language before a pack is relied on.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { keyOf, loadPack, savePack, stringsFor } from './i18n-build.mjs';

const args = process.argv.slice(2);
const option = (name, fallback) => (args.includes(`--${name}`) ? args[args.indexOf(`--${name}`) + 1] : fallback);
const flag = (name) => args.includes(`--${name}`);

const LANGUAGES = JSON.parse(readFileSync('src/i18n/languages.json', 'utf8'));
const BY_CODE = new Map(LANGUAGES.map((language) => [language.code, language]));

function targets() {
  const group = option('group');
  const codes = option('lang')?.split(',').map((code) => code.trim()).filter(Boolean);
  const list = codes ?? LANGUAGES.filter((language) => language.group !== 'primary' && (group === 'all' || language.group === group)).map(({ code }) => code);
  if (!codes && !group) throw new Error('Name the languages: --lang <code[,code…]> or --group world|india|all');
  for (const code of list) {
    if (!BY_CODE.has(code)) throw new Error(`No language "${code}" in src/i18n/languages.json`);
    if (code === 'en' || code === 'ta') throw new Error(`"${code}" is the museum's own language, not translated`);
  }
  return list.filter((code) => {
    if (BY_CODE.get(code).mt !== null) return true;
    console.log(`${code}: skipped — marked "mt": null in the registry (not to be machine translated)`);
    return false;
  });
}

/* ---------- Providers ---------- */

function provider() {
  const name = option('provider') ?? (process.env.GOOGLE_TRANSLATE_KEY ? 'google' : process.env.LIBRETRANSLATE_URL ? 'libre' : null);
  if (name === 'google') {
    const key = process.env.GOOGLE_TRANSLATE_KEY;
    if (!key) throw new Error('Set GOOGLE_TRANSLATE_KEY for --provider google');
    return {
      name,
      supportsHtml: true,
      async translate(texts, target, probing = false, html = false) {
        const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(key)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ q: texts, source: 'en', target, format: html ? 'html' : 'text' }),
        });
        if (!response.ok) throw new Error(`Google Translation ${response.status}: ${(await response.text()).slice(0, 300)}`);
        return (await response.json()).data.translations.map(({ translatedText }) => translatedText);
      },
    };
  }
  if (name === 'libre') {
    const url = process.env.LIBRETRANSLATE_URL;
    if (!url) throw new Error('Set LIBRETRANSLATE_URL for --provider libre');
    // LibreTranslate names a few languages its own way; the first code the server offers wins.
    const ALIASES = { 'zh-CN': ['zh-Hans', 'zh'], 'zh-TW': ['zh-Hant', 'zt'], no: ['nb', 'no'], he: ['he', 'iw'], tl: ['tl', 'fil'] };
    let offered = null;
    return {
      name,
      /** The server's code for `target`, or null when it has no English→target model. */
      async resolve(target) {
        if (!offered) {
          const response = await fetch(url.replace(/\/translate\/?$/, '/languages'));
          if (!response.ok) throw new Error(`LibreTranslate /languages ${response.status}`);
          const english = (await response.json()).find((language) => language.code === 'en');
          offered = new Set(english?.targets ?? []);
        }
        return (ALIASES[target] ?? [target]).find((code) => offered.has(code)) ?? null;
      },
      async translate(texts, target) {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ q: texts, source: 'en', target: (await this.resolve(target)) ?? target, format: 'text', ...(process.env.LIBRETRANSLATE_KEY ? { api_key: process.env.LIBRETRANSLATE_KEY } : {}) }),
        });
        if (!response.ok) throw new Error(`LibreTranslate ${response.status}: ${(await response.text()).slice(0, 300)}`);
        const { translatedText } = await response.json();
        return Array.isArray(translatedText) ? translatedText : [translatedText];
      },
    };
  }
  if (name === 'gtx' || name === null) return gtxProvider();
  throw new Error(`Unknown provider "${name}": google, libre or gtx`);
}

/**
 * Google Translate's free web endpoint, the one its browser extension uses: no key, no account.
 * It takes many strings per POST (form fields q=…&q=…) and answers with an array in order.
 * Unofficial: Google may limit or change it, so every request is retried with backoff.
 */
export const GTX_URL = 'https://translate.googleapis.com/translate_a/t';
function gtxProvider() {
  const probed = new Map();
  return {
    name: 'gtx',
    batch: { strings: 120, characters: 15000 },
    concurrency: 3,
    /** `target`, or null when Google has no English→target (it then echoes the English back). */
    async resolve(target) {
      if (!probed.has(target)) {
        const probe = 'Welcome to the museum of Tamil heritage';
        const result = await withRetry(() => this.translate([probe], target, true)).catch(() => null);
        probed.set(target, result && result[0] && result[0] !== probe ? target : null);
      }
      return probed.get(target);
    },
    supportsHtml: true,
    async translate(texts, target, probing = false, html = false) {
      const response = await fetch(`${GTX_URL}?client=gtx&sl=en&tl=${encodeURIComponent(target)}&format=${html ? 'html' : 'text'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: texts.map((text) => `q=${encodeURIComponent(text)}`).join('&'),
      });
      if (response.status === 400 && probing) return null; // language not offered
      if (!response.ok) throw Object.assign(new Error(`Google gtx ${response.status}`), { status: response.status });
      const data = await response.json();
      // One string comes back as ["…"]; several as ["…", "…"] (older answers: [["…","en"], …]).
      return data.map((item) => (Array.isArray(item) ? item[0] : item));
    },
  };
}

/** Retries rate limits (429), server errors and dropped connections: 5s, 15s, 45s, 2m, 5m. */
async function withRetry(call) {
  const waits = [5, 15, 45, 120, 300];
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await call();
    } catch (error) {
      const retriable = !error.status || error.status === 429 || error.status >= 500;
      if (!retriable || attempt >= waits.length) throw error;
      await new Promise((resolve) => setTimeout(resolve, waits[attempt] * 1000));
    }
  }
}

/** Batches within the provider's limits (default: 50 strings and 4500 characters). */
function batches(texts, { strings: maxStrings = 50, characters: maxCharacters = 4500 } = {}) {
  const out = [];
  let batch = [];
  let size = 0;
  for (const text of texts) {
    if (batch.length && (batch.length >= maxStrings || size + text.length > maxCharacters)) {
      out.push(batch);
      batch = [];
      size = 0;
    }
    batch.push(text);
    size += text.length;
  }
  if (batch.length) out.push(batch);
  return out;
}

const placeholders = (text) => (text.match(/\{\d\}/g) ?? []).sort().join();

/*
 * Tamil inside an English text ("the முதுமக்கள் தாழி", "கலம்செய் கோவே") is the museum's own
 * words and must reach every language exactly as written. Such strings are sent as HTML with
 * each Tamil run in <span translate="no">, which the service leaves alone; and any translation
 * whose Tamil does not come back character for character is dropped (it stays in English).
 */
const TAMIL_RUN = /[஀-௿]+(?:[\s,]*[஀-௿]+)*/g;
export const tamilRuns = (text) => text.match(TAMIL_RUN) ?? [];
/** Whether a translation keeps every Tamil run of its English exactly. */
export const keepsTamil = (english, text) => tamilRuns(english).every((run) => text.includes(run));
const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const unescapeHtml = (text) => text.replace(/&quot;/g, '"').replace(/&#0?39;/g, '\'').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const shieldTamil = (text) => escapeHtml(text).replace(TAMIL_RUN, (run) => `<span translate="no">${run}</span>`);
function unshieldTamil(english, html) {
  let text = unescapeHtml(html.replace(/<span translate="no">([\s\S]*?)<\/span>/g, '$1').replace(/<\/?span[^>]*>/g, ''));
  // The service may add a space after a protected run ("கோவே ,"): close it up where the English had none.
  for (const run of tamilRuns(english)) {
    const next = english[english.indexOf(run) + run.length];
    if (next && /[^\s\p{L}\p{N}]/u.test(next)) text = text.split(`${run} `).join(run);
  }
  return text;
}

/** Translates one batch, shielding the Tamil in strings that have any. */
async function translateBatch(service, batch, target) {
  const tamil = service.supportsHtml ? batch.map((text) => tamilRuns(text).length > 0) : batch.map(() => false);
  const plain = batch.filter((_, i) => !tamil[i]);
  const shielded = batch.filter((_, i) => tamil[i]);
  const plainOut = plain.length ? await withRetry(() => service.translate(plain, target)) : [];
  const shieldedOut = shielded.length ? await withRetry(() => service.translate(shielded.map(shieldTamil), target, false, true)) : [];
  if (plainOut.length !== plain.length || shieldedOut.length !== shielded.length) return [];
  let p = 0;
  let s = 0;
  return batch.map((english, i) => (tamil[i] ? unshieldTamil(english, shieldedOut[s++] ?? '') : plainOut[p++]));
}

/**
 * Translates `texts` into `code`, calling `save(entries)` after every batch so an interrupted
 * run keeps what it has. Strings whose {n} placeholders come back changed, or whose Tamil does
 * not come back exactly, are left out.
 */
async function translateAll(service, code, texts, save) {
  const target = BY_CODE.get(code).mt ?? code;
  let done = 0;
  let dropped = 0;
  for (const batch of batches(texts, service.batch)) {
    const translated = await translateBatch(service, batch, target);
    if (translated.length !== batch.length) throw new Error(`${code}: sent ${batch.length} strings, got ${translated.length} back`);
    const entries = {};
    batch.forEach((english, i) => {
      const text = translated[i]?.trim();
      if (!text || placeholders(text) !== placeholders(english) || !keepsTamil(english, text)) {
        dropped += 1;
        return;
      }
      entries[english] = text;
    });
    save(entries);
    done += batch.length;
    if (!parallel) process.stdout.write(`\r${code}: ${done}/${texts.length}`);
  }
  if (!parallel) process.stdout.write('\n');
  if (dropped) console.log(`${code}: ${dropped} left in English (empty, or placeholders changed)`);
}

/* ---------- Kurals ---------- */

const KURAL_DIR = 'src/data/kurals';
const kuralFile = (code) => `${KURAL_DIR}/${code}.json`;

function kuralTexts(code) {
  const translations = existsSync(kuralFile(code)) ? JSON.parse(readFileSync(kuralFile(code), 'utf8')) : {};
  const source = JSON.parse(readFileSync('src/data/thirukkural.json', 'utf8'));
  const kurals = Array.isArray(source) ? source : source.kurals;
  const missing = kurals.filter((kural) => !translations[kural.number] && kural.translation && kural.explanation);
  return { translations, missing };
}

function saveKurals(code, translations) {
  mkdirSync(KURAL_DIR, { recursive: true });
  const sorted = Object.fromEntries(Object.entries(translations).sort(([a], [b]) => Number(a) - Number(b)));
  writeFileSync(kuralFile(code), `${JSON.stringify(sorted, null, 1)}\n`);
}

/* ---------- Run ---------- */

const scope = option('scope', 'core');
const limit = Number(option('limit', Infinity));
const dryRun = flag('dry-run');
const codes = targets();
const service = dryRun ? null : provider();
const strings = await stringsFor(scope);

const failed = [];
const unsupported = [];
const parallel = Math.max(1, Number(option('concurrency', service?.concurrency ?? 1))) > 1;
const queue = [...codes];
async function worker() {
  for (let code = queue.shift(); code; code = queue.shift()) {
    if (service?.resolve && !(await service.resolve(BY_CODE.get(code).mt ?? code))) {
      console.log(`${code}: skipped — ${service.name} offers no English→${code} translation`);
      unsupported.push(code);
      continue;
    }
    try {
      await generate(code);
      if (!dryRun) console.log(`${code}: done`);
    } catch (error) {
      // Keep going: what this language already saved stays, and a rerun picks up where it stopped.
      console.log(`\n${code}: FAILED — ${error.message}`);
      failed.push(code);
    }
  }
}
await Promise.all(Array.from({ length: Math.max(1, Number(option('concurrency', service?.concurrency ?? 1))) }, worker));
if (unsupported.length) console.log(`\nNot offered by the server (${unsupported.length}): ${unsupported.join(' ')}`);
if (failed.length) {
  console.log(`Failed (${failed.length}), rerun to retry: ${failed.join(',')}`);
  process.exitCode = 1;
}

async function generate(code) {
  const pack = loadPack(code);
  if (flag('repair-tamil')) {
    // Translations made before the Tamil shield, whose Tamil words were changed: translate again.
    let repaired = 0;
    for (const [english, text] of pack) {
      if (text !== english && !keepsTamil(english, text)) {
        pack.delete(english);
        repaired += 1;
      }
    }
    if (repaired) console.log(`${code}: ${repaired} translations had altered Tamil — retranslating`);
    if (repaired && !dryRun) savePack(code, pack);
  }
  const missing = strings.filter((english) => !pack.has(english)).slice(0, limit);
  const kurals = flag('kurals') ? kuralTexts(code) : null;
  const kuralCount = kurals ? Math.min(kurals.missing.length, limit) : 0;
  const characters = missing.join('').length;
  console.log(`${code}: ${missing.length} ${scope} strings (${characters} characters)${kurals ? `, ${kuralCount} kurals` : ''}${dryRun ? ' — dry run' : ` → ${service.name}`}`);
  if (dryRun) return;

  if (missing.length) {
    await translateAll(service, code, missing, (entries) => {
      for (const [english, text] of Object.entries(entries)) pack.set(keyOf(english), text);
      savePack(code, pack);
    });
  }

  if (kurals && kuralCount) {
    // Each kural's rendering is two half-lines joined by "; " in English: translated apart, then
    // set on two lines like the other languages' kurals.
    const chosen = kurals.missing.slice(0, kuralCount);
    const lines = chosen.flatMap((kural) => kural.translation.split(/;\s*/).filter(Boolean));
    const texts = [...new Set([...lines, ...chosen.map((kural) => kural.explanation)])];
    const done = new Map();
    await translateAll(service, code, texts, (entries) => Object.entries(entries).forEach(([english, text]) => done.set(english, text)));
    for (const kural of chosen) {
      const halves = kural.translation.split(/;\s*/).filter(Boolean).map((line) => done.get(line));
      const meaning = done.get(kural.explanation);
      if (halves.every(Boolean) && meaning) kurals.translations[kural.number] = { translation: halves.join('\n'), meaning };
    }
    saveKurals(code, kurals.translations);
    console.log(`${code}: ${Object.keys(kurals.translations).length} kurals in ${kuralFile(code)}`);
  }
}
