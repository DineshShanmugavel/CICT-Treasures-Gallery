/**
 * Tamil Nadu: Then and Now — eight historic places, each compared across time.
 *
 * One source for the Then vs Now hall's rooms (roomBooks.js), the comparison cards with their
 * slider (ThenAndNow.jsx) and the "View Then & Now" links on the map of Ancient Tamilakam
 * (tamilakam.js). The texts follow the curators' notes in public/Tamilnadu places- then vs now
 * (PLACES- THEN vs NOW.pdf and its Tamil edition); the photographs were taken from the English
 * notes and saved one folder per place, beside them.
 *
 * Each place has:
 * - `images`: its photographs (file names in its folder), each captioned for the closer view.
 *   `kind` says what a picture is: 'then' (a historical painting, engraving or photograph),
 *   'reconstruction' (an artist's imagining — never to be shown as a record), 'now' (a
 *   present-day photograph) or 'evidence' (what excavation or survival shows today).
 * - `compare`: the two pictures set in the slider, { then, now } (file names). A `then` not in
 *   `images` is a picture still to be added: the slider shows a placeholder naming the file to
 *   put in the folder, and picks it up once it is there.
 * - `sections`: the four texts of every card — then, now, what survives, significance.
 */

import { mediaUrl } from '../mediaUrl.js';

export const PLACES_FOLDER = 'Tamilnadu places- then vs now';
/** The file a place's missing historical picture should be saved as, in its folder. */
export const MISSING_THEN_FILE = '1 then - historical image.jpg';

export const SECTION_TITLES = {
  then: { en: 'Then — In Ancient Times', ta: 'அன்று — பண்டைய காலம்' },
  now: { en: 'Now — In the Present Day', ta: 'இன்று — தற்காலம்' },
  survives: { en: 'What Survives Today?', ta: 'இன்றும் எஞ்சியுள்ளவை' },
  significance: { en: 'Historical Significance', ta: 'வரலாற்றுச் சிறப்பு' },
};

export const KIND_LABELS = {
  then: { en: 'Historical view', ta: 'வரலாற்றுக் காட்சி' },
  reconstruction: { en: 'Artistic reconstruction — not a historical record', ta: 'கலைஞரின் மீட்டுருவாக்கம் — வரலாற்றுப் பதிவு அன்று' },
  now: { en: 'Present-day photograph', ta: 'இன்றைய ஒளிப்படம்' },
  evidence: { en: 'Archaeological evidence', ta: 'தொல்லியல் சான்று' },
};

export const THEN_NOW_PLACES = [
  {
    id: 'madurai',
    en: 'Madurai',
    ta: 'மதுரை',
    glyph: 'மதுரை',
    accent: '#7a2e3a',
    images: [
      { file: '1 then - gopuram, early photograph.jpeg', kind: 'then', en: 'A temple gopuram over a Madurai street', ta: 'மதுரை வீதியின் மேல் உயர்ந்த கோபுரம்', note: 'An early photograph of one of the towering gateways of the Meenakshi Amman Temple, seen from the street below. The photographer and date are not recorded with the image.', noteTa: 'மீனாட்சி அம்மன் திருக்கோயிலின் உயர்ந்த கோபுரங்களுள் ஒன்றைக் கீழே உள்ள வீதியிலிருந்து காட்டும் பழைய ஒளிப்படம். ஒளிப்படக் கலைஞரின் பெயரும் காலமும் படத்துடன் பதிவு செய்யப்படவில்லை.' },
      { file: '2 then - pillared hall, early engraving.jpeg', kind: 'then', en: 'A pillared mandapam', ta: 'தூண்கள் நிறைந்த மண்டபம்', note: 'An early engraving of a long pillared hall with carved columns, of the kind built round Madurai’s great temple. The artist and date are not recorded with the image.', noteTa: 'மதுரையின் பெருங்கோயிலைச் சுற்றிக் கட்டப்பட்டவை போன்ற, செதுக்கிய தூண்கள் நிறைந்த நீண்ட மண்டபத்தின் பழைய செதுக்கோவியம். கலைஞரின் பெயரும் காலமும் படத்துடன் பதிவு செய்யப்படவில்லை.' },
      { file: '3 now - temple from the air.jpeg', kind: 'now', en: 'The Meenakshi Amman Temple today', ta: 'இன்றைய மீனாட்சி அம்மன் திருக்கோயில்', note: 'The temple from the air, its gopurams rising over the streets of the modern city that grew around it.', noteTa: 'வானிலிருந்து காணும் திருக்கோயில்; அதைச் சுற்றி வளர்ந்த இன்றைய நகரின் வீதிகளுக்கு மேல் அதன் கோபுரங்கள் உயர்ந்து நிற்கின்றன.' },
    ],
    compare: { then: '1 then - gopuram, early photograph.jpeg', now: '3 now - temple from the air.jpeg' },
    sections: {
      then: {
        en: 'Madurai was one of the most important centres of the ancient Pandya kingdom. It is closely associated with Tamil literary traditions and the development of classical Tamil poetry. Ancient literary works describe Madurai as a prosperous city where poets, scholars, merchants and rulers gathered. The city also played a significant role in trade, religious life and cultural exchange. Although descriptions of ancient Madurai survive in literary sources, its exact appearance during the Sangam period cannot be reconstructed with complete certainty.',
        ta: 'பண்டைய பாண்டிய நாட்டின் மிக முக்கியமான நகரங்களில் ஒன்றாக மதுரை விளங்கியது. தமிழ் இலக்கிய மரபுடனும் செம்மொழித் தமிழ்க் கவிதைகளின் வளர்ச்சியுடனும் மதுரை நெருங்கிய தொடர்புடையது. புலவர்கள், அறிஞர்கள், வணிகர்கள், மன்னர்கள் ஆகியோர் ஒன்றுகூடிய செழிப்புமிக்க நகரமாகப் பண்டைய இலக்கியங்கள் மதுரையைச் சித்தரிக்கின்றன. வணிகம், சமய வாழ்க்கை, பண்பாட்டுப் பரிமாற்றம் ஆகியவற்றிலும் இந்நகரம் முக்கியப் பங்கு வகித்தது. பண்டைய மதுரையைப் பற்றிய செய்திகள் இலக்கியங்களில் காணப்பட்டாலும், சங்க காலத்தில் இந்நகரம் எவ்வாறு தோற்றமளித்தது என்பதைத் துல்லியமாக மீட்டுருவாக்குவது சாத்தியமில்லை.',
      },
      now: {
        en: 'Today, Madurai is one of Tamil Nadu’s major cultural and religious cities. The Meenakshi Amman Temple is its most recognisable landmark, attracting pilgrims and visitors from across India and abroad. The city remains famous for its temple festivals, traditional markets, food, handicrafts and Tamil cultural heritage.',
        ta: 'இன்று மதுரை தமிழ்நாட்டின் முக்கியமான பண்பாட்டு மற்றும் சமய நகரங்களில் ஒன்றாகத் திகழ்கிறது. மீனாட்சி அம்மன் திருக்கோயில் இந்நகரின் அடையாளச் சின்னமாக விளங்குகிறது. இந்தியாவின் பல பகுதிகளிலிருந்தும் வெளிநாடுகளிலிருந்தும் பக்தர்களும் சுற்றுலாப் பயணிகளும் இங்கு வருகின்றனர். கோயில் திருவிழாக்கள், பாரம்பரியச் சந்தைகள், உணவு வகைகள், கைவினைப் பொருட்கள், தமிழ்ப் பண்பாடு ஆகியவற்றிற்காக மதுரை புகழ்பெற்றுள்ளது.',
      },
      survives: {
        en: 'The Meenakshi Amman Temple, historic streets, religious traditions, and continuing literary and cultural practices connect modern Madurai with its long history.',
        ta: 'மீனாட்சி அம்மன் திருக்கோயில், வரலாற்றுச் சிறப்புமிக்க வீதிகள், சமய மரபுகள், தொடர்ந்து வளர்ந்து வரும் இலக்கிய மற்றும் பண்பாட்டு நடைமுறைகள் ஆகியவை நவீன மதுரையை அதன் நீண்டகால வரலாற்றுடன் இணைக்கின்றன.',
      },
      significance: {
        en: 'Madurai represents the enduring relationship between Tamil literature, royal patronage, religious traditions and urban life.',
        ta: 'தமிழ் இலக்கியம், மன்னர்களின் ஆதரவு, சமய மரபுகள், நகர்ப்புற வாழ்க்கை ஆகியவற்றுக்கு இடையிலான நீண்டகாலத் தொடர்பை மதுரை எடுத்துக்காட்டுகிறது.',
      },
    },
  },
  {
    id: 'poompuhar',
    en: 'Poompuhar',
    ta: 'பூம்புகார்',
    glyph: 'பூம்புகார்',
    accent: '#1f5a6a',
    images: [
      { file: '1 then - artistic reconstruction.jpeg', kind: 'reconstruction', en: 'The port city as literature imagines it', ta: 'இலக்கியம் காட்டும் துறைமுக நகரம்', note: 'A modern artist’s imagining of a busy harbour of ships, markets and towers, after the descriptions in Silappathikaram and Pattinappalai. It is not evidence of how the city actually looked.', noteTa: 'சிலப்பதிகாரம், பட்டினப்பாலை ஆகியவற்றின் வருணனைகளைத் தழுவி, கப்பல்கள், அங்காடிகள், மாடங்கள் நிறைந்த ஆரவாரமான துறைமுகத்தை ஓர் இக்காலக் கலைஞர் கற்பனை செய்த ஓவியம். நகரம் உண்மையில் எவ்வாறு இருந்தது என்பதற்கு இது சான்று அன்று.' },
      { file: '2 then - sketch reconstruction.jpeg', kind: 'reconstruction', en: 'Ships at the harbour — a sketch', ta: 'துறைமுகத்தில் கப்பல்கள் — கோட்டோவியம்', note: 'A modern sketch imagining ships and buildings at the ancient port. Like every reconstruction of Puhar, it interprets literary descriptions; the full layout of the port is not known.', noteTa: 'பண்டைய துறைமுகத்தில் கப்பல்களையும் கட்டடங்களையும் கற்பனை செய்யும் இக்காலக் கோட்டோவியம். புகாரின் ஒவ்வொரு மீட்டுருவாக்கத்தையும் போலவே இதுவும் இலக்கிய வருணனைகளுக்கு அளிக்கப்பட்ட விளக்கமே; துறைமுகத்தின் முழு அமைப்பு அறியப்படவில்லை.' },
      { file: '3 now - the coast today.jpeg', kind: 'now', en: 'The Poompuhar coast today', ta: 'இன்றைய பூம்புகார்க் கடற்கரை', note: 'The shore at Poompuhar in Mayiladuthurai district, where coastal change and erosion have reshaped the landscape of the ancient port.', noteTa: 'மயிலாடுதுறை மாவட்டத்தில் உள்ள பூம்புகார்க் கடற்கரை; கடற்கரை மாற்றங்களும் கடல் அரிப்பும் பண்டைய துறைமுகத்தின் நிலத்தோற்றத்தை மாற்றியமைத்துள்ளன.' },
    ],
    compare: { then: '1 then - artistic reconstruction.jpeg', now: '3 now - the coast today.jpeg' },
    sections: {
      then: {
        en: 'Poompuhar, also known as Kaveripoompattinam, was an important ancient port associated with the Chola kingdom. Its location near the mouth of the River Kaveri made it suitable for maritime trade. Tamil literary works, especially Silappathikaram and Pattinappalai, describe the city’s merchants, bustling streets, ships, markets and prosperous commercial life. These descriptions reveal the importance of seafaring, commerce and cultural exchange in ancient Tamil society. Archaeological investigations have also explored evidence connected with the region’s maritime past.',
        ta: 'காவிரிப்பூம்பட்டினம் என்றும் அழைக்கப்படும் பூம்புகார், சோழர்களுடன் தொடர்புடைய முக்கியமான பண்டைய துறைமுக நகரமாக விளங்கியது. காவிரி ஆற்றின் முகத்துவாரத்திற்கு அருகில் அமைந்திருந்ததால், கடல்வழி வணிகத்திற்கு ஏற்ற இடமாக இது திகழ்ந்தது. குறிப்பாக, சிலப்பதிகாரம் மற்றும் பட்டினப்பாலை போன்ற தமிழ் இலக்கியங்கள் இந்நகரின் வணிகர்கள், பரபரப்பான வீதிகள், கப்பல்கள், சந்தைகள், செழிப்பான வணிக வாழ்க்கை ஆகியவற்றை விவரிக்கின்றன. இவ்விளக்கங்கள் பண்டைய தமிழ்ச் சமூகத்தில் கடல்வழிப் பயணம், வணிகம், பண்பாட்டுப் பரிமாற்றம் ஆகியவை பெற்றிருந்த முக்கியத்துவத்தை வெளிப்படுத்துகின்றன. இப்பகுதியின் கடல்சார் வரலாற்றுடன் தொடர்புடைய சான்றுகளைக் கண்டறியத் தொல்லியல் ஆய்வுகளும் மேற்கொள்ளப்பட்டுள்ளன.',
      },
      now: {
        en: 'Modern Poompuhar is a coastal settlement in Mayiladuthurai district, Tamil Nadu. The coastline, local communities, cultural institutions and archaeological investigations preserve its connection with ancient Tamil maritime history. Coastal changes and erosion have affected the landscape, and the full layout of the ancient port city is not known with certainty.',
        ta: 'இன்றைய பூம்புகார், தமிழ்நாட்டின் மயிலாடுதுறை மாவட்டத்தில் அமைந்துள்ள கடலோரக் குடியிருப்பாகும். இப்பகுதியின் கடற்கரை, உள்ளூர் மக்களின் வாழ்க்கை, பண்பாட்டு நிறுவனங்கள், தொல்லியல் ஆய்வுகள் ஆகியவை பண்டைய தமிழர்களின் கடல்சார் வரலாற்றுடனான அதன் தொடர்பை எடுத்துக்காட்டுகின்றன. கடற்கரை அரிப்பு உள்ளிட்ட இயற்கை மாற்றங்கள் இப்பகுதியின் நிலத்தோற்றத்தைப் பாதித்துள்ளன. பண்டைய துறைமுக நகரத்தின் முழுமையான அமைப்பு எவ்வாறு இருந்தது என்பது இன்னும் உறுதியாகத் தெரியவில்லை.',
      },
      survives: {
        en: 'The region’s archaeological evidence, literary references, coastal landscape and cultural displays help visitors understand its historical importance.',
        ta: 'இப்பகுதியில் கிடைத்துள்ள தொல்லியல் சான்றுகள், இலக்கியக் குறிப்புகள், கடலோர நிலப்பரப்பு, பண்பாட்டு விளக்கக் காட்சிகள் ஆகியவை பூம்புகாரின் வரலாற்று முக்கியத்துவத்தைப் புரிந்துகொள்ள உதவுகின்றன.',
      },
      significance: {
        en: 'Poompuhar illustrates the maritime connections, commercial prosperity and literary imagination of the ancient Tamil world.',
        ta: 'பண்டைய தமிழர்களின் கடல்சார் தொடர்புகள், வணிகச் செழிப்பு, இலக்கியக் கற்பனை ஆகியவற்றைப் பூம்புகார் எடுத்துக்காட்டுகிறது.',
      },
    },
  },
  {
    id: 'keezhadi',
    en: 'Keezhadi',
    ta: 'கீழடி',
    glyph: 'கீழடி',
    accent: '#8a4a1e',
    images: [
      { file: '1 excavated structures.jpeg', kind: 'evidence', en: 'Excavated brick structures', ta: 'அகழ்ந்தெடுக்கப்பட்ட செங்கல் கட்டுமானங்கள்', note: 'Excavation trenches laying bare the brick structures of the ancient settlement — the site’s most direct evidence of how it was built.', noteTa: 'பண்டைய குடியிருப்பின் செங்கல் கட்டுமானங்களை வெளிப்படுத்தும் அகழாய்வுக் குழிகள் — அது எவ்வாறு கட்டப்பட்டது என்பதற்கு இத்தளம் தரும் மிக நேரடியான சான்று.' },
      { file: '2 now - urns in the site museum.jpeg', kind: 'now', en: 'Urns in the site museum', ta: 'அருங்காட்சியகத்தில் தாழிகள்', note: 'Pottery recovered from the excavations, now displayed in the museum at Keezhadi.', noteTa: 'அகழாய்வுகளில் கிடைத்த மட்பாண்டங்கள், இப்போது கீழடி அருங்காட்சியகத்தில் காட்சிக்கு வைக்கப்பட்டுள்ளன.' },
      { file: '3 now - beads in the site museum.jpeg', kind: 'now', en: 'Beads and figurines in the site museum', ta: 'அருங்காட்சியகத்தில் மணிகளும் உருவங்களும்', note: 'Bead ornaments and terracotta figures from the excavations, displayed in the museum.', noteTa: 'அகழாய்வுகளில் கிடைத்த மணி அணிகலன்களும் சுடுமண் உருவங்களும், அருங்காட்சியகத்தில் காட்சிக்கு வைக்கப்பட்டுள்ளன.' },
    ],
    compare: { then: '1 excavated structures.jpeg', now: '2 now - urns in the site museum.jpeg' },
    sections: {
      then: {
        en: 'Keezhadi is an important archaeological site near the Vaigai River in Sivaganga district. Excavations have uncovered structural remains, pottery, artefacts and other evidence of an organised settlement. These discoveries contribute to the study of urbanisation, material culture and everyday life in the ancient Tamil region. The archaeological findings are especially valuable because they provide material evidence that can be studied alongside Tamil literary traditions. However, the precise identities, social organisation and full history of the people who lived there must be interpreted from the available evidence.',
        ta: 'சிவகங்கை மாவட்டத்தில் வைகை ஆற்றுக்கு அருகில் அமைந்துள்ள கீழடி, முக்கியமான தொல்லியல் ஆய்வுத் தளமாகும். இங்கு மேற்கொள்ளப்பட்ட அகழாய்வுகளில் கட்டட அமைப்புகளின் எச்சங்கள், மட்பாண்டங்கள், பல்வேறு தொல்பொருட்கள் மற்றும் ஒழுங்கமைக்கப்பட்ட குடியிருப்பைக் குறிக்கும் பிற சான்றுகள் கண்டறியப்பட்டுள்ளன. இக்கண்டுபிடிப்புகள் பண்டைய தமிழ்ப் பகுதியில் நகரமயமாக்கல், பொருள்சார் பண்பாடு, அன்றாட வாழ்க்கை ஆகியவற்றை ஆராய உதவுகின்றன. தமிழ் இலக்கிய மரபுகளுடன் ஒப்பிட்டு ஆய்வு செய்யக்கூடிய பொருள்சார் சான்றுகளை வழங்குவதால் கீழடி அகழாய்வுகள் சிறப்புப் பெறுகின்றன. இருப்பினும், அங்கு வாழ்ந்த மக்களின் துல்லியமான அடையாளம், சமூக அமைப்பு, முழுமையான வரலாறு ஆகியவை கிடைத்துள்ள சான்றுகளின் அடிப்படையிலேயே விளக்கப்பட வேண்டும்.',
      },
      now: {
        en: 'Today, Keezhadi is recognised as an important archaeological destination. Excavation areas, museums and displays of recovered objects help visitors learn about the region’s ancient settlement history. Archaeologists continue to study the evidence to understand the site’s chronology and cultural connections.',
        ta: 'இன்று கீழடி முக்கியமான தொல்லியல் சுற்றுலாத் தலமாக அறியப்படுகிறது. அகழாய்வுப் பகுதிகள், அருங்காட்சியகம், கண்டெடுக்கப்பட்ட பொருட்களின் காட்சிகள் ஆகியவை இப்பகுதியின் பண்டைய குடியிருப்பு வரலாற்றைப் பார்வையாளர்கள் அறிந்துகொள்ள உதவுகின்றன. இத்தளத்தின் காலக்கணிப்பு மற்றும் பண்பாட்டுத் தொடர்புகளைப் புரிந்துகொள்வதற்காகத் தொல்லியலாளர்கள் தொடர்ந்து ஆய்வு செய்து வருகின்றனர்.',
      },
      survives: {
        en: 'Excavated structural remains, pottery, artefacts and museum collections preserve evidence of the settlement’s material culture.',
        ta: 'அகழாய்வுகளில் கண்டறியப்பட்ட கட்டட எச்சங்கள், மட்பாண்டங்கள், தொல்பொருட்கள், அருங்காட்சியகத் தொகுப்புகள் ஆகியவை அக்கால மக்களின் பொருள்சார் பண்பாட்டிற்கான சான்றுகளாகத் திகழ்கின்றன.',
      },
      significance: {
        en: 'Keezhadi demonstrates how archaeology can deepen our understanding of ancient Tamil society beyond what literary texts alone can tell us.',
        ta: 'இலக்கிய நூல்கள் மட்டுமே வழங்கும் தகவல்களுக்கு அப்பால், தொல்லியல் ஆய்வுகள் மூலம் பண்டைய தமிழ்ச் சமூகத்தை ஆழமாகப் புரிந்துகொள்ள முடியும் என்பதைக் கீழடி எடுத்துக்காட்டுகிறது.',
      },
    },
  },
  {
    id: 'thanjavur',
    en: 'Thanjavur',
    ta: 'தஞ்சாவூர்',
    glyph: 'தஞ்சை',
    accent: '#8a2a1e',
    images: [
      { file: '1 then - early painting.jpeg', kind: 'then', en: 'The Brihadisvara Temple in an early painting', ta: 'பழைய ஓவியத்தில் பெருவுடையார் கோயில்', note: 'An early painted view of the great temple and its vimana rising over the plain. The artist and date are not recorded with the image.', noteTa: 'சமவெளிக்கு மேல் உயர்ந்து நிற்கும் பெருங்கோயிலையும் அதன் விமானத்தையும் காட்டும் பழைய ஓவியம். கலைஞரின் பெயரும் காலமும் படத்துடன் பதிவு செய்யப்படவில்லை.' },
      { file: '2 line drawing.jpeg', kind: 'then', en: 'The temple in a line drawing', ta: 'கோட்டோவியத்தில் கோயில்', note: 'A line drawing of the vimana and a pillared hall of the Brihadisvara Temple.', noteTa: 'பெருவுடையார் கோயிலின் விமானத்தையும் ஒரு தூண் மண்டபத்தையும் காட்டும் கோட்டோவியம்.' },
      { file: '3 now - temple and fort from the air.jpeg', kind: 'now', en: 'The temple and its fort walls today', ta: 'இன்றைய கோயிலும் கோட்டைச் சுவர்களும்', note: 'The Brihadisvara Temple from the air: the vimana, the two gateway towers, and the fort walls and moat that enclose it.', noteTa: 'வானிலிருந்து பெருவுடையார் கோயில்: விமானம், இரு வாயில் கோபுரங்கள், கோயிலைச் சூழ்ந்த கோட்டைச் சுவர்களும் அகழியும்.' },
      { file: '4 now - temple complex from the air.jpeg', kind: 'now', en: 'The temple complex in the modern city', ta: 'நவீன நகரில் கோயில் வளாகம்', note: 'The temple complex from above, within the modern city of Thanjavur.', noteTa: 'இன்றைய தஞ்சாவூர் நகரின் நடுவே, மேலிருந்து காணும் கோயில் வளாகம்.' },
    ],
    compare: { then: '1 then - early painting.jpeg', now: '3 now - temple and fort from the air.jpeg' },
    sections: {
      then: {
        en: 'Thanjavur became a major centre of power during the Chola period. Under Rajaraja Chola I, the city witnessed the construction of the magnificent Brihadisvara Temple, completed in the early eleventh century. The temple reflects the Cholas’ achievements in architecture, engineering, sculpture, religious patronage and administration. Inscriptions on the temple walls provide valuable information about donations, temple management, personnel and economic activities. Thanjavur also developed a lasting association with classical arts and Tamil cultural traditions.',
        ta: 'சோழர் காலத்தில் தஞ்சாவூர் முக்கியமான அரசியல் மற்றும் அதிகார மையமாக விளங்கியது. முதலாம் இராஜராஜ சோழனின் ஆட்சிக்காலத்தில் இங்கு பிரம்மாண்டமான பெருவுடையார் கோயில் கட்டப்பட்டது. இக்கோயில் கி.பி. 11ஆம் நூற்றாண்டின் தொடக்கத்தில் நிறைவுபெற்றது. கட்டடக்கலை, பொறியியல் நுட்பம், சிற்பக்கலை, சமய ஆதரவு, நிர்வாகம் ஆகிய துறைகளில் சோழர்கள் அடைந்திருந்த உயர்ந்த நிலையை இக்கோயில் வெளிப்படுத்துகிறது. கோயில் சுவர்களில் உள்ள கல்வெட்டுகள் நன்கொடைகள், கோயில் நிர்வாகம், பணியாளர்கள், பொருளாதார நடவடிக்கைகள் போன்றவற்றைப் பற்றிய மதிப்புமிக்க தகவல்களை வழங்குகின்றன. செவ்வியல் கலைகள் மற்றும் தமிழ்ப் பண்பாட்டு மரபுகளுடனும் தஞ்சாவூர் நீண்டகாலத் தொடர்பைக் கொண்டுள்ளது.',
      },
      now: {
        en: 'Modern Thanjavur remains a major cultural destination in Tamil Nadu. The Brihadisvara Temple continues to attract worshippers, historians, architects and tourists. The city is also known for Thanjavur paintings, classical music, dance, bronze sculpture and traditional craftsmanship.',
        ta: 'இன்றும் தஞ்சாவூர் தமிழ்நாட்டின் முக்கியமான பண்பாட்டு மையங்களில் ஒன்றாக விளங்குகிறது. பெருவுடையார் கோயில் பக்தர்கள், வரலாற்று ஆய்வாளர்கள், கட்டடக்கலை வல்லுநர்கள், சுற்றுலாப் பயணிகள் ஆகியோரை ஈர்க்கிறது. தஞ்சாவூர் ஓவியங்கள், செவ்வியல் இசை, நடனம், வெண்கலச் சிற்பங்கள், பாரம்பரியக் கைவினைகள் ஆகியவற்றிற்காகவும் இந்நகரம் புகழ்பெற்றுள்ளது.',
      },
      survives: {
        en: 'The Brihadisvara Temple, inscriptions, sculptures, architectural features and continuing artistic traditions preserve important aspects of Thanjavur’s heritage.',
        ta: 'பெருவுடையார் கோயில், கல்வெட்டுகள், சிற்பங்கள், கட்டடக்கலை அம்சங்கள், தொடர்ந்து கடைப்பிடிக்கப்படும் கலை மரபுகள் ஆகியவை தஞ்சாவூரின் வரலாற்றுப் பாரம்பரியத்தைப் பாதுகாக்கின்றன.',
      },
      significance: {
        en: 'Thanjavur represents the artistic, architectural, administrative and cultural achievements of the Chola dynasty.',
        ta: 'சோழர் வம்சத்தின் கலை, கட்டடக்கலை, நிர்வாகம், பண்பாடு ஆகிய துறைகளில் நிகழ்ந்த சாதனைகளைத் தஞ்சாவூர் எடுத்துக்காட்டுகிறது.',
      },
    },
  },
  {
    id: 'mamallapuram',
    en: 'Mamallapuram',
    ta: 'மாமல்லபுரம்',
    glyph: 'மாமல்லை',
    accent: '#3a5a6a',
    images: [
      { file: '1 then - early painting.jpeg', kind: 'then', en: 'The Shore Temple in an early painting', ta: 'பழைய ஓவியத்தில் கடற்கரைக் கோயில்', note: 'An early painted view of the Shore Temple standing on its rocky shore. The artist and date are not recorded with the image.', noteTa: 'பாறைக் கடற்கரையில் நிற்கும் கடற்கரைக் கோயிலைக் காட்டும் பழைய ஓவியம். கலைஞரின் பெயரும் காலமும் படத்துடன் பதிவு செய்யப்படவில்லை.' },
      { file: '2 now - shore temple.jpeg', kind: 'now', en: 'The Shore Temple today', ta: 'இன்றைய கடற்கரைக் கோயில்', note: 'The Shore Temple on the Coromandel Coast, part of the Group of Monuments at Mahabalipuram, a UNESCO World Heritage Site.', noteTa: 'சோழமண்டலக் கடற்கரையில் உள்ள கடற்கரைக் கோயில்; யுனெஸ்கோ உலக மரபுச் சின்னமான மாமல்லபுரச் சின்னங்கள் தொகுதியின் ஒரு பகுதி.' },
      { file: '3 now - shore temple from the air.jpeg', kind: 'now', en: 'The Shore Temple from the air', ta: 'வானிலிருந்து கடற்கரைக் கோயில்', note: 'The Shore Temple and its grounds beside the sea, seen from above.', noteTa: 'கடலருகே அமைந்த கடற்கரைக் கோயிலும் அதன் வளாகமும், மேலிருந்து காணும் காட்சி.' },
    ],
    compare: { then: '1 then - early painting.jpeg', now: '2 now - shore temple.jpeg' },
    sections: {
      then: {
        en: 'Mamallapuram, also known as Mahabalipuram, developed as an important centre of Pallava art and architecture. The Pallava rulers supported the creation of rock-cut caves, monolithic monuments, sculptural panels and structural temples. Among its most celebrated monuments are the Five Rathas, the Shore Temple, and the great relief commonly known as Arjuna’s Penance or the Descent of the Ganges. These works demonstrate the skill of Pallava artisans and the development of distinctive architectural forms.',
        ta: 'மகாபலிபுரம் என்றும் அழைக்கப்படும் மாமல்லபுரம், பல்லவர்களின் கலை மற்றும் கட்டடக்கலை வளர்ச்சிக்கான முக்கிய மையமாக விளங்கியது. பல்லவ மன்னர்களின் ஆதரவுடன் குடைவரைக் கோயில்கள், ஒற்றைக்கல் நினைவுச் சின்னங்கள், சிற்பத் தொகுப்புகள், கட்டுமானக் கோயில்கள் ஆகியவை உருவாக்கப்பட்டன. இங்குள்ள புகழ்பெற்ற நினைவுச் சின்னங்களில் ஐந்து ரதங்கள், கடற்கரைக் கோயில், அர்ச்சுனன் தபசு அல்லது கங்கையின் இறக்கம் எனப் பொதுவாக அழைக்கப்படும் பிரம்மாண்டப் பாறைச் சிற்பத் தொகுப்பு ஆகியவை அடங்கும். இவை பல்லவக் காலச் சிற்பிகளின் திறமையையும் தனித்துவமான கட்டடக்கலை வடிவங்களின் வளர்ச்சியையும் வெளிப்படுத்துகின்றன.',
      },
      now: {
        en: 'Today, Mamallapuram is a major heritage destination on Tamil Nadu’s Coromandel Coast. Visitors can explore its ancient monuments, stone carvings, temples and coastal landscape. The Group of Monuments at Mahabalipuram is recognised as a UNESCO World Heritage Site.',
        ta: 'இன்று மாமல்லபுரம், தமிழ்நாட்டின் கொரமண்டல் கடற்கரையில் அமைந்துள்ள முக்கியமான பாரம்பரியச் சுற்றுலாத் தலமாகும். இங்கு பழமையான நினைவுச் சின்னங்கள், கற்சிற்பங்கள், கோயில்கள், கடற்கரை நிலப்பரப்பு ஆகியவற்றைப் பார்வையாளர்கள் கண்டு ரசிக்கலாம். மாமல்லபுரத்தின் நினைவுச் சின்னங்கள் அடங்கிய தொகுப்பு யுனெஸ்கோ உலகப் பாரம்பரியத் தளமாக அங்கீகரிக்கப்பட்டுள்ளது.',
      },
      survives: {
        en: 'The rock-cut caves, sculptural reliefs, monolithic rathas and structural temples provide direct evidence of Pallava artistic achievements.',
        ta: 'குடைவரைக் கோயில்கள், பாறைச் சிற்பத் தொகுப்புகள், ஒற்றைக்கல் ரதங்கள், கட்டுமானக் கோயில்கள் ஆகியவை பல்லவர்களின் கலைச் சாதனைகளுக்கு நேரடியான சான்றுகளாகத் திகழ்கின்றன.',
      },
      significance: {
        en: 'Mamallapuram showcases the creativity, craftsmanship and architectural innovation of the Pallava period.',
        ta: 'பல்லவர் காலத்தின் படைப்பாற்றல், கைவினைத் திறன், கட்டடக்கலைப் புதுமைகள் ஆகியவற்றை மாமல்லபுரம் வெளிப்படுத்துகிறது.',
      },
    },
  },
  {
    id: 'gangaikondacholapuram',
    en: 'Gangaikondacholapuram',
    ta: 'கங்கைகொண்ட சோழபுரம்',
    glyph: 'சோழபுரம்',
    accent: '#6a3a1e',
    images: [
      { file: 'Gangaikonda Chola puram Then.png', kind: 'then', en: 'Gangaikonda Cholapuram — then', ta: 'கங்கைகொண்ட சோழபுரம் — அன்று' },
      { file: '2 now - temple from the air.jpeg', kind: 'now', en: 'The temple from the air', ta: 'வானிலிருந்து கோயில்', note: 'The Gangaikondacholeeswaram Temple and its enclosure today, seen from the air.', noteTa: 'கங்கைகொண்டசோழீச்சுரம் கோயிலும் அதன் சுற்றுமதிலும் இன்று, வானிலிருந்து காணும் காட்சி.' },
      { file: '3 now - temple from above.jpeg', kind: 'now', en: 'The temple enclosure from directly above', ta: 'மேலிருந்து கோயில் வளாகம்', note: 'The temple enclosure seen from directly above: the vimana, the long mandapa, the shrines round the courtyard and the circular lion-faced well near the entrance.', noteTa: 'நேர் மேலிருந்து காணும் கோயில் வளாகம்: விமானம், நீண்ட மண்டபம், முற்றத்தைச் சுற்றிய சன்னதிகள், நுழைவாயில் அருகே உள்ள வட்டமான சிங்கமுகக் கிணறு.' },
    ],
    compare: { then: 'Gangaikonda Chola puram Then.png', now: '2 now - temple from the air.jpeg' },
    sections: {
      then: {
        en: 'Gangaikondacholapuram was established as a Chola imperial capital by Rajendra Chola I, the son of Rajaraja Chola I. The city commemorated Rajendra’s military achievements and the expansion of Chola influence. Its great temple, built in the eleventh century, reflects the architectural traditions developed during the Chola period. The capital once contained royal, religious and administrative structures, although much of the original urban landscape has not survived.',
        ta: 'முதலாம் இராஜராஜ சோழனின் மகனான முதலாம் இராஜேந்திர சோழனால் கங்கைகொண்ட சோழபுரம் சோழப் பேரரசின் தலைநகரமாக நிறுவப்பட்டது. இராஜேந்திர சோழனின் படை வெற்றிகளையும் சோழர்களின் அரசியல் செல்வாக்கு விரிவடைந்ததையும் நினைவுகூரும் வகையில் இந்நகரம் அமைக்கப்பட்டது. கி.பி. 11ஆம் நூற்றாண்டில் கட்டப்பட்ட இங்குள்ள பிரம்மாண்டமான கோயில், சோழர் காலக் கட்டடக்கலை மரபுகளைப் பிரதிபலிக்கிறது. அக்காலத்தில் இந்நகரில் அரச மாளிகைகள், சமயக் கட்டடங்கள், நிர்வாகக் கட்டமைப்புகள் ஆகியவை இருந்தன. இருப்பினும், அக்கால நகரின் பெரும்பாலான பகுதிகள் இன்று எஞ்சியிருக்கவில்லை.',
      },
      now: {
        en: 'Today, the principal surviving landmark is the Gangaikondacholeeswaram Temple. Its towering vimana, sculptures, stonework and architectural design make it one of the most important surviving monuments of Chola architecture. The temple forms part of the UNESCO-listed Great Living Chola Temples.',
        ta: 'இன்று இப்பகுதியின் முக்கியமான வரலாற்றுச் சின்னமாகக் கங்கைகொண்ட சோழீச்சரர் கோயில் விளங்குகிறது. அதன் உயர்ந்த விமானம், சிற்பங்கள், கற்செதுக்குகள், கட்டடக்கலை அமைப்பு ஆகியவை சோழர் கட்டடக்கலையின் சிறந்த எஞ்சியுள்ள படைப்புகளில் ஒன்றாக இதனைத் திகழச் செய்கின்றன. இக்கோயில் யுனெஸ்கோ அங்கீகரித்த “மாமரபுச் சின்னங்களாக விளங்கும் சோழர் கோயில்கள்” தொகுப்பில் இடம்பெற்றுள்ளது.',
      },
      survives: {
        en: 'The temple, sculptural details, inscriptions and archaeological remains preserve evidence of the site’s imperial and religious importance.',
        ta: 'கோயில், நுணுக்கமான சிற்பங்கள், கல்வெட்டுகள், தொல்லியல் எச்சங்கள் ஆகியவை இத்தளத்தின் பேரரசு மற்றும் சமய முக்கியத்துவத்திற்குச் சான்றுகளாக விளங்குகின்றன.',
      },
      significance: {
        en: 'Gangaikondacholapuram reflects the political ambition, religious patronage and architectural achievements of Rajendra Chola I.',
        ta: 'முதலாம் இராஜேந்திர சோழனின் அரசியல் தொலைநோக்கு, சமய ஆதரவு, கட்டடக்கலைச் சாதனைகள் ஆகியவற்றைக் கங்கைகொண்ட சோழபுரம் எடுத்துக்காட்டுகிறது.',
      },
    },
  },
  {
    id: 'kanchipuram',
    en: 'Kanchipuram',
    ta: 'காஞ்சிபுரம்',
    glyph: 'காஞ்சி',
    accent: '#7a1e4a',
    images: [
      { file: 'Kanchipuram Kamatchi Amman Kovil Then.png', kind: 'then', en: 'Kanchipuram Kamatchi Amman Kovil — then', ta: 'காஞ்சிபுரம் காமாட்சி அம்மன் கோயில் — அன்று' },
      { file: 'Kanchipuram Kamatchi Amman Kovil Now.png', kind: 'now', en: 'Kanchipuram Kamatchi Amman Kovil — now', ta: 'காஞ்சிபுரம் காமாட்சி அம்மன் கோயில் — இன்று' },
      { file: '2 now - kailasanatha temple.jpeg', kind: 'now', en: 'The Kailasanatha Temple today', ta: 'இன்றைய கைலாசநாதர் கோயில்', note: 'The Kailasanatha Temple, a Pallava-period stone temple, with the small shrines that line its enclosure.', noteTa: 'பல்லவர் காலக் கற்கோயிலான கைலாசநாதர் கோயில், அதன் சுற்றுமதிலை ஒட்டி வரிசையாக அமைந்த சிறு சன்னதிகளுடன்.' },
      { file: '3 now - temple gopuram.jpeg', kind: 'now', en: 'A temple gopuram over the street', ta: 'வீதியின் மேல் கோயில் கோபுரம்', note: 'One of Kanchipuram’s temple gateways rising over a busy street — the temple city as a living place of worship.', noteTa: 'நெரிசலான வீதியின் மேல் உயர்ந்து நிற்கும் காஞ்சிபுரக் கோயில் வாயில்களுள் ஒன்று — வழிபாடு தொடரும் உயிர்ப்புள்ள கோயில் நகரம்.' },
      { file: '4 pallava sculpted walls.jpeg', kind: 'evidence', en: 'Carved walls of a Pallava temple', ta: 'பல்லவக் கோயிலின் சிற்பச் சுவர்கள்', note: 'Weathered sculpture along the walls of a Pallava temple — part of what survives from the city’s early history.', noteTa: 'பல்லவக் கோயிலின் சுவர்களில் காலத்தால் தேய்ந்த சிற்பங்கள் — நகரின் தொடக்கக் கால வரலாற்றிலிருந்து எஞ்சியவற்றின் ஒரு பகுதி.' },
    ],
    compare: { then: 'Kanchipuram Kamatchi Amman Kovil Then.png', now: 'Kanchipuram Kamatchi Amman Kovil Now.png' },
    sections: {
      then: {
        en: 'Kanchipuram was an important historical city associated with the Pallavas and several later dynasties. It developed as a centre of temple architecture, religious learning, philosophy and cultural exchange. Pallava rulers contributed to the development of distinctive stone-temple architecture, while later dynasties added further temples and structures. The city’s historical importance is reflected in its religious traditions, inscriptions and architectural remains.',
        ta: 'பல்லவர்கள் மற்றும் அவர்களுக்குப் பிந்தைய பல்வேறு அரச வம்சங்களுடன் தொடர்புடைய முக்கியமான வரலாற்று நகரமாகக் காஞ்சிபுரம் விளங்கியது. கோயில் கட்டடக்கலை, சமயக் கல்வி, தத்துவம், பண்பாட்டுப் பரிமாற்றம் ஆகியவற்றின் மையமாக இந்நகரம் வளர்ச்சியடைந்தது. தனித்துவமான கற்கோயில் கட்டடக்கலை வளர்ச்சிக்குப் பல்லவ மன்னர்கள் பங்களித்தனர். பின்னர் ஆட்சி செய்த அரச வம்சங்களும் பல கோயில்களையும் கட்டடங்களையும் உருவாக்கின. சமய மரபுகள், கல்வெட்டுகள், கட்டடக்கலை எச்சங்கள் ஆகியவை காஞ்சிபுரத்தின் வரலாற்று முக்கியத்துவத்தை வெளிப்படுத்துகின்றன.',
      },
      now: {
        en: 'Modern Kanchipuram is widely known as a temple city and a major centre of silk weaving. Its historic temples continue to serve as places of worship, while traditional silk sarees connect the city with a long-standing craft heritage. Visitors can experience its religious architecture, local markets and living cultural practices.',
        ta: 'இன்றைய காஞ்சிபுரம் கோயில் நகரமாகவும், பட்டுப் புடவைகள் நெய்யப்படும் முக்கிய மையமாகவும் புகழ்பெற்றுள்ளது. இங்குள்ள வரலாற்றுச் சிறப்புமிக்க கோயில்கள் தொடர்ந்து வழிபாட்டுத் தலங்களாகச் செயல்படுகின்றன. பாரம்பரியப் பட்டுப் புடவை நெசவு, இந்நகரின் நீண்டகாலக் கைவினை மரபை இன்றும் உயிர்ப்புடன் வைத்திருக்கிறது. பார்வையாளர்கள் இங்குள்ள சமயக் கட்டடக்கலை, உள்ளூர்ச் சந்தைகள், வாழும் பண்பாட்டு மரபுகள் ஆகியவற்றை அறிந்துகொள்ளலாம்.',
      },
      survives: {
        en: 'Historic temples, inscriptions, architectural remains, silk-weaving traditions and continuing religious practices preserve Kanchipuram’s heritage.',
        ta: 'பழமையான கோயில்கள், கல்வெட்டுகள், கட்டடக்கலை எச்சங்கள், பட்டுநெசவு மரபுகள், தொடர்ந்து கடைப்பிடிக்கப்படும் சமய நடைமுறைகள் ஆகியவை காஞ்சிபுரத்தின் பாரம்பரியத்தைப் பாதுகாக்கின்றன.',
      },
      significance: {
        en: 'Kanchipuram illustrates the continuity of Tamil religious life, temple architecture, learning and traditional craftsmanship.',
        ta: 'தமிழர்களின் சமய வாழ்க்கை, கோயில் கட்டடக்கலை, கல்வி, பாரம்பரியக் கைவினைகள் ஆகியவற்றின் தொடர்ச்சியைக் காஞ்சிபுரம் எடுத்துக்காட்டுகிறது.',
      },
    },
  },
  {
    id: 'thirumalai-nayak-palace',
    en: 'Thirumalai Nayak Palace',
    ta: 'திருமலை நாயக்கர் அரண்மனை',
    glyph: 'அரண்மனை',
    accent: '#8a5a1e',
    images: [
      { file: '1 then - early engraving.jpeg', kind: 'then', en: 'The palace hall in an early engraving', ta: 'பழைய செதுக்கோவியத்தில் அரண்மனை மண்டபம்', note: 'An early engraved view of a great pillared hall of the palace. The artist and date are not recorded with the image.', noteTa: 'அரண்மனையின் பெரிய தூண் மண்டபம் ஒன்றைக் காட்டும் பழைய செதுக்கோவியம். கலைஞரின் பெயரும் காலமும் படத்துடன் பதிவு செய்யப்படவில்லை.' },
      { file: '2 now - courtyard arches.jpeg', kind: 'now', en: 'The courtyard arches today', ta: 'இன்றைய முற்ற வளைவுகள்', note: 'The great courtyard seen through the palace’s massive columns and arches.', noteTa: 'அரண்மனையின் பருத்த தூண்கள், வளைவுகள் வழியே காணும் பெரிய முற்றம்.' },
      { file: '3 now - pillared hall.jpeg', kind: 'now', en: 'A pillared hall today', ta: 'இன்றைய தூண் மண்டபம்', note: 'One of the surviving halls, with its arcades of tall columns.', noteTa: 'உயர்ந்த தூண்களின் வரிசைகளைக் கொண்ட, இன்றும் எஞ்சியுள்ள மண்டபங்களுள் ஒன்று.' },
    ],
    compare: { then: '1 then - early engraving.jpeg', now: '3 now - pillared hall.jpeg' },
    sections: {
      then: {
        en: 'Thirumalai Nayak Palace was constructed in the seventeenth century during the reign of King Thirumalai Nayak of the Madurai Nayak dynasty. The palace served as a royal residence and a centre of courtly life. Its architecture combined imposing pillars, spacious halls, decorative features and influences associated with the Nayak period. Historical accounts suggest that the original palace complex was larger than the portions that survive today.',
        ta: 'மதுரை நாயக்கர் வம்சத்தைச் சேர்ந்த திருமலை நாயக்க மன்னரின் ஆட்சிக்காலத்தில், கி.பி. 17ஆம் நூற்றாண்டில் திருமலை நாயக்கர் அரண்மனை கட்டப்பட்டது. இது மன்னரின் அரச வசிப்பிடமாகவும் அரசவையின் முக்கிய மையமாகவும் விளங்கியது. பிரம்மாண்டமான தூண்கள், விசாலமான மண்டபங்கள், அலங்கார அம்சங்கள் ஆகியவற்றைக் கொண்ட இவ்வரண்மனையின் கட்டடக்கலையில் நாயக்கர் காலத்தின் கலை மரபுகளின் தாக்கம் காணப்படுகிறது. வரலாற்றுக் குறிப்புகளின்படி, அசல் அரண்மனை வளாகம் இன்று எஞ்சியுள்ள பகுதிகளைவிடப் பெரியதாக இருந்திருக்கலாம்.',
      },
      now: {
        en: 'Today, the palace is a prominent heritage attraction in Madurai. Visitors can admire its monumental columns, grand courtyard, arches and remaining architectural features. The site provides an opportunity to learn about Nayak-era royal life and the artistic traditions of early modern Tamil Nadu.',
        ta: 'இன்று திருமலை நாயக்கர் அரண்மனை மதுரையின் முக்கியமான வரலாற்றுச் சுற்றுலாத் தலங்களில் ஒன்றாக விளங்குகிறது. அதன் பிரம்மாண்டமான தூண்கள், விசாலமான முற்றம், வளைவுகள், எஞ்சியுள்ள கட்டடக்கலை அம்சங்கள் ஆகியவற்றைப் பார்வையாளர்கள் கண்டு ரசிக்கலாம். நாயக்கர் கால அரச வாழ்க்கை மற்றும் அக்காலத் தமிழ்நாட்டின் கலை மரபுகளை அறிந்துகொள்ள இவ்விடம் வாய்ப்பளிக்கிறது.',
      },
      survives: {
        en: 'The surviving halls, pillars, arches and courtyard preserve important examples of Nayak architecture, although the entire original complex no longer exists.',
        ta: 'எஞ்சியுள்ள மண்டபங்கள், தூண்கள், வளைவுகள், முற்றம் ஆகியவை நாயக்கர் காலக் கட்டடக்கலைக்குச் சிறந்த எடுத்துக்காட்டுகளாக உள்ளன. இருப்பினும், அசல் அரண்மனை வளாகம் முழுமையாக இன்று நிலைத்திருக்கவில்லை.',
      },
      significance: {
        en: 'Thirumalai Nayak Palace represents the architectural splendour, royal culture and political history of the Madurai Nayak period.',
        ta: 'மதுரை நாயக்கர் காலத்தின் கட்டடக்கலைச் சிறப்பு, அரசப் பண்பாடு, அரசியல் வரலாறு ஆகியவற்றைத் திருமலை நாயக்கர் அரண்மனை எடுத்துக்காட்டுகிறது.',
      },
    },
  },
];

export const getPlace = (id) => THEN_NOW_PLACES.find((place) => place.id === id) ?? null;
/** A place's folder in the public folder, as the artefact manifest names it. */
export const placeFolder = (place) => `${PLACES_FOLDER}/${place.id}`;
/** The address of one of a place's pictures. */
export const placeImageUrl = (place, file) => mediaUrl(`/${placeFolder(place)}/${file}`);
/** The room in the Then vs Now hall that shows a place. */
export const placeRoomId = (place) => `then-now-${place.id}`;

/**
 * The pictures' captions for the closer view, in the shape of ARTIFACT_TEXTS (by folder, then
 * file name without its extension): what each shows, and whether it is a reconstruction.
 */
export const PLACE_IMAGE_TEXTS = Object.fromEntries(THEN_NOW_PLACES.map((place) => [
  placeFolder(place),
  Object.fromEntries(place.images.map((image) => [image.file.replace(/\.[^.]+$/, ''), {
    title: image.en,
    ta: image.ta,
    detail: KIND_LABELS[image.kind].en,
    en: image.note,
    taText: image.noteTa,
  }])),
]));
