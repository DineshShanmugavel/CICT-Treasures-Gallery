#!/usr/bin/env node
/**
 * ElevenLabs narration for the Thiruvalluvar Shrine (திருவள்ளுவர் திருத்தலம்).
 *
 *   npm run build:voiceovers            generate (skips if the MP3 already exists)
 *   npm run build:voiceovers -- --force regenerate
 *   npm run build:voiceovers -- --dry   print the narration text only, no API call
 *
 * The text comes from the museum's own data, so the recording follows the exhibits:
 *   1. the shrine's introduction            (roomBooks.js → rooms.shrine.tamilDescription)
 *   2. the story of Thiruvalluvar           (valluvarStory.js, Tamil)
 *   3. a few key kurals with their meaning  (thirukkural.json → studentMeaning.ta)
 *
 * Settings come from the environment or from .env.local in this folder (never VITE_-prefixed,
 * so Vite never compiles them into the site):
 *   ELEVENLABS_API_KEY    required (a key with text_to_speech permission is enough)
 *   ELEVENLABS_VOICE_ID   required — the Voice Library ID of "Rajan (Expressive Suspense Narrator)"
 *   ELEVENLABS_MODEL      optional, default eleven_multilingual_v2 (Tamil-capable)
 *
 * Output: ../public/thiruvalluvar-shrine/audio/shrine-narration-rajan-ta.mp3 (the served
 * public folder) plus a .txt of exactly what was read.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.resolve(ROOT, '../public/thiruvalluvar-shrine/audio');
const OUT_FILE = path.join(OUT_DIR, 'shrine-narration-rajan-ta.mp3');
const args = new Set(process.argv.slice(2));

/** KEY=value lines from .env.local (shell environment wins). */
function loadEnvLocal() {
  const file = path.join(ROOT, '.env.local');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}

/** The shrine room's Tamil introduction, read from roomBooks.js without running it (it imports Vite virtual modules). */
function shrineIntro() {
  const source = fs.readFileSync(path.join(ROOT, 'src/data/roomBooks.js'), 'utf8');
  const block = source.slice(source.indexOf("\n  shrine: {"));
  const m = block.match(/tamilDescription:\s*'([^']+)'/);
  if (!m) throw new Error('Could not find the shrine’s tamilDescription in roomBooks.js');
  return m[1];
}

/** Kurals read aloud with their meaning: the first kural, and three of the best known. */
const KEY_KURALS = [1, 72, 391, 423];

async function buildNarration() {
  const { valluvarStory } = await import(new URL('../src/data/valluvarStory.js', import.meta.url));
  const { kurals } = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/thirukkural.json'), 'utf8'));
  const byNumber = new Map(kurals.map((k) => [k.number, k]));

  const parts = [
    'திருவள்ளுவர் திருத்தலத்திற்கு உங்களை அன்புடன் வரவேற்கிறோம்.',
    shrineIntro(),
    `${valluvarStory.title.ta}.`,
    ...valluvarStory.ta,
    'இனி, வள்ளுவர் வாய்மொழியாகச் சில குறள்களைக் கேட்போம்.',
  ];
  for (const n of KEY_KURALS) {
    const k = byNumber.get(n);
    if (!k) throw new Error(`Kural ${n} not found`);
    parts.push(`குறள் ${n}. ${k.chapter.tamil} அதிகாரம்.`);
    parts.push(`${k.tamilLine1} ... ${k.tamilLine2}`);
    if (k.studentMeaning?.ta) parts.push(`பொருள்: ${k.studentMeaning.ta}`);
  }
  parts.push('வள்ளுவரின் சொற்கள் காலத்தைக் கடந்து, இன்றும் நம் வாழ்வுக்கு வழிகாட்டுகின்றன. இத்திருத்தலத்தில் உள்ள நூல்களையும் குறள்களையும் நிதானமாகக் கண்டு மகிழுங்கள்.');
  return parts;
}

/** Splits paragraphs into requests of at most `limit` characters, never mid-paragraph. */
function chunk(parts, limit = 2400) {
  const chunks = [];
  let current = '';
  for (const p of parts) {
    if (current && current.length + p.length + 2 > limit) {
      chunks.push(current);
      current = '';
    }
    current = current ? `${current}\n\n${p}` : p;
  }
  if (current) chunks.push(current);
  return chunks;
}

async function tts(text, { key, voice, model, previous, next }) {
  const body = {
    text,
    model_id: model,
    voice_settings: { stability: 0.4, similarity_boost: 0.8, style: 0.45, use_speaker_boost: true },
  };
  // Request stitching keeps the voice's intonation continuous across chunks (not on eleven_v3).
  if (!model.startsWith('eleven_v3')) {
    if (previous) body.previous_text = previous;
    if (next) body.next_text = next;
  }
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice)}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`ElevenLabs ${res.status}: ${detail.slice(0, 400)}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  loadEnvLocal();
  const parts = await buildNarration();
  const chunks = chunk(parts);
  const fullText = parts.join('\n\n');
  console.log(`Narration: ${fullText.length} characters in ${chunks.length} request(s).`);

  if (args.has('--dry')) {
    console.log(`\n${fullText}`);
    return;
  }
  if (fs.existsSync(OUT_FILE) && !args.has('--force')) {
    console.log(`Already exists (use --force to regenerate): ${OUT_FILE}`);
    return;
  }
  const key = process.env.ELEVENLABS_API_KEY;
  const voice = process.env.ELEVENLABS_VOICE_ID;
  const model = process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2';
  if (!key) throw new Error('ELEVENLABS_API_KEY is not set (environment or .env.local).');
  if (!voice) throw new Error('ELEVENLABS_VOICE_ID is not set — copy Rajan’s voice ID from the ElevenLabs Voice Library into .env.local.');

  const audio = [];
  for (let i = 0; i < chunks.length; i++) {
    process.stdout.write(`  request ${i + 1}/${chunks.length} (${chunks[i].length} chars)… `);
    audio.push(await tts(chunks[i], { key, voice, model, previous: chunks[i - 1], next: chunks[i + 1] }));
    console.log('ok');
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  // MP3 frames are self-contained, so same-format segments concatenate into one playable file.
  fs.writeFileSync(OUT_FILE, Buffer.concat(audio));
  fs.writeFileSync(OUT_FILE.replace(/\.mp3$/, '.txt'), `${fullText}\n`, 'utf8');
  console.log(`✓ ${path.relative(path.resolve(ROOT, '..'), OUT_FILE)}  ${(fs.statSync(OUT_FILE).size / 1024).toFixed(0)} KB (voice ${voice}, ${model})`);
}

main().catch((error) => {
  console.error(`✗ ${error.message}`);
  process.exit(1);
});
