import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, CircleHelp, DoorOpen, Hand, Images, Landmark, Map as MapIcon, X } from 'lucide-react';
import { KolamDivider } from './HeritageMotifs.jsx';
import { tri, useI18n } from '../i18n/index.js';

/*
 * The guided tour for first-time visitors: a few short steps on finding one's way round
 * the museum. It opens by itself on entering the museum while the visitor's preference is
 * on (the switch in the tour, kept in localStorage on this device), and from the Guide
 * tab at the edge of the screen at any time.
 */

const PREFERENCE_KEY = 'museum-tutorial';

/** The visitor's choice to see the tour on entering: on unless they switched it off (and on if storage is unavailable). */
export function useTutorialPreference() {
  const [enabled, setEnabled] = useState(() => {
    try {
      return window.localStorage.getItem(PREFERENCE_KEY) !== 'off';
    } catch {
      return true;
    }
  });
  const update = useCallback((value) => {
    setEnabled(value);
    try {
      window.localStorage.setItem(PREFERENCE_KEY, value ? 'on' : 'off');
    } catch { /* remembered for this visit only */ }
  }, []);
  return [enabled, update];
}

const STEPS = [
  {
    icon: Landmark,
    tamil: 'வருக, வணக்கம்',
    title: 'Welcome to the Central Hall',
    body: 'You start beside the CICT monolith, at the heart of the museum. Tap the stone (or the CICT Monument button) to read its four faces.',
    hi: { title: 'केंद्रीय कक्ष में आपका स्वागत है', body: 'आप संग्रहालय के बीचोंबीच, CICT स्तंभ के पास से शुरू करते हैं। उसके चारों फलक पढ़ने के लिए पत्थर (या CICT स्मारक बटन) को छुएँ।' },
    taBody: 'அருங்காட்சியகத்தின் நடுவே, நினைவுத் தூணின் அருகில் தொடங்குகிறீர்கள். அதன் நான்கு பக்கங்களையும் படிக்கக் கல்லை (அல்லது நினைவுத் தூண் பொத்தானை) தொடுங்கள்.',
  },
  {
    icon: Hand,
    tamil: 'சுற்றிப் பாருங்கள்',
    title: 'Look around',
    body: 'Drag or swipe to turn, or use the ← → keys. The buttons along the bottom turn you to each arch; tap an arch or its label to go through it.',
    hi: { title: 'चारों ओर देखें', body: 'मुड़ने के लिए खींचें या स्वाइप करें, या ← → कुंजियों का उपयोग करें। नीचे के बटन आपको हर मेहराब की ओर मोड़ते हैं; किसी मेहराब या उसके लेबल को छूकर उसमें से जाएँ।' },
    taBody: 'திரும்ப இழுங்கள் அல்லது வருடுங்கள், அல்லது ← → விசைகளைப் பயன்படுத்துங்கள். கீழே உள்ள பொத்தான்கள் ஒவ்வொரு வளைவின் பக்கமும் திருப்பும்; ஒரு வளைவையோ அதன் பெயரையோ தொட்டு உள்ளே செல்லுங்கள்.',
  },
  {
    icon: DoorOpen,
    tamil: 'திறந்த நடைபாதைகள்',
    title: 'Open corridors',
    body: 'Arches marked with a doorway are open corridors, with no doors. Walk one and you glide straight into the next hall. Each ring hall joins the Central Hall and the halls either side of it, so you can walk all the way round; Historical Figures opens beyond the Literature Hall, and Tamil Nadu: Then & Now beyond Trade & Ports.',
    hi: { title: 'खुले गलियारे', body: 'द्वार-चिह्न वाली मेहराबें बिना दरवाज़ों के खुले गलियारे हैं। किसी एक से चलें और आप सीधे अगले कक्ष में पहुँच जाते हैं। घेरे का हर कक्ष केंद्रीय कक्ष और अपने दोनों ओर के कक्षों से जुड़ा है, इसलिए आप पूरा चक्कर लगा सकते हैं; ऐतिहासिक व्यक्तित्व कक्ष साहित्य कक्ष के आगे खुलता है, और तमिलनाडु: तब और अब व्यापार और बंदरगाह कक्ष के आगे।' },
    taBody: 'கதவுக் குறியிட்ட வளைவுகள் கதவுகள் இல்லாத திறந்த நடைபாதைகள். ஒன்றில் நடந்தால் நேராக அடுத்த கூடத்துக்குச் செல்வீர்கள். வட்டத்தின் ஒவ்வொரு கூடமும் நடுக்கூடத்துடனும் இருபுறக் கூடங்களுடனும் இணைந்துள்ளதால் முழுவதும் சுற்றி வரலாம்; வரலாற்று ஆளுமைகள் கூடம் இலக்கியக் கூடத்துக்கு அப்பாலும், தமிழ்நாடு: அன்றும் இன்றும் வணிகம் & துறைமுகங்கள் கூடத்துக்கு அப்பாலும் உள்ளன.',
  },
  {
    icon: BookOpen,
    tamil: 'அலமாரிகளும் சுவடிகளும்',
    title: 'Shelves and cabinets',
    body: 'Inside a room, glass cabinets hold books: tap a volume to open it and turn its pages. Palm-leaf bundles rest on shelves: tap one to untie it, turn its leaves, and zoom in on the writing.',
    hi: { title: 'अलमारियाँ और ताखे', body: 'कमरे के भीतर काँच की अलमारियों में पुस्तकें हैं: किसी ग्रंथ को छूकर खोलें और उसके पन्ने पलटें। ताड़पत्र की पोथियाँ ताखों पर रखी हैं: किसी को छूकर खोलें, उसके पत्र पलटें और लिखावट को बड़ा करके देखें।' },
    taBody: 'அறையினுள் கண்ணாடி அலமாரிகளில் நூல்கள் உள்ளன: ஒரு நூலைத் தொட்டுத் திறந்து பக்கங்களைப் புரட்டுங்கள். பனையோலைக் கட்டுகள் அடுக்குகளில் உள்ளன: ஒன்றைத் தொட்டு அவிழ்த்து, ஏடுகளைப் புரட்டி, எழுத்தைப் பெரிதாக்கிப் பாருங்கள்.',
  },
  {
    icon: Images,
    tamil: 'படப் புத்தகங்கள்',
    title: 'Photobooks',
    body: 'Picture galleries open as photobooks. Tap the right-hand page (or swipe) to turn forward, the left-hand page to go back. The story and narration beside the book follow the page.',
    hi: { title: 'चित्र-पुस्तकें', body: 'चित्र-दीर्घाएँ चित्र-पुस्तकों के रूप में खुलती हैं। आगे बढ़ने के लिए दाएँ पन्ने को छुएँ (या स्वाइप करें), पीछे जाने के लिए बाएँ पन्ने को। पुस्तक के साथ की कहानी और वर्णन पन्ने के साथ बदलते हैं।' },
    taBody: 'படக் காட்சிகள் படப் புத்தகங்களாகத் திறக்கும். முன்னே செல்ல வலப் பக்கத்தைத் தொடுங்கள் (அல்லது வருடுங்கள்), பின்னே செல்ல இடப் பக்கத்தை. அருகிலுள்ள கதையும் விவரிப்பும் பக்கத்தைத் தொடரும்.',
  },
  {
    icon: MapIcon,
    tamil: 'வரைபடம்',
    title: 'The map',
    body: 'The mini-map in the corner shows the whole museum; the red arrow is you, pointing the way you face. Open the full map (or the Map button) and choose any hall or room to travel there.',
    hi: { title: 'मानचित्र', body: 'कोने का छोटा मानचित्र पूरा संग्रहालय दिखाता है; लाल तीर आप हैं, जो आपके सामने की दिशा दिखाता है। पूरा मानचित्र (या मानचित्र बटन) खोलें और वहाँ जाने के लिए कोई भी कक्ष या कमरा चुनें।' },
    taBody: 'மூலையிலுள்ள சிறு வரைபடம் முழு அருங்காட்சியகத்தையும் காட்டுகிறது; சிவப்பு அம்புக்குறியே நீங்கள், நீங்கள் நோக்கும் திசையைக் காட்டுகிறது. முழு வரைபடத்தை (அல்லது வரைபடம் பொத்தானை) திறந்து எந்தக் கூடத்தையோ அறையையோ தேர்ந்தெடுத்துச் செல்லுங்கள்.',
  },
];

/** An on/off switch (role="switch") for showing the tour on entering the museum. */
function TourSwitch({ enabled, onChange }) {
  const { T } = useI18n();
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-xs text-[#d9c6a0]">
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full border transition-colors duration-300 ${enabled ? 'border-temple-gold-light bg-temple-gold' : 'border-[#75592e] bg-[#2a1a0c]'}`}
      >
        <span className={`absolute top-0.5 left-0.5 size-[18px] rounded-full bg-[#fff6dc] shadow transition-transform duration-300 ease-spring ${enabled ? 'translate-x-5' : ''}`} />
      </button>
      <span>
        {T('Show this guide when I enter', 'நுழையும்போது இந்த வழிகாட்டியைக் காட்டு', 'प्रवेश करते समय यह मार्गदर्शिका दिखाएँ')}
        <span className="block text-[10px] text-[#9d8a6a]">{enabled ? T('On', 'இயக்கத்தில்', 'चालू') : T('Off', 'அணைப்பில்', 'बंद')} · {T('remembered on this device', 'இச்சாதனத்தில் நினைவில் வைக்கப்படும்', 'इस डिवाइस पर याद रखा जाएगा')}</span>
      </span>
    </label>
  );
}

/**
 * The tour itself: one step at a time, with Back / Next (or ← →), dots to jump between
 * steps, Escape or the close button to leave, and the on/off switch.
 */
export function TutorialDialog({ enabled, onToggle, onClose }) {
  const [index, setIndex] = useState(0);
  const step = STEPS[index];
  const { lang, T } = useI18n();
  /** A step's title or body in the chosen language: Tamil steps read their Tamil body, under their Tamil title. */
  const stepTitle = (candidate) => tri(candidate.title, undefined, candidate.hi.title, lang === 'ta' ? 'en' : lang);
  const stepBody = lang === 'ta' ? step.taBody : tri(step.body, undefined, step.hi.body, lang);
  const last = index === STEPS.length - 1;
  const closeRef = useRef(null);
  const go = (delta) => setIndex((current) => Math.min(STEPS.length - 1, Math.max(0, current + delta)));

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      else if (event.key === 'ArrowRight') go(1);
      else if (event.key === 'ArrowLeft') go(-1);
      else return;
      event.preventDefault();
      event.stopPropagation();
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [onClose]);

  const Icon = step.icon;
  return (
    <div role="presentation" className="fixed inset-0 z-[1600] flex justify-center overflow-y-auto bg-[#0a0604]/75 px-4 py-6 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-title"
        aria-describedby="tutorial-body"
        className="relative my-auto h-fit w-full max-w-md animate-pop-in rounded-2xl border-[3px] border-temple-gold/80 bg-teak p-5 text-center shadow-[0_30px_80px_#000d,inset_0_0_0_5px_#2a1408] sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <button ref={closeRef} type="button" onClick={onClose} aria-label={T('Close the guide', 'வழிகாட்டியை மூடு', 'मार्गदर्शिका बंद करें')} className="touch-target absolute top-3 right-3 grid size-9 cursor-pointer place-items-center rounded-full border border-temple-gold/60 text-temple-gold-light transition hover:bg-temple-gold/20">
          <X size={18} />
        </button>
        <p className="text-[10px] font-semibold tracking-[0.25em] text-[#bfa982] uppercase">{T('Museum guide', 'அருங்காட்சியக வழிகாட்டி', 'संग्रहालय मार्गदर्शिका')} · {T(`${index + 1} of ${STEPS.length}`, `${index + 1} / ${STEPS.length}`, `${index + 1} / ${STEPS.length}`)}</p>
        <div key={index} className="animate-pop-in">
          <span className="mx-auto mt-4 grid size-20 place-items-center rounded-full border-2 border-temple-gold bg-[radial-gradient(circle_at_50%_35%,#5a3a12,#1a1008)] text-temple-gold-light shadow-[0_0_30px_#f1c35b44]">
            <Icon size={34} />
          </span>
          <p lang="ta" className="mt-4 text-sm font-bold text-[#e9a27a]">{step.tamil}</p>
          <h2 id="tutorial-title" className="font-serif text-2xl font-bold tracking-wide text-temple-gold-light">{stepTitle(step)}</h2>
          <KolamDivider className="mx-auto mt-2 block w-full max-w-[180px] text-temple-gold/60" />
          <p id="tutorial-body" lang={lang} className={`mt-3 min-h-[6.5rem] text-[#ead8ae] ${lang === 'en' ? 'text-[15px] leading-relaxed' : 'text-[14px] leading-[1.85]'}`}>{stepBody}</p>
        </div>

        <div className="mt-4 flex justify-center gap-1.5" role="group" aria-label={T('Guide steps', 'வழிகாட்டிப் படிகள்', 'मार्गदर्शिका के चरण')}>
          {STEPS.map((candidate, i) => (
            <button
              key={candidate.title}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${T('Step', 'படி', 'चरण')} ${i + 1}: ${lang === 'ta' ? candidate.tamil : stepTitle(candidate)}`}
              aria-current={i === index ? 'step' : undefined}
              className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-temple-gold-light' : 'w-2 bg-[#75592e] hover:bg-temple-gold'}`}
            />
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button type="button" onClick={() => go(-1)} disabled={!index} className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-temple-gold/60 px-3 py-1.5 text-xs font-semibold text-temple-gold-light transition hover:bg-temple-gold/20 disabled:cursor-default disabled:opacity-30">
            <ChevronLeft size={14} /> {T('Back', 'முந்தைய', 'पीछे')}
          </button>
          <button
            type="button"
            onClick={last ? onClose : () => go(1)}
            className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-[#f3d58a] bg-gradient-to-br from-[#f5dc98] to-[#c89a4d] px-4 py-1.5 text-xs font-bold text-[#21170b] shadow-[0_0_16px_#dfb65855] transition hover:scale-105 active:scale-95"
          >
            {last ? T('Start exploring', 'காணத் தொடங்குங்கள்', 'देखना शुरू करें') : <>{T('Next', 'அடுத்து', 'आगे')} <ChevronRight size={14} /></>}
          </button>
        </div>

        <div className="mt-5 flex justify-center border-t border-temple-gold/25 pt-4 text-left">
          <TourSwitch enabled={enabled} onChange={onToggle} />
        </div>
      </div>
    </div>
  );
}

/** The Guide tab on the right-hand edge of the screen, above every room and viewer, opening the tour. */
export function TutorialLauncher({ onOpen }) {
  const { T } = useI18n();
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={T('Open the museum guide', 'வழிகாட்டியைத் திற', 'संग्रहालय मार्गदर्शिका खोलें')}
      className="group fixed top-1/2 right-0 z-[1500] flex -translate-y-1/2 cursor-pointer items-center gap-1.5 rounded-l-full border border-r-0 border-temple-gold/70 bg-[#140d07]/85 py-2 pr-2 pl-2.5 text-temple-gold-light shadow-[0_8px_24px_#000a] backdrop-blur transition-[padding] duration-300 hover:pr-3"
    >
      <CircleHelp size={18} />
      <span className="max-w-0 overflow-hidden text-xs font-semibold whitespace-nowrap transition-[max-width] duration-300 group-hover:max-w-20 group-focus-visible:max-w-20">{T('Guide', 'வழிகாட்டி', 'मार्गदर्शिका')}</span>
    </button>
  );
}
