import React, { useMemo, useState } from 'react';
import { ArrowLeft, Eye, EyeOff, ImageOff, Pencil, Plus, RotateCcw, Save, Trash2 } from 'lucide-react';
import { addedExhibit, resolveMedia, saveDraft, siteData, useSiteDataVersion } from '../siteData/siteData.js';
import { BLANK_EXHIBIT, FIELDS, defaultsOf, exhibitsOf, gallerySlots, newExhibitId, roomsOf } from './adminModel.js';
import { Badge, Button, Field, Panel, Select, Toggle, glass } from './ui.jsx';

/** Writes one exhibit's edit (or removes it with `null`) into the draft. */
function writeEdit(roomId, id, edit) {
  const data = structuredClone(siteData());
  const room = (data.exhibits[roomId] ??= {});
  if (edit) room[id] = edit;
  else delete room[id];
  if (!Object.keys(room).length) delete data.exhibits[roomId];
  saveDraft(data);
}

/** A hall's rooms and their exhibits: add, edit, hide, delete, restore. */
export default function ExhibitManager({ hall }) {
  useSiteDataVersion();
  const rooms = useMemo(() => roomsOf(hall), [hall]);
  const [roomId, setRoomId] = useState(rooms[0]?.id ?? null);
  const [editing, setEditing] = useState(null); // { id, isNew }
  const room = rooms.find((r) => r.id === roomId) ?? rooms[0];

  if (!room) {
    return (
      <Panel title={hall.title} tamil={hall.tamil}>
        <p className="m-0 text-sm leading-relaxed text-[#e6d5b2]">
          The {hall.title} is the museum’s hub: its corridors lead to the exhibition halls and it holds no room exhibits of its own. Its Room Catalogue PDF can be changed in <b>Media &amp; Catalogue Manager</b>, and the credit under its mini-map in <b>Global Settings</b>.
        </p>
      </Panel>
    );
  }

  const exhibits = exhibitsOf(room);
  const current = editing && (editing.isNew ? null : exhibits.find((x) => x.id === editing.id));

  return (
    <div className="flex flex-col gap-4">
      <Panel title={hall.title} tamil={hall.tamil}>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Rooms">
          {rooms.map((r) => (
            <button
              key={r.id}
              type="button"
              role="tab"
              aria-selected={r.id === room.id}
              onClick={() => {
                setRoomId(r.id);
                setEditing(null);
              }}
              className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                r.id === room.id ? 'border-temple-gold bg-temple-gold/20 text-temple-gold-light' : 'border-temple-gold/30 text-[#e0cda6] hover:bg-temple-gold/10'
              }`}
              data-admin-room={r.id}
            >
              {r.title} <span lang="ta" className="ml-1 opacity-70">{r.tamil}</span>
            </button>
          ))}
        </div>
      </Panel>

      {editing ? (
        <ExhibitEditor key={`${room.id}/${editing.id}`} room={room} entry={current} isNew={editing.isNew} id={editing.id} onDone={() => setEditing(null)} />
      ) : (
        <Panel
          title={room.title}
          tamil={`${room.tamil} · ${exhibits.filter((x) => x.status !== 'deleted' && x.status !== 'hidden').length} on show`}
          actions={
            <Button variant="gold" onClick={() => setEditing({ id: newExhibitId(), isNew: true })} data-admin-add>
              <Plus size={14} /> Add exhibit
            </Button>
          }
        >
          {exhibits.length === 0 ? (
            <p className="m-0 text-sm text-[#e6d5b2]">This room shows books, manuscripts or a special display rather than exhibit photographs. Exhibits added here appear in a “New Additions” gallery in the room.</p>
          ) : (
            <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3 p-0">
              {exhibits.map((entry) => (
                <ExhibitTile key={entry.id} entry={entry} room={room} onEdit={() => setEditing({ id: entry.id, isNew: false })} />
              ))}
            </ul>
          )}
        </Panel>
      )}
    </div>
  );
}

function ExhibitTile({ entry, room, onEdit }) {
  const { values, status } = entry;
  const image = resolveMedia(values.image);
  const off = status === 'deleted' || status === 'hidden';
  return (
    <li className={`${glass} flex flex-col overflow-hidden rounded-xl p-0 ${off ? 'opacity-60' : ''}`} data-admin-exhibit={entry.id}>
      <div className="relative aspect-[4/3] bg-[radial-gradient(ellipse_at_50%_25%,#5a2e14,#1c0d05_78%)]">
        {image ? <img src={image} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-contain p-2" /> : <ImageOff className="absolute inset-0 m-auto text-temple-gold/40" size={26} />}
        <span className="absolute top-2 left-2">
          <Badge status={status} />
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="m-0 line-clamp-2 font-serif text-base leading-tight font-bold text-temple-gold-light">{values.titleEn || 'Untitled'}</p>
        {values.titleTa && <p lang="ta" className="m-0 line-clamp-1 text-xs text-[#e9a27a]">{values.titleTa}</p>}
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          <Button onClick={onEdit} data-admin-edit={entry.id}>
            <Pencil size={12} /> Edit
          </Button>
          {status === 'deleted' || (status !== 'added' && entry.edit) ? (
            <Button onClick={() => writeEdit(room.id, entry.id, null)} title="Undo all edits to this exhibit">
              <RotateCcw size={12} /> Restore
            </Button>
          ) : null}
          {status !== 'deleted' && (
            <Button
              onClick={() => writeEdit(room.id, entry.id, { ...(entry.edit ?? {}), visible: status === 'hidden' })}
              title={status === 'hidden' ? 'Show in the museum' : 'Hide from the museum'}
            >
              {status === 'hidden' ? <Eye size={12} /> : <EyeOff size={12} />}
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}

/** The form for one exhibit, with a live preview of its card and close-up text. */
function ExhibitEditor({ room, entry, isNew, id, onDone }) {
  const defaults = entry?.artifact ? defaultsOf(entry.artifact) : BLANK_EXHIBIT;
  const slots = gallerySlots(room);
  const [values, setValues] = useState(entry?.values ?? BLANK_EXHIBIT);
  const [visible, setVisible] = useState(entry ? entry.status !== 'hidden' : true);
  const [gallery, setGallery] = useState(entry?.edit?.gallery ?? slots[0]?.id);
  const [error, setError] = useState('');
  const set = (key) => (event) => setValues((v) => ({ ...v, [key]: event.target.value }));
  const added = isNew || entry?.status === 'added' || entry?.edit?.added;

  const save = () => {
    if (!values.titleEn.trim()) return setError('An English title is needed.');
    for (const key of ['image', 'video', 'audio', 'pdf']) {
      if (values[key].trim() && !resolveMedia(values[key])) return setError(`The ${key} path is not allowed: use a path in the museum folder (/Folder/file.jpg) or an https:// link.`);
    }
    let edit;
    if (added) {
      edit = { added: true, gallery, visible };
      for (const key of FIELDS) if (values[key].trim()) edit[key] = values[key].trim();
    } else {
      // A default exhibit keeps only what changed (so later changes to the defaults still show).
      edit = {};
      for (const key of FIELDS) if (values[key].trim() !== (defaults[key] ?? '').trim()) edit[key] = values[key].trim();
      // Hindi text is a translation of the English: keep the English it belongs to with it.
      if (edit.descHi) edit.descEn = values.descEn.trim();
      if (edit.titleHi) edit.titleEn = values.titleEn.trim();
      if (!visible) edit.visible = false;
    }
    writeEdit(room.id, id, added || Object.keys(edit).length ? edit : null);
    onDone();
  };

  const remove = () => {
    const message = added ? 'Delete this added exhibit?' : 'Remove this exhibit from the museum? (It can be restored later.)';
    if (!window.confirm(message)) return;
    writeEdit(room.id, id, added ? null : { deleted: true });
    onDone();
  };

  const preview = addedExhibit(id, values);
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
      <Panel
        title={isNew ? 'Add an exhibit' : 'Edit exhibit'}
        tamil={`${room.title} · ${room.tamil}`}
        actions={
          <Button onClick={onDone}>
            <ArrowLeft size={13} /> Back to the room
          </Button>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Title (English)" value={values.titleEn} onChange={set('titleEn')} required data-admin-field="titleEn" />
          <Field label="Title (Tamil)" lang="ta" value={values.titleTa} onChange={set('titleTa')} data-admin-field="titleTa" />
          <Field label="Title (Hindi)" lang="hi" value={values.titleHi} onChange={set('titleHi')} hint="Optional: otherwise the Hindi language pack is used." />
          <Field label="Subtitle / Category" value={values.subtitle} onChange={set('subtitle')} hint="Shown under the title, e.g. “Chola period, 11th century”." />
          <Field label="Description (English)" multiline value={values.descEn} onChange={set('descEn')} className="md:col-span-2" data-admin-field="descEn" />
          <Field label="Description (Tamil)" lang="ta" multiline value={values.descTa} onChange={set('descTa')} className="md:col-span-2" />
          <Field label="Description (Hindi)" lang="hi" multiline value={values.descHi} onChange={set('descHi')} className="md:col-span-2" />
          <Field label="Image path" value={values.image} onChange={set('image')} placeholder="/Ancient Pottery/urn.jpg or https://…" hint="A file in the museum folder, or a full link." />
          <Field label="Video path (optional)" value={values.video} onChange={set('video')} placeholder="/Irrigation/Kallanai/film.mp4" />
          <Field label="Audio narration path (optional)" value={values.audio} onChange={set('audio')} placeholder="/Audio/Ancient Pottery/urn.mp3" />
          <Field label="PDF link (optional)" value={values.pdf} onChange={set('pdf')} placeholder="/room-pdfs/… or /E-Books/…" hint="Shown as “Read the PDF” in the close-up." />
          {added && <Select label="Gallery in the room" value={gallery} onChange={(event) => setGallery(event.target.value)} options={slots.map((slot) => ({ value: slot.id, label: slot.title }))} />}
          <div className="flex items-end">
            <Toggle label="Visible in the museum" checked={visible} onChange={setVisible} hint={visible ? 'Visitors see this exhibit.' : 'Hidden from visitors (kept here).'} />
          </div>
        </div>
        {error && <p className="m-0 mt-4 rounded-lg border border-[#d36a4a]/60 bg-[#3a140a]/60 px-3 py-2 text-sm text-[#ffb59e]">{error}</p>}
        <div className="mt-5 flex flex-wrap gap-2 border-t border-temple-gold/20 pt-4">
          <Button variant="gold" onClick={save} data-admin-save>
            <Save size={14} /> Save
          </Button>
          <Button onClick={onDone}>Cancel</Button>
          {!isNew && (
            <Button variant="danger" onClick={remove} className="ml-auto">
              <Trash2 size={13} /> {added ? 'Delete' : 'Remove from museum'}
            </Button>
          )}
        </div>
        <p className="m-0 mt-3 text-[11px] text-[#c9b48c]/80">Saved edits show in the 3D museum at once (in this browser, also in its other tabs). Use Export or Publish to put them on the server for every visitor.</p>
      </Panel>

      <PreviewCard exhibit={preview} hidden={!visible} />
    </div>
  );
}

/** The exhibit as the museum's gallery card and close-up show it. */
function PreviewCard({ exhibit, hidden }) {
  const [failed, setFailed] = useState(false);
  return (
    <aside className="flex flex-col gap-3 xl:sticky xl:top-4 xl:self-start" aria-label="Live preview" data-admin-preview>
      <p className="m-0 text-[11px] font-bold tracking-[0.14em] text-temple-gold uppercase">Live preview {hidden && '· hidden'}</p>
      <div className={`flex flex-col ${hidden ? 'opacity-50' : ''}`}>
        <span className="relative block aspect-[4/5] w-full overflow-hidden rounded-t-sm border border-temple-gold/40 bg-[radial-gradient(ellipse_at_50%_25%,#5a2e14,#1c0d05_78%)] shadow-[inset_0_0_30px_#000c,0_14px_28px_#000a]">
          <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-5%,#ffd99a4d,transparent_62%)]" />
          {exhibit.url && !failed ? (
            <img key={exhibit.url} src={exhibit.url} alt="" onError={() => setFailed(true)} onLoad={() => setFailed(false)} className="absolute inset-[9%] size-[82%] rounded-[2px] object-contain drop-shadow-[0_12px_14px_#000c]" />
          ) : (
            <span className="absolute inset-0 grid place-items-center text-center text-xs text-temple-gold/60">
              <span className="flex flex-col items-center gap-2">
                <ImageOff size={28} />
                {exhibit.url ? 'Image not found at this path' : 'No image yet'}
              </span>
            </span>
          )}
        </span>
        <span className="block rounded-b-sm border border-t-0 border-temple-gold/40 bg-[linear-gradient(180deg,#3a1d0c,#1f0f06)] px-3 py-2.5 text-center">
          <span className="block font-serif text-lg leading-tight font-bold text-temple-gold-light">{exhibit.title}</span>
          {exhibit.tamil && <span lang="ta" className="mt-0.5 block text-xs font-semibold text-[#e9a27a]">{exhibit.tamil}</span>}
          {exhibit.detail && <span className="mt-1 block text-[10px] font-semibold tracking-[0.16em] text-[#ead8ae]/80 uppercase">{exhibit.detail}</span>}
        </span>
      </div>
      {(exhibit.note || exhibit.tamilNote) && (
        <div className="rounded-lg border border-[#8a5a2a]/40 bg-[linear-gradient(180deg,#f3e2bd,#e6cf9e)] p-3 text-[#3a2410] shadow-[0_8px_20px_#0008]">
          {exhibit.tamilNote && <p lang="ta" className="m-0 text-[13px] leading-[1.8] font-semibold">{exhibit.tamilNote}</p>}
          {exhibit.note && <p className={`m-0 font-serif text-sm leading-relaxed italic ${exhibit.tamilNote ? 'mt-2' : ''}`}>{exhibit.note}</p>}
        </div>
      )}
      <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0 text-[10px] font-bold tracking-[0.1em] text-[#c9b48c] uppercase">
        {exhibit.video && <li className="rounded-full border border-temple-gold/30 px-2 py-0.5">Film</li>}
        {exhibit.narration && <li className="rounded-full border border-temple-gold/30 px-2 py-0.5">Narration</li>}
        {exhibit.pdf && <li className="rounded-full border border-temple-gold/30 px-2 py-0.5">PDF</li>}
      </ul>
    </aside>
  );
}
