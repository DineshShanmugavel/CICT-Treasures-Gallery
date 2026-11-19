// Collects the English display strings of the data modules (for the Hindi dictionary).
import { createServer } from 'vite';
import { readdirSync, writeFileSync } from 'node:fs';
const SKIP_KEYS = /^(id|key|url|src|href|folder|file|accent|color|colour|glyph|icon|model|audio|pdf|image|images|cover|path|slug|kind|side|tamil|ta|taText|tamilNote|tamilDescription|headingTa|titleTa|roleTa|sideTa|nameTa|tamilTitle|lat|lng|coords)$/i;
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const out = {};
const seen = new WeakSet();
const isEnglish = (s) => /[A-Za-z]{2}/.test(s) && !/[\u0B80-\u0BFF]{3}/.test(s.replace(/[\u0B80-\u0BFF]+/g, (m) => (m.length < 40 ? 'x' : m))) && !/^(\/|https?:|data:|#[0-9a-f]{3,8}$|[\w-]+\.(jpe?g|png|webp|glb|mp3|pdf|json)$)/i.test(s) && !/^[a-z0-9-]+$/.test(s);
function walk(v, key, file) {
  if (typeof v === 'string') { if (!SKIP_KEYS.test(key ?? '') && isEnglish(v)) (out[file] ??= new Set()).add(v); return; }
  if (!v || typeof v !== 'object' || seen.has(v)) return;
  seen.add(v);
  if (Array.isArray(v)) v.forEach((x) => walk(x, key, file)); else for (const [k, x] of Object.entries(v)) walk(x, k, file);
}
for (const f of readdirSync('src/data').filter((f) => f.endsWith('.js'))) {
  if (/thirukkural|kuralData|kuralAudio/.test(f)) continue;
  const mod = await server.ssrLoadModule('/src/data/' + f);
  for (const [k, v] of Object.entries(mod)) walk(v, k, f);
}
await server.close();
const result = Object.fromEntries(Object.entries(out).map(([f, s]) => [f, [...s]]));
writeFileSync(process.argv[2], JSON.stringify(result, null, 1));
for (const [f, s] of Object.entries(result)) console.log(f, s.length, s.join('').length);
console.log('total', Object.values(result).flat().length, Object.values(result).flat().join('').length);
