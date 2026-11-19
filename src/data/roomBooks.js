/**
 * Rooms / wings and the rare books shelved in each glass cabinet.
 *
 * `pdfUrl` points at static files served from the public folder
 * (configured as `publicDir` in vite.config.js), e.g. public/E-Books/Akananuru.pdf
 * is served at /E-Books/Akananuru.pdf. Keys of `roomBooks` match the `sections`
 * ids in main.jsx so a wing's "Enter" action can find its room.
 *
 * Every book has a Tamil title and a work (or its own description) so describeBook()
 * in bookInfo.js can give it a full Tamil and English description.
 */

import { applyToRoom } from '../siteData/siteData.js';
import { artifactsIn, siteFoldersIn } from './artifacts.js';
import { coinCatalogs, epigraphCatalogs, sangamGuide, sculptureCatalogs } from './catalogs.js';
import { portAlbums } from './ports.js';
import { sareeAlbums } from './sarees.js';
import { weavingAlbums } from './weaving.js';
import { householdObjects } from './household.js';
import { FOOD_TEXTS, LANDSCAPE_ORDER } from './foodsAndLandscapes.js';
import { manuscriptShelves, tinaiShelves } from './manuscripts.js';
import { KINGS_FOLDER, KINGS_ORDER, PATRONS_FOLDER, PATRON_ORDER, POETS_FOLDER, POET_ORDER } from './historicalFigures.js';
import { PLACES_FOLDER, THEN_NOW_PLACES, placeFolder, placeRoomId } from './thenAndNow.js';
import { ringApothem } from '../components/hallway/hallLayout.js';
import { mediaUrl } from '../mediaUrl.js';
import { getLang, tri } from '../i18n/index.js';

/** Builds a URL for a file in the public folder, encoding spaces and other unsafe characters. */
const pdf = (path) => mediaUrl(path);

/**
 * The photographs of a food folder named in `keys` (the English part of their file names,
 * "Rice — அரிசி.jpeg" → 'Rice'), in that order, captioned from foodsAndLandscapes.js.
 */
const foods = (folder, keys) => {
  const all = artifactsIn(folder).map((artifact) => {
    const text = FOOD_TEXTS[folder]?.[artifact.title];
    return { ...artifact, key: artifact.title, ...(text && { title: text.title, detail: text.detail, tamil: text.ta, note: text.en, tamilNote: text.taText }) };
  });
  return keys.map((key) => all.find((artifact) => artifact.key === key)).filter(Boolean);
};

/** The curators' notes on Tamil food (public/Tamil foods), for a Foods room's cabinet. */
const foodNotes = (room) => ({
  id: `${room}-notes`,
  title: 'Curators’ Notes',
  tamil: 'காப்பாளர் குறிப்புகள்',
  books: [
    {
      id: `${room}-notes-english`,
      title: 'Ancient Tamil Foods',
      tamil: 'பண்டைய தமிழர்களின் உணவுகள் (ஆங்கிலம்)',
      pdfUrl: pdf('Tamil foods/tamil food eng.pdf'),
      description: {
        en: 'The museum’s notes on fifteen foods and ingredients of Tamil culinary history, from rice and millets to palm products and meals on a banana leaf, with the illustrated poster, in English.',
        ta: 'அரிசி, சிறுதானியங்கள் முதல் பனைப் பொருட்கள், வாழை இலை உணவு வரை தமிழர் உணவு வரலாற்றின் பதினைந்து உணவுகள் பற்றிய காட்சியகக் குறிப்புகள், விளக்கப்படத்துடன், ஆங்கிலத்தில்.',
      },
    },
    {
      id: `${room}-notes-tamil`,
      title: 'Ancient Tamil Foods (Tamil)',
      tamil: 'பண்டைய தமிழர்களின் உணவுகள்',
      pdfUrl: pdf('Tamil foods/tamil food tamil.pdf'),
      description: {
        en: 'The same notes on Tamil foods, in Tamil.',
        ta: 'தமிழர் உணவுகள் பற்றிய அதே குறிப்புகள், தமிழில்.',
      },
    },
  ],
});

/** The curators' notes on the foods of the five landscapes (public/5 lanscapes food). */
const landscapeFoodNotes = {
  id: 'landscape-food-notes',
  title: 'Curators’ Notes',
  tamil: 'காப்பாளர் குறிப்புகள்',
  books: [
    {
      id: 'landscape-food-english',
      title: 'Foods of the Five Landscapes',
      tamil: 'ஐவகை நிலங்களின் உணவுப் பண்பாடு (ஆங்கிலம்)',
      pdfUrl: pdf('5 lanscapes food/Five Landscapes FOOD ENGLISH.pdf'),
      description: {
        en: 'The museum’s notes on the food of each of the five tinai landscapes, with a comparison table, in English.',
        ta: 'ஐந்து திணை நிலங்களின் உணவுகள் பற்றிய காட்சியகக் குறிப்புகள், ஒப்பீட்டு அட்டவணையுடன், ஆங்கிலத்தில்.',
      },
    },
    {
      id: 'landscape-food-tamil',
      title: 'Foods of the Five Landscapes (Tamil)',
      tamil: 'பண்டைய தமிழகம் — ஐவகை நிலங்களின் உணவுப் பண்பாடு',
      pdfUrl: pdf('5 lanscapes food/Five Landscapes FOOD tamil.pdf'),
      description: {
        en: 'The same notes on the foods of the five landscapes, in Tamil.',
        ta: 'ஐவகை நிலங்களின் உணவுகள் பற்றிய அதே குறிப்புகள், தமிழில்.',
      },
    },
  ],
};

const rareVolume = (number) => ({
  id: `rare-${number}`,
  // TODO: replace with the catalogued title once each scanned volume is identified.
  title: `Rare Volume ${number}`,
  tamil: `அரிய தொகுதி ${number}`,
  work: 'rareArchive',
  pdfUrl: pdf(`rarepdf/${number}.pdf`),
});

/** A folder's photographs in the order of their titles (exhibitionTexts.js, or their captions); any not named follow. */
const inOrder = (folder, titles) => {
  const all = artifactsIn(folder);
  const rank = (artifact) => (titles.includes(artifact.title) ? titles.indexOf(artifact.title) : titles.length);
  return [...all].sort((a, b) => rank(a) - rank(b));
};

/** The photographs of the named instruments (their English titles, exhibitionTexts.js), in that order. */
const instruments = (...titles) => {
  const all = artifactsIn('Tamil Instruments');
  return titles.map((title) => all.find((artifact) => artifact.title === title)).filter(Boolean);
};

/** A pair of curators' notes, in English and Tamil, for a cabinet. */
const notesPair = (id, title, tamil, englishPdf, tamilPdf, subject) => [
  { id: `${id}-english`, title, tamil: `${tamil} (ஆங்கிலம்)`, pdfUrl: pdf(englishPdf), description: { en: `The museum’s notes on ${subject}, in English.`, ta: `${tamil} — காட்சியகக் குறிப்புகள், ஆங்கிலத்தில்.` } },
  { id: `${id}-tamil`, title: `${title} (Tamil)`, tamil, pdfUrl: pdf(tamilPdf), description: { en: `The same notes on ${subject}, in Tamil.`, ta: `${tamil} — காட்சியகக் குறிப்புகள், தமிழில்.` } },
];

/** The kings and queens: one folder per person, each with a portrait and notes in both languages. */
const KINGS = [
  { folder: 'Vel pari', name: 'Vel Pari', tamil: 'வேள் பாரி', notes: ['Vel pari ENG.pdf', 'Vel pari TAMIL.pdf'] },
  { folder: 'Karikala chozhan', name: 'Karikala Cholan', tamil: 'கரிகால் சோழன்', notes: ['Karikala Cholan ENG.pdf', 'Karikala Cholan TAMIL.pdf'] },
  { folder: 'Kannagi', name: 'Kannagi', tamil: 'கண்ணகி', notes: ['Kannagi ENG.pdf', 'Kannagi TAMIL.pdf'] },
  { folder: 'Semiyan Mahadevi', name: 'Sembiyan Mahadevi', tamil: 'செம்பியன் மாதேவி', notes: ['SEMBIYAN MAHADEVI ENG.pdf', 'SEMBIYAN MAHADEVI TAMIL.pdf'] },
  { folder: 'Rajaraja cholan', name: 'Rajaraja Chola I', tamil: 'முதலாம் இராஜராஜ சோழன்', notes: ['Rajaraja Cholan ENG.pdf', 'Rajaraja Cholan TAMIL.pdf'] },
  { folder: 'Rajendra cholan', name: 'Rajendra Chola I', tamil: 'முதலாம் இராஜேந்திர சோழன்', notes: ['Rajendra Cholan ENG.pdf', 'Rajendra Cholan TAMIL.pdf'] },
];
/** Every portrait in the person folders of the Kings & Queens collection, in KINGS_ORDER. */
const kingPortraits = () => {
  const all = siteFoldersIn(KINGS_FOLDER).flatMap((folder) => artifactsIn(folder));
  const rank = (artifact) => (KINGS_ORDER.includes(artifact.title) ? KINGS_ORDER.indexOf(artifact.title) : KINGS_ORDER.length);
  return all.sort((a, b) => rank(a) - rank(b));
};

/**
 * A room of the Then vs Now hall: one place (thenAndNow.js). Its comparison card — the slider
 * and the four texts — heads the room (`place`); its photographs follow in display cases.
 */
const placeRoom = (place) => ({
  id: placeRoomId(place),
  place: place.id,
  title: place.en,
  tamil: place.ta,
  glyph: place.glyph,
  accent: place.accent,
  description: place.sections.significance.en,
  tamilDescription: place.sections.significance.ta,
  galleries: [{ id: `${placeRoomId(place)}-gallery`, title: 'Pictures Across Time', tamil: 'காலங்கள் கடந்த காட்சிகள்', artifacts: artifactsIn(placeFolder(place)) }],
  cabinets: [
    {
      id: `${placeRoomId(place)}-notes`,
      title: 'Curators’ Notes',
      tamil: 'காப்பாளர் குறிப்புகள்',
      books: notesPair(`${placeRoomId(place)}-notes`, 'Tamil Nadu: Then and Now', 'தமிழ்நாடு: அன்றும் இன்றும்', `${PLACES_FOLDER}/PLACES- THEN vs NOW.pdf`, `${PLACES_FOLDER}/PLACES- THEN vs NOW TAMIL.pdf`, 'eight historic places of Tamil Nadu, then and now'),
    },
  ],
});

/*
 * Hallway wings also carry `accent` (the colour of the room glowing through its arch)
 * and `glyph` (the Tamil word painted on the panel behind the arch).
 *
 * A room may also have `galleries`: display cases of artefact photographs, each filled
 * from a folder in the public folder (see artifacts.js).
 */
export const roomBooks = {
  sangam: {
    id: 'sangam',
    title: 'Sangam Literature',
    tamil: 'சங்க இலக்கியம்',
    glyph: 'சங்கம்',
    accent: '#9b3a22',
    description: 'The Ten Idylls and the Eight Anthologies — the earliest Tamil poetry, in CICT editions.',
    tamilDescription: 'பத்துப்பாட்டும் எட்டுத்தொகையும் — தமிழின் மிகப் பழைய கவிதைகள், செம்மொழித் தமிழாய்வு மத்திய நிறுவனப் பதிப்புகளில்.',
    cabinets: [
      {
        id: 'pattuppattu',
        title: 'Pattuppattu — The Ten Idylls',
        tamil: 'பத்துப்பாட்டு',
        books: [
          sangamGuide,
          { id: 'thirumuru', title: 'Thirumurugatrupadai', tamil: 'திருமுருகாற்றுப்படை', work: 'thirumurugatrupadai', edition: 'cict', pdfUrl: pdf('E-Books/THIRUMURU-CICT__1_.pdf') },
          { id: 'porunar', title: 'Porunaratrupadai', tamil: 'பொருநராற்றுப்படை', work: 'porunaratrupadai', edition: 'cict', pdfUrl: pdf('E-Books/PORUNAR-CICT__1_.pdf') },
          { id: 'sirupan', title: 'Sirupanatrupadai', tamil: 'சிறுபாணாற்றுப்படை', work: 'sirupanatrupadai', edition: 'cict', pdfUrl: pdf('E-Books/SIRU-CICT.pdf') },
          { id: 'perumpan', title: 'Perumpanatrupadai', tamil: 'பெரும்பாணாற்றுப்படை', work: 'perumpanatrupadai', edition: 'cict', pdfUrl: pdf('E-Books/PERUMPADAI__1_.pdf') },
          { id: 'mullai', title: 'Mullaippattu', tamil: 'முல்லைப்பாட்டு', work: 'mullaippattu', edition: 'cict', pdfUrl: pdf('E-Books/MULLAI-CICT__1_.pdf') },
          { id: 'madurai', title: 'Maduraikkanchi', tamil: 'மதுரைக்காஞ்சி', work: 'maduraikkanchi', edition: 'cict', pdfUrl: pdf('E-Books/MADURAI-CICT.pdf') },
          { id: 'nedunal', title: 'Nedunalvadai', tamil: 'நெடுநல்வாடை', work: 'nedunalvadai', edition: 'cict', pdfUrl: pdf('E-Books/NEDUNAL-CICT.pdf') },
          { id: 'kurinji', title: 'Kurinjippattu', tamil: 'குறிஞ்சிப்பாட்டு', work: 'kurinjippattu', edition: 'cict', pdfUrl: pdf('E-Books/KURUNJI-CICT.pdf') },
          { id: 'pattina', title: 'Pattinappalai', tamil: 'பட்டினப்பாலை', work: 'pattinappalai', edition: 'cict', pdfUrl: pdf('E-Books/PATTINA-CICT__1_.pdf') },
          { id: 'malai', title: 'Malaipadukadam', tamil: 'மலைபடுகடாம்', work: 'malaipadukadam', edition: 'cict', pdfUrl: pdf('E-Books/MALAI-CICT.pdf') },
        ],
      },
      {
        id: 'ettuthokai',
        title: 'Ettuthokai — The Eight Anthologies',
        tamil: 'எட்டுத்தொகை',
        books: [
          { id: 'natri-cict', title: 'Natrinai', tamil: 'நற்றிணை', work: 'natrinai', edition: 'cict', pdfUrl: pdf('E-Books/NATRI-CICT__1_.pdf') },
          { id: 'kuru-cict', title: 'Kurunthokai', tamil: 'குறுந்தொகை', work: 'kurunthokai', edition: 'cict', pdfUrl: pdf('E-Books/KURU-CICT__1_.pdf') },
          { id: 'ainguru-cict', title: 'Ainkurunuru', tamil: 'ஐங்குறுநூறு', work: 'ainkurunuru', edition: 'cict', pdfUrl: pdf('E-Books/AINGURU-CICT__1_.pdf') },
          { id: 'pathitru-cict', title: 'Pathitrupathu', tamil: 'பதிற்றுப்பத்து', work: 'pathitrupathu', edition: 'cict', pdfUrl: pdf('E-Books/PATHITRU-CICT__1_.pdf') },
          { id: 'pari-cict', title: 'Paripadal', tamil: 'பரிபாடல்', work: 'paripadal', edition: 'cict', pdfUrl: pdf('E-Books/PARI-CICT.pdf') },
          { id: 'kali-cict', title: 'Kalithokai', tamil: 'கலித்தொகை', work: 'kalithokai', edition: 'cict', pdfUrl: pdf('E-Books/KALI-CICT.pdf') },
          { id: 'akan-cict', title: 'Akananuru', tamil: 'அகநானூறு', work: 'akananuru', edition: 'cict', pdfUrl: pdf('E-Books/AKAN-CICT__1_.pdf') },
          { id: 'pura-cict', title: 'Purananuru', tamil: 'புறநானூறு', work: 'purananuru', edition: 'cict', pdfUrl: pdf('E-Books/PURA-CICT__1_.pdf') },
          { id: 'fourth-sangam', title: 'Madurai Fourth Tamil Sangam', tamil: 'மதுரை நான்காம் தமிழ்ச் சங்கம்', work: 'maduraiSangam', pdfUrl: pdf('E-Books/madurai_4th_tamil_sangam.pdf') },
        ],
      },
    ],
  },

  coins: {
    id: 'coins',
    title: 'Ancient Tamil Coins',
    tamil: 'நாணயங்கள்',
    glyph: 'நாணயங்கள்',
    accent: '#a0612a',
    description: 'Coin catalogues of the Chera, Chola, and Pandya kings, Roman trade gold, and the medieval dynasties.',
    tamilDescription: 'சேர, சோழ, பாண்டிய மன்னர்களின் காசுகள், உரோமானிய வணிகப் பொற்காசுகள், இடைக்கால அரச மரபுகளின் காசுகள் பற்றிய அட்டவணைகள்.',
    galleries: [
      { id: 'coin-gallery', title: 'Coins of the Tamil Kings', tamil: 'தமிழ் மன்னர்களின் காசுகள்', artifacts: artifactsIn('Ancient Tamil Coins') },
    ],
    cabinets: [
      { id: 'coin-catalogues', title: 'Numismatic Catalogues', tamil: 'நாணயவியல் அட்டவணைகள்', books: coinCatalogs },
    ],
  },

  sculptures: {
    id: 'sculptures',
    title: 'Ancient Statues',
    tamil: 'சிலைகள்',
    glyph: 'சிற்பம்',
    accent: '#3f6b55',
    description: 'Chola bronzes, Pallava stone carving, temple sculpture, and hero stones.',
    tamilDescription: 'சோழர் செப்புத் திருமேனிகள், பல்லவர் கற்சிற்பங்கள், கோயில் சிற்பங்கள், நடுகற்கள்.',
    galleries: [
      { id: 'statue-gallery', title: 'Chola Bronzes & Pallava Stone', tamil: 'சோழர் செப்புத் திருமேனிகளும் பல்லவர் கற்சிற்பங்களும்', artifacts: artifactsIn('Ancient Statues') },
    ],
    cabinets: [
      { id: 'sculpture-catalogues', title: 'Sculpture Catalogues', tamil: 'சிற்ப அட்டவணைகள்', books: sculptureCatalogs },
    ],
  },

  pottery: {
    id: 'pottery',
    title: 'Ancient Pottery',
    tamil: 'மண்பாண்டங்கள்',
    glyph: 'மட்கலம்',
    accent: '#a5532e',
    description: 'Burial urns from Adichanallur, black-and-red ware, Keezhadi’s red pottery, and the Roman trade wares of Arikamedu — Tamil life told in fired clay.',
    tamilDescription: 'ஆதிச்சநல்லூர் முதுமக்கள் தாழிகள், கருப்பு-சிவப்பு மட்கலங்கள், கீழடிச் சிவப்பு மட்பாண்டங்கள், அரிக்கமேட்டின் உரோமானிய வணிகக் கலங்கள் — சுட்ட மண்ணில் பதிந்த தமிழர் வாழ்வு.',
    galleries: [
      { id: 'pottery-gallery', title: 'Ancient Tamil Pottery', tamil: 'பழந்தமிழர் மட்பாண்டங்கள்', artifacts: artifactsIn('Ancient Pottery') },
    ],
    cabinets: [],
  },

  paintings: {
    id: 'paintings',
    title: 'Ancient Tamil Paintings',
    tamil: 'பழங்கால ஓவியங்கள்',
    glyph: 'ஓவியம்',
    accent: '#8a3a5c',
    description: 'The lotus pool of Sittanavasal, the Pallava goddess of Panamalai, the Chola frescoes and Nayak murals of the Big Temple at Thanjavur, and gilded Tanjore paintings.',
    tamilDescription: 'சித்தன்னவாசலின் தாமரைக் குளம், பனைமலையின் பல்லவர் கால தேவி, தஞ்சைப் பெரிய கோயிலின் சோழர், நாயக்கர் சுவரோவியங்கள், பொன் வேய்ந்த தஞ்சாவூர் ஓவியங்கள்.',
    galleries: [
      { id: 'painting-gallery', title: 'Murals & Tanjore Paintings', tamil: 'சுவரோவியங்களும் தஞ்சாவூர் ஓவியங்களும்', artifacts: artifactsIn('Ancient Tamil Paintings') },
    ],
    cabinets: [],
  },

  epigraphs: {
    id: 'epigraphs',
    title: 'Epigraphs',
    tamil: 'கல்வெட்டுகள்',
    glyph: 'கல்வெட்டு',
    accent: '#4d5a6b',
    description: 'Tamil-Brahmi cave records, Chola temple inscriptions, and royal copper-plate grants.',
    tamilDescription: 'தமிழ்-பிராமி குகைக் கல்வெட்டுகள், சோழர் கோயில் கல்வெட்டுகள், அரசர்களின் செப்பேடுகள்.',
    cabinets: [
      { id: 'epigraph-catalogues', title: 'Inscription Catalogues', tamil: 'கல்வெட்டு அட்டவணைகள்', books: epigraphCatalogs },
    ],
  },

  'rare-books': {
    id: 'rare-books',
    title: 'Rare Books Wing',
    tamil: 'அரிய நூல்கள் பிரிவு',
    glyph: 'ஏடு',
    accent: '#6e1f1a',
    description: 'The complete collection of classical texts: early printed editions from the first printed Kural commentaries, Sangam anthologies, the epics and grammar, and scanned rare volumes — preserved behind glass and open to read.',
    tamilDescription: 'செவ்வியல் நூல்களின் முழுத் தொகுப்பு: திருக்குறளின் முதல் அச்சுப் பதிப்புகள் முதலான தொடக்ககால அச்சு நூல்கள், சங்க இலக்கியத் தொகைகள், காப்பியங்கள், இலக்கண நூல்கள், எண்ணிம அரிய தொகுதிகள் — கண்ணாடிப் பேழைகளில் பாதுகாக்கப்பட்டு, படிக்கத் திறந்திருப்பவை.',
    cabinets: [
      {
        id: 'early-prints',
        title: 'Early Printed Editions',
        tamil: 'முதல் அச்சுப் பதிப்புகள்',
        books: [
          { id: 'kural-virtues-1812', title: 'Tirukkural on Virtues', tamil: 'திருக்குறள் — அறம்', work: 'arathuppal', year: 1812, pdfUrl: pdf('E-Books/1812-_________TIRUKKURAL_ON_VIRTUS.pdf') },
          { id: 'tol-sol-1812', title: 'Tolkappiyam Sol — Nachinarkiniyar', tamil: 'தொல்காப்பியம் சொல் — நச்சினார்க்கினியம்', work: 'tolkappiyamSol', year: 1812, pdfUrl: pdf('E-Books/Thol_sol_Nachinar_1812.pdf') },
          { id: 'edition-1831', title: 'Rare Edition', tamil: 'அரிய பதிப்பு', work: 'earlyPrint', year: 1831, pdfUrl: pdf('E-Books/1831_-_________________-____________________.pdf') },
          { id: 'arathuppal-1840', title: 'Arathuppal', tamil: 'அறத்துப்பால்', work: 'arathuppal', year: 1840, pdfUrl: pdf('E-Books/ARATHUPPAL-1840.pdf') },
          { id: 'mulam-1889', title: 'Mulamum Karuthuraiyum', tamil: 'மூலமும் கருத்துரையும்', work: 'commentaryEdition', year: 1889, pdfUrl: pdf('E-Books/mulamumkaruthuraiyum_1889.pdf') },
          { id: 'sirupan-1909', title: 'Sirupanatrupadai', tamil: 'சிறுபாணாற்றுப்படை', work: 'sirupanatrupadai', year: 1909, pdfUrl: pdf('E-Books/sirupanatrupadai_1909.pdf') },
          { id: 'murugu-1920', title: 'Tirumurugatrupadai', tamil: 'திருமுருகாற்றுப்படை', work: 'thirumurugatrupadai', year: 1920, pdfUrl: pdf('E-Books/tirumugatrupadai_1920.pdf') },
          { id: 'naladiyar-1928', title: 'Naladiyar Moolam', tamil: 'நாலடியார் மூலம்', work: 'naladiyar', year: 1928, pdfUrl: pdf('E-Books/Naladiyar_Moolam_1928.pdf') },
          { id: 'tol-eluthu-1928', title: 'Tolkappiyam Eluthu — Ilampuranam', tamil: 'தொல்காப்பியம் எழுத்து — இளம்பூரணம்', work: 'tolkappiyamEzhuthu', year: 1928, pdfUrl: pdf('E-Books/Thol_Eluthu_ilampuranam_1928.pdf') },
          { id: 'kalithogai-1930', title: 'Kalithogai', tamil: 'கலித்தொகை', work: 'kalithokai', year: 1930, pdfUrl: pdf('E-Books/kalithogai-1930.pdf') },
        ],
      },
      // The two cabinets below were the E-Books Library's, before it became the Manuscripts Library.
      {
        id: 'sangam-anthologies',
        title: 'Sangam Anthologies',
        tamil: 'சங்க இலக்கியம்',
        books: [
          { id: 'akananuru', title: 'Akananuru', tamil: 'அகநானூறு', work: 'akananuru', pdfUrl: pdf('E-Books/Akananuru.pdf') },
          { id: 'purananuru-1968', title: 'Purananuru', tamil: 'புறநானூறு', work: 'purananuru', year: 1968, pdfUrl: pdf('E-Books/purananuru-1968.pdf') },
          { id: 'natrinai-1962', title: 'Natrinai 400', tamil: 'நற்றிணை நானூறு', work: 'natrinai', year: 1962, pdfUrl: pdf('E-Books/Natrinai400_1962.pdf') },
          { id: 'kurunthogai-1965', title: 'Kurunthogai', tamil: 'குறுந்தொகை', work: 'kurunthokai', year: 1965, pdfUrl: pdf('E-Books/Kurunthogai_1965.pdf') },
          { id: 'ainkurunuru', title: 'Ainkurunuru', tamil: 'ஐங்குறுநூறு', work: 'ainkurunuru', pdfUrl: pdf('E-Books/IYN_GURU_NANURU.pdf') },
          { id: 'pathitrupathu-1957', title: 'Pathitrupathu', tamil: 'பதிற்றுப்பத்து', work: 'pathitrupathu', year: 1957, pdfUrl: pdf('E-Books/pathitrupathu__1957.pdf') },
          { id: 'paripadal-1975', title: 'Paripadal', tamil: 'பரிபாடல்', work: 'paripadal', year: 1975, pdfUrl: pdf('E-Books/paripadal_1975.pdf') },
          { id: 'kalithokai-1957', title: 'Kalithokai', tamil: 'கலித்தொகை', work: 'kalithokai', year: 1957, pdfUrl: pdf('E-Books/kalithokai_1957.pdf') },
        ],
      },
      {
        id: 'epics-grammar',
        title: 'Epics & Grammar',
        tamil: 'காப்பியங்களும் இலக்கணமும்',
        books: [
          { id: 'silapathikaram-1957', title: 'Silapathikaram', tamil: 'சிலப்பதிகாரம்', work: 'silapathikaram', year: 1957, pdfUrl: pdf('E-Books/Silapathikaram_1957.pdf') },
          { id: 'manimegalai-1957', title: 'Manimegalai', tamil: 'மணிமேகலை', work: 'manimegalai', year: 1957, pdfUrl: pdf('E-Books/manimegalai_1957.pdf') },
          { id: 'kamban-kavithai', title: 'Kamban Kavithai', tamil: 'கம்பன் கவிதை', work: 'kambar', pdfUrl: pdf('E-Books/kambankavithai.pdf') },
          { id: 'tol-porul-1985', title: 'Tolkappiyam Porul', tamil: 'தொல்காப்பியம் பொருள்', work: 'tolkappiyamPorul', year: 1985, pdfUrl: pdf('E-Books/tholkappiyam_Porul_1985.pdf') },
          { id: 'tol-eluthu-1937', title: 'Tolkappiyam Eluthu', tamil: 'தொல்காப்பியம் எழுத்து', work: 'tolkappiyamEzhuthu', year: 1937, pdfUrl: pdf('E-Books/Tol_Eluthu_1937.pdf') },
          { id: 'sangam-polity-1966', title: 'Sangam Polity', tamil: 'சங்க கால அரசியல்', work: 'sangamPolity', year: 1966, pdfUrl: pdf('E-Books/Sangam_Polaity_1966.pdf') },
        ],
      },
      {
        id: 'rare-archive',
        // Scanned printed volumes (rarepdf/), not palm-leaf manuscripts — those are in the Manuscripts Library.
        title: 'Rare Volumes Archive',
        tamil: 'அரிய தொகுதிகள் பேழை',
        books: [
          { id: 'rare-eluthu', title: 'Eluthu', tamil: 'எழுத்து', work: 'tolkappiyamEzhuthu', pdfUrl: pdf('rarepdf/01-eluthu.pdf') },
          { id: 'rare-sol', title: 'Sol', tamil: 'சொல்', work: 'tolkappiyamSol', pdfUrl: pdf('rarepdf/01 sol.pdf') },
          ...['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(rareVolume),
        ],
      },
    ],
  },

  /*
   * The palm-leaf manuscript repository (formerly the E-Books Library, whose books are now
   * in the Rare Books Wing). Its shelves hold every bundle in public/Manuscripts, tied with
   * rope, which untie into the leaf-by-leaf viewer (`olaiShelves`, manuscripts.js). Its
   * gallery shows photographs from public/Palm-Leaf Manuscripts — empty until some are
   * added; `feature` adds the museum's own palm-leaf reader, the Thirukkural in the Olai Suvadi.
   */
  manuscripts: {
    id: 'manuscripts',
    title: 'Manuscripts Library',
    tamil: 'பனையோலைச் சுவடிகள்',
    glyph: 'ஓலைச்சுவடி',
    accent: '#7a5a1e',
    description: 'Palm-leaf manuscripts — the olai suvadi in which Tamil literature was written and copied for two thousand years: the Sangam anthologies and idylls, the Eighteen Minor Classics, the epics and the grammars, bundle by bundle and leaf by leaf; how they were made, how they were saved from loss, and how they are preserved today.',
    tamilDescription: 'இரண்டாயிரம் ஆண்டுகளாகத் தமிழ் இலக்கியம் எழுதப்பட்டும் படியெடுக்கப்பட்டும் வந்த பனையோலைச் சுவடிகள் — சங்கத் தொகைகளும் பாட்டுகளும், பதினெண் கீழ்க்கணக்கு நூல்களும், காப்பியங்களும் இலக்கணங்களும், கட்டுக் கட்டாக, ஏடு ஏடாக; அவை எவ்வாறு உருவாக்கப்பட்டன, அழிவிலிருந்து எவ்வாறு மீட்கப்பட்டன, இன்று எவ்வாறு பாதுகாக்கப்படுகின்றன.',
    feature: 'olai-suvadi',
    olaiShelves: manuscriptShelves(),
    galleries: [
      { id: 'manuscript-gallery', title: 'Palm-Leaf Manuscripts', tamil: 'பனையோலைச் சுவடிகள்', artifacts: artifactsIn('Palm-Leaf Manuscripts') },
    ].filter((gallery) => gallery.artifacts.length),
    cabinets: [],
  },

  /*
   * Tamil Musical Instruments: an exhibition within the Ancient Artistic Values Wing, its
   * instruments (public/Tamil Instruments) shown in the four families of the Tamil tradition —
   * instruments of hide (தோல்), of breath (துளை), of strings (நரம்பு) and of metal (கஞ்சம்).
   */
  instruments: {
    id: 'instruments',
    title: 'Tamil Musical Instruments',
    tamil: 'தமிழ் இசைக்கருவிகள்',
    glyph: 'இசை',
    accent: '#7a4a8a',
    description: 'The four families of Tamil instruments: hide — the royal murasu, the parai, the thavil, udukkai and pambai; breath — the nadaswaram and the bamboo flute; strings — the yazh of the Sangam bards and the veenai; and metal — the thalam.',
    tamilDescription: 'தமிழ் இசைக்கருவிகளின் நான்கு வகைகள்: தோற்கருவிகள் — அரச முரசு, பறை, தவில், உடுக்கை, பம்பை; துளைக்கருவிகள் — நாதஸ்வரம், புல்லாங்குழல்; நரம்புக்கருவிகள் — சங்கப் பாணர்களின் யாழ், வீணை; கஞ்சக்கருவி — தாளம்.',
    galleries: [
      { id: 'drum-gallery', title: 'Instruments of Hide', tamil: 'தோற்கருவிகள்', artifacts: instruments('Murasu', 'Parai', 'Thavil', 'Udukkai', 'Pambai') },
      { id: 'wind-gallery', title: 'Instruments of Breath', tamil: 'துளைக்கருவிகள்', artifacts: instruments('Nadaswaram', 'Pullanguzhal') },
      { id: 'string-gallery', title: 'Instruments of Strings', tamil: 'நரம்புக்கருவிகள்', artifacts: instruments('Yazh', 'Veenai') },
      { id: 'cymbal-gallery', title: 'Instruments of Metal', tamil: 'கஞ்சக்கருவிகள்', artifacts: instruments('Thalam') },
    ],
    cabinets: [
      {
        id: 'instrument-notes',
        title: 'Curators’ Notes',
        tamil: 'காப்பாளர் குறிப்புகள்',
        books: [
          {
            id: 'tamil-instruments-notes',
            title: 'Tamil Musical Instruments',
            tamil: 'தமிழ் இசைக்கருவிகள்',
            pdfUrl: pdf('Tamil Instruments/tamil instruments.pdf'),
            description: {
              en: 'The museum’s notes on ten Tamil instruments — their history, construction, playing technique and place in Tamil life — with a table comparing them.',
              ta: 'பத்துத் தமிழ் இசைக்கருவிகளின் வரலாறு, அமைப்பு, வாசிப்பு முறை, தமிழர் வாழ்வில் அவற்றின் இடம் பற்றிய காட்சியகக் குறிப்புகள், ஒப்பீட்டு அட்டவணையுடன்.',
            },
          },
        ],
      },
    ],
  },

  /*
   * TN Sarees: an exhibition within the Ancient Artistic Values Wing, a photobook for each of
   * Tamil Nadu's saree traditions on its shelf (sarees.js, from public/TN sarees).
   */
  sarees: {
    id: 'sarees',
    title: 'TN Sarees',
    tamil: 'தமிழகத்தின் பாரம்பரியச் சேலைகள்',
    glyph: 'சேலை',
    accent: '#8a2a4a',
    description: 'The saree traditions of Tamil Nadu — the silks of Kanchipuram, Arani, Thirubuvanam and Salem, the tie-dyed cotton of Madurai Sungudi, Kovai Kora cotton, the bold checks of the Chettinad Kandangi, and the wedding sarees of Koorainadu — each in a photobook.',
    tamilDescription: 'தமிழகத்தின் பாரம்பரியச் சேலைகள் — காஞ்சிபுரம், ஆரணி, திருபுவனம், சேலம் பட்டுகள், மதுரை சுங்குடிப் பருத்தி, கோவை கோரா காட்டன், செட்டிநாட்டுக் கண்டாங்கி, கூரைநாட்டுத் திருமணச் சேலை — ஒவ்வொன்றும் அதன் படத்தொகுப்பில்.',
    galleries: sareeAlbums(),
    shelf: { title: 'Photobooks of the Sarees', tamil: 'சேலைப் படத்தொகுப்புகள்', unit: 'TRADITIONS' },
    cabinets: [
      {
        id: 'saree-notes',
        title: 'Curators’ Notes',
        tamil: 'காப்பாளர் குறிப்புகள்',
        books: [
          {
            id: 'tn-sarees-english',
            title: 'Tamil Nadu Sarees',
            tamil: 'தமிழ்நாட்டுச் சேலைகள் (ஆங்கிலம்)',
            pdfUrl: pdf('TN sarees/TAMIL NADU SAREES.pdf'),
            description: {
              en: 'The museum’s notes on eight saree traditions of Tamil Nadu — where each is woven, how, and when it received Geographical Indication recognition — in English.',
              ta: 'தமிழகத்தின் எட்டுச் சேலை மரபுகள் — ஒவ்வொன்றும் எங்கு, எவ்வாறு நெய்யப்படுகிறது, எப்போது புவிசார் குறியீடு பெற்றது — பற்றிய காட்சியகக் குறிப்புகள், ஆங்கிலத்தில்.',
            },
          },
          {
            id: 'tn-sarees-tamil',
            title: 'Tamil Nadu Sarees (Tamil)',
            tamil: 'தமிழகத்தின் பாரம்பரியச் சேலைகள்',
            pdfUrl: pdf('TN sarees/Tn sarees TAMIL.pdf'),
            description: {
              en: 'The same notes on eight saree traditions of Tamil Nadu, in Tamil.',
              ta: 'தமிழகத்தின் எட்டுச் சேலை மரபுகள் பற்றிய அதே குறிப்புகள், தமிழில்.',
            },
          },
        ],
      },
    ],
  },

  /* Weaving from ancient Tamilakam to today: three photobooks (weaving.js) and the curators' research guide. */
  weaving: {
    id: 'weaving',
    title: 'Weaving Culture',
    tamil: 'நெசவுப் பண்பாடு',
    glyph: 'நெசவு',
    accent: '#5a3a7a',
    description: 'Weaving in Tamil Nadu from ancient times to the present — the cotton, silk, dyes and yarn of ancient Tamil cloth, the five steps from fibre to fabric, and the story of the weavers through the Sangam age, the medieval kingdoms, colonial rule and today.',
    tamilDescription: 'பண்டைக் காலம் முதல் இன்றுவரை தமிழகத்தின் நெசவு — பழந்தமிழ்த் துணியின் பருத்தி, பட்டு, சாயங்கள், நூல்; இழையிலிருந்து துணிவரையிலான ஐந்து படிகள்; சங்க காலம், இடைக்கால அரசுகள், காலனி ஆட்சி, இன்று என நெசவாளர்களின் வரலாறு.',
    galleries: weavingAlbums(),
    shelf: { title: 'Photobooks of Tamil Weaving', tamil: 'நெசவுப் படத்தொகுப்புகள்', unit: 'BOOKS' },
    cabinets: [
      {
        id: 'weaving-notes',
        title: 'Curators’ Notes',
        tamil: 'காப்பாளர் குறிப்புகள்',
        books: [
          {
            id: 'weaving-research-guide',
            title: 'Weaving in Tamil Nadu: A Research Guide',
            tamil: 'தமிழக நெசவு — ஆய்வு வழிகாட்டி',
            pdfUrl: pdf('Weaving culture ancient-present/Tamil_Weaving_Historical_Research_Guide.pdf'),
            description: {
              en: 'The museum’s historical research guide to weaving in Tamil Nadu from ancient times to the present: a timeline, materials and process, the evidence of Sangam texts and archaeology, the medieval, colonial and modern periods, and its sources, in English.',
              ta: 'பண்டைக் காலம் முதல் இன்றுவரையிலான தமிழக நெசவு பற்றிய காட்சியகத்தின் வரலாற்று ஆய்வு வழிகாட்டி: காலவரிசை, மூலப்பொருட்களும் செயல்முறையும், சங்க இலக்கியமும் அகழாய்வும் தரும் சான்றுகள், இடைக்கால, காலனி, நவீன காலங்கள், ஆதார நூல்கள் — ஆங்கிலத்தில்.',
            },
          },
        ],
      },
    ],
  },

  /*
   * The Trade & Ports hall's two rooms. Ancient Ports shelves a photobook for each port and
   * trading centre (ports.js); Maritime Trade & Ports shows the routes, the ports' architecture
   * and the goods they traded (public/Maritime trade n ports).
   */
  'ports-ancient': {
    id: 'ports-ancient',
    title: 'Ancient Ports',
    tamil: 'பண்டைத் துறைமுகங்கள்',
    glyph: 'துறைமுகம்',
    accent: '#2f5f7a',
    description: 'The ports and trading centres of ancient Tamilakam — Puhar and Arikamedu on the east coast, Korkai and Alagankulam in the Pandya country, Muziris and Tyndis in the west, and Uraiyur, Karur and Kodumanal inland — each in a photobook of its excavations.',
    tamilDescription: 'பண்டைத் தமிழகத்தின் துறைமுகங்களும் வணிக மையங்களும் — கிழக்குக் கடற்கரையின் பூம்புகார், அரிக்கமேடு; பாண்டிய நாட்டின் கொற்கை, அழகன்குளம்; மேற்கின் முசிறி, தொண்டி; உள்நாட்டின் உறையூர், கரூர், கொடுமணல் — ஒவ்வொன்றும் அதன் அகழாய்வுப் படத்தொகுப்பில்.',
    galleries: portAlbums(),
    shelf: { title: 'Photobooks of the Excavations', tamil: 'அகழாய்வுப் படத்தொகுப்புகள்', unit: 'SITES' },
    cabinets: [],
  },

  'ports-maritime': {
    id: 'ports-maritime',
    title: 'Maritime Trade & Ports',
    tamil: 'கடல் வணிகமும் துறைமுகங்களும்',
    glyph: 'கடல் வணிகம்',
    accent: '#2a6a6a',
    description: 'The sea routes that joined the Tamil coast to the Red Sea, the Mediterranean and South-East Asia, the architecture of the ports — wharves, wells and brick quays — and the jars, pottery and goods that travelled between them — with Adichanallur, the Iron Age burial ground of the Thamirabarani valley, in stills and film.',
    tamilDescription: 'தமிழ்க் கடற்கரையைச் செங்கடல், மத்தியதரைக் கடல், தென்கிழக்கு ஆசியாவுடன் இணைத்த கடல் வழிகள், துறைமுகங்களின் கட்டடக்கலை — துறைகள், கிணறுகள், செங்கல் மேடைகள் — அவற்றிடையே பயணித்த சாடிகள், மட்கலங்கள், பொருட்கள்; தாமிரபரணிப் பள்ளத்தாக்கின் இரும்புக் காலப் புதைவிடமான ஆதிச்சநல்லூர், படங்களிலும் ஆவணப்படக் காட்சிகளிலும்.',
    galleries: [
      { id: 'maritime-gallery', title: 'Port Architecture & Trade Finds', tamil: 'துறைமுகக் கட்டமைப்புகளும் வணிகச் சான்றுகளும்', artifacts: artifactsIn('Maritime trade n ports') },
      // Stills and film excerpts from the Adichanallur documentary (texts in exhibitionTexts.js).
      {
        id: 'adichanallur-gallery',
        wide: true, // film stills: landscape vitrines
        title: 'Adichanallur — Urn Burials of the Thamirabarani',
        tamil: 'ஆதிச்சநல்லூர் — தாமிரபரணிக் கரையின் முதுமக்கள் தாழிகள்',
        artifacts: inOrder('Maritime trade n ports/Adichanallur', [
          'Excavating the urn burials',
          'Grave goods inside a burial urn',
          'Unearthing a three-foot burial urn',
          'Paddy husk inside a burial urn',
          'Mother-goddess figure on an urn',
          'Iron swords and spearheads',
          'Iron knife and blade',
          'Iron and the urn trenches',
          'Burial urn in the trench',
          'Copper bangles from the habitation site',
          'Excavation trenches in the coconut grove',
          'The Thamirabarani beside the burial ground',
        ]),
      },
    ],
    cabinets: [
      {
        id: 'maritime-guide',
        title: 'Research Guide',
        tamil: 'ஆய்வு வழிகாட்டி',
        books: [
          {
            id: 'maritime-trade-guide',
            title: 'Ancient Tamil Trade and Maritime Ports',
            tamil: 'பண்டைத் தமிழர் வணிகமும் கடல் துறைமுகங்களும்',
            pdfUrl: pdf('Maritime trade n ports/Maritime trade n ports.pdf'),
            description: {
              en: 'The museum’s research guide to ancient Tamil trade: a timeline from early exchange to the medieval port networks, and the history and evidence of nine ports and trading centres, compared in a closing table.',
              ta: 'பண்டைத் தமிழர் வணிகம் பற்றிய காட்சியக ஆய்வு வழிகாட்டி: தொடக்ககாலப் பரிமாற்றம் முதல் இடைக்காலத் துறைமுக வலைகள் வரையிலான காலவரிசை, ஒன்பது துறைமுகங்கள், வணிக மையங்களின் வரலாறும் சான்றுகளும், இறுதியில் ஒப்பீட்டு அட்டவணை.',
            },
          },
        ],
      },
    ],
  },

  /*
   * The Trade & Ports hall's Foods room: the foods and ingredients that travelled — pepper and
   * the spices, sesame oil, palm jaggery, honey and rice (public/Tamil foods). The everyday
   * foods of the home are in the Household room's Tamil Kitchen.
   */
  'trade-foods': {
    id: 'trade-foods',
    title: 'Foods',
    tamil: 'உணவுகள்',
    glyph: 'உணவு',
    accent: '#8a5a1e',
    description: 'The foods that travelled with Tamil trade — black pepper, ginger and turmeric sought across the Indian Ocean, sesame oil, palm jaggery and honey, and the rice that coastal people took in exchange for fish and salt.',
    tamilDescription: 'தமிழர் வணிகத்துடன் பயணித்த உணவுப் பொருட்கள் — இந்தியப் பெருங்கடலெங்கும் தேடப்பட்ட மிளகு, இஞ்சி, மஞ்சள்; நல்லெண்ணெய், பனை வெல்லம், தேன்; மீனுக்கும் உப்புக்கும் ஈடாகக் கடற்கரை மக்கள் பெற்ற அரிசி.',
    galleries: [
      { id: 'trade-food-gallery', title: 'Spices and Traded Foods', tamil: 'மசாலாவும் வணிக உணவுப் பொருட்களும்', artifacts: foods('Tamil foods', ['Spices and Seasonings', 'Sesame and Sesame Oil', 'Palm Products', 'Honey', 'Rice']) },
    ],
    cabinets: [foodNotes('trade-foods')],
  },

  /*
   * The Household & Agriculture hall's rooms: the objects of a Tamil home and the food
   * cooked with them (its Tamil Kitchen gallery, from public/Tamil foods), the engineering
   * that brought water to the fields, and the farming it fed. Each room's curators' notes
   * stand in its glass cabinet.
   */
  household: {
    id: 'household',
    title: 'Household',
    tamil: 'இல்லப் பொருட்கள்',
    glyph: 'இல்லம்',
    accent: '#9a5a2a',
    description: 'The objects of a traditional Tamil home — clay pots and grain jars, the ammi and aattukkal grinding stones, the ural and ulakkai, water pots, oil lamps, mats, fans, cots, baskets and ladles — and the everyday food cooked with them: rice and millets, pulses, koozh, buttermilk and meals on a banana leaf.',
    tamilDescription: 'பாரம்பரியத் தமிழ் இல்லத்தின் பொருட்கள் — மண்பானைகள், தானியக் குடங்கள், அம்மி, ஆட்டுக்கல், உரல், உலக்கை, தண்ணீர்க் குடங்கள், அகல் விளக்குகள், பாய்கள், விசிறிகள், கட்டில்கள், கூடைகள், கரண்டிகள் — அவற்றால் சமைத்த அன்றாட உணவு: அரிசி, சிறுதானியங்கள், பருப்பு, கூழ், மோர், வாழை இலை உணவு.',
    galleries: [
      { id: 'household-gallery', title: 'Objects of a Tamil Home', tamil: 'தமிழ் இல்லத்தின் பொருட்கள்', artifacts: householdObjects() },
      { id: 'household-food-gallery', title: 'The Tamil Kitchen', tamil: 'தமிழர் சமையலறை', artifacts: foods('Tamil foods', ['Rice', 'Millets', 'Lentils and Pulses', 'Porridge', 'Traditional Beverages', 'Banana-Leaf Meals']) },
    ],
    cabinets: [
      {
        id: 'household-notes',
        title: 'Curators’ Notes',
        tamil: 'காப்பாளர் குறிப்புகள்',
        books: [
          {
            id: 'household-objects-notes',
            title: 'Ancient Tamil Household Objects',
            tamil: 'பண்டைய தமிழர்களின் இல்லப் பயன்பாட்டுப் பொருட்கள்',
            pdfUrl: pdf('Household/tamil household obj- eng n tamil.pdf'),
            description: {
              en: 'The museum’s notes on twelve objects of the traditional Tamil home, with the illustrated poster, in English and Tamil.',
              ta: 'பாரம்பரியத் தமிழ் இல்லத்தின் பன்னிரண்டு பொருட்கள் பற்றிய காட்சியகக் குறிப்புகள், விளக்கப்படத்துடன், ஆங்கிலத்திலும் தமிழிலும்.',
            },
          },
        ],
      },
      foodNotes('household'),
    ],
  },

  irrigation: {
    id: 'irrigation',
    title: 'Irrigation',
    tamil: 'நீர்ப்பாசனம்',
    glyph: 'நீர்',
    accent: '#2a6a8a',
    description: 'Ancient Tamil water engineering, from river to field: the Kallanai on the Kaveri, the village eri tanks and the sluices that released their water, the etram that lifted it, and the linked tanks of the Noyyal.',
    tamilDescription: 'ஆற்றிலிருந்து வயல்வரை — பண்டைய தமிழர்களின் நீர்ப்பாசனப் பொறியியல்: காவிரியின் கல்லணை, ஊர் ஏரிகள், அவற்றின் நீரை வெளியேற்றிய மடைகள், நீரை உயர்த்திய ஏற்றம், நொய்யலின் இணைந்த ஏரிகள்.',
    galleries: [
      { id: 'irrigation-gallery', title: 'From River to Field', tamil: 'ஆற்றிலிருந்து வயல்வரை', artifacts: inOrder('Irrigation/Ancient tamil irrigation', ['Kallanai', 'Eri System', 'Kalingu, Madagu and Kumizhi', 'Etram and Picottah', 'The Noyyal River Tank Network']) },
      // Stills and film excerpts from the Kallanai documentary (texts in exhibitionTexts.js).
      {
        id: 'kallanai-gallery',
        wide: true, // film stills: landscape vitrines
        title: 'Kallanai — The Grand Anicut of Karikala Chola',
        tamil: 'கல்லணை — கரிகால் சோழனின் பேரணை',
        artifacts: inOrder('Irrigation/Kallanai', [
          'How Kallanai was built',
          'Elephants hauling boulders to the riverbed',
          'Boulders heaped on the riverbed',
          'Clay and silt binding the boulders',
          'The Grand Anicut across the Kaveri',
          'The arches of the Grand Anicut',
          'The shutters of the anicut',
          'The Kaveri rushing through the vents',
          'Water spilling over the Grand Anicut',
          'The Kaveri in flood at the anicut',
          'Kallanai in full flow',
          'Karikal Chozhan Manimandapam',
        ]),
      },
    ],
    cabinets: [
      {
        id: 'irrigation-notes',
        title: 'Curators’ Notes',
        tamil: 'காப்பாளர் குறிப்புகள்',
        books: [
          {
            id: 'irrigation-english',
            title: 'Ancient Tamil Irrigation',
            tamil: 'பண்டைய தமிழர் நீர்ப்பாசனம் (ஆங்கிலம்)',
            pdfUrl: pdf('Irrigation/IRRIGATION ENG.pdf'),
            description: {
              en: 'The museum’s notes on five Tamil irrigation systems, from the Kallanai to the Noyyal tank network, in English.',
              ta: 'கல்லணை முதல் நொய்யல் ஏரி வலையமைப்பு வரை ஐந்து தமிழர் நீர்ப்பாசன அமைப்புகள் பற்றிய காட்சியகக் குறிப்புகள், ஆங்கிலத்தில்.',
            },
          },
          {
            id: 'irrigation-tamil',
            title: 'Ancient Tamil Irrigation (Tamil)',
            tamil: 'பண்டைய தமிழர்களின் நீர்ப்பாசனத் தொழில்நுட்பங்கள்',
            pdfUrl: pdf('Irrigation/IRRIGATION TAMIL.pdf'),
            description: {
              en: 'The same notes on Tamil irrigation systems, in Tamil.',
              ta: 'தமிழர் நீர்ப்பாசன அமைப்புகள் பற்றிய அதே குறிப்புகள், தமிழில்.',
            },
          },
        ],
      },
    ],
  },

  agriculture: {
    id: 'agriculture',
    title: 'Tamil Agriculture',
    tamil: 'தமிழர் வேளாண்மை',
    glyph: 'வேளாண்மை',
    accent: '#5a7a2a',
    description: 'Farming in the Tamil land, from the Marutham fields of Sangam poetry to today — the plough, the paddy from nursery to harvest, millets for the drier lands, and the water that made it all possible.',
    tamilDescription: 'சங்கக் கவிதையின் மருத வயல்கள் முதல் இன்றுவரை தமிழ் நிலத்தின் வேளாண்மை — ஏர், நாற்றங்கால் முதல் அறுவடை வரை நெல், வறண்ட நிலங்களின் சிறுதானியங்கள், இவை அனைத்தையும் சாத்தியமாக்கிய நீர்.',
    galleries: [
      { id: 'agriculture-gallery', title: 'Fields and Seasons', tamil: 'வயல்களும் பருவங்களும்', artifacts: inOrder('Tamil Agriculture', ['Traditional Plough', 'Rice Seedlings', 'Paddy Transplantation', 'Traditional Paddy Harvesting', 'Millet Cultivation', 'Kallanai']) },
    ],
    cabinets: [
      {
        id: 'agriculture-notes',
        title: 'Curators’ Notes',
        tamil: 'காப்பாளர் குறிப்புகள்',
        books: [
          {
            id: 'agriculture-english',
            title: 'Agriculture in Tamil Nadu',
            tamil: 'தமிழகத்தின் வேளாண்மை மரபு (ஆங்கிலம்)',
            pdfUrl: pdf('Tamil Agriculture/Agriculture TN ENG.pdf'),
            description: {
              en: 'The museum’s notes on Tamil agriculture, from the Sangam age to today, in English.',
              ta: 'சங்க காலம் முதல் இன்றுவரை தமிழர் வேளாண்மை பற்றிய காட்சியகக் குறிப்புகள், ஆங்கிலத்தில்.',
            },
          },
          {
            id: 'agriculture-tamil',
            title: 'Agriculture in Tamil Nadu (Tamil)',
            tamil: 'தமிழகத்தின் வேளாண்மை மரபு',
            pdfUrl: pdf('Tamil Agriculture/Agriculture TN tamil.pdf'),
            description: {
              en: 'The same notes on Tamil agriculture, in Tamil.',
              ta: 'தமிழர் வேளாண்மை பற்றிய அதே குறிப்புகள், தமிழில்.',
            },
          },
        ],
      },
    ],
  },

  /*
   * The Ainthinai hall's three rooms: the five landscapes of Tamil poetics, the native foods
   * of each (public/5 lanscapes food), and the palm-leaf bundles of the works arranged by
   * landscape (manuscripts.js).
   */
  'ainthinai-landscapes': {
    id: 'ainthinai-landscapes',
    title: 'The Five Landscapes',
    tamil: 'ஐந்திணை நிலங்கள்',
    glyph: 'திணை',
    accent: '#4f7a3a',
    description: 'Kurinji, Mullai, Marutham, Neithal and Palai — the mountains, forests, fields, shore and parched land of Tamil poetics, each with its season and hour, its gods, flowers and people, and the mood of love it carries.',
    tamilDescription: 'குறிஞ்சி, முல்லை, மருதம், நெய்தல், பாலை — தமிழ் இலக்கணத்தின் மலை, காடு, வயல், கடல், சுரம்; ஒவ்வொன்றுக்கும் அதன் பருவமும் பொழுதும், தெய்வமும் பூவும் மக்களும், அது சுட்டும் காதல் நிலையும்.',
    cabinets: [
      {
        id: 'tinai-books',
        title: 'Poems of the Five Landscapes',
        tamil: 'ஐந்திணைப் பாடல்கள்',
        books: [
          sangamGuide,
          { id: 'tinai-ainguru', title: 'Ainkurunuru', tamil: 'ஐங்குறுநூறு', work: 'ainkurunuru', edition: 'cict', pdfUrl: pdf('E-Books/AINGURU-CICT__1_.pdf') },
          { id: 'tinai-kuru', title: 'Kurunthokai', tamil: 'குறுந்தொகை', work: 'kurunthokai', edition: 'cict', pdfUrl: pdf('E-Books/KURU-CICT__1_.pdf') },
          { id: 'tinai-natri', title: 'Natrinai', tamil: 'நற்றிணை', work: 'natrinai', edition: 'cict', pdfUrl: pdf('E-Books/NATRI-CICT__1_.pdf') },
          { id: 'tinai-kali', title: 'Kalithokai', tamil: 'கலித்தொகை', work: 'kalithokai', edition: 'cict', pdfUrl: pdf('E-Books/KALI-CICT.pdf') },
          { id: 'tinai-akan', title: 'Akananuru', tamil: 'அகநானூறு', work: 'akananuru', edition: 'cict', pdfUrl: pdf('E-Books/AKAN-CICT__1_.pdf') },
          { id: 'tinai-tol-porul', title: 'Tolkappiyam Porul', tamil: 'தொல்காப்பியம் பொருள்', work: 'tolkappiyamPorul', year: 1985, pdfUrl: pdf('E-Books/tholkappiyam_Porul_1985.pdf') },
          { id: 'tinai-tol-porul-ilampuranam', title: 'Tolkappiyam Porul — Ilampuranam', tamil: 'தொல்காப்பியம் பொருள் — இளம்பூரணம்', work: 'tolkappiyamPorul', pdfUrl: pdf('E-Books/thol_porul_ilampuranam.pdf') },
          { id: 'tinai-natri-1962', title: 'Natrinai 400', tamil: 'நற்றிணை நானூறு', work: 'natrinai', year: 1962, pdfUrl: pdf('E-Books/Natrinai400_1962.pdf') },
          { id: 'tinai-kuru-1957', title: 'Kurunthokai', tamil: 'குறுந்தொகை', work: 'kurunthokai', year: 1957, pdfUrl: pdf('E-Books/kurunthokai_1957.pdf') },
          { id: 'tinai-kali-1930', title: 'Kalithogai', tamil: 'கலித்தொகை', work: 'kalithokai', year: 1930, pdfUrl: pdf('E-Books/kalithogai-1930.pdf') },
          { id: 'tinai-akan-old', title: 'Akananuru', tamil: 'அகநானூறு', work: 'akananuru', pdfUrl: pdf('E-Books/Akananuru.pdf') },
        ],
      },
      {
        // `tinai`: the landscape a work belongs to, so its glass case can offer it.
        id: 'tinai-by-landscape',
        title: 'Landscape by Landscape',
        tamil: 'திணை வழி நூல்கள்',
        books: [
          { id: 'tinai-kurinjippattu', title: 'Kurinjippattu', tamil: 'குறிஞ்சிப்பாட்டு', work: 'kurinjippattu', edition: 'cict', tinai: 'Kurinji', pdfUrl: pdf('E-Books/KURUNJI-CICT.pdf') },
          { id: 'tinai-mullaippattu', title: 'Mullaippattu', tamil: 'முல்லைப்பாட்டு', work: 'mullaippattu', edition: 'cict', tinai: 'Mullai', pdfUrl: pdf('E-Books/MULLAI-CICT__1_.pdf') },
          { id: 'tinai-pattinappalai', title: 'Pattinappalai', tamil: 'பட்டினப்பாலை', work: 'pattinappalai', edition: 'cict', tinai: 'Palai', pdfUrl: pdf('E-Books/PATTINA-CICT__1_.pdf') },
          { id: 'tinai-aintinai-70', title: 'Aintinai Ezhupathu', tamil: 'ஐந்திணை எழுபது', work: 'aintinaiEzhupathu', edition: 'cict', pdfUrl: pdf('E-Books/AINTINAI70-CICT__1_.pdf') },
          { id: 'tinai-tinaimozhi-50', title: 'Tinaimozhi Aimpathu', tamil: 'திணைமொழி ஐம்பது', work: 'tinaimozhiAimpathu', edition: 'cict', pdfUrl: pdf('E-Books/TINAIMOZHI50-CICT__1_.pdf') },
          { id: 'tinai-tinaimalai-150', title: 'Tinaimalai Nurraimpathu', tamil: 'திணைமாலை நூற்றைம்பது', work: 'tinaimalaiNurraimpathu', edition: 'cict', pdfUrl: pdf('E-Books/TINAIMALAI150-CICT.pdf') },
        ],
      },
      landscapeFoodNotes,
    ],
    // The room is a 3D gallery (ainthinai/AinthinaiRoom3D.jsx): bookcases of these cabinets,
    // the five landscapes in glass cases, and the photographs framed on the far wall.
    immersive: 'ainthinai',
    galleries: [
      { id: 'tinai-panels', title: 'The Five Landscapes', tamil: 'ஐந்திணை நிலக்காட்சிகள்', artifacts: foods('5 lanscapes food', LANDSCAPE_ORDER) },
    ],
  },

  'ainthinai-foods': {
    id: 'ainthinai-foods',
    title: 'Native Foods of the Five Landscapes',
    tamil: 'ஐவகை நிலங்களின் உணவுகள்',
    glyph: 'உணவு',
    accent: '#7a6a1e',
    description: 'What each landscape gave its people to eat: millet, honey and wild fruit in the Kurinji hills, milk, curd and buttermilk in the Mullai pastures, rice and pulses in the Marutham fields, fish, dried fish and salt on the Neithal shore, and the carried provisions of the dry Palai roads.',
    tamilDescription: 'ஒவ்வொரு நிலமும் தன் மக்களுக்குத் தந்த உணவு: குறிஞ்சி மலையில் தினை, தேன், காட்டுப் பழங்கள்; முல்லை மேய்ச்சல் நிலத்தில் பால், தயிர், மோர்; மருத வயலில் அரிசி, பருப்பு; நெய்தல் கடற்கரையில் மீன், கருவாடு, உப்பு; பாலையின் வறண்ட வழிகளில் எடுத்துச் சென்ற உணவுகள்.',
    galleries: [
      { id: 'landscape-food-gallery', title: 'The Five Landscapes at Table', tamil: 'ஐந்திணை உணவுகள்', artifacts: foods('5 lanscapes food', LANDSCAPE_ORDER) },
    ],
    cabinets: [landscapeFoodNotes],
  },

  'ainthinai-manuscripts': {
    id: 'ainthinai-manuscripts',
    title: 'Thinai on Palm Leaves',
    tamil: 'ஓலையில் திணைப் பாடல்கள்',
    glyph: 'ஏடு',
    accent: '#7a5a1e',
    description: 'The works that arrange their verses landscape by landscape — Ainkurunuru, Aintinai Aimpathu and Ezhupathu, Tinaimozhi Aimpathu, Tinaimalai Nurraimpathu and Kainnilai — in the palm-leaf bundles in which they were copied.',
    tamilDescription: 'தம் பாடல்களைத் திணை திணையாக அமைக்கும் நூல்கள் — ஐங்குறுநூறு, ஐந்திணை ஐம்பது, ஐந்திணை எழுபது, திணைமொழி ஐம்பது, திணைமாலை நூற்றைம்பது, கைந்நிலை — அவை படியெடுக்கப்பட்ட ஓலைச்சுவடிகளில்.',
    olaiShelves: tinaiShelves(),
    cabinets: [],
  },

  shrine: {
    id: 'shrine',
    title: 'Thiruvalluvar Shrine',
    tamil: 'திருவள்ளுவர் திருத்தலம்',
    glyph: 'குறள்',
    accent: '#8a2a1e',
    description: 'Editions and translations of the Tirukkural gathered in the shrine of the poet-sage.',
    tamilDescription: 'புலவர் பெருமான் திருவள்ளுவரின் திருத்தலத்தில் தொகுக்கப்பட்ட திருக்குறள் பதிப்புகளும் மொழிபெயர்ப்புகளும்.',
    cabinets: [
      {
        id: 'kural-editions',
        title: 'Tirukkural Editions',
        tamil: 'திருக்குறள் பதிப்புகள்',
        books: [
          { id: 'kural-english-1982', title: 'Thirukkural with English Couplets', tamil: 'திருக்குறள் — ஆங்கில மொழிபெயர்ப்புடன்', work: 'tirukkural', year: 1982, pdfUrl: pdf('E-Books/thirukkural__with_english_couplets_1982.pdf') },
          { id: 'kamathuppal', title: 'Tirukkural — Kamathuppal', tamil: 'காமத்துப்பால்', work: 'kamathuppal', pdfUrl: pdf('E-Books/33_-_TIRUKKURAL_KAMATHUPPAL.pdf') },
          { id: 'arathuppal-1840-shrine', title: 'Arathuppal', tamil: 'அறத்துப்பால்', work: 'arathuppal', year: 1840, pdfUrl: pdf('E-Books/ARATHUPPAL-1840.pdf') },
          { id: '108-gems', title: '108 Gems', tamil: '108 மணிகள்', work: 'kuralSelection', pdfUrl: pdf('E-Books/108_GEMS.pdf') },
        ],
      },
      {
        // TODO: confirm these language volumes are Tirukkural translations before launch.
        id: 'kural-translations',
        title: 'Translations',
        tamil: 'மொழிபெயர்ப்புகள்',
        books: [
          { id: 'hindi-1967', title: 'Hindi Tirukkural', tamil: 'இந்தித் திருக்குறள்', work: 'kuralTranslation', year: 1967, pdfUrl: pdf('E-Books/Hindi_Tirukural_1967n.pdf') },
          { id: 'chinese-1967', title: 'Chinese Edition', tamil: 'சீன மொழிப் பதிப்பு', work: 'kuralTranslation', year: 1967, pdfUrl: pdf('E-Books/Chinese_1967.pdf') },
          { id: 'bengali', title: 'Bengali Edition', tamil: 'வங்க மொழிப் பதிப்பு', work: 'kuralTranslation', pdfUrl: pdf('E-Books/BENGALI.pdf') },
          { id: 'burmese', title: 'Burmese Edition', tamil: 'பர்மிய மொழிப் பதிப்பு', work: 'kuralTranslation', pdfUrl: pdf('E-Books/BURMESE.pdf') },
          { id: 'gujarati', title: 'Gujarati Edition', tamil: 'குஜராத்தி மொழிப் பதிப்பு', work: 'kuralTranslation', pdfUrl: pdf('E-Books/GUJARATI.pdf') },
          { id: 'telugu', title: 'Telugu Edition', tamil: 'தெலுங்கு மொழிப் பதிப்பு', work: 'kuralTranslation', pdfUrl: pdf('E-Books/TELUGU.pdf') },
        ],
      },
    ],
  },

  /*
   * The Historical Figures hall's three rooms: portraits in display cases, captioned from
   * historicalFigures.js, with the curators' notes on each figure in the cabinets.
   */
  'figures-patrons': {
    id: 'figures-patrons',
    title: 'The Seven Great Patrons',
    tamil: 'கடையெழு வள்ளல்கள்',
    glyph: 'வள்ளல்கள்',
    accent: '#8a5a1e',
    description: 'Pari, Pegan, Kari, Ay Andiran, Adhiyaman, Nalli and Ori — the chieftains of the Sangam age whom Tamil tradition remembers above all for their generosity.',
    tamilDescription: 'பாரி, பேகன், காரி, ஆய் அண்டிரன், அதியமான், நள்ளி, ஓரி — கொடைக்காகத் தமிழ் மரபு தலைசிறந்தவர்களாகப் போற்றும் சங்க காலச் சிற்றரசர்கள்.',
    galleries: [{ id: 'patrons-gallery', title: 'Portraits of the Patrons', tamil: 'வள்ளல்களின் உருவப்படங்கள்', artifacts: inOrder(PATRONS_FOLDER, PATRON_ORDER) }],
    cabinets: [{ id: 'patrons-notes', title: 'Curators’ Notes', tamil: 'காப்பாளர் குறிப்புகள்', books: notesPair('patrons-notes', 'The Seven Great Patrons', 'கடையெழு வள்ளல்கள்', `${PATRONS_FOLDER}/7 GREAT PATRONS ENG.pdf`, `${PATRONS_FOLDER}/7 GREAT PATRONS TAMIL.pdf`, 'the Seven Great Patrons of Tamil tradition') }],
  },

  'figures-poets': {
    id: 'figures-poets',
    title: 'Poets & Thinkers',
    tamil: 'புலவர்களும் சிந்தனையாளர்களும்',
    glyph: 'புலவர்',
    accent: '#6a2a4a',
    description: 'Tholkappiyar, Thiruvalluvar, Avvaiyar, Kapilar, Kaniyan Pungundranar, Nakkirar, Ilango Adigal and Appar — the grammarian, poets and saints whose words shaped Tamil thought.',
    tamilDescription: 'தொல்காப்பியர், திருவள்ளுவர், ஔவையார், கபிலர், கணியன் பூங்குன்றனார், நக்கீரர், இளங்கோவடிகள், அப்பர் — தமிழ்ச் சிந்தனையை வடிவமைத்த இலக்கணத்தார், புலவர்கள், அருளாளர்கள்.',
    galleries: [{ id: 'poets-gallery', title: 'Portraits of the Poets', tamil: 'புலவர்களின் உருவப்படங்கள்', artifacts: inOrder(POETS_FOLDER, POET_ORDER) }],
    cabinets: [{ id: 'poets-notes', title: 'Curators’ Notes', tamil: 'காப்பாளர் குறிப்புகள்', books: notesPair('poets-notes', 'Poets and Thinkers', 'புலவர்களும் சிந்தனையாளர்களும்', 'Tamizh Poets n Thinkers/Poets n Thinkers - ENG.pdf', 'Tamizh Poets n Thinkers/Poets n Thinkers - TAMIL.pdf', 'the poets and thinkers of the Tamil tradition') }],
  },

  'figures-kings': {
    id: 'figures-kings',
    title: 'Kings & Queens',
    tamil: 'தமிழ் மன்னர்களும் அரசியரும்',
    glyph: 'மன்னர்',
    accent: '#7a1e1e',
    description: 'Vel Pari and Karikala Cholan of the Sangam age, Kannagi of the epic, and the medieval Cholas Sembiyan Mahadevi, Rajaraja I and Rajendra I.',
    tamilDescription: 'சங்க காலத்தின் வேள் பாரியும் கரிகால் சோழனும், காப்பியத் தலைவி கண்ணகி, இடைக்காலச் சோழர்களான செம்பியன் மாதேவி, முதலாம் இராஜராஜன், முதலாம் இராஜேந்திரன்.',
    galleries: [{ id: 'kings-gallery', title: 'Portraits of the Rulers', tamil: 'ஆட்சியாளர்களின் உருவப்படங்கள்', artifacts: kingPortraits() }],
    cabinets: [{
      id: 'kings-notes',
      title: 'Curators’ Notes',
      tamil: 'காப்பாளர் குறிப்புகள்',
      books: KINGS.flatMap(({ folder, name, tamil, notes: [english, tamilPdf] }) =>
        notesPair(`kings-${folder.toLowerCase().replace(/\s+/g, '-')}`, name, tamil, `${KINGS_FOLDER}/${folder}/${english}`, `${KINGS_FOLDER}/${folder}/${tamilPdf}`, name)),
    }],
  },

  /* The Then vs Now hall's rooms: one place each (thenAndNow.js). */
  ...Object.fromEntries(THEN_NOW_PLACES.map((place) => [placeRoomId(place), placeRoom(place)])),
};

/** A room as visitors see it: its default content with the admin portal's edits applied (src/siteData). */
export const getRoom = (roomId) => applyToRoom(roomBooks[roomId] ?? null);

/** What a room holds, for its labels: "13 objects", "12 volumes", "42 bundles", or "24 objects · 6 volumes". */
export function collectionSummary(room, lang = getLang()) {
  const say = (en, ta, hi) => tri(en, ta, hi, lang);
  if (room.passage) return say('Walk the corridor', 'நடைவழியில் செல்க', 'गलियारे से चलें');
  const objects = (room.galleries ?? []).reduce((total, gallery) => total + gallery.artifacts.length, 0);
  const bundles = (room.olaiShelves ?? []).reduce((total, shelf) => total + shelf.bundles.length, 0);
  const volumes = room.cabinets.reduce((total, cabinet) => total + cabinet.books.length, 0);
  return [
    objects && say(`${objects} objects`, `${objects} பொருள்கள்`, `${objects} वस्तुएँ`),
    bundles && say(`${bundles} bundles`, `${bundles} சுவடிக் கட்டுகள்`, `${bundles} पोथियाँ`),
    volumes && say(`${volumes} volumes`, `${volumes} நூல்கள்`, `${volumes} ग्रंथ`),
  ].filter(Boolean).join(' · ') || say('Now open', 'இப்போது திறந்துள்ளது', 'अब खुला है');
}

/*
 * The museum is a pentagonal wheel: the Central Hall, where the visitor starts, stands at the
 * centre — an open hub with no exhibits of its own, a corridor on each of its five walls — and
 * the five exhibition halls stand round it at the points of a pentagon, each joined to the hub
 * and to the halls either side of it, so the five form a closed ring —
 *
 *                           Literature
 *                         ╱     │      ╲
 *               Ainthinai ──────┼────── Ancient Artistic Values
 *                    │    ╲     │     ╱    │
 *                    │      Central Hall   │
 *                    │    ╱           ╲    │
 *     Household & Agriculture ─────────── Trade & Ports
 *
 * Every corridor is straight and the same length (hallLayout.js). For a pentagon of equal
 * corridors to close, a ring hall's corridors to its neighbours must leave 54° either side of
 * its corridor to the hub, so the ring halls are twenty-sided (arches 18° apart: index 0 to
 * the hub, 3 and 17 to the neighbours, counter-clockwise first) and larger than the hub
 * (ringApothem). Their other arches are wall displays: each room is a framed panel set flat
 * in its gilt arch, evenly spaced round the far side of the hall, and the arches between are
 * bas-relief plaques (`~`). Arriving from the hub, the visitor faces the arch opposite (10).
 * The entrance view looks past the CICT monolith (centralHall.js) down the corridor to the
 * Literature Hall. Centrepieces: the monolith in the Central Hall, the Thiruvalluvar statue in
 * the Literature Hall, a 3D model on a stone pedestal in the halls listed in hallExhibits.js
 * (Tolkappiar, the Yaazh, the ship, the paddy field, Raja Raja Chozhan), and a great brass
 * Nilavilakku elsewhere.
 *
 * Two more halls stand outside the ring, each one corridor beyond a ring hall, so the hub keeps
 * its five open corridors and nothing else (a seven-sided hub could not close the ring with
 * corridors of one length) and the museum has seven exhibition halls in all:
 *
 *     Literature ──── Historical Figures
 *     Trade & Ports ── Tamil Nadu: Then & Now
 *
 * A ring hall's corridor outwards takes one of the evenly spaced arches its rooms hang in,
 * as if it were one more room ('>hall' in its list of rooms): the Literature Hall's leads
 * north-north-west to Historical Figures, Trade & Ports' south-south-east to Then & Now.
 * The outer halls are the hub's size: a corridor back, and their rooms round the far walls.
 */
const HALLS = {
  central: { title: 'Central Hall', tamil: 'மையக் கூடம்', glyph: 'மையம்', accent: '#8a5a2b' },
  literature: { title: 'Literature Hall', tamil: 'இலக்கியக் கூடம்', glyph: 'இலக்கியம்', accent: '#9b3a22' },
  trade: { title: 'Trade & Ports', tamil: 'வணிகமும் துறைமுகங்களும்', glyph: 'துறைமுகம்', accent: '#2f6a7a' },
  artistic: { title: 'Ancient Artistic Values Wing', tamil: 'பண்டைய கலை மரபுப் பிரிவு', glyph: 'கலை மரபு', accent: '#b0782c' },
  household: { title: 'Household & Agriculture', tamil: 'இல்லமும் வேளாண்மையும்', glyph: 'இல்லம்', accent: '#6a7a2a' },
  ainthinai: { title: 'Ainthinai', tamil: 'ஐந்திணைக் கூடம்', glyph: 'ஐந்திணை', accent: '#4f7a3a' },
  'historical-figures': { title: 'Historical Figures', tamil: 'வரலாற்று ஆளுமைகள்', glyph: 'ஆளுமைகள்', accent: '#7a3a5a' },
  'tn-then-vs-now': { title: 'Tamil Nadu: Then & Now', tamil: 'தமிழ்நாடு: அன்றும் இன்றும்', glyph: 'அன்றும் இன்றும்', accent: '#2e3a6a' },
};

/** The arch of a hall's corridor to `hall`, a wing with `passage` naming the hall it leads to. */
const corridorTo = (hall) => {
  const { title, tamil, glyph, accent } = HALLS[hall];
  return { id: `corridor-to-${hall}`, passage: hall, title, tamil, glyph, accent };
};
/** A decorative arch: a bas-relief plaque set flat in it (no room, nothing to enter). */
const alcove = (hall, index) => ({ id: `alcove-${hall}-${index}`, alcove: true, title: '', tamil: '', glyph: '' });
/** Wings: '>hall' is the corridor to that hall, '~' a relief plaque, anything else a room shown as a wall display. */
const hall = (id, details, wings) => ({
  id,
  ...HALLS[id],
  ...details,
  wings: wings.map((wing, index) => {
    if (wing === '~') return alcove(id, index);
    return wing.startsWith('>') ? corridorTo(wing.slice(1)) : roomBooks[wing] ?? null;
  }),
});

/** A ring hall's arches: 20, see above. */
const RING_SIDES = 20;
/** Where a ring hall's rooms (and any corridor outwards) hang, by how many: evenly spaced, symmetric about the arch opposite the hub. */
const ROOM_ARCHES = { 3: [7, 10, 13], 4: [7, 9, 11, 13], 5: [6, 8, 10, 12, 14], 6: [5, 7, 9, 11, 13, 15], 7: [4, 6, 8, 10, 12, 14, 16] };
/** A ring hall: its corridors to the hub and its two neighbours, its rooms (and corridor outwards, '>hall'), and relief plaques in the arches between. */
const ringHall = (id, details, [before, after], rooms) => {
  const wings = Array.from({ length: RING_SIDES }, () => '~');
  wings[0] = '>central';
  wings[3] = `>${before}`;
  wings[RING_SIDES - 3] = `>${after}`;
  ROOM_ARCHES[rooms.length].forEach((arch, i) => { wings[arch] = rooms[i]; });
  return hall(id, { ...details, apothem: ringApothem(5) }, wings);
};

/**
 * A hall outside the ring, at the end of one corridor from ring hall `from`: `sides` walls,
 * the corridor back on the first, its rooms on the arches `roomArches` (round the far side,
 * facing the visitor as they arrive), and relief plaques on the rest.
 */
const outerHall = (id, details, from, sides, roomArches, rooms) => {
  const wings = Array.from({ length: sides }, () => '~');
  wings[0] = `>${from}`;
  roomArches.forEach((arch, i) => { wings[arch] = rooms[i]; });
  return hall(id, details, wings);
};

export const hallways = {
  central: hall('central', { subtitle: 'The Heart of the Museum', centrepiece: 'monolith' }, ['>literature', '>artistic', '>trade', '>household', '>ainthinai']),
  literature: ringHall('literature', { subtitle: 'Sangam Poetry, Rare Books, Palm Leaves and Inscriptions', centrepiece: 'statue' }, ['ainthinai', 'artistic'], ['sangam', 'rare-books', '>historical-figures', 'manuscripts', 'epigraphs', 'shrine']),
  artistic: ringHall('artistic', { subtitle: 'Ancient Artistic Values & Material Heritage', centrepiece: 'yaazh' }, ['literature', 'trade'], ['sculptures', 'pottery', 'coins', 'instruments', 'sarees', 'paintings', 'weaving']),
  trade: ringHall('trade', { subtitle: 'Ancient Tamil Trade & Maritime Ports', centrepiece: 'ancient-tamil-ship' }, ['artistic', 'household'], ['ports-ancient', 'trade-foods', '>tn-then-vs-now', 'ports-maritime']),
  household: ringHall('household', { subtitle: 'The Tamil Home and the Fields', centrepiece: 'paddy-fields' }, ['trade', 'ainthinai'], ['household', 'irrigation', 'agriculture']),
  ainthinai: ringHall('ainthinai', { subtitle: 'The Five Landscapes — Land, Love and Food', centrepiece: 'lamp' }, ['household', 'literature'], ['ainthinai-foods', 'ainthinai-manuscripts', 'ainthinai-landscapes']),
  'historical-figures': outerHall('historical-figures', { subtitle: 'Patrons, Poets and Thinkers, Kings and Queens', centrepiece: 'tolkappiar' }, 'literature', 8, [3, 4, 5], ['figures-patrons', 'figures-poets', 'figures-kings']),
  'tn-then-vs-now': outerHall('tn-then-vs-now', { subtitle: 'Historic Places of Tamil Nadu Across Time', centrepiece: 'raja-raja-chozhan' }, 'trade', 12, [2, 3, 4, 5, 7, 8, 9, 10], THEN_NOW_PLACES.map(placeRoomId)),
};
/** The hall a room stands in (its id), e.g. so the hallway can show it after a visit. */
export const hallOf = (roomId) => Object.values(hallways).find((hall) => hall.wings.some((wing) => wing.id === roomId))?.id ?? 'literature';
