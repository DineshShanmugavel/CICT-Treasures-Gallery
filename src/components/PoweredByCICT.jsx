import React from 'react';
import { Library } from 'lucide-react';
import { useI18n } from '../i18n/index.js';
import { siteSettings, useSiteDataVersion } from '../siteData/siteData.js';

/**
 * "Powered by: CICT Digital Library" — the small credit shown under the museum's maps (the
 * Ancient Tamilakam map, the hallway mini-map and the full Museum Map). A dark-glass pill with
 * muted gold text; it never takes clicks, so it cannot get in the way of a map.
 */
export default function PoweredByCICT({ className = '', size = 'md' }) {
  const { T, cl } = useI18n();
  useSiteDataVersion();
  // Global Settings in the admin portal may reword or hide the credit.
  const { watermark, showWatermark } = siteSettings();
  if (!showWatermark) return null;
  const small = size === 'sm';
  return (
    <p
      className={`pointer-events-none inline-flex items-center gap-1.5 rounded-full border border-temple-gold/35 bg-[#140d07]/70 font-semibold whitespace-nowrap text-[#f0dcae] opacity-85 backdrop-blur-sm select-none ${
        small ? 'px-2 py-0.5 text-[10px] tracking-[0.06em]' : 'px-3 py-1 text-[10px] tracking-[0.12em] sm:text-[11px]'
      } ${className}`}
      data-powered-by="cict"
    >
      <Library size={small ? 11 : 12} aria-hidden="true" className="shrink-0 text-temple-gold" />
      <span lang={cl}>{T(watermark?.en || 'Powered by: CICT Digital Library', watermark?.ta || 'வழங்குவோர்: CICT எண்ணிம நூலகம்', watermark?.hi || 'संचालित: CICT डिजिटल पुस्तकालय')}</span>
    </p>
  );
}
