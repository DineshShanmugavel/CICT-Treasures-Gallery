#!/usr/bin/env node
/**
 * English recordings of the Thirukkural's meanings: for each of the 1330 kurals, exactly the
 * English meaning its palm leaf shows under MEANING (OlaiSuvadi.jsx) — the kural's
 * `explanation`, or for a kural with a museum-written `studentMeaning`, that text's English —
 * nothing more or less (no couplet, number or chapter name).
 *
 *   ../public/kural-meaning-en/<number>.mp3
 *
 * Same voice and settings as the Tamil kural recordings (generateAllKuralsAudio.mjs): Rajan,
 * Eleven v4, stability 1, similarity 0.69, style 0, MP3 44.1 kHz 128 kbps.
 *
 *   npm run build:kural-meaning-audio                      every kural not yet recorded
 *   npm run build:kural-meaning-audio -- --from 1 --to 10  kurals 1–10 only
 *   npm run build:kural-meaning-audio -- --dry             list what would be made
 *
 * With --lang hi: the Hindi meaning the leaf shows in Hindi (अर्थ, from src/data/kurals/hi.json)
 * → ../public/kural-meaning-hi/<number>.mp3 (log: kural-meaning-hi-audio-log.json).
 *
 * Resumable (existing files are skipped; writes go via .part); retries 429 / 409 / 5xx with
 * back-off; a key or quota error stops the run. Log: kural-meaning-audio-log.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LANG = (() => {
  const i = process.argv.indexOf('--lang');
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : 'en';
})();
if (!['en', 'hi'].includes(LANG)) throw new Error(`--lang must be en or hi, not ${LANG}`);
const OUT_DIR = path.resolve(ROOT, `../public/kural-meaning-${LANG}`);
const LOG_FILE = path.join(ROOT, LANG === 'en' ? 'kural-meaning-audio-log.json' : `kural-meaning-${LANG}-audio-log.json`);
const MODEL = 'eleven_v4';
const VOICE_SETTINGS = { stability: 1, similarity_boost: 0.69, style: 0 };
const OUTPUT_FORMAT = 'mp3_44100_128';
const CONCURRENCY = 2;
const DELAY_MS = 400;
const MAX_ATTEMPTS = 6;

const argv = process.argv.slice(2);
const option = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] ? Number(argv[i + 1]) : fallback;
};
const FROM = option('from', 1);
const TO = option('to', 1330);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function loadEnvLocal() {
  const file = path.join(ROOT, '.env.local');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}

/** The English meaning the kural's leaf shows (keep in step with OlaiSuvadi.jsx / kuralMeaning.js). */
export const englishMeaning = (kural) => (kural.studentMeaning?.en ?? kural.explanation ?? '').trim();

class FatalError extends Error {}

async function speak(text, apiKey, voiceId) {
  for (let attempt = 1; ; attempt++) {
    let response;
    try {
      response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=${OUTPUT_FORMAT}`, {
        method: 'POST',
        headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
        body: JSON.stringify({ text, model_id: MODEL, language_code: LANG, voice_settings: VOICE_SETTINGS }),
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
  const { kurals } = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/thirukkural.json'), 'utf8'));
  // The meaning to read: the English leaf's, or the language pack's (what the leaf shows under अर्थ).
  const pack = LANG === 'en' ? null : JSON.parse(fs.readFileSync(path.join(ROOT, `src/data/kurals/${LANG}.json`), 'utf8'));
  const meaningOf = (k) => (pack ? (pack[k.number]?.meaning ?? '').trim() : englishMeaning(k));
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const todo = kurals
    .filter((k) => k.number >= FROM && k.number <= TO && meaningOf(k))
    .filter((k) => !fs.existsSync(path.join(OUT_DIR, `${k.number}.mp3`)));
  const chars = todo.reduce((n, k) => n + meaningOf(k).length, 0);
  console.log(`${todo.length} ${LANG} meanings to record (${chars.toLocaleString()} characters).`);
  if (argv.includes('--dry')) return;

  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID || 'aTz8YI6ufQ8Yn0LP3EVa';
  if (!apiKey) throw new Error('Set ELEVENLABS_API_KEY in .env.local');

  const log = { done: [], failed: [] };
  let next = 0;
  let fatal = null;
  async function worker() {
    while (!fatal && next < todo.length) {
      const kural = todo[next++];
      const target = path.join(OUT_DIR, `${kural.number}.mp3`);
      try {
        const audio = await speak(meaningOf(kural), apiKey, voiceId);
        fs.writeFileSync(`${target}.part`, audio);
        fs.renameSync(`${target}.part`, target);
        log.done.push(kural.number);
        console.log(`✓ ${log.done.length}/${todo.length} kural ${kural.number}`);
      } catch (error) {
        if (error instanceof FatalError) fatal = error;
        log.failed.push({ number: kural.number, error: String(error.message || error) });
        console.error(`✗ kural ${kural.number}: ${error.message || error}`);
      }
      await sleep(DELAY_MS);
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
