import { artifactsIn, siteFoldersIn } from './artifacts.js';
import { photobook } from './albums.js';

/**
 * The Ancient Ports room of the Trade & Ports hall: the ports and trading centres of ancient
 * Tamilakam, each a photobook on the room's shelf (see PhotoBook.jsx).
 *
 * Photographs come from one folder per site in public/Ancient tamil ports (matched by
 * `folder`, so a renamed folder still finds its site). Every photograph carries its site's
 * texts, so the palm leaf beside the book follows the page being shown.
 *
 * The texts condense the curators' research guide (public/Maritime trade n ports/Maritime
 * trade n ports.pdf), keeping its cautions: uncertain dates and identifications are given
 * as such.
 */
const PORTS_FOLDER = 'Ancient tamil ports';

export const PORT_SITES = {
  puhar: {
    name: 'Puhar (Kaveripoompattinam)',
    tamil: 'பூம்புகார் — காவிரிப்பூம்பட்டினம்',
    place: 'Kaveri estuary · Chola port city',
    folder: /puhar|poompuhar|kaveripoompattinam/i, // the folder is named "uhar — …"
    en: 'Near the mouth of the Kaveri, Puhar is remembered as the great port city of the early Cholas, linking the rice fields, waterways and markets of the Kaveri delta to the Bay of Bengal. The Pattinappalai describes its busy harbour, merchants and markets; the Silappatikaram and Manimekalai also keep its traditions. Underwater surveys by the Tamil Nadu Department of Archaeology have found masonry off the Poompuhar coast, but the extent of the ancient city and the dates of its structures still need careful study — the story of its loss to the sea is not, by itself, proof of one dated disaster.',
    ta: 'காவிரி கடலில் கலக்கும் இடத்தருகே அமைந்த பூம்புகார், தொடக்ககாலச் சோழர்களின் பெருந்துறைமுக நகரமாக நினைவுகூரப்படுகிறது; காவிரிப் படுகையின் வயல்கள், நீர்வழிகள், சந்தைகளை வங்கக் கடலுடன் இணைத்தது. அதன் பரபரப்பான துறைமுகத்தையும் வணிகர்களையும் அங்காடிகளையும் பட்டினப்பாலை விவரிக்கிறது; சிலப்பதிகாரமும் மணிமேகலையும் அதன் மரபுகளைப் பேணுகின்றன. பூம்புகார்க் கடற்கரைக்கு அப்பால் கடலடியில் தமிழ்நாடு தொல்லியல் துறை கட்டுமான எச்சங்களைக் கண்டுள்ளது; ஆயினும் பழைய நகரின் பரப்பும் அதன் கட்டமைப்புகளின் காலமும் கவனமான ஆய்வுக்குரியவை — நகரைக் கடல் கொண்டது என்ற கதை மட்டுமே, ஒரு குறிப்பிட்ட காலத்தில் நிகழ்ந்த பேரழிவுக்குச் சான்றாகாது.',
  },
  arikamedu: {
    name: 'Arikamedu',
    tamil: 'அரிக்கமேடு',
    place: 'Ariyankuppam, Puducherry · Coastal trade settlement',
    folder: /arikamedu/i,
    en: 'Near Ariyankuppam, south of Puducherry, Arikamedu is one of the best-known sites for early trade across the Indian Ocean. Excavations found fragments of Mediterranean amphorae, Arretine-type fine ware, rouletted ware, beads and glass alongside local pottery — a local settlement with long-distance links, not a Roman colony. Vimala Begley’s 1983 reassessment placed its beginnings around the mid-third century BCE, earlier than Mortimer Wheeler’s chronology, with Mediterranean contacts by the late second century BCE; these remain scholarly interpretations.',
    ta: 'புதுச்சேரிக்குத் தெற்கே அரியாங்குப்பம் அருகே உள்ள அரிக்கமேடு, இந்தியப் பெருங்கடல் கடந்த தொடக்ககால வணிகத்தை அறிய உதவும் மிகப் புகழ்பெற்ற களங்களுள் ஒன்று. மத்தியதரைக் கடல் பகுதியின் சாடி (ஆம்போரா) ஓடுகள், அரிட்டைன் வகை நுண்கலங்கள், உருளை வரி மட்கலங்கள், மணிகள், கண்ணாடிப் பொருட்கள் ஆகியவை உள்ளூர் மட்கலங்களுடன் இங்கு கிடைத்துள்ளன — இது தொலைதூரத் தொடர்புகள் கொண்ட உள்ளூர்க் குடியிருப்பே; உரோமானியக் குடியேற்றம் அன்று. விமலா பெக்லியின் 1983 மறுமதிப்பீடு, இதன் தொடக்கத்தை வீலரின் காலக்கணிப்பைவிட முன்னதாக, ஏறத்தாழ கி.மு. 3-ஆம் நூற்றாண்டின் நடுப்பகுதிக்குக் கொண்டு செல்கிறது; இவை ஆய்வாளர்களின் விளக்கங்களே.',
  },
  korkai: {
    name: 'Korkai',
    tamil: 'கொற்கை',
    place: 'Thoothukudi district · Pandya port',
    folder: /korkai/i,
    en: 'Near the Tamiraparani in Thoothukudi district, Korkai was the Pandya port of the Gulf of Mannar pearl fisheries — an economy of diving, opening and sorting oysters, grading pearls and trading them. The Tamil Nadu Department of Archaeology reports that the sea has since receded from the site; excavations recovered pottery inscribed in Tamil-Brahmi and structural remains. A charcoal sample has been dated to 785 BCE — the date of that sample, not necessarily the founding of the port.',
    ta: 'தூத்துக்குடி மாவட்டத்தில் தாமிரபரணி அருகே உள்ள கொற்கை, மன்னார் வளைகுடாவின் முத்துக்குளிப்புடன் இணைந்த பாண்டியர் துறைமுகம் — முத்துக் குளித்தல், சிப்பிகளைத் திறந்து பிரித்தல், முத்துகளைத் தரம் பிரித்து வணிகம் செய்தல் எல்லாம் சேர்ந்த பொருளாதாரம். கடல் இப்போது இவ்விடத்திலிருந்து விலகிச் சென்றுவிட்டதாகத் தமிழ்நாடு தொல்லியல் துறை கூறுகிறது; அகழாய்வில் தமிழ்-பிராமி எழுத்துப் பொறித்த மட்கல ஓடுகளும் கட்டட எச்சங்களும் கிடைத்தன. ஒரு கரி மாதிரி கி.மு. 785 எனக் காலக்கணிப்புப் பெற்றுள்ளது — அது அம்மாதிரியின் காலமே; துறைமுகம் தோன்றிய காலம் என்று கொள்ள முடியாது.',
  },
  alagankulam: {
    name: 'Alagankulam',
    tamil: 'அழகன்குளம்',
    place: 'Ramanathapuram district · Coastal site near the Vaigai',
    folder: /alagankulam/i,
    en: 'In Ramanathapuram district, near the Vaigai and about three kilometres from today’s shore, Alagankulam is a key site for early trade on the south-eastern coast. The Tamil Nadu Department of Archaeology reports rouletted ware, amphora pieces, red ware inscribed in Tamil-Brahmi, beads, bricks, and Roman coins attributed to Valentinian II of the late fourth century CE — a later phase than the earliest occupation. Scientific study of its pottery shows that a Mediterranean look alone does not prove a vessel was imported: some may be local products or imitations.',
    ta: 'இராமநாதபுரம் மாவட்டத்தில் வைகை அருகே, இன்றைய கடற்கரையிலிருந்து ஏறத்தாழ மூன்று கிலோமீட்டர் தொலைவில் உள்ள அழகன்குளம், தென்கிழக்குக் கடற்கரையின் தொடக்ககால வணிகத்தை அறிய முதன்மையான களம். உருளை வரி மட்கலங்கள், சாடி ஓடுகள், தமிழ்-பிராமி பொறித்த சிவப்பு மட்கலங்கள், மணிகள், செங்கற்கள், கி.பி. 4-ஆம் நூற்றாண்டின் பிற்பகுதியில் ஆண்ட இரண்டாம் வாலன்டினியனுக்குரிய உரோமானியக் காசுகள் ஆகியவை கிடைத்ததாகத் தமிழ்நாடு தொல்லியல் துறை தெரிவிக்கிறது. மத்தியதரைக் கடல் பாணியில் தோன்றும் கலம் எல்லாம் இறக்குமதி அல்ல — சில உள்ளூர்த் தயாரிப்புகளாகவோ போலிகளாகவோ இருக்கலாம் என அறிவியல் ஆய்வு காட்டுகிறது.',
  },
  muziris: {
    name: 'Musiri (Muziris)',
    tamil: 'முசிறி',
    place: 'Malabar coast · Western port',
    folder: /musiri|muziris/i,
    en: 'On the Malabar coast of present-day Kerala, Muziris was a great port of early Indian Ocean commerce, famed for pepper but trading far more: forest and farm produce from the hinterland, imported jars and fine pottery, and goods passed on by merchants across many regions. The Periplus of the Erythraean Sea places it in a network of ports linked to the Red Sea, Egypt and the Mediterranean. Its exact site is debated: excavations at Pattanam have revealed imported pottery and transport jars, and Pattanam may be part of ancient Muziris — a scholarly hypothesis, not a settled fact.',
    ta: 'இன்றைய கேரளத்தின் மலபார் கடற்கரையில் இருந்த முசிறி, தொடக்ககால இந்தியப் பெருங்கடல் வணிகத்தின் பெருந்துறைமுகம்; மிளகுக்குப் புகழ்பெற்றது, ஆனால் மிளகு மட்டுமன்றி உள்நாட்டு வனப் பொருட்கள், வேளாண் விளைபொருட்கள், இறக்குமதிச் சாடிகள், நுண்கலங்கள் எனப் பலவும் இங்கு வணிகமாயின. எரித்திரியக் கடலின் பெரிப்ளூஸ் இதனைச் செங்கடல், எகிப்து, மத்தியதரைக் கடல் சந்தைகளுடன் இணைந்த துறைமுக வலையில் வைக்கிறது. இதன் சரியான இடம் விவாதத்துக்குரியது: பட்டணத்தில் நடந்த அகழாய்வுகளில் இறக்குமதி மட்கலங்களும் சாடிகளும் கிடைத்துள்ளன; பட்டணம் பழைய முசிறியின் ஒரு பகுதியாக இருக்கலாம் என்பது ஓர் ஆய்வுக் கருதுகோளே.',
  },
  tondi: {
    name: 'Tondi (Tyndis)',
    tamil: 'தொண்டி',
    place: 'Western coast · Location uncertain',
    folder: /tondi|tyndis/i,
    en: 'The Periplus of the Erythraean Sea names Tyndis among the ports of the western coast, in the realm of the Chera king, and Tamil literature remembers a port called Tondi. Where it stood is uncertain: Tanur, Ponnani and Kadalundi have all been proposed, and the modern town of Thondi on Tamil Nadu’s south-east coast cannot simply be identified with every ancient reference. Tyndis is best understood by its place among the Malabar ports and the inland routes behind them.',
    ta: 'எரித்திரியக் கடலின் பெரிப்ளூஸ், சேர மன்னரின் ஆட்சிப் பகுதியில், மேற்குக் கடற்கரைத் துறைமுகங்களுள் ஒன்றாகத் திண்டிஸைக் (Tyndis) குறிப்பிடுகிறது; தமிழ் இலக்கியமும் தொண்டி என்ற துறைமுகத்தை நினைவுகூர்கிறது. அது எங்கிருந்தது என்பது உறுதியில்லை: தானூர், பொன்னானி, கடலுண்டி ஆகிய இடங்கள் முன்மொழியப்பட்டுள்ளன; தமிழ்நாட்டின் தென்கிழக்குக் கடற்கரையில் உள்ள இன்றைய தொண்டியை எல்லாப் பழங்குறிப்புகளுடனும் ஒன்றெனக் கொள்ள இயலாது. மலபார்த் துறைமுகங்களிடையே அதன் இடத்தையும் அவற்றின் பின்னால் இருந்த உள்நாட்டு வழிகளையும் கொண்டே திண்டிஸை நன்கு புரிந்துகொள்ள முடியும்.',
  },
  uraiyur: {
    name: 'Uraiyur',
    tamil: 'உறையூர்',
    place: 'Tiruchirappalli · Inland Chola capital',
    folder: /uraiyur/i,
    en: 'Uraiyur, in present-day Tiruchirappalli, was an inland capital of the early Cholas — not a seaport. Sangam-age accounts associate it with fine textiles; cloth seldom survives in the ground, so literature and regional history carry much of its story. Uraiyur shows how inland production and royal administration fed the markets of the coast, though the volume and destinations of its trade cannot be measured precisely.',
    ta: 'இன்றைய திருச்சிராப்பள்ளியில் உள்ள உறையூர், தொடக்ககாலச் சோழர்களின் உள்நாட்டுத் தலைநகர் — துறைமுகம் அன்று. சங்ககாலக் குறிப்புகள் இதனை நுண்ணிய நெசவுடன் இணைக்கின்றன; துணி மண்ணில் நிலைப்பது அரிது என்பதால், இலக்கியமும் வட்டார வரலாறுமே இதன் கதையைப் பெரிதும் சொல்கின்றன. உள்நாட்டு உற்பத்தியும் அரசாட்சியும் கடற்கரைச் சந்தைகளுக்கு எவ்வாறு துணைநின்றன என்பதை உறையூர் காட்டுகிறது; ஆயினும் அதன் வணிகத்தின் அளவையும் சென்ற இடங்களையும் துல்லியமாக அளக்க இயலாது.',
  },
  karur: {
    name: 'Karur',
    tamil: 'கரூர்',
    place: 'Amaravathi river · Inland Chera centre',
    folder: /karur/i,
    en: 'On the Amaravathi river, Karur — remembered as Vanchi and Karuvur — was an inland centre linked with the Chera kings. The Tamil Nadu Department of Archaeology reports pottery inscribed in Tamil-Brahmi, Roman amphora fragments, rouletted ware, Roman and other coins, precious stones, beads and brick structures. Karur lay on routes that may have linked the western and eastern coasts, towards Muziris and Arikamedu; its Roman coins show monetary connections, but not necessarily direct trade with Rome.',
    ta: 'அமராவதி ஆற்றங்கரையில் உள்ள கரூர் — வஞ்சி, கருவூர் எனவும் நினைவுகூரப்படுவது — சேர மன்னர்களுடன் தொடர்புடைய உள்நாட்டு மையம். தமிழ்-பிராமி பொறித்த மட்கல ஓடுகள், உரோமானியச் சாடி ஓடுகள், உருளை வரி மட்கலங்கள், உரோமானிய மற்றும் பிற காசுகள், மணிக்கற்கள், மணிகள், செங்கல் கட்டமைப்புகள் இங்கு கிடைத்ததாகத் தமிழ்நாடு தொல்லியல் துறை தெரிவிக்கிறது. முசிறியையும் அரிக்கமேட்டையும் நோக்கி மேற்கு, கிழக்குக் கடற்கரைகளை இணைத்திருக்கக்கூடிய வழிகளில் கரூர் அமைந்திருந்தது; இங்குக் கிடைத்த உரோமானியக் காசுகள் பணத் தொடர்புகளைக் காட்டுகின்றன, ஆனால் உரோமுடன் நேரடி வணிகத்தை உறுதிசெய்வதில்லை.',
  },
  kodumanal: {
    name: 'Kodumanal',
    tamil: 'கொடுமணல்',
    place: 'Erode district · Inland craft centre',
    folder: /kodumanal/i,
    en: 'In Perundurai taluk, Erode district, Kodumanal shows the production side of trade. Its megalithic and early historic layers have yielded black-and-red ware, quartz and clay beads, pottery inscribed or marked with graffiti, iron weapons and burial structures — one urn held hundreds of carnelian beads. Craft workers here turned raw materials into finished goods that could travel through local markets and wider networks, though not everything found here was made for export.',
    ta: 'ஈரோடு மாவட்டம் பெருந்துறை வட்டத்தில் உள்ள கொடுமணல், வணிகத்தின் உற்பத்திப் பக்கத்தைக் காட்டுகிறது. இதன் பெருங்கற்கால, தொடக்க வரலாற்றுக் கால அடுக்குகளில் கருப்பு-சிவப்பு மட்கலங்கள், படிக, சுடுமண் மணிகள், எழுத்தும் குறியீடுகளும் பொறித்த ஓடுகள், இரும்பு ஆயுதங்கள், ஈமச் சின்னங்கள் கிடைத்துள்ளன — ஒரு தாழியில் நூற்றுக்கணக்கான சூதுபவள மணிகள் இருந்தன. இங்குக் கைவினைஞர்கள் மூலப்பொருட்களைப் பொருட்களாக்கி, உள்ளூர்ச் சந்தைகள் வழியாகவும் பரந்த வலைகள் வழியாகவும் அனுப்பினர்; ஆயினும் இங்குக் கிடைத்தவை எல்லாம் ஏற்றுமதிக்கே செய்யப்பட்டவை அல்ல.',
  },
};

/** One site's photobook: the photographs in its folder, each carrying the site's texts. */
const siteAlbum = (siteId) => photobook(siteId, PORT_SITES[siteId], siteFoldersIn(PORTS_FOLDER).filter((folder) => PORT_SITES[siteId].folder.test(folder)).flatMap(artifactsIn));

/** Every site's photobook, east coast to west and then inland, as the Ancient Ports room shelves them. */
export const portAlbums = () => Object.keys(PORT_SITES).map(siteAlbum).filter((album) => album.artifacts.length);
