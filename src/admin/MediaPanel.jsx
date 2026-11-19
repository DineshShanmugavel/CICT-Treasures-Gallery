import React, { useState } from 'react';
import { ExternalLink, FileText, RotateCcw, Save } from 'lucide-react';
import { mediaUrl } from '../mediaUrl.js';
import { resolveMedia, saveDraft, siteData, useSiteDataVersion } from '../siteData/siteData.js';
import { CATALOGUE_LABELS, ROOM_CATALOGUES } from './adminModel.js';
import { Button, Field, Panel, glass } from './ui.jsx';

/** Media & Catalogue Manager: each hall's Room Catalogue PDF, and a checker for media paths. */
export default function MediaPanel() {
  useSiteDataVersion();
  const saved = siteData().catalogues;
  const [values, setValues] = useState(() => Object.fromEntries(Object.keys(ROOM_CATALOGUES).map((key) => [key, saved[key] ?? ''])));
  const [message, setMessage] = useState('');

  const save = () => {
    for (const [key, value] of Object.entries(values)) {
      if (value.trim() && !resolveMedia(value)) return setMessage(`“${CATALOGUE_LABELS[key]}”: use a path in the museum folder or an https:// link.`);
    }
    const data = structuredClone(siteData());
    data.catalogues = Object.fromEntries(Object.entries(values).filter(([, value]) => value.trim()).map(([key, value]) => [key, value.trim()]));
    saveDraft(data);
    setMessage('Saved. The Room Catalogue buttons in the museum now open these PDFs.');
  };

  return (
    <div className="flex flex-col gap-4">
      <Panel
        title="Room Catalogue PDFs"
        tamil="அறைக் கையேடுகள்"
        actions={
          <Button variant="gold" onClick={save}>
            <Save size={14} /> Save catalogues
          </Button>
        }
      >
        <p className="m-0 mb-4 text-sm text-[#e6d5b2]">Each hall’s top-bar “Room Catalogue (PDF)” button opens its catalogue. Leave a box empty to keep the museum’s own PDF; enter a path in the museum folder (e.g. <code className="text-temple-gold-light">/room-pdfs/new.pdf</code>) or an https:// link to replace it.</p>
        <div className="flex flex-col gap-3">
          {Object.entries(ROOM_CATALOGUES).map(([key, file]) => {
            const current = resolveMedia(values[key]) ?? mediaUrl(`/room-pdfs/${file}`);
            return (
              <div key={key} className={`${glass} grid items-end gap-3 rounded-xl p-3 md:grid-cols-[220px_minmax(0,1fr)_auto]`}>
                <div>
                  <p className="m-0 text-sm font-semibold text-temple-gold-light">{CATALOGUE_LABELS[key]}</p>
                  <p className="m-0 truncate text-[11px] text-[#c9b48c]">Default: {file}</p>
                </div>
                <Field label="Replacement PDF (optional)" value={values[key]} placeholder={`/room-pdfs/${file}`} onChange={(event) => setValues((v) => ({ ...v, [key]: event.target.value }))} />
                <div className="flex gap-2">
                  <a href={current} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-full border border-temple-gold/50 px-3 py-1.5 text-xs font-semibold text-temple-gold-light hover:bg-temple-gold/15">
                    <ExternalLink size={12} /> Open
                  </a>
                  {values[key] && (
                    <Button onClick={() => setValues((v) => ({ ...v, [key]: '' }))} title="Use the default PDF">
                      <RotateCcw size={12} />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {message && <p className="m-0 mt-3 text-sm text-temple-gold-light">{message}</p>}
      </Panel>
      <MediaChecker />
    </div>
  );
}

/** Try a media path before using it in an exhibit: shows the image, plays the sound or film, or links the PDF. */
function MediaChecker() {
  const [path, setPath] = useState('');
  const [state, setState] = useState('');
  const url = resolveMedia(path);
  const kind = /\.(mp3|m4a|ogg|wav)$/i.test(path) ? 'audio' : /\.(mp4|webm|mov)$/i.test(path) ? 'video' : /\.pdf$/i.test(path) ? 'pdf' : 'image';
  return (
    <Panel title="Media path checker" tamil="ஊடகக் கோப்புச் சரிபார்ப்பு">
      <p className="m-0 mb-3 text-sm text-[#e6d5b2]">Paths are relative to the museum folder, as on the server: <code className="text-temple-gold-light">/Ancient Pottery/…jpg</code>, <code className="text-temple-gold-light">/Audio/…mp3</code>, <code className="text-temple-gold-light">/room-pdfs/…pdf</code>. New files must be copied into that folder on the server.</p>
      <Field label="Path or link" value={path} onChange={(event) => { setPath(event.target.value); setState(''); }} placeholder="/Ancient Pottery/Burial urn — Adichanallur.jpg" />
      {path.trim() && !url && <p className="m-0 mt-3 text-sm text-[#ffb59e]">This kind of address is not allowed.</p>}
      {url && (
        <div className={`${glass} mt-3 flex min-h-32 items-center justify-center rounded-xl p-3`}>
          {kind === 'image' && <img key={url} src={url} alt="" onLoad={() => setState('ok')} onError={() => setState('missing')} className="max-h-72 max-w-full object-contain" />}
          {kind === 'audio' && <audio key={url} src={url} controls onLoadedMetadata={() => setState('ok')} onError={() => setState('missing')} className="w-full" />}
          {kind === 'video' && <video key={url} src={url} controls onLoadedMetadata={() => setState('ok')} onError={() => setState('missing')} className="max-h-72 max-w-full" />}
          {kind === 'pdf' && (
            <a href={url} target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-temple-gold-light underline">
              <FileText size={16} /> Open the PDF
            </a>
          )}
        </div>
      )}
      {state && <p className={`m-0 mt-2 text-sm ${state === 'ok' ? 'text-emerald-300' : 'text-[#ffb59e]'}`}>{state === 'ok' ? 'Found: this path works.' : 'Not found at this path (check the folder and file name, including spaces and capitals).'}</p>}
    </Panel>
  );
}
