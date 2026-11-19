/*
 * Where the museum's halls stand: the plan shared by the 3D building (createHallwayScene.js)
 * and the museum map (MuseumMap.jsx), so the two always agree. Pure numbers, no three.js.
 *
 * Ground coordinates are metres: x to the east, z to the south, so −z is "up" on the map.
 * An angle is a compass bearing, clockwise from north (−z): direction2d(angle).
 */

export const TAU = Math.PI * 2;
export const APOTHEM = 11; // centre-to-wall distance of a hall, unless it has its own `apothem`
export const WALL_DEPTH = 0.9;
/**
 * A passage — the open corridor joining two halls — has no doors and no end wall: it runs
 * PASSAGE_DEPTH metres from the back of one hall's wall to the back of the other's. Every
 * passage in the museum is this long.
 */
export const PASSAGE_DEPTH = 14;

/** A hall's centre-to-wall distance. */
export const hallApothem = (spec) => spec.apothem ?? APOTHEM;
/** How far a hall reaches from its centre to the back of its walls, where a passage begins. */
export const hallReach = (spec) => hallApothem(spec) + WALL_DEPTH;
/** Centre-to-centre distance between two halls joined by a passage. */
export const hallDistance = (a, b) => hallReach(a) + PASSAGE_DEPTH + hallReach(b);

/**
 * The apothem that lets `count` halls stand round a hub of the standard size, each one
 * passage from the hub and one passage from both its neighbours: the ring closes when
 * 2·reach + P = 2·sin(π/count)·(hubReach + P + reach). For five halls that is about 19 m —
 * larger halls than the hub, which is what lets a pentagon of equal passages close.
 */
export function ringApothem(count) {
  const s = 2 * Math.sin(Math.PI / count);
  const hub = APOTHEM + WALL_DEPTH;
  return (s * (hub + PASSAGE_DEPTH) - PASSAGE_DEPTH) / (2 - s) - WALL_DEPTH;
}

export const wrapAngle = (angle) => ((angle % TAU) + TAU) % TAU;
export const shortestDelta = (from, to) => wrapAngle(to - from + Math.PI) - Math.PI;
/** The unit ground vector [x, z] for a bearing. */
export const direction2d = (angle) => [Math.sin(angle), -Math.cos(angle)];

/**
 * Lays out the building: the first hall at the origin, and each hall a passage leads to at
 * the passage's far end, turned so that its own passage faces back down the corridor. A
 * wing at index i of a hall turned by `yaw` faces the bearing i · (360° / wings) − yaw.
 * Halls joined in a ring are reached twice; the passage closing the ring must then meet the
 * far hall's arch exactly, which the halls' sizes and wing orders arrange (roomBooks.js).
 *
 * @param {Array<{ id, wings, apothem? }>} specs  the halls, the first standing at the origin
 * @returns {Map<string, { x, z, yaw, sides }>}  each reachable hall's centre, turn and number of arches
 */
export function layoutHalls(specs) {
  const byId = new Map(specs.map((spec) => [spec.id, spec]));
  const placements = new Map([[specs[0].id, { x: 0, z: 0, yaw: 0, sides: specs[0].wings.length }]]);
  for (const queue = [specs[0]]; queue.length;) {
    const spec = queue.shift();
    const placed = placements.get(spec.id);
    spec.wings.forEach((wing, index) => {
      const next = byId.get(wing.passage);
      if (!next || placements.has(next.id)) return;
      const facing = wingBearing(spec, placed, index);
      const [dx, dz] = direction2d(facing);
      const distance = hallDistance(spec, next);
      const backIndex = next.wings.findIndex((candidate) => candidate.passage === spec.id);
      placements.set(next.id, {
        x: placed.x + dx * distance,
        z: placed.z + dz * distance,
        yaw: wrapAngle(backIndex * (TAU / next.wings.length) - facing - Math.PI),
        sides: next.wings.length,
      });
      queue.push(next);
    });
  }
  return placements;
}

/** The bearing that wing `index` of hall `spec` faces, placed by `placement` (layoutHalls). */
export const wingBearing = (spec, placement, index) => index * (TAU / spec.wings.length) - placement.yaw;

/**
 * The shortest walk from hall `from` to hall `to` along the corridors, as the halls entered
 * on the way (ending with `to`); empty if already there, null if unreachable.
 */
export function routeBetween(specs, from, to) {
  if (from === to) return [];
  const byId = new Map(specs.map((spec) => [spec.id, spec]));
  const cameFrom = new Map([[from, null]]);
  for (const queue = [from]; queue.length;) {
    const id = queue.shift();
    for (const wing of byId.get(id)?.wings ?? []) {
      if (!wing.passage || cameFrom.has(wing.passage)) continue;
      cameFrom.set(wing.passage, id);
      if (wing.passage === to) {
        const route = [];
        for (let step = to; step !== from; step = cameFrom.get(step)) route.unshift(step);
        return route;
      }
      queue.push(wing.passage);
    }
  }
  return null;
}
