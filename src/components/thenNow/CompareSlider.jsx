import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronsLeftRight, ImageOff } from 'lucide-react';
import { useI18n } from '../../i18n/index.js';

/** Where the divider rests at first, and how far an arrow key (or Page Up / Down) moves it, in percent. */
const START = 50;
const STEP = 5;
const PAGE_STEP = 20;
const clampPercent = (value) => Math.min(100, Math.max(0, value));

/**
 * One side of the comparison: the picture, cropped to the frame, or a quiet placeholder when it
 * is missing or fails to load — naming the file to add (`missingHint`), never a broken image.
 */
function Picture({ src, alt, missingHint, side }) {
  const { T } = useI18n();
  const [failed, setFailed] = useState(!src);
  useEffect(() => setFailed(!src), [src]);
  if (failed) {
    return (
      <div className={`absolute inset-0 grid place-items-center p-6 text-center ${side === 'then' ? 'bg-[radial-gradient(ellipse_at_30%_40%,#3a2c1a,#121833_80%)]' : 'bg-[radial-gradient(ellipse_at_70%_40%,#2b3460,#121833_80%)]'}`}>
        <div className={`flex max-w-[45%] flex-col items-center gap-2 text-[#e9dcc0] ${side === 'then' ? 'mr-auto' : 'ml-auto'}`}>
          <ImageOff size={26} className="text-temple-gold/70" aria-hidden="true" />
          <p className="text-xs font-semibold tracking-wide">{side === 'then' ? T('Historical image to be added', 'வரலாற்றுப் படம் சேர்க்கப்படும்', 'ऐतिहासिक चित्र जोड़ा जाना है') : T('Present-day photograph to be added', 'இன்றைய படம் சேர்க்கப்படும்', 'वर्तमान तस्वीर जोड़ी जानी है')}</p>
          {missingHint && <p className="font-mono text-[10px] leading-snug break-all text-[#c9b892]">{missingHint}</p>}
        </div>
      </div>
    );
  }
  return <img src={src} alt={alt} draggable="false" onError={() => setFailed(true)} className="absolute inset-0 size-full object-cover" />;
}

/**
 * A then-and-now comparison: both pictures in one frame, the historical one revealed from the
 * left up to a draggable vertical divider. Drag anywhere on the frame (mouse, touch or pen;
 * vertical swipes still scroll the page), or focus the handle and use ← → (Home / End,
 * Page Up / Down). While dragging, the divider is moved straight in the DOM, so it follows the
 * pointer without re-rendering; a tap or a key press glides it there instead.
 *
 * `then` and `now` are { src, alt, missingHint }; `label` names the place for the slider.
 */
export default function CompareSlider({ then, now, label }) {
  const { T } = useI18n();
  const frameRef = useRef(null);
  const handleRef = useRef(null);
  const percentRef = useRef(START);
  const dragRef = useRef(null); // { pointerId, moved }
  const [, setSettled] = useState(START); // re-render the label for screen readers once the divider rests

  const place = useCallback((percent, glide = false) => {
    const frame = frameRef.current;
    if (!frame) return;
    percentRef.current = clampPercent(percent);
    frame.classList.toggle('compare-glide', glide);
    frame.style.setProperty('--divider', `${percentRef.current}%`);
    handleRef.current?.setAttribute('aria-valuenow', String(Math.round(percentRef.current)));
    handleRef.current?.setAttribute('aria-valuetext', `${Math.round(percentRef.current)}% then, ${Math.round(100 - percentRef.current)}% now`);
  }, []);

  useEffect(() => place(START), [place]);

  const percentAt = (clientX) => {
    const rect = frameRef.current.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  };

  const onPointerDown = (event) => {
    if (event.button !== 0 && event.pointerType === 'mouse') return;
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, dragging: event.pointerType === 'mouse' };
    if (event.pointerType === 'mouse') {
      event.currentTarget.setPointerCapture(event.pointerId);
      place(percentAt(event.clientX), true);
    }
  };
  const onPointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    // On touch, only a sideways movement takes the divider; an upward or downward one scrolls the page.
    if (!drag.dragging) {
      const dx = Math.abs(event.clientX - drag.startX);
      const dy = Math.abs(event.clientY - drag.startY);
      if (dx < 6 && dy < 6) return;
      if (dy > dx) {
        dragRef.current = null;
        return;
      }
      drag.dragging = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    place(percentAt(event.clientX));
  };
  const onPointerUp = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    // A tap without a drag glides the divider to where it landed.
    if (!drag.dragging) place(percentAt(event.clientX), true);
    dragRef.current = null;
    setSettled(percentRef.current);
  };

  const onKeyDown = (event) => {
    const moves = { ArrowLeft: -STEP, ArrowDown: -STEP, ArrowRight: STEP, ArrowUp: STEP, PageDown: -PAGE_STEP, PageUp: PAGE_STEP };
    let next;
    if (event.key in moves) next = percentRef.current + moves[event.key];
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = 100;
    else return;
    event.preventDefault();
    event.stopPropagation(); // the room and the overlays listen for arrows and Escape too
    place(next, true);
    setSettled(next);
  };

  return (
    <div
      ref={frameRef}
      className="compare-frame relative aspect-[4/3] w-full touch-pan-y overflow-hidden rounded-md bg-midnight shadow-[0_18px_40px_#0009,inset_0_0_0_1px_#d4a64a66] select-none sm:aspect-[16/10]"
      style={{ '--divider': `${START}%` }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => { dragRef.current = null; }}
    >
      {/* Now underneath, then above it, cut off at the divider */}
      <Picture src={now.src} alt={now.alt} missingHint={now.missingHint} side="now" />
      <div className="compare-then absolute inset-0">
        <Picture src={then.src} alt={then.alt} missingHint={then.missingHint} side="then" />
      </div>

      {/* Labels on opposite sides */}
      <span className="pointer-events-none absolute top-3 left-3 rounded-sm border border-temple-gold/70 bg-midnight/85 px-2.5 py-1 text-[11px] font-bold tracking-[0.14em] text-temple-gold-light shadow-[0_2px_8px_#0008] backdrop-blur-sm">
        <span lang="ta" className="tracking-normal">அன்று</span> | THEN
      </span>
      <span className="pointer-events-none absolute top-3 right-3 rounded-sm border border-temple-gold/70 bg-midnight/85 px-2.5 py-1 text-[11px] font-bold tracking-[0.14em] text-temple-gold-light shadow-[0_2px_8px_#0008] backdrop-blur-sm">
        <span lang="ta" className="tracking-normal">இன்று</span> | NOW
      </span>

      {/* The divider and its handle */}
      <div className="compare-divider pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2 bg-gradient-to-b from-temple-gold-light via-[#fff6dc] to-temple-gold-light shadow-[0_0_10px_#0009]" aria-hidden="true" />
      <button
        ref={handleRef}
        type="button"
        role="slider"
        aria-label={T(`Compare then and now: ${label}`, `அன்றும் இன்றும் ஒப்பிடுக: ${label}`, `तब और अब की तुलना करें: ${label}`)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={START}
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className="compare-handle absolute top-1/2 grid size-12 -translate-1/2 cursor-ew-resize place-items-center rounded-full border-2 border-[#fff6dc] bg-[radial-gradient(circle_at_35%_30%,#f7dc95,#c4913f_60%,#7a5218)] text-[#21170b] shadow-[0_4px_14px_#000a] outline-none focus-visible:ring-4 focus-visible:ring-[#fff0c2]/80"
      >
        <ChevronsLeftRight size={22} strokeWidth={2.4} aria-hidden="true" />
      </button>
    </div>
  );
}
