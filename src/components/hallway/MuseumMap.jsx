import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, DoorOpen, Lock, Map as MapIcon, Maximize2, Navigation, X } from 'lucide-react';
import PoweredByCICT from '../PoweredByCICT.jsx';
import { IS_WEB } from '../../platform.js';
import { TAU, direction2d, hallApothem, hallReach, layoutHalls, wingBearing } from './hallLayout.js';
import { translate, useI18n } from '../../i18n/index.js';
import { ALL_SERIF_FAMILIES, fontList } from '../../i18n/languages.js';

/*
 * The museum map: the floor plan drawn from the same layout as the 3D building
 * (hallLayout.js), in ground metres, north (the Central Hall's first corridor) up.
 * The mini-map (MiniMap) shows it in a corner with the visitor's marker; the full map
 * (MapDialog) names every hall and room, and choosing one travels there.
 *
 * The marker is moved straight in the DOM every frame (see `markers`), never by re-rendering.
 */

const deg = (radians) => (radians * 180) / Math.PI;
const ROOM_SIZE = 3.4; // a room's square on the plan, set against the inside of its wall
const PASSAGE_WIDTH = 5.4; // a corridor's width (the arch and its frame)

/** A long room name split at the space nearest its middle, so it reaches less far across the plan. */
function twoLines(title, longerThan = 14) {
  if (title.length <= longerThan) return [title];
  const middle = title.length / 2;
  const spaces = [...title.matchAll(/ /g)].map((match) => match.index);
  if (!spaces.length) return [title];
  const cut = spaces.reduce((best, at) => (Math.abs(at - middle) < Math.abs(best - middle) ? at : best));
  return [title.slice(0, cut), title.slice(cut + 1)];
}

/** Everything the drawing needs, worked out once per set of halls. */
export function usePlan(hallList) {
  return useMemo(() => {
    const placements = layoutHalls(hallList);
    const halls = hallList.filter((spec) => placements.has(spec.id)).map((spec) => {
      const place = placements.get(spec.id);
      const n = spec.wings.length;
      const reach = hallReach(spec);
      const corner = reach / Math.cos(Math.PI / n);
      const corners = Array.from({ length: n }, (_, i) => {
        const [dx, dz] = direction2d((i + 0.5) * (TAU / n) - place.yaw);
        return [place.x + dx * corner, place.z + dz * corner];
      });
      const outline = corners.map(([x, z]) => `${x.toFixed(2)},${z.toFixed(2)}`).join(' ');
      // Rooms are displays on the hall's walls: a square inside the wall, named just outside it; relief plaques are gilt marks on the wall.
      const onWall = (index, inset) => {
        const bearing = wingBearing(spec, place, index);
        const [dx, dz] = direction2d(bearing);
        return { bearing, dx, dz, x: place.x + dx * inset, z: place.z + dz * inset, outX: place.x + dx * (reach + 1.8), outZ: place.z + dz * (reach + 1.8) };
      };
      const apothem = hallApothem(spec);
      const rooms = spec.wings.flatMap((wing, index) => (wing.passage || wing.alcove ? [] : [{ wing, ...onWall(index, apothem - ROOM_SIZE / 2 - 0.3) }]));
      const plaques = spec.wings.flatMap((wing, index) => (wing.alcove ? [onWall(index, apothem - 0.6)] : []));
      return { spec, ...place, reach, corners, outline, rooms, plaques };
    });
    const seen = new Set();
    const passages = [];
    for (const { spec, x, z } of halls) {
      for (const wing of spec.wings) {
        const other = placements.get(wing.passage);
        const key = [spec.id, wing.passage].sort().join('|');
        if (!other || seen.has(key)) continue;
        seen.add(key);
        passages.push({ key, x1: x, z1: z, x2: other.x, z2: other.z });
      }
    }
    // Room names stand just outside the walls; leave room for them.
    const margin = (hall) => hallReach(hall.spec) + 9;
    const box = {
      left: Math.min(...halls.map((hall) => hall.x - margin(hall))),
      top: Math.min(...halls.map((hall) => hall.z - margin(hall))),
      right: Math.max(...halls.map((hall) => hall.x + margin(hall))),
      bottom: Math.max(...halls.map((hall) => hall.z + margin(hall))),
    };
    return { halls, passages, byId: new Map(halls.map((hall) => [hall.spec.id, hall])), viewBox: `${box.left} ${box.top} ${box.right - box.left} ${box.bottom - box.top}` };
  }, [hallList]);
}

/**
 * The full map's lettering, in plan metres, with the fonts the map draws it in (so it can be
 * measured): room names, and each hall's English and Tamil names.
 */
const MAP_SERIF = `'Cormorant Garamond', Georgia, 'Noto Serif Devanagari', ${fontList(ALL_SERIF_FAMILIES)}, serif`;
const LETTERING = {
  room: { size: 2.9, font: `600 100px ${MAP_SERIF}` },
  hall: { size: 3.4, font: `700 100px ${MAP_SERIF}` },
  hallTamil: { size: 2.8, font: '700 100px Inter, Arial, sans-serif' },
};
const LINE_HEIGHT = 1.18; // in font sizes
const LABEL_GAP = 0.6; // the least space between two names, in metres

let measurer;
/** How wide `text` is in plan metres at font size 1 of `style`. */
function textWidth(text, style) {
  measurer ??= document.createElement('canvas').getContext('2d');
  measurer.font = style.font;
  return measurer.measureText(text).width / 100;
}

/** Lines of a name at their style's size, made smaller only if they must be to fit `across` metres. */
function setLines(lines, style, across) {
  const widest = Math.max(...lines.map((line) => textWidth(line, style)));
  const size = Math.min(style.size, across / widest);
  return { lines, size, width: widest * size, height: lines.length * size * LINE_HEIGHT };
}

/** A hall's name set `across` metres wide at most: on one line if it fits, else on two, made smaller only if it must be. */
const fitName = (text, style, across) => setLines(textWidth(text, style) * style.size > across ? twoLines(text, 0) : [text], style, across);

/** The box of a name `width` × `height` set at (x, y) on the side facing direction (ux, uy). */
const boxFacing = (x, y, ux, uy, width, height) => {
  const left = ux > 0.35 ? x : ux < -0.35 ? x - width : x - width / 2;
  const top = uy > 0.35 ? y : uy < -0.35 ? y - height : y - height / 2;
  return { left, top, right: left + width, bottom: top + height };
};
const overlaps = (a, b) => a.left < b.right + LABEL_GAP && b.left < a.right + LABEL_GAP && a.top < b.bottom + LABEL_GAP && b.top < a.bottom + LABEL_GAP;

/**
 * Where the full map's names go. `turned` draws the plan a quarter-turn anticlockwise
 * (north to the left), so its long side runs across a landscape screen; the names stay
 * upright. Hall names sit inside their halls, Tamil above the centrepiece and English below,
 * kept within the room squares — or, where they would not fit readably, on a name-plate
 * just outside the hall; a room's name stands outside its wall, pushed further out
 * (with a leader line back) until it clears every name already placed. The viewBox fits
 * the halls and every name.
 */
function letterPlan(plan, turned, lang) {
  const name = (english) => translate(english, undefined, lang);
  const toView = turned ? ([x, z]) => [z, -x] : ([x, z]) => [x, z];
  const placed = [];
  const halls = plan.halls.map((hall) => {
    const [x, y] = toView([hall.x, hall.z]);
    const squares = hall.rooms.map((room) => toView([room.x, room.z]));
    const inner = hallApothem(hall.spec) - 0.6;
    /** How wide a name may be inside the hall between heights `top` and `bottom`: within the walls and clear of the room squares. */
    const acrossBetween = (top, bottom) => {
      const far = Math.max(Math.abs(top - y), Math.abs(bottom - y));
      let half = Math.sqrt(Math.max(0, inner * inner - far * far));
      for (const [sx, sy] of squares) {
        if (sy + ROOM_SIZE * 0.75 > top && sy - ROOM_SIZE * 0.75 < bottom) half = Math.min(half, Math.abs(sx - x) - ROOM_SIZE * 0.75 - 0.4);
      }
      return 2 * Math.max(half, 0);
    };
    const gap = 2; // from the centre to a name, past the centrepiece
    /** A name inside the hall, above the centrepiece or `below` it: on one line or two, whichever is set larger. */
    const fitInside = (text, style, below) => {
      const across = (lines) => {
        const height = lines * style.size * LINE_HEIGHT;
        return below ? acrossBetween(y + gap, y + gap + height) : acrossBetween(y - gap - height, y - gap);
      };
      const single = setLines([text], style, across(1));
      const split = twoLines(text, 0);
      const double = split.length > 1 ? setLines(split, style, across(2)) : single;
      return double.size > single.size ? double : single;
    };
    let tamil = fitInside(hall.spec.tamil, LETTERING.hallTamil, false);
    let title = fitInside(name(hall.spec.title), LETTERING.hall, true);
    if (tamil.size >= LETTERING.hallTamil.size * 0.85 && title.size >= LETTERING.hall.size * 0.85) {
      // Inside: Tamil above the centrepiece, English below.
      const tamilBox = { left: x - tamil.width / 2, right: x + tamil.width / 2, top: y - gap - tamil.height, bottom: y - gap };
      const titleBox = { left: x - title.width / 2, right: x + title.width / 2, top: y + gap, bottom: y + gap + title.height };
      placed.push(tamilBox, titleBox);
      return { id: hall.spec.id, x, tamil: { ...tamil, top: tamilBox.top }, title: { ...title, top: titleBox.top }, plate: null };
    }
    // Too full of rooms to hold its name readably: a name-plate outside a wall with no room or
    // corridor (a relief plaque's), preferring one above or below, clear of the names placed so far.
    tamil = fitName(hall.spec.tamil, LETTERING.hallTamil, 26);
    title = fitName(name(hall.spec.title), LETTERING.hall, 26);
    const pad = 0.8;
    const width = Math.max(tamil.width, title.width) + 2 * pad;
    const height = tamil.height + title.height + 0.4 + 2 * pad;
    const sides = hall.plaques.map((plaque) => toView([plaque.dx, plaque.dz])).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
    const at = ([ux, uy], distance) => boxFacing(x + ux * distance, y + uy * distance, ux, uy, width, height);
    let plate = sides.map((side) => at(side, hall.reach + 1)).find((box) => !placed.some((other) => overlaps(box, other)));
    for (let distance = hall.reach + 1; !plate; distance += 0.5) {
      const box = at(sides[0] ?? [0, -1], distance);
      if (!placed.some((other) => overlaps(box, other)) || distance > hall.reach + 20) plate = box;
    }
    placed.push(plate);
    const centre = (plate.left + plate.right) / 2;
    return { id: hall.spec.id, x: centre, tamil: { ...tamil, top: plate.top + pad }, title: { ...title, top: plate.top + pad + tamil.height + 0.4 }, plate };
  });
  const hallDiscs = plan.halls.map((hall) => {
    const [x, y] = toView([hall.x, hall.z]);
    return { x, y, r: hall.reach };
  });
  const rooms = plan.halls.flatMap((hall) => hall.rooms.map((room) => {
    const [cx, cy] = toView([hall.x, hall.z]);
    const [ux, uy] = toView([room.dx, room.dz]);
    const lines = twoLines(name(room.wing.title));
    const { size } = LETTERING.room;
    const width = Math.max(...lines.map((line) => textWidth(line, LETTERING.room))) * size;
    const height = lines.length * size * LINE_HEIGHT;
    const start = hall.reach + 1.4;
    // A spot `distance` out from the hall's centre, slid `side` metres across its line.
    const boxAt = (distance, side = 0) => boxFacing(cx + ux * distance - uy * side, cy + uy * distance + ux * side, ux, uy, width, height);
    // The nearest spot out along its line (or slid a little across it) that covers no name placed so far, and as little of any hall's floor as it can.
    const intrusion = (box) => Math.max(0, ...hallDiscs.map(({ x, y, r }) => r - Math.hypot(x - Math.max(box.left, Math.min(x, box.right)), y - Math.max(box.top, Math.min(y, box.bottom)))));
    const cost = (distance, side) => {
      const box = boxAt(distance, side);
      return (placed.some((other) => overlaps(box, other)) ? 1000 : 0) + intrusion(box) * 10 + (distance - start) + Math.abs(side) * 1.5;
    };
    let distance = start;
    let side = 0;
    for (let step = 0; step <= 40; step++) {
      for (const across of [0, -2, 2, -4, 4, -6, 6]) {
        if (cost(start + step * 0.5, across) < cost(distance, side)) [distance, side] = [start + step * 0.5, across];
      }
    }
    const box = boxAt(distance, side);
    placed.push(box);
    const wall = hall.reach + 0.4;
    return {
      hallId: hall.spec.id,
      wing: room.wing,
      lines,
      size,
      box,
      anchor: ux > 0.35 ? 'start' : ux < -0.35 ? 'end' : 'middle',
      leader: distance > start + 0.9 || side ? [cx + ux * wall, cy + uy * wall, cx + ux * (distance - 0.3) - uy * side, cy + uy * (distance - 0.3) + ux * side] : null,
    };
  }));
  const points = [...plan.halls.flatMap((hall) => hall.corners.map(toView)), ...placed.flatMap((box) => [[box.left, box.top], [box.right, box.bottom]])];
  const pad = 2;
  const left = Math.min(...points.map(([x]) => x)) - pad;
  const top = Math.min(...points.map(([, y]) => y)) - pad;
  const width = Math.max(...points.map(([x]) => x)) + pad - left;
  const height = Math.max(...points.map(([, y]) => y)) + pad - top;
  return { turned, toView, halls, rooms, left, top, width, height, viewBox: `${left} ${top} ${width} ${height}` };
}

/** Places the visitor's marker: at `view` (ground x, z and bearing) when live, else at the centre of hall `hallId`. */
export function placeMarker(element, view) {
  element?.setAttribute('transform', `translate(${view.x.toFixed(2)} ${view.z.toFixed(2)}) rotate(${deg(view.heading).toFixed(1)})`);
}

/**
 * The plan as SVG. `currentHall` is highlighted; `markerRef` receives the visitor's marker
 * (a <g>, placed by placeMarker). With `onPick(hallId, roomId?)` the halls and rooms are
 * buttons; `lettering` (letterPlan) adds every hall's and room's name, and may turn the plan.
 */
function PlanDrawing({ plan, currentHall, markerRef, live, onPick, lettering, markerScale = 1, className = '', style }) {
  const here = plan.byId.get(currentHall);
  const { L, T } = useI18n();
  const pick = onPick && ((hallId, roomId) => (event) => {
    if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    event.stopPropagation();
    onPick(hallId, roomId);
  });
  const asButton = (label, hallId, roomId) => (onPick
    ? { role: 'button', tabIndex: 0, 'aria-label': label, onClick: pick(hallId, roomId), onKeyDown: pick(hallId, roomId), className: 'cursor-pointer outline-none [&:focus-visible>*:first-child]:stroke-[#fff0c2] [&:hover>*:first-child]:stroke-[#fff0c2]' }
    : {});

  // The building is drawn in plan metres, turned with the lettering if it is; the names stay upright.
  const turn = lettering?.turned ? 'rotate(-90)' : undefined;

  return (
    <svg viewBox={lettering?.viewBox ?? plan.viewBox} className={className} style={style} role={onPick ? 'group' : 'img'} aria-label={T('Museum floor plan', 'அருங்காட்சியகத் தளவரைபடம்', 'संग्रहालय का तल-मानचित्र')}>
      <defs>
        <radialGradient id="map-floor" cx="50%" cy="45%" r="60%">
          <stop offset="0" stopColor="#f4e2bd" />
          <stop offset="1" stopColor="#d7bb8a" />
        </radialGradient>
      </defs>
      <g transform={turn}>
      {/* Corridors between halls */}
      {plan.passages.map((passage) => (
        <g key={passage.key}>
          <line x1={passage.x1} y1={passage.z1} x2={passage.x2} y2={passage.z2} stroke="#8c6d3a" strokeWidth={PASSAGE_WIDTH + 1.2} strokeLinecap="butt" />
          <line x1={passage.x1} y1={passage.z1} x2={passage.x2} y2={passage.z2} stroke="#e6cf9f" strokeWidth={PASSAGE_WIDTH} />
          <line x1={passage.x1} y1={passage.z1} x2={passage.x2} y2={passage.z2} stroke="#b23a2a" strokeOpacity="0.55" strokeWidth={1.4} />
        </g>
      ))}
      {plan.halls.map((hall) => {
        const isHere = hall.spec.id === currentHall;
        return (
          <g key={hall.spec.id}>
            {/* The hall */}
            <g {...asButton(T(`${hall.spec.title} hall`, hall.spec.tamil, L(hall.spec.title)), hall.spec.id)}>
              <polygon points={hall.outline} fill="url(#map-floor)" stroke={isHere ? '#f4d792' : '#8c6d3a'} strokeWidth={isHere ? 1.4 : 0.8} />
              <circle cx={hall.x} cy={hall.z} r={hall.spec.centrepiece === 'lamp' ? 1.2 : 1.8} fill={hall.spec.centrepiece === 'monolith' ? '#211a14' : '#c99a45'} stroke="#6b4a1e" strokeWidth="0.4" />
              <title>{L(hall.spec.title)}</title>
            </g>
            {/* Relief plaques on the walls, then the rooms' displays (each a way into its room) */}
            {hall.plaques.map((plaque) => (
              <rect key={`${plaque.x},${plaque.z}`} x="-1.4" y="-0.35" width="2.8" height="0.7" transform={`translate(${plaque.x} ${plaque.z}) rotate(${deg(plaque.bearing)})`} fill="#c99a45" opacity="0.75" pointerEvents="none" />
            ))}
            {hall.rooms.map((room) => (
              <g key={room.wing.id} {...asButton(`${L(room.wing.title)} — ${L(hall.spec.title)}`, hall.spec.id, room.wing.id)}>
                <rect x={-ROOM_SIZE / 2} y={-ROOM_SIZE / 2} width={ROOM_SIZE} height={ROOM_SIZE} rx="0.5" transform={`translate(${room.x} ${room.z}) rotate(${deg(room.bearing)})`} fill={room.wing.accent ?? '#7a4a22'} stroke="#3a220e" strokeWidth="0.5" />
                <title>{L(room.wing.title)}</title>
              </g>
            ))}
          </g>
        );
      })}
      </g>
      {lettering && (
        <>
          {/* Hall names inside their halls (choosing one travels there, as the hall does) */}
          {lettering.halls.map((hall) => (
            <g key={`name-${hall.id}`} stroke="#f4e2bd" paintOrder="stroke" textAnchor="middle" className="cursor-pointer" onClick={pick?.(hall.id)} aria-hidden="true">
              {hall.plate && <rect x={hall.plate.left} y={hall.plate.top} width={hall.plate.right - hall.plate.left} height={hall.plate.bottom - hall.plate.top} rx="1" fill="url(#map-floor)" stroke="#c99a45" strokeWidth="0.5" />}
              <text fontSize={hall.tamil.size} strokeWidth={hall.tamil.size * 0.32} fill="#7d2e14" className="font-bold" lang="ta" dominantBaseline="central">
                {hall.tamil.lines.map((line, i) => <tspan key={line} x={hall.x} y={hall.tamil.top + (i + 0.5) * hall.tamil.size * LINE_HEIGHT}>{line}</tspan>)}
              </text>
              <text fontSize={hall.title.size} strokeWidth={hall.title.size * 0.3} fill="#3a220e" className="font-serif font-bold" dominantBaseline="central">
                {hall.title.lines.map((line, i) => <tspan key={line} x={hall.x} y={hall.title.top + (i + 0.5) * hall.title.size * LINE_HEIGHT}>{line}</tspan>)}
              </text>
            </g>
          ))}
          {/* Room names over everything else, so no hall hides one; a leader line back to the wall when pushed out */}
          {lettering.rooms.map((room) => {
            const x = room.anchor === 'start' ? room.box.left : room.anchor === 'end' ? room.box.right : (room.box.left + room.box.right) / 2;
            return (
              <g key={`name-${room.wing.id}`} aria-hidden="true">
                {room.leader && <line x1={room.leader[0]} y1={room.leader[1]} x2={room.leader[2]} y2={room.leader[3]} stroke="#e6cf9f" strokeOpacity="0.7" strokeWidth="0.3" strokeDasharray="0.8 0.6" />}
                <text textAnchor={room.anchor} dominantBaseline="central" fontSize={room.size} fill="#f3e2bd" stroke="#1a0f07" strokeWidth={room.size * 0.28} paintOrder="stroke" className="cursor-pointer font-serif font-semibold hover:fill-[#fff0c2]" onClick={pick?.(room.hallId, room.wing.id)}>
                  {room.lines.map((line, i) => <tspan key={line} x={x} y={room.box.top + (i + 0.5) * room.size * LINE_HEIGHT}>{line}</tspan>)}
                </text>
              </g>
            );
          })}
        </>
      )}
      <g transform={turn}>
      {here && <polygon points={here.outline} fill="none" stroke="#f4d792" strokeWidth="1.2" className="animate-pulse" pointerEvents="none" />}
      {/*
        The visitor: a navigation arrow (and a faint cone of view) pointing up before
        rotation, so placeMarker turns it to the bearing the camera faces. Without the live
        3D view there is no bearing, so a dot marks the hall instead.
      */}
      <g ref={markerRef} pointerEvents="none" transform={here ? `translate(${here.x} ${here.z})` : undefined}>
        <g transform={`scale(${markerScale})`}>
          {live ? (
            <>
              <path d="M0 0 L-5 -11 A12 12 0 0 1 5 -11 Z" fill="#f4d792" fillOpacity="0.3" />
              <path d="M0 -4.2 L3 3.2 L0 1.5 L-3 3.2 Z" fill="#b23a2a" stroke="#fff6dc" strokeWidth="0.8" strokeLinejoin="round" />
            </>
          ) : (
            <circle r="2.1" fill="#b23a2a" stroke="#fff6dc" strokeWidth="0.8" />
          )}
        </g>
      </g>
      </g>
    </svg>
  );
}

function readCollapsed() {
  try {
    const stored = window.localStorage.getItem('museum-minimap-collapsed');
    if (stored !== null) return stored === '1';
  } catch { /* storage unavailable: fall back to the screen size */ }
  return window.matchMedia('(max-width: 640px)').matches;
}

/**
 * The mini-map in the corner: the whole plan, the current hall lit, and the visitor's
 * marker. Collapses to a button (remembered on this device); choosing the plan opens the
 * full map. `markerRef` and `boxRef` let the hallway place the marker and keep its labels clear.
 */
export function MiniMap({ plan, currentHall, live, markerRef, boxRef, onOpenMap, className = '' }) {
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const toggle = () => setCollapsed((value) => {
    try { window.localStorage.setItem('museum-minimap-collapsed', value ? '0' : '1'); } catch { /* not remembered */ }
    return !value;
  });
  const hall = plan.byId.get(currentHall)?.spec;
  const { L, T } = useI18n();

  return (
    <div ref={boxRef} className={`rounded-xl border border-temple-gold/70 bg-[#140d07]/85 shadow-[0_10px_30px_#000a,inset_0_1px_#fff2] backdrop-blur ${className}`}>
      <div className="flex items-center gap-1.5 px-2 py-1">
        <MapIcon size={13} className="shrink-0 text-temple-gold-light" />
        <span className="min-w-0 flex-1 truncate text-[11px] font-semibold text-[#f3e2bd]" aria-live="polite">
          {collapsed ? T('Map', 'வரைபடம்', 'मानचित्र') : L(hall?.title)}
        </span>
        {!collapsed && (
          <button type="button" onClick={onOpenMap} aria-label={T('Open the museum map', 'வரைபடத்தைத் திற', 'संग्रहालय मानचित्र खोलें')} className="touch-target grid size-6 cursor-pointer place-items-center rounded-full text-temple-gold-light hover:bg-temple-gold/20">
            <Maximize2 size={12} />
          </button>
        )}
        <button type="button" onClick={toggle} aria-expanded={!collapsed} aria-label={collapsed ? T('Show the mini-map', 'சிறு வரைபடத்தைக் காட்டு', 'छोटा मानचित्र दिखाएँ') : T('Hide the mini-map', 'சிறு வரைபடத்தை மறை', 'छोटा मानचित्र छिपाएँ')} className="touch-target grid size-6 cursor-pointer place-items-center rounded-full text-temple-gold-light hover:bg-temple-gold/20">
          {collapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>
      {!collapsed && (
        <button type="button" onClick={onOpenMap} className="block cursor-pointer px-1.5 pb-1.5" aria-label={T('Open the museum map', 'வரைபடத்தைத் திற', 'संग्रहालय मानचित्र खोलें')}>
          <PlanDrawing plan={plan} currentHall={currentHall} markerRef={markerRef} live={live} markerScale={1.8} className="size-[clamp(132px,16vw,184px)] rounded-lg bg-[#2a1a0c]" />
        </button>
      )}
      <div className="flex items-center justify-center gap-1 border-t border-temple-gold/25 px-1.5 py-1">
        <PoweredByCICT size="sm" />
        {/* The way into the 2D Admin Portal: small and quiet, website only. */}
        {IS_WEB && (
          <a href="#/admin" title="Admin" aria-label="Admin portal" className="grid size-5 shrink-0 place-items-center rounded-full text-temple-gold/60 transition-colors hover:bg-temple-gold/20 hover:text-temple-gold-light" data-admin-link>
            <Lock size={10} />
          </a>
        )}
      </div>
    </div>
  );
}

/**
 * The least the full map is drawn at, in pixels per plan metre, so its smallest names stay
 * readable (about 11 px); where the plan cannot fit at that, it scrolls instead.
 */
const MIN_SCALE = 3.8;

/**
 * The full map: the plan with every hall and room named, as large as its area allows (turned
 * to run across a landscape area), and the same as a list. Choosing a hall or a room calls
 * `onTravel(hallId, roomId?)`; Escape closes.
 */
export function MapDialog({ plan, currentHall, live, markerRef, onTravel, onClose }) {
  const closeRef = useRef(null);
  const areaRef = useRef(null);
  const { lang, L, T, cl } = useI18n();
  const [area, setArea] = useState(null); // the map area's inner size, in px
  const [fontsReady, setFontsReady] = useState(() => document.fonts?.status === 'loaded');

  useLayoutEffect(() => {
    const element = areaRef.current;
    const measure = () => setArea((current) => (current?.width === element.clientWidth && current?.height === element.clientHeight ? current : { width: element.clientWidth, height: element.clientHeight }));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  // The names are measured in the map's fonts: measure again once they have loaded.
  useEffect(() => {
    if (!fontsReady) document.fonts?.ready.then(() => setFontsReady(true));
  }, [fontsReady]);

  const turned = area ? area.width > area.height * 1.1 : false;
  const lettering = useMemo(() => letterPlan(plan, turned, lang), [plan, turned, fontsReady, lang]); // fontsReady: measure again in the loaded fonts
  const fit = area ? Math.min(area.width / lettering.width, area.height / lettering.height) : MIN_SCALE;
  const scale = Math.max(fit, MIN_SCALE);
  const scrolls = fit < MIN_SCALE;

  // A plan too large for its area opens scrolled to the visitor's hall.
  useLayoutEffect(() => {
    const hall = plan.byId.get(currentHall);
    const element = areaRef.current;
    if (!scrolls || !hall || !element) return;
    const [x, y] = lettering.toView([hall.x, hall.z]);
    element.scrollLeft = (x - lettering.left) * scale - element.clientWidth / 2;
    element.scrollTop = (y - lettering.top) * scale - element.clientHeight / 2;
  }, [scrolls, lettering]); // only as the layout changes, not as the visitor moves

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      onClose();
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [onClose]);

  return (
    <div role="presentation" className="fixed inset-0 z-[1200] flex justify-center overflow-y-auto bg-[#0a0604]/80 p-2 backdrop-blur-sm sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="museum-map-title"
        className="relative my-auto flex h-fit w-full max-w-[1800px] animate-pop-in flex-col rounded-2xl border-[3px] border-temple-gold/80 bg-teak p-3 shadow-[0_30px_80px_#000d,inset_0_0_0_5px_#2a1408] sm:p-5 lg:h-[calc(100dvh-2rem)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button ref={closeRef} type="button" onClick={onClose} aria-label={T('Close the map', 'வரைபடத்தை மூடு', 'मानचित्र बंद करें')} className="touch-target absolute top-3 right-3 grid size-10 cursor-pointer place-items-center rounded-full border border-temple-gold/60 text-temple-gold-light transition hover:bg-temple-gold/20">
          <X size={20} />
        </button>
        <header className="mb-3 flex flex-wrap items-baseline gap-x-4 gap-y-0.5 pr-14">
          <p lang="ta" className="text-base leading-[1.6] font-bold text-[#e9a27a] sm:text-lg">அருங்காட்சியக வரைபடம்</p>
          <h2 id="museum-map-title" className="font-serif text-2xl font-bold tracking-wide text-temple-gold-light sm:text-3xl">{T('Museum Map', 'வரைபடம்', 'संग्रहालय मानचित्र')}</h2>
          <p className="w-full text-sm text-[#d9c6a0]">
            {T('Choose a hall or a room to travel there.', 'செல்ல விரும்பும் கூடத்தையோ அறையையோ தேர்ந்தெடுங்கள்.', 'वहाँ जाने के लिए कोई कक्ष या कमरा चुनें।')} {live ? T('The red arrow is you, pointing where you are looking.', 'சிவப்பு அம்புக்குறியே நீங்கள்; நீங்கள் பார்க்கும் திசையைக் காட்டுகிறது.', 'लाल तीर आप हैं, जो उस ओर इशारा करता है जहाँ आप देख रहे हैं।') : T('The red marker is you.', 'சிவப்புக் குறியே நீங்கள்.', 'लाल निशान आप हैं।')}
            {scrolls && ` ${T('Scroll the plan to see all of it.', 'முழுவதும் காண வரைபடத்தை உருட்டுங்கள்.', 'पूरा देखने के लिए मानचित्र को स्क्रॉल करें।')}`}
          </p>
        </header>
        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_clamp(240px,20vw,320px)] lg:grid-rows-[minmax(0,1fr)]">
          <div ref={areaRef} className="flex h-[min(68dvh,720px)] overflow-auto overscroll-contain rounded-xl border border-temple-gold/40 bg-[#2a1a0c] shadow-[inset_0_0_40px_#000a] lg:h-full">
            {area && (
              <PlanDrawing
                plan={plan}
                currentHall={currentHall}
                markerRef={markerRef}
                live={live}
                onPick={onTravel}
                lettering={lettering}
                className="m-auto block flex-none"
                style={{ width: Math.floor(lettering.width * scale), height: Math.floor(lettering.height * scale) }}
              />
            )}
          </div>
          <nav aria-label={T('Halls and rooms', 'கூடங்களும் அறைகளும்', 'कक्ष और कमरे')} className="flex max-h-[60dvh] flex-col gap-2 overflow-y-auto pr-1 lg:max-h-none lg:min-h-0">
            {plan.halls.map(({ spec }) => (
              <section key={spec.id} className={`rounded-lg border px-3 py-2 ${spec.id === currentHall ? 'border-temple-gold-light bg-[#3d2a16]' : 'border-[#5a4526] bg-[#1a1008]/70'}`}>
                <button type="button" onClick={() => onTravel(spec.id)} className="flex w-full cursor-pointer items-center gap-2 text-left">
                  <span className="size-3 shrink-0 rounded-full" style={{ background: spec.accent }} />
                  <span className="min-w-0 flex-1">
                    <span lang="ta" className="block text-[13px] leading-[1.6] font-bold text-[#e9a27a]">{spec.tamil}</span>
                    <span lang={cl} className="block font-serif text-base font-bold text-[#f8e8c5]">{L(spec.title)}</span>
                  </span>
                  {spec.id === currentHall ? <Navigation size={15} className="text-temple-gold-light" aria-label={T('You are here', 'நீங்கள் இங்கே', 'आप यहाँ हैं')} /> : <DoorOpen size={15} className="text-[#bfa982]" />}
                </button>
                <ul className="mt-1.5 flex flex-col gap-0.5 border-l border-temple-gold/30 pl-3">
                  {spec.wings.filter((wing) => !wing.passage && !wing.alcove).map((wing) => (
                    <li key={wing.id}>
                      <button type="button" onClick={() => onTravel(spec.id, wing.id)} className="w-full cursor-pointer rounded px-1.5 py-1 text-left text-sm text-[#d9c6a0] hover:bg-temple-gold/15 hover:text-[#fbe7b5]">
                        {L(wing.title)}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>
        </div>
        <PoweredByCICT className="mt-3 self-center lg:self-end" />
      </div>
    </div>
  );
}
