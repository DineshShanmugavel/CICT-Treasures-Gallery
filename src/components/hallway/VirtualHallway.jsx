import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Compass, DoorOpen, Hand, History, Landmark, LayoutGrid, Map as MapIcon, MapPinned, ScrollText, Sparkles } from 'lucide-react';
import { hallOf } from '../../data/roomBooks.js';
import { createHallwayScene } from './createHallwayScene.js';
import { layoutLabels } from './labelLayout.js';
import { StatueLoadingBadge } from './StatueLoadingBadge.jsx';
import ArchHall from './ArchHall.jsx';
import { MonumentPanel } from './Monolith.jsx';
import { ExhibitPanel } from './ExhibitPanel.jsx';
import { HALL_EXHIBITS } from '../../data/hallExhibits.js';
import MusicToggle from '../MusicToggle.jsx';
import RoomCatalogueButton from '../RoomCatalogueButton.jsx';
import { MapDialog, MiniMap, placeMarker, usePlan } from './MuseumMap.jsx';
import { routeBetween } from './hallLayout.js';
import { TempleBand } from '../HeritageMotifs.jsx';
import { GlowFireflies } from '../Fireflies.jsx';
import CICT_LOGO from '../../assets/cict-logo.jpg';
import LanguageSwitcher from '../LanguageSwitcher.jsx';
import { tri, useI18n } from '../../i18n/index.js';

/** The guided tour's halls, in order (after the visitor's own): round the ring, with the halls beyond it. */
const TOUR_HALLS = ['central', 'literature', 'historical-figures', 'artistic', 'trade', 'tn-then-vs-now', 'household', 'ainthinai'];

/** Fallback top of the label area if the header has not been measured yet. */
const LABEL_TOP = 92;

/** Quiet automatic retries (ms) before the 3D hall gives way to the arched hall. */
const RETRY_DELAYS = [800, 2000, 4000];
/** How long to wait for the browser to restore a lost WebGL context. */
const RECOVERY_WINDOW_MS = 6000;

/**
 * Explains why the 3D hall is unavailable, in words a visitor (or teacher) can act on.
 * `cause` is 'start' (WebGL could not be created) or 'lost' (it dropped and never came back).
 */
function describeGlFailure(cause) {
  let available = false;
  try {
    const probe = document.createElement('canvas');
    available = Boolean(probe.getContext('webgl2') || probe.getContext('webgl'));
  } catch {
    available = false;
  }
  if (available && cause === 'lost') return tri('The 3D graphics were interrupted and did not come back, so the arched hall is shown instead.', 'முப்பரிமாண வரைகலை தடைபட்டு மீளவில்லை; எனவே வளைவுக் கூடம் காட்டப்படுகிறது.', '3D ग्राफ़िक्स बाधित हो गए और वापस नहीं आए, इसलिए मेहराबदार कक्ष दिखाया जा रहा है।');
  return available
    ? tri('The 3D hall could not start (details are in the browser console), so the arched hall is shown instead.', 'முப்பரிமாணக் கூடம் தொடங்கவில்லை (விவரம் உலாவியின் console-இல்); எனவே வளைவுக் கூடம் காட்டப்படுகிறது.', '3D कक्ष शुरू नहीं हो सका (विवरण ब्राउज़र कंसोल में है), इसलिए मेहराबदार कक्ष दिखाया जा रहा है।')
    : tri('3D graphics (WebGL) are switched off in this browser. Turn on hardware acceleration in the browser settings and restart the browser to see the 3D hall.', 'இந்த உலாவியில் முப்பரிமாண வரைகலை (WebGL) அணைக்கப்பட்டுள்ளது. உலாவி அமைப்புகளில் hardware acceleration-ஐ இயக்கி, உலாவியை மீண்டும் தொடங்குங்கள்.', 'इस ब्राउज़र में 3D ग्राफ़िक्स (WebGL) बंद हैं। 3D कक्ष देखने के लिए ब्राउज़र सेटिंग्स में हार्डवेयर एक्सेलेरेशन चालू करें और ब्राउज़र फिर से शुरू करें।');
}


/*
 * Labels are positioned with an inline `transform` every frame, so hover effects use the
 * separate `scale` property and only it (never `transform`) is transitioned. They are near
 * opaque rather than frosted: a backdrop blur under a label that moves every frame, over a
 * canvas that redraws every frame, would be recomputed every frame.
 */
const springy = 'transition-[scale,translate,border-color,background-color,box-shadow] duration-300 ease-spring hover:scale-110 active:scale-95';

/** Floating label pinned above an arch; its position is written straight to the DOM every frame. */
function WingLabel({ wing, highlighted, labelRef, onEnter }) {
  const { L, T, cl } = useI18n();
  return (
    <button
      ref={labelRef}
      type="button"
      onClick={onEnter}
      tabIndex={-1}
      className={`pointer-events-auto invisible absolute top-0 left-0 flex w-max max-w-[min(260px,62vw)] origin-bottom cursor-pointer flex-col items-center rounded-md border px-4 pt-2 pb-2.5 text-center shadow-[0_12px_30px_#000a,inset_0_1px_#fff2] will-change-transform ${springy} ${
        highlighted
          ? 'border-[#f4d792] bg-[#2a1a0c]/95 shadow-[0_0_34px_#f1c35b55,0_12px_30px_#000a]'
          : 'border-[#caa358]/80 bg-[#140d07]/90'
      }`}
    >
      <span lang="ta" className="text-[13px] leading-tight font-bold text-[#e9a27a] sm:text-[15px]">{wing.tamil}</span>
      <span lang={cl} className="mt-0.5 font-serif text-[13px] font-semibold tracking-wider text-[#f8e8c5] uppercase sm:text-sm">{L(wing.title)}</span>
      <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-[#9b783e] px-2.5 py-0.5 text-[10px] text-[#ead8ae]">
        {wing.passage ? <><DoorOpen size={11} /> {T('Walk the corridor', 'நடைவழியில் செல்க', 'गलियारे से चलें')}</> : <>{T('Enter wing', 'உள்ளே செல்க', 'विंग में प्रवेश करें')} <ChevronRight size={11} /></>}
      </span>
    </button>
  );
}

/** Glowing invitation floating above the statue's head. */
function StatueLabel({ labelRef, highlighted, onOpen }) {
  const { T } = useI18n();
  return (
    <button
      ref={labelRef}
      type="button"
      onClick={onOpen}
      tabIndex={-1}
      className={`pointer-events-auto invisible absolute top-0 left-0 flex w-max origin-bottom cursor-pointer flex-col items-center rounded-full border px-4 py-1.5 text-center will-change-transform ${springy} ${
        highlighted
          ? 'border-[#fff0c2] bg-[#5a3a12]/95 shadow-[0_0_40px_#f4d792aa]'
          : 'border-[#f4d792] bg-[#2a1a0c]/90 shadow-[0_0_26px_#f1c35b66]'
      }`}
    >
      <span lang="ta" className="text-[13px] font-bold text-[#fbe7b5]">திருவள்ளுவர்</span>
      <span className="flex items-center gap-1 text-[10px] font-semibold tracking-wide text-[#f0cf82]">
        <Sparkles size={11} className="animate-pulse" /> {T('Tap to hear his wisdom', 'அவரது அறிவுரையைக் கேட்கத் தொடுங்கள்', 'उनकी सीख सुनने के लिए छुएँ')}
      </span>
    </button>
  );
}

/**
 * The screen areas no wing label may cover: the centrepiece (the statue, or the monolith's
 * inscriptions), as a stack of boxes, one between each pair of its outline's rings, so a
 * label may still sit above the wide, low plinth beside the stone. While the outline is
 * partly behind the camera, its bounding box stands in.
 */
function centrepieceObstacles(centrepiece) {
  if (!centrepiece?.visible) return [];
  const { outline } = centrepiece;
  if (!outline.length) return [{ left: centrepiece.left, right: centrepiece.right, top: centrepiece.top, bottom: centrepiece.bottom }];
  const rings = outline.length / 2; // up the left side, then down the right
  return Array.from({ length: rings - 1 }, (_, k) => {
    const [lowLeft, lowY] = outline[k];
    const [highLeft, highY] = outline[k + 1];
    const lowRight = outline[outline.length - 1 - k][0];
    const highRight = outline[outline.length - 2 - k][0];
    return { left: Math.min(lowLeft, highLeft), right: Math.max(lowRight, highRight), top: Math.min(lowY, highY), bottom: Math.max(lowY, highY) };
  });
}

/**
 * The 360° lobby. Visitors drag (or swipe) to look around a rotunda whose arches lead
 * to each wing; choosing a wing turns the camera, walks up to the arch, then calls
 * `onEnterWing` so the glass-door transition can take over.
 *
 * - `active`: render and accept input (false while a room covers the hallway).
 * - `started`: the visitor has entered the museum; plays the opening camera sweep.
 * - `engaged`: a wing's doors or room are open; when it clears, the camera steps back.
 * - `hidden`: kept mounted (the scene is expensive to rebuild) but invisible, e.g. behind the classic gallery.
 * - `onMeetValluvar`: the central statue (or its label) was chosen.
 * - `onOpenThenNow`, `onOpenTamilakam`: the header's Then & Now and Ancient Tamilakam buttons.
 * - `halls`: the museum's halls (see roomBooks.js): the Central Hall, where visitors start
 *   before the CICT monolith, and the halls it opens on, each by its own corridor. All the halls are
 *   one 3D building, so a neighbouring hall can be glimpsed down each corridor, and choosing
 *   a corridor glides the camera straight through into that hall.
 * - `currentRoom`: the room whose doors or interior are open, if any; the hallway moves
 *   to the hall that room stands in, so visitors return to it (e.g. after the main menu).
 *
 * Two views share this screen: the 360° panorama, and the arched hall (ArchHall) with the
 * statue on its own stage. Visitors can switch between them; if WebGL cannot start, or the
 * graphics driver drops the context, the arched hall takes over automatically, the 3D
 * hall is retried once, and a button lets the visitor try again.
 *
 * `onReady` fires once both the hall and the statue model have loaded (or failed).
 */
export default function VirtualHallway({ halls, currentRoom, active, hidden, started, engaged, onReady, onEnterWing, onShowOverview, onMeetValluvar, onOpenThenNow, onOpenTamilakam }) {
  const { L, T, cl } = useI18n();
  // The halls are one 3D building, built once; `hallId` follows the visitor through it.
  const hallList = useMemo(() => Object.values(halls), [halls]);
  const [hallId, setHallId] = useState(() => hallList[0].id);
  const hall = halls[hallId];
  const { wings } = hall;
  const hasStatue = hall.centrepiece === 'statue';
  const hasMonolith = hall.centrepiece === 'monolith';
  const [monumentOpen, setMonumentOpen] = useState(false);
  /** The hall's centrepiece model and its card (data/hallExhibits.js), if it has one; `exhibitOpen` is its key while the card is open. */
  const exhibit = HALL_EXHIBITS[hall.centrepiece] ?? null;
  const [exhibitOpen, setExhibitOpen] = useState(null);
  const [mapOpen, setMapOpen] = useState(false);
  const plan = usePlan(hallList);
  // The visitor's marker on the mini-map and the full map, moved every frame by the scene (see onFrame).
  const miniMarkerRef = useRef(null);
  const mapMarkerRef = useRef(null);
  const miniMapRef = useRef(null);
  const centrepieceRef = useRef(hall.centrepiece);
  centrepieceRef.current = hall.centrepiece;
  const mountRef = useRef(null);
  const apiRef = useRef(null);
  const labelRefs = useRef([]);
  const callbacksRef = useRef({ onReady, onEnterWing, onMeetValluvar });
  callbacksRef.current = { onReady, onEnterWing, onMeetValluvar };
  const readiness = useRef({ scene: false, statue: false, reported: false });
  // 3D status: 'starting' | 'ready' | 'retrying' | 'recovering' | 'failed'
  const [glStatus, setGlStatus] = useState('starting');
  const [failure, setFailure] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const autoRetries = useRef(0);
  const recoveryTimer = useRef(0);
  const [mode, setMode] = useState('panorama');
  const showArches = glStatus === 'failed' || mode === 'arches';
  const [focusIndex, setFocusIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [statueHovered, setStatueHovered] = useState(false);
  const [approaching, setApproaching] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [reducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const markReady = useCallback((part) => {
    const state = readiness.current;
    state[part] = true;
    if (state.scene && state.statue && !state.reported) {
      state.reported = true;
      callbacksRef.current.onReady?.(true);
    }
  }, []);
  // The statue is part of the 3D building; it reports once its model has loaded (or failed).
  const [statueLoaded, setStatueLoaded] = useState(false);
  const onStatueLoaded = useCallback(() => {
    setStatueLoaded(true);
    markReady('statue');
  }, [markReady]);

  /*
   * Per-frame label layout. Each label tracks its arch (or the statue), but is placed by
   * layoutLabels() so no two overlap and all stay between the header and the wing card.
   * A displaced label eases to its new spot and keeps a leader line to its anchor.
   */
  const headerRef = useRef(null);
  // Where the header's buttons end (its fading backdrop reaches lower): the guided tour's card sits there.
  const [headerBottom, setHeaderBottom] = useState(112);
  useEffect(() => {
    const element = headerRef.current;
    if (!element) return undefined;
    const observer = new ResizeObserver(() => setHeaderBottom(Math.round(element.offsetHeight - 24)));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const dockRef = useRef(null);
  const lineRefs = useRef([]);
  const shifts = useRef([]); // eased displacement from anchor, per label
  const slots = useRef(new Map()); // layout slot each label used last frame
  const focusRef = useRef(0);
  const hoverRef = useRef(null);
  focusRef.current = focusIndex;
  hoverRef.current = hoverIndex;
  const placeLabels = (labels, centrepiece) => {
    const mount = mountRef.current;
    if (!mount) return;
    const width = mount.clientWidth;
    const height = mount.clientHeight;
    // Labels shrink on small screens, never below a readable size.
    const viewportScale = Math.min(1, Math.max(0.74, Math.min(width / 1280, height / 760)));
    const area = {
      left: 8,
      right: width - 8,
      top: (headerRef.current?.getBoundingClientRect().bottom ?? LABEL_TOP) - 18,
      bottom: (dockRef.current?.getBoundingClientRect().top ?? height) + 52,
    };

    const items = [];
    labels.forEach((label, i) => {
      const element = labelRefs.current[i];
      if (!element || !label.visible || label.opacity < 0.15) return;
      // A fixed size per screen (not per frame), so labels do not breathe as they cross the view.
      const scale = viewportScale;
      const isStatue = i === wings.length;
      // Whole-number priorities with the index as tie-break keep the placement order stable
      // while the camera turns; only hover/focus changes reorder labels.
      const priority = (i === hoverRef.current ? 6 : 0) + (i === focusRef.current ? 5 : 0) + (isStatue ? 4 : 0) - i * 0.01;
      items.push({ id: i, anchorX: label.x, anchorY: label.y, width: element.offsetWidth * scale, height: element.offsetHeight * scale, priority, scale, overObstacles: isStatue });
    });
    // Labels keep clear of the centrepiece and of the mini-map.
    const miniMap = miniMapRef.current?.getBoundingClientRect();
    const obstacles = [...centrepieceObstacles(centrepiece), ...(miniMap?.width ? [{ left: miniMap.left - 6, right: miniMap.right + 6, top: miniMap.top - 6, bottom: miniMap.bottom + 6 }] : [])];
    const spots = layoutLabels(items, area, Math.round(10 * viewportScale), slots.current, obstacles);
    const byId = new Map(items.map((item) => [item.id, item]));

    labels.forEach((label, i) => {
      const element = labelRefs.current[i];
      const line = lineRefs.current[i];
      if (!element) return;
      const item = byId.get(i);
      const spot = item && spots.get(i);
      if (!spot) {
        element.style.visibility = 'hidden';
        if (line) line.style.visibility = 'hidden';
        shifts.current[i] = null;
        return;
      }
      // Ease only the displacement, so labels still track their arch exactly while dragging.
      const target = { x: spot.x - label.x, y: spot.y - label.y };
      const previous = shifts.current[i];
      const shift = previous && !reducedMotion
        ? { x: previous.x + (target.x - previous.x) * 0.12, y: previous.y + (target.y - previous.y) * 0.12 }
        : target;
      shifts.current[i] = shift;
      const x = label.x + shift.x;
      const y = label.y + shift.y;
      element.style.visibility = 'visible';
      element.style.opacity = String(label.opacity);
      element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -100%) scale(${item.scale})`;

      // Leader line from the anchor to the nearest edge of a displaced label.
      if (!line) return;
      const endY = y < label.y ? y : y - item.height;
      const dx = x - label.x;
      const dy = endY - label.y;
      const length = Math.hypot(dx, dy);
      if (length < 14) {
        line.style.visibility = 'hidden';
        return;
      }
      line.style.visibility = 'visible';
      line.style.opacity = String(label.opacity * 0.85);
      line.style.width = `${length}px`;
      line.style.transform = `translate3d(${label.x}px, ${label.y}px, 0) rotate(${Math.atan2(dy, dx)}rad)`;
    });
  };

  useEffect(() => {
    const mount = mountRef.current;
    let api;
    try {
      api = createHallwayScene({
        mount,
        halls: hallList,
        reducedMotion,
        // The visitor glided down a corridor into the other hall.
        onHallChange: (id) => {
          shifts.current = [];
          slots.current = new Map(); // that hall's labels start afresh
          setHoverIndex(null);
          setHallId(id);
        },
        onFocusChange: setFocusIndex,
        onHover: setHoverIndex,
        onSelect: (index) => approachRef.current(index),
        onStatueHover: setStatueHovered,
        onStatueSelect: () => {
          if (centrepieceRef.current === 'monolith') setMonumentOpen(true);
          else if (HALL_EXHIBITS[centrepieceRef.current]) setExhibitOpen(centrepieceRef.current);
          else callbacksRef.current.onMeetValluvar?.();
        },
        onStatueLoaded,
        onFrame: (labels, centrepiece, view) => {
          placeLabels(labels, centrepiece);
          placeMarker(miniMarkerRef.current, view);
          placeMarker(mapMarkerRef.current, view);
        },
        // A lost context is usually handed back within moments: wait before switching views.
        onContextLost: () => {
          console.warn('3D hallway: WebGL context lost; waiting for the browser to restore it.');
          setGlStatus('recovering');
          window.clearTimeout(recoveryTimer.current);
          recoveryTimer.current = window.setTimeout(() => {
            console.error('3D hallway: WebGL context was not restored.');
            setFailure(describeGlFailure('lost'));
            setGlStatus('failed');
          }, RECOVERY_WINDOW_MS);
        },
        onContextRestored: () => {
          window.clearTimeout(recoveryTimer.current);
          setFailure(null);
          setGlStatus('ready');
        },
      });
    } catch (error) {
      console.error(`3D hallway could not start (attempt ${autoRetries.current + 1}):`, error);
      setApproaching(false);
      // Let visitors into the museum while the 3D hall keeps trying in the background.
      callbacksRef.current.onReady?.(false);
      if (autoRetries.current < RETRY_DELAYS.length) {
        setGlStatus('retrying');
        const delay = RETRY_DELAYS[autoRetries.current];
        autoRetries.current += 1;
        const retryTimer = window.setTimeout(() => setAttempt((count) => count + 1), delay);
        return () => window.clearTimeout(retryTimer);
      }
      setFailure(describeGlFailure('start'));
      setGlStatus('failed');
      return undefined;
    }
    autoRetries.current = 0;
    setFailure(null);
    setGlStatus('ready');
    apiRef.current = api;
    api.setActive(true);
    // A rebuilt building (after a lost context) starts in the first hall.
    setHallId(hallList[0].id);
    const ready = window.requestAnimationFrame(() => markReady('scene'));
    return () => {
      window.cancelAnimationFrame(ready);
      window.clearTimeout(recoveryTimer.current);
      api.dispose();
      apiRef.current = null;
    };
  }, [hallList, reducedMotion, markReady, attempt]);

  // The panorama only renders while it is the visible view.
  useEffect(() => {
    apiRef.current?.setActive(active && !showArches);
  }, [active, showArches, attempt]);

  useEffect(() => {
    if (started) apiRef.current?.intro();
  }, [started]);

  const wasEngaged = useRef(false);
  useEffect(() => {
    if (wasEngaged.current && !engaged) {
      apiRef.current?.reset();
      setApproaching(false);
    }
    wasEngaged.current = engaged;
  }, [engaged]);

  useEffect(() => {
    if (!started) return undefined;
    const timer = window.setTimeout(() => setShowHint(false), 7000);
    return () => window.clearTimeout(timer);
  }, [started]);

  /** Moves to a hall at once, without the glide (the arched view, or a room opened from the menu). */
  const showHall = useCallback((id) => {
    if (apiRef.current) apiRef.current.showHall(id); // reports back through onHallChange
    else setHallId(id);
  }, []);

  const approach = useCallback(
    (index) => {
      if (approaching) return;
      setShowHint(false);
      const wing = wings[index];
      if (wing.alcove) return; // a closed arch: nothing to enter
      if (!apiRef.current) {
        if (wing.passage) showHall(wing.passage);
        else callbacksRef.current.onEnterWing(wing.id);
        return;
      }
      setApproaching(true);
      // A corridor is open: the camera glides down it into the other hall (no doors to wait for).
      if (wing.passage) apiRef.current.approach(index, () => setApproaching(false));
      else apiRef.current.approach(index, () => callbacksRef.current.onEnterWing(wing.id));
    },
    [approaching, wings, showHall],
  );
  const approachRef = useRef(approach);
  approachRef.current = approach;

  // A room opened from elsewhere (the main menu, the overview) may stand in the other hall:
  // move there behind its doors, so leaving the room returns the visitor to its hall.
  useEffect(() => {
    if (!currentRoom) return;
    const target = hallOf(currentRoom);
    if (target !== hallId) showHall(target);
  }, [currentRoom]); // eslint-disable-line react-hooks/exhaustive-deps -- follow the room only when it changes

  /** Turn to wing index, passing over alcoves in the direction of travel (rom is where the turn started). */
  const lookAt = (index, from = focusIndex) => {
    const direction = index < from ? -1 : 1;
    let next = (index + wings.length) % wings.length;
    for (let i = 0; wings[next].alcove && i < wings.length; i += 1) next = (next + direction + wings.length) % wings.length;
    setShowHint(false);
    if (apiRef.current) apiRef.current.lookAt(next);
    else setFocusIndex(next);
  };

  useEffect(() => {
    if (!active || engaged || showArches || monumentOpen || exhibitOpen || mapOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, [contenteditable]')) return;
      if (event.key === 'ArrowLeft') lookAt(focusIndex - 1);
      else if (event.key === 'ArrowRight') lookAt(focusIndex + 1);
      else if (event.key === 'Enter' && (event.target === document.body || event.target === mountRef.current)) approach(focusIndex);
      else return;
      event.preventDefault();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const closeMonument = useCallback(() => setMonumentOpen(false), []);
  const closeExhibit = useCallback(() => setExhibitOpen(null), []);
  const closeMap = useCallback(() => setMapOpen(false), []);
  /**
   * From the museum map: go to hall 	argetHall, and into room 
oomId if given. In the
   * 3D hall the visitor glides there along the corridors (fast; the shortest way, at most
   * through the hub and a ring hall to the halls beyond the ring), then walks up to the room's doors; in the arched view, or with
   * no 3D, they are there at once.
   */
  const travelTo = (targetHall, roomId = null) => {
    setMapOpen(false);
    setShowHint(false);
    if (approaching) return;
    const target = halls[targetHall];
    const enterIndex = roomId ? target.wings.findIndex((wing) => wing.id === roomId) : -1;
    if (!apiRef.current || showArches) {
      if (targetHall !== hallId) showHall(targetHall);
      if (roomId) callbacksRef.current.onEnterWing(roomId);
      return;
    }
    const route = routeBetween(hallList, hallId, targetHall) ?? [targetHall];
    if (!route.length && enterIndex < 0) return; // already here
    setApproaching(true);
    apiRef.current.travel(route, { enterIndex: enterIndex < 0 ? null : enterIndex }, () => {
      if (roomId) callbacksRef.current.onEnterWing(roomId);
      else setApproaching(false);
    });
  };
  /*
   * The guided tour: a cinematic glide through every hall in turn (TOUR_HALLS, beginning
   * with the visitor's own), pausing in each to look at its centrepiece and then turning to
   * each of its rooms' arches, with a caption naming them. Touching the hall, Escape, the
   * End tour button, or opening a room ends it where the visitor stands. `tour` is the
   * caption's state while it runs; each run has a number, so a stopped run's pending steps
   * do nothing.
   */
  const [tour, setTour] = useState(null);
  const tourRun = useRef(0);
  const hallIdRef = useRef(hallId);
  hallIdRef.current = hallId;
  const stopTour = useCallback(() => {
    tourRun.current += 1;
    setTour(null);
  }, []);
  const startTour = () => {
    const api = apiRef.current;
    if (!api || showArches || approaching) return;
    setShowHint(false);
    setMapOpen(false);
    const run = ++tourRun.current;
    const alive = () => tourRun.current === run;
    const wait = (ms) => new Promise((resolve) => { window.setTimeout(resolve, ms); });
    const glance = (target, duration) => new Promise((resolve) => api.glance(target, { duration }, resolve));
    const glide = (route) => new Promise((resolve) => api.travel(route, { speed: 1.3 }, resolve));
    const start = hallIdRef.current;
    const order = [start, ...TOUR_HALLS.filter((id) => id !== start && halls[id])];
    (async () => {
      for (let step = 0; step < order.length; step += 1) {
        const id = order[step];
        const hall = halls[id];
        const caption = { step: step + 1, total: order.length, ta: hall.tamil, title: hall.title, subtitle: hall.subtitle, room: null };
        if (id !== hallIdRef.current) {
          setTour({ ...caption, moving: true });
          await glide(routeBetween(hallList, hallIdRef.current, id) ?? [id]);
          if (!alive()) return;
        }
        setTour(caption);
        await glance('centre', 1500);
        if (!alive()) return;
        await wait(2000);
        for (const [index, wing] of hall.wings.entries()) {
          if (!alive()) return;
          if (wing.alcove || wing.passage) continue;
          setTour({ ...caption, room: { ta: wing.tamil, title: wing.title } });
          await glance(index, 1300);
          if (!alive()) return;
          await wait(1000);
        }
      }
      if (!alive()) return;
      setTour({ done: true, step: order.length, total: order.length, ta: 'சுற்றுலா நிறைவு', title: 'The tour is complete', subtitle: 'Choose any hall or room to explore it at your own pace.', room: null });
      await glance('centre', 1500);
      await wait(3500);
      if (alive()) setTour(null);
    })();
  };
  // Touching the hall, or opening a room, takes back the camera.
  useEffect(() => {
    if (!tour) return undefined;
    const mount = mountRef.current;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') stopTour();
    };
    mount?.addEventListener('pointerdown', stopTour);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      mount?.removeEventListener('pointerdown', stopTour);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [tour, stopTour]);
  useEffect(() => {
    if (engaged || showArches || !active) stopTour();
  }, [engaged, showArches, active, stopTour]);

  const chromeHidden = approaching ? 'pointer-events-none opacity-0' : 'opacity-100';
  const meetValluvar = () => {
    setShowHint(false);
    onMeetValluvar?.();
  };
  const retry3d = () => {
    autoRetries.current = 0;
    setFailure(null);
    setGlStatus('starting');
    setMode('panorama');
    setAttempt((count) => count + 1);
  };
  const enterFromArch = (id) => {
    const wing = wings.find((candidate) => candidate.id === id);
    if (wing?.passage) showHall(wing.passage);
    else callbacksRef.current.onEnterWing(id);
  };
  const viewButton = (selected) =>
    `inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition duration-300 ease-spring active:scale-95 ${
      selected ? 'bg-gradient-to-br from-temple-gold-light to-temple-gold text-teak-dark shadow-[0_0_14px_#d4a64a66]' : 'text-[#ead8ad] hover:text-temple-gold-light'
    }`;
  const roundButton = `grid size-10 shrink-0 cursor-pointer place-items-center rounded-full border border-[#d3ad60] bg-[#120c07]/80 text-[#f2d38b] backdrop-blur hover:bg-[#7d5726] ${springy}`;

  return (
    <section className={`fixed inset-0 z-[1050] overflow-hidden bg-[#120b06] font-sans text-parchment select-none ${hidden ? 'invisible' : ''}`} aria-hidden={hidden || undefined} aria-label={T('360 degree museum hallway', '360° அருங்காட்சியகக் கூடம்', '360° संग्रहालय गलियारा')}>
      <div ref={mountRef} className="absolute inset-0" onPointerDown={() => setShowHint(false)} />
      {/*
        Labels track their arches and the statue. They form a layer above the whole 3D scene
        and its colour grade, so geometry never cuts into them.
      */}
      {!showArches && (
        <div className={`pointer-events-none absolute inset-0 z-[5] transition-opacity duration-500 ${chromeHidden}`}>
          {/* Leader lines join a displaced label back to its arch or the statue */}
          {[...wings.map((wing) => wing.id), 'statue'].map((key, index) => (
            <span
              key={`line-${key}`}
              ref={(element) => { lineRefs.current[index] = element; }}
              className="invisible absolute top-0 left-0 h-px origin-left bg-gradient-to-r from-temple-gold-light to-temple-gold/30 shadow-[0_0_6px_#f4d79288] before:absolute before:-top-[3px] before:-left-[3px] before:size-[7px] before:rounded-full before:bg-temple-gold-light before:shadow-[0_0_8px_#f4d792]"
              aria-hidden="true"
            />
          ))}
          {wings.map((wing, index) => !wing.alcove && (
            <WingLabel
              key={wing.id}
              wing={wing}
              highlighted={hoverIndex === index || focusIndex === index}
              labelRef={(element) => { labelRefs.current[index] = element; }}
              onEnter={() => approach(index)}
            />
          ))}
          {hasStatue && (
            <StatueLabel
              highlighted={statueHovered}
              labelRef={(element) => { labelRefs.current[wings.length] = element; }}
              onOpen={meetValluvar}
            />
          )}
        </div>
      )}
      {hasStatue && !showArches && glStatus === 'ready' && !statueLoaded && <StatueLoadingBadge />}

      {/* Seven glowing fireflies drifting through the hall */}
      {!showArches && <GlowFireflies count={7} seed={11} />}

      {/* Amber-and-gold colour grade and vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,#ffcf7a14,transparent_60%)] mix-blend-screen" />
      {/* Vignette centred a little low and kept light, so the floor stays warm rather than black */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,transparent_62%,#0c090680_100%)]" />
      {/* Soft warm lift along the bottom of the hall */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#ffc879]/12 via-[#ffc879]/5 to-transparent mix-blend-screen" />

      {!showArches && (glStatus === 'retrying' || glStatus === 'recovering') && (
        <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center" role="status" aria-live="polite">
          <span className="flex items-center gap-3 rounded-full border border-temple-gold/60 bg-teak-dark/90 px-5 py-2.5 text-sm text-temple-gold-light shadow-[0_0_30px_#d4a64a33] backdrop-blur-md">
            <span className="size-4 animate-spin rounded-full border-2 border-temple-gold/30 border-t-temple-gold-light" aria-hidden="true" />
            {glStatus === 'retrying' ? T('Preparing the 3D hall…', 'முப்பரிமாணக் கூடம் தயாராகிறது…', '3D कक्ष तैयार हो रहा है…') : T('Reconnecting 3D graphics…', 'முப்பரிமாண வரைகலை மீண்டும் இணைகிறது…', '3D ग्राफ़िक्स फिर से जुड़ रहे हैं…')}
          </span>
        </div>
      )}

      {showArches && (
        <ArchHall
          hall={hall}
          wings={wings}
          onEnterWing={enterFromArch}
          onMeetValluvar={meetValluvar}
          onOpenMonument={() => setMonumentOpen(true)}
          notice={failure}
          onRetry={failure ? retry3d : null}
          reducedMotion={reducedMotion}
          active={active}
        />
      )}

      {/* Header: the museum's name on top (with the language and music), its actions on a row of their own */}
      <header ref={headerRef} className={`absolute inset-x-0 top-0 z-10 transition-opacity duration-500 ${chromeHidden}`}>
        <div className="flex flex-col gap-2 bg-gradient-to-b from-[#0c0906]/95 via-[#0c0906]/75 to-[#0c0906]/0 px-4 pt-3 pb-8 sm:px-6">
          <div className="flex items-center gap-3">
            <img src={CICT_LOGO} alt={T('CICT emblem', 'செம்மொழித் தமிழாய்வு மத்திய நிறுவன இலச்சினை', 'CICT प्रतीक-चिह्न')} className="size-11 shrink-0 rounded-full bg-white object-cover shadow-[0_0_0_2px_#d8b56b,0_0_18px_#f4d79244] sm:size-12" />
            <div className="min-w-0 flex-1" data-site-title>
              <p className="m-0 truncate text-[10px] font-semibold tracking-[0.14em] text-[#d8c7a6] sm:text-[11px]">
                <span lang="ta">செம்மொழித் தமிழாய்வு மத்திய நிறுவனம்</span>
                <span lang={cl} className="hidden md:inline"> · {L('CENTRAL INSTITUTE OF CLASSICAL TAMIL', 'केंद्रीय शास्त्रीय तमिल संस्थान')}</span>
              </p>
              <h1 className="m-0 truncate text-base leading-[1.45] font-bold text-[#f2d69a] [text-shadow:0_2px_12px_#000]">
                <span lang="ta" className="text-[15px] sm:text-lg lg:text-xl">செம்மொழிப் பண்பாட்டுக் காட்சியகம்</span>
                <span lang={cl} className="hidden font-serif text-base tracking-wide text-[#fff3d9] sm:inline lg:text-lg"> — {L('Classical Tamil Treasures Gallery', 'शास्त्रीय तमिल निधि दीर्घा')}</span>
              </h1>
              <p className="m-0 truncate font-serif text-xs leading-tight font-bold tracking-wide text-[#e4c985] sm:text-sm">
                <span lang="ta" className="font-sans">{hall.tamil}</span> · <span lang={cl}>{L(hall.title)}</span>
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2 max-sm:hidden">
              <LanguageSwitcher compact />
              <MusicToggle />
            </div>
          </div>
          {/* The actions: this hall's on the left, the museum's beyond the divider. They wrap on wide screens and scroll sideways on phones. */}
          <nav aria-label={T('Museum actions', 'அருங்காட்சியகச் செயல்கள்', 'संग्रहालय क्रियाएँ')} className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 py-1 [scrollbar-width:none] md:flex-wrap md:overflow-visible">
            <div className="flex shrink-0 items-center gap-2 sm:hidden">
              <LanguageSwitcher compact />
              <MusicToggle />
            </div>
            <span className="mx-1 h-6 w-px shrink-0 bg-temple-gold/40 sm:hidden" aria-hidden="true" />
            <RoomCatalogueButton labelClassName="hidden 2xl:inline" hallId={hallId} roomId={currentRoom} hallName={currentRoom === 'shrine' ? null : L(hall.title)} />
            {glStatus !== 'failed' && (
              <div className="flex shrink-0 rounded-full border border-temple-gold/60 bg-teak-dark/85 p-1 backdrop-blur" role="group" aria-label={T('Hall view', 'கூடக் காட்சி', 'कक्ष दृश्य')}>
                <button type="button" onClick={() => setMode('panorama')} aria-pressed={mode === 'panorama'} aria-label={T('360° view', '360° காட்சி', '360° दृश्य')} className={viewButton(mode === 'panorama')}>
                  <Compass size={14} /> <span className="hidden lg:inline">360°</span>
                </button>
                <button type="button" onClick={() => setMode('arches')} aria-pressed={mode === 'arches'} aria-label={T('Arches view', 'வளைவுக் காட்சி', 'मेहराब दृश्य')} className={viewButton(mode === 'arches')}>
                  <Landmark size={14} /> <span className="hidden lg:inline">{T('Arches', 'வளைவுகள்', 'मेहराबें')}</span>
                </button>
              </div>
            )}
            {hasMonolith && (
              <button
                type="button"
                onClick={() => setMonumentOpen(true)}
                aria-label={T('CICT Monument', 'நினைவுத் தூண்', 'CICT स्मारक')}
                title={T('CICT Monument', 'நினைவுத் தூண்', 'CICT स्मारक')}
                className={`inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-[#8e6e35] bg-[#241b10]/90 px-3 py-2 text-xs text-[#ead8ad] backdrop-blur hover:border-[#f4d792] sm:px-4 ${springy}`}
              >
                <Landmark size={15} /> <span className="hidden lg:inline">{T('CICT Monument', 'நினைவுத் தூண்', 'CICT स्मारक')}</span>
              </button>
            )}
            {exhibit && (
              <button
                type="button"
                onClick={() => setExhibitOpen(hall.centrepiece)}
                aria-label={T(`About the ${exhibit.title}`, `${exhibit.ta} — அறிமுகம்`, `${L(exhibit.title)} के बारे में`)}
                title={T(`About the ${exhibit.title}`, `${exhibit.ta} — அறிமுகம்`, `${L(exhibit.title)} के बारे में`)}
                className={`inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-[#8e6e35] bg-[#241b10]/90 px-3 py-2 text-xs text-[#ead8ad] backdrop-blur hover:border-[#f4d792] sm:px-4 ${springy}`}
              >
                <Sparkles size={15} /> <span className="hidden lg:inline">{T(exhibit.title, exhibit.ta, L(exhibit.title))}</span>
              </button>
            )}
            {!showArches && glStatus === 'ready' && (
              <button
                type="button"
                onClick={tour ? stopTour : startTour}
                aria-pressed={Boolean(tour)}
                aria-label={tour ? T('End the guided tour', 'சுற்றுலாவை முடி', 'निर्देशित भ्रमण समाप्त करें') : T('Guided tour of every hall', 'எல்லாக் கூடங்களின் வழிகாட்டும் சுற்றுலா', 'हर कक्ष का निर्देशित भ्रमण')}
                title={tour ? T('End the guided tour', 'சுற்றுலாவை முடி', 'निर्देशित भ्रमण समाप्त करें') : T('Guided tour of every hall', 'எல்லாக் கூடங்களின் வழிகாட்டும் சுற்றுலா', 'हर कक्ष का निर्देशित भ्रमण')}
                className={`inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-xs backdrop-blur sm:px-4 ${springy} ${
                  tour ? 'border-[#f4d792] bg-gradient-to-br from-temple-gold-light to-temple-gold font-bold text-teak-dark' : 'border-[#8e6e35] bg-[#241b10]/90 text-[#ead8ad] hover:border-[#f4d792]'
                }`}
              >
                <Compass size={15} /> <span className="hidden lg:inline">{tour ? T('End tour', 'சுற்றுலா நிறைவு', 'भ्रमण समाप्त') : T('Guided Tour', 'வழிகாட்டும் சுற்றுலா', 'निर्देशित भ्रमण')}</span>
              </button>
            )}
            <span className="mx-1 h-6 w-px shrink-0 bg-temple-gold/40" aria-hidden="true" />
            <button
              type="button"
              onClick={() => setMapOpen(true)}
              aria-label={T('Museum map', 'அருங்காட்சியக வரைபடம்', 'संग्रहालय मानचित्र')}
              title={T('Museum map', 'அருங்காட்சியக வரைபடம்', 'संग्रहालय मानचित्र')}
              className={`inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-[#8e6e35] bg-[#241b10]/90 px-3 py-2 text-xs text-[#ead8ad] backdrop-blur hover:border-[#f4d792] sm:px-4 ${springy}`}
            >
              <MapIcon size={15} /> <span className="hidden xl:inline">{T('Map', 'வரைபடம்', 'मानचित्र')}</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenThenNow?.()}
              aria-label={T('Tamil Nadu: Then and Now', 'தமிழ்நாடு: அன்றும் இன்றும்', 'तमिलनाडु: तब और अब')}
              title={T('Tamil Nadu: Then and Now', 'தமிழ்நாடு: அன்றும் இன்றும்', 'तमिलनाडु: तब और अब')}
              className={`inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-[#8e6e35] bg-[#241b10]/90 px-3 py-2 text-xs text-[#ead8ad] backdrop-blur hover:border-[#f4d792] sm:px-4 ${springy}`}
            >
              <History size={15} /> <span className="hidden xl:inline">{T('Then & Now', 'அன்றும் இன்றும்', 'तब और अब')}</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenTamilakam?.()}
              aria-label={T('Map of Ancient Tamilakam', 'பண்டைய தமிழக வரைபடம்', 'प्राचीन तमिऴकम का मानचित्र')}
              title={T('Map of Ancient Tamilakam', 'பண்டைய தமிழக வரைபடம்', 'प्राचीन तमिऴकम का मानचित्र')}
              className={`inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-[#8e6e35] bg-[#241b10]/90 px-3 py-2 text-xs text-[#ead8ad] backdrop-blur hover:border-[#f4d792] sm:px-4 ${springy}`}
            >
              <MapPinned size={15} /> <span className="hidden xl:inline">{T('Ancient Tamilakam', 'பண்டைய தமிழகம்', 'प्राचीन तमिऴकम')}</span>
            </button>
            <button
              type="button"
              onClick={onShowOverview}
              aria-label={T('Gallery overview', 'காட்சியக மேலோட்டம்', 'दीर्घा का अवलोकन')}
              title={T('Gallery overview', 'காட்சியக மேலோட்டம்', 'दीर्घा का अवलोकन')}
              className={`inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-[#8e6e35] bg-[#241b10]/90 px-3 py-2 text-xs text-[#ead8ad] backdrop-blur hover:border-[#f4d792] sm:px-4 ${springy}`}
            >
              <LayoutGrid size={15} /> <span className="hidden 2xl:inline">{T('Gallery overview', 'காட்சியக மேலோட்டம்', 'दीर्घा का अवलोकन')}</span>
            </button>
            <button
              type="button"
              onClick={meetValluvar}
              aria-label={T('Meet Thiruvalluvar', 'திருவள்ளுவரைச் சந்தியுங்கள்', 'तिरुवल्लुवर से मिलें')}
              title={T('Meet Thiruvalluvar', 'திருவள்ளுவரைச் சந்தியுங்கள்', 'तिरुवल्लुवर से मिलें')}
              className={`inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-[#f3d58a] bg-gradient-to-br from-[#f5dc98] to-[#c89a4d] px-3 py-2 text-xs font-bold text-[#21170b] shadow-[0_0_20px_#dfb65855] sm:px-4 ${springy}`}
            >
              <ScrollText size={15} /> <span className="hidden sm:inline">{T('Meet Thiruvalluvar', 'திருவள்ளுவரைச் சந்தியுங்கள்', 'तिरुवल्लुवर से मिलें')}</span>
            </button>
          </nav>
        </div>
        <TempleBand className="absolute inset-x-0 top-0 text-[#d8b56b]/35" />
      </header>

      {/* Drag hint */}
      {started && showHint && !showArches && (
        <div className="pointer-events-none absolute top-[42%] left-1/2 flex -translate-x-1/2 -translate-y-1/2 animate-pop-in flex-col items-center gap-2 rounded-2xl border border-[#d8b56b]/50 bg-[#0c0906]/70 px-5 py-4 text-center backdrop-blur-md">
          <Hand size={26} className="animate-bounce-soft text-[#f4d792]" />
          <span className="text-sm text-[#f8e8c5]">{T('Drag or swipe to look around', 'சுற்றிப் பார்க்க இழுங்கள் அல்லது வருடுங்கள்', 'चारों ओर देखने के लिए खींचें या स्वाइप करें')}</span>
          <span className="text-[11px] text-[#bfae90]">{T('Tap the centrepiece or an arch to explore', 'காண, நடுவில் உள்ளதையோ ஒரு வளைவையோ தொடுங்கள்', 'देखने के लिए बीच की प्रतिमा या किसी मेहराब को छुएँ')}</span>
        </div>
      )}

      {/* Wing dock: turn left/right, or jump straight to a wing */}
      {!showArches && (
      <div ref={dockRef} className={`absolute inset-x-0 bottom-0 z-10 flex items-end justify-center gap-2 bg-gradient-to-t from-[#2a1a0c]/60 via-[#1a1008]/25 to-transparent px-3 pt-10 pb-4 transition-opacity duration-500 sm:gap-3 sm:pb-6 ${chromeHidden}`}>
        <button type="button" onClick={() => lookAt(focusIndex - 1)} aria-label={T('Turn to previous wing', 'முந்தைய பிரிவுக்குத் திரும்பு', 'पिछले विंग की ओर मुड़ें')} className={roundButton}>
          <ChevronLeft size={20} />
        </button>
        {/* The tags, under a gilt "Navigate Using:" heading flanked by fading rules */}
        <div className="flex min-w-0 flex-col items-center">
          <p className="flex w-full items-center justify-center gap-2 px-1 tracking-[0.14em] text-temple-gold-light" aria-hidden="true">
            <span className="h-px max-w-16 flex-1 bg-gradient-to-l from-temple-gold/70 to-transparent" />
            <span className="rounded-full border border-temple-gold/55 bg-[#140d07]/80 px-3 py-0.5 font-serif text-[13px] font-bold whitespace-nowrap shadow-[0_2px_10px_#000a] backdrop-blur-sm sm:text-sm">{T('Navigate Using:', 'செல்லும் வழி:', 'यहाँ से जाएँ:')}</span>
            <span className="h-px max-w-16 flex-1 bg-gradient-to-r from-temple-gold/70 to-transparent" />
          </p>
        <nav aria-label={T("Navigate using the museum's wings", 'பிரிவுகளின் வழியே செல்க', 'संग्रहालय के विंगों से जाएँ')} className="flex min-w-0 max-w-full gap-2 overflow-x-auto px-1 py-1.5 [scrollbar-width:none]">
          {wings.map((wing, index) => !wing.alcove && (
            <button
              key={wing.id}
              type="button"
              // The first tap turns to the wing; tapping the wing already faced walks in, as
              // its arch may stand behind the centrepiece where it cannot be tapped.
              onClick={() => (index === focusIndex ? approach(index) : lookAt(index))}
              aria-current={index === focusIndex ? 'true' : undefined}
              aria-label={index === focusIndex ? T(`Enter ${wing.title}`, `${wing.tamil} — உள்ளே செல்க`, `${L(wing.title)} में प्रवेश करें`) : T(`Turn to ${wing.title}`, `${wing.tamil} பக்கம் திரும்பு`, `${L(wing.title)} की ओर मुड़ें`)}
              className={`shrink-0 cursor-pointer rounded-full border px-3 py-1.5 text-[11px] whitespace-nowrap ${springy} ${
                index === focusIndex
                  ? 'border-[#f4d792] bg-[#3d2a16] text-[#f8e8c5] shadow-[0_0_14px_#f1c35b44]'
                  : 'border-[#75592e] bg-[#140d07]/70 text-[#c9b89b] hover:border-[#d9b567]'
              }`}
            >
              {wing.passage && <DoorOpen size={12} className="mr-1 inline align-[-2px]" />}
              {L(wing.title)}
            </button>
          ))}
        </nav>
        </div>
        <button type="button" onClick={() => lookAt(focusIndex + 1)} aria-label={T('Turn to next wing', 'அடுத்த பிரிவுக்குத் திரும்பு', 'अगले विंग की ओर मुड़ें')} className={roundButton}>
          <ChevronRight size={20} />
        </button>
      </div>
      )}

      {tour && (
        <div className="pointer-events-none absolute inset-x-0 z-20 flex justify-center px-4" style={{ top: headerBottom }} role="status" aria-live="polite">
          <div key={`${tour.title}-${tour.room?.title ?? ''}`} className="pointer-events-auto flex max-w-md animate-pop-in flex-col items-center gap-0.5 rounded-2xl border border-temple-gold/70 bg-[#140d07]/88 px-4 py-2 text-center shadow-[0_18px_40px_#000c,0_0_30px_#d4a64a33] backdrop-blur-md">
            <p className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.22em] text-temple-gold-light/85">
              <span className="size-1.5 animate-pulse rounded-full bg-temple-gold-light" aria-hidden="true" />
              {T('GUIDED TOUR', 'வழிகாட்டும் சுற்றுலா', 'निर्देशित भ्रमण')} · {tour.done ? T('COMPLETE', 'நிறைவு', 'पूर्ण') : `${T(`HALL ${tour.step} OF ${tour.total}`, `கூடம் ${tour.step} / ${tour.total}`, `कक्ष ${tour.step} / ${tour.total}`)}${tour.moving ? ` · ${T('ON THE WAY', 'செல்கிறோம்', 'रास्ते में')}` : ''}`}
            </p>
            <p lang="ta" className="text-sm leading-[1.8] font-bold text-[#e9a27a]">{tour.room?.ta ?? tour.ta}</p>
            <h2 lang={cl} className="font-serif text-lg leading-tight font-bold text-temple-gold-light">{L(tour.room?.title ?? tour.title, tour.done ? 'भ्रमण पूरा हुआ' : undefined)}</h2>
            <p lang={cl} className="text-xs text-[#d9c6a0]">{tour.room ? T(`in the ${tour.title}`, `${tour.ta} கூடத்தில்`, `${L(tour.title)} में`) : L(tour.subtitle, tour.done ? 'किसी भी कक्ष या कमरे को चुनकर उसे अपनी गति से देखें।' : undefined)}</p>
            <button type="button" onClick={stopTour} className="mt-1 cursor-pointer text-[11px] font-semibold text-temple-gold-light underline decoration-temple-gold/50 underline-offset-4 hover:decoration-temple-gold-light">
              {T('End tour', 'சுற்றுலா நிறைவு', 'भ्रमण समाप्त')} · Esc
            </button>
          </div>
        </div>
      )}

      {monumentOpen && <MonumentPanel onClose={closeMonument} />}
      {exhibitOpen && <ExhibitPanel exhibit={HALL_EXHIBITS[exhibitOpen]} onClose={closeExhibit} />}

      {/* Mini-map, above the wing dock on the left (the 360° view only: in the arched view the header's Map button serves); the full map opens from it or from the header. */}
      {!showArches && <MiniMap
        plan={plan}
        currentHall={hallId}
        live={!showArches && glStatus === 'ready'}
        markerRef={miniMarkerRef}
        boxRef={miniMapRef}
        onOpenMap={() => setMapOpen(true)}
        className={`absolute bottom-[106px] left-3 z-10 transition-opacity duration-500 sm:bottom-[122px] sm:left-5 ${chromeHidden}`}
      />}
      {mapOpen && <MapDialog plan={plan} currentHall={hallId} live={!showArches && glStatus === 'ready'} markerRef={mapMarkerRef} onTravel={travelTo} onClose={closeMap} />}

      <p className="sr-only" aria-live="polite">{`${L(hall.title)} · ${hall.tamil}`}</p>
    </section>
  );
}
