#!/usr/bin/env node
/**
 * Room Master PDFs — one archival catalogue per hall of the museum, holding every text a
 * visitor can read there, in English, Tamil and Hindi:
 *
 *   01 Central Hall                     — the CICT monolith's four faces, the hall plan, the visitor guide
 *   02 Literature Hall                  — Sangam literature, rare books, palm-leaf manuscripts, inscriptions,
 *                                         and the Historical Figures hall (Tolkappiar, patrons, poets, rulers)
 *   03 Thiruvalluvar Shrine             — the shrine's cabinets, the Thiruvalluvar story, and the Thirukkural
 *                                         by section, group and chapter (all 1330 couplets)
 *   04 Ancient Artistic Values Wing     — sculptures, pottery, coins, instruments, sarees, paintings, weaving
 *   05 Trade & Ports                    — ancient ports, maritime trade, trade foods, the ship
 *   06 Household & Agriculture          — the home, irrigation (Kallanai, eri, sluices, Noyyal), agriculture
 *   07 Ainthinai & Ancient Tamilakam    — the five landscapes, their foods and poems, the Tamilakam map, Then & Now
 *
 * The texts are not re-typed or scraped: the script loads the museum's own data modules through
 * Vite's SSR loader (so the virtual photo manifests, import.meta.glob packs and mediaUrl all work
 * exactly as in the app) and resolves Hindi the way the app does — an inline `hi` first, then the
 * static pack src/i18n/locales/hi.json. A text with no Hindi yet is marked as such in the PDF and
 * counted in the summary; nothing is machine-translated here.
 *
 * Output: <served public folder>/room-pdfs/*.pdf (the folder vite.config.js serves, ../public,
 * so the app can link to /room-pdfs/…) and a review copy in ./room-master-pdfs/.
 *
 * Usage: node scripts/generateRoomMasterPdfs.mjs
 * Needs Playwright (local or global install) with Chromium, or Chrome / Edge installed.
 * Fonts (Noto Sans/Serif Tamil, Noto Sans Devanagari) come from Google Fonts, so it needs the network;
 * the script checks that they loaded before printing.
 */
import { execSync } from 'node:child_process';
import { copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_DIR = resolve(ROOT, '../public'); // vite.config.js: publicDir '../public'
const OUT_PUBLIC = join(PUBLIC_DIR, 'room-pdfs');
const OUT_REVIEW = join(ROOT, 'room-master-pdfs');

/* ------------------------------------------------------------------ loading the museum */

process.env.VITE_TRANSLATE_URL = 'off'; // never call the runtime translation service from here
const { createServer } = await import('vite');
const vite = await createServer({
  root: ROOT,
  configFile: join(ROOT, 'vite.config.js'),
  server: { middlewareMode: true, hmr: false, watch: null },
  appType: 'custom',
  logLevel: 'warn',
  optimizeDeps: { noDiscovery: true, include: [] },
});
const load = (path) => vite.ssrLoadModule(path);
const [rb, ex, he, ch, bi, tn, tk, ai, vs, ks, i18n, engine] = await Promise.all([
  load('/src/data/roomBooks.js'),
  load('/src/data/exhibitionTexts.js'),
  load('/src/data/hallExhibits.js'),
  load('/src/data/centralHall.js'),
  load('/src/data/bookInfo.js'),
  load('/src/data/thenAndNow.js'),
  load('/src/data/tamilakam.js'),
  load('/src/data/ainthinaiRoom.js'),
  load('/src/data/valluvarStory.js'),
  load('/src/data/kuralStructure.js'),
  load('/src/i18n/index.js'),
  load('/src/i18n/translationEngine.js'),
]);
await engine.loadLanguage('hi');
await vite.close();

const KURALS = JSON.parse(readFileSync(join(ROOT, 'src/data/thirukkural.json'), 'utf8')).kurals;
const KURALS_HI = JSON.parse(readFileSync(join(ROOT, 'src/data/kurals/hi.json'), 'utf8'));

/** The visitor guide's steps (Tutorial.jsx keeps them unexported): read from its source. */
function tutorialSteps() {
  const source = readFileSync(join(ROOT, 'src/components/Tutorial.jsx'), 'utf8');
  const match = source.match(/const STEPS = (\[[\s\S]*?\n\]);/);
  if (!match) return [];
  return Function(`return ${match[1].replace(/icon:\s*\w+,/g, '')}`)();
}

/* ------------------------------------------------------------------ texts in three languages */

const stats = { hindiWanted: 0, hindiMissing: 0, missing: new Set() };
const clean = (text) => (typeof text === 'string' ? text.replace(/\s+/g, ' ').trim() : text) || null;
/** Hindi as the app shows it: inline, else the hi.json pack (exact or template match). */
function hindi(en, inline) {
  if (inline) return clean(inline);
  if (!en) return null;
  stats.hindiWanted += 1;
  const found = i18n.lookup(en, 'hi');
  if (!found) {
    stats.hindiMissing += 1;
    stats.missing.add(clean(en).slice(0, 90));
  }
  return clean(found);
}
/** { en, ta, hi } from parts, or from an object that already carries en/ta/hi. */
const T3 = (en, ta, hi) => ({ en: clean(en), ta: clean(ta), hi: hindi(clean(en), hi) });
const fromObj = (o) => (o ? T3(o.en, o.ta, o.hi) : null);
/** Fixed labels written for this catalogue. */
const L3 = (en, ta, hi) => ({ en, ta, hi });

const CATEGORY = {
  overview: L3('Hall Overview', 'கூட மேலோட்டம்', 'कक्ष का अवलोकन'),
  room: L3('Room', 'அறை', 'कक्ष'),
  panel: L3('Exhibition Panel', 'காட்சிப் பலகை', 'प्रदर्शनी पट्ट'),
  artifact: L3('Display-case Object', 'காட்சிப் பேழைப் பொருள்', 'प्रदर्श-पेटी की वस्तु'),
  film: L3('Film Exhibit', 'திரைப்படக் காட்சி', 'फ़िल्म प्रदर्श'),
  photobook: L3('Photobook', 'படப் புத்தகம்', 'चित्र-पुस्तक'),
  book: L3('Cabinet Volume', 'அலமாரி நூல்', 'अलमारी का ग्रंथ'),
  bundle: L3('Palm-leaf Bundle', 'ஓலைச்சுவடிக் கட்டு', 'ताड़पत्र पोथी'),
  centrepiece: L3('Centrepiece · Name Board', 'மையக் காட்சிப்பொருள் · பெயர்ப் பலகை', 'केंद्रीय प्रदर्श · नाम-पट्ट'),
  monolith: L3('Monolith Face', 'நினைவுத் தூணின் முகம்', 'स्तंभ का मुख'),
  guide: L3('Visitor Guide', 'வருகையாளர் வழிகாட்டி', 'आगंतुक मार्गदर्शिका'),
  hall: L3('Hall', 'கூடம்', 'कक्ष'),
  story: L3('Shrine Scroll', 'திருத்தலச் சுருள்', 'मंदिर का पट'),
  chapter: L3('Thirukkural Chapter', 'திருக்குறள் அதிகாரம்', 'तिरुक्कुरल अध्याय'),
  landscape: L3('Landscape (Tinai)', 'திணை', 'भू-दृश्य (तिणै)'),
  place: L3('Map Place', 'வரைபட இடம்', 'मानचित्र स्थल'),
  compare: L3('Then & Now Card', 'அன்றும் இன்றும் அட்டை', 'तब और अब कार्ड'),
  note: L3('Map Note', 'வரைபடக் குறிப்பு', 'मानचित्र टिप्पणी'),
};

/* ------------------------------------------------------------------ media file names */

const mediaPath = (url) => {
  if (!url) return null;
  try {
    return decodeURIComponent(new URL(url, 'http://museum.local').pathname).replace(/^\//, '');
  } catch {
    return url;
  }
};

/* ------------------------------------------------------------------ building entries */

/** One exhibit: title, category/subtitle, descriptions (parts), media. */
const entry = ({ category, title, subtitle = null, parts = [], media = [], facts = [] }) => ({ category, title, subtitle, parts: parts.filter((p) => p && (p.text.en || p.text.ta || p.text.hi)), media: media.filter(Boolean), facts });
const part = (text, label = null) => (text ? { label, text } : null);

function artifactEntry(a) {
  return entry({
    category: a.video ? CATEGORY.film : CATEGORY.artifact,
    title: T3(a.title, a.tamil),
    subtitle: a.detail ? T3(a.detail) : null,
    parts: [part(T3(a.note, a.tamilNote))],
    media: [mediaPath(a.url), mediaPath(a.video), mediaPath(a.narration)],
  });
}

/** A photobook gallery: one entry for the subject, every photograph listed. */
function photobookEntry(g) {
  const first = g.artifacts[0] ?? {};
  return entry({
    category: CATEGORY.photobook,
    title: T3(g.title, g.tamil),
    subtitle: g.detail ? T3(g.detail) : null,
    parts: [part(T3(first.note, first.tamilNote))],
    media: g.artifacts.flatMap((a) => [mediaPath(a.url), mediaPath(a.video), mediaPath(a.narration)]),
    facts: [[L3('Plates', 'படங்கள்', 'चित्र'), String(g.artifacts.length)]],
  });
}

function bookEntry(book) {
  const d = bi.describeBook(book, 'hi');
  const hiNotes = d.hi; // describeBook gives Hindi from the pack (or English when missing)
  const base = book.description ?? bi.works[book.work] ?? bi.works.rareArchive;
  const hasHindi = Boolean(base?.hi || (base?.en && i18n.lookup(base.en, 'hi')));
  stats.hindiWanted += 1;
  if (!hasHindi) {
    stats.hindiMissing += 1;
    stats.missing.add(clean(base?.en ?? book.title).slice(0, 90));
  }
  const facts = [];
  if (book.year) facts.push([L3('Printed', 'அச்சு ஆண்டு', 'मुद्रण वर्ष'), String(book.year)]);
  if (book.edition === 'cict') facts.push([L3('Edition', 'பதிப்பு', 'संस्करण'), 'CICT']);
  if (book.tinai) facts.push([L3('Landscape', 'திணை', 'भू-दृश्य'), book.tinai]);
  return entry({
    category: CATEGORY.book,
    title: T3(book.title, book.tamil),
    parts: [part({ en: clean(d.en), ta: clean(d.ta), hi: hasHindi ? clean(hiNotes) : null })],
    media: [mediaPath(book.pdfUrl)],
    facts,
  });
}

function bundleEntry(b) {
  const facts = [[L3('Leaves photographed', 'படமெடுத்த ஏடுகள்', 'चित्रित पत्र'), String(b.leaves?.length ?? 0)]];
  if (b.number) facts.push([L3('Manuscript no.', 'சுவடி எண்', 'पांडुलिपि सं.'), String(b.number)]);
  if (b.material) facts.push([L3('Material', 'பொருள்', 'सामग्री'), b.material]);
  return entry({
    category: CATEGORY.bundle,
    title: T3(b.title, b.tamil),
    parts: [part(fromObj(b.description))],
    media: [`Manuscripts/${b.folder}/ (${b.leaves?.length ?? 0} leaf images)`, mediaPath(b.narration)],
    facts,
  });
}

function centrepieceEntry(key) {
  const x = he.HALL_EXHIBITS[key];
  if (!x) return null;
  return entry({ category: CATEGORY.centrepiece, title: T3(x.title, x.ta), subtitle: x.detail ? T3(x.detail) : null, parts: [part(T3(x.en, x.taText))], media: [mediaPath(x.model?.url)] });
}

/** Every text of one room: its panels, display cases, shelves of bundles and cabinets. */
function roomSection(room, extra = {}) {
  const groups = [];
  const panels = ex.ROOM_PANELS[room.id] ?? [];
  if (panels.length) {
    groups.push({ heading: L3('Exhibition Panels', 'காட்சிப் பலகைகள்', 'प्रदर्शनी पट्ट'), entries: panels.map((p) => entry({ category: CATEGORY.panel, title: fromObj(p.title), parts: [part(fromObj(p.body))] })) });
  }
  for (const g of room.galleries ?? []) {
    if (!g.artifacts?.length) continue;
    const entries = g.layout === 'photobook' ? [photobookEntry(g)] : g.artifacts.map(artifactEntry);
    groups.push({ heading: T3(g.title, g.tamil), entries });
  }
  for (const shelf of room.olaiShelves ?? []) {
    groups.push({ heading: T3(shelf.title, shelf.tamil), entries: shelf.bundles.map(bundleEntry) });
  }
  if (room.feature === 'olai-suvadi') {
    groups.push({
      heading: L3('Olai Suvadi Reader', 'ஓலைச்சுவடி வாசிப்பு', 'ओलै सुवडि पाठक'),
      entries: [entry({
        category: CATEGORY.bundle,
        title: L3('Thirukkural in the Olai Suvadi', 'ஓலைச்சுவடியில் திருக்குறள்', 'ओलै सुवडि में तिरुक्कुरल'),
        parts: [part(L3('The museum’s own palm-leaf reader of all 1330 couplets; their full text is catalogued in the Thiruvalluvar Shrine master PDF (03).', 'அருங்காட்சியகத்தின் ஓலைச்சுவடி வாசிப்பில் 1330 குறள்களும்; அவற்றின் முழு உரை திருவள்ளுவர் திருத்தல முதன்மை ஆவணத்தில் (03) உள்ளது.', 'संग्रहालय का अपना ताड़पत्र पाठक, सभी 1330 कुरलों के साथ; इनका पूरा पाठ तिरुवल्लुवर मंदिर की मास्टर पीडीएफ़ (03) में सूचीबद्ध है।'))],
      })],
    });
  }
  for (const cabinet of room.cabinets ?? []) {
    if (!cabinet.books?.length) continue;
    groups.push({ heading: T3(cabinet.title, cabinet.tamil), entries: cabinet.books.map(bookEntry) });
  }
  if (extra.groups) groups.unshift(...extra.groups);
  return {
    id: room.id,
    kicker: extra.kicker ?? CATEGORY.room,
    title: T3(room.title, room.tamil),
    intro: T3(room.description, room.tamilDescription),
    groups,
  };
}

const roomsOf = (hallId, except = []) => rb.hallways[hallId].wings.filter((w) => !w.alcove && !w.passage && !except.includes(w.id));
const hallInfo = (hallId) => {
  const h = rb.hallways[hallId];
  return { title: T3(h.title, h.tamil), subtitle: T3(h.subtitle), accent: h.accent, glyph: h.glyph };
};

/** The hall's overview section: its subtitle, rooms and centrepiece. */
function hallOverview(hallId, { centrepiece, rooms } = {}) {
  const h = rb.hallways[hallId];
  const list = rooms ?? roomsOf(hallId);
  const entries = [
    entry({
      category: CATEGORY.overview,
      title: T3(h.title, h.tamil),
      subtitle: T3(h.subtitle),
      parts: list.map((r) => part(T3(r.description, r.tamilDescription), T3(r.title, r.tamil))),
    }),
  ];
  const c = centrepiece ?? centrepieceEntry(h.centrepiece);
  if (c) entries.push(c);
  return { id: `${hallId}-overview`, kicker: CATEGORY.hall, title: T3(h.title, h.tamil), intro: T3(h.subtitle), groups: [{ heading: L3('Overview & Centrepiece', 'மேலோட்டமும் மையக் காட்சியும்', 'अवलोकन और केंद्रीय प्रदर्श'), entries }] };
}

/* ------------------------------------------------------------------ the seven catalogues */

function centralHall() {
  const faces = ch.MONUMENT.faces.map((face) => {
    const parts = [];
    for (const s of face.sections ?? []) {
      if (s.items) {
        // A list: each item matched to its own Hindi, so one missing item doesn't hide the rest.
        for (const item of s.items) parts.push(part(T3(`• ${item.en}`, `• ${item.ta}`, item.hi ?? (i18n.lookup(item.en, 'hi') && `• ${i18n.lookup(item.en, 'hi')}`)), s.items.indexOf(item) === 0 ? T3(s.title, s.titleTa) : null));
      } else {
        parts.push(part(T3(s.en, s.ta), T3(s.title, s.titleTa)));
      }
    }
    for (const c of face.credits ?? []) {
      const names = c.people.map((p) => [p.nameTa ? `${p.nameTa} / ` : '', p.name, p.designation ? ` — ${p.designation}` : ''].join('')).join('; ');
      // Personal names are given as written (hi: false — not a text to translate).
      parts.push(part({ en: names, ta: null, hi: false }, T3(c.role, c.roleTa)));
    }
    return entry({ category: CATEGORY.monolith, title: T3(face.heading, face.headingTa), subtitle: T3(face.side, face.sideTa), parts });
  });
  const ringHalls = rb.hallways.central.wings.filter((w) => w.passage).map((w) => w.passage);
  const plan = [...ringHalls, 'historical-figures', 'tn-then-vs-now'].map((id) => {
    const h = rb.hallways[id];
    return entry({ category: CATEGORY.hall, title: T3(h.title, h.tamil), subtitle: T3(h.subtitle), parts: roomsOf(id).map((r) => part(T3(r.description, r.tamilDescription), T3(r.title, r.tamil))) });
  });
  const guide = tutorialSteps().map((s) => entry({ category: CATEGORY.guide, title: T3(s.title, s.tamil, s.hi?.title), parts: [part(T3(s.body, s.taBody, s.hi?.body))] }));
  return [
    { id: 'monolith', kicker: CATEGORY.monolith, title: T3(ch.MONUMENT.title, ch.MONUMENT.tamil), intro: T3('The monolith at the centre of the Central Hall: four inscribed faces, read in this order walking round it.', 'மையக் கூடத்தின் நடுவே உள்ள நினைவுத் தூண்: அதைச் சுற்றி நடக்கும்போது இந்த வரிசையில் படிக்கப்படும் நான்கு பக்கங்கள்.', 'केंद्रीय कक्ष के मध्य स्थित स्तंभ: इसके चार उत्कीर्ण मुख, इसकी परिक्रमा करते हुए इसी क्रम में पढ़े जाते हैं।'), groups: [{ heading: L3('The Four Faces', 'நான்கு பக்கங்கள்', 'चार मुख'), entries: faces }] },
    { id: 'plan', kicker: CATEGORY.overview, title: L3('The Halls of the Museum', 'அருங்காட்சியகத்தின் கூடங்கள்', 'संग्रहालय के कक्ष'), intro: T3(rb.hallways.central.subtitle), groups: [{ heading: L3('Corridors from the Central Hall', 'மையக் கூடத்திலிருந்து நடைபாதைகள்', 'केंद्रीय कक्ष से गलियारे'), entries: plan }] },
    { id: 'guide', kicker: CATEGORY.guide, title: L3('Visitor Guide', 'வருகையாளர் வழிகாட்டி', 'आगंतुक मार्गदर्शिका'), intro: null, groups: [{ heading: L3('Guide Steps', 'வழிகாட்டிப் படிகள்', 'मार्गदर्शिका के चरण'), entries: guide }] },
  ];
}

function literatureHall() {
  const rooms = roomsOf('literature', ['shrine']);
  const figures = roomsOf('historical-figures');
  return [
    hallOverview('literature', { rooms, centrepiece: null }),
    ...rooms.map((r) => roomSection(r)),
    hallOverview('historical-figures'),
    ...figures.map((r) => roomSection(r)),
  ];
}

function thiruvalluvarShrine() {
  const shrine = rb.roomBooks.shrine;
  const story = vs.valluvarStory;
  const storyEntry = entry({
    category: CATEGORY.story,
    title: T3(story.title.en, story.title.ta),
    parts: story.en.map((en, i) => part(T3(en, story.ta[i]))),
    media: ['Audio/Thiruvalluvar story/thiruvalluvar story.pdf'],
  });
  const sections = [
    hallOverview('literature', { rooms: [shrine], centrepiece: null }),
    roomSection(shrine, { groups: [{ heading: L3('The Thiruvalluvar Story', 'திருவள்ளுவர் கதை', 'तिरुवल्लुवर की कथा'), entries: [storyEntry] }] }),
  ];
  for (const paal of ks.kuralSections) {
    const groups = paal.groups.map((group) => ({
      heading: T3(group.english, group.tamil),
      entries: group.chapters.map((chapter) => ({
        kind: 'kural-chapter',
        category: CATEGORY.chapter,
        title: T3(chapter.english, chapter.tamil),
        number: chapter.number,
        transliteration: chapter.transliteration,
        kurals: KURALS.filter((k) => k.number >= chapter.start && k.number <= chapter.end).map((k) => {
          const h = KURALS_HI[k.number] ?? {};
          stats.hindiWanted += 1;
          if (!h.translation) stats.hindiMissing += 1;
          return { ...k, hi: h };
        }),
      })),
    }));
    sections.push({ id: `paal-${paal.number}`, kicker: L3(`Thirukkural · Book ${paal.number}`, `திருக்குறள் · ${paal.number}-ஆம் பால்`, `तिरुक्कुरल · भाग ${paal.number}`), title: T3(paal.english, paal.tamil), intro: { en: paal.transliteration, ta: null, hi: null }, groups });
  }
  return sections;
}

function artisticWing() {
  return [hallOverview('artistic'), ...roomsOf('artistic').map((r) => roomSection(r))];
}

function tradeHall() {
  return [hallOverview('trade'), ...roomsOf('trade').map((r) => roomSection(r))];
}

function householdHall() {
  return [hallOverview('household'), ...roomsOf('household').map((r) => roomSection(r))];
}

function ainthinaiAndTamilakam() {
  const sections = [hallOverview('ainthinai')];
  for (const room of roomsOf('ainthinai')) {
    const extra = {};
    if (room.id === 'ainthinai-landscapes') {
      extra.groups = [{
        heading: L3('The Landscape Chart', 'திணை அட்டவணை', 'भू-दृश्य तालिका'),
        entries: ai.LANDSCAPES.map((l) => entry({
          category: CATEGORY.landscape,
          title: T3(l.key, l.tamil),
          parts: [
            ...ai.CHART_ROWS.map(([en, ta, field]) => part(T3(l[field][0], l[field][1]), T3(en, ta))),
            l.panel && part(fromObj(l.panel.body), fromObj(l.panel.title)),
          ],
          media: l.model?.diorama ? [`3D diorama: ${l.model.diorama}`] : [],
        })),
      }];
    }
    sections.push(roomSection(room, extra));
  }
  // The map of Ancient Tamilakam.
  const places = tk.TAMILAKAM_PLACES.map((p) => entry({
    category: CATEGORY.place,
    title: T3(p.en, p.ta),
    subtitle: tk.categoryOf(p.category) ? fromObj(tk.categoryOf(p.category)) : null,
    parts: [
      part(fromObj(p.period), L3('Period', 'காலம்', 'काल')),
      part(fromObj(p.description), L3('Description', 'விளக்கம்', 'विवरण')),
      part(fromObj(p.significance), L3('Significance', 'சிறப்பு', 'महत्व')),
      part(fromObj(p.evidence), L3('Evidence', 'சான்று', 'साक्ष्य')),
      ...(p.candidates ?? []).map((c) => part(T3(c.en ?? c.name, c.ta), L3('Candidate site', 'கருதப்படும் இடம்', 'संभावित स्थल'))),
    ],
    facts: p.position ? [[L3('Coordinates', 'ஆள்கூறுகள்', 'निर्देशांक'), p.position.join(', ')]] : [],
  }));
  sections.push({
    id: 'tamilakam',
    kicker: L3('Interactive Map', 'ஊடாடும் வரைபடம்', 'संवादात्मक मानचित्र'),
    title: L3('Ancient Tamilakam', 'பண்டைய தமிழகம்', 'प्राचीन तमिलकम'),
    intro: fromObj(tk.TAMILAKAM_NOTE),
    groups: [
      { heading: L3('Map Notes & Categories', 'வரைபடக் குறிப்புகளும் வகைகளும்', 'मानचित्र टिप्पणियाँ और श्रेणियाँ'), entries: [entry({ category: CATEGORY.note, title: L3('About the base map', 'அடிப்படை வரைபடம் பற்றி', 'आधार मानचित्र के बारे में'), parts: [part(fromObj(tk.BASEMAP_NOTE)), ...tk.CATEGORIES.map((c) => part(fromObj(c), L3(`Category ${c.glyph}`, `வகை ${c.glyph}`, `श्रेणी ${c.glyph}`)))] })] },
      { heading: L3('Places on the Map', 'வரைபடத்தில் உள்ள இடங்கள்', 'मानचित्र पर स्थल'), entries: places },
    ],
  });
  // Tamil Nadu: Then & Now.
  sections.push(hallOverview('tn-then-vs-now'));
  for (const room of roomsOf('tn-then-vs-now')) {
    const place = tn.getPlace(room.place);
    const card = entry({
      category: CATEGORY.compare,
      title: T3(place.en, place.ta),
      parts: Object.entries(tn.SECTION_TITLES).map(([key, title]) => part(fromObj(place.sections[key]), fromObj(title))),
      media: [place.compare?.then && `${tn.placeFolder(place)}/${place.compare.then} (slider: then)`, place.compare?.now && `${tn.placeFolder(place)}/${place.compare.now} (slider: now)`],
    });
    sections.push(roomSection(room, { kicker: L3('Then & Now · Place', 'அன்றும் இன்றும் · இடம்', 'तब और अब · स्थल'), groups: [{ heading: L3('Comparison Card', 'ஒப்பீட்டு அட்டை', 'तुलना कार्ड'), entries: [card] }] }));
  }
  return sections;
}

const CATALOGUES = [
  { file: 'central-hall-catalogue.pdf', hall: 'central', build: centralHall },
  { file: 'literature-hall-catalogue.pdf', hall: 'literature', build: literatureHall },
  { file: 'thiruvalluvar-shrine-catalogue.pdf', hall: 'literature', title: () => T3(rb.roomBooks.shrine.title, rb.roomBooks.shrine.tamil), overview: () => T3(rb.roomBooks.shrine.description, rb.roomBooks.shrine.tamilDescription), accent: rb.roomBooks.shrine.accent, build: thiruvalluvarShrine },
  { file: 'artistic-values-wing-catalogue.pdf', hall: 'artistic', build: artisticWing },
  { file: 'trade-and-ports-catalogue.pdf', hall: 'trade', build: tradeHall },
  { file: 'household-and-agriculture-catalogue.pdf', hall: 'household', build: householdHall },
  { file: 'ainthinai-and-tamilakam-catalogue.pdf', hall: 'ainthinai', title: () => L3('Ainthinai & Ancient Tamilakam', 'ஐந்திணையும் பண்டைய தமிழகமும்', 'ऐन्दिणै और प्राचीन तमिलकम'), build: ainthinaiAndTamilakam },
];

/** The whole museum in one volume: every hall's catalogue in turn, each section tagged with its hall. */
const joinTag = (a, b) => (a && b ? `${a} · ${b}` : b ?? a ?? null);
CATALOGUES.push({
  file: 'cict-museum-master-catalogue.pdf',
  hall: 'central',
  vol: '01–07',
  title: () => L3('CICT Museum — Complete Master Catalogue', 'காட்சியகத்தின் முழுமையான முதன்மைக் கையேடு', 'CICT संग्रहालय — संपूर्ण मुख्य कैटलॉग'),
  overview: () => L3(
    'Every hall of the museum in one volume: the Central Hall, the Literature Hall, the Thiruvalluvar Shrine, the Ancient Artistic Values Wing, Trade & Ports, Household & Agriculture, and Ainthinai & Ancient Tamilakam.',
    'அருங்காட்சியகத்தின் எல்லாக் கூடங்களும் ஒரே தொகுதியில்: மையக் கூடம், இலக்கியக் கூடம், திருவள்ளுவர் சன்னதி, பண்டைய கலை மரபுப் பிரிவு, வணிகமும் துறைமுகங்களும், இல்லமும் வேளாண்மையும், ஐந்திணையும் பண்டைய தமிழகமும்.',
    'संग्रहालय के सभी कक्ष एक ही खंड में: केंद्रीय कक्ष, साहित्य कक्ष, तिरुवल्लुवर मंदिर, प्राचीन कलात्मक मूल्य खंड, व्यापार और बंदरगाह, गृहस्थी और कृषि, तथा ऐन्दिणै और प्राचीन तमिलकम।',
  ),
  build: () => CATALOGUES.filter((c) => !c.vol).flatMap((c) => {
    const hall = c.title?.() ?? hallInfo(c.hall).title;
    return c.build().map((sec) => ({ ...sec, kicker: { en: joinTag(hall.en, sec.kicker.en), ta: joinTag(hall.ta, sec.kicker.ta), hi: joinTag(hall.hi, sec.kicker.hi) } }));
  }),
});

/* ------------------------------------------------------------------ HTML */

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const MISSING_HI = '<span class="missing">हिन्दी अनुवाद अभी उपलब्ध नहीं · Hindi translation not yet available</span>';

const trioLine = (t, cls = '') => (t ? `<span class="t-en ${cls}">${esc(t.en)}</span>${t.ta ? `<span class="t-ta ${cls}" lang="ta">${esc(t.ta)}</span>` : ''}${t.hi ? `<span class="t-hi ${cls}" lang="hi">${esc(t.hi)}</span>` : ''}` : '');
const labelInline = (t) => (t ? [t.en, t.ta, t.hi].filter(Boolean).map((x, i) => `<span class="${['l-en', 'l-ta', 'l-hi'][i] ?? ''}">${esc(x)}</span>`).join('<span class="dot"> · </span>') : '');

function textBlock(t) {
  const rows = [];
  if (t.en) rows.push(`<div class="lang-row"><div class="tag">EN</div><p lang="en">${esc(t.en)}</p></div>`);
  if (t.ta) rows.push(`<div class="lang-row"><div class="tag ta" lang="ta">தமிழ்</div><p lang="ta" class="ta">${esc(t.ta)}</p></div>`);
  if (t.hi !== false && (t.en || t.hi)) rows.push(`<div class="lang-row"><div class="tag hi" lang="hi">हिन्दी</div><p lang="hi" class="hi">${t.hi ? esc(t.hi) : MISSING_HI}</p></div>`);
  return rows.join('');
}

function renderEntry(e, number) {
  if (e.kind === 'kural-chapter') return renderChapter(e, number);
  const facts = e.facts.length ? `<dl class="facts">${e.facts.map(([k, v]) => `<div><dt>${labelInline(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : '';
  const parts = e.parts.map((p) => `<div class="part">${p.label ? `<div class="part-label">${labelInline(p.label)}</div>` : ''}${textBlock(p.text)}</div>`).join('');
  const media = e.media.length ? `<div class="media"><div class="media-h">Associated media / assets · தொடர்புடைய ஊடகக் கோப்புகள் · संबद्ध मीडिया</div><ul>${e.media.map((m) => `<li>${esc(m)}</li>`).join('')}</ul></div>` : '';
  return `<article class="entry" id="e-${number.replace(/\./g, '-')}">
    <header><div class="num">${number}</div><div class="cat">${labelInline(e.category)}</div></header>
    <h4 class="title">${trioLine(e.title)}</h4>
    ${e.subtitle ? `<div class="subtitle">${trioLine(e.subtitle)}</div>` : ''}
    ${facts}${parts}${media}
  </article>`;
}

function renderChapter(e, number) {
  const rows = e.kurals.map((k) => `<div class="kural">
      <div class="k-no">${k.number}</div>
      <div class="k-body">
        <p class="k-ta" lang="ta">${esc(k.tamilLine1)}<br>${esc(k.tamilLine2)}</p>
        <div class="k-grid">
          <div><div class="tag">EN</div><p>${esc(k.translation)}</p><p class="k-ex">${esc(k.explanation)}</p></div>
          <div><div class="tag hi" lang="hi">हिन्दी</div>${k.hi.translation ? `<p lang="hi" class="hi">${esc(k.hi.translation).replace(/\n/g, '<br>')}</p><p lang="hi" class="hi k-ex">${esc(k.hi.meaning ?? '')}</p>` : `<p>${MISSING_HI}</p>`}</div>
        </div>
        ${k.studentMeaning ? `<div class="k-student"><div class="part-label">Student meaning · மாணவர் விளக்கம் · विद्यार्थी अर्थ</div><p>${esc(k.studentMeaning.en)}</p><p lang="ta" class="ta">${esc(k.studentMeaning.ta)}</p></div>` : ''}
      </div>
    </div>`).join('');
  return `<article class="entry chapter" id="e-${number.replace(/\./g, '-')}">
    <header><div class="num">${number}</div><div class="cat">${labelInline(e.category)} ${e.number} · ${esc(e.transliteration ?? '')}</div></header>
    <h4 class="title">${trioLine(e.title)}</h4>
    <div class="kurals">${rows}</div>
  </article>`;
}

function renderDocument(cat, sections, index) {
  const hall = hallInfo(cat.hall);
  const title = cat.title?.() ?? hall.title;
  const overview = cat.overview?.() ?? hall.subtitle;
  const accent = cat.accent ?? hall.accent ?? '#8a5a2b';
  const logo = `data:image/jpeg;base64,${readFileSync(join(ROOT, 'src/assets/cict-logo.jpg')).toString('base64')}`;
  const today = new Date().toISOString().slice(0, 10);
  const counts = { entries: 0 };
  const numbered = sections.map((s, si) => ({
    ...s,
    no: si + 1,
    groups: s.groups.map((g) => ({ ...g, entries: g.entries.map((e) => ({ e, no: `${si + 1}.${++counts.entries}` })) })),
  }));
  // restart numbering per section
  for (const s of numbered) {
    let n = 0;
    for (const g of s.groups) for (const x of g.entries) x.no = `${s.no}.${++n}`;
  }
  const toc = numbered.map((s) => `<li class="toc-sec"><a href="#s-${s.no}"><span class="toc-no">${s.no}</span> <span class="toc-k">${esc(s.kicker.en)}</span> ${esc(s.title.en)} <span class="ta" lang="ta">${esc(s.title.ta ?? '')}</span></a>
      <ol>${s.groups.flatMap((g) => g.entries).map((x) => `<li><a href="#e-${x.no.replace(/\./g, '-')}"><span class="toc-no">${x.no}</span> ${esc(x.e.title.en ?? x.e.title.ta)}${x.e.title.ta && x.e.title.en ? ` <span class="ta" lang="ta">${esc(x.e.title.ta)}</span>` : ''}</a></li>`).join('')}</ol></li>`).join('');
  const body = numbered.map((s) => `<section class="room" id="s-${s.no}">
      <div class="room-head">
        <div class="kicker">${s.no} · ${labelInline(s.kicker)}</div>
        <h2>${trioLine(s.title)}</h2>
        ${s.intro && (s.intro.en || s.intro.ta) ? `<div class="intro">${textBlock(s.intro)}</div>` : ''}
      </div>
      ${s.groups.map((g) => `<div class="group"><h3>${trioLine(g.heading)}</h3>${g.entries.map((x) => renderEntry(x.e, x.no)).join('')}</div>`).join('')}
    </section>`).join('');

  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>${esc(title.en)} — Master Content</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600;700&family=Noto+Serif:wght@400;600;700&family=Noto+Sans+Tamil:wght@400;600;700&family=Noto+Serif+Tamil:wght@400;600;700&family=Noto+Sans+Devanagari:wght@400;600;700&display=block" rel="stylesheet">
<style>
  @page { size: A4; margin: 16mm 14mm 16mm 14mm; }
  :root { --accent: ${accent}; --ink: #2b1d0e; --muted: #7a6a50; --paper: #fffdf7; --rule: #e3d6bd; }
  * { box-sizing: border-box; }
  html, body { margin: 0; background: #fff; color: var(--ink); }
  body { font: 10pt/1.5 'Noto Sans', 'Noto Sans Tamil', 'Noto Sans Devanagari', 'Nirmala UI', sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  [lang="ta"], .ta { font-family: 'Noto Sans Tamil', 'Nirmala UI', sans-serif; line-height: 1.7; }
  [lang="hi"], .hi { font-family: 'Noto Sans Devanagari', 'Nirmala UI', sans-serif; line-height: 1.65; }
  a { color: inherit; text-decoration: none; }
  /* cover */
  .cover { height: 263mm; display: flex; flex-direction: column; border: 2px solid var(--accent); outline: 1px solid var(--accent); outline-offset: -6px; padding: 18mm 16mm; page-break-after: always; background: linear-gradient(180deg, #fff 0%, #fbf4e4 100%); }
  .cover .org { display: flex; gap: 12px; align-items: center; }
  .cover .org img { width: 64px; height: 64px; object-fit: contain; border-radius: 50%; }
  .cover .org .n1 { font: 700 13pt 'Noto Serif', serif; }
  .cover .org .n2 { font: 600 11pt 'Noto Serif Tamil', 'Noto Sans Tamil', serif; color: var(--muted); }
  .cover .series { margin-top: 26mm; letter-spacing: .28em; text-transform: uppercase; font-size: 9pt; color: var(--accent); font-weight: 700; }
  .cover .vol { font: 700 54pt/1 'Noto Serif', serif; color: var(--accent); opacity: .25; margin-top: 6mm; }
  .cover h1 { margin: 4mm 0 0; }
  .cover h1 .t-ta { display: block; font: 700 30pt/1.35 'Noto Serif Tamil', 'Noto Sans Tamil', serif; color: var(--accent); }
  .cover h1 .t-en { display: block; font: 700 24pt/1.25 'Noto Serif', serif; }
  .cover h1 .t-hi { display: block; font: 600 17pt/1.5 'Noto Sans Devanagari', sans-serif; color: var(--muted); }
  .cover h1 { display: flex; flex-direction: column; }
  .cover h1 .t-ta { order: -1; }
  .cover .ov { margin-top: 10mm; border-top: 1px solid var(--rule); padding-top: 5mm; }
  .cover .meta { margin-top: auto; font-size: 8.5pt; color: var(--muted); display: flex; justify-content: space-between; gap: 8mm; border-top: 1px solid var(--rule); padding-top: 4mm; }
  /* toc */
  .toc { page-break-after: always; }
  .toc h2 { font: 700 18pt 'Noto Serif', serif; margin: 0 0 2mm; color: var(--accent); }
  .toc h2 .ta { font-size: 13pt; color: var(--muted); margin-left: 8px; }
  .toc > ol { list-style: none; padding: 0; margin: 0; }
  .toc-sec { margin: 3mm 0; break-inside: avoid-page; }
  .toc-sec > a { font-weight: 700; display: block; border-bottom: 1px solid var(--rule); padding-bottom: 1mm; }
  .toc-sec ol { list-style: none; padding: 0 0 0 6mm; margin: 1mm 0 0; columns: 2; column-gap: 8mm; font-size: 8.4pt; }
  .toc-sec ol li { break-inside: avoid; padding: .4mm 0; }
  .toc-no { color: var(--accent); font-variant-numeric: tabular-nums; font-weight: 700; margin-right: 2px; }
  .toc-k { font-size: 7.5pt; text-transform: uppercase; letter-spacing: .12em; color: var(--muted); }
  .toc .ta { color: var(--muted); font-weight: 400; }
  /* rooms */
  .room { page-break-before: always; }
  .room-head { border-left: 5px solid var(--accent); padding: 2mm 0 2mm 5mm; margin-bottom: 5mm; background: #fbf6ea; }
  .kicker { font-size: 8pt; letter-spacing: .14em; text-transform: uppercase; color: var(--accent); font-weight: 700; }
  .kicker .l-ta, .kicker .l-hi { letter-spacing: 0; text-transform: none; }
  .room-head h2 { margin: 1mm 0 2mm; display: flex; flex-direction: column; }
  .room-head h2 .t-en { font: 700 17pt/1.25 'Noto Serif', serif; }
  .room-head h2 .t-ta { font: 700 14pt/1.5 'Noto Serif Tamil', 'Noto Sans Tamil', serif; color: var(--accent); }
  .room-head h2 .t-hi { font: 600 12pt/1.5 'Noto Sans Devanagari', sans-serif; color: var(--muted); }
  .intro { padding-right: 4mm; }
  .group h3 { margin: 6mm 0 3mm; padding-bottom: 1mm; border-bottom: 2px solid var(--accent); font-size: 11.5pt; display: flex; flex-wrap: wrap; gap: 0 10px; align-items: baseline; break-after: avoid; }
  .group h3 .t-ta, .group h3 .t-hi { font-size: 10pt; color: var(--muted); font-weight: 600; }
  .entry { border: 1px solid var(--rule); border-radius: 3px; padding: 3mm 4mm; margin: 0 0 3.5mm; background: var(--paper); break-inside: avoid-page; }
  .entry.chapter { break-inside: auto; }
  .entry header { display: flex; gap: 8px; align-items: baseline; font-size: 7.6pt; color: var(--muted); text-transform: uppercase; letter-spacing: .08em; }
  .entry header .l-ta, .entry header .l-hi { text-transform: none; letter-spacing: 0; }
  .entry .num { font-weight: 700; color: var(--accent); }
  .entry h4.title { margin: 1mm 0 .5mm; display: flex; flex-wrap: wrap; gap: 0 10px; align-items: baseline; }
  .entry h4 .t-en { font: 700 12pt/1.3 'Noto Serif', serif; }
  .entry h4 .t-ta { font: 700 11pt/1.5 'Noto Sans Tamil', sans-serif; color: var(--accent); }
  .entry h4 .t-hi { font: 600 10pt/1.5 'Noto Sans Devanagari', sans-serif; color: var(--muted); }
  .subtitle { font-style: italic; color: var(--muted); font-size: 9pt; display: flex; flex-wrap: wrap; gap: 0 8px; }
  .subtitle .t-ta, .subtitle .t-hi { font-style: normal; }
  .subtitle .t-ta::before, .subtitle .t-hi::before { content: '· '; }
  .facts { display: flex; flex-wrap: wrap; gap: 1mm 6mm; margin: 1.5mm 0 0; font-size: 8.5pt; }
  .facts div { display: flex; gap: 4px; } .facts dt { color: var(--muted); } .facts dd { margin: 0; font-weight: 700; }
  .part { margin-top: 2mm; }
  .part-label { font-size: 8.2pt; font-weight: 700; color: var(--accent); margin-bottom: .5mm; }
  .dot { color: var(--muted); }
  .lang-row { display: grid; grid-template-columns: 13mm 1fr; gap: 2mm; margin: .8mm 0; }
  .lang-row p { margin: 0; text-align: justify; }
  .tag { font-size: 7pt; font-weight: 700; color: #fff; background: var(--accent); border-radius: 2px; text-align: center; height: fit-content; padding: .3mm 0; letter-spacing: .05em; }
  .tag.ta { background: #6a3a1e; } .tag.hi { background: #3a4a6a; }
  .missing { color: #a08a6a; font-style: italic; font-size: 8.5pt; }
  .media { margin-top: 2mm; border-top: 1px dashed var(--rule); padding-top: 1.5mm; }
  .media-h { font-size: 7.4pt; color: var(--muted); text-transform: uppercase; letter-spacing: .06em; }
  .media ul { margin: .5mm 0 0; padding-left: 4mm; font: 7.8pt/1.45 Consolas, 'Courier New', monospace; color: #4a3a22; word-break: break-all; }
  /* kurals */
  .kural { display: grid; grid-template-columns: 10mm 1fr; gap: 2mm; padding: 2mm 0; border-top: 1px solid var(--rule); break-inside: avoid-page; }
  .k-no { font-weight: 700; color: var(--accent); font-variant-numeric: tabular-nums; }
  .k-ta { margin: 0 0 1mm; font-weight: 600; font-size: 10.5pt; }
  .k-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; font-size: 9pt; }
  .k-grid .tag { display: inline-block; width: 13mm; margin-bottom: .5mm; }
  .k-grid p { margin: 0 0 .8mm; }
  .k-ex { color: #5a4a32; font-size: 8.6pt; }
  .k-student { margin-top: 1mm; background: #f6efdc; padding: 1.5mm 2.5mm; border-radius: 2px; font-size: 8.8pt; }
  .k-student p { margin: .5mm 0; }
</style></head><body>
<section class="cover">
  <div class="org"><img src="${logo}" alt=""><div><div class="n1">Central Institute of Classical Tamil</div><div class="n2" lang="ta">செம்மொழித் தமிழாய்வு மத்திய நிறுவனம்</div><div class="n2" lang="hi" style="font-family:'Noto Sans Devanagari'">केंद्रीय शास्त्रीय तमिल संस्थान</div></div></div>
  <div class="series">Tamil Treasures Gallery · Master Content Catalogue</div>
  <div class="vol">${cat.vol ?? String(index + 1).padStart(2, '0')}</div>
  <h1>${trioLine(title)}</h1>
  <div class="ov">${overview ? textBlock(overview) : ''}</div>
  <div class="meta"><span>${numbered.length} sections · ${counts.entries} catalogue entries · English · தமிழ் · हिन्दी</span><span>Generated ${today} from the museum codebase</span></div>
</section>
<nav class="toc"><h2>Table of Exhibits <span class="ta" lang="ta">காட்சிப்பொருள் அட்டவணை</span> <span class="ta" lang="hi">प्रदर्श-सूची</span></h2><ol>${toc}</ol></nav>
${body}
</body></html>`;
}

/* ------------------------------------------------------------------ Chromium */

async function launchBrowser() {
  let playwright;
  try {
    playwright = await import('playwright');
  } catch {
    const globalRoot = execSync('npm root -g', { encoding: 'utf8' }).trim();
    playwright = createRequire(join(globalRoot, 'noop.js'))('playwright');
  }
  const { chromium } = playwright;
  for (const options of [{}, { channel: 'chrome' }, { channel: 'msedge' }]) {
    try {
      return await chromium.launch(options);
    } catch (error) {
      console.warn(`  (Chromium launch ${JSON.stringify(options)} failed: ${error.message.split('\n')[0]})`);
    }
  }
  throw new Error('No Chromium available: run `npx playwright install chromium`, or install Chrome or Edge.');
}

/* ------------------------------------------------------------------ run */

mkdirSync(OUT_PUBLIC, { recursive: true });
mkdirSync(OUT_REVIEW, { recursive: true });
// Drop PDFs from earlier runs that no catalogue writes any more (e.g. renamed files), so the
// app's links (src/data/roomCatalogues.js) and the folders always list the same set.
for (const dir of [OUT_PUBLIC, OUT_REVIEW]) {
  for (const name of readdirSync(dir)) {
    if (name.endsWith('.pdf') && !CATALOGUES.some((cat) => cat.file === name)) rmSync(join(dir, name));
  }
}
const browser = await launchBrowser();
const report = [];
try {
  for (const [index, cat] of CATALOGUES.entries()) {
    const before = { wanted: stats.hindiWanted, missing: stats.hindiMissing };
    const sections = cat.build();
    const html = renderDocument(cat, sections, index);
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle', timeout: 120000 });
    const fonts = await page.evaluate(async () => {
      await document.fonts.ready;
      // A face counts only if it was declared by the stylesheet and has actually loaded.
      const loaded = (family) => [...document.fonts].some((face) => face.family.replace(/["']/g, '') === family && face.status === 'loaded');
      return { tamil: loaded('Noto Sans Tamil'), devanagari: loaded('Noto Sans Devanagari'), latin: loaded('Noto Sans') };
    });
    if (!fonts.tamil || !fonts.devanagari) console.warn(`  ! Noto fonts not loaded (${JSON.stringify(fonts)}); falling back to Nirmala UI.`);
    const out = join(OUT_PUBLIC, cat.file);
    const hallTitle = (cat.title?.() ?? hallInfo(cat.hall).title).en;
    await page.pdf({
      path: out,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: `<div style="font:7px Arial,sans-serif;color:#7a6a50;width:100%;padding:0 14mm;display:flex;justify-content:space-between"><span>CICT · Tamil Treasures Gallery · Master Content — ${esc(hallTitle)}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
    });
    await page.close();
    copyFileSync(out, join(OUT_REVIEW, cat.file));
    const bytes = statSync(out).size;
    const pdfText = readFileSync(out, 'latin1');
    const pageCount = (pdfText.match(/\/Type\s*\/Page[^s]/g) ?? []).length;
    const entries = sections.reduce((n, s) => n + s.groups.reduce((m, g) => m + g.entries.length, 0), 0);
    const hindi = { wanted: stats.hindiWanted - before.wanted, missing: stats.hindiMissing - before.missing };
    report.push({ file: cat.file, sections: sections.length, entries, pages: pageCount, kb: Math.round(bytes / 1024), fonts, hindiCoverage: `${hindi.wanted - hindi.missing}/${hindi.wanted}` });
    console.log(`✓ ${cat.file}  ${sections.length} sections, ${entries} entries, ${pageCount} pages, ${Math.round(bytes / 1024)} KB, Hindi ${hindi.wanted - hindi.missing}/${hindi.wanted}`);
  }
} finally {
  await browser.close();
}

writeFileSync(join(OUT_REVIEW, 'manifest.json'), `${JSON.stringify({ generated: new Date().toISOString(), output: OUT_PUBLIC, files: report, hindiMissingSamples: [...stats.missing].slice(0, 200) }, null, 2)}\n`);
const empty = report.filter((r) => r.kb < 5 || r.pages < 2);
if (empty.length) {
  console.error('Some PDFs look empty:', empty.map((r) => r.file).join(', '));
  process.exit(1);
}
console.log(`\nWrote ${report.length} PDFs to\n  ${OUT_PUBLIC}\n  ${OUT_REVIEW}`);
console.log(`Hindi: ${stats.hindiWanted - stats.hindiMissing}/${stats.hindiWanted} texts have Hindi (missing ones are marked in the PDFs; samples in room-master-pdfs/manifest.json).`);
