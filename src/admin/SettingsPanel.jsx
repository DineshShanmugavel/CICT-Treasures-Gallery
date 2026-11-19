import React, { useState } from 'react';
import { Library, Save } from 'lucide-react';
import { saveDraft, siteData, siteSettings, useSiteDataVersion } from '../siteData/siteData.js';
import { Button, Field, Panel, Toggle, glass } from './ui.jsx';

const DEFAULT_WATERMARK = { en: 'Powered by: CICT Digital Library', ta: 'வழங்குவோர்: CICT எண்ணிம நூலகம்', hi: 'संचालित: CICT डिजिटल पुस्तकालय' };

/** Global Settings / Watermarks: the credit under the maps, and the live telemetry pill. */
export default function SettingsPanel() {
  useSiteDataVersion();
  const settings = siteSettings();
  const [watermark, setWatermark] = useState({ ...DEFAULT_WATERMARK, ...(settings.watermark ?? {}) });
  const [showWatermark, setShowWatermark] = useState(settings.showWatermark);
  const [showTelemetry, setShowTelemetry] = useState(settings.showTelemetry);
  const [message, setMessage] = useState('');

  const save = () => {
    const data = structuredClone(siteData());
    const changed = Object.fromEntries(Object.entries(watermark).filter(([code, text]) => text.trim() && text.trim() !== DEFAULT_WATERMARK[code]).map(([code, text]) => [code, text.trim()]));
    data.settings = { ...data.settings, showWatermark, showTelemetry };
    if (Object.keys(changed).length) data.settings.watermark = changed;
    else delete data.settings.watermark;
    saveDraft(data);
    setMessage('Saved. The museum shows the new settings at once.');
  };

  return (
    <Panel
      title="Global Settings & Watermarks"
      tamil="பொது அமைப்புகள்"
      actions={
        <Button variant="gold" onClick={save}>
          <Save size={14} /> Save settings
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-4">
          <h3 className="m-0 font-serif text-lg font-bold text-temple-gold-light">Credit under the maps</h3>
          <Toggle label="Show the credit" checked={showWatermark} onChange={setShowWatermark} hint="Under the hallway mini-map, the Museum Map and the Tamilakam map." />
          <Field label="Credit (English)" value={watermark.en} onChange={(event) => setWatermark((w) => ({ ...w, en: event.target.value }))} />
          <Field label="Credit (Tamil)" lang="ta" value={watermark.ta} onChange={(event) => setWatermark((w) => ({ ...w, ta: event.target.value }))} />
          <Field label="Credit (Hindi)" lang="hi" value={watermark.hi} onChange={(event) => setWatermark((w) => ({ ...w, hi: event.target.value }))} />
          <h3 className="m-0 mt-2 font-serif text-lg font-bold text-temple-gold-light">Live telemetry (website)</h3>
          <Toggle label="Show “Live · Views” in the 3D museum" checked={showTelemetry} onChange={setShowTelemetry} hint="Visible only when the analytics server runs; never in the mobile app." />
          {message && <p className="m-0 text-sm text-temple-gold-light">{message}</p>}
        </div>
        <div>
          <p className="m-0 mb-2 text-[11px] font-bold tracking-[0.14em] text-temple-gold uppercase">Preview</p>
          <div className={`${glass} grid place-items-center rounded-xl p-6`}>
            {showWatermark ? (
              <p className="m-0 inline-flex items-center gap-1.5 rounded-full border border-temple-gold/35 bg-[#140d07]/70 px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-[#f0dcae]">
                <Library size={12} className="text-temple-gold" /> {watermark.en}
              </p>
            ) : (
              <p className="m-0 text-xs text-[#c9b48c]">The credit is hidden.</p>
            )}
          </div>
        </div>
      </div>
    </Panel>
  );
}
