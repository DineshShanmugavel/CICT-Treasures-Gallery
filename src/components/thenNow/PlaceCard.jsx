import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import CompareSlider from './CompareSlider.jsx';
import { KIND_LABELS, SECTION_TITLES, placeFolder, placeImageUrl } from '../../data/thenAndNow.js';
import { companionLang, languageOf, pick, translate, tri, useI18n } from '../../i18n/index.js';

const SECTION_ORDER = ['then', 'now', 'survives', 'significance'];

/** One side of the comparison, for the slider: its picture, alt text, and what to add if it is missing. */
function sideOf(place, file, kind) {
  const image = place.images.find((candidate) => candidate.file === file);
  return {
    src: image ? placeImageUrl(place, file) : null,
    alt: image ? `${translate(place.en)} — ${pick(image, companionLang())} (${pick(KIND_LABELS[image.kind], companionLang()).toLowerCase()})` : '',
    missingHint: `public/${placeFolder(place)}/${file}`,
    image,
    kind,
  };
}

/** What a side of the comparison shows, under the slider: the picture's title and whether it is a reconstruction. */
function SideCaption({ side, label, language }) {
  const { image } = side;
  return (
    <p className="min-w-0 flex-1 text-[11px] leading-relaxed text-[#5a3a1a]">
      <span className="font-bold tracking-[0.12em] text-terracotta-deep uppercase">{label}</span>{' '}
      {image ? (
        <>
          <span lang={language}>{pick(image, language)}</span>
          <span className={`block font-semibold ${image.kind === 'reconstruction' ? 'text-[#9b2a1a]' : 'text-[#7a5a32]'}`} lang={language}>
            {pick(KIND_LABELS[image.kind], language)}
          </span>
        </>
      ) : (
        <span lang={language}>{tri('No picture yet', 'படம் இன்னும் சேர்க்கப்படவில்லை', 'अभी कोई तस्वीर नहीं', language)}</span>
      )}
    </p>
  );
}

/**
 * A place's heritage card (thenAndNow.js): its names, the then-and-now comparison slider, what
 * each picture is (reconstructions are always marked as such), and the four texts — then, now,
 * what survives, and why it matters — in Tamil or English. `onShowOnMap`, if given, adds a
 * link to the place on the map of Ancient Tamilakam.
 */
export default function PlaceCard({ place, onShowOnMap, headingLevel = 2 }) {
  const { L, T, cl } = useI18n();
  // Tamil, or the visitor's language: English, or Hindi when the museum is in Hindi.
  const [choice, setChoice] = useState('ta');
  const language = choice === 'ta' ? 'ta' : cl;
  const LANGUAGES = [
    ['ta', 'தமிழ்', 'ta'],
    ['other', languageOf(cl).label, cl],
  ];
  const then = sideOf(place, place.compare.then, 'then');
  const now = sideOf(place, place.compare.now, 'now');
  const Heading = `h${headingLevel}`;
  const index = choice === 'ta' ? 0 : 1;

  return (
    <article id={`then-now-${place.id}`} aria-labelledby={`then-now-${place.id}-title`} className="scroll-mt-48 overflow-hidden rounded-lg border border-temple-gold/70 bg-ivory text-[#2a1408] shadow-[0_24px_60px_#000a]">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-temple-gold/50 bg-gradient-to-r from-midnight to-midnight-light px-5 pt-4 pb-3 sm:px-7">
        <div className="min-w-0">
          <p lang="ta" className="text-lg leading-[1.6] font-bold text-temple-gold-light sm:text-xl">{place.ta}</p>
          <Heading id={`then-now-${place.id}-title`} lang={cl} className="font-serif text-2xl leading-tight font-bold tracking-wide text-[#f8f1e1] sm:text-3xl">{L(place.en)}</Heading>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {onShowOnMap && (
            <button type="button" onClick={() => onShowOnMap(place.id)} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-temple-gold/70 px-3 py-1.5 text-xs font-semibold text-temple-gold-light transition hover:bg-temple-gold/20">
              <MapPin size={13} /> <span lang={cl}>{L('Show on the map', 'मानचित्र पर दिखाएँ')}</span> <span lang="ta" className="hidden sm:inline">· வரைபடத்தில்</span>
            </button>
          )}
          <div className="relative grid auto-cols-fr grid-flow-col rounded-full border border-temple-gold/60 bg-black/30 p-1" role="group" aria-label={T('Card language', 'அட்டையின் மொழி', 'कार्ड की भाषा')}>
            <span
              className="absolute inset-y-1 left-1 rounded-full bg-gradient-to-br from-[#f5dc98] to-[#c89a4d] transition-transform duration-500 ease-spring"
              style={{ width: `calc((100% - 0.5rem) / ${LANGUAGES.length})`, transform: `translateX(${index * 100}%)` }}
              aria-hidden="true"
            />
            {LANGUAGES.map(([code, label, labelLang]) => (
              <button key={code} type="button" lang={labelLang} onClick={() => setChoice(code)} aria-pressed={code === choice} className={`relative z-10 min-w-16 cursor-pointer rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors ${code === choice ? 'text-[#21170b]' : 'text-[#e8d6ad] hover:text-white'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-8">
        <div className="flex min-w-0 flex-col gap-3">
          <CompareSlider then={then} now={now} label={L(place.en)} />
          <div className="flex gap-4">
            <SideCaption side={then} label={tri('Then', 'அன்று', 'तब', language)} language={language} />
            <SideCaption side={now} label={tri('Now', 'இன்று', 'अब', language)} language={language} />
          </div>
          <p className="text-[11px] leading-relaxed text-[#7a5a32]" lang={language}>
            {tri(
              'Drag the divider, or focus it and use the arrow keys, to compare. The two pictures are not taken from the same viewpoint.',
              'கோட்டை இடம் வலமாக இழுத்து அன்றைய, இன்றைய காட்சிகளை ஒப்பிடுங்கள். இரு படங்களும் ஒரே இடத்திலிருந்து எடுக்கப்பட்டவை அல்ல.',
              'तुलना करने के लिए विभाजक को खींचें, या उस पर फ़ोकस करके तीर कुंजियों का उपयोग करें। दोनों तस्वीरें एक ही स्थान से नहीं ली गई हैं।',
              language,
            )}
          </p>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          {SECTION_ORDER.map((key) => (
            <section key={key} aria-labelledby={`then-now-${place.id}-${key}`} className="border-l-2 border-temple-gold/70 pl-4">
              <h3 id={`then-now-${place.id}-${key}`} lang={language} className={`font-bold text-terracotta-deep ${language === 'ta' ? 'text-[15px] leading-[1.7]' : 'font-serif text-base'}`}>
                {pick(SECTION_TITLES[key], language)}
              </h3>
              <p lang={language} className={`mt-1 ${language === 'ta' ? 'text-[14px] leading-[1.9]' : 'font-serif text-[15px] leading-[1.7]'}`}>{pick(place.sections[key], language)}</p>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
