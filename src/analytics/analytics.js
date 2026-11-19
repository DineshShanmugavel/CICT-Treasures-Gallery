import { useSyncExternalStore } from 'react';
import { IS_WEB } from '../platform.js';

/*
 * Visitor analytics, website only (never in the Capacitor app: IS_WEB, and the app build drops
 * this module's work entirely). The museum's Node server (deploy/museum-analytics.mjs) counts:
 *
 *   - a visit when the museum opens (unique views are counted by IP on the server),
 *   - a heartbeat every 30 s while the tab is in view (live users).
 *
 * First the page reads api/analytics/status.json. A plain static host serves the shipped file,
 * { "enabled": false }, and nothing more is sent — so there are never failed requests or console
 * errors without the server. With the server, the same address answers { enabled: true, … }.
 */

const ROOT = (import.meta.env.BASE_URL ?? '/').replace(/\/?$/, '/');
export const apiUrl = (path) => `${ROOT}api/${path}`;
const HEARTBEAT_MS = 30_000;

let state = { enabled: false, live: null, views: null };
const listeners = new Set();
const set = (next) => {
  state = { ...state, ...next };
  for (const listener of listeners) listener();
};
const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const snapshot = () => state;
/** { enabled, live, views } — enabled only on the website with the analytics server running. */
export const useAnalytics = () => useSyncExternalStore(subscribe, snapshot, snapshot);

/** This tab's id (kept for the tab's life), so one tab counts as one live user. */
function tabId() {
  try {
    let id = sessionStorage.getItem('cict-museum-tab');
    if (!id) {
      const bytes = new Uint8Array(12);
      crypto.getRandomValues(bytes);
      id = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
      sessionStorage.setItem('cict-museum-tab', id);
    }
    return id;
  } catch {
    return `tab-${Math.random().toString(36).slice(2, 14)}`;
  }
}

async function post(path) {
  const response = await fetch(apiUrl(path), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sid: tabId() }), keepalive: true });
  if (response.ok) set(await response.json());
}

/** Is the analytics server there? Resolves true / false (never throws). */
let statusRequest = null;
export function analyticsAvailable() {
  if (!IS_WEB) return Promise.resolve(false);
  statusRequest ??= fetch(apiUrl('analytics/status.json'), { cache: 'no-store' })
    .then((response) => (response.ok ? response.json() : null))
    .then((status) => Boolean(status?.enabled))
    .catch(() => false);
  return statusRequest;
}

let started = false;
/** Starts counting this visit (once). Does nothing in the app or without the server. */
export async function startAnalytics() {
  if (!IS_WEB || started) return;
  started = true;
  if (!(await analyticsAvailable())) return;
  set({ enabled: true });
  await post('analytics/visit').catch(() => {});
  let timer = 0;
  const beat = () => post('analytics/heartbeat').catch(() => {});
  const run = () => {
    window.clearInterval(timer);
    if (document.visibilityState === 'visible') {
      timer = window.setInterval(beat, HEARTBEAT_MS);
    }
  };
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') beat();
    run();
  });
  run();
}

/* ---- Admin ------------------------------------------------------------------------------ */

const adminHeaders = (token) => ({ 'Content-Type': 'application/json', 'X-Museum-Admin': token });

/** The server's verdict on the credentials (true / false), or null when there is no server. */
export async function verifyAdmin(token) {
  if (!(await analyticsAvailable())) return null;
  try {
    const response = await fetch(apiUrl('admin/login'), { method: 'POST', headers: adminHeaders(token), body: '{}' });
    if (!response.ok) return null;
    return Boolean((await response.json()).ok);
  } catch {
    return null;
  }
}

/** Live users, unique views and the city-wise table (admin only), or null without the server. */
export async function fetchSummary(token) {
  if (!(await analyticsAvailable())) return null;
  const response = await fetch(apiUrl('analytics/summary'), { headers: adminHeaders(token), cache: 'no-store' });
  if (response.status === 401) throw new Error('unauthorised');
  return response.ok ? response.json() : null;
}

/** Writes the site data to the server's site-data.json (admin only). */
export async function publishSiteData(token, json) {
  const response = await fetch(apiUrl('site-data'), { method: 'POST', headers: adminHeaders(token), body: json });
  if (!response.ok) throw new Error(response.status === 401 ? 'The server did not accept the admin credentials.' : `The server could not save it (${response.status}).`);
  return response.json();
}
