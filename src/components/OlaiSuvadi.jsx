import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Lightbulb, Loader2, Pause, Search, Volume2 } from 'lucide-react';
import KuralCouplet from './KuralCouplet.jsx';
import RecitationButton from './RecitationButton.jsx';
import useRecitation, { hasRecitation } from '../audio/useRecitation.js';
import useNarration from '../audio/useNarration.js';
import { chapterOf, machineLocal, searchKurals, TOTAL_KURALS } from '../data/kuralData.js';
import { englishMeaning, kuralHindiMeaningRecording, kuralMeaningRecording } from '../data/kuralAudio.js';
import { languageOf, useI18n } from '../i18n/index.js';

const READER_RESULTS = 8;
const ease = 'ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none';
/** How long the tied bundle rests before the cord slips off. */
const TIED_PAUSE = 450;

/** Both cord holes punched through every leaf and cover, where the binding cords pass. */
const holes = ['left-[7%]', 'left-[93%]'];
const twine = 'bg-[repeating-linear-gradient(25deg,#d9b779_0_2px,#8a6534_2px_4px)]';
const leafShape = 'rounded-[40px/50%] px-[12%]';

function CordHoles() {
  return holes.map((position) => (
    <span key={position} className={`absolute top-1/2 ${position} size-2.5 -translate-1/2 rounded-full bg-[#8a6534] ring-2 ring-[#3a1d0a]/80`} aria-hidden="true" />
  ));
}

/** A wooden cover board, shaped like the leaves it protects. */
function CoverBoard({ children, className = '' }) {
  return (
    <div className={`bg-teak relative flex min-h-8 items-center justify-center py-1.5 shadow-[inset_0_0_0_1px_#d4a64a55,inset_0_2px_0_#ffffff1a,0_6px_14px_#000a] ${leafShape} ${className}`}>
      <CordHoles />
      {children}
    </div>
  );
}

/** One inscribed leaf. Leaves fan down out of the bundle one after another as it opens. */
function PalmLeaf({ index, untied, children }) {
  return (
    <div
      style={{ transitionDelay: `${TIED_PAUSE + 150 + index * 140}ms` }}
      className={`bg-palm-leaf relative py-4 text-center text-[#3a2008] shadow-[0_3px_8px_#0007,inset_0_0_0_1px_#8a5a2a44] transition-[translate,opacity] duration-700 ${leafShape} ${ease} ${
        untied ? '' : '-translate-y-8 opacity-0'
      }`}
    >
      <CordHoles />
      {children}
    </div>
  );
}

/** The cord wound round the closed bundle, its knot, and a tail weighted with a gold coin. */
function CordWrap({ untied }) {
  const slip = `transition-[translate,rotate,opacity,scale] duration-500 ${ease}`;
  return (
    <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10" aria-hidden="true">
      {[-9, 0, 9].map((x, i) => (
        <span
          key={x}
          style={{ left: x }}
          className={`absolute -inset-y-1 w-[3px] rounded-full shadow-[1px_0_2px_#0008] ${twine} ${slip} ${untied ? ['translate-y-8 -rotate-12', 'translate-y-10', 'translate-y-8 rotate-12'][i] + ' opacity-0' : ''}`}
        />
      ))}
      <span className={`absolute top-1/2 left-0 h-14 w-[3px] origin-top rotate-[18deg] ${twine} ${slip} ${untied ? 'translate-y-10 opacity-0' : ''}`}>
        <span className="absolute -bottom-2 left-1/2 size-4 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#f2d38b,#a8792e)] shadow-[0_2px_4px_#0009] ring-1 ring-[#7a5218]" />
      </span>
      <span className={`absolute top-1/2 left-0 size-5 -translate-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#e8c98a,#8a6534_70%)] shadow-[0_2px_5px_#000a] ${slip} ${untied ? 'scale-50 opacity-0' : ''}`} />
    </div>
  );
}

const iconButton =
  'grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-temple-gold-light/70 bg-teak-dark text-temple-gold-light shadow-[0_6px_16px_#000a] transition-[scale] duration-300 ease-spring hover:scale-110 active:scale-90';
const chip = 'rounded-full px-2.5 py-0.5 text-[10px] font-semibold sm:text-[11px]';

/**
 * The Olai Suvadi reader: a palm-leaf manuscript between wooden covers, tied with a cord.
 * It opens tied; the cord slips off and the bundle slides open into three leaves strung
 * on their binding cords — the Tamil couplet, its transliteration, and its meaning.
 * Previous / Next and a search box turn to other kurals without leaving the manuscript.
 * The parent owns the kural number (and the arrow keys and Escape).
 *
 * Recitation: once the leaves have opened, the kural's அதிகாரம் is announced (its recorded
 * introduction) and then the kural is recited, from public/Audio. Turning to another kural
 * of the same அதிகாரம் recites just that kural; one from another அதிகாரம் is announced first.
 */
export default function OlaiSuvadi({ kurals, error, number, onSelect, onClose }) {
  const { L, T, cl, lang } = useI18n();
  const [untied, setUntied] = useState(false);
  const [query, setQuery] = useState('');
  const backRef = useRef(null);
  const firstNumber = useRef(number);
  const recitation = useRecitation();
  const startTimer = useRef(0);
  const begun = useRef(false);

  const kural = kurals?.[number - 1];
  // The kural's translation into the chosen language: its file, else the runtime service's.
  const local = machineLocal(kural, lang);
  // The English meaning's recording — only while the leaf shows that very English meaning.
  const shownMeaning = !kural ? null : kural.studentMeaning ? L(kural.studentMeaning) : local ? null : kural.explanation;
  const meaningSrc = shownMeaning && shownMeaning.trim() === englishMeaning(kural) ? kuralMeaningRecording(kural.number) : null;
  const meaningAudio = useNarration(meaningSrc);
  // The Hindi meaning's recording — while the leaf shows the Hindi pack's meaning (not a machine one).
  const hindiMeaningSrc = local && local.lang === 'hi' && !local.machine ? kuralHindiMeaningRecording(kural.number) : null;
  const hindiMeaningAudio = useNarration(hindiMeaningSrc);
  const chapter = chapterOf(number);
  const results = useMemo(() => (kurals && query ? searchKurals(kurals, query, READER_RESULTS) : []), [kurals, query]);
  const step = (delta) => onSelect(((number - 1 + delta + TOTAL_KURALS) % TOTAL_KURALS) + 1);
  const pick = (n) => {
    setQuery('');
    onSelect(n);
  };

  /*
   * The அதிகாரம் (chapter) whose name was last announced. Opening the manuscript announces
   * the kural's chapter and then recites the kural; turning to kurals of the same chapter
   * recites only the kural, and reaching a kural of another chapter announces that chapter again.
   */
  const announcedChapter = useRef(null);
  const reciteWithChapter = (n) => {
    const chapterNumber = chapterOf(n).number;
    recitation.recite(n, announcedChapter.current !== chapterNumber);
    announcedChapter.current = chapterNumber;
  };

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    backRef.current?.focus();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = setTimeout(() => setUntied(true), reduced ? 0 : TIED_PAUSE);
    // Begin reciting as the leaves finish fanning open.
    startTimer.current = setTimeout(() => {
      begun.current = true;
      reciteWithChapter(firstNumber.current);
    }, reduced ? 0 : TIED_PAUSE + 800);
    return () => {
      clearTimeout(timer);
      clearTimeout(startTimer.current);
      previouslyFocused?.focus?.();
    };
  }, []);

  // Turning to another kural recites only that kural — preceded by its அதிகாரம்'s name only
  // when it belongs to a different அதிகாரம் from the kural recited before it.
  useEffect(() => {
    if (!begun.current && number === firstNumber.current) return;
    clearTimeout(startTimer.current);
    begun.current = true;
    reciteWithChapter(number);
  }, [number]);

  const toggleRecitation = () => {
    if (!begun.current) {
      // Pressed before the opening recitation began: start it now, as it would have.
      clearTimeout(startTimer.current);
      begun.current = true;
      reciteWithChapter(number);
      return;
    }
    recitation.toggle(number);
  };

  const appear = `transition-opacity duration-500 ${ease} ${untied ? 'delay-[1100ms]' : 'pointer-events-none opacity-0'}`;

  return (
    <div
      className="fixed inset-0 z-[1310] grid animate-[fade-in_.25s_ease] place-items-center overflow-y-auto bg-[#0c0906]/75 p-4 backdrop-blur-[2px] sm:p-8"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section role="dialog" aria-modal="true" aria-labelledby="olai-title" className="w-full max-w-2xl">
        {/* Back to the brochure, and a search to turn to any other kural */}
        <div className={`mb-4 flex items-center gap-2 ${appear}`}>
          <button
            ref={backRef}
            type="button"
            onClick={onClose}
            className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-temple-gold-light/70 bg-teak-dark px-4 py-2.5 text-xs font-semibold text-temple-gold-light shadow-[0_6px_16px_#000a] transition-[scale] duration-300 ease-spring hover:scale-105 active:scale-95"
          >
            <ArrowLeft size={15} /> {T('Brochure', 'கையேடு', 'पुस्तिका')}
          </button>
          <div className="relative min-w-0 flex-1">
            <label className="flex items-center gap-2 rounded-full border border-temple-gold/70 bg-teak-dark/90 px-4 py-2.5 text-temple-gold-light shadow-[0_6px_16px_#000a] focus-within:border-temple-gold-light">
              <Search size={15} className="shrink-0" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && results[0]) pick(results[0].number);
                  if (event.key === 'Escape' && query) {
                    event.stopPropagation();
                    setQuery('');
                  }
                }}
                placeholder={`${T('Find a kural', 'குறள் தேடு', 'कुरल खोजें')} · குறள் தேடு`}
                aria-label={T('Search for another kural', 'வேறு குறளைத் தேடு', 'कोई दूसरा कुरल खोजें')}
                className="min-w-0 flex-1 appearance-none border-none bg-transparent p-0 text-sm text-parchment shadow-none outline-none placeholder:text-temple-gold/60 focus:outline-none"
                disabled={!kurals}
              />
            </label>
            {query && (
              <ul className="absolute inset-x-0 top-full z-20 mt-1.5 max-h-72 overflow-y-auto rounded-2xl border border-temple-gold/60 bg-teak-dark/95 p-1.5 shadow-[0_14px_30px_#000c] backdrop-blur" aria-live="polite">
                {results.length === 0 ? (
                  <li className="px-3 py-2 text-xs text-temple-gold-light/80">{T('No kurals found — try another word or a number from 1 to 1330.', 'குறள் எதுவும் கிடைக்கவில்லை — வேறு சொல்லையோ 1 முதல் 1330 வரையிலான எண்ணையோ தேடுங்கள்.', 'कोई कुरल नहीं मिला — कोई दूसरा शब्द या 1 से 1330 तक की संख्या आज़माएँ।')}</li>
                ) : (
                  results.map((result) => (
                    <li key={result.number}>
                      <button
                        type="button"
                        onClick={() => pick(result.number)}
                        className="flex w-full cursor-pointer items-baseline gap-2.5 rounded-xl px-3 py-2 text-left text-parchment transition-colors hover:bg-temple-gold/20"
                      >
                        <span className="shrink-0 text-xs font-bold text-temple-gold-light">{result.number}</span>
                        <span className="block min-w-0 flex-1">
                          <KuralCouplet kural={result} as="span" className="block text-sm leading-snug" />
                          {result.local && <span lang={result.local.lang} className="mt-0.5 block truncate text-xs text-temple-gold-light/80">{result.local.meaning}</span>}
                        </span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>

        {/* The manuscript: covers, leaves, and the two binding cords through their holes */}
        <div className="relative [perspective:900px]">
          {holes.map((position) => (
            <span key={position} className={`absolute inset-y-3 ${position} w-[3px] -translate-x-1/2 shadow-[1px_0_2px_#0008] ${twine}`} aria-hidden="true" />
          ))}

          <CoverBoard>
            <h2 id="olai-title" className="text-center text-xs font-bold tracking-[0.2em] text-temple-gold-light">
              திருக்குறள் · <span lang={cl} className="font-serif tracking-[0.15em]">{L('OLAI SUVADI', 'ओलै सुवडि')}</span>
            </h2>
          </CoverBoard>

          {/* The closed bundle's stacked leaf edges, which give way as it opens */}
          <div className={`grid transition-[grid-template-rows] duration-500 ${ease} ${untied ? 'grid-rows-[0fr] delay-[300ms]' : 'grid-rows-[1fr]'}`} aria-hidden="true">
            <div className="min-h-0 overflow-hidden">
              <div className="flex flex-col gap-px px-[3%] py-px">
                {Array.from({ length: 6 }, (_, i) => (
                  <span key={i} className="bg-palm-leaf h-1 rounded-full shadow-[0_1px_1px_#0006]" />
                ))}
              </div>
            </div>
          </div>

          {/* The leaves, opened out along the cords */}
          <div className={`grid transition-[grid-template-rows] duration-[900ms] ${ease} ${untied ? 'grid-rows-[1fr] delay-[350ms]' : 'grid-rows-[0fr]'}`}>
            <div className="min-h-0 overflow-hidden">
              <div key={number} className={`flex flex-col gap-3 py-3 ${number !== firstNumber.current ? 'animate-leaf-turn' : ''}`} aria-live="polite">
                {error ? (
                  <PalmLeaf index={0} untied={untied}>
                    <p className="text-sm">{T('This manuscript could not be opened just now. Please go back and try again.', 'இச்சுவடியை இப்போது திறக்க இயலவில்லை. திரும்பிச் சென்று மீண்டும் முயலுங்கள்.', 'यह पांडुलिपि अभी नहीं खुल सकी। कृपया वापस जाकर फिर से प्रयास करें।')}</p>
                  </PalmLeaf>
                ) : !kural ? (
                  <PalmLeaf index={0} untied={untied}>
                    <p className="flex items-center justify-center gap-2 text-sm">
                      <Loader2 size={16} className="animate-spin" /> {T('Opening the manuscript…', 'சுவடி திறக்கிறது…', 'पांडुलिपि खुल रही है…')}
                    </p>
                  </PalmLeaf>
                ) : (
                  <>
                    <PalmLeaf index={0} untied={untied}>
                      <div className="flex flex-wrap items-center justify-center gap-1.5">
                        <RecitationButton state={recitation.state} available={hasRecitation(number)} onToggle={toggleRecitation} />
                        {hasRecitation(number) && (
                          <button
                            type="button"
                            onClick={toggleRecitation}
                            data-kural-listen={number}
                            className={`${chip} inline-flex cursor-pointer items-center gap-1 border border-[#8a5a2a]/50 bg-[#fff3d6] text-terracotta-deep transition-[scale] duration-300 ease-spring hover:scale-105 active:scale-95`}
                          >
                            <Volume2 size={12} /> <span lang="ta">ஒலியைக் கேட்க</span> <span className="opacity-75">(Listen)</span>
                          </button>
                        )}
                        <span className={`${chip} bg-terracotta-deep text-[#fbe7b5]`}>குறள் {kural.number}</span>
                        <span className={`${chip} border border-[#8a5a2a]/50 text-terracotta-deep`}>
                          அதிகாரம் {chapter.number}: {chapter.tamil}
                        </span>
                      </div>
                      <KuralCouplet kural={kural} className="mt-2 text-base leading-loose font-bold sm:text-xl sm:leading-loose" />
                    </PalmLeaf>

                    {/* In Hindi: the couplet rendered in Hindi, on its own leaf beneath the Tamil. */}
                    {local && (
                      <PalmLeaf index={1} untied={untied}>
                        <p lang={local.lang} className="text-[10px] font-bold tracking-[0.1em] text-terracotta-deep/80">{T('Translation', 'மொழிபெயர்ப்பு', 'अनुवाद')} · {languageOf(local.lang).label}</p>
                        <p lang={local.lang} className="mt-1 text-base leading-[1.8] font-semibold sm:text-lg">
                          {local.translation.split('\n').map((line) => (
                            <span key={line} className="block">{line}</span>
                          ))}
                        </p>
                      </PalmLeaf>
                    )}

                    {kural.transliteration && (
                      <PalmLeaf index={local ? 2 : 1} untied={untied}>
                        <p className="text-[10px] font-bold tracking-[0.2em] text-terracotta-deep/80">{T('TRANSLITERATION', 'ஒலிபெயர்ப்பு', 'लिप्यंतरण')}</p>
                        <p className="mt-1 font-serif text-sm leading-relaxed italic sm:text-base">
                          {kural.transliteration.split('\n').map((line) => (
                            <span key={line} className="block">{line}</span>
                          ))}
                        </p>
                      </PalmLeaf>
                    )}

                    <PalmLeaf index={local ? 3 : 2} untied={untied}>
                      {local && (
                        <>
                          <p className="flex items-center justify-center gap-1.5 text-[10px] font-bold tracking-[0.1em] text-terracotta-deep/80">
                            <Lightbulb size={13} /> <span lang={local.lang}>{T('Meaning', 'பொருள்', 'अर्थ')}</span> · <span lang="ta">பொருள்</span>
                          </p>
                          <p lang={local.lang} className="mt-1 text-[15px] leading-[1.8]">{local.meaning}</p>
                          {hindiMeaningSrc && (
                            <button
                              type="button"
                              onClick={hindiMeaningAudio.toggle}
                              aria-pressed={hindiMeaningAudio.state.playing}
                              aria-label={hindiMeaningAudio.state.playing ? 'अर्थ रोकें (Pause)' : 'अर्थ सुनें (Listen)'}
                              title={hindiMeaningAudio.state.playing ? 'अर्थ रोकें (Pause)' : 'अर्थ सुनें (Listen)'}
                              data-kural-meaning-listen-hi={kural.number}
                              className={`${chip} mt-1.5 inline-flex cursor-pointer items-center gap-1 border transition-[scale] duration-300 ease-spring hover:scale-105 active:scale-95 ${
                                hindiMeaningAudio.state.playing ? 'border-terracotta-deep bg-terracotta-deep text-[#fbe7b5]' : 'border-[#8a5a2a]/50 bg-[#fff3d6] text-terracotta-deep'
                              }`}
                            >
                              {hindiMeaningAudio.state.playing ? <Pause size={12} fill="currentColor" /> : <Volume2 size={12} />}
                              <span lang="hi">सुनें</span> <span className="opacity-75">(हिन्दी)</span>
                            </button>
                          )}
                        </>
                      )}
                      {(!local || kural.studentMeaning) && (
                        <p className={`flex items-center justify-center gap-1.5 text-[10px] font-bold tracking-[0.2em] text-terracotta-deep/80 ${local ? 'mt-3 border-t border-[#8a5a2a]/30 pt-3' : ''}`}>
                          <Lightbulb size={13} /> {kural.studentMeaning ? T('WHAT IT MEANS FOR YOU', 'உங்களுக்கு இதன் பொருள்', 'आपके लिए इसका अर्थ') : `${T('MEANING', 'பொருள்', 'अर्थ')} · பொருள்`}
                        </p>
                      )}
                      {meaningSrc && (
                        <button
                          type="button"
                          onClick={meaningAudio.toggle}
                          aria-pressed={meaningAudio.state.playing}
                          aria-label={meaningAudio.state.playing ? 'Pause the English meaning' : 'Listen to the English meaning'}
                          title={meaningAudio.state.playing ? 'Pause the English meaning' : 'Listen to the English meaning'}
                          data-kural-meaning-listen={kural.number}
                          className={`${chip} mt-1.5 inline-flex cursor-pointer items-center gap-1 border transition-[scale] duration-300 ease-spring hover:scale-105 active:scale-95 ${
                            meaningAudio.state.playing ? 'border-terracotta-deep bg-terracotta-deep text-[#fbe7b5]' : 'border-[#8a5a2a]/50 bg-[#fff3d6] text-terracotta-deep'
                          }`}
                        >
                          {meaningAudio.state.playing ? <Pause size={12} fill="currentColor" /> : <Volume2 size={12} />}
                          <span lang="en">Listen</span> <span className="opacity-75">(English)</span>
                        </button>
                      )}
                      {kural.studentMeaning ? (
                        <>
                          <p lang={cl} className="mt-1 text-sm leading-relaxed">{L(kural.studentMeaning)}</p>
                          <p lang="ta" className="mt-1.5 text-sm leading-relaxed font-semibold text-terracotta-deep">{kural.studentMeaning.ta}</p>
                        </>
                      ) : (
                        !local && <p lang="en" className="mt-1 text-sm leading-relaxed">{kural.explanation}</p>
                      )}
                    </PalmLeaf>
                  </>
                )}
              </div>
            </div>
          </div>

          <CoverBoard />
          <CordWrap untied={untied} />
        </div>

        {/* Turn to the previous or next kural */}
        <nav className={`mt-4 flex items-center justify-between gap-3 ${appear}`} aria-label={T('Turn the leaves', 'ஏடுகளைப் புரட்டு', 'पत्ते पलटें')}>
          <button type="button" onClick={() => step(-1)} aria-label={T('Previous kural', 'முந்தைய குறள்', 'पिछला कुरल')} className={iconButton}>
            <ChevronLeft size={20} />
          </button>
          <p className="min-w-0 text-center text-xs text-temple-gold-light">
            <span className="font-bold">குறள் {number}</span> / {TOTAL_KURALS}
            <span className="block truncate font-serif text-[11px] text-[#ead8ae] italic">
              <span lang={cl}>{L(chapter.english)} · {L(chapter.section.transliteration)}</span>
            </span>
          </p>
          <button type="button" onClick={() => step(1)} aria-label={T('Next kural', 'அடுத்த குறள்', 'अगला कुरल')} className={iconButton}>
            <ChevronRight size={20} />
          </button>
        </nav>
      </section>
    </div>
  );
}
