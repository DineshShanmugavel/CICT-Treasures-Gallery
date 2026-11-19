#!/usr/bin/env node
/**
 * ElevenLabs recitations of the Thirukkural in Tamil, made exactly like the recordings of
 * the first அதிகாரம் (public/Audio/kadavul vazhthu/): same voice, model and settings, and the
 * same layout — one folder per அதிகாரம் holding
 *
 *   1.mp3 … 10.mp3      its ten kurals: the two Tamil lines of each couplet
 *   <name>.mp3          its title: the அதிகாரம்'s Tamil name alone (played before the kural
 *                       when a kural of a new அதிகாரம் is opened — see OlaiSuvadi.jsx)
 *
 * Folders are named "<number> <transliteration>" (e.g. "2 Vaansirappu"); kuralAudio.js finds a
 * chapter by that leading number. A chapter that already has a folder (e.g. "kadavul vazhthu")
 * is left exactly as it is.
 *
 *   npm run build:kural-audio                       every chapter not yet complete
 *   npm run build:kural-audio -- --from 2 --to 5    chapters 2–5 only
 *   npm run build:kural-audio -- --limit 30         at most 30 new files this run
 *   npm run build:kural-audio -- --dry              list what would be made, no API calls
 *
 * Safe to stop and rerun: an existing file is skipped; each is written to .part and renamed
 * when complete. Requests are spaced out and retried with back-off on 429 / 5xx / network
 * errors; a quota or key error stops the run.
 *
 * Voice settings (from the user, matching chapter 1): Rajan — Expressive Suspense Narrator,
 * model Eleven v4, stability Robust (1.0), similarity 69%, style 0, MP3 44.1 kHz 128 kbps.
 * ELEVENLABS_API_KEY / ELEVENLABS_VOICE_ID come from the environment or .env.local.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AUDIO_DIR = path.resolve(ROOT, '../public/Audio');
const LOG_FILE = path.join(ROOT, 'kural-audio-log.json');
const MODEL = 'eleven_v4';
const VOICE_SETTINGS = { stability: 1, similarity_boost: 0.69, style: 0 };
const OUTPUT_FORMAT = 'mp3_44100_128';
const CONCURRENCY = 2;
const DELAY_MS = 400;
const MAX_ATTEMPTS = 6;

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const option = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] ? Number(argv[i + 1]) : fallback;
};
const FROM = option('from', 1);
const TO = option('to', 133);
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

/** The same folding of Tamil romanisations as kuralAudio.js, to recognise existing folders. */
function romanKey(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '')
    .replace(/zh/g, 'l')
    .replace(/[td]h/g, 't')
    .replace(/[cs]h/g, 's')
    .replace(/d/g, 't')
    .replace(/g/g, 'k')
    .replace(/b/g, 'p')
    .replace(/j/g, 's')
    .replace(/w/g, 'v')
    .replace(/ee/g, 'i')
    .replace(/oo/g, 'u')
    .replace(/(.)\1+/g, '$1');
}

/** The folder already holding a chapter's recordings, if any. */
function existingFolder(chapter, folders) {
  return folders.find((folder) => {
    const numbered = folder.match(/^\s*(\d+)/);
    if (numbered) return Number(numbered[1]) === chapter.number;
    const key = romanKey(folder);
    return key === romanKey(chapter.transliteration) || key === romanKey(chapter.english);
  });
}

class FatalError extends Error {}

async function tts(text, { key, voice }) {
  for (let attempt = 1; ; attempt++) {
    let res;
    try {
      res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice)}?output_format=${OUTPUT_FORMAT}`, {
        method: 'POST',
        headers: { 'xi-api-key': key, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
        body: JSON.stringify({ text, model_id: MODEL, voice_settings: VOICE_SETTINGS }),
      });
    } catch (error) {
      if (attempt >= MAX_ATTEMPTS) throw error;
      await sleep(1000 * 2 ** attempt);
      continue;
    }
    if (res.ok) {
      const audio = Buffer.from(await res.arrayBuffer());
      if (audio.length < 2000) throw new Error(`suspiciously small reply (${audio.length} bytes)`);
      return audio;
    }
    const detail = (await res.text()).slice(0, 300);
    if (res.status === 401 || res.status === 403 || res.status === 404 || /quota_exceeded|voice_not_found|invalid_api_key/.test(detail)) {
      throw new FatalError(`ElevenLabs ${res.status}: ${detail}`);
    }
    if ((res.status === 429 || res.status >= 500) && attempt < MAX_ATTEMPTS) {
      await sleep(Number(res.headers.get('retry-after')) * 1000 || 1000 * 2 ** attempt);
      continue;
    }
    throw new Error(`ElevenLabs ${res.status}: ${detail}`);
  }
}

async function main() {
  loadEnvLocal();
  const { kuralSections } = await import(new URL('../src/data/kuralStructure.js', import.meta.url));
  const chapters = kuralSections.flatMap((section) => section.groups.flatMap((group) => group.chapters));
  const { kurals } = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/thirukkural.json'), 'utf8'));
  const folders = fs.readdirSync(AUDIO_DIR, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name);

  const jobs = [];
  const kept = [];
  for (const chapter of chapters.filter((c) => c.number >= FROM && c.number <= TO)) {
    const existing = existingFolder(chapter, folders);
    // A chapter recorded before this script (chapter 1) is kept exactly as it is.
    if (existing && !/^\d+ /.test(existing)) {
      kept.push(`${chapter.number} → ${existing}`);
      continue;
    }
    const folder = path.join(AUDIO_DIR, existing ?? `${chapter.number} ${chapter.transliteration}`);
    jobs.push({ file: path.join(folder, `${chapter.transliteration}.mp3`), text: chapter.tamil, label: `அதிகாரம் ${chapter.number} title` });
    for (let i = 0; i < 10; i++) {
      const k = kurals[chapter.start + i - 1];
      jobs.push({ file: path.join(folder, `${i + 1}.mp3`), text: `${k.tamilLine1}\n${k.tamilLine2}`, label: `kural ${k.number}` });
    }
  }
  const todo = jobs.filter((job) => !fs.existsSync(job.file)).slice(0, LIMIT);
  const chars = todo.reduce((sum, job) => sum + job.text.length, 0);
  if (kept.length) console.log(`Kept as recorded: chapter ${kept.join(', ')}`);
  console.log(`${jobs.length - jobs.filter((j) => !fs.existsSync(j.file)).length}/${jobs.length} files already made; ${todo.length} to generate (~${chars.toLocaleString()} characters, ${MODEL}).`);
  if (flag('dry')) {
    for (const job of todo.slice(0, 6)) console.log(`  ${path.relative(AUDIO_DIR, job.file)}  ←  ${job.text.replace('\n', ' / ')}`);
    return;
  }
  if (!todo.length) return;

  const key = process.env.ELEVENLABS_API_KEY;
  const voice = process.env.ELEVENLABS_VOICE_ID;
  if (!key || !voice) throw new FatalError('Set ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID (environment or .env.local).');

  const failures = [];
  let done = 0;
  let stopped = null;
  const queue = [...todo];
  const started = Date.now();
  async function worker() {
    while (queue.length && !stopped) {
      const job = queue.shift();
      try {
        const audio = await tts(job.text, { key, voice });
        fs.mkdirSync(path.dirname(job.file), { recursive: true });
        fs.writeFileSync(`${job.file}.part`, audio);
        fs.renameSync(`${job.file}.part`, job.file);
        done++;
        if (done % 20 === 0 || done === todo.length) {
          console.log(`  ${done}/${todo.length}  (${job.label}; ~${Math.round(((todo.length - done) * (Date.now() - started)) / done / 60000)} min left)`);
        }
      } catch (error) {
        fs.rmSync(`${job.file}.part`, { force: true });
        if (error instanceof FatalError) stopped = error;
        else failures.push({ file: path.relative(AUDIO_DIR, job.file), error: error.message });
        console.error(`  ✗ ${job.label}: ${error.message}`);
      }
      await sleep(DELAY_MS);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const remaining = jobs.filter((job) => !fs.existsSync(job.file)).length;
  fs.writeFileSync(LOG_FILE, `${JSON.stringify({ finished: new Date().toISOString(), voice, model: MODEL, voiceSettings: VOICE_SETTINGS, generatedThisRun: done, remaining, failures, stopped: stopped?.message ?? null }, null, 2)}\n`);
  console.log(`\n✓ ${done} generated this run; ${jobs.length - remaining}/${jobs.length} files in place.`);
  if (failures.length) console.log(`  ${failures.length} failed — rerun to retry them (log: kural-audio-log.json).`);
  if (stopped) {
    console.error(`Stopped: ${stopped.message}\nRerun later to continue from where it stopped.`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(`✗ ${error.message}`);
  process.exit(1);
});
