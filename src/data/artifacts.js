import manifest from 'virtual:museum-artifacts';
import recordings from 'virtual:museum-audio';
import films from 'virtual:museum-videos';
import { ARTIFACT_TEXTS } from './exhibitionTexts.js';
import { mediaUrl } from '../mediaUrl.js';
import { generatedNarration } from '../narration/generated.js';

/**
 * The artefact photographs in the public folder's collection folders (listed at build
 * time by the `museum-manifests` plugin in vite.config.js), as display-case entries.
 *
 * File names carry the captions — "Bulbous funerary urn — Adichanallur.jpeg",
 * "Buddha offering protection- Chola period.jpeg" — so each photo is labelled with its
 * object and, after the dash, its site or period. Each also gets its Tamil title and a
 * Tamil and English description from exhibitionTexts.js; a photo added without one falls
 * back to a note on its site, where one is known. A text may also correct the caption
 * (`title`, `detail`) when a file is misnamed, or hide a duplicate photo (`skip`).
 *
 * Narration: a recording in public/Audio/<folder>/ named like the photo
 * ("Panamalai Pallava painting ATP.mp3", or "…-Tamil.mp3" / "…-English.mp3"; Tamil first).
 *
 * Film: a clip beside the photo with the same name ("How Kallanai was built (film) —
 * reconstruction.mp4" next to its .jpg) makes the photo its poster; the case shows a play mark
 * and the closer look plays the clip (`video`).
 */

/** The written texts, keyed by folder and then by file name (Unicode-normalised). */
const TEXTS = Object.fromEntries(
  Object.entries(ARTIFACT_TEXTS).map(([folder, entries]) => [folder, Object.fromEntries(Object.entries(entries).map(([name, text]) => [name.normalize('NFC'), text]))]),
);

/** Fallback context for a pottery photo without a written text, matched within its caption. */
const SITE_NOTES = [
  { match: /adichanallur/i, note: 'Adichanallur, on the Thamirabarani river near Thoothukudi, is an Iron Age urn-burial site — among the first prehistoric sites excavated in India.', tamil: 'தூத்துக்குடி அருகே தாமிரபரணிக் கரையில் உள்ள ஆதிச்சநல்லூர், முதுமக்கள் தாழிகள் நிறைந்த இரும்புக் காலப் புதைவிடம்.' },
  { match: /keezhadi/i, note: 'Keezhadi, on the Vaigai near Madurai, is a Sangam-age urban settlement whose excavations have yielded brick buildings, wells and great quantities of pottery.', tamil: 'மதுரை அருகே வைகைக் கரையில் உள்ள கீழடி, சங்ககால நகர நாகரிகத்தின் சான்று.' },
  { match: /arikamedu/i, note: 'Arikamedu, south of Puducherry, was an Indo-Roman trading port in the first centuries CE, where Roman wares were traded alongside local pottery.', tamil: 'புதுச்சேரிக்குத் தெற்கே உள்ள அரிக்கமேடு, உரோமானியருடன் வணிகம் நடந்த பழந்துறைமுகம்.' },
  { match: /tissamaharama/i, note: 'Potsherds inscribed in Tamil-Brahmi have been found at Tissamaharama in southern Sri Lanka — evidence of Tamil traders across the sea in the early historic period.', tamil: 'இலங்கையின் திஸ்ஸமகாராமாவில் கிடைத்த தமிழ்-பிராமி ஓடுகள், கடல் கடந்த தமிழ் வணிகர்களின் சான்று.' },
  { match: /nilgiri/i, note: 'Burial cairns in the Nilgiri hills have yielded funerary vessels whose lids are crowned with modelled figures of people and animals.', tamil: 'நீலகிரி மலைகளின் ஈமச் சின்னங்களில், மனித, விலங்கு உருவங்கள் கொண்ட மூடிகளுடைய கலங்கள் கிடைத்துள்ளன.' },
  { match: /black-and-red/i, note: 'Black-and-red ware — red outside, black inside, from being fired upside down — is the characteristic pottery of Tamil Nadu’s Iron Age and early historic sites.', tamil: 'வெளியே சிவப்பும் உள்ளே கருப்பும் கொண்ட கருப்பு-சிவப்பு மட்கலம், தமிழகத்தின் இரும்புக் காலத்தின் அடையாளம்.' },
  { match: /kāḷayam|கலயம்/i, note: 'The kalayam is the everyday Tamil clay pot, still made on the potter’s wheel today.', tamil: 'கலயம் — அன்றாடப் பயன்பாட்டுத் தமிழ் மண்பாண்டம்; இன்றும் குயவர் சக்கரத்தில் செய்யப்படுகிறது.' },
];

/** Splits a caption into the object and its site or period: "X — Y", "X- Y", or "X-Y period". */
function splitCaption(name) {
  const match = name.match(/^(.*?)\s*[—–]\s*(.+)$/) ?? name.match(/^(.*?)-\s+(.+)$/) ?? name.match(/^(.*?)-(\S+ period)$/i);
  let [title, detail] = match ? [match[1], match[2]] : [name, ''];
  // "Horned Lion- Vyala Pallava period": words before the period belong to the name.
  const period = detail.match(/^(.+?)\s+(\S+ period)$/i);
  if (period) [title, detail] = [`${title} (${period[1]})`, period[2]];
  // A trailing number only tells duplicate photos apart ("Ganesha2", "coin 2").
  return { title: title.replace(/\s*\d+$/, '').trim(), detail: detail.trim() };
}

/** Compares names loosely: case, accents' encoding and spacing don't matter. */
const nameKey = (text) => text.normalize('NFC').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
const baseName = (file) => file.replace(/\.[^.]+$/, '');

/** The narration recorded for a photo, preferring Tamil, or null. */
function narrationFor(folder, name) {
  const files = recordings[folder] ?? [];
  const wanted = nameKey(name);
  const file = ['-tamil', '', '-english']
    .map((suffix) => files.find((candidate) => nameKey(baseName(candidate)) === `${wanted}${suffix}`))
    .find(Boolean);
  return file ? mediaUrl(`/Audio/${folder}/${file}`) : null;
}

const toArtifact = (folder) => (file) => {
  const name = baseName(file).normalize('NFC'); // file systems may store accents decomposed
  const caption = splitCaption(name);
  const text = TEXTS[folder]?.[name];
  const site = text ? null : SITE_NOTES.find(({ match }) => match.test(name));
  const film = (films[folder] ?? []).find((clip) => baseName(clip).normalize('NFC') === name);
  return {
    id: `${folder}/${file}`,
    url: mediaUrl(`/${folder}/${file}`),
    title: text?.title ?? caption.title,
    detail: text?.detail ?? caption.detail,
    tamil: text?.ta ?? null,
    note: text?.en ?? site?.note ?? null,
    tamilNote: text?.taText ?? site?.tamil ?? null,
    // A recorded narration if there is one, else the generated reading of its Tamil description.
    narration: narrationFor(folder, name) ?? generatedNarration(text?.taText ?? site?.tamil),
    video: film ? mediaUrl(`/${folder}/${film}`) : null,
    skip: Boolean(text?.skip),
  };
};

/** The artefacts in one public folder, e.g. artifactsIn('Ancient Pottery'). */
export const artifactsIn = (folder) => (manifest[folder] ?? []).map(toArtifact(folder)).filter((artifact) => !artifact.skip);

/** The site folders inside a folder of folders, e.g. siteFoldersIn('Ancient tamil ports'). */
export const siteFoldersIn = (parent) => Object.keys(manifest).filter((folder) => folder.startsWith(`${parent}/`));
