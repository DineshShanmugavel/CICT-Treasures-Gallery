import React from 'react';
import { FileDown } from 'lucide-react';
import { catalogueFor } from '../data/roomCatalogues.js';
import { useSiteDataVersion } from '../siteData/siteData.js';
import { useI18n } from '../i18n/index.js';

const springy = 'transition-[scale,translate,border-color,background-color,box-shadow] duration-300 ease-spring hover:scale-110 active:scale-95';

/**
 * Downloads the Master PDF of the hall (or room) the visitor is in — see data/roomCatalogues.js.
 * `variant` 'bar' is a pill in the hallway's navigation bar; 'tab' a small tab on the right
 * edge, under the music tab, for the views that cover the bar (a room, the Thiruvalluvar scroll,
 * Then & Now, the map of Tamilakam).
 */
export default function RoomCatalogueButton({ hallId, roomId, hallName, variant = 'bar', className = '', labelClassName = 'hidden xl:inline' }) {
  const { T } = useI18n();
  useSiteDataVersion(); // a catalogue chosen in the admin portal shows at once
  const { key, file, url } = catalogueFor({ hallId, roomId });
  const label = T('Room Catalogue (PDF)', 'அறைக் கையேடு (PDF)', 'कक्ष कैटलॉग (PDF)');
  const action = T('Download Room Catalogue', 'அறை கையேட்டைப் பதிவிறக்கவும்', 'कक्ष कैटलॉग डाउनलोड करें');
  const tip = hallName ? `${action} — ${hallName}` : action;
  // `download` saves the file where the browser allows it (same origin); elsewhere (the mobile
  // app fetching from the website) the PDF opens in a new tab, which has its own save button.
  const common = { href: url, download: file, target: '_blank', rel: 'noopener', title: tip, 'aria-label': tip, 'data-catalogue': key };

  if (variant === 'tab') {
    return (
      <a
        {...common}
        className={`group fixed top-[calc(50%+92px)] right-0 z-[1500] flex -translate-y-1/2 cursor-pointer items-center gap-1.5 rounded-l-full border border-r-0 border-temple-gold/70 bg-[#140d07]/85 py-2 pr-2 pl-2.5 text-temple-gold-light no-underline shadow-[0_8px_24px_#000a] backdrop-blur transition-[padding] duration-300 hover:pr-3 ${className}`}
      >
        <FileDown size={15} />
        <span className="max-w-0 overflow-hidden text-xs font-semibold whitespace-nowrap transition-[max-width] duration-300 group-hover:max-w-48 group-focus-visible:max-w-48">{label}</span>
      </a>
    );
  }
  return (
    <a
      {...common}
      className={`inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-[#8e6e35] bg-[#241b10]/90 px-3 py-2 text-xs text-[#ead8ad] no-underline backdrop-blur hover:border-[#f4d792] hover:text-[#f4d792] sm:px-4 ${springy} ${className}`}
    >
      <FileDown size={15} /> <span className={labelClassName}>{label}</span>
    </a>
  );
}
