#!/usr/bin/env node
/**
 * CICT Tamil Treasures Gallery: a zero-install web server for office PCs.
 * Serves this folder (the built museum) to every computer on the network.
 *
 *   node serve-museum.mjs            → http://<this-PC's-address>:8080/
 *   node serve-museum.mjs 9000       → another port
 *
 * Plain Node.js (18 or newer), no packages. Handles what the museum needs: correct file types
 * (.glb models, .mp3, .mp4, .pdf), byte ranges (seeking in recordings and films, PDF pages),
 * the build's pre-compressed .br / .gz copies, browser caching, and the single-page fallback.
 *
 * It also runs the museum's visitor analytics and admin API (museum-analytics.mjs): live users,
 * unique views, visitor cities, and publishing the admin portal's edits. Counts are kept in
 * ./data/analytics.json (never served to the web).
 */
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { networkInterfaces } from 'node:os';
import { dirname, extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createMuseumApi } from './museum-analytics.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.argv[2] || process.env.PORT || 8080);
const HOST = process.env.HOST || '0.0.0.0';
const HIDDEN = /^(start-local-server\.(bat|sh)|serve-museum\.mjs|museum-analytics\.mjs|nginx\.conf\.example|web\.config|\.htaccess)$/i;
const api = createMuseumApi({ siteRoot: ROOT });
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.mp4': 'video/mp4', '.webm': 'video/webm',
  '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json', '.pdf': 'application/pdf', '.wasm': 'application/wasm',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
};
const COMPRESSIBLE = /\.(js|mjs|css|json|html|svg|wasm)$/i;

function cacheControl(path) {
  if (path.endsWith('index.html')) return 'no-cache';
  if (path.includes(`${sep}assets${sep}`)) return 'public, max-age=31536000, immutable';
  return 'public, max-age=2592000';
}

function resolvePath(url) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(url, 'http://x').pathname);
  } catch {
    return null;
  }
  const path = normalize(join(ROOT, pathname));
  if (path !== ROOT && !path.startsWith(ROOT + sep)) return null; // no climbing out of the folder
  if (HIDDEN.test(pathname.split('/').pop() || '')) return null;
  if (/(^|\/)data(\/|$)/i.test(pathname.slice(1))) return null; // the analytics data folder
  if (existsSync(path) && statSync(path).isFile()) return path;
  if (existsSync(join(path, 'index.html'))) return join(path, 'index.html');
  // Single-page app: an address that is not a file opens the museum (but a missing file 404s).
  return extname(pathname) ? null : join(ROOT, 'index.html');
}

const server = createServer(async (req, res) => {
  // The analytics / admin API first.
  if (await api(req, res)) return;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  const path = resolvePath(req.url);
  if (!path) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
    return;
  }
  const type = TYPES[extname(path).toLowerCase()] || 'application/octet-stream';
  const headers = { 'Content-Type': type, 'Cache-Control': cacheControl(path), 'X-Content-Type-Options': 'nosniff', 'Accept-Ranges': 'bytes', 'Access-Control-Allow-Origin': '*' };

  // Send the build's pre-compressed copy when the browser accepts it.
  if (COMPRESSIBLE.test(path)) {
    const accepts = String(req.headers['accept-encoding'] || '');
    headers.Vary = 'Accept-Encoding';
    for (const [encoding, suffix] of [['br', '.br'], ['gzip', '.gz']]) {
      if (new RegExp(`\\b${encoding}\\b`).test(accepts) && existsSync(path + suffix)) {
        const size = statSync(path + suffix).size;
        res.writeHead(200, { ...headers, 'Content-Encoding': encoding, 'Content-Length': size });
        if (req.method === 'HEAD') res.end();
        else createReadStream(path + suffix).pipe(res);
        return;
      }
    }
  }

  const { size, mtime } = statSync(path);
  headers['Last-Modified'] = mtime.toUTCString();
  if (req.headers['if-modified-since'] && new Date(req.headers['if-modified-since']) >= new Date(mtime.toUTCString())) {
    res.writeHead(304, headers).end();
    return;
  }
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
  if (range) {
    let start = range[1] === '' ? size - Number(range[2]) : Number(range[1]);
    let end = range[1] === '' || range[2] === '' ? size - 1 : Number(range[2]);
    start = Math.max(0, start);
    end = Math.min(size - 1, end);
    if (start > end) {
      res.writeHead(416, { 'Content-Range': `bytes */${size}` }).end();
      return;
    }
    res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end - start + 1 });
    if (req.method === 'HEAD') res.end();
    else createReadStream(path, { start, end }).pipe(res);
    return;
  }
  res.writeHead(200, { ...headers, 'Content-Length': size });
  if (req.method === 'HEAD') res.end();
  else createReadStream(path).pipe(res);
});

server.on('error', (error) => {
  console.error(error.code === 'EADDRINUSE' ? `Port ${PORT} is in use. Try: node serve-museum.mjs ${PORT + 1}` : error.message);
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  const addresses = Object.values(networkInterfaces()).flat().filter((a) => a && a.family === 'IPv4' && !a.internal).map((a) => a.address);
  console.log('\n  CICT Tamil Treasures Gallery is running.\n');
  console.log(`  On this PC:           http://localhost:${PORT}/`);
  for (const address of addresses) console.log(`  On the office network: http://${address}:${PORT}/`);
  console.log(`\n  Visitor analytics: on (data/analytics.json).  Admin portal: http://localhost:${PORT}/#/admin`);
  console.log('\n  Keep this window open while visitors use the museum. Press Ctrl+C to stop.\n');
});
