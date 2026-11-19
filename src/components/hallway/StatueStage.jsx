import React, { Component, Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollText, Sparkles } from 'lucide-react';
import ThiruvalluvarStatue from './ThiruvalluvarStatue.jsx';
import { StatueLoadingBadge } from './StatueLoadingBadge.jsx';
import { StatueLighting } from '../Lighting.jsx';
import { GlowFireflies } from '../Fireflies.jsx';
import { KolamFrame } from '../HeritageMotifs.jsx';
import MUSEUM_IMAGE from '../../assets/tamil-museum-hero.webp';
import { ANTIALIAS, MAX_PIXEL_RATIO } from '../../pixelRatio.js';
import { useI18n } from '../../i18n/index.js';

/** Shown when WebGL or the model is unavailable: the gallery's bronze sage, still clickable. */
function StillStatue() {
  return <img src={MUSEUM_IMAGE} alt="" className="absolute inset-0 size-full object-cover object-[50%_52%] opacity-80" />;
}

class StageBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error('Statue stage unavailable:', error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function AimCamera() {
  const camera = useThree((state) => state.camera);
  useEffect(() => camera.lookAt(0, 1.95, 0), [camera]);
  return null;
}

/** Slow turntable so visitors see the sage from every side; it pauses while hovered. */
function Turntable({ children, hovered, reducedMotion }) {
  const group = useRef();
  useFrame((_, delta) => {
    if (!reducedMotion && !hovered) group.current.rotation.y += Math.min(delta, 0.05) * 0.18;
  });
  return <group ref={group}>{children}</group>;
}

/**
 * The Thiruvalluvar monument on its own stage, for the arched hall view: a small
 * self-contained 3D canvas with the bronze statue, its golden aura, and fireflies.
 * Clicking the statue (or the plaque) calls `onOpen` to show the Thirukkural scroll.
 */
export default function StatueStage({ onOpen, reducedMotion = false, active = true, className = '' }) {
  const [hovered, setHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const still = <StillStatue />;
  const { L, T } = useI18n();

  return (
    <section
      aria-label={T('Thiruvalluvar statue', 'திருவள்ளுவர் திருவுருவம்', 'तिरुवल्लुवर की प्रतिमा')}
      className={`group relative isolate flex min-h-[340px] flex-col overflow-hidden rounded-t-[999px] rounded-b-2xl border-4 border-temple-gold/80 bg-[radial-gradient(ellipse_at_50%_35%,#5a3414,#1e0f06_70%)] shadow-[0_0_60px_#d4a64a33,0_24px_50px_#000c,inset_0_0_0_6px_#2a1408] ${className}`}
    >
      <KolamFrame className="z-10 text-temple-gold/40" size="size-10 sm:size-14" />

      <div className={`relative flex-1 ${hovered ? 'cursor-pointer' : ''}`}>
        <StageBoundary fallback={still}>
          <Canvas
            dpr={[1, MAX_PIXEL_RATIO]} // the screen's own density, up to 2× on retina screens (1.5× on touch screens)
            shadows={false}
            // Covered by a room or the scroll: stop drawing, so the GPU and CPU are free for
            // what is on screen (and its narration plays without stutter on modest phones).
            frameloop={active ? 'always' : 'never'}
            camera={{ position: [0, 2.35, 6.6], fov: 38, near: 0.1, far: 60 }}
            gl={{ antialias: ANTIALIAS, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: false }}
            fallback={still}
            style={{ position: 'absolute', inset: 0 }}
          >
            <AimCamera />
            <StatueLighting />
            <Suspense fallback={null}>
              <group
                onClick={(event) => {
                  event.stopPropagation();
                  onOpen();
                }}
                onPointerOver={(event) => {
                  event.stopPropagation();
                  setHovered(true);
                }}
                onPointerOut={() => setHovered(false)}
              >
                <Turntable hovered={hovered} reducedMotion={reducedMotion}>
                  <ThiruvalluvarStatue hovered={hovered} reducedMotion={reducedMotion} onLoaded={setLoaded} />
                </Turntable>
              </group>
            </Suspense>
          </Canvas>
          {!loaded && <StatueLoadingBadge />}
        </StageBoundary>
        <GlowFireflies count={3} seed={5} />
      </div>

      <button
        type="button"
        onClick={onOpen}
        className="relative z-10 mx-auto mb-5 inline-flex cursor-pointer items-center gap-2 rounded-full border border-temple-gold-light bg-teak-dark/85 px-5 py-2.5 text-center shadow-[0_0_26px_#f1c35b55] backdrop-blur-md transition duration-300 ease-spring hover:scale-105 active:scale-95"
      >
        <ScrollText size={16} className="text-temple-gold-light" />
        <span>
          <span className="block text-sm font-bold text-[#fbe7b5]"><span lang="ta">திருவள்ளுவர்</span> · {L('Thiruvalluvar', 'तिरुवल्लुवर')}</span>
          <span className="flex items-center justify-center gap-1 text-[10px] font-semibold tracking-wide text-temple-gold-light">
            <Sparkles size={11} className="animate-pulse" /> {T('Explore all 1330 Kurals', '1330 குறள்களையும் காணுங்கள்', 'सभी 1330 कुरल देखें')}
          </span>
        </span>
      </button>
    </section>
  );
}
