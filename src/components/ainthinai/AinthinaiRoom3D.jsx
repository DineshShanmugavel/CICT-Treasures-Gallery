import React, { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { CameraControls, Environment, Lightformer, useGLTF } from '@react-three/drei';
import CameraControlsImpl from 'camera-controls';
import { ArrowLeft, BookOpenText, ChevronLeft, ChevronRight, Compass, Image as ImageIcon, LibraryBig, List, Loader2, Mountain, X } from 'lucide-react';
import { RoomMaterials, RoomShell, Nilavilakku } from './RoomShell.jsx';
import DisplayCase from './DisplayCase.jsx';
import Bookcase from './Bookcase.jsx';
import { Chart, PhotoPanel } from './WallPanels.jsx';
import { CASE_SPOTS, CENTRE, DOORWAY_VIEW, EYE, HALF_D, HALF_W, NORTH_BAYS, OVERVIEW, SIDE_BAYS, stationFor } from './roomLayout.js';
import { CHART_ROWS, LANDSCAPES } from '../../data/ainthinaiRoom.js';
import { collectionSummary } from '../../data/roomBooks.js';
import FlipBookViewer from '../flipbook/FlipBookViewer.jsx';
import { ArtifactViewer } from '../ArtifactGallery.jsx';
import { LotusBorder, TempleBand } from '../HeritageMotifs.jsx';
import { ANTIALIAS, IS_TOUCH_SCREEN, MAX_PIXEL_RATIO } from '../../pixelRatio.js';
import { playSound } from '../../audio/ambience.js';
import { tri, useI18n } from '../../i18n/index.js';

/*
 * The Five Landscapes room, walked in 3D: the visitor steps through the doorway from the
 * ring hall's arch into a sandstone gallery under gilt arches and brass lamps. Five glass
 * cases stand in an arc round the great lamp, one landscape in each (Kurinji's the museum's
 * model); the landscape photographs hang in the far wall's arches; the bookcases of tinai
 * poetry and the curators' food notes stand in the side walls' arches, beside the
 * Ainthinai chart. Click a case to step up to it and walk round it, a book to read it, a
 * photograph to see it closer; the bar along the bottom steps between them too.
 *
 * Without WebGL, or if the scene fails, `fallback` (the classic room) is shown instead.
 */

const reducedMotionQuery = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
/**
 * Whether the browser can draw WebGL. Checked here rather than with the Canvas's own
 * `fallback`, which React Three Fiber mounts inside the <canvas> element all along — the
 * classic room would then be live, unseen, with its own Escape handler.
 */
const canDrawWebGL = () => {
  try {
    const probe = document.createElement('canvas');
    return Boolean(probe.getContext('webgl2') ?? probe.getContext('webgl'));
  } catch {
    return false;
  }
};
const ENTRY_SECONDS = 1.3;

/** The cabinets' places: the west wall's two bays, then the east wall's first; the chart takes the east wall's second. */
const CABINET_SLOTS = [
  { x: -HALF_W, z: SIDE_BAYS[0], yaw: Math.PI / 2 },
  { x: -HALF_W, z: SIDE_BAYS[1], yaw: Math.PI / 2 },
  { x: HALF_W, z: SIDE_BAYS[0], yaw: -Math.PI / 2 },
];
const CHART_SLOT = { x: HALF_W, z: SIDE_BAYS[1], yaw: -Math.PI / 2 };
/** Short names for the bookcases in the bar along the bottom. */
/** Short names for the bookcases on the walk-to bar, in the chosen language. */
const shelfLabel = (id) => ({
  'tinai-books': tri('Poems', 'பாடல்கள்', 'कविताएँ'),
  'tinai-by-landscape': tri('By landscape', 'திணை வாரியாக', 'भू-दृश्य अनुसार'),
  'landscape-food-notes': tri('Food notes', 'உணவுக் குறிப்புகள்', 'भोजन टिप्पणियाँ'),
})[id];

/** Camera placement and look-round limits for a station (roomLayout.js stationFor). */
function viewFor(station) {
  if (station.kind === 'overview') {
    return { ...OVERVIEW, limits: { azimuth: [-0.7, 0.7], polar: [0.3 * Math.PI, 0.56 * Math.PI], distance: [2.5, 11.5] } };
  }
  const { target, normal, orbit, eye = EYE + 0.1 } = station.spec;
  // A portrait screen sees a narrow slice: stand further back from a case to take it all in.
  const portrait = window.innerWidth < window.innerHeight;
  const distance = orbit && portrait ? station.spec.distance * 1.5 : station.spec.distance;
  const position = [target[0] + normal[0] * distance, orbit ? target[1] + 0.5 : eye, target[2] + normal[2] * distance];
  const base = Math.atan2(normal[0], normal[2]);
  return {
    position,
    target,
    // The landscape's card covers the right of a wide view, and the foot of a narrow one: keep the case clear
    // of it (camera-controls takes a positive y offset as moving the view down, so the case rises).
    offset: !orbit ? [0, 0, 0] : window.innerWidth >= 1024 ? [0.42, 0, 0] : window.innerWidth < 640 ? [0, 0.42, 0] : [0, 0, 0],
    limits: orbit
      ? { azimuth: [-Infinity, Infinity], polar: [0.14 * Math.PI, 0.5 * Math.PI], distance: [0.9, distance * 1.4] }
      : { azimuth: [base - 0.55, base + 0.55], polar: [0.36 * Math.PI, 0.6 * Math.PI], distance: [1.4, distance * 1.45] },
  };
}

const FREE = { azimuth: [-Infinity, Infinity], polar: [0.05, Math.PI - 0.05], distance: [0.3, 40] };

/**
 * Moves the camera to `view` (eased by camera-controls), then holds it to the view's limits.
 * The first view is the doorway, from which it glides straight in to the next.
 */
function CameraRig({ view, onArrived, reducedMotion }) {
  const controls = useRef();
  const turn = useRef(0);
  const first = useRef(true);
  useEffect(() => {
    const rig = controls.current;
    if (!rig) return;
    const token = ++turn.current;
    const apply = ({ azimuth, polar, distance }) => {
      [rig.minAzimuthAngle, rig.maxAzimuthAngle] = azimuth;
      [rig.minPolarAngle, rig.maxPolarAngle] = polar;
      [rig.minDistance, rig.maxDistance] = distance;
    };
    apply(FREE);
    const animate = !first.current && !reducedMotion;
    first.current = false;
    rig.setFocalOffset(...(view.offset ?? [0, 0, 0]), animate);
    rig.setLookAt(...view.position, ...view.target, animate).then(() => {
      if (token !== turn.current) return; // another move has begun
      if (view.limits) apply(view.limits);
      onArrived?.(view);
    });
  }, [view]); // eslint-disable-line react-hooks/exhaustive-deps -- follow the view only
  return (
    <CameraControls
      ref={controls}
      makeDefault
      smoothTime={reducedMotion ? 0 : 0.55}
      draggingSmoothTime={0.12}
      azimuthRotateSpeed={0.55}
      polarRotateSpeed={0.45}
      dollySpeed={0.6}
      mouseButtons={{ left: CameraControlsImpl.ACTION.ROTATE, middle: CameraControlsImpl.ACTION.DOLLY, right: CameraControlsImpl.ACTION.NONE, wheel: CameraControlsImpl.ACTION.DOLLY }}
      touches={{ one: CameraControlsImpl.ACTION.TOUCH_ROTATE, two: CameraControlsImpl.ACTION.TOUCH_DOLLY, three: CameraControlsImpl.ACTION.NONE }}
    />
  );
}

/** The renderer's look, as the ring hall's: filmic tone mapping a touch over neutral. */
function Exposure() {
  const gl = useThree((state) => state.gl);
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.1;
  }, [gl]);
  return null;
}

/** A ceiling spotlight washing a wall from `from` onto `to`. */
function WallWash({ from, to, intensity, angle, distance = 14 }) {
  const target = useMemo(() => new THREE.Object3D(), []);
  const light = useRef();
  useEffect(() => { if (light.current) light.current.target = target; }, [target]);
  return (
    <>
      <primitive object={target} position={to} />
      <spotLight ref={light} position={from} angle={angle} penumbra={0.85} intensity={intensity} distance={distance} decay={2} color="#ffd9a0" />
    </>
  );
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.22} color="#ffdcb0" />
      <hemisphereLight args={['#ffe9c4', '#2a1708', 0.42]} />
      {/* Soft in-scene reflections for the glass, gilt and brass (no HDR download) */}
      <Environment resolution={64}>
        <Lightformer form="ring" intensity={2} color="#ffd9a0" position={[0, 7, 0]} rotation={[Math.PI / 2, 0, 0]} scale={6} />
        <Lightformer intensity={1.2} color="#ffb860" position={[-7, 3, 0]} scale={[4, 6, 1]} />
        <Lightformer intensity={1} color="#ffe0b0" position={[7, 3, 2]} scale={[4, 6, 1]} />
        <Lightformer intensity={0.5} color="#7a4a1c" position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={14} />
      </Environment>
      <WallWash from={[0, 6.9, -4.5]} to={[0, 2.8, -HALF_D]} intensity={260} angle={0.95} distance={18} />
      {[...CABINET_SLOTS, CHART_SLOT].map(({ x, z }) => (
        <WallWash key={`${x}${z}`} from={[x * 0.55, 6.9, z]} to={[x, 2.2, z]} intensity={120} angle={0.45} />
      ))}
    </>
  );
}

class SceneBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error('The Five Landscapes room could not be drawn in 3D:', error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** A gilt pill button, as the room header's. */
function Pill({ active, onClick, children, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition duration-300 ease-spring hover:scale-105 active:scale-95 ${
        active ? 'border-temple-gold-light bg-temple-gold/90 text-teak-dark shadow-[0_0_16px_#f1c35b88]' : 'border-temple-gold/60 bg-teak-dark/85 text-temple-gold-light hover:border-temple-gold-light'
      }`}
    >
      {children}
    </button>
  );
}

/** The card for the landscape whose case the visitor stands at. */
function LandscapeCard({ landscape, index, books, onPhoto, onBook, onStep, onClose }) {
  const [more, setMore] = useState(false);
  const { L, T, cl } = useI18n();
  useEffect(() => setMore(false), [landscape.key]);
  return (
    <aside
      aria-labelledby="tinai-card-title"
      className="bg-teak pointer-events-auto absolute right-3 bottom-[76px] left-3 max-h-[36vh] overflow-y-auto rounded-2xl border border-temple-gold/60 p-4 text-parchment shadow-[0_18px_40px_#000c] sm:right-6 sm:left-auto sm:w-[380px] sm:max-h-[calc(100%-190px)] sm:bottom-[84px] lg:top-[120px] lg:bottom-auto"
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p lang="ta" className="text-sm leading-[1.8] font-bold text-[#e9a27a]">{landscape.food?.ta ?? landscape.tamil}</p>
          <h2 id="tinai-card-title" lang={cl} className="font-serif text-2xl leading-tight font-bold text-temple-gold-light">{L(landscape.panel?.title ?? landscape.key)}</h2>
        </div>
        <button type="button" onClick={onClose} aria-label={T('Step back from the case', 'காட்சிப்பெட்டியிலிருந்து விலகு', 'काँच के बक्से से पीछे हटें')} className="cursor-pointer rounded-full border border-temple-gold/50 p-1.5 text-temple-gold-light transition hover:scale-110 hover:border-temple-gold-light">
          <X size={15} />
        </button>
      </div>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs leading-relaxed">
        {CHART_ROWS.map(([english, tamil, field]) => (
          <React.Fragment key={field}>
            <dt className="text-sepia-light"><span lang={cl}>{L(english)}</span> <span lang="ta">· {tamil}</span></dt>
            <dd className="text-[#ead9b8]"><span lang={cl}>{L(landscape[field][0])}</span> <span lang="ta" className="text-[#e9c49a]">· {landscape[field][1]}</span></dd>
          </React.Fragment>
        ))}
      </dl>
      {landscape.panel && (
        <div className="mt-3 flex flex-col gap-2">
          <p lang="ta" className={`text-[13px] leading-[1.9] text-[#e9c49a] ${more ? '' : 'line-clamp-3'}`}>{landscape.panel.body.ta}</p>
          <p lang={cl} className={`font-serif text-[15px] leading-relaxed text-[#ead9b8] ${more ? '' : 'line-clamp-3'}`}>{L(landscape.panel.body)}</p>
        </div>
      )}
      {more && landscape.food && (
        <div className="mt-3 flex flex-col gap-2 border-t border-temple-gold/30 pt-3">
          <p lang={cl} className="text-[10px] font-semibold tracking-[0.2em] text-temple-gold-light/80">{L('FOOD OF THE LAND', 'इस भूमि का भोजन')} · {L(landscape.food.detail).toUpperCase()}</p>
          <p lang="ta" className="text-[13px] leading-[1.9] text-[#e9c49a]">{landscape.food.taText}</p>
          <p lang={cl} className="font-serif text-[15px] leading-relaxed text-[#ead9b8]">{L(landscape.food.en)}</p>
        </div>
      )}
      <button type="button" onClick={() => setMore((value) => !value)} className="mt-2 cursor-pointer text-xs font-semibold text-temple-gold-light underline decoration-temple-gold/50 underline-offset-4 hover:decoration-temple-gold-light">
        {more ? T('Show less', 'சுருக்கமாக', 'कम दिखाएँ') : T('Read more, and the food of this land', 'மேலும் படிக்க, இந்நிலத்தின் உணவும்', 'और पढ़ें, और इस भूमि का भोजन')}
      </button>
      <div className="mt-3 flex flex-wrap gap-2">
        <Pill onClick={onPhoto}><ImageIcon size={14} /> {T('The photograph', 'படம்', 'तस्वीर')}</Pill>
        {books.map((book) => (
          <Pill key={book.id} onClick={() => onBook(book)}><BookOpenText size={14} /> <span lang={cl}>{L(book.title)}</span></Pill>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-temple-gold/30 pt-3">
        <button type="button" onClick={() => onStep(-1)} className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-temple-gold-light hover:text-[#fbe7b5]">
          <ChevronLeft size={15} /> {L(LANDSCAPES[(index + LANDSCAPES.length - 1) % LANDSCAPES.length].key)}
        </button>
        <span className="text-[10px] tracking-[0.2em] text-sepia-light">{index + 1} / {LANDSCAPES.length}</span>
        <button type="button" onClick={() => onStep(1)} className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-temple-gold-light hover:text-[#fbe7b5]">
          {L(LANDSCAPES[(index + 1) % LANDSCAPES.length].key)} <ChevronRight size={15} />
        </button>
      </div>
    </aside>
  );
}

/** Every exhibit as a plain list, for keyboards, screen readers, and anyone who prefers it. */
function ExhibitList({ cabinets, gallery, onBook, onPhoto, onCase, onClose }) {
  const { L, T, cl } = useI18n();
  return (
    <aside aria-label={T('Everything in this room', 'இக்கூடத்தில் உள்ளவை அனைத்தும்', 'इस कक्ष में सब कुछ')} className="bg-teak pointer-events-auto absolute top-[100px] bottom-[76px] left-3 w-[min(360px,calc(100%-24px))] overflow-y-auto rounded-2xl border border-temple-gold/60 p-4 shadow-[0_18px_40px_#000c] sm:left-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-bold text-temple-gold-light"><span lang={cl}>{L('In this room', 'इस कक्ष में')}</span> <span lang="ta" className="text-sm text-[#e9a27a]">· இக்கூடத்தில்</span></h2>
        <button type="button" onClick={onClose} aria-label={T('Close the list', 'பட்டியலை மூடு', 'सूची बंद करें')} className="cursor-pointer rounded-full border border-temple-gold/50 p-1.5 text-temple-gold-light hover:border-temple-gold-light"><X size={15} /></button>
      </div>
      <h3 className="mt-4 text-[10px] font-semibold tracking-[0.2em] text-temple-gold-light/80">{T('THE FIVE LANDSCAPES · GLASS CASES', 'ஐந்திணை · கண்ணாடிப் பெட்டிகள்', 'पाँच भू-दृश्य · काँच के बक्से')}</h3>
      <ul className="mt-1">
        {LANDSCAPES.map((landscape, i) => (
          <li key={landscape.key}><button type="button" onClick={() => onCase(i)} className="w-full cursor-pointer rounded-md px-2 py-1.5 text-left text-sm text-[#ead9b8] hover:bg-teak-dark"><span lang="ta" className="text-[#e9a27a]">{landscape.tamil}</span> · <span lang={cl}>{L(landscape.key)}</span></button></li>
        ))}
      </ul>
      {gallery && (
        <>
          <h3 className="mt-4 text-[10px] font-semibold tracking-[0.2em] text-temple-gold-light/80">{T('PHOTOGRAPHS', 'படங்கள்', 'तस्वीरें')}</h3>
          <ul className="mt-1">
            {gallery.artifacts.map((artifact, i) => (
              <li key={artifact.id}><button type="button" onClick={() => onPhoto(i)} className="w-full cursor-pointer rounded-md px-2 py-1.5 text-left text-sm text-[#ead9b8] hover:bg-teak-dark" lang={cl}>{L(artifact.title)}</button></li>
            ))}
          </ul>
        </>
      )}
      {cabinets.map((cabinet) => (
        <React.Fragment key={cabinet.id}>
          <h3 className="mt-4 text-[10px] font-semibold tracking-[0.2em] text-temple-gold-light/80"><span lang={cl}>{L(cabinet.title).toUpperCase()}</span> · <span lang="ta">{cabinet.tamil}</span></h3>
          <ul className="mt-1">
            {cabinet.books.map((book) => (
              <li key={book.id}><button type="button" onClick={() => onBook(book)} className="w-full cursor-pointer rounded-md px-2 py-1.5 text-left text-sm text-[#ead9b8] hover:bg-teak-dark"><span lang="ta" className="text-[#e9a27a]">{book.tamil}</span> · <span lang={cl}>{L(book.title)}</span>{book.year ? ` (${book.year})` : ''}</button></li>
            ))}
          </ul>
        </React.Fragment>
      ))}
    </aside>
  );
}

export default function AinthinaiRoom3D({ room, onExit, fallback }) {
  const webgl = useMemo(canDrawWebGL, []);
  return webgl ? <Room3D room={room} onExit={onExit} fallback={fallback} /> : fallback;
}

function Room3D({ room, onExit, fallback }) {
  const { L, T, cl } = useI18n();
  const reducedMotion = useMemo(reducedMotionQuery, []);
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [station, setStation] = useState({ kind: 'overview' });
  const [view, setView] = useState(DOORWAY_VIEW);
  const [selectedBook, setSelectedBook] = useState(null);
  const [viewing, setViewing] = useState(null); // index of the photograph in the closer view
  const [hover, setHover] = useState(null);
  const [modelStates, setModelStates] = useState({}); // landscape → 'loaded' | 'failed'
  const modelsLoading = LANDSCAPES.some((tinai) => tinai.model.url && !modelStates[tinai.key]);
  const [listOpen, setListOpen] = useState(false);
  const [hint, setHint] = useState(true);
  const exitTimer = useRef(0);

  const gallery = room.galleries?.[0] ?? null;
  const cabinets = room.cabinets.slice(0, CABINET_SLOTS.length);
  const closeReader = useCallback(() => setSelectedBook(null), []);
  const closeViewer = useCallback(() => setViewing(null), []);

  // Fade in over the glass doors, then glide in from the doorway.
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setVisible(true);
      setView(viewFor({ kind: 'overview' }));
    });
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const hintTimer = window.setTimeout(() => setHint(false), 9000);
    for (const tinai of LANDSCAPES) if (tinai.model.url) useGLTF.preload(tinai.model.url, false, true);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(hintTimer);
      window.clearTimeout(exitTimer.current);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const goTo = useCallback((next) => {
    setStation(next);
    setView(viewFor(next));
    setHint(false);
    setHover(null); // the pointer may rest where the label's object no longer is
  }, []);
  const toCase = useCallback((index) => goTo({ kind: 'case', index, spec: stationFor.case(CASE_SPOTS[index]) }), [goTo]);
  const toCabinet = useCallback((i) => goTo({ kind: 'cabinet', index: i, spec: stationFor.bookcase(CABINET_SLOTS[i].x, CABINET_SLOTS[i].z) }), [goTo]);
  const toChart = useCallback(() => goTo({ kind: 'chart', spec: stationFor.chart(CHART_SLOT.z) }), [goTo]);
  const toPhotographs = useCallback(() => goTo({ kind: 'photographs', spec: stationFor.photographs() }), [goTo]);
  const toOverview = useCallback(() => goTo({ kind: 'overview' }), [goTo]);

  /** Back out through the doorway, then hand back to the hall (which steps back from the arch). */
  const leave = useCallback(() => {
    if (leaving) return;
    setLeaving(true);
    setStation({ kind: 'overview' });
    setView({ ...DOORWAY_VIEW, limits: null });
    exitTimer.current = window.setTimeout(onExit, reducedMotion ? 0 : ENTRY_SECONDS * 1000);
  }, [leaving, onExit, reducedMotion]);

  useEffect(() => {
    // The readers handle their own Escape; otherwise step back to the overview, then leave.
    const onKeyDown = (event) => {
      if (event.key !== 'Escape' || selectedBook || viewing !== null) return;
      if (listOpen) setListOpen(false);
      else if (station.kind !== 'overview') toOverview();
      else leave();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedBook, viewing, listOpen, station.kind, toOverview, leave]);

  const focusedCase = station.kind === 'case' ? station.index : null;
  const landscape = focusedCase !== null ? LANDSCAPES[focusedCase] : null;
  const allBooks = useMemo(() => room.cabinets.flatMap((cabinet) => cabinet.books), [room]);
  const photoIndexOf = (key) => gallery?.artifacts.findIndex((artifact) => artifact.key === key) ?? -1;
  const openPhoto = (index) => { if (index >= 0) setViewing(index); };
  const covered = Boolean(selectedBook) || viewing !== null;

  const onHoverBook = useCallback((book) => setHover(book && { tamil: book.tamil, title: book.title, action: `${tri('Click to read', 'படிக்கச் சொடுக்கவும்', 'पढ़ने के लिए क्लिक करें')} · படிக்கச் சொடுக்கவும்` }), []);
  const onHoverPhoto = useCallback((artifact) => setHover(artifact && { tamil: artifact.tamil, title: artifact.title, action: `${tri('Click to look closer', 'அருகில் காணச் சொடுக்கவும்', 'पास से देखने के लिए क्लिक करें')} · அருகில் காண` }), []);
  const onHoverCase = useCallback((tinai) => setHover(tinai && { tamil: tinai.tamil, title: tinai.key, detail: tinai.land[0], action: `${tri('Click to step up to the case', 'பெட்டியின் அருகில் செல்லச் சொடுக்கவும்', 'बक्से के पास जाने के लिए क्लिक करें')} · அருகில் செல்ல` }), []);

  const scene = (
    <Canvas
      dpr={[1, MAX_PIXEL_RATIO]}
      frameloop={covered ? 'never' : 'always'}
      camera={{ position: DOORWAY_VIEW.position, fov: IS_TOUCH_SCREEN ? 62 : 55, near: 0.05, far: 80 }}
      gl={{ antialias: ANTIALIAS, powerPreference: 'high-performance' }}
      onPointerMissed={() => setHover(null)}
      style={{ position: 'absolute', inset: 0, touchAction: 'none' }}
    >
      <color attach="background" args={['#120b06']} />
      <fog attach="fog" args={['#120b06', 20, 44]} />
      <Exposure />
      <CameraRig view={view} reducedMotion={reducedMotion} />
      <Lighting />
      <RoomMaterials>
        <RoomShell />
        <Nilavilakku position={CENTRE} size={1.9} pedestal={{ radius: 0.32, height: 0.72 }} light={34} reach={12} phase={0.4} reducedMotion={reducedMotion} />
        {[[-8.25, -1.75], [8.25, -1.75]].map(([x, z], i) => (
          <Nilavilakku key={`${x}${z}`} position={[x, 0, z]} size={1.5} light={14} reach={7} phase={1.3 + i} reducedMotion={reducedMotion} />
        ))}
        {[[-7.9, -9.9], [7.9, -9.9], [-2.6, HALF_D - 1.2], [2.6, HALF_D - 1.2]].map(([x, z], i) => (
          <Nilavilakku key={`${x}${z}`} position={[x, 0, z]} size={1.5} light={IS_TOUCH_SCREEN || i > 1 ? 0 : 12} reach={7} phase={2.7 + i * 1.9} reducedMotion={reducedMotion} />
        ))}

        {LANDSCAPES.map((tinai, i) => (
          <DisplayCase
            key={tinai.key}
            landscape={tinai}
            spot={CASE_SPOTS[i]}
            focused={focusedCase === i}
            dimmed={focusedCase !== null && focusedCase !== i}
            onSelect={() => toCase(i)}
            onHover={onHoverCase}
            onModelState={tinai.model.url ? (state) => setModelStates((current) => (current[tinai.key] === state ? current : { ...current, [tinai.key]: state })) : undefined}
            reducedMotion={reducedMotion}
          />
        ))}

        {cabinets.map((cabinet, i) => {
          const { x, z, yaw } = CABINET_SLOTS[i];
          return (
            <group key={cabinet.id} position={[x, 0, z]} rotation-y={yaw}>
              <Bookcase cabinet={cabinet} onOpenBook={(book) => { playSound('shelf'); setSelectedBook(book); }} onHoverBook={onHoverBook} onSelect={() => toCabinet(i)} />
            </group>
          );
        })}
        <group position={[CHART_SLOT.x, 0, CHART_SLOT.z]} rotation-y={CHART_SLOT.yaw}>
          <Chart landscapes={LANDSCAPES} rows={CHART_ROWS} onSelect={toChart} />
        </group>

        {gallery?.artifacts.slice(0, NORTH_BAYS.length).map((artifact, i) => (
          <group key={artifact.id} position={[NORTH_BAYS[i], 0, -HALF_D]}>
            <PhotoPanel artifact={artifact} landscape={LANDSCAPES.find((tinai) => tinai.key === artifact.key)} onOpen={() => openPhoto(i)} onHover={onHoverPhoto} />
          </group>
        ))}
      </RoomMaterials>
    </Canvas>
  );

  return (
    <div
      className={`fixed inset-0 z-[1100] overflow-hidden bg-[#120b06] font-sans text-parchment transition-opacity duration-700 ${visible && !leaving ? 'opacity-100' : 'opacity-0'} ${leaving ? 'delay-500' : ''}`}
      aria-labelledby="room-title"
      role="region"
    >
      <SceneBoundary fallback={fallback}>
        <Suspense fallback={null}>{scene}</Suspense>
      </SceneBoundary>

      {/* The overlay passes pointer events through to the scene, except on its own controls. */}
      <div className="pointer-events-none absolute inset-0">
        <header className="bg-teak pointer-events-auto relative border-b-2 border-temple-gold/60 shadow-[0_8px_24px_#000a]">
          <TempleBand className="absolute inset-x-0 top-0 text-temple-gold/40" />
          <div className="relative flex items-center gap-4 px-4 pt-5 pb-3 sm:px-8">
            <button
              type="button"
              onClick={leave}
              className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-temple-gold/60 bg-teak-dark px-4 py-2 text-xs text-temple-gold-light transition duration-300 ease-spring hover:scale-105 hover:border-temple-gold-light active:scale-95"
            >
              <ArrowLeft size={15} /> <span className="hidden sm:inline">{T('Return to the hall', 'கூடத்துக்குத் திரும்பு', 'कक्ष में लौटें')}</span>
            </button>
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <p className="truncate text-xs font-bold text-[#e9a27a]">{room.tamil}</p>
              <h1 id="room-title" lang={cl} className="truncate font-serif text-2xl leading-tight font-bold tracking-wide text-temple-gold-light sm:text-3xl">{L(room.title)}</h1>
            </div>
            <span className="hidden items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-temple-gold-light/80 md:inline-flex">
              <Mountain size={15} /> {collectionSummary(room).toUpperCase()}
            </span>
            <button
              type="button"
              onClick={() => setListOpen((open) => !open)}
              aria-expanded={listOpen}
              className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-temple-gold/60 bg-teak-dark px-3 py-2 text-xs text-temple-gold-light transition duration-300 ease-spring hover:scale-105 hover:border-temple-gold-light active:scale-95"
            >
              <List size={15} /> <span className="hidden sm:inline">{T('List', 'பட்டியல்', 'सूची')}</span>
            </button>
          </div>
          <LotusBorder className="absolute inset-x-0 -bottom-[18px] block text-temple-gold/50" />
        </header>

        {hint && !hover && (
          <p className="absolute inset-x-0 top-[104px] mx-auto w-fit max-w-[92%] animate-fade-up rounded-full border border-temple-gold/40 bg-teak-dark/80 px-4 py-2 text-center text-xs leading-relaxed text-[#ead8ae] backdrop-blur-sm">
            <span lang={cl}>
              {IS_TOUCH_SCREEN ? L('Drag to look round · pinch to come closer', 'चारों ओर देखने के लिए खींचें · पास आने के लिए पिंच करें') : L('Drag to look round · scroll to come closer', 'चारों ओर देखने के लिए खींचें · पास आने के लिए स्क्रॉल करें')} · {L('tap a case, a book or a photograph', 'कोई बक्सा, पुस्तक या तस्वीर छुएँ')}
            </span>
            <span lang="ta" className="block text-[11px] leading-[1.8] text-[#e9c49a]">இழுத்துச் சுற்றிப் பாருங்கள் · ஒரு காட்சிப்பெட்டி, நூல் அல்லது படத்தைத் தொடுங்கள்</span>
          </p>
        )}
        {hover && (
          <p className="absolute inset-x-0 top-[104px] mx-auto w-fit max-w-[92%] rounded-xl border border-temple-gold/50 bg-teak-dark/85 px-4 py-2 text-center backdrop-blur-sm">
            {hover.tamil && <span lang="ta" className="block text-sm leading-[1.8] font-bold text-[#e9a27a]">{hover.tamil}</span>}
            <span lang={cl} className="block font-serif text-lg leading-tight font-semibold text-temple-gold-light">{L(hover.title)}{hover.detail ? ` — ${L(hover.detail)}` : ''}</span>
            <span className="mt-0.5 block text-[10px] tracking-wide text-sepia-light">{hover.action}</span>
          </p>
        )}

        {modelsLoading && (
          <p className="absolute bottom-[78px] left-3 inline-flex items-center gap-2 rounded-full border border-temple-gold/40 bg-teak-dark/85 px-3 py-1.5 text-[11px] text-[#ead8ae] sm:left-6">
            <Loader2 size={13} className="animate-spin text-temple-gold-light" /> {T('Bringing in the landscape models…', 'நில மாதிரிகள் வருகின்றன…', 'भू-दृश्य मॉडल लाए जा रहे हैं…')}
          </p>
        )}

        {landscape && (
          <LandscapeCard
            landscape={landscape}
            index={focusedCase}
            books={allBooks.filter((book) => book.tinai === landscape.key)}
            onPhoto={() => openPhoto(photoIndexOf(landscape.key))}
            onBook={setSelectedBook}
            onStep={(delta) => toCase((focusedCase + delta + LANDSCAPES.length) % LANDSCAPES.length)}
            onClose={toOverview}
          />
        )}

        {listOpen && (
          <ExhibitList
            cabinets={room.cabinets}
            gallery={gallery}
            onBook={setSelectedBook}
            onPhoto={openPhoto}
            onCase={(i) => { setListOpen(false); toCase(i); }}
            onClose={() => setListOpen(false)}
          />
        )}

        {/* Stations: step up to any part of the room */}
        <nav aria-label={T('Walk to', 'செல்லும் இடம்', 'यहाँ जाएँ')} className="bg-teak pointer-events-auto absolute inset-x-0 bottom-0 border-t-2 border-temple-gold/60 shadow-[0_-8px_24px_#000a]">
          <div className="flex items-center justify-center-safe gap-2 overflow-x-auto px-3 py-3 [scrollbar-width:none] sm:px-6">
            <Pill active={station.kind === 'overview'} onClick={toOverview}><Compass size={14} /> {T('The room', 'கூடம்', 'कक्ष')}</Pill>
            <span className="h-6 w-px shrink-0 bg-temple-gold/40" aria-hidden="true" />
            {LANDSCAPES.map((tinai, i) => (
              <Pill key={tinai.key} active={focusedCase === i} onClick={() => toCase(i)} label={`${L(tinai.key)} — ${L(tinai.land[0])}`}>
                <span lang="ta">{tinai.tamil}</span> <span lang={cl} className="hidden lg:inline">· {L(tinai.key)}</span>
              </Pill>
            ))}
            <span className="h-6 w-px shrink-0 bg-temple-gold/40" aria-hidden="true" />
            {gallery && <Pill active={station.kind === 'photographs'} onClick={toPhotographs}><ImageIcon size={14} /> {T('Photographs', 'படங்கள்', 'तस्वीरें')}</Pill>}
            {cabinets.map((cabinet, i) => (
              <Pill key={cabinet.id} active={station.kind === 'cabinet' && station.index === i} onClick={() => toCabinet(i)} label={L(cabinet.title)}>
                <LibraryBig size={14} /> {shelfLabel(cabinet.id) ?? L(cabinet.title)}
              </Pill>
            ))}
            <Pill active={station.kind === 'chart'} onClick={toChart}><BookOpenText size={14} /> {T('The chart', 'அட்டவணை', 'तालिका')}</Pill>
          </div>
        </nav>
      </div>

      {selectedBook && <FlipBookViewer book={selectedBook} onClose={closeReader} />}
      {viewing !== null && gallery && (
        <ArtifactViewer gallery={gallery} index={viewing} onIndex={setViewing} onClose={closeViewer} />
      )}
    </div>
  );
}
