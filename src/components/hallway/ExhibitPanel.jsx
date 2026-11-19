import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useI18n } from '../../i18n/index.js';

/**
 * The card for a hall's centrepiece model (HALL_EXHIBITS in data/hallExhibits.js), opened
 * by clicking or tapping the model, its label, or the header button: its Tamil and English
 * names, what it is, and the curators' text in both languages. Closes with Escape, the
 * close button, or a click outside it.
 */
export function ExhibitPanel({ exhibit, onClose }) {
  const closeRef = useRef(null);
  const { L, T, cl } = useI18n();

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      onClose();
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [onClose]);

  return (
    <div role="presentation" className="fixed inset-0 z-[1200] flex justify-center overflow-y-auto bg-[#0a0604]/80 px-4 py-6 backdrop-blur-sm" onClick={onClose}>
      {/* Centred by its auto margins, which (unlike centring the column) never push a tall panel's top out of reach. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="exhibit-title"
        className="relative my-auto h-fit w-full max-w-xl animate-pop-in rounded-t-[3rem] rounded-b-xl border-[3px] border-temple-gold/80 bg-[linear-gradient(160deg,#3a2414,#1c110a_55%,#2a1a0e)] p-5 shadow-[0_30px_80px_#000d,inset_0_0_0_6px_#120b06,inset_0_0_0_8px_#d4a64a55] sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button ref={closeRef} type="button" onClick={onClose} aria-label={T('Close', 'மூடு', 'बंद करें')} className="touch-target absolute top-4 right-4 grid size-9 cursor-pointer place-items-center rounded-full border border-temple-gold/60 text-temple-gold-light transition hover:bg-temple-gold/20">
          <X size={18} />
        </button>
        <header className="mb-5 pr-10 text-center sm:pl-10">
          <p lang="ta" className="text-base leading-[1.8] font-bold text-[#e9a27a]">{exhibit.ta}</p>
          <h2 id="exhibit-title" lang={cl} className="font-serif text-2xl leading-tight font-bold tracking-wide text-temple-gold-light">{L(exhibit.title)}</h2>
          {exhibit.detail && <p lang={cl} className="mt-1 text-[11px] font-semibold tracking-[0.18em] text-[#bfa982] uppercase">{L(exhibit.detail)}</p>}
        </header>
        <div className="flex flex-col gap-4 rounded-xl border border-temple-gold/40 px-4 py-5 sm:px-6">
          <p lang="ta" className="text-[14px] leading-[1.95] text-[#e9c49a]">{exhibit.taText}</p>
          <div className="h-px bg-gradient-to-r from-transparent via-temple-gold/50 to-transparent" aria-hidden="true" />
          <p lang={cl} className="font-serif text-[16px] leading-relaxed text-[#ead9b8]">{L(exhibit.en)}</p>
        </div>
      </div>
    </div>
  );
}
