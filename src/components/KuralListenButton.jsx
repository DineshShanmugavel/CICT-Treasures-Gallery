import React, { useSyncExternalStore } from 'react';
import { Pause, Volume2 } from 'lucide-react';
import { announcePlay } from '../audio/soloAudio.js';
import { kuralRecording } from '../data/kuralAudio.js';
import { useI18n } from '../i18n/index.js';

/*
 * One audio element shared by every Listen button, however many kurals a list shows: the
 * buttons only subscribe to which kural is playing. Starting it pauses the museum's other
 * recordings (and another museum recording starting pauses it).
 */
let audio = null;
let state = { number: null, playing: false };
const listeners = new Set();
const set = (next) => {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
};
const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

function player() {
  if (audio) return audio;
  audio = new Audio();
  audio.preload = 'none';
  audio.addEventListener('play', () => {
    announcePlay(audio);
    set({ playing: true });
  });
  audio.addEventListener('pause', () => set({ playing: false }));
  audio.addEventListener('ended', () => set({ playing: false }));
  audio.addEventListener('error', () => set({ playing: false }));
  window.addEventListener('museum:audio-play', (event) => {
    if (event.detail !== audio) audio.pause();
  });
  return audio;
}

function toggle(number) {
  const a = player();
  if (state.number === number && !a.ended && a.getAttribute('src')) {
    if (a.paused) a.play().catch(() => {});
    else a.pause();
    return;
  }
  a.pause();
  a.src = kuralRecording(number);
  set({ number, playing: false });
  a.play().catch(() => set({ playing: false }));
}

/**
 * "🔊 ஒலியைக் கேட்க (Listen)": plays a kural's recitation from its அதிகாரம்'s folder in
 * public/Audio (see kuralAudio.js). Renders nothing for a kural with no recording yet.
 */
export default function KuralListenButton({ number, compact = false, className = '' }) {
  const { T } = useI18n();
  const current = useSyncExternalStore(subscribe, () => state);
  if (!kuralRecording(number)) return null;
  const playing = current.number === number && current.playing;
  const label = playing
    ? T(`Pause kural ${number}`, `குறள் ${number} — நிறுத்து`, `कुरल ${number} रोकें`)
    : T(`Listen to kural ${number}`, `குறள் ${number} — ஒலியைக் கேட்க`, `कुरल ${number} सुनें`);
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        toggle(number);
      }}
      aria-pressed={playing}
      aria-label={label}
      title={label}
      data-kural-listen={number}
      className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-[scale,background-color,border-color] duration-300 ease-spring hover:scale-105 active:scale-95 ${
        playing ? 'border-terracotta-deep bg-terracotta-deep text-[#fbe7b5]' : 'border-[#8a5a2a]/50 bg-[#fff3d6] text-terracotta-deep hover:border-terracotta'
      } ${className}`}
    >
      {playing ? <Pause size={13} fill="currentColor" /> : <Volume2 size={13} />}
      {!compact && (
        <span>
          <span lang="ta">ஒலியைக் கேட்க</span> <span className="opacity-75">(Listen)</span>
        </span>
      )}
    </button>
  );
}
