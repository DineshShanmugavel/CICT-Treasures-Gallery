import React from 'react';
import { Deepam, LotusBorder } from './HeritageMotifs.jsx';
import { useI18n } from '../i18n/index.js';

const twine = 'bg-[repeating-linear-gradient(25deg,#d9b779_0_2px,#8a6534_2px_4px)]';

/** How many leaf edges show along the bundle's side: more for a thicker bundle. */
const edgeCount = (leaves) => Math.max(3, Math.min(9, Math.round(Math.log2(leaves + 1))));

/**
 * The rope round a closed bundle at one of its cord holes: the turns wound over the top leaf
 * and down its side, and the knot where the cord is tied off.
 */
function RopeBand({ position, children }) {
  return (
    <span className={`absolute inset-y-[-3px] ${position} w-4 -translate-x-1/2`} aria-hidden="true">
      {[-4, 0, 4].map((x) => (
        <span key={x} style={{ left: `calc(50% + ${x}px)` }} className={`absolute inset-y-0 w-[3px] -translate-x-1/2 rounded-full shadow-[1px_0_2px_#0009] ${twine}`} />
      ))}
      <span className="absolute top-[34%] left-1/2 size-4 -translate-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#e8c98a,#8a6534_70%)] shadow-[0_2px_4px_#000a]" />
      {children}
    </span>
  );
}

/**
 * One manuscript lying closed on the shelf: a stack of palm leaves on a wooden board, its top
 * leaf incised with the work's Tamil name, tied with rope at both cord holes. From the right
 * knot hangs a parchment tag with the English name and the catalogue number.
 */
function OlaiBundle({ bundle, onOpen }) {
  const { L, T, cl } = useI18n();
  const edges = edgeCount(bundle.leaves.length);
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={T(`Untie the bundle: ${bundle.title} (${bundle.tamil}), ${bundle.leaves.length} leaves`, `சுவடிக் கட்டை அவிழ்: ${bundle.tamil}, ${bundle.leaves.length} ஏடுகள்`, `गट्ठर खोलें: ${L(bundle.title)} (${bundle.tamil}), ${bundle.leaves.length} पत्ते`)}
      className="group relative flex cursor-pointer flex-col items-stretch pb-14 text-left transition-[translate] duration-500 ease-spring hover:-translate-y-1.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-temple-gold-light"
    >
      <span className="relative block [perspective:700px]">
        {/* The bundle, tilted back a little so its top leaf faces the visitor */}
        <span className="relative block origin-bottom transition-transform duration-500 ease-spring [transform:rotateX(14deg)] group-hover:[transform:rotateX(6deg)]">
          {/* Top leaf, with the title incised and inked into it */}
          <span className="bg-palm-leaf relative flex min-h-16 items-center justify-center rounded-[28px/50%] px-[16%] py-3 shadow-[inset_0_0_0_1px_#8a5a2a55,inset_0_-3px_6px_#8a5a2a44] transition-shadow duration-300 group-hover:shadow-[inset_0_0_0_1px_#8a5a2a55,inset_0_-3px_6px_#8a5a2a44,0_0_24px_#f1c35b55]">
            {['left-[9%]', 'left-[91%]'].map((position) => (
              <span key={position} className={`absolute top-1/2 ${position} size-2 -translate-1/2 rounded-full bg-[#5a3410] ring-1 ring-[#3a1d0a]/70`} aria-hidden="true" />
            ))}
            <span lang="ta" className="line-clamp-2 text-center text-[15px] leading-[1.7] font-bold text-[#3a1d0a]/85 [text-shadow:0_1px_0_#fff6,0_-1px_0_#5a341055]">
              {bundle.tamil}
            </span>
          </span>
          {/* The edges of the leaves beneath, and the wooden board under them */}
          <span className="flex flex-col gap-px px-[1.5%] pt-px" aria-hidden="true">
            {Array.from({ length: edges }, (_, i) => (
              <span key={i} className="bg-palm-leaf block h-[3px] rounded-full shadow-[0_1px_1px_#0006]" style={{ filter: `brightness(${0.97 - i * 0.04})` }} />
            ))}
          </span>
          <span className="bg-teak mt-px block h-3 rounded-[14px/50%] shadow-[inset_0_0_0_1px_#d4a64a44,0_6px_12px_#000b]" aria-hidden="true" />
          <RopeBand position="left-[22%]" />
          <RopeBand position="left-[78%]">
            {/* The name tag, hanging from the knot on a loop of cord */}
            <span className={`absolute top-[34%] left-1/2 h-12 w-[2px] origin-top rotate-[10deg] ${twine} transition-transform duration-500 ease-spring group-hover:rotate-[4deg]`}>
              <span className="bg-parchment-letter absolute top-full left-1/2 block w-36 -translate-x-1/2 -rotate-[8deg] rounded-[3px] border border-[#8a5a2a]/50 px-2.5 py-1.5 text-center shadow-[0_4px_10px_#000a] transition-transform duration-500 ease-spring [clip-path:polygon(12%_0,88%_0,100%_22%,100%_100%,0_100%,0_22%)] group-hover:-rotate-[3deg]">
                <span className="mx-auto mb-1 block size-1.5 rounded-full bg-[#5a3410]/70" />
                <span lang={cl} className="line-clamp-2 block font-serif text-[13px] leading-tight font-bold text-[#3a2008]">{L(bundle.title)}</span>
                <span lang={cl} className="mt-0.5 block text-[9px] font-semibold tracking-[0.12em] text-[#7d2e14]">
                  {bundle.number ? `${L('No.', 'सं.')} ${bundle.number} · ` : ''}{bundle.leaves.length} {L('LEAVES', 'पत्ते')}
                </span>
              </span>
            </span>
          </RopeBand>
        </span>
      </span>
      {/* The shelf plank it lies on */}
      <span className="bg-teak mt-1 block h-3 rounded-sm border-t border-temple-gold/50 shadow-[0_8px_14px_#000b]" aria-hidden="true" />
    </button>
  );
}

/**
 * The Manuscripts Library's shelves: each a heading flanked by deepams and its palm-leaf
 * bundles, tied and labelled. Choosing a bundle calls `onOpen(bundle)`.
 */
export default function OlaiBundleShelf({ shelves, onOpen }) {
  const { L, T, cl } = useI18n();
  if (!shelves?.length) return null;
  return shelves.map((shelf) => (
    <section key={shelf.id} aria-labelledby={`${shelf.id}-title`}>
      <div className="flex items-end justify-center gap-5 sm:gap-10">
        <Deepam className="h-20 sm:h-24" />
        <div className="flex flex-col gap-1.5 pb-1 text-center">
          <p lang="ta" className="text-sm leading-[1.8] font-bold text-[#e9a27a]">{shelf.tamil}</p>
          <h2 id={`${shelf.id}-title`} lang={cl} className="font-serif text-2xl leading-snug font-bold tracking-wide text-temple-gold-light sm:text-3xl">{L(shelf.title)}</h2>
          <p className="mt-1 text-[10px] font-semibold tracking-[0.2em] text-temple-gold-light/70">{T(`${shelf.bundles.length} BUNDLES · UNTIE ONE TO TURN ITS LEAVES`, `${shelf.bundles.length} சுவடிக் கட்டுகள் · ஒன்றை அவிழ்த்து ஏடுகளைப் புரட்டுங்கள்`, `${shelf.bundles.length} गट्ठर · किसी एक को खोलकर पत्ते पलटें`)}</p>
        </div>
        <Deepam className="h-20 sm:h-24" />
      </div>
      <LotusBorder className="mt-6 block text-temple-gold/50" />
      <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {shelf.bundles.map((bundle) => (
          <OlaiBundle key={bundle.id} bundle={bundle} onOpen={() => onOpen(bundle)} />
        ))}
      </div>
    </section>
  ));
}
