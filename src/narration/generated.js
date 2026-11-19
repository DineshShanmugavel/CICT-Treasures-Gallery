import narrationKeys from 'virtual:tamil-narration';
import englishKeys from 'virtual:english-narration';
import hindiKeys from 'virtual:hindi-narration';
import { mediaUrl } from '../mediaUrl.js';
import { tamilKey } from './tamilKey.js';

/**
 * The generated Tamil narrations (public/narration/ta, scripts/generateTamilNarration.mjs):
 * the keys of the recordings that exist (the app streams them from the website).
 */
export const NARRATION_KEYS = new Set(narrationKeys);

/**
 * Passages that a museum player (artefact close-up, palm-leaf bundle, book label) plays
 * itself: the page-wide layer (TamilNarrationLayer.jsx) gives them no extra button.
 */
export const PLAYER_KEYS = new Set();

/**
 * The generated narration of exactly this Tamil text, for an item with no recorded narration
 * of its own, or null. The text is marked as played by the item's own player.
 */
export function generatedNarration(text) {
  if (!text) return null;
  const key = tamilKey(text);
  PLAYER_KEYS.add(key);
  return NARRATION_KEYS.has(key) ? mediaUrl(`/narration/ta/${key}.mp3`) : null;
}

/*
 * English narrations (public/narration/en, scripts/generateEnglishNarration.mjs) of the
 * artefact images, palm-leaf bundles, books and rooms: each reads the item's English title,
 * then its English description.
 */
export const ENGLISH_KEYS = new Set(englishKeys);

const english = (value) => (value && typeof value === 'object' ? value.en : value) || '';

/** An item's English title as spoken: its title, and the caption's detail where there is one. */
export const englishTitle = (item) => [english(item.title), english(item.detail)].map((part) => part.trim()).filter(Boolean).join(', ');

/** What an item's English narration says: "<title>. <description>". */
export function englishNarrationText(title, description) {
  const head = String(title || '').trim();
  const body = String(description || '').trim();
  if (!body) return '';
  return head ? `${head}${/[.!?]$/.test(head) ? '' : '.'} ${body}` : body;
}

/** The key of an item's English narration (a player item: title and description together). */
export const englishItemKey = (title, description) => tamilKey(englishNarrationText(title, description));

/** The English narration of an item (artefact, bundle, book) — title then description — or null. */
export function englishNarration(title, description) {
  if (!description) return null;
  const key = englishItemKey(title, description);
  return ENGLISH_KEYS.has(key) ? mediaUrl(`/narration/en/${key}.mp3`) : null;
}

/**
 * A room's English narration (its title, then the description) is keyed by the description
 * text alone, so the page-wide layer can put its button beside that description.
 */
export const englishRoomKey = (description) => tamilKey(description);

/*
 * Hindi narrations (public/narration/hi, scripts/generateHindiNarration.mjs) of the same items:
 * each reads the item's Hindi title, then its Hindi description, exactly as the site shows them
 * in Hindi (the Hindi pack). A player item's file is keyed like its English one (by the English
 * title and description), so it is found whatever the Hindi text is; a room's by its Hindi
 * description, beside which the page-wide layer puts its button.
 */
export const HINDI_KEYS = new Set(hindiKeys);

/** The Hindi narration of an item, found by its English title and description, or null. */
export function hindiNarration(englishTitleText, englishDescription) {
  if (!englishDescription) return null;
  const key = englishItemKey(englishTitleText, englishDescription);
  return HINDI_KEYS.has(key) ? mediaUrl(`/narration/hi/${key}.mp3`) : null;
}

/** A room's Hindi narration is keyed by its Hindi description (what the page shows). */
export const hindiRoomKey = (description) => tamilKey(description);
