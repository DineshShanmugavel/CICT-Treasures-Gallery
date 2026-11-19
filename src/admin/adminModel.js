import { hallways, roomBooks } from '../data/roomBooks.js';
import { ROOM_CATALOGUES } from '../data/roomCatalogues.js';
import { ADMIN_GALLERY, siteData } from '../siteData/siteData.js';

/**
 * The admin portal's view of the museum: its seven halls (as the Room Catalogues group them —
 * Historical Figures in the Literature Hall, Tamil Nadu Then & Now with Ainthinai & Tamilakam,
 * the Thiruvalluvar Shrine on its own), their rooms, and each room's exhibits with the edits.
 * Rooms are read from the default data (roomBooks), never from getRoom, so the editor always
 * knows what the default was.
 */
export const ADMIN_HALLS = [
  { id: 'central', title: 'Central Hall', tamil: 'மையக் கூடம்', halls: ['central'] },
  { id: 'literature', title: 'Literature Hall', tamil: 'இலக்கியக் கூடம்', halls: ['literature', 'historical-figures'], exclude: ['shrine'] },
  { id: 'shrine', title: 'Thiruvalluvar Shrine', tamil: 'திருவள்ளுவர் திருத்தலம்', rooms: ['shrine'] },
  { id: 'artistic', title: 'Ancient Artistic Values Wing', tamil: 'பண்டைய கலை மரபுப் பிரிவு', halls: ['artistic'] },
  { id: 'trade', title: 'Trade & Ports', tamil: 'வணிகமும் துறைமுகங்களும்', halls: ['trade'] },
  { id: 'household', title: 'Household & Agriculture / Irrigation', tamil: 'இல்லமும் வேளாண்மையும் / நீர்ப்பாசனம்', halls: ['household'] },
  { id: 'ainthinai', title: 'Ainthinai & Ancient Tamilakam', tamil: 'ஐந்திணையும் பண்டைய தமிழகமும்', halls: ['ainthinai', 'tn-then-vs-now'] },
];

export const CATALOGUE_LABELS = {
  central: 'Central Hall',
  literature: 'Literature Hall (with Historical Figures)',
  shrine: 'Thiruvalluvar Shrine',
  artistic: 'Ancient Artistic Values Wing',
  trade: 'Trade & Ports',
  household: 'Household & Agriculture',
  ainthinai: 'Ainthinai & Tamilakam (with Then & Now)',
};
export { ROOM_CATALOGUES };

/** The rooms of an admin hall, in the order the halls show them. */
export function roomsOf(adminHall) {
  if (adminHall.rooms) return adminHall.rooms.map((id) => roomBooks[id]).filter(Boolean);
  const seen = new Set();
  const rooms = [];
  for (const hallId of adminHall.halls) {
    for (const wing of hallways[hallId]?.wings ?? []) {
      if (!wing || wing.passage || wing.alcove || !roomBooks[wing.id] || seen.has(wing.id) || adminHall.exclude?.includes(wing.id)) continue;
      seen.add(wing.id);
      rooms.push(roomBooks[wing.id]);
    }
  }
  return rooms;
}

/** A media address as a path the admin can read and type ("/Ancient Pottery/urn.jpg"). */
export function toPath(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url) || /^data:/i.test(url)) return url;
  let path = String(url).replace(/^\.\//, '/');
  if (!path.startsWith('/')) path = `/${path}`;
  try {
    return decodeURI(path);
  } catch {
    return path;
  }
}

/** The form values of a default exhibit (what the museum shows without edits). */
export function defaultsOf(artifact) {
  return {
    titleEn: artifact.title ?? '',
    titleTa: artifact.tamil ?? '',
    titleHi: '',
    subtitle: artifact.detail ?? '',
    descEn: artifact.note ?? '',
    descTa: artifact.tamilNote ?? '',
    descHi: '',
    image: toPath(artifact.url),
    video: toPath(artifact.video),
    audio: toPath(artifact.narration),
    pdf: toPath(artifact.pdf),
  };
}

export const BLANK_EXHIBIT = { titleEn: '', titleTa: '', titleHi: '', subtitle: '', descEn: '', descTa: '', descHi: '', image: '', video: '', audio: '', pdf: '' };
export const FIELDS = Object.keys(BLANK_EXHIBIT);

/** The galleries an added exhibit can go into (album galleries excluded), plus New Additions. */
export function gallerySlots(room) {
  const galleries = (room.galleries ?? []).filter((gallery) => gallery.layout !== 'photobook').map((gallery) => ({ id: gallery.id, title: gallery.title }));
  return [...galleries, { id: ADMIN_GALLERY.id, title: `${ADMIN_GALLERY.title} (its own gallery)` }];
}

/**
 * A room's exhibits for the editor: every default exhibit (with its edit and status) and every
 * added one. status: 'default' | 'edited' | 'hidden' | 'deleted' | 'added'.
 */
export function exhibitsOf(room) {
  const edits = siteData().exhibits[room.id] ?? {};
  const list = [];
  for (const gallery of room.galleries ?? []) {
    for (const artifact of gallery.artifacts) {
      const edit = edits[artifact.id];
      const status = !edit ? 'default' : edit.deleted ? 'deleted' : edit.visible === false ? 'hidden' : 'edited';
      list.push({ id: artifact.id, gallery, artifact, edit, status, values: { ...defaultsOf(artifact), ...pickFields(edit) } });
    }
  }
  for (const [id, edit] of Object.entries(edits)) {
    if (!edit.added) continue;
    const gallery = (room.galleries ?? []).find((g) => g.id === edit.gallery) ?? ADMIN_GALLERY;
    list.push({ id, gallery, artifact: null, edit, status: edit.visible === false ? 'hidden' : 'added', values: { ...BLANK_EXHIBIT, ...pickFields(edit) } });
  }
  return list;
}

function pickFields(edit) {
  const out = {};
  for (const key of FIELDS) if (edit && typeof edit[key] === 'string') out[key] = edit[key];
  return out;
}

/** A fresh id for an added exhibit. */
export const newExhibitId = () => `admin-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
