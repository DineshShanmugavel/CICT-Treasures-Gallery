#!/usr/bin/env node
/**
 * ElevenLabs narration of the website's Tamil content: every Tamil passage the museum shows
 * (exhibition panels, artefact descriptions, Then & Now places, sarees, figures, ports, the
 * Tamilakam map, room descriptions, the tutorial …) — a sentence or longer, mainly in Tamil.
 *
 * Each passage becomes ../public/narration/ta/<key>.mp3, where <key> = tamilKey(text)
 * (src/narration/tamilKey.js). On the site, TamilNarrationLayer.jsx puts a Listen button only
 * beside the element showing that exact text, so each recording belongs to its own passage.
 * ../public/narration/ta/index.json lists key → text and where it came from.
 *
 * Used by the website and the app; the app bundles none of these files but streams them from
 * the website (VITE_MEDIA_BASE_URL), like its other media.
 *
 * Passages are found in the string literals and JSX text of src/ (a literal with ${…} is
 * skipped, as its text is only known at runtime). Left out: the Thirukkural itself (recorded
 * per chapter in public/Audio), the welcome narration (LoadingScreen) and the translations.
 *
 *   npm run build:tamil-narration              everything not yet recorded
 *   npm run build:tamil-narration -- --limit 20
 *   npm run build:tamil-narration -- --dry     list passages and character count, no API calls
 *
 * Same voice and settings as the kural recordings: Rajan, Eleven v4, stability 1, similarity
 * 0.69, style 0, MP3 44.1 kHz 128 kbps. Resumable (existing files are skipped; writes go via
 * .part); retries 429 / 5xx with back-off; a key or quota error stops the run.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isNarratableTamil, normaliseTamil, tamilKey } from '../src/narration/tamilKey.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const OUT_DIR = path.resolve(ROOT, '../public/narration/ta');
const LOG_FILE = path.join(ROOT, 'tamil-narration-log.json');
const MODEL = 'eleven_v4';
const VOICE_SETTINGS = { stability: 1, similarity_boost: 0.69, style: 0 };
const OUTPUT_FORMAT = 'mp3_44100_128';
const CHUNK_CHARS = 1800;
const CONCURRENCY = 2;
const DELAY_MS = 400;
const MAX_ATTEMPTS = 6;

// valluvarStory: the Thiruvalluvar story has its own recording (public/Audio/Thiruvalluvar story).
const SKIP_PATH = /[\\/](i18n|kurals)[\\/]|thirukkural|kuralData|kuralStructure|LoadingScreen|valluvarStory|[\\/]narration[\\/]/;
// Components mostly hold controls hints and error messages, which are not content: only these
// component files contribute passages (the tutorial, the Then & Now introduction, gallery cards).
const CONTENT_COMPONENTS = /[\\/](Tutorial|ThenAndNow)\.jsx$|[\\/]main\.jsx$/;
const NOT_CONTENT = /தேடிப் பாருங்கள்/;
// The Thirukkural is recorded already (public/Audio): a passage quoting a couplet is left out.
const KURAL_LINES = JSON.parse(fs.readFileSync(path.join(SRC, 'data/thirukkural.json'), 'utf8'))
  .kurals.flatMap((k) => [k.tamilLine1, k.tamilLine2])
  .map((line) => normaliseTamil(line).replace(/[.,;!?]/g, ''))
  .filter((line) => line.length >= 12);
const quotesKural = (text) => {
  const plain = normaliseTamil(text).replace(/[.,;!?]/g, '');
  return KURAL_LINES.some((line) => plain.includes(line));
};

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const option = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] ? Number(argv[i + 1]) : fallback;
};
const LIMIT = option('limit', Infinity);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function loadEnvLocal() {
  const file = path.join(ROOT, '.env.local');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}

function sourceFiles(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (SKIP_PATH.test(p)) continue;
    if (fs.statSync(p).isDirectory()) sourceFiles(p, out);
    else if (/\.(js|jsx)$/.test(name) && (!/[\\/]src[\\/](components|main)/.test(p) || CONTENT_COMPONENTS.test(p))) out.push(p);
  }
  return out;
}

const STRING = /'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`/g;
const JSX_TEXT = />([^<>{}]*[஀-௿][^<>{}]*)</g;

/** The value of a plain string literal (no interpolation) — the source is our own. */
function literalValue(literal) {
  if (literal.startsWith('`')) {
    if (literal.includes('${')) return null;
    return literal.slice(1, -1).replace(/\\`/g, '`').replace(/\\n/g, '\n').replace(/\\\\/g, '\\');
  }
  try {
    return JSON.parse(literal.startsWith("'") ? `"${literal.slice(1, -1).replace(/\\'/g, "'").replace(/"/g, '\\"')}"` : literal);
  } catch {
    return null;
  }
}

/** Every narratable Tamil passage in src/, keyed by tamilKey. */
export function collectPassages() {
  const passages = new Map();
  for (const file of sourceFiles(SRC)) {
    const source = fs.readFileSync(file, 'utf8');
    const add = (raw) => {
      if (raw == null || !isNarratableTamil(raw) || NOT_CONTENT.test(raw) || quotesKural(raw)) return;
      const text = normaliseTamil(raw);
      const key = tamilKey(text);
      if (!passages.has(key)) passages.set(key, { key, text, from: path.relative(ROOT, file).replace(/\\/g, '/') });
    };
    for (const m of source.matchAll(STRING)) add(literalValue(m[0]));
    if (file.endsWith('.jsx')) for (const m of source.matchAll(JSX_TEXT)) add(m[1]);
  }
  return [...passages.values()];
}

/**
 * The texts the museum's own narration players read, composed exactly as the site shows them
 * (loaded through Vite, so the data modules run as in the browser):
 * - books: the Tamil description (the work's text plus the edition notes) — GlassCabinet,
 *   FlipBookViewer;
 * - artefacts: the Tamil description on the close-up's palm leaf — ArtifactGallery;
 * - palm-leaf bundles: the Tamil note — OlaiLeafViewer.
 * Items that already have a recording of their own (public/Audio) are returned in `recorded`,
 * with the shrine's description (in the shrine narration) and the Thiruvalluvar story (its own
 * recording), so they are not recorded again.
 */
async function collectFromData() {
  const { createServer } = await import('vite');
  const server = await createServer({
    root: ROOT,
    configFile: path.join(ROOT, 'vite.config.js'),
    server: { middlewareMode: true, hmr: false, watch: null },
    appType: 'custom',
    logLevel: 'error',
  });
  const players = [];
  const recorded = [];
  const titles = [];
  const isRecording = (src) => typeof src === 'string' && src.includes('/Audio/');
  try {
    const { roomBooks } = await server.ssrLoadModule('/src/data/roomBooks.js');
    const { describeBook, bookAudio } = await server.ssrLoadModule('/src/data/bookInfo.js');
    const { artifactsIn } = await server.ssrLoadModule('/src/data/artifacts.js');
    const { default: artifactFolders } = await server.ssrLoadModule('virtual:museum-artifacts');
    const manuscripts = await server.ssrLoadModule('/src/data/manuscripts.js');
    const { valluvarStory } = await server.ssrLoadModule('/src/data/valluvarStory.js').catch(() => ({}));

    const books = new Map();
    (function walk(value) {
      if (!value || typeof value !== 'object') return;
      if (Array.isArray(value)) return value.forEach(walk);
      if (value.id && value.title && (value.work || value.pdfUrl || value.description)) books.set(value.id, value);
      Object.values(value).forEach(walk);
    })(roomBooks);
    for (const book of books.values()) {
      const text = describeBook(book, 'ta').ta;
      (isRecording(bookAudio(book).ta.src) ? recorded : players).push({ text, from: `book:${book.id}` });
    }
    for (const folder of Object.keys(artifactFolders)) {
      for (const artifact of artifactsIn(folder)) {
        // An artefact's Tamil title is a name, not a description: it is not narrated.
        if (artifact.tamil) titles.push({ text: artifact.tamil, from: `title:${artifact.id}` });
        if (!artifact.tamilNote) continue;
        (isRecording(artifact.narration) ? recorded : players).push({ text: artifact.tamilNote, from: `artefact:${artifact.id}` });
      }
    }
    const shelves = [...manuscripts.manuscriptShelves(), ...(manuscripts.tinaiShelves?.() ?? [])];
    for (const bundle of shelves.flatMap((shelf) => shelf.bundles)) {
      if (!bundle.description?.ta) continue;
      (isRecording(bundle.narration) ? recorded : players).push({ text: bundle.description.ta, from: `bundle:${bundle.folder}` });
    }
    if (roomBooks.shrine?.tamilDescription) recorded.push({ text: roomBooks.shrine.tamilDescription, from: 'shrine narration' });
    (function walk(value) {
      if (typeof value === 'string') recorded.push({ text: value, from: 'Thiruvalluvar story' });
      else if (value && typeof value === 'object') Object.values(value).forEach(walk);
    })(valluvarStory);
  } finally {
    await server.close();
  }
  return { players, recorded, titles };
}

/** Long passages are recorded in sentence-sized chunks and joined (same CBR MP3 format). */
function chunks(text) {
  if (text.length <= CHUNK_CHARS) return [text];
  const sentences = text.match(/[^.!?।]+[.!?।]*\s*/g) || [text];
  const out = [];
  let current = '';
  for (const s of sentences) {
    if (current && (current + s).length > CHUNK_CHARS) {
      out.push(current.trim());
      current = '';
    }
    current += s;
  }
  if (current.trim()) out.push(current.trim());
  return out;
}

class FatalError extends Error {}

async function speak(text, apiKey, voiceId) {
  for (let attempt = 1; ; attempt++) {
    let response;
    try {
      response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=${OUTPUT_FORMAT}`, {
        method: 'POST',
        headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
        body: JSON.stringify({ text, model_id: MODEL, language_code: 'ta', voice_settings: VOICE_SETTINGS }),
      });
    } catch (error) {
      if (attempt >= MAX_ATTEMPTS) throw error;
      await sleep(2000 * attempt);
      continue;
    }
    if (response.ok) return Buffer.from(await response.arrayBuffer());
    const body = await response.text();
    if (/quota|credits|limit_exceeded/i.test(body) || [401, 403, 404].includes(response.status)) {
      throw new FatalError(`ElevenLabs ${response.status}: ${body.slice(0, 300)}`);
    }
    if (response.status === 400 && /language_code/i.test(body)) {
      // Older models reject language_code; the text itself is Tamil.
      return speakWithoutLanguage(text, apiKey, voiceId);
    }
    if ((response.status === 429 || response.status === 409 || response.status >= 500) && attempt < MAX_ATTEMPTS) {
      await sleep(Math.min(30000, 1500 * 2 ** attempt));
      continue;
    }
    throw new Error(`ElevenLabs ${response.status}: ${body.slice(0, 300)}`);
  }
}

async function speakWithoutLanguage(text, apiKey, voiceId) {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=${OUTPUT_FORMAT}`, {
    method: 'POST',
    headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    body: JSON.stringify({ text, model_id: MODEL, voice_settings: VOICE_SETTINGS }),
  });
  if (!response.ok) throw new Error(`ElevenLabs ${response.status}: ${(await response.text()).slice(0, 300)}`);
  return Buffer.from(await response.arrayBuffer());
}

async function main() {
  loadEnvLocal();
  const { players, recorded, titles } = await collectFromData();
  const recordedKeys = new Set([...recorded, ...titles].map((item) => tamilKey(item.text)));
  const byKey = new Map(collectPassages().map((p) => [p.key, p]));
  for (const item of players) {
    const text = normaliseTamil(item.text);
    const key = tamilKey(text);
    if (!byKey.has(key) && /[஀-௿]/.test(text)) byKey.set(key, { key, text, from: item.from });
  }
  const passages = [...byKey.values()].filter((p) => !recordedKeys.has(p.key));
  console.log(`Players' passages: ${players.length}; left out (already recorded): ${recorded.length}.`);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(OUT_DIR, 'index.json'),
    JSON.stringify(Object.fromEntries(passages.map((p) => [p.key, { from: p.from, text: p.text }])), null, 1),
  );
  const todo = passages.filter((p) => !fs.existsSync(path.join(OUT_DIR, `${p.key}.mp3`))).slice(0, LIMIT);
  const chars = todo.reduce((n, p) => n + p.text.length, 0);
  console.log(`${passages.length} Tamil passages; ${todo.length} to record (${chars.toLocaleString()} characters).`);
  if (flag('dry')) {
    const byFile = {};
    for (const p of passages) byFile[p.from] = (byFile[p.from] || 0) + 1;
    console.log(byFile);
    console.log('longest passage:', Math.max(...passages.map((p) => p.text.length)), 'characters');
    return;
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID || 'aTz8YI6ufQ8Yn0LP3EVa';
  if (!apiKey) throw new Error('Set ELEVENLABS_API_KEY in .env.local');

  const log = { done: [], failed: [] };
  let next = 0;
  let fatal = null;
  async function worker() {
    while (!fatal && next < todo.length) {
      const passage = todo[next++];
      const target = path.join(OUT_DIR, `${passage.key}.mp3`);
      try {
        const parts = [];
        for (const chunk of chunks(passage.text)) {
          parts.push(await speak(chunk, apiKey, voiceId));
          await sleep(DELAY_MS);
        }
        fs.writeFileSync(`${target}.part`, Buffer.concat(parts));
        fs.renameSync(`${target}.part`, target);
        log.done.push(passage.key);
        console.log(`✓ ${log.done.length}/${todo.length} ${passage.key} (${passage.from}) ${passage.text.slice(0, 40)}…`);
      } catch (error) {
        if (error instanceof FatalError) fatal = error;
        log.failed.push({ key: passage.key, from: passage.from, error: String(error.message || error) });
        console.error(`✗ ${passage.key}: ${error.message || error}`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  fs.writeFileSync(LOG_FILE, JSON.stringify({ at: new Date().toISOString(), ...log }, null, 1));
  console.log(`Done: ${log.done.length} recorded, ${log.failed.length} failed.`);
  if (fatal) {
    console.error(`Stopped: ${fatal.message}`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
