import React, { useEffect, useRef, useState } from 'react';
import { Headphones, Loader2, Pause, Play, VolumeX } from 'lucide-react';
import { announcePlay, useSoloAudio } from '../audio/soloAudio.js';
import { useI18n } from '../i18n/index.js';

const WAVE_BARS = [0.45, 0.8, 0.55, 1, 0.7, 0.9, 0.5, 0.85, 0.6, 1, 0.65, 0.4];

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
};

/** Gold equaliser bars that dance while audio plays and rest flat when paused. */
function SoundWave({ playing }) {
  return (
    <div className="flex h-9 flex-1 items-center gap-[3px]" aria-hidden="true">
      {WAVE_BARS.map((height, i) => (
        <span
          key={i}
          className={`w-1 origin-center rounded-full bg-gradient-to-t from-[#b8893f] to-[#f7e0a0] transition-[scale] duration-300 ${
            playing ? 'animate-wave' : 'scale-y-[0.25]'
          }`}
          style={{ height: `${height * 100}%`, animationDelay: `${i * 0.09}s`, animationDuration: `${0.7 + (i % 4) * 0.18}s` }}
        />
      ))}
    </div>
  );
}

/**
 * Bilingual narration player for pre-recorded, native-speaker voiceovers (never
 * text-to-speech). `tracks` maps a language code to { label, src, title }, e.g.
 * { ta: { label: 'தமிழ்', src: '/audio/valluvar-ta.mp3' }, en: {...} }.
 * Switching language keeps playing if the previous track was playing.
 */
export default function AudioPlayer({ tracks, defaultLanguage = 'ta' }) {
  const { L, T, cl } = useI18n();
  const languages = Object.keys(tracks);
  const audioRef = useRef(null);
  const resumeRef = useRef(false);
  const [language, setLanguage] = useState(defaultLanguage);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [missing, setMissing] = useState({});
  const track = tracks[language];
  const unavailable = Boolean(missing[language]);

  // New language: load its recording, and carry on playing if we were.
  useEffect(() => {
    const audio = audioRef.current;
    setTime(0);
    setDuration(0);
    audio.load();
    if (resumeRef.current) audio.play().catch(() => {});
    resumeRef.current = false;
  }, [language]);

  useEffect(() => () => audioRef.current?.pause(), []);
  useSoloAudio(audioRef);

  const switchLanguage = (next) => {
    if (next === language) return;
    resumeRef.current = playing;
    setPlaying(false);
    setLanguage(next);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (unavailable) return;
    // A refused or interrupted play() (a language switch, a slow network) is not a missing
    // recording: only the element's own error event (onError below) marks one as missing.
    if (audio.paused) audio.play().catch(() => setPlaying(false));
    else audio.pause();
  };

  const thumbIndex = languages.indexOf(language);

  return (
    <div className="rounded-2xl border border-[#c9a35a]/60 bg-gradient-to-br from-[#2e1d0d] via-[#1d1309] to-[#120c07] p-4 text-parchment shadow-[0_14px_34px_#0008,inset_0_1px_#fff1] sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#f4d792]/15 text-[#f4d792]">
            <Headphones size={16} />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-[#d8b56b]">{L('LISTEN', 'सुनें')} · கேளுங்கள்</p>
            <p className="truncate font-serif text-base font-semibold text-[#fff0d0]">{L(track.title)}</p>
          </div>
        </div>

        {/* Language toggle with a sliding, springy thumb */}
        <div className="relative grid shrink-0 auto-cols-fr grid-flow-col rounded-full border border-[#8e6e35] bg-black/40 p-1" role="group" aria-label={T('Narration language', 'விவரணை மொழி', 'वर्णन की भाषा')}>
          <span
            className="absolute inset-y-1 left-1 rounded-full bg-gradient-to-br from-[#f5dc98] to-[#c89a4d] shadow-[0_0_14px_#dfb65866] transition-transform duration-500 ease-spring"
            style={{ width: `calc((100% - 0.5rem) / ${languages.length})`, transform: `translateX(${thumbIndex * 100}%)` }}
            aria-hidden="true"
          />
          {languages.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => switchLanguage(code)}
              aria-pressed={code === language}
              className={`relative z-10 min-w-20 cursor-pointer rounded-full px-3 py-1.5 text-xs font-bold transition-colors duration-300 ${
                code === language ? 'text-[#21170b]' : 'text-[#e8d6ad] hover:text-[#fff0d0]'
              }`}
            >
              {tracks[code].label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          onClick={togglePlay}
          disabled={unavailable}
          aria-label={playing ? T('Pause narration', 'விவரணையை நிறுத்து', 'वर्णन रोकें') : T('Play narration', 'விவரணையை இயக்கு', 'वर्णन चलाएँ')}
          className="relative grid size-14 shrink-0 cursor-pointer place-items-center rounded-full border border-[#f3d58a] bg-gradient-to-br from-[#f5dc98] to-[#c89a4d] text-[#21170b] shadow-[0_0_24px_#dfb65855] transition-[scale,box-shadow] duration-300 ease-spring hover:scale-110 hover:shadow-[0_0_34px_#dfb65899] active:scale-90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
        >
          {playing && <span className="absolute inset-0 animate-halo rounded-full border-2 border-[#f4d792]" aria-hidden="true" />}
          <Play size={24} className={`absolute ml-1 transition-[scale,opacity,rotate] duration-300 ease-spring ${playing ? 'scale-0 rotate-90 opacity-0' : 'scale-100 opacity-100'}`} fill="currentColor" />
          <Pause size={24} className={`absolute transition-[scale,opacity,rotate] duration-300 ease-spring ${playing ? 'scale-100 opacity-100' : 'scale-0 -rotate-90 opacity-0'}`} fill="currentColor" />
          {buffering && <Loader2 size={58} className="absolute animate-spin text-[#f4d792]/70" strokeWidth={1} />}
        </button>

        <SoundWave playing={playing} />

        <span className="shrink-0 text-xs text-[#c9b89b] tabular-nums">
          {formatTime(time)} / {formatTime(duration)}
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={Math.min(time, duration || 0)}
        disabled={!duration}
        onChange={(event) => {
          audioRef.current.currentTime = Number(event.target.value);
          setTime(Number(event.target.value));
        }}
        aria-label={T('Seek narration', 'விவரணையில் நகர்த்து', 'वर्णन में आगे-पीछे जाएँ')}
        className="mt-3 w-full cursor-pointer accent-[#d8b56b] disabled:cursor-default disabled:opacity-40"
      />

      {unavailable && (
        <p className="mt-3 flex items-start gap-2 rounded-lg border border-[#8e6e35]/60 bg-black/30 px-3 py-2 text-xs text-[#e8d6ad]">
          <VolumeX size={15} className="mt-0.5 shrink-0 text-[#f0cf82]" />
          <span>
            {T(`The ${track.label} narration is being recorded — please check back soon!`, `${track.label} விவரணை பதிவு செய்யப்படுகிறது — விரைவில் மீண்டும் வாருங்கள்!`, `${track.label} वर्णन की रिकॉर्डिंग चल रही है — कृपया जल्द ही फिर देखें!`)}
            <span lang="en" className="mt-0.5 block text-[10px] text-[#9e8a6a]">Museum staff: add the voice recording at <code>public{track.src}</code></span>
          </span>
        </p>
      )}

      <audio
        ref={audioRef}
        src={track.src}
        preload="metadata"
        onPlay={(event) => {
          setPlaying(true);
          announcePlay(event.currentTarget);
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onWaiting={() => setBuffering(true)}
        onPlaying={() => setBuffering(false)}
        onCanPlay={() => setBuffering(false)}
        onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onError={() => {
          setPlaying(false);
          setBuffering(false);
          setMissing((current) => ({ ...current, [language]: true }));
        }}
      />
    </div>
  );
}
