/**
 * The key that ties a Tamil passage to its recording in public/narration/ta/<key>.mp3.
 * Shared by the generator (scripts/generateTamilNarration.mjs) and the site
 * (TamilNarrationLayer.jsx), so a recording only ever plays beside the exact text it speaks.
 */

/** Whitespace folded the way the browser shows it (and JSX joins its lines). */
export const normaliseTamil = (text) => String(text).replace(/\s+/g, ' ').trim();

/** cyrb53 — a fast 53-bit string hash, written in base 36. */
export function tamilKey(text) {
  const str = normaliseTamil(text);
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

const TAMIL = /[஀-௿]/g;
const LETTER = /\p{L}/gu;

/**
 * Whether a passage is worth narrating: mainly Tamil script, and a sentence or more
 * (not a button label or a short title).
 */
export function isNarratableTamil(text) {
  const s = normaliseTamil(text);
  const tamil = (s.match(TAMIL) || []).length;
  const letters = (s.match(LETTER) || []).length;
  return tamil >= 40 && tamil / Math.max(letters, 1) >= 0.8;
}
