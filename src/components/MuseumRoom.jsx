import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { ArrowLeft, BookOpenText, Landmark, LibraryBig, ScrollText } from 'lucide-react';
import ArtifactGallery, { AlbumShelf, ArtifactViewer, PalmLeafText } from './ArtifactGallery.jsx';
import ThiruvalluvarScroll from './ThiruvalluvarScroll.jsx';
import ShrineNarration from './ShrineNarration.jsx';
import { Deepam } from './HeritageMotifs.jsx';
import ExhibitionPanels from './ExhibitionPanels.jsx';
import { ROOM_PANELS } from '../data/exhibitionTexts.js';
import GlassCabinet from './GlassCabinet.jsx';
import { collectionSummary } from '../data/roomBooks.js';
import FlipBookViewer from './flipbook/FlipBookViewer.jsx';
import OlaiBundleShelf from './OlaiBundleShelf.jsx';
import OlaiLeafViewer from './OlaiLeafViewer.jsx';
import { KolamDivider, LotusBorder, PaintedCeilingBand, StonePillar, TempleBand, TempleFrieze } from './HeritageMotifs.jsx';
import { GlowFireflies } from './Fireflies.jsx';
import PlaceCard from './thenNow/PlaceCard.jsx';
import { getPlace } from '../data/thenAndNow.js';
import { playSound } from '../audio/ambience.js';
import { useI18n } from '../i18n/index.js';

/* The rooms walked in 3D (`immersive`), loaded only when one is opened. */
const IMMERSIVE_ROOMS = {
  ainthinai: lazy(() => import('./ainthinai/AinthinaiRoom3D.jsx')),
};

/** Dark, lamp-lit sandstone walls laid in ashlar courses, under the painted ceiling and a carved frieze. */
function StoneHall() {
  return (
    <div className="pointer-events-none fixed inset-0" aria-hidden="true">
      <div className="bg-sandstone absolute inset-0" />
      <div className="absolute inset-0 bg-[#1c0d05]/82" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(180deg,transparent_0_86px,#00000055_86px_88px,#ffffff0c_88px_89px),repeating-linear-gradient(90deg,transparent_0_178px,#00000033_178px_180px)]" />
      <PaintedCeilingBand className="absolute inset-x-0 top-16" />
      <div className="absolute inset-x-0 top-[148px]">
        <TempleFrieze className="block text-[#b8a07e]/55" />
        <div className="h-12 bg-gradient-to-b from-[#0a0503]/75 to-transparent" />
      </div>
      {/* Warm lamplight from above and a terracotta glow from the floor */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,#ffd99a40,transparent_55%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[radial-gradient(ellipse_at_50%_120%,#b4532a33,transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_45%,#0a0503e6_100%)]" />
      {/* Temple pillars along both walls on wide screens */}
      <StonePillar className="absolute top-16 bottom-0 left-3 hidden w-14 opacity-70 brightness-75 xl:flex" />
      <StonePillar className="absolute top-16 right-3 bottom-0 hidden w-14 opacity-70 brightness-75 xl:flex" />
      <GlowFireflies count={8} seed={17} />
    </div>
  );
}

/**
 * The Manuscripts Library's centrepiece: an invitation, written on a palm leaf between
 * two lamps, to read the Thirukkural in the museum's own Olai Suvadi.
 */
function OlaiSuvadiFeature({ onOpen }) {
  const { L, cl } = useI18n();
  return (
    <section aria-labelledby="olai-feature-title" className="mx-auto flex w-full max-w-4xl items-center gap-4 sm:gap-8">
      <Deepam className="hidden h-28 shrink-0 sm:block" />
      <PalmLeafText className="flex-1 text-center">
        <p lang="ta" className="text-sm leading-[1.8] font-bold text-[#7d2e14]">ஓலைச்சுவடியில் திருக்குறள்</p>
        <h2 id="olai-feature-title" lang={cl} className="font-serif text-2xl leading-snug font-bold">{L('Read the Thirukkural on Palm Leaves', 'ताड़पत्रों पर तिरुक्कुरल पढ़ें')}</h2>
        <p lang={cl} className="mx-auto mt-2 max-w-xl font-serif text-base leading-relaxed">
          {L('Untie the cord and turn the leaves of an Olai Suvadi: all 1330 kurals, as they were once copied — each with its meaning and recitation.', 'ओलै सुवडि की डोरी खोलें और उसके पत्ते पलटें: सभी 1330 कुरल, जैसे कभी उतारे गए थे — हर एक अपने अर्थ और पाठ के साथ।')}
        </p>
        <button
          type="button"
          onClick={onOpen}
          className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#6a3a1a] bg-[radial-gradient(circle_at_35%_30%,#f7dc95,#c4913f_55%,#7a5218)] px-5 py-2.5 text-sm font-bold text-[#3a2008] shadow-[0_3px_8px_#0007,inset_0_1px_#fff6] transition-[scale,box-shadow] duration-300 ease-spring hover:scale-105 hover:shadow-[0_0_18px_#f1c35b99] active:scale-95"
        >
          <BookOpenText size={17} /> <span lang={cl}>{L('Open the Olai Suvadi', 'ओलै सुवडि खोलें')}</span> <span lang="ta" className="font-sans">· சுவடியைத் திற</span>
        </button>
      </PalmLeafText>
      <Deepam className="hidden h-28 shrink-0 sm:block" />
    </section>
  );
}

/**
 * Full-screen wing interior: display cases of artefacts (opened in a closer view) and
 * carved cabinets whose books open in the flip-book reader. A room with
 * `feature: 'olai-suvadi'` (the Manuscripts Library) also opens the palm-leaf reader, and
 * a room with `olaiShelves` lays out tied manuscript bundles that open leaf by leaf. A room of
 * the Then vs Now hall (`place`) opens with that place's comparison card, whose map link calls
 * `onShowOnMap(placeId)`. A room with `immersive` (the Five Landscapes) is walked in 3D instead.
 */
export default function MuseumRoom(props) {
  const Immersive = IMMERSIVE_ROOMS[props.room.immersive];
  if (!Immersive) return <ClassicRoom {...props} />;
  // Without WebGL, or if the 3D room fails, the same collection is shown as an ordinary room.
  const classic = <ClassicRoom {...props} />;
  return (
    <Suspense fallback={<div className="fixed inset-0 z-[1100] bg-[#120b06]" aria-busy="true" />}>
      <Immersive room={props.room} onExit={props.onExit} fallback={classic} />
    </Suspense>
  );
}

function ClassicRoom({ room, onExit, onShowOnMap }) {
  const { L, T, cl } = useI18n();
  const [selectedBook, setSelectedBook] = useState(null);
  const [viewing, setViewing] = useState(null); // { gallery, index } of the artefact in the closer view
  const [readingLeaves, setReadingLeaves] = useState(false);
  const [openBundle, setOpenBundle] = useState(null);
  const [visible, setVisible] = useState(false);
  const closeReader = useCallback(() => setSelectedBook(null), []);
  const closeViewer = useCallback(() => setViewing(null), []);
  const closeLeaves = useCallback(() => setReadingLeaves(false), []);
  const closeBundle = useCallback(() => setOpenBundle(null), []);
  const galleries = room.galleries ?? [];
  const olaiShelves = room.olaiShelves ?? [];

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setVisible(true));
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    // The readers and the closer view handle their own Escape; only leave the room when all are closed.
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !selectedBook && !viewing && !readingLeaves && !openBundle) onExit();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedBook, viewing, readingLeaves, openBundle, onExit]);

  return (
    <div
      className={`fixed inset-0 z-[1100] overflow-x-hidden overflow-y-auto bg-teak-dark font-sans text-parchment transition duration-700 ${
        visible ? 'scale-100 opacity-100' : 'scale-[1.03] opacity-0'
      }`}
      aria-labelledby="room-title"
      role="region"
    >
      <StoneHall />

      <header className="bg-teak sticky top-0 z-10 border-b-2 border-temple-gold/60 shadow-[0_8px_24px_#000a]">
        <TempleBand className="absolute inset-x-0 top-0 text-temple-gold/40" />
        <div className="relative flex items-center gap-4 px-4 pt-5 pb-3 sm:px-8">
          <button
            type="button"
            onClick={onExit}
            className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-temple-gold/60 bg-teak-dark px-4 py-2 text-xs text-temple-gold-light transition duration-300 ease-spring hover:scale-105 hover:border-temple-gold-light active:scale-95"
          >
            <ArrowLeft size={15} /> <span className="hidden sm:inline">{T('Return to gallery', 'காட்சியகத்துக்குத் திரும்பு', 'दीर्घा पर लौटें')}</span>
          </button>
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p className="truncate text-xs font-bold text-[#e9a27a]">{room.tamil}</p>
            <h1 id="room-title" lang={cl} className="truncate font-serif text-2xl leading-tight font-bold tracking-wide text-temple-gold-light sm:text-3xl">{L(room.title)}</h1>
          </div>
          {room.id === 'shrine' && <ShrineNarration />}
          <span className="hidden items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-temple-gold-light/80 sm:inline-flex">
            {room.feature === 'olai-suvadi' || olaiShelves.length ? <ScrollText size={15} /> : galleries.length ? <Landmark size={15} /> : <LibraryBig size={15} />}{' '}
            {room.feature === 'olai-suvadi' && !galleries.length && !olaiShelves.length && !room.cabinets.length ? T('PALM-LEAF ARCHIVE', 'பனையோலைக் காப்பகம்', 'ताड़पत्र अभिलेखागार') : collectionSummary(room).toUpperCase()}
          </span>
        </div>
        <LotusBorder className="absolute inset-x-0 -bottom-[18px] block text-temple-gold/50" />
      </header>

      {/*
        The painted ceiling and carved frieze behind the room reach about 250px down the
        screen, so the content starts below them.
      */}
      <main className="relative px-4 pt-36 pb-20 sm:px-8 sm:pt-40 xl:px-24">
        {/* Tamil vowel signs reach well above and below the line, so Tamil text gets taller lines. */}
        <div className="mx-auto mb-16 flex max-w-2xl flex-col items-center gap-6 px-2 text-center">
          {room.tamilDescription && <p lang="ta" className="text-[15px] leading-[1.9] font-semibold text-[#e9c49a]">{room.tamilDescription}</p>}
          <p lang={cl} className="font-serif text-lg leading-relaxed text-[#ead9b8] italic">{L(room.description)}</p>
          <KolamDivider className="my-1 block w-full max-w-xs text-temple-gold/60" />
          <div className="flex flex-col gap-3 text-xs leading-relaxed tracking-wide text-sepia-light">
            {galleries.some((gallery) => gallery.layout !== 'photobook') && (
              <p>
                <span lang={cl}>{L('Choose an object to look closer', 'पास से देखने के लिए कोई वस्तु चुनें')}</span>
                <span lang="ta" className="mt-1 block leading-[1.8]">ஒரு பொருளைத் தேர்ந்தெடுத்து அருகில் காணுங்கள்</span>
              </p>
            )}
            {galleries.some((gallery) => gallery.layout === 'photobook') && (
              <p>
                <span lang={cl}>{L('Choose a photobook from the shelf and turn its pages', 'अलमारी से कोई चित्र-पुस्तक चुनें और उसके पन्ने पलटें')}</span>
                <span lang="ta" className="mt-1 block leading-[1.8]">அலமாரியிலிருந்து ஒரு படத்தொகுப்பைத் தேர்ந்தெடுத்துப் பக்கங்களைப் புரட்டுங்கள்</span>
              </p>
            )}
            {olaiShelves.length > 0 && (
              <p>
                <span lang={cl}>{L('Untie a manuscript bundle and turn its leaves', 'किसी पांडुलिपि-गट्ठर को खोलें और उसके पत्ते पलटें')}</span>
                <span lang="ta" className="mt-1 block leading-[1.8]">ஒரு சுவடிக் கட்டை அவிழ்த்து ஏடுகளைப் புரட்டுங்கள்</span>
              </p>
            )}
            {room.feature === 'olai-suvadi' && (
              <p>
                <span lang={cl}>{L('Open the Olai Suvadi to turn its palm leaves', 'ओलै सुवडि खोलकर उसके ताड़पत्र पलटें')}</span>
                <span lang="ta" className="mt-1 block leading-[1.8]">ஓலைச்சுவடியைத் திறந்து ஏடுகளைப் புரட்டுங்கள்</span>
              </p>
            )}
            {room.cabinets.length > 0 && (
              <p>
                <span lang={cl}>{L('Open a cabinet’s glass door, then choose a volume', 'अलमारी का काँच का दरवाज़ा खोलें, फिर कोई ग्रंथ चुनें')}</span>
                <span lang="ta" className="mt-1 block leading-[1.8]">கண்ணாடிக் கதவைத் திறந்து ஒரு நூலைத் தேர்ந்தெடுங்கள்</span>
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-24">
          {room.feature === 'olai-suvadi' && <OlaiSuvadiFeature onOpen={() => setReadingLeaves(true)} />}
          {room.place && <PlaceCard place={getPlace(room.place)} onShowOnMap={onShowOnMap} />}
          <ExhibitionPanels panels={ROOM_PANELS[room.id]} />
          <OlaiBundleShelf shelves={olaiShelves} onOpen={(bundle) => { playSound('shelf'); setOpenBundle(bundle); }} />
          <AlbumShelf albums={galleries.filter((gallery) => gallery.layout === 'photobook')} shelf={room.shelf} onOpen={(gallery) => { playSound('shelf'); setViewing({ gallery, index: 0 }); }} />
          {galleries.filter((gallery) => gallery.layout !== 'photobook').map((gallery) => (
            <ArtifactGallery key={gallery.id} gallery={gallery} onOpen={(index) => { playSound('cabinet-open'); setViewing({ gallery, index }); }} />
          ))}
          {room.cabinets.map((cabinet) => (
            <GlassCabinet key={cabinet.id} cabinet={cabinet} onSelectBook={(book) => { playSound('shelf'); setSelectedBook(book); }} />
          ))}
        </div>
      </main>

      {readingLeaves && <ThiruvalluvarScroll startReading={1} onClose={closeLeaves} />}
      {selectedBook && <FlipBookViewer book={selectedBook} onClose={closeReader} />}
      {openBundle && <OlaiLeafViewer key={openBundle.id} bundle={openBundle} onClose={closeBundle} />}
      {viewing && (
        <ArtifactViewer
          gallery={viewing.gallery}
          index={viewing.index}
          onIndex={(index) => setViewing((current) => ({ ...current, index }))}
          onClose={closeViewer}
        />
      )}
    </div>
  );
}
