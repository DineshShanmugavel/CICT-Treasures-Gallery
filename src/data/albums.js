/**
 * Photobooks: galleries shown as an album on a room's shelf and opened in the photobook
 * viewer (PhotoBook.jsx), the palm leaf beside it following the page.
 */

const fileName = (artifact) => decodeURI(artifact.url).split('/').pop().replace(/\.[^.]+$/, '').normalize('NFC');

/** A photo's number at the end of its name ("Korkai — கொற்கை  6"; some names have two spaces before it), 0 if none. */
export const photoNumber = (artifact) => Number(fileName(artifact).match(/(\d+)$/)?.[1] ?? 0);

/** True if a photo's file name (without its extension) matches `pattern`. */
export const named = (pattern) => (artifact) => pattern.test(fileName(artifact));

/**
 * One photobook: `photos` in order of their numbers, each carrying the subject's texts
 * (`info`: name, tamil, place, en, ta) and its page number within the book.
 */
export function photobook(id, info, photos) {
  const pages = [...photos].sort((a, b) => photoNumber(a) - photoNumber(b));
  return {
    id: `${id}-album`,
    title: info.name,
    tamil: info.tamil,
    detail: info.place,
    layout: 'photobook',
    artifacts: pages.map((artifact, i) => ({
      ...artifact,
      site: id,
      title: info.name,
      tamil: info.tamil,
      detail: info.place,
      note: info.en,
      tamilNote: info.ta,
      caption: null, // a photograph's own caption, where the museum adds one
      plate: i + 1,
      plates: pages.length,
    })),
  };
}
