import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Pause, Volume2 } from 'lucide-react';
import { announcePlay, useSoloAudio } from '../audio/soloAudio.js';
import { mediaUrl } from '../mediaUrl.js';
import { useI18n } from '../i18n/index.js';

/** Made by `npm run build:voiceovers` (scripts/generateVoiceovers.mjs) — ElevenLabs, voice "Rajan". */
export const SHRINE_NARRATION = mediaUrl('/thiruvalluvar-shrine/audio/shrine-narration-rajan-ta.mp3');

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
};

/**
 * "Listen to Narration (Rajan Narrator)": a pill in the Thiruvalluvar Shrine's header that
 * plays the shrine's Tamil voiceover. Once started it grows a progress bar (click to seek) and
 * the elapsed / total time. Pauses when another museum recording starts; hides itself if the
 * recording has not been generated.
 */
export default function ShrineNarration({ className = '' }) {
  const { T } = useI18n();
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [started, setStarted] = useState(false);
  const [missing, setMissing] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  useSoloAudio(audioRef);
  useEffect(() => () => audioRef.current?.pause(), []);

  const label = T('Listen to Narration (Rajan Narrator)', 'விவரிப்பைக் கேளுங்கள் (ராஜன்)', 'कथन सुनें (राजन)');
  const pauseLabel = T('Pause narration', 'விவரிப்பை நிறுத்து', 'कथन रोकें');

  const toggle = () => {
    const audio = audioRef.current;
    if (audio.paused) {
      setStarted(true);
      setBuffering(true);
      audio.play().catch(() => setBuffering(false));
    } else audio.pause();
  };

  const seek = (event) => {
    const audio = audioRef.current;
    if (!duration) return;
    const box = event.currentTarget.getBoundingClientRect();
    audio.currentTime = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width)) * duration;
  };

  if (missing) return null;
  const progress = duration ? (time / duration) * 100 : 0;

  return (
    <div className={`inline-flex shrink-0 items-center gap-2 rounded-full border border-temple-gold/60 bg-teak-dark/90 py-1 pr-1 pl-1 text-temple-gold-light shadow-[0_0_14px_#f4d79222] ${className}`} data-narration="shrine">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? pauseLabel : label}
        title={playing ? pauseLabel : label}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-b from-[#c99a4a] to-[#8a6424] px-3 py-1.5 text-xs font-semibold text-[#1a1108] transition duration-300 ease-spring hover:scale-105 hover:from-[#e7bd6a] active:scale-95"
      >
        {buffering && playing ? <Loader2 size={15} className="animate-spin" /> : playing ? <Pause size={15} /> : <Volume2 size={15} />}
        <span className={started ? 'hidden lg:inline' : 'hidden sm:inline'}>{playing ? pauseLabel : label}</span>
      </button>
      {started && (
        <>
          <div
            role="slider"
            tabIndex={0}
            aria-label={T('Narration position', 'விவரிப்பின் நிலை', 'कथन की स्थिति')}
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(time)}
            onClick={seek}
            onKeyDown={(e) => {
              const audio = audioRef.current;
              if (e.key === 'ArrowRight') audio.currentTime = Math.min(duration, audio.currentTime + 10);
              if (e.key === 'ArrowLeft') audio.currentTime = Math.max(0, audio.currentTime - 10);
            }}
            className="relative h-1.5 w-20 cursor-pointer rounded-full bg-temple-gold/20 sm:w-32"
          >
            <span className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#b8893f] to-[#f7e0a0]" style={{ width: `${progress}%` }} />
          </div>
          <span className="pr-2 text-[10px] tabular-nums text-temple-gold-light/80">{formatTime(time)} / {formatTime(duration)}</span>
        </>
      )}
      <audio
        ref={audioRef}
        src={SHRINE_NARRATION}
        preload="metadata"
        onPlay={(e) => { setPlaying(true); announcePlay(e.currentTarget); }}
        onPause={() => { setPlaying(false); setBuffering(false); }}
        onEnded={() => { setPlaying(false); setTime(0); }}
        onWaiting={() => setBuffering(true)}
        onPlaying={() => setBuffering(false)}
        // The metadata can load before React listens, so the length is also read on every tick.
        onTimeUpdate={(e) => { setTime(e.currentTarget.currentTime); setDuration(e.currentTarget.duration || 0); }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration || 0)}
        onError={() => setMissing(true)}
      />
    </div>
  );
}
