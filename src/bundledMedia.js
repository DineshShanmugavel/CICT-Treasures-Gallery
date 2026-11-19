/**
 * Media the mobile app carries inside itself instead of streaming from VITE_MEDIA_BASE_URL:
 * the hall's own surfaces (ceiling, floor patterns, banners, alcoves, shrine) and the
 * statue model. They are small (about 4 MB) and the hall is bare without them, so they
 * must not wait on, or fail with, the network. A path ending in `/` stands for every
 * image in that folder.
 *
 * Read by vite.config.js (which copies them into dist-mobile) and src/mediaUrl.js.
 */
export const BUNDLED_MEDIA = ['/UI images/', '/models/Thiruvalluvarstatue.web.glb'];
