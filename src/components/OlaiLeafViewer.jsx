import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, ImageOff, Maximize, Minus, Plus, Repeat, Volume2, VolumeX, X } from 'lucide-react';
import { PalmLeafText } from './ArtifactGallery.jsx';
import { KolamDivider } from './HeritageMotifs.jsx';
import RecitationButton from './RecitationButton.jsx';
import useNarration from '../audio/useNarration.js';
import { englishNarration, englishTitle, generatedNarration, hindiNarration } from '../narration/generated.js';
import { languageOf, pick, translate, useI18n } from '../i18n/index.js';

/** The narration and read-aloud buttons' labels in the chosen language (`T` from useI18n). */
const narrationLabels = (T) => ({
  play: T('Play the narration', 'விவரிப்பை இயக்கு', 'वर्णन चलाएँ'),
  pause: T('Pause the narration', 'விவரிப்பை நிறுத்து', 'वर्णन रोकें'),
  unavailable: T('Narration coming soon', 'விவரிப்பு விரைவில்', 'वर्णन जल्द आ रहा है'),
});
const speechLabels = (T) => ({
  play: T('Read the note aloud', 'குறிப்பைப் படித்துக் காட்டு', 'टिप्पणी पढ़कर सुनाएँ'),
  pause: T('Stop reading', 'படிப்பதை நிறுத்து', 'पढ़ना रोकें'),
  unavailable: T('No voice for this language on this device', 'இச்சாதனத்தில் இம்மொழிக்குக் குரல் இல்லை', 'इस उपकरण पर इस भाषा की आवाज़ नहीं है'),
});
/** How long each leaf stays open while the leaves turn by themselves. */
const AUTO_TURN_MS = 6000;
/** The brass rings the leaves hang from, along the top board. */
const RINGS = 12;
/** Zoom range for looking closer at a leaf, and the step of the − / + buttons. */
const MIN_ZOOM = 1;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.5;

const ease = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const twine = 'bg-[repeating-linear-gradient(25deg,#d9b779_0_2px,#8a6534_2px_4px)]';
/** A palm leaf's or a board's shape: long, with rounded ends. */
const leafShape = 'rounded-[48px/50%]';
/** The cord holes through every leaf and board, where the binding cords pass. */
const cordHoles = ['left-[5%]', 'left-[95%]'];

const woodButton =
  'touch-target grid size-10 shrink-0 cursor-pointer place-items-center rounded-full border border-temple-gold-light/70 bg-teak-dark text-temple-gold-light shadow-[0_4px_10px_#000a,inset_0_1px_#fff2] transition-[scale,opacity] duration-300 ease-spring hover:scale-110 active:scale-90 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:scale-100';
const smallWoodButton = woodButton.replace('size-10', 'size-8');
const toggleButton = (on) =>
  `inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors duration-300 ${
    on ? 'border-temple-gold-light bg-temple-gold/25 text-temple-gold-light' : 'border-temple-gold/40 text-[#ead8ae]/75 hover:text-temple-gold-light'
  }`;
const slider = 'h-1.5 min-w-0 cursor-pointer accent-[#d4a64a]';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/** A soft rustle for each turned leaf: a short burst of filtered noise, made on the spot. */
function useLeafSound(enabled) {
  const contextRef = useRef(null);
  useEffect(() => () => contextRef.current?.close?.(), []);
  return useCallback(() => {
    if (!enabled) return;
    try {
      const Context = window.AudioContext || window.webkitAudioContext;
      if (!Context) return;
      const context = (contextRef.current ??= new Context());
      const length = Math.floor(0.32 * context.sampleRate);
      const buffer = context.createBuffer(1, length, context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i += 1) {
        const t = i / length;
        data[i] = (Math.random() * 2 - 1) * (1 - t) ** 2 * (0.55 + 0.45 * Math.sin(t * Math.PI * 7));
      }
      const source = context.createBufferSource();
      source.buffer = buffer;
      const filter = context.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2200;
      filter.Q.value = 0.8;
      const gain = context.createGain();
      gain.gain.value = 0.16;
      source.connect(filter).connect(gain).connect(context.destination);
      source.start();
    } catch {
      // No sound is no loss: the leaf still turns.
    }
  }, [enabled]);
}

/**
 * Reads `text` aloud with the browser's own voice in `lang` ('ta' or 'en'), for bundles with
 * no recorded narration. `available` is false where the device has no voice for Tamil.
 */
function useSpokenNote(text, lang) {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  const [voices, setVoices] = useState(() => synth?.getVoices() ?? []);
  const [state, setState] = useState({ playing: false, progress: 0 });

  useEffect(() => {
    if (!synth) return undefined;
    const update = () => setVoices(synth.getVoices());
    synth.addEventListener?.('voiceschanged', update);
    update();
    return () => {
      synth.removeEventListener?.('voiceschanged', update);
      synth.cancel();
    };
  }, [synth]);

  useEffect(() => {
    synth?.cancel();
    setState({ playing: false, progress: 0 });
  }, [synth, text, lang]);

  const voice = voices.find((candidate) => candidate.lang?.toLowerCase().startsWith(lang));
  const available = Boolean(synth && text && (voice || lang === 'en'));

  const toggle = () => {
    if (!available) return;
    if (state.playing) {
      synth.cancel();
      setState((current) => ({ ...current, playing: false }));
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';
    if (voice) utterance.voice = voice;
    utterance.rate = 0.95;
    utterance.onboundary = (event) => setState({ playing: true, progress: event.charIndex / text.length });
    utterance.onend = () => setState({ playing: false, progress: 1 });
    utterance.onerror = () => setState({ playing: false, progress: 0 });
    synth.cancel();
    synth.speak(utterance);
    setState({ playing: true, progress: 0 });
  };

  return { state, toggle, available };
}

/** A brass-rimmed hole through a leaf or board, where a binding cord passes. */
function CordHole({ position }) {
  return <span className={`absolute top-1/2 ${position} z-10 size-3 -translate-1/2 rounded-full bg-[#3a1d0a] shadow-[inset_0_1px_2px_#000] ring-2 ring-[#a8792e]`} aria-hidden="true" />;
}

/** A brass peg, as on the covers of the Thirukkural's Olai Suvadi. */
function BrassPeg({ className = '' }) {
  return <span className={`block size-3 rounded-full bg-[radial-gradient(circle_at_35%_30%,#f7dc95,#b0832f_55%,#5a3a10)] shadow-[0_1px_2px_#000c] ${className}`} aria-hidden="true" />;
}

/** A wooden board of the bundle: the top cover with the title, or the footer with the controls. */
function WoodBoard({ children, className = '' }) {
  return (
    <div className={`bg-teak relative z-10 ${leafShape} shadow-[inset_0_0_0_1px_#d4a64a55,inset_0_2px_0_#ffffff1a,inset_0_-3px_6px_#0006,0_8px_18px_#000b] ${className}`}>
      {cordHoles.map((position) => (
        <span key={position} className={`absolute top-1/2 ${position} -translate-1/2`}>
          <BrassPeg className="size-3.5" />
        </span>
      ))}
      {children}
    </div>
  );
}

/**
 * One leaf of the bundle: an aged palm leaf with rounded ends and its two cord holes, the
 * leaf's photograph laid into it (multiplied, so the scan's pale ground takes the leaf's own
 * yellow-tan, its edges feathered into the leaf), and the punched holes where the rings pass
 * along its top edge. `view` is the zoom and pan ({ scale, x, y }); the photograph moves
 * within the leaf, the leaf stays put. `imageRef` reaches the photograph, for panning limits.
 */
function PalmLeaf({ leaf, view = null, dragging = false, imageRef = null }) {
  const [missing, setMissing] = useState(false);
  const zoomed = view && view.scale > 1;
  return (
    <div className={`bg-palm-leaf absolute inset-0 ${leafShape} shadow-[inset_0_0_0_1px_#8a5a2a55,inset_0_0_26px_#8a5a2a44,0_12px_26px_#000c] [backface-visibility:hidden]`}>
      <div className={`absolute inset-x-[9%] inset-y-[9%] flex items-center justify-center overflow-hidden ${zoomed ? 'cursor-grab active:cursor-grabbing' : ''}`}>
        {missing ? (
          <span className="grid place-items-center text-[#8a5a2a]/60"><ImageOff size={30} /></span>
        ) : (
          <img
            ref={imageRef}
            src={leaf.url}
            alt=""
            draggable={false}
            decoding="async"
            onError={() => setMissing(true)}
            style={view ? { transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` } : undefined}
            className={`block max-h-full max-w-full mix-blend-multiply will-change-transform [filter:contrast(1.3)_brightness(1.16)_saturate(0.85)] [mask-composite:intersect] [mask-image:linear-gradient(90deg,transparent,#000_3%,#000_97%,transparent),linear-gradient(180deg,transparent,#000_7%,#000_93%,transparent)] ${dragging ? '' : `transition-transform duration-300 ${ease}`}`}
          />
        )}
      </div>
      {/* The holes punched along the top edge for the rings */}
      <div className="pointer-events-none absolute inset-x-[14%] top-2 flex justify-between" aria-hidden="true">
        {Array.from({ length: RINGS }, (_, i) => (
          <span key={i} className="size-2 rounded-full bg-[#3a1d0a] shadow-[inset_0_1px_1px_#000]" />
        ))}
      </div>
      {cordHoles.map((position) => (
        <CordHole key={position} position={position} />
      ))}
    </div>
  );
}

/** The back of a leaf, seen as it swings over the binding. */
function LeafBack() {
  return (
    <div className={`bg-palm-leaf absolute inset-0 ${leafShape} shadow-[inset_0_0_0_1px_#8a5a2a55,inset_0_0_40px_#8a5a2a66] [backface-visibility:hidden] [transform:rotateX(180deg)]`} aria-hidden="true">
      {cordHoles.map((position) => (
        <CordHole key={position} position={position} />
      ))}
    </div>
  );
}

/**
 * A palm-leaf manuscript opened for reading, laid out as an Olai Suvadi: a dark-wood top board
 * carrying the title, the leaves hanging from it on brass rings like a spiral notepad, the
 * binding cords running down both sides through every leaf, and a wooden footer board with the
 * controls. Turning on, the open leaf lifts and swings up over the binding to show the next;
 * turning back, the previous leaf swings down over it (the footer's Up / Down and slider, the
 * arrow keys, the mouse wheel over the leaf, or a swipe). The zoom (the footer's − / + and
 * slider, Ctrl + wheel or a pinch, a double-click, the + / − / 0 keys) brings the leaf's
 * letters and binding holes close; drag to move about the leaf.
 *
 * Below, the bundle's note in Tamil and English follows the leaves, and the audio panel plays
 * the bundle's narration (or reads its note aloud where none is recorded), rustles each turned
 * leaf, and can turn the leaves by itself.
 */
export default function OlaiLeafViewer({ bundle, onClose }) {
  const count = bundle.leaves.length;
  const [index, setIndex] = useState(0);
  const [flip, setFlip] = useState(null); // { from, to, dir: 'up' | 'down', key }
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [rustle, setRustle] = useState(true);
  const [autoTurn, setAutoTurn] = useState(false);
  const { L, T, cl, lang } = useI18n();
  // The note is read aloud in Tamil or the visitor's language (English, or Hindi in Hindi).
  const [speechChoice, setSpeechChoice] = useState(lang === 'en' || lang === 'hi' ? 'other' : 'ta');
  const speechLang = speechChoice === 'ta' ? 'ta' : cl;
  const closeRef = useRef(null);
  const stageRef = useRef(null);
  const frameRef = useRef(null); // the photograph's window within the leaf, for panning limits
  const imageRef = useRef(null); // the open leaf's photograph
  const pointerRef = useRef(null); // { id, x, y, view } while a finger or the mouse is down on the leaf
  const wheelRef = useRef(0);
  const reduced = useRef(typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // A recorded narration if the bundle has one, else the generated reading of its Tamil note.
  const recordedNarration = bundle.narration && !bundle.narration.includes('/narration/ta/') ? bundle.narration : null;
  const tamilSrc = generatedNarration(bundle.description?.ta); // also marks the Tamil note as this player's
  // The English narration (title, then note): heard when the language choice below is English
  // (the default with the museum in English); தமிழ் plays the Tamil one.
  // In Hindi, the same choice plays the Hindi narration.
  const otherSrc = recordedNarration
    ? null
    : cl === 'en'
      ? englishNarration(englishTitle(bundle), bundle.description?.en)
      : cl === 'hi'
        ? hindiNarration(englishTitle(bundle), bundle.description?.en)
        : null;
  const tamilVoice = recordedNarration ?? tamilSrc;
  const wantsOther = speechChoice !== 'ta' && (cl === 'en' || cl === 'hi');
  // A recording always wins over the browser's synthetic voice: with no recording in the chosen
  // language, the other one plays.
  const narrationSrc = wantsOther ? otherSrc ?? tamilVoice : tamilVoice ?? otherSrc;
  const bothVoices = Boolean(tamilVoice && otherSrc);
  const narration = useNarration(narrationSrc);
  const note = bundle.description ? pick(bundle.description, speechLang) : '';
  const spoken = useSpokenNote(narrationSrc ? '' : `${speechLang === 'ta' ? bundle.tamil : translate(bundle.title, undefined, speechLang)}. ${note}`, speechLang);
  const playRustle = useLeafSound(rustle);

  const indexRef = useRef(index);
  indexRef.current = index;
  const viewRef = useRef(view);
  viewRef.current = view;

  /** Keeps a pan at the given scale from moving the photograph's edges inside its window. */
  const bounded = useCallback((scale, x, y) => {
    const frame = frameRef.current?.getBoundingClientRect();
    const image = imageRef.current;
    if (!frame || !image || scale <= 1) return { scale: Math.max(MIN_ZOOM, scale), x: 0, y: 0 };
    const maxX = Math.max(0, (image.offsetWidth * scale - frame.width) / 2);
    const maxY = Math.max(0, (image.offsetHeight * scale - frame.height) / 2);
    return { scale, x: clamp(x, -maxX, maxX), y: clamp(y, -maxY, maxY) };
  }, []);

  /** Zooms to `scale`, keeping the point at `focus` (offset from the window's centre, in px) still. */
  const zoomTo = useCallback(
    (scale, focus = { x: 0, y: 0 }) => {
      const current = viewRef.current;
      const next = clamp(Math.round(scale * 100) / 100, MIN_ZOOM, MAX_ZOOM);
      const ratio = next / current.scale;
      setView(bounded(next, focus.x - (focus.x - current.x) * ratio, focus.y - (focus.y - current.y) * ratio));
    },
    [bounded],
  );
  const focusOf = (event) => {
    const frame = frameRef.current?.getBoundingClientRect();
    return frame ? { x: event.clientX - (frame.left + frame.width / 2), y: event.clientY - (frame.top + frame.height / 2) } : { x: 0, y: 0 };
  };

  const turn = useCallback(
    (target) => {
      const from = indexRef.current;
      const to = clamp(target, 0, count - 1);
      if (to === from) return;
      indexRef.current = to; // so a second turn before the re-render starts from here
      const zoomed = viewRef.current.scale > 1;
      // A zoomed leaf is replaced in place, keeping the zoom but centring it again.
      if (zoomed) setView((current) => ({ ...current, x: 0, y: 0 }));
      setFlip(!reduced.current && !zoomed ? { from, to, dir: to > from ? 'up' : 'down', key: Date.now() } : null);
      setIndex(to);
      playRustle();
    },
    [count, playRustle],
  );
  const turnRef = useRef(turn);
  turnRef.current = turn;
  const zoomRef = useRef(zoomTo);
  zoomRef.current = zoomTo;

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      // A focused slider moves itself with the arrow keys.
      if (event.target instanceof HTMLInputElement && event.target.type === 'range') return;
      const step = { ArrowDown: 1, ArrowRight: 1, PageDown: 1, ArrowUp: -1, ArrowLeft: -1, PageUp: -1 }[event.key];
      if (step) {
        event.preventDefault();
        turnRef.current(indexRef.current + step);
      } else if (event.key === 'Home') turnRef.current(0);
      else if (event.key === 'End') turnRef.current(Infinity);
      else if (event.key === '+' || event.key === '=') zoomRef.current(viewRef.current.scale + ZOOM_STEP);
      else if (event.key === '-' || event.key === '_') zoomRef.current(viewRef.current.scale - ZOOM_STEP);
      else if (event.key === '0') zoomRef.current(1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  /*
   * The wheel over the leaf: with Ctrl (or a trackpad pinch) it zooms towards the pointer;
   * on a zoomed leaf it moves about the leaf; otherwise it turns one leaf per flick. Never
   * also scrolls the page, so it is registered as a non-passive listener.
   */
  useEffect(() => {
    const stage = stageRef.current;
    const onWheel = (event) => {
      event.preventDefault();
      const current = viewRef.current;
      if (event.ctrlKey) {
        zoomRef.current(current.scale * Math.exp(-event.deltaY * 0.01), focusOf(event));
      } else if (current.scale > 1) {
        setView(bounded(current.scale, current.x - event.deltaX, current.y - event.deltaY));
      } else if (Math.abs(event.deltaY) >= 8) {
        const now = Date.now();
        if (now - wheelRef.current < 650) return;
        wheelRef.current = now;
        turnRef.current(indexRef.current + (event.deltaY > 0 ? 1 : -1));
      }
    };
    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => stage.removeEventListener('wheel', onWheel);
  }, [bounded]);

  // Fetch the leaves either side of the open one, so turning shows them at once.
  useEffect(() => {
    [1, -1, 2].forEach((offset) => {
      const leaf = bundle.leaves[index + offset];
      if (leaf) new Image().src = leaf.url;
    });
  }, [bundle, index]);

  // Turning the leaves by themselves, one every few seconds, until the last.
  useEffect(() => {
    if (!autoTurn) return undefined;
    if (index >= count - 1) {
      setAutoTurn(false);
      return undefined;
    }
    const timer = setTimeout(() => turnRef.current(index + 1), AUTO_TURN_MS);
    return () => clearTimeout(timer);
  }, [autoTurn, index, count]);

  // On a zoomed leaf a drag moves about the leaf; otherwise lifting the leaf up turns on, pulling it down turns back.
  const onPointerDown = (event) => {
    if (event.button !== 0) return;
    pointerRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY, view: viewRef.current };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const onPointerMove = (event) => {
    const start = pointerRef.current;
    if (!start || start.id !== event.pointerId || start.view.scale <= 1) return;
    setDragging(true);
    setView(bounded(start.view.scale, start.view.x + event.clientX - start.x, start.view.y + event.clientY - start.y));
  };
  const onPointerUp = (event) => {
    const start = pointerRef.current;
    pointerRef.current = null;
    setDragging(false);
    if (!start || start.view.scale > 1) return;
    const dy = event.clientY - start.y;
    if (Math.abs(dy) > 40) turn(index + (dy < 0 ? 1 : -1));
  };

  const base = flip ? bundle.leaves[flip.dir === 'up' ? flip.to : flip.from] : bundle.leaves[index];
  const turning = flip && bundle.leaves[flip.dir === 'up' ? flip.from : flip.to];
  const leaf = bundle.leaves[index];
  const turned = count > 1 ? index / (count - 1) : 1;
  const percent = Math.round(view.scale * 100);

  return (
    <div
      className="fixed inset-0 z-[1200] animate-[fade-in_.25s_ease] overflow-x-clip overflow-y-auto bg-[#0c0906]/92 p-4 backdrop-blur-sm sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section role="dialog" aria-modal="true" aria-labelledby="olai-bundle-title" className="relative mx-auto flex w-full max-w-6xl animate-pop-in flex-col gap-6">
        <button ref={closeRef} type="button" onClick={onClose} aria-label={T('Tie up the bundle and close', 'கட்டை முடிந்து மூடு', 'गट्ठर बाँधकर बंद करें')} className={`${woodButton} absolute -top-1 right-0 z-40 size-11`}>
          <X size={18} />
        </button>

        {/* The bundle: top board, the hanging leaf, the footer board, and the cords through them all */}
        <div className="relative pt-1">
          {cordHoles.map((position) => (
            <span key={position} className={`absolute inset-y-6 ${position} z-0 w-[3px] -translate-x-1/2 shadow-[1px_0_2px_#0009] ${twine}`} aria-hidden="true" />
          ))}

          <WoodBoard className="mr-14 flex min-h-14 flex-col items-center justify-center px-[12%] py-2 text-center sm:mr-0">
            <h2 id="olai-bundle-title" className="text-sm leading-[1.7] font-bold tracking-[0.06em] text-temple-gold-light sm:text-base">
              <span lang="ta">{bundle.tamil}</span> · <span lang={cl} className="font-serif tracking-[0.15em]">{L('OLAI SUVADI', 'ओलै सुवडि')}</span>
            </h2>
            <p lang={cl} className="font-serif text-xs leading-tight text-[#ead8ae]/85 italic sm:text-sm">
              {L(bundle.title)}
              {bundle.number ? ` · ${L('No.', 'सं.')} ${bundle.number}` : ''}
            </p>
          </WoodBoard>

          {/* The leaf, hanging from its rings */}
          <div
            ref={stageRef}
            className="relative z-20 mx-[1%] mt-5 h-[clamp(130px,17vw,220px)] touch-none select-none"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              pointerRef.current = null;
              setDragging(false);
            }}
            onDoubleClick={(event) => zoomTo(view.scale > 1 ? 1 : 2.5, focusOf(event))}
          >
            <div className="pointer-events-none absolute inset-x-[14%] -top-7 z-40 flex justify-between" aria-hidden="true">
              {Array.from({ length: RINGS }, (_, i) => (
                <span key={i} className="flex w-2 flex-col items-center">
                  <BrassPeg className="size-2.5" />
                  <span className="-mt-1 block h-9 w-3.5 rounded-full border-[3px] [border-color:#f2d38b_#8a6420_#5a3a10_#c9a04e] shadow-[1px_1px_2px_#000b,inset_0_0_1px_#fff8]" />
                </span>
              ))}
            </div>
            <div ref={frameRef} className="pointer-events-none absolute inset-x-[9%] inset-y-[9%]" aria-hidden="true" />
            <PalmLeaf key={`base-${base.url}`} leaf={base} view={flip ? null : view} dragging={dragging} imageRef={imageRef} />
            {flip && (
              <>
                <div key={`shade-${flip.key}`} className={`pointer-events-none absolute inset-0 animate-leaf-shadow ${leafShape} bg-[linear-gradient(180deg,#000b,#0005)]`} aria-hidden="true" />
                <div key={`fade-${flip.key}`} className={`pointer-events-none absolute inset-0 [perspective:1400px] ${flip.dir === 'up' ? 'animate-leaf-fade-over' : 'animate-leaf-fade-under'}`}>
                  <div
                    className={`absolute inset-0 origin-top [transform-style:preserve-3d] ${flip.dir === 'up' ? 'animate-leaf-flip-up' : 'animate-leaf-flip-down'}`}
                    onAnimationEnd={(event) => {
                      if (event.target === event.currentTarget) setFlip(null);
                    }}
                  >
                    <PalmLeaf leaf={turning} />
                    <LeafBack />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* The footer board: turning the leaves, and looking closer */}
          <WoodBoard className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 px-[9%] py-3">
            <nav className="flex min-w-[min(100%,22rem)] flex-[3] items-center gap-2.5" aria-label={T('Turn the leaves', 'ஏடுகளைப் புரட்டு', 'पत्ते पलटें')}>
              <button type="button" onClick={() => turn(index - 1)} disabled={index === 0} aria-label={T('Previous leaf', 'முந்தைய ஏடு', 'पिछला पत्ता')} className={woodButton}>
                <ChevronUp size={19} />
              </button>
              <span lang="ta" className="text-[11px] font-bold text-temple-gold-light/85">ஏடு</span>
              <input
                type="range"
                min={1}
                max={count}
                value={index + 1}
                onChange={(event) => turn(Number(event.target.value) - 1)}
                aria-label={T('Go to leaf', 'ஏட்டுக்குச் செல்', 'पत्ते पर जाएँ')}
                className={`${slider} flex-1`}
              />
              <span className="min-w-[4.5rem] text-center text-sm font-bold text-temple-gold-light tabular-nums" aria-live="polite">
                {index + 1} / {count}
              </span>
              <button type="button" onClick={() => turn(index + 1)} disabled={index === count - 1} aria-label={T('Next leaf', 'அடுத்த ஏடு', 'अगला पत्ता')} className={woodButton}>
                <ChevronDown size={19} />
              </button>
            </nav>
            <div className="flex min-w-[min(100%,15rem)] flex-1 items-center gap-2" role="group" aria-label={T('Zoom', 'பெரிதாக்கம்', 'ज़ूम')}>
              <button type="button" onClick={() => zoomTo(view.scale - ZOOM_STEP)} disabled={view.scale <= MIN_ZOOM} aria-label={T('Zoom out', 'சிறிதாக்கு', 'छोटा करें')} className={smallWoodButton}>
                <Minus size={15} />
              </button>
              <input
                type="range"
                min={MIN_ZOOM * 100}
                max={MAX_ZOOM * 100}
                step={10}
                value={percent}
                onChange={(event) => zoomTo(Number(event.target.value) / 100)}
                aria-label={T('Zoom', 'பெரிதாக்கம்', 'ज़ूम')}
                aria-valuetext={`${percent}%`}
                className={`${slider} flex-1`}
              />
              <button type="button" onClick={() => zoomTo(view.scale + ZOOM_STEP)} disabled={view.scale >= MAX_ZOOM} aria-label={T('Zoom in', 'பெரிதாக்கு', 'बड़ा करें')} className={smallWoodButton}>
                <Plus size={15} />
              </button>
              <span className="w-11 text-right text-xs font-semibold text-temple-gold-light/90 tabular-nums">{percent}%</span>
              <button type="button" onClick={() => zoomTo(1)} disabled={view.scale === 1} aria-label={T('Show the whole leaf', 'முழு ஏட்டையும் காட்டு', 'पूरा पत्ता दिखाएँ')} title={T('Whole leaf', 'முழு ஏடு', 'पूरा पत्ता')} className={smallWoodButton}>
                <Maximize size={14} />
              </button>
            </div>
          </WoodBoard>
          <p className="mt-2 text-center text-[10px] font-semibold tracking-[0.16em] text-temple-gold-light/60">
            {T('↑ ↓ OR SWIPE TO TURN · CTRL + SCROLL, PINCH OR DOUBLE-CLICK TO ZOOM · DRAG TO MOVE', '↑ ↓ அல்லது தேய்த்துப் புரட்டுக · CTRL + உருட்டல், கிள்ளுதல் அல்லது இருமுறை சொடுக்கிப் பெரிதாக்குக · இழுத்து நகர்த்துக', '↑ ↓ या स्वाइप से पलटें · CTRL + स्क्रॉल, पिंच या डबल-क्लिक से ज़ूम करें · खींचकर खिसकाएँ')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          {/* The bundle's note, following the leaves */}
          <PalmLeafText className="text-left">
            <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-[#8a5a2a]/30 pb-3">
              {bundle.number && <span className="rounded-full bg-terracotta-deep px-2.5 py-0.5 text-[11px] font-semibold text-[#fbe7b5]">{L('No.', 'सं.')} {bundle.number}</span>}
              <span className="rounded-full border border-[#8a5a2a]/50 px-2.5 py-0.5 text-[11px] font-semibold text-terracotta-deep" lang={cl}>{L(bundle.material)}</span>
              <span className="rounded-full border border-[#8a5a2a]/50 px-2.5 py-0.5 text-[11px] font-semibold text-terracotta-deep"><span lang={cl}>{count} {L('leaves', 'पत्ते')}</span> · <span lang="ta">{count} ஏடுகள்</span></span>
            </div>
            <p key={index} className="mb-4 animate-[fade-in_.4s_ease] text-sm leading-relaxed">
              <span className="text-[11px] font-bold tracking-[0.16em] text-[#7d2e14] uppercase">
                <span lang={cl}>{L(`Leaf ${index + 1} of ${count}`, `पत्ता ${index + 1} / ${count}`)}</span> <span lang="ta" className="font-sans tracking-normal normal-case">· ஏடு {index + 1} / {count}</span>
              </span>
              <span lang={cl} className="mt-1 block font-serif text-base italic">
                {index === 0
                  ? L('The opening of the bundle', 'गट्ठर का आरंभ')
                  : index === count - 1
                    ? L('The last leaf of the bundle', 'गट्ठर का अंतिम पत्ता')
                    : L(`${Math.max(1, Math.round(turned * 100))}% of the way through the bundle`, `गट्ठर का ${Math.max(1, Math.round(turned * 100))}% भाग पूरा`)}
                <span className="text-[#6a3a1a]/70 not-italic"> · {L('photograph', 'तस्वीर')} “{leaf.label}”</span>
              </span>
              <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-[#8a5a2a]/25" aria-hidden="true">
                <span className="block h-full rounded-full bg-[#7d2e14] transition-[width] duration-500" style={{ width: `${Math.max(2, turned * 100)}%` }} />
              </span>
            </p>
            {bundle.description ? (
              <div className="flex flex-col gap-4 lg:max-h-[30dvh] lg:overflow-y-auto lg:pr-2 lg:[scrollbar-color:#8a5a2a66_transparent] lg:[scrollbar-width:thin]">
                <p lang="ta" className="text-[15px] leading-[1.95] font-medium">{bundle.description.ta}</p>
                <KolamDivider className="mx-auto block w-full max-w-[160px] shrink-0 text-[#8a5a2a]/60" />
                <p lang={cl} className="font-serif text-base leading-[1.75]">{L(bundle.description)}</p>
              </div>
            ) : (
              <p lang={cl} className="font-serif text-base leading-[1.75]">{L('A palm-leaf manuscript from the museum’s collection.', 'संग्रहालय के संग्रह की एक ताड़पत्र पांडुलिपि।')}</p>
            )}
          </PalmLeafText>

          {/* The audio panel */}
          <aside aria-label={T('Listen', 'கேளுங்கள்', 'सुनें')} className="bg-teak flex flex-col gap-5 rounded-lg p-5 shadow-[0_14px_30px_#000b,inset_0_0_0_1px_#d4a64a44]">
            <div className="flex items-center gap-3">
              {narrationSrc ? (
                <RecitationButton state={narration.state} available onToggle={narration.toggle} labels={narrationLabels(T)} />
              ) : (
                <RecitationButton state={spoken.state} available={spoken.available} onToggle={spoken.toggle} labels={speechLabels(T)} />
              )}
              <span className="flex min-w-0 flex-col text-[11px] leading-snug font-semibold tracking-wide text-[#ead8ae]">
                <span lang="ta">{narrationSrc ? 'சுவடியின் விவரிப்பைக் கேளுங்கள்' : 'குறிப்பைக் குரலில் கேளுங்கள்'}</span>
                <span lang={cl}>{narrationSrc ? L('Listen to the narration', 'वर्णन सुनें') : L('Hear the note read aloud', 'टिप्पणी पढ़कर सुनें')}</span>
              </span>
            </div>
            {(!narrationSrc || bothVoices) && (
              <div className="flex gap-2" role="group" aria-label={T('Language to read in', 'படிக்கும் மொழி', 'पढ़ने की भाषा')}>
                {[['ta', 'தமிழ்', 'ta'], ['other', languageOf(cl).label, cl]].map(([code, label, labelLang]) => (
                  <button key={code} type="button" lang={labelLang} onClick={() => setSpeechChoice(code)} aria-pressed={speechChoice === code} className={toggleButton(speechChoice === code)}>
                    {label}
                  </button>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setRustle((on) => !on)} aria-pressed={rustle} className={toggleButton(rustle)}>
                {rustle ? <Volume2 size={13} /> : <VolumeX size={13} />} {T('Leaf sound', 'ஏட்டு ஒலி', 'पत्ते की ध्वनि')}
              </button>
              <button type="button" onClick={() => setAutoTurn((on) => !on)} aria-pressed={autoTurn} disabled={index >= count - 1} className={`${toggleButton(autoTurn)} disabled:cursor-not-allowed disabled:opacity-40`}>
                <Repeat size={13} /> {T('Turn by itself', 'தானே புரளட்டும்', 'अपने आप पलटें')}
              </button>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
