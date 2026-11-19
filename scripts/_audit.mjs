import { createServer } from 'vite';
import { readFileSync, readdirSync } from 'node:fs';
process.env.VITE_TRANSLATE_URL = 'off';
const vite = await createServer({ server: { middlewareMode: true, hmr: false, watch: null }, appType: 'custom', logLevel: 'error', optimizeDeps: { noDiscovery: true, include: [] } });
const L = (p) => vite.ssrLoadModule(p);
const rb = await L('/src/data/roomBooks.js'), ex = await L('/src/data/exhibitionTexts.js'), bi = await L('/src/data/bookInfo.js'), he = await L('/src/data/hallExhibits.js'), tn = await L('/src/data/thenAndNow.js'), tk = await L('/src/data/tamilakam.js');
await vite.close();
const briefs = []; // {where, en, ta}
const add = (where, en, ta) => briefs.push({ where, en, ta });
for (const room of Object.values(rb.roomBooks)) {
  add(`room ${room.id}`, room.description, room.tamilDescription);
  for (const p of ex.ROOM_PANELS[room.id] ?? []) { add(`panel ${room.id}/${p.id} title`, p.title.en, p.title.ta); add(`panel ${room.id}/${p.id}`, p.body.en, p.body.ta); }
  for (const g of room.galleries ?? []) { add(`gallery ${g.id}`, g.title, g.tamil); for (const a of g.artifacts) { add(`artifact ${a.id} title`, a.title, a.tamil); add(`artifact ${a.id}`, a.note, a.tamilNote); } }
  for (const s of room.olaiShelves ?? []) for (const b of s.bundles) add(`bundle ${b.folder}`, b.description?.en, b.description?.ta);
  for (const c of room.cabinets ?? []) for (const b of c.books) { const d = b.description ?? bi.works[b.work] ?? bi.works.rareArchive; add(`book ${b.id}`, d.en, d.ta); }
}
for (const [k, x] of Object.entries(he.HALL_EXHIBITS)) add(`centrepiece ${k}`, x.en, x.taText);
for (const p of tn.THEN_NOW_PLACES) for (const [k, s] of Object.entries(p.sections)) add(`place ${p.id} ${k}`, s.en, s.ta);
for (const p of tk.TAMILAKAM_PLACES) for (const k of ['period', 'description', 'significance', 'evidence']) if (p[k]) add(`map ${p.id} ${k}`, p[k].en, p[k].ta);
const uniq = new Map(); for (const b of briefs) if (!uniq.has(b.where)) uniq.set(b.where, b);
const all = [...uniq.values()];
const noTa = all.filter((b) => b.en && !b.ta), noEn = all.filter((b) => b.ta && !b.en), none = all.filter((b) => !b.en && !b.ta && /^artifact .*[^e]$/.test(b.where));
console.log('briefings', all.length, 'missing Tamil', noTa.length, 'missing English', noEn.length, 'empty artifact descriptions', none.length);
console.log(noTa.map((b) => b.where).join('\n'));
console.log('--- empty:'); console.log(none.map((b) => b.where).join('\n'));
const key = (t) => t.replace(/\s+/g, ' ').trim();
const ens = [...new Set(all.filter((b) => b.en).map((b) => key(b.en)))];
const dir = 'src/i18n/locales';
const rows = readdirSync(dir).map((f) => { const pack = JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')); const keys = new Map(Object.entries(pack).map(([k, v]) => [key(k), v])); const miss = ens.filter((e) => !keys.get(e)); const same = ens.filter((e) => keys.get(e) === e && /[a-z]{4}/.test(e) && e.length > 30); return [f, miss.length, same.length]; });
console.log('english briefing texts', ens.length);
console.log(rows.filter((r) => r[1] || r[2] > 20).map((r) => r.join(' ')).join('\n') || 'all packs complete');
