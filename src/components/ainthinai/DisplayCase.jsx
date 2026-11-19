import React, { Component, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useCursor } from '@react-three/drei';
import { useMaterials } from './RoomShell.jsx';
import { Diorama, KurinjiModel, KurinjiSketch } from './LandscapeModels.jsx';
import { drawPlaque, usePainted } from './paint.js';
import { CASE, MODEL_CENTRE_Y } from './roomLayout.js';

/** The model's scale in its case: the metre-square diorama fitted inside the glass, with room round it. */
const MODEL_SCALE = 0.8;
const GLASS_EDGES = (() => {
  const [w, h, d] = CASE.glass;
  const edges = [];
  for (const x of [-w / 2, w / 2]) for (const z of [-d / 2, d / 2]) edges.push({ position: [x, h / 2, z], size: [0.022, h, 0.022] });
  for (const y of [0, h]) {
    for (const z of [-d / 2, d / 2]) edges.push({ position: [0, y, z], size: [w, 0.022, 0.022] });
    for (const x of [-w / 2, w / 2]) edges.push({ position: [x, y, 0], size: [0.022, 0.022, d] });
  }
  return edges;
})();

/** If the Kurinji model cannot load, its case keeps the sketch rather than failing the room. */
class ModelBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.warn('Landscape model unavailable:', error);
    this.props.onFailed?.();
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/**
 * One landscape in its glass case: a sandstone pedestal with gilt bands and a brass plaque,
 * a glass box with gilt edges, the model turning slowly inside it under a warm spotlight
 * tinted with the landscape's own light. Clicking it calls `onSelect`; while `focused` the
 * model stops turning (the visitor walks round it instead) and the light comes up.
 */
export default function DisplayCase({ landscape, spot, focused, dimmed, onSelect, onHover, onModelState, reducedMotion }) {
  const materials = useMaterials();
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const turntable = useRef();
  const spotlight = useRef();
  const target = useMemo(() => new THREE.Object3D(), []);
  const plaque = usePainted(512, 160, drawPlaque(landscape.tamil, landscape.key, landscape.land[0]), landscape.key, { lettered: true });

  useFrame((_, delta) => {
    if (turntable.current && !focused && !reducedMotion) turntable.current.rotation.y += Math.min(delta, 0.05) * 0.16;
    if (spotlight.current) {
      const wanted = focused ? 190 : hovered ? 150 : dimmed ? 70 : 115;
      spotlight.current.intensity += (wanted - spotlight.current.intensity) * Math.min(1, delta * 4);
    }
  });
  useEffect(() => {
    if (spotlight.current) spotlight.current.target = target;
  }, [target]);

  const [w, h, d] = CASE.glass;
  // While a landscape's model loads, or if it cannot: Kurinji's sketch, or the others' dioramas.
  const stand = landscape.model.diorama ? <Diorama name={landscape.model.diorama} reducedMotion={reducedMotion} /> : <KurinjiSketch />;
  const model = landscape.model.url ? (
    <ModelBoundary fallback={stand} onFailed={() => onModelState?.('failed')}>
      <Suspense fallback={stand}>
        <KurinjiModel url={landscape.model.url} onLoaded={() => onModelState?.('loaded')} />
      </Suspense>
    </ModelBoundary>
  ) : (
    <Diorama name={landscape.model.diorama} reducedMotion={reducedMotion} />
  );

  return (
    <group position={spot.position} rotation-y={spot.yaw}>
      <group
        onClick={(event) => {
          event.stopPropagation();
          if (event.delta > 6) return; // the end of a drag, not a click
          onSelect();
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          if (!focused) onHover?.(landscape);
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover?.(null);
        }}
      >
        {/* The pedestal: a plinth, a fluted die and a gilt-banded cap */}
        <mesh material={materials.darkStone} position-y={0.06}>
          <boxGeometry args={[w + 0.24, 0.12, d + 0.24]} />
        </mesh>
        <mesh material={materials.plaster} position-y={CASE.plinth / 2}>
          <boxGeometry args={[w + 0.06, CASE.plinth - 0.12, d + 0.06]} />
        </mesh>
        {[0.15, CASE.plinth - 0.08].map((y) => (
          <mesh key={y} material={materials.gold} position-y={y}>
            <boxGeometry args={[w + 0.1, 0.05, d + 0.1]} />
          </mesh>
        ))}
        <mesh material={materials.darkTeak} position-y={CASE.plinth - 0.02}>
          <boxGeometry args={[w + 0.14, 0.05, d + 0.14]} />
        </mesh>
        {/* The plaque on the side facing the lamp, and so the visitor */}
        <mesh position={[0, CASE.plinth * 0.55, (d + 0.06) / 2 + 0.004]}>
          <planeGeometry args={[0.66, 0.206]} />
          <meshStandardMaterial map={plaque} roughness={0.5} metalness={0.2} emissive="#ffffff" emissiveMap={plaque} emissiveIntensity={hovered || focused ? 0.55 : 0.3} />
        </mesh>

        {/* The glass box and its gilt edges */}
        <group position-y={CASE.plinth}>
          <mesh material={materials.glass} position-y={h / 2}>
            <boxGeometry args={[w, h, d]} />
          </mesh>
          {GLASS_EDGES.map(({ position, size }, i) => (
            <mesh key={i} material={materials.gold} position={position}>
              <boxGeometry args={size} />
            </mesh>
          ))}
          <mesh material={materials.gold} position-y={h + 0.03}>
            <boxGeometry args={[w + 0.06, 0.04, d + 0.06]} />
          </mesh>
        </group>

        {/* The model, on its turntable, lifted clear of the case floor */}
        <group ref={turntable} position-y={CASE.plinth + 0.12} scale={MODEL_SCALE}>
          {model}
        </group>
      </group>

      {/* A warm spotlight from the ceiling, tinted with the landscape's light */}
      <primitive object={target} position={[0, MODEL_CENTRE_Y - 0.15, 0]} />
      <spotLight
        ref={spotlight}
        position={[0, 6.6, 1.2]}
        angle={0.13}
        penumbra={0.7}
        distance={9}
        decay={2}
        intensity={115}
        color={landscape.light}
      />
      {hovered && !focused && (
        <mesh position-y={CASE.plinth + h + 0.11} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[0.08, 0.1, 32]} />
          <meshBasicMaterial color="#f2d38b" transparent opacity={0.8} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}
