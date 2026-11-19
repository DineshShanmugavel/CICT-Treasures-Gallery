/**
 * The museum's language: English, any of the 22 languages of the Eighth Schedule, or one of the
 * world's languages (see ./languages.js and its registry, ./languages.json).
 *
 * The museum is bilingual by design: Tamil is shown on every label, card and panel, beside
 * a second language. The visitor's choice decides
 *   - the second language beside the Tamil — English when English or Tamil is chosen, otherwise
 *     the chosen language; see `L` and `cl`;
 *   - the language of the interface itself (buttons, hints, headings that have no Tamil
 *     companion); see `T`.
 *
 * Translations other than Tamil come from a language pack, ./locales/<code>.json: a flat
 * dictionary keyed by the English text it translates (interface strings and data texts
 * alike). Packs are fetched only when their language is chosen, so the first load stays light;
 * where a pack is missing or incomplete, ./translationEngine.js may fill in from the visitor's
 * cache and a runtime translation service; anything still missing shows in English. Keys may hold numbered placeholders —
 * "{0} OBJECTS ON DISPLAY" — matched against filled-in English, whose parts are translated too.
 * Tamil and Hindi may also be written inline: `T(en, ta, hi)`, `L(en, hi)`, `{ en, ta, hi }`.
 * Maintained with scripts/i18n-build.mjs.
 *
 * The choice is kept in a small store rather than only in React, so the 3D hall's canvas
 * textures can redraw when it changes (`subscribe`). It is remembered per visitor in
 * localStorage and mirrored on <html lang> and <html data-script>, which the stylesheet uses
 * for each script's line height, letter spacing and (Urdu, Kashmiri, Sindhi) direction.
 */
import { useSyncExternalStore } from 'react';
import { CODES, INDIAN_LANGUAGES, LANGUAGES, MORE_LANGUAGES, PRIMARY_CODES, SCRIPT_FONTS, WORLD_LANGUAGES, languageOf } from './languages.js';
import { connect, loadLanguage, requestTranslation } from './translationEngine.js';

export { INDIAN_LANGUAGES, LANGUAGES, MORE_LANGUAGES, PRIMARY_CODES, WORLD_LANGUAGES, languageOf };

const STORAGE_KEY = 'cict-museum-language';

function initialLanguage() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (CODES.includes(saved)) return saved;
  } catch {
    // Storage blocked (private mode): start in English.
  }
  return 'en';
}

let current = typeof window === 'undefined' ? 'en' : initialLanguage();
const listeners = new Set();

/** Normalises whitespace, so the dictionary matches text written over several lines. */
const keyOf = (text) => text.replace(/\s+/g, ' ').trim();

/** Loaded translations: code → { words: Map, templates: [{ pattern, order, text }] }. */
const DICTIONARIES = new Map();
let loadedCount = 0;
/** Changes when the language changes or a pack arrives, so `useI18n` re-renders with it. */
let snapshot = `${current}:0`;

const notify = () => {
  snapshot = `${current}:${loadedCount}`;
  listeners.forEach((listener) => listener(current));
};

const escapeRegExp = (text) => text.replace(/[.*+?^$()|[\]\\]/g, '\\$&');

/** Adds translations to a language's lookup: exact keys, and keys with {n} placeholders as patterns. */
function addEntries(code, entries) {
  const dictionary = DICTIONARIES.get(code) ?? DICTIONARIES.set(code, { words: new Map(), templates: [] }).get(code);
  const { words, templates } = dictionary;
  for (const [english, text] of Object.entries(entries)) {
    if (typeof text !== 'string' || !text) continue;
    const key = keyOf(english);
    words.set(key, text);
    if (/\{\d\}/.test(key)) {
      const order = [];
      // Fills are numbers or short names (a hall, a cabinet, a wing), never sentences: without
      // this, "{0} of {1}" would claim any exhibit text with "of" in it, translating that one
      // word and keeping the sentence from ever reaching the runtime service. Templates that are
      // nearly all placeholder ("{0} of {1}") take numbers only.
      const letters = (key.replace(/\{\d\}/g, '').match(/\p{L}/gu) ?? []).length;
      const fill = letters < 4 ? '([\\d\\s.,:%/–-]+?)' : '((?:(?!\\.\\s)[^\\n]){1,80}?)';
      const source = escapeRegExp(key).replace(/\\?\{(\d)\\?\}/g, (_, n) => {
        order.push(Number(n));
        return fill;
      });
      const existing = templates.findIndex((template) => template.key === key);
      if (existing >= 0) templates.splice(existing, 1);
      templates.push({ key, pattern: new RegExp(`^${source}$`), order, text });
    }
  }
}

// Translations written in the admin portal (see setAdminTranslations below), by language.
const ADMIN_ENTRIES = new Map();

// Packs, cached and runtime translations all arrive here; everything showing them re-renders.
connect((code, entries) => {
  addEntries(code, entries);
  // Translations written in the admin portal win over a language pack that arrives later.
  const own = ADMIN_ENTRIES.get(code);
  if (own) addEntries(code, own);
  loadedCount += 1;
  notify();
});

/**
 * Translations written in the admin portal (src/siteData): e.g. an exhibit's Hindi description,
 * keyed by its English text like every other translation, so L(note) shows it in Hindi.
 */
export function setAdminTranslations(code, entries) {
  ADMIN_ENTRIES.set(code, entries);
  addEntries(code, entries);
  notify();
}

/** Adds the stylesheet for a script's Noto fonts (once); canvases redraw when they arrive. */
const fontsRequested = new Set();
function loadScriptFonts(code) {
  const { script } = languageOf(code);
  const families = SCRIPT_FONTS[script];
  if (!families || fontsRequested.has(script) || typeof document === 'undefined') return;
  fontsRequested.add(script);
  const query = [...new Set(families)].map((family) => `family=${family.replace(/ /g, '+')}:wght@400;500;600;700`).join('&');
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?${query}&display=swap`;
  link.addEventListener('load', () => {
    document.fonts?.load?.(`600 32px '${families[1]}'`, languageOf(code).label).then(() => notify(), () => {});
  });
  document.head.append(link);
}

/** <html lang>, <html dir-script>, fonts and pack for the language now chosen. */
function apply(code) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.lang = code;
  root.dataset.script = languageOf(code).script;
  root.dataset.textDir = languageOf(code).dir ?? 'ltr';
  loadScriptFonts(code);
  loadLanguage(code);
}
apply(current);

export const getLang = () => current;

export function setLang(code) {
  if (!CODES.includes(code) || code === current) return;
  current = code;
  try {
    window.localStorage.setItem(STORAGE_KEY, code);
  } catch {
    // Not remembered, but still switched.
  }
  apply(code);
  notify();
}

/**
 * Calls `listener(code)` whenever the language changes, or a pack or font arrives;
 * returns the unsubscribe function.
 */
export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => snapshot;

/**
 * The translation of an English string in a language's pack, or undefined if it has none
 * yet. Strings with numbers or names filled in are matched against the pack's templates.
 */
export function lookup(english, lang = current) {
  if (typeof english !== 'string') return undefined;
  if (lang === 'en' || lang === 'ta') return undefined;
  const dictionary = DICTIONARIES.get(lang);
  const key = keyOf(english);
  if (!dictionary) {
    requestTranslation(lang, key);
    return undefined;
  }
  const exact = dictionary.words.get(key);
  if (exact !== undefined) return exact;
  for (const { pattern, order, text } of dictionary.templates) {
    const match = key.match(pattern);
    if (match) {
      return text.replace(/\{(\d)\}/g, (_, n) => {
        const part = match[order.indexOf(Number(n)) + 1] ?? '';
        return dictionary.words.get(keyOf(part)) ?? part;
      });
    }
  }
  // Not in the pack or the cache: ask the runtime service, if there is one (shows on arrival).
  requestTranslation(lang, key);
  return undefined;
}

/** The Hindi for an English string (kept for older callers). */
export const hindiOf = (english) => lookup(english, 'hi');

/** Whether the language's own words take the companion slot beside Tamil (all but en, ta). */
const isOther = (lang) => lang !== 'en' && lang !== 'ta';

/**
 * The visitor-language companion of a Tamil text (the slot that has always held English):
 * `english` in English or Tamil mode, its translation otherwise (falling back to English).
 * `hindi` may be given inline for Hindi. `english` may also be an `{ en, ta, hi, … }` object,
 * whose own entry for the language is preferred.
 */
export function translate(english, hindi, lang = current) {
  if (english && typeof english === 'object') return translate(english.en, english[lang] ?? (lang === 'hi' ? hindi : undefined), lang);
  if (!isOther(lang) || english == null) return english;
  return (lang === 'hi' ? hindi : undefined) ?? lookup(english, lang) ?? english;
}

/** Interface text with no Tamil beside it: `ta` and `hi` inline, other languages from their pack. */
export function tri(en, ta, hi, lang = current) {
  if (lang === 'ta') return ta ?? en;
  if (lang === 'en') return en;
  if (lang === 'hi' && hi != null) return hi;
  return lookup(en, lang) ?? en;
}

/**
 * From an `{ en, ta, hi? }` object, the text in the chosen language (falling back to the
 * pack, then English): for panels that show one language at a time.
 */
export function pick(texts, lang = current) {
  if (!texts) return '';
  if (lang === 'ta') return texts.ta ?? texts.en;
  if (lang === 'en') return texts.en ?? texts.ta;
  return texts[lang] ?? lookup(texts.en, lang) ?? texts.en;
}

/** The `lang` attribute for text produced by `translate` (English, or the chosen language). */
export const companionLang = (lang = current) => (isOther(lang) ? lang : 'en');

/** The writing direction of a language: 'rtl' for Arabic, Hebrew, Thaana and Perso-Arabic scripts. */
export const dirOf = (lang = current) => languageOf(lang).dir ?? 'ltr';

/**
 * A string that changes whenever painted text must be redrawn: the language, and the arrival
 * of its pack or fonts. For canvas textures, re-keyed on it.
 */
export const useI18nKey = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

/** Waits for the chosen script's fonts, so canvas text never paints in a fallback face. */
export function scriptFontsReady(lang = current) {
  const families = SCRIPT_FONTS[languageOf(lang).script] ?? (languageOf(lang).script === 'devanagari' ? ['Noto Sans Devanagari', 'Noto Serif Devanagari'] : null);
  if (!families || typeof document === 'undefined' || !document.fonts?.load) return Promise.resolve();
  const sample = languageOf(lang).label;
  return Promise.all(families.map((family) => document.fonts.load(`600 48px '${family}'`, sample))).then(() => {}, () => {});
}

/** The BCP-47 tag for speech in a language. */
export const speechTag = (code) => languageOf(code).speech ?? 'en-IN';

/**
 * The current language, re-rendering when it changes, with the helpers bound to it:
 * `L(english, hindi?)` (the companion of a Tamil text), `T(en, ta, hi)` (interface text),
 * `P({ en, ta, hi })` (one language at a time), `cl` (the companion's lang attribute),
 * `dir` (its writing direction) and `name` (the companion language's own name).
 */
export function useI18n() {
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const lang = current;
  const cl = companionLang(lang);
  return {
    lang,
    setLang,
    L: (english, hindi) => translate(english, hindi, lang),
    T: (en, ta, hi) => tri(en, ta, hi, lang),
    P: (texts) => pick(texts, lang),
    cl,
    dir: dirOf(cl),
    name: languageOf(cl).label,
  };
}
