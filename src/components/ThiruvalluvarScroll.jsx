import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Shuffle, Star, X } from 'lucide-react';
import { KolamCorner, KolamDivider, TempleBand, WaxSeal } from './HeritageMotifs.jsx';
import KuralCouplet from './KuralCouplet.jsx';
import OlaiSuvadi from './OlaiSuvadi.jsx';
import KuralListenButton from './KuralListenButton.jsx';
import RecitationButton from './RecitationButton.jsx';
import useNarration from '../audio/useNarration.js';
import CICT_LOGO from '../assets/cict-logo.jpg';
import { mediaUrl } from '../mediaUrl.js';
import { languageOf, translate, useI18n } from '../i18n/index.js';

/** The CICT Thiruvalluvar seal (public/UI images), shown on the scroll's parchment. */
const SEAL = mediaUrl('/UI images/f22a5f76-a9e0-4846-ac4e-16a8536ee555.jpg');
import { valluvarStoryRecordings } from '../data/kuralAudio.js';
import { valluvarStory } from '../data/valluvarStory.js';
import { chapterOf, chapters, loadKuralTranslation, loadKurals, SEARCH_LIMIT, searchKurals, TOTAL_KURALS, withTranslation } from '../data/kuralData.js';
import { kuralSections } from '../data/kuralStructure.js';

const scrollEase = 'ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none';
/** The rollers part and the parchment unrolls once the twine has slipped off. */
const unrollTiming = `duration-[1400ms] delay-[450ms] ${scrollEase}`;
const untieTiming = `duration-700 ${scrollEase}`;
const rolledPaperEnd =
  'absolute inset-x-0 h-2.5 rounded-[50%] bg-[repeating-radial-gradient(ellipse_at_center,#b08a55_0_1px,#f1e2bf_1px_3px)] shadow-[inset_0_1px_3px_#0006]';

/** A turned wooden knob with a gilt collar, at either end of a roller. */
function RollerKnob({ bottom = false }) {
  return (
    <div className={`flex w-full items-center ${bottom ? 'flex-col-reverse' : 'flex-col'}`}>
      <span className="h-3.5 w-[78%] rounded-full bg-[radial-gradient(ellipse_at_40%_35%,#d08a4a,#7a3e18_55%,#2a1408)] shadow-[0_2px_4px_#0008]" />
      <span className="h-1 w-[52%] bg-temple-gold shadow-[0_0_4px_#f2d38b88]" />
      <span className="h-3 w-[40%] bg-[linear-gradient(90deg,#2a1408,#8a4f24_40%,#c27a3e_55%,#4a2410)]" />
    </div>
  );
}

/**
 * One rolled end of the scroll: parchment wound on a wooden rod. While the scroll is tied
 * both rollers meet in the middle; they slide out to the edges as it unrolls.
 */
function ScrollRoller({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute -top-7.5 -bottom-7.5 z-10 flex w-9 flex-col drop-shadow-[0_10px_14px_#000a] transition-[translate] sm:w-12 ${unrollTiming} ${className}`} aria-hidden="true">
      <RollerKnob />
      <div className="relative flex-1 bg-[linear-gradient(90deg,#7a5228,#d9bd88_22%,#f8ecd0_42%,#e6cf9c_62%,#9a6e3a_88%,#5a3a1a)]">
        <span className={`${rolledPaperEnd} top-0 -translate-y-1/2`} />
        <span className={`${rolledPaperEnd} bottom-0 translate-y-1/2`} />
      </div>
      <RollerKnob bottom />
    </div>
  );
}

const twine = 'absolute left-1/2 h-[3px] -translate-x-1/2 rounded-full bg-[repeating-linear-gradient(115deg,#d9b779_0_2px,#8a6534_2px_4px)] shadow-[0_1px_2px_#0007]';
const sealHalves = [
  ['[clip-path:polygon(0_0,52%_0,46%_30%,55%_55%,48%_100%,0_100%)]', '-translate-x-5 translate-y-8 -rotate-[28deg]'],
  ['[clip-path:polygon(52%_0,100%_0,100%_100%,48%_100%,55%_55%,46%_30%)]', 'translate-x-5 translate-y-10 rotate-[32deg]'],
];

/**
 * A gilt pointer beside the seal, drawn towards it again and again: a tapered brass
 * shaft ending in an arrowhead, with a lotus-bud tail.
 */
function SealPointer({ opened }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute top-1/2 right-full mr-5 -translate-y-1/2 transition-opacity duration-300 sm:mr-7 ${opened ? 'opacity-0' : ''}`}
    >
      <span className="block animate-point-nudge drop-shadow-[0_0_8px_#f1c35b99] motion-reduce:animate-none">
        <svg viewBox="0 0 64 24" className="h-5 w-14 sm:h-6 sm:w-16">
          <defs>
            <linearGradient id="seal-pointer-gold" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#a8792e" stopOpacity="0.2" />
              <stop offset="0.45" stopColor="#d4a64a" />
              <stop offset="1" stopColor="#f7dc95" />
            </linearGradient>
          </defs>
          {/* Lotus-bud tail, tapered shaft, and arrowhead */}
          <path d="M3 12c2.5-3.2 5.5-3.2 7 0-1.5 3.2-4.5 3.2-7 0z" fill="#d4a64a" opacity="0.75" />
          <path d="M10 10.6 46 11.2v1.6L10 13.4z" fill="url(#seal-pointer-gold)" />
          <path d="M44 4.5 61 12 44 19.5l4-7.5z" fill="#f2d38b" stroke="#8a5a22" strokeWidth="1" strokeLinejoin="round" />
        </svg>
      </span>
    </span>
  );
}

/** Twine bound round both rollers and sealed in wax; it slips off and the seal cracks apart. */
function TiedSeal({ opened }) {
  return (
    <span aria-hidden="true" className={`relative grid size-16 place-items-center sm:size-20 ${opened ? '' : 'animate-bounce-soft motion-reduce:animate-none'}`}>
      <SealPointer opened={opened} />
      <span className={`${twine} top-[calc(50%-8px)] w-18 transition-[translate,rotate,opacity] sm:w-24 ${untieTiming} ${opened ? 'translate-y-10 -rotate-12 opacity-0' : ''}`} />
      <span className={`${twine} top-[calc(50%+5px)] w-18 transition-[translate,rotate,opacity] sm:w-24 ${untieTiming} ${opened ? 'translate-y-14 rotate-[10deg] opacity-0' : ''}`} />
      {sealHalves.map(([crack, fall]) => (
        <span key={crack} className={`absolute inset-0 transition-[translate,rotate,opacity] ${untieTiming} ${crack} ${opened ? `${fall} opacity-0` : ''}`}>
          <WaxSeal src={CICT_LOGO} label="" className="size-full" />
        </span>
      ))}
      <span className="pointer-events-none absolute -inset-2 rounded-full ring-temple-gold-light group-focus-visible:ring-4" />
    </span>
  );
}

/**
 * Loads src/data/thirukkural.json (its own lazily loaded chunk) and, while the museum is in a
 * language other than English or Tamil, the kurals' translation into it (src/data/kurals/<code>.json),
 * attached to each kural as `local`.
 */
function useKurals() {
  const { lang } = useI18n();
  const [state, setState] = useState({ kurals: null, error: null });
  const [translation, setTranslation] = useState({ lang: null, data: null });
  useEffect(() => {
    let cancelled = false;
    loadKurals()
      .then((kurals) => !cancelled && setState({ kurals, error: null }))
      .catch((error) => !cancelled && setState({ kurals: null, error }));
    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    if (lang === 'en' || lang === 'ta' || translation.lang === lang) return undefined;
    let cancelled = false;
    // Without one the kurals simply keep their English meanings.
    loadKuralTranslation(lang).then((data) => !cancelled && setTranslation({ lang, data }), () => {});
    return () => {
      cancelled = true;
    };
  }, [lang, translation.lang]);
  const kurals = useMemo(
    () => (translation.lang === lang && translation.data ? withTranslation(state.kurals, translation.data, lang) : state.kurals),
    [state.kurals, translation, lang],
  );
  return { kurals, error: state.error };
}

const chip = 'rounded-full px-3 py-1 text-[11px] font-semibold';
/** Search, section tabs and chapter picker: a faint amber glass that lets the parchment show through. */
const glassControl = 'border-sepia-light/50 bg-amber-100/20 shadow-[inset_0_1px_2px_#fff8e866,0_0_12px_#d4a64a26] backdrop-blur-[2px]';
const brochureChapterId = (n) => `brochure-chapter-${n}`;

/**
 * The Thirukkural brochure: an at-a-glance index of one section (பால்), its groups
 * (இயல்) and chapters, each chapter a grid of its ten kural numbers. A number opens that
 * kural in the Olai Suvadi; favourites carry a gold dot.
 */
function KuralBrochure({ section, current, favouriteNumbers, onOpen }) {
  const { L, T, cl } = useI18n();
  const first = section.groups[0].chapters[0].start;
  const last = section.groups.at(-1).chapters.at(-1).end;
  return (
    <section key={section.number} className="mt-6 animate-unfold-card" aria-labelledby="brochure-title">
      <div className="text-center">
        <p className="text-[11px] font-bold tracking-[0.2em] text-sepia">{T('THIRUKKURAL BROCHURE', 'திருக்குறள் கையேடு', 'तिरुक्कुरल पुस्तिका')}</p>
        <h3 id="brochure-title" className="mt-0.5 text-lg font-bold text-terracotta-deep">
          {section.tamil} <span lang={cl} className="font-serif font-semibold">· {L(section.transliteration)}</span>
        </h3>
        <p lang={cl} className="font-serif text-xs text-sepia italic">
          {L(section.english)} · {L(`kurals ${first}–${last} · tap a number to open its palm leaf`, `कुरल ${first}–${last} · ताड़पत्र खोलने के लिए कोई संख्या चुनें`)}
        </p>
      </div>

      {section.groups.map((group) => (
        <div key={group.number} className="mt-4">
          <h4 className="flex items-center gap-2 text-[11px] font-bold tracking-[0.12em] text-terracotta">
            <span lang="ta">{group.tamil}</span>
            <span lang={cl} className="font-serif font-semibold tracking-normal text-sepia italic">{L(group.english)}</span>
          </h4>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {group.chapters.map((c) => (
              <div
                key={c.number}
                id={brochureChapterId(c.number)}
                className={`scroll-mt-6 rounded-lg border bg-[#fffaf0]/80 p-2 ${c.number === chapterOf(current).number ? 'border-terracotta shadow-[0_4px_12px_#b4532a33]' : 'border-sepia-light/40'}`}
              >
                <p className="flex min-w-0 items-baseline gap-1.5 text-[11px] leading-tight">
                  <span className="font-bold text-terracotta-deep">{c.number}.</span>
                  <span lang="ta" className="shrink-0 font-semibold text-[#3b2510]">{c.tamil}</span>
                  <span lang={cl} className="truncate font-serif text-sepia italic">{L(c.english)}</span>
                </p>
                <div className="mt-1.5 grid grid-cols-10 gap-1">
                  {Array.from({ length: 10 }, (_, i) => c.start + i).map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => onOpen(n)}
                      aria-label={T(`Open kural ${n}`, `குறள் ${n}-ஐத் திற`, `कुरल ${n} खोलें`)}
                      aria-current={n === current ? 'true' : undefined}
                      className={`relative h-7 cursor-pointer rounded-[4px] text-[10px] font-semibold tabular-nums transition-[scale,background-color,color] duration-300 ease-spring hover:z-10 hover:scale-125 hover:bg-terracotta hover:text-[#fff3dc] active:scale-95 sm:text-[11px] ${
                        n === current ? 'bg-terracotta-deep text-[#fbe7b5]' : 'bg-[#f3e2b8] text-terracotta-deep'
                      }`}
                    >
                      {n}
                      {favouriteNumbers.has(n) && <span className="absolute top-0.5 right-0.5 size-1 rounded-full bg-temple-gold" aria-hidden="true" />}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

/** The story's languages: the toggle's label, the text's `lang`, and the control's words. */
const STORY_LANGUAGES = {
  ta: {
    label: 'தமிழ்',
    labels: { play: 'கதையைக் கேளுங்கள் · Play the story in Tamil', pause: 'கதையை நிறுத்துங்கள் · Pause the Tamil story', unavailable: 'தமிழ் விவரிப்பு விரைவில் · Tamil narration coming soon' },
    status: { idle: 'கேட்டுக்கொண்டே படியுங்கள்', playing: 'கேட்டுக்கொண்டிருக்கிறீர்கள்…', missing: 'தமிழ் விவரிப்பு விரைவில்' },
  },
  en: {
    label: 'English',
    labels: { play: 'Play the story in English', pause: 'Pause the English story', unavailable: 'English narration coming soon' },
    status: { idle: 'Press play to listen while you read', playing: 'Listening… read along below', missing: 'English narration coming soon' },
  },
  // Shown in place of English when the museum is in Hindi. No Hindi recording exists yet;
  // the other languages take their words from their packs (in ValluvarStory, below).
  hi: {
    label: 'हिन्दी',
    labels: { play: 'कहानी हिन्दी में सुनें', pause: 'हिन्दी कहानी रोकें', unavailable: 'हिन्दी वर्णन जल्द आ रहा है' },
    status: { idle: 'पढ़ते हुए सुनने के लिए प्ले दबाएँ', playing: 'सुन रहे हैं… नीचे साथ-साथ पढ़ें', missing: 'हिन्दी वर्णन जल्द आ रहा है' },
  },
};

/**
 * திருவள்ளுவர் கதை: the story of Thiruvalluvar, in Tamil or English. A தமிழ் / English
 * toggle chooses the language of both the text and its recorded narration, and the
 * Olai Suvadi's single Play / Pause medallion plays whichever is chosen. Switching while
 * it plays carries straight on in the other language (from its start, as the two
 * recordings do not run in step). The text scrolls within its own panel.
 */
function ValluvarStory() {
  const { L, T, cl } = useI18n();
  // Tamil, or the visitor's language: English, or Hindi when the museum is in Hindi.
  const [choice, setChoice] = useState('ta');
  const language = choice === 'ta' ? 'ta' : cl;
  const src = valluvarStoryRecordings[language] ?? null;
  const narration = useNarration(src, { continueOnChange: true });
  const { playing } = narration.state;
  const words = STORY_LANGUAGES[language] ?? {
    labels: { play: T('Play the story'), pause: T('Pause the story'), unavailable: T('Narration in this language coming soon') },
    status: { idle: T('Press play to listen while you read'), playing: T('Listening… read along below'), missing: T('Narration in this language coming soon') },
  };
  const isTamil = language === 'ta';
  return (
    <section aria-labelledby="story-title" className={`rounded-2xl border px-4 py-4 sm:px-6 ${glassControl}`}>
      <div className="flex flex-wrap items-center gap-3">
        <RecitationButton state={narration.state} available={Boolean(src)} onToggle={narration.toggle} labels={words.labels} />
        <div className="min-w-0 flex-1">
          <p lang="ta" className="text-sm leading-[1.6] font-bold text-terracotta">திருவள்ளுவர் கதை</p>
          <h3 id="story-title" lang={cl} className="font-serif text-lg leading-tight font-bold text-terracotta-deep">{L('The Story of Thiruvalluvar', 'तिरुवल्लुवर की कहानी')}</h3>
          <p lang={language} className="text-[11px] text-sepia" aria-live="polite">
            {!src ? words.status.missing : playing ? words.status.playing : words.status.idle}
          </p>
        </div>
        {/* Language toggle: a brass-edged pill whose gilded half marks the chosen language. */}
        <div role="group" aria-label={`${T('Story language', 'கதையின் மொழி', 'कहानी की भाषा')} · கதையின் மொழி`} className="flex shrink-0 rounded-full border border-[#8a5a2a]/70 bg-[#f3e2bd]/60 p-1 shadow-[inset_0_1px_3px_#5a3a1a33]">
          {['ta', cl].map((code) => (
            <button
              key={code}
              type="button"
              lang={code}
              onClick={() => setChoice(code === 'ta' ? 'ta' : 'other')}
              aria-pressed={language === code}
              className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-bold transition-[background-color,color,box-shadow,scale] duration-300 ease-spring active:scale-95 ${
                language === code
                  ? 'bg-[radial-gradient(circle_at_35%_30%,#f7dc95,#c4913f_60%,#8a5a22)] text-[#3a2008] shadow-[0_2px_6px_#5a3a1a66,inset_0_1px_#fff6]'
                  : 'text-[#6a3a1a] hover:text-terracotta-deep'
              }`}
            >
              {languageOf(code).label}
            </button>
          ))}
        </div>
      </div>
      <div key={language} className="mt-3 max-h-[22rem] animate-[fade-in_.3s_ease] overflow-y-auto pr-1 [scrollbar-color:#8a5a2a66_transparent] [scrollbar-width:thin]">
        <p lang={language} className={`text-center font-bold text-terracotta-deep ${isTamil ? 'text-[15px] leading-[1.8]' : 'font-serif text-base'}`}>{language === 'ta' ? valluvarStory.title.ta : translate(valluvarStory.title.en, valluvarStory.title.hi, language)}</p>
        <KolamDivider className="mx-auto my-3 block w-full max-w-[140px] text-sepia-light/70" />
        <div lang={language} className={`flex flex-col gap-3 ${isTamil ? 'text-[15px] leading-[1.9]' : 'font-serif text-base leading-[1.75]'}`}>
          {(language === 'ta' ? valluvarStory.ta : valluvarStory.en.map((paragraph) => translate(paragraph, undefined, language))).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </div>
    </section>
  );
}

/**
 * The Thiruvalluvar scroll. It opens rolled and tied with a wax seal; a click unties it
 * and the rollers part to unroll the parchment. Inside: narration, then a brochure of all
 * 1330 Thirukkural couplets (src/data/thirukkural.json) — search, browse by பால் and
 * அதிகாரம். Choosing a kural (from the brochure, a search, or the student favourites)
 * opens it in the Olai Suvadi palm-leaf reader.
 *
 * `startReading` (a kural number) opens straight into the Olai Suvadi, as the Manuscripts
 * Library does; closing the leaves then closes the scroll too.
 */
export default function ThiruvalluvarScroll({ onClose, startReading = null }) {
  const { L, T, cl } = useI18n();
  const { kurals, error } = useKurals();
  const [number, setNumber] = useState(startReading ?? 391);
  const [query, setQuery] = useState('');
  const [opened, setOpened] = useState(Boolean(startReading));
  const [reading, setReading] = useState(Boolean(startReading));
  const closeReader = () => (startReading ? onClose() : setReading(false));
  const closeRef = useRef(null);
  const untieRef = useRef(null);

  const untie = () => {
    setOpened(true);
    closeRef.current?.focus();
  };

  const chapter = chapterOf(number);
  const favourites = useMemo(() => (kurals ?? []).filter((k) => k.studentMeaning), [kurals]);
  const favouriteNumbers = useMemo(() => new Set(favourites.map((k) => k.number)), [favourites]);
  const results = useMemo(() => (kurals && query ? searchKurals(kurals, query) : []), [kurals, query]);

  /** Opens a kural in the Olai Suvadi reader, which announces its அதிகாரம் and recites it. */
  const openLeaf = (n) => {
    setQuery('');
    setNumber(n);
    setReading(true);
  };
  /** Shows a kural's chapter in the brochure, without opening it. */
  const showInBrochure = (n) => {
    setQuery('');
    setNumber(n);
    requestAnimationFrame(() => document.getElementById(brochureChapterId(chapterOf(n).number))?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
  };
  const surprise = () => openLeaf(1 + Math.floor(Math.random() * TOTAL_KURALS));

  const keyHandler = useRef();
  keyHandler.current = (event) => {
    if (event.key === 'Escape') {
      if (reading) closeReader();
      else onClose();
      return;
    }
    if (!reading || (event.target instanceof HTMLElement && event.target.closest('input, select, textarea'))) return;
    if (event.key === 'ArrowRight') setNumber((n) => (n % TOTAL_KURALS) + 1);
    else if (event.key === 'ArrowLeft') setNumber((n) => ((n - 2 + TOTAL_KURALS) % TOTAL_KURALS) + 1);
  };
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    untieRef.current?.focus();
    const onKeyDown = (event) => keyHandler.current(event);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[1300] grid animate-[fade-in_.25s_ease] place-items-center overflow-y-auto bg-[#0c0906]/80 px-6 py-10 backdrop-blur-sm sm:px-10"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section role="dialog" aria-modal="true" aria-labelledby="scroll-title" inert={reading} className="@container relative w-full max-w-3xl">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={T('Close the scroll', 'சுருளை மூடு', 'पत्र बंद करें')}
          className="absolute -top-4 right-8 z-30 grid size-10 cursor-pointer place-items-center rounded-full border border-temple-gold-light bg-teak-dark text-temple-gold-light shadow-[0_6px_16px_#000a] transition-[scale] duration-300 ease-spring hover:scale-115 hover:animate-wiggle active:scale-90 sm:right-12"
        >
          <X size={18} />
        </button>

        {/* The rolled ends: they meet in the middle while tied, then slide out to the edges. */}
        <ScrollRoller className={`-left-4.5 sm:-left-6 ${opened ? 'translate-x-0' : 'translate-x-[calc(50cqw_-_50%)]'}`} />
        <ScrollRoller className={`-right-4.5 sm:-right-6 ${opened ? 'translate-x-0' : '-translate-x-[calc(50cqw_-_50%)]'}`} />

        <button
          ref={untieRef}
          type="button"
          onClick={untie}
          disabled={opened}
          aria-label={T('Untie the scroll and open it', 'சுருளை அவிழ்த்துத் திற', 'पत्र की डोरी खोलकर उसे खोलें')}
          className={`scroll-untie group absolute inset-0 z-20 flex cursor-pointer flex-col items-center justify-center gap-6 outline-none disabled:pointer-events-none`}
        >
          <TiedSeal opened={opened} />
          <span
            className={`rounded-full border border-temple-gold/60 bg-teak-dark/90 px-4 py-1.5 text-center text-xs text-temple-gold-light shadow-[0_6px_16px_#000a] transition-opacity duration-300 ${opened ? 'opacity-0' : ''}`}
            aria-hidden="true"
          >
            <span lang={cl}>{L('Tap the seal to open', 'खोलने के लिए मुहर छुएँ')}</span> · <span lang="ta">திறக்கத் தொடவும்</span>
          </span>
        </button>

        {/* Antiqued parchment with torn edges: it unrolls outwards from the middle. */}
        <div className="drop-shadow-[0_24px_40px_#000c]">
          <div
            inert={!opened}
            className={`bg-parchment-letter mask-torn-edges relative h-[calc(100dvh-9rem)] max-h-[60rem] overflow-y-auto px-9 pt-10 pb-6 text-[#3b2510] shadow-[inset_0_0_60px_#8a5a2a66,inset_0_0_12px_#5a3a1a55] transition-[clip-path] sm:px-16 ${unrollTiming} ${
              opened ? '[clip-path:inset(0)]' : '[clip-path:inset(0_50%)]'
            }`}
          >
            <KolamCorner className="pointer-events-none absolute top-6 right-7 size-12 -scale-x-100 text-sepia-light/60 sm:right-11" />

            {/*
              The CICT Thiruvalluvar seal, pressed into the parchment's top-left corner like a
              wax seal, rimmed in gilt: the whole round emblem, large enough to read the names
              round its rim. On wider screens it stands in the header's left column, with an
              equal empty column on the right so the title stays centred and clear of it; on
              narrow screens it sits centred above the title.
            */}
            <header className="text-center sm:grid sm:grid-cols-[9rem_1fr_9rem] sm:items-center sm:gap-3 lg:grid-cols-[10rem_1fr_10rem]">
              <span className="mx-auto mb-3 block size-32 overflow-hidden rounded-full border-[3px] border-[#b8893f] bg-[#f5ead2] shadow-[0_0_0_2px_#6e3a12,0_6px_14px_#5a3a1a66] sm:m-0 sm:size-36 lg:size-40">
                <img src={SEAL} alt={T('CICT Thiruvalluvar seal', 'செம்மொழி நிறுவனத்தின் திருவள்ளுவர் முத்திரை', 'CICT तिरुवल्लुवर मुहर')} className="size-full object-cover object-center mix-blend-multiply" />
              </span>
              <div>
                <p className="text-sm font-bold text-terracotta">திருவள்ளுவர் · திருக்குறள்</p>
                <h2 id="scroll-title" lang={cl} className="mt-1 font-serif text-3xl leading-tight font-bold text-terracotta-deep sm:text-4xl">{L('Wisdom of Thiruvalluvar', 'तिरुवल्लुवर का ज्ञान')}</h2>
                <p lang={cl} className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-sepia sm:text-sm">
                  {cl === 'hi' ? (
                    <><b>133 अध्यायों</b> में सभी <b>1,330 दोहे</b> — हर एक केवल दो छोटी पंक्तियाँ, फिर भी आज के जीवन के लिए सीख से भरा।</>
                  ) : cl === 'en' ? (
                    <>All <b>1,330 couplets</b> in <b>133 chapters</b> — each just two short lines, and still full of advice for life today.</>
                  ) : (
                    L('All 1,330 couplets in 133 chapters — each just two short lines, and still full of advice for life today.')
                  )}
                </p>
              </div>
            </header>

            <div className="mt-5">
              <ValluvarStory />
            </div>

            <TempleBand className="mt-6 text-sepia-light/60" />

            {/* Explorer toolbar: search, sections, chapters */}
            <div className="mt-5 space-y-3">
              <label className={`flex items-center gap-2 rounded-full border-2 px-4 py-2 transition-[border-color,box-shadow] duration-300 focus-within:border-temple-gold focus-within:shadow-[0_0_16px_#d4a64a66] ${glassControl}`}>
                <Search size={16} className="shrink-0 text-terracotta" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && results[0]) openLeaf(results[0].number);
                  }}
                  placeholder={`${T('Kural number or word', 'குறள் எண் அல்லது சொல்', 'कुरल संख्या या शब्द')} · எண் அல்லது சொல்`}
                  aria-label={T('Search the Thirukkural', 'திருக்குறளில் தேடு', 'तिरुक्कुरल में खोजें')}
                  className="min-w-0 flex-1 appearance-none border-none bg-transparent p-0 text-sm text-[#3b2510] shadow-none outline-none placeholder:text-sepia-light focus:outline-none"
                  disabled={!kurals}
                />
              </label>

              <div className="grid grid-cols-3 gap-2" role="group" aria-label={T('Sections', 'பால்கள்', 'भाग')}>
                {kuralSections.map((section) => {
                  const first = section.groups[0].chapters[0].start;
                  const last = section.groups.at(-1).chapters.at(-1).end;
                  const current = chapter.section.number === section.number;
                  return (
                    <button
                      key={section.number}
                      type="button"
                      onClick={() => showInBrochure(first)}
                      aria-pressed={current}
                      className={`cursor-pointer rounded-xl border-2 px-2 py-2 text-center transition-[scale,background-color,border-color] duration-300 ease-spring hover:scale-105 active:scale-95 disabled:cursor-default disabled:opacity-50 ${
                        current ? 'border-terracotta bg-terracotta text-[#fff3dc] shadow-[0_6px_14px_#b4532a55]' : `${glassControl} text-terracotta-deep hover:border-temple-gold hover:shadow-[0_0_14px_#d4a64a55]`
                      }`}
                    >
                      <span className="block text-xs font-bold sm:text-sm">{section.tamil}</span>
                      <span lang={cl} className="block font-serif text-[11px] sm:text-xs">
                        {L(section.english)} · {first}–{last}
                      </span>
                    </button>
                  );
                })}
              </div>

              <select
                value={chapter.number}
                onChange={(event) => showInBrochure(chapters[Number(event.target.value) - 1].start)}
                aria-label={T('Choose a chapter', 'அதிகாரத்தைத் தேர்ந்தெடு', 'अध्याय चुनें')}
                className={`w-full cursor-pointer rounded-xl border-2 px-3 py-2 text-sm text-[#3b2510] outline-none transition-[border-color,box-shadow] duration-300 focus:border-temple-gold focus:shadow-[0_0_16px_#d4a64a66] disabled:opacity-50 [&_optgroup]:bg-[#f1e2bf] [&_option]:bg-[#f7ead0] ${glassControl}`}
              >
                {chapter.section.groups.map((group) => (
                  <optgroup key={group.number} label={`${group.tamil} · ${L(group.english)}`}>
                    {group.chapters.map((c) => (
                      <option key={c.number} value={c.number}>
                        {c.number}. {c.tamil} — {L(c.english)} ({c.start}–{c.end})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {query ? (
              <div className="mt-5" aria-live="polite">
                <p className="mb-2 text-xs font-semibold text-sepia">
                  {results.length === 0
                    ? T('No kurals found — try another word or a number from 1 to 1330.', 'குறள் எதுவும் கிடைக்கவில்லை — வேறு சொல்லையோ 1 முதல் 1330 வரையிலான எண்ணையோ தேடுங்கள்.', 'कोई कुरल नहीं मिला — कोई दूसरा शब्द या 1 से 1330 तक की संख्या आज़माएँ।')
                    : T(`${results.length}${results.length === SEARCH_LIMIT ? '+' : ''} kurals found`, `${results.length}${results.length === SEARCH_LIMIT ? '+' : ''} குறள்கள் கிடைத்தன`, `${results.length}${results.length === SEARCH_LIMIT ? '+' : ''} कुरल मिले`)}
                </p>
                <ul className="space-y-2">
                  {results.map((result) => (
                    <li key={result.number} className="relative">
                      <KuralListenButton number={result.number} compact className="absolute top-2 right-2 z-[1] sm:hidden" />
                      <KuralListenButton number={result.number} className="absolute top-2 right-2 z-[1] max-sm:hidden" />
                      <button
                        type="button"
                        onClick={() => openLeaf(result.number)}
                        className="flex w-full cursor-pointer items-start gap-3 rounded-xl border border-sepia-light/50 bg-[#fffaf0] py-2 pr-12 pl-3 text-left sm:pr-40 transition-[scale,border-color] duration-300 ease-spring hover:scale-[1.02] hover:border-terracotta"
                      >
                        <span className={`${chip} mt-0.5 shrink-0 bg-terracotta-deep text-[#fbe7b5]`}>{result.number}</span>
                        <span className="min-w-0 flex-1">
                          <KuralCouplet kural={result} as="span" className="block text-sm font-bold text-terracotta-deep" />
                          {result.local ? (
                            <span lang={result.local.lang} className="block truncate text-sm text-sepia">{result.local.meaning}</span>
                          ) : (
                            <span lang="en" className="block truncate font-serif text-sm text-sepia italic">{result.translation}</span>
                          )}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <>
                {error && (
                  <p className="mt-6 text-center text-sm text-terracotta">
                    {T('The Thirukkural could not be opened just now. Please close the scroll and try again.', 'திருக்குறளை இப்போது திறக்க இயலவில்லை. சுருளை மூடி மீண்டும் முயலுங்கள்.', 'तिरुक्कुरल अभी नहीं खुल सका। कृपया पत्र बंद करके फिर से प्रयास करें।')}
                  </p>
                )}
                <KuralBrochure section={chapter.section} current={number} favouriteNumbers={favouriteNumbers} onOpen={openLeaf} />
              </>
            )}

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={surprise}
                disabled={!kurals}
                className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-terracotta-deep bg-terracotta px-5 py-2 text-xs font-bold text-[#fff3dc] shadow-[0_6px_14px_#b4532a55] transition-[scale] duration-300 ease-spring hover:scale-105 active:scale-95"
              >
                <Shuffle size={14} className="transition-[rotate] duration-500 ease-spring group-hover:rotate-180" /> {T('Surprise me with a Kural!', 'ஏதேனும் ஒரு குறளைக் காட்டு!', 'कोई भी एक कुरल दिखाएँ!')}
              </button>
            </div>

            <div className="mt-6 rounded-xl border border-sepia-light/50 bg-[#fffaf0]/70 p-3">
              <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.15em] text-terracotta-deep">
                <Star size={13} className="fill-temple-gold text-temple-gold" /> <span lang={cl}>{L('STUDENT FAVOURITES', 'विद्यार्थियों की पसंद')}</span> · <span lang="ta">மாணவர் விருப்பம்</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {favourites.map((item) => (
                  <button
                    key={item.number}
                    type="button"
                    onClick={() => openLeaf(item.number)}
                    className={`${chip} cursor-pointer border transition-[scale] duration-300 ease-spring hover:scale-110 active:scale-95 ${
                      item.number === number ? 'border-terracotta bg-terracotta text-[#fff3dc]' : 'border-sepia-light/70 bg-white/60 text-terracotta-deep'
                    }`}
                  >
                    {item.number} · {L(item.chapter.english)}
                  </button>
                ))}
              </div>
            </div>

            {/* Sealed with the institute's stamp */}
            <footer className="mt-6 flex justify-center pb-8">
              <div className={opened ? 'animate-seal-press' : 'opacity-0'}>
                <WaxSeal src={CICT_LOGO} label={T('Seal of the Central Institute of Classical Tamil', 'செம்மொழித் தமிழாய்வு மத்திய நிறுவனத்தின் முத்திரை', 'केंद्रीय शास्त्रीय तमिल संस्थान की मुहर')} className="size-24 sm:size-28" />
              </div>
            </footer>
          </div>
        </div>
      </section>

      {reading && <OlaiSuvadi kurals={kurals} error={error} number={number} onSelect={setNumber} onClose={closeReader} />}
    </div>
  );
}
