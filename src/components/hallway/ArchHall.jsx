import React, { Suspense, lazy, useEffect, useState } from 'react';
import { AlertTriangle, ChevronRight, RotateCcw } from 'lucide-react';
import { StatueLoadingBadge } from './StatueLoadingBadge.jsx';

/*
 * The statue's stage (React Three Fiber, drei, and its own copy of the model) loads only when
 * this view is first shown: most visitors stay in the 3D hall, which has the statue already.
 */
const StatueStage = lazy(() => import('./StatueStage.jsx'));
const LazyStatueStage = ({ className, ...props }) => (
  <Suspense fallback={<div className={`relative ${className}`}><StatueLoadingBadge /></div>}>
    <StatueStage className={className} {...props} />
  </Suspense>
);
import { MonolithStage } from './Monolith.jsx';
import { Deepam, KolamDivider, LotusBorder, PaintedCeilingBand, TempleFrieze } from '../HeritageMotifs.jsx';
import { GlowFireflies } from '../Fireflies.jsx';
import { collectionSummary } from '../../data/roomBooks.js';
import { useI18n } from '../../i18n/index.js';

/** True on wide screens; only one layout (and so one statue canvas) is ever mounted. */
function useWideLayout() {
  const query = '(min-width: 1024px)';
  const [wide, setWide] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setWide(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return wide;
}


/**
 * One wing as a carved, gilded arch. The lit window (the wing's colour glowing behind its
 * Tamil emblem word) and the caption below are separate blocks, so text never runs into
 * the window's edge however short the card gets.
 */
function ArchCard({ wing, onEnter }) {
  const { lang, L, T, cl } = useI18n();
  return (
    <button
      type="button"
      onClick={onEnter}
      className="group relative flex min-h-[230px] w-full cursor-pointer flex-col items-stretch overflow-hidden rounded-t-[999px] rounded-b-xl border-[3px] border-temple-gold/80 bg-teak p-3 text-center shadow-[0_16px_34px_#000b,inset_0_0_0_4px_#2a1408] transition duration-500 ease-spring hover:-translate-y-1.5 hover:scale-[1.03] hover:border-temple-gold-light hover:shadow-[0_0_34px_#f1c35b55,0_18px_36px_#000c] active:scale-95 lg:min-h-[180px] lg:flex-1"
    >
      {/* The lit room beyond the arch */}
      <span
        className="relative flex min-h-[84px] flex-1 items-center justify-center rounded-t-[999px] border border-temple-gold/50 px-2 pt-4 pb-2 opacity-90 shadow-[inset_0_0_30px_#000c] transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(ellipse at 50% 30%, ${wing.accent}ee, ${wing.accent}66 55%, #120804 100%)` }}
      >
        <span className="max-w-full text-[clamp(1.05rem,5.2vw,1.5rem)] leading-tight font-bold break-words text-[#fbe7b5] drop-shadow-[0_2px_8px_#000] transition-transform duration-500 ease-spring group-hover:scale-110 sm:text-3xl" lang="ta">
          {wing.glyph}
        </span>
      </span>

      <span className="mt-2 flex flex-col items-center">
        <span lang="ta" className="text-xs font-bold text-[#e9a27a] sm:text-sm">{wing.tamil}</span>
        <span lang={cl} className="font-serif text-base leading-tight font-bold tracking-wide text-temple-gold-light sm:text-lg">{L(wing.title)}</span>
        <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-temple-gold/60 bg-teak-dark/80 px-3 py-1 text-[10px] font-semibold text-[#ead8ae] transition-colors group-hover:border-temple-gold-light group-hover:text-temple-gold-light">
          {wing.passage ? collectionSummary(wing, lang) : `${T('Enter', 'உள்ளே', 'प्रवेश')} · ${collectionSummary(wing, lang)}`} <ChevronRight size={11} />
        </span>
      </span>
    </button>
  );
}

/** The centrepiece of a hall without the statue: a great lamp glowing on a stone dais. */
function LampStage({ hall, className = '' }) {
  const { L, cl } = useI18n();
  return (
    <div className={`relative flex flex-col items-center justify-center gap-4 rounded-t-[999px] border border-temple-gold/40 bg-[radial-gradient(ellipse_at_50%_35%,#ffcf7a33,#2a160a_60%,#120804)] px-6 pt-16 pb-8 text-center shadow-[inset_0_0_60px_#000c] ${className}`}>
      <Deepam className="h-56 drop-shadow-[0_0_30px_#f1c35b66] sm:h-72" />
      <p lang="ta" className="text-sm leading-[1.8] font-bold text-[#e9a27a]">{hall.tamil}</p>
      <p lang={cl} className="max-w-xs font-serif text-lg leading-snug text-temple-gold-light">{L(hall.subtitle ?? hall.title)}</p>
    </div>
  );
}

/**
 * A hall as a carved arcade: a gilded arch per wing around its centrepiece — the
 * Thiruvalluvar monument, the CICT monolith, or a great lamp. Used as the "Arches" view,
 * and automatically when the 3D hall cannot run. On wide screens the arches flank the
 * centrepiece, half on each side; on smaller screens it leads and the arches follow in a
 * two-column grid. The corridor arches (wings with `passage`) lead to the other halls.
 * - `notice`: why the 3D view is unavailable (shown with `onRetry`), or null.
 * - `onOpenMonument`: the monolith was chosen, to read its faces.
 * - `active`: false while a room or the scroll covers the hall; the statue then stops drawing.
 */
export default function ArchHall({ hall, wings: allWings, onEnterWing, onMeetValluvar, onOpenMonument, notice, onRetry, reducedMotion, active = true }) {
  const { L, T, cl } = useI18n();
  const wings = allWings.filter((wing) => !wing.alcove); // closed arches have nothing to enter
  const half = Math.ceil(wings.length / 2);
  const left = wings.slice(0, half);
  const right = wings.slice(half);
  const card = (wing) => <ArchCard key={wing.id} wing={wing} onEnter={() => onEnterWing(wing.id)} />;
  const wide = useWideLayout();
  const hasStatue = hall.centrepiece === 'statue';
  const centrepiece = (className) => {
    if (hasStatue) return <LazyStatueStage onOpen={onMeetValluvar} reducedMotion={reducedMotion} active={active} className={className.statue} />;
    if (hall.centrepiece === 'monolith') return <MonolithStage hall={hall} onOpen={onOpenMonument} className={className.stage} />;
    return <LampStage hall={hall} className={className.stage} />;
  };

  return (
    <div className="absolute inset-0 overflow-y-auto bg-[radial-gradient(ellipse_at_50%_20%,#3a2210,#160b05_60%,#0a0503)]">
      {/* The painted ceiling and a carved frieze, matching the 3D hall. */}
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <PaintedCeilingBand className="absolute inset-x-0 top-0" />
        <div className="absolute inset-x-0 top-[84px]">
          <TempleFrieze className="block text-[#b8a07e]/50" />
          <div className="h-12 bg-gradient-to-b from-[#0a0503]/75 to-transparent" />
        </div>
      </div>
      <div className="pointer-events-none fixed inset-0">
        <GlowFireflies count={5} seed={29} />
      </div>

      {/* Starts below the painted ceiling band and frieze at the top of the screen (about 190px). */}
      <div className="relative mx-auto flex min-h-full max-w-6xl flex-col px-4 pt-48 pb-8 sm:px-6">
        <header className="mb-8 flex flex-col items-center gap-2 text-center">
          <p lang="ta" className="text-sm leading-[1.8] font-bold text-[#e9a27a]">{hall.tamil}</p>
          <h2 lang={cl} className="font-serif text-2xl leading-snug font-bold tracking-wide text-temple-gold-light sm:text-3xl">{L(hall.title)}</h2>
          <KolamDivider className="mt-2 block w-full max-w-[220px] text-temple-gold/60" />
        </header>

        {notice && (
          <div className="mx-auto mb-5 flex max-w-xl flex-wrap items-center justify-center gap-3 rounded-xl border border-temple-gold/50 bg-teak-dark/80 px-4 py-2.5 text-center text-xs text-[#ead8ae]" role="status">
            <AlertTriangle size={15} className="shrink-0 text-temple-gold-light" />
            <span>{notice}</span>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-temple-gold-light px-3 py-1 font-semibold text-temple-gold-light transition duration-300 ease-spring hover:scale-105 active:scale-95"
              >
                <RotateCcw size={12} /> {T('Try the 3D hall again', 'முப்பரிமாணக் கூடத்தை மீண்டும் முயலுங்கள்', '3D कक्ष फिर से आज़माएँ')}
              </button>
            )}
          </div>
        )}

        {wide ? (
          /* Wide screens: arches flank the statue. */
          <div className="grid flex-1 grid-cols-[1fr_minmax(360px,1.25fr)_1fr] gap-6">
            <div className="flex flex-col gap-5">{left.map(card)}</div>
            {centrepiece({ statue: 'min-h-[520px]', stage: 'min-h-[520px]' })}
            <div className="flex flex-col gap-5">{right.map(card)}</div>
          </div>
        ) : (
          /* Phones and tablets: the centrepiece first, then a grid of arches. */
          <div className="flex flex-col gap-6">
            {centrepiece({ statue: 'mx-auto h-[min(68vh,520px)] w-full max-w-md', stage: 'mx-auto w-full max-w-md' })}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">{wings.map(card)}</div>
          </div>
        )}

        <LotusBorder className="mt-8 block text-temple-gold/40" />
      </div>
    </div>
  );
}
