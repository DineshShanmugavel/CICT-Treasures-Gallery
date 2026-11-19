import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FLIP_MS = 800;
const STAGE_PADDING = 24;

/** Shadow along the spine, so pages look bound rather than flat. */
function Gutter({ side }) {
  return (
    <div
      className={`pointer-events-none absolute inset-y-0 w-[14%] ${
        side === 'left' ? 'right-0 bg-gradient-to-l from-black/30 via-black/8 to-transparent' : 'left-0 bg-gradient-to-r from-black/30 via-black/8 to-transparent'
      }`}
    />
  );
}

/**
 * A CSS 3D page-turning book. Wide stages show two-page spreads (cover alone on the
 * right, like a real book); narrow stages show one page at a time. A turn is a single
 * "leaf" hinged on the spine whose front and back faces are the pages being turned,
 * rotating over static pages already showing the destination.
 *
 * - `renderPage(index)` returns the content for a 0-based page.
 * - `onNavigate(indices)` lists pages on and around the current view, for preloading.
 * - `onLayout(pageWidth)` reports the rendered page width in CSS pixels.
 * - `initialPage` (0-based) is the page to open at.
 */
export default function FlipBook({ pageCount, aspect, renderPage, onNavigate, onLayout, initialPage = 0 }) {
  const stageRef = useRef(null);
  const [stage, setStage] = useState({ width: 0, height: 0 });
  const [page, setPage] = useState(() => Math.min(Math.max(0, initialPage), pageCount - 1));
  const [flip, setFlip] = useState(null);
  const swipeRef = useRef(null);
  const reducedMotion = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useLayoutEffect(() => {
    const element = stageRef.current;
    const observer = new ResizeObserver(([entry]) => {
      setStage({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const availableWidth = Math.max(0, stage.width - STAGE_PADDING * 2);
  const availableHeight = Math.max(0, stage.height - STAGE_PADDING);
  const spread = availableWidth >= 720 && availableWidth / availableHeight > aspect * 1.3;
  const pageHeight = Math.floor(Math.min(availableHeight, availableWidth / ((spread ? 2 : 1) * aspect)));
  const pageWidth = Math.floor(pageHeight * aspect);

  // In spread mode "index" counts spreads (left = 2i-1, right = 2i); otherwise it counts pages.
  const pagesAt = (i) => (spread ? { left: 2 * i - 1, right: 2 * i } : { left: null, right: i });
  const pageAt = (i) => (spread ? Math.min(2 * i, pageCount - 1) : i);
  const maxIndex = spread ? Math.floor(pageCount / 2) : pageCount - 1;
  const index = Math.min(maxIndex, spread ? Math.ceil(page / 2) : page);

  useEffect(() => {
    onLayout?.(pageWidth);
  }, [pageWidth, onLayout]);

  useEffect(() => {
    const nearby = [];
    for (let i = index - 1; i <= index + 2; i += 1) {
      const { left, right } = pagesAt(i);
      for (const p of [left, right]) if (p !== null && p >= 0 && p < pageCount) nearby.push(p);
    }
    onNavigate?.(nearby);
    // pagesAt only depends on `spread`, which is listed.
  }, [index, spread, pageCount, onNavigate]); // eslint-disable-line react-hooks/exhaustive-deps

  // Two frames after mounting the leaf at its start angle, let it rotate; commit when done.
  useEffect(() => {
    if (!flip) return undefined;
    if (!flip.running) {
      let inner = 0;
      const outer = window.requestAnimationFrame(() => {
        inner = window.requestAnimationFrame(() => setFlip((current) => current && { ...current, running: true }));
      });
      return () => {
        window.cancelAnimationFrame(outer);
        window.cancelAnimationFrame(inner);
      };
    }
    const timer = window.setTimeout(() => {
      setPage(pageAt(flip.to));
      setFlip(null);
    }, FLIP_MS);
    return () => window.clearTimeout(timer);
  }, [flip]); // eslint-disable-line react-hooks/exhaustive-deps

  const turn = (direction) => {
    if (flip) return;
    const to = index + direction;
    if (to < 0 || to > maxIndex) return;
    if (reducedMotion.current) setPage(pageAt(to));
    else setFlip({ from: index, to, direction, running: false });
  };

  const jump = (to) => {
    if (!flip) setPage(pageAt(to));
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.target instanceof HTMLElement && event.target.closest('input')) return;
      if (event.key === 'ArrowRight') turn(1);
      else if (event.key === 'ArrowLeft') turn(-1);
      else if (event.key === 'Home') jump(0);
      else if (event.key === 'End') jump(maxIndex);
      else return;
      event.preventDefault();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  // What is visible: static pages plus, mid-turn, the turning leaf.
  const current = pagesAt(index);
  let staticLeft = current.left;
  let staticRight = current.right;
  let leaf = null;
  if (flip) {
    const from = pagesAt(flip.from);
    const to = pagesAt(flip.to);
    if (flip.direction > 0) {
      staticLeft = from.left;
      staticRight = to.right;
      leaf = { front: from.right, back: to.left, start: 0, end: -180 };
    } else {
      staticLeft = to.left;
      staticRight = from.right;
      leaf = { front: to.right, back: from.left, start: -180, end: 0 };
    }
  }

  const exists = (p) => p !== null && p >= 0 && p < pageCount;
  // Each page carries its own page-block edge and shadow, so an empty side (beside the cover) stays empty.
  const pageFace = (p, side) =>
    exists(p) ? (
      <div
        className={`absolute inset-0 overflow-hidden bg-[#f3e6c8] ${
          side === 'left' ? 'shadow-[-3px_3px_0_#d9caa8,-6px_6px_0_#bfae8a,0_30px_60px_#000c]' : 'shadow-[3px_3px_0_#d9caa8,6px_6px_0_#bfae8a,0_30px_60px_#000c]'
        }`}
      >
        {renderPage(p)}
        <Gutter side={side} />
      </div>
    ) : null;

  const onPointerDown = (event) => {
    swipeRef.current = { x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event) => {
    const start = swipeRef.current;
    swipeRef.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(event.clientY - start.y)) {
      turn(dx < 0 ? 1 : -1);
    } else if (Math.abs(dx) < 6) {
      // A tap on the left part of the book goes back, anywhere else goes forward.
      const rect = event.currentTarget.getBoundingClientRect();
      turn(event.clientX < rect.left + rect.width * (spread ? 0.5 : 0.3) ? -1 : 1);
    }
  };

  const shown = [staticLeft, staticRight].filter(exists).map((p) => p + 1);
  const pageLabel = shown.length === 2 ? `Pages ${shown[0]}–${shown[1]}` : `Page ${shown[0] ?? 1}`;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div ref={stageRef} className="relative grid min-h-0 flex-1 place-items-center overflow-hidden [perspective:2600px]">
        {pageWidth > 0 && (
          <div
            className="relative cursor-pointer touch-pan-y select-none"
            style={{ width: spread ? pageWidth * 2 : pageWidth, height: pageHeight }}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            {spread && <div className="absolute top-0 left-0 h-full w-1/2">{pageFace(staticLeft, 'left')}</div>}
            <div className={`absolute top-0 right-0 h-full ${spread ? 'w-1/2' : 'w-full'}`}>{pageFace(staticRight, 'right')}</div>

            {leaf && (
              <div
                className="absolute top-0 right-0 h-full origin-left transition-transform ease-[cubic-bezier(.45,.05,.3,1)] [transform-style:preserve-3d]"
                style={{
                  width: pageWidth,
                  transform: `rotateY(${flip.running ? leaf.end : leaf.start}deg)`,
                  transitionDuration: flip.running ? `${FLIP_MS}ms` : '0ms',
                }}
              >
                <div className="absolute inset-0 [backface-visibility:hidden]">
                  {pageFace(leaf.front, 'right') ?? <div className="absolute inset-0 bg-[#f3e6c8]" />}
                  {flip.running && <div className="pointer-events-none absolute inset-0 animate-flip-shade bg-gradient-to-l from-black/35 to-transparent" />}
                </div>
                <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  {pageFace(leaf.back, 'left') ?? <div className="absolute inset-0 bg-[#e9dcbc]" />}
                  {flip.running && <div className="pointer-events-none absolute inset-0 animate-flip-shade bg-gradient-to-r from-black/35 to-transparent" />}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 border-t border-[#b9904a]/30 bg-[#120c07] px-3 py-2.5 sm:px-5">
        <button
          type="button"
          onClick={() => turn(-1)}
          disabled={index === 0}
          aria-label="Previous page"
          className="touch-target grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border border-[#785b30] bg-[#1c130a] text-[#e9ca80] transition duration-300 ease-spring hover:scale-105 active:scale-95 hover:bg-[#3d2a16] disabled:scale-100 disabled:cursor-default disabled:opacity-35"
        >
          <ChevronLeft size={18} />
        </button>
        <input
          type="range"
          min={0}
          max={maxIndex}
          value={index}
          onChange={(event) => jump(Number(event.target.value))}
          aria-label="Jump to page"
          className="min-w-0 flex-1 cursor-pointer accent-[#d8b56b]"
        />
        <span className="shrink-0 text-[11px] text-[#c9b89b] tabular-nums">
          {pageLabel} <span className="text-[#8e7957]">of {pageCount}</span>
        </span>
        <button
          type="button"
          onClick={() => turn(1)}
          disabled={index === maxIndex}
          aria-label="Next page"
          className="touch-target grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border border-[#785b30] bg-[#1c130a] text-[#e9ca80] transition duration-300 ease-spring hover:scale-105 active:scale-95 hover:bg-[#3d2a16] disabled:scale-100 disabled:cursor-default disabled:opacity-35"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
