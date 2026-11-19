import React, { useId } from 'react';

/*
 * Line-art Tamil heritage ornaments drawn in `currentColor`, so callers tint them
 * with a text colour (gold on stone, ink on parchment).
 */

const PETAL_ANGLES = Array.from({ length: 12 }, (_, i) => i * 30);
const DOT_ANGLES = Array.from({ length: 36 }, (_, i) => i * 10);

/** A kolam-style mandala: lotus petals, interlaced loops, and a ring of pulli dots. */
export function KolamMandala({ className = '' }) {
  return (
    <svg viewBox="-100 -100 200 200" className={className} fill="none" stroke="currentColor" aria-hidden="true">
      <circle r="97" strokeWidth="0.6" />
      <circle r="91" strokeWidth="0.5" strokeDasharray="1.2 3.2" />
      {DOT_ANGLES.map((angle) => (
        <circle key={`dot-${angle}`} cy="-86" r="1.1" fill="currentColor" stroke="none" transform={`rotate(${angle})`} />
      ))}
      {PETAL_ANGLES.map((angle) => (
        <g key={angle} transform={`rotate(${angle})`}>
          <path d="M0 -34 C 13 -48 13 -66 0 -79 C -13 -66 -13 -48 0 -34 Z" strokeWidth="0.8" />
          <path d="M0 -44 C 5 -51 5 -61 0 -67 C -5 -61 -5 -51 0 -44 Z" strokeWidth="0.5" />
          <path d="M0 -34 C 18 -36 26 -52 22 -66" strokeWidth="0.5" />
        </g>
      ))}
      <circle r="34" strokeWidth="0.7" />
      <circle r="28" strokeWidth="0.4" strokeDasharray="0.8 2.4" />
    </svg>
  );
}

/** Corner flourish for framing a panel; rotate/flip it for the other corners. */
export function KolamCorner({ className = '' }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M4 118 V34 Q4 4 34 4 H118" strokeWidth="1.4" />
      <path d="M13 118 V40 Q13 13 40 13 H118" strokeWidth="0.6" />
      <path d="M22 76 C22 44 44 22 76 22" strokeWidth="0.8" />
      <path d="M30 30 C 42 18 54 22 50 34 C 46 46 30 38 30 30 Z" strokeWidth="0.8" />
      <path d="M30 30 C 18 42 22 54 34 50 C 46 46 38 30 30 30 Z" strokeWidth="0.8" />
      <circle cx="30" cy="30" r="3" fill="currentColor" stroke="none" />
      {[52, 68, 84, 100].map((p) => (
        <React.Fragment key={p}>
          <circle cx={p} cy="8.5" r="1.3" fill="currentColor" stroke="none" />
          <circle cx="8.5" cy={p} r="1.3" fill="currentColor" stroke="none" />
        </React.Fragment>
      ))}
    </svg>
  );
}

/** Four KolamCorner flourishes positioned in the corners of a relative parent. */
export function KolamFrame({ className = 'text-[#d8b56b]/70', size = 'size-16 sm:size-24' }) {
  return (
    <div className={`pointer-events-none absolute inset-3 sm:inset-5 ${className}`} aria-hidden="true">
      <KolamCorner className={`absolute top-0 left-0 ${size}`} />
      <KolamCorner className={`absolute top-0 right-0 ${size} -scale-x-100`} />
      <KolamCorner className={`absolute bottom-0 left-0 ${size} -scale-y-100`} />
      <KolamCorner className={`absolute right-0 bottom-0 ${size} -scale-100`} />
    </div>
  );
}

/**
 * A crimson wax seal pressed with an emblem (the CICT logo), with ribbon tails, as on an
 * old royal letter. `className` sizes it; the image is tinted into the wax and embossed.
 */
export function WaxSeal({ src, label, className = 'size-28' }) {
  const id = `wax-${useId().replace(/[^\w-]/g, '')}`;
  return (
    <div className={`relative ${className}`} role="img" aria-label={label}>
      {/* Ribbon tails beneath the seal */}
      <span className="absolute top-[58%] left-[22%] h-[52%] w-[18%] origin-top rotate-[18deg] bg-gradient-to-b from-[#8a1a12] to-[#5a0d08] shadow-[2px_3px_6px_#0006] [clip-path:polygon(0_0,100%_0,100%_100%,50%_82%,0_100%)]" aria-hidden="true" />
      <span className="absolute top-[58%] right-[22%] h-[52%] w-[18%] origin-top -rotate-[18deg] bg-gradient-to-b from-[#9a2016] to-[#5a0d08] shadow-[2px_3px_6px_#0006] [clip-path:polygon(0_0,100%_0,100%_100%,50%_82%,0_100%)]" aria-hidden="true" />
      {/* Irregular wax blob with a raised rim */}
      <svg viewBox="0 0 120 120" className="absolute inset-0 size-full drop-shadow-[0_6px_8px_#3a0a0699]" aria-hidden="true">
        <defs>
          <radialGradient id={`${id}-wax`} cx="40%" cy="35%" r="70%">
            <stop offset="0" stopColor="#c8382a" />
            <stop offset="0.55" stopColor="#8f1d14" />
            <stop offset="1" stopColor="#5a0c07" />
          </radialGradient>
        </defs>
        <path
          d="M60 6c9 0 13 6 21 7s14-2 19 5 2 13 6 19 9 11 7 19-8 10-9 18 3 15-4 21-14 3-21 7-11 12-19 12-11-7-19-11-15 0-20-7-1-14-5-21-10-9-9-18 7-12 7-20-5-14 1-20 14-3 21-6S51 6 60 6z"
          fill={`url(#${id}-wax)`}
        />
        <circle cx="60" cy="60" r="38" fill="none" stroke="#5a0c07" strokeWidth="4" opacity="0.55" />
        <circle cx="60" cy="60" r="41.5" fill="none" stroke="#e06a52" strokeWidth="1.2" opacity="0.45" />
      </svg>
      {/* The emblem, pressed into the wax */}
      <img
        src={src}
        alt=""
        className="absolute inset-[24%] size-[52%] rounded-full object-cover opacity-90 mix-blend-multiply [filter:grayscale(1)_sepia(1)_saturate(4)_hue-rotate(-30deg)_contrast(1.4)_brightness(0.85)] shadow-[inset_0_2px_6px_#0009]"
      />
      <span className="absolute inset-[24%] rounded-full shadow-[inset_2px_3px_6px_#00000088,inset_-2px_-2px_4px_#ff9a8044]" aria-hidden="true" />
      {/* Gloss */}
      <span className="absolute top-[16%] left-[24%] h-[16%] w-[26%] -rotate-[25deg] rounded-full bg-white/25 blur-[2px]" aria-hidden="true" />
    </div>
  );
}

/** A kolam line: pulli dots joined by looping strokes, for dividers and borders. */
export function KolamDivider({ className = '' }) {
  const patternId = `kolam-${useId().replace(/[^\w-]/g, '')}`;
  return (
    <svg className={className} height="14" width="100%" aria-hidden="true">
      <defs>
        <pattern id={patternId} width="24" height="14" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="7" r="1.6" fill="currentColor" />
          <path d="M0 7 C 4 0 8 0 12 7 C 16 14 20 14 24 7" fill="none" stroke="currentColor" strokeWidth="0.9" />
          <path d="M0 7 C 4 14 8 14 12 7 C 16 0 20 0 24 7" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="14" fill={`url(#${patternId})`} />
    </svg>
  );
}

/** A band of carved lotus petals, as on temple plinths and shelf edges. */
export function LotusBorder({ className = '' }) {
  const patternId = `lotus-${useId().replace(/[^\w-]/g, '')}`;
  return (
    <svg className={className} height="16" width="100%" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <pattern id={patternId} width="20" height="16" patternUnits="userSpaceOnUse">
          <path d="M10 1 C 16 5 16 12 10 15 C 4 12 4 5 10 1 Z" fill="currentColor" opacity="0.55" />
          <path d="M10 4 C 13 7 13 11 10 13 C 7 11 7 7 10 4 Z" fill="currentColor" opacity="0.9" />
          <path d="M0 15.5 H20" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="16" fill={`url(#${patternId})`} />
    </svg>
  );
}

/**
 * A fluted sandstone pillar with a carved capital and base, for framing cabinets and
 * rooms. It stretches to its parent's height.
 */
export function StonePillar({ className = '' }) {
  return (
    <div className={`relative flex flex-col ${className}`} aria-hidden="true">
      {/* Capital: corbel steps with a gilded lotus band */}
      <div className="bg-sandstone h-3 rounded-t-sm shadow-[0_3px_6px_#0008]" />
      <div className="bg-sandstone mx-[-10%] h-4 shadow-[0_3px_6px_#0008]" />
      <LotusBorder className="block text-temple-gold" />
      {/* Fluted shaft */}
      <div className="bg-sandstone relative mx-[12%] flex-1 shadow-[inset_6px_0_10px_#0005,inset_-6px_0_10px_#0006]">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,#00000030_0_2px,transparent_2px_7px,#ffffff1a_7px_8px,transparent_8px_11px)]" />
        <div className="absolute inset-x-0 top-1/2 h-6 -translate-y-1/2 border-y border-temple-gold/70 bg-sandstone-dark/40" />
      </div>
      {/* Base */}
      <LotusBorder className="block rotate-180 text-temple-gold" />
      <div className="bg-sandstone mx-[-10%] h-5 rounded-b-sm shadow-[0_4px_8px_#0009]" />
    </div>
  );
}

/**
 * A carved temple crest (inspired by a gopuram's tiers) with kalasam finials, to crown
 * a cabinet. Children are shown on the central plaque.
 */
export function TempleCrest({ children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 800 70" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden="true">
        <defs>
          <linearGradient id="crest-wood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6b3818" />
            <stop offset="1" stopColor="#3a1b0a" />
          </linearGradient>
        </defs>
        {/* Stepped tiers */}
        <path d="M0 70 V48 H40 V38 H120 V28 H260 V16 H540 V28 H680 V38 H760 V48 H800 V70 Z" fill="url(#crest-wood)" />
        <path d="M0 48 H40 V38 H120 V28 H260 V16 H540 V28 H680 V38 H760 V48 H800" fill="none" stroke="#d4a64a" strokeWidth="2" />
        <path d="M0 62 H800" stroke="#d4a64a" strokeWidth="1.2" opacity="0.7" />
      </svg>
      {/* Kalasam finials on the top tier */}
      {['left-[33%]', 'left-1/2', 'left-[67%]'].map((position) => (
        <span key={position} className={`absolute -top-3 ${position} flex -translate-x-1/2 flex-col items-center`} aria-hidden="true">
          <span className="h-2 w-0.5 bg-temple-gold" />
          <span className="size-3 rounded-full bg-gradient-to-br from-temple-gold-light to-temple-gold shadow-[0_0_8px_#f2d38b88]" />
          <span className="-mt-0.5 h-1.5 w-4 rounded-b-full bg-temple-gold" />
        </span>
      ))}
      <div className="relative flex h-full items-end justify-center pb-2">{children}</div>
    </div>
  );
}

/**
 * A brass Nilavilakku standing on a carved stone base, three of its wick flames flickering
 * (each out of step) inside a slowly breathing golden glow — the 2D rooms' counterpart of
 * the deepams on the 3D hall's pillars. Size it with a height class in `className`.
 */
export function Deepam({ className = 'h-24' }) {
  const id = `deepam-${useId().replace(/[^\w-]/g, '')}`;
  const flames = [[9, 0], [20, 0.3], [31, 0.55]];
  return (
    <div className={`relative aspect-[40/88] ${className}`} aria-hidden="true">
      <div className="absolute -inset-x-[120%] -top-[40%] bottom-[30%] animate-deepam-glow rounded-full bg-[radial-gradient(circle_at_50%_40%,#ffb35c66,#ff9a3a1f_40%,transparent_68%)] motion-reduce:animate-none" />
      <svg viewBox="0 0 40 88" className="relative size-full overflow-visible">
        <defs>
          <linearGradient id={`${id}-brass`} x1="0" x2="1">
            <stop offset="0" stopColor="#6a420f" />
            <stop offset="0.35" stopColor="#f2c66b" />
            <stop offset="0.6" stopColor="#b47c25" />
            <stop offset="1" stopColor="#4e2f07" />
          </linearGradient>
          <linearGradient id={`${id}-stone`} x1="0" x2="1">
            <stop offset="0" stopColor="#6d5a43" />
            <stop offset="0.45" stopColor="#c2a77d" />
            <stop offset="1" stopColor="#5a4835" />
          </linearGradient>
          <radialGradient id={`${id}-flame`} cx="0.5" cy="0.75" r="0.75">
            <stop offset="0" stopColor="#fffbe8" />
            <stop offset="0.3" stopColor="#ffe08a" />
            <stop offset="0.7" stopColor="#ff9a2e" stopOpacity="0.8" />
            <stop offset="1" stopColor="#ff6a10" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Carved stone base */}
        <path d="M3 88h34v-5H3z" fill={`url(#${id}-stone)`} />
        <path d="M6 83h28v-6H6z" fill={`url(#${id}-stone)`} />
        <path d="M6 79h28" stroke="#3a2a1a" strokeOpacity=".5" strokeWidth=".6" />
        <path d="M9 77h22v-3H9z" fill={`url(#${id}-stone)`} />
        {/* The lamp: domed foot, knopped stem, oil bowl, finial */}
        <path d="M10 74q10-8 20 0z" fill={`url(#${id}-brass)`} />
        <rect x="18.6" y="42" width="2.8" height="28" fill={`url(#${id}-brass)`} />
        {[50, 58, 66].map((y) => <ellipse key={y} cx="20" cy={y} rx="3.6" ry="1.6" fill={`url(#${id}-brass)`} />)}
        <path d="M6 39q14 10 28 0l-2.5 3.5q-11.5 6-23 0z" fill={`url(#${id}-brass)`} />
        <ellipse cx="20" cy="39" rx="14" ry="2.6" fill={`url(#${id}-brass)`} />
        <rect x="19" y="24" width="2" height="15" fill={`url(#${id}-brass)`} />
        <path d="M20 14q4 6 0 11q-4-5 0-11z" fill={`url(#${id}-brass)`} />
        {/* Flames on the bowl's rim */}
        {flames.map(([x, delay]) => (
          <path
            key={x}
            d={`M${x} 26q3.4 7 0 12q-3.4-5 0-12z`}
            fill={`url(#${id}-flame)`}
            className="animate-flame motion-reduce:animate-none"
            style={{ transformBox: 'fill-box', transformOrigin: '50% 100%', animationDelay: `${delay}s` }}
          />
        ))}
      </svg>
    </div>
  );
}

/** A lobed cartouche (corners scooped out in quarter-circles), as an SVG path. */
const cuspedRect = (x, y, w, h, r) =>
  `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 0 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 0 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 0 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 0 ${x + r} ${y}Z`;
const CEILING_STARS = [14, 27, 40, 53].flatMap((y, row) => [30, 42, 54, 66, 78, 90].map((x) => [x + (row % 2 ? 6 : 0), y])).filter(([x]) => x < 94);
const MANDALA_PETALS = Array.from({ length: 16 }, (_, i) => i * 22.5);

/**
 * The painted ceiling seen as a band along the top of a 2D view, to match the 3D hall and
 * the Thanjavur mandapam it follows: ochre sandstone beams between painted panels, each a
 * lobed royal-blue cartouche sprinkled with star-flowers round a cream mandala, with the
 * cove's warm light falling below.
 */
export function PaintedCeilingBand({ className = '' }) {
  const id = `ceiling-${useId().replace(/[^\w-]/g, '')}`;
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <svg height="84" width="100%" className="block">
        <defs>
          <radialGradient id={`${id}-blue`}>
            <stop offset="0.2" stopColor="#3256b4" />
            <stop offset="1" stopColor="#152d74" />
          </radialGradient>
          <pattern id={id} width="120" height="76" patternUnits="userSpaceOnUse">
            <rect width="120" height="76" fill="#b9874a" />
            <rect x="9" y="3" width="102" height="70" fill="#d4ac6a" stroke="#efe0bb" strokeWidth="2.5" />
            <path d={cuspedRect(24, 9, 72, 58, 9)} fill={`url(#${id}-blue)`} stroke="#efe0bb" strokeWidth="2.5" />
            {CEILING_STARS.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.1" fill="#f4ead0" />)}
            <g transform="translate(60 38)">
              <circle r="21" fill="#efe0bb" stroke="#6a3a1a" strokeWidth="1.4" />
              <circle r="17" fill="none" stroke="#c9974e" strokeWidth="3" strokeDasharray="1 1.4" />
              {MANDALA_PETALS.map((a) => <path key={a} transform={`rotate(${a})`} d="M0-7q3-4 0-8q-3 4 0 8z" fill="#c9974e" stroke="#6a3a1a" strokeWidth=".4" />)}
              <circle r="5" fill="#c9974e" stroke="#6a3a1a" strokeWidth=".6" />
              <circle r="1.8" fill="#6a3a1a" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="76" fill={`url(#${id})`} />
        <rect y="72" width="100%" height="12" className="fill-[#a8783e]" />
        <rect y="72" width="100%" height="1.5" className="fill-[#efe0bb]/50" />
      </svg>
      <div className="h-12 bg-gradient-to-b from-[#ffc27a]/30 to-transparent" />
    </div>
  );
}

/**
 * A carved cornice frieze, as on Chola and Pandya temple walls: beam-end dentils, kudu
 * (horseshoe-arch) dormers with lotus finials, a lotus fillet, and a procession of hamsa
 * swans over a beaded string course. Each motif is cut in relief — a dark cast shadow
 * under the stone itself, which takes `currentColor`.
 */
export function TempleFrieze({ className = '' }) {
  const id = `frieze-${useId().replace(/[^\w-]/g, '')}`;
  return (
    <svg className={className} height="56" width="100%" aria-hidden="true">
      <defs>
        <g id={`${id}-motifs`}>
          {[0, 12, 24, 36, 48, 60, 72, 84].map((x) => <rect key={x} x={x + 2} y="0" width="8" height="6" />)}
          <path d="M30 34V20a18 18 0 0 1 36 0v14h-6V20a12 12 0 0 0-24 0v14z" />
          <circle cx="48" cy="5" r="2.6" />
          <circle cx="48" cy="25" r="4" />
          <rect x="0" y="35.5" width="96" height="2.5" />
          {[4, 12, 20, 28, 36, 44, 52, 60, 68, 76, 84, 92].map((x) => <path key={x} d={`M${x} 38q3-3 0-6q-3 3 0 6z`} />)}
          <path
            transform="translate(48 47) scale(9)"
            d="M-.9.1C-.7.55.5.6.75.15.8-.05.55-.2.5-.45.45-.75.7-.95.85-.85L1.08-.8.86-.71C.72-.74.62-.55.68-.4.75-.2.4-.1 0-.15-.4-.2-.7-.5-.98-.62-.86-.3-.96-.05-.9.1Z"
          />
          {[4, 12, 20, 28, 36, 44, 52, 60, 68, 76, 84, 92].map((x) => <circle key={x} cx={x} cy="54" r="1.6" />)}
        </g>
        <pattern id={id} width="96" height="56" patternUnits="userSpaceOnUse">
          <use href={`#${id}-motifs`} transform="translate(0.8 1.2)" fill="#000" opacity="0.6" />
          <use href={`#${id}-motifs`} fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="56" fill={`url(#${id})`} />
    </svg>
  );
}

/** A repeating temple-frieze band of diamonds and lotus buds. */
export function TempleBand({ className = '' }) {
  const patternId = `band-${useId().replace(/[^\w-]/g, '')}`;
  return (
    <svg className={className} height="18" width="100%" aria-hidden="true">
      <defs>
        <pattern id={patternId} width="28" height="18" patternUnits="userSpaceOnUse">
          <path d="M0 1 H28 M0 17 H28" stroke="currentColor" strokeWidth="0.8" />
          <path d="M14 4 L20 9 L14 14 L8 9 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <circle cx="14" cy="9" r="1.4" fill="currentColor" />
          <path d="M0 9 C 2 5 4 5 4 9 C 4 13 2 13 0 9 Z M28 9 C 26 5 24 5 24 9 C 24 13 26 13 28 9 Z" fill="currentColor" opacity="0.7" />
        </pattern>
      </defs>
      <rect width="100%" height="18" fill={`url(#${patternId})`} />
    </svg>
  );
}
