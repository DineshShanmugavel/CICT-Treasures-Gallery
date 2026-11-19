import React from 'react';
import { useProgress } from '@react-three/drei';
import { useI18n } from '../../i18n/index.js';

/**
 * "Loading Sacred Monument..." badge with the download percentage from drei's
 * useProgress. It is ordinary page DOM laid over the canvas (not <Html> inside the
 * scene): under React 19, unmounting an <Html> Suspense fallback can throw and take the
 * statue down with it.
 */
export function StatueLoadingBadge({ className = '' }) {
  const { progress } = useProgress();
  const { T } = useI18n();
  return (
    <div className={`pointer-events-none absolute inset-0 z-10 grid place-items-center ${className}`}>
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-temple-gold/60 bg-teak-dark/85 px-4 py-3 text-center whitespace-nowrap shadow-[0_0_30px_#d4a64a44]" role="status">
        <span className="size-7 animate-spin rounded-full border-[3px] border-temple-gold/25 border-t-temple-gold-light" aria-hidden="true" />
        <div className="text-sm font-semibold text-amber-200">{T('Loading Sacred Monument...', 'திருவுருவம் ஏற்றப்படுகிறது...', 'पवित्र स्मारक लोड हो रहा है...')}</div>
        <span lang="ta" className="text-[11px] text-amber-200/75">திருவள்ளுவர் · {Math.round(progress)}%</span>
      </div>
    </div>
  );
}
