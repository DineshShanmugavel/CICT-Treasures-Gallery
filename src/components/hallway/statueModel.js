/*
 * The Thiruvalluvar statue's model and how it sits on its pedestal, shared by the 3D hall
 * (hallStatue.js) and the Arches view's stage (ThiruvalluvarStatue.jsx). Kept apart from
 * that component so the hall can use them without loading React Three Fiber and drei, or
 * triggering the component's model preload: the model would be downloaded and decoded twice.
 */
import { mediaUrl } from '../../mediaUrl.js';

/**
 * Web copy of public/models/Thiruvalluvarstatue.glb: welded, simplified to ~170k
 * triangles, and meshopt-compressed (173 MB → 0.5 MB). The original scan is kept alongside.
 */
export const STATUE_MODEL_URL = mediaUrl('/models/Thiruvalluvarstatue.web.glb');

/*
 * The scan stands on a warped base plate: flat underneath, but its top wanders between 0 and
 * 5.5 cm and thins to nothing in places, so set on the slab it z-fights and looks half sunk.
 * The figure is lowered this far into the pedestal's top slab, burying the plate entirely;
 * the robe begins just above it. (The plate reaches 1.145 m from the axis; the slab's nearly
 * straight side keeps even its corners inside through the hover "lift".)
 */
export const PLATE_SINK = 0.055;
