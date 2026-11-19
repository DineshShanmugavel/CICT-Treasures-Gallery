import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useCursor } from '@react-three/drei';
import { seededRandom } from '../hallway/createHallwayScene.js';
import { useMaterials } from './RoomShell.jsx';
import { drawCover, drawPlaque, drawSpine, leatherFor, usePainted } from './paint.js';
import { tri } from '../../i18n/index.js';
import { BOOKCASE } from './roomLayout.js';

/*
 * A carved teak bookcase of one cabinet's volumes, built facing +z with its back to the
 * wall: on each shelf the first volume stands face-out, its cover lettered, and the rest
 * spine-out; palm-leaf bundles and brass vessels fill the rest of the shelf. Every volume is
 * a real e-book: pointing at one draws it a little off the shelf, clicking it opens it.
 */

const SIDE = 0.08;
const PLINTH = 0.28;
const CROWN = 0.16;
const BOARD = 0.04;
const PAGES = '#e9dcbc';

const pagesMaterial = new THREE.MeshStandardMaterial({ color: PAGES, roughness: 0.9 });

function useLeather(id) {
  const color = leatherFor(id);
  return useMemo(() => new THREE.MeshStandardMaterial({ color, roughness: 0.62 }), [color]);
}

/** One volume. `faceOut` stands it cover-forward, leaning back a little; otherwise spine-out. */
function Volume({ book, size: [width, height, depth], position, faceOut, onOpen, onHover }) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const group = useRef();
  const leather = useLeather(book.id);
  const color = leatherFor(book.id);
  const spineTexture = usePainted(128, Math.round((128 * height) / width), drawSpine(book, color), `spine-${book.id}`, { lettered: true });
  const coverTexture = usePainted(384, Math.round((384 * height) / width), drawCover(book, color), `cover-${book.id}`, { lettered: true });
  const face = useMemo(() => new THREE.MeshStandardMaterial({
    map: faceOut ? coverTexture : spineTexture,
    roughness: 0.55,
    emissive: '#ffffff',
    emissiveMap: faceOut ? coverTexture : spineTexture,
    emissiveIntensity: 0.08,
  }), [faceOut, coverTexture, spineTexture]);
  useEffect(() => () => { face.dispose(); leather.dispose(); }, [face, leather]);
  // [+x, −x, +y, −y, +z, −z]: the lettered face looks out (+z); page edges show top, bottom and back.
  const faces = faceOut ? [leather, pagesMaterial, pagesMaterial, pagesMaterial, face, leather] : [leather, leather, pagesMaterial, pagesMaterial, face, pagesMaterial];
  useFrame((_, delta) => {
    if (!group.current) return;
    const pull = hovered ? (faceOut ? 0.05 : 0.08) : 0;
    group.current.position.z += (position[2] + pull - group.current.position.z) * Math.min(1, delta * 10);
    face.emissiveIntensity += ((hovered ? 0.4 : 0.08) - face.emissiveIntensity) * Math.min(1, delta * 10);
  });
  return (
    <group ref={group} position={position} rotation-x={faceOut ? -0.12 : 0}>
      <mesh
        material={faces}
        position-y={height / 2}
        onClick={(event) => {
          event.stopPropagation();
          if (event.delta > 6) return;
          onOpen(book);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          onHover?.(book);
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover?.(null);
        }}
      >
        <boxGeometry args={[width, height, depth]} />
      </mesh>
    </group>
  );
}

/** A palm-leaf bundle lying on the shelf: a stack of leaves between wooden boards, tied with cord. */
function OlaiBundle({ position, length = 0.4, turn = 0 }) {
  const materials = useMaterials();
  return (
    <group position={position} rotation-y={turn}>
      <mesh position-y={0.012} material={materials.teak}>
        <boxGeometry args={[length, 0.012, 0.06]} />
      </mesh>
      <mesh position-y={0.032}>
        <boxGeometry args={[length - 0.01, 0.03, 0.055]} />
        <meshStandardMaterial color="#c9a669" roughness={0.85} />
      </mesh>
      <mesh position-y={0.052} material={materials.teak}>
        <boxGeometry args={[length, 0.012, 0.06]} />
      </mesh>
      {[-0.08, 0.08].map((x) => (
        <mesh key={x} position={[x, 0.032, 0]}>
          <boxGeometry args={[0.008, 0.062, 0.064]} />
          <meshStandardMaterial color="#8a2a1e" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

let potGeometry = null;
/** A small brass kalasam-shaped vessel. */
function BrassPot({ position, scale = 1 }) {
  const materials = useMaterials();
  potGeometry ??= new THREE.LatheGeometry([[0, 0], [0.04, 0], [0.07, 0.04], [0.08, 0.08], [0.06, 0.13], [0.035, 0.15], [0.045, 0.17], [0.03, 0.18], [0, 0.18]].map(([x, y]) => new THREE.Vector2(x, y)), 24);
  return <mesh geometry={potGeometry} material={materials.brass} position={position} scale={scale} />;
}

/** How a cabinet's volumes go onto the shelves: a few to each, the first on each shelf face-out. */
function layoutShelves(books, shelves) {
  const rows = Array.from({ length: shelves }, () => []);
  if (books.length <= shelves) {
    // A short cabinet starts on the second shelf down, at eye height, a volume to a shelf.
    const first = books.length < shelves ? 1 : 0;
    books.forEach((book, i) => rows[first + i].push(book));
  } else {
    const per = Math.ceil(books.length / shelves);
    books.forEach((book, i) => rows[Math.floor(i / per)].push(book));
  }
  return rows;
}

export default function Bookcase({ cabinet, onOpenBook, onHoverBook, onSelect }) {
  const materials = useMaterials();
  const { width: W, height: H, depth: D, shelves } = BOOKCASE;
  const innerWidth = W - SIDE * 2;
  const bay = (H - PLINTH - CROWN) / shelves;
  const header = usePainted(1024, 168, drawPlaque(cabinet.tamil, cabinet.title, tri(`${cabinet.books.length} volumes`, `${cabinet.books.length} நூல்கள்`, `${cabinet.books.length} ग्रंथ`)), `header-${cabinet.id}`, { lettered: true });

  const rows = useMemo(() => {
    const rand = seededRandom(cabinet.id.length * 131 + cabinet.books.length);
    return layoutShelves(cabinet.books, shelves).map((row, r) => {
      // Shelf r counts down from the top.
      const y = H - CROWN - (r + 1) * bay + BOARD / 2;
      const items = row.map((book, i) => {
        const faceOut = i === 0;
        const height = Math.min(bay - 0.12, faceOut ? 0.42 : 0.36 + rand() * 0.1);
        const size = faceOut ? [0.3, height, 0.05] : [0.07 + rand() * 0.05, height, 0.26];
        return { book, faceOut, size };
      });
      const gap = 0.012;
      const total = items.reduce((sum, { size }) => sum + size[0] + gap, 0) - gap;
      let x = -total / 2;
      const placed = items.map((item) => {
        const position = [x + item.size[0] / 2, y, item.faceOut ? 0.12 : D / 2 - item.size[2] / 2 - 0.02];
        x += item.size[0] + gap;
        return { ...item, position };
      });
      return { y, placed, span: total, index: r };
    });
  }, [cabinet, shelves, H, bay, D]);

  return (
    <group>
      {/* Carcass: plinth, back, sides, crown and the shelf boards */}
      <group
        onClick={(event) => {
          event.stopPropagation();
          if (event.delta > 6) return;
          onSelect?.();
        }}
      >
        <mesh material={materials.darkTeak} position={[0, PLINTH / 2, D / 2]}>
          <boxGeometry args={[W + 0.06, PLINTH, D + 0.04]} />
        </mesh>
        <mesh material={materials.darkTeak} position={[0, H / 2, 0.015]}>
          <boxGeometry args={[W, H, 0.03]} />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh key={side} material={materials.teak} position={[side * (W / 2 - SIDE / 2), H / 2, D / 2]}>
            <boxGeometry args={[SIDE, H, D]} />
          </mesh>
        ))}
        <mesh material={materials.teak} position={[0, H - CROWN / 2, D / 2 + 0.02]}>
          <boxGeometry args={[W + 0.12, CROWN, D + 0.08]} />
        </mesh>
        <mesh material={materials.gold} position={[0, H - CROWN - 0.01, D + 0.055]}>
          <boxGeometry args={[W + 0.1, 0.025, 0.02]} />
        </mesh>
        <mesh material={materials.gold} position={[0, PLINTH + 0.01, D + 0.035]}>
          <boxGeometry args={[W + 0.04, 0.025, 0.02]} />
        </mesh>
        {Array.from({ length: shelves - 1 }, (_, i) => (
          <mesh key={i} material={materials.teak} position={[0, PLINTH + (i + 1) * bay, D / 2]}>
            <boxGeometry args={[innerWidth, BOARD, D - 0.02]} />
          </mesh>
        ))}
        {[-1, 1].map((side) => (
          <mesh key={side} material={materials.gold} position={[side * (W / 2 - SIDE / 2), H / 2, D + 0.003]}>
            <boxGeometry args={[0.02, H - PLINTH - CROWN, 0.006]} />
          </mesh>
        ))}
      </group>
      {/* The gilt header board with the cabinet's names */}
      <mesh position={[0, H + 0.24, 0.08]}>
        <planeGeometry args={[2.3, 0.38]} />
        <meshStandardMaterial map={header} roughness={0.5} metalness={0.15} emissive="#ffffff" emissiveMap={header} emissiveIntensity={0.3} />
      </mesh>

      {rows.map(({ y, placed, span, index }) => {
        const room = (innerWidth - span) / 2;
        return (
          <group key={index}>
            {placed.map(({ book, faceOut, size, position }) => (
              <Volume key={book.id} book={book} size={size} position={position} faceOut={faceOut} onOpen={onOpenBook} onHover={onHoverBook} />
            ))}
            {/* Ornaments either side of the volumes, where the shelf has room */}
            {room > 0.3 && <BrassPot position={[-span / 2 - Math.min(0.22, room / 2), y, D / 2]} scale={index % 2 ? 1 : 0.85} />}
            {room > 0.5 && <OlaiBundle position={[span / 2 + Math.min(0.32, room / 2), y, D / 2]} length={Math.min(0.42, room - 0.12)} turn={0.06} />}
            {room > 0.5 && <OlaiBundle position={[span / 2 + Math.min(0.32, room / 2), y + 0.064, D / 2]} length={Math.min(0.36, room - 0.18)} turn={-0.08} />}
            {room > 0.9 && <BrassPot position={[span / 2 + Math.min(0.75, room - 0.15), y, D / 2]} scale={0.7} />}
            {room > 0.9 && <OlaiBundle position={[-span / 2 - Math.min(0.62, room - 0.25), y, D / 2]} length={0.34} turn={-0.05} />}
          </group>
        );
      })}
    </group>
  );
}
