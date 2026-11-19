import React, { Suspense, useState } from 'react';
import * as THREE from 'three';
import { useCursor, useTexture } from '@react-three/drei';
import { useMaterials } from './RoomShell.jsx';
import { drawChart, drawPlaque, usePainted } from './paint.js';

/*
 * What hangs on the walls: the five landscape photographs (public/5 lanscapes food) framed
 * in gilt in the north wall's arches, each lit from within a little as if spotlit, and the
 * Ainthinai chart painted on plaster on the east wall. All built facing +z.
 */

const MAX_W = 2.3;
const MAX_H = 1.7;
const FRAME = 0.1;
export const PHOTO_CENTRE_Y = 2.75;

function Picture({ url, onSize }) {
  const texture = useTexture(url, (loaded) => {
    loaded.colorSpace = THREE.SRGBColorSpace;
    loaded.anisotropy = 8;
    onSize(loaded.image.width / loaded.image.height);
  });
  return <meshStandardMaterial map={texture} emissive="#ffffff" emissiveMap={texture} emissiveIntensity={0.42} roughness={0.7} />;
}

/** One photograph in its gilt frame, with a brass caption plate under it. */
export function PhotoPanel({ artifact, landscape, onOpen, onHover }) {
  const materials = useMaterials();
  const [aspect, setAspect] = useState(1.75);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const width = Math.min(MAX_W, MAX_H * aspect);
  const height = width / aspect;
  const caption = usePainted(768, 160, drawPlaque(landscape?.tamil ?? artifact.tamil ?? '', artifact.title, artifact.detail), `caption-${artifact.id}`, { lettered: true });
  return (
    <group
      position-y={PHOTO_CENTRE_Y}
      onClick={(event) => {
        event.stopPropagation();
        if (event.delta > 6) return;
        onOpen();
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
        onHover?.(artifact);
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover?.(null);
      }}
    >
      <mesh material={materials.gold} position-z={0.03}>
        <boxGeometry args={[width + FRAME * 2, height + FRAME * 2, 0.06]} />
      </mesh>
      <mesh material={materials.darkTeak} position-z={0.062}>
        <boxGeometry args={[width + 0.04, height + 0.04, 0.01]} />
      </mesh>
      <mesh position-z={0.07}>
        <planeGeometry args={[width, height]} />
        <Suspense fallback={<meshStandardMaterial color="#3a2210" />}>
          <Picture url={artifact.url} onSize={setAspect} />
        </Suspense>
      </mesh>
      {hovered && (
        <mesh position-z={0.025}>
          <planeGeometry args={[width + FRAME * 2 + 0.16, height + FRAME * 2 + 0.16]} />
          <meshBasicMaterial color="#f2d38b" transparent opacity={0.35} toneMapped={false} />
        </mesh>
      )}
      <mesh position={[0, -height / 2 - FRAME - 0.22, 0.04]}>
        <planeGeometry args={[1.5, 0.31]} />
        <meshStandardMaterial map={caption} roughness={0.5} metalness={0.2} emissive="#ffffff" emissiveMap={caption} emissiveIntensity={hovered ? 0.55 : 0.32} />
      </mesh>
    </group>
  );
}

/** The Ainthinai chart in a gilt frame. */
export function Chart({ landscapes, rows, onSelect }) {
  const materials = useMaterials();
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const chart = usePainted(1600, 1100, drawChart(landscapes, rows), 'chart', { lettered: true });
  const width = 3.2;
  const height = (width * 1100) / 1600;
  return (
    <group
      position-y={2.65}
      onClick={(event) => {
        event.stopPropagation();
        if (event.delta > 6) return;
        onSelect?.();
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <mesh material={materials.gold} position-z={0.03}>
        <boxGeometry args={[width + 0.18, height + 0.18, 0.06]} />
      </mesh>
      <mesh position-z={0.065}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={chart} roughness={0.85} emissive="#ffffff" emissiveMap={chart} emissiveIntensity={hovered ? 0.4 : 0.3} />
      </mesh>
    </group>
  );
}
