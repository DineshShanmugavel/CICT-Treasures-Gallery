/*
 * Gilding for the hall's paintings: the cream and sand-coloured motifs of a picture (the
 * frieze's silhouettes, the alcove reliefs, the banners' emblems, the podium's lotuses) are
 * recoloured as gold leaf, keeping their shading, while the red grounds they are painted on
 * are left as they are. Works on a canvas in place; transparency is kept.
 */

/** The gold, from shadow to highlight, by the original pixel's lightness (0–1). */
const GOLD_RAMP = [
  [0.0, [74, 44, 8]],
  [0.35, [128, 84, 18]],
  [0.6, [196, 145, 44]],
  [0.82, [232, 186, 82]],
  [1.0, [252, 226, 150]],
];

const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function goldAt(lightness) {
  for (let i = 1; i < GOLD_RAMP.length; i += 1) {
    const [l1, c1] = GOLD_RAMP[i];
    if (lightness <= l1) {
      const [l0, c0] = GOLD_RAMP[i - 1];
      const t = (lightness - l0) / (l1 - l0);
      return c0.map((c, k) => c + (c1[k] - c) * t);
    }
  }
  return GOLD_RAMP[GOLD_RAMP.length - 1][1];
}

/**
 * Gilds the light, warm-neutral parts of the picture on `ctx`. A pixel counts as part of
 * a motif by how far its green keeps up with its red (cream and sand do; red ochre doesn't)
 * and by its lightness; motifs blend into gold smoothly at their edges. With `all`, the
 * whole picture is gilded (a relief carved all in sand), keeping only its shading.
 */
export function gildPainting(ctx, w, h, { all = false } = {}) {
  const image = ctx.getImageData(0, 0, w, h);
  const { data } = image;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const motif = all ? 1 : smoothstep(0.5, 0.7, g / Math.max(r, 1)) * smoothstep(0.22, 0.42, lightness);
    if (motif <= 0) continue;
    const gold = goldAt(lightness);
    data[i] = r + (gold[0] - r) * motif;
    data[i + 1] = g + (gold[1] - g) * motif;
    data[i + 2] = b + (gold[2] - b) * motif;
  }
  ctx.putImageData(image, 0, 0);
}
