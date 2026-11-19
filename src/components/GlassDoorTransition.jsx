import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, DoorOpen } from 'lucide-react';
import { KolamDivider, KolamFrame } from './HeritageMotifs.jsx';
import { playSound } from '../audio/ambience.js';
import { useI18n } from '../i18n/index.js';

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** One leaf of the double door: frosted glass in a gilded frame, hinged on its outer edge. */
function GlassLeaf({ side, open, label }) {
  const isLeft = side === 'left';
  return (
    <div
      className={`relative h-full w-1/2 transition-transform duration-[1100ms] ease-[cubic-bezier(.65,0,.25,1)] [backface-visibility:hidden] ${
        isLeft ? 'origin-left' : 'origin-right'
      } ${open ? (isLeft ? '[transform:rotateY(-108deg)]' : '[transform:rotateY(108deg)]') : '[transform:rotateY(0deg)]'}`}
    >
      {/* Gilded outer frame */}
      <div className="absolute inset-0 border-[10px] border-[#6b4a20] bg-gradient-to-b from-[#c9a35a]/30 to-[#5a3b16]/30 shadow-[inset_0_0_0_2px_#e8c77a66,0_0_40px_#000a] sm:border-[14px]">
        {/* Glass pane */}
        <div className="absolute inset-3 overflow-hidden rounded-sm border border-white/25 bg-white/10 backdrop-blur-md sm:inset-5">
          <div className="pointer-events-none absolute -inset-y-10 left-[12%] w-16 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          <div className="pointer-events-none absolute -inset-y-10 left-[34%] w-6 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-[#f4d792]/10" />
          {/* Etched lettering */}
          <div className="absolute inset-x-0 top-[18%] flex flex-col items-center gap-3 px-4 text-center text-white/45 [text-shadow:0_1px_0_#0006]">
            <span className="h-px w-16 bg-white/30" />
            <span className="font-serif text-lg tracking-[0.3em] uppercase sm:text-2xl">{label}</span>
            <span className="h-px w-16 bg-white/30" />
          </div>
        </div>
        {/* Brass pull handle near the centre seam */}
        <div
          className={`absolute top-1/2 h-40 w-2.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-[#f7e0a0] via-[#b98a3e] to-[#f2d38b] shadow-[0_0_12px_#f4d79266,0_4px_10px_#000a] sm:h-56 ${
            isLeft ? 'right-4 sm:right-6' : 'left-4 sm:left-6'
          }`}
        />
      </div>
    </div>
  );
}

/**
 * Full-screen double glass door shown before entering a wing.
 * Stages: `closed` (waiting at the door) → `opening` (leaves swing open) → `entering` (fade through).
 * `onEnter` fires as the doors start to open so the room can mount behind them;
 * `onComplete` fires once the doors are out of the way.
 */
export default function GlassDoorTransition({ room, onEnter, onComplete, onCancel }) {
  const [stage, setStage] = useState('closed');
  const { L, T, cl } = useI18n();
  const enterButtonRef = useRef(null);

  useEffect(() => {
    enterButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (stage === 'closed') return undefined;
    const fast = prefersReducedMotion();
    const delay = stage === 'opening' ? (fast ? 0 : 1050) : (fast ? 0 : 450);
    const timer = window.setTimeout(() => {
      if (stage === 'opening') setStage('entering');
      else onComplete();
    }, delay);
    return () => window.clearTimeout(timer);
  }, [stage, onComplete]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && stage === 'closed') onCancel();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [stage, onCancel]);

  const enter = () => {
    setStage('opening');
    playSound('glass-open');
    onEnter();
  };

  const isOpen = stage !== 'closed';

  return (
    <div
      className={`fixed inset-0 z-[1200] overflow-hidden transition-opacity duration-500 ${stage === 'entering' ? 'opacity-0' : 'opacity-100'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="glass-door-title"
    >
      {/* Dim the gallery until the doors open, then let the room show through. */}
      <div className={`absolute inset-0 bg-[#0c0906]/60 transition-opacity duration-700 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />

      {/* Door frame + leaves */}
      <div className={`absolute inset-0 flex [perspective:2200px] transition-transform duration-[1400ms] ease-out ${isOpen ? 'scale-110' : 'scale-100'}`}>
        <GlassLeaf side="left" open={isOpen} label={room.tamil} />
        <GlassLeaf side="right" open={isOpen} label={L(room.title)} />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-[#3a2510] to-[#6b4a20] shadow-[0_4px_18px_#000a] sm:h-8" />

      {/* Entry placard */}
      <div
        className={`absolute inset-0 grid place-items-center p-4 transition-all duration-500 ${
          isOpen ? 'pointer-events-none scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <div className="bg-teak relative w-full max-w-md animate-pop-in rounded-2xl border-2 border-temple-gold/70 px-6 py-8 text-center text-parchment shadow-[0_24px_80px_#000c,inset_0_0_0_4px_#d4a64a1f] sm:px-10">
          <KolamFrame className="text-temple-gold/45" size="size-10 sm:size-12" />
          <span className="text-[10px] font-semibold tracking-[0.25em] text-gold">{T('YOU ARE AT THE DOORS OF', 'நீங்கள் நிற்கும் வாயில்', 'आप इसके द्वार पर हैं')}</span>
          <p lang="ta" className="mt-4 text-lg font-bold text-[#e9a27a]">{room.tamil}</p>
          <h2 id="glass-door-title" lang={cl} className="mt-1 font-serif text-4xl font-bold tracking-wide text-temple-gold-light">{L(room.title)}</h2>
          <KolamDivider className="mx-auto mt-3 block max-w-[200px] text-temple-gold/60" />
          {room.tamilDescription && <p lang="ta" className="mx-auto mt-3 max-w-sm text-[13px] leading-relaxed font-semibold text-[#e9c49a]">{room.tamilDescription}</p>}
          <p lang={cl} className="mx-auto mt-3 max-w-sm text-[13px] leading-relaxed text-[#c9b89b]">{L(room.description)}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              ref={enterButtonRef}
              type="button"
              onClick={enter}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#e4c274] bg-gradient-to-br from-[#f1d58d] to-[#c89b4d] px-6 py-3 text-sm font-bold text-[#211609] shadow-[0_0_24px_#dfb65840] transition duration-300 ease-spring hover:scale-105 active:scale-95 hover:shadow-[0_6px_28px_#dfb65866]"
            >
              <DoorOpen size={17} /> {T('Enter Wing', 'உள்ளே செல்க', 'विंग में प्रवेश करें')}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#70552d] bg-[#1b130b] px-5 py-3 text-sm text-[#dfc89c] transition duration-300 ease-spring hover:scale-105 active:scale-95 hover:border-[#b9904a]"
            >
              <ArrowLeft size={15} /> {T('Back to gallery', 'காட்சியகத்துக்குத் திரும்பு', 'दीर्घा पर लौटें')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
