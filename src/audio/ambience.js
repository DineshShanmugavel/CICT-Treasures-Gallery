/*
 * The museum's background music and interaction sounds, all synthesised in the browser with
 * the Web Audio API: nothing is downloaded, and as the music is generated here, not taken
 * from a recording, it is the museum's own (no licence to clear).
 *
 * - Music: a slow bansuri (bamboo flute) improvising in raga Bhupali (Sa Re Ga Pa Dha, a calm
 *   pentatonic evening raga) over a soft tanpura drone, in a stone-hall reverb. It never
 *   repeats exactly. Turned on and off with `setMusicOn` (remembered between visits), and
 *   faded down while a narration or recitation plays (soloAudio.js's play event).
 * - Sounds: `playSound('glass-open' | 'glass-close' | 'cabinet-open' | 'cabinet-close' | 'shelf')`
 *   for the glass doors of the rooms, the cabinets' doors and the shelves.
 *
 * Browsers only start audio after a click or key press: `unlockAudio()` is called from the
 * museum's Enter button, and every sound unlocks it too.
 *
 * A recording can replace the generated music: put a bansuri track (one the museum may use)
 * at public/Audio/Music/bansuri.mp3 and it plays instead, looped, at the same low level and
 * with the same fading. Without it, the generated flute plays.
 */

import recordings from 'virtual:museum-audio';
import { mediaUrl } from '../mediaUrl.js';

const STORAGE_KEY = 'museum-music';
const PLAY_EVENT = 'museum:audio-play'; // soloAudio.js
/** The music's level: low, a background to the visit, never over the narrations. */
const MUSIC_LEVEL = 0.28;
const DUCKED_LEVEL = 0.05;
// The recording, only if the build found one (public/Audio/Music, listed by vite.config.js),
// so a museum without it never asks the server for a missing file.
const MUSIC_FILE = (recordings.Music ?? []).includes('bansuri.mp3') ? mediaUrl('/Audio/Music/bansuri.mp3') : null;
const SOUND_LEVEL = 0.5;

/** Bhupali on D (a bansuri in D): Sa Re Ga Pa Dha as semitones above Sa. */
const TONIC = 146.83; // D3
const BHUPALI = [0, 2, 4, 7, 9];

let ctx = null;
let master = null;
let musicBus = null;
let soundBus = null;
let reverb = null;
let noiseBuffer = null;
let music = null; // the running music engine, while on
const listeners = new Set();
let musicOn = readPreference();
const ducking = new Set(); // recordings playing now

function readPreference() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'off';
  } catch {
    return true;
  }
}

/** A stone hall's reverb: two seconds and a half of decaying stereo noise, a little darker as it fades. */
function makeImpulse(context, seconds = 2.6) {
  const length = Math.floor(context.sampleRate * seconds);
  const impulse = context.createBuffer(2, length, context.sampleRate);
  for (let channel = 0; channel < 2; channel += 1) {
    const data = impulse.getChannelData(channel);
    let last = 0;
    for (let i = 0; i < length; i += 1) {
      const t = i / length;
      const white = Math.random() * 2 - 1;
      last += (white - last) * (0.6 - 0.45 * t); // darker tail
      data[i] = last * (1 - t) ** 2.6;
    }
  }
  return impulse;
}

function ensureContext() {
  if (ctx) return ctx;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  ctx = new AudioContext();
  master = ctx.createDynamicsCompressor();
  master.threshold.value = -14;
  master.ratio.value = 3;
  master.connect(ctx.destination);
  reverb = ctx.createConvolver();
  reverb.buffer = makeImpulse(ctx);
  const wet = ctx.createGain();
  wet.gain.value = 0.42;
  reverb.connect(wet).connect(master);
  musicBus = ctx.createGain();
  musicBus.gain.value = 0;
  musicBus.connect(master);
  soundBus = ctx.createGain();
  soundBus.gain.value = SOUND_LEVEL;
  soundBus.connect(master);
  const send = ctx.createGain();
  send.gain.value = 0.35;
  soundBus.connect(send).connect(reverb);
  noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const noise = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noise.length; i += 1) noise[i] = Math.random() * 2 - 1;
  return ctx;
}

/* ---------- Music ---------- */

const random = (min, max) => min + Math.random() * (max - min);
const pick = (list) => list[Math.floor(Math.random() * list.length)];

/** The tanpura: Pa, Sa', Sa', Sa plucked in turn, each a bright string that blooms and fades. */
function startTanpura(out) {
  const strings = [TONIC * 2 ** (7 / 12) / 2, TONIC, TONIC, TONIC / 2]; // Pa (low), Sa, Sa, Sa (low)
  const bus = ctx.createGain();
  bus.gain.value = 0.16;
  const tone = ctx.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.value = 1800;
  bus.connect(tone);
  tone.connect(out);
  tone.connect(reverb);
  let step = 0;
  let next = ctx.currentTime + 0.2;
  const pluck = (when, frequency) => {
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(0.5, when + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, when + 5.5);
    // The jivari's buzz: a band of overtones that swells after the pluck.
    const buzz = ctx.createBiquadFilter();
    buzz.type = 'bandpass';
    buzz.Q.value = 6;
    buzz.frequency.setValueAtTime(frequency * 6, when);
    buzz.frequency.exponentialRampToValueAtTime(frequency * 14, when + 2.5);
    const dry = ctx.createGain();
    dry.gain.value = 0.35;
    for (const [ratio, detune, type] of [[1, -3, 'sawtooth'], [1, 3, 'sawtooth'], [2, 0, 'triangle']]) {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = frequency * ratio;
      osc.detune.value = detune;
      osc.connect(buzz);
      osc.connect(dry);
      osc.start(when);
      osc.stop(when + 5.6);
    }
    buzz.connect(gain);
    dry.connect(gain);
    gain.connect(bus);
  };
  const timer = window.setInterval(() => {
    while (next < ctx.currentTime + 1.5) {
      pluck(next, strings[step % 4]);
      next += step % 4 === 3 ? 1.9 : 1.15;
      step += 1;
    }
  }, 400);
  return () => {
    window.clearInterval(timer);
    bus.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
  };
}

/**
 * The bansuri: one breathy voice, gliding (meend) between long notes with a vibrato that
 * blooms as each note is held, in phrases that rise and settle back on Sa or Pa, with
 * silences between them.
 */
function startFlute(out) {
  const voice = ctx.createGain();
  voice.gain.value = 0;
  const tone = ctx.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.value = 2600;
  voice.connect(tone);
  const level = ctx.createGain();
  level.gain.value = 0.22;
  tone.connect(level);
  level.connect(out);
  const send = ctx.createGain();
  send.gain.value = 0.9;
  level.connect(send).connect(reverb);

  const fundamental = ctx.createOscillator();
  fundamental.type = 'sine';
  const second = ctx.createOscillator();
  second.type = 'sine';
  const secondGain = ctx.createGain();
  secondGain.gain.value = 0.12;
  const third = ctx.createOscillator();
  third.type = 'sine';
  const thirdGain = ctx.createGain();
  thirdGain.gain.value = 0.04;
  // Vibrato (a few cents) that the phrasing turns up on held notes.
  const vibrato = ctx.createOscillator();
  vibrato.frequency.value = 5.2;
  const vibratoDepth = ctx.createGain();
  vibratoDepth.gain.value = 0;
  vibrato.connect(vibratoDepth);
  for (const osc of [fundamental, second, third]) vibratoDepth.connect(osc.detune);
  fundamental.connect(voice);
  second.connect(secondGain).connect(voice);
  third.connect(thirdGain).connect(voice);
  // Breath: noise in a narrow band round the note, and a little air above it.
  const breath = ctx.createBufferSource();
  breath.buffer = noiseBuffer;
  breath.loop = true;
  const breathBand = ctx.createBiquadFilter();
  breathBand.type = 'bandpass';
  breathBand.Q.value = 9;
  const breathGain = ctx.createGain();
  breathGain.gain.value = 0.55;
  const air = ctx.createBiquadFilter();
  air.type = 'highpass';
  air.frequency.value = 4000;
  const airGain = ctx.createGain();
  airGain.gain.value = 0.025;
  breath.connect(breathBand).connect(breathGain).connect(voice);
  breath.connect(air).connect(airGain).connect(voice);
  const now = ctx.currentTime;
  for (const node of [fundamental, second, third, vibrato, breath]) node.start(now);

  const setPitch = (frequency, when, glide) => {
    for (const [node, ratio] of [[fundamental.frequency, 1], [second.frequency, 2], [third.frequency, 3], [breathBand.frequency, 1]]) {
      node.setTargetAtTime(frequency * ratio, when, glide);
    }
  };

  // Notes as scale steps: index into Bhupali across two octaves above the flute's Sa (D4).
  const noteFrequency = (step) => {
    const octave = Math.floor(step / 5);
    const degree = ((step % 5) + 5) % 5;
    return TONIC * 2 * 2 ** (octave + BHUPALI[degree] / 12);
  };
  let position = 0; // current step (0 = Sa)
  let next = now + 2.5;
  const phrase = () => {
    const notes = [];
    const length = Math.floor(random(3, 7));
    let step = position;
    for (let i = 0; i < length; i += 1) {
      step = Math.max(-2, Math.min(8, step + pick([-2, -1, -1, 1, 1, 2, 0])));
      notes.push(step);
    }
    notes.push(pick([0, 0, 3, 5])); // settle on Sa, Pa or upper Sa
    return notes;
  };
  const play = () => {
    let t = next;
    const notes = phrase();
    voice.gain.setTargetAtTime(0.9, t, 0.12);
    notes.forEach((step, i) => {
      const last = i === notes.length - 1;
      const hold = last ? random(2.8, 4.5) : random(0.7, 2.2);
      setPitch(noteFrequency(step), t, i === 0 ? 0.01 : random(0.05, 0.16));
      // A soft tonguing dip between notes, the vibrato blooming on long ones.
      if (i > 0) {
        voice.gain.setTargetAtTime(0.62, t - 0.04, 0.02);
        voice.gain.setTargetAtTime(0.9, t + 0.03, 0.06);
      }
      vibratoDepth.gain.setTargetAtTime(0, t, 0.05);
      if (hold > 1.2) vibratoDepth.gain.setTargetAtTime(14, t + 0.5, 0.4);
      t += hold;
    });
    voice.gain.setTargetAtTime(0, t - 0.4, 0.35);
    position = notes[notes.length - 1];
    next = t + random(2.5, 6);
  };
  const timer = window.setInterval(() => {
    if (next < ctx.currentTime + 1) play();
  }, 250);
  return () => {
    window.clearInterval(timer);
    level.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
    const end = ctx.currentTime + 2;
    for (const node of [fundamental, second, third, vibrato, breath]) node.stop(end);
  };
}

/**
 * The recorded track, if the museum has put one in place (the dev server and most hosts
 * answer a missing file with the site's page, so it must be served as audio): a looping
 * audio element fed through the music's level. Resolves to its stop function, or null.
 */
let recording; // undefined: not looked for yet; null: none
async function startRecording(out) {
  if (recording === undefined && !MUSIC_FILE) recording = null;
  if (recording === undefined) {
    try {
      const response = await fetch(MUSIC_FILE, { method: 'HEAD' });
      const type = response.headers.get('content-type') ?? '';
      recording = response.ok && type.startsWith('audio/') ? MUSIC_FILE : null;
    } catch {
      recording = null;
    }
  }
  if (!recording) return null;
  const audio = new Audio(recording);
  audio.loop = true;
  audio.crossOrigin = 'anonymous';
  ctx.createMediaElementSource(audio).connect(out);
  await audio.play().catch(() => {});
  return () => {
    window.setTimeout(() => audio.pause(), 2500);
  };
}

function startMusic() {
  if (music || !ensureContext()) return;
  const out = ctx.createGain();
  out.connect(musicBus);
  const engine = { stops: [], stopped: false };
  music = { stop: () => { engine.stopped = true; engine.stops.forEach((stop) => stop()); } };
  startRecording(out).then((stop) => {
    if (engine.stopped) {
      stop?.();
      return;
    }
    // No recording: the generated bansuri and tanpura.
    engine.stops.push(...(stop ? [stop] : [startTanpura(out), startFlute(out)]));
  });
  applyMusicLevel(2.5);
}

function stopMusic() {
  if (!music) return;
  const playing = music;
  music = null;
  musicBus.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
  window.setTimeout(() => playing.stop(), 2500);
}

function applyMusicLevel(fade = 0.6) {
  if (!ctx || !music) return;
  const level = ducking.size ? DUCKED_LEVEL : MUSIC_LEVEL;
  musicBus.gain.cancelScheduledValues(ctx.currentTime);
  musicBus.gain.setTargetAtTime(level, ctx.currentTime, fade / 3);
}

// A narration or recitation is playing: fade the music down until it stops.
if (typeof window !== 'undefined') {
  window.addEventListener(PLAY_EVENT, (event) => {
    const audio = event.detail;
    if (!(audio instanceof HTMLMediaElement) || ducking.has(audio)) return;
    ducking.add(audio);
    applyMusicLevel();
    const release = () => {
      audio.removeEventListener('pause', release);
      audio.removeEventListener('ended', release);
      ducking.delete(audio);
      applyMusicLevel(1.5);
    };
    audio.addEventListener('pause', release);
    audio.addEventListener('ended', release);
  });
}

/** Starts audio after a click or key press (browsers forbid it before), and the music if it is on. */
export function unlockAudio() {
  if (!ensureContext()) return;
  if (ctx.state === 'suspended') ctx.resume();
  if (musicOn) startMusic();
}

export const isMusicOn = () => musicOn;

/** Turns the music on or off (from a click, which also unlocks audio), remembered between visits. */
export function setMusicOn(on) {
  musicOn = on;
  try {
    localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
  } catch {
    // Private browsing: remembered for this visit only.
  }
  if (on) unlockAudio();
  else stopMusic();
  listeners.forEach((listener) => listener(on));
}

/** Calls `listener(on)` whenever the music is turned on or off; returns the unsubscribe. */
export function onMusicChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/* ---------- Sounds ---------- */

/** A burst of filtered noise: `filter` and its frequency sweep, with an attack/decay envelope. */
function noiseBurst(when, { type = 'bandpass', from, to, q = 1, duration, attack = 0.01, peak = 0.5, out = soundBus }) {
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;
  source.playbackRate.value = random(0.9, 1.1);
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.Q.value = q;
  filter.frequency.setValueAtTime(from, when);
  filter.frequency.exponentialRampToValueAtTime(to, when + duration);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(peak, when + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
  source.connect(filter).connect(gain).connect(out);
  source.start(when, random(0, 1.5));
  source.stop(when + duration + 0.05);
}

/** A struck tone (glass, wood, brass): sine partials at `ratios`, each decaying in `decay` seconds. */
function strike(when, { frequency, ratios = [1], decay = 0.4, peak = 0.3 }) {
  ratios.forEach((ratio, i) => {
    const osc = ctx.createOscillator();
    osc.frequency.value = frequency * ratio;
    const gain = ctx.createGain();
    const level = peak / (i + 1);
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(level, when + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + decay / (1 + i * 0.4));
    osc.connect(gain).connect(soundBus);
    osc.start(when);
    osc.stop(when + decay + 0.05);
  });
}

/** A hinge's creak: a rough low tone through a resonant band, its pitch wandering as the door swings. */
function creak(when, { duration = 0.7, pitch = 90, peak = 0.12 }) {
  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(pitch, when);
  osc.frequency.linearRampToValueAtTime(pitch * random(1.3, 1.6), when + duration * 0.6);
  osc.frequency.linearRampToValueAtTime(pitch * 1.1, when + duration);
  // Stick-slip: the tone stutters at a few dozen times a second.
  const stutter = ctx.createOscillator();
  stutter.type = 'square';
  stutter.frequency.setValueAtTime(random(22, 30), when);
  stutter.frequency.linearRampToValueAtTime(random(34, 44), when + duration);
  const stutterDepth = ctx.createGain();
  stutterDepth.gain.value = 0.5;
  const amp = ctx.createGain();
  amp.gain.value = 0.5;
  stutter.connect(stutterDepth).connect(amp.gain);
  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = random(700, 1000);
  band.Q.value = 7;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(peak, when + 0.08);
  gain.gain.setValueAtTime(peak, when + duration * 0.7);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
  osc.connect(amp).connect(band).connect(gain).connect(soundBus);
  for (const node of [osc, stutter]) {
    node.start(when);
    node.stop(when + duration + 0.05);
  }
}

const SOUNDS = {
  /** A glass door swinging open: the seal's release, the leaf's soft rush of air, the glass's faint ring. */
  'glass-open': (t) => {
    noiseBurst(t, { type: 'highpass', from: 3000, to: 1500, duration: 0.08, peak: 0.25 });
    noiseBurst(t + 0.05, { from: 600, to: 2400, q: 0.8, duration: 1.0, attack: 0.35, peak: 0.22 });
    strike(t + 0.03, { frequency: 2300, ratios: [1, 1.48, 2.31], decay: 1.2, peak: 0.05 });
  },
  /** A glass door swinging shut: the rush of air, the brass catch, the glass's ring. */
  'glass-close': (t) => {
    noiseBurst(t, { from: 2200, to: 700, q: 0.8, duration: 0.7, attack: 0.3, peak: 0.2 });
    strike(t + 0.62, { frequency: 140, ratios: [1, 2.7], decay: 0.18, peak: 0.35 });
    noiseBurst(t + 0.62, { type: 'highpass', from: 2500, to: 1800, duration: 0.05, peak: 0.3 });
    strike(t + 0.63, { frequency: 2600, ratios: [1, 1.52, 2.4], decay: 1.1, peak: 0.06 });
  },
  /** A cabinet's door opening: the latch's click, then the hinge's creak. */
  'cabinet-open': (t) => {
    strike(t, { frequency: 1900, ratios: [1, 2.2], decay: 0.06, peak: 0.25 });
    noiseBurst(t, { type: 'highpass', from: 3500, to: 2500, duration: 0.04, peak: 0.25 });
    creak(t + 0.08, { duration: 0.65, pitch: random(80, 100) });
  },
  /** A cabinet's door closing: a shorter creak and the wooden knock of the door meeting its frame. */
  'cabinet-close': (t) => {
    creak(t, { duration: 0.4, pitch: random(95, 115), peak: 0.09 });
    strike(t + 0.4, { frequency: 180, ratios: [1, 2.4, 3.9], decay: 0.16, peak: 0.4 });
    noiseBurst(t + 0.4, { from: 1200, to: 500, q: 1.5, duration: 0.09, peak: 0.25 });
  },
  /** A volume or bundle drawn from a shelf: a soft slide against the wood, and a light tap. */
  shelf: (t) => {
    noiseBurst(t, { from: 900, to: 2200, q: 1.2, duration: 0.32, attack: 0.12, peak: 0.16 });
    strike(t + 0.3, { frequency: 230, ratios: [1, 2.6], decay: 0.12, peak: 0.2 });
  },
};

/** Plays one of the museum's interaction sounds (see SOUNDS). */
export function playSound(name) {
  if (!ensureContext() || !SOUNDS[name]) return;
  if (ctx.state === 'suspended') ctx.resume();
  SOUNDS[name](ctx.currentTime + 0.01);
}
