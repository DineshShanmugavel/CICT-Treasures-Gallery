import React, { useEffect, useRef, useState } from 'react';
import { ImageOff } from 'lucide-react';
import { useI18n } from '../i18n/index.js';

const FLIP_MS = 900;

/**
 * One photograph printed across a whole spread of the album, landscape: the photo on cream
 * paper with its site and page number below. The gutter crease is drawn over it by the book,
 * as when a picture runs across the fold of a printed book.
 */
function Spread({ artifact, count, number }) {
  const [missing, setMissing] = useState(false);
  const { L, cl } = useI18n();
  return (
    <div className="absolute inset-0 bg-[#f3e8cf] bg-[radial-gradient(ellipse_at_50%_40%,#fbf4e2,transparent_75%),repeating-linear-gradient(0deg,#8a6a3a08_0_1px,transparent_1px_3px)]">
      {/* A flex box of fixed size, so a tall photograph is held to it (a grid track would grow to fit it). */}
      <div className="absolute inset-x-[5%] top-[6%] bottom-[14%] flex items-center justify-center">
        {missing ? (
          <ImageOff size={32} className="text-[#a08560]" aria-hidden="true" />
        ) : (
          <img
            src={artifact.url}
            alt={L(artifact.caption ?? artifact.title)}
            draggable={false}
            decoding="async"
            onError={() => setMissing(true)}
            className="max-h-full max-w-full bg-white object-contain p-[0.6%] shadow-[0_2px_8px_#3a200833,0_0_0_1px_#3a200814]"
          />
        )}
      </div>
      <div className="absolute inset-x-[7%] bottom-[4.5%] flex items-baseline justify-between gap-4 font-serif text-[clamp(9px,1.25vw,13px)] text-[#5a3a18]">
        <span className="truncate">
          <span lang={cl} className="font-semibold">{L(artifact.title)}</span>
          {artifact.tamil && <span lang="ta" className="font-sans"> · {artifact.tamil}</span>}
        </span>
        <span className="shrink-0 tracking-wider">{number} / {count}</span>
      </div>
    </div>
  );
}

/**
 * Half of a spread, as one page: `side` is the half shown. The page darkens towards the
 * spine, as paper does where it curves into the binding.
 */
function Page({ artifact, side, count, number }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className={`absolute inset-y-0 w-[200%] ${side === 'left' ? 'left-0' : 'right-0'}`}>
        <Spread artifact={artifact} count={count} number={number} />
      </div>
      <div
        className={`pointer-events-none absolute inset-0 ${side === 'left'
          ? 'bg-[linear-gradient(90deg,#ffffff1a,transparent_12%,transparent_78%,#3a20081f_92%,#3a200840)]'
          : 'bg-[linear-gradient(270deg,#ffffff1a,transparent_12%,transparent_78%,#3a20081f_92%,#3a200840)]'}`}
      />
    </div>
  );
}

/**
 * An open photobook for a gallery's photographs, one photograph per spread. Choosing the
 * right-hand page (or swiping left) turns to the next, the left-hand page to the previous;
 * the page turns over on its spine. The book follows `index`, so the viewer's own arrows and
 * keys turn its pages too, and the text beside it changes with them.
 */
export default function PhotoBook({ artifacts, index, onIndex }) {
  const { T } = useI18n();
  const count = artifacts.length;
  const [reducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [shown, setShown] = useState(index);
  const shownRef = useRef(index);
  // The page being turned: from spread `from` to `to`, forwards or back; `running` once it moves.
  const [flip, setFlip] = useState(null);
  const swipe = useRef(null);

  useEffect(() => {
    const from = shownRef.current;
    if (index === from) return undefined;
    shownRef.current = index;
    if (reducedMotion) {
      setFlip(null);
      setShown(index);
      return undefined;
    }
    // Wrapping from the last spread to the first still turns forwards.
    const forward = (index - from + count) % count <= count / 2;
    setFlip({ from, to: index, forward, running: false });
    let frame = window.requestAnimationFrame(() => {
      frame = window.requestAnimationFrame(() => setFlip((current) => current && { ...current, running: true }));
    });
    const done = window.setTimeout(() => {
      setFlip(null);
      setShown(index);
    }, FLIP_MS);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(done);
    };
  }, [index, count, reducedMotion]);

  // Load the neighbouring photographs ahead, so a turned page never shows an empty sheet.
  useEffect(() => {
    for (const delta of [1, -1]) new Image().src = artifacts[(index + delta + count) % count].url;
  }, [artifacts, index, count]);

  const step = (delta) => onIndex((index + delta + count) % count);
  const page = (spread, side) => <Page artifact={artifacts[spread]} side={side} count={count} number={spread + 1} />;
  const leftSpread = flip ? (flip.forward ? flip.from : flip.to) : shown;
  const rightSpread = flip ? (flip.forward ? flip.to : flip.from) : shown;

  // A swipe turns the page; the click that ends it is then ignored, so one swipe turns one page.
  const swiped = useRef(false);
  const onPointerDown = (event) => {
    swipe.current = { x: event.clientX, y: event.clientY };
    swiped.current = false;
  };
  const onPointerUp = (event) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(event.clientY - start.y)) {
      swiped.current = true;
      step(dx < 0 ? 1 : -1);
    }
  };
  const turn = (delta) => () => {
    if (swiped.current) swiped.current = false;
    else step(delta);
  };

  return (
    <div className="w-full select-none" role="group" aria-roledescription="photobook" aria-label={T(`Photobook, photograph ${index + 1} of ${count}`, `படத்தொகுப்பு, படம் ${index + 1} / ${count}`, `चित्र-पुस्तक, तस्वीर ${index + 1} / ${count}`)}>
      {/* The binding: a teak cover a little larger than the pages, the page block's edges showing below. */}
      <div className="relative rounded-md bg-[linear-gradient(160deg,#5a2e14,#2a1408)] p-[2.2%] shadow-[0_26px_50px_#000d,inset_0_0_0_1px_#d4a64a55,inset_0_0_18px_#0008]">
        <div className="relative aspect-[16/10] [perspective:2600px]" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
          {/* The page block's thickness, under the open spread */}
          <div className="absolute inset-x-[0.6%] -bottom-[1.2%] top-[1%] rounded-b-sm bg-[repeating-linear-gradient(180deg,#e9dcbc_0_1px,#d4c19a_1px_2px)] shadow-[0_3px_6px_#0006]" aria-hidden="true" />

          <div className="absolute inset-0">
            <div className="absolute inset-y-0 left-0 w-1/2">{page(leftSpread, 'left')}</div>
            <div className="absolute inset-y-0 right-0 w-1/2">{page(rightSpread, 'right')}</div>

            {/* The turning leaf: the old spread's half on its front, the new spread's other half on its back. */}
            {flip && (
              <div
                className={`pointer-events-none absolute inset-y-0 w-1/2 [transform-style:preserve-3d] ease-[cubic-bezier(.45,.05,.3,1)] ${flip.forward ? 'left-1/2 origin-left' : 'left-0 origin-right'}`}
                style={{
                  transform: `rotateY(${flip.running ? (flip.forward ? -180 : 180) : 0}deg)`,
                  transition: `transform ${flip.running ? FLIP_MS - 60 : 0}ms`,
                }}
                aria-hidden="true"
              >
                <div className="absolute inset-0 [backface-visibility:hidden]">
                  {page(flip.from, flip.forward ? 'right' : 'left')}
                  {flip.running && <div className={`absolute inset-0 animate-flip-shade ${flip.forward ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-black/35 to-transparent`} />}
                </div>
                <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  {page(flip.to, flip.forward ? 'left' : 'right')}
                  {flip.running && <div className={`absolute inset-0 animate-flip-shade ${flip.forward ? 'bg-gradient-to-r' : 'bg-gradient-to-l'} from-black/35 to-transparent`} />}
                </div>
              </div>
            )}

            {/* The gutter: a soft crease and shadow where the pages fold into the binding. */}
            <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[9%] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,#3a200814_25%,#3a200840_44%,#1a0c0480_50%,#3a200840_56%,#3a200814_75%,transparent)]" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[#2a14084d]" aria-hidden="true" />

            {/* Each page turns the book when chosen. */}
            <button type="button" onClick={turn(-1)} aria-label={T('Turn back a page', 'முந்தைய பக்கம்', 'पिछला पन्ना पलटें')} className="absolute inset-y-0 left-0 w-1/2 cursor-w-resize focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-temple-gold-light" />
            <button type="button" onClick={turn(1)} aria-label={T('Turn the page', 'பக்கத்தைப் புரட்டு', 'पन्ना पलटें')} className="group absolute inset-y-0 right-0 w-1/2 cursor-e-resize focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-temple-gold-light">
              {/* The corner lifts a little under the pointer, inviting a turn */}
              <span className="pointer-events-none absolute right-0 bottom-0 size-10 origin-bottom-right scale-0 bg-[linear-gradient(315deg,transparent_45%,#e2d2ad_46%,#f6edd8_70%)] shadow-[-2px_-2px_6px_#0002] transition-transform duration-300 ease-spring group-hover:scale-100" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      <p className="mt-4 text-center text-[11px] tracking-wide text-[#ead8ae]/70">
        Turn the pages, or swipe <span lang="ta" className="ml-1">· பக்கங்களைப் புரட்டுங்கள்</span>
      </p>
    </div>
  );
}
