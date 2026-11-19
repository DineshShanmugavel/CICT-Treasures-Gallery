import { useSyncExternalStore } from 'react';
import { setAdminTranslations } from '../i18n/index.js';
import { mediaUrl } from '../mediaUrl.js';
import { generatedNarration } from '../narration/generated.js';

/*
 * The museum's editable layer: what the admin portal (src/admin) changes, applied on top of
 * the default content in src/data whenever a room is read (getRoom → applyToRoom).
 *
 *   defaults (src/data)  ←  published edits (site-data.json beside index.html)  ←  draft
 *
 * - Published edits: `site-data.json` in the site's folder, which every visitor loads. It ships
 *   empty (public/site-data.json); the admin's "Export Site Data" file replaces it, or "Publish"
 *   writes it when the museum's Node server runs (public/serve-museum.mjs).
 * - Draft: the admin's own edits, kept in this browser's localStorage, so a change shows at once
 *   (also in other tabs of the museum) before it is exported or published.
 *
 * Shape (version 1):
 *   { version: 1, updatedAt,
 *     exhibits:   { <roomId>: { <exhibitId>: Exhibit } },
 *     catalogues: { <catalogue key>: "<pdf path or URL>" },
 *     settings:   { watermark: { en, ta, hi }, showWatermark, showTelemetry } }
 *   Exhibit: { added?, deleted?, visible?, gallery?, titleEn?, titleTa?, titleHi?, subtitle?,
 *              descEn?, descTa?, descHi?, image?, video?, audio?, pdf? }
 *   A default exhibit lists only what the admin changed; an added one (added: true) everything.
 */

export const DRAFT_KEY = 'cict-museum-site-data';
export const SITE_DATA_FILE = '/site-data.json';
export const ADMIN_GALLERY = { id: 'admin-additions', title: 'New Additions', tamil: 'புதிய சேர்க்கைகள்' };
const TEXT_FIELDS = ['titleEn', 'titleTa', 'titleHi', 'subtitle', 'descEn', 'descTa', 'descHi', 'image', 'video', 'audio', 'pdf', 'gallery'];
const FLAG_FIELDS = ['added', 'deleted', 'visible'];

export const emptySiteData = () => ({ version: 1, exhibits: {}, catalogues: {}, settings: {} });

/** A clean copy of site data from anywhere (an imported file, storage): unknown keys and wrong types are dropped. */
export function normalise(input) {
  const out = emptySiteData();
  if (!input || typeof input !== 'object') return out;
  if (typeof input.updatedAt === 'string') out.updatedAt = input.updatedAt;
  for (const [roomId, exhibits] of Object.entries(input.exhibits ?? {})) {
    if (!exhibits || typeof exhibits !== 'object') continue;
    for (const [id, exhibit] of Object.entries(exhibits)) {
      if (!exhibit || typeof exhibit !== 'object') continue;
      const clean = {};
      for (const key of TEXT_FIELDS) if (typeof exhibit[key] === 'string') clean[key] = exhibit[key].slice(0, 20000);
      for (const key of FLAG_FIELDS) if (typeof exhibit[key] === 'boolean') clean[key] = exhibit[key];
      if (Object.keys(clean).length) (out.exhibits[roomId] ??= {})[String(id).slice(0, 500)] = clean;
    }
  }
  for (const [key, url] of Object.entries(input.catalogues ?? {})) if (typeof url === 'string' && url.trim()) out.catalogues[key] = url.trim();
  const settings = input.settings ?? {};
  if (settings.watermark && typeof settings.watermark === 'object') {
    out.settings.watermark = {};
    for (const code of ['en', 'ta', 'hi']) if (typeof settings.watermark[code] === 'string') out.settings.watermark[code] = settings.watermark[code].slice(0, 200);
  }
  for (const key of ['showWatermark', 'showTelemetry']) if (typeof settings[key] === 'boolean') out.settings[key] = settings[key];
  return out;
}

/* ---- The store ------------------------------------------------------------------------- */

let published = emptySiteData();
let draft = readDraft();
let version = 0;
const listeners = new Set();
const roomCache = new Map();

function readDraft() {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    return raw ? normalise(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

function changed() {
  version += 1;
  roomCache.clear();
  registerTranslations();
  for (const listener of listeners) listener();
}

/** The site data in force: the draft in this browser if there is one, else the published file. */
export const siteData = () => draft ?? published;
export const publishedSiteData = () => published;
export const hasDraft = () => draft !== null;

export function subscribeSiteData(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
const getVersion = () => version;
/** Re-renders a component whenever the site data changes; returns the version number. */
export const useSiteDataVersion = () => useSyncExternalStore(subscribeSiteData, getVersion, getVersion);

/** Saves the admin's edits in this browser (they show at once, here and in other tabs). */
export function saveDraft(data) {
  draft = normalise({ ...data, updatedAt: new Date().toISOString() });
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    /* storage full or blocked: the edit still shows in this tab */
  }
  changed();
  return draft;
}

/** Drops this browser's draft: back to the published site data. */
export function discardDraft() {
  draft = null;
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* nothing stored */
  }
  changed();
}

/** "Reset to Default": a draft with no edits (export or publish it to clear the site too). */
export const resetToDefault = () => saveDraft(emptySiteData());

export const exportSiteData = () => JSON.stringify(siteData(), null, 2);

/** Reads an exported file into the draft. Throws if it is not museum site data. */
export function importSiteData(text) {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object' || parsed.version !== 1) throw new Error('This file is not CICT museum site data (version 1).');
  return saveDraft(parsed);
}

/** After a publish: the server's file is now the draft's content. */
export function markPublished(data) {
  published = normalise(data);
  discardDraft();
}

/* Load the published file once, at start (it always exists, so there is no 404). */
if (typeof window !== 'undefined') {
  fetch(mediaUrl(SITE_DATA_FILE), { cache: 'no-cache' })
    .then((response) => (response.ok ? response.json() : null))
    .then((data) => {
      if (!data) return;
      published = normalise(data);
      changed();
    })
    .catch(() => {});
  // The admin portal in another tab saved a change: show it here too.
  window.addEventListener('storage', (event) => {
    if (event.key !== DRAFT_KEY) return;
    draft = readDraft();
    changed();
  });
}

/* ---- Applying the edits ---------------------------------------------------------------- */

/** A media path or link the admin typed, as an address the page can use (null if unsafe or empty). */
export function resolveMedia(path) {
  const value = String(path ?? '').trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value) || /^data:image\//i.test(value)) return value;
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return null; // javascript:, file:, …
  let decoded = value;
  try {
    decoded = decodeURI(value);
  } catch {
    /* keep as typed */
  }
  return mediaUrl(decoded.startsWith('/') ? decoded : `/${decoded}`);
}

const has = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

/** An exhibit with the admin's changes, or null if it is hidden or deleted. */
function patchExhibit(artifact, edit) {
  if (!edit) return artifact;
  if (edit.deleted || edit.visible === false) return null;
  const next = { ...artifact, edited: true };
  if (has(edit, 'titleEn')) next.title = edit.titleEn;
  if (has(edit, 'titleTa')) next.tamil = edit.titleTa || null;
  if (has(edit, 'subtitle')) next.detail = edit.subtitle;
  if (has(edit, 'descEn')) next.note = edit.descEn || null;
  if (has(edit, 'descTa')) {
    next.tamilNote = edit.descTa || null;
    // A generated reading of the old Tamil text no longer matches: find the new text's, if any.
    if (edit.descTa !== artifact.tamilNote && String(artifact.narration ?? '').includes('/narration/ta/')) next.narration = generatedNarration(edit.descTa);
  }
  if (has(edit, 'image')) next.url = resolveMedia(edit.image) ?? artifact.url;
  if (has(edit, 'video')) next.video = resolveMedia(edit.video);
  if (has(edit, 'audio')) next.narration = resolveMedia(edit.audio);
  if (has(edit, 'pdf')) next.pdf = resolveMedia(edit.pdf);
  return next;
}

/** An exhibit the admin added, as the gallery shows it. */
export function addedExhibit(id, edit) {
  return {
    id,
    url: resolveMedia(edit.image),
    title: edit.titleEn || 'Untitled exhibit',
    detail: edit.subtitle ?? '',
    tamil: edit.titleTa || null,
    note: edit.descEn || null,
    tamilNote: edit.descTa || null,
    narration: resolveMedia(edit.audio) ?? generatedNarration(edit.descTa),
    video: resolveMedia(edit.video),
    pdf: resolveMedia(edit.pdf),
    added: true,
  };
}

/** A room with the site data's edits: exhibits changed, hidden, deleted or added. */
export function applyToRoom(room) {
  if (!room) return room;
  const edits = siteData().exhibits[room.id];
  if (!edits) return room;
  const cached = roomCache.get(room.id);
  if (cached && cached.source === room) return cached.room;
  const galleries = (room.galleries ?? []).map((gallery) => ({
    ...gallery,
    artifacts: gallery.artifacts.map((artifact) => patchExhibit(artifact, edits[artifact.id])).filter(Boolean),
  }));
  for (const [id, edit] of Object.entries(edits)) {
    if (!edit.added || edit.deleted || edit.visible === false) continue;
    let target = galleries.find((gallery) => gallery.id === edit.gallery && gallery.layout !== 'photobook');
    if (!target) {
      target = galleries.find((gallery) => gallery.id === ADMIN_GALLERY.id);
      if (!target) galleries.push((target = { ...ADMIN_GALLERY, artifacts: [] }));
    }
    target.artifacts = [...target.artifacts, addedExhibit(id, edit)];
  }
  const result = { ...room, galleries: galleries.filter((gallery) => gallery.artifacts.length || gallery.id !== ADMIN_GALLERY.id) };
  roomCache.set(room.id, { source: room, room: result });
  return result;
}

/** A Room Catalogue PDF chosen in the admin portal, or null for the default. */
export const catalogueOverride = (key) => resolveMedia(siteData().catalogues[key]);

/** Global settings with their defaults. */
export function siteSettings() {
  const settings = siteData().settings;
  return {
    watermark: settings.watermark ?? null,
    showWatermark: settings.showWatermark ?? true,
    showTelemetry: settings.showTelemetry ?? true,
  };
}

/** Hindi text the admin wrote, as translations of the exhibits' English text. */
function registerTranslations() {
  const entries = {};
  for (const exhibits of Object.values(siteData().exhibits)) {
    for (const edit of Object.values(exhibits)) {
      if (edit.descHi && edit.descEn) entries[edit.descEn] = edit.descHi;
      if (edit.titleHi && edit.titleEn) entries[edit.titleEn] = edit.titleHi;
    }
  }
  setAdminTranslations('hi', entries);
}
registerTranslations();
