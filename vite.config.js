import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { BUNDLED_MEDIA } from './src/bundledMedia.js';
import museumMedia from './build/museumMedia.mjs';

// The rare-book and e-book PDFs, the artefact photographs and the Thirukkural recitations
// live in the workspace-level `public/` folder (../public/rarepdf, ../public/E-Books,
// ../public/Ancient Pottery, ../public/Audio, …), so serve that folder as static assets.
const PUBLIC_DIR = '../public';

/**
 * Folders of artefact photographs in the public folder, shown in the wings' display cases.
 * A folder ending in `/*` holds one sub-folder per site (Ancient tamil ports/Korkai — கொற்கை),
 * each listed as its own folder.
 */
const ARTIFACT_FOLDERS = ['Ancient Pottery', 'Ancient Statues', 'Ancient Tamil Coins', 'Ancient Tamil Paintings', 'Palm-Leaf Manuscripts', 'Tamil Instruments', 'Maritime trade n ports', 'Maritime trade n ports/Adichanallur', 'Ancient tamil ports/*', 'TN sarees', 'Household', 'Irrigation/*', 'Tamil Agriculture', 'Tamil foods', '5 lanscapes food', 'Weaving culture ancient-present', 'Tamil 7 GREAT PATRONS', 'Tamizh Poets n Thinkers/Pics of poets and thinkers', 'Tamizh KINGS n QUEENS/*', 'Tamilnadu places- then vs now/*'];
/**
 * Palm-leaf manuscripts: one sub-folder per bundle (public/Manuscripts/Natrinai/1.jpg, …),
 * its leaf photographs listed with their paths inside it, as some bundles keep their leaves
 * in a further folder ("Tolkappiyam-20 no 07 single images/leaf 001-042 single/1.jpg").
 */
const MANUSCRIPTS_FOLDER = 'Manuscripts';
/**
 * Recordings: one sub-folder per Thirukkural chapter (அதிகாரம்) in public/Audio, plus
 * public/Audio/Rare Books for the rare books' narrations, and a folder named after an
 * artefact folder (public/Audio/Ancient Tamil Paintings) for its objects' narrations.
 */
const AUDIO_FOLDER = 'Audio';
const NARRATION_FOLDER = 'narration/ta';
const KURAL_MEANING_FOLDER = 'kural-meaning-en';
const KURAL_MEANING_HI_FOLDER = 'kural-meaning-hi';
const ENGLISH_NARRATION_FOLDER = 'narration/en';
const HINDI_NARRATION_FOLDER = 'narration/hi';
const IMAGE = /\.(jpe?g|png|webp|avif)$/i;
const SOUND = /\.(mp3|mpeg|mpga|m4a|aac|ogg|oga|opus|wav)$/i;
/**
 * Film clips in an artefact folder. A clip shows only beside a photo of the same name — its
 * poster ("How Kallanai was built (film) — reconstruction.jpg" and ".mp4") — so a full-length
 * source film kept in the same folder never appears in the cases by accident.
 */
const VIDEO = /\.(mp4|webm)$/i;
const stem = (file) => file.replace(/\.[^.]+$/, '');

/**
 * Lists what is in the public folder's collections as virtual modules, read when the dev
 * server or a build starts — so a photo or recording dropped into a folder joins the
 * museum with no code change:
 * - `virtual:museum-artifacts`: { [artefact folder]: [photo file names] }
 * - `virtual:museum-audio`: { [folder in Audio/]: [recording file names] }
 * - `virtual:museum-manuscripts`: { [bundle folder in Manuscripts/]: [leaf paths inside it] }
 * - `virtual:museum-videos`: { [artefact folder]: [film clips that have a poster photo] }
 * - `virtual:tamil-narration`: [keys of the recordings in narration/ta/] — the Tamil passages'
 *   narration (scripts/generateTamilNarration.mjs). The app streams them like its other media.
 * In dev, adding or removing a file reloads the page with the new lists (a new narration
 * file only refreshes the list for the next page load).
 */
function museumManifests() {
  const root = resolve(fileURLToPath(new URL('.', import.meta.url)), PUBLIC_DIR);
  const byName = (a, b) => a.localeCompare(b, 'en', { numeric: true });
  const files = (folder, pattern) => {
    try {
      return readdirSync(resolve(root, folder)).filter((file) => pattern.test(file)).sort(byName);
    } catch {
      return []; // a missing folder is simply empty
    }
  };
  /** Every matching file under `folder`, as paths relative to it ("Digitized/130.jpg"). */
  const filesDeep = (folder, pattern) => {
    try {
      return readdirSync(resolve(root, folder), { recursive: true }).map((file) => file.split('\\').join('/')).filter((file) => pattern.test(file)).sort(byName);
    } catch {
      return [];
    }
  };
  const subfolders = (folder) => {
    try {
      return readdirSync(resolve(root, folder), { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
    } catch {
      return [];
    }
  };
  const artifactFolders = () => ARTIFACT_FOLDERS.flatMap((folder) =>
    folder.endsWith('/*') ? subfolders(folder.slice(0, -2)).map((site) => `${folder.slice(0, -2)}/${site}`) : [folder]);
  const manifests = {
    'virtual:museum-artifacts': () => Object.fromEntries(artifactFolders().map((folder) => [folder, files(folder, IMAGE)])),
    'virtual:museum-audio': () => Object.fromEntries(subfolders(AUDIO_FOLDER).map((chapter) => [chapter, files(`${AUDIO_FOLDER}/${chapter}`, SOUND)])),
    'virtual:museum-manuscripts': () => Object.fromEntries(subfolders(MANUSCRIPTS_FOLDER).map((bundle) => [bundle, filesDeep(`${MANUSCRIPTS_FOLDER}/${bundle}`, IMAGE)])),
    'virtual:museum-videos': () =>
      Object.fromEntries(
        artifactFolders()
          .map((folder) => {
            const posters = new Set(files(folder, IMAGE).map(stem));
            return [folder, files(folder, VIDEO).filter((file) => posters.has(stem(file)))];
          })
          .filter(([, clips]) => clips.length),
      ),
    'virtual:tamil-narration': () => files(NARRATION_FOLDER, /\.mp3$/i).map(stem),
    // English narration of artefacts, bundles, books and rooms (generateEnglishNarration.mjs).
    'virtual:english-narration': () => files(ENGLISH_NARRATION_FOLDER, /\.mp3$/i).map(stem),
    // Hindi narration of the same items (generateHindiNarration.mjs).
    'virtual:hindi-narration': () => files(HINDI_NARRATION_FOLDER, /\.mp3$/i).map(stem),
    // The English recordings of the kurals' meanings (scripts/generateKuralMeaningAudio.mjs): numbers.
    'virtual:kural-meaning-en': () => files(KURAL_MEANING_FOLDER, /^\d+\.mp3$/i).map((file) => Number(stem(file))),
    // …and the Hindi recordings of the meanings the Hindi leaf shows (same script, --lang hi).
    'virtual:kural-meaning-hi': () => files(KURAL_MEANING_HI_FOLDER, /^\d+\.mp3$/i).map((file) => Number(stem(file))),
  };
  const watched = [...ARTIFACT_FOLDERS.map((folder) => folder.replace(/\/\*$/, '')), AUDIO_FOLDER, MANUSCRIPTS_FOLDER].map((folder) => resolve(root, folder));
  return {
    name: 'museum-manifests',
    resolveId: (id) => (id in manifests ? `\0${id}` : null),
    load(id) {
      const build = id.startsWith('\0') && manifests[id.slice(1)];
      return build ? `export default ${JSON.stringify(build())};` : null;
    },
    configureServer(server) {
      server.watcher.add(watched);
      const refresh = (file) => {
        if (!(IMAGE.test(file) || SOUND.test(file) || VIDEO.test(file)) || !watched.some((folder) => resolve(file).startsWith(folder))) return;
        for (const id of Object.keys(manifests)) {
          const module = server.moduleGraph.getModuleById(`\0${id}`);
          if (module) server.moduleGraph.invalidateModule(module);
        }
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', refresh);
      server.watcher.on('unlink', refresh);
      // Narration files arrive one by one while the generator runs: refresh the list quietly.
      const quietLists = [
        [resolve(root, NARRATION_FOLDER), '\0virtual:tamil-narration'],
        [resolve(root, KURAL_MEANING_FOLDER), '\0virtual:kural-meaning-en'],
        [resolve(root, KURAL_MEANING_HI_FOLDER), '\0virtual:kural-meaning-hi'],
        [resolve(root, ENGLISH_NARRATION_FOLDER), '\0virtual:english-narration'],
        [resolve(root, HINDI_NARRATION_FOLDER), '\0virtual:hindi-narration'],
      ];
      quietLists.forEach(([folder]) => server.watcher.add(folder));
      // The watcher does not always report files added under the public folder (outside the
      // root), so these lists are also rebuilt whenever a page asks for them.
      server.middlewares.use((req, _res, next) => {
        const url = decodeURIComponent(req.url ?? '');
        for (const [, id] of quietLists) {
          if (!url.includes(id.slice(1))) continue;
          const module = server.moduleGraph.getModuleById(id);
          if (module) server.moduleGraph.invalidateModule(module);
        }
        next();
      });
      const refreshNarration = (file) => {
        if (!/\.mp3$/i.test(file)) return;
        for (const [folder, id] of quietLists) {
          if (!resolve(file).startsWith(folder)) continue;
          const module = server.moduleGraph.getModuleById(id);
          if (module) server.moduleGraph.invalidateModule(module);
        }
      };
      server.watcher.on('add', refreshNarration);
      server.watcher.on('unlink', refreshNarration);
    },
  };
}

/**
 * The visitor analytics and admin API (public/museum-analytics.mjs, the same module the office
 * server uses) inside `npm run dev` and `npm run preview`, so live users, views, cities and
 * "Publish" work there too. In development, Publish writes public/site-data.json itself, so the
 * published edits go into the next build. Counts: node_modules/.cache/museum-analytics.
 */
function museumApi() {
  const here = fileURLToPath(new URL('.', import.meta.url));
  const dataDir = resolve(here, 'node_modules/.cache/museum-analytics');
  const mount = async (server, siteRoot) => {
    // (A fresh URL each time, so a dev-server restart picks up changes to the module.)
    const { createMuseumApi } = await import(`${pathToFileURL(resolve(here, PUBLIC_DIR, 'museum-analytics.mjs')).href}?v=${Date.now()}`);
    const api = createMuseumApi({ siteRoot, dataDir, log: { warn: () => {} } });
    server.middlewares.use((req, res, next) => {
      api(req, res).then((handled) => handled || next(), next);
    });
  };
  return {
    name: 'museum-api',
    configureServer: (server) => mount(server, resolve(here, PUBLIC_DIR)),
    configurePreviewServer: (server) => mount(server, resolve(here, 'dist')),
  };
}

/**
 * Pre-compressed copies of the built code and data (x.js → x.js.br, x.js.gz) beside the
 * originals, so a server sends the small copy straight off the disk instead of compressing
 * on every request (nginx gzip_static / brotli_static, the Apache and IIS rules in
 * public/.htaccess and public/web.config). The media are already compressed (mp3, jpeg, webp,
 * meshopt .glb) and are left alone.
 */
function precompress() {
  const COMPRESSIBLE = /\.(js|mjs|css|html|json|svg|txt|wasm)$/i;
  let outDir = '';
  return {
    name: 'museum-precompress',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    async writeBundle(_options, bundle) {
      const { brotliCompress, gzip, constants } = await import('node:zlib');
      const { promisify } = await import('node:util');
      const { writeFile } = await import('node:fs/promises');
      const br = promisify(brotliCompress);
      const gz = promisify(gzip);
      const files = Object.values(bundle).filter((file) => COMPRESSIBLE.test(file.fileName));
      let saved = 0;
      // A few at a time: the language packs alone are tens of megabytes.
      for (let i = 0; i < files.length; i += 16) {
        await Promise.all(
          files.slice(i, i + 16).map(async (file) => {
            const source = Buffer.from(file.type === 'chunk' ? file.code : file.source);
            if (source.length < 1024) return;
            const path = resolve(outDir, file.fileName);
            const [brotli, gzipped] = await Promise.all([
              br(source, { params: { [constants.BROTLI_PARAM_QUALITY]: 10, [constants.BROTLI_PARAM_SIZE_HINT]: source.length } }),
              gz(source, { level: 9 }),
            ]);
            await Promise.all([writeFile(`${path}.br`, brotli), writeFile(`${path}.gz`, gzipped)]);
            saved += source.length - brotli.length;
          }),
        );
      }
      this.info?.(`pre-compressed ${files.length} files (brotli saves ${(saved / 1048576).toFixed(1)} MB)`);
    },
  };
}

/**
 * Copies BUNDLED_MEDIA (src/bundledMedia.js) from the public folder into the mobile build,
 * at the same paths, so the app shows the hall's surfaces and statue without the network.
 */
function bundledMedia() {
  const root = resolve(fileURLToPath(new URL('.', import.meta.url)), PUBLIC_DIR);
  return {
    name: 'museum-bundled-media',
    apply: 'build',
    generateBundle() {
      for (const entry of BUNDLED_MEDIA) {
        const folder = entry.endsWith('/') ? entry.slice(1) : null;
        const paths = folder ? readdirSync(resolve(root, folder)).filter((file) => IMAGE.test(file)).map((file) => folder + file) : [entry.slice(1)];
        for (const path of paths) this.emitFile({ type: 'asset', fileName: path, source: readFileSync(resolve(root, path)) });
      }
    },
  };
}

/**
 * `--mode mobile` (npm run build:mobile) builds the Capacitor app's shell into dist-mobile:
 * the public folder's media (tens of gigabytes) is left out and fetched from the website
 * at VITE_MEDIA_BASE_URL instead (see src/mediaUrl.js). Every other mode is the website.
 */
export default defineConfig(({ mode, command }) => {
  const mobile = mode === 'mobile';
  if (mobile && !loadEnv(mode, process.cwd()).VITE_MEDIA_BASE_URL) {
    throw new Error('Set VITE_MEDIA_BASE_URL in .env.mobile to the website address that serves the museum media.');
  }
  return {
    // Relative asset paths: the built site runs from any folder of any server (see src/mediaUrl.js).
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      museumManifests(),
      !mobile && museumApi(),
      mobile && bundledMedia(),
      !mobile && precompress(),
      // The website build carries the media itself: only what the site uses, photos made light.
      !mobile &&
        museumMedia({
          publicDir: resolve(fileURLToPath(new URL('.', import.meta.url)), PUBLIC_DIR),
          srcDir: fileURLToPath(new URL('./src', import.meta.url)),
          cacheDir: fileURLToPath(new URL('./node_modules/.cache/museum-media', import.meta.url)),
          reportFile: fileURLToPath(new URL('./media-report.json', import.meta.url)),
        }),
    ],
    // The dev server serves the media folder as it is; the build copies it through museumMedia.
    publicDir: mobile || command === 'build' ? false : PUBLIC_DIR,
    build: {
      ...(mobile ? { outDir: 'dist-mobile' } : {}),
      // The largest chunks are data loaded on demand (a language pack when that language is
      // chosen, the 1330 kurals when the scroll opens); the page's own code is ~216 kB brotli.
      chunkSizeWarningLimit: 1100,
    },
    // The dev server also serves the media to the mobile app (.env.mobile), so it answers
    // the app's origins as well as Vite's default localhost pages.
    server: {
      cors: { origin: [/^https?:\/\/(?:(?:[^:]+\.)?localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/, 'capacitor://localhost'] },
    },
  };
});
