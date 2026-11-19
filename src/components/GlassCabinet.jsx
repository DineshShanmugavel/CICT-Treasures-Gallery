import React, { useId, useState } from 'react';
import { BookOpen, BookOpenText, DoorClosed, DoorOpen, ScrollText } from 'lucide-react';
import AudioPlayer from './AudioPlayer.jsx';
import { KolamCorner, KolamDivider, LotusBorder, StonePillar, TempleCrest } from './HeritageMotifs.jsx';
import { bookAudio, describeBook } from '../data/bookInfo.js';
import { playSound } from '../audio/ambience.js';
import { useI18n } from '../i18n/index.js';

/**
 * The shelf interior: a deep maroon velvet back scattered with faint kolam dots, crossed
 * by carved teak shelf boards with a gilt lip. Rows are 176px: a 150px slot for the
 * book, a 2px gilt lip, then the board and its shadow.
 */
const SHELVES = {
  backgroundColor: '#260a07',
  backgroundImage: [
    'repeating-linear-gradient(180deg, transparent 0 150px, #e0b35a 150px 152px, #6b3818 152px 156px, #4a2410 156px 168px, #00000099 168px 176px)',
    'radial-gradient(circle, #d4a64a26 1.2px, transparent 1.6px)',
    'radial-gradient(ellipse at 50% 0, #f4d79230, transparent 65%)',
    'radial-gradient(ellipse at 50% 50%, #4a1410, #1e0605 85%)',
  ].join(','),
  backgroundSize: 'auto, 22px 22px, auto, auto',
};

/** Leather bindings in the heritage palette: terracotta, sepia, temple green, indigo, maroon. */
const BINDINGS = [
  'from-[#9a3f1e] to-[#5a1f0c]',
  'from-[#704214] to-[#3a200a]',
  'from-[#2f4a36] to-[#15241a]',
  'from-[#2c3a5e] to-[#141c30]',
  'from-[#6e1f1a] to-[#3a0d0a]',
  'from-[#8a6a2a] to-[#4a3610]',
];

function ShelfBook({ book, index, onSelect, onFeature }) {
  const { L, cl } = useI18n();
  return (
    <button
      type="button"
      onClick={() => onSelect(book)}
      onPointerEnter={() => onFeature(book)}
      onFocus={() => onFeature(book)}
      title={book.tamil ? `${L(book.title)} · ${book.tamil}` : L(book.title)}
      className={`group relative mb-[26px] flex h-[138px] w-full max-w-[112px] cursor-pointer flex-col justify-between self-end justify-self-center overflow-hidden rounded-l-sm rounded-r-md bg-gradient-to-br ${
        BINDINGS[index % BINDINGS.length]
      } py-2.5 pr-2 pl-4 text-left shadow-[4px_4px_10px_#000a,inset_-1px_0_#ffffff1a] transition duration-500 ease-spring hover:-translate-y-3 hover:-rotate-2 hover:shadow-[4px_12px_18px_#000c,0_0_22px_#f4d79244] focus-visible:-translate-y-2 active:scale-95`}
    >
      {/* Spine, gilt tooling, and a tiny lotus stamp */}
      <span className="absolute inset-y-0 left-0 w-2.5 bg-black/35 shadow-[inset_-1px_0_#f4d79244]" />
      <span className="absolute inset-x-1 top-1.5 h-px bg-temple-gold-light/60" />
      <span className="absolute inset-x-1 top-2.5 h-px bg-temple-gold-light/30" />
      <span className="absolute inset-x-1 bottom-1.5 h-px bg-temple-gold-light/60" />

      {/* Long transliterated titles hyphenate instead of being clipped mid-word */}
      <span lang={cl} className="relative line-clamp-4 font-serif text-[13px] leading-tight font-semibold hyphens-auto text-[#f6e3b8]">{L(book.title)}</span>
      {book.tamil && <span className="relative line-clamp-2 text-[10px] leading-snug [overflow-wrap:anywhere] text-temple-gold-light/85">{book.tamil}</span>}
      <span className="relative flex items-center justify-between text-[10px] text-temple-gold-light/75">
        <span>{book.year ?? ''}</span>
        {book.pages ? <ScrollText size={13} className="opacity-70 transition group-hover:opacity-100" /> : <BookOpen size={13} className="opacity-70 transition group-hover:opacity-100" />}
      </span>
    </button>
  );
}

/**
 * The museum label beneath a cabinet: the hovered or focused book's description in Tamil
 * and English, its narration (தமிழ் / English), and a button to open it.
 */
function BookPlaque({ book, onRead }) {
  const { L, T, cl, lang } = useI18n();
  const description = describeBook(book);
  return (
    <div className="relative mt-4 grid gap-4 rounded-sm border border-temple-gold/50 bg-teak-dark/85 p-4 shadow-[inset_0_0_0_3px_#d4a64a1a,0_8px_20px_#0008] lg:grid-cols-[1fr_1fr_minmax(280px,320px)]">
      <KolamCorner className="pointer-events-none absolute top-1.5 left-1.5 size-8 text-temple-gold/40" />
      <KolamCorner className="pointer-events-none absolute right-1.5 bottom-1.5 size-8 -scale-100 text-temple-gold/40" />
      <section lang="ta" className="min-w-0">
        <p className="text-[10px] font-bold tracking-[0.2em] text-temple-gold">நூல் அறிமுகம்</p>
        <h4 className="mt-1 text-base leading-snug font-bold text-[#e9a27a]">{book.tamil ?? L(book.title)}</h4>
        <p className="mt-1 text-[13px] leading-relaxed text-[#f3e3c3]">{description.ta}</p>
      </section>
      <section lang={cl} className="min-w-0">
        <p className="text-[10px] font-bold tracking-[0.2em] text-temple-gold">{L('ABOUT THIS BOOK', 'पुस्तक परिचय')}</p>
        <h4 className="mt-1 font-serif text-lg leading-snug font-bold text-temple-gold-light">
          {L(book.title)}
          {book.year && <span className="ml-2 font-sans text-xs font-semibold text-temple-gold/80">{book.year}</span>}
        </h4>
        <p className="mt-1 font-serif text-[15px] leading-relaxed text-[#f3e3c3]">{L(description)}</p>
      </section>
      <div className="flex min-w-0 flex-col gap-3">
        {Object.keys(bookAudio(book)).length > 0 && <AudioPlayer key={`${book.id}-${lang}`} tracks={bookAudio(book)} defaultLanguage={bookAudio(book)[lang] ? lang : Object.keys(bookAudio(book))[0]} />}
        <button
          type="button"
          onClick={onRead}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-temple-gold-light bg-gradient-to-br from-temple-gold-light to-temple-gold px-4 py-2 text-xs font-bold text-teak-dark shadow-[0_0_18px_#d4a64a55] transition duration-300 ease-spring hover:scale-105 active:scale-95"
        >
          <BookOpenText size={15} /> <span lang={cl}>{L('Read this book', 'यह पुस्तक पढ़ें')}</span> · <span lang="ta">படிக்க</span>
        </button>
      </div>
    </div>
  );
}

/**
 * An antiquarian display cabinet: carved teak framed by fluted sandstone pillars and
 * crowned with a temple crest, behind a hinged glass door with gilt glazing bars.
 * The door swings open on its left hinge; books are unreachable while it is closed.
 * Beneath it, a label plaque describes whichever book is hovered or focused, in Tamil
 * and English, with its narration.
 */
export default function GlassCabinet({ cabinet, onSelectBook, defaultOpen = false }) {
  const { L, T, cl } = useI18n();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [featured, setFeatured] = useState(cabinet.books[0]);
  const shelfId = useId();
  const toggle = () => {
    playSound(isOpen ? 'cabinet-close' : 'cabinet-open');
    setIsOpen(!isOpen);
  };

  return (
    <article className="relative mx-auto w-full max-w-5xl">
      <TempleCrest className="mx-4 h-20 sm:mx-14 sm:h-24">
        <div className="mb-1 rounded-sm border border-temple-gold/80 bg-gradient-to-b from-teak-dark to-[#160a04] px-4 py-1.5 text-center shadow-[inset_0_0_0_2px_#d4a64a22,0_4px_12px_#000a] sm:px-6">
          <h3 lang={cl} className="font-serif text-base leading-tight font-bold tracking-wide text-temple-gold-light sm:text-xl">{L(cabinet.title)}</h3>
          {cabinet.tamil && <p className="text-[11px] font-semibold text-[#e9a27a] sm:text-xs">{cabinet.tamil}</p>}
        </div>
      </TempleCrest>

      <div className="flex items-stretch">
        <StonePillar className="hidden w-10 shrink-0 sm:flex lg:w-12" />

        <div className="bg-teak relative min-w-0 flex-1 border-x-4 border-teak-dark p-3 shadow-[0_30px_60px_#000c,inset_0_0_0_1px_#d4a64a33] sm:p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <span className="text-[10px] font-semibold tracking-[0.2em] text-temple-gold-light/80">
              <span lang={cl}>{cabinet.books.length} {L('VOLUMES', 'ग्रंथ')}</span> · <span lang="ta">{cabinet.books.length} நூல்கள்</span>
            </span>
            <button
              type="button"
              onClick={toggle}
              aria-expanded={isOpen}
              aria-controls={shelfId}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-temple-gold/80 bg-teak-dark/90 px-4 py-2 text-xs font-semibold text-temple-gold-light transition duration-300 ease-spring hover:scale-105 hover:bg-gradient-to-br hover:from-temple-gold-light hover:to-temple-gold hover:text-teak-dark active:scale-95"
            >
              {isOpen ? <DoorClosed size={15} /> : <DoorOpen size={15} />}
              <span>{isOpen ? T('Close Glass Door', 'கண்ணாடிக் கதவை மூடு', 'काँच का दरवाज़ा बंद करें') : T('Open Glass Door', 'கண்ணாடிக் கதவைத் திற', 'काँच का दरवाज़ा खोलें')}</span>
            </button>
          </div>
          <KolamDivider className="mb-3 block text-temple-gold/50" />

          {/* Shelves behind a hinged glass door */}
          <div className="relative [perspective:1800px]">
            <div
              id={shelfId}
              inert={!isOpen}
              className="relative grid auto-rows-[176px] grid-cols-3 gap-x-3 rounded-sm border-4 border-teak-dark px-3 shadow-[inset_0_12px_34px_#000d,inset_0_0_0_1px_#d4a64a44] sm:grid-cols-4 sm:px-5 md:grid-cols-5 lg:grid-cols-6"
              style={SHELVES}
            >
              {cabinet.books.map((book, index) => (
                <ShelfBook key={book.id} book={book} index={index} onSelect={onSelectBook} onFeature={setFeatured} />
              ))}
            </div>

            <div
              className={`absolute inset-0 origin-left rounded-sm border-[6px] border-teak bg-white/10 shadow-[inset_0_0_0_1px_#e8c77a66,0_10px_30px_#0008] backdrop-blur-md transition-transform duration-700 ease-[cubic-bezier(.65,0,.25,1)] ${
                isOpen ? 'pointer-events-none [transform:rotateY(-100deg)]' : '[transform:rotateY(0deg)]'
              }`}
            >
              {/* Gilt glazing bars and reflections */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_calc(33.3%-1px),#d4a64a99_calc(33.3%-1px)_calc(33.3%+1px),transparent_calc(33.3%+1px)_calc(66.6%-1px),#d4a64a99_calc(66.6%-1px)_calc(66.6%+1px),transparent_calc(66.6%+1px))]" />
                <div className="absolute -inset-y-10 left-[18%] w-24 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <div className="absolute -inset-y-10 left-[44%] w-8 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-[#f4d792]/5" />
              </div>
              {/* Brass pull on the free edge */}
              <button
                type="button"
                onClick={toggle}
                aria-label={T(`Open the glass door of ${cabinet.title}`, `${cabinet.tamil ?? cabinet.title} — கண்ணாடிக் கதவைத் திற`, `${L(cabinet.title)} का काँच का दरवाज़ा खोलें`)}
                tabIndex={-1}
                className="absolute top-1/2 right-3 h-28 w-3 -translate-y-1/2 cursor-pointer rounded-full bg-gradient-to-b from-[#f7e0a0] via-[#b98a3e] to-[#f2d38b] shadow-[0_0_10px_#f4d79255,0_3px_8px_#000a] transition hover:shadow-[0_0_16px_#f4d792aa,0_3px_8px_#000a]"
              />
            </div>
          </div>

          {/* Label outside the glass, like a museum caption */}
          <BookPlaque book={featured} onRead={() => onSelectBook(featured)} />
        </div>

        <StonePillar className="hidden w-10 shrink-0 sm:flex lg:w-12" />
      </div>

      {/* Carved stone plinth */}
      <div className="bg-sandstone relative h-7 shadow-[0_14px_30px_#000c] sm:mx-[-6px]">
        <LotusBorder className="absolute inset-x-0 top-0 block text-terracotta-deep/80" />
      </div>
    </article>
  );
}
