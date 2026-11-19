/**
 * Non-overlapping placement for the hallway's floating labels.
 *
 * Each label wants to sit with its bottom-centre on its anchor (the projected point
 * above an arch or the statue). Labels are placed in priority order; a label that would
 * collide with one already placed, or leave the safe area between the header and the
 * wing card, is moved to the nearest free slot — stepping up or down by its own height
 * and sliding sideways — so every visible pair keeps at least `gap` pixels between them.
 * Labels that cannot fit anywhere are hidden rather than stacked.
 *
 * A displaced label keeps the slot it used last frame while that slot is still free, so it
 * does not flip between equally good slots as the camera moves.
 */

/** Vertical/horizontal nudges tried in order, as multiples of the label's own size. */
const OFFSETS = [
  [0, 0],
  [0, -1], [0, 1],
  [-0.6, 0], [0.6, 0],
  [-0.6, -1], [0.6, -1], [-0.6, 1], [0.6, 1],
  [0, -2], [0, 2],
  [-1.1, 0], [1.1, 0],
  [0, -3], [0, 3],
];

const overlaps = (a, b, gap) =>
  a.left < b.right + gap && a.right > b.left - gap && a.top < b.bottom + gap && a.bottom > b.top - gap;

/**
 * @param {Array<{ id, anchorX, anchorY, width, height, priority }>} items  visible labels (sizes already scaled)
 * @param {{ left, right, top, bottom }} area  where labels may be placed
 * @param {number} gap  minimum spacing between labels, in px
 * @param {Map<id, number>} [previous]  slot (index into OFFSETS) each label used last frame; updated in place
 * @param {Array<{ left, right, top, bottom }>} [obstacles]  screen areas no label may cover (the
 *   hall's centrepiece), treated like labels already placed; an item with `overObstacles` ignores them
 * @returns {Map<id, { x, y } | null>}  bottom-centre position for each label, or null if hidden
 */
export function layoutLabels(items, area, gap = 10, previous = new Map(), obstacles = []) {
  const placed = [];
  const result = new Map();
  const ordered = [...items].sort((a, b) => b.priority - a.priority);

  for (const item of ordered) {
    const { width, height } = item;
    const minX = area.left + width / 2;
    const maxX = area.right - width / 2;
    const minY = area.top + height;
    const maxY = area.bottom;
    if (minX > maxX || minY > maxY) {
      result.set(item.id, null);
      continue;
    }
    // Start from the anchor, pulled inside the safe area.
    const baseX = Math.min(maxX, Math.max(minX, item.anchorX));
    const baseY = Math.min(maxY, Math.max(minY, item.anchorY));

    const tryOffset = (index) => {
      const [dx, dy] = OFFSETS[index];
      const x = baseX + dx * (width + gap);
      const y = baseY + dy * (height + gap);
      if (x < minX || x > maxX || y < minY || y > maxY) return null;
      const rect = { left: x - width / 2, right: x + width / 2, top: y - height, bottom: y };
      const clear = placed.every((other) => !overlaps(rect, other, gap)) && (item.overObstacles || obstacles.every((other) => !overlaps(rect, other, 0)));
      return clear ? { x, y, rect, index } : null;
    };

    const last = previous.get(item.id);
    // Sitting on the anchor always wins; otherwise stay in last frame's slot if it is still free.
    let spot = tryOffset(0) ?? (last === undefined ? null : tryOffset(last));
    for (let i = 0; !spot && i < OFFSETS.length; i += 1) spot = tryOffset(i);
    if (spot) {
      placed.push(spot.rect);
      previous.set(item.id, spot.index);
    } else {
      previous.delete(item.id);
    }
    result.set(item.id, spot && { x: spot.x, y: spot.y });
  }
  return result;
}
