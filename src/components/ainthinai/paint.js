import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { GOLD, SERIF_FONT, TAMIL_FONT, seededRandom } from '../hallway/createHallwayScene.js';
import { anisotropyFor } from '../../pixelRatio.js';
import { scriptFontsReady, translate, useI18nKey } from '../../i18n/index.js';

/*
 * Canvas-painted textures for the Five Landscapes room, in the hallway's manner: nothing to
 * download, the same stone and gilt. Lettered textures are painted again once the web
 * fonts have loaded, so Tamil never shows in a fallback face.
 */

/**
 * A texture painted by `draw(ctx, width, height)`, repainted when `key` changes and once
 * the fonts are ready. `repeat` tiles it ([u, v]). A `lettered` texture is also repainted when
 * the museum's language changes (its English is drawn through `translate`, so it turns Hindi).
 */
export function usePainted(width, height, draw, key = '', { repeat = null, lettered = false } = {}) {
  const gl = useThree((state) => state.gl);
  const languageKey = useI18nKey();
  const fullKey = lettered ? `${key}|${languageKey}` : key;
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    draw(canvas.getContext('2d'), width, height);
    const result = new THREE.CanvasTexture(canvas);
    result.colorSpace = THREE.SRGBColorSpace;
    result.anisotropy = anisotropyFor(gl);
    if (repeat) {
      result.wrapS = result.wrapT = THREE.RepeatWrapping;
      result.repeat.set(...repeat);
    }
    return result;
  }, [width, height, fullKey]); // eslint-disable-line react-hooks/exhaustive-deps -- `key` names what `draw` paints
  useEffect(() => {
    if (!lettered || !document.fonts?.ready) return undefined;
    let live = true;
    // A script's web font is fetched only when first used, so ask for it before repainting.
    Promise.all([document.fonts.ready, scriptFontsReady()]).then(() => {
      if (!live) return;
      const canvas = texture.image;
      const ctx = canvas.getContext('2d');
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      draw(ctx, canvas.width, canvas.height);
      texture.needsUpdate = true;
    });
    return () => { live = false; };
  }, [texture, lettered]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

/** Writes `text` at (x, y), shrinking the font from `size` until it fits `maxWidth`. */
export function fitText(ctx, text, x, y, maxWidth, size, family, weight = 'bold') {
  let px = size;
  ctx.font = `${weight} ${px}px ${family}`;
  while (px > 8 && ctx.measureText(text).width > maxWidth) {
    px -= 1;
    ctx.font = `${weight} ${px}px ${family}`;
  }
  ctx.fillText(text, x, y);
  return px;
}

const LEATHERS = ['#5a1a12', '#6b2a14', '#3a2410', '#24301e', '#2a2238', '#5a3a12', '#401818', '#173236'];
/** A book's leather, the same every visit: picked from its id. */
export function leatherFor(id) {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return LEATHERS[Math.abs(hash) % LEATHERS.length];
}

/** A book's spine (drawn upright): leather, gilt bands, its Tamil title and its English one, set along it. */
export function drawSpine(book, leather) {
  return (ctx, w, h) => {
    const rand = seededRandom(book.id.length * 97 + h);
    ctx.fillStyle = leather;
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 900; i += 1) {
      ctx.fillStyle = rand() > 0.5 ? '#ffffff0d' : '#0000001a';
      ctx.fillRect(rand() * w, rand() * h, 2, 2);
    }
    const shade = ctx.createLinearGradient(0, 0, w, 0);
    shade.addColorStop(0, '#0000007a');
    shade.addColorStop(0.35, '#ffffff14');
    shade.addColorStop(0.65, '#00000000');
    shade.addColorStop(1, '#00000080');
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = GOLD;
    for (const y of [0.05, 0.075, 0.925, 0.95]) ctx.fillRect(0, h * y, w, h * 0.008);
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#f2d38b';
    const length = h * 0.78;
    fitText(ctx, book.tamil ?? book.title, 0, -w * 0.17, length, Math.round(w * 0.3), TAMIL_FONT);
    ctx.fillStyle = '#e6c27a';
    fitText(ctx, translate(book.title), 0, w * 0.22, length, Math.round(w * 0.22), SERIF_FONT, '600');
    ctx.restore();
  };
}

/** A book's front cover, for one shown face-out: a gilt-ruled panel round its titles. */
export function drawCover(book, leather) {
  return (ctx, w, h) => {
    ctx.fillStyle = leather;
    ctx.fillRect(0, 0, w, h);
    const glow = ctx.createRadialGradient(w / 2, h * 0.4, 0, w / 2, h * 0.4, w);
    glow.addColorStop(0, '#ffffff1c');
    glow.addColorStop(1, '#00000055');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = w * 0.012;
    ctx.strokeRect(w * 0.07, h * 0.05, w * 0.86, h * 0.9);
    ctx.lineWidth = w * 0.005;
    ctx.strokeRect(w * 0.1, h * 0.07, w * 0.8, h * 0.86);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#f2d38b';
    // The Tamil title over up to three lines, then the English one under a rule.
    const words = (book.tamil ?? book.title).split(/\s+/);
    const lines = [];
    ctx.font = `bold ${Math.round(w * 0.1)}px ${TAMIL_FONT}`;
    for (const word of words) {
      const last = lines[lines.length - 1];
      if (last && ctx.measureText(`${last} ${word}`).width < w * 0.72) lines[lines.length - 1] = `${last} ${word}`;
      else lines.push(word);
    }
    lines.slice(0, 4).forEach((line, i) => fitText(ctx, line, w / 2, h * (0.28 + i * 0.1), w * 0.74, Math.round(w * 0.1), TAMIL_FONT));
    ctx.fillStyle = GOLD;
    ctx.fillRect(w * 0.35, h * 0.68, w * 0.3, h * 0.006);
    ctx.fillStyle = '#ead9b8';
    fitText(ctx, translate(book.title), w / 2, h * 0.76, w * 0.74, Math.round(w * 0.075), SERIF_FONT, '600');
  };
}

/** A brass plaque: the Tamil name over the English, on a dark lacquered ground in a gilt rule. */
export function drawPlaque(tamil, english, detail = '') {
  return (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#3a1e0c');
    g.addColorStop(1, '#1e0f06');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = h * 0.04;
    ctx.strokeRect(h * 0.06, h * 0.06, w - h * 0.12, h - h * 0.12);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#f2d38b';
    fitText(ctx, tamil, w / 2, h * (detail ? 0.3 : 0.36), w * 0.86, Math.round(h * 0.26), TAMIL_FONT);
    ctx.fillStyle = '#ead9b8';
    fitText(ctx, translate(english), w / 2, h * (detail ? 0.56 : 0.68), w * 0.86, Math.round(h * 0.2), SERIF_FONT, '700');
    if (detail) {
      ctx.fillStyle = '#c9a679';
      fitText(ctx, translate(detail), w / 2, h * 0.78, w * 0.86, Math.round(h * 0.12), SERIF_FONT, 'italic 600');
    }
  };
}

/**
 * The Ainthinai chart: one column for each landscape, one row for each of its elements, in
 * Tamil over English, on cream plaster in a red and gilt border.
 */
export function drawChart(landscapes, rows) {
  return (ctx, w, h) => {
    ctx.fillStyle = '#efdcb6';
    ctx.fillRect(0, 0, w, h);
    const rand = seededRandom(5);
    for (let i = 0; i < 4000; i += 1) {
      ctx.fillStyle = rand() > 0.5 ? '#ffffff22' : '#7a5a3518';
      ctx.fillRect(rand() * w, rand() * h, 2, 2);
    }
    const border = h * 0.035;
    ctx.fillStyle = '#8a2a1e';
    ctx.fillRect(0, 0, w, border);
    ctx.fillRect(0, h - border, w, border);
    ctx.fillRect(0, 0, border, h);
    ctx.fillRect(w - border, 0, border, h);
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = h * 0.006;
    ctx.strokeRect(border * 1.3, border * 1.3, w - border * 2.6, h - border * 2.6);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#7d2e14';
    fitText(ctx, 'ஐந்திணை — முதல், கருப்பொருள், உரிப்பொருள்', w / 2, h * 0.1, w * 0.8, Math.round(h * 0.055), TAMIL_FONT);
    ctx.fillStyle = '#4a2410';
    fitText(ctx, translate('The Five Landscapes — Their Elements', 'पाँच भू-दृश्य — उनके तत्व'), w / 2, h * 0.17, w * 0.8, Math.round(h * 0.045), SERIF_FONT, '700');
    const top = h * 0.23;
    const bottom = h * 0.92;
    const left = w * 0.06;
    const headWidth = w * 0.17;
    const colWidth = (w * 0.94 - left - headWidth) / landscapes.length;
    const rowHeight = (bottom - top) / (rows.length + 1);
    ctx.strokeStyle = '#8c715488';
    ctx.lineWidth = 2;
    for (let r = 0; r <= rows.length + 1; r += 1) {
      ctx.beginPath();
      ctx.moveTo(left, top + r * rowHeight);
      ctx.lineTo(w * 0.94, top + r * rowHeight);
      ctx.stroke();
    }
    landscapes.forEach((landscape, c) => {
      const x = left + headWidth + (c + 0.5) * colWidth;
      ctx.fillStyle = '#7d2e14';
      fitText(ctx, landscape.tamil, x, top + rowHeight * 0.38, colWidth * 0.92, Math.round(rowHeight * 0.36), TAMIL_FONT);
      ctx.fillStyle = '#4a2410';
      fitText(ctx, translate(landscape.key), x, top + rowHeight * 0.74, colWidth * 0.92, Math.round(rowHeight * 0.26), SERIF_FONT, '700');
      rows.forEach(([, , field], r) => {
        const y = top + (r + 1) * rowHeight;
        const [english, tamil] = landscape[field];
        ctx.fillStyle = '#5a2a10';
        fitText(ctx, tamil, x, y + rowHeight * 0.36, colWidth * 0.92, Math.round(rowHeight * 0.3), TAMIL_FONT);
        ctx.fillStyle = '#4a3420';
        fitText(ctx, translate(english), x, y + rowHeight * 0.72, colWidth * 0.92, Math.round(rowHeight * 0.22), SERIF_FONT, '600');
      });
    });
    rows.forEach(([english, tamil], r) => {
      const y = top + (r + 1) * rowHeight;
      ctx.fillStyle = '#7d2e14';
      fitText(ctx, tamil, left + headWidth / 2, y + rowHeight * 0.36, headWidth * 0.9, Math.round(rowHeight * 0.28), TAMIL_FONT);
      ctx.fillStyle = '#4a2410';
      fitText(ctx, translate(english), left + headWidth / 2, y + rowHeight * 0.72, headWidth * 0.9, Math.round(rowHeight * 0.22), SERIF_FONT, '700');
    });
  };
}

/** The coffered teak ceiling: sunk square panels with a gilt lotus in each, between dark beams. */
export function drawCoffers(ctx, w, h) {
  ctx.fillStyle = '#2a1408';
  ctx.fillRect(0, 0, w, h);
  const inset = w * 0.12;
  const panel = ctx.createLinearGradient(0, inset, 0, h - inset);
  panel.addColorStop(0, '#5a3418');
  panel.addColorStop(1, '#3e2210');
  ctx.fillStyle = '#1a0c04';
  ctx.fillRect(inset - 6, inset - 6, w - 2 * inset + 12, h - 2 * inset + 12);
  ctx.fillStyle = panel;
  ctx.fillRect(inset, inset, w - 2 * inset, h - 2 * inset);
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 3;
  ctx.strokeRect(inset + 10, inset + 10, w - 2 * inset - 20, h - 2 * inset - 20);
  ctx.translate(w / 2, h / 2);
  for (let i = 0; i < 8; i += 1) {
    ctx.rotate(Math.PI / 4);
    ctx.beginPath();
    ctx.ellipse(0, -w * 0.11, w * 0.035, w * 0.1, 0, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 ? '#c99a45' : '#9b3324';
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(0, 0, w * 0.05, 0, Math.PI * 2);
  ctx.fillStyle = '#e8c77a';
  ctx.fill();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

/** The painted band under the cornice: gilt lotus petals and diamonds on temple red. */
export function drawFriezeBand(ctx, w, h) {
  ctx.fillStyle = '#7a2418';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = GOLD;
  ctx.fillRect(0, h * 0.06, w, h * 0.05);
  ctx.fillRect(0, h * 0.89, w, h * 0.05);
  const step = w / 4;
  for (let i = 0; i < 4; i += 1) {
    const x = (i + 0.5) * step;
    ctx.beginPath();
    ctx.moveTo(x, h * 0.2);
    ctx.quadraticCurveTo(x + step * 0.28, h * 0.5, x, h * 0.8);
    ctx.quadraticCurveTo(x - step * 0.28, h * 0.5, x, h * 0.2);
    ctx.fillStyle = '#d6ae62';
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, h * 0.32);
    ctx.quadraticCurveTo(x + step * 0.14, h * 0.5, x, h * 0.68);
    ctx.quadraticCurveTo(x - step * 0.14, h * 0.5, x, h * 0.32);
    ctx.fillStyle = '#9b3324';
    ctx.fill();
  }
  // Diamonds between the petals; the ones at either edge meet across the tile's seam.
  for (let i = 0; i <= 4; i += 1) {
    const dx = i * step;
    ctx.beginPath();
    ctx.moveTo(dx, h * 0.38);
    ctx.lineTo(dx + step * 0.08, h * 0.5);
    ctx.lineTo(dx, h * 0.62);
    ctx.lineTo(dx - step * 0.08, h * 0.5);
    ctx.fillStyle = '#e8c77a';
    ctx.fill();
  }
}
