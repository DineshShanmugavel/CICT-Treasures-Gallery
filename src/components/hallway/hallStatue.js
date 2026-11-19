import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { PLATE_SINK, STATUE_MODEL_URL } from './statueModel.js';
import { gildPainting } from './gilding.js';
import { mediaUrl } from '../../mediaUrl.js';

/*
 * The Thiruvalluvar monument built straight into the hallway's own scene — the same model,
 * pedestal and spotlights as ThiruvalluvarStatue.jsx (which the arched view's
 * stage still uses). Being part of the building, it is never unmounted: it stays in the
 * scene graph through every turn, glide and change of hall, walls and the corridor hide or
 * frame it like anything else, and the fog softens it seen from the other hall.
 */

const STATUE_HEIGHT = 2.3; // metres above the pedestal
const PEDESTAL_HEIGHT = 1.0;
/** The sage's chest: every spotlight on the statue is locked onto this point. */
const SPOTLIGHT_FOCUS = new THREE.Vector3(0, PEDESTAL_HEIGHT + STATUE_HEIGHT * 0.55, 0);

/*
 * The lotus-patterned podium band from public/UI images: exactly one period of its
 * lotus-and-star frieze (stars sit 282 px apart in the 1600 px photo) is tiled round the drum.
 * The crop starts and ends in the plain red between a star and a lotus, so the joins never
 * cut a motif, and stays inside the red band (the gilt rings frame it in 3D).
 */
const LOTUS_BAND = {
  url: mediaUrl('/UI images/WhatsApp Image 2026-10-21 at 3.03.52 PM.jpeg'),
  crop: [708 / 1600, 214 / 533, 282 / 1600, 186 / 533], // x, y, width, height as fractions
  feather: 12 / 1600, // red just left of the crop, faded into its right edge to hide the join
  // The stretch of the drum (as UV v, bottom to top) left showing between the gilt rings at
  // 0.3 m and 0.84 m; the band is fitted there and its plain red edges clamp beyond it.
  window: [0.17, 0.89],
  repeats: 10, // keeps the motifs at the photo's proportions round the 7 m drum
};

function loadLotusBand(material, keep, isDisposed) {
  new THREE.ImageLoader().load(
    LOTUS_BAND.url,
    (image) => {
      if (isDisposed()) return;
      const [x, y, w, h] = LOTUS_BAND.crop.map((value, i) => value * (i % 2 ? image.height : image.width));
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = Math.round((512 * h) / w);
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(image, x, y, w, h, 0, 0, canvas.width, canvas.height);
      /*
       * The photo's lighting differs slightly from one end of the crop to the other. Fade the
       * strip just before the crop's start across its last columns, so the right edge ends on
       * the very pixels the left edge begins with and the repeat has no visible seam.
       */
      const sx = canvas.width / w;
      const strip = Math.max(1, Math.round(LOTUS_BAND.feather * image.width * sx));
      for (let i = 0; i < strip; i += 1) {
        ctx.globalAlpha = (i + 1) / strip;
        ctx.drawImage(image, x - (strip - i) / sx, y, 1 / sx, h, canvas.width - strip + i, 0, 1, canvas.height);
      }
      ctx.globalAlpha = 1;
      gildPainting(ctx, canvas.width, canvas.height); // gold lotuses on the red
      const texture = keep(new THREE.CanvasTexture(canvas));
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.RepeatWrapping;
      const [bottom, top] = LOTUS_BAND.window;
      texture.repeat.set(LOTUS_BAND.repeats, 1 / (top - bottom));
      texture.offset.set(0, -bottom / (top - bottom));
      texture.anisotropy = 4;
      material.color.set('#ffffff');
      material.map = texture;
      material.emissive.set('#ffffff');
      material.emissiveMap = texture;
      material.emissiveIntensity = 0.25;
      material.needsUpdate = true;
    },
    undefined,
    (error) => console.warn('Podium lotus band unavailable:', error),
  );
}

/**
 * The scan is a Z-up, quantised mesh. Stand it upright, scale it to STATUE_HEIGHT with its
 * base at the origin, and rebuild smooth normals (the source only had flat ones).
 */
function statueGeometry(gltfScene) {
  let mesh = null;
  gltfScene.updateMatrixWorld(true);
  gltfScene.traverse((object) => {
    if (!mesh && object.isMesh) mesh = object;
  });
  const result = mesh.geometry.clone();
  // Dequantise to floats first; transforming int16 positions in place would overflow.
  const source = result.getAttribute('position');
  const positions = new Float32Array(source.count * 3);
  for (let i = 0; i < source.count; i += 1) {
    positions[i * 3] = source.getX(i);
    positions[i * 3 + 1] = source.getY(i);
    positions[i * 3 + 2] = source.getZ(i);
  }
  result.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  result.deleteAttribute('normal');
  result.applyMatrix4(mesh.matrixWorld);
  result.rotateX(-Math.PI / 2);
  result.computeBoundingBox();
  const box = result.boundingBox;
  const center = box.getCenter(new THREE.Vector3());
  result.translate(-center.x, -box.min.y, -center.z);
  const scale = STATUE_HEIGHT / (box.max.y - box.min.y);
  result.scale(scale, scale, scale);
  result.computeVertexNormals();
  result.computeBoundingSphere();
  return result;
}

/**
 * Adds the monument to `parent` (at its origin, facing +z) and starts loading the model.
 * Returns `update(seconds, dt, camera, hovered)` for every frame, `dispose()`, and its `lights`.
 * `onLoaded(ok)` reports once the model has loaded (true) or failed (false); the pedestal
 * stands from the start.
 */
export function addHallStatue(parent, { reducedMotion = false, onLoaded, track }) {
  const root = new THREE.Group();
  parent.add(root);
  const own = []; // resources to dispose
  const keep = (resource) => {
    own.push(resource);
    return track ? track(resource) : resource;
  };
  /* A carved stone drum with gilded lotus bands. */
  const stone = (color, roughness) => keep(new THREE.MeshStandardMaterial({ color, roughness }));
  const giltBand = keep(new THREE.MeshStandardMaterial({ color: '#e0b45a', metalness: 0.9, roughness: 0.25, emissive: '#5a3a0a', emissiveIntensity: 0.6 }));
  // A polished cream marble slab for the sage to sit on, as in the master rendering.
  const marbleTop = keep(new THREE.MeshStandardMaterial({ color: '#e6d6b8', metalness: 0.05, roughness: 0.35 }));
  const part = (geometry, material, y, rotateX = 0) => {
    const mesh = new THREE.Mesh(keep(geometry), material);
    mesh.position.y = y;
    mesh.rotation.x = rotateX;
    root.add(mesh);
    return mesh;
  };
  part(new THREE.CylinderGeometry(1.45, 1.55, 0.24, 48), stone('#5a2716', 0.7), 0.12);
  const drum = part(new THREE.CylinderGeometry(1.05, 1.18, 0.66, 64), stone('#7a3a22', 0.6), 0.55);
  drum.rotation.y = Math.PI; // the band's seam faces the back
  loadLotusBand(drum.material, keep, () => disposed);
  for (const y of [0.3, 0.84]) part(new THREE.TorusGeometry(y < 0.5 ? 1.17 : 1.06, 0.035, 10, 64), giltBand, y, Math.PI / 2);
  part(new THREE.CylinderGeometry(1.2, 1.18, 0.12, 48), marbleTop, 0.94); // nearly straight-sided: it holds the sunken base plate (PLATE_SINK)

  /* The bronze sage, once loaded. Its reflections are raised to match the hall's softer environment. */
  const figure = new THREE.Group();
  figure.position.y = PEDESTAL_HEIGHT;
  root.add(figure);
  const bronze = keep(new THREE.MeshStandardMaterial({ color: '#b98a46', metalness: 0.82, roughness: 0.33, emissive: '#6a4510', envMapIntensity: 2.4 }));

  /*
   * The statue's lighting, in the hall's neutral daylight (no golden wash): a key spot from
   * the dome, a follow-spot between visitor and sage, a rim light behind. Their ranges end just past the sage (he is about 7.3 m
   * from the key light and 5.5 m from the follow-spot), so their cones fade out before they
   * reach the floor — beyond him they would burn hard-edged white pools into the kolam.
   */
  const target = new THREE.Object3D();
  target.position.copy(SPOTLIGHT_FOCUS);
  root.add(target);
  // Softer than the overlay's key light: the hall's own pool of light from the mandala now falls on the sage too.
  const key = new THREE.SpotLight('#fff3e2', 95, 8.8, 0.26, 0.85, 1.5);
  key.position.set(0, 9.4, 1.2);
  key.target = target;
  const follow = new THREE.SpotLight('#fff6ea', 45, 7, 0.38, 0.95, 1.5);
  follow.target = target;
  const rim = new THREE.PointLight('#ffeedd', 7, 9, 1.6);
  rim.position.set(-2.6, 3.2, -2.4);
  root.add(key, follow, rim);

  let disposed = false;
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  loader.load(
    STATUE_MODEL_URL,
    (gltf) => {
      if (disposed) return;
      try {
        // The base plate is buried in the slab; the hover "lift" still scales from the slab's surface.
        const sage = new THREE.Mesh(keep(statueGeometry(gltf.scene)), bronze);
        sage.position.y = -PLATE_SINK;
        figure.add(sage);
        onLoaded?.(true);
      } catch (error) {
        console.warn('Statue model could not be prepared:', error);
        onLoaded?.(false);
      }
    },
    undefined,
    (error) => {
      if (disposed) return;
      // The hall carries on with the pedestal alone.
      console.warn('Statue model unavailable:', error);
      onLoaded?.(false);
    },
  );

  const spring = { value: 0, velocity: 0 };
  const towardsViewer = new THREE.Vector3();
  const focusWorld = new THREE.Vector3();

  return {
    /** The statue's own lights, so the building can keep them in the scene whatever it hides. */
    lights: [key, follow, rim],
    /** Hover "lift" (an under-damped spring, so it bounces a little) and the follow-spot. */
    update(seconds, dt, camera, hovered) {
      const step = Math.min(dt, 0.05);
      spring.velocity += (((hovered ? 1 : 0) - spring.value) * 120 - spring.velocity * 12) * step;
      spring.value += spring.velocity * step;
      const glow = spring.value;
      figure.scale.setScalar(1 + glow * 0.03);
      // The bronze glows only while hovered.
      bronze.emissiveIntensity = glow * 0.35;
      // Keep the follow-spot between the visitor and the sage, whichever side they stand.
      root.worldToLocal(towardsViewer.copy(camera.position));
      towardsViewer.sub(focusWorld.copy(SPOTLIGHT_FOCUS)).setY(0);
      if (towardsViewer.lengthSq() < 1e-4) towardsViewer.set(0, 0, 1);
      towardsViewer.normalize().multiplyScalar(4.5);
      // Placed in the monument's frame, then into whatever holds the light (the building may move it into world space).
      root.localToWorld(follow.position.set(SPOTLIGHT_FOCUS.x + towardsViewer.x, SPOTLIGHT_FOCUS.y + 3.2, SPOTLIGHT_FOCUS.z + towardsViewer.z));
      follow.parent?.worldToLocal(follow.position);
    },
    dispose() {
      disposed = true;
      parent.remove(root);
      if (!track) own.forEach((resource) => resource.dispose());
    },
  };
}
