import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { NILAVILAKKU_PROFILE, NILAVILAKKU_RIM, drawFlame, drawGlow, drawMarbleFloor, drawSandstone } from '../hallway/createHallwayScene.js';
import { drawCoffers, drawFriezeBand, usePainted } from './paint.js';
import { DOOR, HALF_D, HALF_W, NORTH_BAYS, ROOM, SIDE_BAYS } from './roomLayout.js';

/*
 * The Five Landscapes room's building: sandstone walls in ashlar courses, gilt arches over
 * every bay, a red and gold frieze under the cornice, a coffered teak ceiling, the polished
 * marble floor with its lotus medallion, and brass Nilavilakku lamps — the ring hall's own
 * surfaces (painted by the hallway's painters), so the room reads as part of the building.
 */

const STONE_TILE = 2.6; // metres per repeat of the sandstone texture, as in the hall
const TAU = Math.PI * 2;

const Materials = createContext(null);
export const useMaterials = () => useContext(Materials);

/** The room's shared materials, made once for the canvas. */
export function RoomMaterials({ children }) {
  const stoneMap = usePainted(512, 512, drawSandstone, 'stone', { repeat: [1 / STONE_TILE, 1 / STONE_TILE] });
  const floorMap = usePainted(2048, 2048, (ctx, w) => drawMarbleFloor(ctx, w, 26), 'floor');
  const flameMap = usePainted(64, 128, drawFlame, 'flame');
  const glowMap = usePainted(256, 256, (ctx, w) => drawGlow(ctx, w), 'glow');
  const materials = useMemo(() => ({
    stone: new THREE.MeshStandardMaterial({ map: stoneMap, roughness: 0.88, dithering: true }),
    darkStone: new THREE.MeshStandardMaterial({ map: stoneMap, color: '#8c7458', roughness: 0.75, dithering: true }),
    niche: new THREE.MeshStandardMaterial({ map: stoneMap, color: '#6e5638', roughness: 0.9, dithering: true }),
    plaster: new THREE.MeshStandardMaterial({ map: stoneMap, color: '#efdcb6', roughness: 0.8, dithering: true }),
    gold: new THREE.MeshStandardMaterial({ color: '#c99a45', metalness: 0.75, roughness: 0.28, emissive: '#3a2508', emissiveIntensity: 0.5, dithering: true }),
    brass: new THREE.MeshStandardMaterial({ color: '#d4a24c', metalness: 0.9, roughness: 0.3, emissive: '#4a2c08', emissiveIntensity: 0.35, dithering: true }),
    teak: new THREE.MeshStandardMaterial({ color: '#4a2410', roughness: 0.55, metalness: 0.05, dithering: true }),
    darkTeak: new THREE.MeshStandardMaterial({ color: '#2a1408', roughness: 0.6, dithering: true }),
    floor: new THREE.MeshStandardMaterial({ map: floorMap, roughness: 0.32, metalness: 0.02, dithering: true }),
    flame: new THREE.SpriteMaterial({ map: flameMap, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, toneMapped: false }),
    glow: new THREE.SpriteMaterial({ map: glowMap, color: '#ffb35c', blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.7 }),
    glass: new THREE.MeshPhysicalMaterial({ color: '#f4fbff', metalness: 0, roughness: 0.04, transparent: true, opacity: 0.16, envMapIntensity: 1.6, clearcoat: 1, clearcoatRoughness: 0.05, depthWrite: false, side: THREE.DoubleSide }),
  }), [stoneMap, floorMap, flameMap, glowMap]);
  useEffect(() => () => Object.values(materials).forEach((material) => material.dispose()), [materials]);
  return <Materials.Provider value={materials}>{children}</Materials.Provider>;
}

/** A plane whose texture coordinates are in metres, so the stone keeps its scale on every wall. */
function useMetrePlane(width, height) {
  const geometry = useMemo(() => {
    const plane = new THREE.PlaneGeometry(width, height);
    const uv = plane.getAttribute('uv');
    for (let i = 0; i < uv.count; i += 1) uv.setXY(i, uv.getX(i) * width, uv.getY(i) * height);
    return plane;
  }, [width, height]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return geometry;
}

function Wall({ width, height = ROOM.height, position, rotationY = 0, material = 'stone' }) {
  const materials = useMaterials();
  const geometry = useMetrePlane(width, height);
  return <mesh geometry={geometry} material={materials[material]} position={position} rotation-y={rotationY} />;
}

/** An arch-topped outline, `width` across, rising straight to `spring` and round to its crown. */
function archShape(width, spring, shape = new THREE.Shape()) {
  const r = width / 2;
  shape.moveTo(-r, 0);
  shape.lineTo(-r, spring);
  shape.absarc(0, spring, r, Math.PI, 0, true);
  shape.lineTo(r, 0);
  shape.lineTo(-r, 0);
  return shape;
}

/** The south wall, pierced by the arched doorway the visitor comes in by. */
function EntranceWall() {
  const materials = useMaterials();
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-HALF_W, 0);
    shape.lineTo(HALF_W, 0);
    shape.lineTo(HALF_W, ROOM.height);
    shape.lineTo(-HALF_W, ROOM.height);
    shape.lineTo(-HALF_W, 0);
    const hole = new THREE.Path();
    archShape(DOOR.width, DOOR.height - DOOR.width / 2, hole);
    shape.holes.push(hole);
    return new THREE.ShapeGeometry(shape, 24); // its UVs are its coordinates: metres
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <group position={[0, 0, HALF_D]} rotation-y={Math.PI}>
      <mesh geometry={geometry} material={materials.stone} />
      <GoldArch width={DOOR.width + 0.2} spring={DOOR.height - DOOR.width / 2} niche={false} />
    </group>
  );
}

/** The short passage outside the door, back towards the ring hall's arch. */
function Passage() {
  const half = DOOR.width / 2 + 0.2;
  const length = 7;
  return (
    <group position={[0, 0, HALF_D + length / 2]}>
      <Wall width={length} height={DOOR.height + 0.4} position={[-half, (DOOR.height + 0.4) / 2, 0]} rotationY={Math.PI / 2} material="darkStone" />
      <Wall width={length} height={DOOR.height + 0.4} position={[half, (DOOR.height + 0.4) / 2, 0]} rotationY={-Math.PI / 2} material="darkStone" />
    </group>
  );
}

/**
 * A gilt arch on slender columns, `width` across, springing at `spring`, with a kalasam
 * finial at its crown and (`niche`) the bay inside it sunk a shade darker.
 */
export function GoldArch({ width, spring, niche = true }) {
  const materials = useMaterials();
  const r = width / 2;
  const geometries = useMemo(() => ({
    column: new THREE.CylinderGeometry(0.05, 0.06, spring, 16),
    capital: new THREE.CylinderGeometry(0.09, 0.06, 0.14, 16),
    arc: new THREE.TorusGeometry(r, 0.055, 12, 48, Math.PI),
    finial: new THREE.LatheGeometry([[0, 0], [0.07, 0.02], [0.1, 0.09], [0.06, 0.17], [0.03, 0.2], [0.05, 0.24], [0, 0.34]].map(([x, y]) => new THREE.Vector2(x, y)), 20),
    niche: niche ? new THREE.ShapeGeometry(archShape(width - 0.16, spring), 24) : null,
  }), [r, spring, width, niche]);
  useEffect(() => () => Object.values(geometries).forEach((geometry) => geometry?.dispose()), [geometries]);
  return (
    <group position-z={0.03}>
      {geometries.niche && <mesh geometry={geometries.niche} material={materials.niche} position-z={-0.02} />}
      {[-r, r].map((x) => (
        <group key={x} position-x={x}>
          <mesh geometry={geometries.column} material={materials.gold} position-y={spring / 2} />
          <mesh geometry={geometries.capital} material={materials.gold} position-y={spring} />
        </group>
      ))}
      <mesh geometry={geometries.arc} material={materials.gold} position-y={spring} />
      <mesh geometry={geometries.finial} material={materials.gold} position-y={spring + r + 0.02} />
    </group>
  );
}

/** A stone pilaster with a gilt base and capital, standing out from its wall. */
function Pilaster() {
  const materials = useMaterials();
  const height = ROOM.height - 1.1;
  return (
    <group>
      <mesh material={materials.plaster} position={[0, height / 2, 0.11]}>
        <boxGeometry args={[0.46, height, 0.22]} />
      </mesh>
      <mesh material={materials.gold} position={[0, 0.12, 0.12]}>
        <boxGeometry args={[0.54, 0.24, 0.26]} />
      </mesh>
      <mesh material={materials.gold} position={[0, height - 0.08, 0.13]}>
        <boxGeometry args={[0.58, 0.16, 0.28]} />
      </mesh>
    </group>
  );
}

/** The frieze under the cornice along one wall: the painted band between gilt mouldings. */
function Frieze({ length }) {
  const materials = useMaterials();
  const band = usePainted(512, 128, drawFriezeBand, 'frieze', { repeat: [length / 1.8, 1] });
  useEffect(() => { band.repeat.set(length / 1.8, 1); }, [band, length]);
  return (
    <group position-y={ROOM.height - 1.1}>
      <mesh position={[0, 0.3, 0.02]}>
        <planeGeometry args={[length, 0.6]} />
        <meshStandardMaterial map={band} roughness={0.6} emissive="#ffffff" emissiveMap={band} emissiveIntensity={0.12} />
      </mesh>
      <mesh material={materials.gold} position={[0, 0.02, 0.06]}>
        <boxGeometry args={[length, 0.06, 0.12]} />
      </mesh>
      <mesh material={materials.gold} position={[0, 0.66, 0.1]}>
        <boxGeometry args={[length, 0.1, 0.2]} />
      </mesh>
      <mesh material={materials.plaster} position={[0, 0.9, 0.18]}>
        <boxGeometry args={[length, 0.36, 0.36]} />
      </mesh>
    </group>
  );
}

/** A wall's furnishings, built facing +z: pilasters at `pilasters` (x), gilt arches in `bays`, the frieze and a skirting. */
function WallDress({ length, pilasters, bays }) {
  const materials = useMaterials();
  return (
    <group>
      {pilasters.map((x) => <group key={x} position-x={x}><Pilaster /></group>)}
      {bays.map(({ x, width, spring }) => <group key={x} position-x={x}><GoldArch width={width} spring={spring} /></group>)}
      <Frieze length={length} />
      <mesh material={materials.darkStone} position={[0, 0.12, 0.03]}>
        <boxGeometry args={[length, 0.24, 0.06]} />
      </mesh>
    </group>
  );
}

function Ceiling() {
  const coffers = usePainted(512, 512, drawCoffers, 'coffers', { repeat: [ROOM.width / 2.25, ROOM.depth / 2.2] });
  return (
    <mesh position={[0, ROOM.height, 0]} rotation-x={Math.PI / 2}>
      <planeGeometry args={[ROOM.width, ROOM.depth]} />
      <meshStandardMaterial map={coffers} roughness={0.7} />
    </mesh>
  );
}

/** The room's walls, floor and ceiling. */
export function RoomShell() {
  const materials = useMaterials();
  const north = useMemo(() => ({
    pilasters: [-8.1, ...NORTH_BAYS.slice(0, -1).map((x) => x + 1.6), 8.1],
    bays: NORTH_BAYS.map((x) => ({ x, width: 2.7, spring: 4.15 })),
  }), []);
  // The side walls run north to south; built facing +z, their x is the room's −z (west) or z (east).
  const side = (sign) => ({
    pilasters: [-10.5, -7.3, -2.7, -0.8, 3.8, 7.6].map((z) => z * sign),
    bays: SIDE_BAYS.map((z) => ({ x: z * sign, width: 3.9, spring: 3.85 })),
  });
  const west = useMemo(() => side(-1), []);
  const east = useMemo(() => side(1), []);
  return (
    <group>
      <mesh material={materials.floor} position={[0, 0, 2]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[26, 26]} />
      </mesh>
      <Ceiling />
      <Wall width={ROOM.width} position={[0, ROOM.height / 2, -HALF_D]} />
      <Wall width={ROOM.depth} position={[-HALF_W, ROOM.height / 2, 0]} rotationY={Math.PI / 2} />
      <Wall width={ROOM.depth} position={[HALF_W, ROOM.height / 2, 0]} rotationY={-Math.PI / 2} />
      <EntranceWall />
      <Passage />
      <group position-z={-HALF_D}><WallDress length={ROOM.width} {...north} /></group>
      <group position-x={-HALF_W} rotation-y={Math.PI / 2}><WallDress length={ROOM.depth} {...west} /></group>
      <group position-x={HALF_W} rotation-y={-Math.PI / 2}><WallDress length={ROOM.depth} {...east} /></group>
      <group position-z={HALF_D} rotation-y={Math.PI}>
        <Frieze length={ROOM.width} />
        {[-8.1, -2.2, 2.2, 8.1].map((x) => <group key={x} position-x={x}><Pilaster /></group>)}
      </group>
    </group>
  );
}

/* ---------- Brass lamps ---------- */

const WICKS = 5;
let lampGeometry = null;
const nilavilakkuGeometry = () => {
  lampGeometry ??= new THREE.LatheGeometry(NILAVILAKKU_PROFILE.map(([r, y]) => new THREE.Vector2(r, y)), 32);
  return lampGeometry;
};

/**
 * A standing brass Nilavilakku on a stone pedestal, `size` times life, its five flames
 * flickering (and its light, if it has one) as the hall's lamps do.
 */
export function Nilavilakku({ position, size = 1.6, pedestal = { radius: 0.26, height: 0.75 }, light = 0, reach = 8, phase = 0, reducedMotion = false }) {
  const materials = useMaterials();
  const flames = useRef([]);
  const glow = useRef();
  const lamp = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const flicker = reducedMotion ? 1 : 1 + 0.09 * Math.sin(t * 9.3 + phase) + 0.06 * Math.sin(t * 23.1 + phase * 2.3) + 0.04 * Math.sin(t * 41.7 + phase * 0.7);
    if (lamp.current) lamp.current.intensity = light * flicker;
    glow.current?.scale.setScalar(1.6 * (0.94 + (flicker - 1) * 0.8));
    flames.current.forEach((flame, w) => {
      if (!flame) return;
      const sway = reducedMotion ? 0 : Math.sin(t * (12 + w) + phase + w * 1.3);
      flame.scale.set(0.07 * (1 - sway * 0.06), 0.16 * (flicker + sway * 0.07), 1);
    });
  });
  return (
    <group position={position}>
      <mesh material={materials.darkStone} position-y={pedestal.height / 2}>
        <cylinderGeometry args={[pedestal.radius * 0.85, pedestal.radius, pedestal.height, 28]} />
      </mesh>
      {[0.06, pedestal.height - 0.05].map((y) => (
        <mesh key={y} material={materials.gold} position-y={y}>
          <cylinderGeometry args={[pedestal.radius * (y > 0.1 ? 0.9 : 1.04), pedestal.radius * (y > 0.1 ? 0.9 : 1.04), 0.08, 28]} />
        </mesh>
      ))}
      <group position-y={pedestal.height} scale={size}>
        <mesh geometry={nilavilakkuGeometry()} material={materials.brass} />
        {Array.from({ length: WICKS }, (_, w) => {
          const a = (w / WICKS) * TAU;
          return (
            <sprite
              key={w}
              ref={(sprite) => { flames.current[w] = sprite; }}
              material={materials.flame}
              center={[0.5, 0.08]}
              position={[Math.sin(a) * NILAVILAKKU_RIM.radius, NILAVILAKKU_RIM.height, Math.cos(a) * NILAVILAKKU_RIM.radius]}
              scale={[0.07, 0.16, 1]}
            />
          );
        })}
        <sprite ref={glow} material={materials.glow} position-y={NILAVILAKKU_RIM.height + 0.08} />
      </group>
      {light > 0 && (
        <pointLight ref={lamp} color="#ffa64d" intensity={light} distance={reach} decay={2} position-y={pedestal.height + (NILAVILAKKU_RIM.height + 0.25) * size} />
      )}
    </group>
  );
}
