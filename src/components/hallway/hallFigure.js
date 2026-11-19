import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { translate, tri } from '../../i18n/index.js';

/*
 * A 3D model on a royal podium at the centre of a hall, in place of the great lamp the other
 * halls keep: Tolkappiar, the Yaazh, the paddy field, Raja Raja Chozhan, the ship
 * (HALL_EXHIBITS in data/hallExhibits.js). Like the Thiruvalluvar monument (hallStatue.js)
 * it is part of the building's own scene, loaded once and never unmounted.
 *
 * The podium: a stone step, a drum of carved sandstone panels (lotus medallions in arched
 * niches) between gold filigree bands, a stone cap and a crimson velvet top with gold
 * piping, under a soft beam of warm light from the dome. Beside it stands a brass-and-teak
 * name board on a lectern, as in a museum: the board, not the model, is what the visitor
 * clicks to open the exhibit's card (createHallwayScene.js makes it a hit target).
 *
 * The scans are Y-up, facing +z, each on its own small base.
 */

export const FIGURE_PEDESTAL = { radius: 1.5, top: 1.3, height: 1.0 };
/** How far from the axis a model may reach: inside the velvet top, with a margin. */
const FIT_RADIUS = 1.2;
/** Before and above the model (it faces -z, see below): the warm light that takes the great lamp's place. */
export const FIGURE_FRONT_LIGHT = new THREE.Vector3(0, 4.4, -3.2);
/** The model's top above the floor, at most: its column (which stops taps) is sized from this. */
export const figureTop = (model) => FIGURE_PEDESTAL.height + model.height;
/** The point the hall's dome spotlight is turned onto: the model's chest, or its middle. */
export const figureFocus = (model) => new THREE.Vector3(0, FIGURE_PEDESTAL.height + model.height * 0.6, 0);
/** Rings round the podium and model ([height, radius]), for keeping wing labels off it. */
export const figureRings = (model) => [[0, 1.55], [FIGURE_PEDESTAL.height, 1.36], [FIGURE_PEDESTAL.height + model.height * 0.45, 1.05], [figureTop(model), 0.4]];
/**
 * The name board's stand, in the hall's frame: before the podium and to one side, turned
 * towards the way in (-z), where the visitor arrives and looks on into the hall.
 */
export const BOARD = { x: -2.25, z: -1.35, yaw: Math.PI - 0.55, height: 1.18, width: 0.96, depth: 0.64, tilt: 0.42 };

const TAMIL_FONT = "'Nirmala UI', 'Noto Sans Tamil', 'Tamil Sangam MN', Latha, 'Noto Sans Devanagari', 'Noto Sans Telugu', 'Noto Sans Kannada', 'Noto Sans Malayalam', 'Noto Sans Bengali', 'Noto Sans Gujarati', 'Noto Sans Gurmukhi', 'Noto Sans Oriya', 'Noto Nastaliq Urdu', 'Noto Naskh Arabic', 'Noto Sans Ol Chiki', 'Noto Sans Hebrew', 'Noto Sans Thaana', 'Noto Sans SC', 'Noto Sans TC', 'Noto Sans JP', 'Noto Sans KR', 'Noto Sans Thai', 'Noto Sans Lao', 'Noto Sans Khmer', 'Noto Sans Myanmar', 'Noto Sans Sinhala', 'Noto Sans Ethiopic', 'Noto Sans Georgian', 'Noto Sans Armenian', 'Noto Serif Tibetan', sans-serif";
const SERIF_FONT = "'Cormorant Garamond', Georgia, 'Noto Serif Devanagari', 'Noto Serif Telugu', 'Noto Serif Kannada', 'Noto Serif Malayalam', 'Noto Serif Bengali', 'Noto Serif Gujarati', 'Noto Serif Gurmukhi', 'Noto Serif Oriya', 'Noto Nastaliq Urdu', 'Noto Naskh Arabic', 'Noto Sans Ol Chiki', 'Noto Serif Hebrew', 'Noto Sans Thaana', 'Noto Serif SC', 'Noto Serif TC', 'Noto Serif JP', 'Noto Serif KR', 'Noto Serif Thai', 'Noto Serif Lao', 'Noto Serif Khmer', 'Noto Serif Myanmar', 'Noto Serif Sinhala', 'Noto Serif Ethiopic', 'Noto Serif Georgian', 'Noto Serif Armenian', 'Noto Serif Tibetan', serif";

/* ---------- Carved textures (drawn once, shared by every podium) ---------- */

/**
 * A relief drawn as a height map (`draw(ctx, w, h)` in greys: white is raised), then lit as
 * if from the upper left into a colour map tinted with `base`, so the carving reads even
 * where the hall's lights are flat. Returns { map, bump } canvases.
 */
function relief(width, height, base, draw, { emboss = 1.6, light = [0.62, 0.5], grain = 18 } = {}) {
  const heightCanvas = document.createElement('canvas');
  heightCanvas.width = width;
  heightCanvas.height = height;
  const hctx = heightCanvas.getContext('2d', { willReadFrequently: true });
  draw(hctx, width, height);
  // Soften the carving's edges, as chisel and wear do.
  const soft = document.createElement('canvas');
  soft.width = width;
  soft.height = height;
  const sctx = soft.getContext('2d', { willReadFrequently: true });
  sctx.filter = 'blur(1.5px)';
  sctx.drawImage(heightCanvas, 0, 0);
  const heights = sctx.getImageData(0, 0, width, height).data;
  const at = (x, y) => heights[(((y + height) % height) * width + ((x + width) % width)) * 4] / 255;
  const colour = document.createElement('canvas');
  colour.width = width;
  colour.height = height;
  const cctx = colour.getContext('2d');
  const image = cctx.createImageData(width, height);
  const [r0, g0, b0] = base;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const h = at(x, y);
      const slope = (at(x - 1, y) - at(x + 1, y)) * light[0] + (at(x, y - 1) - at(x, y + 1)) * light[1];
      const shade = 0.58 + 0.5 * h + slope * emboss * 4;
      const noise = (Math.random() - 0.5) * grain;
      const i = (y * width + x) * 4;
      image.data[i] = Math.min(255, Math.max(0, r0 * shade + noise));
      image.data[i + 1] = Math.min(255, Math.max(0, g0 * shade + noise));
      image.data[i + 2] = Math.min(255, Math.max(0, b0 * shade + noise * 0.8));
      image.data[i + 3] = 255;
    }
  }
  cctx.putImageData(image, 0, 0);
  return { map: colour, bump: soft };
}

const grey = (value) => `rgb(${value * 255},${value * 255},${value * 255})`;

/** Arched niches, each holding a raised lotus medallion, between pilasters and mouldings. */
function drawCarvedPanels(ctx, w, h) {
  ctx.fillStyle = grey(0.5);
  ctx.fillRect(0, 0, w, h);
  const panels = 6;
  const pw = w / panels;
  // Mouldings along the top and bottom.
  for (const [y, t, v] of [[0, 0.07, 0.85], [0.08, 0.03, 0.65], [0.89, 0.03, 0.65], [0.93, 0.07, 0.85]]) {
    ctx.fillStyle = grey(v);
    ctx.fillRect(0, y * h, w, t * h);
  }
  for (let p = 0; p < panels; p += 1) {
    const x0 = p * pw;
    const cx = x0 + pw / 2;
    // Pilaster between panels.
    ctx.fillStyle = grey(0.78);
    ctx.fillRect(x0, 0.12 * h, pw * 0.07, 0.76 * h);
    // The recessed, arched niche.
    const nx = x0 + pw * 0.14;
    const nw = pw * 0.79;
    const top = 0.2 * h;
    const bottom = 0.84 * h;
    ctx.fillStyle = grey(0.22);
    ctx.beginPath();
    ctx.moveTo(nx, bottom);
    ctx.lineTo(nx, top + nw * 0.32);
    ctx.quadraticCurveTo(nx, top, cx, top - 0.02 * h);
    ctx.quadraticCurveTo(nx + nw, top, nx + nw, top + nw * 0.32);
    ctx.lineTo(nx + nw, bottom);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = grey(0.7);
    ctx.lineWidth = 3;
    ctx.stroke();
    // A lotus medallion: a ring of petals round a raised boss.
    const cy = (top + bottom) / 2 + 0.03 * h;
    const radius = Math.min(nw, bottom - top) * 0.36;
    for (let i = 0; i < 12; i += 1) {
      const a = (i / 12) * Math.PI * 2;
      ctx.save();
      ctx.translate(cx + Math.cos(a) * radius * 0.55, cy + Math.sin(a) * radius * 0.55);
      ctx.rotate(a);
      const petal = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 0.5);
      petal.addColorStop(0, grey(0.95));
      petal.addColorStop(1, grey(0.55));
      ctx.fillStyle = petal;
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 0.48, radius * 0.17, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    const boss = ctx.createRadialGradient(cx - radius * 0.08, cy - radius * 0.08, 0, cx, cy, radius * 0.32);
    boss.addColorStop(0, grey(1));
    boss.addColorStop(1, grey(0.6));
    ctx.fillStyle = boss;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.3, 0, Math.PI * 2);
    ctx.fill();
    // A small bud above and below.
    for (const dy of [-1, 1]) {
      ctx.fillStyle = grey(0.82);
      ctx.beginPath();
      ctx.ellipse(cx, cy + dy * radius * 1.05, radius * 0.1, radius * 0.16, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/** Gold filigree: rails along both edges and a running scroll of tendrils and beads between them. */
function drawFiligree(ctx, w, h) {
  ctx.fillStyle = grey(0.35);
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = grey(0.95);
  ctx.fillRect(0, 0, w, h * 0.12);
  ctx.fillRect(0, h * 0.88, w, h * 0.12);
  ctx.strokeStyle = grey(0.95);
  ctx.lineCap = 'round';
  const period = h * 2.2;
  const mid = h / 2;
  const amp = h * 0.24;
  for (let x = -period; x < w + period; x += period) {
    ctx.lineWidth = h * 0.08;
    ctx.beginPath();
    ctx.moveTo(x, mid);
    ctx.bezierCurveTo(x + period * 0.25, mid - amp * 1.6, x + period * 0.25, mid + amp * 1.6, x + period * 0.5, mid);
    ctx.bezierCurveTo(x + period * 0.75, mid - amp * 1.6, x + period * 0.75, mid + amp * 1.6, x + period, mid);
    ctx.stroke();
    // Curling tendrils off the scroll, alternately up and down.
    ctx.lineWidth = h * 0.05;
    for (const [dx, dir] of [[0.25, -1], [0.75, 1]]) {
      const cx = x + period * dx;
      const cy = mid + dir * amp * 0.9;
      ctx.beginPath();
      ctx.arc(cx, cy, amp * 0.55, 0, Math.PI * 1.5 * (dir > 0 ? 1 : -1), dir < 0);
      ctx.stroke();
      ctx.fillStyle = grey(1);
      ctx.beginPath();
      ctx.arc(cx, cy, h * 0.05, 0, Math.PI * 2);
      ctx.fill();
    }
    // Beads on the rails.
    for (let b = 0; b < 4; b += 1) {
      ctx.fillStyle = grey(1);
      for (const y of [h * 0.06, h * 0.94]) {
        ctx.beginPath();
        ctx.arc(x + (b + 0.5) * (period / 4), y, h * 0.045, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

let sharedTextures = null;
/** The carved panels and filigree, drawn the first time a podium is built. */
function podiumTextures(track) {
  if (sharedTextures) return sharedTextures;
  const texture = (canvas, repeat, colour) => {
    const result = track(new THREE.CanvasTexture(canvas));
    if (colour) result.colorSpace = THREE.SRGBColorSpace;
    result.wrapS = THREE.RepeatWrapping;
    result.repeat.set(repeat, 1);
    result.anisotropy = 4;
    return result;
  };
  const carved = relief(1536, 384, [196, 166, 128], drawCarvedPanels, { emboss: 1.8 });
  const filigree = relief(1024, 64, [226, 172, 74], drawFiligree, { emboss: 1.2, grain: 10 });
  sharedTextures = {
    carved: { map: texture(carved.map, 2, true), bump: texture(carved.bump, 2) },
    filigree: { map: texture(filigree.map, 10, true), bump: texture(filigree.bump, 10) },
    beam: track(new THREE.CanvasTexture(beamGradient())),
  };
  return sharedTextures;
}

/** The light beam's falloff (bright towards the podium, fading into the dome; soft at its edges). */
function beamGradient() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const vertical = ctx.createLinearGradient(0, 0, 0, 256);
  vertical.addColorStop(0, 'rgba(255,214,150,0)');
  vertical.addColorStop(0.35, 'rgba(255,214,150,0.45)');
  vertical.addColorStop(0.9, 'rgba(255,222,165,1)');
  vertical.addColorStop(1, 'rgba(255,222,165,0)');
  ctx.fillStyle = vertical;
  ctx.fillRect(0, 0, 64, 256);
  // Fade the beam's sides (u wraps round the cone, so fade in a band of each half turn).
  const sides = ctx.createLinearGradient(0, 0, 64, 0);
  sides.addColorStop(0, 'rgba(0,0,0,1)');
  sides.addColorStop(0.25, 'rgba(0,0,0,0)');
  sides.addColorStop(0.5, 'rgba(0,0,0,1)');
  sides.addColorStop(0.75, 'rgba(0,0,0,0)');
  sides.addColorStop(1, 'rgba(0,0,0,1)');
  ctx.globalCompositeOperation = 'destination-out';
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = sides;
  ctx.fillRect(0, 0, 64, 256);
  return canvas;
}

/* ---------- The name board ---------- */

/** Fits `text` on one line at most `maxWidth` wide, shrinking from `size`; returns the font used. */
function fitFont(ctx, text, family, weight, size, maxWidth) {
  let px = size;
  do {
    ctx.font = `${weight} ${px}px ${family}`;
    px -= 2;
  } while (ctx.measureText(text).width > maxWidth && px > 12);
  return ctx.font;
}

/** The engraved brass plate: the exhibit's Tamil name and its name in the visitor's language (English or Hindi), what it is, and an invitation to read. */
function drawPlate(canvas, exhibit) {
  const ctx = canvas.getContext('2d');
  const { width: w, height: h } = canvas;
  const brass = ctx.createLinearGradient(0, 0, w, h);
  brass.addColorStop(0, '#b8893a');
  brass.addColorStop(0.35, '#f0d48a');
  brass.addColorStop(0.55, '#d6ad5c');
  brass.addColorStop(1, '#9c7130');
  ctx.fillStyle = brass;
  ctx.fillRect(0, 0, w, h);
  // Brushed grain.
  ctx.globalAlpha = 0.08;
  for (let y = 0; y < h; y += 2) {
    ctx.fillStyle = Math.random() < 0.5 ? '#fff6d8' : '#6a4a18';
    ctx.fillRect(0, y, w, 1);
  }
  ctx.globalAlpha = 1;
  // Engraved double border with corner curls.
  ctx.strokeStyle = '#5a3a10';
  ctx.lineWidth = 6;
  ctx.strokeRect(22, 22, w - 44, h - 44);
  ctx.lineWidth = 2;
  ctx.strokeRect(38, 38, w - 76, h - 76);
  for (const [x, y, sx, sy] of [[38, 38, 1, 1], [w - 38, 38, -1, 1], [38, h - 38, 1, -1], [w - 38, h - 38, -1, -1]]) {
    ctx.beginPath();
    ctx.arc(x + sx * 26, y + sy * 26, 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + sx * 26, y + sy * 26, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#5a3a10';
    ctx.fill();
  }
  const engrave = (text, y, font) => {
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff3c8';
    ctx.globalAlpha = 0.55;
    ctx.fillText(text, w / 2 + 1.5, y + 2); // the cut's lit lower edge
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#3a2206';
    ctx.fillText(text, w / 2, y);
  };
  const inner = w - 150;
  engrave(exhibit.ta, h * 0.27, fitFont(ctx, exhibit.ta, TAMIL_FONT, 'bold', 88, inner));
  const title = translate(exhibit.title);
  engrave(title, h * 0.47, fitFont(ctx, title, SERIF_FONT, 'bold', 70, inner));
  // A small diamond-and-rule ornament.
  ctx.fillStyle = '#5a3a10';
  ctx.fillRect(w / 2 - 150, h * 0.585, 120, 3);
  ctx.fillRect(w / 2 + 30, h * 0.585, 120, 3);
  ctx.save();
  ctx.translate(w / 2, h * 0.587);
  ctx.rotate(Math.PI / 4);
  ctx.fillRect(-9, -9, 18, 18);
  ctx.restore();
  const detail = (translate(exhibit.detail) ?? '').toUpperCase();
  if (detail) engrave(detail, h * 0.68, fitFont(ctx, detail, 'Georgia, serif', '600', 30, inner));
  const invitation = `படிக்கத் தொடுக  ·  ${tri('TAP TO READ', 'TAP TO READ', 'पढ़ने के लिए छुएँ')}  ›`;
  engrave(invitation, h * 0.83, fitFont(ctx, invitation, TAMIL_FONT, 'bold', 30, inner));
}

/**
 * The stand: a round brass foot, a turned teak post and a teak lectern frame holding the
 * brass plate, tilted back to be read. Returns { group, plate (the plate's material, which
 * glows on hover), target (the mesh to hit-test) }.
 */
function buildBoard(exhibit, { gold, hitMaterial, track }) {
  const group = new THREE.Group();
  group.position.set(BOARD.x, 0, BOARD.z);
  group.rotation.y = BOARD.yaw;
  const teak = track(new THREE.MeshStandardMaterial({ color: '#5a3216', roughness: 0.45, metalness: 0.05 }));
  const add = (geometry, material, x, y, z) => {
    const mesh = new THREE.Mesh(track(geometry), material);
    mesh.position.set(x, y, z);
    group.add(mesh);
    return mesh;
  };
  add(new THREE.CylinderGeometry(0.2, 0.24, 0.05, 32), gold, 0, 0.025, 0);
  add(new THREE.CylinderGeometry(0.12, 0.17, 0.08, 24), teak, 0, 0.09, 0);
  add(new THREE.CylinderGeometry(0.035, 0.045, BOARD.height - 0.2, 16), teak, 0, (BOARD.height - 0.2) / 2 + 0.12, 0);
  for (const y of [0.16, BOARD.height - 0.12]) add(new THREE.TorusGeometry(0.05, 0.012, 8, 20), gold, 0, y, 0).rotation.x = Math.PI / 2;

  const lectern = new THREE.Group();
  lectern.position.set(0, BOARD.height, 0);
  lectern.rotation.x = -BOARD.tilt; // leaning back, its face towards the reader
  group.add(lectern);
  const frame = new THREE.Mesh(track(new THREE.BoxGeometry(BOARD.width + 0.08, BOARD.depth + 0.08, 0.05)), teak);
  lectern.add(frame);
  const edge = new THREE.Mesh(track(new THREE.BoxGeometry(BOARD.width + 0.02, BOARD.depth + 0.02, 0.054)), gold);
  edge.scale.z = 0.98;
  lectern.add(edge);
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = Math.round((1024 * BOARD.depth) / BOARD.width);
  drawPlate(canvas, exhibit);
  const map = track(new THREE.CanvasTexture(canvas));
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  const redraw = () => {
    drawPlate(canvas, exhibit);
    map.needsUpdate = true;
  };
  // Redraw once the web fonts have arrived, if they were not ready.
  document.fonts?.ready.then(redraw);
  const plate = track(new THREE.MeshStandardMaterial({ map, metalness: 0.55, roughness: 0.38, emissive: '#ffffff', emissiveMap: map, emissiveIntensity: 0.18 }));
  const face = new THREE.Mesh(track(new THREE.PlaneGeometry(BOARD.width, BOARD.depth)), plate);
  face.position.z = 0.03;
  lectern.add(face);

  // An easy target: the whole stand, taller and wider than its slim parts.
  const target = new THREE.Mesh(track(new THREE.BoxGeometry(BOARD.width + 0.25, BOARD.height + 0.5, 0.6)), hitMaterial);
  target.position.y = (BOARD.height + 0.5) / 2;
  group.add(target);
  return { group, plate, target, relabel: redraw };
}

/* ---------- The podium and its model ---------- */

/**
 * Adds the podium to `parent` (at its origin), in the building's `stone` and `gold`, for
 * `exhibit` (HALL_EXHIBITS: its names, and `model` { url, height }), with its name board.
 * `ceilingY` is where the beam of light starts. Returns `load(onDone)`, which fetches the
 * model onto it (once; the scans are megabytes each, so the building loads them as their
 * halls come into view), `board` (the mesh to hit-test for the card), `update(dt, hovered)`
 * for every frame (the board glows while the pointer is on it) and `dispose()`.
 */
export function addHallFigure(parent, { exhibit, stone, gold, hitMaterial, ceilingY, track }) {
  const spec = exhibit.model;
  const root = new THREE.Group();
  parent.add(root);
  const textures = podiumTextures(track);
  const part = (geometry, material, y) => {
    const mesh = new THREE.Mesh(track(geometry), material);
    mesh.position.y = y;
    root.add(mesh);
    return mesh;
  };
  const carvedStone = track(new THREE.MeshStandardMaterial({ map: textures.carved.map, bumpMap: textures.carved.bump, bumpScale: 2.2, roughness: 0.78, dithering: true }));
  const filigree = track(new THREE.MeshStandardMaterial({ map: textures.filigree.map, bumpMap: textures.filigree.bump, bumpScale: 1.5, metalness: 0.85, roughness: 0.3, emissive: '#3a2508', emissiveIntensity: 0.45 }));
  // Crimson velvet: deep and matt, with the soft sheen velvet has at grazing angles.
  const velvet = track(new THREE.MeshPhysicalMaterial({ color: '#3a0410', roughness: 0.97, sheen: 0.8, sheenColor: new THREE.Color('#a8243e'), sheenRoughness: 0.6 }));

  /* The podium, from the floor up (its top at FIGURE_PEDESTAL.height). */
  const { radius, top, height } = FIGURE_PEDESTAL;
  part(new THREE.CylinderGeometry(radius - 0.03, radius, 0.16, 64), stone, 0.08);
  part(new THREE.CylinderGeometry(radius - 0.07, radius - 0.05, 0.06, 64, 1, true), filigree, 0.19);
  part(new THREE.CylinderGeometry(top - 0.05, top - 0.02, 0.06, 64), stone, 0.19);
  part(new THREE.CylinderGeometry(top - 0.06, top - 0.04, 0.58, 64, 1, true), carvedStone, 0.51);
  part(new THREE.CylinderGeometry(top, top, 0.07, 64, 1, true), filigree, 0.835);
  part(new THREE.CylinderGeometry(top - 0.01, top - 0.01, 0.07, 64), stone, 0.835);
  part(new THREE.CylinderGeometry(top + 0.06, top + 0.02, 0.1, 64), stone, 0.92);
  part(new THREE.TorusGeometry(top + 0.06, 0.018, 10, 96), gold, 0.97).rotation.x = Math.PI / 2;
  part(new THREE.CylinderGeometry(top - 0.02, top + 0.01, 0.03, 64), velvet, height - 0.015);
  part(new THREE.TorusGeometry(top - 0.01, 0.014, 10, 96), gold, height).rotation.x = Math.PI / 2;

  /* A soft beam of warm light from the dome onto the podium (the light itself is the hall's spot). */
  const beamHeight = ceilingY - height - 0.3;
  const beam = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.35, top + 0.15, beamHeight, 48, 1, true)),
    track(new THREE.MeshBasicMaterial({ map: textures.beam, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })),
  );
  beam.position.y = height + beamHeight / 2;
  beam.renderOrder = 2;
  root.add(beam);

  /* The name board. */
  const board = buildBoard(exhibit, { gold, hitMaterial, track });
  root.add(board.group);

  const figure = new THREE.Group();
  figure.position.y = height;
  // It faces the hall's first arch (down -z): the way in from the hub or the hall before,
  // so the visitor arriving, or turning from the wings back to the door, sees it from the front.
  figure.rotation.y = Math.PI;
  root.add(figure);

  let disposed = false;
  let requested = false;
  const load = (onDone) => {
    if (requested) return;
    requested = true;
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(spec.url, (gltf) => {
      if (!disposed) place(gltf);
      onDone?.();
    }, undefined, (error) => {
      // The hall carries on with the podium alone.
      if (!disposed) console.warn(`Hall model unavailable (${spec.url}):`, error);
      onDone?.();
    });
  };
  const place = (gltf) => {
    const model = gltf.scene;
    model.updateMatrixWorld(true);
    // Its height, and its reach from its own vertical axis (some scans are wide and low).
    const box = new THREE.Box3().setFromObject(model);
    const centre = box.getCenter(new THREE.Vector3());
    let reach = 0;
    const point = new THREE.Vector3();
    model.traverse((object) => {
      if (!object.isMesh) return;
      const positions = object.geometry.getAttribute('position');
      for (let i = 0; i < positions.count; i += 1) {
        point.fromBufferAttribute(positions, i).applyMatrix4(object.matrixWorld);
        reach = Math.max(reach, Math.hypot(point.x - centre.x, point.z - centre.z));
      }
    });
    const scale = Math.min(spec.height / (box.max.y - box.min.y), FIT_RADIUS / reach);
    model.scale.setScalar(scale);
    model.position.set(-centre.x * scale, -box.min.y * scale, -centre.z * scale);
    model.traverse((object) => {
      if (!object.isMesh) return;
      track(object.geometry);
      const material = track(object.material);
      for (const key of ['map', 'normalMap', 'metalnessMap', 'roughnessMap']) if (material[key]) track(material[key]);
      material.side = THREE.FrontSide; // the scans are closed; back faces only cost fill
      // The hall's environment is dim (scene.environmentIntensity), and a metallic
      // surface shows little else: raise its reflections so the bronze reads warm.
      material.envMapIntensity = 2.4;
    });
    figure.add(model);
  };

  const spring = { value: 0, velocity: 0 };
  return {
    load,
    get requested() {
      return requested;
    },
    /** The name board's hit target: choosing it opens the exhibit's card. */
    board: board.target,
    /** Hover on the board: an under-damped spring (as the Thiruvalluvar statue's) brightening its brass and lifting it a touch. */
    update(dt, hovered) {
      const step = Math.min(dt, 0.05);
      spring.velocity += (((hovered ? 1 : 0) - spring.value) * 120 - spring.velocity * 12) * step;
      spring.value += spring.velocity * step;
      const glow = Math.max(0, spring.value);
      board.plate.emissiveIntensity = 0.18 + glow * 0.45;
      board.group.scale.setScalar(1 + spring.value * 0.04);
    },
    /** Re-engraves the board in the museum's current language. */
    relabel: board.relabel,
    dispose() {
      disposed = true;
      parent.remove(root);
    },
  };
}
