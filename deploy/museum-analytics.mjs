/**
 * CICT Tamil Treasures Gallery: visitor analytics and admin API. Plain Node.js (18+), no packages.
 * Used by serve-museum.mjs (the office / VPS server) and by `npm run dev` / `npm run preview`.
 *
 *   GET  …/api/analytics/status.json  { enabled: true, live, views }   (a static host serves the
 *                                       shipped file instead: { enabled: false } — the site then
 *                                       stays quiet, no failed requests)
 *   POST …/api/analytics/visit        a page view: counts the visitor's IP once (unique views)
 *   POST …/api/analytics/heartbeat    every 30 s from each open museum tab (live users)
 *   GET  …/api/analytics/summary      admin only: live, views, visits, city-wise table
 *   POST …/api/admin/login            admin only: checks the credentials
 *   POST …/api/site-data              admin only: publishes the admin portal's edits (site-data.json)
 *
 * Privacy: IP addresses are never stored. Each is reduced to a salted SHA-256 (to count it once)
 * and its city / region / country, looked up once per address (cached in the data file) from a
 * free GeoIP service (ipwho.is, then ip-api.com), at most one lookup every 1.5 s. Private
 * addresses (192.168.x.x, 10.x, 127.0.0.1, …) are "Local Office Network" and never looked up.
 * Set MUSEUM_GEOIP=off to turn lookups off.
 *
 * Data: <museum folder>/data/analytics.json (MUSEUM_DATA_DIR to move it), saved every few seconds,
 * so counts survive restarts. Keep the data folder when updating the museum's files.
 *
 * Admin credentials: MUSEUM_ADMIN_USER and MUSEUM_ADMIN_PASSWORD (default: the museum's own).
 * The admin portal sends SHA-256("<user>:<password>") as the X-Museum-Admin header.
 */
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const LIVE_WINDOW_MS = 75_000; // a tab that missed two heartbeats has left
const SAVE_EVERY_MS = 5_000;
const GEO_GAP_MS = 1_500;
const DEFAULT_ADMIN_TOKEN = 'c0ad35a583e1ac1da3a9c043a4d69f86855f7041bb668bea48cc8d5b1d9f7cf0';
const LOCAL = { city: 'Local Office Network', region: '', country: 'LAN', local: true };

const sha256 = (text) => createHash('sha256').update(text).digest('hex');

function adminToken() {
  const user = process.env.MUSEUM_ADMIN_USER;
  const password = process.env.MUSEUM_ADMIN_PASSWORD;
  return user && password ? sha256(`${user}:${password}`) : DEFAULT_ADMIN_TOKEN;
}

function sameToken(given) {
  const expected = Buffer.from(adminToken(), 'utf8');
  const actual = Buffer.from(String(given ?? ''), 'utf8');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/** The visitor's address: the connection's, or (behind a local reverse proxy) the forwarded one. */
function clientIp(req) {
  let ip = String(req.socket?.remoteAddress ?? '').replace(/^::ffff:/, '');
  if (isPrivate(ip)) {
    const forwarded = String(req.headers['cf-connecting-ip'] || req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || '').split(',')[0].trim();
    if (forwarded) ip = forwarded.replace(/^::ffff:/, '');
  }
  return ip || 'unknown';
}

export function isPrivate(ip) {
  if (!ip || ip === 'unknown' || ip === '::1' || ip === 'localhost') return true;
  if (/^(10|127)\./.test(ip) || /^192\.168\./.test(ip) || /^169\.254\./.test(ip)) return true;
  const m = ip.match(/^172\.(\d+)\./);
  if (m && Number(m[1]) >= 16 && Number(m[1]) <= 31) return true;
  const c = ip.match(/^100\.(\d+)\./);
  if (c && Number(c[1]) >= 64 && Number(c[1]) <= 127) return true;
  return /^(fc|fd|fe80)/i.test(ip);
}

async function readBody(req, limit) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw Object.assign(new Error('too large'), { status: 413 });
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

function send(res, status, body) {
  const text = JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Content-Length': Buffer.byteLength(text) });
  res.end(text);
}

export function createMuseumApi({ siteRoot, dataDir = process.env.MUSEUM_DATA_DIR || join(siteRoot, 'data'), log = console } = {}) {
  const file = join(dataDir, 'analytics.json');
  let data = { salt: randomBytes(16).toString('hex'), since: new Date().toISOString(), visitors: {} };
  try {
    if (existsSync(file)) data = { ...data, ...JSON.parse(readFileSync(file, 'utf8')) };
  } catch (error) {
    log.warn?.(`[analytics] could not read ${file} (${error.message}); starting fresh`);
  }
  let dirty = !existsSync(file);
  const live = new Map(); // tab id → last heartbeat

  const save = () => {
    if (!dirty) return;
    try {
      mkdirSync(dataDir, { recursive: true });
      writeFileSync(`${file}.tmp`, JSON.stringify(data));
      renameSync(`${file}.tmp`, file);
      dirty = false;
    } catch (error) {
      log.warn?.(`[analytics] could not save ${file}: ${error.message}`);
    }
  };
  setInterval(save, SAVE_EVERY_MS).unref();
  process.once('exit', save);
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, () => {
      save();
      process.exit(0);
    });
  }

  /* GeoIP: one lookup at a time, cached forever in the visitor record. */
  const queue = [];
  let geoBusy = false;
  const geoOff = /^(off|0|false|no)$/i.test(process.env.MUSEUM_GEOIP ?? '');
  async function lookup(ip) {
    const providers = [
      [`https://ipwho.is/${encodeURIComponent(ip)}?fields=success,city,region,country`, (j) => j.success && { city: j.city, region: j.region, country: j.country }],
      [`http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,city,regionName,country`, (j) => j.status === 'success' && { city: j.city, region: j.regionName, country: j.country }],
    ];
    for (const [url, read] of providers) {
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(5000), headers: { Accept: 'application/json' } });
        if (!response.ok) continue;
        const geo = read(await response.json());
        if (geo && (geo.city || geo.country)) return { city: geo.city || 'Unknown city', region: geo.region || '', country: geo.country || '' };
      } catch {
        /* try the next provider */
      }
    }
    return null;
  }
  async function drain() {
    if (geoBusy) return;
    geoBusy = true;
    while (queue.length) {
      const { hash, ip } = queue.shift();
      const visitor = data.visitors[hash];
      if (visitor && !visitor.geo) {
        const geo = await lookup(ip);
        if (geo) {
          visitor.geo = geo;
          dirty = true;
        }
      }
      await new Promise((resolve) => setTimeout(resolve, GEO_GAP_MS));
    }
    geoBusy = false;
  }

  const liveCount = () => {
    const now = Date.now();
    for (const [id, seen] of live) if (now - seen > LIVE_WINDOW_MS) live.delete(id);
    return live.size;
  };
  const totals = () => ({ live: liveCount(), views: Object.keys(data.visitors).length });

  const tabId = (body) => {
    try {
      const id = JSON.parse(body || '{}').sid;
      return typeof id === 'string' && /^[a-z0-9-]{8,64}$/i.test(id) ? id : null;
    } catch {
      return null;
    }
  };
  const beat = (id) => {
    if (!id) return;
    if (live.size > 20000) liveCount();
    live.set(id, Date.now());
  };

  function visit(req) {
    const ip = clientIp(req);
    const hash = sha256(`${data.salt}:${ip}`);
    const now = new Date().toISOString();
    const visitor = (data.visitors[hash] ??= { first: now, visits: 0, geo: null });
    visitor.visits += 1;
    visitor.last = now;
    if (!visitor.geo) {
      if (isPrivate(ip)) visitor.geo = LOCAL;
      else if (!geoOff && queue.length < 500) {
        queue.push({ hash, ip });
        drain();
      }
    }
    dirty = true;
  }

  function summary() {
    const cities = new Map();
    let visits = 0;
    let pending = 0;
    for (const visitor of Object.values(data.visitors)) {
      visits += visitor.visits;
      const geo = visitor.geo;
      if (!geo) pending += 1;
      const key = geo ? `${geo.city}|${geo.region}|${geo.country}` : 'pending';
      const row = cities.get(key) ?? { city: geo?.city ?? 'Locating…', region: geo?.region ?? '', country: geo?.country ?? '', local: Boolean(geo?.local), visitors: 0, visits: 0, lastVisited: null };
      row.visitors += 1;
      row.visits += visitor.visits;
      if (!row.lastVisited || visitor.last > row.lastVisited) row.lastVisited = visitor.last;
      cities.set(key, row);
    }
    const rows = [...cities.values()].sort((a, b) => b.visitors - a.visitors || b.visits - a.visits);
    return { ...totals(), visits, since: data.since, pending, topCity: rows.find((row) => row.city !== 'Locating…') ?? null, cities: rows };
  }

  /** Handles a museum API request; returns false for anything else. */
  return async function handle(req, res) {
    const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const route = path.match(/\/api\/(analytics\/status\.json|analytics\/visit|analytics\/heartbeat|analytics\/summary|admin\/login|site-data)$/)?.[1];
    if (!route) return false;
    try {
      if (route === 'analytics/status.json' && req.method === 'GET') return send(res, 200, { enabled: true, ...totals() }), true;
      if (req.method === 'POST' && (route === 'analytics/visit' || route === 'analytics/heartbeat')) {
        const id = tabId(await readBody(req, 2048));
        if (route === 'analytics/visit') visit(req);
        beat(id);
        return send(res, 200, totals()), true;
      }
      const token = req.headers['x-museum-admin'];
      if (route === 'admin/login' && req.method === 'POST') {
        await readBody(req, 2048);
        // Always 200 (a refusal is { ok: false }), so a mistyped password logs no browser error.
        return send(res, 200, { ok: sameToken(token) }), true;
      }
      if (route === 'analytics/summary' && req.method === 'GET') {
        if (!sameToken(token)) return send(res, 401, { error: 'unauthorised' }), true;
        return send(res, 200, summary()), true;
      }
      if (route === 'site-data' && req.method === 'POST') {
        if (!sameToken(token)) return send(res, 401, { error: 'unauthorised' }), true;
        const body = await readBody(req, 5 * 1024 * 1024);
        const parsed = JSON.parse(body);
        if (!parsed || parsed.version !== 1) return send(res, 400, { error: 'not museum site data' }), true;
        const target = join(siteRoot, 'site-data.json');
        writeFileSync(`${target}.tmp`, JSON.stringify(parsed, null, 2));
        renameSync(`${target}.tmp`, target);
        return send(res, 200, { ok: true, savedAt: new Date().toISOString() }), true;
      }
      return send(res, 405, { error: 'method not allowed' }), true;
    } catch (error) {
      return send(res, error.status ?? 400, { error: error.status === 413 ? 'too large' : 'bad request' }), true;
    }
  };
}
