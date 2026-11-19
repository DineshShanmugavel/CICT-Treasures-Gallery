/**
 * The keyless runtime translator: Google Translate's free web endpoint (translate_a/t, client
 * "gtx" — the one its browser extension uses). No key, no account, nothing to configure; it
 * answers browsers directly (Access-Control-Allow-Origin: *).
 *
 * src/i18n/translationEngine.js calls it for strings a language's static pack lacks — the
 * interface, plaques, the Monolith, exhibit texts, the kural on the open leaf — and caches
 * every answer in the visitor's IndexedDB (or localStorage), so each string is asked for once
 * per browser. A build can point the engine at its own service instead (VITE_TRANSLATE_URL),
 * or switch runtime translation off (VITE_TRANSLATE_URL=off).
 *
 * The endpoint is unofficial: Google may rate limit it (429) or change it. A failed batch is
 * simply asked again later by the engine, and the English shows meanwhile.
 */
const GTX_URL = 'https://translate.googleapis.com/translate_a/t';

/** Most strings and characters per request (the endpoint takes well over this). */
export const LIVE_BATCH = { strings: 60, characters: 8000 };

/**
 * Translates English `texts` into `target` (a Google language code). Resolves to an array in
 * the same order (empty strings where nothing came back); rejects on a failed request.
 */
export async function translateLive(texts, target) {
  const response = await fetch(`${GTX_URL}?client=gtx&sl=en&tl=${encodeURIComponent(target)}&format=text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: texts.map((text) => `q=${encodeURIComponent(text)}`).join('&'),
    credentials: 'omit',
    referrerPolicy: 'no-referrer',
  });
  if (!response.ok) throw new Error(`Live translation: ${response.status}`);
  const data = await response.json();
  // Several strings come back as ["…", "…"]; older answers pair each with its source language.
  const out = (Array.isArray(data) ? data : [data]).map((item) => (Array.isArray(item) ? item[0] : item));
  return texts.map((_, i) => (typeof out[i] === 'string' ? out[i] : ''));
}
