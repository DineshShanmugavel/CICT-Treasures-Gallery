import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Billboard, useGLTF } from '@react-three/drei';
import { PLATE_SINK, STATUE_MODEL_URL } from './statueModel.js';

const STATUE_HEIGHT = 2.3; // metres above the pedestal
const PEDESTAL_HEIGHT = 1.0;
/** Extra turn so the sage faces the visitor's opening view (towards +z). */
const FACING_YAW = 0;

/** Vertical or radial alpha gradients, painted once, for the glow effects. */
function useGradientTexture(kind) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const gradient = kind === 'radial'
      ? ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
      : ctx.createLinearGradient(0, 0, 0, 256);
    if (kind === 'radial') {
      gradient.addColorStop(0, 'rgba(255,236,180,1)');
      gradient.addColorStop(0.35, 'rgba(255,200,100,0.45)');
      gradient.addColorStop(1, 'rgba(255,170,60,0)');
    } else {
      gradient.addColorStop(0, 'rgba(255,230,170,0)');
      gradient.addColorStop(0.55, 'rgba(255,214,140,0.5)');
      gradient.addColorStop(1, 'rgba(255,200,110,0.9)');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    const result = new THREE.CanvasTexture(canvas);
    result.colorSpace = THREE.SRGBColorSpace;
    return result;
  }, [kind]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

/**
 * The scan is a Z-up, quantised mesh. Stand it upright, scale it to STATUE_HEIGHT with
 * its base at the origin, and rebuild smooth normals (the source only had flat ones).
 */
function useStatueGeometry() {
  const { scene } = useGLTF(STATUE_MODEL_URL, false, true);
  const geometry = useMemo(() => {
    let mesh = null;
    scene.updateMatrixWorld(true);
    scene.traverse((object) => {
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
    result.rotateY(FACING_YAW);
    result.computeBoundingBox();
    const box = result.boundingBox;
    const center = box.getCenter(new THREE.Vector3());
    result.translate(-center.x, -box.min.y, -center.z);
    const scale = STATUE_HEIGHT / (box.max.y - box.min.y);
    result.scale(scale, scale, scale);
    result.computeVertexNormals();
    result.computeBoundingSphere();
    return result;
  }, [scene]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return geometry;
}

/** A carved stone drum with gilded lotus bands. */
function Pedestal() {
  return (
    <group>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[1.45, 1.55, 0.24, 48]} />
        <meshStandardMaterial color="#6d5236" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[1.05, 1.18, 0.66, 48]} />
        <meshStandardMaterial color="#4a3320" roughness={0.6} />
      </mesh>
      {[0.3, 0.84].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[y < 0.5 ? 1.17 : 1.06, 0.035, 10, 64]} />
          <meshStandardMaterial color="#e0b45a" metalness={0.9} roughness={0.25} emissive="#5a3a0a" emissiveIntensity={0.6} />
        </mesh>
      ))}
      <mesh position={[0, 0.94, 0]}>
        <cylinderGeometry args={[1.2, 1.18, 0.12, 48]} />
        <meshStandardMaterial color="#c99a45" metalness={0.85} roughness={0.3} emissive="#3a2508" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

/** The sage's chest: every spotlight on the statue is locked onto this point. */
const SPOTLIGHT_FOCUS = new THREE.Vector3(0, PEDESTAL_HEIGHT + STATUE_HEIGHT * 0.55, 0);

/**
 * The statue's sacred lighting, locked onto it: a bright, tight key spotlight from the
 * dome's oculus, a soft follow-spot that keeps between the visitor and the sage (so
 * whichever side they look from is lit), and a low amber rim light behind.
 */
function SacredSpotlights() {
  const follow = useRef();
  const target = useMemo(() => {
    const object = new THREE.Object3D();
    object.position.copy(SPOTLIGHT_FOCUS);
    return object;
  }, []);
  const towardsViewer = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera }) => {
    towardsViewer.copy(camera.position).sub(SPOTLIGHT_FOCUS).setY(0);
    if (towardsViewer.lengthSq() < 1e-4) towardsViewer.set(0, 0, 1);
    towardsViewer.normalize().multiplyScalar(4.5);
    follow.current.position.set(SPOTLIGHT_FOCUS.x + towardsViewer.x, SPOTLIGHT_FOCUS.y + 3.2, SPOTLIGHT_FOCUS.z + towardsViewer.z);
  });

  return (
    <>
      <primitive object={target} />
      <spotLight target={target} position={[0, 9.4, 1.2]} angle={0.26} penumbra={0.6} intensity={140} distance={20} decay={1.5} color="#ffd8a0" />
      <spotLight ref={follow} target={target} angle={0.38} penumbra={0.9} intensity={45} distance={14} decay={1.5} color="#ffe2b8" />
      <pointLight position={[-2.6, 3.2, -2.4]} intensity={7} distance={9} decay={1.6} color="#ffb24a" />
    </>
  );
}

/**
 * The bronze Thiruvalluvar statue on its pedestal, wrapped in a golden aura: a soft halo,
 * a shaft of light from the dome and a glowing floor ring.
 * `hovered` brightens everything with a small spring "lift".
 */
export default function ThiruvalluvarStatue({ hovered = false, reducedMotion = false, onLoaded }) {
  const geometry = useStatueGeometry();
  const radial = useGradientTexture('radial');
  const vertical = useGradientTexture('vertical');
  const group = useRef();
  const material = useRef();
  const halo = useRef();
  const ring = useRef();
  const shaft = useRef();
  const spring = useRef({ value: 0, velocity: 0 });

  useEffect(() => {
    onLoaded?.(true);
  }, [onLoaded]);

  useFrame((state, delta) => {
    // Under-damped spring towards the hover target: a little overshoot reads as "bounce".
    const s = spring.current;
    const target = hovered ? 1 : 0;
    const dt = Math.min(delta, 0.05);
    s.velocity += ((target - s.value) * 120 - s.velocity * 12) * dt;
    s.value += s.velocity * dt;
    const pulse = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 1.6) * 0.5 + 0.5;
    const glow = s.value;

    group.current.scale.setScalar(1 + glow * 0.03);
    material.current.emissiveIntensity = 0.18 + glow * 0.45;
    halo.current.material.opacity = 0.42 + pulse * 0.12 + glow * 0.35;
    halo.current.scale.setScalar(3.6 + pulse * 0.15 + glow * 0.5);
    ring.current.material.opacity = 0.5 + pulse * 0.15 + glow * 0.4;
    shaft.current.material.opacity = 0.12 + glow * 0.1;
  });

  return (
    <group>
      <Pedestal />

      {/* Floor glow around the pedestal */}
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[3.2, 64]} />
        <meshBasicMaterial map={radial} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>

      {/* Shaft of light falling from the dome's oculus */}
      <mesh ref={shaft} position={[0, PEDESTAL_HEIGHT + 4.2, 0]}>
        <cylinderGeometry args={[0.55, 1.7, 8.4, 40, 1, true]} />
        <meshBasicMaterial map={vertical} transparent depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>

      {/* Halo behind the sage, always turned to the viewer */}
      <Billboard position={[0, PEDESTAL_HEIGHT + STATUE_HEIGHT * 0.62, 0]}>
        <mesh ref={halo} renderOrder={-1}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={radial} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
      </Billboard>

      <group ref={group} position={[0, PEDESTAL_HEIGHT, 0]}>
        <mesh geometry={geometry} position={[0, -PLATE_SINK, 0]}>
          <meshStandardMaterial ref={material} color="#b98a46" metalness={0.82} roughness={0.33} emissive="#6a4510" envMapIntensity={1.15} />
        </mesh>
      </group>

      <SacredSpotlights />
    </group>
  );
}

useGLTF.preload(STATUE_MODEL_URL, false, true);
