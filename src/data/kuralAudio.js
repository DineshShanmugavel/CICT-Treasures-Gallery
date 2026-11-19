import recordings from 'virtual:museum-audio';
import meaningNumbers from 'virtual:kural-meaning-en';
import hindiMeaningNumbers from 'virtual:kural-meaning-hi';
import artifactFolders from 'virtual:museum-artifacts';
import { chapters } from './kuralData.js';
import { mediaUrl } from '../mediaUrl.js';

/**
 * Thirukkural recitations in public/Audio, listed at build time by the `museum-manifests`
 * plugin in vite.config.js. Each chapter (அதிகாரம்) has its own folder:
 *
 *   public/Audio/kadavul vazhthu/1.mp3 … 10.mp3      its ten kurals, in order
 *   public/Audio/kadavul vazhthu/kadavul vazhthu.mp3  its title / introduction
 *
 * - A folder is matched to its chapter by name, however the Tamil is romanised
 *   ("kadavul vazhthu" is chapter 1, "Katavul Vaazhththu"), by the chapter's English name,
 *   or by a leading chapter number ("1", "001 kadavul vazhthu").
 * - A numbered file is a kural: 1–10 count within the chapter; a file numbered with the
 *   kural's own number (e.g. 11.mp3 in chapter 2's folder) works too.
 * - Any other file in the folder is the chapter's introduction.
 */

/** Folds the many romanisations of Tamil into one spelling, so names can be matched. */
export function romanKey(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // ā, ḷ, ṟ … → a, l, r
    .toLowerCase()
    .replace(/[^a-z]/g, '')
    .replace(/zh/g, 'l') // ழ: zh / l
    .replace(/[td]h/g, 't')
    .replace(/[cs]h/g, 's')
    .replace(/d/g, 't')
    .replace(/g/g, 'k')
    .replace(/b/g, 'p')
    .replace(/j/g, 's')
    .replace(/w/g, 'v')
    .replace(/ee/g, 'i')
    .replace(/oo/g, 'u')
    .replace(/(.)\1+/g, '$1'); // doubled letters and long vowels
}

/*
 * Chapter names by romanisation key. A few chapters romanise alike (கள்ளாமை and கல்லாமை
 * are both "Kallaamai"; 71 and 110 are both "Kurippariththal"), so a key shared by two
 * chapters is ambiguous (null): those folders need the chapter number, e.g. "29 kallaamai".
 */
const chapterByKey = new Map();
for (const chapter of chapters) {
  for (const name of [chapter.transliteration, chapter.english]) {
    if (!name) continue;
    const key = romanKey(name);
    const known = chapterByKey.get(key);
    chapterByKey.set(key, known === undefined || known === chapter ? chapter : null);
  }
}

function chapterForFolder(folder) {
  const numbered = folder.match(/^\s*(\d+)/);
  if (numbered) return chapters[Number(numbered[1]) - 1] ?? null;
  return chapterByKey.get(romanKey(folder));
}

/** Folders in public/Audio that hold other recordings, not a chapter's (see bookInfo.js). */
export const BOOK_AUDIO_FOLDER = 'Rare Books';
/**
 * The narrations of the Thiruvalluvar story told in the scroll, one per language: files in
 * public/Audio/Thiruvalluvar story/ whose names end "-Tamil" and "-English"
 * (e.g. "thiruvalluvar-story-audio-Tamil.mp3"). A language with no recording is null.
 */
const STORY_AUDIO_FOLDER = 'Thiruvalluvar story';
const storyRecording = (language) => {
  const file = (recordings[STORY_AUDIO_FOLDER] ?? []).find((name) => new RegExp(`[-_ ]${language}\\.[^.]+$`, 'i').test(name));
  return file ? mediaUrl(`/Audio/${STORY_AUDIO_FOLDER}/${file}`) : null;
};
export const valluvarStoryRecordings = { ta: storyRecording('Tamil'), en: storyRecording('English'), hi: storyRecording('Hindi') };

const kuralTracks = new Map(); // kural number → url
const introTracks = new Map(); // chapter number → url
for (const [folder, files] of Object.entries(recordings)) {
  // Artefact narrations live in folders named after their photo folders (see artifacts.js).
  if (folder === BOOK_AUDIO_FOLDER || folder === STORY_AUDIO_FOLDER || folder in artifactFolders) continue;
  const chapter = chapterForFolder(folder);
  if (!chapter) {
    if (import.meta.env.DEV) {
      console.warn(chapter === null
        ? `Audio folder "${folder}" could be more than one Thirukkural chapter; start its name with the chapter number, e.g. "29 ${folder}".`
        : `Audio folder "${folder}" does not match any Thirukkural chapter; rename it to the chapter's name or number.`);
    }
    continue;
  }
  for (const file of files) {
    const url = mediaUrl(`/Audio/${folder}/${file}`);
    const number = file.match(/^(\d+)\.[^.]+$/);
    if (!number) {
      if (!introTracks.has(chapter.number)) introTracks.set(chapter.number, url);
      continue;
    }
    const n = Number(number[1]);
    const kural = n >= 1 && n <= 10 ? chapter.start + n - 1 : n >= chapter.start && n <= chapter.end ? n : null;
    if (kural) kuralTracks.set(kural, url);
  }
}

/** The recitation of a kural, or null if it has not been recorded yet. */
export const kuralRecording = (number) => kuralTracks.get(number) ?? null;

/** The recorded title / introduction of a chapter (அதிகாரம்), or null. */
export const chapterIntroRecording = (chapterNumber) => introTracks.get(chapterNumber) ?? null;

/*
 * English recordings of the kurals' meanings: public/kural-meaning-en/<number>.mp3
 * (scripts/generateKuralMeaningAudio.mjs), each reading exactly the English meaning the leaf shows.
 */
const meaningTracks = new Set(meaningNumbers);

/** The English meaning a kural's leaf shows (keep in step with generateKuralMeaningAudio.mjs). */
export const englishMeaning = (kural) => (kural?.studentMeaning?.en ?? kural?.explanation ?? '').trim();

/** The recording of kural <number>'s English meaning, or null. */
export const kuralMeaningRecording = (number) => (meaningTracks.has(number) ? mediaUrl(`/kural-meaning-en/${number}.mp3`) : null);

/*
 * Hindi recordings of the meanings the leaf shows in Hindi (अर्थ, src/data/kurals/hi.json):
 * public/kural-meaning-hi/<number>.mp3 (generateKuralMeaningAudio.mjs --lang hi).
 */
const hindiMeaningTracks = new Set(hindiMeaningNumbers);

/** The recording of kural <number>'s Hindi meaning, or null. */
export const kuralHindiMeaningRecording = (number) => (hindiMeaningTracks.has(number) ? mediaUrl(`/kural-meaning-hi/${number}.mp3`) : null);
