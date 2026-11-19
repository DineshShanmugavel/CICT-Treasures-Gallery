import React from 'react';
import { Environment, Lightformer } from '@react-three/drei';

/** Soft warm fill plus in-scene reflections for the bronze statue (no HDR download). */
export function StatueLighting() {
  return (
    <>
      <ambientLight intensity={0.35} color="#ffdcb0" />
      <hemisphereLight args={['#ffe9c4', '#2a1708', 0.6]} />
      <Environment resolution={128}>
        <Lightformer form="ring" intensity={2.4} color="#ffd9a0" position={[0, 7, 0]} rotation={[Math.PI / 2, 0, 0]} scale={5} />
        <Lightformer intensity={1.4} color="#ffb860" position={[-6, 2, -2]} scale={[4, 6, 1]} />
        <Lightformer intensity={1.1} color="#ffe0b0" position={[6, 3, 3]} scale={[4, 6, 1]} />
        <Lightformer intensity={0.5} color="#7a4a1c" position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={12} />
      </Environment>
    </>
  );
}
