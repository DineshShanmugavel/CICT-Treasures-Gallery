import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { seededRandom } from '../hallway/createHallwayScene.js';

/*
 * The five landscapes as table-top models for the glass cases, each on a square of ground a
 * metre across with its cut edge showing the earth beneath (the case scales it down). Kurinji
 * is the museum's model (kurinji.web.glb); the other four are dioramas built here from the
 * tinai's own elements — Mullai's pasture, cattle and jasmine, Marutham's paddy fields,
 * river and marutham tree, Neithal's shore, catamarans and salt pans, Palai's cracked earth,
 * rocks and leafless thorn trees.
 */

const SIZE = 1;
const HALF = SIZE / 2;

/** Gentle rolling ground: a sum of sines (deterministic), fading to flat at the edges so it meets the base. */
const rolling = (amplitude, seed = 1) => (x, z) => {
  const edge = Math.min(1, (HALF - Math.abs(x)) * 9) * Math.min(1, (HALF - Math.abs(z)) * 9);
  const h = Math.sin(x * 7.1 + seed) * Math.cos(z * 5.3 - seed) * 0.6 + Math.sin(x * 13.7 + z * 11.1 + seed * 2) * 0.25 + Math.cos(z * 17.3 - x * 3.1) * 0.15;
  return Math.max(0, (h * 0.5 + 0.5)) * amplitude * edge;
};

/** A square of ground shaped by `height(x, z)` and coloured by `color(x, z, y)` (a THREE.Color). */
function Ground({ height, color, segments = 72, roughness = 0.95, map = null }) {
  const geometry = useMemo(() => {
    const plane = new THREE.PlaneGeometry(SIZE, SIZE, segments, segments);
    plane.rotateX(-Math.PI / 2);
    const positions = plane.getAttribute('position');
    const colors = new Float32Array(positions.count * 3);
    const tint = new THREE.Color();
    for (let i = 0; i < positions.count; i += 1) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      const y = height(x, z);
      positions.setY(i, y);
      tint.copy(color(x, z, y));
      colors.set([tint.r, tint.g, tint.b], i * 3);
    }
    plane.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    plane.computeVertexNormals();
    return plane;
  }, [height, color, segments]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial vertexColors roughness={roughness} map={map} />
    </mesh>
  );
}

/** The cut block of earth under the ground, in layers. */
function Base({ top = '#5a3a1c', bottom = '#2e1c0c' }) {
  return (
    <group>
      <mesh position-y={-0.03}>
        <boxGeometry args={[SIZE, 0.06, SIZE]} />
        <meshStandardMaterial color={top} roughness={1} />
      </mesh>
      <mesh position-y={-0.085}>
        <boxGeometry args={[SIZE, 0.05, SIZE]} />
        <meshStandardMaterial color={bottom} roughness={1} />
      </mesh>
    </group>
  );
}

/** Instanced copies of one shape at `points` ([x, y, z, scale, turn]). */
function Scatter({ points, children }) {
  const ref = useRef();
  useLayoutEffect(() => {
    const matrix = new THREE.Matrix4();
    const rotation = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    points.forEach(([x, y, z, scale = 1, turn = 0], i) => {
      rotation.setFromAxisAngle(up, turn);
      matrix.compose(new THREE.Vector3(x, y, z), rotation, new THREE.Vector3(scale, scale, scale));
      ref.current.setMatrixAt(i, matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.computeBoundingSphere();
  }, [points]);
  return <instancedMesh ref={ref} args={[null, null, points.length]}>{children}</instancedMesh>;
}

/** Points scattered over the ground (seeded), kept `margin` from its edges, lifted onto `height`. */
function scatter(count, seed, height, { margin = 0.06, where = () => true, scale = [0.8, 1.2] } = {}) {
  const rand = seededRandom(seed);
  const points = [];
  let tries = 0;
  while (points.length < count && tries < count * 40) {
    tries += 1;
    const x = (rand() - 0.5) * (SIZE - margin * 2);
    const z = (rand() - 0.5) * (SIZE - margin * 2);
    if (!where(x, z)) continue;
    points.push([x, height(x, z), z, scale[0] + rand() * (scale[1] - scale[0]), rand() * Math.PI * 2]);
  }
  return points;
}

/** A tree: a trunk and a crown of `crown` spheres, or a cone for `conifer`. */
function Tree({ position, scale = 1, foliage = '#2f5a24', trunk = '#4a2e18', conifer = false }) {
  return (
    <group position={position} scale={scale}>
      <mesh position-y={0.045}>
        <cylinderGeometry args={[0.008, 0.012, 0.09, 6]} />
        <meshStandardMaterial color={trunk} roughness={0.9} />
      </mesh>
      {conifer ? (
        <mesh position-y={0.13}>
          <coneGeometry args={[0.045, 0.12, 8]} />
          <meshStandardMaterial color={foliage} roughness={0.85} />
        </mesh>
      ) : (
        [[0, 0.11, 0, 0.05], [0.025, 0.095, 0.01, 0.035], [-0.02, 0.1, -0.015, 0.038]].map(([x, y, z, r]) => (
          <mesh key={`${x}${z}`} position={[x, y, z]}>
            <icosahedronGeometry args={[r, 1]} />
            <meshStandardMaterial color={foliage} roughness={0.85} flatShading />
          </mesh>
        ))
      )}
    </group>
  );
}

/** A round hut: mud walls under a thatched cone. */
function Hut({ position, scale = 1, turn = 0 }) {
  return (
    <group position={position} scale={scale} rotation-y={turn}>
      <mesh position-y={0.025}>
        <cylinderGeometry args={[0.035, 0.037, 0.05, 14]} />
        <meshStandardMaterial color="#b98a5a" roughness={1} />
      </mesh>
      <mesh position-y={0.07}>
        <coneGeometry args={[0.05, 0.05, 14]} />
        <meshStandardMaterial color="#c9a25a" roughness={1} flatShading />
      </mesh>
      <mesh position={[0, 0.018, 0.036]}>
        <boxGeometry args={[0.014, 0.03, 0.004]} />
        <meshStandardMaterial color="#2a1a0c" />
      </mesh>
    </group>
  );
}

/** A grazing cow (or buffalo): body, head, horns and legs. */
function Cow({ position, turn = 0, color = '#efe6d6', scale = 1 }) {
  return (
    <group position={position} rotation-y={turn} scale={scale}>
      <mesh position-y={0.028}>
        <boxGeometry args={[0.05, 0.022, 0.022]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[0.03, 0.03, 0]}>
        <boxGeometry args={[0.016, 0.014, 0.013]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[0.034, 0.04, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.007, 0.0015, 4, 8, Math.PI]} />
        <meshStandardMaterial color="#5a4a3a" />
      </mesh>
      {[[-0.018, -0.008], [-0.018, 0.008], [0.018, -0.008], [0.018, 0.008]].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.009, z]}>
          <boxGeometry args={[0.005, 0.018, 0.005]} />
          <meshStandardMaterial color="#5a4a3a" />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Mullai: woodland and pasture, in the evening of the rains ---------- */

function Mullai() {
  const height = useMemo(() => rolling(0.07, 2), []);
  const color = useMemo(() => {
    const low = new THREE.Color('#5d8a35');
    const high = new THREE.Color('#2f5a22');
    return (x, z, y) => low.clone().lerp(high, Math.min(1, y / 0.07));
  }, []);
  const trees = useMemo(() => scatter(11, 21, height, { where: (x, z) => x < -0.05 || z < -0.2, scale: [0.8, 1.4] }), [height]);
  const jasmine = useMemo(() => scatter(70, 23, height, { where: (x, z) => x > -0.1 && z > -0.15, scale: [0.7, 1.2] }), [height]);
  const cows = useMemo(() => scatter(4, 29, height, { where: (x, z) => x > 0 && z > -0.1 }), [height]);
  return (
    <group>
      <Base />
      <Ground height={height} color={color} />
      {trees.map(([x, y, z, s], i) => <Tree key={i} position={[x, y, z]} scale={s} foliage={i % 3 ? '#2f5a24' : '#3d6a2a'} />)}
      <Scatter points={jasmine.map(([x, y, z, s, t]) => [x, y + 0.006, z, s, t])}>
        <icosahedronGeometry args={[0.006, 0]} />
        <meshStandardMaterial color="#fffdf4" emissive="#fff8e0" emissiveIntensity={0.25} roughness={0.6} />
      </Scatter>
      {cows.map(([x, y, z, , t], i) => <Cow key={i} position={[x, y, z]} turn={t} color={i % 2 ? '#efe6d6' : '#8a6a4a'} />)}
      <Hut position={[0.3, height(0.3, 0.32), 0.32]} turn={0.6} />
      {/* The herder's thorn fence round the cattle pen */}
      <mesh position={[0.18, height(0.18, 0.3) + 0.012, 0.3]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.1, 0.004, 4, 32]} />
        <meshStandardMaterial color="#6a4a2a" roughness={1} />
      </mesh>
    </group>
  );
}

/* ---------- Marutham: paddy fields and the river, at dawn ---------- */

function Marutham() {
  const flat = useMemo(() => () => 0.004, []);
  const color = useMemo(() => () => new THREE.Color('#8a6a3a'), []);
  const plots = useMemo(() => {
    const rand = seededRandom(41);
    const greens = ['#6fae3a', '#86bd42', '#a8c84a', '#c9b44a', '#5f9e32'];
    const list = [];
    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        list.push({ x: -0.36 + i * 0.2, z: -0.33 + j * 0.2, color: greens[(rand() * greens.length) | 0], h: 0.008 + rand() * 0.012 });
      }
    }
    return list;
  }, []);
  const water = useRef();
  useFrame(({ clock }) => {
    if (water.current) water.current.material.emissiveIntensity = 0.18 + Math.sin(clock.elapsedTime * 1.6) * 0.05;
  });
  return (
    <group>
      <Base top="#4a3418" />
      <Ground height={flat} color={color} segments={4} />
      {plots.map(({ x, z, color: c, h }) => (
        <group key={`${x}${z}`} position={[x, 0.004, z]}>
          {/* Standing water between the rice, and the rice above it */}
          <mesh position-y={0.002}>
            <boxGeometry args={[0.18, 0.004, 0.18]} />
            <meshStandardMaterial color="#6a8a8a" roughness={0.15} metalness={0.2} />
          </mesh>
          <mesh position-y={0.004 + h / 2}>
            <boxGeometry args={[0.17, h, 0.17]} />
            <meshStandardMaterial color={c} roughness={0.9} transparent opacity={0.92} />
          </mesh>
        </group>
      ))}
      {/* The river along the north edge, with its banks */}
      <mesh ref={water} position={[0, 0.006, 0.4]}>
        <boxGeometry args={[SIZE, 0.01, 0.13]} />
        <meshStandardMaterial color="#3a7a9a" roughness={0.1} metalness={0.3} emissive="#2a5a7a" emissiveIntensity={0.18} />
      </mesh>
      <Tree position={[0.38, 0.004, 0.27]} scale={2} foliage="#3f7a2a" />
      <Tree position={[-0.42, 0.004, 0.27]} scale={1.5} foliage="#4a8a30" />
      <Hut position={[0.36, 0.004, -0.4]} turn={0.4} />
      <Hut position={[0.22, 0.004, -0.42]} scale={0.85} turn={2.2} />
      {/* Haystacks and a granary (kudhir) by the village */}
      {[[0.42, -0.25], [0.32, -0.28]].map(([x, z]) => (
        <mesh key={x} position={[x, 0.03, z]}>
          <coneGeometry args={[0.03, 0.055, 10]} />
          <meshStandardMaterial color="#d9b45a" roughness={1} />
        </mesh>
      ))}
      <mesh position={[0.43, 0.03, -0.1]}>
        <cylinderGeometry args={[0.022, 0.028, 0.055, 12]} />
        <meshStandardMaterial color="#a8703a" roughness={1} />
      </mesh>
      <Cow position={[0.3, 0.004, -0.12]} turn={1.2} color="#3a3430" />
      <Cow position={[0.36, 0.004, -0.06]} turn={2} color="#3a3430" />
    </group>
  );
}

/* ---------- Neithal: the seashore, at dusk ---------- */

function Neithal({ reducedMotion }) {
  // Sand rises gently inland (−x); the sea fills the east half (+x).
  const height = useMemo(() => (x, z) => Math.max(0, -x * 0.12 + 0.01 + Math.sin(z * 9) * 0.004) * Math.min(1, (HALF - Math.abs(z)) * 9) * Math.min(1, (HALF + x) * 9), []);
  const color = useMemo(() => {
    const wet = new THREE.Color('#b89a6a');
    const dry = new THREE.Color('#e8d2a2');
    return (x, z, y) => wet.clone().lerp(dry, Math.min(1, y / 0.04));
  }, []);
  const sea = useRef();
  const seaGeometry = useMemo(() => {
    const plane = new THREE.PlaneGeometry(0.55, SIZE, 24, 40);
    plane.rotateX(-Math.PI / 2);
    return plane;
  }, []);
  useEffect(() => () => seaGeometry.dispose(), [seaGeometry]);
  useFrame(({ clock }) => {
    if (reducedMotion || !sea.current) return;
    const t = clock.elapsedTime;
    const positions = seaGeometry.getAttribute('position');
    for (let i = 0; i < positions.count; i += 1) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      positions.setY(i, Math.sin(x * 40 - t * 2.2 + z * 6) * 0.0035 + Math.sin(z * 25 + t * 1.3) * 0.002);
    }
    positions.needsUpdate = true;
    seaGeometry.computeVertexNormals();
  });
  const palms = [[-0.36, -0.3], [-0.4, 0.05], [-0.3, 0.32], [-0.18, -0.4]];
  const lilies = useMemo(() => scatter(12, 61, () => 0.006, { where: (x, z) => Math.hypot(x + 0.3, z + 0.1) < 0.06, margin: 0.1 }), []);
  return (
    <group>
      <Base top="#6a5434" />
      <Ground height={height} color={color} />
      <mesh ref={sea} geometry={seaGeometry} position={[0.225, 0.008, 0]}>
        <meshStandardMaterial color="#2a6a8a" roughness={0.12} metalness={0.25} transparent opacity={0.9} emissive="#1a3a5a" emissiveIntensity={0.2} />
      </mesh>
      {/* Foam where the waves break */}
      <mesh position={[-0.045, 0.012, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[0.02, SIZE * 0.96]} />
        <meshStandardMaterial color="#f4f8fa" transparent opacity={0.7} roughness={0.5} />
      </mesh>
      {palms.map(([x, z], i) => (
        <group key={i} position={[x, height(x, z), z]} rotation-z={0.12 * (i % 2 ? 1 : -1)}>
          <mesh position-y={0.08}>
            <cylinderGeometry args={[0.006, 0.009, 0.16, 6]} />
            <meshStandardMaterial color="#7a5a3a" roughness={0.9} />
          </mesh>
          {/* Fronds: each turned to its own side, then bowed outwards and down */}
          {Array.from({ length: 7 }, (_, k) => (
            <group key={k} position-y={0.16} rotation-y={(k / 7) * Math.PI * 2}>
              <mesh position={[0, 0.006, 0.04]} rotation-x={1.75} scale={[1, 1, 0.3]}>
                <coneGeometry args={[0.016, 0.09, 4]} />
                <meshStandardMaterial color="#3f7a2a" roughness={0.8} flatShading />
              </mesh>
            </group>
          ))}
        </group>
      ))}
      {/* Catamarans (kattumaram): one drawn up on the sand, one out on the water */}
      {[[-0.1, 0.004, 0.18, 0.3], [0.28, 0.012, -0.12, 1.2]].map(([x, y, z, turn]) => (
        <group key={x} position={[x, y + 0.006, z]} rotation-y={turn}>
          {[-0.012, 0, 0.012].map((offset) => (
            <mesh key={offset} position-z={offset} rotation-z={Math.PI / 2}>
              <cylinderGeometry args={[0.006, 0.006, 0.12, 6]} />
              <meshStandardMaterial color="#8a5a32" roughness={0.9} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Salt pans, white with drying salt, in the north-west corner */}
      {[0, 1, 2].flatMap((i) => [0, 1].map((j) => (
        <mesh key={`${i}${j}`} position={[-0.38 + i * 0.07, height(-0.38 + i * 0.07, 0.4 - j * 0.07) + 0.003, 0.42 - j * 0.07]}>
          <boxGeometry args={[0.06, 0.004, 0.06]} />
          <meshStandardMaterial color="#f6f2ea" roughness={0.6} />
        </mesh>
      )))}
      {/* A lagoon with blue water-lilies (neithal), the tinai's flower */}
      <mesh position={[-0.3, height(-0.3, -0.1) + 0.004, -0.1]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.07, 24]} />
        <meshStandardMaterial color="#3a6a7a" roughness={0.15} />
      </mesh>
      <Scatter points={lilies.map(([x, , z, s, t]) => [x, height(-0.3, -0.1) + 0.007, z, s, t])}>
        <icosahedronGeometry args={[0.006, 0]} />
        <meshStandardMaterial color="#6a7aea" emissive="#3a4aaa" emissiveIntensity={0.3} />
      </Scatter>
      {/* A fish-drying rack */}
      <group position={[-0.12, height(-0.12, -0.3), -0.3]}>
        {[-0.04, 0.04].map((x) => (
          <mesh key={x} position={[x, 0.025, 0]}>
            <cylinderGeometry args={[0.002, 0.002, 0.05, 4]} />
            <meshStandardMaterial color="#5a3a1a" />
          </mesh>
        ))}
        <mesh position-y={0.05} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.0015, 0.0015, 0.09, 4]} />
          <meshStandardMaterial color="#5a3a1a" />
        </mesh>
        {[-0.03, -0.01, 0.01, 0.03].map((x) => (
          <mesh key={x} position={[x, 0.04, 0]}>
            <boxGeometry args={[0.006, 0.018, 0.002]} />
            <meshStandardMaterial color="#b0a090" metalness={0.4} roughness={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ---------- Palai: the parched land, at midday ---------- */

function useCrackedEarth() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 512);
    const rand = seededRandom(83);
    ctx.strokeStyle = 'rgba(60,25,8,0.75)';
    // Cracks: wandering lines branching off one another.
    const crack = (x, y, angle, length, width) => {
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(x, y);
      for (let k = 0; k < length; k += 1) {
        angle += (rand() - 0.5) * 0.9;
        x += Math.cos(angle) * 9;
        y += Math.sin(angle) * 9;
        ctx.lineTo(x, y);
        if (width > 1 && rand() < 0.08) {
          ctx.stroke();
          crack(x, y, angle + (rand() > 0.5 ? 1.2 : -1.2), length / 2, width * 0.6);
          ctx.lineWidth = width;
          ctx.beginPath();
          ctx.moveTo(x, y);
        }
      }
      ctx.stroke();
    };
    for (let i = 0; i < 26; i += 1) crack(rand() * 512, rand() * 512, rand() * Math.PI * 2, 24, 2.6);
    const result = new THREE.CanvasTexture(canvas);
    result.colorSpace = THREE.SRGBColorSpace;
    return result;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

function ThornTree({ position, scale = 1, turn = 0 }) {
  const branches = [[0, 0.07, 0, 0.6, 0], [0, 0.06, 0, -0.7, 1.4], [0, 0.08, 0, 0.5, 2.6], [0, 0.05, 0, -0.5, 4]];
  return (
    <group position={position} scale={scale} rotation-y={turn}>
      <mesh position-y={0.04}>
        <cylinderGeometry args={[0.004, 0.008, 0.08, 5]} />
        <meshStandardMaterial color="#5a3a22" roughness={1} />
      </mesh>
      {branches.map(([x, y, z, tilt, yaw]) => (
        <group key={yaw} position={[x, y, z]} rotation-y={yaw}>
          <mesh rotation-z={tilt} position-y={0.02}>
            <cylinderGeometry args={[0.0015, 0.003, 0.05, 4]} />
            <meshStandardMaterial color="#5a3a22" roughness={1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Palai() {
  const cracks = useCrackedEarth();
  const height = useMemo(() => rolling(0.035, 7), []);
  const color = useMemo(() => {
    const low = new THREE.Color('#c27a3e');
    const high = new THREE.Color('#d9a060');
    return (x, z, y) => low.clone().lerp(high, Math.min(1, y / 0.035));
  }, []);
  const rocks = useMemo(() => scatter(9, 91, height, { scale: [0.6, 1.6] }), [height]);
  const trees = useMemo(() => scatter(4, 97, height, { scale: [1, 1.5], margin: 0.12 }), [height]);
  const grass = useMemo(() => scatter(40, 101, height, { scale: [0.6, 1.1] }), [height]);
  const cacti = useMemo(() => scatter(5, 103, height, { scale: [0.8, 1.3], margin: 0.1 }), [height]);
  return (
    <group>
      <Base top="#7a4a22" bottom="#3a2210" />
      <Ground height={height} color={color} map={cracks} />
      {rocks.map(([x, y, z, s, t], i) => (
        <mesh key={i} position={[x, y + 0.01 * s, z]} rotation={[t, t * 0.7, 0]} scale={[s, s * 0.6, s]}>
          <dodecahedronGeometry args={[0.025, 0]} />
          <meshStandardMaterial color={i % 2 ? '#8a6a52' : '#6a5242'} roughness={0.95} flatShading />
        </mesh>
      ))}
      {trees.map(([x, y, z, s, t], i) => <ThornTree key={i} position={[x, y, z]} scale={s} turn={t} />)}
      <Scatter points={grass}>
        <coneGeometry args={[0.004, 0.02, 3]} />
        <meshStandardMaterial color="#c9a85a" roughness={1} />
      </Scatter>
      {/* Kalli (cactus-like spurge) clumps */}
      {cacti.map(([x, y, z, s], i) => (
        <group key={i} position={[x, y, z]} scale={s}>
          {[[0, 0.025, 0, 0.05], [0.01, 0.018, 0.006, 0.035], [-0.009, 0.015, -0.004, 0.03]].map(([cx, cy, cz, h]) => (
            <mesh key={`${cx}`} position={[cx, cy, cz]}>
              <cylinderGeometry args={[0.004, 0.005, h, 6]} />
              <meshStandardMaterial color="#5a7a3a" roughness={0.8} />
            </mesh>
          ))}
        </group>
      ))}
      {/* A dry well */}
      <mesh position={[0.25, height(0.25, 0.2) + 0.01, 0.2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.02, 16, 1, true]} />
        <meshStandardMaterial color="#9a7a5a" roughness={1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* ---------- Kurinji: the mountains, from the museum's model ---------- */

/** Stands the model on the ground, centred, scaled to the case's square. */
function useFitted(scene) {
  return useMemo(() => {
    const model = scene.clone(true);
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const centre = box.getCenter(new THREE.Vector3());
    const scale = SIZE / Math.max(size.x, size.z);
    const wrapper = new THREE.Group();
    model.position.set(-centre.x, -box.min.y, -centre.z);
    wrapper.add(model);
    wrapper.scale.setScalar(scale);
    model.traverse((object) => {
      if (object.isMesh) {
        object.material = object.material.clone();
        object.material.envMapIntensity = 0.6;
        // The model's metalness map reads as wet black rock under warm lamps; it is earth and forest.
        object.material.metalness = 0;
      }
    });
    return wrapper;
  }, [scene]);
}

export function KurinjiModel({ url, onLoaded }) {
  const { scene } = useGLTF(url, false, true);
  const fitted = useFitted(scene);
  useEffect(() => { onLoaded?.(); }, [onLoaded]);
  return <primitive object={fitted} />;
}

/** Shown in the Kurinji case while its model loads, or if it cannot: a peak with its blue kurinji flowers and a waterfall. */
export function KurinjiSketch() {
  const height = useMemo(() => (x, z) => {
    const d = Math.hypot(x + 0.08, z + 0.05);
    const edge = Math.min(1, (HALF - Math.abs(x)) * 9) * Math.min(1, (HALF - Math.abs(z)) * 9);
    return (Math.max(0, 0.32 - d * 0.75) + rolling(0.03, 3)(x, z)) * edge;
  }, []);
  const color = useMemo(() => {
    const low = new THREE.Color('#3f6a2a');
    const high = new THREE.Color('#6a6a5a');
    return (x, z, y) => low.clone().lerp(high, Math.min(1, y / 0.3));
  }, []);
  const flowers = useMemo(() => scatter(80, 13, height, { where: (x, z) => height(x, z) < 0.14 }), [height]);
  return (
    <group>
      <Base />
      <Ground height={height} color={color} />
      <Scatter points={flowers.map(([x, y, z, s, t]) => [x, y + 0.005, z, s, t])}>
        <icosahedronGeometry args={[0.006, 0]} />
        <meshStandardMaterial color="#7a6ae0" emissive="#4a3aa0" emissiveIntensity={0.3} />
      </Scatter>
      <mesh position={[0.08, 0.1, 0.12]} rotation-y={0.6}>
        <planeGeometry args={[0.025, 0.2]} />
        <meshStandardMaterial color="#e8f4ff" emissive="#a0c8ff" emissiveIntensity={0.3} transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

const DIORAMAS = { mullai: Mullai, marutham: Marutham, neithal: Neithal, palai: Palai };

/** One landscape's diorama by name. */
export function Diorama({ name, reducedMotion }) {
  const Model = DIORAMAS[name];
  return Model ? <Model reducedMotion={reducedMotion} /> : null;
}
