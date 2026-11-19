#!/usr/bin/env node
/**
 * The Hindi narration of the Thiruvalluvar story told in the scroll (ThiruvalluvarScroll.jsx →
 * ValluvarStory): its title, then its six paragraphs, exactly as the scroll shows them in Hindi
 * (the Hindi language pack's text for valluvarStory's English, src/data/valluvarStory.js).
 *
 *   ../public/Audio/Thiruvalluvar story/thiruvalluvar-story-audio-Hindi.mp3
 *
 * The scroll's story player picks it up by its "-Hindi" ending (valluvarStoryRecordings in
 * kuralAudio.js). Same voice and settings as the kural recordings: Rajan, Eleven v4,
 * stability 1, similarity 0.69, style 0, MP3 44.1 kHz 128 kbps.
 *
 *   npm run build:story-hindi-audio            (skipped if the file exists; --force remakes it)
 *   npm run build:story-hindi-audio -- --dry   print the text only
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { valluvarStory } from '../src/data/valluvarStory.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = path.resolve(ROOT, '../public/Audio/Thiruvalluvar story/thiruvalluvar-story-audio-Hindi.mp3');
const MODEL = 'eleven_v4';
const VOICE_SETTINGS = { stability: 1, similarity_boost: 0.69, style: 0 };
const OUTPUT_FORMAT = 'mp3_44100_128';
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

/** The story's Hindi: what translate(<English>, undefined, 'hi') gives in the scroll. */
function hindiStory() {
  const pack = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/i18n/locales/hi.json'), 'utf8'));
  const parts = [valluvarStory.title.en, ...valluvarStory.en].map((english) => {
    const hindi = pack[english];
    if (!hindi || !/[ऀ-ॿ]/.test(hindi)) throw new Error(`No Hindi in the pack for: ${english.slice(0, 60)}`);
    return hindi.trim();
  });
  return parts.join('\n\n');
}

async function main() {
  loadEnvLocal();
  const text = hindiStory();
  console.log(`${text.length} characters.`);
  if (argv.includes('--dry')) return console.log(text);
  if (fs.existsSync(TARGET) && !argv.includes('--force')) return console.log('Already recorded:', TARGET);
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID || 'aTz8YI6ufQ8Yn0LP3EVa';
  if (!apiKey) throw new Error('Set ELEVENLABS_API_KEY in .env.local');
  for (let attempt = 1; ; attempt++) {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=${OUTPUT_FORMAT}`, {
      method: 'POST',
      headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
      body: JSON.stringify({ text, model_id: MODEL, language_code: 'hi', voice_settings: VOICE_SETTINGS }),
    });
    if (response.ok) {
      fs.writeFileSync(`${TARGET}.part`, Buffer.from(await response.arrayBuffer()));
      fs.renameSync(`${TARGET}.part`, TARGET);
      return console.log('✓ recorded', TARGET);
    }
    const body = await response.text();
    if ((response.status === 429 || response.status === 409 || response.status >= 500) && attempt < 6) {
      await sleep(Math.min(30000, 1500 * 2 ** attempt));
      continue;
    }
    throw new Error(`ElevenLabs ${response.status}: ${body.slice(0, 300)}`);
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
