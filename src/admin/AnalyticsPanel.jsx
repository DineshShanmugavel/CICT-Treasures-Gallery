import React, { useEffect, useState } from 'react';
import { Activity, Eye, MapPin, RefreshCw, ServerOff } from 'lucide-react';
import { fetchSummary } from '../analytics/analytics.js';
import { IS_WEB } from '../platform.js';
import { Button, Kpi, Panel, glass } from './ui.jsx';

const REFRESH_MS = 10_000;
const number = (n) => Number(n ?? 0).toLocaleString('en-IN');
const when = (iso) => (iso ? new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—');

/** Visitor Analytics: live users, IP-based unique views and the city-wise table (website only). */
export default function AnalyticsPanel({ token, onUnauthorised }) {
  const [summary, setSummary] = useState(undefined); // undefined: loading; null: no server
  const [updated, setUpdated] = useState(null);

  const load = async () => {
    try {
      const data = await fetchSummary(token);
      setSummary(data);
      setUpdated(new Date());
    } catch (error) {
      if (error.message === 'unauthorised') onUnauthorised();
      else setSummary(null);
    }
  };

  useEffect(() => {
    if (!IS_WEB) return undefined;
    load();
    const timer = window.setInterval(load, REFRESH_MS);
    return () => window.clearInterval(timer);
  }, [token]);

  if (!IS_WEB) {
    return (
      <Panel title="Visitor Analytics" tamil="பார்வையாளர் புள்ளிவிவரம்">
        <p className="m-0 text-sm text-[#e6d5b2]">Visitor analytics run on the museum website only; the mobile app does not collect or show them.</p>
      </Panel>
    );
  }

  if (summary === null) {
    return (
      <Panel title="Visitor Analytics" tamil="பார்வையாளர் புள்ளிவிவரம்">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <ServerOff className="shrink-0 text-temple-gold" size={32} />
          <div className="text-sm leading-relaxed text-[#e6d5b2]">
            <p className="m-0 font-semibold text-temple-gold-light">The analytics server is not running for this copy of the museum.</p>
            <p className="m-0 mt-1">
              The museum works fully without it. To count live users, unique views and visitor cities, serve the museum with its own server:
              double-click <code className="text-temple-gold-light">start-local-server.bat</code> (or <code className="text-temple-gold-light">start-local-server.sh</code>) in the museum folder,
              or on a web server run <code className="text-temple-gold-light">node serve-museum.mjs</code> and pass <code className="text-temple-gold-light">/api/</code> to it (see DEPLOYMENT_GUIDE.md).
            </p>
          </div>
        </div>
      </Panel>
    );
  }

  const rows = summary?.cities ?? [];
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Kpi
          icon={Activity}
          label="Current Live Users"
          tamil="இப்போது பார்வையிடுவோர்"
          value={
            <span className="inline-flex items-center gap-2.5">
              <span className="relative flex size-3">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex size-3 rounded-full bg-emerald-400" />
              </span>
              <span data-admin-live>{summary ? number(summary.live) : '…'}</span>
            </span>
          }
          sub="Open museum tabs in the last 75 seconds"
          accent="text-emerald-300"
        />
        <Kpi icon={Eye} label="Total Unique Views (IP-Based)" tamil="மொத்தப் பார்வைகள் (IP)" value={<span data-admin-views>{summary ? number(summary.views) : '…'}</span>} sub={summary ? `${number(summary.visits)} visits in all · counting since ${when(summary.since)}` : ''} />
        <Kpi
          icon={MapPin}
          label="Top Visiting City"
          tamil="அதிகம் வருகை தரும் நகரம்"
          value={<span data-admin-top-city>{summary?.topCity?.city ?? '—'}</span>}
          sub={summary?.topCity ? `${[summary.topCity.region, summary.topCity.country].filter(Boolean).join(', ') || 'Office network'} · ${number(summary.topCity.visitors)} visitor${summary.topCity.visitors === 1 ? '' : 's'}` : 'No visitors yet'}
        />
      </div>

      <Panel
        title="Visitor Locations (City-Wise)"
        tamil="நகர வாரியாகப் பார்வையாளர்கள்"
        actions={
          <Button onClick={load}>
            <RefreshCw size={13} /> Refresh
          </Button>
        }
      >
        <div className={`overflow-x-auto ${glass} rounded-xl border-temple-gold/20 bg-[#0e0905]/50`}>
          <table className="w-full min-w-[640px] border-collapse text-left text-sm" data-admin-cities>
            <thead>
              <tr className="text-[11px] tracking-[0.12em] text-temple-gold uppercase">
                {['City', 'Region / Country', 'Unique visitors', 'Visits', 'Last visited'].map((heading) => (
                  <th key={heading} className="border-b border-temple-gold/25 px-4 py-2.5 font-bold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-[#c9b48c]">
                    No visits recorded yet.
                  </td>
                </tr>
              )}
              {rows.map((row) => (
                <tr key={`${row.city}|${row.region}|${row.country}`} className="border-b border-temple-gold/10 text-[#f3e6c8] last:border-0 hover:bg-temple-gold/5">
                  <td className="px-4 py-2.5 font-semibold">
                    <span className="inline-flex items-center gap-2">
                      <MapPin size={13} className={row.local ? 'text-sky-300' : 'text-temple-gold'} />
                      {row.city}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-[#e0cda6]">{row.local ? 'Private network (192.168.x.x, 10.x, 127.0.0.1)' : [row.region, row.country].filter(Boolean).join(', ') || '—'}</td>
                  <td className="px-4 py-2.5 tabular-nums">{number(row.visitors)}</td>
                  <td className="px-4 py-2.5 tabular-nums">{number(row.visits)}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-[#e0cda6]">{when(row.lastVisited)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="m-0 mt-3 text-[11px] text-[#c9b48c]/80">
          Views are counted once per IP address; addresses are stored only as salted hashes. Cities are looked up once per address and cached{summary?.pending ? ` (${summary.pending} still being located)` : ''}.
          {updated && ` Updated ${updated.toLocaleTimeString('en-IN')}; refreshes every 10 seconds.`}
        </p>
      </Panel>
    </div>
  );
}
