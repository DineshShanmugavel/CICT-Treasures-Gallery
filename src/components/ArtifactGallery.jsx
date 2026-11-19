import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Clapperboard, FileText, ImageOff, Play, X } from 'lucide-react';
import { Deepam, KolamDivider, LotusBorder } from './HeritageMotifs.jsx';
import RecitationButton from './RecitationButton.jsx';
import PhotoBook from './PhotoBook.jsx';
import useNarration from '../audio/useNarration.js';
import { useI18n } from '../i18n/index.js';
import { englishNarration, englishTitle, generatedNarration, hindiNarration } from '../narration/generated.js';

/** The narration button's labels in the chosen language (`T` from useI18n). */
const narrationLabels = (T) => ({
  play: T('Play the narration', 'விவரிப்பை இயக்கு', 'वर्णन चलाएँ'),
  pause: T('Pause the narration', 'விவரிப்பை நிறுத்து', 'वर्णन रोकें'),
  unavailable: T('Narration coming soon', 'விவரிப்பு விரைவில்', 'वर्णन जल्द आ रहा है'),
});

/**
 * Text written on a palm leaf, as in the Olai Suvadi: a straw-gold leaf with rounded ends
 * and the two cord holes of a bound manuscript, inked in dark brown.
 */
export function PalmLeafText({ children, className = '' }) {
  return (
    <div className={`bg-palm-leaf relative rounded-[2.5rem] px-[10%] py-7 text-[#3a2008] shadow-[0_6px_16px_#000a,inset_0_0_0_1px_#8a5a2a44] sm:py-8 ${className}`}>
      {['left-[3.5%]', 'left-[96.5%]'].map((position) => (
        <span key={position} className={`absolute top-1/2 ${position} size-2.5 -translate-1/2 rounded-full bg-[#8a6534] ring-2 ring-[#3a1d0a]/80`} aria-hidden="true" />
      ))}
      {children}
    </div>
  );
}

/**
 * One artefact in a lit glass vitrine on a teak plinth, its brass label plate below.
 * Photos load lazily; a missing photo leaves a quiet placeholder rather than a broken image.
 * A film (`artifact.video`) shows its poster with a gilt play medallion over it. A `wide`
 * case is a landscape vitrine, for film stills and other wide photographs.
 */
function ArtifactCase({ artifact, onOpen, wide = false }) {
  const [missing, setMissing] = useState(false);
  const { L, T, cl } = useI18n();
  const action = artifact.video ? T('Watch the film', 'படத்தைப் பாருங்கள்', 'फ़िल्म देखें') : T('Look closer', 'அருகில் காண்க', 'पास से देखें');
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`${action}: ${L(artifact.title)}${artifact.detail ? `, ${L(artifact.detail)}` : ''}`}
      className="group flex cursor-pointer flex-col items-center text-left transition-[translate] duration-500 ease-spring hover:-translate-y-1.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-temple-gold-light"
    >
      {/* The vitrine: velvet ground, a spotlight from above, glass catching the light */}
      <span className={`relative block ${wide ? 'aspect-[16/10]' : 'aspect-[4/5]'} w-full overflow-hidden rounded-t-sm border border-temple-gold/40 bg-[radial-gradient(ellipse_at_50%_25%,#5a2e14,#1c0d05_78%)] shadow-[inset_0_0_30px_#000c,0_14px_28px_#000a] transition-[border-color,box-shadow] duration-300 group-hover:border-temple-gold-light group-hover:shadow-[inset_0_0_30px_#000c,0_0_30px_#f1c35b44,0_14px_28px_#000a]`}>
        <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-5%,#ffd99a4d,transparent_62%)]" />
        {missing || !artifact.url ? (
          <span className="absolute inset-0 grid place-items-center text-temple-gold/50"><ImageOff size={28} /></span>
        ) : (
          <img
            src={artifact.url}
            alt={L(artifact.title)}
            loading="lazy"
            decoding="async"
            onError={() => setMissing(true)}
            className={`absolute rounded-[2px] object-contain drop-shadow-[0_12px_14px_#000c] transition-[scale] duration-500 ease-spring group-hover:scale-105 ${wide ? 'inset-[6%] size-[88%]' : 'inset-[9%] size-[82%]'}`}
          />
        )}
        {artifact.video && !missing && (
          <span className="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden="true">
            <span className="grid size-14 place-items-center rounded-full border-2 border-temple-gold-light bg-[radial-gradient(circle_at_35%_30%,#f5dc98,#b8862f_60%,#6a4410)] text-[#2a1806] shadow-[0_0_0_4px_#1c0d05aa,0_8px_22px_#000c] transition-[scale,box-shadow] duration-500 ease-spring group-hover:scale-110 group-hover:shadow-[0_0_0_4px_#1c0d05aa,0_0_26px_#f1c35b88,0_8px_22px_#000c]">
              <Play size={22} className="translate-x-[2px]" fill="currentColor" />
            </span>
          </span>
        )}
        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_32%,#ffffff17_44%,transparent_56%)]" />
      </span>
      {/* Teak plinth with a brass label plate */}
      <span className="bg-teak relative flex w-[106%] flex-col gap-1.5 rounded-b-sm border-t-2 border-temple-gold/70 px-3.5 pt-3 pb-3.5 text-center shadow-[0_10px_20px_#000b]">
        {artifact.video && (
          <span lang={cl} className="mx-auto inline-flex items-center gap-1 rounded-full border border-temple-gold/60 px-2 py-px text-[9px] font-bold tracking-[0.2em] text-temple-gold-light/90 uppercase">
            <Clapperboard size={10} aria-hidden="true" /> {T('Film', 'படம்', 'फ़िल्म')}
          </span>
        )}
        <span lang={cl} className="line-clamp-2 block font-serif text-sm leading-snug font-semibold text-temple-gold-light">{L(artifact.title)}</span>
        {artifact.tamil && <span lang="ta" className="line-clamp-2 block text-xs leading-[1.75] text-[#e9c49a]">{artifact.tamil}</span>}
        {artifact.detail && <span lang={cl} className="block text-[10px] leading-relaxed tracking-wide text-[#ead8ae]/75">{L(artifact.detail)}</span>}
      </span>
    </button>
  );
}

/**
 * A wing's display cases: one gallery of artefact photographs (from a public folder),
 * under a heading flanked by deepams. Choosing a case calls `onOpen(index)`.
 */
export default function ArtifactGallery({ gallery, onOpen }) {
  const { L, T, cl } = useI18n();
  if (!gallery.artifacts.length) return null;
  return (
    <section aria-labelledby={`${gallery.id}-title`}>
      <div className="flex items-end justify-center gap-5 sm:gap-10">
        <Deepam className="h-20 sm:h-24" />
        <div className="flex flex-col gap-1.5 pb-1 text-center">
          <p lang="ta" className="text-sm leading-[1.8] font-bold text-[#e9a27a]">{gallery.tamil}</p>
          <h2 id={`${gallery.id}-title`} lang={cl} className="font-serif text-2xl leading-snug font-bold tracking-wide text-temple-gold-light sm:text-3xl">{L(gallery.title)}</h2>
          <p className="mt-1 text-[10px] font-semibold tracking-[0.2em] text-temple-gold-light/70">{T(`${gallery.artifacts.length} OBJECTS ON DISPLAY`, `${gallery.artifacts.length} பொருள்கள் காட்சியில்`, `${gallery.artifacts.length} वस्तुएँ प्रदर्शित`)}</p>
        </div>
        <Deepam className="h-20 sm:h-24" />
      </div>
      <LotusBorder className="mt-6 block text-temple-gold/50" />
      <div className={`mt-10 grid gap-x-6 gap-y-12 ${gallery.wide ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'}`}>
        {gallery.artifacts.map((artifact, index) => (
          <ArtifactCase key={artifact.id} artifact={artifact} wide={gallery.wide} onOpen={() => onOpen(index)} />
        ))}
      </div>
    </section>
  );
}

/**
 * One site's photobook standing closed on the shelf: a gilt-bordered teak cover with its
 * first photograph set in a window, the site's names on a brass plate, and the page block's
 * edge showing along its fore-edge.
 */
function AlbumCover({ album, onOpen }) {
  const [missing, setMissing] = useState(false);
  const { L, T, cl } = useI18n();
  const cover = album.artifacts[0];
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={T(`Open the photobook: ${album.title}, ${album.artifacts.length} photographs`, `படத்தொகுப்பைத் திற: ${album.tamil ?? album.title}, ${album.artifacts.length} படங்கள்`, `चित्र-पुस्तक खोलें: ${L(album.title)}, ${album.artifacts.length} तस्वीरें`)}
      className="group flex cursor-pointer flex-col items-stretch text-left transition-[translate] duration-500 ease-spring hover:-translate-y-1.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-temple-gold-light"
    >
      <span className="relative block aspect-[16/10] rounded-r-md rounded-l-sm bg-[linear-gradient(160deg,#6a3418,#2a1408)] p-[5%] shadow-[0_16px_28px_#000b,inset_0_0_0_1px_#d4a64a66,inset_6px_0_10px_#0007] transition-shadow duration-300 group-hover:shadow-[0_0_30px_#f1c35b44,0_16px_28px_#000b,inset_0_0_0_1px_#f2d38b,inset_6px_0_10px_#0007]">
        {/* The page block along the fore-edge, and the gilt rule inset on the cover */}
        <span className="absolute inset-y-[3%] -right-[5px] w-[5px] rounded-r-sm bg-[repeating-linear-gradient(180deg,#efe3c6_0_1px,#cdb88f_1px_2px)]" aria-hidden="true" />
        <span className="pointer-events-none absolute inset-[3%] rounded-sm border border-temple-gold/50" aria-hidden="true" />
        <span className="relative flex h-full flex-col gap-[5%]">
          <span className="relative block flex-1 overflow-hidden rounded-[2px] bg-[#1c0d05] shadow-[inset_0_0_0_2px_#d4a64a88,0_2px_6px_#0008]">
            {missing ? (
              <span className="absolute inset-0 grid place-items-center text-temple-gold/50"><ImageOff size={24} /></span>
            ) : (
              <img src={cover.url} alt="" loading="lazy" decoding="async" onError={() => setMissing(true)} className="absolute inset-0 size-full object-cover transition-[scale] duration-700 ease-spring group-hover:scale-105" />
            )}
          </span>
          <span className="flex flex-col items-center text-center">
            {album.tamil && <span lang="ta" className="line-clamp-1 text-xs leading-[1.7] font-bold text-[#e9a27a]">{album.tamil}</span>}
            <span lang={cl} className="line-clamp-1 font-serif text-base leading-tight font-semibold text-temple-gold-light">{L(album.title)}</span>
          </span>
        </span>
      </span>
      {/* The shelf it stands on */}
      <span className="bg-teak mt-1 block h-3 rounded-sm border-t border-temple-gold/50 shadow-[0_8px_14px_#000b]" aria-hidden="true" />
      <span lang={cl} className="mt-2 text-center text-[10px] leading-relaxed tracking-wide text-[#ead8ae]/75">
        {L(album.detail)} · {T(`${album.artifacts.length} photographs`, `${album.artifacts.length} படங்கள்`, `${album.artifacts.length} तस्वीरें`)}
      </span>
    </button>
  );
}

/**
 * A room's photobooks (galleries with `layout: 'photobook'`) as albums on a shelf, under a
 * heading flanked by deepams: the room's `shelf` ({ title, tamil, unit }, e.g. "SITES").
 * Choosing one calls `onOpen(album)`; it opens at its first page.
 */
export function AlbumShelf({ albums, shelf = {}, onOpen }) {
  const { L, T, cl } = useI18n();
  if (!albums.length) return null;
  const { title = 'Photobooks', tamil = 'படத்தொகுப்புகள்', unit = 'PHOTOBOOKS' } = shelf;
  return (
    <section aria-labelledby="album-shelf-title">
      <div className="flex items-end justify-center gap-5 sm:gap-10">
        <Deepam className="h-20 sm:h-24" />
        <div className="flex flex-col gap-1.5 pb-1 text-center">
          <p lang="ta" className="text-sm leading-[1.8] font-bold text-[#e9a27a]">{tamil}</p>
          <h2 id="album-shelf-title" lang={cl} className="font-serif text-2xl leading-snug font-bold tracking-wide text-temple-gold-light sm:text-3xl">{L(title, title === 'Photobooks' ? 'चित्र-पुस्तकें' : undefined)}</h2>
          <p lang={cl} className="mt-1 text-[10px] font-semibold tracking-[0.2em] text-temple-gold-light/70">{albums.length} {L(unit, unit === 'PHOTOBOOKS' ? 'चित्र-पुस्तकें' : undefined)} · {T('CHOOSE A PHOTOBOOK', 'ஒரு படத்தொகுப்பைத் தேர்ந்தெடுங்கள்', 'कोई चित्र-पुस्तक चुनें')}</p>
        </div>
        <Deepam className="h-20 sm:h-24" />
      </div>
      <LotusBorder className="mt-6 block text-temple-gold/50" />
      <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {albums.map((album) => (
          <AlbumCover key={album.id} album={album} onOpen={() => onOpen(album)} />
        ))}
      </div>
    </section>
  );
}

/**
 * A closer look at one artefact: the photograph large, with its Tamil title, its site or
 * period, and notes on where it was found, written on a palm leaf that carries a single
 * Play / Pause control for the artefact's narration (see artifacts.js). Previous / Next
 * (and ← →) walk the gallery; Escape or the backdrop closes it, returning focus to the
 * case that opened it.
 *
 * A gallery with `layout: 'photobook'` (the ports, ports.js) shows its photographs in an
 * open photobook instead, one across each spread; turning its pages moves through the
 * gallery like Previous / Next, and the palm leaf follows: the photograph's caption with
 * every page, the site's description when the pages reach another site.
 */
export function ArtifactViewer({ gallery, index, onIndex, onClose }) {
  const artifact = gallery.artifacts[index];
  const count = gallery.artifacts.length;
  const book = gallery.layout === 'photobook';
  const closeRef = useRef(null);
  // A recorded narration (public/Audio) if the artefact has one, else the generated reading of
  // the very Tamil description shown on the palm leaf — whichever data file built the artefact.
  // English and Hindi narrations (title, then description) are further voices: the museum's
  // language plays first where it has one, and a தமிழ் / English / हिन्दी switch picks another.
  const { L, T, cl, lang } = useI18n();
  const recorded = artifact.narration && !artifact.narration.includes('/narration/ta/') ? artifact.narration : null;
  const tamilSrc = generatedNarration(artifact.tamilNote); // also marks the Tamil text as this player's
  const voices = {
    ta: recorded ?? tamilSrc,
    en: recorded ? null : englishNarration(englishTitle(artifact), artifact.note),
    hi: recorded ? null : hindiNarration(englishTitle(artifact), artifact.note),
  };
  const voiceCodes = Object.keys(voices).filter((code) => voices[code]);
  const preferredVoice = voices[lang] ? lang : 'ta';
  const [voice, setVoice] = useState(preferredVoice);
  useEffect(() => setVoice(preferredVoice), [lang, artifact.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const narrationSrc = voices[voice] ?? voices[preferredVoice] ?? voices.ta ?? voices.en ?? voices.hi ?? null;
  const narration = useNarration(narrationSrc);
  const step = (delta) => onIndex((index + delta + count) % count);
  const stepRef = useRef(step);
  stepRef.current = step;

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      else if (event.key === 'ArrowRight') stepRef.current(1);
      else if (event.key === 'ArrowLeft') stepRef.current(-1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  const roundButton =
    'grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-temple-gold-light/70 bg-teak-dark/90 text-temple-gold-light shadow-[0_6px_16px_#000a] transition-[scale] duration-300 ease-spring hover:scale-110 active:scale-90';

  return (
    <div
      className="fixed inset-0 z-[1200] grid animate-[fade-in_.25s_ease] place-items-center overflow-y-auto bg-[#0c0906]/90 p-4 backdrop-blur-sm sm:p-8"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <figure role="dialog" aria-modal="true" aria-labelledby="artifact-title" className={`relative w-full pt-10 lg:pt-0 ${book ? 'max-w-7xl' : 'max-w-6xl'}`}>
        <button ref={closeRef} type="button" onClick={onClose} aria-label={T('Close', 'மூடு', 'बंद करें')} className={`${roundButton} absolute top-0 right-0 z-10 lg:-top-4 lg:-right-4`}>
          <X size={18} />
        </button>
        {/*
          Side by side on wide screens: the photograph on the left, and on the right the
          titles, the palm-leaf description and the controls. On narrower screens they stack.
        */}
        {/*
          The photobook stays mounted while its pages turn (only the text beside it changes);
          a single photograph pops in afresh with each object.
        */}
        <div key={book ? gallery.id : artifact.id} className={`grid animate-pop-in grid-cols-1 items-center gap-8 lg:gap-12 ${book ? 'lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]' : 'lg:grid-cols-2'}`}>
          {book ? (
            <PhotoBook artifacts={gallery.artifacts} index={index} onIndex={onIndex} />
          ) : (
            <div className="relative grid min-h-[30dvh] place-items-center rounded-sm border border-temple-gold/50 bg-[radial-gradient(ellipse_at_50%_20%,#5a2e14,#140904_80%)] p-4 shadow-[0_24px_60px_#000c,inset_0_0_40px_#000a] sm:p-6 lg:min-h-[60dvh]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-5%,#ffd99a40,transparent_60%)]" />
              {artifact.video ? (
                // The film plays in the vitrine; starting it stops the narration, so the two never overlap.
                <video
                  key={artifact.video}
                  src={artifact.video}
                  poster={artifact.url}
                  controls
                  playsInline
                  preload="metadata"
                  aria-label={L(artifact.title)}
                  onPlay={() => narration.state.playing && narration.toggle()}
                  className="relative aspect-video max-h-[42dvh] w-full rounded-[2px] bg-black shadow-[0_0_0_1px_#d4a64a99,0_16px_30px_#000c] lg:max-h-[72dvh]"
                />
              ) : (
                <img src={artifact.url} alt={L(artifact.title)} decoding="async" className="relative max-h-[42dvh] w-auto max-w-full rounded-[2px] object-contain drop-shadow-[0_16px_20px_#000c] lg:max-h-[72dvh]" />
              )}
            </div>
          )}

          <figcaption className="flex min-w-0 flex-col items-center gap-2 text-center lg:items-start lg:text-left">
            {/* In a photobook the titles and description fade in afresh when the pages reach another site. */}
            <div key={book ? artifact.site : undefined} className={`flex flex-col items-center gap-2 lg:items-start ${book ? 'animate-[fade-in_.45s_ease]' : ''}`}>
              {artifact.tamil && <p lang="ta" className="text-[15px] leading-[1.8] font-bold text-[#e9a27a]">{artifact.tamil}</p>}
              <h3 id="artifact-title" lang={cl} className="font-serif text-2xl leading-snug font-bold text-temple-gold-light sm:text-3xl">{L(artifact.title)}</h3>
              {artifact.detail && <p lang={cl} className="text-xs leading-relaxed font-semibold tracking-[0.18em] text-[#ead8ae]/80 uppercase">{L(artifact.detail)}</p>}
              {/* A document the admin portal attached to the exhibit. */}
              {artifact.pdf && (
                <a href={artifact.pdf} target="_blank" rel="noopener" className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-temple-gold/60 px-3 py-1 text-xs font-semibold text-temple-gold-light transition-colors hover:bg-temple-gold/15">
                  <FileText size={13} /> {T('Read the PDF', 'PDF-ஐப் படிக்க', 'PDF पढ़ें')}
                </a>
              )}
            </div>
            {(artifact.note || artifact.tamilNote) && (
              <PalmLeafText className="mt-5 w-full text-left">
                <div className="mb-4 flex items-center gap-3 border-b border-[#8a5a2a]/30 pb-3">
                  <RecitationButton state={narration.state} available={Boolean(narrationSrc)} onToggle={narration.toggle} labels={narrationLabels(T)} />
                  <span className="flex flex-col text-[11px] leading-snug font-semibold tracking-wide text-[#5a3410]">
                    <span lang="ta">{narrationSrc ? 'விவரிப்பைக் கேளுங்கள்' : 'விவரிப்பு விரைவில்'}</span>
                    <span lang={cl}>{narrationSrc ? L('Listen to the narration', 'वर्णन सुनें') : L('Narration coming soon', 'वर्णन जल्द आ रहा है')}</span>
                  </span>
                  {voiceCodes.length > 1 && (
                    <span role="group" aria-label={T('Narration language', 'விவரிப்பு மொழி', 'वर्णन की भाषा')} className="ml-auto inline-flex overflow-hidden rounded-full border border-[#8a5a2a]/50 text-[11px] font-semibold" data-narration-voice>
                      {[
                        ['ta', 'தமிழ்'],
                        ['en', 'English'],
                        ['hi', 'हिन्दी'],
                      ]
                        .filter(([code]) => voices[code])
                        .map(([code, label]) => (
                        <button
                          key={code}
                          type="button"
                          lang={code}
                          aria-pressed={narrationSrc === voices[code]}
                          onClick={() => setVoice(code)}
                          className={`cursor-pointer px-2.5 py-1 transition-colors ${narrationSrc === voices[code] ? 'bg-terracotta-deep text-[#fbe7b5]' : 'text-terracotta-deep hover:bg-[#8a5a2a]/10'}`}
                        >
                          {label}
                        </button>
                      ))}
                    </span>
                  )}
                </div>
                {/* In a photobook: which photograph of the site is open, and what it shows. */}
                {book && artifact.plate && (
                  <p key={artifact.id} className="mb-4 animate-[fade-in_.4s_ease] border-b border-[#8a5a2a]/30 pb-3 text-sm leading-relaxed">
                    <span className="text-[11px] font-bold tracking-[0.16em] text-[#7d2e14] uppercase">
                      <span lang={cl}>{L(`Photograph ${artifact.plate} of ${artifact.plates}`, `तस्वीर ${artifact.plate} / ${artifact.plates}`)}</span> <span lang="ta" className="font-sans tracking-normal normal-case">· படம் {artifact.plate} / {artifact.plates}</span>
                    </span>
                    {artifact.caption && (
                      <>
                        <span lang={cl} className="mt-1 block font-serif text-base italic">{L(artifact.caption)}</span>
                        <span lang="ta" className="block text-[13px] leading-[1.8]">{artifact.caption.ta}</span>
                      </>
                    )}
                  </p>
                )}
                {/* A long description scrolls inside its leaf, so the view itself never has to. */}
                <div key={book ? artifact.site : undefined} className={`flex flex-col gap-5 lg:overflow-y-auto lg:pr-2 lg:[scrollbar-color:#8a5a2a66_transparent] lg:[scrollbar-width:thin] ${book ? 'animate-[fade-in_.45s_ease] lg:max-h-[24dvh]' : 'lg:max-h-[38dvh]'}`}>
                  {artifact.tamilNote && <p lang="ta" className="text-[15px] leading-[1.95] font-medium">{artifact.tamilNote}</p>}
                  {artifact.tamilNote && artifact.note && <KolamDivider className="mx-auto block w-full max-w-[160px] shrink-0 text-[#8a5a2a]/60" />}
                  {artifact.note && <p lang={cl} className="font-serif text-base leading-[1.75]">{L(artifact.note)}</p>}
                </div>
              </PalmLeafText>
            )}
            <nav className="mt-6 flex items-center gap-5" aria-label={T('Browse the gallery', 'காட்சியகத்தில் உலவுக', 'दीर्घा में आगे-पीछे देखें')}>
              <button type="button" onClick={() => step(-1)} aria-label={book ? T('Previous page', 'முந்தைய பக்கம்', 'पिछला पृष्ठ') : T('Previous object', 'முந்தைய பொருள்', 'पिछली वस्तु')} className={roundButton}>
                <ChevronLeft size={20} />
              </button>
              <span className="text-xs font-semibold tracking-[0.2em] text-temple-gold-light/80" aria-live={book ? 'polite' : undefined}>
                {index + 1} / {count}
              </span>
              <button type="button" onClick={() => step(1)} aria-label={book ? T('Next page', 'அடுத்த பக்கம்', 'अगला पृष्ठ') : T('Next object', 'அடுத்த பொருள்', 'अगली वस्तु')} className={roundButton}>
                <ChevronRight size={20} />
              </button>
            </nav>
          </figcaption>
        </div>
      </figure>
    </div>
  );
}
