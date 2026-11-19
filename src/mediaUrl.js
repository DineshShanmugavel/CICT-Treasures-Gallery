import { BUNDLED_MEDIA } from './bundledMedia.js';

/**
 * The address of a file in the workspace's public media folder (photographs, recordings,
 * PDFs, models), given its path there ("/Audio/Rare Books/x.mp3").
 *
 * The website serves that folder itself, beside index.html. The production build uses
 * relative paths (vite.config.js `base: './'`), so this gives "./Audio/…" there: it resolves
 * against the page, and the museum works wherever it is copied — a domain's root
 * (https://example.org/) or a sub-folder (http://192.168.1.10/tamil-museum/). The museum never
 * changes the page's address (it has no URL routes), so the page is always index.html.
 *
 * The mobile app (`npm run build:mobile`) bundles only BUNDLED_MEDIA and fetches the rest from
 * the website instead: VITE_MEDIA_BASE_URL, set in .env.mobile.
 */
const MEDIA_BASE = (import.meta.env.VITE_MEDIA_BASE_URL ?? '').replace(/\/+$/, '');
// "/" in development, "./" in the build.
const ROOT = (import.meta.env.BASE_URL ?? '/').replace(/\/?$/, '/');

const isBundled = (path) => BUNDLED_MEDIA.some((entry) => (entry.endsWith('/') ? path.startsWith(entry) : path === entry));

export const mediaUrl = (path) => {
  const absolute = path.startsWith('/') ? path : `/${path}`;
  if (MEDIA_BASE && !isBundled(absolute)) return MEDIA_BASE + encodeURI(absolute);
  return ROOT + encodeURI(absolute.slice(1));
};
