/**
 * The museum's languages, from the registry ./languages.json:
 *   - `primary`: English, Tamil and Hindi, on the language pill itself;
 *   - `india`: the other twenty languages of the Eighth Schedule of the Constitution of India;
 *   - `world`: languages of the world beyond India.
 * The last two are offered in the pill's "+N" menu, in two sections.
 *
 * Each entry: `code` (BCP-47), `name` (in English), `nativeName` (in its own script; also
 * `label`), `short` (for the pill on phones), `dir` ('rtl' for Arabic, Hebrew, Thaana and the
 * Perso-Arabic scripts), `script` (decides the fonts — `SCRIPT_FONTS` — and line height),
 * `speech` (BCP-47 tag for text-to-speech; defaults to `code`), and `mt` (the code a machine
 * translation service knows it by, when that differs; null when it must not be machine
 * translated — Manipuri, which services write in Meitei Mayek, not the Bengali script used here;
 * Bodo and Kashmiri, which Google's translator does not offer).
 *
 * Kashmiri and Sindhi are written here in their Perso-Arabic scripts, Manipuri in the Bengali
 * script and Santali in Ol Chiki — the scripts most used for them in print.
 */
import REGISTRY from './languages.json';

export const LANGUAGES = REGISTRY.map((language) => ({
  ...language,
  label: language.nativeName,
  short: language.short ?? language.nativeName.slice(0, 2),
  dir: language.dir === 'rtl' ? 'rtl' : undefined,
  speech: language.speech ?? language.code,
}));

/** On the pill itself; the rest are in its "+N" menu. */
export const PRIMARY_CODES = LANGUAGES.filter(({ group }) => group === 'primary').map(({ code }) => code);
export const MORE_LANGUAGES = LANGUAGES.filter(({ group }) => group !== 'primary');
export const INDIAN_LANGUAGES = MORE_LANGUAGES.filter(({ group }) => group === 'india');
export const WORLD_LANGUAGES = MORE_LANGUAGES.filter(({ group }) => group === 'world');
export const CODES = LANGUAGES.map(({ code }) => code);
const BY_CODE = new Map(LANGUAGES.map((language) => [language.code, language]));
export const languageOf = (code) => BY_CODE.get(code) ?? LANGUAGES[0];

/**
 * The Google Noto families for each script ([sans, serif]); fetched only when a language that
 * needs them is chosen (see loadScriptFonts in ./index.js). Latin, Tamil and Devanagari are
 * always loaded; Latin, Cyrillic and Greek are covered by Inter, Cormorant Garamond and the
 * system's own fonts.
 */
export const SCRIPT_FONTS = {
  telugu: ['Noto Sans Telugu', 'Noto Serif Telugu'],
  kannada: ['Noto Sans Kannada', 'Noto Serif Kannada'],
  malayalam: ['Noto Sans Malayalam', 'Noto Serif Malayalam'],
  bengali: ['Noto Sans Bengali', 'Noto Serif Bengali'],
  gujarati: ['Noto Sans Gujarati', 'Noto Serif Gujarati'],
  gurmukhi: ['Noto Sans Gurmukhi', 'Noto Serif Gurmukhi'],
  oriya: ['Noto Sans Oriya', 'Noto Serif Oriya'],
  nastaliq: ['Noto Nastaliq Urdu', 'Noto Nastaliq Urdu'],
  naskh: ['Noto Naskh Arabic', 'Noto Naskh Arabic'],
  olchiki: ['Noto Sans Ol Chiki', 'Noto Sans Ol Chiki'],
  hebrew: ['Noto Sans Hebrew', 'Noto Serif Hebrew'],
  thaana: ['Noto Sans Thaana', 'Noto Sans Thaana'],
  hans: ['Noto Sans SC', 'Noto Serif SC'],
  hant: ['Noto Sans TC', 'Noto Serif TC'],
  jpan: ['Noto Sans JP', 'Noto Serif JP'],
  kore: ['Noto Sans KR', 'Noto Serif KR'],
  thai: ['Noto Sans Thai', 'Noto Serif Thai'],
  lao: ['Noto Sans Lao', 'Noto Serif Lao'],
  khmer: ['Noto Sans Khmer', 'Noto Serif Khmer'],
  myanmar: ['Noto Sans Myanmar', 'Noto Serif Myanmar'],
  sinhala: ['Noto Sans Sinhala', 'Noto Serif Sinhala'],
  ethiopic: ['Noto Sans Ethiopic', 'Noto Serif Ethiopic'],
  georgian: ['Noto Sans Georgian', 'Noto Serif Georgian'],
  armenian: ['Noto Sans Armenian', 'Noto Serif Armenian'],
  tibetan: ['Noto Serif Tibetan', 'Noto Serif Tibetan'],
};

/** Every script family, for font stacks that must cover any language (canvas text, the CSS). */
const unique = (list) => [...new Set(list)];
export const ALL_SANS_FAMILIES = unique(Object.values(SCRIPT_FONTS).map(([sans]) => sans));
export const ALL_SERIF_FAMILIES = unique(Object.values(SCRIPT_FONTS).map(([, serif]) => serif));
export const fontList = (families) => families.map((family) => `'${family}'`).join(', ');
