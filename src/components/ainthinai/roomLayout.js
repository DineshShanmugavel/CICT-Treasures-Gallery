/*
 * The Five Landscapes room's plan, in metres. The visitor comes in through the arched
 * doorway in the south wall (+z), from the ring hall's arch. Ahead, the five glass cases
 * stand in an arc round a great brass Nilavilakku; the landscape photographs hang in the
 * five arches of the far (north) wall; the bookcases of poetry stand in the west wall's
 * arches, and the curators' food notes and the Ainthinai chart in the east wall's.
 *
 *            photographs ×5 (north wall)
 *     ┌───────────────────────────────────┐
 *     │                                   │
 *  poems      Kurinji … Palai cases     food notes
 *     │            (arc)                  │
 *  by-landscape     ✦ lamp            chart
 *     │                                   │
 *     └──────────────┐  door  ┌───────────┘
 */

export const ROOM = { width: 18, depth: 22, height: 7.5 };
export const HALF_W = ROOM.width / 2;
export const HALF_D = ROOM.depth / 2;
export const DOOR = { width: 3, height: 4.6 };
export const EYE = 1.7;

/** The great lamp at the centre of the arc, and of the floor's lotus medallion. */
export const CENTRE = [0, 0, 2];

/** The glass cases: on an arc of radius 5 round the lamp, from west to east, each facing it. */
const ARC_RADIUS = 5;
export const CASE_SPOTS = [150, 120, 90, 60, 30].map((degrees) => {
  const a = (degrees * Math.PI) / 180;
  const x = ARC_RADIUS * Math.cos(a);
  const z = CENTRE[2] - ARC_RADIUS * Math.sin(a);
  return { position: [x, 0, z], yaw: Math.atan2(CENTRE[0] - x, CENTRE[2] - z) };
});
export const CASE = { plinth: 0.95, glass: [0.95, 0.78, 0.95] };
/** Where a case's model sits: the middle of its glass, as seen. */
export const MODEL_CENTRE_Y = CASE.plinth + 0.36;

/** Walls' bays: the north wall's five photographs, the west wall's two bookcases, the east wall's food notes and chart. */
export const NORTH_BAYS = [-6.4, -3.2, 0, 3.2, 6.4];
export const SIDE_BAYS = [-5, 1.5];
export const BOOKCASE = { width: 2.8, height: 3.5, depth: 0.42, shelves: 4 };

/**
 * What the visitor can step up to: where the camera looks (`target`), the way it faces out
 * of the wall or case (`normal`), and how far back it stands.
 */
const wallStation = (target, normal, distance, eye) => ({ target, normal, distance, eye });
export const stationFor = {
  bookcase: (x, z) => wallStation([x, 2.2, z], [Math.sign(-x), 0, 0], 4.3),
  chart: (z) => wallStation([HALF_W - 0.1, 2.6, z], [-1, 0, 0], 4.6, 2.2),
  // From above the cases' tops, far enough back to take in all five arches.
  photographs: () => wallStation([0, 2.7, -HALF_D], [0, 0, 1], 10.2, 3.15),
  case: ({ position: [x, , z], yaw }) => ({ target: [x, MODEL_CENTRE_Y, z], normal: [Math.sin(yaw), 0, Math.cos(yaw)], distance: 1.75, orbit: true }),
};

/** The view from the doorway, outside the room, and the opening view across it. */
export const DOORWAY_VIEW = { position: [0, EYE, HALF_D + 4], target: [0, 1.8, HALF_D - 6] };
// A little off the axis and above eye height, so the great lamp does not hide the middle case.
export const OVERVIEW = { position: [0.8, 3.4, HALF_D - 1.4], target: [0, 1.2, -2] };
