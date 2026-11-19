import { mediaUrl } from '../mediaUrl.js';
import { catalogueOverride } from '../siteData/siteData.js';

/**
 * The printable Master PDF ("Room Catalogue") for each hall, made by
 * scripts/generateRoomMasterPdfs.mjs into the public folder's /room-pdfs/. Keep the file
 * names in step with that script's CATALOGUES.
 *
 * The two outer halls have no catalogue of their own: Historical Figures is printed in the
 * Literature Hall's, Tamil Nadu Then & Now in the Ainthinai & Tamilakam one. The Thiruvalluvar
 * Shrine, a room of the Literature Hall, has its own.
 */
export const ROOM_CATALOGUES = {
  central: 'central-hall-catalogue.pdf',
  literature: 'literature-hall-catalogue.pdf',
  shrine: 'thiruvalluvar-shrine-catalogue.pdf',
  artistic: 'artistic-values-wing-catalogue.pdf',
  trade: 'trade-and-ports-catalogue.pdf',
  household: 'household-and-agriculture-catalogue.pdf',
  ainthinai: 'ainthinai-and-tamilakam-catalogue.pdf',
};

const fileName = (url) => {
  try {
    return decodeURI(url.split(/[?#]/)[0].split('/').pop()) || null;
  } catch {
    return null;
  }
};

const HALL_FALLBACK = { 'historical-figures': 'literature', 'tn-then-vs-now': 'ainthinai' };

/**
 * The catalogue for where the visitor is: the room they are in (or whose doors are open),
 * else the hall. Returns { file, url }.
 */
export function catalogueFor({ hallId, roomId } = {}) {
  const key = roomId === 'shrine' ? 'shrine' : HALL_FALLBACK[hallId] ?? (ROOM_CATALOGUES[hallId] ? hallId : 'central');
  const file = ROOM_CATALOGUES[key];
  // The admin portal may point a hall at another PDF (Media & Catalogue Manager).
  const override = catalogueOverride(key);
  return { key, file: override ? fileName(override) ?? file : file, url: override ?? mediaUrl(`/room-pdfs/${file}`) };
}
