import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight, Hand, Volume2 } from 'lucide-react';
import { KolamFrame, KolamMandala, TempleBand } from './HeritageMotifs.jsx';
import BUILDING_IMAGE from '../assets/cict-building.jpg';
import CICT_LOGO from '../assets/cict-logo.jpg';
import WELCOME_NARRATION from '../assets/welcome-narration-ta.mp3';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { useI18n } from '../i18n/index.js';

const STAGES = [
  { upTo: 25, en: 'Lighting the temple lamps…', ta: 'விளக்கேற்றுகிறோம்', hi: 'मंदिर के दीप जलाए जा रहे हैं…' },
  { upTo: 50, en: 'Unrolling the palm-leaf manuscripts…', ta: 'ஓலைச்சுவடிகளை விரிக்கிறோம்', hi: 'ताड़पत्र पांडुलिपियाँ खोली जा रही हैं…' },
  { upTo: 75, en: 'Polishing the bronze icons…', ta: 'செப்புத் திருமேனிகளை மெருகேற்றுகிறோம்', hi: 'कांस्य प्रतिमाएँ चमकाई जा रही हैं…' },
  { upTo: 100, en: 'Opening the gallery doors…', ta: 'காட்சியகக் கதவுகளைத் திறக்கிறோம்', hi: 'दीर्घा के द्वार खोले जा रहे हैं…' },
];

/** Never keep visitors waiting forever on a stalled asset. */
const MAX_WAIT_MS = 12000;
/** If the welcome narration starts but then stalls, let visitors in after this long. */
const NARRATION_MAX_MS = 60000;

const preloadImage = (src) =>
  new Promise((resolve) => {
    const image = new Image();
    image.onload = image.onerror = () => resolve();
    image.src = src;
  });

/**
 * Heritage-styled splash shown while the museum prepares. Progress combines
 * image preloading, web fonts, and the 3D hallway (`sceneReady`) — and the welcome narration
 * (src/assets/welcome-narration-ta.mp3, Rajan / Eleven v4, like the kural recitations), which
 * plays as the splash appears: "Enter Museum" appears only once the museum has loaded AND
 * the narration has finished, and the bar follows the narration so the two end together.
 *
 * Browsers refuse sound before the visitor's first click or tap; then a "Tap to begin" button
 * shows instead of the bar (any click or key on the splash also starts it). If the recording
 * cannot be played at all, it is skipped rather than locking visitors out.
 * "Enter Museum" fades the screen out; `onEnter` fires on click, `onExited` after the fade.
 */
export default function LoadingScreen({ assets = [], sceneReady, onEnter, onExited }) {
  const [assetProgress, setAssetProgress] = useState(0);
  const [fontsReady, setFontsReady] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [shown, setShown] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const enterRef = useRef(null);
  // The welcome narration: 'starting' → 'playing' → 'done', or 'blocked' until the first tap.
  const narrationRef = useRef(null);
  const [narration, setNarration] = useState('starting');
  const [narrationProgress, setNarrationProgress] = useState(0);

  useEffect(() => {
    const audio = new Audio(WELCOME_NARRATION);
    audio.preload = 'auto';
    narrationRef.current = audio;
    let stallTimer = 0;
    const finish = () => {
      window.clearTimeout(stallTimer);
      setNarrationProgress(1);
      setNarration('done');
    };
    const onPlaying = () => {
      setNarration('playing');
      window.clearTimeout(stallTimer);
      stallTimer = window.setTimeout(finish, NARRATION_MAX_MS);
    };
    const onTime = () => audio.duration && setNarrationProgress(audio.currentTime / audio.duration);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', finish);
    audio.addEventListener('error', finish);
    audio.play().catch((error) => setNarration((current) => (current === 'done' ? current : error?.name === 'NotAllowedError' ? 'blocked' : 'done')));
    return () => {
      window.clearTimeout(stallTimer);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', finish);
      audio.removeEventListener('error', finish);
      audio.pause();
    };
  }, []);

  const startNarration = () => {
    const audio = narrationRef.current;
    if (!audio || !audio.paused) return;
    setNarration('starting');
    audio.play().catch(() => setNarration('done'));
  };

  // While the browser holds the sound back, the visitor's first click, tap or key starts it.
  useEffect(() => {
    if (narration !== 'blocked') return undefined;
    window.addEventListener('pointerdown', startNarration, { once: true });
    window.addEventListener('keydown', startNarration, { once: true });
    return () => {
      window.removeEventListener('pointerdown', startNarration);
      window.removeEventListener('keydown', startNarration);
    };
  }, [narration]);

  useEffect(() => {
    const all = [BUILDING_IMAGE, CICT_LOGO, ...assets];
    let loaded = 0;
    all.forEach((src) => preloadImage(src).then(() => setAssetProgress(++loaded / all.length)));
    document.fonts?.ready.then(() => setFontsReady(true)) ?? setFontsReady(true);
    const timer = window.setTimeout(() => setTimedOut(true), MAX_WAIT_MS);
    return () => window.clearTimeout(timer);
  }, []); // `assets` is a fixed list for the lifetime of the splash.

  const loaded = timedOut ? 100 : Math.round(assetProgress * 55 + (fontsReady ? 10 : 0) + (sceneReady ? 35 : 0));
  // The bar reaches 100% only when the museum is ready and the narration has ended.
  const target = Math.min(loaded, narration === 'done' ? 100 : Math.floor(narrationProgress * 99));

  // Ease the visible number toward the real target so the bar glides instead of jumping.
  useEffect(() => {
    if (shown >= target) return undefined;
    const timer = window.setTimeout(() => setShown((value) => Math.min(target, value + Math.max(1, Math.round((target - value) / 6)))), 40);
    return () => window.clearTimeout(timer);
  }, [shown, target]);

  const ready = shown >= 100;
  const stage = STAGES.find((item) => shown <= item.upTo) ?? STAGES[STAGES.length - 1];
  const { L, T, cl } = useI18n();

  useEffect(() => {
    if (ready) enterRef.current?.focus();
  }, [ready]);

  const enter = () => {
    if (leaving) return;
    setLeaving(true);
    onEnter();
    window.setTimeout(onExited, 900);
  };

  return (
    <div
      className={`fixed inset-0 z-[2000] overflow-hidden bg-[#0c0906] font-sans text-parchment transition-all duration-[900ms] ease-out ${
        leaving ? 'pointer-events-none scale-105 opacity-0' : 'scale-100 opacity-100'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={T('CICT Classical Tamil Treasures Gallery is loading', 'செம்மொழிப் பண்பாட்டுக் காட்சியகம் ஏற்றப்படுகிறது', 'CICT शास्त्रीय तमिल निधि दीर्घा लोड हो रही है')}
    >
      {/* The institute building, slowly drifting, washed in gold-on-stone tones */}
      <img src={BUILDING_IMAGE} alt="" className="absolute inset-0 size-full animate-ken-burns object-cover object-[50%_40%]" />
      <div className="absolute inset-0 bg-[#1d1206]/70 mix-blend-multiply" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,#2a1a0b99,#0c0906f2_75%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c0906]/80 via-transparent to-[#0c0906]" />

      <TempleBand className="absolute inset-x-0 top-0 text-[#d8b56b]/60" />
      <TempleBand className="absolute inset-x-0 bottom-0 rotate-180 text-[#d8b56b]/60" />
      <KolamFrame className="text-[#d8b56b]/55" />
      {/* The visitor chooses the museum's language before entering. */}
      <LanguageSwitcher className="absolute top-14 right-4 z-10 sm:top-16 sm:right-8" />

      <div className="relative flex h-full flex-col items-center justify-center overflow-y-auto px-6 py-14 text-center">
        {/* Emblem with pulsing halo and a slowly turning kolam */}
        <div className="relative grid size-40 shrink-0 place-items-center sm:size-48">
          <KolamMandala className="absolute -inset-10 animate-spin-slow text-[#d8b56b]/45 sm:-inset-14" />
          <span className="absolute inset-0 animate-halo rounded-full border-2 border-[#f4d792]/70" />
          <span className="absolute inset-0 animate-halo rounded-full border border-[#f4d792]/50 [animation-delay:1.4s]" />
          <img
            src={CICT_LOGO}
            alt={T('Central Institute of Classical Tamil emblem', 'செம்மொழித் தமிழாய்வு மத்திய நிறுவன இலச்சினை', 'केंद्रीय शास्त्रीय तमिल संस्थान का प्रतीक-चिह्न')}
            className="relative size-full rounded-full bg-white object-cover shadow-[0_0_0_3px_#d8b56b,0_0_0_7px_#1a1006,0_0_0_8px_#d8b56b88,0_0_60px_#f4d79255]"
          />
        </div>

        <p lang="ta" className="mt-10 text-sm font-semibold text-[#f0cf82] sm:text-base">செம்மொழித் தமிழாய்வு மத்திய நிறுவனம்</p>
        <p lang={cl} className="mt-1 text-[10px] tracking-[0.3em] text-[#d8c7a6] sm:text-xs">{L('CENTRAL INSTITUTE OF CLASSICAL TAMIL', 'केंद्रीय शास्त्रीय तमिल संस्थान')}</p>

        <div className="my-5 flex items-center gap-3 text-[#d8b56b]">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#d8b56b] sm:w-20" />
          <span className="size-1.5 rotate-45 bg-[#d8b56b]" />
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#d8b56b] sm:w-20" />
        </div>

        <h1 lang="ta" className="text-[clamp(1.6rem,7vw,3.25rem)] leading-[1.35] font-bold text-[#fff3d9] [text-shadow:0_4px_30px_#000]">
          செம்மொழிப் பண்பாட்டுக் காட்சியகம்
        </h1>
        <p lang={cl} className="mt-3 font-serif text-xl font-semibold tracking-wide text-[#e4c985] sm:text-3xl">{L('Classical Tamil Treasures Gallery', 'शास्त्रीय तमिल निधि दीर्घा')}</p>

        <div className="mt-10 h-24 w-full max-w-xs">
          {ready ? (
            <div className="flex animate-fade-up flex-col items-center gap-3">
              <button
                ref={enterRef}
                type="button"
                onClick={enter}
                className="group inline-flex cursor-pointer items-center gap-3 rounded-full border border-[#f3d58a] bg-gradient-to-br from-[#f5dc98] to-[#c89a4d] px-8 py-3.5 font-serif text-lg font-bold tracking-wide text-[#21170b] shadow-[0_0_40px_#dfb65855] animate-bounce-soft transition duration-300 ease-spring hover:scale-105 active:scale-95 hover:shadow-[0_8px_50px_#dfb65888]"
              >
                {L('Enter Museum', 'संग्रहालय में प्रवेश करें')} <span lang="ta" className="font-sans text-sm font-semibold">· நுழைக</span>
                <ChevronRight size={18} className="transition group-hover:translate-x-1" />
              </button>
              <span className="flex items-center gap-1.5 text-[11px] text-[#bfae90]">
                <Hand size={13} /> {T('Drag to look around the 360° hallway', '360° கூடத்தைச் சுற்றிப் பார்க்க இழுங்கள்', '360° गलियारे में चारों ओर देखने के लिए खींचें')}
              </span>
            </div>
          ) : narration === 'blocked' ? (
            <div className="flex animate-fade-up flex-col items-center gap-3">
              <button
                type="button"
                onClick={startNarration}
                className="inline-flex cursor-pointer items-center gap-3 rounded-full border border-[#f3d58a] bg-[#241b10]/90 px-7 py-3 font-serif text-base font-bold tracking-wide text-[#f4d792] shadow-[0_0_30px_#dfb65833] transition duration-300 ease-spring hover:scale-105 hover:border-[#fff3d9] active:scale-95"
              >
                <Volume2 size={18} /> <span lang="ta" className="font-sans text-sm">தொடங்குக</span> · {L('Tap to begin', 'शुरू करने के लिए टैप करें')}
              </button>
              <span className="text-[11px] text-[#bfae90]">{T('The museum opens with a short welcome in Tamil', 'சிறு தமிழ் வரவேற்புடன் காட்சியகம் தொடங்குகிறது', 'संग्रहालय तमिल में एक छोटे स्वागत के साथ खुलता है')}</span>
            </div>
          ) : (
            <div role="status" aria-live="polite">
              <div
                className="h-1.5 overflow-hidden rounded-full bg-[#3a2a17] shadow-[inset_0_1px_2px_#000a]"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={shown}
                aria-label={T('Loading the museum', 'அருங்காட்சியகம் ஏற்றப்படுகிறது', 'संग्रहालय लोड हो रहा है')}
              >
                <div
                  className="h-full animate-shimmer rounded-full bg-[linear-gradient(90deg,#b8893f,#f7e0a0,#b8893f)] bg-[length:200%_100%] transition-[width] duration-300"
                  style={{ width: `${shown}%` }}
                />
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-4 text-left">
                <span>
                  <span lang="ta" className="block text-xs font-semibold text-[#f0cf82]">{stage.ta}</span>
                  <span lang={cl} className="block text-[11px] text-[#bfae90]">{L(stage.en, stage.hi)}</span>
                  {narration === 'playing' && (
                    <span className="mt-1 flex items-center gap-1.5 text-[11px] text-[#e4c985]">
                      <Volume2 size={12} className="animate-pulse" /> {T('Welcome narration playing…', 'வரவேற்புரை ஒலிக்கிறது…', 'स्वागत कथन चल रहा है…')}
                    </span>
                  )}
                </span>
                <span className="font-serif text-2xl text-[#f4d792] tabular-nums">{shown}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
