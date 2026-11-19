import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Landmark, X } from 'lucide-react';
import { MONUMENT } from '../../data/centralHall.js';
import { KolamDivider } from '../HeritageMotifs.jsx';
import CICT_LOGO from '../../assets/cict-logo.jpg';
import { useI18n } from '../../i18n/index.js';

const granite = 'bg-[linear-gradient(135deg,#2a2420,#171310_50%,#221c18)]';

/** A person's name (in Tamil too, when given) over their designation. */
function Person({ name, nameTa, designation, size }) {
  const { L, cl } = useI18n();
  return (
    <p className={`font-serif leading-snug font-bold text-[#fbe7b5] ${size}`}>
      {nameTa && <span lang="ta" className="block font-sans text-[0.85em]">{nameTa}</span>}
      <span lang={cl}>{L(name)}</span>
      {designation && <span lang={cl} className="block text-sm font-semibold tracking-wide text-[#d8b77a]">{L(designation)}</span>}
    </p>
  );
}

/** One face's inscription, as set out on the stone: Tamil above English throughout. */
function FaceText({ face }) {
  const { L, T, cl } = useI18n();
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {face.emblem && <img src={CICT_LOGO} alt={T('CICT emblem', 'இலச்சினை', 'CICT प्रतीक-चिह्न')} className="size-24 rounded-full bg-white object-cover shadow-[0_0_0_3px_#d4a64a,0_0_24px_#f4d79244]" />}
      <div>
        <h3 lang="ta" className="text-xl leading-[1.6] font-bold text-[#f2d189] sm:text-2xl">{face.headingTa}</h3>
        <p lang={cl} className="font-serif text-lg font-bold tracking-wide text-[#e9c77f] uppercase sm:text-xl">{L(face.heading)}</p>
        {face.person && <div className="mt-3"><Person {...face.person} size="text-2xl" /></div>}
      </div>
      <KolamDivider className="block w-full max-w-[200px] text-temple-gold/60" />
      {face.credits && (
        <dl className="flex flex-col gap-5">
          {face.credits.map((credit) => (
            <div key={credit.role}>
              <dt>
                <span lang="ta" className="block text-sm font-semibold text-[#d99a6c]">{credit.roleTa}</span>
                <span lang={cl} className="font-serif text-sm font-semibold tracking-[0.2em] text-[#c9a66a] uppercase">{L(credit.role)}</span>
              </dt>
              {credit.people.map((someone) => <dd key={someone.name} className="mt-1"><Person {...someone} size="text-xl" /></dd>)}
            </div>
          ))}
        </dl>
      )}
      {(face.sections ?? []).map((section, i) => (
        <section key={section.title ?? i} className="flex max-w-prose flex-col gap-2">
          {section.title && (
            <h4 className="font-serif text-sm font-bold tracking-[0.18em] text-[#e9c77f] uppercase">
              <span lang="ta" className="font-sans tracking-normal normal-case">{section.titleTa}</span> · <span lang={cl}>{L(section.title)}</span>
            </h4>
          )}
          {section.ta && <p lang="ta" className="text-[15px] leading-[1.9] text-[#efdcb4]">{section.ta}</p>}
          {section.en && <p lang={cl} className="font-serif text-[17px] leading-snug text-[#d8c4a0]">{L(section.en)}</p>}
          {section.items && (
            <ul className="flex flex-col gap-2.5 text-left">
              {section.items.map((item) => (
                <li key={item.en} className="relative pl-5 before:absolute before:top-2 before:left-0 before:size-2 before:rotate-45 before:bg-temple-gold">
                  <span lang="ta" className="block text-[15px] leading-[1.8] text-[#efdcb4]">{item.ta}</span>
                  <span lang={cl} className="block font-serif text-[16px] leading-snug text-[#d8c4a0]">{L(item.en)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}

/** The monolith seen from above, its chosen face lit: where the visitor stands to read it. */
function SidePlan({ faceId }) {
  const lit = (id) => (id === faceId ? '#f4d792' : '#6b5532');
  return (
    <svg viewBox="0 0 60 60" className="size-12 shrink-0" aria-hidden="true">
      <rect x="14" y="20" width="32" height="20" rx="1" fill="#1d1915" stroke="#8c6d3a" strokeWidth="1" />
      <rect x="14" y="40" width="32" height="3" fill={lit('front')} />
      <rect x="14" y="17" width="32" height="3" fill={lit('back')} />
      <rect x="11" y="20" width="3" height="20" fill={lit('left')} />
      <rect x="46" y="20" width="3" height="20" fill={lit('right')} />
      <path d="M30 56 l-4 -6 h8 z" fill="#d4a64a" />
    </svg>
  );
}

/**
 * The monolith's inscriptions to read, face by face: the visitor walks round it with the
 * side tabs, the arrows (or ←/→ keys), and closes it with Escape. `startFace` is the face
 * to begin at.
 */
export function MonumentPanel({ onClose, startFace = 'front' }) {
  const { faces } = MONUMENT;
  const { L, T, cl } = useI18n();
  const [index, setIndex] = useState(() => Math.max(0, faces.findIndex((face) => face.id === startFace)));
  const face = faces[index];
  const closeRef = useRef(null);
  const step = (delta) => setIndex((current) => (current + delta + faces.length) % faces.length);

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      else if (event.key === 'ArrowLeft') step(-1);
      else if (event.key === 'ArrowRight') step(1);
      else return;
      event.preventDefault();
      event.stopPropagation();
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [onClose]); // eslint-disable-line react-hooks/exhaustive-deps -- `step` only sets state

  return (
    <div role="presentation" className="fixed inset-0 z-[1200] flex justify-center overflow-y-auto bg-[#0a0604]/80 px-4 py-6 backdrop-blur-sm" onClick={onClose}>
      {/* Centred by its auto margins, which (unlike centring the column) never push a tall panel's top out of reach. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="monument-title"
        className={`relative my-auto h-fit w-full max-w-2xl animate-pop-in rounded-t-[3rem] rounded-b-xl border-[3px] border-temple-gold/80 ${granite} p-5 shadow-[0_30px_80px_#000d,inset_0_0_0_6px_#120e0b,inset_0_0_0_8px_#d4a64a55] sm:p-8`}
        onClick={(event) => event.stopPropagation()}
      >
        <button ref={closeRef} type="button" onClick={onClose} aria-label={T('Close', 'மூடு', 'बंद करें')} className="touch-target absolute top-4 right-4 grid size-9 cursor-pointer place-items-center rounded-full border border-temple-gold/60 text-temple-gold-light transition hover:bg-temple-gold/20">
          <X size={18} />
        </button>
        <header className="mb-4 flex items-center gap-3 pr-10">
          <SidePlan faceId={face.id} />
          <div>
            <p lang="ta" className="text-sm font-bold text-[#e9a27a]">{MONUMENT.tamil}</p>
            <h2 id="monument-title" lang={cl} className="font-serif text-xl font-bold tracking-wide text-temple-gold-light">{L(MONUMENT.title)}</h2>
          </div>
        </header>

        <div role="tablist" aria-label={T('Faces of the monolith', 'தூணின் பக்கங்கள்', 'स्तंभ के फलक')} className="mb-6 grid grid-cols-4 gap-1.5">
          {faces.map((candidate, i) => (
            <button
              key={candidate.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              onClick={() => setIndex(i)}
              className={`cursor-pointer rounded-lg border px-1 py-1.5 text-center transition ${
                i === index ? 'border-temple-gold-light bg-[#3d2a16] text-[#f8e8c5] shadow-[0_0_14px_#f1c35b44]' : 'border-[#5a4526] text-[#bfa982] hover:border-temple-gold'
              }`}
            >
              <span lang="ta" className="block text-[11px] font-bold">{candidate.sideTa}</span>
              <span lang={cl} className="block text-[11px] font-semibold tracking-wide uppercase">{L(candidate.side)}</span>
            </button>
          ))}
        </div>

        <div role="tabpanel" aria-label={L(face.side)} className="rounded-xl border border-temple-gold/40 px-3 py-6 sm:px-8">
          <FaceText key={face.id} face={face} />
        </div>

        <footer className="mt-5 flex items-center justify-between gap-3">
          <button type="button" onClick={() => step(-1)} className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-temple-gold/60 px-3 py-1.5 text-xs font-semibold text-temple-gold-light transition hover:bg-temple-gold/20">
            <ChevronLeft size={14} /> {L(faces[(index + faces.length - 1) % faces.length].side)}
          </button>
          <span className="text-[11px] text-[#9d8a6a]">{T('Walk round the stone', 'கல்லைச் சுற்றி வாருங்கள்', 'पत्थर के चारों ओर घूमें')} · ← →</span>
          <button type="button" onClick={() => step(1)} className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-temple-gold/60 px-3 py-1.5 text-xs font-semibold text-temple-gold-light transition hover:bg-temple-gold/20">
            {L(faces[(index + 1) % faces.length].side)} <ChevronRight size={14} />
          </button>
        </footer>
      </div>
    </div>
  );
}

/** The monolith as the arched view's centrepiece: a granite shaft on its plinth, chosen to read it. */
export function MonolithStage({ hall, onOpen, className = '' }) {
  const front = MONUMENT.faces[0];
  const { L, T, cl } = useI18n();
  return (
    <div className={`relative flex flex-col items-center justify-end gap-4 rounded-t-[999px] border border-temple-gold/40 bg-[radial-gradient(ellipse_at_50%_35%,#ffcf7a33,#2a160a_60%,#120804)] px-6 pt-14 pb-8 text-center shadow-[inset_0_0_60px_#000c] ${className}`}>
      <button type="button" onClick={onOpen} className="group flex cursor-pointer flex-col items-center transition duration-500 ease-spring hover:-translate-y-1 active:scale-95" aria-label={T('Read the CICT monolith', 'நினைவுத் தூணைப் படியுங்கள்', 'CICT स्तंभ पढ़ें')}>
        <span className="h-0 w-0 border-x-[72px] border-b-[34px] border-x-transparent border-b-temple-gold drop-shadow-[0_0_12px_#f1c35b66]" />
        <span className="h-3 w-[164px] bg-[#3a2f26] shadow-[0_2px_0_#d4a64a]" />
        <span className={`flex h-72 w-36 flex-col items-center gap-2 border-x-2 border-temple-gold/70 ${granite} px-2 pt-4 shadow-[inset_0_0_24px_#000] sm:h-80`}>
          <img src={CICT_LOGO} alt="" className="size-14 rounded-full bg-white object-cover shadow-[0_0_0_2px_#d4a64a]" />
          <span lang="ta" className="text-[11px] leading-[1.7] font-bold text-[#f2d189]">{front.headingTa}</span>
          <span lang={cl} className="font-serif text-[10px] leading-tight font-bold tracking-wide text-[#e9c77f] uppercase">{L(front.heading)}</span>
        </span>
        <span className="h-4 w-48 bg-[#3a2f26] shadow-[0_-2px_0_#d4a64a]" />
        <span className="h-4 w-60 bg-[#2c241d] shadow-[0_-2px_0_#d4a64a]" />
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-temple-gold/70 bg-teak-dark/85 px-3 py-1 text-[11px] font-semibold text-temple-gold-light group-hover:border-temple-gold-light">
          <Landmark size={12} /> {T('Read the monument', 'நினைவுத் தூணைப் படியுங்கள்', 'स्मारक पढ़ें')}
        </span>
      </button>
      <p lang="ta" className="text-sm leading-[1.8] font-bold text-[#e9a27a]">{hall.tamil}</p>
      <p lang={cl} className="max-w-xs font-serif text-lg leading-snug text-temple-gold-light">{L(hall.subtitle ?? hall.title)}</p>
    </div>
  );
}
