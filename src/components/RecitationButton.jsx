import React from 'react';
import { Pause, Play } from 'lucide-react';
import { useI18n } from '../i18n/index.js';

/**
 * The single Play / Pause control on a palm leaf: a brass medallion, its terracotta ring
 * filling as the recording plays and a soft halo breathing while it does. The Olai Suvadi
 * uses it for a kural's recitation (a small அதிகாரம் tag shows while the chapter's
 * introduction plays); the artefact viewer uses it for narration, with its own `labels`.
 */
export default function RecitationButton({ state, available, onToggle, labels: given }) {
  const { T } = useI18n();
  const labels = given ?? {
    play: T('Play the recitation', 'ஓதலை இயக்கு', 'पाठ चलाएँ'),
    pause: T('Pause the recitation', 'ஓதலை நிறுத்து', 'पाठ रोकें'),
    unavailable: T('Recitation coming soon', 'ஓதல் விரைவில்', 'पाठ जल्द आ रहा है'),
  };
  const radius = 21;
  const circumference = 2 * Math.PI * radius;
  const { playing, part, progress } = state;
  const label = !available ? labels.unavailable : playing ? labels.pause : labels.play;
  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={onToggle}
        disabled={!available}
        aria-label={label}
        aria-pressed={available ? playing : undefined}
        title={label}
        className="relative grid size-11 cursor-pointer place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#f7dc95,#c4913f_55%,#7a5218)] text-[#3a2008] shadow-[0_3px_8px_#0007,inset_0_1px_#fff6] ring-1 ring-[#6a3a1a]/60 transition-[scale,box-shadow] duration-300 ease-spring hover:scale-110 hover:shadow-[0_0_18px_#f1c35b99] active:scale-90 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:scale-100"
      >
        {playing && <span className="absolute -inset-1 animate-halo rounded-full border-2 border-[#d4a64a] motion-reduce:animate-none" aria-hidden="true" />}
        <svg viewBox="0 0 48 48" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
          <circle cx="24" cy="24" r={radius} fill="none" stroke="#3a200833" strokeWidth="2.5" />
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke="#7d2e14"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            className="transition-[stroke-dashoffset] duration-300 ease-linear"
          />
        </svg>
        <Play size={17} fill="currentColor" className={`absolute ml-0.5 transition-[scale,opacity,rotate] duration-300 ease-spring ${playing ? 'scale-0 rotate-90 opacity-0' : 'scale-100 opacity-100'}`} />
        <Pause size={17} fill="currentColor" className={`absolute transition-[scale,opacity,rotate] duration-300 ease-spring ${playing ? 'scale-100 opacity-100' : 'scale-0 -rotate-90 opacity-0'}`} />
      </button>
      {part === 'intro' && playing && (
        <span lang="ta" className="animate-pulse rounded-full bg-[#7d2e14] px-2 py-0.5 text-[10px] font-semibold text-[#fbe7b5]">அதிகாரம்</span>
      )}
    </span>
  );
}
