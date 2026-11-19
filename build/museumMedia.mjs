/**
 * Puts the museum's media (the workspace's ../public folder) into the production build, ready
 * to copy onto any server — instead of Vite copying the whole folder as it is.
 *
 *  - Only what the site uses ships. Left out: archives (E-Books.zip), the e-books no shelf lists
 *    (the site names the ones it shows: "E-Books/<file>" in src/), the 3D models' raw sources
 *    (extensionless glTF files, and a .glb that has a smaller .web.glb beside it), full-length
 *    films (a film shows only beside a photo of the same name — see vite.config.js), dotfiles
 *    (but .htaccess) and leftovers (.part, Thumbs.db, desktop.ini).
 *  - Photographs are made light: a JPEG or PNG over OPTIMISE_ABOVE is re-encoded (JPEG with
 *    mozjpeg; long edge at most MAX_EDGE) under the same name and format, kept only when it comes
 *    out clearly smaller. The originals in ../public are never changed. The results are cached
 *    (node_modules/.cache/museum-media), so a rebuild only works on new or changed photos.
 *
 * A summary is written to media-report.json beside package.json.
 */
import { createHash } from 'node:crypto';
import { copyFile, mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { cpus } from 'node:os';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';

const OPTIMISE_ABOVE = 300 * 1024;
const MAX_EDGE = 2560;
const JPEG_QUALITY = 84;
const KEEP_IF_SMALLER = 0.85; // keep the re-encoded photo only if it is at most 85% of the original
const VIDEO = /\.(mp4|webm|mov|m4v)$/i;
const POSTER = /\.(jpe?g|png|webp|avif)$/i;
const LEFTOVER = /(\.part|\.tmp|\.crdownload|^thumbs\.db|^desktop\.ini|\.zip|\.7z|\.rar)$/i;

/** The e-book files the site shows: every "E-Books/<file>" written in src/. */
function referencedEbooks(srcDir) {
  const names = new Set();
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (/\.(jsx?|json)$/.test(entry.name) && !path.includes(`${sep}locales${sep}`)) {
        for (const match of readFileSync(path, 'utf8').matchAll(/E-Books\/([^'"`]+?\.pdf)/gi)) names.add(match[1]);
      }
    }
  };
  walk(srcDir);
  return names;
}

/** Whether a file of the public folder belongs in the build (`siblings`: its folder's file names). */
function ships(rel, name, siblings, ebooks) {
  if (name === '.htaccess') return null; // the Apache settings (no extension, but not a model)
  if (name.startsWith('.')) return 'dotfile';
  if (LEFTOVER.test(name)) return 'leftover or archive';
  if (!extname(name)) return 'raw model source';
  if (/\.glb$/i.test(name) && !/\.web\.glb$/i.test(name) && siblings.has(name.replace(/\.glb$/i, '.web.glb'))) return 'raw model source';
  if (VIDEO.test(name)) {
    const stem = name.replace(/\.[^.]+$/, '');
    if (![...siblings].some((other) => POSTER.test(other) && other.replace(/\.[^.]+$/, '') === stem)) return 'full-length film (not shown)';
  }
  const parts = rel.split('/');
  if (parts[0] === 'E-Books' && parts.length === 2 && !ebooks.has(name)) return 'e-book not on any shelf';
  return null;
}

async function listFiles(root) {
  const out = [];
  const walk = async (dir) => {
    const entries = await readdir(dir, { withFileTypes: true });
    const siblings = new Set(entries.filter((e) => e.isFile()).map((e) => e.name));
    for (const entry of entries) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!entry.name.startsWith('.')) await walk(path);
      } else if (entry.isFile()) out.push({ path, name: entry.name, siblings, rel: relative(root, path).split(sep).join('/') });
    }
  };
  await walk(root);
  return out;
}

async function pool(items, limit, work) {
  let next = 0;
  await Promise.all(Array.from({ length: limit }, async () => {
    while (next < items.length) await work(items[next++]);
  }));
}

export default function museumMedia({ publicDir, srcDir, cacheDir, reportFile }) {
  let outDir = '';
  return {
    name: 'museum-media',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      const started = Date.now();
      const { default: sharp } = await import('sharp');
      sharp.concurrency(1);
      const ebooks = referencedEbooks(srcDir);
      const files = await listFiles(publicDir);
      const report = { shipped: 0, shippedBytes: 0, originalBytes: 0, optimised: 0, savedBytes: 0, skipped: {}, skippedBytes: 0 };
      await mkdir(cacheDir, { recursive: true });
      await pool(files, Math.max(4, cpus().length), async (file) => {
        const info = await stat(file.path);
        const reason = ships(file.rel, file.name, file.siblings, ebooks);
        if (reason) {
          (report.skipped[reason] ??= []).push(file.rel);
          report.skippedBytes += info.size;
          return;
        }
        const target = join(outDir, file.rel);
        await mkdir(dirname(target), { recursive: true });
        report.shipped++;
        report.originalBytes += info.size;
        const photo = /\.(jpe?g|png)$/i.test(file.name) && info.size > OPTIMISE_ABOVE;
        if (photo) {
          const key = createHash('sha1').update(`${file.rel}|${info.size}|${info.mtimeMs}|${JPEG_QUALITY}|${MAX_EDGE}`).digest('hex');
          const cached = join(cacheDir, key + extname(file.name).toLowerCase());
          const noGain = `${join(cacheDir, key)}.nogain`;
          try {
            if (!existsSync(cached) && !existsSync(noGain)) {
              const image = sharp(file.path, { failOn: 'none' }).rotate().resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true });
              const buffer = /\.png$/i.test(file.name)
                ? await image.png({ compressionLevel: 9, effort: 8 }).toBuffer()
                : await image.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
              if (buffer.length <= info.size * KEEP_IF_SMALLER) await writeFile(cached, buffer);
              else await writeFile(noGain, '');
            }
            if (existsSync(cached)) {
              await copyFile(cached, target);
              const size = statSync(cached).size;
              report.optimised++;
              report.savedBytes += info.size - size;
              report.shippedBytes += size;
              return;
            }
          } catch (error) {
            this.warn?.(`could not optimise ${file.rel}: ${error.message}`);
          }
        }
        await copyFile(file.path, target);
        report.shippedBytes += info.size;
      });
      const mb = (bytes) => `${(bytes / 1048576).toFixed(0)} MB`;
      const summary = {
        at: new Date().toISOString(),
        seconds: Math.round((Date.now() - started) / 1000),
        shippedFiles: report.shipped,
        shipped: mb(report.shippedBytes),
        photosOptimised: report.optimised,
        photoBytesSaved: mb(report.savedBytes),
        leftOut: mb(report.skippedBytes),
        leftOutByReason: Object.fromEntries(Object.entries(report.skipped).map(([reason, list]) => [reason, { count: list.length, files: list.sort() }])),
      };
      await writeFile(reportFile, JSON.stringify(summary, null, 1));
      console.log(`\n[museum-media] ${report.shipped} media files → ${mb(report.shippedBytes)} (photos: ${report.optimised} lighter, −${mb(report.savedBytes)}; left out ${mb(report.skippedBytes)}) in ${summary.seconds}s — see media-report.json`);
    },
  };
}
