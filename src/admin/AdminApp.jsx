import React, { useEffect, useRef, useState } from 'react';
import { Activity, ArrowLeft, Building2, CloudUpload, Download, FolderOpen, Landmark, Lock, LogOut, RotateCcw, Settings, Upload, Undo2 } from 'lucide-react';
import CICT_LOGO from '../assets/cict-logo.jpg';
import { analyticsAvailable, publishSiteData, verifyAdmin } from '../analytics/analytics.js';
import { discardDraft, exportSiteData, hasDraft, importSiteData, markPublished, resetToDefault, siteData, useSiteDataVersion } from '../siteData/siteData.js';
import AnalyticsPanel from './AnalyticsPanel.jsx';
import ExhibitManager from './ExhibitManager.jsx';
import MediaPanel from './MediaPanel.jsx';
import SettingsPanel from './SettingsPanel.jsx';
import { ADMIN_HALLS } from './adminModel.js';
import { sha256Hex } from './sha256.js';
import { Button, Field, glass } from './ui.jsx';

/*
 * The 2D Admin Portal (#/admin or /admin). It never loads the 3D museum (main.jsx renders it in
 * the museum's place), so it opens instantly even on machines without WebGL.
 *
 * Sign-in: SHA-256 of "<user>:<password>" — only the hash is in the code, never the password.
 * With the museum's Node server running, the server checks it (and can be given other credentials:
 * MUSEUM_ADMIN_USER / MUSEUM_ADMIN_PASSWORD); on a purely static host the built-in hash is used.
 * The session lasts until the tab closes (sessionStorage). Edits are saved in this browser
 * (siteData.js) and reach visitors only through Export → site-data.json, or Publish (server).
 */

const SESSION_KEY = 'cict-museum-admin';
const BUILT_IN_TOKEN = 'c0ad35a583e1ac1da3a9c043a4d69f86855f7041bb668bea48cc8d5b1d9f7cf0';

const readSession = () => {
  try {
    return sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
};

/** Leaves the portal for the 3D museum (same folder, no #/admin). */
export function backToMuseum() {
  const { pathname, search } = window.location;
  if (/\/admin\/?$/.test(pathname)) {
    window.location.assign(pathname.replace(/admin\/?$/, '') + search);
    return;
  }
  window.history.replaceState(null, '', pathname + search);
  window.dispatchEvent(new Event('museum:route'));
}

export default function AdminApp() {
  const [token, setToken] = useState(readSession);
  useEffect(() => {
    document.title = 'Admin Portal · CICT Tamil Treasures Gallery';
  }, []);
  const logout = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* nothing stored */
    }
    setToken(null);
  };
  return (
    <div className="fixed inset-0 overflow-y-auto bg-[#0d0805] bg-[radial-gradient(ellipse_at_20%_-10%,#4a2410_0%,transparent_55%),radial-gradient(ellipse_at_100%_100%,#2a1408_0%,transparent_50%)] font-sans text-[#f3e6c8]" data-admin-portal>
      {token ? <Portal token={token} onLogout={logout} /> : <Login onSignedIn={setToken} />}
    </div>
  );
}

function Login({ onSignedIn }) {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const failures = useRef(0);

  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    // A pause that grows after each wrong attempt.
    await new Promise((resolve) => setTimeout(resolve, Math.min(4000, failures.current * 800)));
    const token = await sha256Hex(`${user.trim()}:${password}`);
    const server = await verifyAdmin(token);
    const ok = server ?? token === BUILT_IN_TOKEN;
    setBusy(false);
    if (!ok) {
      failures.current += 1;
      setError('The username or password is not correct.');
      return;
    }
    try {
      sessionStorage.setItem(SESSION_KEY, token);
    } catch {
      /* private mode: signed in for this page only */
    }
    onSignedIn(token);
  };

  return (
    <main className="grid min-h-full place-items-center px-4 py-10">
      <form onSubmit={submit} className={`${glass} flex w-full max-w-sm flex-col gap-4 p-6 sm:p-8`} data-admin-login>
        <div className="flex flex-col items-center gap-3 text-center">
          <img src={CICT_LOGO} alt="CICT emblem" className="size-20 rounded-full bg-white object-cover shadow-[0_0_0_3px_#d4a64a,0_0_28px_#f4d79244]" />
          <div>
            <p lang="ta" className="m-0 text-sm font-bold text-[#e9a27a]">நிர்வாகப் பகுதி</p>
            <h1 className="m-0 font-serif text-2xl font-bold text-temple-gold-light">Admin Portal</h1>
            <p className="m-0 mt-1 text-xs text-[#c9b48c]">CICT Classical Tamil Treasures Gallery</p>
          </div>
        </div>
        <Field label="Username" autoComplete="username" value={user} onChange={(event) => setUser(event.target.value)} required autoFocus name="username" />
        <Field label="Password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required name="password" />
        {error && (
          <p role="alert" className="m-0 rounded-lg border border-[#d36a4a]/60 bg-[#3a140a]/60 px-3 py-2 text-sm text-[#ffb59e]">
            {error}
          </p>
        )}
        <Button variant="gold" type="submit" disabled={busy} className="py-2.5 text-sm">
          <Lock size={14} /> {busy ? 'Signing in…' : 'Sign in'}
        </Button>
        <button type="button" onClick={backToMuseum} className="cursor-pointer border-0 bg-transparent text-xs text-[#c9b48c] underline-offset-4 hover:text-temple-gold-light hover:underline">
          ← Back to the 3D Museum
        </button>
      </form>
    </main>
  );
}

const SECTIONS = [
  { id: 'analytics', label: 'Visitor Analytics', tamil: 'பார்வையாளர்கள்', icon: Activity, group: 'Overview' },
  ...ADMIN_HALLS.map((hall) => ({ id: `hall:${hall.id}`, label: hall.title, tamil: hall.tamil, icon: hall.id === 'shrine' ? Landmark : Building2, group: 'Museum Halls', hall })),
  { id: 'media', label: 'Media & Catalogue Manager', tamil: 'ஊடகம் & கையேடுகள்', icon: FolderOpen, group: 'Manage' },
  { id: 'settings', label: 'Global Settings / Watermarks', tamil: 'பொது அமைப்புகள்', icon: Settings, group: 'Manage' },
];

function Portal({ token, onLogout }) {
  const [section, setSection] = useState('analytics');
  const active = SECTIONS.find((s) => s.id === section) ?? SECTIONS[0];
  const groups = [...new Set(SECTIONS.map((s) => s.group))];
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-temple-gold/30 bg-[#120a05]/85 px-4 py-2.5 backdrop-blur-md sm:px-6">
        <img src={CICT_LOGO} alt="CICT emblem" className="size-10 shrink-0 rounded-full bg-white object-cover shadow-[0_0_0_2px_#d8b56b,0_0_18px_#f4d79244]" />
        <div className="min-w-0 flex-1">
          <p lang="ta" className="m-0 truncate text-[11px] font-bold text-[#e9a27a]">செம்மொழிப் பண்பாட்டுக் காட்சியகம் · நிர்வாகம்</p>
          <p className="m-0 truncate font-serif text-lg leading-tight font-bold text-temple-gold-light">Admin Portal</p>
        </div>
        <Button onClick={backToMuseum} data-admin-back>
          <ArrowLeft size={14} /> <span className="hidden sm:inline">Back to 3D Museum</span>
        </Button>
        <Button variant="danger" onClick={onLogout} data-admin-logout>
          <LogOut size={14} /> <span className="hidden sm:inline">Logout</span>
        </Button>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        <nav aria-label="Admin sections" className="border-b border-temple-gold/20 bg-[#120a05]/60 md:sticky md:top-[61px] md:h-[calc(100dvh-61px)] md:w-72 md:shrink-0 md:overflow-y-auto md:border-r md:border-b-0">
          <div className="flex gap-1 overflow-x-auto p-2 md:flex-col md:gap-0 md:p-3">
            {groups.map((group) => (
              <div key={group} className="contents md:mb-3 md:block">
                <p className="m-0 hidden px-3 pt-2 pb-1 text-[10px] font-bold tracking-[0.18em] text-temple-gold/80 uppercase md:block">{group}</p>
                {SECTIONS.filter((s) => s.group === group).map((s) => {
                  const Icon = s.icon;
                  const on = s.id === section;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSection(s.id)}
                      aria-current={on ? 'page' : undefined}
                      data-admin-section={s.id}
                      className={`flex shrink-0 cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-sm transition-colors md:w-full ${
                        on ? 'border-temple-gold/60 bg-temple-gold/15 text-temple-gold-light' : 'border-transparent text-[#e6d5b2] hover:bg-temple-gold/10'
                      }`}
                    >
                      <Icon size={16} className="shrink-0 text-temple-gold" />
                      <span className="flex min-w-0 flex-col whitespace-nowrap md:whitespace-normal">
                        <span className="font-semibold">{s.label}</span>
                        <span lang="ta" className="hidden text-[11px] text-[#e9a27a]/90 md:block">{s.tamil}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </nav>

        <main className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:p-6">
          <SiteDataBar token={token} />
          {active.id === 'analytics' && <AnalyticsPanel token={token} onUnauthorised={onLogout} />}
          {active.hall && <ExhibitManager key={active.id} hall={active.hall} />}
          {active.id === 'media' && <MediaPanel />}
          {active.id === 'settings' && <SettingsPanel />}
        </main>
      </div>
    </div>
  );
}

/** Where the edits are (this browser / published), and Export · Import · Reset · Publish. */
function SiteDataBar({ token }) {
  useSiteDataVersion();
  const fileInput = useRef(null);
  const [server, setServer] = useState(false);
  const [message, setMessage] = useState(null);
  useEffect(() => {
    analyticsAvailable().then(setServer);
  }, []);
  const draft = hasDraft();
  const count = Object.values(siteData().exhibits).reduce((n, room) => n + Object.keys(room).length, 0);

  const exportFile = () => {
    const blob = new Blob([exportSiteData()], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'site-data.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    setMessage({ ok: true, text: 'Downloaded site-data.json. Copy it into the museum folder on the server (replacing the old one) to show these edits to every visitor.' });
  };
  const importFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      importSiteData(await file.text());
      setMessage({ ok: true, text: `Imported ${file.name}. The museum in this browser now shows it; Export or Publish to make it permanent.` });
    } catch (error) {
      setMessage({ ok: false, text: error.message || 'That file could not be read.' });
    }
  };
  const reset = () => {
    if (!window.confirm('Reset all exhibits, catalogues and settings to the museum’s defaults? (Export first if you may want them back.)')) return;
    resetToDefault();
    setMessage({ ok: true, text: 'Reset to the defaults in this browser. Export or Publish to clear the server’s edits too.' });
  };
  const publish = async () => {
    try {
      const json = exportSiteData();
      await publishSiteData(token, json);
      markPublished(JSON.parse(json));
      setMessage({ ok: true, text: 'Published: every visitor now sees these edits.' });
    } catch (error) {
      setMessage({ ok: false, text: error.message });
    }
  };

  return (
    <div className={`${glass} flex flex-col gap-2 px-4 py-3`} data-admin-sitedata>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-[0.1em] uppercase ${draft ? 'border-amber-400/60 text-amber-300' : 'border-emerald-400/50 text-emerald-300'}`}>
          <span className={`size-1.5 rounded-full ${draft ? 'bg-amber-300' : 'bg-emerald-300'}`} />
          {draft ? 'Unpublished edits in this browser' : 'Showing the published site data'}
        </span>
        <span className="text-xs text-[#c9b48c]">{count} exhibit edit{count === 1 ? '' : 's'}</span>
        <div className="ml-auto flex flex-wrap gap-2">
          {server && (
            <Button variant="gold" onClick={publish} title="Write these edits to the server's site-data.json" data-admin-publish>
              <CloudUpload size={14} /> Publish to server
            </Button>
          )}
          <Button onClick={exportFile} data-admin-export>
            <Download size={14} /> Export Site Data (JSON)
          </Button>
          <Button onClick={() => fileInput.current?.click()} data-admin-import>
            <Upload size={14} /> Import Site Data (JSON)
          </Button>
          <input ref={fileInput} type="file" accept="application/json,.json" className="hidden" onChange={importFile} />
          {draft && (
            <Button onClick={() => { discardDraft(); setMessage({ ok: true, text: 'Discarded this browser’s edits: showing the published site data.' }); }} title="Forget this browser's unpublished edits">
              <Undo2 size={14} /> Discard draft
            </Button>
          )}
          <Button variant="danger" onClick={reset} data-admin-reset>
            <RotateCcw size={14} /> Reset to Default
          </Button>
        </div>
      </div>
      {message && <p className={`m-0 text-xs ${message.ok ? 'text-temple-gold-light' : 'text-[#ffb59e]'}`}>{message.text}</p>}
    </div>
  );
}
