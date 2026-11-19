/**
 * Where the museum's translations come from, for every language but English and Tamil, in the
 * order they are trusted:
 *
 *   1. The static pack, ./locales/<code>.json — written by translators, or generated ahead of
 *      time by scripts/generateTranslations.mjs. Each pack is its own chunk, fetched only when
 *      its language is chosen, so 140 languages cost the first load nothing.
 *   2. The visitor's cache (IndexedDB, or localStorage where IndexedDB is unavailable): the
 *      runtime translations this browser has already received.
 *   3. Runtime machine translation. By default the keyless Google endpoint of
 *      ./liveTranslator.js — nothing to configure. A build can use its own service instead
 *      (VITE_TRANSLATE_URL, a LibreTranslate-compatible endpoint: POST { q: [...], source,
 *      target, format } → { translatedText: [...] }), or none (VITE_TRANSLATE_URL=off).
 *      Only the strings actually shown are asked for — the interface, the Monolith, map
 *      labels, plaques, the kural on the open leaf — in small batches; each answer is cached
 *      (2) and painted as it arrives.
 *
 * Anything not found in any of them shows in English, as do languages marked "mt": null in
 * the registry (no service writes them as the museum does, or none offers them).
 *
 * VITE_ variables are compiled into the public bundle, so VITE_TRANSLATE_KEY must only ever be
 * a key meant to be public (a rate-limited key for the museum's own LibreTranslate, or a proxy
 * of the museum's that adds the real key on the server). Never put a Google or DeepL key here.
 */
import { languageOf } from './languages.js';
import { LIVE_BATCH, translateLive } from './liveTranslator.js';

const PACKS = import.meta.glob('./locales/*.json', { import: 'default' });
const CONFIGURED = (import.meta.env?.VITE_TRANSLATE_URL ?? '').trim();
const OFF = /^(off|none|false|0)$/i.test(CONFIGURED);
/** The build's own service, or '' for the keyless default (./liveTranslator.js). */
const ENDPOINT = OFF ? '' : CONFIGURED;
const PUBLIC_KEY = (import.meta.env?.VITE_TRANSLATE_KEY ?? '').trim();

/** Whether runtime translation is on for this build (it is, unless switched off). */
export const runtimeTranslation = !OFF;
/** Whether a language has a static pack. */
export const hasPack = (code) => Boolean(PACKS[`./locales/${code}.json`]);

/** The service's code for a language, or null when it must not be machine translated. */
const serviceCode = (code) => {
  const { mt } = languageOf(code);
  return mt === null ? null : mt ?? code;
};

let deliver = () => {};
/** `onEntries(code, entries)` receives every batch of translations, from any source. */
export function connect(onEntries) {
  deliver = onEntries;
}

/* ---------- The visitor's cache ---------- */

const DB_NAME = 'cict-museum-i18n';
const STORE = 'translations';
const LOCAL_PREFIX = 'cict-museum-i18n:';
/** The cache belongs to one service: a different endpoint starts afresh. */
const CACHE_TAG = ENDPOINT || 'gtx';

let dbPromise = null;
function openDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve) => {
    try {
      if (typeof indexedDB === 'undefined') return resolve(null);
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => request.result.createObjectStore(STORE);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
      request.onblocked = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
  return dbPromise;
}

async function readCache(code) {
  const db = await openDb();
  try {
    if (db) {
      const record = await new Promise((resolve) => {
        const request = db.transaction(STORE).objectStore(STORE).get(code);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(undefined);
      });
      return record?.tag === CACHE_TAG ? record.entries : {};
    }
    const record = JSON.parse(window.localStorage.getItem(LOCAL_PREFIX + code) ?? 'null');
    return record?.tag === CACHE_TAG ? record.entries : {};
  } catch {
    return {};
  }
}

/** The runtime translations of each language this session, written back after each batch. */
const cached = new Map();
const pendingWrites = new Set();
let writeTimer = null;
function writeCache(code, entries) {
  cached.set(code, { ...(cached.get(code) ?? {}), ...entries });
  pendingWrites.add(code);
  clearTimeout(writeTimer);
  writeTimer = setTimeout(async () => {
    const db = await openDb();
    for (const lang of pendingWrites) {
      const record = { tag: CACHE_TAG, entries: cached.get(lang) };
      try {
        if (db) db.transaction(STORE, 'readwrite').objectStore(STORE).put(record, lang);
        else window.localStorage.setItem(LOCAL_PREFIX + lang, JSON.stringify(record));
      } catch {
        // Storage full or blocked: the translations still show this session.
      }
    }
    pendingWrites.clear();
  }, 800);
}

/* ---------- Loading a language ---------- */

const loading = new Map();
const ready = new Set();

/** Fetches a language's pack and cache (once), delivering them; resolves when both are in. */
export function loadLanguage(code) {
  if (code === 'en' || code === 'ta') return Promise.resolve();
  if (loading.has(code)) return loading.get(code);
  const load = PACKS[`./locales/${code}.json`];
  const pack = load ? load().catch(() => null) : Promise.resolve({});
  const cache = runtimeTranslation ? readCache(code) : Promise.resolve({});
  const request = Promise.all([pack, cache]).then(([packEntries, cacheEntries]) => {
    if (packEntries === null) {
      loading.delete(code); // offline: try again on the next switch
      return;
    }
    cached.set(code, { ...cacheEntries, ...(cached.get(code) ?? {}) });
    ready.add(code);
    // The pack is written by people (or checked by them): it wins over the cache.
    deliver(code, { ...cacheEntries, ...packEntries });
  });
  loading.set(code, request);
  return request;
}

/* ---------- Runtime translation ---------- */

const BATCH_STRINGS = ENDPOINT ? 40 : LIVE_BATCH.strings;
const BATCH_CHARACTERS = ENDPOINT ? 4000 : LIVE_BATCH.characters;
const MAX_IN_FLIGHT = 2;
const MAX_FAILURES = 3;

const queues = new Map(); // code → Set of English strings waiting
const asked = new Map(); // code → Set of English strings asked for (or waiting) this session
const failures = new Map(); // code → consecutive failed requests
let inFlight = 0;
let flushTimer = null;

/**
 * Asks the service for a string missing from a language (when one is configured): queued,
 * batched and delivered later. Safe to call while rendering; each string is asked for once.
 */
export function requestTranslation(code, english) {
  if (!runtimeTranslation || code === 'en' || code === 'ta' || !ready.has(code)) return;
  if (!serviceCode(code) || (failures.get(code) ?? 0) >= MAX_FAILURES) return;
  if (!english || english.length > 5000 || !/[A-Za-z]{2}/.test(english)) return;
  const seen = asked.get(code) ?? asked.set(code, new Set()).get(code);
  if (seen.has(english)) return;
  seen.add(english);
  (queues.get(code) ?? queues.set(code, new Set()).get(code)).add(english);
  if (!flushTimer) flushTimer = setTimeout(flush, 250);
}

function nextBatch() {
  for (const [code, queue] of queues) {
    if (!queue.size) continue;
    const batch = [];
    let characters = 0;
    for (const text of queue) {
      if (batch.length && (batch.length >= BATCH_STRINGS || characters + text.length > BATCH_CHARACTERS)) break;
      batch.push(text);
      characters += text.length;
    }
    batch.forEach((text) => queue.delete(text));
    return { code, batch };
  }
  return null;
}

function flush() {
  flushTimer = null;
  while (inFlight < MAX_IN_FLIGHT) {
    const next = nextBatch();
    if (!next) return;
    inFlight += 1;
    translateBatch(next.code, next.batch)
      .then((entries) => {
        failures.set(next.code, 0);
        if (Object.keys(entries).length) {
          writeCache(next.code, entries);
          deliver(next.code, entries);
        }
      })
      .catch((error) => {
        if (import.meta.env?.DEV) console.warn(`Runtime translation (${next.code}) failed:`, error);
        failures.set(next.code, (failures.get(next.code) ?? 0) + 1);
        // Let the strings be asked for again later (unless the language has now failed for good).
        next.batch.forEach((text) => asked.get(next.code)?.delete(text));
      })
      .finally(() => {
        inFlight -= 1;
        if (!flushTimer) flushTimer = setTimeout(flush, 250);
      });
  }
}

const placeholders = (text) => (text.match(/\{\d\}/g) ?? []).sort().join();

async function translateBatch(code, batch) {
  const texts = ENDPOINT ? await askService(code, batch) : await translateLive(batch, serviceCode(code));
  const entries = {};
  batch.forEach((english, i) => {
    const text = typeof texts[i] === 'string' ? texts[i].trim() : '';
    // A translation that lost or changed a {0} placeholder would show broken: keep the English.
    if (text && placeholders(text) === placeholders(english)) entries[english] = text;
  });
  return entries;
}

async function askService(code, batch) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: batch, source: 'en', target: serviceCode(code), format: 'text', ...(PUBLIC_KEY ? { api_key: PUBLIC_KEY } : {}) }),
  });
  if (!response.ok) throw new Error(`Translation service: ${response.status}`);
  const { translatedText } = await response.json();
  return Array.isArray(translatedText) ? translatedText : [translatedText];
}
