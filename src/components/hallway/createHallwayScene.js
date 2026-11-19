import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { addHallStatue } from './hallStatue.js';
import { addHallFigure, FIGURE_FRONT_LIGHT, figureFocus, figureRings, figureTop } from './hallFigure.js';
import { HALL_EXHIBITS } from '../../data/hallExhibits.js';
import { gildPainting } from './gilding.js';
import { MONUMENT } from '../../data/centralHall.js';
import { ANTIALIAS, MAX_PIXEL_RATIO, anisotropyFor } from '../../pixelRatio.js';
import { mediaUrl } from '../../mediaUrl.js';
import { PASSAGE_DEPTH, TAU, WALL_DEPTH, hallApothem, hallDistance, layoutHalls, shortestDelta, wingBearing, wrapAngle } from './hallLayout.js';
import CICT_LOGO from '../../assets/cict-logo.jpg';
import { scriptFontsReady, subscribe as onLanguageChange, translate } from '../../i18n/index.js';

/*
 * A 360° rotunda built entirely from code: one wall with a carved arch per wing,
 * arranged as a regular polygon around the visitor, under a painted, coffered temple
 * ceiling. Textures are painted on canvases (stone, kolam floor, carved friezes, ceiling
 * paintings and murals, wing panels), so the
 * scene needs no image downloads. Framework-free; VirtualHallway.jsx drives it.
 *
 * The Thiruvalluvar statue at the centre of the Literature Hall is part of this scene too
 * (hallStatue.js), loaded with it and never unmounted.
 */

const WALL_HEIGHT = 8.5;
/*
 * The painted ceiling, after the Thanjavur mandapam: above the cornice a mural band, then a
 * hidden lighting cove, then long coffers between heavy sandstone girders (running along z)
 * crossed by carved teak beams (along x). A large square is left open over the statue.
 */
const MURAL_HEIGHT = 1.1;
const FRIEZE_HEIGHT = 1.8; // the red silhouette frieze under the cornice
const FRIEZE_BOTTOM = WALL_HEIGHT - 0.42 - FRIEZE_HEIGHT;
const COVE_Y = WALL_HEIGHT + MURAL_HEIGHT;
const CEILING_Y = WALL_HEIGHT + 1.8;
const ARCH_WIDTH = 3.8;
const ARCH_HEIGHT = 5.8; // floor to the crown of the arch
const SPRING_HEIGHT = ARCH_HEIGHT - ARCH_WIDTH / 2;
/** A niche's height to its width: the alcove reliefs' proportions. */
const NICHE_PROPORTION = 1.45;
/** A display niche (a room's picture, or a relief): at most this wide, its picture this far above the floor. */
const DISPLAY_MAX_WIDTH = 2.3;
const DISPLAY_BOTTOM = 0.9;
/**
 * A room's doorway: its width, its height to the crown of the arch (clear of the frieze),
 * the stone surround's breadth, and how far the surround stands out from the wall.
 */
const ROOM_DOOR = { width: 2.6, height: 4.6, surround: 0.26, depth: 0.22 };
/** The red banners' width (their images are 2 : 5) at their 2.2 m height. */
const BANNER_WIDTH = 2.2 / 2.5;
/* Passages (hallLayout.js) are open both ends, so each hall can be seen down one from the other; standing lamps line both sides. */
const PASSAGE_LAMPS = [2.6, 7, 11.4]; // metres beyond the wall, a lamp each side
const EYE_HEIGHT = 1.75;
/** How far short of an arch the camera stops on walking up to it, before the glass doors take over. */
const ARCH_STAND_OFF = 4.2;
/** Glide speed down a passage to the next hall, in metres per second (eased in and out). */
const GLIDE_SPEED = 10;
/** The Thiruvalluvar statue stands at the centre; its clickable volume and label height. */
const STATUE_RADIUS = 1.2;
const STATUE_HEIGHT = 3.5; // pedestal + figure, matching ThiruvalluvarStatue.jsx
const STATUE_CENTRE_Y = 2.2; // the sage's middle (1 m pedestal + half his 2.3 m height); centred on screen
/**
 * The Central Hall's monolith: a square pillar of polished black granite, its four faces
 * equal, on a square two-step plinth, under a capstone and a gilt pyramidion. The faces carry
 * MONUMENT's inscriptions, painted at `pixelsPerMetre`. The shaft's corners reach no further
 * from its axis than the statue's, so the camera's orbit and its walks to the arches stay
 * clear of it.
 */
const MONOLITH = {
  plinth: { width: 2.8, depth: 2.8, step: 0.3 },
  shaft: { width: 1.7, depth: 1.7, height: 4, bottom: 0.6 },
  top: 5.5,
  pixelsPerMetre: 512,
};
/**
 * The visitor orbits the statue: they stand `back` metres behind it and `side` metres
 * to the right, so it sits in view beside, not in front of, the arch they face.
 * Portrait screens see a narrower slice of the hall, so the statue stays closer to centre.
 */
const ORBIT_LANDSCAPE = { back: 4.3, side: 2.3 };
const ORBIT_PORTRAIT = { back: 5.8, side: 1.5 };
const MIN_LAT = -0.5;
const MAX_LAT = 0.6;
const IDLE_ROTATE_AFTER_MS = 6000;

export const TAMIL_FONT = "'Nirmala UI', 'Noto Sans Tamil', 'Tamil Sangam MN', Latha, 'Noto Sans Devanagari', 'Noto Sans Telugu', 'Noto Sans Kannada', 'Noto Sans Malayalam', 'Noto Sans Bengali', 'Noto Sans Gujarati', 'Noto Sans Gurmukhi', 'Noto Sans Oriya', 'Noto Nastaliq Urdu', 'Noto Naskh Arabic', 'Noto Sans Ol Chiki', 'Noto Sans Hebrew', 'Noto Sans Thaana', 'Noto Sans SC', 'Noto Sans TC', 'Noto Sans JP', 'Noto Sans KR', 'Noto Sans Thai', 'Noto Sans Lao', 'Noto Sans Khmer', 'Noto Sans Myanmar', 'Noto Sans Sinhala', 'Noto Sans Ethiopic', 'Noto Sans Georgian', 'Noto Sans Armenian', 'Noto Serif Tibetan', sans-serif";
export const SERIF_FONT = "'Cormorant Garamond', Georgia, 'Noto Serif Devanagari', 'Noto Serif Telugu', 'Noto Serif Kannada', 'Noto Serif Malayalam', 'Noto Serif Bengali', 'Noto Serif Gujarati', 'Noto Serif Gurmukhi', 'Noto Serif Oriya', 'Noto Nastaliq Urdu', 'Noto Naskh Arabic', 'Noto Sans Ol Chiki', 'Noto Serif Hebrew', 'Noto Sans Thaana', 'Noto Serif SC', 'Noto Serif TC', 'Noto Serif JP', 'Noto Serif KR', 'Noto Serif Thai', 'Noto Serif Lao', 'Noto Serif Khmer', 'Noto Serif Myanmar', 'Noto Serif Sinhala', 'Noto Serif Ethiopic', 'Noto Serif Georgian', 'Noto Serif Armenian', 'Noto Serif Tibetan', serif";
export const GOLD = '#d6ae62';

const clamp = THREE.MathUtils.clamp;
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** Small deterministic PRNG so painted textures look identical on every visit. */
export function seededRandom(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function speckle(ctx, width, height, count, colors, rand, maxSize = 2) {
  for (let i = 0; i < count; i += 1) {
    ctx.fillStyle = colors[(rand() * colors.length) | 0];
    const size = rand() * maxSize + 0.5;
    ctx.fillRect(rand() * width, rand() * height, size, size);
  }
}

/* ---------- Painted textures ---------- */

export function drawSandstone(ctx, w, h) {
  const rand = seededRandom(7);
  ctx.fillStyle = '#dcc59e';
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 70; i += 1) {
    const x = rand() * w;
    const y = rand() * h;
    const r = 30 + rand() * 90;
    const tone = rand() > 0.5 ? '255,240,210' : '120,88,52';
    for (const ox of [-w, 0, w]) {
      const g = ctx.createRadialGradient(x + ox, y, 0, x + ox, y, r);
      g.addColorStop(0, `rgba(${tone},0.09)`);
      g.addColorStop(1, `rgba(${tone},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(x + ox - r, y - r, r * 2, r * 2);
    }
  }
  speckle(ctx, w, h, 9000, ['#00000014', '#ffffff1c', '#7a5a3524'], rand, 2);
  // Ashlar courses: horizontal joints with staggered vertical joints.
  const rows = 4;
  const rowHeight = h / rows;
  for (let r = 0; r < rows; r += 1) {
    const y = r * rowHeight;
    ctx.fillStyle = '#5a40242e';
    ctx.fillRect(0, y, w, 2);
    ctx.fillStyle = '#ffffff22';
    ctx.fillRect(0, y + 2, w, 1);
    const offset = r % 2 ? w / 4 : 0;
    for (let k = 0; k < 2; k += 1) {
      ctx.fillStyle = '#5a40242e';
      ctx.fillRect((offset + (k * w) / 2) % w, y, 2, rowHeight);
    }
  }
}

const RELIEF_STONE = '#a88f6c';

/**
 * Draws one carved motif. In colour it is raised relief: a cast shadow below-right, a lit
 * arris above-left, then the motif itself; in the bump pass it is simply raised (white).
 * `path` builds the motif's outline (it must call beginPath).
 */
function carve(ctx, bump, path, fill = RELIEF_STONE) {
  if (bump) {
    ctx.fillStyle = '#fff';
    path();
    ctx.fill();
    return;
  }
  ctx.save();
  ctx.translate(3, 4);
  ctx.fillStyle = 'rgba(25,14,6,0.55)';
  path();
  ctx.fill();
  ctx.translate(-4.5, -5.5);
  ctx.fillStyle = 'rgba(255,240,210,0.38)';
  path();
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = fill;
  path();
  ctx.fill();
}

/** A hamsa (sacred swan) in profile, walking right; `s` is half its length. */
function hamsaPath(ctx, x, y, s) {
  ctx.beginPath();
  ctx.moveTo(x - 0.9 * s, y + 0.1 * s);
  ctx.bezierCurveTo(x - 0.7 * s, y + 0.55 * s, x + 0.5 * s, y + 0.6 * s, x + 0.75 * s, y + 0.15 * s);
  ctx.bezierCurveTo(x + 0.8 * s, y - 0.05 * s, x + 0.55 * s, y - 0.2 * s, x + 0.5 * s, y - 0.45 * s);
  ctx.bezierCurveTo(x + 0.45 * s, y - 0.75 * s, x + 0.7 * s, y - 0.95 * s, x + 0.85 * s, y - 0.85 * s);
  ctx.lineTo(x + 1.08 * s, y - 0.8 * s);
  ctx.lineTo(x + 0.86 * s, y - 0.71 * s);
  ctx.bezierCurveTo(x + 0.72 * s, y - 0.74 * s, x + 0.62 * s, y - 0.55 * s, x + 0.68 * s, y - 0.4 * s);
  ctx.bezierCurveTo(x + 0.75 * s, y - 0.2 * s, x + 0.4 * s, y - 0.1 * s, x, y - 0.15 * s);
  ctx.bezierCurveTo(x - 0.4 * s, y - 0.2 * s, x - 0.7 * s, y - 0.5 * s, x - 0.98 * s, y - 0.62 * s);
  ctx.bezierCurveTo(x - 0.86 * s, y - 0.3 * s, x - 0.96 * s, y - 0.05 * s, x - 0.9 * s, y + 0.1 * s);
  ctx.closePath();
}

/** A kudu: the horseshoe-arched dormer window of Dravidian cornices, as a band of stone. */
function kuduPath(ctx, x, base, top, radius, thickness) {
  const spring = top + radius;
  ctx.beginPath();
  ctx.moveTo(x - radius, base);
  ctx.lineTo(x - radius, spring);
  ctx.arc(x, spring, radius, Math.PI, 0);
  ctx.lineTo(x + radius, base);
  ctx.lineTo(x + radius - thickness, base);
  ctx.lineTo(x + radius - thickness, spring);
  ctx.arc(x, spring, radius - thickness, 0, Math.PI, true);
  ctx.lineTo(x - radius + thickness, base);
  ctx.closePath();
}

const circlePath = (ctx, x, y, r) => {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
};
const petalPath = (ctx, x, y, width, height) => {
  ctx.beginPath();
  ctx.moveTo(x, y + height / 2);
  ctx.quadraticCurveTo(x + width / 2, y, x, y - height / 2);
  ctx.quadraticCurveTo(x - width / 2, y, x, y + height / 2);
};

/**
 * The carved cornice frieze, one 2.4 m × 0.9 m tile (drawn at true proportions so nothing
 * is squashed): projecting beam-end dentils; a row of kudu arches with trefoil finials and
 * lotus buds, between little pilasters; a lotus-petal fillet; and a procession of hamsa
 * swans over a beaded string course. Faded red ochre in the recesses is the ghost of the
 * paint these friezes once wore. Every motif repeats a whole number of times per tile.
 */
function drawCarvedFrieze(ctx, w, h, bump = false) {
  const u = h / 576; // drawn on a 1536 × 576 grid
  ctx.fillStyle = bump ? '#5a5a5a' : '#8f775a';
  ctx.fillRect(0, 0, w, h);
  if (!bump) {
    ctx.fillStyle = 'rgba(138,59,34,0.2)';
    ctx.fillRect(0, 70 * u, w, 250 * u);
    ctx.fillRect(0, 368 * u, w, 176 * u);
    speckle(ctx, w, h, 14000, ['#00000020', '#ffffff1e', '#5a402a26'], seededRandom(41), 2);
  } else {
    ctx.filter = `blur(${(2 * u).toFixed(1)}px)`;
  }

  // Beam-end dentils and the fillets framing each band.
  for (let x = 9 * u; x < w; x += 48 * u) carve(ctx, bump, () => { ctx.beginPath(); ctx.rect(x, 6 * u, 30 * u, 42 * u); });
  for (const y of [54, 322, 362, 546]) carve(ctx, bump, () => { ctx.beginPath(); ctx.rect(0, y * u, w, 8 * u); });

  // Kudu arches between pilasters.
  const kuduStep = w / 6;
  for (let i = 0; i <= 6; i += 1) carve(ctx, bump, () => { ctx.beginPath(); ctx.rect(i * kuduStep - 9 * u, 110 * u, 18 * u, 208 * u); });
  for (let i = 0; i < 6; i += 1) {
    const x = i * kuduStep + kuduStep / 2;
    carve(ctx, bump, () => kuduPath(ctx, x, 316 * u, 120 * u, 86 * u, 22 * u));
    for (const [dx, dy] of [[0, -14], [-18, 0], [18, 0]]) carve(ctx, bump, () => circlePath(ctx, x + dx * u, (98 + dy) * u, 13 * u));
    carve(ctx, bump, () => circlePath(ctx, x, 236 * u, 24 * u));
    for (const a of [-0.9, 0, 0.9]) {
      carve(ctx, bump, () => {
        ctx.save();
        ctx.translate(x, 236 * u);
        ctx.rotate(a);
        petalPath(ctx, 0, -40 * u, 22 * u, 34 * u);
        ctx.restore();
      });
    }
  }

  // Lotus-petal fillet.
  for (let x = 16 * u; x < w; x += 32 * u) carve(ctx, bump, () => petalPath(ctx, x, 342 * u, 26 * u, 28 * u));

  // The procession of hamsas, over a beaded string course.
  const hamsaStep = w / 8;
  for (let i = 0; i < 8; i += 1) carve(ctx, bump, () => hamsaPath(ctx, i * hamsaStep + hamsaStep / 2, 470 * u, 70 * u));
  for (let x = 12 * u; x < w; x += 24 * u) carve(ctx, bump, () => circlePath(ctx, x, 560 * u, 6 * u));

  if (!bump) {
    // A wing feather line on each swan, cut into the stone.
    ctx.strokeStyle = 'rgba(40,24,10,0.5)';
    ctx.lineWidth = 3 * u;
    for (let i = 0; i < 8; i += 1) {
      const x = i * hamsaStep + hamsaStep / 2;
      ctx.beginPath();
      ctx.moveTo(x - 45 * u, 460 * u);
      ctx.quadraticCurveTo(x, 440 * u, x + 35 * u, 470 * u);
      ctx.stroke();
    }
  }
  ctx.filter = 'none';
}

/*
 * Artwork from public/UI images, as the files were added. Each crop is [x, y, width,
 * height] as fractions of the picture, so a re-exported copy at another size still fits.
 * (WhatsApp Image 2026-10-21 at 2.57.13 PM.jpeg, the rendering of the whole hall, is the
 * benchmark the lighting and furnishing follow, not a texture.)
 */
const UI_IMAGES_FOLDER = '/UI images/';
/*
 * The passages' carved arch (buildArch): a web copy of the red-and-gold arch in
 * public/UI images/Arch (a 75 MB scan, without a file extension), made like the hall
 * models (hallExhibits.js) with --simplify-ratio 0.03 --simplify-error 0.002
 * --texture-size 1024. Regenerate it if the original changes.
 *
 * Its proportions, as fractions of its width (measured from the model): the clear span
 * between its pillars' shafts, and its height. Set at a passage, its shafts stand at the
 * wall's jambs.
 */
const ARCH_MODEL = { url: mediaUrl(`${UI_IMAGES_FOLDER}Arch.web.glb`), span: 0.591, height: 1.151 };
const ARCH_OUTER_WIDTH = ARCH_WIDTH / ARCH_MODEL.span;
const ARCH_TOP = ARCH_OUTER_WIDTH * ARCH_MODEL.height;
/** How far the arch stands out from its wall (squashed front to back from the model's 0.25 of its width). */
const ARCH_DEPTH = 0.75;
/**
 * The alcove reliefs, cropped to the carving inside each painted alcove frame (the hall's
 * own niche, crown and lighting frame them instead). Niches take them in turn.
 */
const ALCOVE_RELIEFS = [
  { file: 'WhatsApp Image 2026-10-21 at 2.59.14 PM.jpeg', subject: 'gopuram', crop: [110 / 1024, 330 / 1536, 805 / 1024, 1165 / 1536] },
  { file: 'WhatsApp Image 2026-10-21 at 3.00.23 PM.jpeg', subject: 'royal horse rider', crop: [110 / 1024, 330 / 1536, 795 / 1024, 1130 / 1536] },
  { file: 'WhatsApp Image 2026-10-21 at 3.02.15 PM.jpeg', subject: 'royal procession', crop: [145 / 1024, 360 / 1536, 725 / 1024, 1100 / 1536] },
];
/**
 * The coffered dome photograph, which becomes the whole ceiling. It is a wide-angle shot,
 * stretched sideways and cut off above and below, but the dome is 8-fold symmetric, so the
 * full circle is rebuilt from the slice of it that the photo shows whole: the 45° wedge
 * round the coffer to the right of the medallion, out to just past the jali (all in the
 * photo's pixels, as fractions of its width and height).
 */
const CEILING_DOME = {
  file: 'WhatsApp Image 2026-10-21 at 3.03.06 PM.jpeg',
  crop: [0, 0, 1, 1],
  centre: [795 / 1600, 365 / 731], // the gilt lotus medallion
  stretch: 1.19, // the photo's horizontal stretch
  radius: 640 / 731, // to just beyond the jali, in units of the photo's height
  symmetry: 8,
};

/** Rebuilds the round dome from the photo's wedge (see CEILING_DOME), into a `size`² canvas. */
function unwrapDome(ctx, w, h, size = 1536) {
  const { centre, stretch, radius, symmetry } = CEILING_DOME;
  const source = ctx.getImageData(0, 0, w, h).data;
  const out = document.createElement('canvas');
  out.width = out.height = size;
  const outCtx = out.getContext('2d');
  const image = outCtx.createImageData(size, size);
  const { data } = image;
  const cx = centre[0] * w;
  const cy = centre[1] * h;
  const R = radius * h;
  const half = size / 2;
  const wedge = TAU / symmetry;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const dx = ((x + 0.5 - half) / half) * R;
      const dy = ((y + 0.5 - half) / half) * R;
      const r = Math.min(Math.hypot(dx, dy), R);
      let a = Math.atan2(dy, dx);
      a -= wedge * Math.round(a / wedge);
      // Bilinear sample of the photo.
      const sx = clamp(cx + r * Math.cos(a) * stretch, 0, w - 1.001);
      const sy = clamp(cy + r * Math.sin(a), 0, h - 1.001);
      const x0 = Math.floor(sx);
      const y0 = Math.floor(sy);
      const fx = sx - x0;
      const fy = sy - y0;
      const i00 = (y0 * w + x0) * 4;
      const i10 = i00 + 4;
      const i01 = i00 + w * 4;
      const i11 = i01 + 4;
      const o = (y * size + x) * 4;
      for (let c = 0; c < 3; c += 1) {
        const top = source[i00 + c] + (source[i10 + c] - source[i00 + c]) * fx;
        const bottom = source[i01 + c] + (source[i11 + c] - source[i01 + c]) * fx;
        data[o + c] = top + (bottom - top) * fy;
      }
      data[o + 3] = 255;
    }
  }
  outCtx.putImageData(image, 0, 0);
  return out;
}
/**
 * The red silhouette frieze under the cornice (palms, gopurams, a chariot, a horseman, an
 * archer and a trading ship between floral borders). The photo shows the band curving
 * round a wall: its top and bottom edges sag (in the photo's pixels) by `sag` from the
 * sides to the middle, as near-parabolas, and it is straightened column by column.
 */
const FRIEZE_ART = {
  file: 'd511a1c7-1da8-433d-bace-94cb1e55d4b9.jpg',
  crop: [0, 0, 1, 1],
  size: [1600, 533],
  top: { middle: 92, sag: 85 },
  bottom: { middle: 458, sag: 38 },
};

/** Straightens the frieze photo's curved band (see FRIEZE_ART) into a flat strip. */
function unbendFrieze(ctx, w, h) {
  const { size, top, bottom } = FRIEZE_ART;
  const sy = h / size[1];
  const edge = ({ middle, sag }, x) => (middle - sag * ((x / w) * 2 - 1) ** 2) * sy;
  const height = Math.round((bottom.middle - top.middle) * sy);
  const source = ctx.getImageData(0, 0, w, h).data;
  const out = document.createElement('canvas');
  out.width = w;
  out.height = height;
  const outCtx = out.getContext('2d');
  const image = outCtx.createImageData(w, height);
  const { data } = image;
  for (let x = 0; x < w; x += 1) {
    const from = edge(top, x + 0.5);
    const to = edge(bottom, x + 0.5);
    for (let y = 0; y < height; y += 1) {
      const fy = clamp(from + ((y + 0.5) / height) * (to - from), 0, h - 1.001);
      const y0 = Math.floor(fy);
      const t = fy - y0;
      const i0 = (y0 * w + x) * 4;
      const i1 = i0 + w * 4;
      const o = (y * w + x) * 4;
      for (let c = 0; c < 3; c += 1) data[o + c] = source[i0 + c] + (source[i1 + c] - source[i0 + c]) * t;
      data[o + 3] = 255;
    }
  }
  outCtx.putImageData(image, 0, 0);
  return out;
}

/** Silk banners (white backgrounds, keyed out on loading): the kalasam, and the Chola tiger. */
const BANNERS = [
  { file: 'WhatsApp Image 2026-10-21 at 3.06.45 PM.jpeg', subject: 'kalasam banner', crop: [0, 0, 1, 1] },
  { file: 'WhatsApp Image 2026-10-21 at 3.06.47 PM.jpeg', subject: 'tiger banner', crop: [0, 0, 1, 1] },
];

/**
 * A picture's `prepare` step (see loadPicture) followed by gilding: its cream and sand
 * motifs are recoloured as gold (gilding.js), on whichever canvas `prepare` leaves.
 */
function gilded(prepare, options) {
  return (ctx, w, h) => {
    const result = prepare?.(ctx, w, h);
    const canvas = result instanceof HTMLCanvasElement ? result : ctx.canvas;
    gildPainting(canvas.getContext('2d'), canvas.width, canvas.height, options);
    return result;
  };
}

/** Makes a picture's near-white background transparent, with a soft edge (for the banners). */
function keyOutWhite(ctx, w, h) {
  const image = ctx.getImageData(0, 0, w, h);
  const { data } = image;
  for (let i = 0; i < data.length; i += 4) {
    const lightest = Math.min(data[i], data[i + 1], data[i + 2]);
    if (lightest > 238) data[i + 3] = 0;
    else if (lightest > 216) data[i + 3] = Math.round(((238 - lightest) / 22) * 255);
  }
  ctx.putImageData(image, 0, 0);
}

const PAINT_GOLD = '#d4a64a';

/**
 * The side of a sandstone girder (2.4 m × 0.6 m tile), weathered as at Thanjavur: warm
 * ochre stone, mottled and streaked dark where rain has run, with a carved bead-and-lotus
 * moulding along its lower edge.
 */
function drawOchreSandstone(ctx, w, h, moulding = true) {
  const u = Math.min(w, h) / 256; // drawn on a 1024 × 256 grid
  const rand = seededRandom(79);
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#c99a58');
  g.addColorStop(1, '#b07c40');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 60; i += 1) {
    const x = rand() * w;
    const y = rand() * h;
    const r = (20 + rand() * 90) * u;
    const tone = rand() > 0.45 ? '255,230,180' : '70,40,15';
    for (const ox of [-w, 0, w]) {
      const blot = ctx.createRadialGradient(x + ox, y, 0, x + ox, y, r);
      blot.addColorStop(0, `rgba(${tone},${0.06 + rand() * 0.1})`);
      blot.addColorStop(1, `rgba(${tone},0)`);
      ctx.fillStyle = blot;
      ctx.fillRect(x + ox - r, y - r, r * 2, r * 2);
    }
  }
  for (let i = 0; i < 40; i += 1) {
    const x = rand() * w;
    const length = h * (0.3 + rand() * 0.6);
    const streak = ctx.createLinearGradient(0, 0, 0, length);
    streak.addColorStop(0, 'rgba(50,28,10,0.3)');
    streak.addColorStop(1, 'rgba(50,28,10,0)');
    ctx.fillStyle = streak;
    ctx.fillRect(x, 0, (1 + rand() * 4) * u, length);
  }
  speckle(ctx, w, h, 9000, ['#00000020', '#ffffff1c', '#5a361630'], rand, 2);
  if (!moulding) return;
  const relief = '#d4a565';
  for (const y of [196, 246]) carve(ctx, false, () => { ctx.beginPath(); ctx.rect(0, y * u, w, 8 * u); }, relief);
  for (let x = 16 * u; x < w; x += 32 * u) carve(ctx, false, () => petalPath(ctx, x, 222 * u, 26 * u, 34 * u), relief);
}

/* ---------- The master rendering's look: jali and marble ---------- */

const MARBLE_CREAM = '#dcc7a4';
const LOTUS_BROWN = '#86442a';

/**
 * The clerestory band between the cornice and the ceiling (a 2.03 m × 1.1 m tile): a
 * pierced stone jali, its lattice of quatrefoils glowing with the light behind it, between
 * plain cream fillets.
 */
function drawJaliBand(ctx, w, h) {
  const u = h / 555; // drawn on a 1024 × 555 grid
  const top = 70 * u;
  const bottom = 485 * u;
  ctx.fillStyle = '#b8955f';
  ctx.fillRect(0, 0, w, h);
  speckle(ctx, w, h, 5000, ['#00000014', '#ffffff1e'], seededRandom(71), 2);
  // The light behind: brightest at the middle of the band.
  const light = ctx.createLinearGradient(0, top, 0, bottom);
  light.addColorStop(0, '#ffd27e');
  light.addColorStop(0.5, '#fff4d6');
  light.addColorStop(1, '#ffcf78');
  const cell = 64 * u;
  const cols = Math.round(w / cell);
  const step = w / cols;
  const rows = Math.floor((bottom - top) / step);
  const y0 = top + ((bottom - top) - rows * step) / 2;
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const cx = (c + 0.5) * step;
      const cy = y0 + (r + 0.5) * step;
      const lobe = step * 0.2;
      ctx.beginPath();
      for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
        ctx.moveTo(cx + dx * lobe + lobe, cy + dy * lobe);
        ctx.arc(cx + dx * lobe, cy + dy * lobe, lobe, 0, TAU);
      }
      ctx.fillStyle = light;
      ctx.fill();
    }
  }
  // Shadowed edges to the fillets, and a gilt line under the top one.
  ctx.fillStyle = 'rgba(90,60,30,0.35)';
  ctx.fillRect(0, y0 - 6 * u, w, 4 * u);
  ctx.fillRect(0, y0 + rows * step + 2 * u, w, 4 * u);
  ctx.fillStyle = PAINT_GOLD;
  ctx.fillRect(0, 22 * u, w, 6 * u);
  ctx.fillRect(0, h - 28 * u, w, 6 * u);
}

/**
 * The polished floor (`w` px across the hall's floor circle): cream marble with soft veins,
 * laid in large slabs, round a great inlaid lotus medallion at the centre.
 */
export function drawMarbleFloor(ctx, w, metresAcross) {
  const rand = seededRandom(11);
  const m = w / metresAcross; // pixels per metre
  const c = w / 2;
  ctx.fillStyle = MARBLE_CREAM;
  ctx.fillRect(0, 0, w, w);
  for (let i = 0; i < 160; i += 1) {
    const x = rand() * w;
    const y = rand() * w;
    const r = (0.5 + rand() * 2.5) * m;
    const tone = rand() > 0.5 ? '255,248,232' : '190,160,120';
    const blot = ctx.createRadialGradient(x, y, 0, x, y, r);
    blot.addColorStop(0, `rgba(${tone},0.18)`);
    blot.addColorStop(1, `rgba(${tone},0)`);
    ctx.fillStyle = blot;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  // Veins.
  for (let i = 0; i < 90; i += 1) {
    let x = rand() * w;
    let y = rand() * w;
    ctx.strokeStyle = `rgba(150,115,80,${0.06 + rand() * 0.1})`;
    ctx.lineWidth = 0.6 + rand() * 1.6;
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let k = 0; k < 4; k += 1) {
      const nx = x + (rand() - 0.3) * 1.6 * m;
      const ny = y + (rand() - 0.5) * 1.2 * m;
      ctx.quadraticCurveTo(x + (rand() - 0.5) * m, y + (rand() - 0.5) * m, nx, ny);
      x = nx;
      y = ny;
    }
    ctx.stroke();
  }
  speckle(ctx, w, w, 30000, ['#00000010', '#ffffff18', '#a0806016'], rand, 2);
  // Slab joints, 1.6 m apart, centred on the hall.
  ctx.fillStyle = 'rgba(120,90,60,0.14)';
  const slab = 1.6 * m;
  for (let k = -Math.ceil(c / slab); k <= Math.ceil(c / slab); k += 1) {
    ctx.fillRect(c + k * slab - 1, 0, 2, w);
    ctx.fillRect(0, c + k * slab - 1, w, 2);
  }

  // The lotus medallion round the centrepiece.
  ctx.translate(c, c);
  const ring = (r, width, color) => {
    ctx.beginPath();
    ctx.arc(0, 0, r * m, 0, TAU);
    ctx.lineWidth = width * m;
    ctx.strokeStyle = color;
    ctx.stroke();
  };
  ctx.beginPath();
  ctx.arc(0, 0, 4.1 * m, 0, TAU);
  ctx.fillStyle = LOTUS_BROWN;
  ctx.fill();
  const petalRing = (count, inner, outer, width, fill, turn = 0) => {
    for (let i = 0; i < count; i += 1) {
      ctx.save();
      ctx.rotate((i / count) * TAU + turn);
      petalPath(ctx, 0, -((inner + outer) / 2) * m, width * m, (outer - inner) * m);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.restore();
    }
  };
  petalRing(16, 1.9, 4.0, 1.25, '#efe0c2');
  petalRing(16, 2.15, 3.6, 0.7, LOTUS_BROWN);
  petalRing(16, 2.4, 3.3, 0.32, '#d9b98a');
  petalRing(16, 2.0, 3.0, 0.5, '#e6d2ae', Math.PI / 16);
  ctx.beginPath();
  ctx.arc(0, 0, 1.9 * m, 0, TAU);
  ctx.fillStyle = '#e8d6b6';
  ctx.fill();
  ring(4.15, 0.08, '#c99a4a');
  ring(4.32, 0.04, LOTUS_BROWN);
  ring(1.9, 0.06, '#c99a4a');
  ring(1.75, 0.03, LOTUS_BROWN);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

/*
 * Light washes are computed per pixel with a smooth falloff and dithered by under one
 * step, so their long, faint tails never break into 8-bit bands.
 */
const dither = () => Math.random() - 0.5;

/** Hidden cove light falling across a surface: bright at the top edge, fading smoothly away. */
function drawWash(ctx, w, h) {
  const image = ctx.createImageData(w, h);
  for (let y = 0; y < h; y += 1) {
    const t = y / (h - 1);
    const glow = (1 - t) ** 2.4 * (0.35 + 0.65 * Math.exp(-t * 6));
    for (let x = 0; x < w; x += 1) {
      const i = (y * w + x) * 4;
      image.data[i] = image.data[i + 1] = image.data[i + 2] = 255;
      image.data[i + 3] = Math.max(0, Math.min(255, glow * 255 + dither()));
    }
  }
  ctx.putImageData(image, 0, 0);
}

/**
 * Shafts of sunlight through the jali (u round the hall, v down from the jali): beams of
 * irregular width and strength over a faint haze, bright just under the jali and fading
 * out well before the floor. Seamless round the hall.
 */
function drawSunShafts(ctx, w, h) {
  const rand = seededRandom(131);
  const beams = new Float32Array(w).fill(0.12);
  for (let k = 0; k < 90; k += 1) {
    const centre = rand() * w;
    const width = 2 + rand() * 14;
    const strength = 0.25 + rand() * 0.75;
    for (let x = 0; x < w; x += 1) {
      let d = Math.abs(x - centre);
      d = Math.min(d, w - d); // wrap round
      beams[x] += strength * Math.exp(-((d / width) ** 2));
    }
  }
  const image = ctx.createImageData(w, h);
  for (let y = 0; y < h; y += 1) {
    const t = y / (h - 1);
    const fall = Math.min(1, t / 0.05) * (1 - t) ** 1.8;
    for (let x = 0; x < w; x += 1) {
      const i = (y * w + x) * 4;
      image.data[i] = image.data[i + 1] = image.data[i + 2] = 255;
      image.data[i + 3] = clamp(Math.min(1, beams[x]) * fall * 255 + dither(), 0, 255);
    }
  }
  ctx.putImageData(image, 0, 0);
}

/**
 * Sunlight on the floor, patterned by the jali it came through (one tile of a ring: u round
 * the hall, v outwards): soft quatrefoils of light, fading towards the ring's edges.
 */
function drawJaliDapple(ctx, w, h) {
  ctx.filter = `blur(${(w / 64).toFixed(1)}px)`;
  ctx.fillStyle = '#ffffff';
  for (const [cx, cy, s] of [[0.25, 0.3, 1], [0.75, 0.3, 1], [0.5, 0.62, 1.15], [0, 0.62, 1.15], [1, 0.62, 1.15], [0.25, 0.9, 0.8], [0.75, 0.9, 0.8]]) {
    const lobe = w * 0.05 * s;
    for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
      circlePath(ctx, cx * w + dx * lobe, cy * h + dy * lobe * 0.7, lobe);
      ctx.fill();
    }
  }
  ctx.filter = 'none';
  // Fade towards the ring's inner and outer edges.
  const fade = ctx.createLinearGradient(0, 0, 0, h);
  fade.addColorStop(0, 'rgba(0,0,0,0)');
  fade.addColorStop(0.35, 'rgba(0,0,0,1)');
  fade.addColorStop(0.65, 'rgba(0,0,0,1)');
  fade.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalCompositeOperation = 'destination-in';
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'source-over';
}

/** The scallop of a downlight on a wall: a soft cone opening and fading downwards. */
function drawScallop(ctx, w, h) {
  const image = ctx.createImageData(w, h);
  for (let y = 0; y < h; y += 1) {
    const t = y / (h - 1);
    const spread = 0.3 + 0.7 * t;
    const fade = (1 - t) ** 1.6 * Math.min(1, t / 0.06);
    for (let x = 0; x < w; x += 1) {
      const across = (x - (w - 1) / 2) / ((w - 1) / 2) / spread;
      const i = (y * w + x) * 4;
      image.data[i] = image.data[i + 1] = image.data[i + 2] = 255;
      image.data[i + 3] = Math.max(0, Math.min(255, fade * Math.exp(-across * across * 2.5) * 255 + dither()));
    }
  }
  ctx.putImageData(image, 0, 0);
}

function drawWingPanel(ctx, w, h, wing) {
  const accent = new THREE.Color(wing.accent ?? '#6e1f1a');
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, accent.clone().lerp(new THREE.Color('#f4d792'), 0.25).getStyle());
  bg.addColorStop(0.55, accent.getStyle());
  bg.addColorStop(1, accent.clone().lerp(new THREE.Color('#000000'), 0.6).getStyle());
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  const glow = ctx.createRadialGradient(w / 2, h * 0.42, 0, w / 2, h * 0.42, w * 0.7);
  glow.addColorStop(0, '#ffe9b055');
  glow.addColorStop(1, '#ffe9b000');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 6;
  ctx.strokeRect(18, 18, w - 36, h - 36);
  ctx.lineWidth = 2;
  ctx.strokeRect(32, 32, w - 64, h - 64);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fbe7b5';
  ctx.shadowColor = '#000000aa';
  ctx.shadowBlur = 18;
  let size = 150;
  ctx.font = `700 ${size}px ${TAMIL_FONT}`;
  while (ctx.measureText(wing.glyph).width > w - 110 && size > 40) {
    size -= 6;
    ctx.font = `700 ${size}px ${TAMIL_FONT}`;
  }
  ctx.fillText(wing.glyph, w / 2, h * 0.4);
  ctx.shadowBlur = 0;

  ctx.fillStyle = GOLD;
  ctx.fillRect(w / 2 - 90, h * 0.55, 180, 2);
  ctx.save();
  ctx.translate(w / 2, h * 0.55 + 1);
  ctx.rotate(Math.PI / 4);
  ctx.fillRect(-7, -7, 14, 14);
  ctx.restore();

  ctx.fillStyle = '#f7ead0';
  ctx.font = `600 38px ${SERIF_FONT}`;
  const words = translate(wing.title).toUpperCase().split(' ');
  const lines = [];
  for (const word of words) {
    const candidate = lines.length ? `${lines[lines.length - 1]} ${word}` : word;
    if (lines.length && ctx.measureText(candidate).width <= w - 100) lines[lines.length - 1] = candidate;
    else lines.push(word);
  }
  lines.forEach((line, i) => ctx.fillText(line, w / 2, h * 0.64 + i * 44));

  ctx.fillStyle = GOLD;
  for (let i = 0; i < 9; i += 1) {
    ctx.beginPath();
    ctx.arc(w / 2 + (i - 4) * 26, h * 0.86, 4, 0, TAU);
    ctx.fill();
  }
}

/** Breaks `text` into lines no wider than `width` in the context's current font. */
function wrapText(ctx, text, width) {
  const lines = [];
  for (const word of text.split(' ')) {
    const candidate = lines.length ? `${lines[lines.length - 1]} ${word}` : word;
    if (lines.length && ctx.measureText(candidate).width <= width) lines[lines.length - 1] = candidate;
    else lines.push(word);
  }
  return lines;
}

/**
 * One face of the monolith (see MONUMENT): polished black granite, framed by a gilt double
 * border under a carved arch, with its inscription cut in and gilded — the Tamil above the
 * English throughout. The text is set at the largest size (up to full) at which it all fits;
 * `emblem` is the CICT emblem image, once loaded, for the front face.
 */
function drawMonolithFace(ctx, w, h, face, emblem = null) {
  const rand = seededRandom(face.id.length * 97 + 13);
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#2a2420');
  bg.addColorStop(0.5, '#171310');
  bg.addColorStop(1, '#221c18');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  speckle(ctx, w, h, (w * h) / 60, ['#3b332c', '#0c0a08', '#4a4038', '#5c5046'], rand, 2.4);
  // A sheen across the polish.
  const sheen = ctx.createLinearGradient(0, 0, w, h * 0.6);
  sheen.addColorStop(0.3, '#ffffff00');
  sheen.addColorStop(0.45, '#ffffff10');
  sheen.addColorStop(0.6, '#ffffff00');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, w, h);

  // The frame: a gilt double border, its head an arch.
  const archTop = Math.min(w * 0.5, 260);
  const frame = (inset) => {
    ctx.beginPath();
    ctx.moveTo(inset, h - inset);
    ctx.lineTo(inset, archTop);
    ctx.quadraticCurveTo(inset, inset, w / 2, inset);
    ctx.quadraticCurveTo(w - inset, inset, w - inset, archTop);
    ctx.lineTo(w - inset, h - inset);
    ctx.closePath();
  };
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 7;
  frame(26);
  ctx.stroke();
  ctx.lineWidth = 2.5;
  frame(44);
  ctx.stroke();
  // Lotus buds down the foot of the frame.
  ctx.fillStyle = GOLD;
  for (let x = 90; x < w - 70; x += 56) {
    ctx.beginPath();
    ctx.ellipse(x, h - 70, 9, 15, 0, 0, TAU);
    ctx.fill();
  }

  const margin = 92;
  const inner = w - margin * 2;
  const cut = (text, x, y, font, fill) => {
    ctx.font = font;
    ctx.fillStyle = '#000000';
    ctx.fillText(text, x - 1.5, y - 1.5); // the cut's shadowed edge
    ctx.fillStyle = fill;
    ctx.fillText(text, x, y);
  };
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  /** Sets the face at `scale`, drawing only if `draw`; returns where the text ended. */
  const layout = (scale, draw) => {
    let y = archTop * 0.55;
    const block = (text, weight, size, family, fill, leading = 1.45, width = inner) => {
      const font = `${weight} ${Math.round(size * scale)}px ${family}`;
      ctx.font = font;
      for (const line of wrapText(ctx, text, width)) {
        if (draw) cut(line, w / 2, y, font, fill);
        y += size * scale * leading;
      }
    };
    const rule = (space) => {
      y += space * scale;
      if (draw) {
        ctx.fillStyle = GOLD;
        ctx.fillRect(w / 2 - inner * 0.3, y, inner * 0.6, 2);
        ctx.save();
        ctx.translate(w / 2, y + 1);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-7, -7, 14, 14);
        ctx.restore();
      }
      y += space * scale;
    };

    if (face.emblem) {
      const size = Math.min(inner * 0.42, 300) * scale;
      if (draw) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(w / 2, y + size / 2, size / 2, 0, TAU);
        ctx.fillStyle = '#f7efe0';
        ctx.fill();
        if (emblem) {
          ctx.clip();
          ctx.drawImage(emblem, w / 2 - size / 2, y, size, size);
        }
        ctx.restore();
        ctx.strokeStyle = GOLD;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(w / 2, y + size / 2, size / 2 + 6, 0, TAU);
        ctx.stroke();
      }
      y += size + 40 * scale;
    }
    block(face.headingTa, 700, 64, TAMIL_FONT, '#f2d189', 1.5);
    block(translate(face.heading).toUpperCase(), 700, 50, SERIF_FONT, '#e9c77f', 1.2);
    /** A person's name (in Tamil too, when given) over their designation. */
    const person = ({ name, nameTa, designation }, size) => {
      if (nameTa) block(nameTa, 700, size * 0.9, TAMIL_FONT, '#fbe7b5');
      block(translate(name), 700, size, SERIF_FONT, '#fbe7b5', 1.2);
      if (designation) block(translate(designation), 500, size * 0.58, SERIF_FONT, '#d8b77a', 1.5);
    };
    if (face.person) {
      y += 34 * scale;
      person(face.person, 64);
    }
    rule(40);
    for (const credit of face.credits ?? []) {
      block(credit.roleTa, 600, 36, TAMIL_FONT, '#d99a6c');
      block(translate(credit.role).toUpperCase(), 600, 32, SERIF_FONT, '#c9a66a', 1.3);
      y += 8 * scale;
      credit.people.forEach((someone) => person(someone, 58));
      y += 40 * scale;
    }
    for (const section of face.sections ?? []) {
      if (section.title) {
        block(`${section.titleTa} · ${translate(section.title).toUpperCase()}`, 700, 38, `'Cormorant Garamond', Georgia, ${TAMIL_FONT}`, '#e9c77f', 1.5);
      }
      if (section.ta) block(section.ta, 400, 32, TAMIL_FONT, '#efdcb4', 1.6);
      if (section.en) block(translate(section.en), 500, 36, SERIF_FONT, '#d8c4a0', 1.35);
      (section.items ?? []).forEach((item) => {
        y += 6 * scale;
        block(`◆ ${item.ta}`, 400, 30, TAMIL_FONT, '#efdcb4', 1.6);
        block(translate(item.en), 500, 33, SERIF_FONT, '#d8c4a0', 1.3);
      });
      y += 36 * scale;
    }
    return y;
  };

  const bottom = h - 120;
  let scale = 1;
  while (scale > 0.45 && layout(scale, false) > bottom) scale -= 0.03;
  // Centre a short inscription (the plaques) a little above the middle of the face.
  const spare = bottom - layout(scale, false);
  ctx.save();
  ctx.translate(0, Math.max(0, spare * 0.35));
  layout(scale, true);
  ctx.restore();
}

/**
 * A soft light halo, computed per pixel: a hot core inside a wide Gaussian falloff that
 * reaches exactly zero at the edge, shading from pale gold to amber. Each pixel's alpha
 * is dithered by under one step, so the long, faint tail never shows 8-bit bands.
 */
export function drawGlow(ctx, w) {
  const image = ctx.createImageData(w, w);
  const centre = (w - 1) / 2;
  for (let y = 0; y < w; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const d = Math.min(1, Math.hypot(x - centre, y - centre) / centre); // 0 centre … 1 edge
      const edge = (1 - d * d) ** 2; // fades the halo smoothly to nothing at the rim
      const alpha = (Math.exp(-((d / 0.13) ** 2)) + 0.55 * Math.exp(-((d / 0.45) ** 2))) * edge;
      const warm = Math.min(1, d / 0.5);
      const i = (y * w + x) * 4;
      image.data[i] = 255;
      image.data[i + 1] = 243 - 63 * warm;
      image.data[i + 2] = 208 - 134 * warm;
      image.data[i + 3] = Math.max(0, Math.min(255, Math.min(1, alpha) * 255 + Math.random() - 0.5));
    }
  }
  ctx.putImageData(image, 0, 0);
}

/** An oil-lamp flame: a teardrop, white-hot at the wick, through gold to a fading orange tip. */
export function drawFlame(ctx, w, h) {
  const r = w * 0.4;
  const base = h - r - 4;
  const g = ctx.createRadialGradient(w / 2, base, 0, w / 2, base, h * 0.85);
  g.addColorStop(0, 'rgba(255,255,240,1)');
  g.addColorStop(0.18, 'rgba(255,232,150,0.95)');
  g.addColorStop(0.5, 'rgba(255,160,50,0.6)');
  g.addColorStop(1, 'rgba(255,90,10,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(w / 2, 2);
  ctx.quadraticCurveTo(w / 2 + r * 0.35, base - r * 1.6, w / 2 + r, base);
  ctx.arc(w / 2, base, r, 0, Math.PI);
  ctx.quadraticCurveTo(w / 2 - r * 0.35, base - r * 1.6, w / 2, 2);
  ctx.fill();
}

/**
 * Silhouette of a brass Nilavilakku (kuthu vilakku), turned on a lathe: a stepped round
 * foot, a stem with turned knops, the oil bowl with its five wick spouts' rim, and a
 * finial crowned with a small bud. Points are [radius, height] in metres.
 */
export const NILAVILAKKU_PROFILE = [
  [0, 0], [0.17, 0], [0.18, 0.02], [0.15, 0.04], [0.11, 0.05], [0.1, 0.07], [0.05, 0.09],
  [0.03, 0.12], [0.03, 0.2], [0.05, 0.22], [0.03, 0.24], [0.025, 0.36], [0.045, 0.38], [0.03, 0.4],
  [0.03, 0.44], [0.07, 0.46], [0.15, 0.5], [0.17, 0.53], [0.16, 0.54], [0.06, 0.53], [0.025, 0.55],
  [0.022, 0.66], [0.04, 0.68], [0.02, 0.7], [0.02, 0.74], [0.035, 0.77], [0.012, 0.82], [0, 0.84],
];
export const NILAVILAKKU_RIM = { radius: 0.155, height: 0.545 };
const DEEPAM_WICKS = 5;
const DEEPAM_LIGHT = 14; // candela, before flicker

/*
 * Relief depth for the carved friezes' bump maps, in metres per unit of height-map
 * brightness: the carving stands out a few centimetres.
 */
const CARVING_RELIEF = 0.028;

/* ---------- Scene ---------- */

/**
 * @param {object} options
 * @param {HTMLElement} options.mount     element that receives the canvas
 * @param {object[]} options.halls        the museum's halls ({ id, wings, centrepiece }), all built into
 *   one connected building. Each hall's wings (rooms: { title, glyph, accent }) stand clockwise
 *   round it; a wing with `passage` (a hall id) is the open corridor to that hall, which stands
 *   at the corridor's far end. `centrepiece` is 'statue' (the Thiruvalluvar statue, drawn by the
 *   overlay at the first hall's centre; clickable here), 'monolith' (the inscribed CICT
 *   monument, also clickable), a key of HALL_EXHIBITS (a 3D model on a stone pedestal,
 *   hallFigure.js — Tolkappiar, the Yaazh, …; clickable too, for its card) or 'lamp' (a
 *   great brass Nilavilakku). The visitor starts in the first hall.
 * @param {(hallId: string) => void} options.onHallChange  the visitor has glided into another hall
 * @param {(loaded: boolean) => void} options.onStatueLoaded  the statue's model has loaded (or failed)
 * @param {(labels: object[], statueBounds: object) => void} options.onFrame   per-frame screen positions of wing labels (hidden for arches behind the centrepiece), and the centrepiece's on-screen extent, for labels to keep clear of ({ visible, left, right, top, bottom, outline: [[x, y], …] })
 * @param {(index: number|null) => void} options.onHover
 * @param {(index: number) => void} options.onSelect     an arch was clicked or tapped
 * @param {(index: number) => void} options.onFocusChange  the wing most directly ahead changed
 * @param {() => void} options.onStatueSelect  the current hall's centrepiece (the statue, the monolith or a model) was clicked or tapped
 * @param {(hovered: boolean) => void} options.onStatueHover
 * @param {(now: number, camera: THREE.PerspectiveCamera) => void} options.onRender  after each frame, to sync overlays
 * @param {() => void} options.onContextLost  the GPU dropped the WebGL context (e.g. a graphics-driver reset)
 * @param {() => void} options.onContextRestored  the browser gave the context back; rendering has resumed
 * @param {boolean} options.reducedMotion
 *
 * `onFrame` receives one label per wing of the current hall followed by one for its centrepiece
 * (hidden unless that is the statue).
 */
export function createHallwayScene({
  mount, halls: hallSpecs, onHallChange, onStatueLoaded, onFrame, onHover, onSelect, onFocusChange, onStatueSelect, onStatueHover, onRender, onContextLost, onContextRestored, reducedMotion = false,
}) {
  const renderer = new THREE.WebGLRenderer({ antialias: ANTIALIAS, powerPreference: 'high-performance' });
  renderer.setPixelRatio(MAX_PIXEL_RATIO); // native, up to 2× (1.5× on touch screens; see adaptResolution)
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  const canvas = renderer.domElement;
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.touchAction = 'none';
  canvas.style.cursor = 'grab';
  canvas.setAttribute('aria-hidden', 'true');
  mount.appendChild(canvas);

  const disposables = [];
  /** Redraws of the textures that carry words (wing panels, the monolith), run when the language changes. */
  const relabels = [];
  const track = (resource) => {
    disposables.push(resource);
    return resource;
  };
  const paint = (width, height, draw, repeat) => {
    const surface = document.createElement('canvas');
    surface.width = width;
    surface.height = height;
    draw(surface.getContext('2d'), width, height);
    const texture = track(new THREE.CanvasTexture(surface));
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = anisotropyFor(renderer);
    if (repeat) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(...repeat);
    }
    return texture;
  };

  /*
   * Pictures from public/UI images. Each is loaded once and cropped (`crop` as fractions;
   * `prepare` may then edit the pixels, or redraw them), and its texture handed to every material waiting
   * for it: `glow` lights the picture from within, as if spotlit. Until it arrives a
   * surface keeps its plain colour.
   */
  let disposed = false;
  const imageLoader = new THREE.ImageLoader();
  const pictures = new Map();
  const loadPicture = ({ file, crop }, { prepare, maxSize = 2048, repeat, wrap = THREE.RepeatWrapping } = {}) => {
    const key = `${file}|${crop}|${repeat}|${wrap}`;
    if (pictures.has(key)) return pictures.get(key);
    const waiting = { texture: null, materials: [] };
    pictures.set(key, waiting);
    imageLoader.load(mediaUrl(`${UI_IMAGES_FOLDER}${file}`), (image) => {
      if (disposed) return;
      const [x, y, w, h] = crop.map((value, i) => value * (i % 2 ? image.height : image.width));
      const scale = Math.min(1, maxSize / Math.max(w, h));
      const surface = document.createElement('canvas');
      surface.width = Math.round(w * scale);
      surface.height = Math.round(h * scale);
      const ctx = surface.getContext('2d', { willReadFrequently: Boolean(prepare) });
      ctx.drawImage(image, x, y, w, h, 0, 0, surface.width, surface.height);
      // `prepare` edits the pixels in place, or returns a new canvas to use instead.
      const prepared = prepare?.(ctx, surface.width, surface.height);
      const texture = track(new THREE.CanvasTexture(prepared instanceof HTMLCanvasElement ? prepared : surface));
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = anisotropyFor(renderer);
      if (repeat) {
        texture.wrapS = texture.wrapT = wrap;
        texture.repeat.set(...repeat);
      }
      waiting.texture = texture;
      waiting.materials.forEach((apply) => apply(texture));
    }, undefined, (error) => console.warn(`Museum picture ${file} could not load:`, error));
    return waiting;
  };
  /** A material that shows `picture` once it has loaded (lit from within by `glow`, 0–1). */
  const pictureMaterial = (picture, options, { glow = 0.4, color = '#c9a679', ...extra } = {}) => {
    const material = track(new THREE.MeshStandardMaterial({ color, roughness: 0.9, dithering: true, ...extra }));
    const apply = (texture) => {
      material.color.set('#ffffff');
      material.map = texture;
      material.emissive.set('#ffffff');
      material.emissiveMap = texture;
      material.emissiveIntensity = glow;
      material.needsUpdate = true;
    };
    const waiting = loadPicture(picture, options);
    if (waiting.texture) apply(waiting.texture);
    else waiting.materials.push(apply);
    return material;
  };

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#120b06');
  // Far enough that the next hall glows softly at the end of a passage, about 40 m away.
  scene.fog = new THREE.Fog('#120b06', 26, 66);
  const pmrem = new THREE.PMREMGenerator(renderer);
  let envTarget = null;
  /** Bakes the reflection environment; rerun after a restored context, whose GPU copy is lost. */
  const bakeEnvironment = () => {
    envTarget?.dispose();
    const roomEnvironment = new RoomEnvironment();
    // Well blurred: RoomEnvironment's light panels are hard-edged rectangles, which glossy
    // surfaces (the polished floor, the glass doors) would otherwise mirror as sharp cuts of light.
    envTarget = pmrem.fromScene(roomEnvironment, 0.4);
    roomEnvironment.dispose?.();
    scene.environment = envTarget.texture;
  };
  bakeEnvironment();
  scene.environmentIntensity = 0.35;

  // A near plane of 0.25 m (nothing comes closer to the eye) keeps depth precision sharp
  // across the building, so distant surfaces never shimmer into one another.
  const camera = new THREE.PerspectiveCamera(70, 1, 0.25, 120);

  /* Materials */
  const stoneTexture = paint(512, 512, drawSandstone, [1 / 2.6, 1 / 2.6]);
  // Dithered: the lamps' long, dim falloff across dark stone would otherwise band.
  const stone = track(new THREE.MeshStandardMaterial({ map: stoneTexture, roughness: 0.88, dithering: true }));
  const darkStone = track(new THREE.MeshStandardMaterial({ map: stoneTexture, color: '#8c7458', roughness: 0.7, dithering: true }));
  const gold = track(new THREE.MeshStandardMaterial({ color: '#c99a45', metalness: 0.75, roughness: 0.28, emissive: '#3a2508', emissiveIntensity: 0.5, dithering: true }));
  // Smooth cream plaster for the niches, benches and lamp stands, as in the master rendering.
  const plaster = track(new THREE.MeshStandardMaterial({ map: stoneTexture, color: '#efdcb6', roughness: 0.8, dithering: true }));
  // The red silhouette frieze round the top of the walls (public/UI images), straightened, and
  // repeated with every other copy mirrored so its ends always meet; it glows a little, as
  // painted plaster under warm light.
  const frieze = pictureMaterial(FRIEZE_ART, { prepare: gilded(unbendFrieze), repeat: [1, 1], wrap: THREE.MirroredRepeatWrapping }, { glow: 0.22, color: '#9b3324', roughness: 0.55 });
  const hitMaterial = track(new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
  const glowMaterial = track(new THREE.SpriteMaterial({ map: paint(512, 512, drawGlow), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  const hiddenFace = track(new THREE.MeshBasicMaterial({ visible: false })); // the open ends of a passage

  /*
   * Every hall is built by buildHall() into its own group, placed and turned in the
   * building. Painted textures are costly to draw, so each is painted once and shared by
   * all the halls (`once`); every lamp in the building flickers from one list.
   */
  const sharedResources = new Map();
  const once = (key, make) => {
    if (!sharedResources.has(key)) sharedResources.set(key, make());
    return sharedResources.get(key);
  };
  /** Every passage's arch (buildArch): the wall it stands on, and its own material, for its hover glow. */
  const archSlots = [];
  /*
   * The carved arch model, fetched once and set into every passage's arch: its shafts at
   * the wall's jambs, its feet on the floor, its back against the wall. Every arch shares
   * the model's geometry and textures; the textures also light it from within (emissive),
   * as the passages' lamps would.
   */
  const loadArches = () => {
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(ARCH_MODEL.url, (gltf) => {
      if (disposed) return;
      let source = null;
      gltf.scene.updateMatrixWorld(true);
      gltf.scene.traverse((object) => { if (object.isMesh && !source) source = object; });
      if (!source) return;
      // The web copy's positions are quantized (normalized 16-bit, KHR_mesh_quantization), so
      // they could not hold metres: they are unpacked to floats before the arch is sized.
      const geometry = track(source.geometry.clone());
      const quantized = geometry.getAttribute('position');
      const positions = new Float32Array(quantized.count * 3);
      for (let i = 0; i < quantized.count; i += 1) positions.set([quantized.getX(i), quantized.getY(i), quantized.getZ(i)], i * 3);
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.applyMatrix4(source.matrixWorld);
      geometry.computeBoundingBox();
      const { min, max } = geometry.boundingBox;
      const scale = ARCH_OUTER_WIDTH / (max.x - min.x);
      geometry.translate(-(min.x + max.x) / 2, -min.y, -max.z);
      geometry.scale(scale, scale, ARCH_DEPTH / (max.z - min.z));
      geometry.translate(0, 0, ARCH_DEPTH + 0.02);
      const { map, normalMap, roughnessMap, metalnessMap } = source.material;
      [map, normalMap, roughnessMap, metalnessMap].forEach((texture) => {
        if (!texture) return;
        track(texture);
        texture.anisotropy = anisotropyFor(renderer);
      });
      for (const { group, material } of archSlots) {
        // Less metallic than the scan, so the gilt reads in the halls' soft reflections.
        Object.assign(material, { map, normalMap, roughnessMap, metalnessMap, emissiveMap: map, metalness: 0.55, roughness: 0.8 });
        material.needsUpdate = true;
        group.add(new THREE.Mesh(geometry, material));
      }
    }, undefined, (error) => {
      // The passages stay open, with their lamps, just without the carved arch.
      if (!disposed) console.warn(`Arch model unavailable (${ARCH_MODEL.url}):`, error);
    });
  };
  /** Every lamp's flames, glow and light, flickered each frame in `tick`. */
  const deepams = [];
  /*
   * Lights are described, not created, as the building is built: each a `lightSpec`
   * ({ position, color, intensity, distance, decay } in world space, and the lamp whose flame
   * it follows, if any). A fixed set of real lights (see `applyLighting`) is lent to the specs
   * that matter where the visitor stands. Every material's shader is compiled for the number
   * of lights in the scene, so switching lights on and off would recompile them all — a
   * second-long freeze on every glide between halls; moving a fixed set of lights costs nothing.
   */
  const lightSpec = (position, color, intensity, distance, decay, flicker = null) => ({ position, color: new THREE.Color(color), intensity, distance, decay, flicker });
  /** Things placed in world space rather than in a hall's group, with the halls they belong to, so they hide with them. */
  const worldParts = [];
  /** The textures of the sun's rays through the jali, drifted slowly in `tick`. */
  const sunbeams = new Set();
  /** Counts the niches built so far, so the alcove reliefs take turns round the building. */
  let alcoveTurn = 0;
  /** Adds something placed in world coordinates (not a hall's own) to the building. */
  const addToWorld = (object) => scene.add(object);

  /**
   * The Central Hall's monolith (MONOLITH), in its hall's frame: the front face looks down
   * +z, towards the visitor arriving at the entrance view, with the Director's plaque on its
   * left (−x), the Registrar's on its right (+x) and the credits on its back. Each face is
   * painted once the web fonts are ready, and the front again when the CICT emblem arrives;
   * the inscriptions glow a little (emissive), as if lamplit, so they read from the orbit.
   */
  const buildMonolith = () => {
    const { plinth, shaft, pixelsPerMetre } = MONOLITH;
    const group = new THREE.Group();
    [[plinth.width, plinth.depth, 0], [plinth.width - 0.5, plinth.depth - 0.5, plinth.step]].forEach(([width, depth, y]) => {
      const step = new THREE.Mesh(track(new THREE.BoxGeometry(width, plinth.step, depth)), darkStone);
      step.position.y = y + plinth.step / 2;
      group.add(step);
      const band = new THREE.Mesh(track(new THREE.BoxGeometry(width + 0.02, 0.05, depth + 0.02)), gold);
      band.position.y = y + plinth.step - 0.04;
      group.add(band);
    });

    const faceBy = new Map(MONUMENT.faces.map((face) => [face.id, face]));
    const granite = track(new THREE.MeshStandardMaterial({ color: '#1d1915', roughness: 0.28, metalness: 0.15, dithering: true }));
    const faces = [];
    const faceMaterial = (id, widthMetres) => {
      const face = faceBy.get(id);
      const width = Math.round(widthMetres * pixelsPerMetre);
      const height = Math.round(shaft.height * pixelsPerMetre);
      const texture = paint(width, height, (ctx, w, h) => drawMonolithFace(ctx, w, h, face));
      faces.push({ face, texture });
      return track(new THREE.MeshStandardMaterial({ map: texture, emissive: '#ffffff', emissiveMap: texture, emissiveIntensity: 0.42, roughness: 0.3, metalness: 0.1, dithering: true }));
    };
    // BoxGeometry faces: +x, −x, +y, −y, +z, −z.
    const shaftMesh = new THREE.Mesh(track(new THREE.BoxGeometry(shaft.width, shaft.height, shaft.depth)), [
      faceMaterial('right', shaft.depth), faceMaterial('left', shaft.depth), granite, granite, faceMaterial('front', shaft.width), faceMaterial('back', shaft.width),
    ]);
    shaftMesh.position.y = shaft.bottom + shaft.height / 2;
    group.add(shaftMesh);

    let emblem = null;
    const repaint = (only) => faces.forEach(({ face, texture }) => {
      if (only && face.id !== only) return;
      drawMonolithFace(texture.image.getContext('2d'), texture.image.width, texture.image.height, face, emblem);
      texture.needsUpdate = true;
    });
    document.fonts?.ready.then(() => { if (!disposed) repaint(); });
    relabels.push(() => repaint());
    imageLoader.load(CICT_LOGO, (image) => {
      if (disposed) return;
      emblem = image;
      repaint('front');
    }, undefined, (error) => console.warn('The CICT emblem could not load:', error));

    // The capstone, a gilt band under it, and a gilt pyramidion.
    const capY = shaft.bottom + shaft.height;
    const band = new THREE.Mesh(track(new THREE.BoxGeometry(shaft.width + 0.08, 0.08, shaft.depth + 0.08)), gold);
    band.position.y = capY + 0.04;
    group.add(band);
    const cap = new THREE.Mesh(track(new THREE.BoxGeometry(shaft.width + 0.3, 0.22, shaft.depth + 0.3)), darkStone);
    cap.position.y = capY + 0.08 + 0.11;
    group.add(cap);
    const pyramidHeight = MONOLITH.top - (capY + 0.3);
    // A four-sided cone turned square to the shaft, then narrowed to its depth.
    const pyramidGeometry = track(new THREE.ConeGeometry((shaft.width / 2) * Math.SQRT2 * 0.92, pyramidHeight, 4));
    pyramidGeometry.rotateY(Math.PI / 4);
    const pyramid = new THREE.Mesh(pyramidGeometry, gold);
    pyramid.scale.z = shaft.depth / shaft.width;
    pyramid.position.y = capY + 0.3 + pyramidHeight / 2;
    group.add(pyramid);
    return group;
  };

  /**
   * Builds one hall at `origin`, turned by `yaw` about the vertical, and returns what the
   * camera, picking and lighting need. `corridors` holds the indices of the passages this
   * hall builds (each passage is built once, by one of its two halls; see the layout below).
   */
  const buildHall = (spec, { origin, yaw, corridors }) => {
    const { id, wings, centrepiece } = spec;
    /** This hall's centre-to-wall distance (the ring halls are larger than the hub; see hallLayout.js). */
    const apothem = hallApothem(spec);
    const hasStatue = centrepiece === 'statue';
    const hasMonolith = centrepiece === 'monolith';
    /** The model on the podium, if this hall has one ({ url, height }; data/hallExhibits.js). */
    const exhibit = HALL_EXHIBITS[centrepiece] ?? null;
    const figureModel = exhibit?.model ?? null;
    let figure = null;
    /**
     * A centrepiece the visitor chooses by clicking it (the statue, or the monolith to read).
     * A model is not clicked itself: its name board beside the podium opens its card.
     */
    const featured = hasStatue || hasMonolith;
    /** The pillar lamps' halos, drawn over the stone (no depth test): shown only while in this hall. */
    const pillarGlows = [];
    /** The lights this hall asks for (lightSpec): the daylight under its dome, and its great lamp's, if it has one. */
    const centreLights = [];
    let spotLight = null;
    const hallGroup = new THREE.Group();
    hallGroup.position.copy(origin);
    hallGroup.rotation.y = yaw;
    scene.add(hallGroup);
    hallGroup.updateMatrixWorld(true);

    /* Shared geometry */
    const sides = wings.length;
    const wallWidth = 2 * apothem * Math.tan(Math.PI / sides) + 0.05;
    const wallShape = new THREE.Shape();
    wallShape.moveTo(-wallWidth / 2, 0);
    wallShape.lineTo(-ARCH_WIDTH / 2, 0);
    wallShape.lineTo(-ARCH_WIDTH / 2, SPRING_HEIGHT);
    wallShape.absarc(0, SPRING_HEIGHT, ARCH_WIDTH / 2, Math.PI, 0, true);
    wallShape.lineTo(ARCH_WIDTH / 2, 0);
    wallShape.lineTo(wallWidth / 2, 0);
    wallShape.lineTo(wallWidth / 2, WALL_HEIGHT);
    wallShape.lineTo(-wallWidth / 2, WALL_HEIGHT);
    wallShape.closePath();
    const wallGeometry = track(new THREE.ExtrudeGeometry(wallShape, { depth: WALL_DEPTH, bevelEnabled: false, curveSegments: 32 }));
    wallGeometry.translate(0, 0, -WALL_DEPTH);

    const corridorWidth = ARCH_WIDTH + 1.6;
    const corridorHeight = ARCH_HEIGHT + 1.2;
    const passageGeometry = track(new THREE.BoxGeometry(corridorWidth, corridorHeight, PASSAGE_DEPTH));
    const passageRunnerGeometry = track(new THREE.PlaneGeometry(ARCH_WIDTH * 0.55, PASSAGE_DEPTH + 4));
    // A display wall is solid: the wall's outline without the arch.
    const solidWallShape = new THREE.Shape();
    solidWallShape.moveTo(-wallWidth / 2, 0);
    solidWallShape.lineTo(wallWidth / 2, 0);
    solidWallShape.lineTo(wallWidth / 2, WALL_HEIGHT);
    solidWallShape.lineTo(-wallWidth / 2, WALL_HEIGHT);
    solidWallShape.closePath();
    const solidWallGeometry = track(new THREE.ExtrudeGeometry(solidWallShape, { depth: WALL_DEPTH, bevelEnabled: false }));
    solidWallGeometry.translate(0, 0, -WALL_DEPTH);
    // Its niche fills the wall between the corner columns, leaving room for a lamp either side.
    const displayWidth = Math.min(DISPLAY_MAX_WIDTH, wallWidth - 2.6);
    // A room's doorway, with its surround, takes clicks.
    const roomHitGeometry = once('roomHit', () => track(new THREE.PlaneGeometry(ROOM_DOOR.width + 2 * ROOM_DOOR.surround + 0.6, ROOM_DOOR.height + ROOM_DOOR.surround + 0.4)));
    /** Where the standing lamps go (world positions) — at the toranas' feet and along the passages — with the halls they belong to. */
    const passageLamps = [];
    const hitGeometry = track(new THREE.PlaneGeometry(ARCH_WIDTH + 0.6, ARCH_HEIGHT + 0.4));
    const friezeGeometry = track(new THREE.PlaneGeometry(wallWidth, FRIEZE_HEIGHT));
    const plinthGeometry = track(new THREE.BoxGeometry(wallWidth, 0.35, 0.3));
    // Whole copies of the frieze along the wall, at the straightened art's proportions.
    const { top: friezeTop, bottom: friezeBottom, size: friezeSize } = FRIEZE_ART;
    const friezeTile = FRIEZE_HEIGHT * (friezeSize[0] / (friezeBottom.middle - friezeTop.middle));
    const friezeUvs = friezeGeometry.getAttribute('uv');
    for (let i = 0; i < friezeUvs.count; i += 1) friezeUvs.setX(i, friezeUvs.getX(i) * Math.max(1, Math.round(wallWidth / friezeTile)));

    /*
     * The kapota: the deep, curved cornice of Dravidian temples, projecting over the frieze
     * and throwing it into shadow. Profile is (out from the wall, up); it runs the wall's width.
     */
    const kapotaShape = new THREE.Shape();
    kapotaShape.moveTo(0, 0);
    kapotaShape.lineTo(0.12, 0);
    kapotaShape.lineTo(0.12, 0.06);
    kapotaShape.quadraticCurveTo(0.42, 0.08, 0.48, 0.34);
    kapotaShape.lineTo(0.48, 0.42);
    kapotaShape.lineTo(0, 0.42);
    kapotaShape.closePath();
    const kapotaGeometry = track(new THREE.ExtrudeGeometry(kapotaShape, { depth: wallWidth, bevelEnabled: false, curveSegments: 12 }));
    kapotaGeometry.translate(0, 0, -wallWidth / 2);
    kapotaGeometry.rotateY(-Math.PI / 2); // profile → (z out of the wall, y); extrusion → along the wall (x)
    const stringCourseGeometry = track(new THREE.BoxGeometry(wallWidth, 0.1, 0.16));

    /* Devakoshta niches either side of a passage's arch, on a wall broad enough for them. */
    const sideStart = ARCH_OUTER_WIDTH / 2 + 1.1; // just clear of the arch's pillar and its lamp
    const sideSpan = wallWidth / 2 - 0.95 - sideStart; // to the corner column
    // Shaped to the alcove reliefs (about 2 : 3), which they frame.
    // A hall of many sides has narrow walls; where the arch leaves no room, the niches are left out.
    const hasNiches = sideSpan - 0.6 > 0.25;
    const NICHE_WIDTH = Math.max(0.3, Math.min(1.5, sideSpan - 0.6)); // kept positive: the shared niche shapes are built regardless
    const NICHE_X = sideStart + sideSpan / 2;
    /*
     * A niche, after the temple devakoshta: a picture (a gilded relief) between
     * pilasters under a lintel, with a sill below and a stone bench before it, crowned by a
     * cusped (multifoil) arch band round a softly glowing recess that holds a little brass
     * downlight; a warm wash rises up the picture from its foot. Its height is 1.45 times its
     * width (the reliefs' proportions). The kit for each width is built once, for every hall.
     */
    const nicheKit = (width) => once(`niche-${width.toFixed(3)}`, () => {
      const height = width * NICHE_PROPORTION;
      const outer = width / 2 + 0.22;
      const inner = outer - 0.2;
      const lobes = 7;
      const shape = new THREE.Shape();
      shape.moveTo(outer, 0);
      shape.absarc(0, 0, outer, 0, Math.PI, false);
      shape.lineTo(-inner, 0);
      // The inner edge: a run of small cusps from left to right.
      for (let i = 0; i < lobes; i += 1) {
        const a0 = Math.PI - (i / lobes) * Math.PI;
        const a1 = Math.PI - ((i + 1) / lobes) * Math.PI;
        const mid = (a0 + a1) / 2;
        const cusp = inner - 0.09;
        shape.quadraticCurveTo(Math.cos(mid) * cusp, Math.sin(mid) * cusp, Math.cos(a1) * inner, Math.sin(a1) * inner);
      }
      shape.closePath();
      const crown = track(new THREE.ExtrudeGeometry(shape, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2, curveSegments: 24 }));
      const recess = track(new THREE.CircleGeometry(inner - 0.04, 40, 0, Math.PI));
      const recessMaterial = once('nicheRecess', () => {
        const recessMap = paint(256, 256, (ctx, w, h) => {
          const gradient = ctx.createRadialGradient(w / 2, h * 0.25, 0, w / 2, h * 0.25, w * 0.7);
          gradient.addColorStop(0, '#f3c27a');
          gradient.addColorStop(0.45, '#a8642c');
          gradient.addColorStop(1, '#4a2410');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, w, h);
        }, [1, 1]);
        return track(new THREE.MeshStandardMaterial({ map: recessMap, emissive: '#ffffff', emissiveMap: recessMap, emissiveIntensity: 0.55, roughness: 0.9, dithering: true }));
      });
      const uplightPlane = track(new THREE.PlaneGeometry(width, Math.min(1.6, height * 0.45)));
      uplightPlane.rotateZ(Math.PI); // bright at the foot of the picture
      const uplight = once('nicheUplight', () => track(new THREE.MeshBasicMaterial({ map: once('wash', () => paint(4, 512, drawWash)), color: '#ffb866', transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, dithering: true })));
      return {
        width,
        height,
        crown,
        recess,
        recessMaterial,
        innerRadius: inner,
        downlight: once('nicheDownlight', () => track(new THREE.CylinderGeometry(0.02, 0.11, 0.12, 20))),
        uplightPlane,
        uplight,
        picture: track(new THREE.PlaneGeometry(width, height)),
        pilaster: track(new THREE.BoxGeometry(0.14, height + 0.1, 0.12)),
        lintel: track(new THREE.BoxGeometry(width + 0.44, 0.16, 0.22)),
        sill: track(new THREE.BoxGeometry(width + 0.34, 0.14, 0.18)),
        seat: track(new THREE.BoxGeometry(width + 0.2, 0.08, 0.5)),
        leg: once('benchLeg', () => track(new THREE.BoxGeometry(0.12, 0.38, 0.42))),
      };
    });
    /**
     * Sets a niche of `width` into the wall `group` at `x`, its picture `bottom` metres up
     * and showing `material`; returns the height of the top of its crown.
     */
    const addNiche = (group, x, width, material, bottom = 1.0) => {
      const kit = nicheKit(width);
      const middle = bottom + kit.height / 2;
      const picture = new THREE.Mesh(kit.picture, material);
      picture.position.set(x, middle, 0.012);
      group.add(picture);
      const crownBase = middle + kit.height / 2 + 0.21;
      const crown = new THREE.Mesh(kit.crown, plaster);
      crown.position.set(x, crownBase, 0.02);
      group.add(crown);
      const recess = new THREE.Mesh(kit.recess, kit.recessMaterial);
      recess.position.set(x, crownBase, 0.015);
      group.add(recess);
      const lamp = new THREE.Mesh(kit.downlight, gold);
      lamp.position.set(x, crownBase + kit.innerRadius - 0.1, 0.16);
      group.add(lamp);
      const lampGlow = new THREE.Sprite(glowMaterial);
      lampGlow.scale.setScalar(0.55 * Math.max(1, width / 1.5));
      lampGlow.position.set(x, crownBase + kit.innerRadius - 0.2, 0.2);
      group.add(lampGlow);
      const uplight = new THREE.Mesh(kit.uplightPlane, kit.uplight);
      uplight.position.set(x, bottom + kit.uplightPlane.parameters.height / 2, 0.03);
      group.add(uplight);
      for (const edge of [-1, 1]) {
        const pilaster = new THREE.Mesh(kit.pilaster, plaster);
        pilaster.position.set(x + edge * (width / 2 + 0.07), middle, 0.06);
        group.add(pilaster);
      }
      const lintel = new THREE.Mesh(kit.lintel, plaster);
      lintel.position.set(x, middle + kit.height / 2 + 0.13, 0.11);
      group.add(lintel);
      const sill = new THREE.Mesh(kit.sill, plaster);
      sill.position.set(x, bottom - 0.07, 0.09);
      group.add(sill);
      // A stone bench before it.
      const seat = new THREE.Mesh(kit.seat, plaster);
      seat.position.set(x, 0.42, 0.62);
      group.add(seat);
      for (const edge of [-1, 1]) {
        const leg = new THREE.Mesh(kit.leg, plaster);
        leg.position.set(x + edge * (width / 2 - 0.1), 0.19, 0.62);
        group.add(leg);
      }
      return crownBase + kit.innerRadius + 0.22;
    };
    /*
     * A room's doorway: double glass doors in gilt frames under a round arch, set back in a
     * deep stone surround that stands out from the wall, on a stone threshold, with a gilt
     * band round the arch. Through the glass shows the room's cover — its painted panel,
     * the Tamil emblem word over its name (drawWingPanel), and nothing else. The frames, the
     * handles and the band are the wing's trim, which glows on hover. Shapes are shared by
     * every door; each room paints its own cover.
     */
    const doorKit = once('roomDoor', () => {
      const { width, height, surround, depth } = ROOM_DOOR;
      const r = width / 2;
      const spring = height - r;
      const arch = (radius, path = new THREE.Shape()) => {
        path.moveTo(-radius, 0);
        path.lineTo(-radius, spring);
        path.absarc(0, spring, radius, Math.PI, 0, true);
        path.lineTo(radius, 0);
        path.closePath();
        return path;
      };
      // UVs spanning the doorway, so a painting fits the arch.
      const spanUvs = (geometry) => {
        const uv = geometry.getAttribute('uv');
        const position = geometry.getAttribute('position');
        for (let i = 0; i < uv.count; i += 1) uv.setXY(i, position.getX(i) / width + 0.5, position.getY(i) / height);
        return geometry;
      };
      const ring = arch(r + surround);
      ring.holes.push(arch(r, new THREE.Path()));
      // Each glass leaf is half the arch: the left one from its jamb round to the crown, the right one mirrored.
      const leaf = new THREE.Shape();
      leaf.moveTo(-r, 0);
      leaf.lineTo(-r, spring);
      leaf.absarc(0, spring, r, Math.PI, Math.PI / 2, true);
      leaf.lineTo(0, 0);
      leaf.closePath();
      const leftLeaf = track(new THREE.ShapeGeometry(leaf, 24));
      const rightLeaf = track(new THREE.ShapeGeometry(leaf, 24));
      rightLeaf.scale(-1, 1, 1);
      return {
        spring,
        surroundGeometry: track(new THREE.ExtrudeGeometry(ring, { depth, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2, curveSegments: 32 })),
        coverGeometry: track(spanUvs(new THREE.ShapeGeometry(arch(r), 32))),
        leaves: [leftLeaf, rightLeaf],
        glass: track(new THREE.MeshPhysicalMaterial({ color: '#e4f4ff', transparent: true, opacity: 0.1, roughness: 0.04, metalness: 0, envMapIntensity: 0.6, depthWrite: false, side: THREE.DoubleSide })),
        // The frames: each leaf's outer stile, one slim meeting stile at the middle (so it hides little of the cover), and a rail across both.
        stile: track(new THREE.BoxGeometry(0.07, spring, 0.06)),
        meetingStile: track(new THREE.BoxGeometry(0.03, spring, 0.05)),
        rail: track(new THREE.BoxGeometry(width, 0.06, 0.06)),
        handle: track(new THREE.CylinderGeometry(0.03, 0.03, 0.7, 10)),
        bandGeometry: track(new THREE.TorusGeometry(r + surround + 0.04, 0.05, 10, 48, Math.PI)),
        crownFrame: track(new THREE.TorusGeometry(r - 0.03, 0.035, 8, 48, Math.PI)),
        thresholdGeometry: track(new THREE.BoxGeometry(width + 2 * surround + 0.2, 0.12, 0.6)),
      };
    });
    const buildRoomDoor = (group, trim, room) => {
      const kit = doorKit;
      const { width } = ROOM_DOOR;
      const coverTexture = paint(512, Math.round(512 * (ROOM_DOOR.height / width)), (ctx, w, h) => drawWingPanel(ctx, w, h, room));
      relabels.push(() => {
        drawWingPanel(coverTexture.image.getContext('2d'), coverTexture.image.width, coverTexture.image.height, room);
        coverTexture.needsUpdate = true;
      });
      const cover = new THREE.Mesh(kit.coverGeometry, track(new THREE.MeshBasicMaterial({ map: coverTexture, toneMapped: false })));
      cover.position.z = 0.01; // set back in the surround, behind the glass: the doorway's depth
      group.add(cover);
      group.add(new THREE.Mesh(kit.surroundGeometry, plaster)); // from the wall's face outwards
      const glassZ = 0.11;
      for (const leafGeometry of kit.leaves) {
        const leaf = new THREE.Mesh(leafGeometry, kit.glass);
        leaf.position.z = glassZ;
        group.add(leaf);
      }
      for (const x of [-width / 2 + 0.035, 0, width / 2 - 0.035]) {
        const stile = new THREE.Mesh(x ? kit.stile : kit.meetingStile, trim);
        stile.position.set(x, kit.spring / 2, glassZ);
        group.add(stile);
      }
      const rail = new THREE.Mesh(kit.rail, trim);
      rail.position.set(0, 0.03, glassZ);
      group.add(rail);
      const crown = new THREE.Mesh(kit.crownFrame, trim);
      crown.position.set(0, kit.spring, glassZ);
      group.add(crown);
      for (const side of [-1, 1]) {
        const handle = new THREE.Mesh(kit.handle, trim);
        handle.position.set(side * 0.16, 1.0, glassZ + 0.07);
        group.add(handle);
      }
      const band = new THREE.Mesh(kit.bandGeometry, trim);
      band.position.set(0, kit.spring, ROOM_DOOR.depth + 0.03);
      group.add(band);
      const threshold = new THREE.Mesh(kit.thresholdGeometry, darkStone);
      threshold.position.set(0, 0.06, 0.3);
      group.add(threshold);
      return ROOM_DOOR.height + ROOM_DOOR.surround;
    };    /*
     * A passage's arch: the carved red-and-gold arch (ARCH_MODEL) standing against the wall
     * round the opening, and a brass standing lamp at each side. The model arrives once for
     * the whole building (loadArches); until then the arch is just its material, which is
     * the wing's trim and glows on hover. The opening itself is clear, so the next hall
     * shows down the passage.
     */
    const buildArch = (group) => {
      const material = track(new THREE.MeshStandardMaterial({ emissive: '#8a5420', emissiveIntensity: 0.5, side: THREE.DoubleSide, dithering: true }));
      archSlots.push({ group, material });
      for (const side of [-1, 1]) {
        passageLamps.push({ position: group.localToWorld(new THREE.Vector3(side * (ARCH_OUTER_WIDTH / 2 + 0.5), 0, 0.85)), halls: [id] });
      }
      return material;
    };
    /** The banners hang from under the frieze; one size for every hall. */
    const BANNER_HEIGHT = 2.2;
    const bannerGeometry = once('banner', () => track(new THREE.PlaneGeometry(BANNER_HEIGHT / 2.5, BANNER_HEIGHT))); // the banner images' proportions
    /** A red silk banner (public/UI images) hung on the wall `group` at `x`, from just under the frieze. */
    const addBanner = (group, x, turn) => {
      const bannerIndex = turn % BANNERS.length;
      const banner = new THREE.Mesh(bannerGeometry, once(`banner-${bannerIndex}`, () => pictureMaterial(BANNERS[bannerIndex], { prepare: gilded(keyOutWhite), maxSize: 1024 }, { glow: 0.16, alphaTest: 0.5, side: THREE.DoubleSide })));
      banner.position.set(x, FRIEZE_BOTTOM - 0.12 - BANNER_HEIGHT / 2, 0.07);
      group.add(banner);
    };

    /* Wings */
    const step = TAU / sides;
    const hitTargets = [];
    const anchors = [];
    const trims = [];
    wings.forEach((wing, index) => {
      const angle = index * step;
      const group = new THREE.Group();
      group.position.set(Math.sin(angle) * apothem, 0, -Math.cos(angle) * apothem);
      group.rotation.y = -angle;
      hallGroup.add(group);
      group.updateMatrixWorld(true); // for the lamps and labels placed from it

      // Only a passage's wall is pierced by an arch; every other wall is solid, for its niche.
      group.add(new THREE.Mesh(wing.passage ? wallGeometry : solidWallGeometry, stone));

      const friezeMesh = new THREE.Mesh(friezeGeometry, frieze);
      friezeMesh.position.set(0, FRIEZE_BOTTOM + FRIEZE_HEIGHT / 2, 0.01);
      group.add(friezeMesh);
      const kapota = new THREE.Mesh(kapotaGeometry, darkStone);
      kapota.position.y = WALL_HEIGHT - 0.42;
      group.add(kapota);
      const stringCourse = new THREE.Mesh(stringCourseGeometry, gold);
      stringCourse.position.set(0, FRIEZE_BOTTOM - 0.05, 0.06);
      group.add(stringCourse);

      // Beside a passage's arch, where the wall is wide enough (the hub's): a niche with a relief either side, and a banner between.
      for (const side of hasNiches && wing.passage ? [-1, 1] : []) {
        addBanner(group, side * (sideStart + 0.3), index * 2 + (side > 0 ? 1 : 0));
        const reliefIndex = alcoveTurn % ALCOVE_RELIEFS.length;
        alcoveTurn += 1;
        addNiche(group, side * NICHE_X, NICHE_WIDTH, once(`alcove-${reliefIndex}`, () => pictureMaterial(ALCOVE_RELIEFS[reliefIndex], { prepare: gilded(null, { all: true }) }, { glow: 0.42, roughness: 0.55 })));
      }
      const plinth = new THREE.Mesh(plinthGeometry, darkStone);
      plinth.position.set(0, 0.175, 0.15);
      group.add(plinth);

      // Each wing gets its own gilt trim, which glows on hover; a passage's is its carved arch.
      const trim = wing.passage ? buildArch(group) : track(gold.clone());
      trims.push(trim);

      /*
       * A wall with no room (`alcove`): a large niche in the solid wall, after the master
       * rendering, holding a gilded bas-relief from public/UI images over a stone bench —
       * only to look at, with no label and nothing to click.
       *
       * A room's wall: its double glass doors (buildRoomDoor), with the room's cover behind
       * them, between brass standing lamps. The doorway is chosen like an arch: the visitor
       * walks up to the doors and the room opens.
       */
      if (!wing.passage) {
        if (wing.alcove) {
          const reliefIndex = alcoveTurn % ALCOVE_RELIEFS.length;
          alcoveTurn += 1;
          const relief = once(`alcove-${reliefIndex}`, () => pictureMaterial(ALCOVE_RELIEFS[reliefIndex], { prepare: gilded(null, { all: true }) }, { glow: 0.42, roughness: 0.55 }));
          const top = addNiche(group, 0, displayWidth, relief, DISPLAY_BOTTOM);
          anchors.push(group.localToWorld(new THREE.Vector3(0, top + 0.5, 0.4))); // kept so labels stay one per wing, but never shown
          return;
        }
        const top = buildRoomDoor(group, trim, wing);
        for (const side of [-1, 1]) {
          passageLamps.push({ position: group.localToWorld(new THREE.Vector3(side * (ROOM_DOOR.width / 2 + ROOM_DOOR.surround + 0.55), 0, 0.75)), halls: [id] });
        }
        anchors.push(group.localToWorld(new THREE.Vector3(0, top + 0.5, 0.4)));
        const hit = new THREE.Mesh(roomHitGeometry, hitMaterial);
        hit.position.set(0, roomHitGeometry.parameters.height / 2, 0.45);
        hit.userData.wingIndex = index;
        group.add(hit);
        hitTargets.push(hit);
        return;
      }
      /*
       * A passage to another hall: an open stone corridor, lined with standing lamps and open
       * at both ends, running straight to the arch of the hall beyond — built by one of the
       * two halls only (`corridors`); the other has just its arch.
       */
      const ownsPassage = corridors.has(index);
      const accent = new THREE.Color(wing.accent ?? '#6e1f1a');
      if (ownsPassage) {
        // Lit from within (emissive), as if by the passage's lamps: real lights here would cost every pixel.
        const corridorMaterial = track(new THREE.MeshStandardMaterial({
          color: accent.clone().lerp(new THREE.Color('#c9a46a'), 0.45),
          map: stoneTexture,
          emissive: new THREE.Color('#ffb866'),
          emissiveMap: stoneTexture,
          emissiveIntensity: 0.22,
          roughness: 0.9,
          side: THREE.BackSide,
        }));
        // BoxGeometry faces: +x, −x, +y, −y, +z, −z. A passage leaves both ends (±z) open.
        const corridor = new THREE.Mesh(passageGeometry, [corridorMaterial, corridorMaterial, corridorMaterial, corridorMaterial, hiddenFace, hiddenFace]);
        corridor.position.set(0, corridorHeight / 2, -WALL_DEPTH - PASSAGE_DEPTH / 2 + 0.01);
        group.add(corridor);
        // Its runner carpets the whole corridor, from just inside this hall to the arch beyond.
        const runner = new THREE.Mesh(passageRunnerGeometry, track(new THREE.MeshStandardMaterial({ color: accent.clone().lerp(new THREE.Color('#000000'), 0.25), roughness: 0.95 })));
        runner.rotation.x = -Math.PI / 2;
        runner.position.set(0, 0.012, -(PASSAGE_DEPTH + 4) / 2 + 3.2);
        group.add(runner);
      }
      // Passages are lit by their standing lamps instead (fewer lights keep the building fast).

      const hit = new THREE.Mesh(hitGeometry, hitMaterial);
      hit.position.set(0, (ARCH_HEIGHT + 0.4) / 2, 0.3);
      hit.userData.wingIndex = index;
      group.add(hit);
      hitTargets.push(hit);

      group.updateMatrixWorld(true);
      anchors.push(group.localToWorld(new THREE.Vector3(0, ARCH_TOP + 0.3, 0.4)));
      if (ownsPassage) {
        for (const d of PASSAGE_LAMPS) {
          for (const side of [-1, 1]) {
            passageLamps.push({
              position: group.localToWorld(new THREE.Vector3(side * (corridorWidth / 2 - 0.55), 0, -WALL_DEPTH - d)),
              halls: [id, wing.passage],
            });
          }
        }
      }
    });

    /*
     * The statue itself is drawn by the React Three Fiber overlay; this invisible column
     * makes it clickable and stops taps on it from falling through to an arch behind. The
     * monolith is chosen the same way; round the great lamp the column only stops taps.
     */
    const columnHeight = hasMonolith ? MONOLITH.top : figureModel ? figureTop(figureModel) : STATUE_HEIGHT;
    const statueHit = new THREE.Mesh(track(new THREE.CylinderGeometry(STATUE_RADIUS, STATUE_RADIUS, columnHeight, 16)), hitMaterial);
    statueHit.position.y = columnHeight / 2;
    statueHit.userData.statue = featured;
    hallGroup.add(statueHit);
    hitTargets.push(statueHit);
    anchors.push(hallGroup.localToWorld(new THREE.Vector3(0, hasMonolith ? MONOLITH.top + 0.2 : columnHeight + 0.35, 0)));
    if (hasMonolith) hallGroup.add(buildMonolith());

    /* Corner pillars, each with a brass Nilavilakku on a carved bracket */
    const cornerRadius = apothem / Math.cos(Math.PI / sides);
    const columnGeometry = track(new THREE.CylinderGeometry(0.5, 0.6, CEILING_Y, 28)); // rising to carry the ceiling
    const bandGeometry = track(new THREE.CylinderGeometry(0.66, 0.66, 0.25, 28));

    const brass = once('brass', () => track(new THREE.MeshStandardMaterial({ color: '#d4a24c', metalness: 0.9, roughness: 0.3, emissive: '#4a2c08', emissiveIntensity: 0.35, dithering: true })));
    const nilavilakkuGeometry = once('nilavilakku', () => track(new THREE.LatheGeometry(NILAVILAKKU_PROFILE.map(([r, y]) => new THREE.Vector2(r, y)), 32)));
    const flameMaterial = once('flame', () => track(new THREE.SpriteMaterial({ map: paint(64, 128, drawFlame), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, toneMapped: false })));
    // The halo is wider than the lamp's gap to the pillar; without depth testing it lies
    // softly over the stone instead of being sliced off where it meets it. (From inside the
    // hall nothing stands between the visitor and an inward-facing lamp; seen from another
    // hall, the pillar lamps are too far off for a stray halo to matter.)
    const deepamGlowMaterial = once('deepamGlow', () => track(new THREE.SpriteMaterial({ map: glowMaterial.map, color: '#ffb35c', blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false, transparent: true, opacity: 0.7 })));
    const SHELF_HEIGHT = 2.75;
    const LAMP_REACH = 0.88 * (1 - 0.45 / cornerRadius); // lamp centre to pillar axis, clear of the gilt band
    const pillarFace = LAMP_REACH - (0.6 - 0.1 * (SHELF_HEIGHT / CEILING_Y)); // the tapering pillar's surface, from the lamp

    /*
     * The mount, in the lamp's frame (+z towards the pillar): a carved teak pothigai — the
     * stepped Dravidian corbel of temple pillars — with a gilt-brass lotus bud hanging from
     * its tip, a teak abacus slab on top, and a brass thattu (tray) the lamp stands on.
     * Two brass collars clasp the pillar at the slab and under the corbel.
     */
    const teak = track(new THREE.MeshStandardMaterial({ color: '#5b2f16', roughness: 0.55, metalness: 0.05, emissive: '#1a0a03', emissiveIntensity: 0.4, dithering: true }));
    const TRAY_HEIGHT = 0.035;
    const corbelShape = new THREE.Shape();
    // Side profile: x runs out from the pillar face, y down from the slab; tiers step back to the pillar.
    [[0.6, -0.07], [0.6, -0.14], [0.52, -0.14], [0.52, -0.21], [0.42, -0.21], [0.42, -0.28], [0.32, -0.28], [0.32, -0.36], [0.22, -0.36], [0.22, -0.45], [0.1, -0.45], [0.1, -0.55], [-0.12, -0.55], [-0.12, -0.07]]
      .forEach(([u, v], i) => (i === 0 ? corbelShape.moveTo(u, v) : corbelShape.lineTo(u, v)));
    corbelShape.closePath();
    const corbelGeometry = track(new THREE.ExtrudeGeometry(corbelShape, { depth: 0.36, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 2 }));
    corbelGeometry.translate(0, -TRAY_HEIGHT, -0.18);
    corbelGeometry.rotateY(Math.PI / 2); // profile x → outward (−z); extrusion → across the pillar (x)
    corbelGeometry.translate(0, 0, pillarFace);
    const slabGeometry = track(new THREE.BoxGeometry(0.46, 0.07, 0.82));
    const slabTrimGeometry = track(new THREE.BoxGeometry(0.48, 0.02, 0.84));
    const trayGeometry = track(new THREE.CylinderGeometry(0.22, 0.19, TRAY_HEIGHT, 32));
    const trayRimGeometry = track(new THREE.TorusGeometry(0.215, 0.012, 8, 40));
    const budGeometry = track(new THREE.LatheGeometry([[0, 0], [0.02, 0.01], [0.045, 0.05], [0.04, 0.09], [0.015, 0.12], [0.012, 0.15], [0, 0.15]].map(([r, y]) => new THREE.Vector2(r, y)), 20));
    const collarGeometry = track(new THREE.CylinderGeometry(0.6, 0.6, 0.07, 32));
    // A soft contact shadow where the lamp's foot rests on the tray.
    const contactShadow = track(new THREE.MeshBasicMaterial({
      map: paint(64, 64, (ctx, w) => {
        const g = ctx.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
        g.addColorStop(0, 'rgba(0,0,0,0.75)');
        g.addColorStop(0.6, 'rgba(0,0,0,0.35)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, w);
      }),
      transparent: true,
      depthWrite: false,
    }));
    const contactShadowGeometry = track(new THREE.CircleGeometry(0.21, 24));

    for (let i = 0; i < sides; i += 1) {
      // A large hall (more than ten sides) has a column at every other corner, and beside each passage, so its walls read as one sweep.
      const besidePassage = wings[i].passage || wings[(i + 1) % sides].passage;
      if (sides > 10 && i % 2 && !besidePassage) {
        // In its place, a red banner hung at the corner between the two walls, as in the master rendering.
        const corner = new THREE.Group();
        const at = i * step + step / 2;
        corner.position.set(Math.sin(at) * (cornerRadius - 0.35), 0, -Math.cos(at) * (cornerRadius - 0.35));
        corner.rotation.y = -at;
        hallGroup.add(corner);
        addBanner(corner, 0, i);
        continue;
      }
      const angle = i * step + step / 2;
      const x = Math.sin(angle) * (cornerRadius - 0.45);
      const z = -Math.cos(angle) * (cornerRadius - 0.45);
      const column = new THREE.Mesh(columnGeometry, darkStone);
      column.position.set(x, CEILING_Y / 2, z);
      hallGroup.add(column);
      for (const y of [0.15, 3.2, WALL_HEIGHT - 0.15, CEILING_Y - 0.15]) {
        const band = new THREE.Mesh(bandGeometry, gold);
        band.position.set(x, y, z);
        hallGroup.add(band);
      }

      // Brass collars clasping the pillar at the mount.
      for (const y of [SHELF_HEIGHT - TRAY_HEIGHT - 0.035, SHELF_HEIGHT - TRAY_HEIGHT - 0.58]) {
        const collar = new THREE.Mesh(collarGeometry, brass);
        collar.position.set(x, y, z);
        hallGroup.add(collar);
      }

      // The lamp stands on its corbel on the pillar's inner face, looking into the hall.
      const deepam = new THREE.Group();
      deepam.position.set(x * (1 - LAMP_REACH / (cornerRadius - 0.45)), SHELF_HEIGHT, z * (1 - LAMP_REACH / (cornerRadius - 0.45)));
      hallGroup.add(deepam);
      deepam.lookAt(hallGroup.localToWorld(new THREE.Vector3(x, SHELF_HEIGHT, z))); // lookAt takes a world point
      deepam.add(new THREE.Mesh(corbelGeometry, teak));
      const slab = new THREE.Mesh(slabGeometry, teak);
      slab.position.set(0, -TRAY_HEIGHT - 0.035, pillarFace + 0.1 - 0.41);
      deepam.add(slab);
      const slabTrim = new THREE.Mesh(slabTrimGeometry, brass);
      slabTrim.position.set(0, -TRAY_HEIGHT - 0.075, slab.position.z);
      deepam.add(slabTrim);
      const bud = new THREE.Mesh(budGeometry, brass);
      bud.rotation.x = Math.PI; // hangs point-down from the corbel's front tier
      bud.position.set(0, -TRAY_HEIGHT - 0.14, pillarFace - 0.56);
      deepam.add(bud);
      const tray = new THREE.Mesh(trayGeometry, brass);
      tray.position.y = -TRAY_HEIGHT / 2;
      deepam.add(tray);
      const trayRim = new THREE.Mesh(trayRimGeometry, brass);
      trayRim.rotation.x = Math.PI / 2;
      deepam.add(trayRim);
      const shadow = new THREE.Mesh(contactShadowGeometry, contactShadow);
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = 0.002;
      deepam.add(shadow);
      deepam.add(new THREE.Mesh(nilavilakkuGeometry, brass));

      // Five wicks round the rim, each with its own flame.
      const flames = [];
      for (let w = 0; w < DEEPAM_WICKS; w += 1) {
        const a = (w / DEEPAM_WICKS) * TAU + Math.PI; // one wick faces straight into the hall
        const flame = new THREE.Sprite(flameMaterial);
        flame.center.set(0.5, 0.08);
        flame.position.set(Math.sin(a) * NILAVILAKKU_RIM.radius, NILAVILAKKU_RIM.height, Math.cos(a) * NILAVILAKKU_RIM.radius);
        flame.scale.set(0.07, 0.16, 1);
        deepam.add(flame);
        flames.push(flame);
      }
      const glow = new THREE.Sprite(deepamGlowMaterial);
      glow.position.y = NILAVILAKKU_RIM.height + 0.08;
      glow.scale.setScalar(1.6);
      deepam.add(glow);
      pillarGlows.push(glow);

      // Its warmth on the pillar is the glow's alone: a light per pillar lamp would cost every pixel of the hall.
      deepams.push({ flames, glow, light: null, phase: i * 1.7 + 0.4, size: 1, base: DEEPAM_LIGHT });
    }

    /*
     * A standing Nilavilakku on a stone pedestal, `size` times the pillar lamps: used along
     * the passages between halls and, larger still, at the centre of a hall without the
     * statue. Its glow is depth-tested, so walls hide it when it stands out of sight.
     * `position` and `lightAt` (where its light hangs, if not over the lamp) are world points;
     * it returns the lightSpec of its light (which flickers with its flames), or null with
     * `light` 0. It stands in world space, hidden with the halls it `belongsTo`.
     */
    const standingGlowMaterial = once('standingGlow', () => {
      const material = track(deepamGlowMaterial.clone());
      material.depthTest = true;
      return material;
    });
    const standingLamp = (position, { size, pedestal, light: lightIntensity, reach, phase, lightAt = null, belongsTo }) => {
      const group = new THREE.Group();
      group.position.copy(position);
      addToWorld(group);
      worldParts.push({ halls: belongsTo, object: group });
      const base = new THREE.Mesh(track(new THREE.CylinderGeometry(pedestal.radius * 0.85, pedestal.radius, pedestal.height, 28)), darkStone);
      base.position.y = pedestal.height / 2;
      group.add(base);
      for (const y of [0.06, pedestal.height - 0.05]) {
        const band = new THREE.Mesh(track(new THREE.CylinderGeometry(pedestal.radius * (y > 0.1 ? 0.9 : 1.04), pedestal.radius * (y > 0.1 ? 0.9 : 1.04), 0.08, 28)), gold);
        band.position.y = y;
        group.add(band);
      }
      const lamp = new THREE.Group();
      lamp.position.y = pedestal.height;
      lamp.scale.setScalar(size);
      group.add(lamp);
      lamp.add(new THREE.Mesh(nilavilakkuGeometry, brass));
      const flames = [];
      for (let w = 0; w < DEEPAM_WICKS; w += 1) {
        const a = (w / DEEPAM_WICKS) * TAU;
        const flame = new THREE.Sprite(flameMaterial);
        flame.center.set(0.5, 0.08);
        flame.position.set(Math.sin(a) * NILAVILAKKU_RIM.radius, NILAVILAKKU_RIM.height, Math.cos(a) * NILAVILAKKU_RIM.radius);
        lamp.add(flame);
        flames.push(flame);
      }
      const glow = new THREE.Sprite(standingGlowMaterial);
      glow.position.y = NILAVILAKKU_RIM.height + 0.08;
      lamp.add(glow);
      const lamplight = { flames, glow, light: null, phase, size: 1, base: lightIntensity };
      deepams.push(lamplight);
      if (!lightIntensity) return null;
      const at = lightAt ? lightAt.clone() : position.clone().add(new THREE.Vector3(0, pedestal.height + (NILAVILAKKU_RIM.height + 0.25) * size, 0));
      return lightSpec(at, '#ffa64d', lightIntensity, reach, 2, lamplight);
    };
    // Their light is their glow and the passage's own (emissive): see the corridor material.
    passageLamps.forEach(({ position, halls: belongsTo }, i) => {
      standingLamp(position, { size: 1.6, pedestal: { radius: 0.26, height: 0.75 }, light: 0, reach: 9, phase: i * 2.1 + 0.9, belongsTo });
    });
    if (hasMonolith) {
      // Four lamps on the plinth's lower step, at its corners — low, and inside the circle the
      // camera walks round, so it never passes through one. The first lends the hall its
      // lamplight, hung before the front face.
      const { plinth } = MONOLITH;
      [[1, 1], [-1, 1], [-1, -1], [1, -1]].forEach(([sx, sz], i) => {
        const at = hallGroup.localToWorld(new THREE.Vector3(sx * (plinth.width / 2 - 0.12), 0, sz * (plinth.depth / 2 - 0.12)));
        const lit = standingLamp(at, { size: 1.2, pedestal: { radius: 0.1, height: plinth.step }, light: i ? 0 : 40, reach: 16, phase: 0.3 + i * 1.9, lightAt: hallGroup.localToWorld(new THREE.Vector3(0, 2.6, plinth.depth / 2 + 2.2)), belongsTo: [id] });
        if (lit) centreLights.push(lit);
      });
    } else if (figureModel) {
      // The model stands where the great lamp would: warm lamplight from before and above it,
      // gold as the hall's arches, in place of the lamp's own.
      figure = addHallFigure(hallGroup, { exhibit, stone: darkStone, gold, hitMaterial, ceilingY: CEILING_Y, track });
      // Its name board is chosen as the statue is (onStatueSelect), to open the exhibit's card.
      figure.board.userData.statue = true;
      hitTargets.push(figure.board);
      centreLights.push(lightSpec(hallGroup.localToWorld(FIGURE_FRONT_LIGHT.clone()), '#ffbe6e', 38, 11, 1.6));
    } else if (!hasStatue) centreLights.push(standingLamp(hallGroup.localToWorld(new THREE.Vector3()), { size: 3, pedestal: { radius: 1, height: 1 }, light: 45, reach: 16, phase: 0.3, belongsTo: [id] }));

    /* Floor, dome ceiling, daylight */
    // A soft sheen rather than a mirror polish, so the floor never flashes white at certain angles.
    // Polished cream marble: glossier than stone, yet soft enough never to flash white.
    const floorMaterial = once(`floor-${sides}`, () => track(new THREE.MeshStandardMaterial({ map: paint(2048, 2048, (ctx, w) => drawMarbleFloor(ctx, w, 2 * (cornerRadius + 0.5))), color: '#dcc6a4', roughness: 0.34, metalness: 0.05, envMapIntensity: 0.6, dithering: true })));
    /*
     * The floor follows the hall's own outline, reaching under the walls but stopping just
     * short of where each arch's corridor floor begins: two floors at the same height
     * would z-fight, flickering in hard-edged patches across every arch and passage.
     * UVs keep the kolam's scale and centre as on the round floor this replaces.
     */
    const kolamRadius = cornerRadius + 0.5;
    const floorReach = (apothem + WALL_DEPTH - 0.02) / Math.cos(Math.PI / sides);
    const floorShape = new THREE.Shape(Array.from({ length: sides }, (_, i) => {
      const a = -(i * step + step / 2); // counter-clockwise, so the floor faces up
      return new THREE.Vector2(Math.sin(a) * floorReach, Math.cos(a) * floorReach);
    }));
    const floorGeometry = track(new THREE.ShapeGeometry(floorShape));
    const floorPositions = floorGeometry.getAttribute('position');
    const floorUvs = floorGeometry.getAttribute('uv');
    for (let i = 0; i < floorPositions.count; i += 1) {
      floorUvs.setXY(i, floorPositions.getX(i) / (2 * kolamRadius) + 0.5, floorPositions.getY(i) / (2 * kolamRadius) + 0.5);
    }
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    hallGroup.add(floor);

    /*
     * The ceiling: the coffered dome photograph from public/UI images (rebuilt into a full
     * circle, see CEILING_DOME), laid on a shallow dome that rises from the top of the walls,
     * with teak filling the hall's corners round its gilt rim. The photograph carries its
     * own lighting (the lit coffers and glowing jali), so it is shown as taken, untouched by
     * the hall's lamps.
     */
    const hallCorners = Array.from({ length: sides }, (_, i) => {
      const a = i * step + step / 2;
      return new THREE.Vector2(Math.sin(a) * cornerRadius, -Math.cos(a) * cornerRadius);
    });
    const paintedSurface = (map, glow) => track(new THREE.MeshStandardMaterial({ map, emissive: '#ffffff', emissiveMap: map, emissiveIntensity: glow, roughness: 0.92, dithering: true }));
    const domeRadius = apothem - 0.15;
    const DOME_RISE = 1.6;
    const domeKit = once(`dome-${domeRadius}`, () => {
      const geometry = track(new THREE.RingGeometry(0.001, domeRadius, 160, 32));
      const positions = geometry.getAttribute('position');
      const uvs = geometry.getAttribute('uv');
      for (let i = 0; i < positions.count; i += 1) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        uvs.setXY(i, x / (2 * domeRadius) + 0.5, y / (2 * domeRadius) + 0.5);
        // A shallow, rounded rise to the centre (−z here is up once the dome is turned to face down).
        positions.setZ(i, -DOME_RISE * (1 - (x * x + y * y) / (domeRadius * domeRadius)));
      }
      geometry.rotateX(Math.PI / 2); // faces down into the hall
      geometry.computeVertexNormals();
      const material = track(new THREE.MeshBasicMaterial({ color: '#8a5530', toneMapped: false }));
      const waiting = loadPicture(CEILING_DOME, { prepare: (ctx, w, h) => unwrapDome(ctx, w, h) });
      const apply = (texture) => {
        material.color.set('#f4f0ea');
        material.map = texture;
        material.needsUpdate = true;
      };
      if (waiting.texture) apply(waiting.texture);
      else waiting.materials.push(apply);
      return { geometry, material };
    });
    const dome = new THREE.Mesh(domeKit.geometry, domeKit.material);
    dome.position.y = CEILING_Y;
    hallGroup.add(dome);

    // Teak over the corners beyond the dome, and a gilt ring round its rim.
    const cornerShape = new THREE.Shape(hallCorners);
    const rimHole = new THREE.Path();
    rimHole.absarc(0, 0, domeRadius, 0, TAU, true);
    cornerShape.holes.push(rimHole);
    const ceilingGeometry = track(new THREE.ShapeGeometry(cornerShape, 48));
    ceilingGeometry.rotateX(Math.PI / 2);
    const teakCeiling = once('teakCeiling', () => track(new THREE.MeshStandardMaterial({ color: '#7a4422', roughness: 0.6, emissive: '#2a1206', emissiveIntensity: 0.5, dithering: true })));
    const ceiling = new THREE.Mesh(ceilingGeometry, teakCeiling);
    ceiling.position.y = CEILING_Y;
    hallGroup.add(ceiling);
    const rim = new THREE.Mesh(track(new THREE.TorusGeometry(domeRadius, 0.09, 12, 160)), gold);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = CEILING_Y - 0.02;
    hallGroup.add(rim);

    const girderSideMap = once('girderSide', () => paint(1024, 256, drawOchreSandstone, [1, 1]));
    const ochreStone = track(new THREE.MeshStandardMaterial({ map: girderSideMap, roughness: 0.9, dithering: true }));

    /*
     * Round the top of the walls: the mural band, then a stone cove whose raised lip hides
     * the lighting, then a band of ochre stone up to the ceiling. The hidden light is drawn as
     * smooth, dithered washes: up the stone band and out across the ceiling's edge, and
     * gently down over the murals; strips under the cornice wash the walls and pool over
     * each niche.
     */
    // A pierced jali band, backlit, as round the ceiling's rim.
    const muralMap = track(once('mural', () => paint(1024, 555, drawJaliBand, [1, 1])).clone()); // a clone, to repeat for this hall's walls
    muralMap.repeat.set(Math.round(wallWidth / (MURAL_HEIGHT * (1024 / 555))), 1); // whole tiles, at the lattice's proportions
    muralMap.needsUpdate = true;
    const mural = paintedSurface(muralMap, 0.4);
    const muralGeometry = track(new THREE.PlaneGeometry(wallWidth, MURAL_HEIGHT));
    const crownHeight = CEILING_Y - COVE_Y;
    const crownMap = track(girderSideMap.clone());
    crownMap.repeat.set(wallWidth / 2.4, crownHeight / 0.6);
    crownMap.needsUpdate = true;
    const crown = track(new THREE.MeshStandardMaterial({ map: crownMap, roughness: 0.9, dithering: true }));
    const crownGeometry = track(new THREE.PlaneGeometry(wallWidth, crownHeight));
    const coveLedgeGeometry = track(new THREE.BoxGeometry(wallWidth, 0.1, 0.45));
    const coveLipGeometry = track(new THREE.BoxGeometry(wallWidth, 0.16, 0.06));

    const washMap = once('wash', () => paint(4, 512, drawWash));
    const glow = (opacity, map = washMap) => track(new THREE.MeshBasicMaterial({ map, color: '#ffc27a', transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, dithering: true }));
    const crownGlow = glow(0.4);
    const ceilingGlow = glow(0.34);
    const muralGlow = glow(0.26);
    const wallGlow = glow(0.18);
    const scallop = glow(0.24, once('scallop', () => paint(128, 320, drawScallop)));
    const crownGlowGeometry = track(new THREE.PlaneGeometry(wallWidth, crownHeight));
    crownGlowGeometry.rotateZ(Math.PI); // bright at the bottom, by the cove
    const ceilingGlowDepth = 1.8;
    const ceilingGlowGeometry = track(new THREE.PlaneGeometry(wallWidth, ceilingGlowDepth));
    ceilingGlowGeometry.rotateZ(Math.PI); // bright along the wall …
    ceilingGlowGeometry.rotateX(Math.PI / 2); // … facing down, fading out into the hall
    const muralGlowGeometry = track(new THREE.PlaneGeometry(wallWidth, MURAL_HEIGHT));
    const wallWashHeight = WALL_HEIGHT - 0.45 - (ARCH_HEIGHT + 0.5); // from under the cornice to above the keystone
    const wallGlowGeometry = track(new THREE.PlaneGeometry(wallWidth, wallWashHeight));
    const scallopGeometry = track(new THREE.PlaneGeometry(NICHE_WIDTH + 0.9, 5));
    for (let i = 0; i < sides; i += 1) {
      const angle = i * step;
      const wall = new THREE.Group();
      wall.position.set(Math.sin(angle) * apothem, 0, -Math.cos(angle) * apothem);
      wall.rotation.y = -angle;
      hallGroup.add(wall);
      const place = (mesh, x, y, z) => {
        mesh.position.set(x, y, z);
        wall.add(mesh);
      };
      place(new THREE.Mesh(muralGeometry, mural), 0, WALL_HEIGHT + MURAL_HEIGHT / 2, 0.005);
      place(new THREE.Mesh(crownGeometry, crown), 0, COVE_Y + crownHeight / 2, 0.005);
      place(new THREE.Mesh(coveLedgeGeometry, ochreStone), 0, COVE_Y - 0.05, 0.225);
      place(new THREE.Mesh(coveLipGeometry, ochreStone), 0, COVE_Y + 0.03, 0.42);
      place(new THREE.Mesh(crownGlowGeometry, crownGlow), 0, COVE_Y + crownHeight / 2, 0.015);
      place(new THREE.Mesh(ceilingGlowGeometry, ceilingGlow), 0, CEILING_Y - 0.005, ceilingGlowDepth / 2);
      place(new THREE.Mesh(muralGlowGeometry, muralGlow), 0, WALL_HEIGHT + MURAL_HEIGHT / 2, 0.015);
      place(new THREE.Mesh(wallGlowGeometry, wallGlow), 0, WALL_HEIGHT - 0.45 - wallWashHeight / 2, 0.03);
      if (hasNiches) for (const side of [-1, 1]) place(new THREE.Mesh(scallopGeometry, scallop), side * NICHE_X, 1.2 + 2.5, 0.03);
    }

    /*
     * Daylight through the jali round the dome's rim: the jali itself shines, shafts of sun
     * slant down from it towards the middle of the hall (a ring of soft rays, drifting very
     * slowly), and they land as a dappled ring of light on the marble round the medallion.
     * The rays are additive glows, so they light the air without costing a light each.
     */
    const sun = once(`sun-${domeRadius}`, () => {
      const daylight = '#fff2d6';
      const jaliInner = domeRadius * 0.885; // where the photograph's jali lies on the dome
      const jaliOuter = domeRadius * 0.975;
      const glowRing = track(new THREE.RingGeometry(jaliInner, jaliOuter, 160, 1));
      glowRing.rotateX(Math.PI / 2);
      const glowMap = paint(4, 128, (ctx, w, h) => {
        const g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, 'rgba(255,255,255,0)');
        g.addColorStop(0.5, 'rgba(255,255,255,1)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      });
      const radial = glowRing.getAttribute('uv');
      for (let i = 0; i < radial.count; i += 1) radial.setXY(i, 0.5, i < radial.count / 2 ? 0 : 1); // inner edge → outer edge
      const additive = (map, opacity, extra = {}) => track(new THREE.MeshBasicMaterial({ map, color: daylight, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, dithering: true, ...extra }));

      // The shafts: an open, inward-leaning cone from the jali down to the floor.
      const floorRadius = 5.7;
      const shafts = track(new THREE.CylinderGeometry((jaliInner + jaliOuter) / 2, floorRadius, CEILING_Y + 0.15, 160, 1, true));
      const shaftMap = paint(2048, 256, drawSunShafts);
      shaftMap.wrapS = THREE.RepeatWrapping;
      shaftMap.repeat.set(2, 1);

      // The dappled light where they land: a ring round the medallion.
      const dapple = track(new THREE.RingGeometry(floorRadius - 1.3, floorRadius + 1.3, 160, 1));
      const dappleUv = dapple.getAttribute('uv');
      for (let j = 0; j <= 1; j += 1) for (let i = 0; i <= 160; i += 1) dappleUv.setXY(j * 161 + i, (i / 160) * 56, j);
      dapple.rotateX(-Math.PI / 2); // faces up
      const dappleMap = paint(256, 128, drawJaliDapple);
      dappleMap.wrapS = THREE.RepeatWrapping;

      return {
        glowRing, shafts, dapple,
        glowMaterial: additive(glowMap, 0.55),
        shaftMaterial: additive(shaftMap, 0.24, { side: THREE.DoubleSide }),
        dappleMaterial: additive(dappleMap, 0.13),
      };
    });
    const jaliGlow = new THREE.Mesh(sun.glowRing, sun.glowMaterial);
    jaliGlow.position.y = CEILING_Y + 0.02;
    hallGroup.add(jaliGlow);
    const shafts = new THREE.Mesh(sun.shafts, sun.shaftMaterial);
    shafts.position.y = (CEILING_Y + 0.15) / 2;
    hallGroup.add(shafts);
    const dapple = new THREE.Mesh(sun.dapple, sun.dappleMaterial);
    dapple.position.y = 0.012;
    hallGroup.add(dapple);
    sunbeams.add(sun.shaftMaterial.map);

    // The building's sky and fill light, added once: soft daylight from above.
    once('ambient', () => {
      addToWorld(new THREE.HemisphereLight('#fff1dc', '#5a3a1c', 1.1));
      addToWorld(new THREE.AmbientLight('#ffe2c0', 0.42)); // fill so the floor nearest the visitor never sinks to black
      return true;
    });
    // The daylight gathered under the dome, now that no chandelier hangs there.
    centreLights.unshift(lightSpec(hallGroup.localToWorld(new THREE.Vector3(0, CEILING_Y - 2.4, 0)), '#fff0d8', 90, 0, 1.8));

    // A soft pool of daylight from the dome on the floor round the centrepiece, its edge fully
    // feathered (penumbra 1) so it never draws a hard ring on the marble. Gentler than it once
    // was, now that the statue's own spotlights (hallStatue.js) share this scene.
    spotLight = { ...lightSpec(hallGroup.localToWorld(new THREE.Vector3(0, CEILING_Y - 0.2, 0)), '#fff0dc', 80, 16, 1.4), target: hallGroup.localToWorld(new THREE.Vector3()) };
    // Over a model the dome's light is a warm gold spot, turned onto his chest.
    if (figureModel) Object.assign(spotLight, { color: new THREE.Color('#ffd49a'), intensity: 130, target: hallGroup.localToWorld(figureFocus(figureModel)) });

    return {
      id, wings, hasStatue, hasMonolith, figure, figureModel, featured, group: hallGroup, enterDistance: apothem - ARCH_STAND_OFF, origin: origin.clone(), yaw, sides, step, hitTargets, anchors, trims, pillarGlows,
      lights: { centre: centreLights, spot: spotLight },
      neighbours: wings.filter((wing) => wing.passage).map((wing) => wing.passage),
      labels: anchors.map(() => ({ x: 0, y: 0, visible: false, opacity: 0, scale: 1 })),
    };
  };

  /*
   * Lay out the building (hallLayout.js, shared with the museum map). Halls joined in a ring
   * are reached twice; every passage is built once, by whichever of its two halls comes
   * first, so a ring's closing corridors stand like the others.
   */
  const direction2d = (angle) => new THREE.Vector3(Math.sin(angle), 0, -Math.cos(angle));
  const specsById = new Map(hallSpecs.map((spec) => [spec.id, spec]));
  const placements = new Map([...layoutHalls(hallSpecs)].map(([id, { x, z, yaw }]) => [id, { origin: new THREE.Vector3(x, 0, z), yaw, corridors: new Set() }]));
  const facingOf = (spec, index) => wingBearing(spec, placements.get(spec.id), index); // world direction of a wing
  const builtPassages = new Set();
  for (const spec of hallSpecs) {
    if (!placements.has(spec.id)) continue;
    spec.wings.forEach((wing, index) => {
      const next = specsById.get(wing.passage);
      if (!next || !placements.has(next.id)) return;
      const key = [spec.id, next.id].sort().join('|');
      if (builtPassages.has(key)) return;
      builtPassages.add(key);
      placements.get(spec.id).corridors.add(index);
      // The corridor must end at the other hall's own arch back to this one.
      const end = placements.get(spec.id).origin.clone().addScaledVector(direction2d(facingOf(spec, index)), hallDistance(spec, next));
      const backIndex = next.wings.findIndex((candidate) => candidate.passage === spec.id);
      const facesBack = Math.abs(shortestDelta(facingOf(next, backIndex), facingOf(spec, index) + Math.PI)) < 1e-3;
      if (end.distanceTo(placements.get(next.id).origin) > 0.01 || !facesBack) {
        console.warn(`Museum layout: the corridor from ${spec.id} to ${next.id} does not meet its arch; check the halls' wing orders.`);
      }
    });
  }
  const halls = hallSpecs.filter((spec) => placements.has(spec.id)).map((spec) => buildHall(spec, placements.get(spec.id)));
  const hallsById = new Map(halls.map((hall) => [hall.id, hall]));
  loadArches();
  /** The hall the visitor stands in: the camera orbits its centre, and its arches are picked. */
  let current = null;
  /**
   * The building's real lights: a fixed number, always in the scene, so no material is ever
   * recompiled (see lightSpec). `applyLighting` lends them, in order of importance, to the
   * halls in `fullyLit` (the current one; while gliding down a passage, both of its halls):
   * their dome's daylight and great lamp, then their neighbours' daylight (glimpsed down the
   * corridors). Lights left over are dimmed to nothing.
   *
   * Every light is paid for by every lit pixel, and on a modest GPU the lights decide the frame
   * rate (measured: no lights at all runs about 2.4 times faster than fourteen), so there are
   * few of them; rooms, passages and pillar lamps glow by their materials and sprites instead.
   *
   * Only those halls and their neighbours are drawn; the rest of the building, out of sight
   * behind walls and fog, is hidden, so the GPU never draws it.
   */
  const POINT_LIGHTS = 5;
  const pointLights = Array.from({ length: POINT_LIGHTS }, () => {
    const light = new THREE.PointLight('#ffffff', 0, 1, 2);
    addToWorld(light);
    return light;
  });
  const spotLights = Array.from({ length: 1 }, () => {
    const light = new THREE.SpotLight('#ffffff', 0, 16, 0.34, 1, 1.4);
    addToWorld(light);
    addToWorld(light.target);
    return light;
  });
  const lend = (light, spec) => {
    light.position.copy(spec.position);
    light.color.copy(spec.color);
    light.intensity = spec.intensity;
    light.distance = spec.distance;
    light.decay = spec.decay;
    if (spec.flicker) spec.flicker.light = light; // the lamp's flame now flickers this light
  };
  /*
   * The halls' centrepiece models (hallFigure.js) are megabytes each, so none is fetched with
   * the building: each loads when its hall is lit (the visitor's, or on the way there), or
   * glimpsed from a neighbour once the building has settled (FIGURE_PRELOAD_MS), one at a
   * time so their decoding never stacks up into a long stall.
   */
  const FIGURE_PRELOAD_MS = 4000;
  const builtAt = performance.now();
  const figureWanted = { lit: [], glimpsed: [] };
  let figureLoading = false;
  const loadFigures = (now) => {
    if (figureLoading) return;
    const pending = (list) => list.find((hall) => hall.figure && !hall.figure.requested);
    const next = pending(figureWanted.lit) ?? (now - builtAt > FIGURE_PRELOAD_MS ? pending(figureWanted.glimpsed) : null);
    if (!next) return;
    figureLoading = true;
    next.figure.load(() => { figureLoading = false; });
  };
  const applyLighting = (fullyLit) => {
    const lit = fullyLit.map((id) => hallsById.get(id));
    const shown = new Set(lit.flatMap((hall) => [hall.id, ...hall.neighbours]));
    const glimpsed = [...shown].filter((id) => !fullyLit.includes(id)).map((id) => hallsById.get(id));
    Object.assign(figureWanted, { lit, glimpsed });
    const wanted = [
      ...lit.flatMap((hall) => hall.lights.centre),
      ...glimpsed.map((hall) => hall.lights.centre[0]),
    ];
    deepams.forEach((lamp) => { lamp.light = null; });
    pointLights.forEach((light, i) => {
      if (wanted[i]) lend(light, wanted[i]);
      else light.intensity = 0;
    });
    const spots = [...lit, ...glimpsed].map((hall) => hall.lights.spot);
    spotLights.forEach((light, i) => {
      if (!spots[i]) {
        light.intensity = 0;
        return;
      }
      lend(light, spots[i]);
      light.target.position.copy(spots[i].target);
      light.target.updateMatrixWorld();
    });
    halls.forEach((hall) => { hall.group.visible = shown.has(hall.id); });
    worldParts.forEach(({ halls: owners, object }) => { object.visible = owners.some((id) => shown.has(id)); });
  };
  /**
   * Makes `hall` the current one. The pillar lamps' halos skip the depth test (so the stone
   * does not slice them), which would also let another hall's halos shine through the walls,
   * so only the current hall's are shown.
   */
  const setCurrentHall = (hall) => {
    current = hall;
    halls.forEach((other) => other.pillarGlows.forEach((glow) => { glow.visible = other === hall; }));
    applyLighting([hall.id]);
  };
  setCurrentHall(halls[0]);

  /** Oil flames flicker: two fast, unrelated sines per lamp, so no two lamps move together. */
  const flickerDeepams = (seconds) => {
    for (const { flames, glow, light, phase, size, base } of deepams) {
      const flicker = reducedMotion ? 1 : 1 + 0.09 * Math.sin(seconds * 9.3 + phase) + 0.06 * Math.sin(seconds * 23.1 + phase * 2.3) + 0.04 * Math.sin(seconds * 41.7 + phase * 0.7);
      if (light) light.intensity = base * flicker;
      glow.scale.setScalar(1.6 * size * (0.94 + (flicker - 1) * 0.8));
      flames.forEach((flame, w) => {
        const sway = reducedMotion ? 0 : Math.sin(seconds * (12 + w) + phase + w * 1.3);
        flame.scale.set(0.07 * size * (1 - sway * 0.06), 0.16 * size * (flicker + sway * 0.07), 1);
      });
    }
  };

  /* ---------- View state & animation ---------- */
  let width = 1;
  let height = 1;
  let baseFov = 70;
  let fov = 70;
  let lon = 0;
  let lat = 0.06;
  /*
   * How fully the visitor stands in line behind the statue (1) rather than beside it (0).
   * In line, the sage is centred on screen — on arrival, when the hall falls idle, and on
   * returning from a wing. Dragging, or turning to a wing, eases the visitor aside so the
   * arches come into view; the camera slides rather than swinging its gaze.
   */
  let statueFocus = 1;
  let statueFocusTarget = 1;
  /** The tilt that puts the statue's middle at the centre of the screen. */
  const statueLat = () => Math.atan2(STATUE_CENTRE_Y - EYE_HEIGHT, orbit.back);
  let lonVelocity = 0;
  let walk = 0; // 0 = orbiting the statue, 1 = standing before the faced arch
  let orbit = ORBIT_LANDSCAPE;
  let animation = null;
  let locked = false;
  let lastInteraction = performance.now();
  let focusIndex = -1;
  let hoverIndex = null;
  let statueHovered = false;
  let running = false;
  let frame = 0;
  let lastTime = performance.now();
  const direction = new THREE.Vector3();
  const scratch = new THREE.Vector3();
  const projected = new THREE.Vector3();
  const raycaster = new THREE.Raycaster();
  const pointerNdc = new THREE.Vector2();
  /*
   * The Thiruvalluvar monument stands at the centre of its hall as part of the building
   * itself (hallStatue.js): loaded once with the scene and never unmounted, so it stays put
   * through every turn, glide and change of hall, and walls hide it like anything else.
   */
  const statueHall = halls.find((hall) => hall.hasStatue);
  const statue = statueHall ? addHallStatue(statueHall.group, { reducedMotion, onLoaded: onStatueLoaded, track }) : null;
  if (!statue) onStatueLoaded?.(false);
  // The statue's own lights move into world space (keeping their place), so hiding its hall
  // never takes them out of the scene: that too would recompile every material.
  if (statue) statue.lights.forEach((light) => scene.attach(light));

  /*
   * Rings round the centrepiece, from the floor up: the statue's (pedestal base, pedestal
   * top, the figure's body and crown) or the monolith's (plinth, shaft foot, capstone and
   * the pyramidion's tip), in its hall's frame. Each frame their on-screen silhouette is
   * reported, and a wing label whose arch stands behind the centrepiece is hidden, so no
   * label ever floats over the statue or the monolith's inscriptions.
   */
  const RING_POINTS = 8;
  const circleRings = (rings) => rings.map(([y, radius]) =>
    Array.from({ length: RING_POINTS }, (_, i) => new THREE.Vector3(Math.cos((i / RING_POINTS) * TAU) * radius, y, Math.sin((i / RING_POINTS) * TAU) * radius)));
  const statueRings = circleRings([[0, 1.55], [0.94, 1.2], [2.0, 0.85], [3.35, 0.55]]);
  /** A box's outline at height `y`: its corners and the middles of its sides. */
  const boxRing = (y, halfWidth, halfDepth) => [[1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1], [1, 0]]
    .map(([sx, sz]) => new THREE.Vector3(sx * halfWidth, y, sz * halfDepth));
  const { plinth: mPlinth, shaft: mShaft } = MONOLITH;
  const monolithRings = [
    boxRing(0, mPlinth.width / 2, mPlinth.depth / 2),
    boxRing(mShaft.bottom, mShaft.width / 2 + 0.15, mShaft.depth / 2 + 0.15),
    boxRing(mShaft.bottom + mShaft.height + 0.3, mShaft.width / 2 + 0.15, mShaft.depth / 2 + 0.15),
    boxRing(MONOLITH.top, 0.05, 0.05),
  ];
  halls.forEach((hall) => {
    const rings = hall.hasStatue ? statueRings : hall.hasMonolith ? monolithRings : hall.figureModel ? circleRings(figureRings(hall.figureModel)) : [];
    hall.outline = rings.flat().map((point) => hall.group.localToWorld(point.clone()));
  });
  /** Where the visitor stands on the plan (hallLayout.js ground coordinates) and the bearing they face, for the museum map. */
  const view = { hallId: null, x: 0, z: 0, heading: 0 };
  /** `outline`: the silhouette as screen points, up its left side and down its right; empty when not in view. */
  const statueBounds ={ visible: false, left: 0, right: 0, top: 0, bottom: 0, outline: [] };
  const ringExtents = [];

  const resize = () => {
    width = mount.clientWidth || 1;
    height = mount.clientHeight || 1;
    orbit = width / height < 0.8 ? ORBIT_PORTRAIT : ORBIT_LANDSCAPE;
    const nextBase = width / height < 0.8 ? 82 : 70;
    if (!animation) fov = clamp(fov + (nextBase - baseFov), 40, 90);
    baseFov = nextBase;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(mount);
  resize();

  /*
   * Resolution: the canvas is drawn at the screen's own pixel density (up to 2× on retina and
   * other high-density screens), so the hall is as crisp as the page around it. Only on such a
   * screen, when frames keep running slow, may it step down — never below one rendered pixel
   * per CSS pixel (MIN_PIXEL_RATIO), so the picture is never stretched and blurred. After a
   * long smooth spell it tries a step finer again, but never back up to a ratio that already
   * proved too slow, so the picture does not pulse between the two.
   */
  const MIN_PIXEL_RATIO = Math.min(MAX_PIXEL_RATIO, 1);
  let pixelRatio = MAX_PIXEL_RATIO;
  let pixelRatioCeiling = MAX_PIXEL_RATIO;
  let slowFor = 0;
  let smoothFor = 0;
  const setPixelRatio = (ratio) => {
    pixelRatio = ratio;
    renderer.setPixelRatio(ratio);
    renderer.setSize(width, height, false);
  };
  const adaptResolution = (frameMs) => {
    if (frameMs > 200) return; // a hitch (a tab switch, a resize), not a sign of load
    if (frameMs > 26) {
      slowFor += frameMs;
      smoothFor = 0;
    } else {
      smoothFor += frameMs;
      slowFor = 0;
    }
    if (slowFor > 900 && pixelRatio > MIN_PIXEL_RATIO) {
      pixelRatioCeiling = pixelRatio - 0.01;
      setPixelRatio(Math.max(MIN_PIXEL_RATIO, +(pixelRatio - 0.25).toFixed(2)));
      slowFor = 0;
    } else if (smoothFor > 6000 && pixelRatio + 0.1 <= pixelRatioCeiling) {
      setPixelRatio(+(pixelRatio + 0.1).toFixed(2));
      smoothFor = 0;
    }
  };

  const animate = ({ toLon = lon, toLat = lat, toWalk = walk, toFov = fov, duration, onDone }) => {
    animation = {
      start: performance.now(),
      duration: reducedMotion ? 1 : duration,
      lon0: lon,
      dLon: shortestDelta(lon, toLon),
      lat0: lat,
      lat1: toLat,
      walk0: walk,
      walk1: toWalk,
      fov0: fov,
      fov1: toFov,
      onDone,
    };
    lonVelocity = 0;
  };

  /**
   * Hands the camera over to `hall`, reached down the passage from hall `fromId`: the
   * visitor stands `orbit.back` behind its centre, facing on into it — exactly where the
   * glide left them — then settles their gaze on the centrepiece.
   */
  const enterHall = (hall, fromId) => {
    updateHover(null);
    const back = hall.wings.findIndex((wing) => wing.passage === fromId);
    setCurrentHall(hall);
    focusIndex = -1; // announce the new hall's focused wing
    lon = wrapAngle(back * hall.step + Math.PI);
    walk = 0;
    statueFocus = statueFocusTarget = 1;
    onHallChange?.(hall.id);
    animate({
      toLat: statueLat(),
      toFov: baseFov,
      duration: 700,
      onDone: () => {
        locked = false;
        lastInteraction = performance.now();
      },
    });
  };

  /** `target` is a wing index, 'statue', or null. */
  const updateHover = (target) => {
    const index = typeof target === 'number' ? target : null;
    const onStatue = target === 'statue';
    if (onStatue !== statueHovered) {
      statueHovered = onStatue;
      onStatueHover?.(onStatue);
    }
    canvas.style.cursor = target === null ? 'grab' : 'pointer';
    if (index === hoverIndex) return;
    hoverIndex = index;
    current.trims.forEach((material, i) => { material.emissiveIntensity = i === index ? 1.6 : 0.5; });
    onHover?.(index);
  };

  const pick = (event) => {
    const rect = canvas.getBoundingClientRect();
    pointerNdc.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(pointerNdc, camera);
    const hit = raycaster.intersectObjects(current.hitTargets, false)[0];
    if (!hit) return null;
    // The centre column without the statue (round the great lamp or a model) only blocks taps; a model's name board is chosen instead.
    return hit.object.userData.statue ? 'statue' : hit.object.userData.wingIndex ?? null;
  };

  const tick = (now) => {
    frame = window.requestAnimationFrame(tick);
    adaptResolution(now - lastTime);
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;

    if (animation) {
      const t = clamp((now - animation.start) / animation.duration, 0, 1);
      const e = easeInOutCubic(t);
      lon = animation.lon0 + animation.dLon * e;
      lat = animation.lat0 + (animation.lat1 - animation.lat0) * e;
      walk = animation.walk0 + (animation.walk1 - animation.walk0) * e;
      fov = animation.fov0 + (animation.fov1 - animation.fov0) * e;
      if (t >= 1) {
        const { onDone } = animation;
        animation = null;
        onDone?.();
      }
    } else if (!pointers.size) {
      if (Math.abs(lonVelocity) > 0.002) {
        lon += lonVelocity * dt;
        lonVelocity *= Math.pow(0.06, dt);
      } else if (!locked && now - lastInteraction > IDLE_ROTATE_AFTER_MS) {
        // Idle: come back in line with the statue, and slowly circle it.
        statueFocusTarget = 1;
        if (!reducedMotion) lon += 0.03 * dt;
      }
    }
    statueFocus = reducedMotion ? statueFocusTarget : statueFocus + (statueFocusTarget - statueFocus) * Math.min(1, dt * 3);

    /*
     * Stand behind the centrepiece (in line with it, or to its right); when walking to an
     * arch, swing wide around the pedestal. Beyond 1, the walk carries on straight down a
     * passage towards the next hall. All of this is in the current hall's own frame, which is
     * then placed in the building: its centre at `origin`, turned by `yaw`.
     */
    const ahead = -orbit.back + (current.enterDistance + orbit.back) * walk;
    const toArch = clamp(walk, 0, 1);
    const aside = orbit.side * (1 - toArch) * (1 - statueFocus) + 1.6 * Math.sin(Math.PI * toArch);
    const heading = lon - current.yaw;
    camera.position.set(
      current.origin.x + Math.sin(heading) * ahead + Math.cos(heading) * aside,
      EYE_HEIGHT,
      current.origin.z - Math.cos(heading) * ahead + Math.sin(heading) * aside,
    );
    direction.set(Math.sin(heading) * Math.cos(lat), Math.sin(lat), -Math.cos(heading) * Math.cos(lat));
    camera.lookAt(scratch.copy(camera.position).add(direction));
    if (camera.fov !== fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    // The sun's rays drift very slowly round the hall, as the light moves through the jali.
    if (!reducedMotion) sunbeams.forEach((map) => { map.offset.x = (map.offset.x + 0.0015 * dt) % 1; });
    flickerDeepams(now / 1000);
    statue?.update(now / 1000, dt, camera, statueHovered);
    loadFigures(performance.now());
    halls.forEach((hall) => hall.figure?.update(dt, statueHovered && hall === current));

    const { anchors, labels } = current;
    let left = Infinity;
    let right = -Infinity;
    let top = Infinity;
    let bottom = -Infinity;
    ringExtents.length = 0;
    let wholeInView = true;
    current.outline.forEach((point, i) => {
      if (i % RING_POINTS === 0) ringExtents.push({ left: Infinity, right: -Infinity, y: 0 });
      const ring = ringExtents[ringExtents.length - 1];
      if (scratch.copy(point).sub(camera.position).dot(direction) <= 0.1) {
        wholeInView = false; // behind the camera
        return;
      }
      projected.copy(point).project(camera);
      const sx = (projected.x * 0.5 + 0.5) * width;
      const sy = (-projected.y * 0.5 + 0.5) * height;
      left = Math.min(left, sx);
      right = Math.max(right, sx);
      top = Math.min(top, sy);
      bottom = Math.max(bottom, sy);
      ring.left = Math.min(ring.left, sx);
      ring.right = Math.max(ring.right, sx);
      ring.y += sy / RING_POINTS;
    });
    const outline = wholeInView && ringExtents.length
      ? [...ringExtents.map((ring) => [ring.left, ring.y]), ...ringExtents.slice().reverse().map((ring) => [ring.right, ring.y])]
      : [];
    Object.assign(statueBounds, { visible: left < right, left, right, top, bottom, outline });

    // The centrepiece stands nearer than every arch in front of the visitor, so an arch
    // whose label anchor falls within its silhouette is out of sight behind it. The
    // silhouette is the outline's polygon (its bounding box only while partly behind the
    // camera): a box would also swallow arches seen above the wide, low plinth.
    const centreDistance = camera.position.distanceTo(current.origin);
    const behindCentrepiece = (x, y) => {
      if (!outline.length) return x > left && x < right && y > top && y < bottom;
      let inside = false;
      for (let a = 0, b = outline.length - 1; a < outline.length; b = a, a += 1) {
        const [ax, ay] = outline[a];
        const [bx, by] = outline[b];
        if ((ay > y) !== (by > y) && x < ((bx - ax) * (y - ay)) / (by - ay) + ax) inside = !inside;
      }
      return inside;
    };
    anchors.forEach((anchor, i) => {
      const label = labels[i];
      const inFront = scratch.copy(anchor).sub(camera.position).dot(direction) > 0;
      projected.copy(anchor).project(camera);
      const edge = Math.abs(projected.x);
      label.visible = inFront && edge < 1.15 && projected.y > -1.1 && projected.y < 1.25;
      label.x = (projected.x * 0.5 + 0.5) * width;
      label.y = (-projected.y * 0.5 + 0.5) * height;
      label.opacity = clamp((1.15 - edge) / 0.35, 0, 1);
      label.scale = 0.86 + 0.14 * clamp(1 - edge, 0, 1);
      const isCentrepiece = i === anchors.length - 1;
      if (current.wings[i]?.alcove) label.visible = false; // an alcove has no label
      if (!isCentrepiece && statueBounds.visible && behindCentrepiece(label.x, label.y) && anchor.distanceTo(camera.position) > centreDistance) label.visible = false;
    });
    if (!current.featured) labels[labels.length - 1].visible = false; // a lamp has no label
    Object.assign(view, { hallId: current.id, x: camera.position.x, z: camera.position.z, heading: wrapAngle(heading) });
    onFrame?.(labels, statueBounds, view);

    const nearest = Math.round(wrapAngle(lon) / current.step) % current.sides;
    if (nearest !== focusIndex) {
      focusIndex = nearest;
      onFocusChange?.(nearest);
    }

    renderer.render(scene, camera);
    onRender?.(now, camera);
  };

  /* ---------- Input: drag / swipe to look, pinch / wheel to zoom, tap an arch to enter ---------- */
  const pointers = new Map();
  let press = null;
  let pinchDistance = 0;
  const pinchSpan = () => {
    const [a, b] = [...pointers.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  };

  const onPointerDown = (event) => {
    if (locked) return;
    canvas.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY, t: performance.now() });
    lastInteraction = performance.now();
    animation = null;
    lonVelocity = 0;
    if (pointers.size === 1) {
      press = { x: event.clientX, y: event.clientY, moved: 0 };
      canvas.style.cursor = 'grabbing';
    } else if (pointers.size === 2) {
      pinchDistance = pinchSpan();
      press = null;
    }
  };

  const onPointerMove = (event) => {
    const pointer = pointers.get(event.pointerId);
    if (!pointer) {
      if (!locked && event.pointerType === 'mouse') updateHover(pick(event));
      return;
    }
    const now = performance.now();
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    const elapsed = Math.max(1, now - pointer.t);
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.t = now;
    lastInteraction = now;

    if (pointers.size === 2) {
      const span = pinchSpan();
      if (pinchDistance > 0) fov = clamp(fov * (pinchDistance / span), 40, 90);
      pinchDistance = span;
      return;
    }
    const radiansPerPixel = THREE.MathUtils.degToRad(fov) / height;
    lon -= dx * radiansPerPixel;
    lat = clamp(lat + dy * radiansPerPixel, MIN_LAT, MAX_LAT);
    lonVelocity = lonVelocity * 0.6 + ((-dx * radiansPerPixel) / elapsed) * 1000 * 0.4;
    if (press) press.moved += Math.abs(dx) + Math.abs(dy);
    if (!press || press.moved >= 8) statueFocusTarget = 0; // a real drag (not a tap): step aside to look around
  };

  const onPointerUp = (event) => {
    const pointer = pointers.get(event.pointerId);
    if (!pointer) return;
    pointers.delete(event.pointerId);
    if (pointers.size) return;
    canvas.style.cursor = hoverIndex === null && !statueHovered ? 'grab' : 'pointer';
    if (performance.now() - pointer.t > 90) lonVelocity = 0;
    // Only movement separates a tap from a drag; a slow, steady press still counts as a tap.
    if (press && press.moved < 8) {
      lonVelocity = 0;
      const target = pick(event);
      if (target === 'statue') onStatueSelect?.();
      else if (target !== null) onSelect?.(target);
    }
    press = null;
  };

  const onWheel = (event) => {
    if (locked) return;
    event.preventDefault();
    lastInteraction = performance.now();
    fov = clamp(fov + event.deltaY * 0.03, 40, 90);
  };

  const onPointerLeave = () => updateHover(null);

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
  canvas.addEventListener('pointerleave', onPointerLeave);
  canvas.addEventListener('wheel', onWheel, { passive: false });

  /*
   * Context loss is often brief (a driver reset, or the browser reclaiming GPU memory).
   * preventDefault() asks the browser to restore it; three.js re-uploads geometry and
   * textures by itself, and we re-bake the reflection map and resume where we were.
   */
  let contextLost = false;
  let wantActive = false;
  const onLost = (event) => {
    event.preventDefault();
    contextLost = true;
    running = false;
    window.cancelAnimationFrame(frame);
    onContextLost?.();
  };
  const onRestored = () => {
    contextLost = false;
    bakeEnvironment();
    if (wantActive) {
      running = true;
      lastTime = performance.now();
      frame = window.requestAnimationFrame(tick);
    }
    onContextRestored?.();
  };
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);

  /*
   * A new language repaints the words on the wing panels, the monolith and the name boards:
   * at once, and again when the Devanagari fonts (fetched only when first needed) arrive.
   */
  const relabelAll = () => {
    if (disposed) return;
    relabels.forEach((relabel) => relabel());
    halls.forEach((hall) => hall.figure?.relabel?.());
  };
  const offLanguageChange = onLanguageChange(() => {
    relabelAll();
    scriptFontsReady().then(relabelAll);
  });

  /* ---------- Public API ---------- */
  const api = {
    /** Start or pause rendering (pause while a room covers the hallway). */
    setActive(active) {
      wantActive = active;
      if (contextLost) return; // resumes on restore
      if (active && !running) {
        running = true;
        lastTime = performance.now();
        frame = window.requestAnimationFrame(tick);
      } else if (!active && running) {
        running = false;
        window.cancelAnimationFrame(frame);
      }
    },
    /** Opening sweep: from gazing up at the painted ceiling down to the statue, centred on screen. */
    intro() {
      lon = -0.9;
      lat = 0.45;
      statueFocus = statueFocusTarget = 1;
      animate({ toLon: 0, toLat: statueLat(), toFov: baseFov, duration: 2600 });
      lastInteraction = performance.now();
    },
    /** Turn to face a wing (stepping aside from the statue to see its arch). */
    lookAt(index) {
      if (locked) return;
      lastInteraction = performance.now();
      statueFocusTarget = 0;
      animate({ toLon: index * current.step, toLat: 0.06, toFov: baseFov, duration: 950 });
    },
    /**
     * For the guided tour: turn slowly (over `duration` ms) to face wing `target`, or the
     * centrepiece ('centre'), then call `onDone`. Unlike `lookAt` it is not refused while
     * locked, and the tour runs it between its glides.
     */
    glance(target, { duration = 1400 } = {}, onDone) {
      animation = null;
      locked = false;
      updateHover(null);
      lastInteraction = performance.now();
      if (target === 'centre') {
        statueFocusTarget = 1;
        animate({ toLat: statueLat(), toFov: baseFov, duration, onDone });
        return;
      }
      statueFocusTarget = 0;
      animate({ toLon: target * current.step, toLat: 0.08, toFov: Math.max(48, baseFov - 6), duration, onDone });
    },
    /**
     * Turn to a wing and walk towards its arch, then call `onArrive`. A passage's arch is
     * not a door: the visitor glides on through it, down the open corridor and into the next
     * hall, to stand behind its centrepiece — one unbroken move, as the halls are one
     * building — and `onArrive` is called there.
     */
    approach(index, onArrive, { speed = 1 } = {}) {
      if (locked) return;
      locked = true;
      statueFocusTarget = 0;
      updateHover(null);
      const target = index * current.step;
      const turn = Math.abs(shortestDelta(lon, target));
      const next = hallsById.get(current.wings[index].passage);
      let walkOn;
      if (next) {
        // Walk until standing `orbit.back` short of the next hall's centre.
        const distance = current.origin.distanceTo(next.origin);
        const glide = distance / (current.enterDistance + orbit.back);
        walkOn = {
          toWalk: glide,
          toFov: baseFov,
          duration: reducedMotion ? 1 : (600 + ((distance + orbit.back) / GLIDE_SPEED) * 1000) / speed,
          onDone: () => {
            enterHall(next, current.id);
            onArrive?.();
          },
        };
      } else {
        walkOn = { toWalk: 1, toFov: Math.max(48, baseFov - 12), duration: 1300, onDone: onArrive };
      }
      animate({
        toLon: target,
        toLat: 0.04,
        toFov: fov,
        duration: (250 + turn * 500) / speed,
        onDone: () => {
          // The hall ahead lights up as the visitor sets off; the one behind dims on arrival.
          if (next) applyLighting([current.id, next.id]);
          animate(walkOn);
        },
      });
    },
    /**
     * Fast travel (the museum map): glide on down the corridors through each hall of
     * `route` in turn (hall ids, each joined to the one before; see routeBetween), at
     * `speed`, without pausing to settle in the halls passed through; then, if
     * `enterIndex` is given, walk up to that wing of the last hall. `onArrive` is called at
     * the end. A route that does not follow the corridors jumps straight to its last hall.
     */
    travel(route, { enterIndex = null, speed = 1.8 } = {}, onArrive) {
      // Arriving in a hall eases the gaze down to its centrepiece, locked; on a journey the visitor turns straight on.
      const moveOn = () => {
        animation = null;
        locked = false;
      };
      const [nextId, ...rest] = route;
      if (!nextId) {
        moveOn();
        if (enterIndex === null) onArrive?.();
        else api.approach(enterIndex, onArrive, { speed });
        return;
      }
      const index = current.wings.findIndex((wing) => wing.passage === nextId);
      if (index < 0) {
        api.showHall(route[route.length - 1]);
        api.travel([], { enterIndex, speed }, onArrive);
        return;
      }
      moveOn();
      api.approach(index, () => {
        if (rest.length || enterIndex !== null) api.travel(rest, { enterIndex, speed }, onArrive);
        else onArrive?.();
      }, { speed });
    },
    /** Stand in another hall at once, behind its centrepiece facing its corridor (e.g. for a room opened from the menu). */
    showHall(id) {
      const hall = hallsById.get(id);
      if (!hall || hall === current) return;
      animation = null;
      locked = false;
      updateHover(null);
      setCurrentHall(hall);
      focusIndex = -1;
      lon = 0;
      walk = 0;
      lat = statueLat();
      statueFocus = statueFocusTarget = 1;
      lastInteraction = performance.now();
      onHallChange?.(hall.id);
    },
    /** Step back behind the statue, centred on screen, after leaving a wing. */
    reset() {
      locked = false;
      lastInteraction = performance.now();
      statueFocusTarget = 1;
      if (walk > 0) animate({ toWalk: 0, toLat: statueLat(), toFov: baseFov, duration: 1000 });
    },
    /** Freeze or release input, e.g. while the Thirukkural scroll is open. */
    setLocked(value) {
      locked = value;
      if (value) updateHover(null);
      lastInteraction = performance.now();
    },
    dispose() {
      running = false;
      disposed = true; // pictures still loading are dropped
      offLanguageChange();
      statue?.dispose(); // ignore a model that finishes loading after this
      halls.forEach((hall) => hall.figure?.dispose());
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      disposables.forEach((resource) => resource.dispose());
      envTarget.dispose();
      pmrem.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
  return api;
}
