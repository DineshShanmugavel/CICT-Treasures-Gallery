#!/usr/bin/env node
/**
 * English narration of the website's artefact images, palm-leaf bundles, books and rooms:
 * each recording reads the item's English title, then its English description — nothing else.
 *
 *   ../public/narration/en/<key>.mp3   (+ index.json: key → text, item)
 *
 * Keys (src/narration/generated.js): an artefact / bundle / book is keyed by its title and
 * description together and played by its own player when the site is in English
 * (ArtifactGallery, OlaiLeafViewer, GlassCabinet / FlipBookViewer via bookAudio); a room is
 * keyed by its description, beside which TamilNarrationLayer.jsx puts a 🔊 button.
 *
 * Items are gathered through Vite (ssrLoadModule), so their texts are exactly what the site
 * shows. Left out: anything that already has audio — books with a recording in
 * public/Audio/Rare Books (e.g. Tirukkural on Virtues), any item with a recorded narration,
 * the shrine (its own narration), and the Thirukkural (kurals and their meanings are recorded).
 * The website and the app (which streams them from the website) both use them.
 *
 *   npm run build:english-narration            everything not yet recorded
 *   npm run build:english-narration -- --dry   list and count, no API calls
 *
 * Same voice and settings as the other recordings: Rajan, Eleven v4, stability 1, similarity
 * 0.69, style 0, MP3 44.1 kHz 128 kbps (language en). Resumable; retries 429 / 409 / 5xx; a key
 * or quota error stops the run. Log: english-narration-log.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.resolve(ROOT, '../public/narration/en');
const LOG_FILE = path.join(ROOT, 'english-narration-log.json');
const MODEL = 'eleven_v4';
const VOICE_SETTINGS = { stability: 1, similarity_boost: 0.69, style: 0 };
const OUTPUT_FORMAT = 'mp3_44100_128';
const CHUNK_CHARS = 2500;
const CONCURRENCY = 2;
const DELAY_MS = 400;
const MAX_ATTEMPTS = 6;
const SKIP_ROOMS = new Set(['shrine']);

const argv = process.argv.slice(2);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function loadEnvLocal() {
  const file = path.join(ROOT, '.env.local');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}

/** Every item to narrate, as { key, text, from }, gathered from the site's own data modules. */
async function collectItems() {
  const { createServer } = await import('vite');
  const server = await createServer({
    root: ROOT,
    configFile: path.join(ROOT, 'vite.config.js'),
    server: { middlewareMode: true, hmr: false, watch: null },
    appType: 'custom',
    logLevel: 'error',
  });
  const items = new Map();
  const skipped = [];
  const isRecording = (src) => typeof src === 'string' && src.includes('/Audio/');
  try {
    const narration = await server.ssrLoadModule('/src/narration/generated.js');
    const { englishTitle, englishNarrationText, englishItemKey, englishRoomKey } = narration;
    const add = (key, text, from) => {
      if (text && !items.has(key)) items.set(key, { key, text, from });
    };
    const english = (value) => ((value && typeof value === 'object' ? value.en : value) || '').trim();

    // Artefacts and palm-leaf bundles, from every data module (and its no-argument builders).
    const seen = new Set();
    const walk = (value, from, depth = 0) => {
      if (!value || typeof value !== 'object' || seen.has(value) || depth > 12) return;
      seen.add(value);
      if (Array.isArray(value)) return value.forEach((v) => walk(v, from, depth + 1));
      if (typeof value.note === 'string' && value.note.trim() && value.title) {
        // An artefact close-up: its English title (and caption detail), then its description.
        if (isRecording(value.narration)) skipped.push(`artefact:${value.id}`);
        else add(englishItemKey(englishTitle(value), value.note), englishNarrationText(englishTitle(value), value.note), `artefact:${value.id ?? englishTitle(value)}`);
      }
      if (value.folder && Array.isArray(value.leaves) && value.description?.en) {
        // A palm-leaf bundle: its title, then its note.
        if (isRecording(value.narration)) skipped.push(`bundle:${value.folder}`);
        else add(englishItemKey(englishTitle(value), value.description.en), englishNarrationText(englishTitle(value), value.description.en), `bundle:${value.folder}`);
      }
      for (const v of Object.values(value)) walk(v, from, depth + 1);
    };
    const { default: artifactFolders } = await server.ssrLoadModule('virtual:museum-artifacts');
    for (const file of fs.readdirSync(path.join(ROOT, 'src/data')).filter((f) => f.endsWith('.js'))) {
      if (/kural|thirukkural|valluvar/i.test(file)) continue; // the Thirukkural has its recordings
      let mod;
      try {
        mod = await server.ssrLoadModule(`/src/data/${file}`);
      } catch {
        continue;
      }
      for (const [name, value] of Object.entries(mod)) {
        if (typeof value !== 'function') walk(value, file);
        else if (name === 'artifactsIn') for (const folder of Object.keys(artifactFolders)) walk(value(folder), file);
        else if (value.length === 0 && !/^[A-Z]/.test(name)) {
          try {
            walk(value(), file);
          } catch {
            /* a builder that needs arguments */
          }
        }
      }
    }

    // Books: the title, then the description the label and the flip-book show.
    const { roomBooks } = await server.ssrLoadModule('/src/data/roomBooks.js');
    const { describeBook, bookAudio } = await server.ssrLoadModule('/src/data/bookInfo.js');
    const books = new Map();
    (function find(value) {
      if (!value || typeof value !== 'object') return;
      if (Array.isArray(value)) return value.forEach(find);
      if (value.id && value.title && (value.work || value.pdfUrl || value.description) && !value.cabinets) books.set(value.id, value);
      Object.values(value).forEach(find);
    })(Object.entries(roomBooks).filter(([id]) => !SKIP_ROOMS.has(id)).map(([, room]) => room.cabinets ?? room));
    for (const book of books.values()) {
      if (isRecording(bookAudio(book).en.src)) {
        skipped.push(`book:${book.id} (has a recording)`);
        continue;
      }
      const description = describeBook(book, 'en').en;
      add(englishItemKey(englishTitle(book), description), englishNarrationText(englishTitle(book), description), `book:${book.id}`);
    }

    // Rooms: the title, then the description shown at its doors and in the room.
    for (const [id, room] of Object.entries(roomBooks)) {
      const description = english(room.description);
      if (!description) continue;
      if (SKIP_ROOMS.has(id)) {
        skipped.push(`room:${id} (shrine narration)`);
        continue;
      }
      add(englishRoomKey(description), englishNarrationText(english(room.title), description), `room:${id}`);
    }
  } finally {
    await server.close();
  }
  return { items: [...items.values()], skipped };
}

function chunks(text) {
  if (text.length <= CHUNK_CHARS) return [text];
  const sentences = text.match(/[^.!?]+[.!?]*\s*/g) || [text];
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
        body: JSON.stringify({ text, model_id: MODEL, language_code: 'en', voice_settings: VOICE_SETTINGS }),
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
    if ((response.status === 429 || response.status === 409 || response.status >= 500) && attempt < MAX_ATTEMPTS) {
      await sleep(Math.min(30000, 1500 * 2 ** attempt));
      continue;
    }
    throw new Error(`ElevenLabs ${response.status}: ${body.slice(0, 300)}`);
  }
}

async function main() {
  loadEnvLocal();
  const { items, skipped } = await collectItems();
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, 'index.json'), JSON.stringify(Object.fromEntries(items.map((i) => [i.key, { from: i.from, text: i.text }])), null, 1));
  const todo = items.filter((i) => !fs.existsSync(path.join(OUT_DIR, `${i.key}.mp3`)));
  const chars = todo.reduce((n, i) => n + i.text.length, 0);
  const kinds = {};
  for (const i of items) kinds[i.from.split(':')[0]] = (kinds[i.from.split(':')[0]] || 0) + 1;
  console.log(`${items.length} English narrations (${JSON.stringify(kinds)}); ${todo.length} to record (${chars.toLocaleString()} characters).`);
  console.log(`Left out (already have audio): ${skipped.join(', ') || 'none'}`);
  if (argv.includes('--dry')) return;

  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID || 'aTz8YI6ufQ8Yn0LP3EVa';
  if (!apiKey) throw new Error('Set ELEVENLABS_API_KEY in .env.local');

  const log = { done: [], failed: [] };
  let next = 0;
  let fatal = null;
  async function worker() {
    while (!fatal && next < todo.length) {
      const item = todo[next++];
      const target = path.join(OUT_DIR, `${item.key}.mp3`);
      try {
        const parts = [];
        for (const chunk of chunks(item.text)) {
          parts.push(await speak(chunk, apiKey, voiceId));
          await sleep(DELAY_MS);
        }
        fs.writeFileSync(`${target}.part`, Buffer.concat(parts));
        fs.renameSync(`${target}.part`, target);
        log.done.push(item.key);
        console.log(`✓ ${log.done.length}/${todo.length} ${item.from}`);
      } catch (error) {
        if (error instanceof FatalError) fatal = error;
        log.failed.push({ key: item.key, from: item.from, error: String(error.message || error) });
        console.error(`✗ ${item.from}: ${error.message || error}`);
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
