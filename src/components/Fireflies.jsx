import React, { useMemo } from 'react';

/*
 * Kept apart from Lighting.jsx (the statue's WebGL lighting): that file pulls in
 * @react-three/drei and fiber, which only the lazily loaded statue stage needs, while the
 * fireflies drift over every page from the first.
 */

/** Deterministic pseudo-random numbers so the fireflies are the same on every visit. */
function seeded(seed) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

/**
 * A few glowing fireflies — soft golden embers drifting through a temple garden at dusk.
 * Each one is a bright warm-gold centre fading through amber to transparent, wrapped in
 * a soft box-shadow glow. Three layered CSS animations give the life: a looping wander
 * across the hall (floatAndDrift), a quick small flutter on top of it, and a twinkle
 * that fades the glow in and out while it breathes in size. Everything is
 * desynchronised per firefly and costs no WebGL; under prefers-reduced-motion they stop
 * wandering and only twinkle.
 *
 * Fills its positioned parent. Keep `count` sparse: 5–10 per view.
 */
export function GlowFireflies({ count = 7, seed = 11, className = '' }) {
  const flies = useMemo(() => {
    const random = seeded(seed);
    const sign = () => (random() < 0.5 ? -1 : 1);
    return Array.from({ length: count }, () => ({
      left: 8 + random() * 84, // % of the container
      top: 12 + random() * 70,
      size: 7 + random() * 4, // px, the bright core
      // A wide, unhurried loop: roughly 20–40 px per second.
      driftX: sign() * (90 + random() * 110), // px; the sign sets the loop's direction
      driftY: sign() * (50 + random() * 70),
      drift: 16 + random() * 12, // s per loop
      flutter: 2.5 + random() * 2.5, // s per bob
      twinkle: 2.5 + random() * 3,
      delay: random(),
    }));
  }, [count, seed]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {flies.map((fly, i) => (
        <span
          key={i}
          className="absolute animate-float-and-drift motion-reduce:animate-none"
          style={{
            left: `${fly.left}%`,
            top: `${fly.top}%`,
            '--drift-x': `${fly.driftX}px`,
            '--drift-y': `${fly.driftY}px`,
            animationDuration: `${fly.drift}s`,
            animationDelay: `${-fly.delay * fly.drift}s`,
          }}
        >
          <span
            className="block animate-firefly-flutter motion-reduce:animate-none"
            style={{ animationDuration: `${fly.flutter}s`, animationDelay: `${-fly.delay * fly.flutter * 1.7}s` }}
          >
            <span
              className="block animate-firefly-twinkle rounded-full"
              style={{
                width: fly.size,
                height: fly.size,
                background: 'radial-gradient(circle, #fffbea 0%, #fde68a 30%, rgba(251, 191, 36, 0.85) 55%, rgba(245, 158, 11, 0) 75%)',
                boxShadow: '0 0 15px 4px rgba(251, 191, 36, 0.6)',
                animationDuration: `${fly.twinkle}s`,
                animationDelay: `${-fly.delay * fly.twinkle * 2.3}s`,
              }}
            />
          </span>
        </span>
      ))}
    </div>
  );
}
