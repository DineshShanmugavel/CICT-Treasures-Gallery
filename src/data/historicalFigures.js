/**
 * The Historical Figures hall: the Seven Great Patrons, the poets and thinkers, and the kings
 * and queens of the Tamil land, in portraits from the public folder:
 * - public/Tamil 7 GREAT PATRONS (one portrait per patron, with the curators' notes as PDFs)
 * - public/Tamizh Poets n Thinkers/Pics of poets and thinkers (and the notes beside the folder)
 * - public/Tamizh KINGS n QUEENS/<name>/ (a portrait and notes in English and Tamil each)
 *
 * FIGURE_TEXTS captions each portrait in the shape of ARTIFACT_TEXTS (folder, then file name
 * without its extension); FIGURE_PANELS are the rooms' palm-leaf panels (ROOM_PANELS). The
 * texts summarise the curators' notes, which separate what early literature and inscriptions
 * record from later tradition — the captions keep that distinction.
 */

export const PATRONS_FOLDER = 'Tamil 7 GREAT PATRONS';
export const POETS_FOLDER = 'Tamizh Poets n Thinkers/Pics of poets and thinkers';
export const KINGS_FOLDER = 'Tamizh KINGS n QUEENS';

/** The patrons in the order of the curators' notes. */
export const PATRON_ORDER = ['Vel Pari', 'Pegan', 'Malaiyaman Thirumudi Kari', 'Ay Andiran', 'Adhiyaman Neduman Anji', 'Nalli', 'Valvil Ori'];
export const POET_ORDER = ['Tholkappiyar', 'Thiruvalluvar', 'Avvaiyar', 'Kapilar', 'Kaniyan Pungundranar', 'Nakkirar', 'Ilango Adigal', 'Thirunavukkarasar (Appar)'];
/** Rulers and heroines broadly in the order of their age: the Sangam age, the epic, then the medieval Cholas. */
export const KINGS_ORDER = ['Vel Pari', 'Karikala Cholan', 'Kannagi', 'Sembiyan Mahadevi', 'Rajaraja Chola I', 'Rajendra Chola I'];

const PARI = {
  title: 'Vel Pari',
  ta: 'வேள் பாரி',
  detail: 'Chieftain of Parambu Nadu · Sangam age',
  en: 'The most celebrated of the Seven Great Patrons. Tamil tradition remembers him giving his own chariot to a jasmine (mullai) creeper that had nothing to climb — generosity reaching beyond people to the natural world. His friendship with the poet Kapilar, his defence of Parambu Nadu against the three crowned kings, and the lament of his daughters Angavai and Sangavai (Purananuru 112) are preserved in Sangam poetry; the chariot story is best read as literary tradition.',
  taText: 'கடையெழு வள்ளல்களுள் மிகப் புகழ்பெற்றவர். படர்வதற்குக் கொழுகொம்பு இல்லாத முல்லைக் கொடிக்குத் தம் தேரையே ஈந்தார் எனத் தமிழ் மரபு போற்றுகிறது — மனிதரைக் கடந்து இயற்கை வரை நீண்ட கொடை அது. புலவர் கபிலருடனான நட்பும், மூவேந்தருக்கு எதிராகப் பறம்பு நாட்டைக் காத்ததும், அவர் மகளிர் அங்கவை, சங்கவை ஆகியோரின் கையறுநிலைப் பாடலும் (புறநானூறு 112) சங்கப் பாடல்களில் பதிவாகியுள்ளன; தேர் ஈந்த கதையை இலக்கிய மரபாகக் கொள்வதே பொருத்தம்.',
};

export const FIGURE_TEXTS = {
  [PATRONS_FOLDER]: {
    'VEL PARI': PARI,
    PEGAN: {
      title: 'Pegan',
      ta: 'பேகன்',
      detail: 'One of the Seven Great Patrons',
      en: 'Also called Perumpekan. Seeing a peacock in the cold, he wrapped it in his own precious shawl — the act of kodai madam, generosity so abundant that the giver does not weigh the gift. His fame rests on tenderness rather than conquest.',
      taText: 'பெரும்பேகன் எனவும் அழைக்கப்படுபவர். குளிரில் நின்ற மயிலுக்குத் தம் விலைமதிப்புள்ள போர்வையை அளித்தார் — கொடுப்பதன் பயனைக் கணக்கிடாத கொடைமடம் இதுவே. போர் வெற்றிகளால் அன்றி, இரக்கத்தால் புகழ் பெற்றவர் பேகன்.',
    },
    'MALAIYAMAN THIRUMUDI KARI': {
      title: 'Malaiyaman Thirumudi Kari',
      ta: 'மலையமான் திருமுடிக் காரி',
      detail: 'Chieftain of the Malaiyaman line · Mullur and Tirukkoyilur',
      en: 'A chieftain of the Malaiyaman lineage, of the country round Mullur and Tirukkoyilur, remembered for his munificence to poets and to all who came to him. His place among the seven patrons shows that a ruler’s honour was measured by his giving as much as by his territory.',
      taText: 'முள்ளூர், திருக்கோயிலூர்ப் பகுதியை ஆண்ட மலையமான் மரபுச் சிற்றரசர். புலவர்களுக்கும் நாடி வந்தோர்க்கும் வழங்கிய கொடையால் நினைவுகூரப்படுபவர். ஆட்சிப் பரப்பைப் போலவே கொடையும் அரசனின் பெருமைக்கு அளவுகோல் என்பதை அவர் வரலாறு காட்டுகிறது.',
    },
    'AY ANDIRAN': {
      title: 'Ay Andiran',
      ta: 'ஆய் அண்டிரன்',
      detail: 'Chieftain of the Ay line · the Podiyil hills',
      en: 'A chieftain of the Ay line in the southern hill country of the Podiyil (Pothigai). A well-known tradition tells of his offering a precious garment to a deity, commonly identified as Shiva — giving as devotion as well as generosity.',
      taText: 'தென்பகுதியின் பொதியில் மலைநாட்டை ஆண்ட ஆய் மரபுச் சிற்றரசர். அரிய ஆடையை இறைவனுக்கு (பொதுவாகச் சிவபெருமான் எனக் கொள்ளப்படுகிறது) அளித்தார் என்பது புகழ்பெற்ற மரபுக் கதை — பக்தியும் கொடையும் இணைந்த ஈகை.',
    },
    'ADHIYAMAN NEDUMAN ANJI': {
      title: 'Adhiyaman Neduman Anji',
      ta: 'அதியமான் நெடுமான் அஞ்சி',
      detail: 'Chieftain of Tagadur (around Dharmapuri)',
      en: 'Ruler of Tagadur, around present-day Dharmapuri. Given a rare nelli (gooseberry) fruit believed to prolong life, he gave it to the poet Avvaiyar rather than eat it himself — placing the life of a poet, and the knowledge she carried, above his own.',
      taText: 'இன்றைய தருமபுரிப் பகுதியான தகடூரை ஆண்டவர். நீண்ட வாழ்நாள் தரும் என நம்பப்பட்ட அரிய நெல்லிக்கனியைத் தாம் உண்ணாமல் ஔவையாருக்கு ஈந்தார் — தம் நலனைவிடப் புலவரின் வாழ்வையும் அறிவையும் உயர்வாகக் கருதிய செயல் அது.',
    },
    NALLI: {
      title: 'Nalli',
      ta: 'நள்ளி',
      detail: 'One of the Seven Great Patrons',
      en: 'Remembered for open-handed charity and hospitality: a patron who never let the wish to gather wealth overcome the duty to give. Later accounts add that he helped people without seeking recognition — the ideal of kodai, giving, at its plainest.',
      taText: 'வரையாது வழங்கிய கொடைக்கும் விருந்தோம்பலுக்கும் நினைவுகூரப்படுபவர்; செல்வம் சேர்க்கும் ஆசை ஈகைக் கடமையை வெல்ல விடாதவர். புகழை நாடாமல் பிறருக்கு உதவினார் எனப் பிற்கால மரபுகள் கூறுகின்றன.',
    },
    'VALVIL ORI': {
      title: 'Valvil Ori',
      ta: 'வல்வில் ஓரி',
      detail: 'Chieftain of the Kolli Hills',
      en: 'Lord of the Kolli Hills, named Valvil for his formidable bow. Tamil memory celebrates both his archery and his generosity: the ideal chieftain was not only strong, but used his strength and wealth for others.',
      taText: 'கொல்லிமலைத் தலைவர்; வலிய வில்லாற்றலால் ‘வல்வில்’ எனப் பெயர் பெற்றவர். வில்திறனையும் கொடைத்திறனையும் ஒருங்கே தமிழ் மரபு போற்றுகிறது — வலிமையும் செல்வமும் பிறர்க்குப் பயன்படுவதே சிறந்த தலைமை.',
    },
  },
  [POETS_FOLDER]: {
    Thiruvalluvar: {
      title: 'Thiruvalluvar',
      ta: 'திருவள்ளுவர்',
      detail: 'Author of the Thirukkural',
      en: 'Author of the Thirukkural: 1,330 couplets in 133 chapters on Aram (virtue), Porul (wealth and public life) and Inbam (love). His date and life are debated and little is known for certain, but the Kural’s universal ethics — truthfulness, compassion, justice, learning — have shaped Tamil education and been translated across the world.',
      taText: 'திருக்குறளின் ஆசிரியர்: அறம், பொருள், இன்பம் என்னும் முப்பால்களில் 133 அதிகாரங்கள், 1330 குறட்பாக்கள். அவர் காலமும் வாழ்க்கையும் விவாதத்திற்குரியவை; உறுதியாக அறியப்படுவது குறைவு. ஆனால் வாய்மை, அருள், நீதி, கல்வி என உலகப் பொதுவான அறங்களைக் கூறும் குறள் தமிழ்க் கல்வியை வடிவமைத்து, உலக மொழிகள் பலவற்றில் மொழிபெயர்க்கப்பட்டுள்ளது.',
    },
    avvaiyar: {
      title: 'Avvaiyar',
      ta: 'ஔவையார்',
      detail: 'Woman poet · Sangam age and later',
      en: 'The name seems to have been borne by more than one woman poet. The Sangam Avvaiyar’s poems in Purananuru, Akananuru, Kurunthogai and Natrinai speak of kings, generosity and mortality; she was a trusted adviser to Adhiyaman. The children’s classics Aathichudi, Kondrai Vendhan and Nalvazhi belong to a later Avvaiyar.',
      taText: 'இப்பெயரைக் கொண்ட பெண்பாற் புலவர் ஒருவருக்கு மேற்பட்டோர் இருந்திருக்கலாம். புறநானூறு, அகநானூறு, குறுந்தொகை, நற்றிணை ஆகியவற்றில் உள்ள சங்க ஔவையாரின் பாடல்கள் மன்னர், கொடை, நிலையாமை பற்றிப் பேசுகின்றன; அதியமானின் நம்பிக்கைக்குரிய ஆலோசகராகவும் விளங்கினார். ஆத்திசூடி, கொன்றை வேந்தன், நல்வழி ஆகியவை பிற்கால ஔவையாருடையவை.',
    },
    kabilar: {
      title: 'Kapilar',
      ta: 'கபிலர்',
      detail: 'Sangam poet · friend of Vel Pari',
      en: 'One of the most prolific Sangam poets, master of the kurinji (mountain) landscape and author of Kurinjippattu. His friendship with Vel Pari is among the most memorable in Tamil literature; after Pari’s death, tradition says, he cared for Pari’s daughters.',
      taText: 'சங்கப் புலவர்களுள் மிகுதியாகப் பாடியவர்களில் ஒருவர்; குறிஞ்சித் திணையின் தலைசிறந்த புலவர்; குறிஞ்சிப்பாட்டின் ஆசிரியர். வேள் பாரியுடனான அவர் நட்பு தமிழ் இலக்கியத்தின் மறக்க முடியாத நட்புகளுள் ஒன்று; பாரியின் மறைவுக்குப் பின் அவர் மகளிரைக் காத்தார் என்பது மரபு.',
    },
    tholkappiyar: {
      title: 'Tholkappiyar',
      ta: 'தொல்காப்பியர்',
      detail: 'Author of the Tholkappiyam',
      en: 'Traditionally the author of the Tholkappiyam, the oldest surviving Tamil grammar, in three parts — Ezhuthu (letters), Sol (words) and Porul (subject matter), where the akam and puram divisions and the thinai landscapes of classical poetry are set out. Its date and authorship are still debated.',
      taText: 'இன்று கிடைக்கும் மிகப் பழைய தமிழ் இலக்கண நூலான தொல்காப்பியத்தின் ஆசிரியர் என மரபு கூறுகிறது. எழுத்து, சொல், பொருள் என மூன்று அதிகாரங்களைக் கொண்டது; செவ்வியல் கவிதையின் அகம், புறம், திணை அமைப்புகளைப் பொருளதிகாரம் வகுக்கிறது. அதன் காலமும் ஆசிரியர் பற்றிய செய்திகளும் இன்றும் ஆய்வுக்குரியவை.',
    },
    'ilango adigal 1': {
      title: 'Ilango Adigal',
      ta: 'இளங்கோவடிகள்',
      detail: 'Author of Silappathikaram',
      en: 'Traditional author of Silappathikaram, the Tale of the Anklet — the story of Kannagi and Kovalan, moving through Puhar, Madurai and Vanchi, and a searching examination of justice and kingship. Tradition makes him a Chera prince, brother of Senguttuvan, who renounced the throne; this cannot be independently verified.',
      taText: 'சிலப்பதிகாரத்தின் ஆசிரியர் என மரபு போற்றுபவர் — புகார், மதுரை, வஞ்சி எனப் பயணிக்கும் கண்ணகி, கோவலன் கதையின் வழியாக நீதியையும் அரசியலையும் ஆழமாக ஆராயும் காப்பியம். சேரன் செங்குட்டுவனின் இளவலாகிய அவர் அரசைத் துறந்து துறவு பூண்டார் என்பது மரபு; தனிச் சான்றுகளால் இதை உறுதிப்படுத்த இயலாது.',
    },
    'ilango adigal 2': { skip: true }, // a blank image
    'kaniyan poongundranar': {
      title: 'Kaniyan Pungundranar',
      ta: 'கணியன் பூங்குன்றனார்',
      detail: 'Sangam poet · Purananuru 192',
      en: 'Known above all for Purananuru 192, which opens “Yaadhum oore, yaavarum kelir” — every place is our town, everyone our kin. The poem goes on to counsel composure: good and ill do not come from others, and one should neither exult in success nor despair in failure.',
      taText: '“யாதும் ஊரே யாவரும் கேளிர்” எனத் தொடங்கும் புறநானூற்றின் 192ஆம் பாடலால் அறியப்படுபவர். “தீதும் நன்றும் பிறர்தர வாரா” எனத் தொடரும் அப்பாடல், வெற்றியில் மகிழ்ந்து மிகாமலும் தோல்வியில் துவளாமலும் வாழும் மனச்சமநிலையைக் கற்பிக்கிறது.',
    },
    nakkirar: {
      title: 'Nakkirar',
      ta: 'நக்கீரர்',
      detail: 'Poet and critic',
      en: 'A name linked with Nedunalvadai and Tirumurukarruppatai in the Ten Idylls — though it may belong to more than one poet across different periods. Later legend tells of his refusing to yield his judgment of a poem even to Shiva at the Pandya court: a symbol of intellectual courage, not a historical event.',
      taText: 'பத்துப்பாட்டில் உள்ள நெடுநல்வாடை, திருமுருகாற்றுப்படை ஆகியவற்றுடன் இணைந்த பெயர் — வெவ்வேறு காலங்களில் வாழ்ந்த ஒருவருக்கு மேற்பட்ட புலவர்களைக் குறிக்கலாம். பாண்டியன் அவையில் இறைவனே எதிர் நின்றபோதும் தம் இலக்கியத் தீர்ப்பை விட்டுக்கொடுக்கவில்லை என்னும் பிற்காலக் கதை, அறிவுத் துணிவின் சின்னம்; வரலாற்று நிகழ்வாகக் கொள்ளத்தக்கதன்று.',
    },
    thirunavukkarasar: {
      title: 'Thirunavukkarasar (Appar)',
      ta: 'திருநாவுக்கரசர் (அப்பர்)',
      detail: 'Shaiva poet-saint · 7th century CE',
      en: 'One of the three authors of the Tevaram, with Sambandar and Sundarar; his hymns fill the fourth to sixth books of the Tirumurai. Remembered for uzhavarappani — clearing the grounds of Shiva temples with his own hands — he joined devotion to practical service.',
      taText: 'சம்பந்தர், சுந்தரர் ஆகியோருடன் தேவாரம் பாடிய மூவருள் ஒருவர்; திருமுறையின் நான்கு முதல் ஆறு வரையிலான நூல்கள் அவர் பதிகங்கள். சிவாலயங்களின் வளாகங்களைத் தம் கையால் தூய்மை செய்த உழவாரப் பணிக்காக நினைவுகூரப்படுபவர் — பக்தியைத் தொண்டுடன் இணைத்தவர்.',
    },
  },
  [`${KINGS_FOLDER}/Vel pari`]: { 'Vel pari pic': PARI },
  [`${KINGS_FOLDER}/Karikala chozhan`]: {
    'karikala cholam pic': {
      title: 'Karikala Cholan',
      ta: 'கரிகால் சோழன்',
      detail: 'Early Chola king · early centuries CE (dates uncertain)',
      en: 'The celebrated early Chola king of Pattinappalai and Porunaratruppadai, victor of the Battle of Venni in literary accounts. Tradition credits him with Kallanai, the ancient diversion weir across the Kaveri that watered the delta; the structure has been repaired and altered over many centuries.',
      taText: 'பட்டினப்பாலையும் பொருநராற்றுப்படையும் போற்றும் புகழ்பெற்ற முற்காலச் சோழ மன்னர்; இலக்கியக் குறிப்புகளின்படி வெண்ணிப் போரில் வெற்றி பெற்றவர். காவிரியின் குறுக்கே நீரைத் திருப்பிக் கழிமுகப் பகுதியை வளப்படுத்திய கல்லணை அவருடையது என மரபு கூறுகிறது; அக்கட்டுமானம் பல நூற்றாண்டுகளாகப் பழுதுபார்க்கப்பட்டு மாற்றம் பெற்றுள்ளது.',
    },
  },
  [`${KINGS_FOLDER}/Kannagi`]: {
    'kannagi pic': {
      title: 'Kannagi',
      ta: 'கண்ணகி',
      detail: 'Heroine of Silappathikaram',
      en: 'The heroine of Silappathikaram, who proved her husband Kovalan’s innocence before the Pandya king by breaking open her anklet: hers held rubies, the queen’s pearls. A literary figure rather than a recorded historical person, she became a symbol of justice — and is worshipped as Pattini and Kannaki Amman in Tamil Nadu, Kerala and Sri Lanka.',
      taText: 'சிலப்பதிகாரத்தின் தலைவி. தன் சிலம்பை உடைத்து — அதில் மாணிக்கம், அரசியின் சிலம்பில் முத்து — பாண்டியன் அவையில் கணவன் கோவலனின் குற்றமின்மையை நிறுவினாள். வரலாற்றுப் பதிவுகளில் அன்றி இலக்கியத்தில் வாழும் அவள் நீதியின் சின்னமானாள்; தமிழ்நாடு, கேரளம், இலங்கையில் பத்தினித் தெய்வமாகவும் கண்ணகி அம்மனாகவும் வழிபடப்படுகிறாள்.',
    },
  },
  [`${KINGS_FOLDER}/Semiyan Mahadevi`]: {
    'sembiyan mahadevi pic': {
      title: 'Sembiyan Mahadevi',
      ta: 'செம்பியன் மாதேவி',
      detail: 'Chola queen · 10th century CE',
      en: 'Queen of Gandaraditya Chola and mother of Uttama Chola. Her inscriptions record the rebuilding of brick temples in stone — as at Tirunallam (Konerirajapuram), in memory of her husband — and gifts for lamps, gardens and worship. Her patronage is linked with the flowering of Chola bronzes.',
      taText: 'கண்டராதித்த சோழனின் அரசி, உத்தம சோழனின் தாய். செங்கல் கோயில்களைக் கற்றளிகளாக மாற்றியதையும் — கணவரின் நினைவாகத் திருநல்லத்தில் (கோனேரிராஜபுரம்) எடுப்பித்ததைப் போல — விளக்கு, நந்தவனம், வழிபாடு ஆகியவற்றுக்கான கொடைகளையும் அவர் கல்வெட்டுகள் பதிவு செய்கின்றன. சோழர் செப்புத் திருமேனிக் கலையின் மலர்ச்சியுடன் அவர் ஆதரவு தொடர்புடையது.',
    },
  },
  [`${KINGS_FOLDER}/Rajaraja cholan`]: {
    'Rajaraja Cholan pic': {
      title: 'Rajaraja Chola I',
      ta: 'முதலாம் இராஜராஜ சோழன்',
      detail: 'Chola emperor · c. 985–1014 CE',
      en: 'Born Arulmozhi Varman, son of Sundara Chola. His campaigns, recorded in inscriptions, reached the Pandya and Chera countries, northern Sri Lanka and the Maldives. He built the Brihadisvara Temple (Rajarajesvaram) at Thanjavur, consecrated around 1010 CE, whose inscriptions document his administration in remarkable detail.',
      taText: 'சுந்தர சோழனின் மகனாகப் பிறந்த அருள்மொழிவர்மன். கல்வெட்டுகள் பதிவு செய்யும் அவர் படையெடுப்புகள் பாண்டிய, சேர நாடுகள், வட இலங்கை, மாலத்தீவுகள் வரை சென்றன. கி.பி. 1010 அளவில் குடமுழுக்குக் கண்ட தஞ்சைப் பெருவுடையார் கோயிலை (இராஜராஜேச்சரம்) எடுப்பித்தார்; அதன் கல்வெட்டுகள் அவர் நிர்வாகத்தை வியக்கத்தக்க விரிவுடன் பதிவு செய்கின்றன.',
    },
  },
  [`${KINGS_FOLDER}/Rajendra cholan`]: {
    'Rajendra Cholan PIC': {
      title: 'Rajendra Chola I',
      ta: 'முதலாம் இராஜேந்திர சோழன்',
      detail: 'Chola emperor · c. 1014–1044 CE',
      en: 'Son of Rajaraja I. His northern expedition reached the Ganges, earning him the title Gangaikonda Chola; around 1025 CE his navy attacked ports of the Srivijaya kingdom in Southeast Asia. He founded a new capital, Gangaikondacholapuram, and its great Shiva temple.',
      taText: 'முதலாம் இராஜராஜனின் மகன். கங்கை வரை சென்ற வடநாட்டுப் படையெடுப்பால் ‘கங்கைகொண்ட சோழன்’ என்னும் பட்டம் பெற்றார்; கி.பி. 1025 அளவில் அவர் கடற்படை தென்கிழக்கு ஆசியாவின் ஸ்ரீவிஜய அரசின் துறைமுகங்களைத் தாக்கியது. கங்கைகொண்ட சோழபுரம் என்னும் புதிய தலைநகரையும் அங்குள்ள பெருங்கோயிலையும் அமைத்தார்.',
    },
  },
};

const panel = (id, en, ta, bodyEn, bodyTa) => ({ id, title: { en, ta }, body: { en: bodyEn, ta: bodyTa } });

export const FIGURE_PANELS = {
  'figures-patrons': [
    panel('kadai-ezhu-vallalgal', 'The Kadai Ezhu Vallalgal — Seven Great Patrons', 'கடையெழு வள்ளல்கள்',
      'Tamil tradition remembers seven chieftains of the Sangam age above all others for their giving: Pari, Pegan, Kari, Ay Andiran, Adhiyaman, Nalli and Ori. Lists and details differ between accounts, but together they embody kodai — generosity — as the mark of a worthy ruler. Their gifts were celebrated in verse by the poets they supported, and so the poems kept their names alive.',
      'சங்க காலச் சிற்றரசர்களுள் கொடையால் தலைசிறந்தவர்களாகத் தமிழ் மரபு எழுவரை நினைவுகூர்கிறது: பாரி, பேகன், காரி, ஆய் அண்டிரன், அதியமான், நள்ளி, ஓரி. பட்டியல்களும் விவரங்களும் மரபுக்கு மரபு வேறுபட்டாலும், சிறந்த தலைவனின் அடையாளமாகக் கொடையை இவர்கள் உருவகப்படுத்துகின்றனர். அவர்கள் ஆதரித்த புலவர்கள் அவர்தம் கொடைகளைப் பாடினர்; அப்பாடல்களே அவர்கள் பெயரை நிலைநிறுத்தின.'),
    panel('kodai-madam', 'Kodai Madam — Giving Without Measure', 'கொடைமடம்',
      'A chariot for a creeper, a shawl for a peacock, a life-giving fruit for a poet: the patrons’ most famous gifts look impractical, and that is their point. Kodai madam is generosity so abundant that the giver does not calculate the gift’s use — compassion extended to animals, plants and learning alike.',
      'முல்லைக்குத் தேர், மயிலுக்குப் போர்வை, புலவருக்கு நீண்ட வாழ்வு தரும் கனி — வள்ளல்களின் புகழ்பெற்ற கொடைகள் நடைமுறைக்கு ஒவ்வாதவை போலத் தோன்றும்; அதுவே அவற்றின் சிறப்பு. கொடுப்பதன் பயனைக் கணக்கிடாத அளவற்ற ஈகையே கொடைமடம் — விலங்கு, தாவரம், அறிவு அனைத்துக்கும் நீளும் அருள் அது.'),
  ],
  'figures-poets': [
    panel('poets-thinkers', 'Voices of Tamil Thought', 'தமிழ்ச் சிந்தனையின் குரல்கள்',
      'From the grammarian of the Tholkappiyam to the devotional poet-saint Appar, these poets shaped how Tamil is written, how its poetry is read and what it teaches. For most of them little is securely known beyond their works: names may have been shared by several poets, and later legends gathered round them. The panels and notes separate what the texts show from what tradition tells.',
      'தொல்காப்பிய இலக்கணத்தார் முதல் பக்திப் புலவர் அப்பர் வரை — தமிழ் எவ்வாறு எழுதப்படுகிறது, அதன் கவிதை எவ்வாறு படிக்கப்படுகிறது, அது எதைக் கற்பிக்கிறது என்பதை வடிவமைத்தவர்கள் இப்புலவர்கள். இவர்களுள் பெரும்பாலோர் பற்றி அவர்தம் படைப்புகளைத் தாண்டி உறுதியாக அறியப்படுவது குறைவு: ஒரே பெயரைப் பலர் கொண்டிருக்கலாம்; பிற்காலக் கதைகள் அவர்களைச் சுற்றி வளர்ந்தன. நூல்கள் காட்டுவதையும் மரபு கூறுவதையும் இக்குறிப்புகள் பிரித்துக் காட்டுகின்றன.'),
  ],
  'figures-kings': [
    panel('rulers', 'Rulers, Queens and a Heroine', 'மன்னர்களும் அரசியரும் காப்பியத் தலைவியும்',
      'Two kinds of evidence meet in this room. For Vel Pari and Karikala Cholan, and for Kannagi, the heroine of Silappathikaram, we depend on Sangam poetry and epic, rich in memory but not contemporary records. For the medieval Cholas — Sembiyan Mahadevi, Rajaraja I and Rajendra I — inscriptions on temple walls and copper plates record campaigns, gifts and administration in detail.',
      'இந்த அறையில் இருவகைச் சான்றுகள் சந்திக்கின்றன. வேள் பாரி, கரிகால் சோழன், சிலப்பதிகாரத் தலைவி கண்ணகி ஆகியோருக்குச் சங்கப் பாடல்களும் காப்பியமுமே ஆதாரம் — நினைவுகள் நிறைந்தவை, ஆனால் சமகாலப் பதிவுகள் அல்ல. இடைக்காலச் சோழர்களான செம்பியன் மாதேவி, முதலாம் இராஜராஜன், முதலாம் இராஜேந்திரன் ஆகியோரின் படையெடுப்புகள், கொடைகள், நிர்வாகம் ஆகியவற்றைக் கோயில் கல்வெட்டுகளும் செப்பேடுகளும் விரிவாகப் பதிவு செய்கின்றன.'),
  ],
};
