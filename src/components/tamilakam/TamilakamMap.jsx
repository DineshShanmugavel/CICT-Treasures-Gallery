import React, { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PoweredByCICT from '../PoweredByCICT.jsx';
import { ArrowLeft, Images, Info, Maximize2, Minimize2, RotateCcw, Search, Tags, TriangleAlert } from 'lucide-react';
import { BASEMAP_NOTE, CATEGORIES, HOME_VIEW, TAMILAKAM_NOTE, TAMILAKAM_PLACES, categoryOf, getTamilakamPlace } from '../../data/tamilakam.js';
import { getPlace, placeImageUrl } from '../../data/thenAndNow.js';
import { TempleBand } from '../HeritageMotifs.jsx';
// `L` is Leaflet here, so the companion-text helper is used as `say`.
import { companionLang, translate, useI18n, useI18nKey } from '../../i18n/index.js';

/** OpenStreetMap's standard tiles: free, no key; the attribution is required by their policy. */
const TILES = {
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};
/** Where a place is marked: each candidate site for a disputed one, else its position. */
const sitesOf = (place) => place.candidates ?? [{ position: place.position }];
const matches = (place, query) =>
  !query || `${place.en} ${place.ta} ${place.description.en} ${translate(place.en)} ${translate(place.description)}`.toLocaleLowerCase().includes(query);

const MARKER_SIZE = 34;
const HALF = MARKER_SIZE / 2;

/**
 * A marker: a gilt-ringed medallion in its category's colour with its glyph, dashed if the site
 * is uncertain. `offset` ([dx, dy] px) sets it aside from a neighbour it would cover; a small
 * pin then marks the true spot.
 */
const markerIcon = (place, selected, [dx, dy] = [0, 0]) => {
  const category = categoryOf(place.category);
  const pin = dx || dy ? `<i class="tamilakam-marker-pin" style="left:${HALF - dx}px;top:${HALF - dy}px"></i>` : '';
  return L.divIcon({
    className: '',
    html: `${pin}<span class="tamilakam-marker${place.candidates ? ' is-uncertain' : ''}${selected ? ' is-selected' : ''}" style="background:${category.color}" aria-hidden="true">${category.glyph}</span>`,
    iconSize: [MARKER_SIZE, MARKER_SIZE],
    iconAnchor: [HALF - dx, HALF - dy],
    popupAnchor: [dx, dy - HALF - 1],
    tooltipAnchor: [dx + HALF + 2, dy],
  });
};

/** A marker's name label (desktop only): English (or Hindi) over Tamil, built as elements. */
function labelContent(place, site) {
  const box = document.createElement('span');
  const en = document.createElement('span');
  en.className = 'tamilakam-label-en';
  en.lang = companionLang();
  en.textContent = site.en ? `${translate(place.en)} (${translate(site.en)})` : translate(place.en);
  const ta = document.createElement('span');
  ta.lang = 'ta';
  ta.className = 'tamilakam-label-ta';
  ta.textContent = place.ta;
  box.append(en, ta);
  return box;
}

const WIDE_QUERY = '(min-width: 1024px)';
/** Whether the screen is desktop-wide (Tailwind's lg), kept current as the window resizes. */
function useWide() {
  const [wide, setWide] = useState(() => window.matchMedia(WIDE_QUERY).matches);
  useEffect(() => {
    const query = window.matchMedia(WIDE_QUERY);
    const onChange = () => setWide(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);
  return wide;
}

/**
 * Where to draw each marker so none covers another (Madurai and Keezhadi are 12 km apart):
 * markers closer on screen than a marker's width are fanned out round their centre, keeping
 * their bearings from it. `entries` are [{ marker, site }]; returns marker → [dx, dy].
 */
function fanOut(map, entries) {
  const points = entries.map((entry) => ({ ...entry, point: map.latLngToLayerPoint(entry.site.position) }));
  const offsets = new Map();
  const placed = new Set();
  for (const first of points) {
    if (placed.has(first)) continue;
    // Gather everything within reach of the group, so chains of near neighbours fan out together.
    const group = [first];
    placed.add(first);
    for (let i = 0; i < group.length; i++) {
      for (const other of points) {
        if (!placed.has(other) && group[i].point.distanceTo(other.point) < MARKER_SIZE + 2) {
          group.push(other);
          placed.add(other);
        }
      }
    }
    if (group.length < 2) continue;
    const centre = group.reduce((sum, { point }) => sum.add(point), L.point(0, 0)).divideBy(group.length);
    const radius = (MARKER_SIZE / 2 + 2) / Math.sin(Math.PI / group.length);
    const bearing = ({ point }, index) => (point.distanceTo(centre) < 0.5 ? index : Math.atan2(point.y - centre.y, point.x - centre.x));
    const ordered = group.map((entry, index) => ({ entry, angle: bearing(entry, index) })).sort((a, b) => a.angle - b.angle);
    const start = ordered[0].angle;
    ordered.forEach(({ entry }, index) => {
      const angle = start + (index * 2 * Math.PI) / group.length;
      offsets.set(entry.marker, [Math.round(centre.x + radius * Math.cos(angle) - entry.point.x), Math.round(centre.y + radius * Math.sin(angle) - entry.point.y)]);
    });
  }
  return offsets;
}

/** A popup's contents, built as elements (never as HTML from text). */
function popupContent(place, site) {
  const box = document.createElement('div');
  const ta = document.createElement('p');
  ta.lang = 'ta';
  ta.style.cssText = 'margin:0;font-weight:700;color:#7d2e14';
  ta.textContent = site.ta ? `${place.ta} — ${site.ta}` : place.ta;
  const en = document.createElement('p');
  en.lang = companionLang();
  en.style.cssText = "margin:2px 0 0;font-weight:700;font-family:Georgia,'Noto Serif Devanagari',serif;font-size:15px";
  en.textContent = site.en ? `${translate(place.en)} — ${translate(site.en)}` : translate(place.en);
  const kind = document.createElement('p');
  kind.lang = companionLang();
  kind.style.cssText = 'margin:4px 0 0;font-size:11px;color:#6a4a22';
  kind.textContent = `${translate(categoryOf(place.category).en)}${place.candidates ? ` · ${translate('identification disputed', 'पहचान विवादित')}` : ''}`;
  box.append(ta, en, kind);
  return box;
}

/** The selected place, described: names, category, period, texts, a picture, and its Then & Now card. */
function PlaceDetails({ place, onViewThenNow }) {
  const { L: say, cl } = useI18n();
  if (!place) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-[#5a3a1a]">
        <Info size={22} className="text-temple-gold" aria-hidden="true" />
        <p lang={cl} className="font-serif text-base">{say('Choose a marker or a place in the list.', 'कोई चिह्न या सूची में कोई स्थान चुनें।')}</p>
        <p lang="ta" className="text-sm leading-[1.8]">ஒரு குறியையோ பட்டியலில் உள்ள இடத்தையோ தேர்ந்தெடுங்கள்.</p>
      </div>
    );
  }
  const category = categoryOf(place.category);
  const card = place.thenNow ? getPlace(place.thenNow) : null;
  const picture = card ? card.images.find((image) => image.file === card.compare.now) : null;
  const row = (label, labelTa, text) => (
    <section className="border-l-2 border-temple-gold/70 pl-3">
      <h4 className="text-[11px] font-bold tracking-[0.12em] text-terracotta-deep uppercase"><span lang={cl}>{label}</span> <span lang="ta" className="tracking-normal normal-case">· {labelTa}</span></h4>
      <p lang={cl} className="mt-1 font-serif text-[15px] leading-relaxed">{say(text)}</p>
      <p lang="ta" className="mt-1 text-[13px] leading-[1.85] text-[#4a2e14]">{text.ta}</p>
    </section>
  );
  return (
    <article aria-labelledby="tamilakam-place-title" className="flex flex-col gap-4 p-4 text-[#2a1408] sm:p-5">
      {picture && (
        <img src={placeImageUrl(card, picture.file)} alt={`${say(card.en)} — ${say(picture)}`} loading="lazy" onError={(event) => { event.currentTarget.hidden = true; }} className="aspect-[16/9] w-full rounded-md object-cover shadow-[0_6px_16px_#0005]" />
      )}
      <header>
        <p lang="ta" className="text-lg leading-[1.6] font-bold text-terracotta-deep">{place.ta}</p>
        <h3 id="tamilakam-place-title" lang={cl} className="font-serif text-2xl leading-tight font-bold">{say(place.en)}</h3>
        <p className="mt-2 inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white" style={{ background: category.color }}>
          <span aria-hidden="true">{category.glyph}</span> <span lang={cl}>{say(category.en)}</span>
        </p>
        {place.candidates && (
          <p className="mt-2 rounded-md border border-dashed border-[#9b2a1a] bg-[#9b2a1a]/8 px-3 py-2 text-xs leading-relaxed text-[#7d2e14]">
            <TriangleAlert size={13} className="mr-1 inline align-[-2px]" aria-hidden="true" />
            <span lang={cl}>{say('Identification disputed — candidate sites:', 'पहचान विवादित — संभावित स्थल:')} {place.candidates.map((site) => say(site.en)).join('; ')}.</span>
          </p>
        )}
      </header>
      {place.period && row(say('Period', 'काल'), 'காலம்', place.period)}
      {row(say('About', 'परिचय'), 'விளக்கம்', place.description)}
      {row(say('Significance', 'महत्व'), 'சிறப்பு', place.significance)}
      {row(say('Evidence', 'साक्ष्य'), 'சான்றுகள்', place.evidence)}
      {card && (
        <button type="button" onClick={() => onViewThenNow(card.id)} className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-[#6a3a1a] bg-[radial-gradient(circle_at_35%_30%,#f7dc95,#c4913f_55%,#7a5218)] px-5 py-2.5 text-sm font-bold text-[#3a2008] shadow-[0_3px_8px_#0005] transition hover:scale-[1.03] active:scale-95">
          <Images size={16} /> <span lang={cl}>{say('View Then & Now', 'तब और अब देखें')}</span> <span lang="ta" className="font-sans">· அன்றும் இன்றும்</span>
        </button>
      )}
    </article>
  );
}

/**
 * Ancient Tamilakam — a Leaflet map of southern India with the places in tamilakam.js: zoom,
 * pan, markers by category (with a legend that is also the filter), a search, a reset, and a
 * details panel for the chosen place, whose "View Then & Now" calls `onViewThenNow(placeId)`.
 * Opened with `focus` (a place id), it starts at that place. Escape or the back button closes.
 * If the tiles cannot load, the map says so and the markers, list and details still work.
 */
export default function TamilakamMap({ focus = null, onClose, onViewThenNow }) {
  const { L: say, T, cl } = useI18n();
  const languageKey = useI18nKey();
  const mapElement = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef(new Map()); // place id → [{ marker, site }]
  const backRef = useRef(null);
  const [selectedId, setSelectedId] = useState(() => getTamilakamPlace(focus)?.id ?? null);
  const [query, setQuery] = useState('');
  const [shown, setShown] = useState(() => new Set(CATEGORIES.map((category) => category.id)));
  const [tilesFailed, setTilesFailed] = useState(false);
  const wide = useWide();
  const [expanded, setExpanded] = useState(false);
  const expandedRef = useRef(expanded);
  expandedRef.current = expanded && wide;
  const [showNames, setShowNames] = useState(true);
  const labels = wide && showNames;
  const normalized = query.trim().toLocaleLowerCase();
  const visible = useMemo(() => TAMILAKAM_PLACES.filter((place) => shown.has(place.category) && matches(place, normalized)), [shown, normalized]);
  const selected = getTamilakamPlace(selectedId);

  // The map itself, built once.
  useEffect(() => {
    const map = L.map(mapElement.current, { center: HOME_VIEW.center, zoom: HOME_VIEW.zoom, minZoom: 5, maxZoom: 14, zoomSnap: 0.5, wheelPxPerZoomLevel: 90, worldCopyJump: false });
    mapRef.current = map;
    let failures = 0;
    L.tileLayer(TILES.url, { attribution: TILES.attribution, maxZoom: 19 })
      .on('tileerror', () => { failures += 1; if (failures >= 4) setTilesFailed(true); })
      .on('tileload', () => { failures = 0; setTilesFailed(false); })
      .addTo(map);
    for (const place of TAMILAKAM_PLACES) {
      markersRef.current.set(place.id, sitesOf(place).map((site) => {
        const label = site.en ? `${place.en} — ${site.en}` : place.en;
        const marker = L.marker(site.position, { icon: markerIcon(place, false), title: label, alt: label, keyboard: true, riseOnHover: true })
          .bindPopup(() => popupContent(place, site), { autoPan: true })
          .on('click', () => setSelectedId(place.id));
        return { marker, site };
      }));
    }
    // The container may still be settling into its layout on the first frame.
    const frame = window.requestAnimationFrame(() => map.invalidateSize());
    return () => {
      window.cancelAnimationFrame(frame);
      // Closed mid-animation: stop a flight, and end a zoom now — Leaflet finishes it on a timer
      // that remove() leaves running, which would then reach for the removed panes.
      map.off();
      map.stop();
      if (map._animatingZoom) map._onZoomTransitionEnd();
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, []);

  // Show only the markers that pass the filters and the search, fanned apart where they would
  // cover each other, with the chosen place's lit — and fan them again after every zoom.
  // On desktop each marker also carries its name, unless the visitor hides the names.
  useEffect(() => {
    const map = mapRef.current;
    const ids = new Set(visible.map((place) => place.id));
    for (const [id, entries] of markersRef.current) {
      for (const { marker, site } of entries) {
        // Names are rebuilt in the new language when it changes (languageKey below).
        if (marker.getTooltip()?.options.languageKey !== languageKey) marker.unbindTooltip();
        if (labels && !marker.getTooltip()) {
          marker.bindTooltip(labelContent(getTamilakamPlace(id), site), { permanent: true, direction: 'right', className: 'tamilakam-label', languageKey });
        } else if (!labels && marker.getTooltip()) marker.unbindTooltip();
      }
    }
    const draw = () => {
      const shownEntries = [];
      for (const [id, entries] of markersRef.current) {
        for (const entry of entries) {
          if (ids.has(id)) {
            entry.marker.addTo(map);
            shownEntries.push(entry);
          } else entry.marker.remove();
        }
      }
      const offsets = fanOut(map, shownEntries);
      for (const [id, entries] of markersRef.current) {
        const place = getTamilakamPlace(id);
        for (const { marker } of entries) {
          marker.setIcon(markerIcon(place, id === selectedId, offsets.get(marker)));
          // Leaflet's isTooltipOpen() throws when no name is bound (phones, or names hidden).
          if (marker.getTooltip()?.isOpen()) marker.getTooltip().update();
        }
      }
    };
    draw();
    map.on('zoomend', draw);
    return () => map.off('zoomend', draw);
    // An open popup is rebuilt in the new language too.
    map.eachLayer((layer) => { if (layer instanceof L.Marker && layer.isPopupOpen()) layer.getPopup().update(); });
  }, [visible, selectedId, labels, languageKey]);

  // The map grows or shrinks when expanded or collapsed, or when the side panels come and go.
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => mapRef.current?.invalidateSize());
    return () => window.cancelAnimationFrame(frame);
  }, [expanded, wide]);

  // Opened at a place: centre on it.
  useEffect(() => {
    const place = getTamilakamPlace(focus);
    if (!place || !mapRef.current) return;
    const entries = markersRef.current.get(place.id);
    if (entries.length === 1) mapRef.current.setView(entries[0].site.position, 9);
  }, [focus]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const previouslyFocused = document.activeElement;
    backRef.current?.focus({ preventScroll: true });
    // Caught first (capture), so Escape closes an open popup, then the expanded map, then this
    // view — never the room or hall beneath.
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      event.stopPropagation();
      if (document.querySelector('.tamilakam-map .leaflet-popup')) mapRef.current?.closePopup();
      else if (expandedRef.current) setExpanded(false);
      else onClose();
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  /** Choose a place from the list: fly to it (to fit both sites, if disputed) and open its popup. */
  const choose = (place) => {
    setSelectedId(place.id);
    const map = mapRef.current;
    const entries = markersRef.current.get(place.id);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (entries.length > 1) map.flyToBounds(L.latLngBounds(entries.map(({ site }) => site.position)).pad(0.4), { animate: !reduce });
    else map.flyTo(entries[0].site.position, Math.max(map.getZoom(), 9), { animate: !reduce });
    entries[0].marker.openPopup();
  };
  const toggleCategory = (id) => setShown((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
  const reset = () => {
    setQuery('');
    setShown(new Set(CATEGORIES.map((category) => category.id)));
    setSelectedId(null);
    mapRef.current?.closePopup();
    mapRef.current?.setView(HOME_VIEW.center, HOME_VIEW.zoom);
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="tamilakam-title" className="fixed inset-0 z-[1250] overflow-x-hidden overflow-y-auto bg-midnight font-sans text-parchment">
      <header className="sticky top-0 z-[500] border-b-2 border-temple-gold/60 bg-midnight shadow-[0_8px_24px_#0009]">
        <TempleBand className="absolute inset-x-0 top-0 text-temple-gold/30" />
        <div className="relative flex items-center gap-3 px-4 pt-4 pb-3 sm:px-8">
          <button ref={backRef} type="button" onClick={onClose} className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-temple-gold/60 px-4 py-2 text-xs text-temple-gold-light transition hover:border-temple-gold-light hover:bg-temple-gold/10">
            <ArrowLeft size={15} /> <span className="hidden sm:inline">{T('Return to the museum', 'அருங்காட்சியகத்துக்குத் திரும்பு', 'संग्रहालय में लौटें')}</span>
          </button>
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h1 id="tamilakam-title" className="truncate">
              <span lang="ta" className="text-base leading-[1.6] font-bold text-temple-gold-light sm:text-lg">பண்டைய தமிழகம்</span>
              <span lang={cl} className="font-serif text-lg font-bold tracking-wide text-ivory sm:text-xl"> — {say('Ancient Tamilakam', 'प्राचीन तमिऴकम')}</span>
            </h1>
            <p lang={cl} className="hidden truncate text-xs text-[#d9cba8] sm:block">{say('Explore the regions, ports, capitals, temples, and archaeological sites of the ancient Tamil world.', 'प्राचीन तमिल जगत के क्षेत्रों, बंदरगाहों, राजधानियों, मंदिरों और पुरातात्विक स्थलों को देखें।')}</p>
          </div>
        </div>
      </header>

      <main className="relative mx-auto flex max-w-[1500px] flex-col gap-4 px-3 pt-4 pb-10 sm:px-6 lg:max-w-none lg:pb-6">
        <aside className={`${expanded ? 'lg:hidden ' : ''}rounded-lg border border-temple-gold/40 bg-midnight-light/60 px-4 py-3 text-xs leading-relaxed text-[#e4dcc6]`} aria-label={T('About this map', 'இவ்வரைபடம் பற்றி', 'इस मानचित्र के बारे में')}>
          <p><Info size={13} className="mr-1 inline align-[-2px] text-temple-gold-light" aria-hidden="true" /><span lang={cl}>{say(TAMILAKAM_NOTE)}</span></p>
          <p lang="ta" className="mt-1 leading-[1.85] text-[#d0c4a6]">{TAMILAKAM_NOTE.ta}</p>
          <p lang={cl} className="mt-1 text-[#bfb79f] italic">{say(BASEMAP_NOTE)}</p>
        </aside>

        {/* minmax(0,1fr): on phones the single column fits the screen instead of growing to its widest content. */}
        <div className={`grid grid-cols-[minmax(0,1fr)] gap-4 ${expanded ? 'lg:grid-cols-1' : 'lg:grid-cols-[280px_minmax(0,1fr)_380px]'}`}>
          {/* Search, legend-filters, reset and the list of places */}
          <section aria-label={T('Search and filter', 'தேடலும் வடிகட்டலும்', 'खोज और फ़िल्टर')} className={`${expanded ? 'lg:hidden ' : ''}order-2 flex flex-col gap-3 rounded-lg border border-temple-gold/40 bg-ivory p-3 text-[#2a1408] lg:order-1 lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto`}>
            <label className="flex items-center gap-2 rounded-md border border-[#c9a46a] bg-white px-2.5 py-2 focus-within:ring-2 focus-within:ring-temple-gold">
              <Search size={15} className="shrink-0 text-[#7a5a32]" aria-hidden="true" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`${T('Search places…', 'இடம் தேடுக…', 'स्थल खोजें…')} / இடம் தேடுக`} aria-label={T('Search places', 'இடம் தேடுக', 'स्थल खोजें')} className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
            </label>
            <fieldset>
              <legend className="mb-1.5 text-[11px] font-bold tracking-[0.12em] text-terracotta-deep uppercase"><span lang={cl}>{say('Legend & filters', 'संकेत और फ़िल्टर')}</span> <span lang="ta" className="tracking-normal normal-case">· குறியீடுகள்</span></legend>
              <div className="flex flex-col gap-1">
                {CATEGORIES.map((category) => (
                  <label key={category.id} className="flex cursor-pointer items-start gap-2 rounded px-1 py-1 text-xs hover:bg-temple-gold/15">
                    <input type="checkbox" checked={shown.has(category.id)} onChange={() => toggleCategory(category.id)} className="mt-1 accent-[#7d2e14]" />
                    <span className="grid size-6 shrink-0 place-items-center rounded-full border-2 border-white text-[12px] text-white shadow" style={{ background: category.color }} aria-hidden="true">{category.glyph}</span>
                    <span className="leading-snug"><span lang={cl}>{say(category.en)}</span><span lang="ta" className="block text-[11px] leading-[1.7] text-[#6a4a22]">{category.ta}</span></span>
                  </label>
                ))}
                <p className="mt-1 flex items-center gap-2 px-1 text-[11px] text-[#6a4a22]">
                  <span className="size-4 shrink-0 rounded-full border-2 border-dashed border-[#7d2e14]" aria-hidden="true" /> <span lang={cl}>{say('Dashed: identification disputed', 'धराशायी: पहचान विवादित')}</span>
                </p>
              </div>
            </fieldset>
            <button type="button" onClick={reset} className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-[#7d2e14] px-3 py-1.5 text-xs font-semibold text-[#7d2e14] transition hover:bg-[#7d2e14] hover:text-white">
              <RotateCcw size={13} /> <span lang={cl}>{say('Reset map', 'मानचित्र रीसेट करें')}</span> <span lang="ta">· மீட்டமை</span>
            </button>
            <ul className="flex flex-col gap-1 border-t border-[#c9a46a]/60 pt-2" aria-label={T('Places', 'இடங்கள்', 'स्थल')}>
              {visible.map((place) => (
                <li key={place.id}>
                  <button type="button" onClick={() => choose(place)} aria-pressed={place.id === selectedId} className={`flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-xs transition ${place.id === selectedId ? 'bg-[#7d2e14] text-white' : 'hover:bg-temple-gold/20'}`}>
                    <span className="size-2.5 shrink-0 rounded-full" style={{ background: categoryOf(place.category).color }} aria-hidden="true" />
                    <span className="min-w-0"><span lang="ta" className="block truncate text-[11px] leading-[1.7]">{place.ta}</span><span lang={cl} className="block truncate font-semibold">{say(place.en)}</span></span>
                  </button>
                </li>
              ))}
              {!visible.length && <li className="px-2 py-2 text-xs text-[#6a4a22]"><span lang={cl}>{say('No places match.', 'कोई स्थल मेल नहीं खाता।')}</span> <span lang="ta">பொருந்தும் இடம் இல்லை.</span></li>}
            </ul>
          </section>

          {/* The map, with the library's credit beneath it */}
          <div className="order-1 flex min-w-0 flex-col gap-2 lg:order-2">
          <div className={`tamilakam-map relative h-[58vh] min-h-[340px] overflow-hidden rounded-lg border-2 border-temple-gold/60 shadow-[0_18px_40px_#0009] lg:min-h-[560px] ${expanded ? 'lg:h-[calc(100vh-9.25rem)]' : 'lg:h-[calc(100vh-13.75rem)]'}`}>
            <div ref={mapElement} className="absolute inset-0" aria-label={T('Map of southern India with the places of ancient Tamilakam', 'பண்டைய தமிழக இடங்களுடன் தென்னிந்திய வரைபடம்', 'प्राचीन तमिऴकम के स्थलों सहित दक्षिण भारत का मानचित्र')} role="region" />
            <div className="pointer-events-none absolute top-3 right-3 z-[450] flex max-w-[min(22rem,calc(100%-4.5rem))] flex-col items-end gap-2">
              {/* Desktop only: give the map the whole width, and show or hide the place names */}
              <div className="pointer-events-auto hidden gap-2 lg:flex">
                <button type="button" onClick={() => setShowNames((value) => !value)} aria-pressed={showNames} className="tamilakam-map-button">
                  <Tags size={16} aria-hidden="true" /> {showNames ? T('Hide names', 'பெயர்களை மறை', 'नाम छिपाएँ') : T('Show names', 'பெயர்களைக் காட்டு', 'नाम दिखाएँ')}
                </button>
                <button type="button" onClick={() => setExpanded((value) => !value)} aria-pressed={expanded} className="tamilakam-map-button">
                  {expanded ? <Minimize2 size={16} aria-hidden="true" /> : <Maximize2 size={16} aria-hidden="true" />} {expanded ? T('Show panels', 'பலகங்களைக் காட்டு', 'पैनल दिखाएँ') : T('Expand map', 'வரைபடத்தை விரி', 'मानचित्र बड़ा करें')}
                </button>
              </div>
              {tilesFailed && (
                <p role="status" className="rounded-md border border-[#9b2a1a] bg-ivory/90 px-3 py-2 text-xs leading-snug text-[#7d2e14] shadow">
                  <TriangleAlert size={13} className="mr-1 inline align-[-2px]" aria-hidden="true" />
                  {T('The background map could not load (no connection to OpenStreetMap?). The markers, the list and the details still work.', 'பின்னணி வரைபடம் ஏற்றப்படவில்லை (OpenStreetMap இணைப்பு இல்லையா?). குறிகள், பட்டியல், விவரங்கள் வேலை செய்யும்.', 'पृष्ठभूमि मानचित्र लोड नहीं हो सका (OpenStreetMap से कनेक्शन नहीं?)। चिह्न, सूची और विवरण फिर भी काम करते हैं।')}
                </p>
              )}
            </div>
          </div>
          <PoweredByCICT className="self-center lg:self-end" />
          </div>

          {/* Details of the chosen place */}
          <section aria-label={T('Place details', 'இட விவரங்கள்', 'स्थल का विवरण')} aria-live="polite" className={`${expanded ? 'lg:hidden ' : ''}order-3 rounded-lg border border-temple-gold/40 bg-ivory lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto`}>
            <PlaceDetails place={selected} onViewThenNow={onViewThenNow} />
          </section>
        </div>
      </main>
    </div>
  );
}
