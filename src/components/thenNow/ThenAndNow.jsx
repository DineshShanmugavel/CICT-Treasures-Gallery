import React, { useEffect, useRef } from 'react';
import { ArrowLeft, Map as MapIcon } from 'lucide-react';
import PlaceCard from './PlaceCard.jsx';
import { THEN_NOW_PLACES } from '../../data/thenAndNow.js';
import { KolamDivider, LotusBorder, TempleBand } from '../HeritageMotifs.jsx';
import { useI18n } from '../../i18n/index.js';

/**
 * Tamil Nadu: Then and Now — every place's heritage card (PlaceCard) in one scrolling view,
 * over the museum, with a row of links to jump between them. Opened at `placeId`, it scrolls to
 * that card (e.g. from "View Then & Now" on the map). `onShowOnMap(placeId)` opens the map of
 * Ancient Tamilakam at that place; Escape or the back button calls `onClose`.
 */
export default function ThenAndNow({ placeId = null, onClose, onShowOnMap }) {
  const { L, T, cl } = useI18n();
  const scrollRef = useRef(null);
  const backRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const previouslyFocused = document.activeElement;
    backRef.current?.focus({ preventScroll: true });
    // Caught first (capture), so Escape closes this view and not the room or hall beneath it too.
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      event.stopPropagation();
      onClose();
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  useEffect(() => {
    if (!placeId) return;
    const frame = window.requestAnimationFrame(() => document.getElementById(`then-now-${placeId}`)?.scrollIntoView({ block: 'start' }));
    return () => window.cancelAnimationFrame(frame);
  }, [placeId]);

  const jumpTo = (id) => (event) => {
    event.preventDefault();
    document.getElementById(`then-now-${id}`)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <div ref={scrollRef} role="dialog" aria-modal="true" aria-labelledby="then-now-title" className="fixed inset-0 z-[1250] overflow-x-hidden overflow-y-auto bg-midnight font-sans text-parchment">
      {/* Indigo night with a faint stone grain, lit warm from above */}
      <div className="bg-sandstone pointer-events-none fixed inset-0 opacity-[0.07]" aria-hidden="true" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,#f2d38b26,transparent_55%)]" aria-hidden="true" />

      <header className="sticky top-0 z-30 border-b-2 border-temple-gold/60 bg-midnight shadow-[0_8px_24px_#0009]">
        <TempleBand className="absolute inset-x-0 top-0 text-temple-gold/30" />
        <div className="relative flex items-center gap-3 px-4 pt-4 pb-2 sm:px-8">
          <button ref={backRef} type="button" onClick={onClose} className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-temple-gold/60 px-4 py-2 text-xs text-temple-gold-light transition hover:border-temple-gold-light hover:bg-temple-gold/10">
            <ArrowLeft size={15} /> <span className="hidden sm:inline">{T('Return to the museum', 'அருங்காட்சியகத்துக்குத் திரும்பு', 'संग्रहालय में लौटें')}</span>
          </button>
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p lang="ta" className="truncate text-sm leading-[1.6] font-bold text-temple-gold-light">தமிழ்நாடு: அன்றும் இன்றும்</p>
            <p lang={cl} className="truncate font-serif text-lg leading-tight font-bold tracking-wide text-ivory sm:text-xl">{L('Tamil Nadu: Then & Now')}</p>
          </div>
          {onShowOnMap && (
            <button type="button" onClick={() => onShowOnMap(null)} className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-temple-gold/60 px-3 py-2 text-xs text-temple-gold-light transition hover:bg-temple-gold/10 sm:px-4">
              <MapIcon size={15} /> <span className="hidden md:inline">{T('Ancient Tamilakam', 'பண்டைய தமிழகம்', 'प्राचीन तमिऴकम')}</span>
            </button>
          )}
        </div>
        <nav aria-label={T('Places', 'இடங்கள்', 'स्थल')} className="relative flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:px-8">
          {THEN_NOW_PLACES.map((place) => (
            <a key={place.id} href={`#then-now-${place.id}`} onClick={jumpTo(place.id)} className="shrink-0 rounded-full border border-[#5a6390] bg-midnight-light/70 px-3 py-1 text-[11px] whitespace-nowrap text-[#e4dcc6] transition hover:border-temple-gold-light hover:text-temple-gold-light">
              <span lang="ta">{place.ta}</span> · <span lang={cl}>{L(place.en)}</span>
            </a>
          ))}
        </nav>
      </header>

      <main className="relative mx-auto flex max-w-6xl flex-col gap-14 px-4 pt-10 pb-24 sm:px-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
          <h1 id="then-now-title" className="flex flex-col gap-1">
            <span lang="ta" className="text-2xl leading-[1.6] font-bold text-temple-gold-light sm:text-3xl">தமிழ்நாடு: அன்றும் இன்றும்</span>
            <span lang={cl} className="font-serif text-3xl font-bold tracking-wide text-ivory sm:text-4xl">{L('Tamil Nadu: Then & Now')}</span>
          </h1>
          <p lang={cl} className="font-serif text-lg text-[#e4dcc6] italic">{L('Discover how Tamil Nadu’s historic places have changed through time.', 'जानें कि तमिलनाडु के ऐतिहासिक स्थल समय के साथ कैसे बदले हैं।')}</p>
          <p lang="ta" className="text-sm leading-[1.9] text-[#d9cba8]">தமிழகத்தின் வரலாற்றுப் பெருமையையும் இன்றைய தோற்றத்தையும் அறிந்துகொள்வோம்.</p>
          <KolamDivider className="mt-2 block w-full max-w-xs text-temple-gold/60" />
          <p lang={cl} className="max-w-xl text-xs leading-relaxed text-[#bfb79f]">
            {L('Historical pictures are paintings, engravings, early photographs or excavation views; artists’ reconstructions are always marked as such and are not records of how a place looked.', 'ऐतिहासिक चित्र पेंटिंग, उत्कीर्ण छवियाँ, पुरानी तस्वीरें या उत्खनन के दृश्य हैं; कलाकारों के पुनर्निर्माण हमेशा ऐसे ही चिह्नित हैं और किसी स्थान के वास्तविक रूप के अभिलेख नहीं हैं।')}
          </p>
        </div>
        {THEN_NOW_PLACES.map((place) => (
          <PlaceCard key={place.id} place={place} onShowOnMap={onShowOnMap} />
        ))}
        <LotusBorder className="block text-temple-gold/40" />
      </main>
    </div>
  );
}
