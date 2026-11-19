import React, { useEffect } from 'react';
import { Eye } from 'lucide-react';
import { useI18n } from '../i18n/index.js';
import { IS_WEB } from '../platform.js';
import { siteSettings, useSiteDataVersion } from '../siteData/siteData.js';
import { startAnalytics, useAnalytics } from './analytics.js';

/**
 * The museum's live telemetry, website only: "● 12 Live · 👁 1,428 Views" in a dark-glass,
 * royal-gold pill. It shows only when the analytics server is running (and the admin portal's
 * Global Settings have not hidden it); never in the mobile app.
 */
export default function TelemetryPill({ className = '' }) {
  const { T, lang } = useI18n();
  const { enabled, live, views } = useAnalytics();
  useSiteDataVersion();
  useEffect(() => {
    startAnalytics();
  }, []);
  if (!IS_WEB || !enabled || live === null || !siteSettings().showTelemetry) return null;
  const number = (n) => Number(n ?? 0).toLocaleString(lang === 'ta' || lang === 'hi' ? 'en-IN' : undefined);
  return (
    <div
      role="status"
      aria-label={T(`${live} visitors live now, ${views} total views`, `இப்போது ${live} பார்வையாளர்கள், மொத்தம் ${views} பார்வைகள்`, `अभी ${live} दर्शक, कुल ${views} दृश्य`)}
      className={`pointer-events-none inline-flex items-center gap-2.5 rounded-full border border-temple-gold/50 bg-[#140d07]/75 px-3 py-1 text-[11px] font-semibold tracking-wide text-[#f0dcae] shadow-[0_6px_18px_#0008,inset_0_1px_0_#f2d38b22] backdrop-blur-md select-none ${className}`}
      data-telemetry
    >
      <span className="inline-flex items-center gap-1.5">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
        </span>
        <span data-telemetry-live>{number(live)}</span> {T('Live', 'நேரலை', 'लाइव')}
      </span>
      <span className="h-3 w-px bg-temple-gold/40" aria-hidden="true" />
      <span className="inline-flex items-center gap-1.5">
        <Eye size={12} className="text-temple-gold" aria-hidden="true" />
        <span data-telemetry-views>{number(views)}</span> {T('Views', 'பார்வைகள்', 'दृश्य')}
      </span>
    </div>
  );
}
