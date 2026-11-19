import React, { useLayoutEffect, useRef } from 'react';

/**
 * A kural in the venba's own shape: always exactly two lines, four feet then three (the
 * data is checked for this by scripts/kuralCorrections.mjs). Lines never wrap: if the
 * longer one is wider than the space, both shrink together until it fits, so the couplet
 * keeps its proportions on any screen. Refits on resize and once web fonts have loaded.
 */
export default function KuralCouplet({ kural, as: Tag = 'blockquote', className = '', lineClassName = '' }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const box = ref.current;
    if (!box) return undefined;
    const fit = () => {
      box.style.fontSize = '';
      const widest = Math.max(...[...box.children].map((line) => line.scrollWidth));
      const room = box.clientWidth;
      if (widest > room && room > 0) {
        box.style.fontSize = `${(parseFloat(getComputedStyle(box).fontSize) * room * 0.98) / widest}px`;
      }
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    let live = true;
    document.fonts?.ready.then(() => live && fit());
    return () => {
      live = false;
      observer.disconnect();
    };
  }, [kural.tamilLine1, kural.tamilLine2]);

  return (
    <Tag ref={ref} lang="ta" className={className}>
      {[kural.tamilLine1, kural.tamilLine2].map((line, i) => (
        <span key={i} className={`block whitespace-nowrap ${lineClassName}`}>{line}</span>
      ))}
    </Tag>
  );
}
