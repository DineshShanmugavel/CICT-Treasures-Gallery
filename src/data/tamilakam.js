/**
 * Ancient Tamilakam — the places on the interactive map (TamilakamMap.jsx).
 *
 * Coordinates are those of the present-day town, temple or excavated site, rounded to about a
 * kilometre; they mark where a place is today, not a surveyed ancient boundary. No territorial
 * outlines are drawn: the political map of Tamilakam changed over the centuries and cannot be
 * fixed as lines. A place whose identification is disputed (Vanchi) lists each candidate site
 * (`candidates`), and both are drawn, dashed.
 *
 * `thenNow` links a place to its card in Tamil Nadu: Then and Now (thenAndNow.js), whose
 * pictures and texts it shares rather than repeating them.
 */

export const TAMILAKAM_NOTE = {
  en: 'Ancient Tamilakam was a historical and cultural region whose political boundaries changed over time. The locations and territorial outlines shown here are approximate interpretations based on historical, literary, archaeological, and geographical evidence. They should not be confused with present-day district boundaries.',
  ta: 'பண்டைய தமிழகம் என்பது காலந்தோறும் அரசியல் எல்லைகள் மாறிவந்த ஒரு வரலாற்று, பண்பாட்டுப் பகுதி. இங்குக் காட்டப்படும் இடங்கள் வரலாற்று, இலக்கிய, தொல்லியல், புவியியல் சான்றுகளின் அடிப்படையிலான தோராயமான விளக்கங்களே; இவற்றை இன்றைய மாவட்ட எல்லைகளுடன் குழப்பிக்கொள்ளக் கூடாது.',
};

/** Present-day map tiles under the markers: a note so the modern lines are not read as ancient ones. */
export const BASEMAP_NOTE = {
  en: 'The base map is a present-day map (© OpenStreetMap contributors), shown in sepia; its roads and borders are modern.',
  ta: 'அடிப்படை வரைபடம் இன்றைய வரைபடம் (© OpenStreetMap பங்களிப்பாளர்கள்); அதன் சாலைகளும் எல்லைகளும் இக்காலத்தவை.',
};

export const CATEGORIES = [
  { id: 'capital', en: 'Ancient capitals and political centres', ta: 'பண்டைய தலைநகரங்களும் அரசியல் மையங்களும்', color: '#8a2a1e', glyph: '♛' },
  { id: 'port', en: 'Ports and maritime trade centres', ta: 'துறைமுகங்களும் கடல் வணிக மையங்களும்', color: '#1f5a7a', glyph: '⚓' },
  { id: 'temple', en: 'Temples and architectural heritage', ta: 'கோயில்களும் கட்டடக்கலை மரபும்', color: '#9a6a12', glyph: '⛩' },
  { id: 'archaeology', en: 'Archaeological sites', ta: 'தொல்லியல் தளங்கள்', color: '#5a4a2a', glyph: '◈' },
  { id: 'literary', en: 'Literary and cultural heritage locations', ta: 'இலக்கிய, பண்பாட்டு மரபுத் தலங்கள்', color: '#5a2a6a', glyph: '✒' },
];
export const categoryOf = (id) => CATEGORIES.find((category) => category.id === id);

/** The view the map opens at, and returns to on Reset: southern India and its coasts. */
export const HOME_VIEW = { center: [10.6, 78.6], zoom: 7 };

export const TAMILAKAM_PLACES = [
  {
    id: 'madurai',
    en: 'Madurai',
    ta: 'மதுரை',
    category: 'capital',
    position: [9.919, 78.119],
    period: { en: 'Pandya capital in the early historic period; a major city ever since', ta: 'தொடக்க வரலாற்றுக் காலத்தில் பாண்டியர் தலைநகர்; அன்றுமுதல் பெருநகர்' },
    description: { en: 'The Pandya capital on the Vaigai, closely tied to the traditions of the Tamil Sangam and classical poetry.', ta: 'வைகைக் கரையில் அமைந்த பாண்டியர் தலைநகர்; தமிழ்ச் சங்க மரபுடனும் செவ்வியல் கவிதையுடனும் நெருங்கிய தொடர்புடையது.' },
    significance: { en: 'A city where literature, royal patronage, religion and urban life have met for some two thousand years.', ta: 'இலக்கியம், அரச ஆதரவு, சமயம், நகர வாழ்வு ஆகியவை ஏறத்தாழ இரண்டாயிரம் ஆண்டுகளாகச் சந்திக்கும் நகரம்.' },
    evidence: { en: 'Described in Maduraikkanchi and Silappathikaram; the Meenakshi Amman Temple and its inscriptions belong to much later centuries. Its Sangam-age appearance cannot be reconstructed with certainty.', ta: 'மதுரைக்காஞ்சி, சிலப்பதிகாரம் ஆகியவை விவரிக்கின்றன; மீனாட்சி அம்மன் கோயிலும் அதன் கல்வெட்டுகளும் மிகப் பிற்காலத்தவை. சங்க காலத் தோற்றத்தை உறுதியாக மீட்டுருவாக்க இயலாது.' },
    thenNow: 'madurai',
  },
  {
    id: 'poompuhar',
    en: 'Poompuhar / Kaveripoompattinam',
    ta: 'பூம்புகார் / காவிரிப்பூம்பட்டினம்',
    category: 'port',
    position: [11.143, 79.855],
    period: { en: 'Early historic Chola port', ta: 'தொடக்க வரலாற்றுக் காலச் சோழர் துறைமுகம்' },
    description: { en: 'The Chola port at the mouth of the Kaveri, celebrated for its merchants, markets and ships.', ta: 'காவிரி முகத்துவாரத்தில் அமைந்த சோழர் துறைமுகம்; வணிகர், அங்காடி, கப்பல்களுக்குப் புகழ்பெற்றது.' },
    significance: { en: 'The literary image of ancient Tamil maritime prosperity.', ta: 'பண்டைய தமிழர் கடல்சார் செழிப்பின் இலக்கியச் சித்திரம்.' },
    evidence: { en: 'Pattinappalai and Silappathikaram describe the city; onshore and offshore investigations have explored its maritime past. Erosion has changed the coast, and the full layout of the ancient port is not known.', ta: 'பட்டினப்பாலையும் சிலப்பதிகாரமும் நகரை விவரிக்கின்றன; கரையிலும் கடலிலும் ஆய்வுகள் நடந்துள்ளன. கடலரிப்பு கரையை மாற்றியுள்ளது; பண்டைய துறைமுகத்தின் முழு அமைப்பு அறியப்படவில்லை.' },
    thenNow: 'poompuhar',
  },
  {
    id: 'keezhadi',
    en: 'Keezhadi',
    ta: 'கீழடி',
    category: 'archaeology',
    position: [9.863, 78.182],
    period: { en: 'Early historic settlement; dating continues to be studied', ta: 'தொடக்க வரலாற்றுக் காலக் குடியிருப்பு; காலக்கணிப்பு ஆய்வில் உள்ளது' },
    description: { en: 'An excavated settlement near the Vaigai in Sivaganga district, with brick structures, pottery and many artefacts.', ta: 'சிவகங்கை மாவட்டத்தில் வைகைக்கு அருகே அகழ்ந்தெடுக்கப்பட்ட குடியிருப்பு; செங்கல் கட்டுமானங்கள், மட்கலங்கள், பல தொல்பொருட்கள்.' },
    significance: { en: 'Material evidence of urban life that can be studied alongside Sangam literature.', ta: 'சங்க இலக்கியத்துடன் ஒப்பிட்டு ஆராயக்கூடிய நகர வாழ்வின் பொருள்சார் சான்று.' },
    evidence: { en: 'Excavations since 2014 have yielded brick buildings, ring wells and potsherds inscribed in Tamil-Brahmi; the finds are shown in the site museum.', ta: '2014 முதலான அகழாய்வுகளில் செங்கல் கட்டடங்கள், உறைகிணறுகள், தமிழ்-பிராமி பொறித்த ஓடுகள் கிடைத்துள்ளன; அவை தள அருங்காட்சியகத்தில் உள்ளன.' },
    thenNow: 'keezhadi',
  },
  {
    id: 'uraiyur',
    en: 'Uraiyur',
    ta: 'உறையூர்',
    category: 'capital',
    position: [10.828, 78.682],
    period: { en: 'Early Chola capital', ta: 'முற்காலச் சோழர் தலைநகர்' },
    description: { en: 'Named in Sangam poetry as a capital of the early Cholas; today a part of the city of Tiruchirappalli.', ta: 'சங்கப் பாடல்களில் முற்காலச் சோழர் தலைநகராகக் குறிக்கப்படுவது; இன்று திருச்சிராப்பள்ளி நகரின் ஒரு பகுதி.' },
    significance: { en: 'With Puhar, one of the two centres of early Chola power on the Kaveri.', ta: 'புகாருடன், காவிரிக் கரையின் முற்காலச் சோழர் ஆட்சியின் இரு மையங்களுள் ஒன்று.' },
    evidence: { en: 'Known chiefly from Sangam literature; the modern city covers the ancient settlement, so what excavation has revealed is limited.', ta: 'பெரும்பாலும் சங்க இலக்கியத்தால் அறியப்படுவது; பண்டைய குடியிருப்பின் மேல் இன்றைய நகரம் அமைந்துள்ளதால் அகழாய்வுச் சான்றுகள் குறைவு.' },
  },
  {
    id: 'kaveri',
    en: 'Kaveri River region (marked at Kallanai)',
    ta: 'காவிரி ஆற்றுப் பகுதி (கல்லணையில் குறிக்கப்பட்டது)',
    category: 'literary',
    position: [10.833, 78.819],
    period: { en: 'Celebrated from the Sangam age onwards', ta: 'சங்க காலம் முதல் போற்றப்படுவது' },
    description: { en: 'The fertile Kaveri valley and delta, heartland of the Chola country. The marker stands at Kallanai, the ancient diversion weir across the river; the region itself spreads across the delta.', ta: 'சோழ நாட்டின் இதயமான வளமிக்க காவிரிப் படுகையும் கழிமுகமும். குறி, ஆற்றின் குறுக்கே உள்ள பழமையான கல்லணையில் உள்ளது; பகுதி கழிமுகம் முழுவதும் பரந்தது.' },
    significance: { en: 'The river that fed the Chola kingdom’s agriculture and its poetry of abundance.', ta: 'சோழ நாட்டின் வேளாண்மைக்கும் வளம் பாடும் கவிதைக்கும் உயிரான ஆறு.' },
    evidence: { en: 'Sangam poems such as Pattinappalai praise the Kaveri country. Tradition credits Kallanai to Karikala Cholan; the structure has been repaired and rebuilt over the centuries.', ta: 'பட்டினப்பாலை முதலிய சங்கப் பாடல்கள் காவிரி நாட்டைப் போற்றுகின்றன. கல்லணையைக் கரிகால் சோழன் கட்டினான் என்பது மரபு; அது பல நூற்றாண்டுகளாகப் பழுதுபார்க்கப்பட்டுப் புதுப்பிக்கப்பட்டுள்ளது.' },
  },
  {
    id: 'thanjavur',
    en: 'Thanjavur',
    ta: 'தஞ்சாவூர்',
    category: 'temple',
    position: [10.783, 79.132],
    period: { en: 'Chola capital; Brihadisvara Temple completed about 1010 CE', ta: 'சோழர் தலைநகர்; பெருவுடையார் கோயில் ஏறத்தாழ கி.பி. 1010இல் நிறைவுற்றது' },
    description: { en: 'Seat of Chola power under Rajaraja I, who built the Brihadisvara Temple (Rajarajesvaram).', ta: 'முதலாம் இராஜராஜன் காலச் சோழர் ஆட்சியின் இருக்கை; அவர் பெருவுடையார் கோயிலை (இராஜராஜேச்சரம்) எடுப்பித்தார்.' },
    significance: { en: 'A summit of Chola architecture, art and administration; part of the UNESCO Great Living Chola Temples.', ta: 'சோழர் கட்டடக்கலை, கலை, நிர்வாகத்தின் உச்சம்; யுனெஸ்கோவின் மாமரபுச் சோழர் கோயில்களுள் ஒன்று.' },
    evidence: { en: 'The temple’s own inscriptions record its building, endowments and staff in detail.', ta: 'கோயிலின் கல்வெட்டுகளே அதன் கட்டுமானம், கொடைகள், பணியாளர்களை விரிவாகப் பதிவு செய்கின்றன.' },
    thenNow: 'thanjavur',
  },
  {
    id: 'mamallapuram',
    en: 'Mamallapuram',
    ta: 'மாமல்லபுரம்',
    category: 'temple',
    position: [12.617, 80.199],
    period: { en: 'Pallava monuments, 7th–8th centuries CE', ta: 'பல்லவர் நினைவுச் சின்னங்கள், கி.பி. 7–8ஆம் நூற்றாண்டுகள்' },
    description: { en: 'Pallava rock-cut caves, monolithic rathas, the great relief of Arjuna’s Penance and the Shore Temple, on the Coromandel Coast.', ta: 'கொரமண்டல் கடற்கரையில் பல்லவர் குடைவரைகள், ஒற்றைக்கல் ரதங்கள், அர்ச்சுனன் தபசுப் பெருஞ்சிற்பம், கடற்கரைக் கோயில்.' },
    significance: { en: 'A workshop of Pallava art and early Tamil temple architecture; a UNESCO World Heritage Site.', ta: 'பல்லவர் கலைக்கும் தொடக்கக் காலத் தமிழ்க் கோயில் கட்டடக்கலைக்கும் களம்; யுனெஸ்கோ உலகப் பாரம்பரியத் தளம்.' },
    evidence: { en: 'The monuments themselves, with Pallava inscriptions and royal titles carved on them.', ta: 'நினைவுச் சின்னங்களும் அவற்றில் பொறிக்கப்பட்ட பல்லவர் கல்வெட்டுகளும் விருதுப் பெயர்களும்.' },
    thenNow: 'mamallapuram',
  },
  {
    id: 'gangaikondacholapuram',
    en: 'Gangaikondacholapuram',
    ta: 'கங்கைகொண்ட சோழபுரம்',
    category: 'capital',
    position: [11.206, 79.449],
    period: { en: 'Chola capital founded by Rajendra I; temple completed about 1035 CE', ta: 'முதலாம் இராஜேந்திரன் நிறுவிய சோழர் தலைநகர்; கோயில் ஏறத்தாழ கி.பி. 1035இல் நிறைவுற்றது' },
    description: { en: 'The capital Rajendra I founded to commemorate his northern campaign; its great Shiva temple survives, most of the city does not.', ta: 'வடநாட்டுப் படையெடுப்பின் நினைவாக முதலாம் இராஜேந்திரன் நிறுவிய தலைநகர்; அதன் பெருங்கோயில் எஞ்சியுள்ளது, நகரின் பெரும்பகுதி இல்லை.' },
    significance: { en: 'Witness to the height of Chola imperial ambition; part of the UNESCO Great Living Chola Temples.', ta: 'சோழப் பேரரசின் உச்சநிலைக்குச் சான்று; யுனெஸ்கோவின் மாமரபுச் சோழர் கோயில்களுள் ஒன்று.' },
    evidence: { en: 'Inscriptions and copper-plate grants of Rajendra I; the temple and excavated remains of the palace area.', ta: 'முதலாம் இராஜேந்திரனின் கல்வெட்டுகளும் செப்பேடுகளும்; கோயிலும் அரண்மனைப் பகுதியின் அகழாய்வு எச்சங்களும்.' },
    thenNow: 'gangaikondacholapuram',
  },
  {
    id: 'kanchipuram',
    en: 'Kanchipuram',
    ta: 'காஞ்சிபுரம்',
    category: 'temple',
    position: [12.834, 79.704],
    period: { en: 'Pallava capital; temples of many later dynasties', ta: 'பல்லவர் தலைநகர்; பிற்கால வம்சங்கள் பலவற்றின் கோயில்கள்' },
    description: { en: 'The Pallava capital and a temple city of learning, still a centre of worship and silk weaving.', ta: 'பல்லவர் தலைநகரும் கல்விக்குரிய கோயில் நகரமும்; இன்றும் வழிபாட்டு, பட்டுநெசவு மையம்.' },
    significance: { en: 'Continuity of Tamil temple architecture, religious learning and craft from the Pallavas to today.', ta: 'பல்லவர் முதல் இன்றுவரை தமிழ்க் கோயில் கட்டடக்கலை, சமயக் கல்வி, கைவினை ஆகியவற்றின் தொடர்ச்சி.' },
    evidence: { en: 'Pallava temples such as the Kailasanatha, with their inscriptions, and the later temples and records of the city.', ta: 'கைலாசநாதர் போன்ற பல்லவர் கோயில்களும் அவற்றின் கல்வெட்டுகளும், நகரின் பிற்காலக் கோயில்களும் பதிவுகளும்.' },
    thenNow: 'kanchipuram',
  },
  {
    id: 'korkai',
    en: 'Korkai',
    ta: 'கொற்கை',
    category: 'port',
    position: [8.633, 78.067],
    period: { en: 'Early historic Pandya port', ta: 'தொடக்க வரலாற்றுக் காலப் பாண்டியர் துறைமுகம்' },
    description: { en: 'The early Pandya port near the mouth of the Thamirabarani, famed for its pearl fishery. The sea has since receded, leaving the village inland.', ta: 'தாமிரபரணி முகத்துவாரத்தருகே இருந்த முற்காலப் பாண்டியர் துறைமுகம்; முத்துக்குளிப்புக்குப் புகழ்பெற்றது. கடல் பின்வாங்கியதால் ஊர் இன்று உள்நாட்டில் உள்ளது.' },
    significance: { en: 'Gateway of the Pandya pearl trade with the wider world.', ta: 'பாண்டியரின் முத்து வணிகத்தின் வாயில்.' },
    evidence: { en: 'Named in Sangam poetry; excavations at the site have yielded early historic remains. The marker is approximate.', ta: 'சங்கப் பாடல்களில் குறிக்கப்படுவது; அகழாய்வுகளில் தொடக்க வரலாற்றுக் கால எச்சங்கள் கிடைத்துள்ளன. குறி தோராயமானது.' },
  },
  {
    id: 'vanchi',
    en: 'Vanchi',
    ta: 'வஞ்சி',
    category: 'capital',
    candidates: [
      { position: [10.960, 78.077], en: 'Karur, Tamil Nadu', ta: 'கரூர், தமிழ்நாடு' },
      { position: [10.222, 76.196], en: 'Thiruvanchikulam, near Kodungallur, Kerala', ta: 'திருவஞ்சிக்குளம், கொடுங்கல்லூர் அருகே, கேரளம்' },
    ],
    period: { en: 'Chera capital of the Sangam age', ta: 'சங்க காலச் சேரர் தலைநகர்' },
    description: { en: 'The Chera capital of Sangam poetry and Silappathikaram. Where it stood is disputed: many historians identify it with Karur in Tamil Nadu, others with Thiruvanchikulam near Kodungallur in Kerala. Both candidates are marked, dashed.', ta: 'சங்கப் பாடல்களும் சிலப்பதிகாரமும் குறிக்கும் சேரர் தலைநகர். அது எங்கிருந்தது என்பது விவாதத்திற்குரியது: பல வரலாற்றாசிரியர்கள் தமிழ்நாட்டின் கரூர் என்கின்றனர்; வேறு சிலர் கேரளத்தின் கொடுங்கல்லூர் அருகே உள்ள திருவஞ்சிக்குளம் என்கின்றனர். இரண்டும் குறிக்கப்பட்டுள்ளன.' },
    significance: { en: 'Seat of the Chera kings in literature — and an example of how uncertain ancient geography can be.', ta: 'இலக்கியத்தில் சேர மன்னரின் இருக்கை — பண்டைய புவியியல் எவ்வளவு உறுதியற்றதாக இருக்கலாம் என்பதற்கான எடுத்துக்காட்டு.' },
    evidence: { en: 'Literary references; Karur’s case rests partly on Chera coins and Tamil-Brahmi inscriptions found in its region. The question is not settled.', ta: 'இலக்கியக் குறிப்புகள்; கரூர்ப் பகுதியில் கிடைத்த சேரர் காசுகளும் தமிழ்-பிராமிக் கல்வெட்டுகளும் கரூர்க் கருத்துக்குச் சான்றாகக் கொள்ளப்படுகின்றன. இக்கேள்வி இன்னும் தீர்க்கப்படவில்லை.' },
  },
  {
    id: 'kodumanal',
    en: 'Kodumanal',
    ta: 'கொடுமணல்',
    category: 'archaeology',
    position: [11.110, 77.510],
    period: { en: 'Early historic industrial and trading settlement', ta: 'தொடக்க வரலாற்றுக் காலத் தொழில், வணிகக் குடியிருப்பு' },
    description: { en: 'A village on the Noyyal in Erode district, excavated as a centre of bead-making, gem-working and iron and steel production.', ta: 'ஈரோடு மாவட்டத்தில் நொய்யல் கரையில் உள்ள ஊர்; மணி செய்தல், கல் வேலை, இரும்பு-எஃகு உற்பத்தி மையமாக அகழ்ந்தறியப்பட்டது.' },
    significance: { en: 'Evidence of craft industry and inland trade routes in the Sangam age.', ta: 'சங்க காலத் தொழில்களுக்கும் உள்நாட்டு வணிக வழிகளுக்கும் சான்று.' },
    evidence: { en: 'Excavations have yielded beads, furnaces and many potsherds inscribed in Tamil-Brahmi; the place is generally identified with the Kodumanam of Pathitruppathu. The marker is approximate.', ta: 'அகழாய்வுகளில் மணிகள், உலைகள், தமிழ்-பிராமி பொறித்த பல ஓடுகள் கிடைத்துள்ளன; பதிற்றுப்பத்து குறிக்கும் கொடுமணம் இதுவே எனப் பொதுவாகக் கொள்ளப்படுகிறது. குறி தோராயமானது.' },
  },
];

export const getTamilakamPlace = (id) => TAMILAKAM_PLACES.find((place) => place.id === id) ?? null;
/** The map's places for a Then & Now place (by its id). */
export const tamilakamPlaceFor = (thenNowId) => TAMILAKAM_PLACES.find((place) => place.thenNow === thenNowId) ?? null;
