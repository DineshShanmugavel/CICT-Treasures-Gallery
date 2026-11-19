import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Search, Glasses, ChevronDown, ChevronRight, ChevronLeft,
  BookOpen, LibraryBig, Landmark, GraduationCap, Menu, X, Info,
  Sparkles, ScrollText, ArrowUpRight, Compass, Amphora, Palette, Music, Ship, Shirt, Wheat, Mountain, UtensilsCrossed,
  Crown, Feather, HandHeart, History, MapPinned
} from 'lucide-react';
// The museum's own fonts, served with the site (no third-party request, and they work on an
// office network without internet). Each covers its scripts by unicode-range, so a browser
// downloads only the subsets a page uses. Other scripts' Noto fonts load on demand (i18n).
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/700.css';
import '@fontsource/noto-sans-devanagari/400.css';
import '@fontsource/noto-sans-devanagari/500.css';
import '@fontsource/noto-sans-devanagari/600.css';
import '@fontsource/noto-sans-devanagari/700.css';
import '@fontsource/noto-serif-devanagari/400.css';
import '@fontsource/noto-serif-devanagari/500.css';
import '@fontsource/noto-serif-devanagari/600.css';
import '@fontsource/noto-serif-devanagari/700.css';
import './tailwind.css';
import './styles.css';
import MUSEUM_IMAGE from './assets/tamil-museum-hero.webp';
import CICT_LOGO from './assets/cict-logo.jpg';
import LoadingScreen from './components/LoadingScreen.jsx';
import TamilNarrationLayer from './narration/TamilNarrationLayer.jsx';

import GlassDoorTransition from './components/GlassDoorTransition.jsx';
import { TutorialDialog, TutorialLauncher, useTutorialPreference } from './components/Tutorial.jsx';
import { getRoom, hallOf, hallways } from './data/roomBooks.js';
import RoomCatalogueButton from './components/RoomCatalogueButton.jsx';
import { GlowFireflies } from './components/Fireflies.jsx';
import MusicToggle from './components/MusicToggle.jsx';
import { playSound, unlockAudio } from './audio/ambience.js';
import LanguageSwitcher from './components/LanguageSwitcher.jsx';
import TelemetryPill from './analytics/TelemetryPill.jsx';
import { useSiteDataVersion } from './siteData/siteData.js';
import { tri, useI18n } from './i18n/index.js';

/*
 * The rooms (with their viewers) and the Thirukkural scroll are not needed until a visitor
 * opens one, so they load apart from the hall, which then starts sooner. They are fetched
 * quietly once the hall is ready (preloadLaterScreens), so opening one never waits.
 */
/*
 * The 3D hall (with three.js) loads as its own chunk too, started at once: the welcome screen
 * paints straight away and waits for the hall to report ready (onReady) before Enter opens.
 */
const loadHallway = () => import('./components/hallway/VirtualHallway.jsx');
const VirtualHallway = lazy(loadHallway);

/*
 * The 2D Admin Portal (src/admin) — #/admin, or /admin on a server that sends every address to
 * the museum. It replaces the museum entirely: no 3D hall, no WebGL, no welcome narration.
 */
const isAdminRoute = () => /\/admin\/?$/.test(window.location.pathname) || /^#\/?admin\b/.test(window.location.hash);
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));
if (!isAdminRoute()) loadHallway();
const loadMuseumRoom = () => import('./components/MuseumRoom.jsx');
const loadScroll = () => import('./components/ThiruvalluvarScroll.jsx');
const MuseumRoom = lazy(loadMuseumRoom);
const ThiruvalluvarScroll = lazy(loadScroll);
/* Tamil Nadu: Then & Now and the map of Ancient Tamilakam (with Leaflet) load only when opened. */
const ThenAndNow = lazy(() => import('./components/thenNow/ThenAndNow.jsx'));
const TamilakamMap = lazy(() => import('./components/tamilakam/TamilakamMap.jsx'));
/** Sections that open a view over the museum rather than a room. */
const THEN_NOW = 'then-now';
const TAMILAKAM = 'tamilakam';
const preloadLaterScreens = () => {
  const idle = window.requestIdleCallback ?? ((callback) => window.setTimeout(callback, 1500));
  idle(() => {
    loadMuseumRoom();
    loadScroll();
  });
};

/** Shown for the moment a room or the scroll is still loading: their own dark backdrop. */
const ScreenFallback = ({ className }) => <div className={`fixed inset-0 ${className}`} aria-busy="true" />;

/**
 * Replace these URLs with the real routes already used by your application.
 * These links intentionally stay in one place to make integration simple.
 */
const sections = [
  {
    id: 'rare-books', title: 'Rare Books Wing', tamil: 'அரிய நூல்கள் பிரிவு',
    description: 'The complete collection of classical texts: early printed editions, Sangam anthologies, epics, grammar, and rare volumes to read.',
    icon: BookOpen, href: '/rare-books', number: '01', action: 'Explore wing',
    hi: { title: 'दुर्लभ पुस्तक विंग', description: 'शास्त्रीय ग्रंथों का पूरा संग्रह: आरंभिक मुद्रित संस्करण, संगम संकलन, महाकाव्य, व्याकरण और पढ़ने योग्य दुर्लभ ग्रंथ।', action: 'विंग देखें' },
  },
  {
    id: 'manuscripts', title: 'Manuscripts Library', tamil: 'பனையோலைச் சுவடிகள்',
    description: 'Palm-leaf manuscripts — how the olai suvadi was made, copied, rescued, and preserved — and the Thirukkural on palm leaves.',
    icon: ScrollText, href: '/manuscripts', number: '02', action: 'Explore manuscripts',
    hi: { title: 'पांडुलिपि पुस्तकालय', description: 'ताड़पत्र पांडुलिपियाँ — ओलै सुवडि कैसे बनाई, नकल की, बचाई और संरक्षित की जाती थी — और ताड़पत्रों पर तिरुक्कुरल।', action: 'पांडुलिपियाँ देखें' },
  },
  {
    id: 'shrine', title: 'Thiruvalluvar Shrine', tamil: 'திருவள்ளுவர் திருத்தலம்',
    description: 'Enter a dedicated gallery celebrating the life, legacy, and enduring wisdom of Thiruvalluvar.',
    icon: Landmark, href: '/thiruvalluvar-shrine', number: '03', action: 'Enter shrine',
    hi: { title: 'तिरुवल्लुवर देवस्थान', description: 'तिरुवल्लुवर के जीवन, विरासत और शाश्वत ज्ञान को समर्पित एक विशेष दीर्घा में प्रवेश करें।', action: 'देवस्थान में प्रवेश करें' },
  },
  {
    id: 'about', title: 'About Thiruvalluvar', tamil: 'திருவள்ளுவர்',
    description: 'Learn about the celebrated poet and the ideas of virtue, prosperity, and love in the Tirukkural.',
    icon: Info, href: '/thiruvalluvar', number: '04', action: 'Discover his story',
    hi: { title: 'तिरुवल्लुवर के बारे में', description: 'प्रसिद्ध कवि और तिरुक्कुरल में धर्म, अर्थ और काम (प्रेम) के विचारों के बारे में जानें।', action: 'उनकी कहानी जानें' },
  },
];

const collections = [
  { title: 'Tamil Literature', description: 'Explore ancient and modern Tamil works.', icon: BookOpen, section: 'rare-books', hi: { title: 'तमिल साहित्य', description: 'प्राचीन और आधुनिक तमिल कृतियों को देखें।' } },
  { title: 'Manuscripts & Archives', description: 'Discover palm-leaf manuscripts and how they are preserved.', icon: ScrollText, section: 'manuscripts', manuscript: true, hi: { title: 'पांडुलिपियाँ और अभिलेखागार', description: 'ताड़पत्र पांडुलिपियों और उनके संरक्षण के तरीकों को जानें।' } },
  { title: 'Digital Library', description: 'Read Sangam anthologies, epics, and grammar texts.', icon: LibraryBig, section: 'rare-books', hi: { title: 'डिजिटल पुस्तकालय', description: 'संगम संकलन, महाकाव्य और व्याकरण ग्रंथ पढ़ें।' } },
  { title: 'Ancient Pottery', description: 'Burial urns, black-and-red ware, and finds from Keezhadi and Arikamedu.', icon: Amphora, section: 'pottery', hi: { title: 'प्राचीन मृद्भांड', description: 'शवाधान कलश, काले-लाल मृद्भांड, और कीழடி तथा अरिक्कमेडु की खोजें।' } },
  { title: 'Ancient Tamil Paintings', description: 'பழங்கால ஓவியங்கள் — Sittanavasal, Chola frescoes, Nayak murals and Tanjore paintings.', icon: Palette, section: 'paintings', hi: { title: 'प्राचीन तमिल चित्रकला', description: 'பழங்கால ஓவியங்கள் — सित्तन्नवासल, चोल भित्तिचित्र, नायक भित्तिचित्र और तंजावुर चित्रकला।' } },
  { title: 'Tamil Musical Instruments', description: 'தமிழ் இசைக்கருவிகள் — the murasu and parai, nadaswaram and thavil, yazh and veenai.', icon: Music, section: 'instruments', hi: { title: 'तमिल वाद्ययंत्र', description: 'தமிழ் இசைக்கருவிகள் — मुरसु और परै, नादस्वरम और तविल, याழ் और वीणा।' } },
  { title: 'Ancient Ports & Trade', description: 'Korkai, Alagankulam, Puhar, Arikamedu and Muziris — in photobooks of the excavations.', icon: Ship, section: 'ports-ancient', hi: { title: 'प्राचीन बंदरगाह और व्यापार', description: 'कोर्कै, अऴगन्कुळम, पुहार, अरिक्कमेडु और मुज़िरिस — उत्खननों की चित्र-पुस्तकों में।' } },
  { title: 'TN Sarees', description: 'தமிழகத்தின் பாரம்பரியச் சேலைகள் — Kanchipuram, Arani and Salem silks, Sungudi, Kandangi and more, in photobooks.', icon: Shirt, section: 'sarees', hi: { title: 'तमिलनाडु की साड़ियाँ', description: 'தமிழகத்தின் பாரம்பரியச் சேலைகள் — कांचीपुरम, आरणी और सेलम रेशम, सुंगुडी, कंडांगी और अन्य, चित्र-पुस्तकों में।' } },
  { title: 'Weaving Culture', description: 'நெசவுப் பண்பாடு — cotton, silk and dyes, from fibre to fabric, and Tamil weaving from the Sangam age to today, in photobooks.', icon: Shirt, section: 'weaving', hi: { title: 'बुनाई संस्कृति', description: 'நெசவுப் பண்பாடு — कपास, रेशम और रंग, रेशे से कपड़े तक, और संगम युग से आज तक की तमिल बुनाई, चित्र-पुस्तकों में।' } },
  { title: 'Household & Agriculture', description: 'The objects of a Tamil home, the Kallanai and the village tanks, and farming from plough to harvest.', icon: Wheat, section: 'household', hi: { title: 'घर-गृहस्थी और कृषि', description: 'एक तमिल घर की वस्तुएँ, कल्लणै और गाँव के तालाब, और हल से फसल तक की खेती।' } },
  { title: 'Ainthinai — The Five Landscapes', description: 'ஐந்திணை நிலங்கள் — walk a 3D gallery of Kurinji, Mullai, Marutham, Neithal and Palai in glass cases, with their poems on the shelves.', icon: Mountain, section: 'ainthinai-landscapes', hi: { title: 'ऐंतिणै — पाँच भू-दृश्य', description: 'ஐந்திணை நிலங்கள் — कुरिंजि, मुल्लै, मरुतम, नेय्दल और पालै की 3D दीर्घा में काँच के बक्सों के बीच घूमें, अलमारियों पर उनकी कविताओं के साथ।' } },
  { title: 'Ainthinai — Foods of the Five Landscapes', description: 'ஐவகை நிலங்களின் உணவுகள் — Kurinji honey and millet, Mullai curd, Marutham rice, Neithal fish and Palai provisions.', icon: Mountain, section: 'ainthinai-foods', hi: { title: 'ऐंतिणै — पाँच भू-दृश्यों के भोजन', description: 'ஐவகை நிலங்களின் உணவுகள் — कुरिंजि का शहद और बाजरा, मुल्लै का दही, मरुतम का चावल, नेय्दल की मछली और पालै की रसद।' } },
  { title: 'Tamil Foods', description: 'உணவுகள் — rice, millets and koozh in the Household room’s Tamil Kitchen; pepper, sesame oil and palm jaggery in Trade & Ports.', icon: UtensilsCrossed, section: 'household', hi: { title: 'तमिल भोजन', description: 'உணவுகள் — घर-गृहस्थी कक्ष की तमिल रसोई में चावल, मोटे अनाज और कूऴ; व्यापार और बंदरगाह में काली मिर्च, तिल का तेल और ताड़ का गुड़।' } },
  { title: 'The Seven Great Patrons', description: 'கடையெழு வள்ளல்கள் — Pari, Pegan, Kari, Ay Andiran, Adhiyaman, Nalli and Ori, in the Historical Figures hall.', icon: HandHeart, section: 'figures-patrons', hi: { title: 'सात महान संरक्षक', description: 'கடையெழு வள்ளல்கள் — पारि, पेगन, कारि, आय अण्डिरन, अदियमान, नळ्ळि और ओरि, ऐतिहासिक व्यक्तित्व कक्ष में।' } },
  { title: 'Poets & Thinkers', description: 'புலவர்களும் சிந்தனையாளர்களும் — Tholkappiyar, Thiruvalluvar, Avvaiyar, Kapilar, Ilango Adigal, Appar and more.', icon: Feather, section: 'figures-poets', hi: { title: 'कवि और चिंतक', description: 'புலவர்களும் சிந்தனையாளர்களும் — तोल्काप्पियर, तिरुवल्लुवर, औवैयार, कपिलर, इळंगो अडिगळ, अप्पर और अन्य।' } },
  { title: 'Kings & Queens', description: 'தமிழ் மன்னர்களும் அரசியரும் — Karikala Cholan, Rajaraja I, Rajendra I, Sembiyan Mahadevi, Kannagi and Vel Pari.', icon: Crown, section: 'figures-kings', hi: { title: 'राजा और रानियाँ', description: 'தமிழ் மன்னர்களும் அரசியரும் — करिकाल चोळन, राजराज प्रथम, राजेंद्र प्रथम, सेम्बियन महादेवी, कण्णगी और वेळ पारि।' } },
  { title: 'Tamil Nadu: Then & Now', description: 'தமிழ்நாடு: அன்றும் இன்றும் — compare eight historic places across time with a sliding view.', icon: History, section: THEN_NOW, hi: { title: 'तमिलनाडु: तब और अब', description: 'தமிழ்நாடு: அன்றும் இன்றும் — स्लाइडिंग दृश्य से आठ ऐतिहासिक स्थलों की समय के पार तुलना करें।' } },
  { title: 'Ancient Tamilakam', description: 'பண்டைய தமிழகம் — an interactive map of the capitals, ports, temples and archaeological sites of the ancient Tamil world.', icon: MapPinned, section: TAMILAKAM, hi: { title: 'प्राचीन तमिऴकम', description: 'பண்டைய தமிழகம் — प्राचीन तमिल जगत की राजधानियों, बंदरगाहों, मंदिरों और पुरातात्विक स्थलों का एक संवादात्मक मानचित्र।' } },
  { title: 'Heritage & Culture', description: 'Explore Tamil art, architecture, and traditions.', icon: Landmark, section: 'shrine', hi: { title: 'विरासत और संस्कृति', description: 'तमिल कला, स्थापत्य और परंपराओं को देखें।' } },
  { title: 'Learning & Resources', description: 'Educational content for curious minds.', icon: GraduationCap, section: 'about', hi: { title: 'अध्ययन और संसाधन', description: 'जिज्ञासु मन के लिए शैक्षिक सामग्री।' } },
];

/** A few glowing fireflies drifting over the photographic hall. */
function AmbientParticles({ onReady }) {
  useEffect(() => {
    onReady(true);
  }, [onReady]);
  return (
    <div className="particle-layer" aria-hidden="true">
      <GlowFireflies count={7} seed={3} />
    </div>
  );
}

function App() {
  // Admin edits (src/siteData) re-render the museum, so rooms show them at once.
  useSiteDataVersion();
  const { lang, T } = useI18n();
  /** A section's or collection's `field` in the chosen language (inline Hindi, or the language pack). */
  const loc = (item, field) => tri(item[field], item[field], item.hi?.[field], lang);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tourMode, setTourMode] = useState(false);
  const [tourStopIndex, setTourStopIndex] = useState(0);
  const [doorRoomId, setDoorRoomId] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [view, setView] = useState('hallway'); // 'hallway' (360° lobby) or 'gallery' (classic overview)
  const [splashVisible, setSplashVisible] = useState(true);
  const [museumEntered, setMuseumEntered] = useState(false);
  const [hallwayReady, setHallwayReady] = useState(false);
  const [scrollOpen, setScrollOpen] = useState(false);
  // Then & Now or the map of Ancient Tamilakam, over everything: { view: THEN_NOW | TAMILAKAM, place } or null.
  const [heritage, setHeritage] = useState(null);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [tutorialEnabled, setTutorialEnabled] = useTutorialPreference();
  const closeTutorial = useCallback(() => setTutorialOpen(false), []);
  // The guide opens by itself once the visitor has entered and the opening sweep has played, unless they switched it off.
  const tutorialOnEntry = useRef(tutorialEnabled);
  useEffect(() => {
    if (!museumEntered || !tutorialOnEntry.current) return undefined;
    tutorialOnEntry.current = false;
    const timer = window.setTimeout(() => setTutorialOpen(true), 2800);
    return () => window.clearTimeout(timer);
  }, [museumEntered]);
  const lastSectionRef = useRef('');
  const searchInputRef = useRef(null);
  const heroRef = useRef(null);
  const artRef = useRef(null);
  const selected = sections.find((section) => section.id === active);
  const onSceneReady = useCallback((value) => setSceneReady(value), []);
  const normalizedSearch = searchTerm.trim().toLocaleLowerCase();
  const matchingSections = sections.filter((section) =>
    `${section.title} ${section.tamil} ${section.description} ${section.hi?.title ?? ''} ${section.hi?.description ?? ''}`.toLocaleLowerCase().includes(normalizedSearch)
  );
  const matchingCollections = collections.filter((item) =>
    `${item.title} ${item.description} ${item.hi?.title ?? ''} ${item.hi?.description ?? ''}`.toLocaleLowerCase().includes(normalizedSearch)
  );

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setTourMode(false);
        setShowInfo(false);
        setActive('');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  /**
   * Wings with a bookshelf room open behind glass doors, 'About Thiruvalluvar' opens the
   * Thirukkural scroll, and other sections show the info panel.
   */
  const openSection = (id) => {
    lastSectionRef.current = id;
    setMenuOpen(false);
    if (id === THEN_NOW || id === TAMILAKAM) {
      setActive('');
      setHeritage({ view: id, place: null });
    } else if (id === 'about') {
      setActive('');
      setScrollOpen(true);
    } else if (getRoom(id)) {
      setActive('');
      setDoorRoomId(id);
    } else {
      setActive(id);
    }
  };

  const enterRoom = useCallback(() => setRoomId(doorRoomId), [doorRoomId]);
  const closeDoors = useCallback(() => setDoorRoomId(null), []);
  // Out through the room's glass doors, which swing shut behind the visitor.
  const exitRoom = useCallback(() => {
    playSound('glass-close');
    setRoomId(null);
  }, []);
  const openScroll = useCallback(() => setScrollOpen(true), []);
  const closeScroll = useCallback(() => setScrollOpen(false), []);
  const onHallwayReady = useCallback(() => {
    setHallwayReady(true);
    preloadLaterScreens();
  }, []);
  const onHallwayWing = useCallback((id) => {
    lastSectionRef.current = id;
    setDoorRoomId(id);
  }, []);
  const showGallery = useCallback(() => setView('gallery'), []);
  /** The two views open at a place (a Then & Now place id, which the map shares) or at their start. */
  const openThenNow = useCallback((place = null) => setHeritage({ view: THEN_NOW, place }), []);
  const openTamilakam = useCallback((place = null) => setHeritage({ view: TAMILAKAM, place }), []);
  const closeHeritage = useCallback(() => setHeritage(null), []);

  // The hallway is a full-screen layer; keep the page underneath from scrolling.
  useEffect(() => {
    if (view !== 'hallway') return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [view]);

  const visitModule = () => {
    if (selected?.href) window.location.assign(selected.href);
  };

  const moveHero = (event) => {
    if (!heroRef.current || !artRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = heroRef.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    const scale = tourMode ? 1.09 : 1.055;
    artRef.current.style.transform = `scale(${scale}) translate3d(${-px * 12}px, ${-py * 8}px, 0)`;
  };

  const resetHero = () => {
    if (artRef.current) artRef.current.style.transform = '';
  };

  const currentIndex = sections.findIndex((section) => section.id === (active || lastSectionRef.current));
  const cycleSection = (direction) => {
    const baseIndex = currentIndex < 0 ? 0 : currentIndex;
    const next = (baseIndex + direction + sections.length) % sections.length;
    openSection(sections[next].id);
  };

  return (
    <main className="app-shell" id="top">
      <header className="topbar">
        <a className="brand" href="#home" aria-label={T('CICT Classical Tamil Treasures Gallery home', 'CICT செம்மொழிப் பண்பாட்டுக் காட்சியகம் — முகப்பு', 'CICT शास्त्रीय तमिल निधि दीर्घा — मुखपृष्ठ')} onClick={() => { setActive(''); setMenuOpen(false); }}>
          <img className="brand-logo" src={CICT_LOGO} alt={T('Central Institute of Classical Tamil emblem', 'செம்மொழித் தமிழாய்வு மத்திய நிறுவன இலச்சினை', 'केंद्रीय शास्त्रीय तमिल संस्थान का प्रतीक-चिह्न')} />
          <div className="brand-copy">
            <strong lang="ta">செம்மொழிப் பண்பாட்டுக் காட்சியகம்</strong>
            <span className="brand-english">{T('CICT CLASSICAL TAMIL TREASURES GALLERY', 'CICT CLASSICAL TAMIL TREASURES GALLERY', 'CICT शास्त्रीय तमिल निधि दीर्घा')}</span>
            <small>{T('EXPLORE · LEARN · PRESERVE · CELEBRATE', 'ஆராய்க · கற்க · காக்க · கொண்டாடுக', 'देखें · सीखें · सहेजें · उत्सव मनाएँ')}</small>
          </div>
        </a>

        <nav className={`main-nav ${menuOpen ? 'nav-open' : ''}`} aria-label={T('Main navigation', 'முதன்மை வழிசெலுத்தல்', 'मुख्य नेविगेशन')}>
          <a className="nav-home active" href="#home" onClick={() => { setActive(''); setMenuOpen(false); }}><span>⌂</span> {T('Home', 'முகப்பு', 'मुखपृष्ठ')}</a>
          <a href="#sanctuary" onClick={() => { setShowInfo(true); setMenuOpen(false); }}>{T('Grand Sanctuary Hall', 'பெருங்கூடம்', 'मुख्य गर्भगृह कक्ष')}</a>
          <a href="/rare-books" onClick={(e) => { e.preventDefault(); openSection('rare-books'); }}>{T('Rare Books Wing', 'அரிய நூல்கள்', 'दुर्लभ पुस्तक विंग')} <ChevronDown size={12} /></a>
          <a href="/manuscripts" onClick={(e) => { e.preventDefault(); openSection('manuscripts'); }}>{T('Manuscripts', 'சுவடிகள்', 'पांडुलिपियाँ')} <ChevronDown size={12} /></a>
          <a href="/thiruvalluvar-shrine" onClick={(e) => { e.preventDefault(); openSection('shrine'); }}>{T('Thiruvalluvar Shrine', 'திருவள்ளுவர் திருத்தலம்', 'तिरुवल्लुवर देवस्थान')} <ChevronDown size={12} /></a>
          <a href="/pottery" onClick={(e) => { e.preventDefault(); openSection('pottery'); }}>{T('Pottery', 'மட்பாண்டங்கள்', 'मृद्भांड')} <ChevronDown size={12} /></a>
          <a href="/paintings" onClick={(e) => { e.preventDefault(); openSection('paintings'); }}>{T('Paintings', 'ஓவியங்கள்', 'चित्रकला')} <ChevronDown size={12} /></a>
          <a href="#then-now" onClick={(e) => { e.preventDefault(); openSection(THEN_NOW); }}>{T('Then & Now', 'அன்றும் இன்றும்', 'तब और अब')}</a>
          <a href="#ancient-tamilakam" onClick={(e) => { e.preventDefault(); openSection(TAMILAKAM); }}>{T('Ancient Tamilakam', 'பண்டைய தமிழகம்', 'प्राचीन तमिऴकम')}</a>
          <a href="#collections" onClick={() => setMenuOpen(false)}>{T('Collections', 'தொகுப்புகள்', 'संग्रह')} <ChevronDown size={12} /></a>
          <a href="/thiruvalluvar" onClick={(e) => { e.preventDefault(); openSection('about'); }}>{T('About', 'அறிமுகம்', 'परिचय')} <ChevronDown size={12} /></a>
        </nav>

        <div className="header-actions">
          <button className={`icon-button ${searchOpen ? 'is-active' : ''}`} aria-label={searchOpen ? T('Close gallery search', 'தேடலை மூடு', 'खोज बंद करें') : T('Search the gallery', 'காட்சியகத்தில் தேடு', 'दीर्घा में खोजें')} aria-expanded={searchOpen} onClick={() => setSearchOpen((value) => !value)}><Search size={17} /></button>
          <LanguageSwitcher compact />
          <button className="hallway-button" onClick={() => { setView('hallway'); setMenuOpen(false); setSearchOpen(false); setTourMode(false); }}><Compass size={15} /> <span>{T('360° Hallway', '360° கூடம்', '360° गलियारा')}</span></button>
          <button className={`tour-button ${tourMode ? 'tour-button-active' : ''}`} onClick={() => { setTourMode((value) => !value); setTourStopIndex(0); setSearchOpen(false); }} aria-pressed={tourMode}>{tourMode ? <X size={15} /> : <Glasses size={15} />} {tourMode ? T('Exit Tour', 'சுற்றுலா நிறைவு', 'भ्रमण समाप्त करें') : T('Virtual Tour', 'மெய்நிகர் சுற்றுலா', 'आभासी भ्रमण')} <ArrowUpRight size={13} /></button>
          <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? T('Close menu', 'பட்டியை மூடு', 'मेनू बंद करें') : T('Open menu', 'பட்டியைத் திற', 'मेनू खोलें')}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
      {searchOpen && <div className="search-popover" role="dialog" aria-label={T('Search museum collections', 'காட்சியகத் தொகுப்புகளில் தேடு', 'संग्रहालय संग्रहों में खोजें')}>
        <div className="search-popover-head"><span>{T('EXPLORE THE ARCHIVE', 'காப்பகத்தை ஆராயுங்கள்', 'अभिलेखागार देखें')}</span><button type="button" aria-label={T('Close search', 'தேடலை மூடு', 'खोज बंद करें')} onClick={() => setSearchOpen(false)}><X size={16} /></button></div>
        <label className="search-input-wrap"><Search size={17} /><input ref={searchInputRef} value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder={T('Search books, heritage, Thiruvalluvar…', 'நூல்கள், மரபு, திருவள்ளுவர்… தேடுங்கள்', 'पुस्तकें, विरासत, तिरुवल्लुवर… खोजें')} aria-label={T('Search the gallery', 'காட்சியகத்தில் தேடு', 'दीर्घा में खोजें')} /></label>
        <div className="search-results">
          {!normalizedSearch && <p className="search-hint">{T('Try “manuscripts”, “library”, or “Thiruvalluvar”.', '“சுவடி”, “நூலகம்”, “திருவள்ளுவர்” எனத் தேடிப் பாருங்கள்.', '“पांडुलिपि”, “पुस्तकालय” या “तिरुवल्लुवर” खोजकर देखें।')}</p>}
          {normalizedSearch && matchingSections.length === 0 && matchingCollections.length === 0 && <p className="search-hint">{T('No matches yet. Try a different keyword.', 'பொருத்தம் இல்லை. வேறு சொல்லைத் தேடுங்கள்.', 'कोई परिणाम नहीं। कोई दूसरा शब्द आज़माएँ।')}</p>}
          {normalizedSearch && matchingSections.map((section) => <button className="search-result" key={section.id} onClick={() => { setSearchOpen(false); openSection(section.id); }}><span className="search-result-icon"><section.icon size={17} /></span><span><b>{loc(section, 'title')}</b><small lang="ta">{section.tamil}</small></span><ChevronRight size={16} /></button>)}
          {normalizedSearch && matchingCollections.map((item) => <button className="search-result" key={item.title} onClick={() => { setSearchOpen(false); openSection(item.section); }}><span className="search-result-icon"><item.icon size={17} /></span><span><b>{loc(item, 'title')}</b><small>{loc(item, 'description')}</small></span><ChevronRight size={16} /></button>)}
        </div>
        <div className="search-footer">{T('CICT CLASSICAL TAMIL TREASURES', 'செம்மொழித் தமிழ்க் கருவூலங்கள்', 'CICT शास्त्रीय तमिल निधियाँ')} <span>·</span> {T('DIGITAL ARCHIVE', 'எண்ணிமக் காப்பகம்', 'डिजिटल अभिलेखागार')}</div>
      </div>}
      </header>

      <section className={`hero ${tourMode ? `tour-mode tour-stop-${sections[tourStopIndex].id}` : ''}`} id="home" ref={heroRef} onPointerMove={moveHero} onPointerLeave={resetHero}>
        <div className="hero-art" ref={artRef}>
          <img
            src={MUSEUM_IMAGE}
            alt="A richly carved Tamil heritage museum hall with a bronze sage statue and illuminated exhibits"
            fetchPriority="high"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(false)}
          />
        </div>
        <div className="hero-shading" />
        <div className="ceiling-glow" />
        <AmbientParticles onReady={onSceneReady} />

        <div className="hero-copy">
          <div className="eyebrow">{T('A JOURNEY THROUGH', 'ஒரு பயணம்', 'एक यात्रा')}</div>
          <h1>{T('Tamil Heritage', 'தமிழ் மரபு', 'तमिल विरासत')}<span>.</span></h1>
          <p>{T('Ancient Wisdom. Timeless Literature.', 'தொன்மை ஞானம். காலம் கடந்த இலக்கியம்.', 'प्राचीन ज्ञान। कालजयी साहित्य।')}<br />{T('A Richer Tomorrow.', 'வளமான நாளை.', 'एक समृद्ध कल।')}</p>
          <div className="hero-rule" />
        </div>

        <button className="explore-card" onClick={() => { setTourMode(true); setTourStopIndex(0); }}>
          <span className="explore-thumb"><img src={MUSEUM_IMAGE} alt="" loading="eager" /></span>
          <span className="explore-text"><b>{T('Begin the guided tour', 'வழிகாட்டும் சுற்றுலாவைத் தொடங்குங்கள்', 'निर्देशित भ्रमण शुरू करें')}</b><small>{T('Explore the gallery, discover its landmarks, and uncover Tamil heritage.', 'காட்சியகத்தைச் சுற்றிப் பார்த்து, அதன் சிறப்பிடங்களையும் தமிழ் மரபையும் கண்டறியுங்கள்.', 'दीर्घा घूमें, उसके प्रमुख स्थल खोजें और तमिल विरासत को जानें।')}</small></span>
          <ChevronRight className="explore-arrow" size={19} />
        </button>

        <button className="scene-arrow scene-prev" aria-label={T('Previous museum section', 'முந்தைய பகுதி', 'पिछला खंड')} onClick={() => cycleSection(-1)}><ChevronLeft /></button>
        <button className="scene-arrow scene-next" aria-label={T('Next museum section', 'அடுத்த பகுதி', 'अगला खंड')} onClick={() => cycleSection(1)}><ChevronRight /></button>

        <div className="wing-label label-rare">
          <span className="tamil" lang="ta">அரிய நூல்கள் பிரிவு</span><b>{loc(sections[0], 'title').toUpperCase()}</b>
          <button onClick={() => openSection('rare-books')}>{loc(sections[0], 'action')} <ChevronRight size={13} /></button>
        </div>
        <div className="wing-label label-manuscripts">
          <span className="tamil" lang="ta">பனையோலைச் சுவடிகள்</span><b>{loc(sections[1], 'title').toUpperCase()}</b>
          <button onClick={() => openSection('manuscripts')}>{loc(sections[1], 'action')} <ChevronRight size={13} /></button>
        </div>
        <div className="wing-label label-shrine">
          <span className="tamil" lang="ta">திருவள்ளுவர் திருத்தலம்</span><b>{loc(sections[2], 'title').toUpperCase()}</b>
          <button onClick={() => openSection('shrine')}>{loc(sections[2], 'action')} <ChevronRight size={13} /></button>
        </div>

        <button className="statue-hotspot" id="sanctuary" onClick={() => setShowInfo(!showInfo)} aria-expanded={showInfo}>
          <span className="hotspot-ring"><Info size={13} /></span><span>{T('Thiruvalluvar', 'திருவள்ளுவர்', 'तिरुवल्लुवर')}</span>
        </button>

        {showInfo && <aside className="statue-info" role="dialog" aria-modal="false" aria-labelledby="sage-title">
          <button className="close-info" onClick={() => setShowInfo(false)} aria-label={T('Close Thiruvalluvar information', 'மூடு', 'तिरुवल्लुवर की जानकारी बंद करें')}><X size={15} /></button>
          <small>{T('THE TAMIL SAGE', 'தமிழ்ப் புலவர்', 'तमिल संत')}</small><h3 id="sage-title">{T('Thiruvalluvar', 'திருவள்ளுவர்', 'तिरुवल्लुवर')}</h3>
          <p>{T('Celebrated author of the Tirukkural, a timeless Tamil work exploring virtue, prosperity, and love.', 'அறம், பொருள், இன்பம் பற்றிய காலம் கடந்த தமிழ் நூலான திருக்குறளின் புகழ்பெற்ற ஆசிரியர்.', 'तिरुक्कुरल के प्रसिद्ध रचयिता — धर्म, अर्थ और काम (प्रेम) पर एक कालजयी तमिल कृति।')}</p>
          <button className="info-link" onClick={() => { setShowInfo(false); openSection('about'); }}>{loc(sections[3], 'action')} <ChevronRight size={14} /></button>
        </aside>}

        {tourMode && <aside className="tour-guide" aria-label={T('Guided museum tour', 'வழிகாட்டும் சுற்றுலா', 'निर्देशित संग्रहालय भ्रमण')}>
          <div className="tour-guide-top"><span className="tour-live-dot" /> {T('IMMERSIVE GUIDED TOUR', 'வழிகாட்டும் சுற்றுலா', 'निर्देशित भ्रमण')} <span className="tour-escape-hint">{T('ESC TO EXIT', 'வெளியேற ESC', 'बाहर निकलने के लिए ESC')}</span><button onClick={() => setTourMode(false)} aria-label={T('Exit guided tour', 'சுற்றுலா நிறைவு', 'भ्रमण समाप्त करें')}><X size={14} /></button></div>
          <div className="tour-step-count">{T('LANDMARK', 'இடம்', 'स्थल')} <b>{String(tourStopIndex + 1).padStart(2, '0')}</b> <span>/ 04</span></div>
          <h3>{loc(sections[tourStopIndex], 'title')}</h3><p>{loc(sections[tourStopIndex], 'description')}</p>
          <div className="tour-progress">{sections.map((section, index) => <span key={section.id} className={index <= tourStopIndex ? 'complete' : ''} />)}</div>
          <div className="tour-guide-actions"><button className="tour-previous" onClick={() => setTourStopIndex((index) => (index - 1 + sections.length) % sections.length)} aria-label={T('Previous landmark', 'முந்தைய இடம்', 'पिछला स्थल')}><ChevronLeft size={16} /></button><button className="tour-details" onClick={() => { setTourMode(false); openSection(sections[tourStopIndex].id); }}>{T('Explore landmark', 'இடத்தைக் காண்க', 'स्थल देखें')} <ChevronRight size={14} /></button><button className="tour-next" onClick={() => setTourStopIndex((index) => (index + 1) % sections.length)} aria-label={T('Next landmark', 'அடுத்த இடம்', 'अगला स्थल')}><ChevronRight size={16} /></button></div>
        </aside>}

        <div className={`scene-caption ${tourMode ? 'caption-tour' : ''}`}><span className={`status-dot ${sceneReady && imageLoaded ? 'ready' : ''}`} />
          {imageLoaded ? T('THE CLASSICAL TAMIL TREASURES GALLERY', 'செம்மொழித் தமிழ்க் கருவூலக் காட்சியகம்', 'शास्त्रीय तमिल निधि दीर्घा') : T('PREPARING THE GALLERY', 'காட்சியகம் தயாராகிறது', 'दीर्घा तैयार हो रही है')} <span className="caption-divider">/</span> {tourMode ? T('FOLLOW THE GUIDED TOUR', 'சுற்றுலாவைத் தொடருங்கள்', 'निर्देशित भ्रमण का अनुसरण करें') : T('MOVE YOUR POINTER TO EXPLORE', 'சுட்டியை நகர்த்திக் காணுங்கள்', 'देखने के लिए पॉइंटर घुमाएँ')}
        </div>
        <div className="hero-bottom-fade" />
      </section>

      <section className="collections" id="collections">
        <div className="section-heading"><span>{T('DISCOVER THE COLLECTION', 'தொகுப்பைக் கண்டறியுங்கள்', 'संग्रह को जानें')}</span><i /></div>
        <div className="collection-grid">
          {collections.map((item) => {
            const Icon = item.icon;
            return <button className="collection-card" key={item.title} onClick={() => openSection(item.section)}>
              <span className={`collection-icon ${item.manuscript ? 'manuscript-icon' : ''}`}>{item.manuscript ? <span>ஓலை</span> : <Icon size={26} strokeWidth={1.6} />}</span>
              <span className="collection-copy"><b>{loc(item, 'title')}</b><small>{loc(item, 'description')}</small></span>
              <ChevronRight className="collection-chevron" size={18} />
            </button>;
          })}
        </div>
      </section>

      {selected && <div className="module-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActive(''); }}>
        <section className="module-panel" role="dialog" aria-modal="true" aria-labelledby="module-title">
          <button className="module-close" onClick={() => setActive('')} aria-label={T('Close module details', 'மூடு', 'विवरण बंद करें')}><X /></button>
          <span className="module-number">{selected.number} / {T('MUSEUM COLLECTION', 'அருங்காட்சியகத் தொகுப்பு', 'संग्रहालय संग्रह')}</span>
          <div className="module-emblem"><selected.icon size={31} /></div>
          <span className="module-tamil" lang="ta">{selected.tamil}</span>
          <h2 id="module-title">{loc(selected, 'title')}</h2>
          <p>{loc(selected, 'description')}</p>
          <div className="module-actions">
            <button className="primary-action" onClick={visitModule}>{loc(selected, 'action')} <ChevronRight size={16} /></button>
            <button className="secondary-action" onClick={() => setActive('')}>{T('Return to gallery', 'காட்சியகத்துக்குத் திரும்பு', 'दीर्घा पर लौटें')}</button>
          </div>
          <small className="integration-note">Module destination: <code>{selected.href}</code></small>
        </section>
      </div>}

      <Suspense fallback={null}><VirtualHallway
        halls={hallways}
        currentRoom={doorRoomId || roomId}
        hidden={view !== 'hallway'}
        active={view === 'hallway' && !roomId && !scrollOpen && !heritage}
        started={museumEntered}
        engaged={Boolean(doorRoomId || roomId || scrollOpen)}
        onReady={onHallwayReady}
        onEnterWing={onHallwayWing}
        onShowOverview={showGallery}
        onMeetValluvar={openScroll}
        onOpenThenNow={openThenNow}
        onOpenTamilakam={openTamilakam}
      /></Suspense>
      {roomId && <Suspense fallback={<ScreenFallback className="z-[1100] bg-[#0c0906]" />}><MuseumRoom room={getRoom(roomId)} onExit={exitRoom} onShowOnMap={openTamilakam} /></Suspense>}
      {heritage?.view === THEN_NOW && <Suspense fallback={<ScreenFallback className="z-[1250] bg-midnight" />}><ThenAndNow placeId={heritage.place} onClose={closeHeritage} onShowOnMap={openTamilakam} /></Suspense>}
      {heritage?.view === TAMILAKAM && <Suspense fallback={<ScreenFallback className="z-[1250] bg-midnight" />}><TamilakamMap focus={heritage.place} onClose={closeHeritage} onViewThenNow={openThenNow} /></Suspense>}
      {doorRoomId && <GlassDoorTransition key={doorRoomId} room={getRoom(doorRoomId)} onEnter={enterRoom} onComplete={closeDoors} onCancel={closeDoors} />}

      {scrollOpen && <Suspense fallback={<ScreenFallback className="z-[1300] bg-[#0c0906]/80" />}><ThiruvalluvarScroll onClose={closeScroll} /></Suspense>}

      {museumEntered && <TutorialLauncher onOpen={() => setTutorialOpen(true)} />}
      {/* In the hallway the music toggle sits in its navigation bar; elsewhere (a room, Then & Now, …) on this tab. */}
      {museumEntered && (view !== 'hallway' || roomId || heritage || scrollOpen) && <MusicToggle variant="tab" />}
      {museumEntered && (roomId || heritage || scrollOpen) && (
        <RoomCatalogueButton
          variant="tab"
          hallId={heritage ? 'ainthinai' : roomId ? hallOf(roomId) : 'literature'}
          roomId={scrollOpen ? 'shrine' : heritage ? null : roomId}
        />
      )}
      <TamilNarrationLayer />
      {/* Live users · total views (website with the analytics server only; never in the app). */}
      {museumEntered && view === 'hallway' && !roomId && !scrollOpen && !heritage && !doorRoomId && (
        <div className="pointer-events-none fixed right-3 bottom-[4.75rem] z-[1060] sm:right-5 sm:bottom-6">
          <TelemetryPill />
        </div>
      )}
      {tutorialOpen && <TutorialDialog enabled={tutorialEnabled} onToggle={setTutorialEnabled} onClose={closeTutorial} />}

      {splashVisible && (
        <LoadingScreen
          assets={[MUSEUM_IMAGE]}
          sceneReady={hallwayReady}
          onEnter={() => {
            unlockAudio(); // the visitor's click lets the music begin
            setMuseumEntered(true);
          }}
          onExited={() => setSplashVisible(false)}
        />
      )}

      <footer className="footer">
        <span>© {T('CICT CLASSICAL TAMIL TREASURES GALLERY', 'செம்மொழித் தமிழ்க் கருவூலக் காட்சியகம்', 'CICT शास्त्रीय तमिल निधि दीर्घा')}</span><span lang="ta">தமிழ் மொழி · இலக்கியம் · மரபு</span>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>{T('BACK TO TOP ↑', 'மேலே செல் ↑', 'ऊपर जाएँ ↑')}</button>
      </footer>
    </main>
  );
}

/** If anything unexpected throws, show a way back instead of a blank page. */
class AppBoundary extends React.Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error('Museum crashed:', error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="grid min-h-screen place-items-center bg-[#0c0906] p-6 text-center font-sans text-[#f7ead0]">
        <div>
          <p className="text-lg font-bold text-[#e9a27a]">மன்னிக்கவும் · {tri('Sorry', 'Sorry', 'क्षमा करें')}</p>
          <h1 className="mt-1 font-serif text-3xl text-[#f2d38b]">{tri('Something went wrong in the museum.', 'அருங்காட்சியகத்தில் ஏதோ தவறு நேர்ந்தது.', 'संग्रहालय में कुछ गड़बड़ हो गई।')}</h1>
          <button type="button" onClick={() => window.location.reload()} className="mt-6 cursor-pointer rounded-full border border-[#f2d38b] px-6 py-2.5 font-semibold text-[#f2d38b]">
            {tri('Reload the museum', 'மீண்டும் ஏற்று', 'संग्रहालय फिर से खोलें')}
          </button>
        </div>
      </main>
    );
  }
}

/** The museum, or the Admin Portal when the address asks for it (#/admin, /admin). */
function Root() {
  const [admin, setAdmin] = useState(isAdminRoute);
  useEffect(() => {
    const update = () => setAdmin(isAdminRoute());
    for (const type of ['hashchange', 'popstate', 'museum:route']) window.addEventListener(type, update);
    return () => {
      for (const type of ['hashchange', 'popstate', 'museum:route']) window.removeEventListener(type, update);
    };
  }, []);
  return admin ? (
    <Suspense fallback={<div className="fixed inset-0 bg-[#0d0805]" />}>
      <AdminApp />
    </Suspense>
  ) : (
    <App />
  );
}

createRoot(document.getElementById('root')).render(<React.StrictMode><AppBoundary><Root /></AppBoundary></React.StrictMode>);
